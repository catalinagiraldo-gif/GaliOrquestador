import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { DropiHeaderIa2Component } from './components/dropi-header-ia2.component';
import { DropiIconRailComponent } from './components/dropi-icon-rail.component';
import { DropiMenuActionComponent } from './components/dropi-menu-action.component';
import { DropiSectionNavComponent } from './components/dropi-section-nav.component';
import { GaliRightPanelComponent } from './components/gali-right-panel/gali-right-panel.component';
import { DropiPanelSplitterComponent } from './components/dropi-panel-splitter/dropi-panel-splitter.component';
import { GaliContextStripComponent, ContextKey } from './components/gali-context-strip/gali-context-strip.component';
import { GaliIntentBarComponent } from './components/gali-intent-bar/gali-intent-bar.component';
import { GaliWorkspaceModeBarComponent } from './components/gali-workspace-mode-bar/gali-workspace-mode-bar.component';
import {
  GALI_MISSION_PANEL,
  resolveActiveRailKey,
  resolveSectionPanel,
  SectionPanel,
} from './dropi-sections.config';
import { DropiPrototypeFeedbackService } from './services/dropi-prototype-feedback.service';
import { GaliStateService } from './services/gali-state.service';
import { GaliWorkspaceService } from './services/gali-workspace.service';

@Component({
  selector: 'app-gali-v5-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DropiHeaderIa2Component,
    DropiIconRailComponent,
    DropiMenuActionComponent,
    DropiSectionNavComponent,
    GaliRightPanelComponent,
    DropiPanelSplitterComponent,
    GaliContextStripComponent,
    GaliIntentBarComponent,
    GaliWorkspaceModeBarComponent,
  ],
  templateUrl: './gali-v5-shell.component.html',
  styleUrl: './gali-v5-shell.component.scss',
})
export class GaliV5ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  readonly feedback = inject(DropiPrototypeFeedbackService);
  readonly galiState = inject(GaliStateService);
  readonly ws = inject(GaliWorkspaceService);

  private readonly agentColors: Record<string, string> = {
    'Roax': '#f97316', 'roax': '#f97316',
    'Vigilante': '#fbbf24', 'vigilante': '#fbbf24',
    'Chatea Pro': '#34d399', 'chatea': '#34d399',
    'ADA Spy': '#818cf8', 'ada': '#818cf8',
    'Gali': '#ff6102',
  };

  agentColor(name: string): string {
    return this.agentColors[name] ?? '#9898a8';
  }

  sectionPanel = signal<SectionPanel>(GALI_MISSION_PANEL);
  sectionNavCollapsed = signal(localStorage.getItem('dropi-section-collapsed') === 'true');
  hasSectionPanel = signal(true);
  isCompactNav = signal(false);
  sectionWidth = signal(parseInt(localStorage.getItem('dropi-section-width') ?? '200', 10));
  currentContextKey = signal<ContextKey>(null);
  readonly isHubHome = signal(false);
  /** Rutas con barra Gali a nivel página — suprimen context-strip e intent-bar del shell */
  /** Rutas con chrome agente a nivel página — suprimen context-strip e intent-bar */
  private readonly pageLevelAgentChromePrefixes = [
    '/gali-v5/mis-pedidos/mis-pedidos',
    '/gali-v5/mis-pedidos/garantias',
    '/gali-v5/marketing/campanas',
    '/gali-v5/marketing/chatea-pro',
    '/gali-v5/productos/caza-productos',
    '/gali-v5/productos/catalogo',
    '/gali-v5/productos/proveedores',
    '/gali-v5/cas/bandeja',
    '/gali-v5/proyectos',
    '/gali-v5/proyecto/',
    '/gali-v5/reportes/dashboard',
    '/gali-v5/reportes/dashboard-financiero',
    '/gali-v5/financiero/historial-de-cartera',
    '/gali-v5/logistica/transportadoras',
    '/gali-v5/logistica/torre-logistica',
  ];
  readonly hasPageLevelGaliBar = signal(false);
  readonly showContextStrip = signal(false);
  readonly showIntentBar = signal(true);

  constructor() {
    this.syncNav(this.router.url);
    this.updateViewport();
    this.galiState.setPanelWidth(this.galiState.panelWidth());

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncNav(e.urlAfterRedirects));
  }

  /** Feedback en botones sin handler — evita sensación de "salir" del prototipo */
  @HostListener('click', ['$event'])
  onPrototypeClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('a[routerLink], a[href]')) return;

    const btn = target.closest('button');
    if (!btn || btn.hasAttribute('data-proto-skip') || btn.disabled) return;

    const skipHost = btn.closest(
      'dropi-icon-rail, dropi-section-nav, dropi-header-ia2, dropi-menu-action, gali-right-panel',
    );
    if (skipHost) return;

    const label =
      btn.getAttribute('aria-label')
      || btn.getAttribute('title')
      || btn.textContent?.replace(/\s+/g, ' ').trim().slice(0, 48)
      || 'Acción';

    this.feedback.action(label);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  toggleSectionNav(): void {
    const next = !this.sectionNavCollapsed();
    this.sectionNavCollapsed.set(next);
    localStorage.setItem('dropi-section-collapsed', String(next));
  }

  collapseSectionNav(): void {
    this.sectionNavCollapsed.set(true);
    localStorage.setItem('dropi-section-collapsed', 'true');
  }

  /** True when the active route is the Gali OS workspace (home, no section panel) */
  readonly isOsWorkspace = signal(false);

  private syncNav(url: string): void {
    const panel = resolveSectionPanel(url);
    if (panel) {
      this.sectionPanel.set(panel);
      this.hasSectionPanel.set(true);
      // Preserve user-set collapsed state — only restore from localStorage
      this.isOsWorkspace.set(false);
    } else {
      this.hasSectionPanel.set(false);
      this.isOsWorkspace.set(false);
    }
    this.currentContextKey.set(this.resolveContextKey(url));
    const hub = url === '/gali-v5' || url === '/gali-v5/';
    this.isHubHome.set(hub);
    const pageBar = this.pageLevelAgentChromePrefixes.some(
      p => p.endsWith('/')
        ? url.startsWith(p)
        : url === p || (p === '/gali-v5/proyectos' && url === '/gali-v5/proyectos'),
    );
    this.hasPageLevelGaliBar.set(pageBar);
    this.showContextStrip.set(!hub && !pageBar);
    this.showIntentBar.set(
      this.galiState.galiMode() === 0 && !hub && !pageBar && !this.ws.primaryAlertActive(),
    );
  }

  readonly hubObjetivoLabel = computed(() => this.ws.businessDNA().goalLabel ?? '50 ventas/semana');
  readonly hubObjetivoActual = computed(() => {
    const dna = this.ws.businessDNA();
    return dna.pedidosTarget > 0 ? Math.min(dna.pedidosTarget - 12, dna.pedidosTarget) : 38;
  });
  readonly hubObjetivoMeta = computed(() => {
    const t = this.ws.businessDNA().pedidosTarget;
    return t > 0 ? t : 50;
  });

  private resolveContextKey(url: string): ContextKey {
    const railKey = resolveActiveRailKey(url);
    const map: Record<string, ContextKey> = {
      pedidos: 'pedidos',
      marketing: 'marketing',
      productos: 'productos',
      financiero: 'financiero',
      logistica: 'logistica',
      reportes: 'reportes',
      proyectos: 'proyectos',
      home: 'home',
      agentes: 'home',
      skills: 'home',
      reglas: 'home',
      marketplace: 'home',
      conexiones: 'home',
    };
    return map[railKey] ?? null;
  }

  private updateViewport(): void {
    this.isCompactNav.set(window.innerWidth < 1024);
  }

  panelMaxWidth(): number {
    return Math.floor(window.innerWidth * 0.78);
  }

  onGaliPanelWidthChange(w: number): void {
    this.galiState.setPanelWidth(w);
  }

  onSplitterWidthChange(w: number): void {
    this.sectionWidth.set(w);
    document.documentElement.style.setProperty('--dropi-section-col', `${w}px`);
    localStorage.setItem('dropi-section-width', String(w));
  }

  onSplitterDragStart(): void {
    // disable transition during drag for performance
    document.documentElement.style.setProperty('--section-transition', 'none');
  }

  onSplitterDragEnd(): void {
    document.documentElement.style.removeProperty('--section-transition');
  }
}

import { AfterViewInit, Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Gali6IconRailComponent } from './gali-6-icon-rail.component';
import { Gali6FabComponent } from './components/gali6-fab.component';
import { DropiSectionNavComponent } from '../gali-5/gali-v5/components/dropi-section-nav.component';
import { GaliRightPanelComponent } from '../gali-5/gali-v5/components/gali-right-panel/gali-right-panel.component';
import { GaliStateService } from '../gali-5/gali-v5/services/gali-state.service';
import { SectionPanel } from '../gali-5/gali-v5/dropi-sections.config';
import { resolveG6SectionPanel, GALI_6_MISSION_PANEL } from './gali-6-sections.config';
import KPIS from '../../../../mocks/gali-v5/kpis-global.json';

type Friccion = 'stock' | 'ads' | 'pedidos' | 'otro';
type Canal = 'meta' | 'tiktok' | 'ambos' | 'ninguno';

/**
 * Gali 6 — "La Casita definitiva".
 * Chrome idéntico a V5 v2: icon-rail 72px + section-nav agrupado + chat lateral.
 * Rutas propias /gali-6.
 */
@Component({
  selector: 'app-gali6-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    Gali6IconRailComponent,
    Gali6FabComponent,
    DropiSectionNavComponent,
    GaliRightPanelComponent,
  ],
  templateUrl: './gali-6-shell.component.html',
  styleUrl: './gali-6-shell.component.scss',
})
export class Gali6ShellComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  readonly gali = inject(GaliStateService);

  readonly navOpen = signal(false);
  readonly walletHidden = signal(false);

  readonly sectionPanel = signal<SectionPanel>(GALI_6_MISSION_PANEL);
  readonly hasSectionPanel = signal(true);
  readonly sectionCollapsed = signal(localStorage.getItem('gali-6-section-collapsed') === 'true');

  readonly modo = signal<'basico' | 'experto'>(
    (localStorage.getItem('gali-6-modo') as 'basico' | 'experto') ?? 'basico',
  );

  readonly filteredPanel = computed<SectionPanel>(() => {
    const panel = this.sectionPanel();
    if (this.modo() === 'basico') {
      return { ...panel, items: panel.items.filter(i => i.id !== 'centro-gali') };
    }
    return panel;
  });

  readonly objetivoMeta = signal<number>(Number(localStorage.getItem('gali-6-objetivo-meta') ?? 100));
  readonly objetivoActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;
  readonly objetivoPct = computed(() =>
    Math.min(100, Math.round((this.objetivoActual / this.objetivoMeta()) * 100)),
  );
  readonly walletLabel = '$2.717.360';

  // ── ZeroState (onboarding de 3 preguntas) ──
  private readonly hasOrders = ((KPIS as any).pedidos_sem_total?.valor ?? 0) > 0;
  readonly zeroOpen = signal(
    !localStorage.getItem('gali-6-onboarding-done') &&
    !localStorage.getItem('gali-6-objetivo-meta') &&
    !localStorage.getItem('gali-6-objetivo-v2'),
  );
  readonly zeroStep = signal(0);
  readonly zeroPedidos = signal(100);
  readonly zeroFriccion = signal<Friccion | null>(null);
  readonly zeroCanal = signal<Canal | null>(null);
  readonly zeroRespuesta = signal('');

  readonly fricciones: Array<{ id: Friccion; label: string }> = [
    { id: 'stock', label: 'Stock / proveedor' },
    { id: 'ads', label: 'Pauta y creativos' },
    { id: 'pedidos', label: 'Gestión de pedidos' },
    { id: 'otro', label: 'Otro' },
  ];
  readonly canales: Array<{ id: Canal; label: string }> = [
    { id: 'meta', label: 'Meta Ads' },
    { id: 'tiktok', label: 'TikTok Ads' },
    { id: 'ambos', label: 'Ambos' },
    { id: 'ninguno', label: 'Ninguno aún' },
  ];

  constructor() {
    this.syncNav(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncNav(e.urlAfterRedirects));
    // Si ya tiene pedidos en Dropi, saltar P1 directamente al paso 1
    if (this.zeroOpen() && this.hasOrders) {
      this.zeroPedidos.set(this.hasOrders ? this.objetivoActual + 30 : 100);
      this.zeroStep.set(1);
    }
  }

  private syncNav(url: string): void {
    const panel = resolveG6SectionPanel(url);
    if (panel) {
      this.sectionPanel.set(panel);
      this.hasSectionPanel.set(true);
    } else {
      this.hasSectionPanel.set(false);
    }
    this.navOpen.set(false);
  }

  toggleSection(): void {
    const next = !this.sectionCollapsed();
    this.sectionCollapsed.set(next);
    localStorage.setItem('gali-6-section-collapsed', String(next));
  }

  readonly expertoOnboarding = signal(false);

  toggleModo(): void {
    const next = this.modo() === 'basico' ? 'experto' : 'basico';
    this.modo.set(next);
    localStorage.setItem('gali-6-modo', next);
    if (next === 'experto' && !localStorage.getItem('gali-6-experto-visto')) {
      this.expertoOnboarding.set(true);
    }
  }

  cerrarExpertoOnboarding(): void {
    localStorage.setItem('gali-6-experto-visto', 'true');
    this.expertoOnboarding.set(false);
  }

  toggleNav(): void {
    this.navOpen.update(v => !v);
  }

  panelMaxWidth(): number {
    return Math.floor(window.innerWidth * 0.78);
  }

  // ── ZeroState handlers ──
  zeroNext(): void {
    if (this.zeroStep() < 2) {
      this.zeroStep.update(s => s + 1);
    } else {
      this.zeroComplete();
    }
  }

  zeroComplete(): void {
    localStorage.setItem('gali-6-objetivo-meta', String(this.zeroPedidos()));
    localStorage.setItem('gali-6-onboarding-done', 'true');
    localStorage.setItem('gali-6-modo', 'basico');
    this.objetivoMeta.set(this.zeroPedidos());
    this.modo.set('basico');
    this.zeroRespuesta.set(this.buildZeroRespuesta());
    this.zeroStep.set(3); // paso de confirmación
  }

  zeroClose(): void {
    localStorage.setItem('gali-6-onboarding-done', 'true');
    this.zeroOpen.set(false);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      this.reopenOnboarding();
    }
  }

  reopenOnboarding(): void {
    localStorage.removeItem('gali-6-onboarding-done');
    localStorage.removeItem('gali-6-objetivo-meta');
    localStorage.removeItem('gali-6-objetivo-v2');
    this.zeroPedidos.set(100);
    this.zeroFriccion.set(null);
    this.zeroCanal.set(null);
    this.zeroStep.set(0);
    this.zeroOpen.set(true);
  }

  private _clickInterceptor?: () => void;
  private _navSub?: Subscription;

  ngAfterViewInit(): void {
    // Interceptar TODOS los clicks en <a> que apuntan a /gali-v5/...
    const clickHandler = (e: MouseEvent): void => {
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? anchor.href ?? '';
      if (href.includes('/gali-v5')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newPath = href.replace('/gali-v5', '/gali-6');
        this.router.navigateByUrl(newPath);
      }
    };
    document.addEventListener('click', clickHandler, { capture: true });
    this._clickInterceptor = () => document.removeEventListener('click', clickHandler, { capture: true });

    // Interceptar navigaciones programáticas router.navigate(['/gali-v5/...'])
    this._navSub = this.router.events
      .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
      .subscribe(e => {
        if (e.url.startsWith('/gali-v5')) {
          const newUrl = e.url.replace('/gali-v5', '/gali-6');
          this.router.navigateByUrl(newUrl, { replaceUrl: true });
        }
      });
  }

  ngOnDestroy(): void {
    this._clickInterceptor?.();
    this._navSub?.unsubscribe();
  }

  private buildZeroRespuesta(): string {
    const pedidos = this.zeroPedidos();
    const canal = this.zeroCanal();
    if (canal === 'meta' || canal === 'ambos') {
      return `Para tu meta de ${pedidos} pedidos/sem, Gali recomienda empezar por estabilizar tu ROAS en Meta y luego lanzar 2 productos nuevos. Tus primeras señales llegarán hoy.`;
    }
    return `Para tu meta de ${pedidos} pedidos/sem, Gali te va a sugerir los 2 proyectos con más potencial. Tus primeras señales llegarán hoy.`;
  }
}

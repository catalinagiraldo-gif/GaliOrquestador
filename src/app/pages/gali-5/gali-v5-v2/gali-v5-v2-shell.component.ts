import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GaliV5V2IconRailComponent } from './gali-v5-v2-icon-rail.component';
import { DropiSectionNavComponent } from '../gali-v5/components/dropi-section-nav.component';
import { GaliRightPanelComponent } from '../gali-v5/components/gali-right-panel/gali-right-panel.component';
import { GaliStateService } from '../gali-v5/services/gali-state.service';
import { SectionPanel } from '../gali-v5/dropi-sections.config';
import { resolveV2SectionPanel, V2_MISSION_PANEL } from './gali-v5-v2-sections.config';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';

/**
 * Gali V5 v2 — "La Casita".
 * Combina el chrome de Gali V5 v1 (icon-rail + section-nav agrupado + look&feel + chat lateral)
 * con la innovación de v2 (home briefing + sistema de objetivos). Rutas remapeadas a /gali-v5-v2.
 * No toca /gali-v5.
 */
@Component({
  selector: 'app-gali-v5-v2-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    GaliV5V2IconRailComponent,
    DropiSectionNavComponent,
    GaliRightPanelComponent,
  ],
  templateUrl: './gali-v5-v2-shell.component.html',
  styleUrl: './gali-v5-v2-shell.component.scss',
})
export class GaliV5V2ShellComponent {
  private router = inject(Router);
  readonly gali = inject(GaliStateService);

  readonly navOpen = signal(false);
  readonly walletHidden = signal(false);

  readonly sectionPanel = signal<SectionPanel>(V2_MISSION_PANEL);
  readonly hasSectionPanel = signal(true);
  readonly sectionCollapsed = signal(localStorage.getItem('gali-v2-section-collapsed') === 'true');

  /** Modo básico/experto — controla densidad, no elimina secciones. */
  readonly modo = signal<'basico' | 'experto'>(
    (localStorage.getItem('gali-v2-modo') as 'basico' | 'experto') ?? 'basico',
  );

  readonly objetivoMeta = signal<number>(Number(localStorage.getItem('gali-v2-objetivo-meta') ?? 100));
  readonly objetivoActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;
  readonly objetivoPct = computed(() =>
    Math.min(100, Math.round((this.objetivoActual / this.objetivoMeta()) * 100)),
  );
  readonly walletLabel = '$2.717.360';

  constructor() {
    this.syncNav(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncNav(e.urlAfterRedirects));
  }

  private syncNav(url: string): void {
    const panel = resolveV2SectionPanel(url);
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
    localStorage.setItem('gali-v2-section-collapsed', String(next));
  }

  toggleModo(): void {
    const next = this.modo() === 'basico' ? 'experto' : 'basico';
    this.modo.set(next);
    localStorage.setItem('gali-v2-modo', next);
  }

  toggleNav(): void {
    this.navOpen.update(v => !v);
  }

  panelMaxWidth(): number {
    return Math.floor(window.innerWidth * 0.78);
  }
}

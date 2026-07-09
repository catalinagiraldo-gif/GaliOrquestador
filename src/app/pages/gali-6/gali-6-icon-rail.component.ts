import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { G6_ICON_RAIL, resolveG6RailKey } from './gali-6-sections.config';
import { MOCK_SENALES, MOCK_ALERTAS } from '../../../../mocks/gali-v5/senales.mock';

/** Icon rail de Gali 6 — misma visual de V5, rutas /gali-6. */
@Component({
  selector: 'app-gali6-icon-rail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="icon-rail" aria-label="Navegación principal Gali 6">
      <a routerLink="/gali-6" class="icon-rail__logo-btn"
         [class.icon-rail__logo-btn--active]="activeKey() === 'home'"
         title="Inicio Gali" aria-label="Inicio Gali">
        <span class="icon-rail__spark" aria-hidden="true">✦</span>
        @if (tieneCriticas()) {
          <span class="rail-badge rail-badge--criticas">{{ alertasCriticasCount() }}</span>
        } @else if (senalesActivasCount() > 0) {
          <span class="rail-badge rail-badge--senales">{{ senalesActivasCount() }}</span>
        }
      </a>

      <div class="icon-rail__main">
        <div class="icon-rail__group">
          @for (item of mainItems(); track item.key) {
            <a [routerLink]="item.route" class="icon-rail__item"
               [class.icon-rail__item--active]="activeKey() === item.key"
               [title]="item.label" [attr.aria-label]="item.label">
              <span class="icon-rail__item-inner">
                <span class="icon-rail__svg" [style.--icon-url]="'url(' + item.icon + ')'" aria-hidden="true"></span>
              </span>
            </a>
          }
        </div>

        <div class="icon-rail__divider" aria-hidden="true"></div>

        <div class="icon-rail__group">
          @for (item of utilityItems(); track item.key) {
            <a [routerLink]="item.route" class="icon-rail__item"
               [class.icon-rail__item--active]="activeKey() === item.key"
               [title]="item.label" [attr.aria-label]="item.label">
              <span class="icon-rail__item-inner">
                <span class="icon-rail__svg" [style.--icon-url]="'url(' + item.icon + ')'" aria-hidden="true"></span>
              </span>
            </a>
          }
        </div>
      </div>

      <div class="icon-rail__footer">
        <button type="button" class="icon-rail__item icon-rail__item--help"
          title="Ayuda" aria-label="Ayuda" (click)="showHelpDrawer.set(true)">
          <span class="icon-rail__item-inner"><span class="icon-rail__help-glyph" aria-hidden="true">?</span></span>
        </button>
        <button type="button" class="icon-rail__item icon-rail__item--heart" title="Centro de ayuda Gali">
          <span class="icon-rail__item-inner"><i class="pi pi-heart-fill" aria-hidden="true"></i></span>
        </button>
      </div>

      @if (showHelpDrawer()) {
        <div class="help-drawer-backdrop" (click)="showHelpDrawer.set(false)">
          <aside class="help-drawer" (click)="$event.stopPropagation()" role="dialog">
            <div class="help-drawer__header">
              <span class="help-drawer__title">Centro de ayuda · Gali 6</span>
              <button type="button" class="help-drawer__close" (click)="showHelpDrawer.set(false)">×</button>
            </div>
            <nav class="help-drawer__sections">
              <div class="help-section">
                <h4 class="help-section__title">Tu espacio con Gali</h4>
                <p class="help-section__text">Gali organiza tu negocio en torno a tus objetivos: Hoy para decisiones, Señales para alertas, Proyectos para campañas y Centro de Gali para configuración avanzada.</p>
              </div>
              <div class="help-section help-section--support">
                <h4 class="help-section__title">¿Necesitas ayuda?</h4>
                <a href="mailto:soporte@dropi.co" class="help-section__cta">Escribir a soporte →</a>
              </div>
            </nav>
          </aside>
        </div>
      }
    </nav>
  `,
  styleUrl: '../gali-5/gali-v5/components/dropi-icon-rail.component.scss',
})
export class Gali6IconRailComponent {
  private router = inject(Router);

  activeKey = signal(resolveG6RailKey(inject(Router).url));
  readonly showHelpDrawer = signal(false);

  readonly mainItems = computed(() => G6_ICON_RAIL.filter(i => i.group === 'main'));
  readonly utilityItems = computed(() => G6_ICON_RAIL.filter(i => i.group === 'utility'));

  readonly senalesActivasCount = computed(() => MOCK_SENALES.filter(s => s.tipo !== 'completed').length);
  readonly alertasCriticasCount = computed(() => MOCK_ALERTAS.filter(a => a.tipo === 'critical').length);
  readonly tieneCriticas = computed(() => this.alertasCriticasCount() > 0);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.activeKey.set(resolveG6RailKey(e.urlAfterRedirects)));
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { V2_ICON_RAIL, resolveV2RailKey } from './gali-v5-v2-sections.config';
import { MOCK_SENALES, MOCK_ALERTAS } from '../../../../../mocks/gali-v5/senales.mock';

/** Icon rail de La Casita — clon visual de v1 (mismo SCSS) con rutas /gali-v5-v2. */
@Component({
  selector: 'app-gali-v5-v2-icon-rail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="icon-rail" aria-label="Navegación principal">
      <a routerLink="/gali-v5-v2" class="icon-rail__logo-btn"
         [class.icon-rail__logo-btn--active]="activeKey() === 'home'"
         title="Gali Hub" aria-label="Gali Hub">
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
        <button type="button" class="icon-rail__item icon-rail__item--heart" title="Creado con Dropi">
          <span class="icon-rail__item-inner"><i class="pi pi-heart-fill" aria-hidden="true"></i></span>
        </button>
      </div>

      @if (showHelpDrawer()) {
        <div class="help-drawer-backdrop" (click)="showHelpDrawer.set(false)">
          <aside class="help-drawer" (click)="$event.stopPropagation()" role="dialog">
            <div class="help-drawer__header">
              <span class="help-drawer__title">Centro de ayuda</span>
              <button type="button" class="help-drawer__close" (click)="showHelpDrawer.set(false)">×</button>
            </div>
            <nav class="help-drawer__sections">
              <div class="help-section">
                <h4 class="help-section__title">La Casita</h4>
                <p class="help-section__text">Gali V5 v2: el mismo poder de Gali, organizado en torno a tus objetivos. Modo básico o experto según lo necesites.</p>
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
  styleUrl: '../gali-v5/components/dropi-icon-rail.component.scss',
})
export class GaliV5V2IconRailComponent {
  private router = inject(Router);

  activeKey = signal(resolveV2RailKey(inject(Router).url));
  readonly showHelpDrawer = signal(false);

  readonly mainItems = computed(() => V2_ICON_RAIL.filter(i => i.group === 'main'));
  readonly utilityItems = computed(() => V2_ICON_RAIL.filter(i => i.group === 'utility'));

  readonly senalesActivasCount = computed(() => MOCK_SENALES.filter(s => s.tipo !== 'completed').length);
  readonly alertasCriticasCount = computed(() => MOCK_ALERTAS.filter(a => a.tipo === 'critical').length);
  readonly tieneCriticas = computed(() => this.alertasCriticasCount() > 0);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.activeKey.set(resolveV2RailKey(e.urlAfterRedirects)));
  }
}

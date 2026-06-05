import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  DROPI_ICON_RAIL,
  IconRailItem,
  resolveActiveRailKey,
} from '../dropi-sections.config';
import { GaliWorkspaceService } from '../services/gali-workspace.service';

@Component({
  selector: 'dropi-icon-rail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="icon-rail" aria-label="Navegación principal">
      <!-- ✦ Gali Hub logo -->
      <a routerLink="/gali-v5" class="icon-rail__logo-btn"
         [class.icon-rail__logo-btn--active]="activeKey() === 'home'"
         title="Gali Hub" aria-label="Gali Hub">
        <span class="icon-rail__spark" aria-hidden="true">✦</span>
      </a>

      <div class="icon-rail__main">

        <!-- Módulos operativos -->
        <div class="icon-rail__group">
          @for (item of mainItems(); track item.key) {
            <a
              [routerLink]="item.route"
              class="icon-rail__item"
              [class.icon-rail__item--active]="activeKey() === item.key"
              [title]="item.label"
              [attr.aria-label]="item.label"
              [attr.aria-current]="activeKey() === item.key ? 'page' : null">
              <span class="icon-rail__item-inner">
                <span
                  class="icon-rail__svg"
                  [style.--icon-url]="'url(' + item.icon + ')'"
                  aria-hidden="true"></span>
              </span>
            </a>
          }
        </div>

        <div class="icon-rail__divider" aria-hidden="true"></div>

        <!-- Utilidades -->
        <div class="icon-rail__group">
          @for (item of utilityItems(); track item.key) {
            <a
              [routerLink]="item.route"
              class="icon-rail__item"
              [class.icon-rail__item--active]="activeKey() === item.key"
              [title]="item.label"
              [attr.aria-label]="item.label"
              [attr.aria-current]="activeKey() === item.key ? 'page' : null">
              <span class="icon-rail__item-inner">
                <span
                  class="icon-rail__svg"
                  [style.--icon-url]="'url(' + item.icon + ')'"
                  aria-hidden="true"></span>
              </span>
            </a>
          }
        </div>

      </div>

      <div class="icon-rail__footer">
        <button type="button" class="icon-rail__item icon-rail__item--help"
          title="Ayuda y documentación"
          aria-label="Ayuda y documentación"
          (click)="showHelpDrawer.set(true)">
          <span class="icon-rail__item-inner">
            <span class="icon-rail__help-glyph" aria-hidden="true">?</span>
          </span>
        </button>
        <button type="button" class="icon-rail__item icon-rail__item--heart" title="Creado con Dropi">
          <span class="icon-rail__item-inner">
            <i class="pi pi-heart-fill" aria-hidden="true"></i>
          </span>
        </button>
      </div>

      <!-- Drawer de ayuda -->
      @if (showHelpDrawer()) {
        <div class="help-drawer-backdrop" (click)="showHelpDrawer.set(false)">
          <aside class="help-drawer" (click)="$event.stopPropagation()" role="dialog" aria-label="Ayuda y documentación">
            <div class="help-drawer__header">
              <span class="help-drawer__title">Centro de ayuda</span>
              <button type="button" class="help-drawer__close" (click)="showHelpDrawer.set(false)" aria-label="Cerrar">×</button>
            </div>
            <nav class="help-drawer__sections">
              <div class="help-section">
                <h4 class="help-section__title">Sobre este módulo</h4>
                <p class="help-section__text">Explora las secciones del menú lateral para gestionar tu operación de dropshipping con Gali.</p>
              </div>
              <div class="help-section">
                <h4 class="help-section__title">Tutorial del agente activo</h4>
                <p class="help-section__text">Gali orquesta tu negocio con 5 agentes especializados: Roax (marketing), Vigilante (logística), ADA Spy (productos), Chatea Pro (ventas) y Kronos (finanzas).</p>
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
  styleUrl: './dropi-icon-rail.component.scss',
})
export class DropiIconRailComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  activeKey = signal(resolveActiveRailKey(inject(Router).url));
  readonly showHelpDrawer = signal(false);

  readonly mainItems = computed(() => {
    const visible = this.ws.visibleModules();
    const all = DROPI_ICON_RAIL.filter(i => i.group === 'main');
    return visible === null ? all : all.filter(i => visible.includes(i.key));
  });

  readonly utilityItems = computed(() => {
    const visible = this.ws.visibleModules();
    const all = DROPI_ICON_RAIL.filter(i => i.group === 'utility');
    return visible === null ? all : all.filter(i => visible.includes(i.key));
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.activeKey.set(resolveActiveRailKey(e.urlAfterRedirects)));
  }
}

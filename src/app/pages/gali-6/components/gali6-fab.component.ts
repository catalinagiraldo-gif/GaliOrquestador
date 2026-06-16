import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GaliStateService } from '../../gali-5/gali-v5/services/gali-state.service';
import { DropiPrototypeFeedbackService } from '../../gali-5/gali-v5/services/dropi-prototype-feedback.service';

interface ContextBtn {
  icon: string;
  label: string;
  route: string;
}

const CONTEXT_MAP: Array<{ prefix: string; btn: ContextBtn }> = [
  { prefix: '/gali-6/proyectos',   btn: { icon: '+', label: 'Nuevo proyecto', route: '/gali-6/proyectos/nuevo' } },
  { prefix: '/gali-6/senales',     btn: { icon: '◎', label: 'Ver proyectos', route: '/gali-6/proyectos' } },
  { prefix: '/gali-6/impacto',     btn: { icon: '◇', label: 'Ver proyectos', route: '/gali-6/proyectos' } },
  { prefix: '/gali-6/marketing',   btn: { icon: '⚡', label: 'Ver señales', route: '/gali-6/senales' } },
];

@Component({
  selector: 'app-gali6-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="g6-fab" aria-label="Acciones rápidas de Gali">

      <!-- Botón contextual de ruta (opcional) -->
      @if (contextBtn()) {
        <div class="g6-fab__mini-wrap">
          <button class="g6-fab__mini" type="button"
            [attr.aria-label]="contextBtn()!.label"
            (click)="goContext()">
            <span class="g6-fab__mini-icon g6-fab__mini-icon--glyph" aria-hidden="true">{{ contextBtn()!.icon }}</span>
          </button>
          <span class="g6-fab__label">{{ contextBtn()!.label }}</span>
        </div>
      }

      <!-- Huella — siempre visible, igual que en V5 -->
      <div class="g6-fab__mini-wrap">
        <button class="g6-fab__mini" type="button"
          aria-label="Verificación de huella"
          (click)="onHuella()">
          <img src="assets/images/dropi-baseline/fab/icon-huella.svg" alt="" aria-hidden="true" class="g6-fab__mini-img" />
        </button>
        <span class="g6-fab__label">Huella</span>
      </div>

      <!-- Torre logística — siempre visible, igual que en V5 -->
      <div class="g6-fab__mini-wrap">
        <button class="g6-fab__mini" type="button"
          aria-label="Torre logística"
          (click)="goTorre()">
          <img src="assets/images/dropi-baseline/fab/icon-torre.svg" alt="" aria-hidden="true" class="g6-fab__mini-img" />
        </button>
        <span class="g6-fab__label">Torre</span>
      </div>

      <!-- Botón principal ✦ Gali -->
      <div class="g6-fab__gali-wrap">
        <button
          type="button"
          class="g6-fab__gali"
          [class.g6-fab__gali--open]="gali.galiMode() > 0"
          [attr.aria-label]="gali.galiMode() > 0 ? 'Cerrar panel Gali' : 'Hablar con Gali'"
          (click)="gali.togglePanel()"
          data-proto-skip>
          @if (gali.galiMode() === 0 && gali.criticalCount() > 0) {
            <span class="g6-fab__badge" [attr.aria-label]="gali.criticalCount() + ' señales críticas'">
              {{ gali.criticalCount() }}
            </span>
          }
          <span class="g6-fab__icon" aria-hidden="true">
            {{ gali.galiMode() > 0 ? '✕' : '✦' }}
          </span>
        </button>
        <span class="g6-fab__label">
          {{ gali.galiMode() > 0 ? 'Cerrar Gali' : 'Panel Gali' }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    @keyframes g6FabPulse {
      0%, 100% { box-shadow: 0 4px 16px rgba($primary-500, 0.35); }
      50%       { box-shadow: 0 4px 28px rgba($primary-500, 0.60); }
    }

    .g6-fab {
      position: fixed;
      right: $size-5;
      bottom: $size-6;
      z-index: 400;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $size-3;

      &__mini-wrap, &__gali-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__label {
        position: absolute;
        right: calc(100% + $size-2);
        white-space: nowrap;
        background: rgba(21, 25, 33, 0.88);
        color: #fff;
        font-family: $font-primary;
        font-size: 11px;
        font-weight: $font-medium;
        padding: 3px 8px;
        border-radius: $radius-sm;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease;
      }

      &__mini-wrap:hover &__label,
      &__gali-wrap:hover &__label { opacity: 1; }

      &__mini {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: #1c1c1e;
        color: rgba(255, 255, 255, 0.75);
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: transform 0.15s ease, background 0.15s ease;
        &:hover { background: #2a2a2a; transform: translateY(-2px); color: #fff; }
        &:active { transform: translateY(0); }
      }

      &__mini-img {
        width: 20px;
        height: 20px;
        object-fit: contain;
        filter: invert(1);
      }

      &__mini-icon {
        &--glyph { font-size: 16px; line-height: 1; }
      }

      &__gali {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        border: none;
        border-radius: 50%;
        background: $primary-500;
        cursor: pointer;
        animation: g6FabPulse 3s ease-in-out infinite;
        transition: transform 0.2s ease, background 0.2s ease;

        &:hover { background: $primary-600; transform: scale(1.06); }
        &:active { transform: scale(0.97); }

        &--open {
          background: #1c1c1e;
          animation: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          &:hover { background: #2a2a2a; }
        }
      }

      &__icon {
        font-size: 22px;
        color: #fff;
        line-height: 1;
        user-select: none;
        transition: transform 0.25s ease;
        .g6-fab__gali--open & { transform: rotate(90deg); }
      }

      &__badge {
        position: absolute;
        top: -3px;
        right: -3px;
        min-width: 18px;
        height: 18px;
        padding: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
        background: #ef4444;
        border: 2px solid #fff;
        color: #fff;
        font-family: $font-primary;
        font-size: 10px;
        font-weight: $font-bold;
        line-height: 1;
        pointer-events: none;
      }
    }

    @media (max-width: 599px) {
      .g6-fab { right: $size-4; bottom: $size-4; }
    }
  `],
})
export class Gali6FabComponent {
  readonly gali = inject(GaliStateService);
  private router = inject(Router);
  private feedback = inject(DropiPrototypeFeedbackService);
  private readonly url = signal(this.router.url);

  readonly contextBtn = computed<ContextBtn | null>(() => {
    const url = this.url();
    const match = CONTEXT_MAP.find(m => url.startsWith(m.prefix));
    return match?.btn ?? null;
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.url.set(e.urlAfterRedirects));
  }

  goContext(): void {
    const btn = this.contextBtn();
    if (btn) this.router.navigate([btn.route]);
  }

  onHuella(): void {
    this.feedback.action('Verificación de huella');
  }

  goTorre(): void {
    this.router.navigate(['/gali-6/logistica/torre-logistica']);
  }
}

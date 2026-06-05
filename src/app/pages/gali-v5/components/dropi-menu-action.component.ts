import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropiPrototypeFeedbackService } from '../services/dropi-prototype-feedback.service';
import { GaliStateService } from '../services/gali-state.service';

@Component({
  selector: 'dropi-menu-action',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-action" aria-label="Acciones rápidas de Gali">

      <!-- Acciones secundarias -->
      <div class="menu-action__secondary">
        <div class="menu-action__mini-wrap">
          <button
            type="button"
            class="menu-action__mini"
            title="Verificación de huella"
            aria-label="Verificación de huella"
            (click)="onHuella()">
            <img src="assets/images/dropi-baseline/fab/icon-huella.svg" alt="" aria-hidden="true" />
          </button>
          <span class="menu-action__fab-label">Huella</span>
        </div>
        <div class="menu-action__mini-wrap">
          <button
            type="button"
            class="menu-action__mini"
            title="Torre logística"
            aria-label="Torre logística"
            (click)="onTorre()">
            <img src="assets/images/dropi-baseline/fab/icon-torre.svg" alt="" aria-hidden="true" />
          </button>
          <span class="menu-action__fab-label">Torre</span>
        </div>
      </div>

      <!-- Botón principal Gali -->
      <div class="menu-action__gali-wrap">
        <button
          type="button"
          class="menu-action__gali"
          [class.menu-action__gali--open]="gali.galiMode() > 0"
          [attr.aria-label]="gali.galiMode() > 0 ? 'Cerrar panel Gali' : 'Abrir panel Gali'"
          title="Abrir panel Gali"
          (click)="toggleGali()"
          data-proto-skip>
          @if (gali.galiMode() === 0 && gali.criticalCount() > 0) {
            <span class="menu-action__badge">{{ gali.criticalCount() }}</span>
          }
          <span class="menu-action__gali-icon">
            {{ gali.galiMode() > 0 ? '✕' : '✦' }}
          </span>
        </button>
        <span class="menu-action__fab-label menu-action__fab-label--gali">
          {{ gali.galiMode() > 0 ? 'Cerrar Gali' : 'Panel Gali' }}
        </span>
      </div>
    </div>
  `,
  styleUrl: './dropi-menu-action.component.scss',
})
export class DropiMenuActionComponent {
  private router = inject(Router);
  private feedback = inject(DropiPrototypeFeedbackService);
  readonly gali = inject(GaliStateService);

  toggleGali(): void {
    this.gali.togglePanel();
  }

  onHuella(): void {
    this.feedback.action('Verificación de huella');
  }

  onTorre(): void {
    this.router.navigateByUrl('/gali-v5/logistica/torre-logistica');
  }
}

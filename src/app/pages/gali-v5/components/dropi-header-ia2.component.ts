import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropiPrototypeFeedbackService } from '../services/dropi-prototype-feedback.service';
import { GALI_V5_DROPI_LOGO } from '../gali-v5.constants';

@Component({
  selector: 'dropi-header-ia2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-ia2">
      <div class="header-ia2__brand">
        <a
          routerLink="/home"
          class="header-ia2__gallery"
          title="Volver a la galería de prototipos">
          <i class="pi pi-th-large" aria-hidden="true"></i>
          <span>Galería</span>
        </a>
        <a routerLink="/gali-v5" class="header-ia2__logo-link" title="Inicio Gali V5">
          <img [src]="logoSrc" alt="dropi" class="header-ia2__logo" />
        </a>
      </div>

      <!-- Objetivo activo — siempre visible -->
      <a routerLink="/gali-v5" class="header-ia2__goal" title="Ver Gali Hub">
        <span class="header-ia2__goal-icon">🎯</span>
        <div class="header-ia2__goal-info">
          <span class="header-ia2__goal-label">50 ventas / semana</span>
          <div class="header-ia2__goal-bar">
            <div class="header-ia2__goal-fill" style="width: 76%"></div>
          </div>
        </div>
        <span class="header-ia2__goal-count">38<span class="header-ia2__goal-total">/50</span></span>
        @if (autopilotOn) {
          <span class="header-ia2__auto-badge">AUTO</span>
        }
      </a>

      <div class="header-ia2__actions">
        <button type="button" class="header-ia2__beta" aria-label="Toggle BETA" (click)="toggleBeta()">
          <span class="header-ia2__beta-label">BETA</span>
          <span class="header-ia2__beta-switch" [class.header-ia2__beta-switch--on]="betaOn()">
            <span class="header-ia2__beta-knob"></span>
          </span>
        </button>

        <div class="header-ia2__wallet">
          <i class="pi pi-wallet header-ia2__wallet-icon"></i>
          @if (walletVisible()) {
            <span class="header-ia2__wallet-amount">{{ formattedBalance }}</span>
          } @else {
            <span class="header-ia2__wallet-mask">••••••••</span>
          }
          <button
            type="button"
            class="header-ia2__eye"
            data-proto-skip
            (click)="toggleWallet()"
            [attr.aria-label]="walletVisible() ? 'Ocultar saldo' : 'Mostrar saldo'">
            <i [class]="walletVisible() ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>

        <button type="button" class="header-ia2__avatar" aria-label="Perfil" (click)="onProfile()">
          <img [src]="avatarUrl" [alt]="userName" />
        </button>
      </div>
    </header>
  `,
  styleUrl: './dropi-header-ia2.component.scss',
})
export class DropiHeaderIa2Component {
  private feedback = inject(DropiPrototypeFeedbackService);

  readonly logoSrc = GALI_V5_DROPI_LOGO;

  @Input() userName = 'Alejandra';
  @Input() walletBalance = 2717360700;
  @Input() avatarUrl = 'assets/images/dropi-baseline/avatar-user.png';
  @Input() galiMode: 0 | 1 | 2 = 0;
  @Input() autopilotOn = false;

  betaOn = signal(true);
  walletVisible = signal(true);

  get formattedBalance(): string {
    return `$ ${this.walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }

  toggleWallet(): void {
    this.walletVisible.update(v => !v);
  }

  toggleBeta(): void {
    this.betaOn.update(v => !v);
  }

  onProfile(): void {
    this.feedback.action('Perfil de usuario');
  }
}

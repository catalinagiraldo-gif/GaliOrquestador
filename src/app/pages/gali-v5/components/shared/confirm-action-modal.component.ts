import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmActionConfig {
  titulo: string;
  descripcion: string;
  impacto: string;
  pedidosAfectados?: number;
  ctaLabel: string;
  cancelLabel?: string;
  variant?: 'critical' | 'warning';
}

@Component({
  selector: 'confirm-action-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cam-backdrop" (click)="cancel.emit()">
      <div class="cam-dialog" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">

        <div class="cam-dialog__header">
          <span class="cam-dialog__icon" [class.cam-dialog__icon--critical]="config.variant === 'critical'">
            {{ config.variant === 'critical' ? '⚠' : '!' }}
          </span>
          <h3 class="cam-dialog__title">{{ config.titulo }}</h3>
          <button type="button" class="cam-dialog__close" (click)="cancel.emit()" aria-label="Cerrar">×</button>
        </div>

        <div class="cam-dialog__body">
          <p class="cam-dialog__desc">{{ config.descripcion }}</p>

          @if (config.pedidosAfectados && config.pedidosAfectados > 0) {
            <div class="cam-dialog__affected">
              <span class="cam-dialog__affected-num">{{ config.pedidosAfectados }}</span>
              <span class="cam-dialog__affected-label">pedidos afectados</span>
            </div>
          }

          <div class="cam-dialog__impact">
            <span class="cam-dialog__impact-label">Impacto</span>
            <span class="cam-dialog__impact-text">{{ config.impacto }}</span>
          </div>
        </div>

        <div class="cam-dialog__actions">
          <button type="button" class="cam-btn cam-btn--cancel" (click)="cancel.emit()">
            {{ config.cancelLabel || 'Cancelar' }}
          </button>
          <button type="button" class="cam-btn cam-btn--confirm"
            [class.cam-btn--confirm-critical]="config.variant === 'critical'"
            (click)="confirm.emit()">
            {{ config.ctaLabel }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .cam-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(2px);
      z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    }

    .cam-dialog {
      background: #fff;
      border-radius: 12px;
      width: 440px; max-width: 100%;
      box-shadow: 0 16px 48px rgba(0,0,0,0.18);
      overflow: hidden;

      &__header {
        display: flex; align-items: center; gap: 12px;
        padding: 20px 24px 0;
      }

      &__icon {
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(245,158,11,0.12);
        color: #d97706; font-size: 16px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;

        &--critical {
          background: rgba(239,68,68,0.1);
          color: #dc2626;
        }
      }

      &__title {
        flex: 1; font-size: 16px; font-weight: 700;
        color: #1f2937; letter-spacing: -0.02em; margin: 0;
      }

      &__close {
        width: 28px; height: 28px; border: none; background: none;
        color: #9ca3af; font-size: 18px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        border-radius: 4px; transition: all 0.12s;
        &:hover { background: #f3f4f6; color: #374151; }
      }

      &__body {
        padding: 16px 24px 20px;
        display: flex; flex-direction: column; gap: 12px;
      }

      &__desc {
        font-size: 13px; color: #6b7280; line-height: 1.55; margin: 0;
      }

      &__affected {
        display: flex; align-items: baseline; gap: 6px;
        padding: 10px 14px;
        background: rgba(239,68,68,0.05);
        border: 1px solid rgba(239,68,68,0.15);
        border-radius: 8px;
      }

      &__affected-num {
        font-size: 24px; font-weight: 700; color: #dc2626;
        letter-spacing: -0.04em;
      }

      &__affected-label {
        font-size: 13px; color: #6b7280;
      }

      &__impact {
        display: flex; flex-direction: column; gap: 2px;
        padding: 10px 14px;
        background: #f9fafb; border: 1px solid #e5e7eb;
        border-radius: 8px;
      }

      &__impact-label {
        font-size: 10px; font-weight: 700; color: #9ca3af;
        text-transform: uppercase; letter-spacing: 0.06em;
      }

      &__impact-text {
        font-size: 13px; color: #374151; font-weight: 500;
      }

      &__actions {
        display: flex; gap: 10px;
        padding: 16px 24px;
        border-top: 1px solid #f3f4f6;
      }
    }

    .cam-btn {
      flex: 1; height: 40px; border-radius: 8px;
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: none; transition: all 0.15s;

      &--cancel {
        background: transparent; color: #6b7280;
        border: 1px solid #e5e7eb;
        &:hover { background: #f9fafb; color: #374151; }
      }

      &--confirm {
        background: #f59e0b; color: #fff;
        &:hover { opacity: 0.9; }

        &-critical {
          background: #dc2626;
        }
      }
    }
  `],
})
export class ConfirmActionModalComponent {
  @Input({ required: true }) config!: ConfirmActionConfig;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

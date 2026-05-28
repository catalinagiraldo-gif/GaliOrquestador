import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropiPrototypeFeedbackService } from '../services/dropi-prototype-feedback.service';

@Component({
  selector: 'dropi-menu-action',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-action" aria-label="Acciones rápidas">
      <button type="button" class="menu-action__btn" title="Huella" (click)="onHuella()">
        <img src="assets/images/dropi-baseline/fab/icon-huella.svg" alt="" aria-hidden="true" />
      </button>
      <button type="button" class="menu-action__btn" title="Torre logística" (click)="onTorre()">
        <img src="assets/images/dropi-baseline/fab/icon-torre.svg" alt="" aria-hidden="true" />
      </button>
      <button type="button" class="menu-action__btn" title="Chat" (click)="onChat()">
        <img src="assets/images/dropi-baseline/fab/icon-chat.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  `,
  styleUrl: './dropi-menu-action.component.scss',
})
export class DropiMenuActionComponent {
  private router = inject(Router);
  private feedback = inject(DropiPrototypeFeedbackService);

  onHuella(): void {
    this.feedback.action('Verificación de huella');
  }

  onTorre(): void {
    this.router.navigateByUrl('/gali-v5/logistica/torre-logistica');
  }

  onChat(): void {
    this.feedback.action('Chat de soporte');
  }
}

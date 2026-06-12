import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliStateService } from '../../services/gali-state.service';

@Component({
  selector: 'gali-workspace-mode-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-workspace-mode-bar.component.html',
  styleUrl: './gali-workspace-mode-bar.component.scss',
})
export class GaliWorkspaceModeBarComponent {
  @Input() objetivoActual = 38;
  @Input() objetivoMeta = 50;
  @Input() objetivoLabel = '50 ventas/semana';
  @Input() objetivoPeriodo = 'Sem 3 de 4';

  readonly ws = inject(GaliWorkspaceService);
  private gali = inject(GaliStateService);
  private router = inject(Router);

  goToAgentes(): void {
    this.router.navigate(['/gali-v5/agentes']);
  }

  private isOnHome(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/gali-v5' || url === '/gali-v5/';
  }

  setComplexity(level: 'novice' | 'expert'): void {
    if (this.ws.complexityLevel() === level) return;
    this.ws.setComplexityLevel(level, { notify: true });
    if (!this.isOnHome()) {
      this.router.navigate(['/gali-v5']);
    }
  }

  onObjetivoClick(): void {
    this.ws.requestEditGoal();
    if (!this.isOnHome()) {
      this.router.navigate(['/gali-v5']);
    }
  }

  onGaliStatusClick(): void {
    if (this.gali.galiMode() === 0) {
      this.gali.togglePanel();
    }
    if (!this.isOnHome()) {
      this.router.navigate(['/gali-v5']);
    }
  }

  get progress(): number {
    return Math.min(100, Math.round((this.objetivoActual / this.objetivoMeta) * 100));
  }
}

import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GaliWorkspaceService,
  WORKSPACE_MODES,
  WorkspaceMode,
} from '../../services/gali-workspace.service';

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
  readonly modes = WORKSPACE_MODES;

  setMode(mode: WorkspaceMode): void {
    this.ws.setMode(mode);
  }

  onGaliStatusClick(): void {
    if (this.ws.galiPaused()) {
      this.ws.resumeGali();
    } else {
      this.ws.pauseGali();
    }
  }

  get progress(): number {
    return Math.min(100, Math.round((this.objetivoActual / this.objetivoMeta) * 100));
  }
}

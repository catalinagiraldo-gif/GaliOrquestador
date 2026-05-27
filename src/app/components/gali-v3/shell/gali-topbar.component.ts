import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { GaliSignalsService } from '../../../services/gali-v3/signals.service';
import { GaliMemoryService } from '../../../services/gali-v3/memory.service';
import { GaliRightPanelService } from '../../../services/gali-v3/right-panel.service';

@Component({
  selector: 'gali-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali-topbar.component.html',
  styleUrls: ['./gali-topbar.component.scss'],
})
export class GaliTopbarComponent {
  private signalsSvc = inject(GaliSignalsService);
  private memorySvc = inject(GaliMemoryService);
  private router = inject(Router);
  private rpanelSvc = inject(GaliRightPanelService);

  signalsCount = this.signalsSvc.count;
  signalsActive = this.signalsSvc.active;
  signalsCriticas = this.signalsSvc.criticas;
  memoria = this.memorySvc.memory;
  rpanelOpen = this.rpanelSvc.open;

  popoverOpen = signal(false);

  togglePanel() {
    this.rpanelSvc.toggle();
  }

  togglePopover() {
    this.popoverOpen.update(v => !v);
  }

  closePopover() {
    this.popoverOpen.set(false);
  }

  goToSignal(target: string, signalId: string) {
    // Navega al target con queryParam signal=ID para que el target component resalte la zona
    const [path, qs] = target.split('?');
    const existing = qs ? new URLSearchParams(qs) : new URLSearchParams();
    existing.set('signal', signalId);
    this.router.navigateByUrl(`${path}?${existing.toString()}`);
    this.closePopover();
  }

  dismissSignal(id: string, ev: Event) {
    ev.stopPropagation();
    this.signalsSvc.dismiss(id);
  }
}

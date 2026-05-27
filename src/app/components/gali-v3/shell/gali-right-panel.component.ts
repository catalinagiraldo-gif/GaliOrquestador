import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaliRightPanelService, RightPanelTab } from '../../../services/gali-v3/right-panel.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import { GaliChatComponent } from '../chat/gali-chat.component';
import { GaliBusinessContextComponent } from './gali-business-context.component';

@Component({
  selector: 'gali-right-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliChatComponent, GaliBusinessContextComponent],
  templateUrl: './gali-right-panel.component.html',
  styleUrls: ['./gali-right-panel.component.scss'],
})
export class GaliRightPanelComponent {
  private svc = inject(GaliRightPanelService);
  private chatSvc = inject(GaliChatService);
  private bloqueSvc = inject(GaliBloqueBuilderService);
  private router = inject(Router);

  open = this.svc.open;
  tab = this.svc.tab;
  businessExpanded = this.svc.businessExpanded;

  bloques = this.bloqueSvc.bloquesGuardados;
  bloquesCount = computed(() => this.bloques().length);

  unreadCount = computed(() => {
    // Mock: cuenta mensajes recientes del thread activo (no implementado el flag de leído)
    const msgs = this.chatSvc.messages();
    const last = msgs[msgs.length - 1];
    return last && last.role === 'gali' && !this.open() ? 1 : 0;
  });

  toggle() {
    this.svc.toggle();
  }

  setTab(t: RightPanelTab) {
    this.svc.setTab(t);
  }

  toggleBusiness() {
    this.svc.toggleBusiness();
  }

  irAlConstructor() {
    this.router.navigateByUrl('/gali-v3/bloque-builder');
  }
}

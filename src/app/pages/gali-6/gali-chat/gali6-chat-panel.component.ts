import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gali6ChatService } from './gali6-chat.service';
import { Gali6ChatCardMetricComponent } from './cards/gali6-chat-card-metric.component';
import { Gali6ChatCardComparativaComponent } from './cards/gali6-chat-card-comparativa.component';
import { Gali6ChatCardTablaComponent } from './cards/gali6-chat-card-tabla.component';
import { Gali6ChatCardAccionesComponent } from './cards/gali6-chat-card-acciones.component';
import { Gali6ThreadRailComponent } from './threads/gali6-thread-rail.component';
import { Gali6ThreadsService } from './threads/gali6-threads.service';
import { Gali6TabAgentesComponent } from './tabs/gali6-tab-agentes.component';
import { Gali6TabSenalesComponent } from './tabs/gali6-tab-senales.component';
import { Gali6TabMemoriaComponent } from './tabs/gali6-tab-memoria.component';

export type Gali6PanelTab = 'chat' | 'agentes' | 'senales' | 'memoria';

/**
 * Panel de chat propio de Gali 6 — fork aislado de GaliRightPanelComponent (gali-5).
 * Ver /Users/user/.claude/plans/usando-skill-de-ui-swift-wolf.md para el plan completo.
 */
@Component({
  selector: 'gali6-chat-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Gali6ChatCardMetricComponent,
    Gali6ChatCardComparativaComponent,
    Gali6ChatCardTablaComponent,
    Gali6ChatCardAccionesComponent,
    Gali6ThreadRailComponent,
    Gali6TabAgentesComponent,
    Gali6TabSenalesComponent,
    Gali6TabMemoriaComponent,
  ],
  templateUrl: './gali6-chat-panel.component.html',
  styleUrl: './gali6-chat-panel.component.scss',
})
export class Gali6ChatPanelComponent {
  readonly chat = inject(Gali6ChatService);
  readonly threadsSvc = inject(Gali6ThreadsService);

  @Output() closed = new EventEmitter<void>();
  @Output() galiActing = new EventEmitter<{ targetId: string; kind: 'mutate' | 'navigate' }>();

  readonly draft = signal('');
  readonly activeTab = signal<Gali6PanelTab>('chat');

  readonly isMainThread = computed(() => this.threadsSvc.activeThreadId() === 'gali-main');

  /** gali-main sigue viviendo en Gali6ChatService (reglas contextuales + mutaciones ya verificadas); hilos secundarios en Gali6ThreadsService. */
  readonly activeMessages = computed(() => (this.isMainThread() ? this.chat.messages() : this.threadsSvc.activeThread().messages));

  send(): void {
    const text = this.draft();
    if (!text.trim()) return;
    if (this.isMainThread()) {
      this.chat.sendMessage(text);
    } else {
      this.threadsSvc.sendToActiveThread(text);
    }
    this.draft.set('');
  }

  onActionClick(actionId: string): void {
    const result = this.chat.handleAction(actionId);
    if (result) this.galiActing.emit(result);
  }

  onEnter(e: Event): void {
    e.preventDefault();
    this.send();
  }

  close(): void {
    this.closed.emit();
  }
}

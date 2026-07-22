import { Component, ElementRef, EventEmitter, Output, ViewChild, computed, effect, inject, signal, untracked } from '@angular/core';
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
import { Gali6TabArtefactosComponent } from './tabs/gali6-tab-artefactos.component';
import { Gali6ScreenArtifactsService } from '../services/gali6-screen-artifacts.service';
import { Gali6LiveMutationsService } from '../services/gali6-live-mutations.service';

export type Gali6PanelTab = 'chat' | 'agentes' | 'senales' | 'memoria' | 'artefactos';

/** Ejemplos reales del dominio (no genéricos) para que el placeholder enseñe con el uso, no con un tour. */
const INPUT_PLACEHOLDERS = [
  'Ej: crea una regla que avise si cae el stock…',
  'Ej: fija esto en Catálogo…',
  'Ej: modifica el agente Kronos para que…',
  'Pregúntale algo a Gali…',
];

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
    Gali6TabArtefactosComponent,
  ],
  templateUrl: './gali6-chat-panel.component.html',
  styleUrl: './gali6-chat-panel.component.scss',
})
export class Gali6ChatPanelComponent {
  readonly chat = inject(Gali6ChatService);
  readonly threadsSvc = inject(Gali6ThreadsService);
  private readonly artifactsSvc = inject(Gali6ScreenArtifactsService);
  private readonly mutations = inject(Gali6LiveMutationsService);

  @Output() closed = new EventEmitter<void>();
  @Output() galiActing = new EventEmitter<{ targetId: string; kind: 'mutate' | 'navigate' }>();

  @ViewChild('draftInput') draftInput?: ElementRef<HTMLTextAreaElement>;

  readonly draft = signal('');
  readonly activeTab = signal<Gali6PanelTab>('chat');
  readonly inputPlaceholder = INPUT_PLACEHOLDERS[Math.floor(Math.random() * INPUT_PLACEHOLDERS.length)];

  // Badges de tabs (Fase 3): "visto hasta" se actualiza solo mientras el tab correspondiente
  // está activo (untracked para no re-suscribirse a version()/todos() en cada cambio) — así el
  // badge marca contenido nuevo desde la última visita, sin ruido para Chat/Señales/Memoria.
  private readonly vistoArtefactosEpoch = signal(Date.now());
  private readonly vistoAgentesVersion = signal(0);

  readonly badgeArtefactos = computed(() => {
    const desde = this.vistoArtefactosEpoch();
    return this.artifactsSvc.todos().filter(a => Number(a.id.replace('artefacto-', '')) > desde).length;
  });
  readonly badgeAgentes = computed(() => this.mutations.version() > this.vistoAgentesVersion());

  private lastFocusRequest = 0;
  constructor() {
    // Botón "+ Crear con Gali" / "Editar con Gali" desde Agentes/Reglas/Skills (Flujo K) — enfoca el tab "chat".
    // allowSignalWrites (NG0600): cada uno de estos efectos escribe una señal que no lee, o que
    // solo vuelve a leer para "consumirla una vez" (pendingDraft) — sin ciclo real.
    effect(() => {
      const n = this.chat.focusRequest();
      if (n > this.lastFocusRequest) {
        this.lastFocusRequest = n;
        this.activeTab.set('chat');
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const tab = this.activeTab();
      if (tab === 'artefactos') this.vistoArtefactosEpoch.set(Date.now());
      if (tab === 'agentes') this.vistoAgentesVersion.set(untracked(() => this.mutations.version()));
    }, { allowSignalWrites: true });

    // Spot "Nuevo en Gali" (gali-6-shell) precarga un ejemplo real en el input, editable, sin enviarlo.
    effect(() => {
      const texto = this.chat.pendingDraft();
      if (texto === null) return;
      this.activeTab.set('chat');
      this.draft.set(texto);
      this.chat.pendingDraft.set(null);
      queueMicrotask(() => this.draftInput?.nativeElement.focus());
    }, { allowSignalWrites: true });
  }

  /** Auto-grow del textarea hasta el max-height definido en CSS (96px) — nunca lo excede, la propia CSS lo recorta. */
  autoGrow(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

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
    if (this.draftInput) this.draftInput.nativeElement.style.height = 'auto';
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

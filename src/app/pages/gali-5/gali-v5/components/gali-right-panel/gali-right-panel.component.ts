import { Component, EventEmitter, Output, computed, effect, inject, signal, ViewChild, ElementRef, AfterViewChecked, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GaliStateService } from '../../services/gali-state.service';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { loadAutopilotScope } from '../gali-autopilot-config/gali-autopilot-config.component';
import { DropiPanelSplitterComponent } from '../dropi-panel-splitter/dropi-panel-splitter.component';
import { MOCK_ALERTAS, MOCK_SENALES, GaliAlerta } from '../../../../../../../mocks/gali-v5/senales.mock';

type PanelTab = 'chat' | 'agentes' | 'senales' | 'live' | 'memory' | 'files';

// ── C1: Interfaces WorkspaceChat ─────────────────────────────────────────────

export type ThreadCategory = 'proyecto' | 'agente' | 'libre';

export interface GaliRichCard {
  type: 'roas_chart' | 'pedidos_summary' | 'novedad_alert' | 'action_buttons';
  roasData?: { label: string; value: number }[];
  roasCurrent?: number;
  roasTarget?: number;
  pedidosCount?: number;
  pedidosNovedad?: number;
  pedidosPendientes?: number;
  novedadPct?: number;
  novedadCiudad?: string;
  novedadTransportadora?: string;
  actions?: { label: string; action: string; isPrimary?: boolean }[];
}

export interface ChatMessage {
  id: string;
  from: 'user' | 'gali';
  text: string;
  time: string;
  richCard?: GaliRichCard;
}

export interface ChatThread {
  id: string;
  title: string;
  agente: string;
  agentColor: string;
  category: ThreadCategory;
  contextId?: string;
  contextLabel?: string;
  messages: ChatMessage[];
  unread: number;
  isPinned?: boolean;
  createdAt: number;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'gali-right-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, DropiPanelSplitterComponent],
  templateUrl: './gali-right-panel.component.html',
  styleUrl: './gali-right-panel.component.scss',
})
export class GaliRightPanelComponent implements AfterViewChecked {
  @Output() closed = new EventEmitter<void>();
  @Output() galiActing = new EventEmitter<void>();
  @ViewChild('chatEnd') chatEnd?: ElementRef;

  readonly gali = inject(GaliStateService);
  readonly ws = inject(GaliWorkspaceService);
  private ngZone = inject(NgZone);
  private shouldScrollChat = false;
  readonly Math = Math;
  readonly router = inject(Router);

  activeTab = signal<PanelTab>('chat');
  chatInput = signal('');
  readonly showOverflowMenu = signal(false);

  readonly secondaryTabs: PanelTab[] = ['live', 'memory', 'files'];
  readonly isSecondaryTabActive = computed(() => this.secondaryTabs.includes(this.activeTab()));

  // Multi-thread system
  readonly showThreadList = signal(false);
  readonly hoveredThreadId = signal<string | null>(null);

  // ── C8: localStorage persistence for pins ──────────────────────────────────
  private readonly PINNED_KEY = 'gali_pinned_threads_v1';

  private loadPinnedFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(this.PINNED_KEY);
      return raw ? JSON.parse(raw) : ['gali-main'];
    } catch {
      return ['gali-main'];
    }
  }

  readonly pinnedThreadIds = signal<string[]>(this.loadPinnedFromStorage());

  pinThread(id: string): void {
    if (id === 'gali-main') return;
    this.pinnedThreadIds.update(ids => {
      const next = ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id];
      try { localStorage.setItem(this.PINNED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }
  // ──────────────────────────────────────────────────────────────────────────

  // Rail expand + rename + search
  readonly isHoveringRail = signal(false);
  readonly isSearchFocused = signal(false);
  readonly editingThreadId = signal<string | null>(null);
  readonly threadSearch = signal('');
  readonly railExpanded = computed(() =>
    this.isHoveringRail() || this.editingThreadId() !== null || this.isSearchFocused()
  );

  startEditThread(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.editingThreadId.set(id);
  }

  saveEditThread(id: string, value: string): void {
    const name = value.trim();
    if (name) {
      this.threads.update(list =>
        list.map(t => t.id === id ? { ...t, title: name } : t)
      );
    }
    this.editingThreadId.set(null);
  }

  onThreadNameKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter') {
      this.saveEditThread(id, (event.target as HTMLInputElement).value);
    } else if (event.key === 'Escape') {
      this.editingThreadId.set(null);
    }
  }

  readonly activeThreadId = signal('gali-main');

  // ── C1: Updated threads signal with 4 mock threads ─────────────────────────
  readonly threads = signal<ChatThread[]>([
    {
      id: 'gali-main',
      title: 'Gali · Hub general',
      agente: 'Gali',
      agentColor: '#f49a3d',
      category: 'libre',
      messages: [],
      unread: 0,
      createdAt: Date.now(),
    },
    {
      id: 'roax-collar',
      title: 'Roax · Collar GPS',
      agente: 'Roax',
      agentColor: '#f97316',
      category: 'proyecto',
      contextId: 'collar-gps-2026',
      contextLabel: 'Collar GPS',
      messages: [
        {
          id: 'r1',
          from: 'gali',
          text: 'El CTR del creativo A cayó a 1.2%. Tengo listo un creativo de respaldo — ¿lo activo?',
          time: 'hace 10 min',
          richCard: {
            type: 'roas_chart',
            roasCurrent: 1.93,
            roasTarget: 2.5,
            roasData: [
              { label: 'L', value: 2.1 },
              { label: 'M', value: 2.3 },
              { label: 'X', value: 1.9 },
              { label: 'J', value: 1.8 },
              { label: 'V', value: 1.93 },
            ],
          },
        },
      ],
      unread: 1,
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'vigilante-novedades',
      title: 'Vigilante · Novedades Bogotá',
      agente: 'Vigilante',
      agentColor: '#fbbf24',
      category: 'agente',
      contextId: 'vigilante',
      contextLabel: 'Vigilante',
      messages: [
        {
          id: 'v1',
          from: 'gali',
          text: 'Novedad en Bogotá subió al 18% esta semana. ¿Quieres que reasigne a Envia para los próximos 5 días?',
          time: 'hace 2h',
          richCard: {
            type: 'novedad_alert',
            novedadPct: 18,
            novedadCiudad: 'Bogotá',
            novedadTransportadora: 'Coordinadora',
          },
        },
      ],
      unread: 1,
      createdAt: Date.now() - 7200000,
    },
    {
      id: 'kronos-finanzas',
      title: 'Kronos · P&L semanal',
      agente: 'Kronos',
      agentColor: '#60a5fa',
      category: 'agente',
      contextId: 'kronos',
      contextLabel: 'Kronos',
      messages: [
        {
          id: 'k1',
          from: 'gali',
          text: 'Esta semana cerraste con $2.74M en ingresos. El margen neto bajó 2pts por el incremento en fletes.',
          time: 'hoy 8am',
          richCard: {
            type: 'pedidos_summary',
            pedidosCount: 47,
            pedidosNovedad: 3,
            pedidosPendientes: 8,
          },
        },
      ],
      unread: 0,
      createdAt: Date.now() - 14400000,
    },
  ]);
  // ──────────────────────────────────────────────────────────────────────────

  readonly activeThread = computed(() =>
    this.threads().find(t => t.id === this.activeThreadId()) ?? this.threads()[0]
  );

  readonly totalUnread = computed(() =>
    this.threads().reduce((sum, t) => sum + t.unread, 0)
  );

  // ── C2: Grouping computed signals ─────────────────────────────────────────
  readonly pinnedThreads = computed(() =>
    this.threads().filter(t => this.pinnedThreadIds().includes(t.id))
  );

  readonly projectThreads = computed(() =>
    this.threads().filter(
      t => t.category === 'proyecto' && !this.pinnedThreadIds().includes(t.id)
    )
  );

  readonly agentThreads = computed(() =>
    this.threads().filter(
      t => t.category === 'agente' && !this.pinnedThreadIds().includes(t.id)
    )
  );

  readonly freeThreads = computed(() =>
    this.threads().filter(
      t => t.category === 'libre' && !this.pinnedThreadIds().includes(t.id)
    )
  );

  readonly filteredPinned = computed(() => this.filterBySearch(this.pinnedThreads()));
  readonly filteredProjects = computed(() => this.filterBySearch(this.projectThreads()));
  readonly filteredAgents = computed(() => this.filterBySearch(this.agentThreads()));
  readonly filteredFree = computed(() => this.filterBySearch(this.freeThreads()));

  private filterBySearch(threads: ChatThread[]): ChatThread[] {
    const q = this.threadSearch().toLowerCase().trim();
    return q ? threads.filter(t => t.title.toLowerCase().includes(q)) : threads;
  }

  readonly filteredThreads = computed(() => {
    const all = [
      ...this.pinnedThreads(),
      ...this.projectThreads(),
      ...this.agentThreads(),
      ...this.freeThreads(),
    ];
    const q = this.threadSearch().toLowerCase().trim();
    return q ? all.filter(t => t.title.toLowerCase().includes(q)) : all;
  });
  // ──────────────────────────────────────────────────────────────────────────

  switchThread(threadId: string): void {
    this.activeThreadId.set(threadId);
    this.showThreadList.set(false);
    this.threadSearch.set('');
    this.threads.update(list =>
      list.map(t => t.id === threadId ? { ...t, unread: 0 } : t)
    );
  }

  createThread(): void {
    const id = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id, title: 'Nueva conversación', agente: 'Gali', agentColor: '#f49a3d',
      category: 'libre',
      messages: [], unread: 0, createdAt: Date.now(),
    };
    this.threads.update(list => [...list, newThread]);
    this.switchThread(id);
  }

  archiveThread(id: string): void {
    if (id === 'gali-main') return;
    this.threads.update(list => list.filter(t => t.id !== id));
    if (this.activeThreadId() === id) this.activeThreadId.set('gali-main');
  }

  // ── C3: Context selector ──────────────────────────────────────────────────
  readonly showContextSelector = signal(false);
  readonly newThreadCategory = signal<ThreadCategory | null>(null);
  readonly newThreadContextId = signal<string | null>(null);
  readonly newThreadContextLabel = signal('');

  readonly availableProjects = [
    { id: 'collar-gps-2026', label: 'Collar GPS para Mascotas', agentColor: '#f97316' },
    { id: 'skincare-kbeauty', label: 'Skincare K-Beauty', agentColor: '#a78bfa' },
    { id: 'difusor-aroma', label: 'Difusor Aromaterapia', agentColor: '#34d399' },
  ];

  readonly availableAgents = [
    { id: 'roax', label: 'Roax', desc: 'Campañas y ROAS', color: '#f97316' },
    { id: 'vigilante', label: 'Vigilante', desc: 'Novedades y logística', color: '#fbbf24' },
    { id: 'kronos', label: 'Kronos', desc: 'P&L y finanzas', color: '#60a5fa' },
    { id: 'chatea', label: 'Chatea Pro', desc: 'WhatsApp y atención', color: '#34d399' },
    { id: 'ada', label: 'Ada', desc: 'Catálogo y precios', color: '#818cf8' },
  ];

  openContextSelector(): void {
    this.showThreadList.set(true);
    this.showContextSelector.set(true);
    this.newThreadCategory.set(null);
    this.newThreadContextId.set(null);
    this.newThreadContextLabel.set('');
  }

  selectCategory(category: ThreadCategory): void {
    this.newThreadCategory.set(category);
    if (category === 'libre') {
      this.confirmCreateThread();
    }
  }

  selectContext(id: string, label: string): void {
    this.newThreadContextId.set(id);
    this.newThreadContextLabel.set(label);
    this.confirmCreateThread();
  }

  confirmCreateThread(): void {
    const category = this.newThreadCategory() ?? 'libre';
    const contextId = this.newThreadContextId() ?? undefined;
    const contextLabel = this.newThreadContextLabel() || undefined;

    let agente = 'Gali';
    let agentColor = '#f49a3d';
    if (category === 'agente' && contextId) {
      const found = this.availableAgents.find(a => a.id === contextId);
      if (found) { agente = found.label; agentColor = found.color; }
    }

    const title = contextLabel ? `${agente} · ${contextLabel}` : 'Nueva conversación';
    const id = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id, title, agente, agentColor, category,
      contextId, contextLabel,
      messages: [],
      unread: 0,
      createdAt: Date.now(),
    };

    this.threads.update(list => [...list, newThread]);
    this.switchThread(id);
    this.showContextSelector.set(false);
  }
  // ──────────────────────────────────────────────────────────────────────────

  readonly beforeAfterLog = [
    {
      id: 'baf-1', agente: 'Roax', agentColor: '#f97316',
      accion: 'Pausó Video A → activó Video B',
      hace: 'hace 2h',
      antesLabel: 'CTR', antesVal: '1.2%',
      despuesLabel: 'CTR', despuesVal: '1.8%',
      impact: '+50% CTR · ROAS 2.6→2.9x',
      route: '/gali-v5/proyecto/collar-gps-2026',
    },
    {
      id: 'baf-2', agente: 'Vigilante', agentColor: '#fbbf24',
      accion: 'Cambió 12 pedidos Coordinadora → Envia (Cali)',
      hace: 'hace 4h',
      antesLabel: 'Novedades', antesVal: '9.8%',
      despuesLabel: 'Novedades', despuesVal: '6.4%',
      impact: 'Estimado: 4 novedades ahorradas · $85k',
      route: '/gali-v5/proyecto/collar-gps-2026',
    },
    {
      id: 'baf-3', agente: 'Chatea Pro', agentColor: '#34d399',
      accion: 'Gestionó 8 novedades · 7 resueltas automáticamente',
      hace: 'hace 6h',
      antesLabel: 'Novedades abiertas', antesVal: '8',
      despuesLabel: 'Novedades abiertas', despuesVal: '1',
      impact: '87.5% resolución automática',
      route: '/gali-v5/mis-pedidos/mis-pedidos',
    },
  ];

  readonly activeAgentInfo = computed(() => {
    return this.gali.agents().find(a => a.status === 'activo') ?? null;
  });

  private readonly agentColors: Record<string, string> = {
    roax: '#f97316',
    vigilante: '#fbbf24',
    chatea: '#34d399',
    ada: '#818cf8',
    vigilante_logístico: '#fbbf24',
  };

  agentColor(id: string): string {
    return this.agentColors[id.toLowerCase()] ?? '#9b9ba8';
  }

  // ── C5: Pre-cargar thread desde proyecto ──────────────────────────────────
  readonly pendingProjectThread = signal<{ projectId: string; projectLabel: string } | null>(null);

  openProjectThread(projectId: string, projectLabel: string): void {
    const existing = this.threads().find(
      t => t.category === 'proyecto' && t.contextId === projectId
    );

    if (existing) {
      this.switchThread(existing.id);
    } else {
      const id = `proj-${projectId}-${Date.now()}`;
      const newThread: ChatThread = {
        id,
        title: `Gali · ${projectLabel}`,
        agente: 'Gali',
        agentColor: '#f49a3d',
        category: 'proyecto',
        contextId: projectId,
        contextLabel: projectLabel,
        messages: [
          {
            id: 'ctx-preload',
            from: 'gali',
            text: `Abrí el contexto de ${projectLabel}. Tengo los datos actuales de campaña, ROAS y novedades. ¿Qué quieres revisar?`,
            time: 'ahora',
            richCard: {
              type: 'action_buttons',
              actions: [
                { label: 'Ver ROAS', action: `ask_roas_${projectId}` },
                { label: 'Ver novedades', action: `ask_novedades_${projectId}` },
                { label: 'Ver pedidos', action: `ask_pedidos_${projectId}`, isPrimary: true },
              ],
            },
          },
        ],
        unread: 0,
        createdAt: Date.now(),
      };
      this.threads.update(list => [...list, newThread]);
      this.switchThread(id);
    }

    this.activeTab.set('chat');
  }
  // ──────────────────────────────────────────────────────────────────────────

  // ── C6: Pre-cargar thread desde agente ────────────────────────────────────
  openAgentThread(agentId: string, agentLabel: string, agentColor: string): void {
    const existing = this.threads().find(
      t => t.category === 'agente' && t.contextId === agentId
    );

    if (existing) {
      this.switchThread(existing.id);
    } else {
      const recentActions = this.beforeAfterLog
        .filter(e => e.agente.toLowerCase() === agentLabel.toLowerCase())
        .slice(0, 2);

      const recentText = recentActions.length
        ? `Últimas acciones de ${agentLabel}: ${recentActions.map(a => a.accion).join(' · ')}`
        : `${agentLabel} está activo. ¿Qué quieres revisar o configurar?`;

      const id = `agent-${agentId}-${Date.now()}`;
      const newThread: ChatThread = {
        id,
        title: `${agentLabel} · Configuración`,
        agente: agentLabel,
        agentColor,
        category: 'agente',
        contextId: agentId,
        contextLabel: agentLabel,
        messages: [
          {
            id: 'agent-preload',
            from: 'gali',
            text: recentText,
            time: 'ahora',
            richCard: {
              type: 'action_buttons',
              actions: [
                { label: 'Ver historial', action: `agent_history_${agentId}` },
                { label: 'Configurar umbral', action: `agent_config_${agentId}` },
                { label: 'Ver impacto', action: `agent_impact_${agentId}`, isPrimary: true },
              ],
            },
          },
        ],
        unread: 0,
        createdAt: Date.now(),
      };
      this.threads.update(list => [...list, newThread]);
      this.switchThread(id);
    }

    this.activeTab.set('chat');
  }
  // ──────────────────────────────────────────────────────────────────────────

  constructor() {
    effect(() => {
      const req = this.gali.requestedPanelTab();
      if (req) {
        this.activeTab.set(req as PanelTab);
        this.gali.requestedPanelTab.set(null);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const req = this.gali.requestedProjectThread();
      if (req) {
        this.openProjectThread(req.projectId, req.projectLabel);
        this.gali.requestedProjectThread.set(null);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const req = this.gali.requestedAgentThread();
      if (req) {
        this.openAgentThread(req.agentId, req.agentLabel, req.agentColor);
        this.gali.requestedAgentThread.set(null);
      }
    }, { allowSignalWrites: true });
  }

  setTab(tab: PanelTab): void {
    this.activeTab.set(tab);
    this.showOverflowMenu.set(false);
  }

  close(): void {
    this.closed.emit();
  }

  toggleAutopilot(): void {
    const next = !this.ws.autopilot();
    this.gali.setAutopilot(next);
  }

  quickAsk(text: string): void {
    this.chatInput.set('');
    this.gali.sendMessage(text);
    this.markScrollNeeded();
  }

  executeAction(action: string): void {
    this.gali.executeAction(action);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.close();
  }

  onInputChange(event: Event): void {
    this.chatInput.set((event.target as HTMLInputElement).value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  // I3: Reactive screen — muestra preview antes de actuar
  readonly chatActionPreview = signal<string | null>(null);
  private readonly ACTION_KEYWORDS = /crea|proyecto|lanza|activa|hazlo/i;

  send(): void {
    const text = this.chatInput().trim();
    if (!text) return;
    this.chatInput.set('');

    // I3: Si el mensaje tiene keywords de acción, mostrar preview reactivo + notificar shell
    if (this.ACTION_KEYWORDS.test(text)) {
      this.chatActionPreview.set(
        `Gali va a ${text.toLowerCase().includes('crea') ? 'crear' : 'ejecutar'} esto. ¿Confirmas?`
      );
      this.galiActing.emit();
      setTimeout(() => this.chatActionPreview.set(null), 4000);
    }

    if (this.activeThreadId() === 'gali-main') {
      this.gali.sendMessage(text);
    } else {
      const msgId = `msg-${Date.now()}`;
      this.threads.update(list =>
        list.map(t =>
          t.id === this.activeThreadId()
            ? { ...t, messages: [...t.messages, { id: msgId, from: 'user' as const, text, time: 'ahora' }] }
            : t
        )
      );
      setTimeout(() => {
        const replyId = `reply-${Date.now()}`;
        const thread = this.activeThread();
        const reply = thread?.agente === 'Roax'
          ? 'Entendido. Ajustando estrategia de campaña en base a tu indicación.'
          : 'Recibido. Monitoreando la situación y te aviso si hay cambios relevantes.';
        this.threads.update(list =>
          list.map(t =>
            t.id === this.activeThreadId()
              ? { ...t, messages: [...t.messages, { id: replyId, from: 'gali' as const, text: reply, time: 'ahora' }] }
              : t
          )
        );
        this.markScrollNeeded();
      }, 700);
    }
    this.markScrollNeeded();
  }

  onContextSplitChange(pct: number): void {
    this.gali.setContextSplitPercent(pct);
  }

  contextDragStart(): void {
    document.documentElement.style.setProperty('--gali-split-transition', 'none');
  }

  contextDragEnd(): void {
    document.documentElement.style.removeProperty('--gali-split-transition');
  }

  // ── Gali Memory Panel ──────────────────────────────────
  private readonly savedScope = loadAutopilotScope();

  readonly memoryItems = computed(() => {
    const scope = this.savedScope;
    const budgetK = Math.round(scope.budgetMax / 1000);
    const scopeDate = scope.savedAt
      ? new Date(scope.savedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
      : 'Hace 5 días';
    return [
      {
        id: 'm1',
        type: 'pattern' as const,
        icon: '📈',
        title: 'ROAS mejora con videos cortos',
        desc: 'Tus campañas con video <15s tienen ROAS 2.4× vs imagen estática. Aprendido en 3 proyectos.',
        date: 'Hace 2 días',
        confidence: 94,
        canUndo: false,
      },
      {
        id: 'm2',
        type: 'decision' as const,
        icon: '🔄',
        title: 'Cambio a Servientrega — Cali',
        desc: 'Coordinadora tenía 18% novedad en Cali. Gali migró Cali → Servientrega. Novedad bajó a 6%.',
        date: 'Ayer 3:12pm',
        confidence: 100,
        canUndo: true,
      },
      {
        id: 'm3',
        type: 'preference' as const,
        icon: '⚙️',
        title: `Presupuesto máx autopilot: $${budgetK}k/día`,
        desc: `Configurado en Autopilot Scope. Gali no escala campañas por encima de $${budgetK}k sin tu aprobación.${scope.changeTransportadora ? ' Cambio de transportadora habilitado.' : ''}`,
        date: scopeDate,
        confidence: 100,
        canUndo: true,
      },
      {
        id: 'm4',
        type: 'pattern' as const,
        icon: '🕐',
        title: 'Mejor hora de envío: 6–8pm',
        desc: 'Tus mensajes de WhatsApp enviados entre 6–8pm tienen 34% más conversión. Chatea Pro lo aplica automáticamente.',
        date: 'Hace 1 semana',
        confidence: 87,
        canUndo: false,
      },
      {
        id: 'm5',
        type: 'decision' as const,
        icon: '⏸️',
        title: 'Pausa campaña "Difusor Aromaterapia" — Weekend',
        desc: 'CTR cayó 40% sábado-domingo. Gali pausó automáticamente. ROAS mejoró 1.2× en días activos.',
        date: 'Hace 3 días',
        confidence: 100,
        canUndo: false,
      },
      {
        id: 'm6',
        type: 'insight' as const,
        icon: '💡',
        title: 'Segmento más rentable: Mujeres 25–34 Bogotá',
        desc: 'Analizando 847 pedidos de los últimos 30 días. Este segmento genera 61% de las ganancias netas.',
        date: 'Hace 4 días',
        confidence: 91,
        canUndo: false,
      },
    ];
  });

  undoMemoryItem(id: string): void {
    console.log('Undo memory item', id);
  }

  // ── Cloud Files Panel ───────────────────────────────────
  readonly cloudFiles = [
    {
      id: 'f1',
      source: 'gdrive' as const,
      icon: '📄',
      name: 'Brief Difusor Aromaterapia Q2.pdf',
      size: '1.2 MB',
      modified: 'Ayer',
      usedIn: 'Proyecto Difusor',
    },
    {
      id: 'f2',
      source: 'gdrive' as const,
      icon: '🖼️',
      name: 'Creativos Skincare Pack — Mayo.zip',
      size: '34 MB',
      modified: 'Hace 3 días',
      usedIn: 'Campaña Roax',
    },
    {
      id: 'f3',
      source: 'local' as const,
      icon: '🎬',
      name: 'video_aromaterapia_v3_final.mp4',
      size: '18 MB',
      modified: 'Hace 2 días',
      usedIn: null,
    },
    {
      id: 'f4',
      source: 'gdrive' as const,
      icon: '📊',
      name: 'Dashboard Financiero Mayo 2026.xlsx',
      size: '520 KB',
      modified: 'Hoy 9am',
      usedIn: null,
    },
    {
      id: 'f5',
      source: 'local' as const,
      icon: '🖼️',
      name: 'banner_skincare_1080x1080.jpg',
      size: '890 KB',
      modified: 'Hace 5 días',
      usedIn: 'Campaña Roax',
    },
    {
      id: 'f6',
      source: 'gdrive' as const,
      icon: '📄',
      name: 'Guia Proveedores Aliados.pdf',
      size: '2.1 MB',
      modified: 'Hace 1 semana',
      usedIn: null,
    },
  ];

  // I3: Señales del panel usan MOCK_ALERTAS (mismos que /senales)
  readonly panelAlertas: GaliAlerta[] = MOCK_ALERTAS.filter((a: GaliAlerta) => a.tipo === 'critical' || a.tipo === 'warning');

  // Lista priorizada para tab Señales: alertas críticas → warning → señales activas por urgencia
  readonly panelItems = [
    ...MOCK_ALERTAS
      .filter(a => a.tipo === 'critical' || a.tipo === 'warning')
      .sort((a, b) => (a.tipo === 'critical' ? 0 : 1) - (b.tipo === 'critical' ? 0 : 1))
      .map(a => ({
        id: a.id,
        titulo: a.titulo,
        agente: (a.agente ?? a.agenteOrigenNombre ?? '').toLowerCase(),
        tipoCat: a.tipo as string,      // 'critical' | 'warning'
        categoria: 'alerta' as const,
        cta: a.ctaPrincipal ?? null,
        dias: null as number | null,
      })),
    ...MOCK_SENALES
      .filter(s => s.tipo !== 'completed')
      .sort((a, b) => a.ventanaDias - b.ventanaDias)
      .slice(0, 3)
      .map(s => ({
        id: s.id,
        titulo: s.titulo,
        agente: (s.agenteOrigenNombre ?? s.agente ?? '').toLowerCase(),
        tipoCat: s.tipo as string,      // 'scale' | 'trend' | 'opportunity' | 'risk'
        categoria: 'senal' as const,
        cta: s.ctaPrincipal ?? null,
        dias: s.ventanaDias,
      })),
  ];

  readonly esExperto = computed(() => {
    try { return localStorage.getItem('gali-6-modo') === 'experto'; } catch { return false; }
  });

  readonly autopilotStates = signal<Record<string, boolean>>({
    roax: true, vigilante: true, chatea: false, ada: false, kronos: false
  });

  readonly agentesConAutopilot = [
    { id: 'roax',      nombre: 'Roax',       color: '#f97316', accionesHoy: '3 acciones hoy' },
    { id: 'vigilante', nombre: 'Vigilante',   color: '#fbbf24', accionesHoy: '2 acciones hoy' },
    { id: 'chatea',    nombre: 'Chatea Pro',  color: '#34d399', accionesHoy: 'esperando' },
    { id: 'ada',       nombre: 'ADA Spy',     color: '#818cf8', accionesHoy: 'esperando' },
    { id: 'kronos',    nombre: 'Kronos',      color: '#60a5fa', accionesHoy: 'esperando' },
  ];

  toggleAutopilotAgent(id: string): void {
    this.autopilotStates.update(s => ({ ...s, [id]: !(s as any)[id] }));
  }

  readonly filesFilter = signal<'all' | 'gdrive' | 'local'>('all');

  filteredFiles() {
    const f = this.filesFilter();
    if (f === 'all') return this.cloudFiles;
    return this.cloudFiles.filter(f2 => f2.source === f);
  }

  useFileInCampaign(fileId: string): void {
    console.log('Use file in campaign', fileId);
  }

  contextSplitPx(): number {
    const panelW = this.gali.panelWidth();
    return Math.round(panelW * (this.gali.contextSplitWidth() / 100));
  }

  onContextSplitPxChange(px: number): void {
    const pct = Math.round((px / this.gali.panelWidth()) * 100);
    this.gali.setContextSplitPercent(pct);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat && this.chatEnd?.nativeElement) {
      this.shouldScrollChat = false;
      this.ngZone.runOutsideAngular(() => {
        this.chatEnd!.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  markScrollNeeded(): void {
    this.shouldScrollChat = true;
  }
}

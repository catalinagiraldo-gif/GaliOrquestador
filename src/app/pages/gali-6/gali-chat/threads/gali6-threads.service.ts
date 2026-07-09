import { Injectable, computed, signal } from '@angular/core';
import { ChatThread, ThreadCategory } from '../models/gali6-thread.model';

let seq = 0;
function genId(): string {
  return `g6thmsg-${Date.now()}-${seq++}`;
}
function ahora(): string {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

const PINNED_KEY = 'gali6_pinned_threads_v1';

function loadPinned(): Set<string> {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return new Set(ids.length ? ids : ['gali-main']);
  } catch {
    return new Set(['gali-main']);
  }
}

function savePinned(ids: Set<string>): void {
  try {
    localStorage.setItem(PINNED_KEY, JSON.stringify([...ids]));
  } catch {
    /* localStorage no disponible — el pin solo vive en memoria de esta sesión */
  }
}

/**
 * Multi-hilo del panel de chat de Gali 6. Separado de Gali6ChatService a
 * propósito: 'gali-main' (el hilo default) sigue siendo manejado por
 * Gali6ChatService (reglas contextuales + mutaciones ya verificadas
 * end-to-end); este servicio solo gestiona hilos secundarios y el estado
 * de navegación entre todos. Ver §"Servicio de hilos" del plan.
 */
@Injectable({ providedIn: 'root' })
export class Gali6ThreadsService {
  readonly threads = signal<ChatThread[]>([
    {
      id: 'gali-main',
      title: 'Gali · Hub general',
      agente: 'Gali',
      agentColor: '#ff6102',
      category: 'libre',
      messages: [],
      unread: 0,
      createdAt: Date.now(),
    },
  ]);

  readonly activeThreadId = signal<string>('gali-main');
  readonly pinnedIds = signal<Set<string>>(loadPinned());

  readonly activeThread = computed(() => this.threads().find(t => t.id === this.activeThreadId()) ?? this.threads()[0]);
  readonly totalUnread = computed(() => this.threads().reduce((sum, t) => sum + t.unread, 0));

  // Fijados tiene prioridad absoluta; las otras 3 secciones son mutuamente excluyentes por category.
  readonly pinned = computed(() => this.threads().filter(t => this.pinnedIds().has(t.id)));
  readonly byProject = computed(() => this.threads().filter(t => t.category === 'proyecto' && !this.pinnedIds().has(t.id)));
  readonly byAgent = computed(() => this.threads().filter(t => t.category === 'agente' && !this.pinnedIds().has(t.id)));
  readonly unfiled = computed(() => this.threads().filter(t => t.category === 'libre' && !this.pinnedIds().has(t.id)));

  togglePin(id: string): void {
    if (id === 'gali-main') return;
    this.pinnedIds.update(ids => {
      const next = new Set(ids);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      savePinned(next);
      return next;
    });
  }

  switchTo(id: string): void {
    this.activeThreadId.set(id);
    this.threads.update(list => list.map(t => (t.id === id ? { ...t, unread: 0 } : t)));
  }

  create(category: ThreadCategory, opts?: { contextId?: string; contextLabel?: string; agente?: string; agentColor?: string }): string {
    const id = `g6thread-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const agente = opts?.agente ?? 'Gali';
    const agentColor = opts?.agentColor ?? '#ff6102';
    const title = opts?.contextLabel ? `${agente} · ${opts.contextLabel}` : 'Nueva conversación';
    const thread: ChatThread = {
      id,
      title,
      agente,
      agentColor,
      category,
      contextId: opts?.contextId,
      contextLabel: opts?.contextLabel,
      messages: [],
      unread: 0,
      createdAt: Date.now(),
    };
    this.threads.update(list => [...list, thread]);
    this.switchTo(id);
    return id;
  }

  renameThread(id: string, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    this.threads.update(list => list.map(t => (t.id === id ? { ...t, title: trimmed } : t)));
  }

  archive(id: string): void {
    if (id === 'gali-main') return;
    this.threads.update(list => list.filter(t => t.id !== id));
    if (this.activeThreadId() === id) this.switchTo('gali-main');
  }

  /** Respuesta enlatada para hilos secundarios — gali-main usa Gali6ChatService.sendMessage(). */
  sendToActiveThread(text: string): void {
    const id = this.activeThreadId();
    if (id === 'gali-main') return;
    const trimmed = text.trim();
    if (!trimmed) return;

    this.threads.update(list =>
      list.map(t => (t.id !== id ? t : { ...t, messages: [...t.messages, { id: genId(), rol: 'usuario', texto: trimmed, timestamp: ahora() }] })),
    );

    setTimeout(() => {
      this.threads.update(list =>
        list.map(t =>
          t.id !== id
            ? t
            : { ...t, messages: [...t.messages, { id: genId(), rol: 'gali', texto: 'Entendido, lo tengo en cuenta.', timestamp: ahora() }] },
        ),
      );
    }, 700);
  }
}

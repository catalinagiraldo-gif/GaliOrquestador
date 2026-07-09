import { Injectable, signal } from '@angular/core';

export type Gali6ScreenEntityKind = 'proyecto' | 'campana' | 'senal' | 'alerta' | 'objetivo';

export interface Gali6ScreenEntity {
  kind: Gali6ScreenEntityKind;
  id: string;
  label: string;
}

export interface Gali6ScreenContext {
  route: string;
  viewId: string;
  viewLabel: string;
  entity?: Gali6ScreenEntity;
  summary?: string;
  filters?: Record<string, string>;
  updatedAt: number;
}

/**
 * Screen-awareness de Gali 6: cada página publica su contexto activo aquí vía
 * publish() (típicamente desde un effect()); el panel de chat lo consume
 * reactivamente sin que el usuario tenga que pedirlo. Singleton global — la
 * invalidación automática al cambiar de ruta vive en Gali6ChatService.
 * Ver §2 de /Users/user/.claude/plans/usando-skill-de-ui-swift-wolf.md
 */
@Injectable({ providedIn: 'root' })
export class Gali6ScreenContextService {
  readonly context = signal<Gali6ScreenContext | null>(null);

  publish(ctx: Omit<Gali6ScreenContext, 'updatedAt'>): void {
    this.context.set({ ...ctx, updatedAt: Date.now() });
  }

  clear(): void {
    this.context.set(null);
  }
}

import { Injectable, signal } from '@angular/core';

export interface Gali6HighlightRequest {
  targetId: string;
  variant?: 'success' | 'info';
  durationMs?: number;
}

/**
 * Generaliza el patrón de highlight ya usado en gali6-senales.component.ts
 * (highlightId + setTimeout 3s por query param) a un servicio compartido que
 * cualquier página consume vía la directiva [gali6Highlight] sin reimplementar
 * el timer. Ver §3.1 de /Users/user/.claude/plans/usando-skill-de-ui-swift-wolf.md
 */
@Injectable({ providedIn: 'root' })
export class Gali6HighlightService {
  readonly active = signal<Gali6HighlightRequest | null>(null);

  trigger(req: Gali6HighlightRequest): void {
    const resolved: Gali6HighlightRequest = { durationMs: 3000, variant: 'success', ...req };
    this.active.set(resolved);
    setTimeout(() => {
      if (this.active()?.targetId === resolved.targetId) {
        this.active.set(null);
      }
    }, resolved.durationMs);
  }
}

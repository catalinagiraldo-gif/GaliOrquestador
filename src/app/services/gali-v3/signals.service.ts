import { Injectable, signal, computed } from '@angular/core';
import signalsData from '../../../../mocks/gali-v3/signals.json';
import { Signal } from './types';

@Injectable({ providedIn: 'root' })
export class GaliSignalsService {
  readonly signals = signal<Signal[]>((signalsData as { signals: Signal[] }).signals);
  readonly dismissed = signal<Set<string>>(this.loadDismissed());

  readonly active = computed(() =>
    this.signals().filter(s => !this.dismissed().has(s.id)),
  );

  readonly count = computed(() => this.active().length);

  readonly criticas = computed(() => this.active().filter(s => s.urgencia === 'alta'));

  dismiss(id: string) {
    const next = new Set(this.dismissed());
    next.add(id);
    this.dismissed.set(next);
    this.persist();
  }

  reset() {
    this.dismissed.set(new Set());
    this.persist();
  }

  private loadDismissed(): Set<string> {
    try {
      const raw = localStorage.getItem('gali_v3_signals_dismissed');
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set();
  }

  private persist() {
    try {
      localStorage.setItem(
        'gali_v3_signals_dismissed',
        JSON.stringify(Array.from(this.dismissed())),
      );
    } catch {}
  }
}

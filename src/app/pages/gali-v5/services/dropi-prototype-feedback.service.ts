import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PrototypeToast {
  message: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class DropiPrototypeFeedbackService {
  private seq = 0;
  readonly toast = signal<PrototypeToast | null>(null);

  constructor() {
    inject(Router).events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.toast.set(null));
  }

  show(message: string): void {
    const id = ++this.seq;
    this.toast.set({ message, id });
    window.setTimeout(() => {
      if (this.toast()?.id === id) {
        this.toast.set(null);
      }
    }, 2800);
  }

  /** Acción simulada — mantiene al usuario dentro del prototipo con feedback visible */
  action(label: string): void {
    this.show(`Prototipo · ${label}`);
  }
}

import { Injectable, signal } from '@angular/core';
import { VisualResponse } from '../gali-chat/models/gali6-chat.model';

export interface Gali6ScreenArtifact {
  id: string;
  screenId: string;
  titulo: string;
  visual: VisualResponse;
  creadoDesdeChat: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'gali6-screen-artifacts';

function loadStored(): Gali6ScreenArtifact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Gali6ScreenArtifact[]) : [];
  } catch {
    return [];
  }
}

/**
 * Artefactos fijados por el usuario desde el chat (Flujo J extendido, 18.FlujoUsuarioGali6.md
 * §5.3) — persistidos en localStorage porque los crea el usuario, mismo criterio que
 * Gali6CreationRegistryService. A diferencia del diseño original del spec (fijar solo en la
 * pantalla actual), el usuario elige el destino, y puede reubicar o eliminar después desde
 * el tab "Artefactos" del panel de chat.
 */
@Injectable({ providedIn: 'root' })
export class Gali6ScreenArtifactsService {
  readonly version = signal(0);
  private readonly items = signal<Gali6ScreenArtifact[]>(loadStored());

  todos(): Gali6ScreenArtifact[] {
    return this.items();
  }

  paraSeccion(screenId: string): Gali6ScreenArtifact[] {
    return this.items().filter(a => a.screenId === screenId);
  }

  crear(screenId: string, titulo: string, visual: VisualResponse): Gali6ScreenArtifact {
    const artefacto: Gali6ScreenArtifact = {
      id: `artefacto-${Date.now()}`,
      screenId,
      titulo,
      visual,
      creadoDesdeChat: true,
      timestamp: new Date().toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };
    this.items.update(list => [artefacto, ...list]);
    this.persist();
    this.version.update(v => v + 1);
    return artefacto;
  }

  reubicar(id: string, nuevoScreenId: string): boolean {
    if (!this.items().some(a => a.id === id)) return false;
    this.items.update(list => list.map(a => a.id === id ? { ...a, screenId: nuevoScreenId } : a));
    this.persist();
    this.version.update(v => v + 1);
    return true;
  }

  eliminar(id: string): boolean {
    const before = this.items().length;
    this.items.update(list => list.filter(a => a.id !== id));
    if (this.items().length === before) return false;
    this.persist();
    this.version.update(v => v + 1);
    return true;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }
}

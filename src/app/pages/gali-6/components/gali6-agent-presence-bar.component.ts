import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AGENTES_ESPECIALIZADOS } from '../../../../../mocks/gali-v6/agentes-especializados';
import { Gali6LiveMutationsService } from '../services/gali6-live-mutations.service';
import { Gali6CreationRegistryService } from '../services/gali6-creation-registry.service';
import { Gali6ChatService } from '../gali-chat/gali6-chat.service';
import { gali6ScreenCatalogConDestino, Gali6ScreenOption } from '../models/gali6-screen-catalog';

/**
 * Presencia de agentes en páginas operativas — Flujo I extendido
 * (18.FlujoUsuarioGali6.md §5.2). Generaliza el patrón visual de
 * gali-module-activation-bar (gali-v5) pero es nativo de Gali 6: soporta
 * N agentes por pantalla contra el roster real de AGENTES_ESPECIALIZADOS.
 * Nunca muta directo — "Mover a otra sección" solo dispara una propuesta
 * en el chat (preview-then-confirm), igual que el resto del Flujo I.
 */
@Component({
  selector: 'gali6-agent-presence-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (agentesAqui().length > 0) {
      <div class="g6pb">
        @for (ag of agentesAqui(); track ag.id) {
          <div class="g6pb__chip" [style.border-left-color]="ag.colorAvatar" [style.background]="ag.colorAvatar + '14'">
            <span class="g6pb__dot" [style.background]="ag.colorAvatar"></span>
            <span class="g6pb__label">Agente activo aquí: <strong>{{ ag.nombre }}</strong></span>
            <div class="g6pb__mover-wrap">
              <button type="button" class="g6pb__btn" (click)="toggleMover(ag.id)">Mover a otra sección</button>
              @if (moverAbierto() === ag.id) {
                <div class="g6pb__popover" role="menu" aria-label="Elegir pantalla destino">
                  @for (opt of screenCatalog; track opt.id) {
                    <button type="button" class="g6pb__opcion" role="menuitem" (click)="proponerMover(ag.id, opt.id)">{{ opt.label }}</button>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    @import 'styles/gali-os-tokens';
    :host { display: block; }
    .g6pb { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .g6pb__chip {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.75rem; border-radius: 999px;
      border: 1px solid $os-border-strong; border-left: 3px solid;
      font-size: 13px;
    }
    .g6pb__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .g6pb__label { color: $os-text-secondary; font-weight: 500; strong { color: $os-text-primary; font-weight: 600; } }
    .g6pb__mover-wrap { position: relative; display: inline-flex; }
    .g6pb__btn { all: unset; cursor: pointer; font-size: 11px; font-weight: 600; color: $os-accent; padding: 2px 6px; border-radius: 999px; }
    .g6pb__btn:hover { background: $os-accent-dim; }
    .g6pb__popover {
      position: absolute; top: calc(100% + 4px); left: 0; z-index: 20;
      display: flex; flex-direction: column; gap: 2px;
      background: $os-surface; border: 1px solid $os-border-strong; border-radius: $os-radius-md;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 4px; min-width: 180px; max-height: 240px; overflow-y: auto;
    }
    .g6pb__opcion {
      all: unset; cursor: pointer; font-size: 12px; color: $os-text-primary;
      padding: 6px 10px; border-radius: $os-radius-sm; white-space: nowrap;
      &:hover { background: $os-accent-dim; color: $os-accent-dark; }
    }
  `],
})
export class Gali6AgentPresenceBarComponent {
  @Input({ required: true }) screenId!: string;

  private readonly mutations = inject(Gali6LiveMutationsService);
  private readonly creationRegistry = inject(Gali6CreationRegistryService);
  private readonly chat = inject(Gali6ChatService);

  readonly screenCatalog: Gali6ScreenOption[] = gali6ScreenCatalogConDestino();
  readonly moverAbierto = signal<string | null>(null);

  readonly agentesAqui = computed(() => {
    this.mutations.version();
    this.creationRegistry.version();
    return [...AGENTES_ESPECIALIZADOS, ...this.creationRegistry.agentesCreados()]
      .filter(a => a.estado === 'activo' && a.apareceEn?.includes(this.screenId));
  });

  toggleMover(agenteId: string): void {
    this.moverAbierto.set(this.moverAbierto() === agenteId ? null : agenteId);
  }

  proponerMover(agenteId: string, destino: string): void {
    if (!destino) return;
    this.chat.proponerMoverAgente(agenteId, destino);
    this.chat.requestFocusChat();
    this.moverAbierto.set(null);
  }
}

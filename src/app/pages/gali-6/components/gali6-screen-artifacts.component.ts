import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gali6ScreenArtifactsService } from '../services/gali6-screen-artifacts.service';
import { Gali6ChatCardMetricComponent } from '../gali-chat/cards/gali6-chat-card-metric.component';
import { Gali6ChatCardComparativaComponent } from '../gali-chat/cards/gali6-chat-card-comparativa.component';
import { Gali6ChatCardTablaComponent } from '../gali-chat/cards/gali6-chat-card-tabla.component';
import { Gali6HighlightDirective } from '../directives/gali6-highlight.directive';

/** El id tiene forma `artefacto-<Date.now()>` (Gali6ScreenArtifactsService.crear) — se reusa
 * para saber si se fijó hace poco, sin agregar un campo nuevo al modelo. */
function esReciente(id: string, ventanaMs = 5 * 60 * 1000): boolean {
  const epoch = Number(id.replace('artefacto-', ''));
  return Number.isFinite(epoch) && Date.now() - epoch < ventanaMs;
}

/**
 * Muestra los artefactos que el usuario fijó desde el chat en ESTA pantalla
 * (Flujo J extendido, 18.FlujoUsuarioGali6.md §5.3). Reusa las mismas 3 cards
 * del chat — cero widgets nuevos. Solo lectura: reubicar/eliminar vive en el
 * tab "Artefactos" del panel de chat, no aquí, para no duplicar esa UI.
 */
@Component({
  selector: 'gali6-screen-artifacts',
  standalone: true,
  imports: [CommonModule, Gali6ChatCardMetricComponent, Gali6ChatCardComparativaComponent, Gali6ChatCardTablaComponent, Gali6HighlightDirective],
  template: `
    @if (items().length > 0) {
      <div class="g6sa">
        <p class="g6sa__label">✦ Fijado desde el chat</p>
        <div class="g6sa__list">
          @for (item of items(); track item.id) {
            <div class="g6sa__item" [gali6Highlight]="item.id">
              <p class="g6sa__titulo">
                {{ item.titulo }}
                @if (esReciente(item.id)) {
                  <span class="g6sa__nuevo">· recién fijado</span>
                }
              </p>
              @if (item.visual.kind === 'metric' && item.visual.metric) {
                <gali6-chat-card-metric [metric]="item.visual.metric" />
              }
              @if (item.visual.kind === 'comparativa' && item.visual.comparativa) {
                <gali6-chat-card-comparativa [items]="item.visual.comparativa" />
              }
              @if (item.visual.kind === 'tabla' && item.visual.tabla) {
                <gali6-chat-card-tabla [tabla]="item.visual.tabla" />
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    @import 'styles/gali-os-tokens';
    :host { display: block; }
    .g6sa { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed $os-border-strong; }
    .g6sa__label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: $os-text-muted; margin: 0 0 0.75rem; }
    .g6sa__list { display: flex; flex-direction: column; gap: 0.75rem; }
    .g6sa__item {
      max-width: 420px; border-radius: $os-radius-md; padding: 0.25rem;
      &.gali6-highlight--active { background: $os-accent-dim !important; transition: background 400ms ease; }
    }
    .g6sa__titulo { font-size: 12px; color: $os-text-secondary; margin: 0 0 0.375rem; }
    .g6sa__nuevo { color: $os-accent; font-weight: 600; }
  `],
})
export class Gali6ScreenArtifactsComponent {
  @Input({ required: true }) screenId!: string;

  private readonly artifacts = inject(Gali6ScreenArtifactsService);

  readonly items = computed(() => {
    this.artifacts.version();
    return this.artifacts.paraSeccion(this.screenId);
  });

  readonly esReciente = esReciente;
}

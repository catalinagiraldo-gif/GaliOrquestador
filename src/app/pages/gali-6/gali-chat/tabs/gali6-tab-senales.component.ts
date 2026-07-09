import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MOCK_ALERTAS, MOCK_SENALES } from '../../../../../../mocks/gali-v5/senales.mock';
import { Gali6LiveMutationsService } from '../../services/gali6-live-mutations.service';
import { Gali6HighlightService } from '../../services/gali6-highlight.service';

interface SenalPanelItem {
  id: string;
  titulo: string;
  agente: string;
  tipo: string;
  categoria: 'alerta' | 'senal';
  dias: number | null;
}

/**
 * Tab Señales — misma prioridad que Gali6ShellComponent.senalesPanelItems
 * (críticas→warning→señales por ventanaDias) pero filtrando resuelta===true
 * y re-derivada sobre Gali6LiveMutationsService.version(). La acción
 * "Resolver" reutiliza exactamente la misma infraestructura que ya conecta
 * el flujo de texto del chat con el highlight visual en pantalla — ver
 * plan §"Tab Señales".
 */
@Component({
  selector: 'gali6-tab-senales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-tab-senales.component.html',
  styleUrl: './gali6-tab-senales.component.scss',
})
export class Gali6TabSenalesComponent {
  private readonly mutations = inject(Gali6LiveMutationsService);
  private readonly highlight = inject(Gali6HighlightService);
  private readonly router = inject(Router);

  @Output() navigated = new EventEmitter<void>();

  readonly resolvingError = signal<string | null>(null);

  readonly items = computed<SenalPanelItem[]>(() => {
    this.mutations.version();

    const alertas: SenalPanelItem[] = MOCK_ALERTAS.filter(a => !a.resuelta && (a.tipo === 'critical' || a.tipo === 'warning'))
      .sort((a, b) => (a.tipo === 'critical' ? 0 : 1) - (b.tipo === 'critical' ? 0 : 1))
      .map(a => ({
        id: a.id,
        titulo: a.titulo,
        agente: a.agente ?? a.agenteOrigenNombre ?? '',
        tipo: a.tipo as string,
        categoria: 'alerta',
        dias: null,
      }));

    const senales: SenalPanelItem[] = MOCK_SENALES.filter(s => !s.resuelta && s.tipo !== 'completed')
      .sort((a, b) => a.ventanaDias - b.ventanaDias)
      .map(s => ({
        id: s.id,
        titulo: s.titulo,
        agente: s.agenteOrigenNombre ?? s.agente ?? '',
        tipo: s.tipo as string,
        categoria: 'senal',
        dias: s.ventanaDias,
      }));

    return [...alertas, ...senales];
  });

  resolver(id: string): void {
    const ok = this.mutations.resolverAlerta(id);
    if (ok) {
      this.highlight.trigger({ targetId: id, variant: 'success' });
    } else {
      this.resolvingError.set('No pude resolver esa alerta.');
      setTimeout(() => this.resolvingError.set(null), 3000);
    }
  }

  ver(id: string): void {
    this.router.navigate(['/gali-6/senales'], { queryParams: { signalId: id } });
    this.navigated.emit();
  }
}

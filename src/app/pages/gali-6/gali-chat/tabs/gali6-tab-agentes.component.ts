import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AGENTES_ESPECIALIZADOS, AgenteEspecializado } from '../../../../../../mocks/gali-v6/agentes-especializados';
import { MOCK_ALERTAS, MOCK_SENALES } from '../../../../../../mocks/gali-v5/senales.mock';
import { Gali6LiveMutationsService } from '../../services/gali6-live-mutations.service';

/**
 * Tab Agentes — fuente real de Gali 6 (AGENTES_ESPECIALIZADOS), no el catálogo
 * viejo de gali-5. Toggle real vía Gali6LiveMutationsService (mismo patrón que
 * pausarCampana/resolverAlerta). "Ver detalles" sin gate falso — el candado de
 * "modo experto" del panel viejo dependía de una key sin ningún escritor en
 * el repo. Ver plan §"Tab Agentes".
 */
@Component({
  selector: 'gali6-tab-agentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-tab-agentes.component.html',
  styleUrl: './gali6-tab-agentes.component.scss',
})
export class Gali6TabAgentesComponent {
  private readonly mutations = inject(Gali6LiveMutationsService);
  private readonly router = inject(Router);

  @Output() navigated = new EventEmitter<void>();

  readonly agentes = computed<AgenteEspecializado[]>(() => {
    this.mutations.version();
    return AGENTES_ESPECIALIZADOS.filter(a => a.estado !== 'disponible');
  });

  accionesHoyLabel(agente: AgenteEspecializado): string {
    if (agente.estado !== 'activo') return 'Desactivado';
    const nombre = agente.nombre.toLowerCase();
    const senales = MOCK_SENALES.filter(
      s => !s.resuelta && (s.agente.toLowerCase() === nombre || (s.agenteOrigenNombre ?? '').toLowerCase() === nombre),
    ).length;
    const alertas = MOCK_ALERTAS.filter(a => !a.resuelta && a.agente.toLowerCase() === nombre).length;
    const total = senales + alertas;
    return total > 0 ? `${total} acción${total === 1 ? '' : 'es'} hoy` : 'Sin actividad reciente';
  }

  toggle(agente: AgenteEspecializado): void {
    this.mutations.toggleAgenteEstado(agente.id);
  }

  verDetalles(): void {
    this.router.navigate(['/gali-6/agentes']);
    this.navigated.emit();
  }
}

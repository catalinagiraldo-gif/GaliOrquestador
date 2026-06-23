import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AGENTES_ESPECIALIZADOS,
  PAQUETE_PRINCIPIANTES,
  AgenteEspecializado,
  AgenteProcesoTipo,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
  TIER_LABEL,
} from '../../../../../mocks/gali-v6/agentes-especializados';

@Component({
  selector: 'app-gali6-agentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-agentes.component.html',
  styleUrls: ['./gali6-agentes.component.scss'],
})
export class Gali6AgentesComponent {
  readonly router = inject(Router);

  readonly paqueteBasico = PAQUETE_PRINCIPIANTES;
  readonly todosLosAgentes = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;
  readonly tierLabel = TIER_LABEL;

  readonly agentesActivos = computed(() =>
    this.todosLosAgentes.filter(a => a.estado === 'activo')
  );

  readonly agentesDisponibles = computed(() =>
    this.todosLosAgentes.filter(a => a.estado === 'disponible')
  );

  readonly expandedAgenteId = signal<string | null>(null);

  toggleDetalle(id: string): void {
    this.expandedAgenteId.update(cur => (cur === id ? null : id));
  }

  getProcesoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico: 'tipo--deterministic',
      'ia-ligera': 'tipo--ia-ligera',
      'ia-compleja': 'tipo--ia-compleja',
    };
    return map[tipo];
  }

  irAMarketplace(): void {
    this.router.navigate(['/gali-6/marketplace']);
  }
}

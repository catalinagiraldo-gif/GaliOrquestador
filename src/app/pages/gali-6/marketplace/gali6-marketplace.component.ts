import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AGENTES_ESPECIALIZADOS,
  AgenteEspecializado,
  AgenteTier,
  AgenteProcesoTipo,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
  TIER_LABEL,
} from '../../../../../mocks/gali-v6/agentes-especializados';

type TierFiltro = 'todos' | AgenteTier;
type TipoFiltro = 'todos' | AgenteProcesoTipo;

@Component({
  selector: 'app-gali6-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-marketplace.component.html',
  styleUrls: ['./gali6-marketplace.component.scss'],
})
export class Gali6MarketplaceComponent {
  readonly router = inject(Router);

  readonly todosLosAgentes = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;
  readonly tierLabel = TIER_LABEL;

  readonly tierFiltro = signal<TierFiltro>('todos');
  readonly tipoFiltro = signal<TipoFiltro>('todos');

  readonly tierTabs: { value: TierFiltro; label: string }[] = [
    { value: 'todos',  label: 'Todos' },
    { value: 'free',   label: '🟢 Gratis' },
    { value: 'paid',   label: '💳 Pago' },
    { value: 'tokens', label: '🪙 Tokens' },
  ];

  readonly tipoTabs: { value: TipoFiltro; label: string }[] = [
    { value: 'todos',        label: 'Todos los tipos' },
    { value: 'deterministico', label: '📊 Determinístico' },
    { value: 'ia-ligera',    label: '🤖 IA ligera' },
    { value: 'ia-compleja',  label: '✨ IA compleja' },
  ];

  readonly agentesFiltrados = computed(() => {
    const tier = this.tierFiltro();
    const tipo = this.tipoFiltro();
    return this.todosLosAgentes.filter(ag => {
      const matchTier = tier === 'todos' || ag.tier === tier;
      const matchTipo = tipo === 'todos' || ag.tipo === tipo;
      return matchTier && matchTipo;
    });
  });

  setTierFiltro(v: TierFiltro): void { this.tierFiltro.set(v); }
  setTipoFiltro(v: TipoFiltro): void { this.tipoFiltro.set(v); }

  getProcesoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico: 'tipo--deterministic',
      'ia-ligera': 'tipo--ia-ligera',
      'ia-compleja': 'tipo--ia-compleja',
    };
    return map[tipo];
  }

  activarAgente(ag: AgenteEspecializado): void {
    // Mock: navegar a agentes (en prototipo real abriría modal de confirmación/pago)
    this.router.navigate(['/gali-6/agentes']);
  }
}

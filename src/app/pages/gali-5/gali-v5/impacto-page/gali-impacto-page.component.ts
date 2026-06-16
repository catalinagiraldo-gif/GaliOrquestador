import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GaliImpactWidgetComponent } from '../components/gali-impact-widget/gali-impact-widget.component';
import { AbsPipe } from '../../../../shared/pipes/abs.pipe';
import { GaliImpactAction, GaliImpactSummary, GaliImpactMilestone } from '../models/gali-impact.model';
import WALLET from '../../../../../../mocks/gali-v5/wallet-transactions.json';

type FiltroAgente = 'todos' | 'Roax' | 'Vigilante' | 'Kronos' | 'Brujula' | 'Gali';

@Component({
  selector: 'app-gali-impacto-page',
  standalone: true,
  imports: [CommonModule, RouterLink, GaliImpactWidgetComponent, AbsPipe],
  templateUrl: './gali-impacto-page.component.html',
  styleUrl: './gali-impacto-page.component.scss',
})
export class GaliImpactoPageComponent implements OnInit {
  readonly ledger: GaliImpactAction[] = (WALLET as any).financialSummary.galiImpactLedger ?? [];
  readonly summaries: GaliImpactSummary[] = (WALLET as any).financialSummary.galiImpactSummaries ?? [];
  readonly milestones: GaliImpactMilestone[] = (WALLET as any).financialSummary.galiImpactMilestones ?? [];

  readonly filtroAgente = signal<FiltroAgente>('todos');
  readonly accionesVisibles = computed(() => {
    const f = this.filtroAgente();
    return f === 'todos' ? this.ledger : this.ledger.filter(a => a.agente === f);
  });

  readonly acumuladoTotal = computed(() => ({
    pesos: this.ledger.reduce((s, a) => s + (a.impacto_pesos ?? 0), 0),
    acciones: this.ledger.length,
    autonomas: this.ledger.filter(a => !a.requirio_aprobacion).length,
  }));

  readonly semanaActual = signal<GaliImpactSummary | null>(null);
  readonly semanaAnterior = signal<GaliImpactSummary | null>(null);

  readonly proximoMilestone = computed(() => this.milestones.find(m => !m.alcanzado) ?? null);
  readonly milestoneProgress = computed(() => {
    const m = this.proximoMilestone();
    if (!m) return 100;
    const actual = this.acumuladoTotal().pesos;
    return Math.min(100, Math.round((actual / m.umbral) * 100));
  });

  readonly milestoneAlcanzado = computed(() => this.milestones.filter(m => m.alcanzado));

  readonly agenteFiltros: FiltroAgente[] = ['todos', 'Roax', 'Vigilante', 'Kronos', 'Brujula', 'Gali'];

  ngOnInit(): void {
    const sorted = [...this.summaries].sort((a, b) => b.semana_iso - a.semana_iso);
    this.semanaActual.set(sorted[0] ?? null);
    this.semanaAnterior.set(sorted[1] ?? null);
  }

  setFiltro(f: FiltroAgente): void {
    this.filtroAgente.set(f);
  }

  formatPesos(val: number): string {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000)}k`;
    return `$${val}`;
  }

  formatTimestamp(ts: string): string {
    const d = new Date(ts);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  getAgenteColor(agente: string): string {
    const map: Record<string, string> = {
      Roax: '#f49a3d', Vigilante: '#22c55e', Kronos: '#60a5fa',
      Brujula: '#a78bfa', Gali: '#f49a3d',
    };
    return map[agente] ?? '#9ca3af';
  }

  getTipoIcon(tipo: string): string {
    const map: Record<string, string> = {
      escalo_campana: '📈', evito_novedad: '🛡',
      detecto_senal_predictiva: '🔮', optimizo_ruta_logistica: '🚚',
      alerto_stock: '⚠️', genero_diagnostico: '🧠',
      cambio_operadora: '🔄', escalo_presupuesto: '💰',
    };
    return map[tipo] ?? '✦';
  }

  deltaPct(): number {
    const actual = this.semanaActual()?.pesos_ahorrados ?? 0;
    const anterior = this.semanaAnterior()?.pesos_ahorrados ?? 1;
    return anterior > 0 ? Math.round(((actual - anterior) / anterior) * 100) : 0;
  }
}

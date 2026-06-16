import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GaliImpactSummary, GaliAgenteId } from '../../models/gali-impact.model';
import WALLET from '../../../../../../../mocks/gali-v5/wallet-transactions.json';

@Component({
  selector: 'app-gali-impact-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gali-impact-widget.component.html',
  styleUrl: './gali-impact-widget.component.scss',
})
export class GaliImpactWidgetComponent implements OnInit {
  @Input() mode: 'hub' | 'agent' | 'wallet' = 'hub';
  @Input() agenteId?: GaliAgenteId;

  private ledger: any[] = (WALLET as any).financialSummary.galiImpactLedger ?? [];
  private summaries: GaliImpactSummary[] = (WALLET as any).financialSummary.galiImpactSummaries ?? [];
  private roi: any = (WALLET as any).financialSummary.galiRoi ?? {};

  readonly semanaActual = signal<GaliImpactSummary | null>(null);
  readonly semanaAnterior = signal<GaliImpactSummary | null>(null);
  readonly acumuladoMes = signal({ pesos: 0, acciones: 0 });
  readonly tendenciaPct = signal(0);
  readonly statsAgente = signal({ acciones: 0, pesos: 0, novedades: 0 });

  ngOnInit(): void {
    const sorted = [...this.summaries].sort((a, b) => b.semana_iso - a.semana_iso);
    this.semanaActual.set(sorted[0] ?? null);
    this.semanaAnterior.set(sorted[1] ?? null);

    const mesActual = sorted[0]?.mes ?? 5;
    const accionesDelMes = this.ledger.filter(
      (a: any) => a.mes === mesActual && !a.requirio_aprobacion
    );
    const pesosAcumulados = accionesDelMes.reduce((s: number, a: any) => s + (a.impacto_pesos ?? 0), 0);
    this.acumuladoMes.set({ pesos: pesosAcumulados, acciones: accionesDelMes.length });

    const actual = sorted[0]?.pesos_ahorrados ?? 0;
    const anterior = sorted[1]?.pesos_ahorrados ?? 1;
    const pct = anterior > 0 ? Math.round(((actual - anterior) / anterior) * 100) : 0;
    this.tendenciaPct.set(pct);

    if (this.agenteId) {
      const accionesAgente = this.ledger.filter((a: any) => a.agente === this.agenteId && a.mes === mesActual);
      this.statsAgente.set({
        acciones: accionesAgente.length,
        pesos: accionesAgente.reduce((s: number, a: any) => s + (a.impacto_pesos ?? 0), 0),
        novedades: accionesAgente.filter((a: any) =>
          ['evito_novedad', 'cambio_operadora', 'optimizo_ruta_logistica'].includes(a.tipo_accion)
        ).length,
      });
    }
  }

  formatPesos(val: number): string {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000)}k`;
    return `$${val}`;
  }

  get tendenciaLabel(): string {
    const p = this.tendenciaPct();
    if (p > 0) return `↑${p}% vs semana pasada`;
    if (p < 0) return `↓${Math.abs(p)}% vs semana pasada`;
    return 'igual que la semana pasada';
  }

  get tendenciaClass(): string {
    const p = this.tendenciaPct();
    return p > 0 ? 'up' : p < 0 ? 'down' : 'neutral';
  }

  get roiMultiplier(): string {
    return this.roi.roi_multiplicador ?? '—';
  }
}

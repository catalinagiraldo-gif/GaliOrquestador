import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  GaliDecisionTheaterComponent,
  DecisionTheaterData,
  DecisionUrgency,
} from '../../gali-v5/components/gali-decision-theater/gali-decision-theater.component';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import KPIS from '../../../../../../mocks/gali-v5/kpis-global.json';
import LEDGER from '../../../../../../mocks/gali-v5/impact-ledger.json';
import PROJECTS from '../../../../../../mocks/gali-v5/projects.json';
import { MOCK_SENALES, MOCK_ALERTAS } from '../../../../../../mocks/gali-v5/senales.mock';

/**
 * Home "Hoy" — briefing / sala de decisiones (UI insignia de la Casita).
 * 4 bloques calmados: estado · 1 decisión · impacto de Gali · 1 palanca. Nada más.
 */
@Component({
  selector: 'app-hoy-home',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliDecisionTheaterComponent, GaliGlosarioDirective],
  templateUrl: './hoy-home.component.html',
  styleUrl: './hoy-home.component.scss',
})
export class HoyHomeComponent {
  private router = inject(Router);

  // ── Estado del negocio (kpis-global) ──
  readonly semana = (KPIS as any)._meta?.semana?.split('-W')[1] ?? '23';
  readonly objetivoMeta = signal<number>(Number(localStorage.getItem('gali-v2-objetivo-meta') ?? 100));
  readonly pedidosActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;
  readonly metaPct = computed(() =>
    Math.min(100, Math.round((this.pedidosActual / this.objetivoMeta()) * 100)),
  );
  /** Proyecto líder por revenue — fuente del ROAS real (ALS-4: nada hardcodeado). */
  private readonly proyectoLider = (PROJECTS as any[])
    .filter(p => p.id)
    .sort((a, b) => (b.revenue_semanal ?? 0) - (a.revenue_semanal ?? 0))[0];
  /** sparkline de momentum: rampa normalizada anclada al ROAS real del líder. */
  readonly trend = [0.64, 0.76, 0.86, 0.93, 1.0, 1.07].map(
    f => +((this.proyectoLider?.roas_real ?? 1) * f).toFixed(2),
  );
  readonly sparkPoints = computed(() => {
    const max = Math.max(...this.trend);
    const min = Math.min(...this.trend);
    const w = 88, h = 22;
    return this.trend
      .map((v, i) => {
        const x = (i / (this.trend.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  // ── Decisión de hoy: alerta crítica top — ALS-4: derivada de MOCK_ALERTAS ──
  private readonly alertaTop = MOCK_ALERTAS.find(a => a.tipo === 'critical' && a.opciones?.length);
  readonly decisionResuelta = signal(false);
  readonly decision = signal<DecisionTheaterData>(
    this.alertaTop
      ? {
          signalId: this.alertaTop.id,
          agente: this.alertaTop.agente.charAt(0).toUpperCase() + this.alertaTop.agente.slice(1),
          agenteColor: this.alertaTop.agenteColor ?? '#fbbf24',
          urgencia: this.alertaTop.tipo as DecisionUrgency,
          titulo: this.alertaTop.titulo,
          contexto: this.alertaTop.descripcion,
          riesgoSiNoActua: this.alertaTop.impacto,
          impactoEstimado: this.alertaTop.impactoSiActua ?? this.alertaTop.impacto,
          options: this.alertaTop.opciones!.map(o => ({
            id: o.id,
            label: o.label,
            description: o.description,
            impactoEstimado: o.impactoEstimado,
            isPrimary: o.isPrimary,
          })),
          pendingQueueCount: MOCK_ALERTAS.filter(a => a.tipo === 'critical').length - 1,
        }
      : {
          signalId: 'no-decision',
          agente: 'Gali',
          agenteColor: '#ff6102',
          urgencia: 'medium' as DecisionUrgency,
          titulo: 'Todo en orden',
          contexto: 'No hay decisiones urgentes pendientes. Gali está monitoreando.',
          riesgoSiNoActua: '',
          impactoEstimado: '',
          options: [],
          pendingQueueCount: 0,
        },
  );

  /** Confianza graduada: dejar que Gali resuelva esto solo la próxima vez. */
  readonly delegarProxima = signal(
    localStorage.getItem('gali-v2-delegar-vigilante') === 'true',
  );

  readonly ultimaAccionGali = 'hace 12 min · escaló campaña +15%';

  // ── Impacto de Gali (ledger) ──
  readonly impacto = (LEDGER as any).summary_semana;

  // ── Palanca predictiva (señal top, derivada de senales.mock) ──
  private readonly senalPalanca =
    MOCK_SENALES.find(s => s.id === 'sen-006') ??
    MOCK_SENALES.find(s => s.canLaunch && (s.tipo === 'opportunity' || s.tipo === 'trend'));
  readonly palanca = {
    titulo: this.senalPalanca?.titulo ?? 'Ventana de mercado',
    detalle: (this.senalPalanca?.contextoMacromundo ?? '').split('. ')[0] + '.',
    ventanaDias: this.senalPalanca?.ventanaDias ?? 0,
  };

  onOption(ev: { signalId: string; optionId: string }): void {
    this.decisionResuelta.set(true);
  }

  onDecidirDespues(): void {
    this.decisionResuelta.set(true);
  }

  onVerCola(): void {
    this.router.navigate(['/gali-v5-v2/proyectos']);
  }

  toggleDelegar(): void {
    const next = !this.delegarProxima();
    this.delegarProxima.set(next);
    localStorage.setItem('gali-v2-delegar-vigilante', String(next));
  }

  lanzarPalanca(): void {
    this.router.navigate(['/gali-v5-v2/proyectos/nuevo']);
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  GaliDecisionTheaterComponent,
  DecisionTheaterData,
  DecisionUrgency,
} from '../../gali-5/gali-v5/components/gali-decision-theater/gali-decision-theater.component';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';
import LEDGER from '../../../../../mocks/gali-v5/impact-ledger.json';
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import { MOCK_SENALES, MOCK_ALERTAS } from '../../../../../mocks/gali-v5/senales.mock';

/** Home "Hoy" de Gali 6 — los 4 bloques calmados: estado · decisión · impacto · palanca. */
@Component({
  selector: 'app-gali6-hoy-home',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliDecisionTheaterComponent, GaliGlosarioDirective, Gali6PageHeaderComponent],
  templateUrl: './gali6-hoy-home.component.html',
  styleUrl: './gali6-hoy-home.component.scss',
})
export class Gali6HoyHomeComponent {
  private router = inject(Router);

  readonly semana = (KPIS as any)._meta?.semana?.split('-W')[1] ?? '23';
  readonly objetivoMeta = signal<number>(Number(localStorage.getItem('gali-6-objetivo-meta') ?? 100));
  readonly pedidosActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;
  readonly metaPct = computed(() =>
    Math.min(100, Math.round((this.pedidosActual / this.objetivoMeta()) * 100)),
  );

  private readonly proyectoLider = (PROJECTS as any[])
    .filter(p => p.id)
    .sort((a, b) => (b.revenue_semanal ?? 0) - (a.revenue_semanal ?? 0))[0];

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

  private readonly alertaTop = MOCK_ALERTAS.find(a => a.tipo === 'critical' && a.opciones?.length);
  readonly decisionResuelta = signal(false);
  readonly decisionToast = signal<string | null>(null);

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
          agenteColor: '#f49a3d',
          urgencia: 'medium' as DecisionUrgency,
          titulo: 'Todo en orden',
          contexto: 'No hay decisiones urgentes pendientes. Gali 6 está monitoreando.',
          riesgoSiNoActua: '',
          impactoEstimado: '',
          options: [],
          pendingQueueCount: 0,
        },
  );

  readonly delegarProxima = signal(localStorage.getItem('gali-6-delegar-vigilante') === 'true');
  readonly ultimaAccionGali = 'hace 12 min · escaló campaña +15%';

  readonly impacto = (LEDGER as any).summary_semana;

  private readonly senalPalanca =
    MOCK_SENALES.find(s => s.id === 'sen-006') ??
    MOCK_SENALES.find(s => s.canLaunch && (s.tipo === 'opportunity' || s.tipo === 'trend'));
  readonly palanca = {
    titulo: this.senalPalanca?.titulo ?? 'Ventana de mercado',
    detalle: (this.senalPalanca?.contextoMacromundo ?? '').split('. ')[0] + '.',
    ventanaDias: this.senalPalanca?.ventanaDias ?? 0,
  };

  onOption(ev: { signalId: string; optionId: string }): void {
    const opcion = this.decision().options.find(o => o.id === ev.optionId);
    const msg = opcion
      ? `✓ "${opcion.label}" — ${opcion.impactoEstimado || 'Gali lo procesa ahora'}`
      : '✓ Decisión tomada — Gali lo procesa ahora';
    this.decisionToast.set(msg);
    setTimeout(() => { this.decisionToast.set(null); this.decisionResuelta.set(true); }, 3500);
  }

  onDecidirDespues(): void {
    this.decisionToast.set('◷ Decisión diferida — Gali te recuerda mañana si sigue siendo relevante');
    setTimeout(() => { this.decisionToast.set(null); this.decisionResuelta.set(true); }, 3500);
  }

  onVerCola(): void {
    this.router.navigate(['/gali-6/proyectos']);
  }

  toggleDelegar(): void {
    const next = !this.delegarProxima();
    this.delegarProxima.set(next);
    localStorage.setItem('gali-6-delegar-vigilante', String(next));
  }

  lanzarPalanca(): void {
    this.router.navigate(['/gali-6/proyectos/nuevo']);
  }
}

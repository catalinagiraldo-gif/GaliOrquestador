import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  GaliDecisionTheaterComponent,
  DecisionTheaterData,
} from '../../gali-v5/components/gali-decision-theater/gali-decision-theater.component';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';
import LEDGER from '../../../../../mocks/gali-v5/impact-ledger.json';

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
  /** sparkline de momentum (ROAS por semana del proyecto líder) */
  readonly trend = [1.2, 1.65, 1.93, 2.1, 2.3, 2.5];
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

  // ── Decisión de hoy (alerta crítica top) ──
  readonly decisionResuelta = signal(false);
  readonly decision = signal<DecisionTheaterData>({
    signalId: 'alt-001',
    agente: 'Vigilante',
    agenteColor: '#fbbf24',
    urgencia: 'critical',
    titulo: 'Coordinadora Bogotá: 15% novedad hoy',
    contexto:
      'Coordinadora lleva 3 días con novedad > 12% en rutas de Bogotá (hoy 15.3%). ' +
      '12 de tus pedidos activos van a Bogotá con esta transportadora.',
    riesgoSiNoActua: '~3 novedades estimadas si no actúas · ~$51k en riesgo',
    impactoEstimado: '~$51k protegidos si cambias ahora',
    options: [
      {
        id: 'a',
        label: 'Cambiar 12 pedidos a Servientrega',
        description: 'Tasa actual de Servientrega: 3.8%',
        impactoEstimado: '~$51k protegidos',
        isPrimary: true,
      },
      {
        id: 'b',
        label: 'Cambiar solo los de hoy',
        description: 'Esperar datos de mañana antes de mover el resto',
        impactoEstimado: 'Menor alcance',
        isPrimary: false,
      },
    ],
    pendingQueueCount: 2,
  });

  /** Confianza graduada: dejar que Gali resuelva esto solo la próxima vez. */
  readonly delegarProxima = signal(
    localStorage.getItem('gali-v2-delegar-vigilante') === 'true',
  );

  readonly ultimaAccionGali = 'hace 12 min · escaló campaña +15%';

  // ── Impacto de Gali (ledger) ──
  readonly impacto = (LEDGER as any).summary_semana;

  // ── Palanca predictiva (sen-006) ──
  readonly palanca = {
    titulo: 'Ventana de mercado en Cali',
    detalle:
      'Búsquedas de "collar mascotas" en Cali subieron 34% esta semana. Tienes ~7 días antes de que la competencia reaccione.',
    ventanaDias: 7,
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

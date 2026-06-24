import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  MOCK_HOY_ESTADO,
  HoyEstado,
  AgenteActivo,
  AlertaCola,
  SenalHoy,
  ProyectoContrib,
} from '../../../../../mocks/gali-v6/hoy-estado';
import { getObjetivo, G6Objetivo } from '../../../../../mocks/gali-v6/objetivo';

@Component({
  selector: 'app-gali6-hoy-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-hoy-home.component.html',
  styleUrl: './gali6-hoy-home.component.scss',
})
export class Gali6HoyHomeComponent {
  readonly router = inject(Router);

  readonly estado: HoyEstado = MOCK_HOY_ESTADO;
  readonly decision = this.estado.decision_urgente;
  readonly objetivo = signal<G6Objetivo>(getObjetivo());

  readonly decisionDismissed = signal(false);
  readonly toastMsg = signal<string | null>(null);
  readonly verAporte = signal(false);

  readonly pedidosPct = computed(() =>
    Math.min(100, Math.round((this.estado.pedidosActual / this.estado.pedidosMeta) * 100))
  );

  readonly sparkMax = computed(() =>
    Math.max(...this.estado.sparkPoints.map(p => p.v), 1)
  );

  getSparkHeight(v: number): number {
    return Math.round((v / this.sparkMax()) * 22);
  }

  getDecisionClass(): string {
    const map: Record<string, string> = {
      alerta: 'hero--alerta',
      oportunidad: 'hero--oportunidad',
      info: 'hero--info',
    };
    return map[this.decision.tipo] ?? 'hero--info';
  }

  getProcesoLabel(): string {
    return this.decision.procesaTipo === 'deterministico'
      ? '📊 Dato real'
      : this.decision.procesaTipo === 'ia-ligera'
      ? '🤖 IA guiada'
      : '✨ Análisis IA';
  }

  getProcesoClass(): string {
    const map: Record<string, string> = {
      deterministico:  'chip-proceso--deterministic',
      'ia-ligera':     'chip-proceso--ia-ligera',
      'ia-compleja':   'chip-proceso--ia-compleja',
    };
    return map[this.decision.procesaTipo] ?? 'chip-proceso--deterministic';
  }

  onCtaPrincipal(): void {
    if (this.decision.senalId) {
      this.router.navigate(['/gali-6/senales'], {
        queryParams: { signalId: this.decision.senalId },
      });
    } else {
      this.router.navigate(['/gali-6/senales']);
    }
  }

  onDismiss(): void {
    this.toastMsg.set('◷ Te recordaré esto más tarde');
    setTimeout(() => {
      this.toastMsg.set(null);
      this.decisionDismissed.set(true);
    }, 2500);
  }

  onAlertaClick(a: AlertaCola): void {
    this.router.navigate(['/gali-6/senales'], { queryParams: { signalId: a.senalId } });
  }

  onAgenteClick(_a: AgenteActivo): void {
    this.router.navigate(['/gali-6/agentes']);
  }

  toggleAporte(): void {
    this.verAporte.update(v => !v);
  }

  irAMarketing(): void {
    this.router.navigate(['/gali-6/marketing']);
  }

  irAMiContextoObjetivo(): void {
    this.router.navigate(['/gali-6/mi-negocio/objetivo']);
  }

  getContribPct(p: ProyectoContrib): number {
    const meta = this.estado.pedidosMeta || 100;
    return Math.min(100, Math.round((p.pedidosSem / meta) * 100));
  }

  getContribGap(): number {
    const meta = this.estado.pedidosMeta || 100;
    const usado = (this.estado.proyectoContribuciones ?? [])
      .reduce((s, p) => s + p.pedidosSem, 0);
    return Math.max(0, Math.round(((meta - usado) / meta) * 100));
  }
}

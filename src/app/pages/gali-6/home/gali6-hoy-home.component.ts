import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  MOCK_HOY_ESTADO,
  HoyEstado,
  AccesoRapido,
  KpiHoy,
} from '../../../../../mocks/gali-v6/hoy-estado';

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
  readonly kpis: KpiHoy[] = this.estado.kpis;
  readonly accesos: AccesoRapido[] = this.estado.accesos_rapidos;

  readonly decisionDismissed = signal(false);
  readonly toastMsg = signal<string | null>(null);

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
      deterministico: 'chip-proceso--deterministic',
      'ia-ligera': 'chip-proceso--ia-ligera',
      'ia-compleja': 'chip-proceso--ia-compleja',
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

  onAcceso(ar: AccesoRapido): void {
    if (ar.route) {
      this.router.navigate([ar.route]);
    } else if (ar.abrePanel) {
      this.toastMsg.set('✦ Panel de Gali próximamente');
      setTimeout(() => this.toastMsg.set(null), 2500);
    }
  }

  onKpiClick(kpi: KpiHoy): void {
    if (kpi.detailRoute) {
      this.router.navigate([kpi.detailRoute]);
    }
  }
}

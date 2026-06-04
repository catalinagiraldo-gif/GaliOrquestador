import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MOCK_SENALES, MOCK_ALERTAS, GaliSignal, GaliAlerta, SignalType } from '../../../../../../mocks/gali-v5/senales.mock';

type FilterTab = 'todas' | 'senales' | 'alertas' | 'completadas';

@Component({
  selector: 'app-senales-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './senales-page.component.html',
  styleUrls: ['./senales-page.component.scss'],
})
export class SenalesPageComponent {
  readonly senales: GaliSignal[] = MOCK_SENALES;
  readonly alertas: GaliAlerta[] = MOCK_ALERTAS;
  readonly filters: FilterTab[] = ['todas', 'senales', 'alertas', 'completadas'];

  readonly activeFilter = signal<FilterTab>('todas');

  readonly senalesVisibles = computed(() => {
    const f = this.activeFilter();
    if (f === 'alertas') return [];
    if (f === 'completadas') return this.senales.filter(s => s.tipo === 'completed');
    return this.senales.filter(s => s.tipo !== 'completed');
  });

  readonly alertasVisibles = computed(() => {
    const f = this.activeFilter();
    if (f === 'senales' || f === 'completadas') return [];
    return this.alertas;
  });

  setFilter(f: FilterTab): void { this.activeFilter.set(f); }

  filterLabel(f: FilterTab): string {
    return { todas: 'Todas', senales: 'Señales', alertas: 'Alertas', completadas: 'Completadas' }[f];
  }

  private readonly badgeLabels: Record<SignalType, string> = {
    scale: '⚡ Escala',
    trend: '🔭 Tendencia',
    opportunity: '💎 Oportunidad',
    risk: '⚠ Riesgo',
    completed: '✅ Completada',
  };

  private readonly agenteLabels: Record<string, string> = {
    roax: 'Roax', ada: 'ADA Spy', vigilante: 'Vigilante', kronos: 'Kronos', chatea: 'Chatea Pro',
  };

  getBadgeLabel(tipo: SignalType): string {
    return this.badgeLabels[tipo] ?? tipo;
  }

  agenteLabel(agente: string): string {
    return this.agenteLabels[agente] ?? agente;
  }

  handleSenalCta(senal: GaliSignal): void {
    console.log('señal CTA', senal.id);
  }

  handleAlertaCta(alerta: GaliAlerta): void {
    console.log('alerta CTA', alerta.id);
  }
}

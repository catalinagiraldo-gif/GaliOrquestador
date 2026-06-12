import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoTimelineData, TimelineHitoItem } from './proyecto-timeline.model';

@Component({
  selector: 'app-proyecto-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-timeline.component.html',
  styleUrls: ['./proyecto-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoTimelineComponent {
  @Input({ required: true }) timeline!: ProyectoTimelineData;

  hoveredHito = signal<TimelineHitoItem | null>(null);

  get isGantt(): boolean {
    return !!(this.timeline.agenteLane || this.timeline.hitoLane || this.timeline.metricasLane);
  }

  get semanas(): number[] {
    const total = this.timeline.totalSemanas ?? 6;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  get estadoLabel(): string {
    const map: Record<string, string> = {
      borrador:       'Borrador',
      recien_lanzado: 'Recién lanzado',
      activo:         'En campaña',
      en_escala:      'En escala',
      pausado:        'Pausado',
      cerrado:        'Cerrado',
    };
    return map[this.timeline.estadoActual] ?? this.timeline.estadoActual;
  }

  get estadoClass(): string {
    return `estado-pill--${this.timeline.estadoActual}`;
  }

  get contextoLabel(): string {
    return this.timeline.semanaActual ? `Semana ${this.timeline.semanaActual} de campaña activa` : '';
  }

  get currentIndex(): number {
    return this.timeline.eventos.findIndex(e => e.esActual);
  }

  getActionsForWeek(semana: number) {
    return (this.timeline.agenteLane ?? []).filter(a => a.semana === semana);
  }

  getHitoForWeek(semana: number): TimelineHitoItem | null {
    return (this.timeline.hitoLane ?? []).find(h => h.semana === semana) ?? null;
  }

  getMetricaForWeek(semana: number) {
    return (this.timeline.metricasLane ?? []).find(m => m.semana === semana) ?? null;
  }

  get maxRoas(): number {
    const pts = this.timeline.metricasLane ?? [];
    return Math.max(...pts.map(p => p.roas), 1);
  }

  roasBarHeight(semana: number): number {
    const m = this.getMetricaForWeek(semana);
    if (!m) return 0;
    return Math.round((m.roas / this.maxRoas) * 48);
  }

  isCurrentWeek(semana: number): boolean {
    return semana === (this.timeline.semanaActual ?? -1);
  }

  isFutureWeek(semana: number): boolean {
    return semana > (this.timeline.semanaActual ?? 0);
  }
}

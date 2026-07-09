import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaliMemoryItem } from '../models/gali6-memory.model';

const OBJETIVO_KEY = 'gali-6-objetivo-meta';

/**
 * Tab Memoria — "Deshacer" resuelto por ítem, no con una política global.
 * Solo el ítem de objetivo (config) tiene reversión real y alcanzable
 * (localStorage.removeItem + toast). Los ítems `decision` no tienen una
 * mutación real y segura que este componente pueda alcanzar sin inventar
 * rollback de campañas/transportadoras — se muestran de solo lectura, sin
 * botón. Nunca se reproduce el stub `console.log()` del panel viejo.
 * Ver plan §"Tab Memoria".
 */
@Component({
  selector: 'gali6-tab-memoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-tab-memoria.component.html',
  styleUrl: './gali6-tab-memoria.component.scss',
})
export class Gali6TabMemoriaComponent {
  private readonly refreshTrigger = signal(0);
  readonly toastMsg = signal<string | null>(null);

  readonly items = computed<GaliMemoryItem[]>(() => {
    this.refreshTrigger();
    const meta = this.loadObjetivoMeta();
    return [
      {
        id: 'm1',
        type: 'pattern',
        icon: '📈',
        title: 'ROAS mejora con videos cortos',
        desc: 'Los creativos de menos de 15s generan 22% más ROAS que los de más de 30s en tus campañas activas.',
        date: 'Hace 3 días',
        confidence: 94,
        canUndo: false,
      },
      {
        id: 'm2',
        type: 'decision',
        icon: '🚚',
        title: 'Cambio a Servientrega — Cali',
        desc: 'Gali cambió de transportadora en Cali por alta tasa de novedad con Coordinadora.',
        date: 'Hace 5 días',
        confidence: 100,
        canUndo: false,
      },
      {
        id: 'm3',
        type: 'config',
        icon: '🎯',
        title: `Objetivo semanal: ${meta} pedidos/semana`,
        desc: 'Gali monitorea tu progreso contra esta meta y te avisa cuando necesitas ajustarla.',
        date: 'Guardado',
        confidence: 100,
        canUndo: true,
      },
      {
        id: 'm4',
        type: 'pattern',
        icon: '🕒',
        title: 'Mejor hora de envío: 6–8pm',
        desc: 'Tus mensajes de WhatsApp tienen mejor tasa de respuesta en ese rango horario.',
        date: 'Hace 6 días',
        confidence: 87,
        canUndo: false,
      },
      {
        id: 'm5',
        type: 'decision',
        icon: '⏸',
        title: 'Pausa campaña Difusor Aromaterapia — Weekend',
        desc: 'Gali pausó la campaña los fines de semana por bajo rendimiento histórico en esos días.',
        date: 'Hace 1 semana',
        confidence: 100,
        canUndo: false,
      },
      {
        id: 'm6',
        type: 'insight',
        icon: '👥',
        title: 'Segmento más rentable: Mujeres 25–34 Bogotá',
        desc: 'Este segmento representa el 41% de tus ventas con el margen más alto.',
        date: 'Hace 4 días',
        confidence: 91,
        canUndo: false,
      },
    ];
  });

  undo(item: GaliMemoryItem): void {
    if (item.id !== 'm3') return;
    try {
      localStorage.removeItem(OBJETIVO_KEY);
    } catch {
      /* localStorage no disponible */
    }
    this.refreshTrigger.update(v => v + 1);
    this.mostrarToast('Objetivo restaurado al valor por defecto.');
  }

  confidenceTone(confidence: number): 'ok' | 'info' | 'warn' {
    if (confidence >= 90) return 'ok';
    if (confidence >= 70) return 'info';
    return 'warn';
  }

  private loadObjetivoMeta(): number {
    try {
      return Number(localStorage.getItem(OBJETIVO_KEY) ?? 100);
    } catch {
      return 100;
    }
  }

  private mostrarToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }
}

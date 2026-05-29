import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SkillStatus = 'active' | 'paused' | 'executing';

interface RunLog {
  fecha: string;
  resultado: 'ejecutado' | 'no_activado';
  detalle: string;
  impacto: string;
}

export interface SkillRule {
  id: string;
  nombre: string;
  descripcion: string;
  trigger: { event: string; agent: string; interval: string };
  condition: { metric: string; operator: string; value: number; unit?: string; duration?: string };
  action: { type: string; params: Record<string, unknown> };
  notification: { message: string; cta?: string };
  status: SkillStatus;
  ultima_ejecucion: string;
  ejecuciones_total: number;
  runHistory: RunLog[];
}

@Component({
  selector: 'gali-skill-builder-v2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-skill-builder-v2.component.html',
  styleUrl: './gali-skill-builder-v2.component.scss',
})
export class GaliSkillBuilderV2Component {
  @Input() skill!: SkillRule;
  @Input() editMode = false;
  @Output() saved = new EventEmitter<SkillRule>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() toggled = new EventEmitter<{ id: string; newStatus: SkillStatus }>();

  readonly isEditing = signal(false);

  startEdit(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.cancelled.emit();
  }

  saveSkill(): void {
    this.isEditing.set(false);
    this.saved.emit(this.skill);
  }

  toggleStatus(): void {
    const newStatus: SkillStatus = this.skill.status === 'active' ? 'paused' : 'active';
    this.toggled.emit({ id: this.skill.id, newStatus });
  }

  get agentLabel(): string {
    const labels: Record<string, string> = {
      roax: 'Roax',
      vigilante: 'Vigilante',
      chatea: 'Chatea Pro',
      ada: 'ADA Spy',
    };
    return labels[this.skill.trigger.agent] ?? this.skill.trigger.agent;
  }

  get actionLabel(): string {
    const labels: Record<string, string> = {
      pause_and_activate: 'Pausar + activar alternativo',
      budget_increase: 'Aumentar presupuesto',
      reroute_orders: 'Reasignar pedidos',
      send_notification: 'Enviar notificación',
    };
    return labels[this.skill.action.type] ?? this.skill.action.type;
  }

  trackByFecha(_: number, r: RunLog): string {
    return r.fecha;
  }
}

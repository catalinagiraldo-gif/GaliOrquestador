import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type SkillStatus = 'active' | 'paused' | 'executing';

interface RunLog {
  fecha: string;
  resultado: 'ejecutado' | 'no_activado';
  detalle: string;
  impacto: string;
}

export interface SkillAgente {
  nombre: string;
  color: string;
}

export interface SkillRegla {
  id: string;
  texto: string;
  agenteAsignado: string;
  agenteColor: string;
  activa: boolean;
}

export interface SkillRule {
  id: string;
  nombre: string;
  descripcion: string;
  // trigger/condition/action eliminados — pertenecen al Agente, no a la Skill
  notification?: { message: string; cta?: string };
  status: SkillStatus;
  ultima_ejecucion: string;
  ejecuciones_total: number;
  runHistory: RunLog[];
  agentesQueLaUsan?: SkillAgente[];
  reglas?: SkillRegla[];
}

@Component({
  selector: 'gali-skill-builder-v2',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gali-skill-builder-v2.component.html',
  styleUrl: './gali-skill-builder-v2.component.scss',
})
export class GaliSkillBuilderV2Component {
  private router = inject(Router);

  @Input() skill!: SkillRule;
  @Input() editMode = false;
  @Output() saved = new EventEmitter<SkillRule>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() toggled = new EventEmitter<{ id: string; newStatus: SkillStatus }>();

  readonly isEditing = signal(false);
  readonly localStatus = signal<SkillStatus | null>(null);
  readonly showNewRule = signal(false);
  readonly newRuleText = signal('');
  readonly showAssignDropdown = signal(false);

  readonly availableAgents: SkillAgente[] = [
    { nombre: 'Roax', color: '#f97316' },
    { nombre: 'Vigilante', color: '#fbbf24' },
    { nombre: 'Chatea Pro', color: '#34d399' },
    { nombre: 'ADA Spy', color: '#818cf8' },
    { nombre: 'Kronos', color: '#a855f7' },
  ];

  get currentStatus(): SkillStatus {
    return this.localStatus() ?? this.skill.status;
  }

  startEdit(): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { id: this.skill.id },
    });
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
    const newStatus: SkillStatus = this.currentStatus === 'active' ? 'paused' : 'active';
    this.localStatus.set(newStatus);
    this.toggled.emit({ id: this.skill.id, newStatus });
  }

  goToProyectos(): void {
    this.router.navigate(['/gali-v5/proyectos']);
  }

  newFromHistory(): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { basado_en: this.skill.id },
    });
  }

  get agentLabel(): string {
    return this.skill.agentesQueLaUsan?.[0]?.nombre ?? 'Agente';
  }

  trackByFecha(_: number, r: RunLog): string {
    return r.fecha;
  }

  assignAgentToSkill(agent: SkillAgente): void {
    if (!this.skill.agentesQueLaUsan) this.skill.agentesQueLaUsan = [];
    const alreadyAssigned = this.skill.agentesQueLaUsan.some(a => a.nombre === agent.nombre);
    if (!alreadyAssigned) {
      this.skill.agentesQueLaUsan = [...this.skill.agentesQueLaUsan, agent];
      const stored = JSON.parse(localStorage.getItem('gali_skill_agents') ?? '{}');
      stored[this.skill.id] = this.skill.agentesQueLaUsan.map(a => a.nombre);
      localStorage.setItem('gali_skill_agents', JSON.stringify(stored));
    }
    this.showAssignDropdown.set(false);
  }

  addRule(): void {
    const text = this.newRuleText().trim();
    if (!text) return;
    if (!this.skill.reglas) this.skill.reglas = [];
    this.skill.reglas.push({
      id: `rule-${Date.now()}`,
      texto: text,
      agenteAsignado: this.agentLabel,
      agenteColor: '#f97316',
      activa: true,
    });
    this.newRuleText.set('');
    this.showNewRule.set(false);
  }

  prefillRuleExample(): void {
    this.newRuleText.set(`Si el CTR cae por debajo del 0.8% durante más de 48h, ${this.agentLabel} debe pausar la campaña y notificarme con un resumen del impacto.`);
  }
}

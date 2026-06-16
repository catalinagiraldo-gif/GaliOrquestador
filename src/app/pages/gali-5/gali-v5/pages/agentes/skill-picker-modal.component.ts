import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface PickableSkill {
  name: string;
  description: string;
  category: string;
  agentes: string[];
}

const SKILL_CATALOG: PickableSkill[] = [
  { name: 'Auto-pausa si CTR cae', description: 'Pausa adsets cuando el CTR cae bajo umbral definido por 48h consecutivas.', category: 'Meta Ads', agentes: ['Roax'] },
  { name: 'Escalado ROAS automático', description: 'Incrementa presupuesto cuando ROAS supera la meta durante 3 días.', category: 'Meta Ads', agentes: ['Roax'] },
  { name: 'Smart routing novedad', description: 'Reasigna pedidos en novedad a la transportadora con mejor tasa en esa ruta.', category: 'Logística', agentes: ['Vigilante'] },
  { name: 'Alerta de stock-out', description: 'Notifica cuando el stock cae bajo umbral según ritmo de pedidos.', category: 'Inventario', agentes: ['ADA Spy', 'Vigilante'] },
  { name: 'Confirmación automática pedidos', description: 'Confirma pedidos por WhatsApp sin intervención manual.', category: 'CAS', agentes: ['Chatea Pro'] },
  { name: 'Recuperación de carritos WhatsApp', description: 'Sigue up con clientes que no completaron el pago.', category: 'CAS', agentes: ['Chatea Pro'] },
  { name: 'Post-mortem campaña fallida', description: 'Genera análisis automático cuando ROAS cae bajo break-even.', category: 'Análisis', agentes: ['Roax', 'Kronos'] },
  { name: 'Alerta umbral P&L semanal', description: 'Alerta si la utilidad neta semanal cae bajo el objetivo definido.', category: 'Finanzas', agentes: ['Kronos'] },
  { name: 'Facturación automática Siigo', description: 'Factura en Siigo cuando el pedido pasa a estado Entregado.', category: 'Finanzas', agentes: ['Kronos'] },
  { name: 'Alerta de oportunidades diaria', description: 'Escanea el catálogo y reporta productos con score > 80.', category: 'Research', agentes: ['ADA Spy'] },
];

@Component({
  selector: 'app-skill-picker-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './skill-picker-modal.component.html',
  styleUrl: './skill-picker-modal.component.scss',
})
export class SkillPickerModalComponent {
  @Input() agentName = '';
  @Input() assignedSkills: string[] = [];
  @Output() skillAdded = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  readonly searchQuery = signal('');

  readonly availableSkills = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return SKILL_CATALOG.filter(s =>
      !this.assignedSkills.includes(s.name) &&
      (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    );
  });

  addSkill(skill: PickableSkill): void {
    this.skillAdded.emit(skill.name);
  }

  close(): void {
    this.closed.emit();
  }
}

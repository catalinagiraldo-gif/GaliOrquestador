import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export type ModuleAgentId = 'roax' | 'vigilante' | 'chatea' | 'ada' | 'kronos';

@Component({
  selector: 'gali-module-activation-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali-module-activation-bar.component.html',
  styleUrl: './gali-module-activation-bar.component.scss',
})
export class GaliModuleActivationBarComponent implements OnInit {
  @Input({ required: true }) agentId!: ModuleAgentId;
  @Input({ required: true }) sectionName!: string;
  @Input() skillSuggestion = '';

  private router = inject(Router);
  readonly dismissed = signal(false);

  readonly agentMeta: Record<ModuleAgentId, { nombre: string; color: string; emoji: string; status: string }> = {
    roax:      { nombre: 'Roax',       color: '#f97316', emoji: '⚡', status: 'Activo — ROAS 2.9x' },
    vigilante: { nombre: 'Vigilante',  color: '#fbbf24', emoji: '🚛', status: 'Monitoreando' },
    chatea:    { nombre: 'Chatea Pro', color: '#34d399', emoji: '💬', status: 'Activo — 43/47 resueltos' },
    ada:       { nombre: 'ADA Spy',    color: '#818cf8', emoji: '🔍', status: 'En espera' },
    kronos:    { nombre: 'Kronos',     color: '#60a5fa', emoji: '💎', status: 'P&L actualizado' },
  };

  get meta() { return this.agentMeta[this.agentId]; }

  private get storageKey(): string {
    return `gali_module_bar_dismissed_${this.sectionName.toLowerCase().replace(/\s+/g, '_')}`;
  }

  ngOnInit(): void {
    if (localStorage.getItem(this.storageKey)) {
      this.dismissed.set(true);
    }
  }

  dismiss(): void {
    localStorage.setItem(this.storageKey, '1');
    this.dismissed.set(true);
  }

  goToSkills(): void {
    this.router.navigate(['/gali-v5/skills'], {
      queryParams: { agente: this.agentId }
    });
  }

  createSkill(): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { agente: this.agentId, contexto: this.sectionName }
    });
  }
}

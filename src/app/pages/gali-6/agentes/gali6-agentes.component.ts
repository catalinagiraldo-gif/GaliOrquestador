import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AGENTES_ESPECIALIZADOS,
  PAQUETE_PRINCIPIANTES,
  AgenteEspecializado,
  AgenteProcesoTipo,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
  TIER_LABEL,
} from '../../../../../mocks/gali-v6/agentes-especializados';

@Component({
  selector: 'app-gali6-agentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-agentes.component.html',
  styleUrls: ['./gali6-agentes.component.scss'],
})
export class Gali6AgentesComponent {
  readonly router = inject(Router);

  readonly paqueteBasico = PAQUETE_PRINCIPIANTES;
  readonly todosLosAgentes = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;
  readonly tierLabel = TIER_LABEL;

  readonly agentesActivos = computed(() =>
    this.agentesEstado().filter(a => a.estado === 'activo')
  );

  readonly agentesDisponibles = computed(() =>
    this.todosLosAgentes.filter(a => a.estado === 'disponible')
  );

  readonly expandedAgenteId = signal<string | null>(null);
  readonly showCrearModal = signal(false);
  readonly toastMsg = signal<string | null>(null);

  /** Mutable copy of agentes with extra interactive state */
  readonly agentesEstado = signal(
    AGENTES_ESPECIALIZADOS.map(ag => ({
      ...ag,
      estado: ag.estado as 'activo' | 'pausado' | 'disponible',
      autonomiaPct: 60,
      skills: ag.skillsDefecto.map(sk => ({ ...sk, activa: true })),
      reglas: ag.reglasDefecto.map((r, i) => ({ ...r, id: `${ag.id}-r${i}`, activa: true })),
    }))
  );

  toggleDetalle(id: string): void {
    this.expandedAgenteId.update(cur => (cur === id ? null : id));
  }

  toggleSkill(agenteId: string, skillId: string): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId
        ? { ...ag, skills: ag.skills.map(sk => sk.id === skillId ? { ...sk, activa: !sk.activa } : sk) }
        : ag
      )
    );
  }

  setAutonomia(agenteId: string, pct: number): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId ? { ...ag, autonomiaPct: pct } : ag)
    );
  }

  onAutonomiaInput(agenteId: string, event: Event): void {
    const v = parseInt((event.target as HTMLInputElement).value, 10);
    this.setAutonomia(agenteId, v);
  }

  eliminarRegla(agenteId: string, reglaId: string): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId
        ? { ...ag, reglas: ag.reglas.filter(r => r.id !== reglaId) }
        : ag
      )
    );
  }

  desactivarAgente(agenteId: string): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId ? { ...ag, estado: 'pausado' as const } : ag)
    );
    this.expandedAgenteId.set(null);
    this.showToast('Agente pausado. Puedes reactivarlo desde Marketplace.');
  }

  crearAgente(): void {
    this.showCrearModal.set(true);
  }

  cerrarCrearModal(): void {
    this.showCrearModal.set(false);
  }

  irAMarketplace(): void {
    this.router.navigate(['/gali-6/marketplace']);
  }

  getProcesoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico:  'tipo--deterministic',
      'ia-ligera':     'tipo--ia-ligera',
      'ia-compleja':   'tipo--ia-compleja',
    };
    return map[tipo];
  }

  getAutonomiaLabel(pct: number): string {
    if (pct <= 20) return 'Solo notifica';
    if (pct <= 45) return 'Pide aprobación';
    if (pct <= 70) return 'Opera con límites';
    return 'Autopilot total';
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }
}

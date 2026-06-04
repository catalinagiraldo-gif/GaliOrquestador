import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type AutonomyLevel = 'total' | 'suggest' | 'alerts' | 'locked';

interface AgencyAgent {
  id: string;
  name: string;
  color: string;
  role: string;
  autonomyLevel: AutonomyLevel;
  autonomyDescription: string;
  locked?: boolean;
  lockedReason?: string;
  canEscalate?: boolean;
}

const AGENCY_AGENTS: AgencyAgent[] = [
  {
    id: 'roax',
    name: 'Roax',
    color: '#f97316',
    role: 'Media Buyer / Campañas',
    autonomyLevel: 'total',
    autonomyDescription: 'Escala presupuesto, pausa adsets y rota creativos dentro de los límites que defines.',
    canEscalate: true,
  },
  {
    id: 'vigilante',
    name: 'Vigilante',
    color: '#fbbf24',
    role: 'Logística & Novedades',
    autonomyLevel: 'total',
    autonomyDescription: 'Redirige pedidos y cambia transportadoras sin pedir permiso. Escala anomalías graves.',
    canEscalate: true,
  },
  {
    id: 'chatea',
    name: 'Chatea Pro',
    color: '#34d399',
    role: 'CAS & WhatsApp',
    autonomyLevel: 'total',
    autonomyDescription: 'Resuelve novedades y confirma pedidos solo. Solo te escala si no puede resolver.',
    canEscalate: true,
  },
  {
    id: 'ada',
    name: 'ADA Spy',
    color: '#818cf8',
    role: 'Research & Oportunidades',
    autonomyLevel: 'suggest',
    autonomyDescription: 'Trae oportunidades proactivamente. Nunca actúa — solo propone para que tú apruebes.',
    canEscalate: false,
  },
  {
    id: 'kronos',
    name: 'Kronos',
    color: '#60a5fa',
    role: 'Finanzas & P&L',
    autonomyLevel: 'locked',
    autonomyDescription: 'Analítico + alertante. Nunca mueve dinero sin tu aprobación explícita.',
    locked: true,
    lockedReason: 'Por diseño, Kronos nunca ejecuta movimientos financieros sin tu clic de aprobación. Este límite no se puede modificar.',
    canEscalate: false,
  },
];

const LEVEL_LABELS: Record<AutonomyLevel, string> = {
  total: 'Autónomo total',
  suggest: 'Sugiere, yo apruebo',
  alerts: 'Solo alertas',
  locked: 'Bloqueado por diseño',
};

const LEVEL_DESCRIPTIONS: Record<Exclude<AutonomyLevel, 'locked'>, string> = {
  total: 'Actúa dentro de tus límites sin pedirte permiso',
  suggest: 'Propone la acción y espera tu OK antes de ejecutar',
  alerts: 'Solo te notifica, nunca ejecuta',
};

@Component({
  selector: 'gali-agency-thresholds-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-agency-thresholds-panel.component.html',
  styleUrl: './gali-agency-thresholds-panel.component.scss',
})
export class GaliAgencyThresholdsPanelComponent {
  @Output() closed = new EventEmitter<void>();

  readonly agents = signal<AgencyAgent[]>(
    AGENCY_AGENTS.map(a => ({ ...a })),
  );

  readonly LEVEL_LABELS = LEVEL_LABELS;
  readonly LEVEL_DESCRIPTIONS = LEVEL_DESCRIPTIONS;
  readonly levels: Exclude<AutonomyLevel, 'locked'>[] = ['total', 'suggest', 'alerts'];

  setLevel(agentId: string, level: Exclude<AutonomyLevel, 'locked'>): void {
    this.agents.update(list =>
      list.map(a => a.id === agentId && !a.locked ? { ...a, autonomyLevel: level } : a),
    );
  }

  getLevelIndex(level: AutonomyLevel): number {
    return this.levels.indexOf(level as Exclude<AutonomyLevel, 'locked'>);
  }

  getLevelClass(agent: AgencyAgent, level: Exclude<AutonomyLevel, 'locked'>): string {
    if (agent.locked) return 'agency-level-btn--locked';
    return agent.autonomyLevel === level ? 'agency-level-btn--active' : '';
  }

  close(): void {
    this.closed.emit();
  }
}

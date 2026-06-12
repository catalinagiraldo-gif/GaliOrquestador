import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AgentCardData {
  id: string;
  name: string;
  role: string;
  color: string;
  status: 'activo' | 'esperando' | 'pausa' | 'configurando';
  lastAction: string;
  lastActionTime: string;
  lastActionImpact?: string;
  autopilotEnabled: boolean;
  actionsThisWeek: number;
  successRate: number;
  isSelected: boolean;
}

@Component({
  selector: 'app-agent-card-alive',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="agent-card"
      [class.agent-card--selected]="agent().isSelected"
      [class.agent-card--configurando]="agent().status === 'configurando'"
      (click)="selected.emit(agent().id)"
    >
      <!-- Avatar con dot de estado -->
      <div class="agent-card__avatar" [style.background]="agent().color + '22'">
        <span class="agent-card__initial" [style.color]="agent().color">
          {{ agent().name.charAt(0) }}
        </span>
        <span
          class="agent-card__dot"
          [class.agent-card__dot--activo]="agent().status === 'activo'"
          [class.agent-card__dot--esperando]="agent().status === 'esperando'"
          [class.agent-card__dot--pausa]="agent().status === 'pausa'"
          [class.agent-card__dot--configurando]="agent().status === 'configurando'"
          [class.agent-card__dot--pulse]="agent().status === 'activo' && isRecentAction(agent().lastActionTime)"
        ></span>
      </div>

      <!-- Contenido principal -->
      <div class="agent-card__body">
        <div class="agent-card__header-row">
          <span class="agent-card__name">{{ agent().name }}</span>
          @if (agent().autopilotEnabled) {
            <span class="agent-card__autopilot-badge">Autopilot</span>
          }
        </div>
        <span class="agent-card__role">{{ agent().role }}</span>

        <!-- Última acción -->
        <div class="agent-card__last-action">
          <span class="agent-card__action-text">{{ agent().lastAction }}</span>
          <span class="agent-card__action-time">{{ agent().lastActionTime }}</span>
        </div>

        @if (agent().lastActionImpact) {
          <span class="agent-card__impact">{{ agent().lastActionImpact }}</span>
        }

        @if (agent().status === 'configurando') {
          <span class="agent-card__configuring-label">
            <span class="agent-card__configuring-dot"></span>
            Gali está configurando...
          </span>
        }
      </div>
    </div>
  `,
  styleUrl: './agent-card-alive.component.scss',
})
export class AgentCardAliveComponent {
  agent = input.required<AgentCardData>();
  selected = output<string>();

  isRecentAction(time: string): boolean {
    if (time === 'ahora') return true;
    const minMatch = time.match(/^hace (\d+) min$/);
    if (minMatch) return parseInt(minMatch[1], 10) < 30;
    return false;
  }
}

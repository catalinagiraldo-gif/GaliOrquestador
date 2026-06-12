import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DecisionUrgency = 'critical' | 'high' | 'medium';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  impactoEstimado: string;
  isPrimary: boolean;
}

export interface DecisionTheaterData {
  signalId: string;
  agente: string;
  agenteColor: string;
  urgencia: DecisionUrgency;
  titulo: string;
  contexto: string;
  riesgoSiNoActua: string;
  impactoEstimado: string;
  options: DecisionOption[];
  pendingQueueCount: number;
}

@Component({
  selector: 'gali-decision-theater',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-decision-theater.component.html',
  styleUrls: ['./gali-decision-theater.component.scss']
})
export class GaliDecisionTheaterComponent {
  decision  = input.required<DecisionTheaterData>();
  isLoading = input<boolean>(false);

  onOptionSelected = output<{ signalId: string; optionId: string }>();
  onDecidir        = output<void>();
  onVerCola        = output<void>();

  readonly urgencyLabel = computed(() => {
    const map: Record<DecisionUrgency, string> = {
      critical: 'Urgente',
      high:     'Importante',
      medium:   'Recomendado'
    };
    return map[this.decision().urgencia];
  });

  selectOption(optionId: string): void {
    this.onOptionSelected.emit({ signalId: this.decision().signalId, optionId });
  }
}

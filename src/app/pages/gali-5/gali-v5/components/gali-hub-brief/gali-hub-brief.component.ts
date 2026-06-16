import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HubBriefData {
  userName: string;
  pendingDecisions: number;
  completedActions: number;
  roasReal: number;
  roasObjective: number;
  alertasCriticas: number;
  ahorroSemanal: string;
  proyectosPrincipales: string[];
}

@Component({
  selector: 'gali-hub-brief',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-hub-brief.component.html',
  styleUrls: ['./gali-hub-brief.component.scss']
})
export class GaliHubBriefComponent {
  data = input.required<HubBriefData>();

  onVerDecisiones = output<void>();
  onVerResuelto   = output<void>();

  readonly estadoNegocio = computed<'bien' | 'atencion' | 'critico'>(() => {
    const d = this.data();
    if (d.alertasCriticas > 0)       return 'critico';
    if (d.roasReal < d.roasObjective) return 'atencion';
    return 'bien';
  });

  readonly tituloBrief = computed<string>(() => {
    const d    = this.data();
    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
    const nombre = d.userName.split(' ')[0];

    switch (this.estadoNegocio()) {
      case 'bien':
        return `${saludo}, ${nombre}. Tu negocio va bien esta semana.`;
      case 'atencion':
        return `${saludo}, ${nombre}. Tu negocio necesita atención.`;
      case 'critico':
        return `${saludo}, ${nombre}. Hay situaciones urgentes hoy.`;
    }
  });

  readonly subtextoBrief = computed<string>(() => {
    const d = this.data();
    const pendientes = d.pendingDecisions;
    const resueltas  = d.completedActions;

    if (pendientes === 0 && resueltas === 0) {
      return 'Todo está corriendo sin novedades. Gali está monitoreando tu operación.';
    }
    if (pendientes === 0) {
      return `Gali resolvió ${resueltas} ${resueltas === 1 ? 'cosa' : 'cosas'} automáticamente. No hay decisiones pendientes.`;
    }
    if (resueltas === 0) {
      return `Hay ${pendientes} ${pendientes === 1 ? 'decisión que necesita' : 'decisiones que necesitan'} tu aprobación.`;
    }
    return `Hay ${pendientes} ${pendientes === 1 ? 'decisión que necesita' : 'decisiones que necesitan'} tu aprobación y ${resueltas} ${resueltas === 1 ? 'cosa que ya resolví' : 'cosas que ya resolví'}.`;
  });

  readonly mostrarBotonResuelto    = computed(() => this.data().completedActions > 0);
  readonly mostrarBotonDecisiones  = computed(() => this.data().pendingDecisions > 0);
}

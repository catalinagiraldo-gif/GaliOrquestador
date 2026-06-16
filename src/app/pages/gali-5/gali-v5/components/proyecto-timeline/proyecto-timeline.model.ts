export interface ProyectoTimelineEvent {
  id: string;
  fecha: string | null;
  label: string;
  descripcion?: string;
  esActual: boolean;
}

export interface TimelineAgentAction {
  semana: number;
  agentLabel: string;
  agentColor: string;
  accion: string;
}

export interface TimelineHitoItem {
  semana: number;
  label: string;
  icon: string;
  impacto?: string;
}

export interface TimelineMetrica {
  semana: number;
  roas: number;
  pedidos: number;
}

export interface ProyectoTimelineData {
  estadoActual: 'borrador' | 'recien_lanzado' | 'activo' | 'en_escala' | 'pausado' | 'cerrado';
  semanaActual?: number;
  eventos: ProyectoTimelineEvent[];
  // Rich Gantt lanes (optional — when present renders Gantt view)
  totalSemanas?: number;
  agenteLane?: TimelineAgentAction[];
  hitoLane?: TimelineHitoItem[];
  metricasLane?: TimelineMetrica[];
}

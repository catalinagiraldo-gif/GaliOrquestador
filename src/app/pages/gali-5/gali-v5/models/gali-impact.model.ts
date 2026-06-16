export type GaliAgenteId = 'Roax' | 'Vigilante' | 'Kronos' | 'Brujula' | 'Gali';

export type GaliAccionTipo =
  | 'escalo_campana'
  | 'evito_novedad'
  | 'detecto_senal_predictiva'
  | 'optimizo_ruta_logistica'
  | 'alerto_stock'
  | 'genero_diagnostico'
  | 'cambio_operadora'
  | 'escalo_presupuesto';

export interface GaliImpactAction {
  id: string;
  timestamp: string;
  agente: GaliAgenteId;
  tipo_accion: GaliAccionTipo;
  descripcion: string;
  impacto_pesos: number;
  impacto_label: string;
  semana_iso: number;
  mes: number;
  anio: number;
  proyecto_id?: string;
  requirio_aprobacion: boolean;
}

export interface GaliImpactSummary {
  semana_iso: number;
  mes: number;
  anio: number;
  acciones_totales: number;
  acciones_autonomas: number;
  pesos_ahorrados: number;
  campanas_escaladas: number;
  novedades_evitadas: number;
  senales_detectadas: number;
  horas_libradas: number;
}

export interface GaliImpactMilestone {
  id: string;
  tipo: 'pesos' | 'acciones' | 'semanas';
  umbral: number;
  titulo: string;
  descripcion: string;
  alcanzado: boolean;
  fecha_alcanzado?: string;
}

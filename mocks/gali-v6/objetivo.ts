// ── DETALLE DE OBJETIVOS — datos de historial y proyección ─

export interface ObjetivoHistorialPunto {
  semana: number;
  valor: number;
}

export interface ObjetivoDetalleBreakdown {
  label: string;
  valor: string;
  color: string;
}

export interface ObjetivoDetalle {
  id: string;
  tipoGrafico?: 'barras' | 'linea' | 'area';
  historial: ObjetivoHistorialPunto[];
  proyeccion: ObjetivoHistorialPunto[];
  analisisGali: string;
  fuente: string;
  breakdown: ObjetivoDetalleBreakdown[];
}

export const OBJETIVO_DETALLES: Record<string, ObjetivoDetalle> = {
  'obj-1': {
    id: 'obj-1',
    historial: [
      { semana: 1, valor: 31 }, { semana: 2, valor: 35 }, { semana: 3, valor: 38 },
      { semana: 4, valor: 42 }, { semana: 5, valor: 44 }, { semana: 6, valor: 47 },
    ],
    proyeccion: [
      { semana: 7, valor: 52 }, { semana: 8, valor: 58 }, { semana: 9, valor: 63 },
      { semana: 10, valor: 68 }, { semana: 11, valor: 74 }, { semana: 12, valor: 78 },
    ],
    analisisGali: 'A este ritmo llegas a ~78 pedidos en semana 12, no a 100. Para cerrar el gap necesitas activar 1 proyecto más o escalar el Difusor en un 30%.',
    fuente: 'Datos reales Dropi · 6 semanas de histórico',
    breakdown: [
      { label: 'Collar GPS (Proy.1)', valor: '23 ped/sem', color: '#f49a3d' },
      { label: 'Mochila Escolar (Proy.2)', valor: '15 ped/sem', color: '#3b82f6' },
      { label: 'Sin proyecto asignado', valor: '9 ped/sem', color: '#e5e7eb' },
    ],
  },
  'obj-2': {
    id: 'obj-2',
    historial: [
      { semana: 1, valor: 1.5 }, { semana: 2, valor: 1.7 }, { semana: 3, valor: 1.8 },
      { semana: 4, valor: 1.85 }, { semana: 5, valor: 1.88 }, { semana: 6, valor: 1.93 },
    ],
    proyeccion: [
      { semana: 7, valor: 1.96 }, { semana: 8, valor: 2.01 }, { semana: 9, valor: 2.05 },
      { semana: 10, valor: 2.08 }, { semana: 11, valor: 2.1 }, { semana: 12, valor: 2.1 },
    ],
    analisisGali: 'Estás a 0.07x de la meta. Collar GPS tiene ROAS 2.4x individual — el mejor de tu portafolio. Subir su presupuesto un 20% puede cerrar el gap esta misma semana.',
    fuente: 'ROAS promedio real Dropi · 7 días consecutivos',
    breakdown: [
      { label: 'Meta Ads', valor: 'ROAS 2.1x', color: '#3b82f6' },
      { label: 'TikTok Ads', valor: 'ROAS 1.4x', color: '#8b5cf6' },
      { label: 'Collar GPS ⭐', valor: 'ROAS 2.4x', color: '#f49a3d' },
    ],
  },
  'obj-3': {
    id: 'obj-3',
    historial: [
      { semana: 1, valor: 19 }, { semana: 2, valor: 18 }, { semana: 3, valor: 17 },
      { semana: 4, valor: 16 }, { semana: 5, valor: 15 }, { semana: 6, valor: 14 },
    ],
    proyeccion: [
      { semana: 7, valor: 13 }, { semana: 8, valor: 12 }, { semana: 9, valor: 11.5 },
      { semana: 10, valor: 11 }, { semana: 11, valor: 10.5 }, { semana: 12, valor: 10 },
    ],
    analisisGali: '3 novedades repetidas son del mismo proveedor (Jaya Logistics). Reemplazarlo puede bajar tu tasa a ~11% esta semana. Patrón detectado en pedidos #4801–#4821.',
    fuente: 'Patrón en datos de pedidos · 14 días de histórico',
    breakdown: [
      { label: 'Jaya Logistics', valor: '8 novedades', color: '#ef4444' },
      { label: 'Envia Medellín', valor: '3 novedades', color: '#f59e0b' },
      { label: 'Domicilios Ya', valor: '2 novedades', color: '#f49a3d' },
    ],
  },

  // Area chart — crecimiento de ingresos mensuales
  'obj-4': {
    id: 'obj-4',
    tipoGrafico: 'area',
    historial: [
      { semana: 1, valor: 4.2 }, { semana: 2, valor: 4.8 }, { semana: 3, valor: 5.1 },
      { semana: 4, valor: 5.5 }, { semana: 5, valor: 5.9 }, { semana: 6, valor: 6.2 },
    ],
    proyeccion: [
      { semana: 7, valor: 6.8 }, { semana: 8, valor: 7.3 }, { semana: 9, valor: 7.9 },
      { semana: 10, valor: 8.5 }, { semana: 11, valor: 9.1 }, { semana: 12, valor: 9.8 },
    ],
    analisisGali: 'Vas en buen ritmo financiero — +15% de ingresos promedio por semana. La proyección llega a 9.8M en semana 12, un 2% bajo la meta. Agregar un producto de ticket alto (≥ $180k COP) en semana 8 puede cerrar ese gap.',
    fuente: 'Ingresos reales Dropi · 6 semanas · excluye devoluciones',
    breakdown: [
      { label: 'Collar GPS', valor: '$2.4M COP (38%)', color: '#ff6102' },
      { label: 'Mochila Escolar', valor: '$1.9M COP (31%)', color: '#3b82f6' },
      { label: 'Difusor Aromas', valor: '$1.1M COP (18%)', color: '#8b5cf6' },
      { label: 'Otros productos', valor: '$0.8M COP (13%)', color: '#e5e7eb' },
    ],
  },

  // Line/dot chart — adquisición de clientes nuevos
  'obj-5': {
    id: 'obj-5',
    tipoGrafico: 'linea',
    historial: [
      { semana: 1, valor: 12 }, { semana: 2, valor: 18 }, { semana: 3, valor: 22 },
      { semana: 4, valor: 27 }, { semana: 5, valor: 31 }, { semana: 6, valor: 36 },
    ],
    proyeccion: [
      { semana: 7, valor: 40 }, { semana: 8, valor: 44 }, { semana: 9, valor: 47 },
      { semana: 10, valor: 50 }, { semana: 11, valor: 53 }, { semana: 12, valor: 56 },
    ],
    analisisGali: 'La tasa de adquisición creció +4.8 clientes/sem en promedio. Proyección llega a 56 en semana 12 — 4 clientes bajo la meta. Un incentivo de primera compra del 10% en Meta Ads puede cerrar ese gap en semana 9.',
    fuente: 'Clientes nuevos únicos · Dropi · sin recompras',
    breakdown: [
      { label: 'Meta Ads', valor: '19 clientes (52%)', color: '#3b82f6' },
      { label: 'TikTok Ads', valor: '12 clientes (33%)', color: '#8b5cf6' },
      { label: 'Orgánico / referido', valor: '5 clientes (15%)', color: '#10b981' },
    ],
  },
};

// ── SISTEMA V2 — Objetivos múltiples ──────────────────────

export type MetricaTipo =
  | 'pedidos_sem'
  | 'roas'
  | 'ingreso_mensual'
  | 'clientes_nuevos'
  | 'tasa_novedad'
  | 'personalizado';

export const METRICA_LABEL: Record<MetricaTipo, string> = {
  pedidos_sem:     'Pedidos por semana',
  roas:            'ROAS',
  ingreso_mensual: 'Ingreso mensual',
  clientes_nuevos: 'Clientes nuevos',
  tasa_novedad:    'Tasa de novedad',
  personalizado:   'Personalizado',
};

export const METRICA_UNIDAD: Record<MetricaTipo, string> = {
  pedidos_sem:     'ped/sem',
  roas:            'x',
  ingreso_mensual: '$COP',
  clientes_nuevos: 'clientes',
  tasa_novedad:    '%',
  personalizado:   '',
};

export interface ObjetivoEspecifico {
  id: string;
  titulo: string;
  metrica: MetricaTipo;
  unidad: string;
  metaValor: number;
  actualValor: number;
  plazo_semanas: number;
  fecha_inicio: string;
  progreso_pct: number;
  sugerenciaGali?: {
    texto: string;
    evidencia: string;
    confianza: 'dato-real' | 'tendencia' | 'proyeccion';
  };
}

export interface ObjetivoGeneral {
  resumen: string;
  objetivos: ObjetivoEspecifico[];
  progreso_pct: number;
  plazo_semanas: number;
  fecha_inicio: string;
}

export const DEFAULT_OBJETIVO_V2: ObjetivoGeneral = {
  resumen: 'Escalar a 100 pedidos/sem con ROAS 2x en 12 semanas',
  plazo_semanas: 12,
  fecha_inicio: '2026-05-15',
  progreso_pct: 55,
  objetivos: [
    {
      id: 'obj-1',
      titulo: 'Alcanzar 100 pedidos por semana',
      metrica: 'pedidos_sem',
      unidad: 'ped/sem',
      metaValor: 100,
      actualValor: 47,
      plazo_semanas: 12,
      fecha_inicio: '2026-05-15',
      progreso_pct: 47,
    },
    {
      id: 'obj-2',
      titulo: 'ROAS sostenido de 2x',
      metrica: 'roas',
      unidad: 'x',
      metaValor: 2.0,
      actualValor: 1.93,
      plazo_semanas: 12,
      fecha_inicio: '2026-05-15',
      progreso_pct: 96,
      sugerenciaGali: {
        texto: 'Estás a 0.07x de la meta. El ajuste de Collar GPS puede cerrarlo esta semana.',
        evidencia: 'ROAS estable 7 días · promedio 1.93x',
        confianza: 'dato-real',
      },
    },
    {
      id: 'obj-3',
      titulo: 'Reducir tasa de novedad a < 10%',
      metrica: 'tasa_novedad',
      unidad: '%',
      metaValor: 10,
      actualValor: 14,
      plazo_semanas: 12,
      fecha_inicio: '2026-05-15',
      progreso_pct: 30,
      sugerenciaGali: {
        texto: '3 novedades repetidas son del mismo proveedor. Revisarlo puede bajar a ~11%.',
        evidencia: 'Patrón en pedidos #4801–#4821',
        confianza: 'tendencia',
      },
    },
    {
      id: 'obj-4',
      titulo: 'Alcanzar $10M COP en ingresos mensuales',
      metrica: 'ingreso_mensual',
      unidad: 'M COP',
      metaValor: 10,
      actualValor: 6.2,
      plazo_semanas: 12,
      fecha_inicio: '2026-05-15',
      progreso_pct: 62,
      sugerenciaGali: {
        texto: 'Proyección llega a 9.8M. Un producto de ticket alto en sem 8 cierra el gap.',
        evidencia: 'Tendencia de ingresos +15%/sem · últimas 6 semanas',
        confianza: 'proyeccion',
      },
    },
    {
      id: 'obj-5',
      titulo: 'Adquirir 60 clientes nuevos por mes',
      metrica: 'clientes_nuevos',
      unidad: 'clientes',
      metaValor: 60,
      actualValor: 36,
      plazo_semanas: 12,
      fecha_inicio: '2026-05-15',
      progreso_pct: 60,
    },
  ],
};

const STORAGE_KEY_V2 = 'gali-6-objetivos-general-v3';

function esObjetivoGeneralValido(obj: unknown): obj is ObjetivoGeneral {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return typeof o['resumen'] === 'string' && Array.isArray(o['objetivos']);
}

export function getObjetivoV2(): ObjetivoGeneral {
  // Prototype behavior: always start from defaults on page load.
  // Edits stay alive in Angular signals during the session but reset on refresh.
  return JSON.parse(JSON.stringify(DEFAULT_OBJETIVO_V2)) as ObjetivoGeneral;
}

export function saveObjetivoV2(obj: ObjetivoGeneral): void {
  try {
    const anterior = localStorage.getItem(STORAGE_KEY_V2);
    if (anterior) localStorage.setItem(`${STORAGE_KEY_V2}-anterior`, anterior);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(obj));
}

// ── SISTEMA LEGACY (v1) ───────────────────────────────────

export type ObjetivoTipo = 'volumen' | 'financiero' | 'expansion';

export interface SubMeta {
  id: string;
  label: string;
  lograda: boolean;
  fecha_logro?: string; // ISO date, se asigna cuando lograda pasa a true
}

export interface G6Objetivo {
  texto: string;
  tipo: ObjetivoTipo;
  meta_pedidos_sem: number;
  meta_ganancia_mensual: number | null;
  plazo_semanas: number;
  fecha_inicio: string;
  sub_metas: SubMeta[];
}

export const TIPO_LABEL: Record<ObjetivoTipo, string> = {
  volumen: 'Volumen',
  financiero: 'Financiero',
  expansion: 'Expansión',
};

const STORAGE_KEY = 'gali-6-objetivo-v2';

export const DEFAULT_OBJETIVO: G6Objetivo = {
  texto: 'Automatizar mi operación y escalar a 100 pedidos/semana',
  tipo: 'volumen',
  meta_pedidos_sem: 100,
  meta_ganancia_mensual: null,
  plazo_semanas: 12,
  fecha_inicio: '2026-05-15',
  sub_metas: [
    { id: 'sm-1', label: 'Tener 2 proyectos activos al mismo tiempo', lograda: true, fecha_logro: '2026-05-28' },
    { id: 'sm-2', label: 'Alcanzar ROAS sostenido > 1.8x', lograda: true, fecha_logro: '2026-06-03' },
    { id: 'sm-3', label: 'Reducir novedad logística a < 10%', lograda: false },
    { id: 'sm-4', label: 'Primer proyecto en escala (en_escala)', lograda: true, fecha_logro: '2026-06-10' },
    { id: 'sm-5', label: 'Llegar a 100 pedidos/semana', lograda: false },
  ],
};

export function getObjetivo(): G6Objetivo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as G6Objetivo;
  } catch { /* ignore */ }
  return { ...DEFAULT_OBJETIVO, sub_metas: DEFAULT_OBJETIVO.sub_metas.map(s => ({ ...s })) };
}

export function saveObjetivo(obj: G6Objetivo): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// Legacy compat: sync the old keys so gali-6-shell still reads them
export function syncLegacyKeys(obj: G6Objetivo): void {
  localStorage.setItem('gali-6-objetivo-texto', obj.texto);
  localStorage.setItem('gali-6-objetivo-meta', String(obj.meta_pedidos_sem));
}

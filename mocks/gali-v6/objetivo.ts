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

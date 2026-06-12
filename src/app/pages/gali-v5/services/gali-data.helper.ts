// Regla ALS-4: fuente única de datos financieros — leer siempre desde los mocks,
// nunca hardcodear ROAS, márgenes, pauta o pedidos en componentes TS.
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';

const GPS = (PROJECTS as any[]).find((p: any) => p.id === 'collar-gps-2026')!;

// ── Collar GPS: ROAS ────────────────────────────────────────────────────────
/** ROAS calculado por Dropi (revenue real / gasto real). Usar cuando el contexto
 *  habla de lo que Dropi confirma. */
export const ROAS_REAL        = GPS.roas_real        as number; // 1.93
export const ROAS_REAL_LABEL  = GPS.roas_real_label  as string; // '1.93x'

/** ROAS que Meta atribuye a sus anuncios. Usar solo con etiqueta explícita "Meta declarado". */
export const ROAS_META        = GPS.roas_meta        as number; // 2.9
export const ROAS_META_LABEL  = GPS.roas_meta_label  as string; // '2.9x'

// ── Collar GPS: operación ────────────────────────────────────────────────────
export const PAUTA_DIARIA            = GPS.pauta_diaria            as number; // 66000
export const PAUTA_ESCALA_PROPUESTA  = GPS.pauta_escala_propuesta  as number; // 86000
export const MARGEN_NETO_PCT         = GPS.margen_neto_pct         as number; // 22
export const PEDIDOS_SEM             = GPS.pedidos_sem             as number; // 47
export const REVENUE_SEMANAL         = GPS.revenue_semanal         as number; // 1820000
export const GANANCIA_NETA_SEMANAL   = GPS.ganancia_neta_semanal   as number; // 411000

// ── Global (todos los proyectos activos) ────────────────────────────────────
/** Promedio ponderado por pauta de roas_real de todos los proyectos activos. */
export const ROAS_GLOBAL       = (KPIS as any).roas_efectivo_global.valor as number; // 1.91
export const ROAS_GLOBAL_LABEL = (KPIS as any).roas_efectivo_global.label as string; // '1.91x'

export const INGRESOS_BRUTOS_MENSUAL  = (KPIS as any).ingresos_brutos_mensual.valor  as number;
export const UTILIDAD_NETA_MENSUAL    = (KPIS as any).utilidad_neta_mensual.valor     as number;
export const TASA_NOVEDAD_GLOBAL      = (KPIS as any).tasa_novedad_global.valor       as number; // 14
export const PEDIDOS_SEM_TOTAL        = (KPIS as any).pedidos_sem_total.valor         as number; // 70

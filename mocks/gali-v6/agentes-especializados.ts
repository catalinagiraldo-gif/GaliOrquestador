/**
 * Agentes especializados de Gali 6.
 * Cada agente declara su tipo de proceso (determinístico vs IA) para que la UI
 * pueda comunicar al usuario el nivel de confiabilidad de sus señales.
 */

export type AgenteTier = 'free' | 'paid' | 'tokens';
export type AgenteProcesoTipo = 'deterministico' | 'ia-ligera' | 'ia-compleja';

export interface AgenteSkillDefault {
  id: string;
  label: string;
  tipo: AgenteProcesoTipo;
  descripcion: string;
  /** Última vez que se ejecutó esta skill, ej: "hace 2h" */
  ultimaEjecucion?: string;
  /** Número total de veces que se ha ejecutado */
  ejecucionesTotal?: number;
}

export interface AgenteReglaDefault {
  condicion: string;
  accion: string;
  tipo: AgenteProcesoTipo;
  /** Dónde aplica esta regla, ej: "Meta Ads · escalamiento" */
  scope?: string;
  /** id de la skill en skillsDefecto que esta regla dispara */
  skillVinculada?: string;
  /** Orden de prioridad frente a otras reglas del mismo agente (1 = más alta) */
  prioridad?: number;
  /** Última vez que se disparó esta regla, ej: "hace 15 min" */
  ultimaEjecucion?: string;
  /** Número total de veces que se ha disparado */
  ejecucionesTotal?: number;
}

export interface AgenteEspecializado {
  id: string;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  descripcionCorta: string;
  /** Qué monitorea este agente (para mostrar en Señales > Fuentes) */
  monitorea: string[];
  tier: AgenteTier;
  /** Precio en COP/mes si es paid */
  precioCopMes?: number;
  /** Tokens por uso si es tokens */
  tokensUso?: number;
  tipo: AgenteProcesoTipo;
  /** Badge de advertencia en el marketplace para agentes de IA compleja */
  advertenciaIA?: string;
  skillsDefecto: AgenteSkillDefault[];
  reglasDefecto: AgenteReglaDefault[];
  /** Si true, se incluye automáticamente en el paquete de principiantes */
  enPaquetePrincipiantes: boolean;
  icono: string;
  colorAvatar: string;
  estado: 'activo' | 'pausado' | 'disponible';
  /** Señal de ejemplo que genera este agente */
  ejemploSenal?: string;
  /** Conexiones/integraciones requeridas para funcionar */
  conexionesRequeridas?: string[];
}

export const AGENTES_ESPECIALIZADOS: AgenteEspecializado[] = [
  {
    id: 'stock-guardian',
    nombre: 'Stock Guardian',
    nombreCorto: 'Stock',
    descripcion:
      'Monitorea el inventario disponible en Dropi para cada producto de tus campañas activas. ' +
      'Te avisa con tiempo suficiente para pausar o redirigir tus campañas antes de quedarte sin stock.',
    descripcionCorta: 'Avisa cuando el inventario se va a acabar',
    monitorea: ['Inventario Dropi por producto', 'Campañas activas vs stock disponible'],
    tier: 'free',
    tipo: 'deterministico',
    skillsDefecto: [
      {
        id: 'sk-stock-check',
        label: 'Verificar stock cada 6 horas',
        tipo: 'deterministico',
        descripcion: 'Consulta el inventario de Dropi para cada producto en campaña activa',
        ultimaEjecucion: 'hace 2h',
        ejecucionesTotal: 214,
      },
      {
        id: 'sk-stock-alert',
        label: 'Alertar cuando stock < umbral',
        tipo: 'deterministico',
        descripcion: 'Genera señal cuando las unidades disponibles caen por debajo del umbral configurado (por defecto: 10 uds)',
        ultimaEjecucion: 'hace 15 min',
        ejecucionesTotal: 18,
      },
    ],
    reglasDefecto: [
      {
        condicion: 'Si stock < 10 unidades en producto de campaña activa',
        accion: 'Generar alerta crítica de stock',
        tipo: 'deterministico',
        scope: 'Inventario · campañas activas',
        skillVinculada: 'sk-stock-alert',
        prioridad: 1,
        ultimaEjecucion: 'hace 15 min',
        ejecucionesTotal: 18,
      },
    ],
    enPaquetePrincipiantes: true,
    icono: 'pi pi-box',
    colorAvatar: '#3b82f6',
    estado: 'activo',
    ejemploSenal: '📦 "Collar GPS tiene solo 3 unidades disponibles — tu campaña activa puede quedar sin stock en ~2 días"',
    conexionesRequeridas: ['Inventario Dropi'],
  },

  {
    id: 'roas-tracker',
    nombre: 'ROAS Tracker',
    nombreCorto: 'ROAS',
    descripcion:
      'Calcula el ROAS real de cada campaña usando los datos de ventas y gastos de Dropi — no el ROAS que reporta Meta o TikTok. ' +
      'Detecta caídas sostenidas y oportunidades de escala basándose en tu histórico.',
    descripcionCorta: 'Mide y monitorea la rentabilidad real de tus campañas',
    monitorea: ['Ventas y gastos reales de Dropi', 'ROAS por campaña y proyecto', 'Tendencias de ROAS a 3-7 días'],
    tier: 'free',
    tipo: 'ia-ligera',
    skillsDefecto: [
      {
        id: 'sk-roas-calc',
        label: 'Calcular ROAS diario por campaña',
        tipo: 'deterministico',
        descripcion: 'Revenue / (COGS + flete + pauta + novedades + garantías)',
        ultimaEjecucion: 'hace 40 min',
        ejecucionesTotal: 312,
      },
      {
        id: 'sk-roas-compare',
        label: 'Comparar ROAS con objetivo',
        tipo: 'deterministico',
        descripcion: 'Evalúa si el ROAS actual supera el ROAS mínimo configurado',
        ultimaEjecucion: 'hace 40 min',
        ejecucionesTotal: 312,
      },
      {
        id: 'sk-roas-trend',
        label: 'Detectar caídas sostenidas',
        tipo: 'ia-ligera',
        descripcion: 'Identifica si el ROAS lleva 3+ días consecutivos bajo el umbral — distingue fluctuación normal de tendencia real',
        ultimaEjecucion: 'hace 1h 40min',
        ejecucionesTotal: 26,
      },
    ],
    reglasDefecto: [
      {
        condicion: 'Si ROAS real < 1.3 por 3 días consecutivos',
        accion: 'Generar alerta crítica de rentabilidad',
        tipo: 'deterministico',
        scope: 'Meta Ads · rentabilidad',
        skillVinculada: 'sk-roas-trend',
        prioridad: 1,
        ultimaEjecucion: 'hace 1h 40min',
        ejecucionesTotal: 9,
      },
      {
        condicion: 'Si ROAS real > 2.0 por 7 días y hay margen de escala',
        accion: 'Sugerir escala de presupuesto',
        tipo: 'ia-ligera',
        scope: 'Meta Ads · escalamiento',
        skillVinculada: 'sk-roas-compare',
        prioridad: 2,
        ultimaEjecucion: 'hace 23 min',
        ejecucionesTotal: 5,
      },
    ],
    enPaquetePrincipiantes: true,
    icono: 'pi pi-chart-line',
    colorAvatar: '#10b981',
    estado: 'activo',
    ejemploSenal: '📊 "Campaña TikTok Mallas Nike: ROAS bajó a 1.2x (3 días consecutivos) — por debajo de tu objetivo 1.5x"',
  },

  {
    id: 'logistics-pro',
    nombre: 'Logistics Pro',
    nombreCorto: 'Logística',
    descripcion:
      'Monitorea tus novedades y su distribución por transportadora. ' +
      'Te dice qué transportadora está generando más pérdidas y sugiere el cambio con datos de tu propio historial.',
    descripcionCorta: 'Reduce novedades y optimiza tu logística',
    monitorea: ['Novedades activas por pedido', 'Tasa de novedad por transportadora', 'Tiempos de confirmación'],
    tier: 'free',
    tipo: 'ia-ligera',
    skillsDefecto: [
      {
        id: 'sk-log-count',
        label: 'Contar novedades activas',
        tipo: 'deterministico',
        descripcion: 'Totaliza las novedades abiertas y las clasifica por transportadora',
        ultimaEjecucion: 'hace 1h',
        ejecucionesTotal: 89,
      },
      {
        id: 'sk-log-rate',
        label: 'Calcular tasa de novedad por transportadora',
        tipo: 'deterministico',
        descripcion: 'Novedades / Pedidos totales por cada transportadora en los últimos 30 días',
        ultimaEjecucion: 'hace 1h',
        ejecucionesTotal: 89,
      },
      {
        id: 'sk-log-suggest',
        label: 'Sugerir cambio de transportadora',
        tipo: 'ia-ligera',
        descripcion: 'Basado en tu historial propio (no comparación de mercado), identifica la transportadora con menor tasa de novedades para tu ruta principal',
        ultimaEjecucion: 'hace 4h',
        ejecucionesTotal: 11,
      },
    ],
    reglasDefecto: [
      {
        condicion: 'Si tasa de novedades > 20% en 7 días',
        accion: 'Alertar y mostrar análisis por transportadora',
        tipo: 'deterministico',
        scope: 'Logística · novedades',
        skillVinculada: 'sk-log-rate',
        prioridad: 1,
        ultimaEjecucion: 'hace 45 min',
        ejecucionesTotal: 6,
      },
    ],
    enPaquetePrincipiantes: true,
    icono: 'pi pi-truck',
    colorAvatar: '#f59e0b',
    estado: 'activo',
    ejemploSenal: '📊 "Tienes 6 novedades activas hoy (18% de tus pedidos esta semana) — Coordinadora concentra 5 de las 6"',
  },

  {
    id: 'price-radar',
    nombre: 'Price Radar',
    nombreCorto: 'Precio',
    descripcion:
      'Analiza si tu precio de venta está posicionado correctamente respecto al mercado. ' +
      'Usa IA para estimar el rango de precios de productos similares y sugiere ajustes para maximizar conversión o margen.',
    descripcionCorta: 'Analiza y optimiza tu precio vs el mercado',
    monitorea: ['Precio de productos similares en catálogo Dropi', 'Margen vs precio de venta actual', 'Sensibilidad de conversión al precio'],
    tier: 'paid',
    precioCopMes: 49000,
    tipo: 'ia-compleja',
    advertenciaIA:
      'Este agente usa análisis de IA para estimar precios de mercado. ' +
      'Sus sugerencias son orientativas — siempre verifica antes de cambiar precios.',
    skillsDefecto: [
      {
        id: 'sk-price-compare',
        label: 'Comparar precio vs productos similares',
        tipo: 'ia-compleja',
        descripcion: 'Analiza el catálogo de Dropi para encontrar productos comparables y estima un rango de precio de mercado',
        ultimaEjecucion: 'hace 6h',
        ejecucionesTotal: 41,
      },
      {
        id: 'sk-price-suggest',
        label: 'Sugerir precio óptimo',
        tipo: 'ia-compleja',
        descripcion: 'Basado en tu margen objetivo y el análisis de mercado, propone un precio que equilibra conversión y rentabilidad',
        ultimaEjecucion: 'hace 6h',
        ejecucionesTotal: 17,
      },
    ],
    reglasDefecto: [
      {
        condicion: 'Si precio está >15% por encima del estimado de mercado',
        accion: 'Generar alerta de precio alto con sugerencia de ajuste',
        tipo: 'ia-compleja',
        scope: 'Precios · catálogo',
        skillVinculada: 'sk-price-suggest',
        prioridad: 1,
        ultimaEjecucion: 'hace 6h',
        ejecucionesTotal: 4,
      },
    ],
    enPaquetePrincipiantes: false,
    icono: 'pi pi-tag',
    colorAvatar: '#8b5cf6',
    estado: 'disponible',
    ejemploSenal: '✨ "Tu precio ($85.000) está ~12% por encima del rango estimado para este tipo de producto — podrías mejorar conversión bajando a $76.000"',
  },

  {
    id: 'product-scout',
    nombre: 'Product Scout',
    nombreCorto: 'Recomendación',
    descripcion:
      'Analiza tu historial de éxito para sugerirte nuevos productos con alta probabilidad de funcionar para ti. ' +
      'Aprende de tus proyectos más rentables para identificar el próximo producto ganador.',
    descripcionCorta: 'Sugiere nuevos productos basados en tu historial de éxito',
    monitorea: ['ROAS histórico por producto y categoría', 'Tendencias de búsqueda en la red Dropi', 'Márgenes por categoría'],
    tier: 'tokens',
    tokensUso: 50,
    tipo: 'ia-compleja',
    advertenciaIA:
      'Las recomendaciones de este agente se basan en patrones de tu historial y tendencias generales. ' +
      'No garantizan el éxito del producto — evalúa siempre con tu propio criterio.',
    skillsDefecto: [
      {
        id: 'sk-scout-history',
        label: 'Analizar patrón de éxito propio',
        tipo: 'ia-compleja',
        descripcion: 'Identifica qué características tienen en común tus proyectos con mejor ROAS',
      },
      {
        id: 'sk-scout-suggest',
        label: 'Sugerir productos del catálogo Dropi',
        tipo: 'ia-compleja',
        descripcion: 'Busca en el catálogo productos con características similares a tus éxitos y tendencia de mercado positiva',
      },
    ],
    reglasDefecto: [],
    enPaquetePrincipiantes: false,
    icono: 'pi pi-search',
    colorAvatar: '#ec4899',
    estado: 'disponible',
    ejemploSenal: '✨ "Basado en tu éxito con accesorios para mascotas, hay 3 productos en el catálogo con margen estimado >25% y tendencia creciente esta semana"',
  },
];

/** Los 3 agentes que forman el paquete básico para principiantes */
export const PAQUETE_PRINCIPIANTES = AGENTES_ESPECIALIZADOS.filter(
  a => a.enPaquetePrincipiantes,
);

/** Label del tipo de proceso para mostrar en UI */
export const PROCESO_TIPO_LABEL: Record<AgenteProcesoTipo, string> = {
  deterministico: 'Dato real',
  'ia-ligera': 'IA guiada',
  'ia-compleja': 'Análisis IA',
};

export const PROCESO_TIPO_TOOLTIP: Record<AgenteProcesoTipo, string> = {
  deterministico: 'Este dato viene directamente de Dropi. Es 100% confiable.',
  'ia-ligera': 'Este análisis usa IA con reglas muy específicas. Alta confiabilidad.',
  'ia-compleja': 'Esta recomendación fue generada por IA. Puede variar — verifica antes de actuar.',
};

export const TIER_LABEL: Record<AgenteTier, string> = {
  free: 'Gratis',
  paid: 'Pago',
  tokens: 'Tokens',
};

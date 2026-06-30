export type EstadoProyecto = 'borrador' | 'configurando' | 'activo' | 'en_riesgo' | 'en_escala' | 'pausado' | 'cerrado';

export type TipoProyecto = 'lanzar' | 'escalar' | 'optimizar' | 'crm' | 'experimentar' | 'operacion' | 'negociacion';

export type TipoCampana = 'ads' | 'chatea' | 'hibrida' | 'organica';

export interface TipoProyectoMeta {
  id: TipoProyecto;
  emoji: string;
  titulo: string;
  descripcion: string;
  cuandoUsar: string;
  agentesDefault: string[];
  requiereCampana: boolean;
}

export const TIPOS_PROYECTO: TipoProyectoMeta[] = [
  {
    id: 'lanzar',
    emoji: '🚀',
    titulo: 'Lanzar nuevo producto',
    descripcion: 'Valida un producto con pauta y primera campaña.',
    cuandoUsar: 'Tienes un producto nuevo y quieres probarlo en el mercado.',
    agentesDefault: ['roax', 'vigilante'],
    requiereCampana: true,
  },
  {
    id: 'escalar',
    emoji: '📈',
    titulo: 'Escalar lo que funciona',
    descripcion: 'Dobla el presupuesto en un proyecto ganador.',
    cuandoUsar: 'Tu ROAS supera 1.8x y quieres aumentar el volumen.',
    agentesDefault: ['roax', 'vigilante', 'ada'],
    requiereCampana: true,
  },
  {
    id: 'optimizar',
    emoji: '🎯',
    titulo: 'Optimizar portafolio',
    descripcion: 'Corrige proyectos con bajo rendimiento.',
    cuandoUsar: 'Tienes proyectos en riesgo o con ROAS bajo el umbral.',
    agentesDefault: ['vigilante', 'ada'],
    requiereCampana: true,
  },
  {
    id: 'crm',
    emoji: '💬',
    titulo: 'Vender por Chatea / CRM',
    descripcion: 'Ventas por conversación, sin pauta obligatoria.',
    cuandoUsar: 'Quieres recuperar clientes o vender sin Meta/TikTok.',
    agentesDefault: ['chatea'],
    requiereCampana: true,
  },
  {
    id: 'experimentar',
    emoji: '🧪',
    titulo: 'Experimento',
    descripcion: 'Prueba un nuevo ángulo o producto.',
    cuandoUsar: 'Para testear ideas con presupuesto controlado antes de comprometerte.',
    agentesDefault: ['roax', 'ada'],
    requiereCampana: true,
  },
  {
    id: 'operacion',
    emoji: '⚙️',
    titulo: 'Optimizar operación',
    descripcion: 'Mejora procesos, eficiencia y métricas sin necesidad de pauta activa.',
    cuandoUsar: 'Quieres reducir novedad, mejorar tiempo de respuesta o bajar costos operativos.',
    agentesDefault: ['vigilante', 'ada'],
    requiereCampana: false,
  },
  {
    id: 'negociacion',
    emoji: '🤝',
    titulo: 'Negociar con proveedor',
    descripcion: 'Gestiona precios, condiciones y stock con tu proveedor.',
    cuandoUsar: 'Quieres mejorar márgenes o asegurar stock para una temporada de alta demanda.',
    agentesDefault: ['ada'],
    requiereCampana: false,
  },
];

export interface AnguloVenta {
  id: string;
  nombre: string;
  publicoObj: string;
  estado: 'activo' | 'pausado' | 'borrador';
  roas?: number;
  pedidosSem?: number;
  creativoUrl?: string;
}

export interface ProductoCampanaMetrica {
  pedidosSem: number;
  cpaReal: number;
  roasCampana: number;
  stockActual: number;
  historial5sem: number[];
  estadoStock: 'ok' | 'bajo' | 'agotado';
}

export interface ProductoRef {
  id: string;
  nombre: string;
  margenPct: number;
  precioVentaLabel: string;
  angulos?: AnguloVenta[];
  metricas?: ProductoCampanaMetrica;
  stockActual?: number;
  estadoStock?: 'ok' | 'bajo' | 'agotado';
  costoBase?: number;
  fleteBase?: number;
}

export interface CampanaProyecto {
  id: string;
  nombre: string;
  canal: 'meta' | 'tiktok' | 'whatsapp' | 'google';
  canalLabel: string;
  canalColor: string;
  producto: string | null;
  productos?: ProductoRef[];
  estado: 'activa' | 'sin_producto' | 'pausada' | 'borrador';
  tipoCampana: TipoCampana;
  roasActual?: number;
  roasObjetivo: number;
  pedidosSem?: number;
  presupuestoDiario?: number;
  presupuestoDiarioLabel: string;
  agentes: string[];
  conexiones: string[];
  notaGali?: string;
}

export interface ProductoMetrics {
  productoId: string;
  nombre: string;
  pedidosSem: number;
  stockLiberado: number;
  roasProyecto: number;
  aporteObjetivoPct: number;
  historialSemanas: number[];
  adaScore: number;
  notaGali: string;
}

export interface PausaLog {
  fecha: string;
  campanasPausadas: string[];
  nota: string;
}

export interface ProyectoDetalle {
  id: string;
  nombre: string;
  tipo?: TipoProyecto;
  estado: EstadoProyecto;
  descripcion: string;
  contribucionPct: number;
  pedidosSem: number;
  presupuestoTotal: number;
  roasPromedio?: number;
  proyeccionSemanas?: number;
  campanas: CampanaProyecto[];
  agentes: string[];
  alertaGali?: string;
  fechaInicio: string;
  rutaVenta?: 'meta-landing-chatea' | 'meta-chatea' | 'tiktok-chatea' | 'landing-chatea' | 'directo' | null;
  tipoCampana?: TipoCampana | null;
  intentDeclarado?: string;
  subObjetivo?: string;
  subObjetivoId?: string;
  pausaLog?: PausaLog;
  productosMetrics?: ProductoMetrics[];
}

export const PROYECTOS_MOCK: ProyectoDetalle[] = [
  // ── Estado 1: Vacío (borrador sin nada) ──────────────────────────────────
  {
    id: 'pv-001',
    nombre: 'Mi primer proyecto',
    tipo: 'lanzar',
    estado: 'borrador',
    descripcion: 'Proyecto recién creado. Falta asignar producto y crear campañas.',
    contribucionPct: 0,
    pedidosSem: 0,
    presupuestoTotal: 0,
    campanas: [],
    agentes: [],
    fechaInicio: '2026-06-20',
    rutaVenta: null,
    tipoCampana: null,
    subObjetivo: 'Lanzar primer producto rentable en 4 semanas',
  },

  // ── Estado 2: Campañas sin producto ─────────────────────────────────────
  {
    id: 'pv-002',
    nombre: 'Estrategia Q3 — Sin producto',
    tipo: 'experimentar',
    estado: 'configurando',
    descripcion: 'Campañas creadas pero todavía sin producto asignado. Gali necesita el producto para calcular márgenes.',
    contribucionPct: 0,
    pedidosSem: 0,
    presupuestoTotal: 35000,
    campanas: [
      {
        id: 'c-001',
        nombre: 'TikTok Ads Q3',
        canal: 'tiktok',
        canalLabel: 'TikTok Ads',
        canalColor: '#010101',
        producto: null,
        estado: 'sin_producto',
        tipoCampana: 'ads',
        roasObjetivo: 1.5,
        presupuestoDiario: 20000,
        presupuestoDiarioLabel: '$20.000/día',
        agentes: ['roax-ads'],
        conexiones: ['tiktok-ads'],
        notaGali: 'Asigna un producto para que pueda optimizar el ROAS.',
      },
      {
        id: 'c-002',
        nombre: 'Meta Remarketing Q3',
        canal: 'meta',
        canalLabel: 'Meta Ads',
        canalColor: '#0064e0',
        producto: null,
        estado: 'sin_producto',
        tipoCampana: 'ads',
        roasObjetivo: 1.8,
        presupuestoDiario: 15000,
        presupuestoDiarioLabel: '$15.000/día',
        agentes: ['roax-ads', 'stock-guardian'],
        conexiones: ['meta-ads'],
        notaGali: 'Esta campaña está lista para activarse una vez que asignes el producto.',
      },
    ],
    agentes: ['roax-ads', 'stock-guardian'],
    alertaGali: 'Gali no puede calcular ROAS ni pedidos estimados sin producto. Asigna uno para desbloquear el monitoreo.',
    fechaInicio: '2026-06-18',
    rutaVenta: 'tiktok-chatea',
    tipoCampana: 'ads',
    intentDeclarado: 'Quiero probar un ángulo de copy nuevo en TikTok',
    subObjetivo: 'Validar hipótesis en 14 días',
  },

  // ── Estado 3: Positivo (Collar GPS escalando) ────────────────────────────
  {
    id: 'pv-003',
    nombre: 'Collar GPS — Escalando',
    tipo: 'escalar',
    estado: 'en_escala',
    descripcion: 'Proyecto de mejor rendimiento. ROAS sostenido por encima del objetivo. Gali lo escala automáticamente.',
    contribucionPct: 47,
    pedidosSem: 47,
    presupuestoTotal: 55000,
    roasPromedio: 2.1,
    proyeccionSemanas: 3,
    campanas: [
      {
        id: 'c-003',
        nombre: 'TikTok Active — Mascotas',
        canal: 'tiktok',
        canalLabel: 'TikTok Ads',
        canalColor: '#010101',
        producto: 'Collar GPS para mascotas',
        productos: [
          {
            id: 'prod-collar-gps',
            nombre: 'Collar GPS para mascotas',
            margenPct: 38,
            precioVentaLabel: '$89.900',
            costoBase: 28000,
            fleteBase: 7000,
            stockActual: 145,
            estadoStock: 'ok',
            angulos: [
              { id: 'a-001', nombre: 'Para mamás de mascota', publicoObj: 'Mujeres 28-45 con perro', estado: 'activo', roas: 2.4, pedidosSem: 18 },
              { id: 'a-002', nombre: 'Para aventureros', publicoObj: 'Hombres 25-35, outdoor', estado: 'activo', roas: 1.9, pedidosSem: 10 },
              { id: 'a-003', nombre: 'Control parental mascotas', publicoObj: 'Familias con niños y perro', estado: 'pausado', roas: 0.8, pedidosSem: 2 },
            ],
            metricas: {
              pedidosSem: 28, cpaReal: 12400, roasCampana: 2.3,
              stockActual: 145, historial5sem: [18, 22, 25, 28, 28], estadoStock: 'ok',
            },
          },
        ],
        estado: 'activa',
        tipoCampana: 'ads',
        roasActual: 2.3,
        roasObjetivo: 1.5,
        pedidosSem: 29,
        presupuestoDiario: 35000,
        presupuestoDiarioLabel: '$35.000/día',
        agentes: ['roax-ads', 'stock-guardian'],
        conexiones: ['tiktok-ads'],
        notaGali: 'ROAS 2.3x. Escalé el presupuesto 20% esta semana.',
      },
      {
        id: 'c-004',
        nombre: 'Meta Retargeting Mascotas',
        canal: 'meta',
        canalLabel: 'Meta Ads',
        canalColor: '#0064e0',
        producto: 'Collar GPS para mascotas',
        productos: [
          {
            id: 'prod-collar-gps',
            nombre: 'Collar GPS para mascotas',
            margenPct: 38,
            precioVentaLabel: '$89.900',
            costoBase: 28000,
            fleteBase: 7000,
            stockActual: 145,
            estadoStock: 'ok',
            angulos: [
              { id: 'a-001', nombre: 'Para mamás de mascota', publicoObj: 'Mujeres 28-45 con perro', estado: 'activo', roas: 1.9, pedidosSem: 11 },
              { id: 'a-004', nombre: 'Regalo para tu perro', publicoObj: 'Personas 22-55, regalo', estado: 'activo', roas: 1.7, pedidosSem: 7 },
            ],
            metricas: {
              pedidosSem: 18, cpaReal: 14800, roasCampana: 1.8,
              stockActual: 145, historial5sem: [12, 14, 16, 17, 18], estadoStock: 'ok',
            },
          },
          {
            id: 'prod-collar-gps-v2',
            nombre: 'Collar GPS Pro (v2)',
            margenPct: 42,
            precioVentaLabel: '$109.900',
            costoBase: 34000,
            fleteBase: 7000,
            stockActual: 32,
            estadoStock: 'bajo',
            angulos: [
              { id: 'a-v2-001', nombre: 'Premium para perros grandes', publicoObj: 'Dueños de razas grandes 30-55', estado: 'activo', roas: 2.0, pedidosSem: 8 },
            ],
            metricas: {
              pedidosSem: 8, cpaReal: 11200, roasCampana: 2.0,
              stockActual: 32, historial5sem: [5, 6, 7, 7, 8], estadoStock: 'bajo',
            },
          },
        ],
        estado: 'activa',
        tipoCampana: 'hibrida',
        roasActual: 1.8,
        roasObjetivo: 1.5,
        pedidosSem: 18,
        presupuestoDiario: 20000,
        presupuestoDiarioLabel: '$20.000/día',
        agentes: ['roax-ads'],
        conexiones: ['meta-ads'],
        notaGali: 'ROAS estable. Audiencias de retargeting respondiendo bien.',
      },
    ],
    agentes: ['roax-ads', 'stock-guardian'],
    fechaInicio: '2026-05-01',
    rutaVenta: 'meta-landing-chatea',
    tipoCampana: 'hibrida',
    intentDeclarado: 'Mi ROAS está por encima de 1.8x y quiero doblar',
    subObjetivo: 'Doblar pedidos/sem sin bajar margen',
    productosMetrics: [
      {
        productoId: 'prod-collar-gps',
        nombre: 'Collar GPS para mascotas',
        pedidosSem: 47,
        stockLiberado: 280,
        roasProyecto: 2.1,
        aporteObjetivoPct: 47,
        historialSemanas: [28, 34, 41, 47],
        adaScore: 91,
        notaGali: 'Producto estrella del portafolio. Stock estable y demanda en alza. Proyección: 55 ped/sem en 2 semanas.',
      },
    ],
  },

  // ── Estado 4: Negativo (K-Beauty bajo rendimiento) ───────────────────────
  {
    id: 'pv-004',
    nombre: 'K-Beauty — Bajo rendimiento',
    tipo: 'optimizar',
    estado: 'en_riesgo',
    descripcion: 'ROAS por debajo del umbral mínimo. Gali recomienda revisar creativos o pausar.',
    contribucionPct: 8,
    pedidosSem: 8,
    presupuestoTotal: 18000,
    roasPromedio: 0.9,
    proyeccionSemanas: undefined,
    campanas: [
      {
        id: 'c-005',
        nombre: 'Meta Ads — K-Beauty',
        canal: 'meta',
        canalLabel: 'Meta Ads',
        canalColor: '#0064e0',
        producto: 'Kit Skincare Coreano 5 pasos',
        productos: [
          {
            id: 'prod-kbeauty-kit',
            nombre: 'Kit K-Beauty Hidratación',
            margenPct: 22,
            precioVentaLabel: '$124.900',
            costoBase: 42000,
            fleteBase: 7000,
            stockActual: 12,
            estadoStock: 'bajo',
            angulos: [
              { id: 'a-k01', nombre: 'Antiedad 30+', publicoObj: 'Mujeres 30-50', estado: 'pausado', roas: 1.1, pedidosSem: 4 },
              { id: 'a-k02', nombre: 'Piel seca invierno', publicoObj: 'Mujeres 20-40', estado: 'activo', roas: 0.9, pedidosSem: 3 },
              { id: 'a-k03', nombre: 'Regalo para mamá', publicoObj: 'Personas 20-45', estado: 'borrador' },
            ],
            metricas: {
              pedidosSem: 7, cpaReal: 28900, roasCampana: 0.9,
              stockActual: 12, historial5sem: [15, 12, 10, 8, 7], estadoStock: 'bajo',
            },
          },
        ],
        estado: 'activa',
        tipoCampana: 'ads',
        roasActual: 0.9,
        roasObjetivo: 1.5,
        pedidosSem: 8,
        presupuestoDiario: 18000,
        presupuestoDiarioLabel: '$18.000/día',
        agentes: ['roax-ads'],
        conexiones: ['meta-ads'],
        notaGali: 'ROAS 0.9x — por debajo del umbral. Recomiendo pausar o cambiar creativos.',
      },
    ],
    agentes: ['roax-ads'],
    alertaGali: 'ROAS por debajo del umbral mínimo (1.5x) por 3 días consecutivos. A este ritmo, el proyecto genera pérdidas. Gali recomienda: 1) revisar creativos, 2) ajustar audiencia, o 3) pausar hasta optimizar.',
    fechaInicio: '2026-06-01',
    rutaVenta: 'meta-chatea',
    tipoCampana: 'ads',
    intentDeclarado: 'Quiero corregir este proyecto que no está rindiendo',
    subObjetivo: 'Recuperar ROAS mínimo de 1.5x',
    productosMetrics: [
      {
        productoId: 'prod-kbeauty-kit',
        nombre: 'Kit Skincare Coreano 5 pasos',
        pedidosSem: 8,
        stockLiberado: 45,
        roasProyecto: 0.9,
        aporteObjetivoPct: 8,
        historialSemanas: [18, 14, 10, 8],
        adaScore: 52,
        notaGali: 'Tendencia a la baja por 4 semanas. Considera revisar creativos o pausar. CPM subió 34% esta semana.',
      },
    ],
  },

  // ── Estado 5: CRM sin campañas de ads ───────────────────────────────────
  {
    id: 'pv-005',
    nombre: 'Reactivación base Chatea',
    tipo: 'crm',
    estado: 'activo',
    descripcion: 'Activar base de 800 contactos de Chatea Pro con secuencia de 3 mensajes.',
    contribucionPct: 12,
    pedidosSem: 15,
    presupuestoTotal: 0,
    campanas: [
      {
        id: 'c-chatea-001',
        nombre: 'Secuencia reactivación Jun',
        canal: 'whatsapp',
        canalLabel: 'Chatea Pro',
        canalColor: '#25d366',
        producto: null,
        estado: 'activa',
        tipoCampana: 'chatea',
        roasObjetivo: 0,
        presupuestoDiarioLabel: '$0/día',
        agentes: ['chatea'],
        conexiones: ['chatea-pro'],
        notaGali: '820 contactos activos. Tasa de respuesta 34%. Gali recomienda un mensaje de seguimiento en 48h.',
      },
    ],
    agentes: ['chatea'],
    fechaInicio: '2026-06-10',
    rutaVenta: 'directo',
    tipoCampana: 'chatea',
    intentDeclarado: 'Quiero activar mis clientes que compraron hace 3 meses',
    subObjetivo: 'Reactivar base de contactos existente',
  },

  // ── Estado 6: Proyecto sin campañas (solo seguimiento) ──────────────────
  {
    id: 'pv-006',
    nombre: 'Revisión portafolio Q3',
    tipo: 'optimizar',
    estado: 'borrador',
    descripcion: 'Proyecto creado solo para seguimiento de salud de productos existentes. Sin campañas por ahora.',
    contribucionPct: 0,
    pedidosSem: 0,
    presupuestoTotal: 0,
    campanas: [],
    agentes: ['vigilante', 'ada'],
    fechaInicio: '2026-06-25',
    rutaVenta: null,
    tipoCampana: null,
    intentDeclarado: 'Quiero saber cuáles productos funcionan y cuáles dejar ir',
    subObjetivo: 'Optimizar portafolio actual',
  },

  // ── Estado 7: Proyecto pausado con campañas ──────────────────────────────
  {
    id: 'pv-007',
    nombre: 'Escala Difusor v2',
    tipo: 'escalar',
    estado: 'pausado',
    descripcion: 'Pausa voluntaria mientras se ajustan creativos para la próxima temporada.',
    contribucionPct: 0,
    pedidosSem: 0,
    presupuestoTotal: 55000,
    roasPromedio: 1.7,
    campanas: [
      {
        id: 'c-difusor-meta',
        nombre: 'Meta Ads — Difusor v2',
        canal: 'meta',
        canalLabel: 'Meta Ads',
        canalColor: '#0064e0',
        producto: 'Difusor de aromaterapia ultrasónico',
        estado: 'pausada',
        tipoCampana: 'ads',
        roasActual: 1.7,
        roasObjetivo: 2.0,
        pedidosSem: 0,
        presupuestoDiario: 35000,
        presupuestoDiarioLabel: '$35.000/día',
        agentes: ['roax-ads', 'vigilante'],
        conexiones: ['meta-ads'],
        notaGali: 'Pausada por ajuste de creativos. Lista para reanudar.',
      },
      {
        id: 'c-difusor-chatea',
        nombre: 'Chatea Pro — Difusor v2',
        canal: 'whatsapp',
        canalLabel: 'Chatea Pro',
        canalColor: '#25d366',
        producto: 'Difusor de aromaterapia ultrasónico',
        estado: 'activa',
        tipoCampana: 'chatea',
        roasObjetivo: 0,
        presupuestoDiarioLabel: '$0/día',
        pedidosSem: 6,
        agentes: ['chatea'],
        conexiones: ['chatea-pro'],
        notaGali: 'Chatea Pro activo. 6 pedidos esta semana desde contactos directos.',
      },
    ],
    agentes: ['roax-ads', 'vigilante', 'chatea'],
    fechaInicio: '2026-06-01',
    rutaVenta: 'meta-landing-chatea',
    tipoCampana: 'hibrida',
    intentDeclarado: 'Quiero escalar el difusor que ya tiene ROAS validado',
    subObjetivo: 'Doblar pedidos/sem sin bajar margen',
    pausaLog: {
      fecha: '2026-06-20',
      campanasPausadas: ['c-difusor-meta'],
      nota: 'Pausa manual por ajuste de creativos. La campaña de Meta fue pausada. Chatea Pro sigue activo con 6 pedidos/sem.',
    },
  },
];

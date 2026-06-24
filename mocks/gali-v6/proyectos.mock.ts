export type EstadoProyecto = 'borrador' | 'configurando' | 'activo' | 'en_riesgo' | 'en_escala' | 'pausado' | 'cerrado';

export interface CampanaProyecto {
  id: string;
  nombre: string;
  canal: 'meta' | 'tiktok' | 'whatsapp' | 'google';
  canalLabel: string;
  canalColor: string;
  producto: string | null;
  estado: 'activa' | 'sin_producto' | 'pausada' | 'borrador';
  roasActual?: number;
  roasObjetivo: number;
  pedidosSem?: number;
  presupuestoDiario?: number;
  presupuestoDiarioLabel: string;
  agentes: string[];
  conexiones: string[];
  notaGali?: string;
}

export interface ProyectoDetalle {
  id: string;
  nombre: string;
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
}

export const PROYECTOS_MOCK: ProyectoDetalle[] = [
  // ── Estado 1: Vacío (borrador sin nada) ──────────────────────────────────
  {
    id: 'pv-001',
    nombre: 'Mi primer proyecto',
    estado: 'borrador',
    descripcion: 'Proyecto recién creado. Falta asignar producto y crear campañas.',
    contribucionPct: 0,
    pedidosSem: 0,
    presupuestoTotal: 0,
    campanas: [],
    agentes: [],
    fechaInicio: '2026-06-20',
  },

  // ── Estado 2: Campañas sin producto ─────────────────────────────────────
  {
    id: 'pv-002',
    nombre: 'Estrategia Q3 — Sin producto',
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
  },

  // ── Estado 3: Positivo (Collar GPS escalando) ────────────────────────────
  {
    id: 'pv-003',
    nombre: 'Collar GPS — Escalando',
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
        estado: 'activa',
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
        estado: 'activa',
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
  },

  // ── Estado 4: Negativo (K-Beauty bajo rendimiento) ───────────────────────
  {
    id: 'pv-004',
    nombre: 'K-Beauty — Bajo rendimiento',
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
        estado: 'activa',
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
  },
];

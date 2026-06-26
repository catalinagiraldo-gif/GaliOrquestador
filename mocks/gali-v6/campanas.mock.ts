/**
 * Mock de Campañas para Gali 6.
 * Las campañas viven dentro de Proyectos y están atadas a 1+ productos Dropi.
 * Jerarquía: Objetivo → Proyecto → Campaña → Productos
 */

export type CampanaEstado = 'activa' | 'pausada' | 'borrador' | 'cerrada';
export type CampanaCanal = 'meta-ads' | 'tiktok-ads' | 'google-ads' | 'organico' | 'whatsapp';
export type TipoCampana = 'ads' | 'chatea' | 'hibrida' | 'organica';

export interface ProductoRef {
  id: string;
  nombre: string;
  skuDropi?: string;
  precioVenta: number;
  precioVentaLabel: string;
  margenPct: number;
}

export interface CampanaAgente {
  agenteId: string;
  nombre: string;
  activo: boolean;
}

export interface Campana {
  id: string;
  proyectoId: string;
  nombre: string;
  descripcion?: string;
  estado: CampanaEstado;
  canal: CampanaCanal;
  canalLabel: string;
  tipoCampana: TipoCampana;
  productos: ProductoRef[];
  presupuestoDiario: number;
  presupuestoDiarioLabel: string;
  roasActual?: number;
  roasActualLabel?: string;
  roasObjetivo: number;
  pedidosSem?: number;
  agentesActivos: CampanaAgente[];
  fechaInicio: string;
  fechaFin?: string;
  /** Si true, fue sugerida automáticamente por Gali al crear el proyecto */
  sugeridaPorGali?: boolean;
  /** Nota breve de Gali sobre el rendimiento actual */
  notaGali?: string;
}

export const MOCK_CAMPANAS: Campana[] = [
  // Campañas del proyecto "collar-gps-2026"
  {
    id: 'camp-001',
    proyectoId: 'collar-gps-2026',
    nombre: 'Campaña TikTok — Collar GPS',
    descripcion: 'Campaña de lanzamiento en TikTok con enfoque en dueños de mascotas jóvenes',
    estado: 'activa',
    canal: 'tiktok-ads',
    canalLabel: 'TikTok Ads',
    tipoCampana: 'ads',
    productos: [
      {
        id: 'prod-collar-gps',
        nombre: 'Collar GPS para mascotas',
        skuDropi: 'DRP-8823',
        precioVenta: 89000,
        precioVentaLabel: '$89.000',
        margenPct: 24,
      },
    ],
    presupuestoDiario: 45000,
    presupuestoDiarioLabel: '$45k/día',
    roasActual: 2.1,
    roasActualLabel: '2.1x',
    roasObjetivo: 1.8,
    pedidosSem: 28,
    agentesActivos: [
      { agenteId: 'roas-tracker', nombre: 'ROAS Tracker', activo: true },
      { agenteId: 'stock-guardian', nombre: 'Stock Guardian', activo: true },
    ],
    fechaInicio: '2026-05-20',
    sugeridaPorGali: true,
    notaGali: 'Rendimiento por encima del objetivo. ROAS 2.1x sostenido 7 días.',
  },
  {
    id: 'camp-002',
    proyectoId: 'collar-gps-2026',
    nombre: 'Retargeting Meta — Collar GPS',
    descripcion: 'Campaña de retargeting para visitantes que no convirtieron en los últimos 14 días',
    estado: 'activa',
    canal: 'meta-ads',
    canalLabel: 'Meta Ads',
    tipoCampana: 'hibrida',
    productos: [
      {
        id: 'prod-collar-gps',
        nombre: 'Collar GPS para mascotas',
        skuDropi: 'DRP-8823',
        precioVenta: 89000,
        precioVentaLabel: '$89.000',
        margenPct: 24,
      },
    ],
    presupuestoDiario: 21000,
    presupuestoDiarioLabel: '$21k/día',
    roasActual: 1.6,
    roasActualLabel: '1.6x',
    roasObjetivo: 1.5,
    pedidosSem: 19,
    agentesActivos: [
      { agenteId: 'roas-tracker', nombre: 'ROAS Tracker', activo: true },
    ],
    fechaInicio: '2026-06-01',
    sugeridaPorGali: false,
  },

  // Campañas del proyecto "difusor-aromaterapia"
  {
    id: 'camp-003',
    proyectoId: 'difusor-aromaterapia',
    nombre: 'Lanzamiento Meta — Difusor',
    descripcion: 'Campaña de lanzamiento aprovechando ventana de tendencia detectada por ADA Spy',
    estado: 'activa',
    canal: 'meta-ads',
    canalLabel: 'Meta Ads',
    tipoCampana: 'ads',
    productos: [
      {
        id: 'prod-difusor',
        nombre: 'Difusor de aromaterapia ultrasónico',
        skuDropi: 'DRP-4421',
        precioVenta: 65000,
        precioVentaLabel: '$65.000',
        margenPct: 28,
      },
    ],
    presupuestoDiario: 35000,
    presupuestoDiarioLabel: '$35k/día',
    roasActual: 1.4,
    roasActualLabel: '1.4x',
    roasObjetivo: 1.8,
    pedidosSem: 12,
    agentesActivos: [
      { agenteId: 'roas-tracker', nombre: 'ROAS Tracker', activo: true },
      { agenteId: 'stock-guardian', nombre: 'Stock Guardian', activo: true },
      { agenteId: 'logistics-pro', nombre: 'Logistics Pro', activo: true },
    ],
    fechaInicio: '2026-06-05',
    sugeridaPorGali: true,
    notaGali: 'ROAS aún por debajo del objetivo (1.4x vs 1.8x). Semana 1 de lanzamiento — normal. Vigilando.',
  },
  {
    id: 'camp-004',
    proyectoId: 'difusor-aromaterapia',
    nombre: 'TikTok Orgánico — Difusor',
    estado: 'borrador',
    canal: 'tiktok-ads',
    canalLabel: 'TikTok Ads',
    tipoCampana: 'organica',
    productos: [
      {
        id: 'prod-difusor',
        nombre: 'Difusor de aromaterapia ultrasónico',
        skuDropi: 'DRP-4421',
        precioVenta: 65000,
        precioVentaLabel: '$65.000',
        margenPct: 28,
      },
    ],
    presupuestoDiario: 0,
    presupuestoDiarioLabel: '$0/día',
    roasObjetivo: 2.0,
    agentesActivos: [],
    fechaInicio: '2026-06-15',
    sugeridaPorGali: true,
  },

  // Campañas del proyecto "k-beauty-skincare"
  {
    id: 'camp-005',
    proyectoId: 'k-beauty-skincare',
    nombre: 'Meta Ads — K-Beauty Bogotá',
    estado: 'pausada',
    canal: 'meta-ads',
    canalLabel: 'Meta Ads',
    tipoCampana: 'ads',
    productos: [
      {
        id: 'prod-kbeauty-serum',
        nombre: 'Sérum vitamina C K-Beauty',
        skuDropi: 'DRP-7732',
        precioVenta: 78000,
        precioVentaLabel: '$78.000',
        margenPct: 31,
      },
      {
        id: 'prod-kbeauty-toner',
        nombre: 'Tónico hidratante K-Beauty',
        skuDropi: 'DRP-7733',
        precioVenta: 55000,
        precioVentaLabel: '$55.000',
        margenPct: 27,
      },
    ],
    presupuestoDiario: 28000,
    presupuestoDiarioLabel: '$28k/día',
    roasActual: 0.9,
    roasActualLabel: '0.9x',
    roasObjetivo: 1.8,
    pedidosSem: 7,
    agentesActivos: [
      { agenteId: 'roas-tracker', nombre: 'ROAS Tracker', activo: true },
    ],
    fechaInicio: '2026-05-28',
    notaGali: 'Pausado por ROAS < 1x por 3 días. Requiere revisión de creativos y segmentación.',
  },

  // Campaña Chatea Pro pura (sin pauta) — proyecto pv-005
  {
    id: 'camp-chatea-001',
    proyectoId: 'pv-005',
    nombre: 'Secuencia Reactivación Jun',
    descripcion: 'Secuencia de 3 mensajes en WhatsApp para reactivar base de clientes inactivos',
    estado: 'activa',
    canal: 'whatsapp',
    canalLabel: 'Chatea Pro',
    tipoCampana: 'chatea',
    productos: [],
    presupuestoDiario: 0,
    presupuestoDiarioLabel: '$0/día',
    roasObjetivo: 0,
    pedidosSem: 15,
    agentesActivos: [
      { agenteId: 'chatea-pro', nombre: 'Chatea Pro', activo: true },
    ],
    fechaInicio: '2026-06-10',
    sugeridaPorGali: true,
    notaGali: '820 contactos activos. Tasa de respuesta 34%. Gali recomienda un mensaje de seguimiento en 48h.',
  },
];

/** Sugerencias de campañas que Gali ofrece al crear un nuevo proyecto */
export interface SugerenciaCampana {
  id: string;
  nombre: string;
  descripcion: string;
  canal: CampanaCanal;
  canalLabel: string;
  presupuestoDiarioEstimado: number;
  presupuestoDiarioEstimadoLabel: string;
  roasObjetivoRecomendado: number;
  agentesRecomendados: string[];
  /** Por qué Gali sugiere esta campaña */
  razonGali: string;
}

export const SUGERENCIAS_CAMPANA_NUEVO_PROYECTO: SugerenciaCampana[] = [
  {
    id: 'sug-lanzamiento',
    nombre: 'Campaña de Lanzamiento',
    descripcion: 'Ideal para testear el producto y validar que hay demanda antes de escalar',
    canal: 'meta-ads',
    canalLabel: 'Meta Ads',
    presupuestoDiarioEstimado: 30000,
    presupuestoDiarioEstimadoLabel: '$30k/día',
    roasObjetivoRecomendado: 1.5,
    agentesRecomendados: ['roas-tracker', 'stock-guardian'],
    razonGali: 'Para proyectos nuevos, empezar con presupuesto bajo y Meta Ads reduce el riesgo mientras validas demanda',
  },
  {
    id: 'sug-escala',
    nombre: 'Campaña de Escala',
    descripcion: 'Para cuando ya tienes ROAS validado y quieres maximizar el volumen de pedidos',
    canal: 'meta-ads',
    canalLabel: 'Meta Ads',
    presupuestoDiarioEstimado: 80000,
    presupuestoDiarioEstimadoLabel: '$80k/día',
    roasObjetivoRecomendado: 2.0,
    agentesRecomendados: ['roas-tracker', 'stock-guardian', 'logistics-pro'],
    razonGali: 'Basado en tu ROAS histórico de 1.93x, tienes el perfil para escalar a este presupuesto manteniendo rentabilidad',
  },
  {
    id: 'sug-tiktok',
    nombre: 'Campaña TikTok',
    descripcion: 'Canal con alto alcance orgánico para productos visuales y de tendencia',
    canal: 'tiktok-ads',
    canalLabel: 'TikTok Ads',
    presupuestoDiarioEstimado: 40000,
    presupuestoDiarioEstimadoLabel: '$40k/día',
    roasObjetivoRecomendado: 1.7,
    agentesRecomendados: ['roas-tracker'],
    razonGali: 'TikTok funciona muy bien para productos de moda y hogar. Puedes lograr CPAs más bajos que en Meta con buenos creativos',
  },
];

// ── Integraciones para nueva campaña ────────────────────────────────────────

export type IntegracionId = 'meta-ads' | 'tiktok-ads' | 'shopify' | 'chatea-pro';

export interface IntegracionStatus {
  id: IntegracionId;
  nombre: string;
  descripcion: string;
  estado: 'conectado' | 'pendiente';
  pasosConexion: string[];
}

export const INTEGRACIONES_CAMPANA: IntegracionStatus[] = [
  {
    id: 'meta-ads',
    nombre: 'Meta Ads',
    descripcion: 'Facebook & Instagram Ads',
    estado: 'conectado',
    pasosConexion: [
      'Crear cuenta en Meta Business Suite',
      'Configurar el Píxel de Meta en tu sitio',
      'Ir a Dropi › Conexiones › Meta Ads y autorizar',
      'Verificar el dominio en Meta Business',
    ],
  },
  {
    id: 'tiktok-ads',
    nombre: 'TikTok for Business',
    descripcion: 'TikTok Ads — alcance orgánico y de pago',
    estado: 'conectado',
    pasosConexion: [
      'Crear cuenta en TikTok Business Center',
      'Instalar el Píxel de TikTok en tu sitio',
      'Ir a Dropi › Conexiones › TikTok y autorizar',
      'Verificar la cuenta de anunciante',
    ],
  },
  {
    id: 'shopify',
    nombre: 'Shopify + DROPIFY',
    descripcion: 'Tienda online con plugin Dropi integrado',
    estado: 'conectado',
    pasosConexion: [
      'Crear una tienda en Shopify',
      'Instalar la app DROPIFY desde el Shopify App Store',
      'Configurar DROPIFY: vincular cuenta Dropi',
      'Ir a Dropi › Conexiones › Shopify y autorizar',
    ],
  },
  {
    id: 'chatea-pro',
    nombre: 'Chatea Pro',
    descripcion: 'WhatsApp Business automatizado para ventas y soporte',
    estado: 'pendiente',
    pasosConexion: [
      'Activar tu cuenta en Chatea Pro',
      'Conectar tu número de WhatsApp Business',
      'Configurar los flujos de bienvenida y confirmación',
      'Ir a Dropi › Conexiones › Chatea Pro y autorizar',
    ],
  },
];

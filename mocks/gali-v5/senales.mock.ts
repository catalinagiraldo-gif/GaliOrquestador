export type SignalType = 'opportunity' | 'scale' | 'trend' | 'risk' | 'completed';
export type AlertType  = 'critical' | 'warning' | 'info';
/**
 * Tipo de proceso que generó la señal.
 * deterministico = dato directo de BD Dropi, siempre confiable.
 * ia = generado por análisis de IA, puede variar con el modelo.
 */
export type SignalFuenteTipo = 'deterministico' | 'ia';

export interface SignalMetricPair {
  label: string;
  val: string;
}

export interface GaliSignal {
  id: string;
  tipo: SignalType;
  titulo: string;
  contextoMacromundo: string;
  recomendacion: string;
  ventanaDias: number;
  ctaPrincipal: string;
  ctaSecundario: string;
  agente: string;
  /** ID del agente especializado que generó esta señal (ej: 'roas-tracker', 'stock-guardian') */
  agenteOrigenId?: string;
  /** Nombre legible del agente origen */
  agenteOrigenNombre?: string;
  /**
   * Tipo de proceso que generó la señal.
   * - deterministico: viene de datos reales de Dropi — 100% confiable
   * - ia: análisis o recomendación de IA — puede variar, verificar antes de actuar
   */
  fuente: SignalFuenteTipo;
  proyectoId?: string;
  /** ID de la campaña asociada (nueva jerarquía Proyecto → Campaña) */
  campanaId?: string;
  metrica?: string;
  fechaDeteccion: string;
  segunDatos?: string;
  skillCta?: string;
  /** Resumen de lo que Gali ya hizo antes de mostrar esta señal */
  resolucionResumen?: string;
  /** Métricas del estado ANTES de tomar la acción */
  beforeState?: SignalMetricPair[];
  /** Métricas del estado DESPUÉS (proyectado/resultado) */
  afterState?: SignalMetricPair[];
  /** Breve descripción de qué hizo Gali para llegar aquí */
  galiFlowDesc?: string;
  /** Si true, la acción Lanzar lleva a nuevo-proyecto pre-cargado */
  canLaunch?: boolean;
  /** Pedidos semanales estimados si se lanza este proyecto */
  pedidosEstimados?: number;
  /** Resultado real después de que el usuario aprobó la acción */
  resultadoEjecutado?: {
    fecha: string;
    descripcion: string;
    metrica?: string;
  };
}

export interface AlertaOpcion {
  id: string;
  label: string;
  description: string;
  impactoEstimado: string;
  isPrimary: boolean;
}

export interface GaliAlerta {
  id: string;
  tipo: AlertType;
  titulo: string;
  descripcion: string;
  impacto: string;
  impactoSiActua?: string;
  ctaPrincipal: string;
  ctaSecundario: string;
  agente: string;
  /** ID del agente especializado que generó esta alerta */
  agenteOrigenId?: string;
  /** Nombre legible del agente origen */
  agenteOrigenNombre?: string;
  /**
   * Tipo de proceso que generó la alerta.
   * - deterministico: umbral superado en datos reales — siempre confiable
   * - ia: análisis de IA — puede variar
   */
  fuente: SignalFuenteTipo;
  agenteColor?: string;
  opciones?: AlertaOpcion[];
  proyectoId?: string;
  /** ID de la campaña asociada */
  campanaId?: string;
  pedidosAfectados?: number;
  fechaDeteccion: string;
  /** Resumen de lo que Gali ya hizo antes de mostrar esta alerta */
  resolucionResumen?: string;
  /** ID del pedido que originó esta alerta (para deep-link desde mis-pedidos) */
  originPedidoId?: string;
}

export const MOCK_SENALES: GaliSignal[] = [
  {
    id: 'sen-001',
    tipo: 'scale',
    fuente: 'ia',
    agenteOrigenId: 'roas-tracker',
    agenteOrigenNombre: 'ROAS Tracker',
    titulo: 'Ventana de escala para Collar GPS',
    contextoMacromundo:
      'Según datos de la red Dropi: 847 dropshippers activos en categoría mascotas esta semana. ' +
      'Los que escalaron pauta en los últimos 7 días generan en promedio $2.3 por cada $1 invertido en pauta. ' +
      'Tú generas $1.93 por $1 y tienes margen del 22% — estás en el grupo de dropshippers que más se beneficia al escalar ahora.',
    recomendacion:
      'Roax propone escalar pauta de $66k a $86k/día (+30%). ' +
      'Estimado: +12 pedidos/sem · ganancia adicional ~$105k/sem.',
    ventanaDias: 14,
    ctaPrincipal: 'Aprobar escala $86k/día',
    ctaSecundario: 'Ver proyección completa',
    agente: 'roax',
    proyectoId: 'collar-gps-2026',
    metrica: 'ROAS 1.93x · Margen 22% · +30% pauta',
    segunDatos: 'Según datos de 847 dropshippers en categoría mascotas en Dropi esta semana',
    fechaDeteccion: '2026-06-03T08:00:00Z',
    resolucionResumen: 'Roax monitoreó ROAS durante 72h y confirmó estabilidad antes de sugerir el escalado. Simuló 3 escenarios de presupuesto y seleccionó el de menor riesgo.',
    galiFlowDesc: 'Roax monitoreó ROAS por 72h · comparó 847 casos similares · simuló 3 escenarios',
    beforeState: [
      { label: 'Pauta diaria', val: '$66.000/día' },
      { label: 'ROAS real', val: '1.93x' },
      { label: 'Pedidos/sem', val: '47' },
    ],
    afterState: [
      { label: 'Pauta diaria', val: '$86.000/día (+30%)' },
      { label: 'ROAS proyectado', val: '1.9x–2.1x' },
      { label: 'Pedidos/sem est.', val: '~61 (+14)' },
    ],
    canLaunch: false,
    resultadoEjecutado: {
      fecha: '24 Jun',
      descripcion: 'ROAS Tracker escaló Collar GPS de $66k → $86k/día. Pauta activa con nuevo presupuesto.',
      metrica: '+$105k proyectados esta semana · ROAS en 2.0x a las 24h',
    },
  },
  {
    id: 'sen-002',
    tipo: 'trend',
    fuente: 'ia',
    agenteOrigenId: 'product-scout',
    agenteOrigenNombre: 'Product Scout',
    titulo: 'Difusor de aromaterapia: tendencia emergente en Bogotá',
    contextoMacromundo:
      'ADA Spy detectó: búsquedas de "difusor de aromaterapia" +67% en Bogotá ' +
      'esta semana vs semana anterior. 3 dropshippers del top 10 de Dropi ya lo lanzaron. ' +
      'Score de producto: 87/100 (riesgo bajo, margen alto).',
    recomendacion:
      'Si lanzas ahora tienes 7-10 días antes de saturación. ' +
      'ADA Spy encontró proveedor con stock 2.400 unidades y margen estimado 28%.',
    ventanaDias: 10,
    ctaPrincipal: 'Ver producto en catálogo',
    ctaSecundario: 'Crear proyecto nuevo',
    agente: 'ada',
    metrica: 'Score 87/100 · Margen est. 28%',
    segunDatos: 'Según datos de 847 dropshippers en categoría hogar y bienestar esta semana en Dropi',
    fechaDeteccion: '2026-06-03T10:30:00Z',
    resolucionResumen: 'ADA Spy escaneó 1.240 productos esta semana y filtró los de score > 80. El difusor pasó los 3 criterios clave: margen > 25%, proveedor con stock > 500 uds, tendencia creciente.',
    galiFlowDesc: 'ADA Spy escaneó 1.240 productos · filtró score > 80 · validó proveedor con stock 2.400 uds',
    beforeState: [
      { label: 'Difusor en catálogo', val: 'No' },
      { label: 'Ventana disponible', val: '7–10 días' },
      { label: 'Competidores activos', val: '3 del top-10' },
    ],
    afterState: [
      { label: 'Proyecto nuevo', val: 'Creado con plantilla' },
      { label: 'Margen estimado', val: '28%' },
      { label: 'Stock proveedor', val: '2.400 uds disponibles' },
    ],
    canLaunch: true,
    pedidosEstimados: 18,
  },
  {
    id: 'sen-003',
    tipo: 'opportunity',
    fuente: 'ia',
    agenteOrigenId: 'product-scout',
    agenteOrigenNombre: 'Product Scout',
    titulo: 'Skincare K-Beauty: audiencia no explotada en Medellín',
    contextoMacromundo:
      'Búsquedas de K-Beauty +42% en Medellín esta semana en la red Dropi. ' +
      'Tu campaña actual solo cubre Bogotá, Cali y Barranquilla. ' +
      'Dropshippers con segmentación en Medellín tienen CTR 1.4% vs tu 1.1%.',
    recomendacion:
      'Roax puede agregar Medellín a la segmentación de campaña activa. ' +
      'Estimado: +8-15 pedidos/sem sin aumentar presupuesto total.',
    ventanaDias: 7,
    ctaPrincipal: 'Agregar Medellín a segmentación',
    ctaSecundario: 'Ver análisis de Roax',
    agente: 'roax',
    proyectoId: 'skincare-kbeauty',
    metrica: 'CTR estimado +27% · +8-15 pedidos/sem extra',
    segunDatos: 'Según datos de 312 dropshippers en K-Beauty esta semana en Dropi Colombia',
    fechaDeteccion: '2026-06-03T14:00:00Z',
    galiFlowDesc: 'Roax cruzó datos de tu campaña con 312 competidores · detectó audiencia sin cubrir en Medellín',
    beforeState: [
      { label: 'Ciudades activas', val: 'Bogotá, Cali, Barranquilla' },
      { label: 'CTR actual', val: '1.1%' },
      { label: 'Pedidos/sem', val: '47' },
    ],
    afterState: [
      { label: 'Ciudades + Medellín', val: '+4ª ciudad' },
      { label: 'CTR estimado', val: '1.4% (+27%)' },
      { label: 'Pedidos extras/sem', val: '+8–15 sin más presupuesto' },
    ],
    canLaunch: false,
  },
  {
    id: 'sen-004',
    tipo: 'risk',
    fuente: 'deterministico',
    agenteOrigenId: 'stock-guardian',
    agenteOrigenNombre: 'Stock Guardian',
    titulo: 'Stock Collar GPS: 87 unidades restantes',
    contextoMacromundo:
      'PetStore Colombia tiene 87 unidades de Collar GPS en inventario. ' +
      'Con tu ritmo actual de 47 pedidos/semana, el stock se agota en ~13 días. ' +
      'Históricamente, este proveedor tarda 8-12 días en reponer.',
    recomendacion:
      'ADA Spy encontró 2 proveedores alternativos con stock alto y precio similar: ' +
      'TechPet (+$800/unidad) y GadgetMascotas (+$1.200/unidad). ' +
      'Recomendación: hacer pedido de reposición esta semana.',
    ventanaDias: 7,
    ctaPrincipal: 'Ver proveedores alternativos',
    ctaSecundario: 'Alertar proveedor actual',
    agente: 'ada',
    proyectoId: 'collar-gps-2026',
    metrica: '87 uds · ~13 días de stock restante',
    skillCta: 'Pausar campaña si stock < 50 unidades',
    fechaDeteccion: '2026-06-04T07:00:00Z',
    galiFlowDesc: 'ADA Spy monitoreó stock 7 días · calculó ritmo real · encontró 2 proveedores alternativos',
    beforeState: [
      { label: 'Stock restante', val: '87 uds' },
      { label: 'Días estimados', val: '~13 días' },
      { label: 'Proveedor alternativo', val: 'Sin confirmar' },
    ],
    afterState: [
      { label: 'Pedido de reposición', val: 'Solicitado a PetStore' },
      { label: 'Alternativa activa', val: 'TechPet (+$800/ud)' },
      { label: 'Alerta automática', val: 'Activada < 50 uds' },
    ],
    canLaunch: false,
  },
  {
    id: 'sen-005',
    tipo: 'opportunity',
    fuente: 'ia',
    agenteOrigenId: 'roas-tracker',
    agenteOrigenNombre: 'ROAS Tracker',
    titulo: 'Bandas de Fitness: CTR recuperado — momento de reactivar',
    contextoMacromundo:
      'El creative de Bandas de Fitness tiene CTR 1.4% (estable) tras 5 días pausado. ' +
      'Dropi reporta +19% en ventas de fitness en Colombia en las últimas 2 semanas ' +
      '(temporada inicio de año escolar, retomo de rutinas).',
    recomendacion:
      'Roax sugiere reactivar con presupuesto reducido $20k/día (antes $32k/día). ' +
      'Estrategia: probar con el mismo creative que estaba activo al momento de la pausa.',
    ventanaDias: 10,
    ctaPrincipal: 'Reactivar con $20k/día',
    ctaSecundario: 'Revisar proyecto',
    agente: 'roax',
    proyectoId: 'fitness-bands',
    metrica: 'CTR 1.4% estable · presupuesto sugerido $20k/día',
    segunDatos: 'Según datos de 524 dropshippers en fitness esta semana en Dropi',
    fechaDeteccion: '2026-06-04T09:00:00Z',
    galiFlowDesc: 'Roax monitoreó CTR 5 días · confirmó estabilidad · comparó con 524 casos en Dropi',
    beforeState: [
      { label: 'Estado campaña', val: 'Pausada' },
      { label: 'Pauta diaria', val: '$0/día' },
      { label: 'CTR última semana', val: '1.4% estable' },
    ],
    afterState: [
      { label: 'Estado campaña', val: 'Activa' },
      { label: 'Pauta diaria', val: '$20.000/día' },
      { label: 'Pedidos esperados', val: '+6–9/sem estimados' },
    ],
    canLaunch: false,
  },
  {
    id: 'sen-006',
    tipo: 'opportunity',
    fuente: 'ia',
    agenteOrigenId: 'product-scout',
    agenteOrigenNombre: 'Product Scout',
    titulo: 'Ventana de mercado: Cali y búsquedas de collar mascotas',
    contextoMacromundo:
      'Según datos de 1.200 dropshippers en Colombia esta semana, el volumen de ' +
      'búsquedas de "collar mascotas" en Cali subió 34% vs semana anterior ' +
      '(847 búsquedas locales vs 631). Los dropshippers con presencia en Cali ' +
      'tienen CTR 1.6% vs tu promedio nacional de 1.1%.',
    recomendacion:
      'Gali recomienda lanzar creatividad nueva en Cali con ángulo emocional ' +
      '(mascotas + familia) antes del viernes, que es cuando los competidores ' +
      'típicamente reaccionan a este tipo de tendencias en la red Dropi.',
    ventanaDias: 7,
    ctaPrincipal: 'Crear proyecto Cali ahora',
    ctaSecundario: 'Ver análisis de mercado',
    agente: 'ada',
    metrica: 'CTR est. +0.5pp · Ventana 7 días',
    fechaDeteccion: '2026-06-09T09:00:00Z',
    canLaunch: true,
    pedidosEstimados: 12,
  },
  {
    id: 'sen-007',
    tipo: 'risk',
    fuente: 'ia',
    agenteOrigenId: 'roas-tracker',
    agenteOrigenNombre: 'ROAS Tracker',
    titulo: 'Saturación de audiencia en Meta — Bandas de Fitness',
    contextoMacromundo:
      'Según datos de 520 dropshippers activos en fitness en Dropi esta semana, ' +
      'el creative de formato estático lleva en promedio 19 días activos antes de ' +
      'saturarse. Tu creative actual lleva 21 días. El 78% de dropshippers que ' +
      'no rotaron creative antes del día 21 vieron su ROAS caer por debajo del objetivo.',
    recomendacion:
      'Roax recomienda pausar el creative actual y activar el creativo B ' +
      'que tenías en cola. Estimado de recuperación: CTR 1.4→1.8% en 72h.',
    ventanaDias: 5,
    ctaPrincipal: 'Activar creative B ahora',
    ctaSecundario: 'Ver historial de creativos',
    agente: 'roax',
    proyectoId: 'fitness-bands',
    metrica: 'Creative 21 días · ROAS en riesgo',
    fechaDeteccion: '2026-06-10T08:00:00Z',
    canLaunch: false,
  },
];

export const MOCK_ALERTAS: GaliAlerta[] = [
  {
    id: 'alt-001',
    tipo: 'critical',
    fuente: 'deterministico',
    agenteOrigenId: 'logistics-pro',
    agenteOrigenNombre: 'Logistics Pro',
    titulo: 'Coordinadora Bogotá: 15% novedad — 12 pedidos en riesgo',
    descripcion:
      'Coordinadora lleva 3 días consecutivos con novedad > 12% en rutas de Bogotá. ' +
      'Hoy 15.3%. 12 de tus pedidos activos tienen destino Bogotá con esta transportadora.',
    impacto: '~3 novedades estimadas si no se actúa · ~$51k en riesgo',
    impactoSiActua: '~$51k protegidos si cambias ahora',
    ctaPrincipal: 'Cambiar 12 pedidos a Servientrega',
    ctaSecundario: 'Ver detalle por pedido',
    agente: 'vigilante',
    agenteColor: '#fbbf24',
    opciones: [
      {
        id: 'a',
        label: 'Cambiar 12 pedidos a Servientrega',
        description: 'Tasa actual de Servientrega: 3.8%',
        impactoEstimado: '~$51k protegidos',
        isPrimary: true,
      },
      {
        id: 'b',
        label: 'Cambiar solo los pedidos de hoy',
        description: 'Esperar datos de mañana antes de mover el resto',
        impactoEstimado: 'Menor alcance',
        isPrimary: false,
      },
    ],
    proyectoId: 'collar-gps-2026',
    pedidosAfectados: 12,
    fechaDeteccion: '2026-06-04T06:00:00Z',
    resolucionResumen: 'Vigilante monitoreó Coordinadora Bogotá por 3 días consecutivos y comparó con el histórico de las últimas 4 semanas. Identificó los 12 pedidos afectados por destino y los marcó para reasignación.',
    originPedidoId: 'PED-48291',
  },
  {
    id: 'alt-002',
    tipo: 'critical',
    fuente: 'deterministico',
    agenteOrigenId: 'logistics-pro',
    agenteOrigenNombre: 'Logistics Pro',
    titulo: 'Siigo desconectado — $450k sin facturar',
    descripcion:
      'La integración con Siigo lleva 6 días desconectada. ' +
      '$450.000 en ventas confirmadas no han generado facturas electrónicas. ' +
      'Riesgo fiscal activo — cierre del período fiscal en 8 días.',
    impacto: '$450k sin facturar · Riesgo DIAN activo · 8 días para cierre',
    ctaPrincipal: 'Reconectar Siigo ahora',
    ctaSecundario: 'Ver facturas pendientes',
    agente: 'kronos',
    pedidosAfectados: 0,
    fechaDeteccion: '2026-06-04T08:00:00Z',
    resolucionResumen: 'Kronos detectó la desconexión de Siigo el día 2 y calculó el valor acumulado sin facturar diariamente. Generó un reporte de las transacciones pendientes listo para importar al reconectar.',
  },
  {
    id: 'alt-003',
    tipo: 'warning',
    fuente: 'ia',
    agenteOrigenId: 'roas-tracker',
    agenteOrigenNombre: 'ROAS Tracker',
    titulo: 'Skincare K-Beauty: tu anuncio está perdiendo efectividad',
    descripcion:
      'Tu anuncio de Skincare está perdiendo efectividad — el clic de cada 100 usuarios bajó de 1.8 a 1.1 en las últimas 48h. ' +
      'Roax detectó que el creative lleva 18 días activo (límite recomendado: 14 días) y la audiencia se está saturando.',
    impacto: 'Las ventas de Skincare en riesgo de caer esta semana si no se cambia el anuncio',
    impactoSiActua: 'CTR puede volver a 1.8%+ con creative fresco — ~$12k adicionales esta semana',
    ctaPrincipal: 'Activar creative alternativo',
    ctaSecundario: 'Ver diagnóstico de Roax',
    agente: 'roax',
    agenteColor: '#f97316',
    opciones: [
      {
        id: 'a',
        label: 'Activar creative alternativo B (ya preparado)',
        description: 'Roax detectó que el creative B tiene +22% CTR histórico en la misma audiencia',
        impactoEstimado: '~$12k adicionales esta semana',
        isPrimary: true,
      },
      {
        id: 'b',
        label: 'Pausar 24h y esperar datos frescos',
        description: 'Detener gasto mientras el equipo prepara creative nuevo',
        impactoEstimado: 'Menor riesgo, sin ventas hoy',
        isPrimary: false,
      },
    ],
    proyectoId: 'skincare-kbeauty',
    pedidosAfectados: 0,
    fechaDeteccion: '2026-06-04T10:00:00Z',
  },
  {
    id: 'alt-004',
    tipo: 'warning',
    fuente: 'deterministico',
    agenteOrigenId: 'stock-guardian',
    agenteOrigenNombre: 'Stock Guardian',
    titulo: 'Stock bajo: Collar GPS — 87 unidades restantes',
    descripcion:
      'A tu ritmo de 47 pedidos/semana, el stock se agota en ~13 días. ' +
      'PetStore Colombia tarda 8-12 días en reponer. Tienes ~6 días útiles de margen.',
    impacto: 'Riesgo de campaña sin stock en ~6 días útiles',
    ctaPrincipal: 'Activar pausa automática si stock < 50 uds',
    ctaSecundario: 'Ver proveedores alternativos',
    agente: 'ada',
    proyectoId: 'collar-gps-2026',
    pedidosAfectados: 0,
    fechaDeteccion: '2026-06-04T11:00:00Z',
  },
  {
    id: 'alt-005',
    tipo: 'critical',
    fuente: 'deterministico',
    agenteOrigenId: 'roas-tracker',
    agenteOrigenNombre: 'ROAS Tracker',
    titulo: 'Bandas de Fitness: ROAS cayó bajo umbral — 1.2x en últimas 48h',
    descripcion:
      'El ROAS de Bandas de Fitness cayó de 2.1x a 1.2x en las últimas 48 horas. ' +
      'Tu margen mínimo para no perder dinero con este producto es 1.4x. ' +
      'Roax identificó que el creative activo lleva 21 días y está saturado.',
    impacto: 'Estás perdiendo dinero en cada peso de pauta invertido · $18k/día en riesgo',
    impactoSiActua: 'Detener el sangrado hoy — recuperación posible en 4-5 días con nuevo creative',
    ctaPrincipal: 'Pausar campaña inmediatamente',
    ctaSecundario: 'Ver diagnóstico de Roax',
    agente: 'roax',
    agenteColor: '#f97316',
    opciones: [
      {
        id: 'a',
        label: 'Pausar campaña y lanzar creative nuevo en 48h',
        description: 'Roax preparó un brief de creative basado en los últimos 3 ganadores de esta categoría',
        impactoEstimado: 'Parar pérdida de $18k/día',
        isPrimary: true,
      },
      {
        id: 'b',
        label: 'Reducir presupuesto al 30% y monitorear 24h',
        description: 'Reducir exposición mientras el ROAS se estabiliza',
        impactoEstimado: 'Pérdida parcial limitada a ~$5k/día',
        isPrimary: false,
      },
      {
        id: 'c',
        label: 'Pausar solo los ad sets con ROAS < 1x',
        description: 'Mantener los que aún son rentables, cortar solo los que pierden',
        impactoEstimado: 'Pérdida selectiva — optimización quirúrgica',
        isPrimary: false,
      },
    ],
    proyectoId: 'fitness-bands',
    pedidosAfectados: 0,
    fechaDeteccion: '2026-06-10T07:30:00Z',
  },
];

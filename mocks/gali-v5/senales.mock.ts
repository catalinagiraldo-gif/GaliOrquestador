export type SignalType = 'opportunity' | 'scale' | 'trend' | 'risk' | 'completed';
export type AlertType  = 'critical' | 'warning' | 'info';

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
  proyectoId?: string;
  metrica?: string;
  fechaDeteccion: string;
}

export interface GaliAlerta {
  id: string;
  tipo: AlertType;
  titulo: string;
  descripcion: string;
  impacto: string;
  ctaPrincipal: string;
  ctaSecundario: string;
  agente: string;
  proyectoId?: string;
  pedidosAfectados?: number;
  fechaDeteccion: string;
}

export const MOCK_SENALES: GaliSignal[] = [
  {
    id: 'sen-001',
    tipo: 'scale',
    titulo: 'Ventana de escala para Collar GPS',
    contextoMacromundo:
      '847 dropshippers activos en categoría mascotas en Dropi esta semana. ' +
      'Los que escalaron pauta en los últimos 7 días tienen ROAS promedio 2.3x. ' +
      'Tú tienes ROAS 1.93x y margen del 22% — estás en el cuartil correcto.',
    recomendacion:
      'Roax propone escalar pauta de $66k a $86k/día (+30%). ' +
      'Estimado: +12 pedidos/sem · ganancia adicional ~$105k/sem.',
    ventanaDias: 14,
    ctaPrincipal: 'Aprobar escala $86k/día',
    ctaSecundario: 'Ver proyección completa',
    agente: 'roax',
    proyectoId: 'collar-gps-2026',
    metrica: 'ROAS 1.93x · Margen 22% · +30% pauta',
    fechaDeteccion: '2026-06-03T08:00:00Z',
  },
  {
    id: 'sen-002',
    tipo: 'trend',
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
    fechaDeteccion: '2026-06-03T10:30:00Z',
  },
  {
    id: 'sen-003',
    tipo: 'opportunity',
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
    metrica: 'CTR estimado +0.3pp · +8-15 pedidos/sem',
    fechaDeteccion: '2026-06-03T14:00:00Z',
  },
  {
    id: 'sen-004',
    tipo: 'risk',
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
    fechaDeteccion: '2026-06-04T07:00:00Z',
  },
  {
    id: 'sen-005',
    tipo: 'opportunity',
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
    metrica: 'CTR 1.4% · $20k/día propuesto',
    fechaDeteccion: '2026-06-04T09:00:00Z',
  },
];

export const MOCK_ALERTAS: GaliAlerta[] = [
  {
    id: 'alt-001',
    tipo: 'critical',
    titulo: 'Coordinadora Bogotá: 15% novedad — 12 pedidos en riesgo',
    descripcion:
      'Coordinadora lleva 3 días consecutivos con novedad > 12% en rutas de Bogotá. ' +
      'Hoy 15.3%. 12 de tus pedidos activos tienen destino Bogotá con esta transportadora.',
    impacto: '~3 novedades estimadas si no se actúa · ~$51k en riesgo',
    ctaPrincipal: 'Cambiar 12 pedidos a Servientrega',
    ctaSecundario: 'Ver detalle por pedido',
    agente: 'vigilante',
    proyectoId: 'collar-gps-2026',
    pedidosAfectados: 12,
    fechaDeteccion: '2026-06-04T06:00:00Z',
  },
  {
    id: 'alt-002',
    tipo: 'critical',
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
  },
  {
    id: 'alt-003',
    tipo: 'warning',
    titulo: 'Skincare K-Beauty: CTR cayó −38% en 48h',
    descripcion:
      'El CTR del creative activo de Skincare pasó de 1.8% a 1.1% en las últimas 48h. ' +
      'Roax detectó saturación de audiencia — el creative lleva 18 días activo (umbral: 14 días).',
    impacto: 'ROAS en riesgo de caer bajo objetivo si no se cambia creativo esta semana',
    ctaPrincipal: 'Activar creative alternativo',
    ctaSecundario: 'Ver diagnóstico de Roax',
    agente: 'roax',
    proyectoId: 'skincare-kbeauty',
    pedidosAfectados: 0,
    fechaDeteccion: '2026-06-04T10:00:00Z',
  },
];

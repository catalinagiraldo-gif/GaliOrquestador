/**
 * Estado del dashboard "Hoy" para Gali 6.
 * Diseñado para mostrar solo lo más importante — 3 niveles de jerarquía:
 * 1. Una decisión urgente (hero)
 * 2. 3 KPIs del pulso del negocio
 * 3. Accesos rápidos a acciones frecuentes
 */

import type { AgenteProcesoTipo } from './agentes-especializados';

export type DecisionTipo = 'alerta' | 'oportunidad' | 'info';

export interface DecisionUrgente {
  titulo: string;
  descripcion: string;
  /** ID del agente que generó esta decisión */
  agenteId: string;
  agenteName: string;
  tipo: DecisionTipo;
  /** Determinístico = siempre confiable; ia = requiere verificación */
  procesaTipo: AgenteProcesoTipo;
  /** Ruta a la señal completa */
  senalId?: string;
  ctaPrincipal: string;
  ctaSecundario?: string;
}

export interface KpiHoy {
  id: string;
  label: string;
  valor: string;
  valorNumerico: number;
  delta?: string;
  deltaPositivo?: boolean;
  /** Si el KPI viene de datos reales de Dropi */
  deterministico: boolean;
  /** URL de detalle al hacer click */
  detailRoute?: string;
}

export interface AccesoRapido {
  id: string;
  label: string;
  icon: string;
  route?: string;
  /** Si true, abre el right panel en lugar de navegar */
  abrePanel?: boolean;
  panelContexto?: string;
}

export interface SparkPoint { v: number; }

export interface ImpactoSemana {
  label: string;
  acciones: number;
  accionesAutonomas: number;
  pesosAhorrados: string;
  novedadesEvitadas: number;
  horasLibradas: number;
  pctAccionesGali: number;
}

export interface AgenteActivo {
  id: string;
  nombre: string;
  nombreCorto: string;
  icono: string;
  colorAvatar: string;
  estado: 'activo' | 'pausado';
  autopilot: boolean;
}

export interface ModuloProgresion {
  id: string;
  label: string;
  icono: string;
  route: string;
  estado: 'bloqueado' | 'activo' | 'completado';
}

export interface AlertaCola {
  id: string;
  titulo: string;
  tipo: 'critical' | 'warning';
  senalId: string;
}

export interface HoyEstado {
  semanaLabel: string;
  pedidosActual: number;
  pedidosMeta: number;
  sparkPoints: SparkPoint[];
  galiDelta: string;
  galiDeltaPositivo: boolean;
  decision_urgente: DecisionUrgente;
  kpis: KpiHoy[];
  accesos_rapidos: AccesoRapido[];
  impactoSemana: ImpactoSemana;
  agentesActivos: AgenteActivo[];
  alertasCola: AlertaCola[];
  modulosProgresion: ModuloProgresion[];
  palancaTexto: string;
  palancaDias: number;
  palancaRoute: string;
  senalesHoy?: SenalHoy[];
  proyectoContribuciones?: ProyectoContrib[];
  chatProResumen?: ChatProResumen;
  /** Para el modo zero-state (usuario nuevo sin datos) */
  esZeroState?: boolean;
  zeroState?: HoyZeroState;
}

export interface SenalHoy {
  id: string;
  senal: string;
  accion: string;
  agente: string;
  agenteColor: string;
  tipo: 'oportunidad' | 'warning' | 'info';
  urgencia?: 'critica' | 'media' | 'info';
  diasRestantes?: number;
}

export interface ProyectoContrib {
  id: string;
  nombre: string;
  pedidosSem: number;
  color: string;
}

export interface HoyZeroState {
  proyectoNombre: string;
  productoNombre: string;
  proximoPaso: string;
  proximoPasoRuta?: string;
}

export interface ChatProResumen {
  mensajes: number;
  urgentes: number;
}

export const MOCK_HOY_ESTADO: HoyEstado = {
  semanaLabel: 'Semana 24',
  pedidosActual: 47,
  pedidosMeta: 100,
  sparkPoints: [
    { v: 38 }, { v: 42 }, { v: 40 }, { v: 45 }, { v: 43 }, { v: 47 }, { v: 47 },
  ],
  galiDelta: '+3 pedidos esta semana gracias a Gali',
  galiDeltaPositivo: true,
  impactoSemana: {
    label: 'Esta semana',
    acciones: 127,
    accionesAutonomas: 58,
    pesosAhorrados: '$420k',
    novedadesEvitadas: 11,
    horasLibradas: 41,
    pctAccionesGali: 46,
  },
  agentesActivos: [
    { id: 'roas-tracker', nombre: 'ROAS Tracker', nombreCorto: 'ROAS', icono: '📊', colorAvatar: '#f97316', estado: 'activo', autopilot: true },
    { id: 'stock-guardian', nombre: 'Stock Guardian', nombreCorto: 'Stock', icono: '📦', colorAvatar: '#60a5fa', estado: 'activo', autopilot: true },
    { id: 'vigilante', nombre: 'Vigilante', nombreCorto: 'Logística', icono: '🚚', colorAvatar: '#fbbf24', estado: 'activo', autopilot: false },
  ],
  alertasCola: [
    { id: 'a1', titulo: 'ROAS caído en Meta — Licuadora Portátil', tipo: 'critical', senalId: 'sen-004' },
    { id: 'a2', titulo: 'Stock bajo · 3 días para agotarse — Collar GPS', tipo: 'warning', senalId: 'sen-002' },
  ],
  modulosProgresion: [
    { id: 'conectar',  label: 'Conectar',  icono: '⬡', route: '/gali-6/conexiones',       estado: 'completado' },
    { id: 'operar',   label: 'Operar',    icono: '▸', route: '/gali-6/mi-negocio',         estado: 'activo'     },
    { id: 'escalar',  label: 'Escalar',   icono: '↑', route: '/gali-6/proyectos',           estado: 'activo'     },
    { id: 'optimizar',label: 'Optimizar', icono: '◎', route: '/gali-6/reportes/dashboard', estado: 'bloqueado'  },
  ],
  senalesHoy: [
    {
      id: 'sn1',
      senal: 'ROAS de Collar GPS estable a 2.1x por 7 días',
      accion: 'ROAS Tracker subió presupuesto de $45k → $60k/día',
      agente: 'ROAS Tracker',
      agenteColor: '#f97316',
      tipo: 'oportunidad' as const,
      urgencia: 'info' as const,
    },
    {
      id: 'sn2',
      senal: 'Stock bajo en Licuadora Portátil · 3 días restantes',
      accion: 'Stock Guardian alertó a tu proveedor y pausó pauta',
      agente: 'Stock Guardian',
      agenteColor: '#60a5fa',
      tipo: 'warning' as const,
      urgencia: 'critica' as const,
      diasRestantes: 3,
    },
    {
      id: 'sn3',
      senal: 'Novedad resuelta en pedido #4821 — K-Beauty',
      accion: 'Reenvío programado automáticamente vía WhatsApp',
      agente: 'Vigilante',
      agenteColor: '#fbbf24',
      tipo: 'info' as const,
      urgencia: 'media' as const,
    },
  ],
  proyectoContribuciones: [
    { id: 'proy-1', nombre: 'Collar GPS', pedidosSem: 35, color: '#f97316' },
    { id: 'proy-2', nombre: 'K-Beauty', pedidosSem: 12, color: '#60a5fa' },
  ],
  chatProResumen: { mensajes: 12, urgentes: 3 },
  palancaTexto: 'Lanza una campaña de Difusor Aromaterapia en Meta Ads con $40k/día para llegar a 100 pedidos esta semana.',
  palancaDias: 10,
  palancaRoute: '/gali-6/proyectos/nuevo',
  decision_urgente: {
    titulo: 'Oportunidad de escala — Collar GPS está listo para subir presupuesto',
    descripcion:
      'ROAS Tracker detectó ROAS estable a 2.1x por 7 días consecutivos en tu campaña TikTok. ' +
      'Escalar de $45k a $60k/día podría generar ~8 pedidos adicionales por semana.',
    agenteId: 'roas-tracker',
    agenteName: 'ROAS Tracker',
    tipo: 'oportunidad',
    procesaTipo: 'ia-ligera',
    senalId: 'sen-001',
    ctaPrincipal: 'Ver proyección completa',
    ctaSecundario: 'Recordar más tarde',
  },
  kpis: [
    {
      id: 'kpi-pedidos',
      label: 'Pedidos hoy',
      valor: '12',
      valorNumerico: 12,
      delta: '+3 vs ayer',
      deltaPositivo: true,
      deterministico: true,
      detailRoute: '/gali-6/mis-pedidos',
    },
    {
      id: 'kpi-roas',
      label: 'ROAS promedio',
      valor: '1.93x',
      valorNumerico: 1.93,
      delta: '+0.05 vs semana pasada',
      deltaPositivo: true,
      deterministico: true,
      detailRoute: '/gali-6/reportes/dashboard',
    },
    {
      id: 'kpi-novedades',
      label: 'Novedades activas',
      valor: '4',
      valorNumerico: 4,
      delta: '-2 vs ayer',
      deltaPositivo: true,
      deterministico: true,
      detailRoute: '/gali-6/mis-pedidos/novedades',
    },
  ],
  accesos_rapidos: [
    {
      id: 'ar-nueva-campana',
      label: '+ Nueva campaña',
      icon: 'pi pi-plus-circle',
      route: '/gali-6/proyectos/nuevo',
    },
    {
      id: 'ar-senales',
      label: 'Ver señales',
      icon: 'pi pi-bell',
      route: '/gali-6/senales',
    },
    {
      id: 'ar-pedidos',
      label: 'Ver pedidos',
      icon: 'pi pi-shopping-bag',
      route: '/gali-6/mis-pedidos',
    },
    {
      id: 'ar-gali',
      label: 'Hablar con Gali',
      icon: 'pi pi-comments',
      abrePanel: true,
      panelContexto: 'hoy',
    },
  ],
};

/** Estado de "Hoy" para usuario nuevo (zero-state) — sin datos reales */
export const MOCK_HOY_ZERO: HoyEstado = {
  esZeroState: true,
  semanaLabel: 'Semana 24',
  pedidosActual: 0,
  pedidosMeta: 100,
  sparkPoints: [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }],
  galiDelta: 'Tu primer día con Gali',
  galiDeltaPositivo: true,
  impactoSemana: { label: 'Esta semana', acciones: 0, accionesAutonomas: 0, pesosAhorrados: '$0', novedadesEvitadas: 0, horasLibradas: 0, pctAccionesGali: 0 },
  agentesActivos: [],
  alertasCola: [],
  modulosProgresion: [
    { id: 'conectar', label: 'Conectar', icono: '⬡', route: '/gali-6/conexiones', estado: 'activo' },
    { id: 'operar',   label: 'Operar',   icono: '▸', route: '/gali-6/mi-negocio', estado: 'bloqueado' },
    { id: 'escalar',  label: 'Escalar',  icono: '↑', route: '/gali-6/proyectos',  estado: 'bloqueado' },
    { id: 'optimizar',label: 'Optimizar',icono: '◎', route: '/gali-6/reportes/dashboard', estado: 'bloqueado' },
  ],
  palancaTexto: 'Conecta Meta Ads o sube tu catálogo para que Gali empiece a operar.',
  palancaDias: 0,
  palancaRoute: '/gali-6/conexiones',
  decision_urgente: {
    titulo: 'Tu primer proyecto está activo',
    descripcion:
      'Gali está monitoreando tu producto con el paquete básico de agentes. ' +
      'Te avisará cuando haya algo importante. El siguiente paso es configurar tu primer anuncio.',
    agenteId: 'gali',
    agenteName: 'Gali',
    tipo: 'info',
    procesaTipo: 'deterministico',
    ctaPrincipal: 'Configurar mi primer anuncio',
    ctaSecundario: 'Explorar el panel',
  },
  kpis: [
    {
      id: 'kpi-pedidos',
      label: 'Pedidos hoy',
      valor: '0',
      valorNumerico: 0,
      deterministico: true,
      detailRoute: '/gali-6/mis-pedidos',
    },
    {
      id: 'kpi-roas',
      label: 'ROAS',
      valor: '—',
      valorNumerico: 0,
      deterministico: true,
    },
    {
      id: 'kpi-novedades',
      label: 'Novedades',
      valor: '—',
      valorNumerico: 0,
      deterministico: true,
    },
  ],
  accesos_rapidos: [
    {
      id: 'ar-catalogo',
      label: 'Explorar catálogo',
      icon: 'pi pi-shopping-bag',
      route: '/gali-6/productos/catalogo',
    },
    {
      id: 'ar-gali',
      label: 'Preguntarle a Gali',
      icon: 'pi pi-comments',
      abrePanel: true,
      panelContexto: 'onboarding',
    },
  ],
  zeroState: {
    proyectoNombre: 'Mi primer proyecto',
    productoNombre: 'Producto seleccionado',
    proximoPaso: 'Configura tu primer anuncio para empezar a recibir pedidos',
    proximoPasoRuta: '/gali-6/proyectos',
  },
};

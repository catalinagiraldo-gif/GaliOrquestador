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

export interface HoyEstado {
  decision_urgente: DecisionUrgente;
  kpis: KpiHoy[];
  accesos_rapidos: AccesoRapido[];
  /** Para el modo zero-state (usuario nuevo sin datos) */
  esZeroState?: boolean;
  zeroState?: HoyZeroState;
}

export interface HoyZeroState {
  proyectoNombre: string;
  productoNombre: string;
  proximoPaso: string;
  proximoPasoRuta?: string;
}

export const MOCK_HOY_ESTADO: HoyEstado = {
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

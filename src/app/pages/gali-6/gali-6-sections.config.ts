import {
  DROPI_ICON_RAIL,
  DROPI_SECTION_PANELS,
  GALI_MISSION_PANEL,
  SectionPanel,
  SectionNavItem,
  IconRailItem,
  resolveActiveRailKey,
  resolveSectionPanel,
} from '../gali-5/gali-v5/dropi-sections.config';

const remap = (r?: string): string | undefined =>
  r ? r.replace('/gali-v5', '/gali-6') : r;

const toV5 = (url: string): string => url.replace('/gali-6', '/gali-v5');

function remapItem(it: SectionNavItem): SectionNavItem {
  return {
    ...it,
    route: remap(it.route),
    children: it.children?.map(c => ({ ...c, route: remap(c.route) as string })),
  };
}

function remapPanel(p: SectionPanel): SectionPanel {
  return { ...p, items: p.items.map(remapItem) };
}

function remapRail(items: IconRailItem[]): IconRailItem[] {
  return items.map(i => ({
    ...i,
    route: remap(i.route) as string,
    matchPrefixes: i.matchPrefixes.map(p => remap(p) as string),
  }));
}

export const G6_ICON_RAIL: IconRailItem[] = remapRail(DROPI_ICON_RAIL);

export const G6_SECTION_PANELS: Record<string, SectionPanel> = Object.fromEntries(
  Object.entries(DROPI_SECTION_PANELS).map(([k, v]) => [k, remapPanel(v)]),
);

/**
 * Panel de Gali 6 — IA consolidada (decisiones Revision7Jul: Señales independiente
 * como centro de notificaciones, Centro de Gali unifica config/reglas/conexiones/
 * contexto, skills vive dentro de reglas, impacto se reencuadra dentro de Conexiones).
 * Raíz plana (Hoy · Señales · Proyectos) + accordion Centro de Gali (experto).
 */
export const GALI_6_MISSION_PANEL: SectionPanel = {
  railKey: 'home',
  title: 'Gali 6',
  items: [
    { id: 'hoy', label: 'Hoy', route: '/gali-6', icon: 'assets/icons/sidebar/gali-v5/user-circle.svg' },
    { id: 'senales', label: 'Señales', route: '/gali-6/senales', icon: 'assets/icons/sidebar/gali-v5/apps-add.svg' },
    { id: 'proyectos', label: 'Proyectos', route: '/gali-6/proyectos', icon: 'assets/icons/sidebar/gali-v5/boxes.svg' },
    {
      id: 'centro-gali',
      label: 'Centro de Gali',
      type: 'accordion' as const,
      icon: 'assets/icons/sidebar/gali-v5/apps-add.svg',
      defaultExpanded: false,
      children: [
        { label: 'Agentes',     route: '/gali-6/agentes' },
        { label: 'Mi contexto', route: '/gali-6/mi-negocio' },
        { label: 'Academy',     route: '/gali-6/academy' },
      ],
    },
  ],
  agentFooter: {
    agentId: 'gali',
    label: 'Gali 6',
    color: '#f49a3d',
    statusLabel: 'Gali activo · monitoreando tu negocio',
    contextKey: 'home',
  },
};

/**
 * Panel de Gali 6 V2 — snapshot congelado del panel de Gali 6 previo a la
 * consolidación de IA (Señales independiente + Centro de Gali unificado).
 * No editar salvo que se quiera actualizar intencionalmente el snapshot.
 */
export const GALI_6_V2_MISSION_PANEL: SectionPanel = {
  railKey: 'home',
  title: 'Gali 6 V2',
  items: [
    {
      id: 'mi-negocio',
      label: 'Mi Negocio',
      type: 'accordion' as const,
      icon: 'assets/icons/sidebar/gali-v5/user-circle.svg',
      defaultExpanded: true,
      children: [
        { label: 'Hoy',         route: '/gali-6-v2' },
        { label: 'Señales',     route: '/gali-6-v2/senales' },
        { label: 'Impacto',     route: '/gali-6-v2/impacto' },
        { label: 'Mi Contexto', route: '/gali-6-v2/mi-negocio' },
      ],
    },
    { id: 'proyectos', label: 'Proyectos', route: '/gali-6-v2/proyectos', icon: 'assets/icons/sidebar/gali-v5/boxes.svg' },
    {
      id: 'centro-gali',
      label: 'Centro de Gali',
      type: 'accordion' as const,
      icon: 'assets/icons/sidebar/gali-v5/apps-add.svg',
      defaultExpanded: false,
      children: [
        { label: 'Agentes',     route: '/gali-6-v2/agentes' },
        { label: 'Skills',      route: '/gali-6-v2/skills' },
        { label: 'Reglas',      route: '/gali-6-v2/reglas' },
        { label: 'Marketplace', route: '/gali-6-v2/marketplace' },
        { label: 'Conexiones',  route: '/gali-6-v2/conexiones' },
        { label: 'Academy',     route: '/gali-6-v2/academy' },
      ],
    },
  ],
  agentFooter: {
    agentId: 'gali',
    label: 'Gali 6 V2',
    color: '#f49a3d',
    statusLabel: 'La Casita · facilitador activo',
    contextKey: 'home',
  },
};

/** Panel de Gali 6 V1 — navegación idéntica al commit de GitHub antes del plan de evolución */
export const GALI_6_V1_MISSION_PANEL: SectionPanel = {
  railKey: 'home',
  title: 'Gali 6 V1',
  items: [
    {
      id: 'mi-negocio',
      label: 'Mi Negocio',
      type: 'accordion' as const,
      icon: 'assets/icons/sidebar/gali-v5/user-circle.svg',
      defaultExpanded: true,
      children: [
        { label: 'Hoy',         route: '/gali-6-v1' },
        { label: 'Señales',     route: '/gali-6-v1/mi-negocio?tab=senales' },
        { label: 'Conexiones',  route: '/gali-6-v1/mi-negocio?tab=conexiones' },
        { label: 'Impacto',     route: '/gali-6-v1/mi-negocio?tab=impacto' },
        { label: 'Mi Contexto', route: '/gali-6-v1/mi-negocio?tab=operacion' },
      ],
    },
    { id: 'proyectos', label: 'Proyectos', route: '/gali-6-v1/proyectos', icon: 'assets/icons/sidebar/gali-v5/boxes.svg' },
    {
      id: 'centro-gali',
      label: 'Centro de Gali',
      type: 'accordion' as const,
      icon: 'assets/icons/sidebar/gali-v5/apps-add.svg',
      defaultExpanded: false,
      children: [
        { label: 'Agentes',     route: '/gali-6-v1/agentes' },
        { label: 'Skills',      route: '/gali-6-v1/skills' },
        { label: 'Reglas',      route: '/gali-6-v1/reglas' },
        { label: 'Marketplace', route: '/gali-6-v1/marketplace' },
        { label: 'Academy',     route: '/gali-6-v1/academy' },
      ],
    },
  ],
  agentFooter: {
    agentId: 'gali',
    label: 'Gali 6',
    color: '#f49a3d',
    statusLabel: 'La Casita · facilitador activo',
    contextKey: 'home',
  },
};

const G6_HOME_EXACT = new Set(['/gali-6', '/gali-6/']);
const G6_V1_HOME_EXACT = new Set(['/gali-6-v1', '/gali-6-v1/']);
const G6_V2_HOME_EXACT = new Set(['/gali-6-v2', '/gali-6-v2/']);
const G6_HUB_PREFIXES = [
  '/gali-6/proyectos', '/gali-6/proyecto',
  '/gali-6/mi-negocio', '/gali-6/conexiones',
  '/gali-6/senales', '/gali-6/impacto',
  '/gali-6/agentes', '/gali-6/skills',
  '/gali-6/reglas', '/gali-6/marketplace',
  '/gali-6/academy', '/gali-6/centro-control',
];
const G6_V1_HUB_PREFIXES = [
  '/gali-6-v1/proyectos', '/gali-6-v1/proyecto',
  '/gali-6-v1/mi-negocio', '/gali-6-v1/conexiones',
  '/gali-6-v1/impacto', '/gali-6-v1/agentes',
  '/gali-6-v1/skills', '/gali-6-v1/reglas',
  '/gali-6-v1/marketplace', '/gali-6-v1/academy',
  '/gali-6-v1/centro-control',
];
const G6_V2_HUB_PREFIXES = [
  '/gali-6-v2/proyectos', '/gali-6-v2/proyecto',
  '/gali-6-v2/mi-negocio', '/gali-6-v2/conexiones',
  '/gali-6-v2/senales', '/gali-6-v2/impacto',
  '/gali-6-v2/agentes', '/gali-6-v2/skills',
  '/gali-6-v2/reglas', '/gali-6-v2/marketplace',
  '/gali-6-v2/academy', '/gali-6-v2/centro-control',
];

export function resolveG6RailKey(url: string): string {
  return resolveActiveRailKey(toV5(url.replace('/gali-6-v1', '/gali-6').replace('/gali-6-v2', '/gali-6')));
}

export function resolveG6SectionPanel(url: string): SectionPanel | null {
  const path = url.split('?')[0];
  if (G6_V1_HOME_EXACT.has(path)) return GALI_6_V1_MISSION_PANEL;
  if (G6_V1_HUB_PREFIXES.some(p => path.startsWith(p))) return GALI_6_V1_MISSION_PANEL;
  if (G6_V2_HOME_EXACT.has(path)) return GALI_6_V2_MISSION_PANEL;
  if (G6_V2_HUB_PREFIXES.some(p => path.startsWith(p))) return GALI_6_V2_MISSION_PANEL;
  if (G6_HOME_EXACT.has(path)) return GALI_6_MISSION_PANEL;
  if (G6_HUB_PREFIXES.some(p => path.startsWith(p))) return GALI_6_MISSION_PANEL;

  const panel = resolveSectionPanel(toV5(url));
  if (!panel) return null;
  if (panel === GALI_MISSION_PANEL) return GALI_6_MISSION_PANEL;
  const railKey = resolveActiveRailKey(toV5(url));
  return G6_SECTION_PANELS[railKey] ?? remapPanel(panel);
}

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
 * Panel del home de La Casita — espinazo:
 * Hoy · Mi Negocio · Proyectos · Conexiones · Señales · [Centro de Gali accordion]
 */
export const GALI_6_MISSION_PANEL: SectionPanel = {
  railKey: 'home',
  title: 'Gali 6',
  items: [
    { id: 'hoy',        label: 'Hoy',        route: '/gali-6',             icon: 'assets/icons/sidebar/home.svg' },
    { id: 'proyectos',  label: 'Proyectos',   route: '/gali-6/proyectos',   icon: 'assets/icons/sidebar/gali-v5/boxes.svg' },
    { id: 'mi-negocio', label: 'Mi Negocio',  route: '/gali-6/mi-negocio',  icon: 'assets/icons/sidebar/gali-v5/user-circle.svg' },
    { id: 'conexiones', label: 'Conexiones',  route: '/gali-6/conexiones',  icon: 'assets/icons/sidebar/gali-v5/apps-add.svg' },
    { id: 'senales',    label: 'Señales',      route: '/gali-6/senales',     icon: 'assets/icons/sidebar/signal.svg' },
    { id: 'impacto',    label: 'Impacto Gali', route: '/gali-6/impacto',    icon: 'assets/icons/sidebar/gali-v5/trophy.svg' },
    {
      id: 'centro-gali',
      label: 'Centro de Gali',
      type: 'accordion' as const,
      icon: 'assets/icons/sidebar/gali-v5/apps-add.svg',
      defaultExpanded: false,
      children: [
        { label: 'Agentes',      route: '/gali-6/agentes' },
        { label: 'Skills',       route: '/gali-6/skills' },
        { label: 'Reglas',       route: '/gali-6/reglas' },
        { label: 'Marketplace',  route: '/gali-6/marketplace' },
        { label: 'Academy',      route: '/gali-6/academy' },
      ],
    },
  ],
  agentFooter: {
    agentId: 'gali',
    label: 'Gali 6',
    color: '#f49a3d',
    statusLabel: 'La Casita · orquestador activo',
    contextKey: 'home',
  },
};

const G6_HOME_EXACT = new Set(['/gali-6', '/gali-6/']);
const G6_HUB_PREFIXES = [
  '/gali-6/proyectos', '/gali-6/proyecto',
  '/gali-6/mi-negocio', '/gali-6/conexiones',
  '/gali-6/senales', '/gali-6/impacto',
  '/gali-6/agentes', '/gali-6/skills',
  '/gali-6/reglas', '/gali-6/marketplace',
  '/gali-6/academy', '/gali-6/centro-control',
];

export function resolveG6RailKey(url: string): string {
  return resolveActiveRailKey(toV5(url));
}

export function resolveG6SectionPanel(url: string): SectionPanel | null {
  const path = url.split('?')[0];
  if (G6_HOME_EXACT.has(path)) return GALI_6_MISSION_PANEL;
  if (G6_HUB_PREFIXES.some(p => path.startsWith(p))) return GALI_6_MISSION_PANEL;

  const panel = resolveSectionPanel(toV5(url));
  if (!panel) return null;
  if (panel === GALI_MISSION_PANEL) return GALI_6_MISSION_PANEL;
  const railKey = resolveActiveRailKey(toV5(url));
  return G6_SECTION_PANELS[railKey] ?? remapPanel(panel);
}

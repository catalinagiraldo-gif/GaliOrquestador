import {
  DROPI_ICON_RAIL,
  DROPI_SECTION_PANELS,
  GALI_MISSION_PANEL,
  SectionPanel,
  SectionNavItem,
  IconRailItem,
  resolveActiveRailKey,
  resolveSectionPanel,
} from '../gali-v5/dropi-sections.config';

/**
 * Navegación de La Casita — RESCATA el chrome de Gali V5 v1 (icon-rail agrupado +
 * section-nav con submenús + agent footers + look&feel) reusando la fuente única
 * `dropi-sections.config.ts`, remapeada a /gali-v5-v2. Cero duplicación, nada se pierde.
 */

const remap = (r?: string): string | undefined =>
  r ? r.replace('/gali-v5', '/gali-v5-v2') : r;

const toV5 = (url: string): string => url.replace('/gali-v5-v2', '/gali-v5');

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

/** Icon rail 72px (clon visual de v1, rutas /gali-v5-v2). */
export const V2_ICON_RAIL: IconRailItem[] = remapRail(DROPI_ICON_RAIL);

/** Paneles de sección con TODOS los submenús (remapeados). */
export const V2_SECTION_PANELS: Record<string, SectionPanel> = Object.fromEntries(
  Object.entries(DROPI_SECTION_PANELS).map(([k, v]) => [k, remapPanel(v)]),
);

/** Panel del home (Gali Hub · Mi Negocio · Proyectos · Centro de Gali). */
export const V2_MISSION_PANEL: SectionPanel = remapPanel(GALI_MISSION_PANEL);

/** Rail activo según URL de v2 (reusa la lógica de v1 sobre la URL des-remapeada). */
export function resolveV2RailKey(url: string): string {
  return resolveActiveRailKey(toV5(url));
}

/** Panel de sección según URL de v2 (devuelve siempre el equivalente remapeado). */
export function resolveV2SectionPanel(url: string): SectionPanel | null {
  const panel = resolveSectionPanel(toV5(url));
  if (!panel) return null;
  if (panel === GALI_MISSION_PANEL) return V2_MISSION_PANEL;
  return V2_SECTION_PANELS[panel.railKey] ?? remapPanel(panel);
}

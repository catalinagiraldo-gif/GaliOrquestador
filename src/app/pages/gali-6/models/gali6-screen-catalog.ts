import { DROPI_SCREEN_REGISTRY } from '../../gali-5/gali-v5/screens/dropi-screens.registry';

export interface Gali6ScreenOption {
  id: string;
  label: string;
}

/** Catálogo cerrado de pantallas de Dropi, derivado de DROPI_SCREEN_REGISTRY — fuente única para cualquier selector de destino (mover agente, fijar artefacto). */
export function gali6ScreenCatalog(): Gali6ScreenOption[] {
  return Object.entries(DROPI_SCREEN_REGISTRY)
    .map(([id, cfg]) => ({ id, label: cfg.title }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function gali6ScreenLabel(screenId: string): string {
  return DROPI_SCREEN_REGISTRY[screenId]?.title ?? screenId;
}

/**
 * Pantallas donde <gali6-agent-presence-bar>/<gali6-screen-artifacts> realmente están montados hoy —
 * elegir cualquier otra en un selector de destino "pierde" el resultado en silencio (18.FlujoUsuarioGali6.md
 * §5.9). Allow-list mantenida a mano porque Angular no puede introspectar en runtime qué árbol de
 * componentes monta cada ruta. Actualizar esta lista cuando se monten ambos componentes en una pantalla
 * nueva — ver §5.9 de 18.FlujoUsuarioGali6.md para el backlog de las que faltan (Proveedores, Caza,
 * Novedades, Garantías, Transportadoras, etc.).
 */
export const GALI6_COVERED_SCREEN_IDS = new Set<string>([
  // 18 screenId genéricos vía screen() en gali-6.routes.ts (DropiScreenPageComponent)
  'garantias-recolecciones', 'tickets', 'datos-bancarios', 'retiros-de-saldo',
  'datos-facturacion', 'facturas-pendientes', 'notas-credito', 'datos-personales',
  'seguridad', 'integraciones-config', 'referidos', 'configuracion-de-tienda',
  'usuarios-equipo', 'dropi-testers', 'planes', 'mis-sesiones',
  'historial-de-actividades', 'preferencias-cuenta',
  // 7 pantallas custom con montaje manual
  'catalogo', 'cas-bandeja', 'historial-de-cartera', 'campanas',
  'roax-lanzador', 'mis-pedidos', 'dashboard-financiero',
]);

/** Mismo catálogo que gali6ScreenCatalog(), filtrado a pantallas con cobertura real — usar en
 * cualquier selector de "dónde va a aparecer esto" (fijar artefacto, mover agente, reubicar). */
export function gali6ScreenCatalogConDestino(): Gali6ScreenOption[] {
  return gali6ScreenCatalog().filter(opt => GALI6_COVERED_SCREEN_IDS.has(opt.id));
}

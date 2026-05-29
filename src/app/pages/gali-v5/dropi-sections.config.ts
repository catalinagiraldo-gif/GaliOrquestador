/** Dropi baseline — navegación Figma Re-arquitectura UI Oficial */

const G5 = 'assets/icons/sidebar/gali-v5';

export type SectionBadge = 'nuevo' | 'beta';

export interface SectionNavChild {
  label: string;
  route: string;
}

export interface SectionNavItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  badge?: SectionBadge;
  children?: SectionNavChild[];
  defaultExpanded?: boolean;
  /** Etiqueta de grupo en panel (p.ej. "SMS y correo") */
  type?: 'link' | 'header';
}

export interface SectionPanel {
  railKey: string;
  title: string;
  items: SectionNavItem[];
}

export interface DropiScreen {
  id: string;
  label: string;
  route: string;
  railKey: string;
  figmaNode: string;
  status: 'ready' | 'placeholder';
  hasSectionPanel: boolean;
}

export interface IconRailItem {
  key: string;
  label: string;
  icon: string;
  piIcon: string;
  route: string;
  group: 'main' | 'utility';
  matchPrefixes: string[];
}

/** Rail 56px — Manu 1/Default (Figma: Home → Dashboard → Productos → …) */
export const DROPI_ICON_RAIL: IconRailItem[] = [
  {
    key: 'home',
    label: 'Inicio',
    icon: 'assets/icons/sidebar/home.svg',
    piIcon: 'pi-home',
    route: '/gali-v5',
    group: 'main',
    matchPrefixes: ['/gali-v5'],
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'assets/icons/sidebar/chat-arrow-grow.svg',
    piIcon: 'pi-chart-bar',
    route: '/gali-v5/reportes/dashboard',
    group: 'main',
    matchPrefixes: ['/gali-v5/reportes/dashboard'],
  },
  {
    key: 'productos',
    label: 'Productos',
    icon: 'assets/icons/sidebar/search.svg',
    piIcon: 'pi-search',
    route: '/gali-v5/productos/catalogo',
    group: 'main',
    matchPrefixes: ['/gali-v5/productos'],
  },
  {
    key: 'pedidos',
    label: 'Pedidos',
    icon: 'assets/icons/sidebar/shopping-cart.svg',
    piIcon: 'pi-shopping-cart',
    route: '/gali-v5/mis-pedidos/mis-pedidos',
    group: 'main',
    matchPrefixes: ['/gali-v5/mis-pedidos'],
  },
  {
    key: 'logistica',
    label: 'Logística',
    icon: `${G5}/box.svg`,
    piIcon: 'pi-box',
    route: '/gali-v5/logistica/transportadoras',
    group: 'main',
    matchPrefixes: ['/gali-v5/logistica'],
  },
  {
    key: 'reportes',
    label: 'Reportes',
    icon: 'assets/icons/sidebar/signal.svg',
    piIcon: 'pi-chart-line',
    route: '/gali-v5/reportes/productos-vendidos',
    group: 'main',
    matchPrefixes: ['/gali-v5/reportes'],
  },
  {
    key: 'financiero',
    label: 'Financiero',
    icon: `${G5}/money-coin.svg`,
    piIcon: 'pi-wallet',
    route: '/gali-v5/financiero/historial-de-cartera',
    group: 'main',
    matchPrefixes: ['/gali-v5/financiero', '/gali-v5/dropi-card'],
  },
  {
    key: 'dropicard',
    label: 'Dropi Card',
    icon: 'assets/icons/sidebar/card.svg',
    piIcon: 'pi-credit-card',
    route: '/gali-v5/dropi-card/cards',
    group: 'main',
    matchPrefixes: [],
  },
  {
    key: 'marketing',
    label: 'Marketing',
    icon: 'assets/icons/sidebar/megaphone.svg',
    piIcon: 'pi-megaphone',
    route: '/gali-v5/marketing/campanas',
    group: 'main',
    matchPrefixes: ['/gali-v5/marketing'],
  },
  {
    key: 'proyectos',
    label: 'Proyectos',
    icon: `${G5}/boxes.svg`,
    piIcon: 'pi-folder',
    route: '/gali-v5/proyectos',
    group: 'main',
    matchPrefixes: ['/gali-v5/proyectos', '/gali-v5/proyecto'],
  },
  {
    key: 'skills',
    label: 'Skills',
    icon: `${G5}/apps-add.svg`,
    piIcon: 'pi-sparkles',
    route: '/gali-v5/skills',
    group: 'main',
    matchPrefixes: ['/gali-v5/skills', '/gali-v5/marketplace'],
  },
  {
    key: 'cas',
    label: 'CAS',
    icon: `${G5}/callcenter-alt.svg`,
    piIcon: 'pi-headphones',
    route: '/gali-v5/cas/bandeja',
    group: 'utility',
    matchPrefixes: ['/gali-v5/cas'],
  },
  {
    key: 'academy',
    label: 'Academy',
    icon: 'assets/icons/sidebar/book.svg',
    piIcon: 'pi-book',
    route: '/gali-v5/academy',
    group: 'utility',
    matchPrefixes: ['/gali-v5/academy'],
  },
  {
    key: 'configurar',
    label: 'Configurar',
    icon: 'assets/icons/sidebar/settings.svg',
    piIcon: 'pi-cog',
    route: '/gali-v5/configuraciones/datos-personales',
    group: 'utility',
    matchPrefixes: ['/gali-v5/configuraciones'],
  },
];

/** Panel 200px — sub-navegación por sección */
export const DROPI_SECTION_PANELS: Record<string, SectionPanel> = {
  productos: {
    railKey: 'productos',
    title: 'Productos',
    items: [
      {
        id: 'catalogo',
        label: 'Catálogo',
        icon: `${G5}/boxes.svg`,
        defaultExpanded: true,
        children: [
          { label: 'Productos', route: '/gali-v5/productos/catalogo' },
          { label: 'Proveedores', route: '/gali-v5/productos/proveedores' },
        ],
      },
      {
        id: 'negociaciones',
        label: 'Negociaciones',
        route: '/gali-v5/productos/negociaciones',
        icon: `${G5}/handshake.svg`,
        badge: 'nuevo',
      },
      {
        id: 'caza',
        label: 'Cazaproductos',
        route: '/gali-v5/productos/caza-productos',
        icon: `${G5}/target.svg`,
        badge: 'beta',
      },
    ],
  },
  pedidos: {
    railKey: 'pedidos',
    title: 'Pedidos',
    items: [
      {
        id: 'ordenes',
        label: 'Ordenes',
        route: '/gali-v5/mis-pedidos/mis-pedidos',
        icon: 'assets/icons/sidebar/shopping-cart.svg',
      },
      {
        id: 'novedades',
        label: 'Novedades',
        route: '/gali-v5/mis-pedidos/novedades',
        icon: `${G5}/bell-ring.svg`,
      },
      {
        id: 'garantias-ped',
        label: 'Garantías',
        icon: `${G5}/warranty.svg`,
        defaultExpanded: true,
        children: [
          { label: 'Garantías', route: '/gali-v5/mis-pedidos/garantias' },
          { label: 'Órdenes de despacho', route: '/gali-v5/mis-pedidos/ordenes-de-despacho' },
          { label: 'Garantías recolecciones', route: '/gali-v5/mis-pedidos/garantias-recolecciones' },
        ],
      },
      {
        id: 'preferencias-ped',
        label: 'Preferencias',
        icon: `${G5}/pencil.svg`,
        defaultExpanded: true,
        children: [
          { label: 'Validador de direcciones', route: '/gali-v5/mis-pedidos/validador-direcciones' },
          { label: 'Etiquetas', route: '/gali-v5/mis-pedidos/etiquetas' },
        ],
      },
    ],
  },
  logistica: {
    railKey: 'logistica',
    title: 'Logística',
    items: [
      {
        id: 'transportadoras',
        label: 'Transportadoras',
        route: '/gali-v5/logistica/transportadoras',
        icon: 'assets/icons/sidebar/truck-side.svg',
      },
      {
        id: 'torre',
        label: 'Torre logística',
        route: '/gali-v5/logistica/torre-logistica',
        icon: `${G5}/torre.svg`,
      },
    ],
  },
  reportes: {
    railKey: 'reportes',
    title: 'Reportes',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/gali-v5/reportes/dashboard',
        icon: 'assets/icons/sidebar/chat-arrow-grow.svg',
      },
      {
        id: 'vendidos',
        label: 'Productos vendidos',
        route: '/gali-v5/reportes/productos-vendidos',
        icon: `${G5}/trophy.svg`,
      },
      {
        id: 'clientes',
        label: 'Clientes',
        route: '/gali-v5/reportes/clientes',
        icon: 'assets/icons/sidebar/user-check.svg',
      },
      {
        id: 'calendario',
        label: 'Calendario',
        route: '/gali-v5/reportes/calendario',
        icon: 'assets/icons/sidebar/calendar.svg',
      },
      {
        id: 'descargas',
        label: 'Descargas',
        route: '/gali-v5/reportes/descargas',
        icon: `${G5}/download.svg`,
      },
    ],
  },
  financiero: {
    railKey: 'financiero',
    title: 'Financiero',
    items: [
      {
        id: 'wallet',
        label: 'Wallet',
        icon: `${G5}/wallet.svg`,
        defaultExpanded: true,
        children: [
          { label: 'Historial de wallet', route: '/gali-v5/financiero/historial-de-cartera' },
          { label: 'Datos bancarios', route: '/gali-v5/financiero/datos-bancarios' },
          { label: 'Retiros de saldo', route: '/gali-v5/financiero/retiros-de-saldo' },
        ],
      },
      {
        id: 'facturacion',
        label: 'Facturación',
        icon: `${G5}/page-check.svg`,
        defaultExpanded: true,
        children: [
          { label: 'Datos de facturación', route: '/gali-v5/financiero/datos-facturacion' },
          { label: 'Facturas', route: '/gali-v5/financiero/facturas-pendientes' },
          { label: 'Notas crédito', route: '/gali-v5/financiero/notas-credito' },
        ],
      },
      {
        id: 'dropicard-fin',
        label: 'Dropicard',
        route: '/gali-v5/dropi-card/cards',
        icon: 'assets/icons/sidebar/card.svg',
      },
    ],
  },
  marketing: {
    railKey: 'marketing',
    title: 'Marketing',
    items: [
      { id: 'hdr-sms', label: 'SMS y correo', type: 'header' },
      {
        id: 'campanas',
        label: 'Campañas masivas',
        route: '/gali-v5/marketing/campanas',
        icon: 'assets/icons/sidebar/megaphone.svg',
      },
      {
        id: 'automatizacion',
        label: 'Automatización',
        route: '/gali-v5/marketing/automatizacion',
        icon: 'assets/icons/sidebar/settings.svg',
      },
      {
        id: 'config-marketing',
        label: 'Configuraciones',
        route: '/gali-v5/marketing/configuraciones',
        icon: 'assets/icons/sidebar/grid-alt.svg',
      },
      { id: 'hdr-chatea', label: 'Chatea pro', type: 'header' },
      {
        id: 'chatea-pro',
        label: 'Chatea pro',
        route: '/gali-v5/marketing/chatea-pro',
        icon: 'assets/icons/sidebar/comments-dots.svg',
      },
      { id: 'hdr-roax', label: 'ROAX', type: 'header' },
      {
        id: 'roax-informes',
        label: 'Informes',
        route: '/gali-v5/marketing/roax-informes',
        icon: 'assets/icons/sidebar/signal.svg',
      },
      {
        id: 'roax-lanzador',
        label: 'Lanzador de campañas',
        route: '/gali-v5/marketing/roax-lanzador',
        icon: 'assets/icons/sidebar/megaphone.svg',
      },
      { id: 'hdr-pages', label: 'Páginas', type: 'header' },
      {
        id: 'creador',
        label: 'Creador de páginas',
        route: '/gali-v5/marketing/creador-de-paginas',
        icon: 'assets/icons/sidebar/page.svg',
      },
    ],
  },
  cas: {
    railKey: 'cas',
    title: 'CAS',
    items: [
      {
        id: 'bandeja',
        label: 'Bandeja',
        route: '/gali-v5/cas/bandeja',
        icon: `${G5}/callcenter-alt.svg`,
      },
      {
        id: 'tickets',
        label: 'Tickets',
        route: '/gali-v5/cas/tickets',
        icon: 'assets/icons/sidebar/tickets.svg',
      },
    ],
  },
  configurar: {
    railKey: 'configurar',
    title: 'Configurar',
    items: [
      {
        id: 'cuenta',
        label: 'Cuenta',
        icon: `${G5}/user-circle.svg`,
        defaultExpanded: true,
        children: [
          { label: 'Información de cuenta', route: '/gali-v5/configuraciones/datos-personales' },
          { label: 'Seguridad', route: '/gali-v5/configuraciones/seguridad' },
        ],
      },
      {
        id: 'integraciones',
        label: 'Integraciones',
        route: '/gali-v5/configuraciones/integraciones',
        icon: `${G5}/apps-add.svg`,
      },
      {
        id: 'referidos',
        label: 'Referidos',
        route: '/gali-v5/configuraciones/referidos',
        icon: 'assets/icons/sidebar/user-add.svg',
      },
      {
        id: 'tienda',
        label: 'Tiendas',
        route: '/gali-v5/configuraciones/configuracion-de-tienda',
        icon: 'assets/icons/sidebar/shop.svg',
      },
      {
        id: 'usuarios',
        label: 'Usuarios',
        route: '/gali-v5/configuraciones/usuarios-equipo',
        icon: `${G5}/id-badge.svg`,
      },
      {
        id: 'testers',
        label: 'Dropi Testers',
        route: '/gali-v5/configuraciones/dropi-testers',
        icon: `${G5}/comment-square-user.svg`,
      },
    ],
  },
  proyectos: {
    railKey: 'proyectos',
    title: 'Proyectos',
    items: [
      {
        id: 'mis-proyectos',
        label: 'Mis Proyectos',
        route: '/gali-v5/proyectos',
        icon: `${G5}/boxes.svg`,
      },
      {
        id: 'nuevo-proyecto',
        label: 'Nuevo proyecto',
        route: '/gali-v5/proyectos?nuevo=true',
        icon: `${G5}/handshake.svg`,
        badge: 'nuevo' as SectionBadge,
      },
    ],
  },
  skills: {
    railKey: 'skills',
    title: 'Skills',
    items: [
      {
        id: 'mis-skills',
        label: 'Mis Skills',
        route: '/gali-v5/skills',
        icon: `${G5}/apps-add.svg`,
        badge: 'nuevo' as SectionBadge,
      },
      {
        id: 'crear-skill',
        label: 'Crear skill',
        route: '/gali-v5/skills?tab=crear',
        icon: `${G5}/pencil.svg`,
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        route: '/gali-v5/skills?tab=marketplace',
        icon: `${G5}/trophy.svg`,
      },
    ],
  },
};

/** Pantallas mapeadas a nodos Figma */
export const DROPI_SCREENS: DropiScreen[] = [
  { id: 'home', label: 'Inicio', route: '/gali-v5', railKey: 'home', figmaNode: '12384:51981', status: 'ready', hasSectionPanel: true },
  { id: 'catalogo', label: 'Catálogo', route: '/gali-v5/productos/catalogo', railKey: 'productos', figmaNode: '12401:39945', status: 'ready', hasSectionPanel: true },
  { id: 'proveedores-list', label: 'Proveedores', route: '/gali-v5/productos/proveedores', railKey: 'productos', figmaNode: '12401:40084', status: 'ready', hasSectionPanel: true },
  { id: 'negociaciones', label: 'Negociaciones', route: '/gali-v5/productos/negociaciones', railKey: 'productos', figmaNode: '12401:40448', status: 'ready', hasSectionPanel: true },
  { id: 'caza', label: 'Cazaproductos', route: '/gali-v5/productos/caza-productos', railKey: 'productos', figmaNode: '12401:40574', status: 'ready', hasSectionPanel: true },
  { id: 'mis-pedidos', label: 'Ordenes', route: '/gali-v5/mis-pedidos/mis-pedidos', railKey: 'pedidos', figmaNode: '12401:41175', status: 'ready', hasSectionPanel: true },
  { id: 'garantias', label: 'Garantías', route: '/gali-v5/mis-pedidos/garantias', railKey: 'pedidos', figmaNode: '12401:40664', status: 'ready', hasSectionPanel: true },
  { id: 'novedades', label: 'Novedades', route: '/gali-v5/mis-pedidos/novedades', railKey: 'pedidos', figmaNode: '12401:41657', status: 'ready', hasSectionPanel: true },
  { id: 'etiquetas', label: 'Etiquetas', route: '/gali-v5/mis-pedidos/etiquetas', railKey: 'pedidos', figmaNode: '12401:41093', status: 'ready', hasSectionPanel: true },
  { id: 'transportadora', label: 'Transportadoras', route: '/gali-v5/logistica/transportadoras', railKey: 'logistica', figmaNode: '12401:44548', status: 'ready', hasSectionPanel: true },
  { id: 'torre-logistica', label: 'Torre logística', route: '/gali-v5/logistica/torre-logistica', railKey: 'logistica', figmaNode: '12401:44862', status: 'ready', hasSectionPanel: true },
  { id: 'report-dashboard', label: 'Dashboard', route: '/gali-v5/reportes/dashboard', railKey: 'reportes', figmaNode: '12401:44950', status: 'ready', hasSectionPanel: true },
  { id: 'productos-vendidos', label: 'Productos vendidos', route: '/gali-v5/reportes/productos-vendidos', railKey: 'reportes', figmaNode: '12401:46812', status: 'ready', hasSectionPanel: true },
  { id: 'descargas', label: 'Descargas', route: '/gali-v5/reportes/descargas', railKey: 'reportes', figmaNode: '12401:43387', status: 'ready', hasSectionPanel: true },
  { id: 'cartera', label: 'Historial de wallet', route: '/gali-v5/financiero/historial-de-cartera', railKey: 'financiero', figmaNode: '12401:46928', status: 'ready', hasSectionPanel: true },
  { id: 'cas-bandeja', label: 'CAS Bandeja', route: '/gali-v5/cas/bandeja', railKey: 'cas', figmaNode: '12401:44291', status: 'ready', hasSectionPanel: true },
  { id: 'campanas', label: 'Campañas masivas', route: '/gali-v5/marketing/campanas', railKey: 'marketing', figmaNode: '12401:41729', status: 'ready', hasSectionPanel: true },
  { id: 'datos-bancarios', label: 'Datos bancarios', route: '/gali-v5/financiero/datos-bancarios', railKey: 'financiero', figmaNode: '12401:43425', status: 'ready', hasSectionPanel: true },
  { id: 'retiros', label: 'Retiros de saldo', route: '/gali-v5/financiero/retiros-de-saldo', railKey: 'financiero', figmaNode: '12401:43803', status: 'ready', hasSectionPanel: true },
  { id: 'facturas', label: 'Facturas', route: '/gali-v5/financiero/facturas-pendientes', railKey: 'financiero', figmaNode: '12401:47555', status: 'ready', hasSectionPanel: true },
  { id: 'academy', label: 'Academy', route: '/gali-v5/academy', railKey: 'academy', figmaNode: '12401:41051', status: 'ready', hasSectionPanel: false },
  { id: 'dropicard', label: 'Dropi Card', route: '/gali-v5/dropi-card/cards', railKey: 'financiero', figmaNode: '12401:47829', status: 'ready', hasSectionPanel: true },
];

const HOME_EXACT = new Set(['/gali-v5', '/gali-v5/']);
const GALI_HUB_PREFIXES = [
  '/gali-v5/marketplace',
];

/** Resuelve rail activo desde URL */
export function resolveActiveRailKey(url: string): string {
  const path = url.split('?')[0];
  if (HOME_EXACT.has(path)) return 'home';
  if (GALI_HUB_PREFIXES.some(p => path.startsWith(p))) return 'home';

  let best: IconRailItem | null = null;
  let bestLen = 0;

  for (const item of DROPI_ICON_RAIL) {
    if (item.key === 'home') continue;
    for (const prefix of item.matchPrefixes) {
      if (path.startsWith(prefix) && prefix.length > bestLen) {
        // Evitar que /gali-v5 solo active secciones no-home
        if (prefix === '/gali-v5' && path !== '/gali-v5' && path !== '/gali-v5/') continue;
        best = item;
        bestLen = prefix.length;
      }
    }
  }

  return best?.key ?? 'home';
}

/** Panel en Home — Gali Hub acceso rápido a secciones core */
export const HOME_OVERVIEW_PANEL: SectionPanel = {
  railKey: 'home',
  title: 'Gali',
  items: [
    {
      id: 'gali-hub',
      label: 'Gali Hub',
      route: '/gali-v5',
      icon: 'assets/icons/sidebar/home.svg',
    },
    {
      id: 'hdr-secciones',
      label: 'Secciones',
      type: 'header' as const,
    },
    ...DROPI_ICON_RAIL.filter(i => i.key !== 'home').map(item => ({
      id: item.key,
      label: item.label,
      route: item.route,
      icon: item.icon,
    })),
  ],
};

const NO_PANEL_RAIL_KEYS = new Set(['academy']);

const DASHBOARD_RAIL_KEY = 'dashboard';

/** Panel secundario visible solo en secciones con sub-nav */
export function resolveSectionPanel(url: string): SectionPanel | null {
  const path = url.split('?')[0];
  if (HOME_EXACT.has(path) || GALI_HUB_PREFIXES.some(p => path.startsWith(p))) {
    return HOME_OVERVIEW_PANEL;
  }

  const railKey = resolveActiveRailKey(url);
  if (NO_PANEL_RAIL_KEYS.has(railKey)) return null;
  // Dashboard vive en Reportes pero tiene acceso rápido propio en el rail
  if (railKey === DASHBOARD_RAIL_KEY) {
    return DROPI_SECTION_PANELS['reportes'] ?? null;
  }
  return DROPI_SECTION_PANELS[railKey] ?? null;
}

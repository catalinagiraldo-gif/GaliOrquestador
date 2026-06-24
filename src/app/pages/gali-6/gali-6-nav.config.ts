export interface Gali6NavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: Gali6NavItem[];
}

export const GALI_6_NAV: Gali6NavItem[] = [
  { id: 'hoy',        label: 'Hoy',          icon: '✦', route: '/gali-6' },
  { id: 'mi-negocio', label: 'Mi Negocio',   icon: '◇', route: '/gali-6/mi-negocio' },
  { id: 'proyectos',  label: 'Proyectos',    icon: '◎', route: '/gali-6/proyectos' },
  { id: 'conexiones', label: 'Conexiones',   icon: '⬡', route: '/gali-6/conexiones' },
  {
    id: 'operacion',
    label: 'Operación',
    icon: '▸',
    children: [
      {
        id: 'productos', label: 'Productos', icon: '',
        children: [
          { id: 'catalogo',      label: 'Catálogo',       icon: '', route: '/gali-6/productos/catalogo' },
          { id: 'proveedores',   label: 'Proveedores',    icon: '', route: '/gali-6/productos/proveedores' },
          { id: 'negociaciones', label: 'Negociaciones',  icon: '', route: '/gali-6/productos/negociaciones' },
          { id: 'caza',          label: 'Caza-productos', icon: '', route: '/gali-6/productos/caza-productos' },
        ],
      },
      {
        id: 'pedidos', label: 'Pedidos', icon: '',
        children: [
          { id: 'ordenes',    label: 'Órdenes',    icon: '', route: '/gali-6/mis-pedidos/mis-pedidos' },
          { id: 'novedades',  label: 'Novedades',  icon: '', route: '/gali-6/mis-pedidos/novedades' },
          { id: 'garantias',  label: 'Garantías',  icon: '', route: '/gali-6/mis-pedidos/garantias' },
          { id: 'etiquetas',  label: 'Etiquetas',  icon: '', route: '/gali-6/mis-pedidos/etiquetas' },
        ],
      },
      {
        id: 'logistica', label: 'Logística', icon: '',
        children: [
          { id: 'transportadoras', label: 'Transportadoras', icon: '', route: '/gali-6/logistica/transportadoras' },
          { id: 'torre',           label: 'Torre logística', icon: '', route: '/gali-6/logistica/torre-logistica' },
        ],
      },
      {
        id: 'reportes', label: 'Reportes', icon: '',
        children: [
          { id: 'dashboard',    label: 'Dashboard',    icon: '', route: '/gali-6/reportes/dashboard' },
          { id: 'pl-kronos',    label: 'P&L Kronos',   icon: '', route: '/gali-6/reportes/dashboard-financiero' },
          { id: 'productos-v',  label: 'Productos',    icon: '', route: '/gali-6/reportes/productos-vendidos' },
          { id: 'clientes',     label: 'Clientes',     icon: '', route: '/gali-6/reportes/clientes' },
        ],
      },
      {
        id: 'financiero', label: 'Financiero', icon: '',
        children: [
          { id: 'wallet',    label: 'Wallet',     icon: '', route: '/gali-6/financiero/historial-de-cartera' },
          { id: 'dropicard', label: 'Dropicard',  icon: '', route: '/gali-6/dropi-card/cards' },
        ],
      },
      {
        id: 'marketing', label: 'Marketing', icon: '',
        children: [
          { id: 'campanas',      label: 'Campañas',        icon: '', route: '/gali-6/marketing/campanas' },
          { id: 'automatizacion',label: 'Automatización',  icon: '', route: '/gali-6/marketing/automatizacion' },
          { id: 'chatea-pro',    label: 'Chatea Pro',      icon: '', route: '/gali-6/marketing/chatea-pro' },
          { id: 'roax',          label: 'Roax',            icon: '', route: '/gali-6/marketing/roax-informes' },
          { id: 'paginas',       label: 'Páginas',         icon: '', route: '/gali-6/marketing/creador-de-paginas' },
        ],
      },
      {
        id: 'cas', label: 'CAS', icon: '',
        children: [
          { id: 'bandeja',  label: 'Bandeja',  icon: '', route: '/gali-6/cas/bandeja' },
          { id: 'tickets',  label: 'Tickets',  icon: '', route: '/gali-6/cas/tickets' },
        ],
      },
    ],
  },
  {
    id: 'centro-gali',
    label: 'Centro de Gali',
    icon: '⚙',
    children: [
      { id: 'agentes',    label: 'Agentes',     icon: '', route: '/gali-6/agentes' },
      { id: 'skills',     label: 'Skills',      icon: '', route: '/gali-6/skills' },
      { id: 'reglas',     label: 'Reglas',      icon: '', route: '/gali-6/reglas' },
      { id: 'marketplace',label: 'Marketplace', icon: '', route: '/gali-6/marketplace' },
      { id: 'impacto',    label: 'Impacto',     icon: '', route: '/gali-6/impacto' },
      { id: 'academy',    label: 'Academy',     icon: '', route: '/gali-6/academy' },
    ],
  },
];

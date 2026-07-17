import { Routes } from '@angular/router';

/** Mismo patrón que gali-v5.routes.ts — pantallas genéricas servidas por DropiScreenPageComponent + mock registry. */
const screen = (path: string, screenId: string) => ({
  path,
  loadComponent: () =>
    import('../gali-5/gali-v5/screens/dropi-screen-page.component').then(
      m => m.DropiScreenPageComponent,
    ),
  data: { screenId },
});

/**
 * PlanChat.md §B2 — marcador para el wildcard. La detección real vive en
 * gali-6-shell.component.ts (compara NavigationStart.url vs
 * NavigationEnd.urlAfterRedirects): un `canActivate` puesto directamente en
 * esta entrada NO se ejecuta, porque Angular resuelve `redirectTo` durante la
 * fase de "recognize", antes de que corran los guards — el guard nunca ve la
 * ruta huérfana, solo vería el destino ya redirigido. Ver nota en el shell.
 */
export const GALI_6_CHILD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/gali6-hoy-home.component').then(
        m => m.Gali6HoyHomeComponent,
      ),
  },
  {
    path: 'centro-control',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
  },

  // ── Páginas propias de La Casita (Sprint A) ──
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./proyectos/gali6-proyectos-casa.component').then(
        m => m.Gali6ProyectosCasaComponent,
      ),
  },
  {
    path: 'conexiones',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
    data: { tab: 'conexiones' },
  },
  {
    path: 'impacto',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
    data: { tab: 'conexiones', focus: 'historial' },
  },

  // ── Páginas operativas — lazy refs a gali-5/gali-v5 ──
  {
    path: 'productos/catalogo',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/catalog/catalog-page.component').then(
        m => m.CatalogPageComponent,
      ),
  },
  {
    path: 'productos/proveedores',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/providers/providers-page.component').then(
        m => m.ProvidersPageComponent,
      ),
  },
  {
    path: 'productos/caza-productos',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/caza-productos/caza-page.component').then(
        m => m.CazaPageComponent,
      ),
  },
  {
    path: 'productos/negociaciones',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/negotiations/negotiations-page.component').then(
        m => m.NegotiationsPageComponent,
      ),
  },
  {
    path: 'mis-pedidos/mis-pedidos',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/orders/orders-page.component').then(
        m => m.OrdersPageComponent,
      ),
  },
  {
    path: 'mis-pedidos/novedades',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/novedades/novedades-page.component').then(
        m => m.NovedadesPageComponent,
      ),
  },
  {
    path: 'mis-pedidos/garantias',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/garantias/garantias-page.component').then(
        m => m.GarantiasPageComponent,
      ),
    data: { variant: 'garantias' },
  },
  {
    path: 'mis-pedidos/etiquetas',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/etiquetas/etiquetas-page.component').then(
        m => m.EtiquetasPageComponent,
      ),
  },
  {
    path: 'logistica/transportadoras',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/logistica/carrier-preferences-page.component').then(
        m => m.CarrierPreferencesPageComponent,
      ),
  },
  {
    path: 'logistica/torre-logistica',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/logistica/torre-logistica-page.component').then(
        m => m.TorreLogisticaPageComponent,
      ),
  },
  {
    path: 'reportes/dashboard',
    loadComponent: () =>
      import('./reportes/gali6-reportes-dashboard.component').then(
        m => m.Gali6ReportesDashboardComponent,
      ),
  },
  {
    path: 'reportes/dashboard-financiero',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reportes/dashboard-financiero-page.component').then(
        m => m.DashboardFinancieroPageComponent,
      ),
  },
  {
    path: 'reportes/productos-vendidos',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reportes/productos-vendidos-page.component').then(
        m => m.ProductosVendidosPageComponent,
      ),
  },
  {
    path: 'reportes/clientes',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reportes/clientes-page.component').then(
        m => m.ClientesPageComponent,
      ),
  },
  {
    path: 'financiero/historial-de-cartera',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/financiero/wallet-page.component').then(
        m => m.WalletPageComponent,
      ),
  },
  {
    path: 'dropi-card/cards',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/dropicard/dropicard-page.component').then(
        m => m.DropicardPageComponent,
      ),
  },
  {
    path: 'marketing/campanas',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/campanas-page.component').then(
        m => m.CampanasPageComponent,
      ),
  },
  {
    path: 'marketing/automatizacion',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/automatizacion-page.component').then(
        m => m.AutomatizacionPageComponent,
      ),
  },
  {
    path: 'marketing/chatea-pro',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/chatea-pro-page.component').then(
        m => m.ChateaProPageComponent,
      ),
  },
  {
    path: 'marketing/roax-informes',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/roax-informes-page.component').then(
        m => m.RoaxInformesPageComponent,
      ),
  },
  {
    path: 'marketing/creador-de-paginas',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/creador-paginas-page.component').then(
        m => m.CreadorPaginasPageComponent,
      ),
  },
  {
    path: 'cas/bandeja',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/cas/cas-bandeja-page.component').then(
        m => m.CasBandejaPageComponent,
      ),
  },
  {
    path: 'academy',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/akademy/akademy-page.component').then(
        m => m.AkademyPageComponent,
      ),
  },
  // ── Centro de Gali consolidado: hub con tabs (Agentes | Reglas +Automatizaciones | Conexiones +Lo que Gali hizo | Marketplace) ──
  {
    path: 'agentes',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
    data: { tab: 'agentes' },
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
    data: { tab: 'reglas', focus: 'skills' },
  },
  {
    // El shell de Gali 6 reescribe toda navegación a /gali-v5/... hacia /gali-6/...
    // (ver NavigationStart interceptor en gali-6-shell.component.ts). SkillsPageComponent
    // y ReglasPageComponent (embebidos aquí, compartidos con gali-v5) navegan a
    // /gali-v5/skills/nueva al crear una skill — sin esta ruta, esa reescritura caía
    // en el wildcard y terminaba en "Hoy". Reutiliza el mismo editor de gali-v5 sin tocarlo.
    path: 'skills/nueva',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/skills/skill-editor-page.component').then(
        m => m.SkillEditorPageComponent,
      ),
  },
  {
    path: 'reglas',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
    data: { tab: 'reglas' },
  },
  {
    path: 'marketplace',
    loadComponent: () =>
      import('./centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
    data: { tab: 'marketplace' },
  },
  {
    path: 'senales',
    loadComponent: () =>
      import('./senales/gali6-senales.component').then(
        m => m.Gali6SenalesComponent,
      ),
  },
  {
    path: 'proyectos/nuevo',
    loadComponent: () =>
      import('./proyectos/gali6-nuevo-proyecto.component').then(
        m => m.Gali6NuevoProyectoComponent,
      ),
  },
  {
    path: 'proyecto/:proyectoId/campana/:campanaId',
    loadComponent: () =>
      import('./proyecto/gali6-campana-detalle.component').then(
        m => m.Gali6CampanaDetalleComponent,
      ),
  },
  {
    path: 'proyecto/:id',
    loadComponent: () =>
      import('./proyecto/gali6-proyecto-detalle.component').then(
        m => m.Gali6ProyectoDetalleComponent,
      ),
  },
  {
    path: 'mi-negocio/objetivo',
    loadComponent: () =>
      import('./mi-contexto/gali6-objetivo-editor.component').then(
        m => m.Gali6ObjetivoEditorComponent,
      ),
  },
  {
    path: 'mi-negocio',
    loadComponent: () =>
      import('./mi-contexto/gali6-mi-contexto.component').then(
        m => m.Gali6MiContextoComponent,
      ),
  },

  // ── Rutas huérfanas recuperadas (PlanChat.md §B1) — el sidebar de gali-6
  // (gali-6-sections.config.ts) las referencia reescribiendo /gali-v5 → /gali-6,
  // pero nunca estuvieron registradas aquí, así que caían en el wildcard. ──
  {
    path: 'reportes/calendario',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reportes/reportes-calendario-page.component').then(
        m => m.ReportesCalendarioPageComponent,
      ),
  },
  {
    path: 'reportes/descargas',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reportes/reportes-descargas-page.component').then(
        m => m.ReportesDescargasPageComponent,
      ),
  },
  {
    path: 'mis-pedidos/ordenes-de-despacho',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/garantias/garantias-page.component').then(
        m => m.GarantiasPageComponent,
      ),
    data: { variant: 'ordenes-despacho' },
  },
  screen('mis-pedidos/garantias-recolecciones', 'garantias-recolecciones'),
  {
    path: 'mis-pedidos/validador-direcciones',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/validador/validador-direcciones-page.component').then(
        m => m.ValidadorDireccionesPageComponent,
      ),
  },
  {
    path: 'marketing/configuraciones',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/configuraciones-marketing-page.component').then(
        m => m.ConfiguracionesMarketingPageComponent,
      ),
  },
  {
    path: 'marketing/roax-lanzador',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/roax-lanzador-page.component').then(
        m => m.RoaxLanzadorPageComponent,
      ),
  },
  screen('cas/tickets', 'tickets'),
  {
    path: 'micromundo',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/micromundo/micromundo-page.component').then(
        m => m.MicromundoPageComponent,
      ),
  },
  screen('financiero/datos-bancarios', 'datos-bancarios'),
  screen('financiero/retiros-de-saldo', 'retiros-de-saldo'),
  screen('financiero/datos-facturacion', 'datos-facturacion'),
  screen('financiero/facturas-pendientes', 'facturas-pendientes'),
  screen('financiero/notas-credito', 'notas-credito'),
  screen('configuraciones/datos-personales', 'datos-personales'),
  screen('configuraciones/seguridad', 'seguridad'),
  screen('configuraciones/integraciones', 'integraciones-config'),
  screen('configuraciones/referidos', 'referidos'),
  screen('configuraciones/configuracion-de-tienda', 'configuracion-de-tienda'),
  screen('configuraciones/usuarios-equipo', 'usuarios-equipo'),
  screen('configuraciones/dropi-testers', 'dropi-testers'),
  screen('configuraciones/planes', 'planes'),
  screen('configuraciones/mis-sesiones', 'mis-sesiones'),
  screen('configuraciones/historial-de-actividades', 'historial-de-actividades'),
  screen('configuraciones/preferencias-cuenta', 'preferencias-cuenta'),

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

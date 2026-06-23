import { Routes } from '@angular/router';

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
      import('./conexiones/gali6-conexiones-casa.component').then(
        m => m.Gali6ConexionesCasaComponent,
      ),
  },
  {
    path: 'impacto',
    loadComponent: () =>
      import('./impacto/gali6-impacto-ledger.component').then(
        m => m.Gali6ImpactoLedgerComponent,
      ),
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
  {
    path: 'agentes',
    loadComponent: () =>
      import('./agentes/gali6-agentes.component').then(
        m => m.Gali6AgentesComponent,
      ),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/skills/skills-page.component').then(
        m => m.SkillsPageComponent,
      ),
  },
  {
    path: 'reglas',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reglas/reglas-page.component').then(
        m => m.ReglasPageComponent,
      ),
  },
  {
    path: 'marketplace',
    loadComponent: () =>
      import('./marketplace/gali6-marketplace.component').then(
        m => m.Gali6MarketplaceComponent,
      ),
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
    path: 'proyecto/:id',
    loadComponent: () =>
      import('./proyecto/gali6-proyecto-detalle.component').then(
        m => m.Gali6ProyectoDetalleComponent,
      ),
  },
  {
    path: 'mi-negocio',
    loadComponent: () =>
      import('./mi-contexto/gali6-mi-contexto.component').then(
        m => m.Gali6MiContextoComponent,
      ),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

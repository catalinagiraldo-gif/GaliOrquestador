import { Routes } from '@angular/router';

export const GALI_6_V1_CHILD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/gali6-hoy-home-v1.component').then(
        m => m.Gali6HoyHomeComponent,
      ),
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./proyectos/gali6-proyectos-casa-v1.component').then(
        m => m.Gali6ProyectosCasaComponent,
      ),
  },
  {
    path: 'proyectos/nuevo',
    loadComponent: () =>
      import('./proyectos/gali6-nuevo-proyecto-v1.component').then(
        m => m.Gali6NuevoProyectoComponent,
      ),
  },
  {
    path: 'conexiones',
    loadComponent: () =>
      import('../gali-6/conexiones/gali6-conexiones-casa.component').then(
        m => m.Gali6ConexionesCasaComponent,
      ),
  },
  {
    path: 'impacto',
    loadComponent: () =>
      import('../gali-6/impacto/gali6-impacto-ledger.component').then(
        m => m.Gali6ImpactoLedgerComponent,
      ),
  },
  {
    path: 'centro-control',
    loadComponent: () =>
      import('../gali-6/centro-control/gali6-centro-control.component').then(
        m => m.Gali6CentroControlComponent,
      ),
  },
  {
    path: 'mi-negocio',
    loadComponent: () =>
      import('../gali-6/mi-contexto/gali6-mi-contexto.component').then(
        m => m.Gali6MiContextoComponent,
      ),
  },

  // ── Lazy refs a gali-5 (mismas que V1) ──
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
    path: 'mis-pedidos/mis-pedidos',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/orders/orders-page.component').then(
        m => m.OrdersPageComponent,
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
    path: 'reportes/dashboard',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/reportes/report-dashboard-kpi-page.component').then(
        m => m.ReportDashboardKpiPageComponent,
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
    path: 'agentes',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/agentes/agentes-page.component').then(
        m => m.AgentesPageComponent,
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
      import('../gali-5/gali-v5/pages/marketplace/marketplace-page.component').then(
        m => m.MarketplacePageComponent,
      ),
  },
  {
    path: 'senales',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/senales/senales-page.component').then(
        m => m.SenalesPageComponent,
      ),
  },
  {
    path: 'proyecto/:id',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/proyecto/proyecto-detalle-page.component').then(
        m => m.ProyectoDetallePageComponent,
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
    path: 'marketing/chatea-pro',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/marketing/chatea-pro-page.component').then(
        m => m.ChateaProPageComponent,
      ),
  },
  {
    path: 'cas/bandeja',
    loadComponent: () =>
      import('../gali-5/gali-v5/pages/cas/cas-bandeja-page.component').then(
        m => m.CasBandejaPageComponent,
      ),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

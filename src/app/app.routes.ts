import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { GALI_V5_CHILD_ROUTES } from './pages/gali-v5/gali-v5.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
      {
        path: 'productos/catalogo',
        loadComponent: () =>
          import('./pages/catalog/catalog.component').then(
            m => m.CatalogComponent,
          ),
      },
      {
        path: 'mis-pedidos/mis-pedidos',
        loadComponent: () =>
          import('./pages/mis-pedidos/mis-pedidos.component').then(
            m => m.MisPedidosComponent,
          ),
      },
      {
        path: 'pedidos/orden-manual',
        loadComponent: () =>
          import('./pages/orders-manual/orders-manual.component').then(
            m => m.OrdersManualComponent,
          ),
      },
      {
        path: 'productos/caza-productos',
        loadComponent: () =>
          import('./pages/caza-productos/caza-productos.component').then(
            m => m.CazaProductosComponent,
          ),
      },
      {
        path: 'productos/proveedores',
        loadComponent: () =>
          import('./pages/proveedores/proveedores.component').then(
            m => m.ProveedoresComponent,
          ),
      },
      {
        path: 'historial-de-cartera',
        loadComponent: () =>
          import('./pages/historial-cartera/historial-cartera.component').then(
            m => m.HistorialCarteraComponent,
          ),
      },
      {
        path: 'dropi-card/cards',
        loadComponent: () =>
          import('./pages/dropicard/dropicard.component').then(
            m => m.DropicardComponent,
          ),
      },
      {
        path: 'cas/bandeja',
        loadComponent: () =>
          import('./pages/cas/cas.component').then(
            m => m.CasComponent,
          ),
      },
      {
        path: 'academy',
        loadComponent: () =>
          import('./pages/academy/academy.component').then(
            m => m.AcademyComponent,
          ),
      },
      {
        path: 'pedidos/mis-pedidos-proveedor',
        loadComponent: () =>
          import('./pages/orders-provider/orders-provider.component').then(
            m => m.OrdersProviderComponent,
          ),
      },
      {
        path: 'gali/descubrimiento',
        loadComponent: () =>
          import('./pages/gali-descubrimiento/gali-descubrimiento.component').then(
            m => m.GaliDescubrimientoComponent,
          ),
      },
      {
        path: 'gali/estrategia',
        loadComponent: () =>
          import('./pages/gali-estrategia/gali-estrategia.component').then(
            m => m.GaliEstrategiaComponent,
          ),
      },
      {
        path: 'gali/creacion',
        loadComponent: () =>
          import('./pages/gali-creacion/gali-creacion.component').then(
            m => m.GaliCreacionComponent,
          ),
      },
      {
        path: 'gali/lanzamiento',
        loadComponent: () =>
          import('./pages/gali-lanzamiento/gali-lanzamiento.component').then(
            m => m.GaliLanzamientoComponent,
          ),
      },
      {
        path: 'gali/onboarding',
        loadComponent: () =>
          import('./pages/gali-onboarding/gali-onboarding.component').then(
            m => m.GaliOnboardingComponent,
          ),
      },
      {
        path: 'gali',
        loadComponent: () =>
          import('./pages/gali-dashboard/gali-dashboard.component').then(
            m => m.GaliDashboardComponent,
          ),
      },
      // Gali V5 — baseline Dropi sin Gali (Re-arquitectura UI Oficial)
      {
        path: 'gali-v5',
        loadComponent: () =>
          import('./pages/gali-v5/gali-v5-shell.component').then(
            m => m.GaliV5ShellComponent,
          ),
        children: GALI_V5_CHILD_ROUTES,
      },
      // Alias /gali-v4/** → /gali-v3/** (V4 es la versión actual; v3 es el path interno)
      {
        path: 'gali-v4',
        redirectTo: 'gali-v3',
        pathMatch: 'full',
      },
      {
        path: 'gali-v4/:childPath',
        redirectTo: 'gali-v3/:childPath',
      },
      {
        path: 'gali-v4/:childPath/:grandchildPath',
        redirectTo: 'gali-v3/:childPath/:grandchildPath',
      },
      {
        path: 'gali-v3',
        loadComponent: () =>
          import('./pages/gali-v3/gali-v3-shell.component').then(
            m => m.GaliV3ShellComponent,
          ),
        children: [
          {
            path: 'onboarding',
            loadComponent: () =>
              import('./pages/gali-v3/onboarding/onboarding.component').then(
                m => m.GaliV3OnboardingComponent,
              ),
          },
          {
            path: 'playground-maestria',
            loadComponent: () =>
              import('./pages/gali-v3/playground-maestria/playground-maestria.component').then(
                m => m.GaliV3PlaygroundMaestriaComponent,
              ),
          },
          {
            path: 'proyecto/:id',
            loadComponent: () =>
              import('./pages/gali-v3/proyecto/proyecto.component').then(
                m => m.GaliV3ProyectoComponent,
              ),
          },
          {
            path: 'builder',
            loadComponent: () =>
              import('./pages/gali-v3/builder/builder.component').then(
                m => m.GaliV3BuilderComponent,
              ),
          },
          {
            path: 'mercado/agente/nuevo',
            loadComponent: () =>
              import('./pages/gali-v3/mercado/agente-editor.component').then(
                m => m.GaliV3AgenteEditorComponent,
              ),
          },
          {
            path: 'mercado/agente/:id',
            loadComponent: () =>
              import('./pages/gali-v3/mercado/agente-detail.component').then(
                m => m.GaliV3AgenteDetailComponent,
              ),
          },
          {
            path: 'mercado',
            loadComponent: () =>
              import('./pages/gali-v3/mercado/mercado.component').then(
                m => m.GaliV3MercadoComponent,
              ),
          },
          {
            path: 'artifact/landing/:id',
            loadComponent: () =>
              import('./pages/gali-v3/artifact-landing/artifact-landing.component').then(
                m => m.GaliV3ArtifactLandingComponent,
              ),
          },
          {
            path: 'vista/:slug',
            loadComponent: () =>
              import('./pages/gali-v3/vista/vista.component').then(
                m => m.GaliV3VistaComponent,
              ),
          },
          {
            path: 'equipo',
            loadComponent: () =>
              import('./pages/gali-v3/equipo/equipo.component').then(
                m => m.GaliV3EquipoComponent,
              ),
          },
          {
            path: 'mapa',
            loadComponent: () =>
              import('./pages/gali-v3/mapa/mapa.component').then(
                m => m.GaliV3MapaComponent,
              ),
          },
          {
            path: 'retos',
            loadComponent: () =>
              import('./pages/gali-v3/retos/retos.component').then(
                m => m.GaliV3RetosComponent,
              ),
          },
          {
            path: 'objetivo',
            loadComponent: () =>
              import('./pages/gali-v3/objetivo/objetivo.component').then(
                m => m.GaliV3ObjetivoComponent,
              ),
          },
          {
            path: 'comunidad',
            loadComponent: () =>
              import('./pages/gali-v3/comunidad/comunidad.component').then(
                m => m.GaliV3ComunidadComponent,
              ),
          },
          {
            path: 'mi-stack',
            loadComponent: () =>
              import('./pages/gali-v3/mi-stack/mi-stack.component').then(
                m => m.GaliV3MiStackComponent,
              ),
          },
          {
            path: 'bloque-builder',
            loadComponent: () =>
              import('./pages/gali-v3/bloque-builder/bloque-builder.component').then(
                m => m.GaliV3BloqueBuilderComponent,
              ),
          },
          {
            path: 'builders',
            loadComponent: () =>
              import('./pages/gali-v3/builders/builders.component').then(
                m => m.GaliV3BuildersComponent,
              ),
          },
          {
            path: 'roadmap',
            loadComponent: () =>
              import('./pages/gali-v3/roadmap/roadmap.component').then(
                m => m.GaliV3RoadmapComponent,
              ),
          },
          {
            path: 'dropi/catalogo',
            loadComponent: () =>
              import('./pages/gali-v3/dropi-catalogo/dropi-catalogo.component').then(
                m => m.GaliV3DropiCatalogoComponent,
              ),
          },
          {
            path: 'dropi/pedidos',
            loadComponent: () =>
              import('./pages/gali-v3/dropi-pedidos/dropi-pedidos.component').then(
                m => m.GaliV3DropiPedidosComponent,
              ),
          },
          {
            path: 'dropi/campanas',
            loadComponent: () =>
              import('./pages/gali-v3/dropi-campanas/dropi-campanas.component').then(
                m => m.GaliV3DropiCampanasComponent,
              ),
          },
          {
            path: 'dropi/proveedores',
            loadComponent: () =>
              import('./pages/gali-v3/dropi-proveedores/dropi-proveedores.component').then(
                m => m.GaliV3DropiProveedoresComponent,
              ),
          },
          {
            path: 'dropi/caza-productos',
            loadComponent: () =>
              import('./pages/gali-v3/dropi-caza/dropi-caza.component').then(
                m => m.GaliV3DropiCazaComponent,
              ),
          },
          {
            path: 'dropi/cartera',
            loadComponent: () =>
              import('./pages/gali-v3/dropi-cartera/dropi-cartera.component').then(
                m => m.GaliV3DropiCarteraComponent,
              ),
          },
          {
            path: 'legacy/cas',
            data: { legacy: 'cas' },
            loadComponent: () =>
              import('./pages/gali-v3/legacy/legacy-host.component').then(
                m => m.GaliV3LegacyHostComponent,
              ),
          },
          {
            path: 'legacy/academy',
            data: { legacy: 'academy' },
            loadComponent: () =>
              import('./pages/gali-v3/legacy/legacy-host.component').then(
                m => m.GaliV3LegacyHostComponent,
              ),
          },
          {
            path: 'legacy/dropi-card',
            data: { legacy: 'dropi-card' },
            loadComponent: () =>
              import('./pages/gali-v3/legacy/legacy-host.component').then(
                m => m.GaliV3LegacyHostComponent,
              ),
          },
          {
            path: 'integraciones',
            loadComponent: () =>
              import('./pages/gali-v3/integraciones/integraciones.component').then(
                m => m.GaliV3IntegracionesComponent,
              ),
          },
          {
            path: 'landings',
            loadComponent: () =>
              import('./pages/gali-v3/landings/landings.component').then(
                m => m.GaliV3LandingsComponent,
              ),
          },
          {
            path: 'pedidos',
            loadComponent: () =>
              import('./pages/gali-v3/pedidos/pedidos.component').then(
                m => m.GaliV3PedidosWrapperComponent,
              ),
          },
          {
            path: 'cartera',
            loadComponent: () =>
              import('./pages/gali-v3/cartera/cartera.component').then(
                m => m.GaliV3CarteraWrapperComponent,
              ),
          },
          {
            path: 'catalogo',
            loadComponent: () =>
              import('./pages/gali-v3/catalogo/catalogo.component').then(
                m => m.GaliV3CatalogoWrapperComponent,
              ),
          },
          {
            path: '',
            loadComponent: () =>
              import('./pages/gali-v3/inicio/inicio.component').then(
                m => m.GaliV3InicioComponent,
              ),
          },
        ],
      },
      {
        path: 'gali-v2',
        loadComponent: () =>
          import('./pages/gali-v2/gali-v2-shell.component').then(
            m => m.GaliV2ShellComponent,
          ),
        children: [
          {
            path: 'onboarding',
            loadComponent: () =>
              import('./pages/gali-v2/onboarding/onboarding.component').then(
                m => m.OnboardingComponent,
              ),
          },
          {
            path: 'playground-maestria',
            loadComponent: () =>
              import('./pages/gali-v2/playground-maestria/playground-maestria.component').then(
                m => m.PlaygroundMaestriaComponent,
              ),
          },
          {
            path: 'novedades',
            loadComponent: () =>
              import('./pages/gali-v2/novedades/novedades.component').then(
                m => m.NovedadesComponent,
              ),
          },
          {
            path: 'proyectos/:id',
            loadComponent: () =>
              import('./pages/gali-v2/proyectos/proyecto-detalle.component').then(
                m => m.ProyectoDetalleComponent,
              ),
          },
          {
            path: 'proyectos',
            loadComponent: () =>
              import('./pages/gali-v2/proyectos/proyectos-lista.component').then(
                m => m.ProyectosListaComponent,
              ),
          },
          {
            path: '',
            loadComponent: () =>
              import('./pages/gali-v2/lienzo/lienzo.component').then(
                m => m.LienzoComponent,
              ),
          },
        ],
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // Catch-all for prototype routes — renders gallery as placeholder
      {
        path: '**',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
    ],
  },
];

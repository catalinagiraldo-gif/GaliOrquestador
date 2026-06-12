import { Routes } from '@angular/router';
import { GALI_V5_CHILD_ROUTES } from '../gali-v5/gali-v5.routes';

/**
 * Gali V5 v2 — "La Casita".
 * Estrategia de RESCATE: hereda TODAS las páginas de /gali-v5 (productos, pedidos,
 * logística, reportes, financiero, marketing, cas, agentes, skills, reglas, marketplace,
 * micromundo, señales, configuraciones…) montadas bajo /gali-v5-v2 con sus mismos sub-paths,
 * y las superficies de la casita las sobreescriben (home "Hoy", proyectos, conexiones, impacto).
 * Nada se elimina — solo se reorganiza con diagramación limpia + modo básico/experto.
 */
const CASITA_OVERRIDE = new Set(['', 'proyectos', 'conexiones', 'impacto']);

const inherited: Routes = GALI_V5_CHILD_ROUTES.filter(
  r => typeof r.path === 'string' && r.path !== '**' && !CASITA_OVERRIDE.has(r.path),
);

export const GALI_V5_V2_CHILD_ROUTES: Routes = [
  // ── Superficies de la casita (overrides) ──
  {
    path: '',
    loadComponent: () => import('./home/hoy-home.component').then(m => m.HoyHomeComponent),
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./proyectos/proyectos-casa.component').then(m => m.ProyectosCasaComponent),
  },
  {
    path: 'conexiones',
    loadComponent: () =>
      import('./conexiones/conexiones-casa.component').then(m => m.ConexionesCasaComponent),
  },
  {
    path: 'impacto',
    loadComponent: () =>
      import('./impacto/impacto-ledger.component').then(m => m.ImpactoLedgerComponent),
  },

  // ── Todo el resto de Gali V5, rescatado bajo /gali-v5-v2 ──
  ...inherited,

  { path: '**', redirectTo: '' },
];

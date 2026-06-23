import { Routes } from '@angular/router';

export const GALI_6_ZERO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./onboarding/gali6-zero-onboarding.component').then(
        m => m.Gali6ZeroOnboardingComponent,
      ),
  },
  {
    path: 'hoy',
    loadComponent: () =>
      import('./hoy/gali6-zero-hoy.component').then(
        m => m.Gali6ZeroHoyComponent,
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

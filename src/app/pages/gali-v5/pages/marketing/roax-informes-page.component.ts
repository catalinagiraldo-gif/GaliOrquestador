import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropiTitulosComponent, DropiButtonNewComponent } from '../../components/shared';
import informesData from '../../../../../../mocks/gali-v5/marketing-roax-informes.json';
import { GALI_V5_DROPI_LOGO } from '../../gali-v5.constants';

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  trend: string;
}

@Component({
  selector: 'app-roax-informes-page',
  standalone: true,
  imports: [CommonModule, DropiTitulosComponent, DropiButtonNewComponent],
  templateUrl: './roax-informes-page.component.html',
  styleUrl: './roax-informes-page.component.scss',
})
export class RoaxInformesPageComponent {
  readonly dropiLogo = GALI_V5_DROPI_LOGO;
  readonly breadcrumbs = ['Marketing', 'ROAX', 'Informes'];
  readonly dateRange = informesData.dateRange;
  readonly kpis: KpiCard[] = informesData.kpis;

  // Gali intelligence layer
  readonly galiRoasInsight = {
    roasDeclarado: '4.2x',
    roasReal: '2.8x',
    gap: '-1.4x',
    causa: '40% del gap = novedades en Cali (+10pts esta semana)',
    presupuesto: '$65.000.000',
    gananciaReal: '$28.400.000',
  };

  readonly reglaActivas = [
    { icono: '🛡️', nombre: 'Anti-Baneo Meta', estado: 'activa', ultimaEjecucion: 'hace 2 días', ejecuciones: 4 },
    { icono: '🌙', nombre: 'Pausa Nocturna 11pm-6am', estado: 'activa', ultimaEjecucion: 'anoche', ejecuciones: 14 },
    { icono: '🚀', nombre: 'Escalador ROAS 20%', estado: 'en_espera', ultimaEjecucion: 'esperando ROAS > 3x', ejecuciones: 0 },
  ];

  readonly healthIndicators = [
    { label: 'Collar GPS', roas: 2.9, ctr: 1.8, frecuencia: 2.1, status: 'ok' },
    { label: 'Skincare K-Beauty', roas: 2.1, ctr: 1.2, frecuencia: 2.8, status: 'warning' },
    { label: 'Bandas Fitness', roas: 0, ctr: 0, frecuencia: 0, status: 'paused' },
  ];

  getHealthClass(status: string): string {
    return { ok: 'health--ok', warning: 'health--warning', paused: 'health--paused', danger: 'health--danger' }[status] ?? '';
  }
}

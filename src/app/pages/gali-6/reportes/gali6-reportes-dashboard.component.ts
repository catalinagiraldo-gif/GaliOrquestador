import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import kpisGlobal from '../../../../../mocks/gali-v5/kpis-global.json';
import { MOCK_SENALES } from '../../../../../mocks/gali-v5/senales.mock';
import type { GaliSignal } from '../../../../../mocks/gali-v5/senales.mock';

interface KpiCard {
  label: string;
  valor: string;
  delta: string;
  deltaPos: boolean;
  deterministico: boolean;
  route?: string;
}

interface ProyectoFila {
  nombre: string;
  estado: string;
  pedidosSem: number;
  roas: string;
  roasMeta: string;
  pauta: string;
  revenue: string;
  margen: string;
  alertaActiva: boolean;
}

@Component({
  selector: 'app-gali6-reportes-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-reportes-dashboard.component.html',
  styleUrl: './gali6-reportes-dashboard.component.scss',
})
export class Gali6ReportesDashboardComponent {
  readonly router = inject(Router);

  readonly bannerExpandido = signal(false);

  readonly kpis: KpiCard[] = [
    {
      label: 'Pedidos esta semana',
      valor: kpisGlobal.pedidos_sem_total.label,
      delta: '+12% vs. semana pasada',
      deltaPos: true,
      deterministico: true,
      route: '/gali-6/mis-pedidos/mis-pedidos',
    },
    {
      label: 'ROAS efectivo',
      valor: kpisGlobal.roas_efectivo_global.label,
      delta: '-0.08x vs. semana pasada',
      deltaPos: false,
      deterministico: true,
      route: '/gali-6/reportes/dashboard',
    },
    {
      label: 'Tasa de novedades',
      valor: kpisGlobal.tasa_novedad_global.label,
      delta: '+2pp — en alerta',
      deltaPos: false,
      deterministico: true,
      route: '/gali-6/mis-pedidos/novedades',
    },
    {
      label: 'Ganancia neta / mes',
      valor: kpisGlobal.utilidad_neta_mensual.label,
      delta: '+8% vs. mes pasado',
      deltaPos: true,
      deterministico: true,
    },
  ];

  readonly proyectos: ProyectoFila[] = kpisGlobal.kpis_por_proyecto.map(p => ({
    nombre: p.nombre,
    estado: p.estado,
    pedidosSem: p.pedidos_sem,
    roas: p.roas_real_label,
    roasMeta: p.roas_meta_label,
    pauta: p.pauta_diaria_label,
    revenue: p.revenue_semanal_label,
    margen: `${p.margen_neto_pct}%`,
    alertaActiva: p.alerta_activa,
  }));

  readonly senalesSemana: GaliSignal[] = MOCK_SENALES.slice(0, 4);

  onVerSenal(id: string): void {
    this.router.navigate(['/gali-6/senales'], { queryParams: { signalId: id } });
  }

  onKpiClick(kpi: KpiCard): void {
    if (kpi.route) this.router.navigate([kpi.route]);
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = {
      en_escala: 'En escala',
      activo: 'Activo',
      pausado: 'Pausado',
    };
    return map[estado] ?? estado;
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      en_escala: 'badge--escala',
      activo: 'badge--activo',
      pausado: 'badge--pausado',
    };
    return map[estado] ?? '';
  }

  getFuenteLabel(s: GaliSignal): string {
    return s.fuente === 'deterministico' ? 'Dato real' : 'Análisis Gali';
  }

  getFuenteClass(s: GaliSignal): string {
    return s.fuente === 'deterministico' ? 'chip--deterministic' : 'chip--ia';
  }
}

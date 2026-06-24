import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PROYECTOS_MOCK, CampanaProyecto, ProyectoDetalle } from '../../../../../mocks/gali-v6/proyectos.mock';

const AGENTE_LABEL: Record<string, { label: string; icono: string; autopilot: boolean }> = {
  'roax-ads':            { label: 'ROAS Tracker',         icono: '📊', autopilot: true  },
  'stock-guardian':      { label: 'Stock Guardian',        icono: '📦', autopilot: true  },
  'vigilante-logistico': { label: 'Vigilante Logístico',  icono: '🚛', autopilot: false },
  'ada-spy':             { label: 'ADA Spy',              icono: '🔍', autopilot: false },
  'chatea-pro':          { label: 'Chatea Pro',           icono: '💬', autopilot: true  },
};

const CONEXION_LABEL: Record<string, { label: string; icono: string; estado: string }> = {
  'tiktok-ads':  { label: 'TikTok Ads',  icono: '🎵', estado: 'Conectado' },
  'meta-ads':    { label: 'Meta Ads',    icono: '📘', estado: 'Conectado' },
  'google-ads':  { label: 'Google Ads', icono: '🔍', estado: 'Conectado' },
  'whatsapp':    { label: 'WhatsApp',    icono: '💬', estado: 'Conectado' },
};

interface HistorialItem {
  tiempo: string;
  agente: string;
  accion: string;
  impacto?: string;
}

const HISTORIAL_MOCK: HistorialItem[] = [
  { tiempo: 'hace 2h',  agente: 'ROAS Tracker',  accion: 'Escaló presupuesto 20%',              impacto: 'ROAS pasó de 1.8x a 2.3x' },
  { tiempo: 'ayer',     agente: 'Stock Guardian', accion: 'Alertó stock bajo en proveedor',       impacto: 'Pediste reposición a tiempo' },
  { tiempo: '2 días',   agente: 'ROAS Tracker',  accion: 'Detectó audiencia de alto rendimiento', impacto: 'CTR +12% en 18-28 años' },
  { tiempo: '3 días',   agente: 'Stock Guardian', accion: 'Sincronizó inventario con proveedor',  impacto: '120 unidades confirmadas' },
];

@Component({
  selector: 'app-gali6-campana-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-campana-detalle.component.html',
  styleUrls: ['./gali6-campana-detalle.component.scss'],
})
export class Gali6CampanaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly proyectoId = signal('');
  readonly campanaId = signal('');
  readonly pausada = signal(false);
  readonly toastMsg = signal<string | null>(null);

  readonly proyecto = computed<ProyectoDetalle | null>(() =>
    PROYECTOS_MOCK.find(p => p.id === this.proyectoId()) ?? null
  );

  readonly campana = computed<CampanaProyecto | null>(() =>
    this.proyecto()?.campanas.find(c => c.id === this.campanaId()) ?? null
  );

  readonly historial = HISTORIAL_MOCK;

  ngOnInit(): void {
    this.proyectoId.set(this.route.snapshot.paramMap.get('proyectoId') ?? '');
    this.campanaId.set(this.route.snapshot.paramMap.get('campanaId') ?? '');
  }

  volver(): void {
    this.router.navigate(['/gali-6/proyecto', this.proyectoId()], {
      queryParams: { tab: 'campanas' },
    });
  }

  togglePausa(): void {
    this.pausada.update(v => !v);
    this.toastMsg.set(this.pausada() ? '⏸ Campaña pausada' : '▶ Campaña activada');
    setTimeout(() => this.toastMsg.set(null), 2000);
  }

  getAgenteInfo(id: string) { return AGENTE_LABEL[id] ?? { label: id, icono: '🤖', autopilot: false }; }
  getConexionInfo(id: string) { return CONEXION_LABEL[id] ?? { label: id, icono: '🔌', estado: 'Conectado' }; }

  getRoasClass(c: CampanaProyecto): string {
    if (!c.roasActual) return '';
    return c.roasActual >= c.roasObjetivo ? 'roas--ok' : 'roas--low';
  }
}

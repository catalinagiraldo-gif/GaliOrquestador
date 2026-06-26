import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PROYECTOS_MOCK, CampanaProyecto, ProyectoDetalle, ProductoRef } from '../../../../../mocks/gali-v6/proyectos.mock';

const AGENTE_LABEL: Record<string, { label: string; icono: string; autopilot: boolean }> = {
  'roax-ads':            { label: 'ROAS Tracker',         icono: 'pi-chart-bar',  autopilot: true  },
  'stock-guardian':      { label: 'Stock Guardian',        icono: 'pi-box',        autopilot: true  },
  'vigilante-logistico': { label: 'Vigilante Logístico',  icono: 'pi-truck',      autopilot: false },
  'ada-spy':             { label: 'ADA Spy',              icono: 'pi-search',     autopilot: false },
  'chatea-pro':          { label: 'Chatea Pro',           icono: 'pi-comments',   autopilot: true  },
};

const CONEXION_LABEL: Record<string, { label: string; icono: string; estado: string }> = {
  'tiktok-ads':  { label: 'TikTok Ads',  icono: 'pi-tiktok',    estado: 'Conectado' },
  'meta-ads':    { label: 'Meta Ads',    icono: 'pi-facebook',  estado: 'Conectado' },
  'google-ads':  { label: 'Google Ads', icono: 'pi-google',    estado: 'Conectado' },
  'whatsapp':    { label: 'WhatsApp',    icono: 'pi-whatsapp',  estado: 'Conectado' },
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

  // ── Modal cambiar producto ────────────────────────────────────────────
  readonly cambiarProductoOpen = signal(false);
  readonly cambiarProductoTargetId = signal<string | null>(null);

  readonly proyecto = computed<ProyectoDetalle | null>(() =>
    PROYECTOS_MOCK.find(p => p.id === this.proyectoId()) ?? null
  );

  readonly campana = computed<CampanaProyecto | null>(() =>
    this.proyecto()?.campanas.find(c => c.id === this.campanaId()) ?? null
  );

  // ── Prev/Next campañas ───────────────────────────────────────────────
  readonly todasCampanas = computed(() =>
    this.proyecto()?.campanas ?? []
  );

  readonly campanaIndex = computed(() =>
    this.todasCampanas().findIndex(c => c.id === this.campanaId())
  );

  readonly campanaAnterior = computed(() =>
    this.todasCampanas()[this.campanaIndex() - 1] ?? null
  );

  readonly campanaSiguiente = computed(() =>
    this.todasCampanas()[this.campanaIndex() + 1] ?? null
  );

  // ── Lista de productos de la campaña ─────────────────────────────────
  readonly productosEnCampana = computed<ProductoRef[]>(() => {
    const c = this.campana();
    if (!c) return [];
    if (c.productos && c.productos.length > 0) return c.productos;
    if (c.producto) return [{ id: 'legacy', nombre: c.producto, margenPct: 0, precioVentaLabel: '' }];
    return [];
  });

  readonly historial = HISTORIAL_MOCK;

  ngOnInit(): void {
    this.proyectoId.set(this.route.snapshot.paramMap.get('proyectoId') ?? '');
    this.campanaId.set(this.route.snapshot.paramMap.get('campanaId') ?? '');
  }

  irCampana(id: string): void {
    this.campanaId.set(id);
    this.router.navigate(['/gali-6/proyecto', this.proyectoId(), 'campana', id]);
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

  abrirCambiarProducto(productoId: string): void {
    this.cambiarProductoTargetId.set(productoId);
    this.cambiarProductoOpen.set(true);
  }

  cerrarCambiarProducto(): void {
    this.cambiarProductoOpen.set(false);
    this.cambiarProductoTargetId.set(null);
  }

  getAgenteInfo(id: string) { return AGENTE_LABEL[id] ?? { label: id, icono: 'pi-microchip-ai', autopilot: false }; }
  getConexionInfo(id: string) { return CONEXION_LABEL[id] ?? { label: id, icono: '🔌', estado: 'Conectado' }; }

  getRoasClass(c: CampanaProyecto): string {
    if (!c.roasActual) return '';
    return c.roasActual >= c.roasObjetivo ? 'roas--ok' : 'roas--low';
  }
}

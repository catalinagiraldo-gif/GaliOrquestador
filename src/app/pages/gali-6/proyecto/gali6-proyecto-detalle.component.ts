import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import { MOCK_CAMPANAS, Campana } from '../../../../../mocks/gali-v6/campanas.mock';
import { AGENTES_ESPECIALIZADOS } from '../../../../../mocks/gali-v6/agentes-especializados';
import { PROYECTOS_MOCK, ProyectoDetalle, CampanaProyecto, ProductoMetrics } from '../../../../../mocks/gali-v6/proyectos.mock';
import { Gali6NuevaCampanaComponent, NuevaCampanaData } from './gali6-nueva-campana.component';

type DetalleTab = 'canvas' | 'campanas' | 'agentes';
type CampanaFiltro = 'todas' | 'activa' | 'pausada' | 'borrador' | 'cerrada';

const ESTADO_LABEL: Record<string, string> = {
  en_escala: 'En escala', activo: 'Activo', pausado: 'Pausado', lanzando: 'Lanzando',
  recien_lanzado: 'Recién lanzado', cerrado: 'Cerrado', borrador: 'Borrador',
  configurando: 'Configurando', en_riesgo: 'En riesgo',
};

const CONEXION_ICONS: Record<string, string> = {
  'meta-ads': 'pi-facebook', 'tiktok-ads': 'pi-tiktok', 'google-ads': 'pi-google',
  'whatsapp': 'pi-whatsapp', 'shopify': 'pi-shopping-bag', 'tiktok': 'pi-tiktok', 'meta': 'pi-facebook',
};

const AGENTE_ICONS: Record<string, string> = {
  'roax-ads': 'pi-chart-bar', 'stock-guardian': 'pi-box', 'vigilante-logistico': 'pi-truck',
  'ada-spy': 'pi-search', 'chatea-pro': 'pi-comments',
};

@Component({
  selector: 'app-gali6-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, Gali6NuevaCampanaComponent],
  templateUrl: './gali6-proyecto-detalle.component.html',
  styleUrls: ['./gali6-proyecto-detalle.component.scss'],
})
export class Gali6ProyectoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly router = inject(Router);

  // ── Estado ──────────────────────────────────────────────────────────────
  readonly activeTab = signal<DetalleTab>('canvas');
  readonly campanaFiltro = signal<CampanaFiltro>('todas');
  readonly proyectoId = signal('');
  readonly campanasPausadasLocal = signal<Set<string>>(new Set());
  readonly toastPausa = signal<string | null>(null);
  readonly panelNuevaCampana = signal<NuevaCampanaData | null>(null);

  // ── PROYECTOS_MOCK (pv-001..004) + localStorage nuevos ──────────────────
  readonly proyectoNuevo = computed<ProyectoDetalle | null>(() => {
    const id = this.proyectoId();
    const enMock = PROYECTOS_MOCK.find(p => p.id === id);
    if (enMock) return enMock;
    try {
      const extra: ProyectoDetalle[] = JSON.parse(localStorage.getItem('g6_proyectos_extra') ?? '[]');
      return extra.find(p => p.id === id) ?? null;
    } catch { return null; }
  });

  readonly isNewProject = computed(() => this.proyectoNuevo() !== null);

  // ── Legacy PROJECTS (gali-v5 JSON) ──────────────────────────────────────
  readonly proyecto = computed(() => {
    const id = this.proyectoId();
    const nuevo = this.proyectoNuevo();
    if (nuevo) return null;
    return (PROJECTS as any[]).find(p => p.id === id) ?? null;
  });

  // ── Unified display ──────────────────────────────────────────────────────
  readonly estadoLabel = computed(() => {
    const nuevo = this.proyectoNuevo();
    if (nuevo) return ESTADO_LABEL[nuevo.estado] ?? nuevo.estado;
    const p = this.proyecto();
    return p ? (ESTADO_LABEL[p.estado] ?? p.estado) : '';
  });

  readonly contribucionPct = computed(() => this.proyectoNuevo()?.contribucionPct ?? null);
  readonly proyeccionSemanas = computed(() => this.proyectoNuevo()?.proyeccionSemanas ?? null);
  readonly alertaGali = computed(() => this.proyectoNuevo()?.alertaGali ?? null);

  // ── Campañas (PROYECTOS_MOCK) ────────────────────────────────────────────
  readonly campanasPv = computed<CampanaProyecto[]>(() => {
    return this.proyectoNuevo()?.campanas ?? [];
  });

  // ── Campañas (legacy) ────────────────────────────────────────────────────
  readonly campanas = computed<Campana[]>(() => {
    if (this.isNewProject()) return [];
    return MOCK_CAMPANAS.filter(c => c.proyectoId === this.proyectoId());
  });

  readonly campanasFiltradas = computed<Campana[]>(() => {
    const f = this.campanaFiltro();
    const all = this.campanas();
    if (f === 'todas') return all;
    return all.filter(c => c.estado === f);
  });

  readonly campanasPvFiltradas = computed<CampanaProyecto[]>(() => {
    const f = this.campanaFiltro();
    const all = this.campanasPv();
    if (f === 'todas') return all;
    return all.filter(c => (c.estado as string) === f || (f === 'activa' && c.estado === 'activa'));
  });

  readonly campanasCounts = computed(() => {
    if (this.isNewProject()) {
      const all = this.campanasPv();
      return {
        todas: all.length,
        activa: all.filter(c => c.estado === 'activa').length,
        pausada: all.filter(c => c.estado === 'pausada').length,
        borrador: all.filter(c => c.estado === 'borrador').length,
        cerrada: 0,
      };
    }
    const all = this.campanas();
    return {
      todas: all.length,
      activa: all.filter(c => c.estado === 'activa').length,
      pausada: all.filter(c => c.estado === 'pausada').length,
      borrador: all.filter(c => c.estado === 'borrador').length,
      cerrada: all.filter(c => c.estado === 'cerrada').length,
    };
  });

  readonly totalCampanas = computed(() =>
    this.isNewProject() ? this.campanasPv().length : this.campanas().length
  );

  // ── Métricas de productos ────────────────────────────────────────────────
  readonly productosMetrics = computed<ProductoMetrics[]>(() =>
    this.proyectoNuevo()?.productosMetrics ?? []
  );

  readonly maxHistorial = computed(() => {
    const values = this.productosMetrics().flatMap(p => p.historialSemanas);
    return values.length > 0 ? Math.max(...values) : 1;
  });

  adaColor(score: number): string {
    if (score >= 80) return 'ada--high';
    if (score >= 60) return 'ada--mid';
    return 'ada--low';
  }

  readonly agentesActivos = computed(() => {
    const nuevo = this.proyectoNuevo();
    if (nuevo) {
      return nuevo.agentes.map(id => ({
        id, icono: AGENTE_ICONS[id] ?? 'pi-microchip-ai',
        nombre: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        descripcionCorta: '',
        nombreCorto: id,
        tipo: 'ia' as const,
      }));
    }
    const p = this.proyecto();
    if (!p) return [];
    const idsActivos: string[] = p.agentes_activos ?? [];
    return AGENTES_ESPECIALIZADOS.filter(a =>
      idsActivos.some(id => a.id.includes(id) || id.includes(a.id))
    );
  });

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.proyectoId.set(id);

    const tab = this.route.snapshot.queryParamMap.get('tab') as DetalleTab | null;
    if (tab === 'campanas' || tab === 'agentes') {
      this.activeTab.set(tab);
    }
  }

  // ── Campañas: acordeón de detalle ────────────────────────────────────────
  readonly campanaDetalleOpen = signal<Set<string>>(new Set());

  toggleCampanaDetalle(id: string): void {
    this.campanaDetalleOpen.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  maxHistorialCampana(c: CampanaProyecto): number {
    const vals = (c.productos ?? []).flatMap(p => (p as any).metricas?.historial5sem as number[] ?? []);
    return Math.max(...vals, 1);
  }

  sparklineColor(val: number, c: CampanaProyecto): string {
    const ratio = val / this.maxHistorialCampana(c);
    if (ratio >= 0.75) return '#22c55e';
    if (ratio >= 0.4)  return '#f59e0b';
    return '#ef4444';
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  setTab(tab: DetalleTab): void { this.activeTab.set(tab); }
  setCampanaFiltro(f: CampanaFiltro): void { this.campanaFiltro.set(f); }

  volverAProyectos(): void {
    this.router.navigate(['/gali-6/proyectos']);
  }

  nuevaCampana(): void {
    const pv = this.proyectoNuevo();
    const p = this.proyecto();
    const nombre = pv?.nombre ?? p?.nombre ?? 'este proyecto';
    this.panelNuevaCampana.set({ proyectoId: this.proyectoId(), proyectoNombre: nombre });
  }

  cerrarPanelNuevaCampana(): void {
    this.panelNuevaCampana.set(null);
  }

  irASenales(): void {
    this.router.navigate(['/gali-6/senales'], {
      queryParams: { projectId: this.proyectoId() },
    });
  }

  irADetalleCampana(proyectoId: string, campanaId: string): void {
    this.router.navigate(['/gali-6/proyecto', proyectoId, 'campana', campanaId]);
  }

  togglePausaCampana(campanaId: string): void {
    this.campanasPausadasLocal.update(set => {
      const next = new Set(set);
      if (next.has(campanaId)) { next.delete(campanaId); } else { next.add(campanaId); }
      return next;
    });
    const pausada = this.campanasPausadasLocal().has(campanaId);
    this.toastPausa.set(pausada ? '⏸ Campaña pausada' : '▶ Campaña activada');
    setTimeout(() => this.toastPausa.set(null), 2000);
  }

  esCampanaPausada(id: string): boolean {
    return this.campanasPausadasLocal().has(id);
  }

  // ── Helpers UI ───────────────────────────────────────────────────────────
  getCampanaEstadoLabel(estado: string): string {
    const m: Record<string, string> = {
      activa: 'Activa', pausada: 'Pausada', borrador: 'Borrador',
      cerrada: 'Cerrada', sin_producto: 'Sin producto',
    };
    return m[estado] ?? estado;
  }

  getRoasClass(c: Campana): string {
    if (!c.roasActual) return '';
    return c.roasActual >= c.roasObjetivo ? 'roas--ok' : 'roas--low';
  }

  getRoasPvClass(c: CampanaProyecto): string {
    if (!c.roasActual) return '';
    return c.roasActual >= c.roasObjetivo ? 'roas--ok' : 'roas--low';
  }

  getCanalIcon(canal: string): string {
    const m: Record<string, string> = { 'meta-ads': 'pi-facebook', 'tiktok-ads': 'pi-tiktok', 'google-ads': 'pi-google', organico: 'pi-leaf', whatsapp: 'pi-whatsapp' };
    return m[canal] ?? 'pi-megaphone';
  }

  getCanalPvIcon(canal: string): string {
    return ({ meta: 'pi-facebook', tiktok: 'pi-tiktok', whatsapp: 'pi-whatsapp', google: 'pi-google' } as Record<string,string>)[canal] ?? 'pi-megaphone';
  }

  getConexionIcon(cnx: string): string {
    return CONEXION_ICONS[cnx] ?? 'pi-link';
  }

  getAgenteIcon(id: string): string {
    return AGENTE_ICONS[id] ?? 'pi-microchip-ai';
  }
}

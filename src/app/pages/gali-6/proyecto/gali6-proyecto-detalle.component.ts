import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import { MOCK_CAMPANAS, Campana } from '../../../../../mocks/gali-v6/campanas.mock';
import { AGENTES_ESPECIALIZADOS } from '../../../../../mocks/gali-v6/agentes-especializados';

type DetalleTab = 'canvas' | 'campanas' | 'agentes';
type CampanaFiltro = 'todas' | 'activa' | 'pausada' | 'borrador' | 'cerrada';

const ESTADO_LABEL: Record<string, string> = {
  en_escala: 'En escala', activo: 'Activo', pausado: 'Pausado', lanzando: 'Lanzando',
  recien_lanzado: 'Recién lanzado', cerrado: 'Cerrado', borrador: 'Borrador',
};

@Component({
  selector: 'app-gali6-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  // ── Datos del proyecto ──────────────────────────────────────────────────
  readonly proyecto = computed(() => {
    const id = this.proyectoId();
    return (PROJECTS as any[]).find(p => p.id === id) ?? null;
  });

  readonly estadoLabel = computed(() => {
    const p = this.proyecto();
    return p ? (ESTADO_LABEL[p.estado] ?? p.estado) : '';
  });

  readonly campanas = computed<Campana[]>(() => {
    return MOCK_CAMPANAS.filter(c => c.proyectoId === this.proyectoId());
  });

  readonly campanasFiltradas = computed<Campana[]>(() => {
    const f = this.campanaFiltro();
    const all = this.campanas();
    if (f === 'todas') return all;
    return all.filter(c => c.estado === f);
  });

  readonly campanasCounts = computed(() => {
    const all = this.campanas();
    return {
      todas: all.length,
      activa: all.filter(c => c.estado === 'activa').length,
      pausada: all.filter(c => c.estado === 'pausada').length,
      borrador: all.filter(c => c.estado === 'borrador').length,
      cerrada: all.filter(c => c.estado === 'cerrada').length,
    };
  });

  readonly agentesActivos = computed(() => {
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

  // ── Handlers ─────────────────────────────────────────────────────────────
  setTab(tab: DetalleTab): void { this.activeTab.set(tab); }
  setCampanaFiltro(f: CampanaFiltro): void { this.campanaFiltro.set(f); }

  volverAProyectos(): void {
    this.router.navigate(['/gali-6/proyectos']);
  }

  nuevaCampana(): void {
    this.router.navigate(['/gali-6/proyectos/nuevo'], {
      queryParams: { proyectoId: this.proyectoId() },
    });
  }

  irASenales(): void {
    this.router.navigate(['/gali-6/senales'], {
      queryParams: { projectId: this.proyectoId() },
    });
  }

  // ── Helpers UI ───────────────────────────────────────────────────────────
  getCampanaEstadoLabel(estado: string): string {
    const m: Record<string, string> = { activa: 'Activa', pausada: 'Pausada', borrador: 'Borrador', cerrada: 'Cerrada' };
    return m[estado] ?? estado;
  }

  getRoasClass(c: Campana): string {
    if (!c.roasActual) return '';
    return c.roasActual >= c.roasObjetivo ? 'roas--ok' : 'roas--low';
  }

  getCanalIcon(canal: string): string {
    const m: Record<string, string> = { 'meta-ads': '📘', 'tiktok-ads': '🎵', 'google-ads': '🔍', organico: '🌱', whatsapp: '💬' };
    return m[canal] ?? '📣';
  }
}

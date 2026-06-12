import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { CrearProyectoModalComponent } from '../../components/crear-proyecto-modal/crear-proyecto-modal.component';
import { DiagnosticoModalComponent } from '../../components/diagnostico-modal/diagnostico-modal.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import PROJECTS_JSON from '../../../../../../mocks/gali-v5/projects.json';

type ProyectoEstado = 'en_escala' | 'activo' | 'pausado' | 'borrador' | 'recien_lanzado' | 'campaña_fallida';
type GaliStatusType = 'warn' | 'ok' | 'info' | 'neutral';

interface Proyecto {
  id: string;
  icono: string;
  nombre: string;
  estado: ProyectoEstado;
  roas: string;
  pedidos: number;
  ganancia: string;
  galiStatus: GaliStatusType;
  galiMsg: string;
  agentes: string[];
}

@Component({
  selector: 'app-proyectos-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DropiGaliBarComponent, CrearProyectoModalComponent, DiagnosticoModalComponent],
  templateUrl: './proyectos-list-page.component.html',
  styleUrl: './proyectos-list-page.component.scss',
})
export class ProyectosListPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ws = inject(GaliWorkspaceService);

  readonly breadcrumbs = ['Gali Hub'];
  activeFilter = signal<'todos' | 'activos' | 'pausados' | 'borradores'>('todos');
  showCrearModal = signal(false);

  constructor() {
    this.route.queryParamMap.subscribe(p => {
      if (p.get('nuevo') === 'true') this.showCrearModal.set(true);
    });
    if (this.falloCount > 0 || this.recienLanzadoCount > 0) {
      this.portfolioHealthOpen.set(true);
    }
  }

  private static readonly ICONOS: Record<string, string> = {
    'collar-gps-2026': '🐕',
    'skincare-kbeauty': '✨',
    'fitness-bands': '💪',
    'difusor-aromaterapia': '🌿',
    'mini-proyector-fallo': '📺',
    'rodillo-jade-borrador': '💎',
    'proyector-portatil': '📺',
    'reloj-smartwatch': '⌚',
  };

  private static readonly BASE_PROYECTOS: Proyecto[] = [
    {
      id: 'collar-gps-2026',
      icono: '🐕',
      nombre: 'Collar GPS para mascotas',
      estado: 'en_escala',
      roas: '1.93x',
      pedidos: 47,
      ganancia: '$411k/sem',
      galiStatus: 'warn',
      galiMsg: 'Novedad en Cali afecta margen · Acción recomendada',
      agentes: ['Roax', 'Vigilante', 'Chatea Pro'],
    },
    {
      id: 'skincare-kbeauty',
      icono: '✨',
      nombre: 'Skincare K-Beauty',
      estado: 'activo',
      roas: '2.1x',
      pedidos: 23,
      ganancia: '$198k/sem',
      galiStatus: 'ok',
      galiMsg: 'Todo normal · 3 agentes activos',
      agentes: ['Roax', 'Chatea Pro'],
    },
    {
      id: 'proyector-portatil',
      icono: '📺',
      nombre: 'Proyector Portátil',
      estado: 'pausado',
      roas: '—',
      pedidos: 0,
      ganancia: '—',
      galiStatus: 'info',
      galiMsg: 'CTR se recuperó. ¿Reanudamos la campaña?',
      agentes: ['Roax'],
    },
    {
      id: 'reloj-smartwatch',
      icono: '⌚',
      nombre: 'Reloj Smartwatch Pro',
      estado: 'borrador',
      roas: '—',
      pedidos: 0,
      ganancia: '—',
      galiStatus: 'neutral',
      galiMsg: 'Sin lanzar · ADA Spy tiene análisis listo',
      agentes: ['ADA Spy'],
    },
  ];

  readonly proyectos: Proyecto[] = (() => {
    const baseIds = new Set(ProyectosListPageComponent.BASE_PROYECTOS.map(p => p.id));
    const extras: Proyecto[] = (PROJECTS_JSON as any[])
      .filter((p: any) => p.id && !baseIds.has(p.id))
      .map((p: any): Proyecto => ({
        id: p.id,
        icono: ProyectosListPageComponent.ICONOS[p.id] ?? '📦',
        nombre: p.nombre ?? p.id,
        estado: p.estado as ProyectoEstado,
        roas: p.roas_real_label ?? '—',
        pedidos: p.pedidos_sem ?? 0,
        ganancia: p.ganancia_neta_semanal_label ?? '—',
        galiStatus: p.alerta_activa ? 'warn' : (p.estado === 'recien_lanzado' ? 'info' : p.estado === 'borrador' ? 'neutral' : 'ok') as GaliStatusType,
        galiMsg: p.alerta_mensaje ?? p.gali_nota ?? '',
        agentes: (p.agentes_activos ?? []).map((a: string) => a.charAt(0).toUpperCase() + a.slice(1)),
      }));
    return [...ProyectosListPageComponent.BASE_PROYECTOS, ...extras];
  })();

  get filteredProyectos(): Proyecto[] {
    const f = this.activeFilter();
    if (f === 'todos') return this.proyectos;
    if (f === 'activos') return this.proyectos.filter(p => p.estado === 'activo' || p.estado === 'en_escala' || p.estado === 'recien_lanzado');
    if (f === 'pausados') return this.proyectos.filter(p => p.estado === 'pausado' || p.estado === 'campaña_fallida');
    if (f === 'borradores') return this.proyectos.filter(p => p.estado === 'borrador');
    return this.proyectos;
  }

  estadoLabel(estado: ProyectoEstado): string {
    const map: Record<ProyectoEstado, string> = {
      en_escala: 'En escala',
      activo: 'Activo',
      pausado: 'Pausado',
      borrador: 'Borrador',
      recien_lanzado: 'Recién lanzado',
      campaña_fallida: 'Campaña fallida',
    };
    return map[estado] ?? estado;
  }

  goToProject(id: string): void {
    this.router.navigate(['/gali-v5/proyecto', id]);
  }

  newProject(): void {
    this.router.navigate(['/gali-v5/proyectos/nuevo']);
  }

  get activeCount(): number {
    return this.proyectos.filter(p => p.estado === 'activo' || p.estado === 'en_escala').length;
  }

  get falloCount(): number {
    return this.proyectos.filter(p => p.estado === 'campaña_fallida').length;
  }

  get totalPedidos(): number {
    return this.proyectos.reduce((sum, p) => sum + (p.pedidos || 0), 0);
  }

  readonly portfolioHealthOpen = signal(false);
  togglePortfolioHealth(): void { this.portfolioHealthOpen.update(v => !v); }

  get portfolioRows(): (Proyecto & { barPct: number; healthColor: string })[] {
    const maxPed = Math.max(...this.proyectos.map(p => p.pedidos), 1);
    const colorMap: Record<ProyectoEstado, string> = {
      en_escala: '#10b981', activo: '#10b981', recien_lanzado: '#f59e0b',
      pausado: '#9ca3af', borrador: '#d1d5db', 'campaña_fallida': '#ef4444',
    };
    return this.proyectos.map(p => ({
      ...p,
      barPct: p.pedidos > 0 ? Math.max(Math.round((p.pedidos / maxPed) * 100), 6) : 0,
      healthColor: colorMap[p.estado] ?? '#9ca3af',
    }));
  }

  get recienLanzadoCount(): number {
    return this.proyectos.filter(p => p.estado === 'recien_lanzado').length;
  }

  readonly showDiagnostico = signal(false);

  openDiagnostico(): void {
    this.showDiagnostico.set(true);
  }

  goToHub(): void {
    this.router.navigate(['/gali-v5']);
  }
}

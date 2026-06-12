import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';

const ESTADO_LABEL: Record<string, string> = {
  en_escala: 'En escala',
  activo: 'Activo',
  pausado: 'Pausado',
  lanzando: 'Lanzando',
  recien_lanzado: 'Recién lanzado',
  cerrado: 'Cerrado',
  borrador: 'Borrador',
};

/** Salud heurística por estado/roas para el portafolio. */
function saludDe(p: any): number {
  if (p.estado === 'en_escala') return 92;
  if (p.estado === 'activo') return 78;
  if (p.estado === 'recien_lanzado' || p.estado === 'lanzando') return 60;
  if (p.estado === 'pausado') return 38;
  if (p.estado === 'borrador') return Number(p.borrador_completado_pct ?? 50);
  if (p.estado === 'cerrado') return 20;
  return 50;
}

@Component({
  selector: 'app-proyectos-casa',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliGlosarioDirective],
  templateUrl: './proyectos-casa.component.html',
  styleUrl: './proyectos-casa.component.scss',
})
export class ProyectosCasaComponent {
  private router = inject(Router);

  readonly objetivoTexto = signal<string>(
    localStorage.getItem('gali-v2-objetivo-texto') ?? 'Automatizar mi operación y escalar a 100 pedidos/semana',
  );
  readonly objetivoMeta = signal<number>(Number(localStorage.getItem('gali-v2-objetivo-meta') ?? 100));
  readonly pedidosActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;
  readonly metaPct = computed(() => Math.min(100, Math.round((this.pedidosActual / this.objetivoMeta()) * 100)));
  readonly metaEstado = computed(() => (this.metaPct() >= 90 ? 'cumplida' : this.metaPct() >= 55 ? 'en_camino' : 'en_riesgo'));

  readonly editOpen = signal(false);
  readonly draftTexto = signal('');
  readonly draftMeta = signal(100);

  readonly proyectos: any[] = (PROJECTS as any[])
    .filter(p => p.id && !['cerrado'].includes(p.estado))
    .map(p => ({
      id: p.id,
      nombre: p.nombre,
      estado: p.estado,
      estadoLabel: ESTADO_LABEL[p.estado] ?? p.estado,
      saludPct: saludDe(p),
      pedidos: p.pedidos_sem_label ?? '—',
      roas: p.roas_real_label ?? '—',
      trend: p.trend ?? 'stable',
    }));

  /** Gali recomienda: proyectos sugeridos para acercarte al objetivo. */
  readonly recomendaciones = [
    {
      titulo: 'Difusor de aromaterapia portátil',
      porque: 'Para tu objetivo de 100 pedidos/sem, ADA Spy detectó tendencia +67% en Bogotá, margen estimado 28% y proveedor con 2.400 uds. Encaja con tu perfil de bienestar.',
      ventana: '10 días',
    },
    {
      titulo: 'Ventana de mercado en Cali',
      porque: 'Búsquedas de "collar mascotas" +34% en Cali. Tu CTR en mascotas es alto; lanzar aquí acercaría ~+12 pedidos/sem a tu meta.',
      ventana: '7 días',
    },
  ];

  estadoLabel(e: string): string {
    return ESTADO_LABEL[e] ?? e;
  }

  abrir(id: string): void {
    this.router.navigate(['/gali-v5-v2/proyecto', id]);
  }

  nuevo(): void {
    this.router.navigate(['/gali-v5-v2/proyectos/nuevo']);
  }

  openEdit(): void {
    this.draftTexto.set(this.objetivoTexto());
    this.draftMeta.set(this.objetivoMeta());
    this.editOpen.set(true);
  }

  saveEdit(): void {
    this.objetivoTexto.set(this.draftTexto());
    this.objetivoMeta.set(this.draftMeta());
    localStorage.setItem('gali-v2-objetivo-texto', this.draftTexto());
    localStorage.setItem('gali-v2-objetivo-meta', String(this.draftMeta()));
    this.editOpen.set(false);
  }
}

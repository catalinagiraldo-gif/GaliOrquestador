import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MOCK_HOY_ESTADO, HoyEstado, AgenteActivo } from '../../../../../mocks/gali-v6/hoy-estado';
import { getObjetivoV2, ObjetivoGeneral } from '../../../../../mocks/gali-v6/objetivo';

/**
 * Snapshot congelado del Home de /gali-6 previo a la reorganización a 2 columnas
 * ("Mis objetivos" como columna fija). No editar salvo que se quiera actualizar
 * intencionalmente el snapshot congelado — ver gali-6-v2.routes.ts.
 */
@Component({
  selector: 'app-gali6-hoy-home-v2-frozen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-hoy-home-v2-frozen.component.html',
  styleUrl: './gali6-hoy-home-v2-frozen.component.scss',
})
export class Gali6HoyHomeV2FrozenComponent {
  readonly router = inject(Router);
  readonly estado: HoyEstado = MOCK_HOY_ESTADO;
  readonly objetivoV2 = signal<ObjetivoGeneral>(getObjetivoV2());
  readonly toastMsg = signal<string | null>(null);
  readonly verAporte = signal(false);
  readonly senalesDismissed = signal<Set<string>>(new Set());

  readonly semanaDeObjetivo = computed(() => {
    const obj = this.objetivoV2();
    const inicio = new Date(obj.fecha_inicio);
    const dias = Math.floor((Date.now() - inicio.getTime()) / 86_400_000);
    const semana = Math.min(obj.plazo_semanas, Math.max(1, Math.ceil(dias / 7)));
    return { semana, total: obj.plazo_semanas };
  });

  readonly senalesVisibles = computed(() => {
    const dismissed = this.senalesDismissed();
    const urgenciaPrio = { critica: 0, media: 1, info: 2 };
    return (this.estado.senalesHoy ?? [])
      .filter(s => !dismissed.has(s.id))
      .sort((a, b) => (urgenciaPrio[a.urgencia ?? 'info'] ?? 2) - (urgenciaPrio[b.urgencia ?? 'info'] ?? 2));
  });

  descartarSenal(id: string): void {
    this.senalesDismissed.update(set => {
      const next = new Set(set);
      next.add(id);
      return next;
    });
  }

  toggleAporte(): void {
    this.verAporte.update(v => !v);
  }

  onAgenteClick(_a: AgenteActivo): void {
    // Nota: comportamiento original preservado tal cual — ya navegaba a /gali-6
    // (no /gali-6-v2) antes de este fork. No modificar (snapshot congelado).
    this.router.navigate(['/gali-6/agentes']);
  }

  irAMiContextoObjetivo(): void {
    this.router.navigate(['/gali-6/mi-negocio/objetivo']);
  }
}

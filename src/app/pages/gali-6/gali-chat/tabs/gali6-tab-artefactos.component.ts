import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gali6ScreenArtifactsService } from '../../services/gali6-screen-artifacts.service';
import { gali6ScreenCatalogConDestino, gali6ScreenLabel, Gali6ScreenOption, GALI6_COVERED_SCREEN_IDS } from '../../models/gali6-screen-catalog';

/**
 * Tab "Artefactos" — Flujo J extendido (18.FlujoUsuarioGali6.md §5.3): lista TODO lo
 * fijado por el usuario desde el chat, sin importar la pantalla. Re-derivada sobre
 * Gali6ScreenArtifactsService.version(), mismo patrón que gali6-tab-senales.
 */
@Component({
  selector: 'gali6-tab-artefactos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-tab-artefactos.component.html',
  styleUrl: './gali6-tab-artefactos.component.scss',
})
export class Gali6TabArtefactosComponent {
  private readonly artifacts = inject(Gali6ScreenArtifactsService);

  // Solo pantallas con cobertura real para reubicar (18.FlujoUsuarioGali6.md §5.9) — un artefacto
  // ya fijado en una pantalla sin cobertura sigue visible aquí, solo no se puede reubicar A ella.
  readonly screenCatalog: Gali6ScreenOption[] = gali6ScreenCatalogConDestino();

  readonly items = computed(() => {
    this.artifacts.version();
    return this.artifacts.todos();
  });

  screenLabel(screenId: string): string {
    return gali6ScreenLabel(screenId);
  }

  sinCobertura(screenId: string): boolean {
    return !GALI6_COVERED_SCREEN_IDS.has(screenId);
  }

  reubicar(id: string, screenId: string): void {
    if (!screenId) return;
    this.artifacts.reubicar(id, screenId);
  }

  eliminar(id: string): void {
    this.artifacts.eliminar(id);
  }
}

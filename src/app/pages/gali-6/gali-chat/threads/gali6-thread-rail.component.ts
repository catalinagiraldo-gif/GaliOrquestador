import { Component, HostBinding, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gali6ThreadsService } from './gali6-threads.service';
import { Gali6ThreadRowComponent } from './gali6-thread-row.component';
import { ChatThread } from '../models/gali6-thread.model';

const RAIL_PINNED_KEY = 'gali6_rail_pinned_v1';

/**
 * Rail de hilos — colapsado (32px, solo dots) / expandido (168px, secciones
 * Fijados/Por proyecto/Por agente/Sin categoría con buscador). Dos
 * disparadores de expansión independientes (ver plan §"Rail"):
 * 1) hover-preview con debounce, transitorio, no empuja layout.
 * 2) pin-open explícito por click, persistente, alcanzable sin mouse.
 * Reemplaza también el dropdown separado del header del panel viejo — una
 * sola superficie para navegar hilos, no dos.
 */
@Component({
  selector: 'gali6-thread-rail',
  standalone: true,
  imports: [CommonModule, FormsModule, Gali6ThreadRowComponent],
  templateUrl: './gali6-thread-rail.component.html',
  styleUrl: './gali6-thread-rail.component.scss',
})
export class Gali6ThreadRailComponent {
  readonly threadsSvc = inject(Gali6ThreadsService);

  readonly railPinnedOpen = signal(this.loadRailPinned());
  readonly isHovering = signal(false);
  readonly isSearchFocused = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly search = signal('');

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  readonly expanded = computed(
    () => this.railPinnedOpen() || this.isHovering() || this.isSearchFocused() || this.editingId() !== null,
  );

  /** true = expandido solo por hover/foco (transitorio) → overlay, no empuja el layout del hilo de mensajes. */
  readonly isOverlay = computed(() => this.expanded() && !this.railPinnedOpen());

  /** El host siempre reserva 32px salvo que el rail esté fijado abierto — así el overlay no desplaza nada. */
  @HostBinding('style.width.px')
  get hostWidth(): number {
    return this.railPinnedOpen() ? 168 : 32;
  }

  private matchesSearch(t: ChatThread): boolean {
    const q = this.search().toLowerCase().trim();
    return !q || t.title.toLowerCase().includes(q);
  }

  readonly filteredPinned = computed(() => this.threadsSvc.pinned().filter(t => this.matchesSearch(t)));
  readonly filteredProjects = computed(() => this.threadsSvc.byProject().filter(t => this.matchesSearch(t)));
  readonly filteredAgents = computed(() => this.threadsSvc.byAgent().filter(t => this.matchesSearch(t)));
  readonly filteredUnfiled = computed(() => this.threadsSvc.unfiled().filter(t => this.matchesSearch(t)));

  onMouseEnter(): void {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    // Debounce de entrada: evita expandir si el mouse solo pasa de largo.
    this.hoverTimer = setTimeout(() => this.isHovering.set(true), 150);
  }

  onMouseLeave(): void {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    // Margen de salida: permite movimiento diagonal hacia el contenido del rail sin colapsar antes de tiempo.
    this.hoverTimer = setTimeout(() => this.isHovering.set(false), 300);
  }

  toggleRailPinned(): void {
    const next = !this.railPinnedOpen();
    this.railPinnedOpen.set(next);
    try {
      localStorage.setItem(RAIL_PINNED_KEY, String(next));
    } catch {
      /* localStorage no disponible — la preferencia solo vive en esta sesión */
    }
  }

  private loadRailPinned(): boolean {
    try {
      return localStorage.getItem(RAIL_PINNED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  switchThread(id: string): void {
    this.threadsSvc.switchTo(id);
  }

  togglePin(id: string): void {
    this.threadsSvc.togglePin(id);
  }

  startEdit(id: string): void {
    this.editingId.set(id);
  }

  commitRename(id: string, title: string): void {
    this.threadsSvc.renameThread(id, title);
    this.editingId.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  archiveThread(id: string): void {
    this.threadsSvc.archive(id);
  }

  createThread(): void {
    this.threadsSvc.create('libre');
  }
}

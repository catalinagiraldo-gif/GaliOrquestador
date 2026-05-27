import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PrototypeEntry {
  ticket: string;
  title: string;
  module: string;
  route: string;
  status: 'draft' | 'review' | 'approved';
  components: string[];
}

interface VistaShortcut {
  label: string;
  route: string;
  badge: string;
  description: string;
}

@Component({
  selector: 'app-prototype-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="gallery">
      <div class="gallery__header">
        <h2>Prototype Gallery</h2>
        <p class="gallery__subtitle">
          La versión actual del prototipo es <strong>Gali V4</strong>. Las versiones anteriores quedan archivadas abajo.
        </p>
      </div>

      <!-- VERSIÓN ACTUAL: única card destacada -->
      <article class="featured" routerLink="/gali-v4">
        <header class="featured__head">
          <span class="featured__tag">
            <span aria-hidden="true">✦</span> Versión actual · Gali V4
          </span>
          <span class="featured__status" data-status="active">activo</span>
        </header>

        <h3 class="featured__title">
          Gali V4 — <em>Orquestador AI-first</em> sobre Dropi
        </h3>

        <p class="featured__lead">
          Re-arquitectura AI-first sobre V3 vivo. Shell con right panel colapsable estilo Cursor (⌘J),
          Constructor de bloques con chat + preview en vivo, 8 vistas nuevas/evolucionadas con heurísticas
          Nielsen aplicadas (H#11 razonamiento expandible · H#13 confianza con color · H#5 prevención).
        </p>

        <!-- Atajos directos a cada vista clave dentro de V4 -->
        <div class="featured__vistas">
          <strong class="featured__vistas-label">Vistas de V4</strong>
          <div class="featured__vistas-grid">
            <a *ngFor="let v of vistasV4" [routerLink]="v.route" class="featured__vista" (click)="$event.stopPropagation()">
              <span class="featured__vista-badge">{{ v.badge }}</span>
              <strong>{{ v.label }}</strong>
              <span class="featured__vista-desc">{{ v.description }}</span>
            </a>
          </div>
        </div>

        <!-- Capabilities del shell -->
        <div class="featured__features">
          <strong class="featured__features-label">Capacidades del shell V4</strong>
          <ul>
            <li *ngFor="let cap of shellV4">{{ cap }}</li>
          </ul>
        </div>

        <footer class="featured__foot">
          <a routerLink="/gali-v4" class="featured__cta">
            <span aria-hidden="true">✦</span> Abrir Gali V4
            <span aria-hidden="true">→</span>
          </a>
          <span class="featured__kbd" aria-hidden="true">o usa ⌘K dentro</span>
        </footer>
      </article>

      <!-- VERSIONES ANTERIORES — colapsables, no en el grid principal -->
      <details class="legacy" [open]="legacyOpen()">
        <summary (click)="toggleLegacy($event)">
          <span class="legacy__chevron" aria-hidden="true">{{ legacyOpen() ? '▾' : '▸' }}</span>
          <strong>Versiones anteriores</strong>
          <span class="legacy__count">{{ legacy.length }} archivadas</span>
        </summary>
        <div class="legacy__grid">
          <a
            *ngFor="let proto of legacy"
            [routerLink]="proto.route"
            class="gallery__card gallery__card--legacy">
            <div class="gallery__card-header">
              <span class="gallery__ticket">{{ proto.ticket }}</span>
              <span class="gallery__status" data-status="archived">archivada</span>
            </div>
            <h3 class="gallery__card-title">{{ proto.title }}</h3>
            <div class="gallery__module">{{ proto.module }}</div>
            <div class="gallery__components">
              <span *ngFor="let comp of proto.components" class="gallery__component-tag">
                {{ comp }}
              </span>
            </div>
          </a>
        </div>
      </details>
    </div>
  `,
  styleUrl: './prototype-gallery.component.scss',
})
export class PrototypeGalleryComponent {
  legacyOpen = signal(false);

  toggleLegacy(ev: Event) {
    ev.preventDefault();
    this.legacyOpen.update(v => !v);
  }

  vistasV4: VistaShortcut[] = [
    {
      label: 'Inicio',
      route: '/gali-v4',
      badge: '✦',
      description: 'Welcome memory-aware · Bloques de Gali · Atajos',
    },
    {
      label: 'Constructor de bloques',
      route: '/gali-v4/bloque-builder',
      badge: 'V8',
      description: 'Chat + preview en vivo · 5 ejemplos · Confianza con color',
    },
    {
      label: 'Mi Objetivo → Roadmap',
      route: '/gali-v4/objetivo',
      badge: 'V5',
      description: 'Roadmap 4 semanas · Razonamiento expandible',
    },
    {
      label: 'Comunidad en Vivo',
      route: '/gali-v4/comunidad',
      badge: 'V3',
      description: 'Líder Virtual · 10 señales · top 10% · alertas',
    },
    {
      label: 'Mi Stack personal',
      route: '/gali-v4/mi-stack',
      badge: 'V4',
      description: '15 apps · intelligence score · OAuth mock',
    },
    {
      label: 'Builder de flows',
      route: '/gali-v4/builder',
      badge: 'V6',
      description: 'Recipes Make-style · ejecución live · catálogo',
    },
    {
      label: 'Mercado',
      route: '/gali-v4/mercado',
      badge: 'V7',
      description: '12 plantillas · 8 agentes · 6 conexiones',
    },
    {
      label: 'Mapa del negocio',
      route: '/gali-v4/mapa',
      badge: '⌘M',
      description: '21 nodos · 6 zonas · grafo navegable',
    },
  ];

  shellV4: string[] = [
    'Right panel colapsable estilo Cursor (⌘J) — chat de Gali + Negocio en vivo + Mis bloques',
    'Sidebar navigator con secciones Mi negocio · Proyectos · Mercado · Builder · Constructor',
    'Command Palette ⌘K — fuzzy search global incl. bloques guardados',
    'Memoria viva con chips editables (H#14) · persistida en localStorage',
    'Heurísticas AI-first H#11 (transparencia) + H#13 (confianza color) en vistas nuevas',
    'Slash commands en chat: /proyecto-nuevo /automatiza /vista /bloque-nuevo /recuerda',
  ];

  // Versiones anteriores — accesibles para referencia, archivadas
  legacy: PrototypeEntry[] = [
    {
      ticket: 'GALI-V2',
      title: 'Gali v2 — Prototipo disruptivo y adaptativo',
      module: 'Lienzo + Maestría + Memoria viva + Onboarding embebido + Novedades Triage',
      route: '/gali-v2',
      status: 'draft',
      components: [
        'Lienzo (4 zonas)',
        'Header IA 2',
        'Response Overlay',
        'Playground Maestría',
        'Proyectos',
        'Memory Inspector',
        'Onboarding 3 preguntas',
        'Novedades Triage',
      ],
    },
    {
      ticket: 'AI-FIRST',
      title: 'Gali — Workspace AI-First original',
      module: 'Dashboard + Onboarding + 4 modos del flujo',
      route: '/gali',
      status: 'review',
      components: [
        'Onboarding',
        'Dashboard',
        'Descubrimiento',
        'Estrategia',
        'Creación',
        'Lanzamiento',
      ],
    },
  ];
}

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
          <strong>Gali V5 v2 · La Casita</strong> es el norte minimalista (Objetivo → Proyectos → Conexiones).
          <strong>Gali V5</strong> queda intacta abajo como referencia.
        </p>
      </div>

      <!-- VERSIÓN DEFINITIVA: Gali 6 — La Casita -->
      <article class="featured" routerLink="/gali-6">
        <header class="featured__head">
          <span class="featured__tag">
            <span aria-hidden="true">✦</span> Gali 6 · La Casita
          </span>
          <span class="featured__status" data-status="active">versión definitiva</span>
        </header>

        <h3 class="featured__title">
          El Director de E-commerce que <em>el dropshipper nunca pudo pagar</em>
        </h3>

        <p class="featured__lead">
          IA consolidada: Señales es su propio centro de notificaciones, y Centro de Gali
          unifica Agentes, Reglas (con Automatizaciones adentro), Conexiones (con
          "Lo que Gali hizo") y Marketplace en un solo hub con tabs. Raíz plana —
          Hoy · Señales · Proyectos — más Centro de Gali en modo experto.
        </p>

        <div class="featured__vistas">
          <strong class="featured__vistas-label">La Casita</strong>
          <div class="featured__vistas-grid">
            <a *ngFor="let v of vistasG6" [routerLink]="v.route" class="featured__vista" (click)="$event.stopPropagation()">
              <span class="featured__vista-badge">{{ v.badge }}</span>
              <strong>{{ v.label }}</strong>
              <span class="featured__vista-desc">{{ v.description }}</span>
            </a>
          </div>
        </div>

        <footer class="featured__foot">
          <a routerLink="/gali-6-v1" class="featured__cta featured__cta--secondary" (click)="$event.stopPropagation()">
            Gali 6 V1 →
          </a>
          <a routerLink="/gali-6-v2" class="featured__cta featured__cta--secondary" (click)="$event.stopPropagation()">
            Gali 6 V2 →
          </a>
          <a routerLink="/gali-6" class="featured__cta" (click)="$event.stopPropagation()">
            <span aria-hidden="true">✦</span> Gali 6 V3
            <span aria-hidden="true">→</span>
          </a>
          <span class="featured__kbd">Señales independiente · Centro de Gali unificado</span>
        </footer>
      </article>

      <!-- Gali 5 (V5 + V5v2) — archivada como versión anterior inmediata -->
      <details class="legacy legacy--v5" [open]="v5Open()">
        <summary (click)="toggleV5($event)">
          <span class="legacy__chevron" aria-hidden="true">{{ v5Open() ? '▾' : '▸' }}</span>
          <strong>Gali 5 — versión anterior</strong>
          <span class="legacy__count">{{ vistasV5v2.length }} vistas</span>
        </summary>
        <article class="featured featured--compact" routerLink="/gali-5">
          <p class="featured__lead featured__lead--compact">
            Gali V5 tiene 38 rutas operativas completas. Gali V5 v2 ("La Casita v1") es el
            prototipo de validación del concepto casita del que nació Gali 6.
          </p>
          <div class="featured__vistas-grid">
            <a *ngFor="let v of vistasV5v2" [routerLink]="v.route" class="featured__vista" (click)="$event.stopPropagation()">
              <span class="featured__vista-badge">{{ v.badge }}</span>
              <strong>{{ v.label }}</strong>
            </a>
          </div>
          <footer class="featured__foot">
            <a routerLink="/gali-5" class="featured__cta featured__cta--secondary">
              Abrir Gali 5 → V5 shell
            </a>
            <a routerLink="/gali-v5-v2" class="featured__cta featured__cta--secondary" (click)="$event.stopPropagation()">
              Abrir La Casita v1 →
            </a>
          </footer>
        </article>
      </details>

      <!-- VERSIÓN ACTUAL: Gali V5 — Dropi baseline -->
      <article class="featured" routerLink="/gali-v5">
        <header class="featured__head">
          <span class="featured__tag">
            <span aria-hidden="true">◆</span> Gali V5 · Fase 0
          </span>
          <span class="featured__status" data-status="active">baseline</span>
        </header>

        <h3 class="featured__title">
          Dropi actual — <em>sin Gali</em>
        </h3>

        <p class="featured__lead">
          Recreación del shell oficial (Header IA 2 + rail de iconos 56px + FAB) y la primera
          pantalla de cada sección según Figma Re-arquitectura UI Oficial. Base limpia antes de
          diseñar Gali V5 encima.
        </p>

        <div class="featured__vistas">
          <strong class="featured__vistas-label">Secciones Dropi</strong>
          <div class="featured__vistas-grid">
            <a *ngFor="let v of vistasV5" [routerLink]="v.route" class="featured__vista" (click)="$event.stopPropagation()">
              <span class="featured__vista-badge">{{ v.badge }}</span>
              <strong>{{ v.label }}</strong>
              <span class="featured__vista-desc">{{ v.description }}</span>
            </a>
          </div>
        </div>

        <div class="featured__features">
          <strong class="featured__features-label">Shell Dropi baseline</strong>
          <ul>
            <li *ngFor="let cap of shellV5">{{ cap }}</li>
          </ul>
        </div>

        <footer class="featured__foot">
          <a routerLink="/gali-v5" class="featured__cta">
            <span aria-hidden="true">◆</span> Abrir Dropi baseline
            <span aria-hidden="true">→</span>
          </a>
          <span class="featured__kbd">Figma · Secciones Dropi</span>
        </footer>
      </article>

      <!-- Gali V4 — archivada como versión anterior inmediata -->
      <details class="legacy legacy--v4" [open]="v4Open()">
        <summary (click)="toggleV4($event)">
          <span class="legacy__chevron" aria-hidden="true">{{ v4Open() ? '▾' : '▸' }}</span>
          <strong>Gali V4 — versión anterior</strong>
          <span class="legacy__count">8 vistas</span>
        </summary>
        <article class="featured featured--compact" routerLink="/gali-v4">
          <p class="featured__lead featured__lead--compact">
            Orquestador AI-first sobre V3. Shell con right panel colapsable, Constructor de bloques,
            8 vistas con heurísticas Nielsen.
          </p>
          <div class="featured__vistas-grid">
            <a *ngFor="let v of vistasV4" [routerLink]="v.route" class="featured__vista" (click)="$event.stopPropagation()">
              <span class="featured__vista-badge">{{ v.badge }}</span>
              <strong>{{ v.label }}</strong>
            </a>
          </div>
          <footer class="featured__foot">
            <a routerLink="/gali-v4" class="featured__cta featured__cta--secondary">
              Abrir Gali V4 →
            </a>
          </footer>
        </article>
      </details>

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
  v4Open = signal(false);
  v5Open = signal(false);

  toggleLegacy(ev: Event) {
    ev.preventDefault();
    this.legacyOpen.update(v => !v);
  }

  toggleV4(ev: Event) {
    ev.preventDefault();
    this.v4Open.update(v => !v);
  }

  toggleV5(ev: Event) {
    ev.preventDefault();
    this.v5Open.update(v => !v);
  }

  vistasG6: VistaShortcut[] = [
    { label: 'Hoy', route: '/gali-6', badge: '✦', description: 'Briefing · 1 decisión · impacto · palanca' },
    { label: 'Señales', route: '/gali-6/senales', badge: '◈', description: 'Centro de notificaciones · alertas y tareas en curso' },
    { label: 'Proyectos', route: '/gali-6/proyectos', badge: '◎', description: 'Objetivo editable · salud · Gali recomienda' },
    { label: 'Centro de Gali · Agentes', route: '/gali-6/agentes', badge: '⬡', description: 'Hub con tabs: Agentes · Reglas +Automatizaciones · Conexiones +Lo que Gali hizo · Marketplace' },
    { label: 'Mi Contexto', route: '/gali-6/mi-negocio', badge: '◇', description: 'Objetivo y documentación del negocio · ahora dentro de Centro de Gali' },
    { label: 'Wallet', route: '/gali-6/financiero/historial-de-cartera', badge: '◆', description: 'Kronos · ledger financiero' },
  ];

  vistasV5v2: VistaShortcut[] = [
    { label: 'Hoy (v5-v2)', route: '/gali-v5-v2', badge: '✦', description: 'Briefing · 1 decisión · impacto · palanca' },
    { label: 'Proyectos', route: '/gali-v5-v2/proyectos', badge: '◎', description: 'Objetivo editable · salud · Gali recomienda' },
    { label: 'Conexiones', route: '/gali-v5-v2/conexiones', badge: '⬡', description: '5 MCP core · qué contexto da a Gali' },
    { label: 'Impacto', route: '/gali-v5-v2/impacto', badge: '↗', description: 'Ledger · $ ahorrados · acciones · horas' },
    { label: 'V5 baseline', route: '/gali-5', badge: '◆', description: 'Gali V5 · 38 rutas operativas' },
  ];

  vistasV5: VistaShortcut[] = [
    { label: 'Inicio', route: '/gali-v5', badge: '✓', description: 'Home · saludo · proveedores · banner Colombia' },
    { label: 'Catálogo', route: '/gali-v5/productos/catalogo', badge: '✓', description: 'Búsqueda IA · filtros · grid productos' },
    { label: 'Proveedores', route: '/gali-v5/productos/proveedores', badge: '✓', description: 'Grid de tarjetas · filtros · favoritos' },
    { label: 'Negociaciones', route: '/gali-v5/productos/negociaciones', badge: '✓', description: 'Tabs · tarjetas de negociación · acciones' },
    { label: 'Cazaproductos', route: '/gali-v5/productos/caza-productos', badge: '✓', description: 'Publicaciones · grid 216px · filtros' },
    { label: 'Ordenes', route: '/gali-v5/mis-pedidos/mis-pedidos', badge: '✓', description: 'Tabla Figma · dirección · acciones sticky' },
    { label: 'Transportadoras', route: '/gali-v5/logistica/transportadoras', badge: '✓', description: 'Preferencias · ranking · matriz ciudades' },
    { label: 'Dashboard reportes', route: '/gali-v5/reportes/dashboard', badge: '✓', description: 'Reportes · tabla dashboard' },
    { label: 'Historial wallet', route: '/gali-v5/financiero/historial-de-cartera', badge: '✓', description: 'Wallet · ledger' },
    { label: 'Marketing', route: '/gali-v5/marketing/campanas', badge: '…', description: 'Pendiente · Campañas masivas' },
    { label: 'CAS', route: '/gali-v5/cas/bandeja', badge: '✓', description: 'Bandeja de soporte' },
    { label: 'Academy', route: '/gali-v5/academy', badge: '✓', description: 'Capacitaciones Dropi' },
  ];

  shellV5: string[] = [
    'Header IA 2 — logo dropi · toggle BETA · wallet con ojo · avatar',
    'Rail 56px — Home · Productos · Pedidos · Logística · Reportes · Financiero · Card · Marketing',
    'Dashboard en Reportes (no rail) · Garantías dentro de Pedidos · Carritos fuera del nav',
    'Menu-action flotante — huella · torre · chat',
    'Páginas dedicadas: Ordenes, Caza, Garantías, Transportadoras, Torre, Dashboard reportes',
  ];

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
      ticket: 'GALI-V4',
      title: 'Gali V4 — Orquestador AI-first sobre Dropi',
      module: 'Right panel · Bloque builder · 8 vistas Nielsen',
      route: '/gali-v4',
      status: 'review',
      components: ['Inicio', 'Bloque builder', 'Objetivo', 'Comunidad', 'Mi Stack', 'Builder', 'Mercado', 'Mapa'],
    },
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

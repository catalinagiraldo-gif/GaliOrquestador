import { AfterViewInit, Component, HostListener, OnDestroy, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';
import { Gali6IconRailComponent } from './gali-6-icon-rail.component';
import { Gali6FabComponent } from './components/gali6-fab.component';
import { DropiSectionNavComponent } from '../gali-5/gali-v5/components/dropi-section-nav.component';
import { DropiPanelSplitterComponent } from '../gali-5/gali-v5/components/dropi-panel-splitter/dropi-panel-splitter.component';
import { GaliRightPanelComponent } from '../gali-5/gali-v5/components/gali-right-panel/gali-right-panel.component';
import { GaliStateService } from '../gali-5/gali-v5/services/gali-state.service';
import { Gali6ChatPanelComponent } from './gali-chat/gali6-chat-panel.component';
import { Gali6ChatService } from './gali-chat/gali6-chat.service';
import { Gali6HighlightService } from './services/gali6-highlight.service';
import { SectionPanel } from '../gali-5/gali-v5/dropi-sections.config';
import { resolveG6SectionPanel, GALI_6_MISSION_PANEL } from './gali-6-sections.config';
import KPIS from '../../../../mocks/gali-v5/kpis-global.json';
import { MOCK_ALERTAS, MOCK_SENALES } from '../../../../mocks/gali-v5/senales.mock';

type Friccion = 'stock' | 'ads' | 'pedidos' | 'otro';
type Canal = 'meta' | 'tiktok' | 'ambos' | 'ninguno';

/**
 * Gali 6 — "La Casita definitiva".
 * Chrome idéntico a V5 v2: icon-rail 72px + section-nav agrupado + chat lateral.
 * Rutas propias /gali-6.
 */
@Component({
  selector: 'app-gali6-shell',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterOutlet,
    RouterModule,
    A11yModule,
    Gali6IconRailComponent,
    Gali6FabComponent,
    DropiSectionNavComponent,
    DropiPanelSplitterComponent,
    GaliRightPanelComponent,
    Gali6ChatPanelComponent,
  ],
  templateUrl: './gali-6-shell.component.html',
  styleUrl: './gali-6-shell.component.scss',
})
export class Gali6ShellComponent implements AfterViewInit, OnDestroy {
  readonly router = inject(Router);
  readonly gali = inject(GaliStateService);
  private readonly highlight = inject(Gali6HighlightService);

  readonly navOpen = signal(false);
  readonly walletHidden = signal(false);
  readonly currentUrl = signal(this.router.url);

  // ── Chat dock (solo /gali-6, no v1/v2 — ver plan) ──
  readonly isGaliSixCurrent = computed(() => {
    const u = this.currentUrl();
    return u === '/gali-6' || u.startsWith('/gali-6/');
  });
  readonly viewportWidth = signal(window.innerWidth);
  readonly isMobileViewport = computed(() => this.viewportWidth() < 1024);
  readonly galiDockCollapsed = signal(
    localStorage.getItem('gali-6-dock-collapsed') != null
      ? localStorage.getItem('gali-6-dock-collapsed') === 'true'
      : window.innerWidth < 1024,
  );
  readonly dockBackdropOpen = computed(() =>
    this.isGaliSixCurrent() && this.isMobileViewport() && !this.galiDockCollapsed()
  );
  readonly dockMaxWidth = computed(() => Math.floor(this.viewportWidth() * 0.78));
  readonly galiDockSide = signal<'left' | 'right'>(
    (localStorage.getItem('gali-6-dock-side') as 'left' | 'right') ?? 'right',
  );

  @HostListener('window:resize')
  onWindowResize(): void {
    this.viewportWidth.set(window.innerWidth);
  }

  toggleDock(): void {
    const next = !this.galiDockCollapsed();
    this.galiDockCollapsed.set(next);
    localStorage.setItem('gali-6-dock-collapsed', String(next));
  }

  toggleDockSide(): void {
    const next = this.galiDockSide() === 'left' ? 'right' : 'left';
    this.galiDockSide.set(next);
    localStorage.setItem('gali-6-dock-side', next);
  }

  onBackdropClick(): void {
    this.navOpen.set(false);
    if (this.dockBackdropOpen()) {
      this.toggleDock();
    }
  }

  readonly isOnProveedores = computed(() =>
    this.currentUrl().includes('/gali-6/productos/proveedores')
  );
  readonly isOnSenales = computed(() =>
    this.currentUrl().includes('/gali-6/senales')
  );
  readonly isOnCaza = computed(() =>
    this.currentUrl().includes('/gali-6/productos/caza-productos')
  );
  readonly isOnNego = computed(() =>
    this.currentUrl().includes('/gali-6/productos/negociaciones')
  );

  readonly sectionPanel = signal<SectionPanel>(GALI_6_MISSION_PANEL);
  readonly hasSectionPanel = signal(true);
  readonly sectionCollapsed = signal(localStorage.getItem('gali-6-section-collapsed') === 'true');

  readonly filteredPanel = computed<SectionPanel>(() => this.sectionPanel());

  readonly objetivoMeta = signal<number>(Number(localStorage.getItem('gali-6-objetivo-meta') ?? 100));
  readonly objetivoActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;
  readonly objetivoPct = computed(() =>
    Math.min(100, Math.round((this.objetivoActual / this.objetivoMeta()) * 100)),
  );
  readonly walletLabel = '$2.717.360';
  readonly alertaTopSenales = MOCK_ALERTAS.find(a => a.tipo === 'critical' || a.tipo === 'warning');
  readonly alertasCriticasCount = MOCK_ALERTAS.filter(a => a.tipo === 'critical' || a.tipo === 'warning').length;
  readonly alertCount = MOCK_ALERTAS.filter(a => a.tipo === 'critical').length;

  // Lista priorizada para el mini-panel: alertas críticas → warning → señales urgentes
  readonly senalesPanelItems = [
    ...MOCK_ALERTAS
      .filter(a => a.tipo === 'critical' || a.tipo === 'warning')
      .sort((a, b) => (a.tipo === 'critical' ? 0 : 1) - (b.tipo === 'critical' ? 0 : 1))
      .map(a => ({
        id: a.id,
        titulo: a.titulo,
        agente: a.agente ?? a.agenteOrigenNombre ?? '',
        tipo: a.tipo as string,
        categoria: 'alerta' as 'alerta' | 'senal',
        dias: null as number | null,
      })),
    ...MOCK_SENALES
      .filter(s => s.tipo !== 'completed')
      .sort((a, b) => a.ventanaDias - b.ventanaDias)
      .slice(0, 2)
      .map(s => ({
        id: s.id,
        titulo: s.titulo,
        agente: s.agenteOrigenNombre ?? s.agente ?? '',
        tipo: s.tipo as string,
        categoria: 'senal' as 'alerta' | 'senal',
        dias: s.ventanaDias,
      })),
  ].slice(0, 5);
  readonly galiIsActing = signal(false);

  /**
   * `evt` viene del panel nuevo (gali6-chat-panel, payload dirigido) cuando
   * una mutación real cambió algo en pantalla. El overlay legado (gali-5,
   * /gali-6-v1 y /gali-6-v2) sigue llamando esto sin argumento — el halo
   * genérico se conserva como fallback mínimo en ambos casos (ver §3.2 del plan).
   */
  onGaliActing(evt?: { targetId: string; kind: 'mutate' | 'navigate' }): void {
    this.galiIsActing.set(true);
    setTimeout(() => this.galiIsActing.set(false), 1500);
    if (evt?.kind === 'mutate') {
      this.highlight.trigger({ targetId: evt.targetId, variant: 'success' });
    }
  }

  readonly catalogPanelPctDespues = computed(() =>
    Math.min(100, this.objetivoPct() + 18)
  );
  readonly proveedoresPanelPctDespues = computed(() =>
    Math.min(100, this.objetivoPct() + 14)
  );

  // ── ZeroState (onboarding de 3 preguntas) ──
  private readonly hasOrders = ((KPIS as any).pedidos_sem_total?.valor ?? 0) > 0;
  readonly zeroOpen = signal(
    !localStorage.getItem('gali-6-onboarding-done') &&
    !localStorage.getItem('gali-6-objetivo-meta') &&
    !localStorage.getItem('gali-6-objetivo-v2'),
  );
  readonly zeroStep = signal(0);
  readonly zeroPedidos = signal(100);
  readonly zeroFriccion = signal<Friccion | null>(null);
  readonly zeroCanal = signal<Canal | null>(null);
  readonly zeroRespuesta = signal('');

  readonly fricciones: Array<{ id: Friccion; label: string }> = [
    { id: 'stock', label: 'Stock / proveedor' },
    { id: 'ads', label: 'Pauta y creativos' },
    { id: 'pedidos', label: 'Gestión de pedidos' },
    { id: 'otro', label: 'Otro' },
  ];
  readonly canales: Array<{ id: Canal; label: string }> = [
    { id: 'meta', label: 'Meta Ads' },
    { id: 'tiktok', label: 'TikTok Ads' },
    { id: 'ambos', label: 'Ambos' },
    { id: 'ninguno', label: 'Ninguno aún' },
  ];

  private route = inject(ActivatedRoute);
  private readonly gali6Chat = inject(Gali6ChatService);
  private lastFocusRequest = 0;

  // ── Spot "Nuevo en Gali" — resucita la card .experto-slide (antes CSS huérfano de un
  // "modo experto" que nunca se cableó) para enseñar crear/editar hablando y fijar artefactos,
  // mostrado una sola vez en la primera apertura real del dock tras el ZeroState. ──
  readonly nuevoEnGaliOpen = signal(false);
  private nuevoEnGaliYaEvaluado = false;
  readonly NUEVO_EN_GALI_EJEMPLO = 'crea una regla que me avise si un producto cae en stock';

  nuevoEnGaliProbar(): void {
    this.nuevoEnGaliOpen.set(false);
    localStorage.setItem('gali-6-nuevo-en-gali-done', 'true');
    this.gali6Chat.precargarEjemplo(this.NUEVO_EN_GALI_EJEMPLO);
  }

  nuevoEnGaliCerrar(): void {
    this.nuevoEnGaliOpen.set(false);
    localStorage.setItem('gali-6-nuevo-en-gali-done', 'true');
  }

  constructor() {
    // Botón "+ Crear con Gali" / "Editar con Gali" desde Agentes/Reglas/Skills (Flujo K) — abre el dock si estaba cerrado.
    // allowSignalWrites: NG0600 — este efecto escribe galiDockCollapsed, que no lee, así que no hay ciclo.
    effect(() => {
      const n = this.gali6Chat.focusRequest();
      if (n > this.lastFocusRequest) {
        this.lastFocusRequest = n;
        this.galiDockCollapsed.set(false);
      }
    }, { allowSignalWrites: true });

    // Primera apertura real del dock esta sesión, después de completar el ZeroState — nunca compite con él.
    effect(() => {
      const dockAbierto = !this.galiDockCollapsed();
      if (!dockAbierto || this.zeroOpen() || this.nuevoEnGaliYaEvaluado) return;
      this.nuevoEnGaliYaEvaluado = true;
      if (!localStorage.getItem('gali-6-nuevo-en-gali-done')) {
        this.nuevoEnGaliOpen.set(true);
      }
    }, { allowSignalWrites: true });

    // Detectar ?zero=1 para resetear onboarding (Punto Cero desde galería)
    this.route.queryParams.subscribe(params => {
      if (params['zero'] === '1') {
        localStorage.removeItem('gali-6-onboarding-done');
        localStorage.removeItem('gali-6-objetivo-meta');
        localStorage.removeItem('gali-6-objetivo-v2');
        this.zeroOpen.set(true);
        this.zeroStep.set(0);
        this.zeroPedidos.set(100);
        this.zeroFriccion.set(null);
        this.zeroCanal.set(null);
      }
    });

    this.syncNav(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.warnIfOrphanRedirect(e.url, e.urlAfterRedirects);
        this.syncNav(e.urlAfterRedirects);
      });
    // Si ya tiene pedidos en Dropi, saltar P1 directamente al paso 1
    if (this.zeroOpen() && this.hasOrders) {
      this.zeroPedidos.set(this.hasOrders ? this.objetivoActual + 30 : 100);
      this.zeroStep.set(1);
    }
  }

  /**
   * Defensa en profundidad del wildcard `{ path: '**', redirectTo: '' }` de
   * gali-6.routes.ts (PlanChat.md §B2). Un `canActivate` puesto directamente
   * en esa entrada nunca corre — Angular resuelve `redirectTo` en la fase de
   * "recognize", antes de evaluar guards, así que el guard solo vería el
   * destino ya redirigido. Comparar `NavigationEnd.url` (lo pedido) contra
   * `urlAfterRedirects` (a dónde aterrizó) es el punto real donde se puede
   * detectar un aterrizaje silencioso en Home — el bug "Loy"/"Hoy" que
   * reportó Catalina. Solo loggea en dev; no bloquea la navegación.
   */
  private warnIfOrphanRedirect(requestedUrl: string, finalUrl: string): void {
    const HOME_EXACT = new Set(['/gali-6', '/gali-6/']);
    const requestedPath = requestedUrl.split('?')[0];
    const finalPath = finalUrl.split('?')[0];
    if (requestedUrl === finalUrl) return;
    if (!HOME_EXACT.has(finalPath)) return;
    if (HOME_EXACT.has(requestedPath)) return;
    if (!isDevMode()) return;
    console.warn(
      `[gali-6] Ruta huérfana: "${requestedUrl}" no está registrada en gali-6.routes.ts y cayó ` +
      `al wildcard, aterrizando en Home ("${finalUrl}") en vez de mostrar un error. ` +
      `Si es una pantalla real, regístrala en gali-6.routes.ts (ver PlanChat.md §B1).`,
    );
  }

  private syncNav(url: string): void {
    this.currentUrl.set(url);
    const panel = resolveG6SectionPanel(url);
    if (panel) {
      this.sectionPanel.set(panel);
      this.hasSectionPanel.set(true);
    } else {
      this.hasSectionPanel.set(false);
    }
    this.navOpen.set(false);
    // Cerrar paneles contextuales al salir de sus rutas
    if (!url.includes('/gali-6/productos/proveedores')) {
      this.gali.closeProveedoresPanel();
    }
    if (!url.includes('/gali-6/senales')) {
      this.gali.closeSenalesPanel();
    }
    if (!url.includes('/gali-6/productos/caza-productos')) {
      this.gali.closeCazaPanel();
    }
    if (!url.includes('/gali-6/productos/negociaciones')) {
      this.gali.closeNegoPanel();
    }
  }

  toggleSection(): void {
    const next = !this.sectionCollapsed();
    this.sectionCollapsed.set(next);
    localStorage.setItem('gali-6-section-collapsed', String(next));
  }

  toggleNav(): void {
    this.navOpen.update(v => !v);
  }

  panelMaxWidth(): number {
    return Math.floor(window.innerWidth * 0.78);
  }

  // ── ZeroState handlers ──
  zeroNext(): void {
    if (this.zeroStep() < 2) {
      this.zeroStep.update(s => s + 1);
    } else {
      this.zeroComplete();
    }
  }

  zeroComplete(): void {
    localStorage.setItem('gali-6-objetivo-meta', String(this.zeroPedidos()));
    localStorage.setItem('gali-6-onboarding-done', 'true');
    this.objetivoMeta.set(this.zeroPedidos());
    this.zeroRespuesta.set(this.buildZeroRespuesta());
    this.zeroStep.set(3); // paso de confirmación
  }

  zeroClose(): void {
    localStorage.setItem('gali-6-onboarding-done', 'true');
    this.zeroOpen.set(false);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      if (this.zeroOpen()) { this.zeroClose(); return; }
      if (this.navOpen()) { this.navOpen.set(false); return; }
    }
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      this.reopenOnboarding();
    }
  }

  irAProyectos(): void {
    this.gali.closeCatalogPanel();
    this.router.navigate(['/gali-6/proyectos'], { queryParams: { autoNuevo: 'true' } });
  }

  irAProyectosLista(): void {
    this.gali.closeCatalogPanel();
    this.router.navigate(['/gali-6/proyectos']);
  }

  irANegociaciones(): void {
    this.gali.closeProveedoresPanel();
    this.router.navigate(['/gali-6/proyectos'], { queryParams: { autoNuevo: 'true' } });
  }

  irACazaDesdeProveedores(): void {
    this.gali.closeProveedoresPanel();
    this.router.navigate(['/gali-6/productos/caza-productos']);
  }

  irAHomeDesdeSenales(): void {
    this.gali.closeSenalesPanel();
    this.router.navigate(['/gali-6']);
  }

  irADecisionDirecta(alertaId: string): void {
    this.gali.closeSenalesPanel();
    this.router.navigate(['/gali-6/senales'], { queryParams: { signalId: alertaId } });
  }

  lanzarProyectoDesdeADA(): void {
    this.gali.closeCazaPanel();
    this.router.navigate(['/gali-6/proyectos'], { queryParams: { autoNuevo: 'true' } });
  }

  verCatalogoDesdeCaza(): void {
    this.gali.closeCazaPanel();
    this.router.navigate(['/gali-6/productos/catalogo']);
  }

  negociarConProveedor(): void {
    this.gali.closeNegoPanel();
    this.router.navigate(['/gali-6/proyectos'], { queryParams: { autoNuevo: 'true' } });
  }

  verProveedoresDesdeNego(): void {
    this.gali.closeNegoPanel();
    this.router.navigate(['/gali-6/productos/proveedores']);
  }

  reopenOnboarding(): void {
    localStorage.removeItem('gali-6-onboarding-done');
    localStorage.removeItem('gali-6-objetivo-meta');
    localStorage.removeItem('gali-6-objetivo-v2');
    this.zeroPedidos.set(100);
    this.zeroFriccion.set(null);
    this.zeroCanal.set(null);
    this.zeroStep.set(0);
    this.zeroOpen.set(true);
  }

  private _clickInterceptor?: () => void;
  private _navSub?: Subscription;

  ngAfterViewInit(): void {
    // Interceptar TODOS los clicks en <a> que apuntan a /gali-v5/...
    const clickHandler = (e: MouseEvent): void => {
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? anchor.href ?? '';
      if (href.includes('/gali-v5')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newPath = href.replace('/gali-v5', '/gali-6');
        this.router.navigateByUrl(newPath);
      }
    };
    document.addEventListener('click', clickHandler, { capture: true });
    this._clickInterceptor = () => document.removeEventListener('click', clickHandler, { capture: true });

    // Interceptar navigaciones programáticas router.navigate(['/gali-v5/...'])
    this._navSub = this.router.events
      .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
      .subscribe(e => {
        if (e.url.startsWith('/gali-v5')) {
          const newUrl = e.url.replace('/gali-v5', '/gali-6');
          this.router.navigateByUrl(newUrl, { replaceUrl: true });
        }
      });
  }

  ngOnDestroy(): void {
    this._clickInterceptor?.();
    this._navSub?.unsubscribe();
  }

  private buildZeroRespuesta(): string {
    const pedidos = this.zeroPedidos();
    const canal = this.zeroCanal();
    if (canal === 'meta' || canal === 'ambos') {
      return `Para llegar a ${pedidos} pedidos/sem, Gali empieza por estabilizar tu ROAS en Meta y ya tiene 2 proyectos listos para recomendarte. Tus primeras señales llegan hoy.`;
    }
    return `Para llegar a ${pedidos} pedidos/sem, Gali ya tiene los primeros proyectos para proponerte. Tus primeras señales llegan hoy.`;
  }
}

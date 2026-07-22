import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {
  AGENTES_ESPECIALIZADOS,
  PAQUETE_PRINCIPIANTES,
  AgenteEspecializado,
  AgenteProcesoTipo,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
  TIER_LABEL,
} from '../../../../../mocks/gali-v6/agentes-especializados';
import { MOCK_SENALES, MOCK_ALERTAS } from '../../../../../mocks/gali-v5/senales.mock';
import { Gali6LiveMutationsService } from '../services/gali6-live-mutations.service';
import { Gali6CreationRegistryService } from '../services/gali6-creation-registry.service';
import { Gali6ChatService } from '../gali-chat/gali6-chat.service';
import { gali6ScreenCatalogConDestino, gali6ScreenLabel, Gali6ScreenOption } from '../models/gali6-screen-catalog';
import { Gali6HighlightDirective } from '../directives/gali6-highlight.directive';

type AgenteDetallTab = 'config' | 'historial';

interface HistorialItem {
  id: string;
  timestamp: string;
  accion: string;
  tipo: AgenteProcesoTipo;
  resultado: string;
  auto: boolean;
}

const HISTORIAL_POR_AGENTE: Record<string, HistorialItem[]> = {
  'stock-guardian': [
    { id: 'h1', timestamp: 'hace 15 min', accion: 'Detectó stock bajo en Difusor ultrasónico (<50 un.)', tipo: 'deterministico', resultado: 'Alerta enviada — pausa de campaña pendiente', auto: true },
    { id: 'h2', timestamp: 'hace 2h', accion: 'Verificó niveles de stock en 8 campañas activas', tipo: 'deterministico', resultado: 'Todo normal · sin alertas', auto: true },
    { id: 'h3', timestamp: 'hace 5h', accion: 'Coordinó reabastecimiento con proveedor Collar GPS', tipo: 'deterministico', resultado: 'Notificación enviada', auto: false },
    { id: 'h4', timestamp: 'ayer 14:20', accion: 'Pausa preventiva — stock Rodillo Jade < 30 un.', tipo: 'deterministico', resultado: 'Campaña Meta pausada · reactivar cuando stock > 80', auto: true },
    { id: 'h5', timestamp: 'ayer 09:00', accion: 'Scan matutino de inventarios — 12 productos', tipo: 'deterministico', resultado: 'Sin anomalías', auto: true },
  ],
  'roax-ads': [
    { id: 'h6', timestamp: 'hace 23 min', accion: 'Escaló presupuesto TikTok Collar GPS +20% (ROAS 2.3x)', tipo: 'deterministico', resultado: '+$7.000/día → estimado +5 pedidos/sem', auto: true },
    { id: 'h7', timestamp: 'hace 1h 40min', accion: 'Detectó ROAS bajo en K-Beauty (<1.5x) — análisis de audiencias', tipo: 'ia-ligera', resultado: 'Recomendación: cambiar creativos o pausar', auto: false },
    { id: 'h8', timestamp: 'hace 3h', accion: 'Optimizó horario de pauta — Difusor Aromaterapia Meta', tipo: 'deterministico', resultado: 'Concentró $15.000/día en franja 18-22h', auto: true },
    { id: 'h9', timestamp: 'ayer 21:00', accion: 'Revisión automática de presupuestos nocturnos', tipo: 'deterministico', resultado: '3 campañas ajustadas, 1 pausada por ROAS', auto: true },
    { id: 'h10', timestamp: 'ayer 16:30', accion: 'Generó informe semanal de pauta — 5 campañas', tipo: 'ia-ligera', resultado: 'Enviado a dashboard · disponible en Señales', auto: true },
  ],
  'vigilante-logistico': [
    { id: 'h11', timestamp: 'hace 45 min', accion: 'Resolvió novedad — pedido #45821 devuelto sin justificación', tipo: 'deterministico', resultado: 'Reclamo iniciado con transportadora', auto: true },
    { id: 'h12', timestamp: 'hace 2h', accion: 'Detectó patrón: 8 pedidos Medellín sin actualizar 48h', tipo: 'ia-ligera', resultado: 'Alerta crítica enviada · requería tu OK', auto: false },
    { id: 'h13', timestamp: 'hace 4h', accion: 'Reasignó 4 pedidos de Envia a Coordinadora · Cali', tipo: 'deterministico', resultado: '$42.000 ahorro en flete · tiempo -1 día', auto: true },
    { id: 'h14', timestamp: 'ayer 11:00', accion: 'Scan de pedidos con novedad activa — 23 pedidos', tipo: 'deterministico', resultado: '18 sin problema · 5 con acción pendiente', auto: true },
  ],
};

const PROYECTOS_POR_AGENTE: Record<string, Array<{ nombre: string; estado: string; id: string }>> = {
  'stock-guardian': [
    { id: 'pv-003', nombre: 'Collar GPS — Escalando', estado: 'en_escala' },
    { id: 'pv-004', nombre: 'K-Beauty — Bajo rendimiento', estado: 'en_riesgo' },
  ],
  'roax-ads': [
    { id: 'pv-003', nombre: 'Collar GPS — Escalando', estado: 'en_escala' },
    { id: 'pv-004', nombre: 'K-Beauty — Bajo rendimiento', estado: 'en_riesgo' },
    { id: 'pv-002', nombre: 'Estrategia Q3', estado: 'configurando' },
  ],
  'vigilante-logistico': [
    { id: 'pv-003', nombre: 'Collar GPS — Escalando', estado: 'en_escala' },
  ],
};

@Component({
  selector: 'app-gali6-agentes',
  standalone: true,
  imports: [CommonModule, RouterModule, Gali6HighlightDirective],
  templateUrl: './gali6-agentes.component.html',
  styleUrls: ['./gali6-agentes.component.scss'],
})
export class Gali6AgentesComponent implements OnInit {
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly mutations = inject(Gali6LiveMutationsService);
  private readonly creationRegistry = inject(Gali6CreationRegistryService);
  private readonly chat = inject(Gali6ChatService);

  ngOnInit(): void {
    const crear = this.route.snapshot.queryParamMap.get('crear');
    if (crear === 'true') {
      setTimeout(() => this.crearAgenteConGali(), 300);
    }
  }

  /** Flujo K (18.FlujoUsuarioGali6.md §5.8) — "ambos lados": mismo flujo que el texto libre en el chat, disparado desde este botón. */
  crearAgenteConGali(): void {
    this.chat.iniciarFlujoCreacion('agente', 'crear');
    this.chat.requestFocusChat();
  }

  editarAgenteConGali(agenteId: string): void {
    this.chat.iniciarFlujoCreacion('agente', 'editar', agenteId);
    this.chat.requestFocusChat();
  }

  readonly paqueteBasico = PAQUETE_PRINCIPIANTES;
  readonly todosLosAgentes = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;
  readonly tierLabel = TIER_LABEL;

  readonly agentesActivos = computed(() =>
    this.agentesEstado().filter(a => a.estado === 'activo')
  );

  readonly agentesDisponibles = computed(() =>
    this.todosLosAgentes.filter(a => a.estado === 'disponible')
  );

  readonly expandedAgenteId = signal<string | null>(null);
  readonly expandedTab = signal<Record<string, AgenteDetallTab>>({});
  readonly showCrearModal = signal(false);
  readonly toastMsg = signal<string | null>(null);

  // ── G4.2: Forms inline regla/skill ────────────────────────────────────────
  readonly nuevaReglaOpen = signal<Record<string, boolean>>({});
  readonly nuevaReglaSi = signal<Record<string, string>>({});
  readonly nuevaReglaEntonces = signal<Record<string, string>>({});
  readonly skillsDispOpen = signal<Record<string, boolean>>({});

  // ── Flujo I: apareceEn (18.FlujoUsuarioGali6.md §5.2) ──────────────────────
  // Solo pantallas con <gali6-agent-presence-bar>/<gali6-screen-artifacts> montado — asignar un agente
  // a una pantalla sin cobertura lo dejaría "invisible" ahí (18.FlujoUsuarioGali6.md §5.9).
  readonly screenCatalog: Gali6ScreenOption[] = gali6ScreenCatalogConDestino();
  readonly apareceEnAddOpen = signal<Record<string, boolean>>({});

  screenLabel(screenId: string): string {
    return gali6ScreenLabel(screenId);
  }

  /** Pantallas del catálogo que este agente todavía no tiene marcadas — evita duplicados en el select. */
  screensDisponiblesPara(ag: { apareceEn?: string[] }): Gali6ScreenOption[] {
    const actuales = new Set(ag.apareceEn ?? []);
    return this.screenCatalog.filter(s => !actuales.has(s.id));
  }

  toggleApareceEnAdd(agenteId: string): void {
    this.apareceEnAddOpen.update(m => ({ ...m, [agenteId]: !m[agenteId] }));
  }

  agregarSeccion(agenteId: string, screenId: string): void {
    if (!screenId) return;
    this.mutations.agregarSeccionAAgente(agenteId, screenId);
    this.apareceEnAddOpen.update(m => ({ ...m, [agenteId]: false }));
  }

  quitarSeccion(agenteId: string, screenId: string): void {
    this.mutations.quitarSeccionDeAgente(agenteId, screenId);
  }

  // ── Vista "Mapa de agentes" (18.FlujoUsuarioGali6.md §5.9 — percepción del concepto) ──────
  // Tabla agentes × secciones sobre los mismos datos y mutaciones de arriba, sin servicio nuevo.
  readonly vistaAgentes = signal<'lista' | 'mapa'>('lista');
  readonly mapaAddColOpen = signal(false);
  /** Columnas agregadas a la vista manualmente (aún sin ningún agente asignado) — mezcladas con
   * las que ya surgen de apareceEn en columnasVisibles(). */
  private readonly columnasExtra = signal<Gali6ScreenOption[]>([]);

  /** Unión de screenId presentes en algún apareceEn de los agentes activos — típicamente 4-8, no las ~25 del catálogo completo. */
  readonly columnasMapa = computed<Gali6ScreenOption[]>(() => {
    const ids = new Set<string>();
    for (const ag of this.agentesActivos()) {
      for (const s of ag.apareceEn ?? []) ids.add(s);
    }
    return Array.from(ids).map(id => ({ id, label: this.screenLabel(id) }));
  });

  readonly columnasVisibles = computed<Gali6ScreenOption[]>(() => {
    const base = this.columnasMapa();
    const extra = this.columnasExtra().filter(c => !base.some(b => b.id === c.id));
    return [...base, ...extra].sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Secciones con cobertura real que todavía no aparecen como columna. */
  readonly columnasOfrecibles = computed<Gali6ScreenOption[]>(() => {
    const presentes = new Set(this.columnasVisibles().map(c => c.id));
    return this.screenCatalog.filter(s => !presentes.has(s.id));
  });

  tieneSeccion(ag: AgenteEspecializado, screenId: string): boolean {
    return !!ag.apareceEn?.includes(screenId);
  }

  /** Clic en celda: edición directa del usuario sobre su propia configuración (no una sugerencia
   * de Gali) — mismo criterio que ya usan los chips individuales del listado, sin preview-then-confirm. */
  toggleCelda(ag: AgenteEspecializado, screenId: string): void {
    if (this.tieneSeccion(ag, screenId)) {
      this.quitarSeccion(ag.id, screenId);
    } else {
      this.agregarSeccion(ag.id, screenId);
    }
  }

  agregarColumnaMapa(opt: Gali6ScreenOption): void {
    this.columnasExtra.update(list => [...list, opt]);
    this.mapaAddColOpen.set(false);
  }

  getHistorial(agenteId: string): HistorialItem[] {
    return HISTORIAL_POR_AGENTE[agenteId] ?? [];
  }

  getSenalesDelAgente(nombreAgente: string): Array<{ id: string; titulo: string; ventanaDias: number }> {
    const nombre = nombreAgente.toLowerCase();
    const senales = MOCK_SENALES
      .filter(s => s.agente.toLowerCase() === nombre || (s.agenteOrigenNombre ?? '').toLowerCase() === nombre)
      .map(s => ({ id: s.id, titulo: s.titulo, ventanaDias: s.ventanaDias }));
    const alertas = MOCK_ALERTAS
      .filter(a => a.agente.toLowerCase() === nombre)
      .map(a => ({ id: a.id, titulo: a.titulo, ventanaDias: 0 }));
    return [...senales, ...alertas].slice(0, 3);
  }

  getProyectosActivos(agenteId: string): Array<{ nombre: string; estado: string; id: string }> {
    return PROYECTOS_POR_AGENTE[agenteId] ?? [];
  }

  getAgenteTab(agenteId: string): AgenteDetallTab {
    return this.expandedTab()[agenteId] ?? 'config';
  }

  setAgenteTab(agenteId: string, tab: AgenteDetallTab): void {
    this.expandedTab.update(m => ({ ...m, [agenteId]: tab }));
  }

  getHistorialTipoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico: 'tipo--deterministic',
      'ia-ligera': 'tipo--ia-ligera',
      'ia-compleja': 'tipo--ia-compleja',
    };
    return map[tipo];
  }

  getSkillLabel(ag: { skills: Array<{ id: string; label: string }> }, skillId?: string): string | null {
    if (!skillId) return null;
    return ag.skills.find(sk => sk.id === skillId)?.label ?? null;
  }

  getProyectoEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      en_escala: 'estado--escala', activo: 'estado--activo',
      en_riesgo: 'estado--riesgo', configurando: 'estado--config',
      pausado: 'estado--pausado',
    };
    return map[estado] ?? '';
  }

  /**
   * Vista derivada de AGENTES_ESPECIALIZADOS, re-derivada cada vez que
   * Gali6LiveMutationsService.version() cambia — así un toggle/edición
   * disparado desde el chat (o desde el flujo conversacional de Fase 3)
   * se refleja aquí sin recargar. Toda mutación pasa por el servicio,
   * nunca se escribe este computed directamente.
   */
  readonly agentesEstado = computed(() => {
    this.mutations.version();
    this.creationRegistry.version();
    const todos = [...AGENTES_ESPECIALIZADOS, ...this.creationRegistry.agentesCreados()];
    return todos.map(ag => ({
      ...ag,
      estado: ag.estado as 'activo' | 'pausado' | 'disponible',
      autonomiaPct: ag.autonomiaPct ?? 60,
      skills: ag.skillsDefecto.map(sk => ({ ...sk, activa: sk.activa !== false })),
      reglas: ag.reglasDefecto.map((r, i) => ({ ...r, id: r.id ?? `${ag.id}-r${i}`, activa: r.activa !== false })),
    }));
  });

  toggleDetalle(id: string): void {
    this.expandedAgenteId.update(cur => (cur === id ? null : id));
  }

  toggleSkill(agenteId: string, skillId: string): void {
    this.mutations.toggleSkillAgente(agenteId, skillId);
  }

  setAutonomia(agenteId: string, pct: number): void {
    this.mutations.setAutonomiaAgente(agenteId, pct);
  }

  onAutonomiaInput(agenteId: string, event: Event): void {
    const v = parseInt((event.target as HTMLInputElement).value, 10);
    this.setAutonomia(agenteId, v);
  }

  eliminarRegla(agenteId: string, reglaId: string): void {
    this.mutations.eliminarReglaAgente(agenteId, reglaId);
  }

  desactivarAgente(agenteId: string): void {
    this.mutations.setEstadoAgente(agenteId, 'pausado');
    this.expandedAgenteId.set(null);
    this.showToast('Agente pausado. Puedes reactivarlo desde Marketplace.');
  }

  // ── G4.2: Inline regla/skill ──────────────────────────────────────────────
  toggleNuevaRegla(agenteId: string): void {
    this.nuevaReglaOpen.update(m => ({ ...m, [agenteId]: !m[agenteId] }));
    if (!this.nuevaReglaOpen()[agenteId]) {
      this.nuevaReglaSi.update(m => ({ ...m, [agenteId]: '' }));
      this.nuevaReglaEntonces.update(m => ({ ...m, [agenteId]: '' }));
    }
  }

  setNuevaReglaSi(agenteId: string, valor: string): void {
    this.nuevaReglaSi.update(m => ({ ...m, [agenteId]: valor }));
  }

  setNuevaReglaEntonces(agenteId: string, valor: string): void {
    this.nuevaReglaEntonces.update(m => ({ ...m, [agenteId]: valor }));
  }

  agregarRegla(agenteId: string): void {
    const si = (this.nuevaReglaSi()[agenteId] ?? '').trim();
    const entonces = (this.nuevaReglaEntonces()[agenteId] ?? '').trim();
    if (!si || !entonces) return;
    this.mutations.agregarReglaAgente(agenteId, si, entonces);
    this.nuevaReglaOpen.update(m => ({ ...m, [agenteId]: false }));
    this.nuevaReglaSi.update(m => ({ ...m, [agenteId]: '' }));
    this.nuevaReglaEntonces.update(m => ({ ...m, [agenteId]: '' }));
    this.showToast('Regla agregada');
  }

  toggleSkillsDisp(agenteId: string): void {
    this.skillsDispOpen.update(m => ({ ...m, [agenteId]: !m[agenteId] }));
  }

  irAMarketplace(): void {
    this.router.navigate(['/gali-6/marketplace']);
  }

  getProcesoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico:  'tipo--deterministic',
      'ia-ligera':     'tipo--ia-ligera',
      'ia-compleja':   'tipo--ia-compleja',
    };
    return map[tipo];
  }

  getAutonomiaLabel(pct: number): string {
    if (pct <= 20) return 'Solo notifica';
    if (pct <= 45) return 'Pide aprobación';
    if (pct <= 70) return 'Opera con límites';
    return 'Modo automático';
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }
}

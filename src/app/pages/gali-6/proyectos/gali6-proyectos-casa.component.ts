import { Component, computed, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';
import { MOCK_SENALES } from '../../../../../mocks/gali-v5/senales.mock';
import {
  G6Objetivo, SubMeta, ObjetivoTipo, TIPO_LABEL,
  getObjetivo, saveObjetivo, syncLegacyKeys,
} from '../../../../../mocks/gali-v6/objetivo';

const ESTADO_LABEL: Record<string, string> = {
  en_escala: 'En escala', activo: 'Activo', pausado: 'Pausado', lanzando: 'Lanzando',
  recien_lanzado: 'Recién lanzado', cerrado: 'Cerrado', borrador: 'Borrador',
};

function saludDe(p: any): number {
  if (p.estado === 'en_escala') return 92;
  if (p.estado === 'activo') return 78;
  if (p.estado === 'recien_lanzado' || p.estado === 'lanzando') return 60;
  if (p.estado === 'pausado') return 38;
  if (p.estado === 'borrador') return Number(p.borrador_completado_pct ?? 50);
  if (p.estado === 'cerrado') return 20;
  return 50;
}

interface ProyectoRow {
  id: string;
  nombre: string;
  estado: string;
  estadoLabel: string;
  saludPct: number;
  pedidos: string;
  pedidosSem: number;
  roas: string;
  contribucionPct: number;
  borrador_steps?: any[];
}

interface GaliCheckin {
  tipo: 'atencion' | 'sugerencia' | 'positivo';
  titulo: string;
  cuerpo: string;
  cta: string;
  proyectoId?: string;
  accion?: 'nuevo' | 'ver';
}

const PROJ_OVERRIDES_KEY = 'gali-6-proyecto-overrides';
const PROTO_DATE = '2026-06-15';

interface ProyectoOverride {
  nombre?: string;
  notasGali?: string;
  contribucionEsperadaSem?: number;
  presupuestoDiario?: number;
  agentes?: Record<string, boolean>;
}

function getProyectoOverrides(): Record<string, ProyectoOverride> {
  try {
    const raw = localStorage.getItem(PROJ_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProyectoOverrides(ov: Record<string, ProyectoOverride>): void {
  localStorage.setItem(PROJ_OVERRIDES_KEY, JSON.stringify(ov));
}

const AGENTES_DEFAULT: Record<string, { label: string; desc: string; default: boolean }> = {
  roax:      { label: 'Roax Ads',     desc: 'Pauta inteligente y escala de campañas',    default: true  },
  vigilante: { label: 'Vigilante',    desc: 'Monitoreo logístico y alertas de novedad',  default: true  },
  ada:       { label: 'ADA Spy',      desc: 'Inteligencia de producto y competidores',   default: false },
  chatea:    { label: 'Chatea Pro',   desc: 'Atención al cliente y recuperación',        default: false },
};

@Component({
  selector: 'app-gali6-proyectos-casa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GaliGlosarioDirective, Gali6PageHeaderComponent, A11yModule],
  templateUrl: './gali6-proyectos-casa.component.html',
  styleUrl: './gali6-proyectos-casa.component.scss',
})
export class Gali6ProyectosCasaComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ── Objetivo (Bloque 1) ──────────────────────────────────────────────
  readonly objetivo = signal<G6Objetivo>(getObjetivo());
  readonly tipoLabel = computed(() => TIPO_LABEL[this.objetivo().tipo]);
  readonly pedidosActual = (KPIS as any).pedidos_sem_total?.valor ?? 70;

  readonly metaPct = computed(() =>
    Math.min(100, Math.round((this.pedidosActual / this.objetivo().meta_pedidos_sem) * 100))
  );
  readonly metaEstado = computed(() =>
    this.metaPct() >= 90 ? 'cumplida' : this.metaPct() >= 55 ? 'en_camino' : 'en_riesgo'
  );

  readonly semanasTranscurridas = computed(() => {
    const inicio = new Date(this.objetivo().fecha_inicio);
    const hoy = new Date('2026-06-15'); // fecha actual del prototipo
    const diff = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(diff, this.objetivo().plazo_semanas));
  });

  readonly fechaInicioLabel = computed(() => {
    const d = new Date(this.objetivo().fecha_inicio);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  });

  readonly subMetasLogradas = computed(() =>
    this.objetivo().sub_metas.filter(s => s.lograda).length
  );

  // ── Filtro de portafolio ──────────────────────────────────────────────
  readonly activeFilter = signal<'todos' | 'activos' | 'pausados' | 'borradores' | 'cerrados'>('todos');
  readonly portfolioVisible = signal(true);

  // ── Proyectos con contribución al objetivo (Bloque 4) ────────────────
  readonly proyectos = computed<ProyectoRow[]>(() => {
    const overrides = getProyectoOverrides();
    const meta = this.objetivo().meta_pedidos_sem;
    return (PROJECTS as any[])
      .filter(p => p.id)
      .map(p => {
        const ov = overrides[p.id] ?? {};
        const pedidosSem: number = p.pedidos_sem ?? 0;
        return {
          id: p.id,
          nombre: ov.nombre ?? p.nombre,
          estado: p.estado,
          estadoLabel: ESTADO_LABEL[p.estado] ?? p.estado,
          saludPct: saludDe(p),
          pedidos: p.pedidos_sem_label ?? '—',
          pedidosSem,
          roas: p.roas_real_label ?? '—',
          contribucionPct: meta > 0 ? Math.min(100, Math.round((pedidosSem / meta) * 100)) : 0,
          borrador_steps: p.borrador_steps,
        };
      });
  });

  readonly searchQuery = signal('');

  readonly proyectosFiltrados = computed<ProyectoRow[]>(() => {
    const f = this.activeFilter();
    const todos = this.proyectos();
    if (f === 'activos')    return todos.filter(p => ['activo', 'en_escala', 'recien_lanzado', 'lanzando'].includes(p.estado));
    if (f === 'pausados')   return todos.filter(p => p.estado === 'pausado');
    if (f === 'borradores') return todos.filter(p => p.estado === 'borrador');
    if (f === 'cerrados')   return todos.filter(p => p.estado === 'cerrado');
    return todos;
  });

  readonly proyectosFiltradosYBuscados = computed<ProyectoRow[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filtrados = this.proyectosFiltrados();
    if (!q) return filtrados;
    return filtrados.filter(p => p.nombre.toLowerCase().includes(q));
  });

  readonly filterCounts = computed(() => {
    const todos = this.proyectos();
    return {
      todos:      todos.length,
      activos:    todos.filter(p => ['activo', 'en_escala', 'recien_lanzado', 'lanzando'].includes(p.estado)).length,
      pausados:   todos.filter(p => p.estado === 'pausado').length,
      borradores: todos.filter(p => p.estado === 'borrador').length,
      cerrados:   todos.filter(p => p.estado === 'cerrado').length,
    };
  });

  readonly proyectosActivos = computed(() =>
    this.proyectos().filter(p => ['activo', 'en_escala', 'lanzando', 'recien_lanzado'].includes(p.estado))
  );

  readonly contribucionTotal = computed(() =>
    this.proyectosActivos().reduce((acc, p) => acc + p.pedidosSem, 0)
  );

  // ── Recomendaciones Gali con justificación de objetivo ───────────────
  readonly recomendaciones = computed(() => {
    const meta = this.objetivo().meta_pedidos_sem;
    const actual = this.pedidosActual;
    return MOCK_SENALES
      .filter(s => s.canLaunch && (s.tipo === 'trend' || s.tipo === 'opportunity'))
      .slice(0, 2)
      .map(s => {
        const est = s.pedidosEstimados ?? 15;
        const nuevoTotal = actual + est;
        const pctDespues = Math.min(100, Math.round((nuevoTotal / meta) * 100));
        const porqueObjetivo = `Esto te daría ~${est} pedidos/sem extra — llegarías al ${pctDespues}% de tu objetivo.`;
        return {
          titulo: s.titulo,
          porque: s.contextoMacromundo,
          porqueObjetivo,
          ventana: `${s.ventanaDias} días`,
        };
      });
  });

  // ── Gali check-ins del portafolio (Bloque 5) ─────────────────────────
  readonly galiCheckins = computed<GaliCheckin[]>(() => {
    const checkins: GaliCheckin[] = [];
    const obj = this.objetivo();
    const todos = this.proyectos();
    const activos = this.proyectosActivos();
    const pausados = todos.filter(p => p.estado === 'pausado');
    const enEscala = todos.filter(p => p.estado === 'en_escala');
    const borradores = todos.filter(p => p.estado === 'borrador');

    // Check-in 1: proyectos pausados sin reactivar
    if (pausados.length > 0) {
      const nombres = pausados.map(p => p.nombre).slice(0, 2).join(' y ');
      checkins.push({
        tipo: 'atencion',
        titulo: `${pausados.length} proyecto${pausados.length > 1 ? 's' : ''} pausado${pausados.length > 1 ? 's' : ''} no contribuyen a tu meta`,
        cuerpo: `${nombres}${pausados.length > 2 ? ' y otros' : ''} están sin pauta activa. Reactivarlos podría sumar hasta ${pausados.reduce((a, p) => a + (p.pedidosSem ?? 5), 0)}/sem a tu objetivo.`,
        cta: 'Ver alertas de reactivación',
        accion: 'ver',
      });
    }

    // Check-in 2: brecha de contribución
    const faltante = obj.meta_pedidos_sem - this.pedidosActual;
    if (faltante > 15 && this.metaEstado() !== 'cumplida') {
      checkins.push({
        tipo: 'sugerencia',
        titulo: `Faltan ${faltante} pedidos/sem para tu objetivo — Gali tiene una oportunidad`,
        cuerpo: `Con tus proyectos activos llegas a ${this.pedidosActual}/sem. Un nuevo proyecto en categoría tendencia podría cerrar esta brecha en 3-4 semanas.`,
        cta: '+ Crear proyecto nuevo',
        accion: 'nuevo',
      });
    }

    // Check-in 3: proyecto en escala avanza bien
    if (enEscala.length > 0) {
      const p = enEscala[0];
      checkins.push({
        tipo: 'positivo',
        titulo: `${p.nombre} está escalando — tu objetivo avanza`,
        cuerpo: `Este proyecto genera ${p.pedidos} con salud ${p.saludPct}%. Gali lo monitorea para mantener el ritmo hacia tu meta de ${obj.meta_pedidos_sem} ped/sem.`,
        cta: 'Ver proyecto →',
        proyectoId: p.id,
        accion: 'ver',
      });
    }

    // Check-in 4: borrador pendiente de lanzar
    if (borradores.length > 0 && checkins.length < 3) {
      const b = borradores[0];
      const pendientes = (b.borrador_steps ?? []).filter((s: any) => !s.done).length;
      checkins.push({
        tipo: 'sugerencia',
        titulo: `${b.nombre} está en borrador — ${pendientes} paso${pendientes !== 1 ? 's' : ''} para lanzar`,
        cuerpo: `Completar y lanzar este proyecto podría contribuir ~15/sem a tu objetivo. Gali prepara la campaña cuando lo actives.`,
        cta: 'Continuar borrador →',
        proyectoId: b.id,
        accion: 'ver',
      });
    }

    // Check-in 5: progreso hacia desbloqueo de Órdenes (D2)
    const exitosos = todos.filter(p => ['en_escala', 'activo'].includes(p.estado) && (p.pedidosSem ?? 0) >= 10);
    if (exitosos.length > 0 && checkins.length < 3) {
      const totalExitosos = exitosos.reduce((a, p) => a + (p.pedidosSem ?? 0), 0);
      checkins.push({
        tipo: 'positivo',
        titulo: `¡Casi desbloqueas Gestión de Pedidos!`,
        cuerpo: `Tus proyectos activos ya generan ${totalExitosos} pedidos/sem. Cuando consolides 2 semanas seguidas con resultados estables, Órdenes se desbloquea automáticamente.`,
        cta: 'Ver progreso →',
        accion: 'ver',
      });
    }

    return checkins;
  });

  // ── Gali "Mejorar con Gali" — campo de texto libre en modal objetivo ──
  readonly galiMejorarInput = signal('');
  readonly galiMejorarEstado = signal<'idle' | 'procesando' | 'propuesta'>('idle');
  readonly galiPropuestaTexto = signal('');
  readonly galiPropuestaMeta = signal(100);

  // I9e: Gali ayuda a definir objetivo desde el texto libre del draftTexto
  ayudarDefinirConGali(): void {
    this.galiMejorarInput.set(this.draftTexto());
    this.mejorarConGali();
  }

  mejorarConGali(): void {
    const texto = this.galiMejorarInput().toLowerCase();
    if (!texto.trim()) return;
    this.galiMejorarEstado.set('procesando');

    setTimeout(() => {
      let meta = this.draftMeta();
      const numMatch = texto.match(/(\d+)\s*(?:pedidos?|ventas?|órdenes?|orders?)?/);
      if (numMatch && parseInt(numMatch[1]) > 5) {
        meta = parseInt(numMatch[1]);
      } else if (/doblar|doble/.test(texto)) {
        meta = Math.round(this.pedidosActual * 2);
      } else if (/escalar|crecer|más/.test(texto)) {
        meta = Math.round(this.pedidosActual * 1.5);
      }

      let textoGenerado: string;
      if (/automatizar|automati/.test(texto)) {
        textoGenerado = `Facilitar la operación y sostener ${meta} pedidos/semana con proyectos activos que Gali cuida en tiempo real.`;
      } else if (/escalar|crecer/.test(texto)) {
        textoGenerado = `Escalar el negocio a ${meta} pedidos/semana lanzando proyectos nuevos y optimizando los que ya corren.`;
      } else if (/primer|empezar|iniciar|comenzar/.test(texto)) {
        textoGenerado = `Generar los primeros ${meta} pedidos/semana con un proyecto en productos de alta conversión guiado por Gali.`;
      } else if (/marca/.test(texto)) {
        textoGenerado = `Construir una marca con volumen de ${meta} pedidos/semana, con Gali facilitando pauta, stock y logística.`;
      } else {
        textoGenerado = `Hacer crecer el negocio hasta ${meta} pedidos/semana de forma sostenida, con Gali facilitando los proyectos para llegar ahí.`;
      }

      this.galiPropuestaTexto.set(textoGenerado);
      this.galiPropuestaMeta.set(meta);
      this.galiMejorarEstado.set('propuesta');
    }, 800);
  }

  aceptarPropuestaGali(): void {
    this.draftTexto.set(this.galiPropuestaTexto());
    this.draftMeta.set(this.galiPropuestaMeta());
    this.descartarPropuestaGali();
  }

  descartarPropuestaGali(): void {
    this.galiMejorarEstado.set('idle');
    this.galiMejorarInput.set('');
    this.galiPropuestaTexto.set('');
  }

  // ── Escape para cerrar cualquier modal abierto ────────────────────────
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.editProyectoOpen()) { this.editProyectoOpen.set(false); return; }
    if (this.editOpen()) { this.editOpen.set(false); return; }
    if (this.nuevoModalOpen() && this.nuevoAutoEstado() === 'preview') { this.nuevoAutoEstado.set('listo'); return; }
    if (this.nuevoModalOpen()) { this.cerrarNuevoModal(); }
  }

  // ── Check-in post-cambio de objetivo (Bloque 5) ───────────────────────
  readonly galiCambioMensaje = signal<string | null>(null);

  // ── Editar objetivo (Bloque 4) ────────────────────────────────────────
  readonly editOpen = signal(false);
  readonly draftTexto = signal('');
  readonly draftMeta = signal(100);
  readonly draftTipo = signal<ObjetivoTipo>('volumen');
  readonly draftPlazo = signal(12);
  readonly draftSubMetas = signal<SubMeta[]>([]);

  readonly tipoOptions: Array<{ id: ObjetivoTipo; label: string; desc: string }> = [
    { id: 'volumen',     label: 'Volumen',     desc: 'Meta en pedidos/semana' },
    { id: 'financiero',  label: 'Financiero',   desc: 'Meta en ganancia/mes' },
    { id: 'expansion',   label: 'Expansión',    desc: 'Lanzar N proyectos nuevos' },
  ];

  setFilter(f: 'todos' | 'activos' | 'pausados' | 'borradores' | 'cerrados'): void {
    if (this.activeFilter() === f) return;
    this.portfolioVisible.set(false);
    this.activeFilter.set(f);
    // Double rAF ensures Angular removes DOM before re-inserting
    requestAnimationFrame(() => requestAnimationFrame(() => this.portfolioVisible.set(true)));
  }

  openEdit(): void {
    const obj = this.objetivo();
    this.draftTexto.set(obj.texto);
    this.draftMeta.set(obj.meta_pedidos_sem);
    this.draftTipo.set(obj.tipo);
    this.draftPlazo.set(obj.plazo_semanas);
    this.draftSubMetas.set(obj.sub_metas.map(s => ({ ...s })));
    this.galiMejorarEstado.set('idle');
    this.galiMejorarInput.set('');
    this.galiPropuestaTexto.set('');
    this.editOpen.set(true);
  }

  saveEdit(): void {
    const anterior = this.objetivo();
    const updated: G6Objetivo = {
      ...anterior,
      texto: this.draftTexto(),
      tipo: this.draftTipo(),
      meta_pedidos_sem: this.draftMeta(),
      plazo_semanas: this.draftPlazo(),
      sub_metas: this.draftSubMetas(),
    };
    saveObjetivo(updated);
    syncLegacyKeys(updated);
    this.objetivo.set(updated);

    // Bloque 5: Gali notifica cuando la meta numérica cambia
    if (anterior.meta_pedidos_sem !== updated.meta_pedidos_sem) {
      const diff = updated.meta_pedidos_sem - anterior.meta_pedidos_sem;
      const dir = diff > 0 ? 'subiste' : 'bajaste';
      this.galiCambioMensaje.set(
        `${dir === 'subiste' ? '↑' : '↓'} Ajustaste tu meta de ${anterior.meta_pedidos_sem} a ${updated.meta_pedidos_sem} pedidos/sem. ` +
        `Gali recalculó tus check-ins y priorizará las alertas más relevantes para la nueva meta.`
      );
      setTimeout(() => this.galiCambioMensaje.set(null), 8000);
    } else if (anterior.texto !== updated.texto) {
      this.galiCambioMensaje.set(
        `Objetivo actualizado. Gali lo tomará en cuenta para las próximas recomendaciones de tu portafolio.`
      );
      setTimeout(() => this.galiCambioMensaje.set(null), 5000);
    }

    this.editOpen.set(false);
  }

  toggleDraftSubMeta(id: string): void {
    this.draftSubMetas.update(metas =>
      metas.map(m => {
        if (m.id !== id) return m;
        const lograda = !m.lograda;
        return { ...m, lograda, fecha_logro: lograda ? PROTO_DATE : undefined };
      })
    );
  }

  updateDraftSubMetaLabel(id: string, label: string): void {
    this.draftSubMetas.update(metas =>
      metas.map(m => m.id === id ? { ...m, label } : m)
    );
  }

  addDraftSubMeta(): void {
    this.draftSubMetas.update(metas => [
      ...metas,
      { id: `sm-${Date.now()}`, label: '', lograda: false },
    ]);
  }

  removeDraftSubMeta(id: string): void {
    this.draftSubMetas.update(metas => metas.filter(m => m.id !== id));
  }

  // Sub-metas toggle directo con fecha de logro (Bloque 4 + timeline)
  toggleSubMeta(id: string): void {
    const updated = {
      ...this.objetivo(),
      sub_metas: this.objetivo().sub_metas.map(m => {
        if (m.id !== id) return m;
        const lograda = !m.lograda;
        return { ...m, lograda, fecha_logro: lograda ? PROTO_DATE : undefined };
      }),
    };
    saveObjetivo(updated);
    this.objetivo.set(updated);
  }

  formatFechaLogro(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }

  // ── Editar proyecto — edición avanzada (Bloque 3) ────────────────────
  readonly editProyectoOpen = signal(false);
  readonly editProyectoId = signal('');
  readonly draftProyectoNombre = signal('');
  readonly draftProyectoNotas = signal('');
  readonly draftProyectoContribucion = signal(0);
  readonly draftPresupuesto = signal(25000);
  readonly draftAgentes = signal<Record<string, boolean>>({
    roax: true, vigilante: true, ada: false, chatea: false,
  });

  readonly agentesEntries = Object.entries(AGENTES_DEFAULT).map(([id, a]) => ({ id, ...a }));

  readonly presupuestoFormatted = computed(() =>
    '$' + this.draftPresupuesto().toLocaleString('es-CO')
  );

  toggleDraftAgente(id: string): void {
    this.draftAgentes.update(m => ({ ...m, [id]: !m[id] }));
  }

  openEditProyecto(p: ProyectoRow, event: Event): void {
    event.stopPropagation();
    const overrides = getProyectoOverrides();
    const ov = overrides[p.id] ?? {};
    this.editProyectoId.set(p.id);
    this.draftProyectoNombre.set(ov.nombre ?? p.nombre);
    this.draftProyectoNotas.set(ov.notasGali ?? '');
    this.draftProyectoContribucion.set(ov.contribucionEsperadaSem ?? p.pedidosSem);
    this.draftPresupuesto.set(ov.presupuestoDiario ?? 25000);
    this.draftAgentes.set({
      roax:      ov.agentes?.['roax']      ?? AGENTES_DEFAULT['roax'].default,
      vigilante: ov.agentes?.['vigilante'] ?? AGENTES_DEFAULT['vigilante'].default,
      ada:       ov.agentes?.['ada']       ?? AGENTES_DEFAULT['ada'].default,
      chatea:    ov.agentes?.['chatea']    ?? AGENTES_DEFAULT['chatea'].default,
    });
    this.editProyectoOpen.set(true);
  }

  saveEditProyecto(): void {
    const overrides = getProyectoOverrides();
    overrides[this.editProyectoId()] = {
      nombre: this.draftProyectoNombre(),
      notasGali: this.draftProyectoNotas(),
      contribucionEsperadaSem: this.draftProyectoContribucion(),
      presupuestoDiario: this.draftPresupuesto(),
      agentes: { ...this.draftAgentes() },
    };
    saveProyectoOverrides(overrides);
    this.objetivo.set({ ...this.objetivo() });
    this.editProyectoOpen.set(false);
  }

  // ── Nuevo proyecto: modal selector (Cambio A) ─────────────────────────
  readonly nuevoModalOpen = signal(false);
  readonly nuevoAutoEstado = signal<'cargando' | 'listo' | 'preview' | 'lanzando'>('cargando');
  readonly previewLoading = signal(true);
  readonly lanzamientoPct = signal(0);
  readonly lanzamientoSteps = signal([
    { label: 'Proyecto creado en Dropi', done: false },
    { label: 'Apoyo de Gali asignado al proyecto', done: false },
    { label: 'Alertas de monitoreo activadas', done: false },
  ]);

  readonly galiPropuestaAuto = computed(() => {
    const senal = MOCK_SENALES.find(s => s.canLaunch && s.tipo === 'trend');
    if (!senal) return null;
    const meta = this.objetivo().meta_pedidos_sem;
    const est = (senal as any).pedidosEstimados ?? 15;
    const pctDespues = Math.min(100, Math.round(((this.pedidosActual + est) / meta) * 100));
    return {
      producto: senal.titulo.split(':')[0].trim(),
      por: (senal as any).recomendacion ?? senal.contextoMacromundo,
      ventana: (senal as any).ventanaDias ?? 7,
      pedidosEstimados: est,
      pedidosMin: Math.round(est * 0.8),
      pedidosMax: Math.round(est * 1.2),
      presupuestoSugerido: '$35.000',
      metrica: (senal as any).metrica ?? '',
      pctDespues,
    };
  });

  abrirNuevoModal(): void {
    this.nuevoAutoEstado.set('cargando');
    this.nuevoModalOpen.set(true);
    setTimeout(() => this.nuevoAutoEstado.set('listo'), 1400);
  }

  irPreviewAuto(): void {
    this.previewLoading.set(true);
    this.nuevoAutoEstado.set('preview');
    setTimeout(() => this.previewLoading.set(false), 220);
  }

  cerrarNuevoModal(): void {
    this.nuevoModalOpen.set(false);
  }

  confirmarAutoProyecto(): void {
    this.nuevoAutoEstado.set('lanzando');
    this.lanzamientoPct.set(0);
    this.lanzamientoSteps.set([
      { label: 'Proyecto creado en Dropi', done: false },
      { label: 'Apoyo de Gali asignado al proyecto', done: false },
      { label: 'Alertas de monitoreo activadas', done: false },
    ]);
    setTimeout(() => {
      this.lanzamientoPct.set(33);
      this.lanzamientoSteps.update(s => s.map((st, i) => i === 0 ? { ...st, done: true } : st));
    }, 600);
    setTimeout(() => {
      this.lanzamientoPct.set(66);
      this.lanzamientoSteps.update(s => s.map((st, i) => i === 1 ? { ...st, done: true } : st));
    }, 1200);
    setTimeout(() => {
      this.lanzamientoPct.set(100);
      this.lanzamientoSteps.update(s => s.map((st, i) => i === 2 ? { ...st, done: true } : st));
    }, 1800);
    setTimeout(() => {
      this.cerrarNuevoModal();
      const p = this.proyectos().find(pr => ['en_escala', 'activo'].includes(pr.estado));
      this.router.navigate(p ? ['/gali-6/proyecto', p.id] : ['/gali-6/proyectos']);
    }, 2500);
  }

  irWizard(): void {
    this.cerrarNuevoModal();
    this.router.navigate(['/gali-6/proyectos/nuevo']);
  }

  // ── Navegación ────────────────────────────────────────────────────────
  abrir(id: string): void { this.router.navigate(['/gali-6/proyecto', id]); }
  nuevo(): void { this.abrirNuevoModal(); }

  handleCheckinCta(ci: GaliCheckin): void {
    if (ci.accion === 'nuevo') { this.nuevo(); return; }
    if (ci.accion === 'ver' && ci.proyectoId) { this.abrir(ci.proyectoId); return; }
    if (ci.accion === 'ver') { this.router.navigate(['/gali-6/senales']); }
  }

  ngOnInit(): void {
    // Auto-abrir modal selector si viene del panel de Gali en catálogo (Cambio B)
    if (this.route.snapshot.queryParamMap.has('autoNuevo')) {
      setTimeout(() => this.abrirNuevoModal(), 250);
    }

    // I8d: abrir modal de edición si viene desde el detalle del proyecto con ?edit=<id>
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      setTimeout(() => {
        const p = this.proyectos().find(r => r.id === editId);
        if (p) this.openEditProyecto(p, new MouseEvent('click'));
      }, 300);
    }

    // Seed objetivo from legacy keys if v2 key not yet present
    if (!localStorage.getItem('gali-6-objetivo-v2')) {
      const legacyTexto = localStorage.getItem('gali-6-objetivo-texto');
      const legacyMeta = localStorage.getItem('gali-6-objetivo-meta');
      if (legacyTexto || legacyMeta) {
        const obj = getObjetivo();
        if (legacyTexto) obj.texto = legacyTexto;
        if (legacyMeta) obj.meta_pedidos_sem = Number(legacyMeta);
        saveObjetivo(obj);
        this.objetivo.set(obj);
      }
    }
    // Always keep legacy keys in sync so the shell zero-state doesn't re-open
    syncLegacyKeys(this.objetivo());
  }
}

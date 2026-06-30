import { Component, computed, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import PROJECTS from '../../../../../mocks/gali-v5/projects.json';
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';
import { MOCK_SENALES, MOCK_ALERTAS } from '../../../../../mocks/gali-v5/senales.mock';
import {
  G6Objetivo, SubMeta, ObjetivoTipo, TIPO_LABEL,
  getObjetivo, saveObjetivo, syncLegacyKeys,
} from '../../../../../mocks/gali-v6/objetivo';
import { MOCK_CAMPANAS, Campana } from '../../../../../mocks/gali-v6/campanas.mock';
import { PROYECTOS_MOCK, TipoProyecto } from '../../../../../mocks/gali-v6/proyectos.mock';

const ESTADO_LABEL: Record<string, string> = {
  en_escala: 'En escala', activo: 'Activo', pausado: 'Pausado', lanzando: 'Lanzando',
  recien_lanzado: 'Recién lanzado', cerrado: 'Cerrado', borrador: 'Borrador',
  configurando: 'Configurando', en_riesgo: 'En riesgo',
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
  tipo?: TipoProyecto;
  estado: string;
  estadoLabel: string;
  saludPct: number;
  pedidos: string;
  pedidosSem: number;
  roas: string;
  contribucionPct: number;
  borrador_steps?: any[];
  campanaCount: number;
  subObjetivo?: string;
}

interface GaliCheckin {
  tipo: 'atencion' | 'sugerencia' | 'positivo';
  titulo: string;
  cuerpo: string;
  cta: string;
  proyectoId?: string;
  accion?: 'nuevo' | 'ver';
}

interface AlertaUnificada {
  tipo: 'atencion' | 'sugerencia' | 'positivo';
  titulo: string;
  cuerpo: string;
  cta: string;
  agente?: string;
  proyectoId?: string;
  accion?: 'nuevo' | 'ver';
  destino?: 'conexiones' | 'agente' | 'campana' | 'senales';
  agenteId?: string;
  campanaId?: string;
}

// Mapeo de IDs internos del portafolio → proyectoId del mock de señales
const PROYECTO_SENAL_MAP: Record<string, string> = {
  'pv-003': 'collar-gps-2026',
  'pv-004': 'skincare-kbeauty',
};

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

  // Filtros multi-dimensión
  readonly filtroEstado = signal<string>('todos');
  readonly filtroCampanas = signal<string>('todos'); // todos | con-campanas | sin-campanas
  readonly filtroPanelOpen = signal(false);

  readonly filtrosActivosCount = computed(() => {
    let count = 0;
    if (this.filtroEstado() !== 'todos') count++;
    if (this.filtroCampanas() !== 'todos') count++;
    if (this.tipoFiltro() !== 'todos') count++;
    return count;
  });

  readonly estadoOpts = [
    { value: 'todos', label: 'Todos' },
    { value: 'activo', label: 'Activo' },
    { value: 'en_escala', label: 'En escala' },
    { value: 'en_riesgo', label: 'En riesgo' },
    { value: 'configurando', label: 'Configurando' },
    { value: 'pausado', label: 'Pausado' },
    { value: 'borrador', label: 'Borrador' },
    { value: 'cerrado', label: 'Cerrado' },
  ];

  readonly tipoOpts = [
    { value: 'todos', label: 'Todos' },
    { value: 'lanzar', label: '🚀 Lanzar' },
    { value: 'escalar', label: '📈 Escalar' },
    { value: 'crm', label: '💬 CRM' },
    { value: 'optimizar', label: '🔧 Optimizar' },
    { value: 'experimentar', label: '🧪 Exp.' },
    { value: 'operacion', label: '⚙️ Operación' },
    { value: 'negociacion', label: '🤝 Negociación' },
  ];

  readonly filtroEstadoLabel = computed(() =>
    this.estadoOpts.find(o => o.value === this.filtroEstado())?.label ?? this.filtroEstado()
  );

  readonly filtroTipoLabel = computed(() =>
    this.tipoOpts.find(o => o.value === this.tipoFiltro())?.label ?? String(this.tipoFiltro())
  );

  // ── Proyectos con contribución al objetivo (Bloque 4) ────────────────
  readonly proyectos = computed<ProyectoRow[]>(() => {
    const overrides = getProyectoOverrides();
    const meta = this.objetivo().meta_pedidos_sem;

    const legacy: ProyectoRow[] = (PROJECTS as any[])
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
          campanaCount: MOCK_CAMPANAS.filter(c => c.proyectoId === p.id).length,
        };
      });

    const pvRows: ProyectoRow[] = PROYECTOS_MOCK.map(pv => {
      const estadoSalud: Record<string, number> = {
        borrador: 15, configurando: 50, activo: 78, en_riesgo: 32, en_escala: 92, pausado: 38, cerrado: 20,
      };
      return {
        id: pv.id,
        nombre: pv.nombre,
        tipo: pv.tipo,
        estado: pv.estado,
        estadoLabel: ESTADO_LABEL[pv.estado] ?? pv.estado,
        saludPct: estadoSalud[pv.estado] ?? 50,
        pedidos: pv.pedidosSem > 0 ? `${pv.pedidosSem}` : '—',
        pedidosSem: pv.pedidosSem,
        roas: pv.roasPromedio ? `${pv.roasPromedio}x` : '—',
        contribucionPct: pv.contribucionPct,
        campanaCount: pv.campanas.length,
        subObjetivo: (pv as any).subObjetivo,
      };
    });

    // Proyectos creados desde el wizard (guardados en localStorage)
    const extraRows: ProyectoRow[] = (() => {
      try {
        const extra: any[] = JSON.parse(localStorage.getItem('g6_proyectos_extra') ?? '[]');
        const estadoSalud: Record<string, number> = {
          borrador: 15, configurando: 50, activo: 78, en_riesgo: 32, en_escala: 92, pausado: 38, cerrado: 20,
        };
        return extra.map(p => ({
          id: p.id,
          nombre: p.nombre,
          tipo: p.tipo as TipoProyecto | undefined,
          estado: p.estado,
          estadoLabel: ESTADO_LABEL[p.estado] ?? p.estado,
          saludPct: estadoSalud[p.estado] ?? 50,
          pedidos: p.pedidosSem > 0 ? `${p.pedidosSem}` : '—',
          pedidosSem: p.pedidosSem ?? 0,
          roas: p.roasPromedio ? `${p.roasPromedio}x` : '—',
          contribucionPct: p.contribucionPct ?? 0,
          campanaCount: (p.campanas ?? []).length,
          subObjetivo: p.subObjetivo ?? p.descripcion ?? undefined,
        }));
      } catch { return []; }
    })();

    return [...pvRows, ...extraRows, ...legacy];
  });

  readonly searchQuery = signal('');
  readonly tipoFiltro = signal<TipoProyecto | 'todos'>('todos');

  readonly proyectosFiltrados = computed<ProyectoRow[]>(() => {
    const f = this.activeFilter();
    const todos = this.proyectos();
    // filtro de estado legacy (tabs)
    let result = todos;
    if (f === 'activos')    result = todos.filter(p => ['activo', 'en_escala', 'recien_lanzado', 'lanzando', 'en_riesgo', 'configurando'].includes(p.estado));
    else if (f === 'pausados')   result = todos.filter(p => p.estado === 'pausado');
    else if (f === 'borradores') result = todos.filter(p => p.estado === 'borrador');
    else if (f === 'cerrados')   result = todos.filter(p => p.estado === 'cerrado');

    // filtros multi-dimensión
    const fe = this.filtroEstado();
    if (fe !== 'todos') {
      if (fe === 'activos') result = result.filter(p => ['activo', 'en_escala', 'recien_lanzado', 'lanzando', 'en_riesgo', 'configurando'].includes(p.estado));
      else result = result.filter(p => p.estado === fe);
    }

    const fc = this.filtroCampanas();
    if (fc === 'con-campanas') result = result.filter(p => p.campanaCount > 0);
    if (fc === 'sin-campanas') result = result.filter(p => p.campanaCount === 0);

    return result;
  });

  readonly proyectosFiltradosYBuscados = computed<ProyectoRow[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tipo = this.tipoFiltro();
    let filtrados = this.proyectosFiltrados();
    if (tipo !== 'todos') filtrados = filtrados.filter(p => p.tipo === tipo);
    if (!q) return filtrados;
    return filtrados.filter(p => p.nombre.toLowerCase().includes(q));
  });

  readonly filterCounts = computed(() => {
    const todos = this.proyectos();
    return {
      todos:      todos.length,
      activos:    todos.filter(p => ['activo', 'en_escala', 'recien_lanzado', 'lanzando', 'en_riesgo', 'configurando'].includes(p.estado)).length,
      pausados:   todos.filter(p => p.estado === 'pausado').length,
      borradores: todos.filter(p => p.estado === 'borrador').length,
      cerrados:   todos.filter(p => p.estado === 'cerrado').length,
    };
  });

  readonly proyectosActivos = computed(() =>
    this.proyectos().filter(p => ['activo', 'en_escala', 'lanzando', 'recien_lanzado'].includes(p.estado))
  );

  readonly conteoEnRiesgo = computed(() =>
    this.proyectos().filter(p => p.estado === 'en_riesgo').length
  );

  // ── Salud del portafolio (score agregado) ────────────────────────────
  readonly saludPortafolio = computed<{ score: number; label: string; color: 'verde' | 'ambar' | 'rojo'; breakdown: string }>(() => {
    const todos = this.proyectos();
    const activos = todos.filter(p => ['activo', 'en_escala', 'lanzando', 'recien_lanzado'].includes(p.estado));
    const enRiesgo = todos.filter(p => p.estado === 'en_riesgo').length;
    const pausados = todos.filter(p => p.estado === 'pausado').length;
    const borradores = todos.filter(p => p.estado === 'borrador').length;
    const total = todos.filter(p => p.estado !== 'cerrado').length;
    if (total === 0) return { score: 0, label: 'Sin proyectos', color: 'rojo', breakdown: '' };

    // Score: promedio ponderado de salud de proyectos activos
    const saludPromedio = activos.length > 0
      ? Math.round(activos.reduce((acc, p) => acc + p.saludPct, 0) / activos.length)
      : 0;
    // Penalizar por proyectos en riesgo y pausados
    const penalizacion = (enRiesgo * 8) + (pausados * 4) + (borradores * 2);
    const score = Math.max(0, Math.min(100, saludPromedio - penalizacion));

    const label = score >= 70 ? 'Portafolio saludable'
      : score >= 40 ? 'Portafolio en revisión'
      : 'Portafolio en riesgo';
    const color: 'verde' | 'ambar' | 'rojo' = score >= 70 ? 'verde' : score >= 40 ? 'ambar' : 'rojo';

    const partes: string[] = [];
    if (activos.length > 0) partes.push(`${activos.length} activo${activos.length !== 1 ? 's' : ''}`);
    if (enRiesgo > 0) partes.push(`${enRiesgo} en riesgo`);
    if (pausados > 0) partes.push(`${pausados} pausado${pausados !== 1 ? 's' : ''}`);
    if (borradores > 0) partes.push(`${borradores} en borrador`);

    return { score, label, color, breakdown: partes.join(' · ') };
  });

  // Signal para el flujo de cierre inline 2-pasos
  readonly pendientesCierre = signal<Set<string>>(new Set());

  readonly campanasPausadas = computed(() => {
    const result = new Map<string, boolean>();
    for (const pv of PROYECTOS_MOCK) {
      if (pv.campanas.length > 0) {
        result.set(pv.id, pv.campanas.every(c => c.estado === 'pausada'));
      }
    }
    return result;
  });

  readonly objetivoSubtitulo = computed(() => {
    const texto = this.objetivo().texto ?? '';
    const truncado = texto.length > 60 ? texto.slice(0, 57) + '…' : texto;
    return truncado ? `Orientados a: ${truncado}` : '';
  });

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

  // ── Alertas unificadas (reemplaza checkins + recomendaciones separadas) ─
  readonly alertasUnificadas = computed<AlertaUnificada[]>(() => {
    const result: AlertaUnificada[] = [];

    // 0. Alertas prioritarias con destino contextual (Siigo, Adaspi, etc.)
    const alertasContextuales: AlertaUnificada[] = [
      {
        tipo: 'atencion',
        titulo: 'Siigo desconectado',
        cuerpo: 'La conexión con Siigo se interrumpió. Gali no puede sincronizar pedidos ni facturar automáticamente hasta reconectar.',
        cta: 'Conectar Siigo →',
        agente: 'Gali detectó',
        destino: 'conexiones',
      },
      {
        tipo: 'sugerencia',
        titulo: 'Adaspi tiene señales nuevas sobre tu catálogo',
        cuerpo: 'Adaspi encontró 3 productos con alta demanda y márgenes por encima del 35%. Ideal para lanzar esta semana.',
        cta: 'Ver señales de Adaspi →',
        agente: 'Adaspi sugiere',
        destino: 'agente',
        agenteId: 'adaspi',
      },
    ];

    for (const a of alertasContextuales) {
      if (result.length >= 3) break;
      result.push(a);
    }

    // 1. Alertas críticas de agentes (de MOCK_ALERTAS) — solo si hay espacio
    if (result.length < 3) {
      const alertasCriticas = MOCK_ALERTAS
        .filter((a) => a.tipo === 'critical' || a.tipo === 'warning')
        .slice(0, 3 - result.length);
      for (const a of alertasCriticas) {
        if (result.length >= 3) break;
        result.push({
          tipo: a.tipo === 'critical' ? 'atencion' : 'sugerencia',
          titulo: a.titulo,
          cuerpo: a.descripcion ?? '',
          cta: 'Ver proyecto →',
          agente: a.agenteOrigenNombre ? `${a.agenteOrigenNombre} detectó` : 'Gali detectó',
          proyectoId: a.proyectoId,
          accion: 'ver',
          destino: 'senales',
        });
      }
    }

    // 2. Señales de escala/riesgo — solo si hay espacio
    if (result.length < 3) {
      const senalesRelevantes = MOCK_SENALES
        .filter((s: any) => s.tipo === 'scale' || s.tipo === 'risk' || s.tipo === 'opportunity')
        .slice(0, 3 - result.length);
      for (const s of senalesRelevantes) {
        if (result.length >= 3) break;
        result.push({
          tipo: s.tipo === 'risk' ? 'atencion' : 'sugerencia',
          titulo: s.titulo,
          cuerpo: s.contextoMacromundo ?? '',
          cta: s.canLaunch ? 'Crear proyecto →' : 'Ver señales →',
          agente: 'ADA Spy sugiere',
          accion: s.canLaunch ? 'nuevo' : 'ver',
          destino: 'senales',
        });
      }
    }

    // 3. Fallback: check-ins del portafolio si no hay suficientes
    if (result.length < 3) {
      const checkins = this.galiCheckins().slice(0, 3 - result.length);
      for (const ci of checkins) {
        result.push({ ...ci, destino: 'senales' as const });
      }
    }

    return result.slice(0, 3);
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
  readonly editTab = signal<'mi-objetivo' | 'gali-sugiere' | 'sub-metas'>('gali-sugiere');
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

  readonly sugerencias = computed(() => {
    const actual = this.pedidosActual;
    const roas = (KPIS as any).roas_efectivo_global?.valor ?? 1.9;
    return [
      {
        id: 'A',
        titulo: `Llegar a ${Math.round(actual * 1.5)} ped/sem — factible en 6 semanas`,
        detalle: `Con tu ROAS actual (${roas}x) y optimizando el horario de pauta, este objetivo es ambicioso pero alcanzable.`,
        pedidos: Math.round(actual * 1.5),
        semanas: 6,
        factibilidad: 'verde' as const,
      },
      {
        id: 'B',
        titulo: `Objetivo conservador: ${Math.round(actual * 1.2)} ped/sem en 4 semanas`,
        detalle: 'Incremento gradual basado en tu ritmo actual. Ideal si prefieres estabilidad antes de escalar.',
        pedidos: Math.round(actual * 1.2),
        semanas: 4,
        factibilidad: 'verde' as const,
      },
    ];
  });

  readonly factibilidad = computed(() => {
    const meta = this.draftMeta();
    const actual = this.pedidosActual;
    if (meta <= actual * 1.6) return { label: '● Factible', clase: 'fact--verde' };
    if (meta <= actual * 2.5) return { label: '● Ambicioso pero posible', clase: 'fact--amarillo' };
    return { label: '● Muy ambicioso', clase: 'fact--rojo' };
  });

  usarSugerencia(s: { pedidos: number; semanas: number }): void {
    this.draftMeta.set(s.pedidos);
    this.draftPlazo.set(s.semanas);
    this.editTab.set('mi-objetivo');
  }

  setFilter(f: 'todos' | 'activos' | 'pausados' | 'borradores' | 'cerrados'): void {
    if (this.activeFilter() === f) return;
    this.portfolioVisible.set(false);
    this.activeFilter.set(f);
    // Double rAF ensures Angular removes DOM before re-inserting
    requestAnimationFrame(() => requestAnimationFrame(() => this.portfolioVisible.set(true)));
  }

  openEdit(): void {
    this.router.navigate(['/gali-6/mi-negocio']);
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

  // ── Salud portafolio V2 — 3 indicadores concretos ───────────────────
  readonly saludPortafolioV2 = computed(() => {
    const todos = this.proyectos();
    const activos = todos.filter(p => ['activo', 'en_escala'].includes(p.estado));
    const conCampana = activos.filter(p => p.campanaCount > 0);
    const enRiesgo = todos.filter(p => p.estado === 'en_riesgo');
    const total = todos.filter(p => !['cerrado', 'borrador'].includes(p.estado));

    // % campañas sobre objetivo ROAS (usando PROYECTOS_MOCK)
    const pvActivos = PROYECTOS_MOCK.filter(pv => ['activo', 'en_escala'].includes(pv.estado));
    const pvConCampana = pvActivos.filter(pv => pv.campanas.length > 0);
    const pvRoasOk = pvConCampana.filter(pv =>
      pv.campanas.some(c => (c.roasActual ?? 0) >= c.roasObjetivo)
    );
    const campanasPct = pvConCampana.length > 0
      ? Math.round((pvRoasOk.length / pvConCampana.length) * 100) : 0;

    // % presupuesto en proyectos alineados a meta
    const pvConMeta = PROYECTOS_MOCK.filter(pv => pv.subObjetivoId || pv.subObjetivo);
    const pvConPresupuesto = PROYECTOS_MOCK.filter(pv => pv.presupuestoTotal > 0);
    const presupuestoAlineado = pvConPresupuesto.length > 0
      ? Math.round((pvConMeta.filter(pv => pv.presupuestoTotal > 0).length / pvConPresupuesto.length) * 100) : 0;

    return {
      campanasPct,
      presupuestoAlineado,
      enRiesgo: enRiesgo.length,
      totalActivos: total.length,
      riesgoLabel: `${enRiesgo.length}/${total.length}`,
    };
  });

  // ── Modal de confirmación de pausa ───────────────────────────────────
  readonly pausaModalOpen = signal(false);
  readonly pausaTargetId = signal<string | null>(null);

  // ── Modal de pausa de campaña individual ─────────────────────────────
  readonly campanaPausaModalOpen = signal(false);
  readonly campanaEnPausaId = signal<string | null>(null);
  readonly campanaEnPausaProyectoId = signal<string | null>(null);

  readonly campanaEnPausaData = computed(() => {
    const campId = this.campanaEnPausaId();
    const proyId = this.campanaEnPausaProyectoId();
    if (!campId || !proyId) return null;
    const pv = PROYECTOS_MOCK.find(p => p.id === proyId);
    return pv?.campanas.find(c => c.id === campId) ?? null;
  });

  abrirModalPausaCampana(proyectoId: string, campanaId: string, event: Event): void {
    event.stopPropagation();
    this.campanaEnPausaProyectoId.set(proyectoId);
    this.campanaEnPausaId.set(campanaId);
    this.campanaPausaModalOpen.set(true);
  }

  confirmarPausaCampana(): void {
    const pv = PROYECTOS_MOCK.find(p => p.id === this.campanaEnPausaProyectoId());
    if (pv) {
      const c = pv.campanas.find(c => c.id === this.campanaEnPausaId());
      if (c) c.estado = 'pausada';
    }
    this.campanaPausaModalOpen.set(false);
    this.campanaEnPausaId.set(null);
    this.campanaEnPausaProyectoId.set(null);
    this.galiCambioMensaje.set('Campaña pausada. Gali dejará de optimizar hasta que la reactives.');
    setTimeout(() => this.galiCambioMensaje.set(null), 4000);
  }

  cancelarPausaCampana(): void {
    this.campanaPausaModalOpen.set(false);
    this.campanaEnPausaId.set(null);
    this.campanaEnPausaProyectoId.set(null);
  }

  // ── Métricas financieras por proyecto ────────────────────────────────
  presupuestoMes(proyId: string): number {
    const pv = PROYECTOS_MOCK.find(p => p.id === proyId);
    if (!pv) return 0;
    const activas = pv.campanas.filter(c => c.estado === 'activa');
    return activas.reduce((sum, c) => sum + (c.presupuestoDiario ?? 0) * 30, 0);
  }

  gananciaMes(proyId: string): number {
    const pv = PROYECTOS_MOCK.find(p => p.id === proyId);
    if (!pv) return 0;
    const activas = pv.campanas.filter(c => c.estado === 'activa');
    return activas.reduce((sum, c) => sum + ((c.presupuestoDiario ?? 0) * 30 * (c.roasActual ?? 0)), 0);
  }

  utilidadEstimadaMes(proyId: string): number {
    const pv = PROYECTOS_MOCK.find(p => p.id === proyId);
    return (pv as any)?.utilidadEstimadaMes ?? 0;
  }

  utilidadRealMes(proyId: string): number {
    const pv = PROYECTOS_MOCK.find(p => p.id === proyId);
    return (pv as any)?.utilidadRealMes ?? 0;
  }

  formatCOP(val: number): string {
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return '$' + Math.round(val / 1000) + 'k';
    return '$' + val.toLocaleString('es-CO');
  }

  accionesAgentes(proyId: string): any[] {
    const pv = PROYECTOS_MOCK.find(p => p.id === proyId);
    return (pv as any)?.accionesAgentes ?? [];
  }

  ctasParaTipo(tipo: string | undefined): { id: string; icon: string; label: string }[] {
    const mapa: Record<string, { id: string; icon: string; label: string }[]> = {
      optimizar: [
        { id: 'margenes', icon: '📊', label: 'Analizar márgenes del portafolio' },
        { id: 'cerrar', icon: '🔍', label: 'Identificar productos a cerrar' },
        { id: 'precios', icon: '💰', label: 'Revisar precios vs competencia' },
      ],
      operacion: [
        { id: 'integraciones', icon: '🔗', label: 'Revisar integraciones activas' },
        { id: 'automatizaciones', icon: '⚙️', label: 'Ver automatizaciones' },
      ],
      negociacion: [
        { id: 'historial', icon: '📋', label: 'Ver historial con proveedor' },
        { id: 'condiciones', icon: '🤝', label: 'Solicitar nuevas condiciones' },
      ],
      experimentar: [
        { id: 'precio', icon: '🧪', label: 'Crear experimento de precio' },
        { id: 'angulo', icon: '🎯', label: 'Testear nuevo ángulo' },
      ],
    };
    return mapa[tipo ?? ''] ?? [];
  }

  readonly campanasPausarPreview = computed(() => {
    const id = this.pausaTargetId();
    if (!id) return [];
    const pv = PROYECTOS_MOCK.find(p => p.id === id);
    if (!pv) return [];
    return pv.campanas.filter(c => c.estado === 'activa');
  });

  readonly campanasChateaEnPausa = computed(() =>
    this.campanasPausarPreview().filter(c => c.tipoCampana === 'chatea')
  );

  abrirModalPausa(proyectoId: string, event: Event): void {
    event.stopPropagation();
    this.pausaTargetId.set(proyectoId);
    this.pausaModalOpen.set(true);
  }

  confirmarPausa(): void {
    // En producción: llamar al API para pausar el proyecto y sus campañas de ads
    this.pausaModalOpen.set(false);
    this.pausaTargetId.set(null);
  }

  cancelarPausa(): void {
    this.pausaModalOpen.set(false);
    this.pausaTargetId.set(null);
  }

  // ── Campañas accordion ────────────────────────────────────────────────
  readonly expandedCampanas = signal<Set<string>>(new Set());

  toggleCampanas(proyectoId: string, event: Event): void {
    event.stopPropagation();
    this.expandedCampanas.update(set => {
      const next = new Set(set);
      if (next.has(proyectoId)) next.delete(proyectoId);
      else next.add(proyectoId);
      return next;
    });
  }

  isCampanasExpanded(proyectoId: string): boolean {
    return this.expandedCampanas().has(proyectoId);
  }

  getCampanas(proyectoId: string): any[] {
    const fromMock = MOCK_CAMPANAS.filter(c => c.proyectoId === proyectoId);
    if (fromMock.length > 0) return fromMock;
    // fallback a campanas embebidas en PROYECTOS_MOCK
    const pv = PROYECTOS_MOCK.find(p => p.id === proyectoId);
    return (pv?.campanas ?? []).map(c => ({
      ...c,
      productos: c.productos ?? [],
      roasActualLabel: c.roasActual != null ? `${c.roasActual}x` : null,
    }));
  }

  getSignalCount(proyectoId: string): number {
    const senalId = PROYECTO_SENAL_MAP[proyectoId];
    if (!senalId) return 0;
    const senales = MOCK_SENALES.filter(s => s.proyectoId === senalId && s.tipo !== 'completed').length;
    const alertas = MOCK_ALERTAS.filter(a => a.proyectoId === senalId).length;
    return senales + alertas;
  }

  getProyectoSenalId(proyectoId: string): string | null {
    return PROYECTO_SENAL_MAP[proyectoId] ?? null;
  }

  getCampanaEstadoLabel(estado: string): string {
    return ({ activa: 'Activa', pausada: 'Pausada', borrador: 'Borrador', cerrada: 'Cerrada' } as Record<string, string>)[estado] ?? estado;
  }

  nuevaCampana(proyectoId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/gali-6/proyectos/nuevo'], { queryParams: { proyectoId, modo: 'campana' } });
  }

  // ── Helpers de tipo de proyecto ──────────────────────────────────────
  proyectoTipoLabel(tipo: TipoProyecto | undefined | null): string {
    const map: Record<TipoProyecto, string> = {
      lanzar: '🚀 Lanzar', escalar: '📈 Escalar', optimizar: '🔧 Optimizar',
      crm: '💬 CRM', experimentar: '🧪 Exp.',
      operacion: '⚙️ Operación', negociacion: '🤝 Negociación',
    };
    return tipo ? (map[tipo] ?? tipo) : '';
  }

  // ── Acciones de estado ───────────────────────────────────────────────
  reactivarProyecto(proyectoId: string, event: Event): void {
    event.stopPropagation();
    const pv = PROYECTOS_MOCK.find(p => p.id === proyectoId);
    if (pv) { pv.estado = 'activo'; (pv as any).pausaLog = undefined; }
  }

  cerrarProyecto(proyectoId: string, event: Event): void {
    event.stopPropagation();
    const pv = PROYECTOS_MOCK.find(p => p.id === proyectoId);
    if (pv) pv.estado = 'cerrado';
  }

  pedirCierre(id: string, event: Event): void {
    event.stopPropagation();
    this.pendientesCierre.update(s => new Set([...s, id]));
    setTimeout(() => this.cancelarCierre(id), 5000);
  }

  cancelarCierre(id: string, event?: Event): void {
    event?.stopPropagation();
    this.pendientesCierre.update(s => { const n = new Set(s); n.delete(id); return n; });
  }

  confirmarCierre(id: string, event: Event): void {
    event.stopPropagation();
    this.cerrarProyecto(id, event);
    this.cancelarCierre(id);
    this.galiCambioMensaje.set('Proyecto cerrado. Los datos históricos se conservan en tu portafolio.');
    setTimeout(() => this.galiCambioMensaje.set(null), 4000);
  }

  descartarBorrador(id: string, event: Event): void {
    event.stopPropagation();
    // Borradores del wizard (localStorage)
    try {
      const extra: any[] = JSON.parse(localStorage.getItem('g6_proyectos_extra') ?? '[]');
      const actualizado = extra.filter(p => p.id !== id);
      localStorage.setItem('g6_proyectos_extra', JSON.stringify(actualizado));
    } catch { /* noop */ }
    // Borradores del mock legacy (PROYECTOS_MOCK)
    const pv = PROYECTOS_MOCK.find(p => p.id === id);
    if (pv) pv.estado = 'cerrado';
    this.galiCambioMensaje.set('Borrador descartado.');
    setTimeout(() => this.galiCambioMensaje.set(null), 3000);
  }

  pedirPausa(id: string, event: Event): void {
    event.stopPropagation();
    this.pausaTargetId.set(id);
    this.pausaModalOpen.set(true);
  }

  // ── Navegación ────────────────────────────────────────────────────────
  abrir(id: string): void { this.router.navigate(['/gali-6/proyecto', id]); }
  nuevo(): void { this.router.navigate(['/gali-6/proyectos/nuevo']); }

  handleCheckinCta(ci: GaliCheckin | AlertaUnificada): void {
    const a = ci as AlertaUnificada;
    if (a.destino === 'conexiones') {
      this.router.navigate(['/gali-6/conexiones']); return;
    }
    if (a.destino === 'agente') {
      this.router.navigate(['/gali-6/agentes'], { queryParams: { highlight: a.agenteId ?? '' } }); return;
    }
    if (a.destino === 'campana' && a.proyectoId && a.campanaId) {
      this.router.navigate(['/gali-6/proyecto', a.proyectoId, 'campana', a.campanaId]); return;
    }
    if ((ci as GaliCheckin).accion === 'nuevo') { this.nuevo(); return; }
    if ((ci as GaliCheckin).accion === 'ver' && ci.proyectoId) { this.abrir(ci.proyectoId!); return; }
    this.router.navigate(['/gali-6/senales']);
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

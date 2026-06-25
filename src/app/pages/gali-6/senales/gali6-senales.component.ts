import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import {
  MOCK_SENALES,
  MOCK_ALERTAS,
  GaliSignal,
  GaliAlerta,
  SignalFuenteTipo,
} from '../../../../../mocks/gali-v5/senales.mock';
import { SenalDetalleComponent, SelectedItem } from '../../gali-5/gali-v5/pages/senales/senal-detalle/senal-detalle.component';
import { ConfirmActionModalComponent, ConfirmActionConfig } from '../../gali-5/gali-v5/components/shared';
import {
  AGENTES_ESPECIALIZADOS,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
} from '../../../../../mocks/gali-v6/agentes-especializados';

type SignalFiltro = 'todas' | 'dato-real' | 'analisis-ia' | 'alertas';
type AgenteFiltro = 'todos' | string;

@Component({
  selector: 'app-gali6-senales',
  standalone: true,
  imports: [CommonModule, TooltipModule, SenalDetalleComponent, ConfirmActionModalComponent],
  templateUrl: './gali6-senales.component.html',
  styleUrls: ['./gali6-senales.component.scss'],
})
export class Gali6SenalesComponent implements OnInit {
  readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  // ─────────────────────────────────────────────────────────────
  // Estado de tabs y filtros
  // ─────────────────────────────────────────────────────────────

  signalFiltro = signal<SignalFiltro>('todas');
  agenteFiltro = signal<AgenteFiltro>('todos');
  proyectoFiltro = signal<string | null>(null);
  selectedId = signal<string | null>(null);
  highlightId = signal<string | null>(null);
  accionesTomadas = signal<Set<string>>(new Set());

  // ─────────────────────────────────────────────────────────────
  // Datos
  // ─────────────────────────────────────────────────────────────

  readonly todasSenales = MOCK_SENALES;
  readonly todasAlertas = MOCK_ALERTAS;
  readonly agentesEspecializados = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;


  // ─────────────────────────────────────────────────────────────
  // Computed: señales y alertas filtradas
  // ─────────────────────────────────────────────────────────────

  private senalesBase = computed(() => {
    const pf = this.proyectoFiltro();
    let items = this.todasSenales.filter(s => s.tipo !== 'completed');
    if (pf) items = items.filter(s => !s.proyectoId || s.proyectoId === pf);
    return items;
  });

  private alertasBase = computed(() => {
    const pf = this.proyectoFiltro();
    if (!pf) return this.todasAlertas;
    return this.todasAlertas.filter(a => !a.proyectoId || a.proyectoId === pf);
  });

  senalesVisibles = computed(() => {
    const filtro = this.signalFiltro();
    const agente = this.agenteFiltro();
    let items = this.senalesBase();

    if (filtro === 'dato-real') items = items.filter(s => s.fuente === 'deterministico');
    else if (filtro === 'analisis-ia') items = items.filter(s => s.fuente === 'ia');
    else if (filtro === 'alertas') return [];

    if (agente !== 'todos') items = items.filter(s => s.agenteOrigenId === agente);

    // Priorizar: menos días restantes primero (más urgente)
    return [...items].sort((a, b) => a.ventanaDias - b.ventanaDias);
  });

  alertasVisibles = computed(() => {
    let items = this.alertasBase();
    const filtro = this.signalFiltro();

    if (filtro === 'dato-real') items = items.filter(a => a.fuente === 'deterministico');
    else if (filtro === 'analisis-ia') items = items.filter(a => a.fuente === 'ia');

    const agente = this.agenteFiltro();
    if (agente !== 'todos') items = items.filter(a => a.agenteOrigenId === agente);

    if (filtro === 'analisis-ia' || filtro === 'dato-real') {
      return [...items].sort((a, b) => (a.tipo === 'critical' ? 0 : 1) - (b.tipo === 'critical' ? 0 : 1));
    }

    // Priorizar: críticas primero, luego warning
    return [...items].sort((a, b) => {
      const prioA = a.tipo === 'critical' ? 0 : 1;
      const prioB = b.tipo === 'critical' ? 0 : 1;
      return prioA - prioB;
    });
  });

  totalActivas = computed(() => this.senalesVisibles().length + this.alertasVisibles().length);

  selectedItem = computed<SelectedItem | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    const senal = this.senalesVisibles().find(s => s.id === id);
    if (senal) return { kind: 'senal', data: senal };
    const alerta = this.alertasVisibles().find(a => a.id === id);
    if (alerta) return { kind: 'alerta', data: alerta };
    // Buscar en todas si no está en vista filtrada (selección por deeplink)
    const senalAll = this.todasSenales.find(s => s.id === id);
    if (senalAll) return { kind: 'senal', data: senalAll };
    const alertaAll = this.todasAlertas.find(a => a.id === id);
    if (alertaAll) return { kind: 'alerta', data: alertaAll };
    return null;
  });

  isAlertSelected = computed(() => this.selectedItem()?.kind === 'alerta');

  // ─────────────────────────────────────────────────────────────
  // Filtros de UI
  // ─────────────────────────────────────────────────────────────

  readonly filtroTabs = [
    { value: 'todas' as SignalFiltro,       label: 'Todas',                icon: 'pi-list' },
    { value: 'alertas' as SignalFiltro,     label: 'Alertas',              icon: 'pi-bell' },
    { value: 'analisis-ia' as SignalFiltro, label: 'Predicciones de Gali', icon: 'pi-eye' },
    { value: 'dato-real' as SignalFiltro,   label: 'De mis pedidos',       icon: 'pi-chart-bar' },
  ];

  /** Agentes únicos que han generado señales */
  agentesConSenales = computed(() => {
    const ids = new Set([
      ...this.todasSenales.map(s => s.agenteOrigenId).filter(Boolean) as string[],
      ...this.todasAlertas.map(a => a.agenteOrigenId).filter(Boolean) as string[],
    ]);
    return this.agentesEspecializados.filter(a => ids.has(a.id));
  });

  // ─────────────────────────────────────────────────────────────
  // Toast de ejecución
  // ─────────────────────────────────────────────────────────────

  toastVisible = signal(false);
  toastMsg = signal('');

  private mostrarToast(msg: string, senalId?: string): void {
    this.toastMsg.set(msg);
    this.toastVisible.set(true);
    if (senalId) {
      this.accionesTomadas.update(set => new Set([...set, senalId]));
    }
    setTimeout(() => this.toastVisible.set(false), 4500);
  }

  // ─────────────────────────────────────────────────────────────
  // Modal de confirmación
  // ─────────────────────────────────────────────────────────────

  showConfirmModal = signal(false);
  confirmConfig = signal<ConfirmActionConfig | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    const signalId = params.get('signalId');
    const projectId = params.get('projectId');

    if (projectId) this.proyectoFiltro.set(projectId);

    if (signalId) {
      this.selectedId.set(signalId);
      this.highlightId.set(signalId);
      setTimeout(() => this.highlightId.set(null), 3000);
    } else {
      this.seleccionarPrimero();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Handlers de estado
  // ─────────────────────────────────────────────────────────────

  setFiltro(f: SignalFiltro) {
    this.signalFiltro.set(f);
    this.seleccionarPrimero();
  }

  setAgenteFiltro(id: AgenteFiltro) {
    this.agenteFiltro.set(id);
    this.seleccionarPrimero();
  }

  selectSignal(id: string) { this.selectedId.set(id); }
  selectAlert(id: string) { this.selectedId.set(id); }

  private seleccionarPrimero() {
    const primeraSenal = this.senalesVisibles()[0];
    const primeraAlerta = this.alertasVisibles()[0];
    this.selectedId.set(primeraSenal?.id ?? primeraAlerta?.id ?? null);
  }

  // ─────────────────────────────────────────────────────────────
  // Handlers de CTA
  // ─────────────────────────────────────────────────────────────

  private readonly toastsPorSenal: Record<string, string> = {
    'sen-001': 'ROAS Tracker está escalando la pauta de Collar GPS a $86k/día — verás el resultado en 24h',
    'sen-003': 'Roax está actualizando la segmentación — Medellín agregada a tu campaña de K-Beauty',
    'sen-005': 'Roax reactivó Bandas de Fitness con $20k/día',
    'sen-006': 'Proyecto Cali en preparación. Roax generará el primer creative esta semana.',
    'sen-007': 'Creative B activado. Roax pausó el creative saturado automáticamente.',
  };

  onCtaPrimario(item: SelectedItem) {
    if (item.kind === 'alerta') {
      if (item.data.tipo === 'critical' || item.data.tipo === 'warning') {
        this.abrirModalConfirmacion(item.data);
      }
      return;
    }
    // Señales que navegan directamente a una vista de Gali 6
    const navPrimario: Record<string, () => void> = {
      'sen-002': () => this.router.navigate(['/gali-6/productos/catalogo'], { queryParams: { q: 'difusor aromaterapia' } }),
      'sen-004': () => this.router.navigate(['/gali-6/productos/proveedores'], { queryParams: { categoria: 'mascotas' } }),
    };
    if (navPrimario[item.data.id]) {
      navPrimario[item.data.id]();
      return;
    }
    // Señales con canLaunch → crear proyecto
    if (item.data.canLaunch) {
      this.router.navigate(['/gali-6/proyectos/nuevo'], { queryParams: { signalId: item.data.id } });
      return;
    }
    // Resto → toast de confirmación de ejecución
    const msg = this.toastsPorSenal[item.data.id] ??
      `✦ Gali está procesando — ${item.data.agenteOrigenNombre ?? item.data.agente} te notificará en minutos`;
    this.mostrarToast(msg, item.data.id);
  }

  onCtaSecundario(item: SelectedItem) {
    const id = item.data.id;
    const rutas: Record<string, () => void> = {
      // Señales
      'sen-001': () => this.router.navigate(['/gali-6/reportes/dashboard']),
      'sen-002': () => this.router.navigate(['/gali-6/proyectos/nuevo'], { queryParams: { signalId: 'sen-002' } }),
      'sen-003': () => this.router.navigate(['/gali-6/marketing/roax-informes']),
      'sen-004': () => this.router.navigate(['/gali-6/productos/proveedores'], { queryParams: { categoria: 'mascotas' } }),
      'sen-005': () => this.router.navigate(['/gali-6/proyectos']),
      'sen-006': () => this.router.navigate(['/gali-6/reportes/dashboard']),
      'sen-007': () => this.router.navigate(['/gali-6/marketing/roax-informes']),
      // Alertas
      'alt-001': () => this.router.navigate(['/gali-6/mis-pedidos/mis-pedidos']),
      'alt-002': () => this.router.navigate(['/gali-6/financiero/historial-de-cartera']),
      'alt-003': () => this.router.navigate(['/gali-6/marketing/roax-informes']),
      'alt-004': () => this.router.navigate(['/gali-6/productos/proveedores']),
      'alt-005': () => this.router.navigate(['/gali-6/marketing/roax-informes']),
    };
    const navFn = rutas[id];
    if (navFn) {
      navFn();
    } else {
      this.mostrarToast('Abriendo análisis completo...');
    }
  }

  irADashboard() {
    this.router.navigate(['/gali-6/reportes/dashboard']);
  }

  onIgnorar(item: SelectedItem) {
    this.selectedId.set(null);
    console.log('Señal ignorada:', item.data.id);
  }

  onGuardarDespues(_item: SelectedItem) {}

  onOpcionElegida(event: { alertaId: string; opcionId: string }) {
    console.log('Opción elegida:', event.alertaId, '→', event.opcionId);
  }

  onConfirmAlerta() {
    this.showConfirmModal.set(false);
    this.confirmConfig.set(null);
  }

  onCancelAlerta() {
    this.showConfirmModal.set(false);
    this.confirmConfig.set(null);
  }

  // ─────────────────────────────────────────────────────────────
  // Helpers de UI
  // ─────────────────────────────────────────────────────────────

  getTipoIconClass(tipo: string): string {
    return ({
      scale:       'pi-arrow-up-right',
      trend:       'pi-chart-line',
      opportunity: 'pi-star',
      risk:        'pi-exclamation-triangle',
      completed:   'pi-check-circle',
    } as Record<string, string>)[tipo] ?? 'pi-circle';
  }

  /** @deprecated use getTipoIconClass */
  getTipoIcon(tipo: string): string { return this.getTipoIconClass(tipo); }

  getFuenteLabel(fuente: SignalFuenteTipo): string {
    return fuente === 'deterministico' ? 'De tus pedidos' : 'Predicción de Gali';
  }

  getFuenteClass(fuente: SignalFuenteTipo): string {
    return fuente === 'deterministico' ? 'chip-fuente--deterministic' : 'chip-fuente--ia';
  }

  getFuenteTooltip(fuente: SignalFuenteTipo): string {
    return fuente === 'deterministico'
      ? 'Calculado desde tus pedidos y datos reales en Dropi — 100% confiable.'
      : 'Predicción de Gali basada en tendencias — contrasta con tus métricas antes de actuar.';
  }

  private abrirModalConfirmacion(alerta: GaliAlerta) {
    this.confirmConfig.set({
      titulo: alerta.titulo,
      descripcion: alerta.descripcion,
      impacto: alerta.impacto,
      pedidosAfectados: alerta.pedidosAfectados ?? undefined,
      ctaLabel: alerta.ctaPrincipal,
      cancelLabel: 'Cancelar',
      variant: alerta.tipo === 'critical' ? 'critical' : 'warning',
    });
    this.showConfirmModal.set(true);
  }
}

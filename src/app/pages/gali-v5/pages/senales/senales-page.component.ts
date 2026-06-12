import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MOCK_SENALES,
  MOCK_ALERTAS,
  GaliSignal,
  GaliAlerta,
} from '../../../../../../mocks/gali-v5/senales.mock';
import { SenalDetalleComponent, SelectedItem } from './senal-detalle/senal-detalle.component';
import { ConfirmActionModalComponent, ConfirmActionConfig } from '../../components/shared';

type FilterTab = 'todas' | 'senales' | 'alertas' | 'completadas';

@Component({
  selector: 'app-senales-page',
  standalone: true,
  imports: [CommonModule, SenalDetalleComponent, ConfirmActionModalComponent],
  templateUrl: './senales-page.component.html',
  styleUrls: ['./senales-page.component.scss'],
})
export class SenalesPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly senales = MOCK_SENALES;
  readonly alertas = MOCK_ALERTAS;

  activeFilter = signal<FilterTab>('todas');
  selectedId = signal<string | null>(null);

  // ──────────────────────────────────────────────────────────
  // Computed: listas visibles según filtro activo
  // ──────────────────────────────────────────────────────────

  senalesActivas = computed(() => this.senales.filter(s => s.tipo !== 'completed'));
  alertasActivas = computed(() => this.alertas);

  senalesVisibles = computed(() => {
    if (this.activeFilter() === 'alertas') return [];
    if (this.activeFilter() === 'completadas') return this.senales.filter(s => s.tipo === 'completed');
    return this.senales.filter(s => s.tipo !== 'completed');
  });

  alertasVisibles = computed(() => {
    if (this.activeFilter() === 'senales' || this.activeFilter() === 'completadas') return [];
    return this.alertas;
  });

  // ──────────────────────────────────────────────────────────
  // Computed: ítem seleccionado
  // ──────────────────────────────────────────────────────────

  readonly highlightId = signal<string | null>(null);

  selectedItem = computed<SelectedItem | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    const senal = this.senalesVisibles().find(s => s.id === id);
    if (senal) return { kind: 'senal', data: senal };
    const alerta = this.alertasVisibles().find(a => a.id === id);
    if (alerta) return { kind: 'alerta', data: alerta };
    return null;
  });

  isAlertSelected = computed(() => this.selectedItem()?.kind === 'alerta');

  // ──────────────────────────────────────────────────────────
  // Tabs de filtro con conteos reactivos
  // ──────────────────────────────────────────────────────────

  filterTabs = [
    { value: 'todas' as FilterTab, label: 'Todas', count: computed(() => this.senalesActivas().length + this.alertasActivas().length) },
    { value: 'senales' as FilterTab, label: 'Señales', count: computed(() => this.senalesActivas().length) },
    { value: 'alertas' as FilterTab, label: 'Alertas', count: computed(() => this.alertasActivas().length) },
    { value: 'completadas' as FilterTab, label: 'Completadas', count: computed(() => this.senales.filter(s => s.tipo === 'completed').length) },
  ];

  // ──────────────────────────────────────────────────────────
  // Modal de confirmación
  // ──────────────────────────────────────────────────────────

  showConfirmModal = signal(false);
  confirmConfig = signal<ConfirmActionConfig | null>(null);

  // ──────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    const filtroParam = params.get('filtro') as FilterTab | null;
    const signalId = params.get('signalId');

    if (filtroParam && ['todas', 'senales', 'alertas', 'completadas'].includes(filtroParam)) {
      this.activeFilter.set(filtroParam);
    }

    if (signalId) {
      this.selectedId.set(signalId);
      this.highlightId.set(signalId);
      // Clear highlight after animation completes
      setTimeout(() => this.highlightId.set(null), 3000);
    } else {
      const primeraSenal = this.senalesVisibles()[0];
      const primeraAlerta = this.alertasVisibles()[0];
      this.selectedId.set(primeraSenal?.id ?? primeraAlerta?.id ?? null);
    }
  }

  // ──────────────────────────────────────────────────────────
  // Handlers de selección
  // ──────────────────────────────────────────────────────────

  setFilter(f: FilterTab) {
    this.activeFilter.set(f);
    const primeraSenal = this.senalesVisibles()[0];
    const primeraAlerta = this.alertasVisibles()[0];
    this.selectedId.set(primeraSenal?.id ?? primeraAlerta?.id ?? null);
  }

  selectSignal(id: string) { this.selectedId.set(id); }
  selectAlert(id: string) { this.selectedId.set(id); }

  // ──────────────────────────────────────────────────────────
  // Handlers de CTA desde el panel detalle
  // ──────────────────────────────────────────────────────────

  onCtaPrimario(item: SelectedItem) {
    if (item.kind === 'alerta' && item.data.tipo === 'critical') {
      this.abrirModalConfirmacion(item.data);
    } else {
      console.log('CTA primario:', item.data.id);
    }
  }

  onCtaSecundario(item: SelectedItem) {
    console.log('CTA secundario:', item.data.id);
  }

  onLanzar() {
    const selected = this.selectedItem();
    if (selected) {
      this.router.navigate(['/gali-v5/proyectos/nuevo'], {
        queryParams: { signalId: selected.data.id }
      });
    } else {
      this.router.navigate(['/gali-v5/proyectos/nuevo']);
    }
  }

  onOperar() {
    this.activeFilter.set('alertas');
    const primeraAlerta = this.alertasVisibles()[0];
    if (primeraAlerta) this.selectedId.set(primeraAlerta.id);
  }

  onMedir() {
    const selected = this.selectedItem();
    this.router.navigate(['/gali-v5/home'], {
      queryParams: { openGali: 'kronos', signalId: selected?.data.id ?? null }
    });
  }

  onIgnorar(item: SelectedItem) {
    console.log('Señal ignorada:', item.data.id);
    this.selectedId.set(null);
  }

  onGuardarDespues(item: SelectedItem) {
    console.log('Guardado para después:', item.data.id);
  }

  onConfirmAlerta() {
    const cfg = this.confirmConfig();
    if (cfg) console.log('Acción confirmada:', cfg.titulo);
    this.showConfirmModal.set(false);
    this.confirmConfig.set(null);
  }

  onCancelAlerta() {
    this.showConfirmModal.set(false);
    this.confirmConfig.set(null);
  }

  // ──────────────────────────────────────────────────────────
  // Helpers de UI
  // ──────────────────────────────────────────────────────────

  getTipoIcon(tipo: string): string {
    const icons: Record<string, string> = {
      scale: '⚡',
      trend: '🔭',
      opportunity: '💎',
      risk: '⚠️',
      completed: '✅',
    };
    return icons[tipo] ?? '•';
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

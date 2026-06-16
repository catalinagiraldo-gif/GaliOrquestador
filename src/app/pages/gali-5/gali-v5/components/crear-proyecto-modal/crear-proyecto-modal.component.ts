import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import PROJECTS from '../../../../../../../mocks/gali-v5/projects.json';

interface AgentOption {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
  color: string;
  preseleccionado: boolean;
}

@Component({
  selector: 'crear-proyecto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proyecto-modal.component.html',
  styleUrl: './crear-proyecto-modal.component.scss',
})
export class CrearProyectoModalComponent {
  private router = inject(Router);
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();

  // Wizard state
  readonly step = signal<1 | 2 | 3 | 4>(1);
  readonly productQuery = signal('');
  readonly projectName = signal('');
  readonly selectedProduct = signal<{ id: string; name: string; stock: number; proveedor: string; score: number } | null>(null);

  // Calculadora Brújula (C4)
  readonly costoProd     = signal<number>(0);
  readonly fleteEstimado = signal<number>(0);
  readonly precioSlider  = signal<number>(0);
  readonly presupuesto   = signal<number>(0);
  readonly precioVenta   = signal<number>(0);

  readonly MARGEN_MINIMO   = 0.15;
  readonly MARGEN_OBJETIVO = 0.40;

  readonly costoTotal = computed(() => this.costoProd() + this.fleteEstimado());

  readonly precioMinimo = computed(() => {
    const ct = this.costoTotal();
    if (ct === 0) return 0;
    return Math.ceil(ct / (1 - this.MARGEN_MINIMO));
  });

  readonly precioRecomendado = computed(() => {
    const ct = this.costoTotal();
    if (ct === 0) return 0;
    return Math.ceil(ct / (1 - this.MARGEN_OBJETIVO));
  });

  readonly margenProyectado = computed(() => {
    const precio = this.precioSlider();
    const ct = this.costoTotal();
    if (precio === 0 || ct >= precio) return 0;
    return Math.round(((precio - ct) / precio) * 100);
  });

  readonly margenClass = computed(() => {
    const m = this.margenProyectado();
    if (m >= 40) return 'margen--ok';
    if (m >= 20) return 'margen--warn';
    return 'margen--danger';
  });

  readonly margenLabel = computed(() => {
    const m = this.margenProyectado();
    if (m >= 40) return `${m}% — Excelente`;
    if (m >= 20) return `${m}% — Mínimo viable`;
    return `${m}% — Bajo riesgo`;
  });

  onCostoChange(): void {
    if (this.precioRecomendado() > 0) {
      this.precioSlider.set(this.precioRecomendado());
    }
  }

  usarPrecioRecomendado(): void {
    this.precioSlider.set(this.precioRecomendado());
    this.precioVenta.set(this.precioRecomendado());
  }

  // Presupuesto sugerido (C5)
  readonly roasHistorico = computed(() => {
    const activos = (PROJECTS as any[]).filter(p =>
      p.estado === 'activo' || p.estado === 'en_escala'
    );
    if (!activos.length) return 2.0;
    const suma = activos.reduce((acc: number, p: any) => acc + (p.roas_real ?? 2.0), 0);
    return suma / activos.length;
  });

  readonly pedidosObjetivo = signal<number>(30);

  readonly presupuestoSugerido = computed(() => {
    const p = this.precioVenta();
    const roas = this.roasHistorico();
    const obj = this.pedidosObjetivo();
    if (!p || !roas || !obj) return 0;
    return Math.ceil((obj * p) / roas / 7);
  });

  usarPresupuestoSugerido(): void {
    this.presupuesto.set(this.presupuestoSugerido());
  }

  // Agentes (C9)
  readonly AGENTES_DISPONIBLES: AgentOption[] = [
    {
      id: 'roax',
      nombre: 'Roax',
      rol: 'Campañas y pauta',
      descripcion: 'Optimiza tus campañas de Meta Ads automáticamente. Escala cuando hay ROAS y pausa cuando baja.',
      color: '#f49a3d',
      preseleccionado: true,
    },
    {
      id: 'vigilante',
      nombre: 'Vigilante',
      rol: 'Novedades y logística',
      descripcion: 'Monitorea novedades de entrega y cambia de transportadora cuando detecta patrones de falla.',
      color: '#22c55e',
      preseleccionado: false,
    },
    {
      id: 'kronos',
      nombre: 'Kronos',
      rol: 'Finanzas y P&L',
      descripcion: 'Lleva el registro de ganancias y pérdidas reales. Te avisa cuando el margen cae por debajo del objetivo.',
      color: '#60a5fa',
      preseleccionado: false,
    },
    {
      id: 'ada',
      nombre: 'ADA Spy',
      rol: 'Investigación de productos',
      descripcion: 'Analiza tendencias del mercado para identificar productos con alta demanda y baja competencia.',
      color: '#a78bfa',
      preseleccionado: false,
    },
    {
      id: 'chatea',
      nombre: 'Chatea Pro',
      rol: 'Atención al cliente',
      descripcion: 'Responde preguntas frecuentes de compradores en WhatsApp y escala los casos complejos.',
      color: '#34d399',
      preseleccionado: false,
    },
  ];

  readonly agentesSeleccionados = signal<Set<string>>(new Set(['roax']));

  toggleAgente(id: string): void {
    this.agentesSeleccionados.update(sel => {
      const nuevo = new Set(sel);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  }

  isAgenteSeleccionado(id: string): boolean {
    return this.agentesSeleccionados().has(id);
  }

  // C10 — Confirmación antes de lanzar
  readonly showConfirmLaunch = signal(false);

  confirmAndLaunch(): void {
    this.showConfirmLaunch.set(false);
    this.lanzarProyecto();
  }

  // H3 — Draft en localStorage (persiste si el wizard se cierra)
  private readonly DRAFT_KEY = 'gali_proyecto_draft';

  saveDraftToStorage(): void {
    const draft = {
      productQuery: this.productQuery(),
      projectName: this.projectName(),
      selectedProductId: this.selectedProduct()?.id ?? null,
      costoProd: this.costoProd(),
      fleteEstimado: this.fleteEstimado(),
      presupuesto: this.presupuesto(),
      precioVenta: this.precioVenta(),
      step: this.step(),
    };
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
  }

  private restoreDraftIfExists(): void {
    try {
      const raw = localStorage.getItem(this.DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.projectName) this.projectName.set(d.projectName);
      if (d.productQuery) this.productQuery.set(d.productQuery);
      if (d.costoProd) this.costoProd.set(d.costoProd);
      if (d.fleteEstimado) this.fleteEstimado.set(d.fleteEstimado);
      if (d.presupuesto) this.presupuesto.set(d.presupuesto);
      if (d.precioVenta) this.precioVenta.set(d.precioVenta);
      if (d.selectedProductId) {
        const found = this.suggestedProducts.find(p => p.id === d.selectedProductId) ?? null;
        if (found) this.selectedProduct.set(found);
      }
    } catch {}
  }

  // Lanzamiento animado (C6)
  readonly lanzando   = signal(false);
  readonly lanzandoProgress = signal(0);

  readonly suggestedProducts = [
    { id: 'collar',   name: 'Collar GPS para mascotas',    stock: 847, proveedor: 'PetStore Colombia', score: 87 },
    { id: 'difusor',  name: 'Difusor Aromaterapia Premium', stock: 312, proveedor: 'HomeStore',        score: 74 },
    { id: 'reloj',    name: 'Reloj Smartwatch Pro X7',      stock: 156, proveedor: 'TechDropper',      score: 61 },
  ];

  constructor() {
    this.restoreDraftIfExists();
  }

  close(): void {
    this.saveDraftToStorage();
    this.closed.emit();
  }

  goToNuevoProyecto(): void {
    this.closed.emit();
    this.router.navigate(['/gali-v5/proyectos/nuevo']);
  }

  lanzarProyecto(): void {
    this.lanzando.set(true);
    this.lanzandoProgress.set(0);

    const intervalo = setInterval(() => {
      this.lanzandoProgress.update(v => {
        if (v >= 100) {
          clearInterval(intervalo);
          this.finalizarLanzamiento();
          return 100;
        }
        return v + 5;
      });
    }, 100);
  }

  private finalizarLanzamiento(): void {
    const nuevoId = this.generarProyectoId();
    localStorage.removeItem(this.DRAFT_KEY);
    setTimeout(() => {
      this.lanzando.set(false);
      this.created.emit(nuevoId);
      this.closed.emit();
      this.router.navigate(['/gali-v5/proyectos', nuevoId]);
    }, 300);
  }

  private generarProyectoId(): string {
    const nombre = this.projectName().toLowerCase().replace(/\s+/g, '-') || 'nuevo-proyecto';
    return `${nombre}-${Date.now()}`;
  }

  launchNow(): void {
    this.lanzarProyecto();
  }

  saveDraft(): void {
    this.closed.emit();
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getObjetivo, G6Objetivo, TIPO_LABEL } from '../../../../../mocks/gali-v6/objetivo';

type Step = 'producto' | 'brujula' | 'presupuesto' | 'lanzar';

interface ProductoOption {
  id: string;
  nombre: string;
  categoria: string;
  adaScore: number;
  margenEst: string;
  stockLabel: string;
  tendencia: string;
  pedidosEstSem: number;
  costoBase: number;
  fleteBase: number;
}

const ADA_PRODUCTOS: ProductoOption[] = [
  { id: 'difusor-v2', nombre: 'Difusor de aromaterapia ultrasónico', categoria: 'Salud & Bienestar', adaScore: 87, margenEst: '38%', stockLabel: 'Alto', tendencia: '↑ Tendencia', pedidosEstSem: 20, costoBase: 18000, fleteBase: 7000 },
  { id: 'rodillo-jade', nombre: 'Rodillo de jade facial', categoria: 'Belleza', adaScore: 81, margenEst: '51%', stockLabel: 'Alto', tendencia: '↑ Creciendo', pedidosEstSem: 18, costoBase: 12000, fleteBase: 6500 },
  { id: 'purificador-mini', nombre: 'Purificador de aire portátil', categoria: 'Hogar', adaScore: 74, margenEst: '29%', stockLabel: 'Medio', tendencia: 'Estable', pedidosEstSem: 12, costoBase: 35000, fleteBase: 9000 },
  { id: 'termo-xl', nombre: 'Termo deportivo XL 1.2L', categoria: 'Fitness', adaScore: 68, margenEst: '34%', stockLabel: 'Alto', tendencia: 'Estable', pedidosEstSem: 14, costoBase: 22000, fleteBase: 7500 },
  { id: 'masajeador-cuello', nombre: 'Masajeador de cuello inteligente', categoria: 'Salud & Bienestar', adaScore: 65, margenEst: '42%', stockLabel: 'Bajo', tendencia: '↑ Emergente', pedidosEstSem: 10, costoBase: 28000, fleteBase: 8000 },
];

// ROAS histórico del usuario (de kpis-global.json via ALS-4)
const ROAS_HISTORICO = 1.93;

@Component({
  selector: 'app-gali6-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali6-nuevo-proyecto.component.html',
  styleUrl: './gali6-nuevo-proyecto.component.scss',
})
export class Gali6NuevoProyectoComponent {
  private router = inject(Router);

  readonly step = signal<Step>('producto');
  readonly objetivo: G6Objetivo = getObjetivo();
  readonly tipoLabel = TIPO_LABEL[this.objetivo.tipo];

  // ── Paso 1: Objetivo ──────────────────────────────────────────────────
  readonly pedidosActuales = 70;
  readonly pedidosEsperadosSem = signal(15);

  readonly nuevoPct = computed(() =>
    Math.min(100, Math.round(((this.pedidosActuales + this.pedidosEsperadosSem()) / this.objetivo.meta_pedidos_sem) * 100))
  );
  readonly pctActual = Math.min(100, Math.round((this.pedidosActuales / this.objetivo.meta_pedidos_sem) * 100));
  readonly faltante = computed(() =>
    Math.max(0, this.objetivo.meta_pedidos_sem - this.pedidosActuales - this.pedidosEsperadosSem())
  );
  readonly galiMensajeObjetivo = computed(() => {
    const p = this.pedidosEsperadosSem();
    const meta = this.objetivo.meta_pedidos_sem;
    const total = this.pedidosActuales + p;
    if (total >= meta) return `Con ${p} ped/sem alcanzarías tu objetivo. ¡Perfecto!`;
    const resta = meta - total;
    return `Con este proyecto llegarías a ${total}/sem. Te quedarían ${resta} para completar tu objetivo.`;
  });

  // ── Paso 1: Producto ──────────────────────────────────────────────────
  readonly productoSearch = signal('');
  readonly productos = ADA_PRODUCTOS;

  readonly productosFiltrados = computed(() => {
    const q = this.productoSearch().toLowerCase().trim();
    if (!q) return ADA_PRODUCTOS;
    return ADA_PRODUCTOS.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
    );
  });

  readonly selectedProducto = signal<ProductoOption | null>(null);

  readonly adaRiskAlert = computed(() => {
    const p = this.selectedProducto();
    return p && p.adaScore < 55
      ? `ADA detecta riesgo: score ${p.adaScore}/100. Alta competencia en "${p.categoria}". Considera ajustar precio.`
      : null;
  });

  selectProducto(p: ProductoOption): void {
    this.selectedProducto.set(p);
    this.costoProd.set(p.costoBase);
    this.fleteEst.set(p.fleteBase);
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'hot';
    if (score >= 65) return 'warm';
    return 'cool';
  }

  // ── Paso 2: Brújula ampliada ──────────────────────────────────────────
  readonly costoProd = signal(18000);
  readonly FLETE_FIJO = 7000; // flete read-only
  readonly COMISION_PCT = 8;  // comisión Dropi fija
  readonly margenObjetivo = 40;

  readonly costoTotal = computed(() => this.costoProd() + this.FLETE_FIJO);
  readonly precioMinimo = computed(() => Math.round(this.costoTotal() / 0.85));
  readonly precioRecomendado = computed(() => Math.round(this.costoTotal() / (1 - this.margenObjetivo / 100)));
  readonly precioSlider = signal(0);

  readonly precioFinal = computed(() => {
    const slider = this.precioSlider();
    return slider > 0 ? slider : this.precioRecomendado();
  });

  readonly comisionDropi = computed(() => Math.round(this.precioFinal() * this.COMISION_PCT / 100));

  readonly gananciaReal = computed(() => {
    const precio = this.precioFinal();
    const costo = this.costoTotal();
    const comision = this.comisionDropi();
    return precio - costo - comision;
  });

  readonly margenFinal = computed(() => {
    const precio = this.precioFinal();
    const ganancia = this.gananciaReal();
    return precio > 0 ? Math.round((ganancia / precio) * 100) : 0;
  });

  readonly margenSemaforo = computed(() => {
    const m = this.margenFinal();
    if (m >= 35) return 'verde';
    if (m >= 20) return 'ambar';
    return 'rojo';
  });

  // Expectativa pedidos calculada desde presupuesto y precio
  readonly expectativaPedidosSem = computed(() => {
    const presupuesto = this.presupuestoDiario() * 7;
    const precio = this.precioFinal();
    if (precio <= 0) return 0;
    return Math.round((presupuesto * ROAS_HISTORICO) / precio);
  });

  readonly fleteEst = signal(7000); // kept for reference, UI uses FLETE_FIJO

  usarPrecioRecomendado(): void {
    this.precioSlider.set(this.precioRecomendado());
  }

  // ── Paso 3: Presupuesto ───────────────────────────────────────────────
  readonly presupuestoDiario = signal(25000);

  readonly galiSugerenciaPresupuesto = computed(() => {
    const faltanteObj = this.objetivo.meta_pedidos_sem - this.pedidosActuales;
    const pedidosTarget = Math.min(faltanteObj, this.pedidosEsperadosSem());
    const precio = this.precioFinal();
    const sugerido = Math.round((pedidosTarget * precio) / ROAS_HISTORICO / 7);
    const sugeridoRedondeado = Math.ceil(sugerido / 5000) * 5000;
    return {
      valor: sugeridoRedondeado,
      contexto: `Para ${pedidosTarget} pedidos/sem faltantes con ROAS ${ROAS_HISTORICO}x, necesitas ~$${(sugeridoRedondeado / 1000).toFixed(0)}k/día`,
    };
  });

  readonly presupuestoPedidosEst = computed(() => {
    const est = this.expectativaPedidosSem();
    return est > 0 ? `~${est} pedidos/sem` : '—';
  });

  usarSugerenciaGali(): void {
    this.presupuestoDiario.set(this.galiSugerenciaPresupuesto().valor);
  }

  // ── Paso 5: Agentes ───────────────────────────────────────────────────
  readonly agentes = signal({ roax: true, vigilante: true, ada: false, chatea: false });
  readonly agenteExpandido = signal<string | null>('roax');

  readonly AGENTES_INFO: Array<{
    id: keyof { roax: boolean; vigilante: boolean; ada: boolean; chatea: boolean };
    icon: string;
    nombre: string;
    desc: string;
    recomendado: boolean;
    razon: string;
  }> = [
    { id: 'roax',      icon: '⚡', nombre: 'Roax Ads',     desc: 'Optimiza pauta en Meta y TikTok. Escala cuando el ROAS supera el umbral y pausa cuando baja.',         recomendado: true,  razon: 'Pre-seleccionado — indispensable para cualquier proyecto de pauta' },
    { id: 'vigilante', icon: '🛡', nombre: 'Vigilante',    desc: 'Monitorea novedad, garantías y logística. Alerta si un pedido lleva más de X días sin actualizar.',   recomendado: true,  razon: 'Recomendado para este nicho — alta tasa de novedad en categoría' },
    { id: 'ada',       icon: '🔍', nombre: 'ADA Spy',      desc: 'Analiza competencia y detecta tendencias. Sugiere ajustes de precio cuando detecta movimientos.',   recomendado: false, razon: '' },
    { id: 'chatea',    icon: '💬', nombre: 'Chatea Pro',   desc: 'Gestión de preguntas, posventa y recuperación de pedidos abandonados.',                               recomendado: false, razon: '' },
  ];

  toggleAgente(key: keyof { roax: boolean; vigilante: boolean; ada: boolean; chatea: boolean }): void {
    if (key === 'roax') return; // Roax siempre activo
    this.agentes.update(a => ({ ...a, [key]: !a[key] }));
  }

  expandAgente(id: string): void {
    this.agenteExpandido.update(v => v === id ? null : id);
  }

  get agentesActivos(): string[] {
    const a = this.agentes();
    const names: Record<string, string> = { roax: 'Roax', vigilante: 'Vigilante', ada: 'ADA Spy', chatea: 'Chatea Pro' };
    return Object.entries(a).filter(([, v]) => v).map(([k]) => names[k]);
  }

  // ── Paso 6: Lanzar ───────────────────────────────────────────────────
  readonly isLaunching = signal(false);
  readonly launched = signal(false);
  readonly launchProgress = signal(0);
  readonly launchStepActive = signal(0); // 0=idle, 1=creando, 2=agentes, 3=senales

  readonly LAUNCH_STEPS = [
    { label: 'Creando proyecto en Dropi', pct: 30 },
    { label: 'Asignando agentes', pct: 65 },
    { label: 'Activando alertas de monitoreo', pct: 100 },
  ];

  launch(): void {
    this.isLaunching.set(true);
    this.launchProgress.set(0);
    this.launchStepActive.set(1);

    setTimeout(() => { this.launchProgress.set(30); this.launchStepActive.set(1); }, 200);
    setTimeout(() => { this.launchProgress.set(65); this.launchStepActive.set(2); }, 900);
    setTimeout(() => { this.launchProgress.set(100); this.launchStepActive.set(3); }, 1700);

    setTimeout(() => {
      this.isLaunching.set(false);
      // I10: redirige al proyecto recién lanzado con flag ?recien=1
      import('../../../../../mocks/gali-v5/projects.json').then(m => {
        const projects = m.default as any[];
        const activo = projects.find(p => p.estado === 'recien_lanzado' || p.estado === 'activo');
        const id = activo?.id ?? 'proj-001';
        this.router.navigate(['/gali-6/proyecto', id], { queryParams: { recien: '1' } });
      });
    }, 2500);
  }

  volverAProyectos(): void {
    this.router.navigate(['/gali-6/proyectos']);
  }

  // ── Navegación ──────────────────────────────────────────────────────
  readonly STEPS: Array<{ id: Step; label: string }> = [
    { id: 'producto',    label: 'Producto' },
    { id: 'brujula',     label: 'Brújula' },
    { id: 'presupuesto', label: 'Presupuesto' },
    { id: 'lanzar',      label: 'Lanzar' },
  ];

  readonly STEP_ORDER: Step[] = ['producto', 'brujula', 'presupuesto', 'lanzar'];

  goTo(s: Step): void { this.step.set(s); }

  goBack(): void {
    const idx = this.STEP_ORDER.indexOf(this.step());
    if (idx > 0) this.step.set(this.STEP_ORDER[idx - 1]);
    else this.router.navigate(['/gali-6/proyectos']);
  }

  goNext(): void {
    const idx = this.STEP_ORDER.indexOf(this.step());
    if (idx < this.STEP_ORDER.length - 1) this.step.set(this.STEP_ORDER[idx + 1]);
  }

  stepIndex(s: Step): number {
    return this.STEPS.findIndex(x => x.id === s);
  }
}

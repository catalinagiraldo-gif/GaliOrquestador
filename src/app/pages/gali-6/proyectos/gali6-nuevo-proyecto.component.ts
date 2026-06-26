import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getObjetivo, G6Objetivo } from '../../../../../mocks/gali-v6/objetivo';
import {
  TIPOS_PROYECTO, TipoProyecto, TipoProyectoMeta,
} from '../../../../../mocks/gali-v6/proyectos.mock';
import {
  INTEGRACIONES_CAMPANA, IntegracionStatus, IntegracionId,
} from '../../../../../mocks/gali-v6/campanas.mock';

type Step =
  | 'tipo' | 'intent-chat' | 'nombre' | 'agentes' | 'agregar-campana'
  | 'campana-tipo' | 'campana-ruta-venta' | 'campana-productos'
  | 'campana-presupuesto' | 'campana-brujula' | 'campana-creativos'
  | 'campana-resumen' | 'exito';

type TipoCampanaOp = 'ads' | 'chatea' | 'hibrida' | 'organica';

interface RutaVentaOp {
  id: string;
  label: string;
  descripcion: string;
  integracionesRequeridas: IntegracionId[];
}

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
  { id: 'colchoneta-yoga', nombre: 'Colchoneta de yoga antideslizante', categoria: 'Fitness', adaScore: 78, margenEst: '44%', stockLabel: 'Alto', tendencia: '↑ Creciendo', pedidosEstSem: 16, costoBase: 20000, fleteBase: 8500 },
  { id: 'botella-filtro', nombre: 'Botella purificadora de agua', categoria: 'Hogar', adaScore: 72, margenEst: '36%', stockLabel: 'Alto', tendencia: 'Estable', pedidosEstSem: 11, costoBase: 25000, fleteBase: 7500 },
  { id: 'serum-vitamina-c', nombre: 'Sérum vitamina C K-Beauty', categoria: 'Belleza', adaScore: 69, margenEst: '45%', stockLabel: 'Medio', tendencia: '↑ Emergente', pedidosEstSem: 9, costoBase: 15000, fleteBase: 6000 },
];

const ROAS_HISTORICO = 1.93;

const NOMBRE_SUGERIDO: Record<TipoProyecto, () => string> = {
  lanzar: () => `Lanzamiento — ${new Date().toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}`,
  escalar: () => 'Escala — Producto estrella',
  optimizar: () => 'Optimización portafolio',
  crm: () => 'Estrategia Chatea',
  experimentar: () => `Experimento — ${new Date().toLocaleDateString('es-CO', { month: 'short' })}`,
};

const LAUNCH_STEPS = [
  { label: 'Creando proyecto en Dropi', pct: 30 },
  { label: 'Asignando agentes', pct: 65 },
  { label: 'Activando alertas de monitoreo', pct: 100 },
];

const INTENT_OPCIONES: Record<TipoProyecto, string[]> = {
  lanzar: [
    'Quiero probar un producto nuevo en Meta',
    'Tengo un producto sin validar aún',
    'Quiero ver si hay demanda antes de invertir más',
  ],
  escalar: [
    'Mi ROAS está por encima de 1.8x y quiero doblar',
    'Quiero aumentar pedidos sin bajar el margen',
    'Tengo presupuesto para escalar el ganador',
  ],
  optimizar: [
    'Tengo proyectos que no rinden y quiero arreglarlos',
    'Quiero saber cuáles productos dejar ir',
    'Quiero bajar costos sin perder ventas',
  ],
  crm: [
    'Quiero activar mis contactos de Chatea Pro',
    'Tengo clientes que no han comprado en meses',
    'Quiero vender sin pagar pauta',
  ],
  experimentar: [
    'Quiero probar un ángulo de copy nuevo',
    'Quiero testear un producto antes de lanzarlo',
    'Tengo una hipótesis de audiencia',
  ],
};

const GALI_INTENT_RESPUESTA: Record<TipoProyecto, { texto: string; subObjetivo: string }> = {
  lanzar:      { texto: 'Entendido. Te ayudo a lanzar con validación rápida. Voy a recomendar un presupuesto acotado para las primeras 2 semanas.', subObjetivo: 'Primeros pedidos en 7 días' },
  escalar:     { texto: 'Perfecto. Roax escalará el presupuesto de forma controlada para no romper el ROAS.', subObjetivo: 'Doblar pedidos/sem sin bajar margen' },
  optimizar:   { texto: 'Vamos a revisar el portafolio completo. Te mostraré qué proyectos cerrar y cuáles ajustar.', subObjetivo: 'Identificar y cerrar proyectos que no aportan' },
  crm:         { texto: 'Chatea Pro es la herramienta ideal para esto. Sin pauta, solo conversaciones que convierten.', subObjetivo: 'Reactivar base de contactos existente' },
  experimentar:{ texto: 'Experimento acotado con presupuesto y tiempo límite definidos. ADA monitoreará los resultados.', subObjetivo: 'Validar hipótesis en 14 días' },
};

const TIPO_CAMPANA_DEFAULT: Record<TipoProyecto, TipoCampanaOp> = {
  lanzar: 'ads', escalar: 'ads', optimizar: 'hibrida', crm: 'chatea', experimentar: 'ads',
};

const CAMP_TIPO_OPTIONS: { id: TipoCampanaOp; label: string; descripcion: string; emoji: string }[] = [
  { id: 'ads', label: 'Pauta en Meta / TikTok', descripcion: 'Campaña de pago con objetivo de ventas o leads', emoji: '📣' },
  { id: 'chatea', label: 'Secuencia Chatea Pro', descripcion: 'Mensajes de WhatsApp automáticos sin pauta', emoji: '💬' },
  { id: 'hibrida', label: 'Ads + Chatea Pro', descripcion: 'Pauta + seguimiento por chat integrado', emoji: '⚡' },
  { id: 'organica', label: 'Sin canal de pago', descripcion: 'Solo seguimiento orgánico, sin presupuesto', emoji: '🌱' },
];

const RUTAS_VENTA: RutaVentaOp[] = [
  {
    id: 'meta-landing-chatea',
    label: 'Landing page + Meta Ads + Chatea Pro',
    descripcion: 'Full-funnel: pauta → landing → conversación por WhatsApp',
    integracionesRequeridas: ['shopify', 'meta-ads', 'chatea-pro'],
  },
  {
    id: 'meta-chatea',
    label: 'Solo Meta Ads + Chatea Pro',
    descripcion: 'Pauta directa a conversación WhatsApp, sin landing page',
    integracionesRequeridas: ['meta-ads', 'chatea-pro'],
  },
  {
    id: 'tiktok-chatea',
    label: 'TikTok Ads + Chatea Pro',
    descripcion: 'Pauta en TikTok con seguimiento por WhatsApp',
    integracionesRequeridas: ['tiktok-ads', 'chatea-pro'],
  },
  {
    id: 'landing-chatea',
    label: 'Landing page + Chatea Pro (sin ads)',
    descripcion: 'Tráfico orgánico o directo, seguimiento por chat',
    integracionesRequeridas: ['shopify', 'chatea-pro'],
  },
  {
    id: 'directo',
    label: 'Directamente por WhatsApp / Link directo',
    descripcion: 'Sin plataforma de ads. Envías a conocidos o publicas en redes',
    integracionesRequeridas: ['chatea-pro'],
  },
];

const AGREGAR_CAMPANA_COPY: Record<TipoProyecto, { si: string; no: string }> = {
  lanzar:      { si: 'Sí, crear primera campaña de ads', no: 'Después, solo crear el proyecto' },
  escalar:     { si: 'Sí, escalar con nueva campaña', no: 'Después, lo configuro manualmente' },
  optimizar:   { si: 'Sí, crear campaña de ajuste', no: 'No, solo quiero hacer seguimiento' },
  crm:         { si: 'Sí, crear secuencia en Chatea Pro', no: 'Después, solo crear el proyecto' },
  experimentar:{ si: 'Sí, crear campaña de prueba', no: 'No, solo registrar el experimento' },
};

const CATEGORIAS = ['Todos', 'Salud & Bienestar', 'Belleza', 'Hogar', 'Fitness'];

@Component({
  selector: 'app-gali6-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali6-nuevo-proyecto.component.html',
  styleUrl: './gali6-nuevo-proyecto.component.scss',
})
export class Gali6NuevoProyectoComponent {
  private readonly router = inject(Router);

  readonly TIPOS_PROYECTO: TipoProyectoMeta[] = TIPOS_PROYECTO;
  readonly LAUNCH_STEPS = LAUNCH_STEPS;
  readonly CAMP_TIPO_OPTIONS = CAMP_TIPO_OPTIONS;
  readonly RUTAS_VENTA = RUTAS_VENTA;
  readonly CATEGORIAS = CATEGORIAS;

  readonly PROJ_STEPS: Step[] = ['tipo', 'intent-chat', 'nombre', 'agentes', 'agregar-campana'];
  readonly CAMP_STEPS: Step[] = [
    'campana-tipo', 'campana-ruta-venta', 'campana-productos',
    'campana-presupuesto', 'campana-brujula', 'campana-creativos', 'campana-resumen',
  ];

  readonly step = signal<Step>('tipo');
  readonly objetivo: G6Objetivo = getObjetivo();

  // ── Paso 1: Tipo de proyecto ──────────────────────────────────────────
  readonly selectedTipo = signal<TipoProyecto | null>(null);

  selectTipo(tipo: TipoProyecto): void {
    this.selectedTipo.set(tipo);
    const defaults = TIPOS_PROYECTO.find(t => t.id === tipo)?.agentesDefault ?? [];
    this.agentes.set({
      roax: defaults.includes('roax'),
      vigilante: defaults.includes('vigilante'),
      ada: defaults.includes('ada'),
      chatea: defaults.includes('chatea'),
    });
    if (!this.nombreProyecto()) {
      this.nombreProyecto.set(NOMBRE_SUGERIDO[tipo]());
    }
    // Pre-seleccionar tipo de campaña por defecto
    this.tipoCampanaSeleccionado.set(TIPO_CAMPANA_DEFAULT[tipo]);
    this.goTo('intent-chat');
  }

  // ── Paso 1b: Intent Chat ──────────────────────────────────────────────
  readonly intentTexto = signal<string>('');
  readonly intentAnalyzing = signal(false);
  readonly galiIntentRespuesta = signal<{ texto: string; subObjetivo: string } | null>(null);

  readonly intentOpciones = computed<string[]>(() => {
    const tipo = this.selectedTipo();
    return tipo ? INTENT_OPCIONES[tipo] : [];
  });

  seleccionarIntent(opcion: string): void {
    this.intentTexto.set(opcion);
    this.procesarIntent();
  }

  enviarIntent(): void {
    if (!this.intentTexto().trim()) return;
    this.procesarIntent();
  }

  private procesarIntent(): void {
    this.intentAnalyzing.set(true);
    this.galiIntentRespuesta.set(null);
    const tipo = this.selectedTipo()!;
    setTimeout(() => {
      this.galiIntentRespuesta.set(GALI_INTENT_RESPUESTA[tipo]);
      this.intentAnalyzing.set(false);
    }, 700);
  }

  confirmarIntent(): void {
    this.goTo('nombre');
  }

  // ── Paso 2: Nombre ───────────────────────────────────────────────────
  readonly nombreProyecto = signal('');

  readonly nombreSugerido = computed(() => {
    const tipo = this.selectedTipo();
    return tipo ? NOMBRE_SUGERIDO[tipo]() : '';
  });

  // ── Paso 3: Agentes ──────────────────────────────────────────────────
  readonly agentes = signal({ roax: false, vigilante: false, ada: false, chatea: false });

  readonly AGENTES_INFO = [
    { id: 'roax' as const, icon: 'pi-bolt', nombre: 'Roax Ads', desc: 'Optimiza pauta en Meta y TikTok. Escala cuando el ROAS supera el umbral y pausa cuando baja.', tipo: 'ads' },
    { id: 'vigilante' as const, icon: 'pi-shield', nombre: 'Vigilante Logístico', desc: 'Monitorea novedad, garantías y logística. Alerta si un pedido lleva más de X días sin actualizar.', tipo: 'all' },
    { id: 'ada' as const, icon: 'pi-search', nombre: 'ADA Spy', desc: 'Analiza competencia y detecta tendencias. Sugiere ajustes de precio cuando detecta movimientos.', tipo: 'all' },
    { id: 'chatea' as const, icon: 'pi-comments', nombre: 'Chatea Pro', desc: 'Gestión de preguntas, posventa y recuperación de pedidos abandonados.', tipo: 'crm' },
  ];

  readonly agentesRecomendados = computed(() => {
    const tipo = this.selectedTipo();
    if (!tipo) return [] as string[];
    return TIPOS_PROYECTO.find(t => t.id === tipo)?.agentesDefault ?? [];
  });

  isAgenteRecomendado(id: string): boolean {
    return this.agentesRecomendados().includes(id);
  }

  toggleAgente(key: 'roax' | 'vigilante' | 'ada' | 'chatea'): void {
    const tipo = this.selectedTipo();
    if (key === 'roax' && tipo && ['lanzar', 'escalar', 'experimentar'].includes(tipo)) return;
    this.agentes.update(a => ({ ...a, [key]: !a[key] }));
  }

  isAgenteLocked(key: string): boolean {
    if (key !== 'roax') return false;
    const tipo = this.selectedTipo();
    return !!tipo && ['lanzar', 'escalar', 'experimentar'].includes(tipo);
  }

  get agentesActivosNombres(): string[] {
    const a = this.agentes();
    const names: Record<string, string> = { roax: 'Roax Ads', vigilante: 'Vigilante', ada: 'ADA Spy', chatea: 'Chatea Pro' };
    return Object.entries(a).filter(([, v]) => v).map(([k]) => names[k]);
  }

  irCrearAgente(): void {
    this.router.navigate(['/gali-6/agentes'], { queryParams: { crear: 'true' } });
  }

  // ── Paso 4: ¿Agregar campaña? ────────────────────────────────────────
  readonly campanaCtaCopy = computed(() => {
    const tipo = this.selectedTipo();
    return tipo ? AGREGAR_CAMPANA_COPY[tipo] : { si: 'Sí, añadir campaña', no: 'Después' };
  });

  elegirAgregarCampana(si: boolean): void {
    if (si) {
      this.step.set('campana-tipo');
    } else {
      this.crearProyectoBorrador();
    }
  }

  // ── Campaña: Tipo de campaña ─────────────────────────────────────────
  readonly tipoCampanaSeleccionado = signal<TipoCampanaOp | null>(null);

  selectTipoCampana(tipo: TipoCampanaOp): void {
    this.tipoCampanaSeleccionado.set(tipo);
    // Si es chatea u organica, saltamos la ruta de venta a directo
    if (tipo === 'chatea' || tipo === 'organica') {
      this.rutaVentaSeleccionada.set('directo');
      this.goTo('campana-productos');
    } else {
      this.goTo('campana-ruta-venta');
    }
  }

  // ── Campaña: Ruta de venta ───────────────────────────────────────────
  readonly rutaVentaSeleccionada = signal<string | null>(null);
  readonly integraciones = signal<IntegracionStatus[]>(INTEGRACIONES_CAMPANA);
  readonly integExpandida = signal<IntegracionId | null>(null);

  readonly rutaSeleccionadaObj = computed(() =>
    RUTAS_VENTA.find(r => r.id === this.rutaVentaSeleccionada()) ?? null
  );

  readonly integEstadoParaRuta = computed(() => {
    const ruta = this.rutaSeleccionadaObj();
    if (!ruta) return [];
    return ruta.integracionesRequeridas.map(id => ({
      ...this.integraciones().find(i => i.id === id)!,
    }));
  });

  readonly rutaConAds = computed(() => {
    const id = this.rutaVentaSeleccionada();
    return id === 'meta-landing-chatea' || id === 'meta-chatea' || id === 'tiktok-chatea';
  });

  selectRuta(id: string): void {
    this.rutaVentaSeleccionada.set(id);
  }

  continuarDesdeRuta(): void {
    this.goTo('campana-productos');
  }

  toggleIntegGuide(id: IntegracionId): void {
    this.integExpandida.update(cur => cur === id ? null : id);
  }

  irConexiones(): void {
    this.router.navigate(['/gali-6/conexiones']);
  }

  // ── Campaña: Productos (multi-select con tabs y Gali rec) ────────────
  readonly productoSearch = signal('');
  readonly selectedProductos = signal<Set<string>>(new Set());
  readonly categoriaFiltro = signal<string>('Todos');
  readonly productoAnalyzing = signal(false);

  readonly productosRecomendados = computed(() =>
    ADA_PRODUCTOS.slice().sort((a, b) => b.adaScore - a.adaScore).slice(0, 3)
  );

  readonly productosFiltrados = computed(() => {
    const cat = this.categoriaFiltro();
    const q = this.productoSearch().toLowerCase().trim();
    let lista = cat === 'Todos' ? ADA_PRODUCTOS : ADA_PRODUCTOS.filter(p => p.categoria === cat);
    if (q) lista = lista.filter(p => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q));
    return lista;
  });

  readonly selectedProductosList = computed(() =>
    ADA_PRODUCTOS.filter(p => this.selectedProductos().has(p.id))
  );

  readonly isProductoRecomendado = (id: string): boolean =>
    this.productosRecomendados().some(p => p.id === id);

  enterProductosStep(): void {
    this.productoAnalyzing.set(true);
    setTimeout(() => this.productoAnalyzing.set(false), 800);
  }

  toggleProducto(p: ProductoOption): void {
    this.selectedProductos.update(set => {
      const next = new Set(set);
      if (next.has(p.id)) next.delete(p.id);
      else next.add(p.id);
      return next;
    });
    const first = ADA_PRODUCTOS.find(pr => this.selectedProductos().has(pr.id));
    if (first) {
      this.costoProd.set(first.costoBase);
      // Inicializar precio por producto con el recomendado
      const cur = { ...this.preciosPorProducto() };
      if (!cur[first.id]) {
        const costo = first.costoBase + first.fleteBase;
        cur[first.id] = Math.round(costo / (1 - 0.40));
      }
      this.preciosPorProducto.set(cur);
    }
  }

  removeProducto(id: string): void {
    this.selectedProductos.update(set => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'hot';
    if (score >= 65) return 'warm';
    return 'cool';
  }

  // ── Campaña: Presupuesto (ANTES de brújula) ─────────────────────────
  readonly presupuestoDiario = signal(25000);

  readonly expectativaPedidosSem = computed(() => {
    const presupuesto = this.presupuestoDiario() * 7;
    const precio = this.precioFinal();
    if (precio <= 0) return 0;
    return Math.round((presupuesto * ROAS_HISTORICO) / precio);
  });

  readonly pautaEfectivaPorPedido = computed(() => {
    const exp = this.expectativaPedidosSem();
    if (exp <= 0) return 0;
    return Math.round((this.presupuestoDiario() * 7) / exp);
  });

  readonly galiSugerenciaPresupuesto = computed(() => {
    const precio = this.precioFinal();
    const faltante = this.objetivo.meta_pedidos_sem - 70;
    const pedidosTarget = Math.min(faltante, 20);
    const sugerido = Math.ceil((pedidosTarget * precio) / ROAS_HISTORICO / 7 / 5000) * 5000;
    return {
      valor: Math.max(sugerido, 15000),
      contexto: `Para ~${pedidosTarget} pedidos/sem con ROAS ${ROAS_HISTORICO}x`,
    };
  });

  usarSugerenciaGali(): void {
    this.presupuestoDiario.set(this.galiSugerenciaPresupuesto().valor);
  }

  // ── Campaña: Brújula de precio ───────────────────────────────────────
  readonly costoProd = signal(18000);
  readonly FLETE_FIJO = 7000;
  readonly COMISION_PCT = 8;
  readonly margenObjetivo = 40;

  // Para multi-producto: precio editable por producto
  readonly preciosPorProducto = signal<Record<string, number>>({});

  readonly costoTotal = computed(() => this.costoProd() + this.FLETE_FIJO);
  readonly precioMinimo = computed(() => Math.round(this.costoTotal() / 0.85));
  readonly precioRecomendado = computed(() => Math.round(this.costoTotal() / (1 - this.margenObjetivo / 100)));
  readonly precioSlider = signal(0);

  readonly precioFinal = computed(() => {
    const lista = this.selectedProductosList();
    if (lista.length === 1) {
      const slider = this.precioSlider();
      return slider > 0 ? slider : this.precioRecomendado();
    }
    // Multi-producto: usar el precio del primer producto o el recomendado
    const first = lista[0];
    if (first) {
      return this.preciosPorProducto()[first.id] ?? this.precioRecomendado();
    }
    return this.precioRecomendado();
  });

  readonly comisionDropi = computed(() => Math.round(this.precioFinal() * this.COMISION_PCT / 100));

  readonly gananciaReal = computed(() =>
    this.precioFinal() - this.costoTotal() - this.comisionDropi()
  );

  readonly margenFinal = computed(() => {
    const precio = this.precioFinal();
    return precio > 0 ? Math.round((this.gananciaReal() / precio) * 100) : 0;
  });

  readonly margenSemaforo = computed(() => {
    const m = this.margenFinal();
    if (m >= 35) return 'verde';
    if (m >= 20) return 'ambar';
    return 'rojo';
  });

  getPrecioPorProducto(id: string): number {
    const p = ADA_PRODUCTOS.find(x => x.id === id)!;
    return this.preciosPorProducto()[id] ?? Math.round((p.costoBase + p.fleteBase) / (1 - 0.40));
  }

  setPrecioPorProducto(id: string, valor: number): void {
    this.preciosPorProducto.update(cur => ({ ...cur, [id]: valor }));
  }

  getMargenParaProducto(id: string): number {
    const p = ADA_PRODUCTOS.find(x => x.id === id)!;
    const precio = this.getPrecioPorProducto(id);
    const costo = p.costoBase + p.fleteBase;
    const comision = precio * 0.08;
    return Math.round(((precio - costo - comision) / precio) * 100);
  }

  getMargenColorParaProducto(id: string): string {
    const m = this.getMargenParaProducto(id);
    if (m >= 35) return 'verde';
    if (m >= 20) return 'ambar';
    return 'rojo';
  }

  ajustarTodosAlRecomendado(): void {
    const nuevo: Record<string, number> = {};
    for (const p of this.selectedProductosList()) {
      nuevo[p.id] = Math.round((p.costoBase + p.fleteBase) / (1 - 0.40));
    }
    this.preciosPorProducto.set(nuevo);
  }

  usarPrecioRecomendado(): void {
    this.precioSlider.set(this.precioRecomendado());
  }

  // ── Campaña: Creativos ───────────────────────────────────────────────
  readonly creativoLanding = signal(false);
  readonly creativoAngulo = signal(false);
  readonly creativoAudiencias = signal(false);
  readonly creativoCopy = signal(false);
  readonly creativoChatea = signal(false);
  readonly creativoPorDefinir = signal(false);

  readonly shopifyConectado = computed(() =>
    this.integraciones().find(i => i.id === 'shopify')?.estado === 'conectado'
  );
  readonly metaOTiktokConectado = computed(() =>
    this.integraciones().some(i => (i.id === 'meta-ads' || i.id === 'tiktok-ads') && i.estado === 'conectado')
  );
  readonly chateaConectado = computed(() =>
    this.integraciones().find(i => i.id === 'chatea-pro')?.estado === 'conectado'
  );

  readonly mostrarSeccionLanding = computed(() => {
    const ruta = this.rutaVentaSeleccionada();
    return ruta === 'meta-landing-chatea' || ruta === 'landing-chatea';
  });
  readonly mostrarSeccionAds = computed(() => {
    const tipo = this.tipoCampanaSeleccionado();
    return tipo === 'ads' || tipo === 'hibrida';
  });
  readonly mostrarSeccionChatea = computed(() => {
    const tipo = this.tipoCampanaSeleccionado();
    return tipo === 'chatea' || tipo === 'hibrida';
  });

  // ── Launch ───────────────────────────────────────────────────────────
  readonly isLaunching = signal(false);
  readonly launched = signal(false);
  readonly launchProgress = signal(0);
  readonly launchStepActive = signal(0);
  readonly nuevoProyectoId = signal<string>('');

  private generarNuevoId(): string {
    return `pv-${Date.now().toString(36).toUpperCase()}`;
  }

  crearProyectoBorrador(): void {
    this.isLaunching.set(true);
    this.launchProgress.set(0);
    this.launchStepActive.set(1);
    setTimeout(() => { this.launchProgress.set(50); this.launchStepActive.set(2); }, 500);
    setTimeout(() => { this.launchProgress.set(100); this.launchStepActive.set(3); }, 1200);
    setTimeout(() => {
      this.isLaunching.set(false);
      this.step.set('exito');
    }, 1800);
  }

  launch(): void {
    const id = this.generarNuevoId();
    this.nuevoProyectoId.set(id);
    this.isLaunching.set(true);
    this.launchProgress.set(0);
    this.launchStepActive.set(1);
    setTimeout(() => { this.launchProgress.set(30); this.launchStepActive.set(1); }, 200);
    setTimeout(() => { this.launchProgress.set(65); this.launchStepActive.set(2); }, 900);
    setTimeout(() => { this.launchProgress.set(100); this.launchStepActive.set(3); }, 1700);
    setTimeout(() => {
      this.isLaunching.set(false);
      this.router.navigate(['/gali-6/proyecto', id], { queryParams: { recien: '1' } });
    }, 2500);
  }

  // ── Navegación ───────────────────────────────────────────────────────
  readonly progressPct = computed(() => {
    const step = this.step();
    const totalSteps = this.PROJ_STEPS.length + this.CAMP_STEPS.length;
    const projIdx = this.PROJ_STEPS.indexOf(step);
    const campIdx = this.CAMP_STEPS.indexOf(step);
    if (projIdx >= 0) return ((projIdx + 1) / totalSteps) * 100;
    if (campIdx >= 0) return ((this.PROJ_STEPS.length + campIdx + 1) / totalSteps) * 100;
    return 100;
  });

  readonly stepLabel = computed(() => {
    const labels: Record<Step, string> = {
      'tipo': 'Tipo de proyecto',
      'intent-chat': 'Tu intención',
      'nombre': 'Nombre',
      'agentes': 'Agentes',
      'agregar-campana': '¿Agregar campaña?',
      'campana-tipo': 'Tipo de campaña',
      'campana-ruta-venta': '¿Por dónde quieres vender?',
      'campana-productos': 'Productos',
      'campana-presupuesto': 'Presupuesto de pauta',
      'campana-brujula': 'Brújula de precio',
      'campana-creativos': 'Creativos',
      'campana-resumen': 'Resumen',
      'exito': 'Listo',
    };
    return labels[this.step()] ?? '';
  });

  goTo(s: Step): void {
    if (s === 'campana-productos') {
      this.enterProductosStep();
    }
    this.step.set(s);
  }

  goBack(): void {
    const cur = this.step();
    if (cur === 'tipo') { this.router.navigate(['/gali-6/proyectos']); return; }
    if (cur === 'intent-chat') { this.step.set('tipo'); return; }
    if (cur === 'campana-tipo') { this.step.set('agregar-campana'); return; }
    if (cur === 'campana-ruta-venta') { this.step.set('campana-tipo'); return; }
    if (cur === 'campana-productos') {
      const tipo = this.tipoCampanaSeleccionado();
      if (tipo === 'chatea' || tipo === 'organica') {
        this.step.set('campana-tipo');
      } else {
        this.step.set('campana-ruta-venta');
      }
      return;
    }
    if (cur === 'campana-presupuesto') { this.step.set('campana-productos'); return; }
    const projIdx = this.PROJ_STEPS.indexOf(cur);
    if (projIdx > 0) { this.step.set(this.PROJ_STEPS[projIdx - 1]); return; }
    const campIdx = this.CAMP_STEPS.indexOf(cur);
    if (campIdx > 0) { this.step.set(this.CAMP_STEPS[campIdx - 1]); return; }
    this.router.navigate(['/gali-6/proyectos']);
  }

  volverAProyectos(): void {
    this.router.navigate(['/gali-6/proyectos']);
  }

  getTipoLabel(tipo: TipoProyecto | null): string {
    if (!tipo) return '';
    return TIPOS_PROYECTO.find(t => t.id === tipo)?.titulo ?? tipo;
  }

  getTipoEmoji(tipo: TipoProyecto | null): string {
    if (!tipo) return '';
    return TIPOS_PROYECTO.find(t => t.id === tipo)?.emoji ?? '';
  }

  readonly productosNombres = computed(() =>
    this.selectedProductosList().map(p => p.nombre).join(' · ')
  );
}

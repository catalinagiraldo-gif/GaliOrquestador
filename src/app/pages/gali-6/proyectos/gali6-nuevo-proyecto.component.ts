import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getObjetivo, G6Objetivo } from '../../../../../mocks/gali-v6/objetivo';
import {
  TIPOS_PROYECTO, TipoProyecto, TipoProyectoMeta,
  CampanaProyecto, TipoCampana, ProductoRef,
} from '../../../../../mocks/gali-v6/proyectos.mock';
import {
  INTEGRACIONES_CAMPANA, IntegracionStatus, IntegracionId,
} from '../../../../../mocks/gali-v6/campanas.mock';

type Step =
  | 'tipo' | 'intent-chat' | 'nombre' | 'agentes' | 'sub-meta' | 'agregar-campana'
  | 'campana-tipo' | 'campana-ruta-venta' | 'campana-productos'
  | 'campana-presupuesto' | 'campana-brujula' | 'campana-creativos'
  | 'campana-resumen' | 'exito';

type TipoCampanaOp = 'ads' | 'chatea' | 'hibrida' | 'organica';

interface RutaVentaOp {
  id: string;
  label: string;
  descripcion: string;
  grupo: 'pauta' | 'landing' | 'chatea' | 'paquete' | 'organico';
  factoresExtra: Array<'shopify' | 'chatea-pro'>;
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
  operacion: () => 'Mejora operativa',
  negociacion: () => `Negociación — ${new Date().toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}`,
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
  operacion: [
    'Quiero reducir la tasa de novedad',
    'Necesito mejorar tiempos de respuesta',
    'Quiero bajar costos operativos sin afectar ventas',
  ],
  negociacion: [
    'Quiero mejorar el precio con mi proveedor',
    'Necesito asegurar stock para temporada alta',
    'Quiero negociar mejores condiciones de pago',
  ],
};

const GALI_INTENT_RESPUESTA: Record<TipoProyecto, { texto: string; subObjetivo: string }> = {
  lanzar:      { texto: 'Entendido. Te ayudo a lanzar con validación rápida. Voy a recomendar un presupuesto acotado para las primeras 2 semanas.', subObjetivo: 'Primeros pedidos en 7 días' },
  escalar:     { texto: 'Perfecto. Roax escalará el presupuesto de forma controlada para no romper el ROAS.', subObjetivo: 'Doblar pedidos/sem sin bajar margen' },
  optimizar:   { texto: 'Vamos a revisar el portafolio completo. Te mostraré qué proyectos cerrar y cuáles ajustar.', subObjetivo: 'Identificar y cerrar proyectos que no aportan' },
  crm:         { texto: 'Chatea Pro es la herramienta ideal para esto. Sin pauta, solo conversaciones que convierten.', subObjetivo: 'Reactivar base de contactos existente' },
  experimentar:{ texto: 'Experimento acotado con presupuesto y tiempo límite definidos. ADA monitoreará los resultados.', subObjetivo: 'Validar hipótesis en 14 días' },
  operacion:   { texto: 'Vamos a identificar los cuellos de botella operativos. Te daré un diagnóstico claro y acciones concretas.', subObjetivo: 'Mejorar eficiencia operativa en 30 días' },
  negociacion: { texto: 'ADA analizará el historial con tu proveedor y te ayudará a construir argumentos sólidos para la negociación.', subObjetivo: 'Mejorar condiciones con el proveedor este mes' },
};

const TIPO_CAMPANA_DEFAULT: Record<TipoProyecto, TipoCampanaOp> = {
  lanzar: 'ads', escalar: 'ads', optimizar: 'hibrida', crm: 'chatea', experimentar: 'ads',
  operacion: 'organica', negociacion: 'organica',
};

const CAMP_TIPO_OPTIONS: { id: TipoCampanaOp; label: string; descripcion: string; emoji: string }[] = [
  { id: 'ads', label: 'Pauta en Meta / TikTok', descripcion: 'Campaña de pago con objetivo de ventas o leads', emoji: '📣' },
  { id: 'chatea', label: 'Secuencia Chatea Pro', descripcion: 'Mensajes de WhatsApp automáticos sin pauta', emoji: '💬' },
  { id: 'hibrida', label: 'Ads + Chatea Pro', descripcion: 'Pauta + seguimiento por chat integrado', emoji: '⚡' },
  { id: 'organica', label: 'Sin canal de pago', descripcion: 'Solo seguimiento orgánico, sin presupuesto', emoji: '🌱' },
];

const RUTAS_VENTA: RutaVentaOp[] = [
  // Grupo pauta
  {
    id: 'solo-meta',
    label: 'Solo Meta Ads',
    descripcion: 'Publicidad en Facebook e Instagram. Leads van directo a WhatsApp o manual.',
    grupo: 'pauta', factoresExtra: [],
    integracionesRequeridas: ['meta-ads'],
  },
  {
    id: 'solo-tiktok',
    label: 'Solo TikTok Ads',
    descripcion: 'Publicidad en TikTok. Conversión en DMs o manual.',
    grupo: 'pauta', factoresExtra: [],
    integracionesRequeridas: ['tiktok-ads'],
  },
  {
    id: 'meta-tiktok',
    label: 'Meta + TikTok Ads',
    descripcion: 'Ambas plataformas simultáneamente. Mayor alcance, mayor inversión.',
    grupo: 'pauta', factoresExtra: [],
    integracionesRequeridas: ['meta-ads', 'tiktok-ads'],
  },
  // Grupo landing
  {
    id: 'meta-landing',
    label: 'Meta Ads → Landing Page',
    descripcion: 'Pauta Meta dirige a una landing page en Shopify/Dropify.',
    grupo: 'landing', factoresExtra: ['shopify'],
    integracionesRequeridas: ['meta-ads', 'shopify'],
  },
  {
    id: 'tiktok-landing',
    label: 'TikTok Ads → Landing Page',
    descripcion: 'Pauta TikTok dirige a una landing page en Shopify/Dropify.',
    grupo: 'landing', factoresExtra: ['shopify'],
    integracionesRequeridas: ['tiktok-ads', 'shopify'],
  },
  // Grupo chatea
  {
    id: 'meta-chatea',
    label: 'Meta Ads → Chatea Pro',
    descripcion: 'Pauta Meta lleva al usuario directo a WhatsApp con flujo automatizado.',
    grupo: 'chatea', factoresExtra: ['chatea-pro'],
    integracionesRequeridas: ['meta-ads', 'chatea-pro'],
  },
  {
    id: 'tiktok-chatea',
    label: 'TikTok Ads → Chatea Pro',
    descripcion: 'Pauta TikTok lleva al usuario a WhatsApp con flujo automatizado.',
    grupo: 'chatea', factoresExtra: ['chatea-pro'],
    integracionesRequeridas: ['tiktok-ads', 'chatea-pro'],
  },
  // Grupo paquete
  {
    id: 'meta-landing-chatea',
    label: 'Paquete completo (Meta + Landing + Chatea)',
    descripcion: 'Landing Page + Meta Ads + Chatea Pro. El stack completo de dropshipping.',
    grupo: 'paquete', factoresExtra: ['shopify', 'chatea-pro'],
    integracionesRequeridas: ['meta-ads', 'shopify', 'chatea-pro'],
  },
  // Grupo organico
  {
    id: 'landing-chatea',
    label: 'Solo Chatea Pro (orgánico)',
    descripcion: 'Ventas por WhatsApp sin pauta pagada. Ideal para recuperar clientes o CRM.',
    grupo: 'organico', factoresExtra: ['chatea-pro'],
    integracionesRequeridas: ['shopify', 'chatea-pro'],
  },
  {
    id: 'directo',
    label: 'Sin canal de pago',
    descripcion: 'Sin pauta ni suscripciones. Solo gestión manual o seguimiento orgánico.',
    grupo: 'organico', factoresExtra: [],
    integracionesRequeridas: [],
  },
];

const AGREGAR_CAMPANA_COPY: Record<TipoProyecto, { si: string; no: string }> = {
  lanzar:      { si: 'Sí, crear primera campaña de ads', no: 'Después, solo crear el proyecto' },
  escalar:     { si: 'Sí, escalar con nueva campaña', no: 'Después, lo configuro manualmente' },
  optimizar:   { si: 'Sí, crear campaña de ajuste', no: 'No, solo quiero hacer seguimiento' },
  crm:         { si: 'Sí, crear secuencia en Chatea Pro', no: 'Después, solo crear el proyecto' },
  experimentar:{ si: 'Sí, crear campaña de prueba', no: 'No, solo registrar el experimento' },
  operacion:   { si: 'Sí, crear campaña de seguimiento', no: 'No, crear solo el proyecto' },
  negociacion: { si: 'Sí, crear campaña de negociación', no: 'No, crear solo el proyecto' },
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
  readonly router = inject(Router);

  readonly TIPOS_PROYECTO: TipoProyectoMeta[] = TIPOS_PROYECTO;
  readonly LAUNCH_STEPS = LAUNCH_STEPS;
  readonly CAMP_TIPO_OPTIONS = CAMP_TIPO_OPTIONS;
  readonly RUTAS_VENTA = RUTAS_VENTA;
  readonly CATEGORIAS = CATEGORIAS;

  readonly PROJ_STEPS: Step[] = ['tipo', 'intent-chat', 'nombre', 'agentes', 'sub-meta', 'agregar-campana'];
  readonly CAMP_STEPS: Step[] = [
    'campana-productos', 'campana-tipo', 'campana-ruta-venta',
    'campana-presupuesto', 'campana-brujula', 'campana-creativos', 'campana-resumen',
  ];

  readonly step = signal<Step>('tipo');
  readonly objetivo: G6Objetivo = getObjetivo();
  readonly metaPct = Math.min(100, Math.round((70 / (this.objetivo.meta_pedidos_sem || 100)) * 100));

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

  // ── Paso 4b: Sub-meta ────────────────────────────────────────────────
  readonly subMetaSeleccionadaId = signal<string | null>(null);

  readonly subMetasPendientes = computed(() =>
    getObjetivo().sub_metas.filter(sm => !sm.lograda)
  );

  seleccionarSubMeta(id: string | null): void {
    this.subMetaSeleccionadaId.set(id);
    this.step.set('agregar-campana');
  }

  // ── Paso 5: ¿Agregar campaña? ────────────────────────────────────────
  readonly campanaCtaCopy = computed(() => {
    const tipo = this.selectedTipo();
    return tipo ? AGREGAR_CAMPANA_COPY[tipo] : { si: 'Sí, añadir campaña', no: 'Después' };
  });

  readonly tipoRequiereCampana = computed(() => {
    const tipo = this.selectedTipo();
    return TIPOS_PROYECTO.find(t => t.id === tipo)?.requiereCampana ?? true;
  });

  elegirAgregarCampana(si: boolean): void {
    if (si) {
      this.goTo('campana-productos'); // productos primero, luego tipo/canal
    } else {
      this.crearProyectoBorrador();
    }
  }

  // ── Campaña: Tipo de campaña ─────────────────────────────────────────
  readonly tipoCampanaSeleccionado = signal<TipoCampanaOp | null>(null);

  selectTipoCampana(tipo: TipoCampanaOp): void {
    this.tipoCampanaSeleccionado.set(tipo);
    // Si es chatea u organica, saltamos la ruta de venta y vamos directo a presupuesto
    if (tipo === 'chatea' || tipo === 'organica') {
      this.rutaVentaSeleccionada.set('directo');
      this.goTo('campana-presupuesto');
    } else {
      this.goTo('campana-ruta-venta');
    }
  }

  // ── Campaña: Ruta de venta ───────────────────────────────────────────
  readonly rutaVentaSeleccionada = signal<string | null>(null);
  readonly integraciones = signal<IntegracionStatus[]>(INTEGRACIONES_CAMPANA);
  readonly integExpandida = signal<IntegracionId | null>(null);

  readonly rutasAgrupadas = computed(() => [
    { id: 'pauta',    label: 'Solo pauta',           rutas: RUTAS_VENTA.filter(r => r.grupo === 'pauta') },
    { id: 'landing',  label: 'Pauta + landing page', rutas: RUTAS_VENTA.filter(r => r.grupo === 'landing') },
    { id: 'chatea',   label: 'Pauta + Chatea Pro',   rutas: RUTAS_VENTA.filter(r => r.grupo === 'chatea') },
    { id: 'paquete',  label: 'Paquete completo',     rutas: RUTAS_VENTA.filter(r => r.grupo === 'paquete') },
    { id: 'organico', label: 'Sin canal de pago',    rutas: RUTAS_VENTA.filter(r => r.grupo === 'organico') },
  ]);

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
    const ruta = this.rutaSeleccionadaObj();
    if (!ruta) return false;
    return ['pauta', 'landing', 'chatea', 'paquete'].includes(ruta.grupo);
  });

  // Qué plataformas de pauta aplican en la ruta seleccionada
  readonly canalPautaLabel = computed(() => {
    const id = this.rutaVentaSeleccionada() ?? '';
    if (id.startsWith('meta-tiktok') || id === 'meta-tiktok') return 'Meta Ads + TikTok Ads';
    if (id.startsWith('meta')) return 'Meta Ads';
    if (id.startsWith('tiktok')) return 'TikTok Ads';
    return '';
  });

  // Lista de suscripciones que aplican con sus costos
  readonly suscripcionesActivas = computed<Array<{ nombre: string; mensual: number }>>(() => {
    const ruta = this.rutaSeleccionadaObj();
    if (!ruta) return [];
    const lista: Array<{ nombre: string; mensual: number }> = [];
    if (ruta.factoresExtra.includes('shopify'))    lista.push({ nombre: 'Shopify',    mensual: this.SHOPIFY_MENSUAL });
    if (ruta.factoresExtra.includes('chatea-pro')) lista.push({ nombre: 'Chatea Pro', mensual: this.CHATEA_MENSUAL });
    return lista;
  });

  selectRuta(id: string): void {
    this.rutaVentaSeleccionada.set(id);
  }

  continuarDesdeRuta(): void {
    this.goTo('campana-presupuesto');
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

  getGananciaParaProducto(id: string): number {
    const p = ADA_PRODUCTOS.find(x => x.id === id)!;
    const precio = this.getPrecioPorProducto(id);
    const costo = p.costoBase + p.fleteBase;
    const comision = Math.round(precio * this.COMISION_PCT / 100);
    const pauta = this.pautaEfectivaPorPedido();
    const susc = this.costoSuscripcionPorPedido();
    return precio - costo - comision - pauta - susc;
  }

  getMargenColorParaProducto(id: string): string {
    const m = this.getMargenParaProducto(id);
    if (m >= 35) return 'verde';
    if (m >= 20) return 'ambar';
    return 'rojo';
  }

  // Brújula accordion por producto (multi-select)
  readonly brujulaExpandido = signal<Set<string>>(new Set());

  toggleBrujulaProducto(id: string): void {
    this.brujulaExpandido.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  isBrujulaExpanded(id: string): boolean {
    return this.brujulaExpandido().has(id);
  }

  getMinPrecio(id: string): number {
    const p = ADA_PRODUCTOS.find(x => x.id === id)!;
    return Math.round((p.costoBase + p.fleteBase) * 1.1);
  }

  getMaxPrecio(id: string): number {
    const p = ADA_PRODUCTOS.find(x => x.id === id)!;
    return Math.round((p.costoBase + p.fleteBase) * 3.5);
  }

  readonly utilidadTotalMulti = computed(() => {
    const pedidos = this.expectativaPedidosSem() * 4;
    return this.selectedProductosList()
      .reduce((sum, p) => sum + this.getGananciaParaProducto(p.id) * (pedidos / (this.selectedProductosList().length || 1)), 0);
  });

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

  // ── Brújula v2: margen→precio + suscripciones ────────────────────────
  readonly SHOPIFY_MENSUAL = 89000;
  readonly CHATEA_MENSUAL = 149000;

  readonly costoSuscripcionMensual = computed(() => {
    const ruta = RUTAS_VENTA.find(r => r.id === this.rutaVentaSeleccionada());
    let total = 0;
    if (ruta?.factoresExtra.includes('shopify'))    total += this.SHOPIFY_MENSUAL;
    if (ruta?.factoresExtra.includes('chatea-pro')) total += this.CHATEA_MENSUAL;
    return total;
  });

  readonly costoSuscripcionPorPedido = computed(() => {
    const pedidosMes = this.expectativaPedidosSem() * 4;
    if (pedidosMes <= 0) return 0;
    return Math.round(this.costoSuscripcionMensual() / pedidosMes);
  });

  readonly margenDeseado = signal(40);

  readonly costoCompletoBase = computed(() =>
    this.costoProd() + this.FLETE_FIJO + this.costoSuscripcionPorPedido()
  );

  readonly precioCalculado = computed(() => {
    const costoTotal = this.costoCompletoBase() + this.pautaEfectivaPorPedido();
    const m = this.margenDeseado() / 100;
    const factor = 1 - m - this.COMISION_PCT / 100;
    if (factor <= 0) return costoTotal * 10;
    return Math.round(costoTotal / factor);
  });

  readonly utilidadPorPedido = computed(() => {
    const p = this.precioCalculado();
    const comision = Math.round(p * this.COMISION_PCT / 100);
    return p - this.costoCompletoBase() - this.pautaEfectivaPorPedido() - comision;
  });

  readonly utilidadMensual = computed(() =>
    this.utilidadPorPedido() * this.expectativaPedidosSem() * 4
  );

  readonly margenSemaforoNuevo = computed(() => {
    const m = this.margenDeseado();
    if (m >= 35) return 'verde';
    if (m >= 20) return 'ambar';
    return 'rojo';
  });

  readonly brujulaGaliOpen = signal(false);

  toggleBrujulaGali(): void {
    this.brujulaGaliOpen.update(v => !v);
  }

  readonly brujulaGaliMsg = computed(() => {
    const m = this.margenDeseado();
    const utilidad = this.utilidadPorPedido();
    const precio = this.precioCalculado();
    if (m < 15) return '⚠️ Con este margen estás casi en break-even. Cualquier variación en costos te haría perder dinero. Sube el margen a al menos 20%.';
    if (m < 25) return `💡 Margen aceptable pero ajustado. Con $${utilidad.toLocaleString('es-CO')}/pedido necesitarás volumen alto para ser rentable.`;
    if (m >= 35 && precio > 200000) return `✦ Margen excelente (${m}%). Precio de $${precio.toLocaleString('es-CO')} puede ser competitivo. Verifica el precio de mercado antes de lanzar.`;
    if (m >= 35) return `✦ Margen excelente (${m}%). Precio saludable para el mercado colombiano.`;
    return `✦ Margen ${m}% — ganancia $${utilidad.toLocaleString('es-CO')} por pedido. Estás en zona segura.`;
  });

  // ── Campaña: Creativos ───────────────────────────────────────────────
  readonly creativoLanding = signal(false);
  readonly creativoAngulo = signal(false);
  readonly creativoAudiencias = signal(false);
  readonly creativoCopy = signal(false);
  readonly creativoChatea = signal(false);
  readonly creativoPorDefinir = signal(false);
  readonly creativosStrategy = signal<'gali' | 'manual' | null>(null);

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
    const id = this.generarNuevoId();
    this.nuevoProyectoId.set(id);
    this.isLaunching.set(true);
    this.launchProgress.set(0);
    this.launchStepActive.set(1);
    setTimeout(() => { this.launchProgress.set(50); this.launchStepActive.set(2); }, 500);
    setTimeout(() => { this.launchProgress.set(100); this.launchStepActive.set(3); }, 1200);
    setTimeout(() => {
      this.isLaunching.set(false);
      this.persistirProyecto(id, 'borrador');
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
      this.persistirProyecto(id, 'activo');
      this.router.navigate(['/gali-6/proyecto', id], { queryParams: { recien: '1' } });
    }, 2500);
  }

  private rutaACanal(rutaId: string | null): { canal: CampanaProyecto['canal']; canalLabel: string; canalColor: string } {
    if (!rutaId || rutaId === 'directo' || rutaId === 'landing-chatea') {
      return { canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#25D366' };
    }
    if (rutaId.startsWith('tiktok')) {
      return { canal: 'tiktok', canalLabel: 'TikTok Ads', canalColor: '#010101' };
    }
    return { canal: 'meta', canalLabel: 'Meta Ads', canalColor: '#1877F2' };
  }

  private persistirProyecto(id: string, estado: 'activo' | 'borrador' = 'activo'): void {
    const tipo = this.selectedTipo() ?? 'lanzar';
    const nombre = this.nombreProyecto() || NOMBRE_SUGERIDO[tipo]();
    const subObjIntent = this.galiIntentRespuesta()?.subObjetivo ?? '';

    // Sub-meta vinculada por el usuario
    const subMetaId = this.subMetaSeleccionadaId();
    const subMetaLabel = subMetaId
      ? getObjetivo().sub_metas.find(sm => sm.id === subMetaId)?.label
      : undefined;

    // Construir campaña desde signals del wizard
    const campanas: CampanaProyecto[] = [];
    if (this.tipoCampanaSeleccionado()) {
      const rutaId = this.rutaVentaSeleccionada();
      const ruta = RUTAS_VENTA.find(r => r.id === rutaId) ?? null;
      const { canal, canalLabel, canalColor } = this.rutaACanal(rutaId);

      const productosRef: ProductoRef[] = this.selectedProductosList().map(p => ({
        id: p.id,
        nombre: p.nombre,
        margenPct: parseInt(p.margenEst, 10) || 0,
        precioVentaLabel: this.preciosPorProducto()[p.id]
          ? `$${Math.round(this.preciosPorProducto()[p.id]).toLocaleString('es-CO')} COP`
          : `$${Math.round((p.costoBase + p.fleteBase) / 0.6).toLocaleString('es-CO')} COP`,
        costoBase: p.costoBase,
        fleteBase: p.fleteBase,
      }));

      const campanaBase: CampanaProyecto = {
        id: `camp-${Date.now().toString(36)}`,
        nombre: `${canalLabel} — ${nombre}`,
        canal,
        canalLabel,
        canalColor,
        producto: productosRef[0]?.nombre ?? null,
        productos: productosRef,
        estado: estado === 'borrador' ? 'borrador' : (productosRef.length > 0 ? 'activa' : 'sin_producto'),
        tipoCampana: this.tipoCampanaSeleccionado() as TipoCampana,
        roasObjetivo: 1.5,
        presupuestoDiario: this.presupuestoDiario(),
        presupuestoDiarioLabel: `$${this.presupuestoDiario().toLocaleString('es-CO')}/día`,
        agentes: Object.entries(this.agentes()).filter(([, v]) => v).map(([k]) => k),
        conexiones: ruta?.integracionesRequeridas ?? [],
        notaGali: estado === 'activo' ? 'Gali monitoreando. Primeras señales en 48h.' : undefined,
      };
      campanas.push(campanaBase);

      // Ruta meta-tiktok → segunda campaña TikTok
      if (rutaId === 'meta-tiktok') {
        campanas.push({
          ...campanaBase,
          id: `camp-${(Date.now() + 1).toString(36)}`,
          canal: 'tiktok',
          canalLabel: 'TikTok Ads',
          canalColor: '#010101',
          nombre: `TikTok Ads — ${nombre}`,
        });
      }
    }

    const nuevo = {
      id,
      nombre,
      tipo,
      estado,
      descripcion: subObjIntent,
      subObjetivo: subMetaLabel ?? subObjIntent,
      subObjetivoId: subMetaId ?? undefined,
      fechaInicio: new Date().toISOString().split('T')[0],
      campanas,
      agentes: Object.entries(this.agentes()).filter(([, v]) => v).map(([k]) => k),
      pedidosSem: 0,
      roasPromedio: 0,
      presupuestoTotal: campanas[0]?.presupuestoDiario ?? 0,
      contribucionPct: 0,
      proyeccionSemanas: null,
      alertaGali: estado === 'borrador' ? 'Proyecto en borrador — agrega una campaña para empezar a generar pedidos.' : null,
      productosMetrics: [],
    };
    try {
      const stored: object[] = JSON.parse(localStorage.getItem('g6_proyectos_extra') ?? '[]');
      stored.push(nuevo);
      localStorage.setItem('g6_proyectos_extra', JSON.stringify(stored));
    } catch { /* ignore storage errors */ }
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
      'sub-meta': 'Tu meta',
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
    // Nuevo orden: productos → tipo → ruta-venta → presupuesto
    if (cur === 'campana-productos') { this.step.set('agregar-campana'); return; }
    if (cur === 'campana-tipo') { this.step.set('campana-productos'); return; }
    if (cur === 'campana-ruta-venta') { this.step.set('campana-tipo'); return; }
    if (cur === 'campana-presupuesto') {
      const tipo = this.tipoCampanaSeleccionado();
      if (tipo === 'chatea' || tipo === 'organica') {
        this.step.set('campana-tipo');
      } else {
        this.step.set('campana-ruta-venta');
      }
      return;
    }
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

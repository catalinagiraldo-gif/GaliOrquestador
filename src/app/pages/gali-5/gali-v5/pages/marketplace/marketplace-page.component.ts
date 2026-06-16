import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SkillsEditorModalComponent } from '../../components/skills-editor-modal/skills-editor-modal.component';

interface CommunitySkill {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Operación' | 'Lanzamiento' | 'Experto' | 'Premium';
  secciones: string[];
  uses: string;
  rating: number;
  copias: number;
  comments: number;
  autor: string;
  handle?: string;
  autorBio?: string;
  autorAvatar: string;
  autorColor: string;
  verificado: boolean;
  tag?: string;
}

type MktAgente = { id: string; nombre: string; color: string; instalado: boolean; creador: string; rating: number; usos: string; descripcion: string; habilidades: string[] };
type MktRegla  = { id: string; titulo: string; agente: string; agentColor: string; descripcion: string; ejemplo: string; usos: string; instalada: boolean };
type MktConexion = { id: string; nombre: string; icono: string; categoria: string; proveedor: string; conectado: boolean; gratis: boolean; agentesUsando: string[]; descripcion: string; datosQueProvee: string[] };

interface PersonalizedSkill {
  id: string;
  title: string;
  reason: string;
  agent: string;
  agentColor: string;
  cta: string;
  installed: boolean;
}

@Component({
  selector: 'app-marketplace-page',
  standalone: true,
  imports: [CommonModule, RouterModule, SkillsEditorModalComponent],
  templateUrl: './marketplace-page.component.html',
  styleUrl: './marketplace-page.component.scss',
})
export class MarketplacePageComponent {
  private router = inject(Router);

  readonly mainCategory = signal<'skills' | 'agentes' | 'reglas' | 'conexiones'>('skills');
  readonly activeTab = signal<'populares' | 'por-seccion' | 'expertos' | 'nuevas'>('populares');
  readonly activeSectionFilter = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly showShareModal = signal(false);
  readonly shareDone = signal(false);
  readonly showEditor = signal(false);
  readonly personalizedInstalled = signal<string[]>([]);

  readonly personalizedSkills: PersonalizedSkill[] = [
    {
      id: 'ps1',
      title: 'Auto-swap si novedad > 10%',
      reason: 'Tu Coordinadora Bogotá está en 15% esta semana. Este skill ya aplicaría ahora mismo.',
      agent: 'Vigilante',
      agentColor: '#f59e0b',
      cta: 'Activar ahora',
      installed: false,
    },
    {
      id: 'ps2',
      title: 'Escalar pauta 15% si ROAS > 2.5x por 48h',
      reason: 'Tu ROAS real es 1.93x en Collar GPS (Meta declara 2.9x). Roax podría escalarlo automáticamente.',
      agent: 'Roax',
      agentColor: '#ff6102',
      cta: 'Activar para Collar GPS',
      installed: false,
    },
    {
      id: 'ps3',
      title: 'P&L real automático semanal',
      reason: 'Tu gap ROAS declarado vs real fue -1.0x esta semana. Automatiza el seguimiento.',
      agent: 'Agente Financiero',
      agentColor: '#8b5cf6',
      cta: 'Activar skill',
      installed: false,
    },
  ];

  // ── Publish flow ────────────────────────────────────────────────────────
  readonly publishOpen   = signal(false);
  readonly publishStep   = signal<'choose' | 'new' | 'existing' | 'done'>('choose');
  readonly publishName   = signal('');
  readonly publishDesc   = signal('');
  readonly publishAgent  = signal('Roax');
  readonly publishPickId = signal<string | null>(null);

  readonly publishBtnLabel = computed(() => ({
    skills:     'Publicar skill',
    agentes:    'Publicar agente',
    reglas:     'Publicar regla',
    conexiones: 'Solicitar integración',
  }[this.mainCategory()]));

  readonly publishModalTitle = computed(() => ({
    skills:     'Publicar skill en el Marketplace',
    agentes:    'Publicar agente en el Marketplace',
    reglas:     'Publicar regla en el Marketplace',
    conexiones: 'Solicitar nueva integración',
  }[this.mainCategory()]));

  // ── "Existing" items the user can pick per category ──────────────────────
  readonly myExistingSkills = [
    { id: 'ms1', nombre: 'Smart Routing de Novedades v2', desc: 'Vigilante · Logística', icon: '⚡' },
    { id: 'ms2', nombre: 'P&L simplificado para declarar', desc: 'Finanzas · Roax', icon: '📊' },
    { id: 'ms3', nombre: 'Recuperación carrito 3 mensajes', desc: 'Chatea Pro · WhatsApp', icon: '💬' },
    { id: 'ms4', nombre: 'Anti-fatiga audiencia Meta', desc: 'Roax · Marketing', icon: '📣' },
  ];
  readonly myExistingAgentes = [
    { id: 'ma1', nombre: 'Mi Agente Drops v2',   desc: 'Personalizado · 4 skills activas', icon: '🤖', color: '#a78bfa' },
    { id: 'ma2', nombre: 'CAS Express',           desc: 'Fork de Chatea Pro · respuesta rápida', icon: '🤖', color: '#34d399' },
  ];
  readonly myExistingReglas = [
    { id: 'mr1', nombre: 'Anticipo zona rural $25k', desc: 'Chatea Pro · Pedidos · activa', icon: '📋' },
    { id: 'mr2', nombre: 'Dayparting 11pm–6am',      desc: 'Roax · Meta Ads · activa', icon: '📋' },
    { id: 'mr3', nombre: 'Auto-confirmación verde',   desc: 'Vigilante · Pedidos · activa', icon: '📋' },
  ];

  get myExistingForCategory() {
    return { skills: this.myExistingSkills, agentes: this.myExistingAgentes, reglas: this.myExistingReglas, conexiones: [] }[this.mainCategory()];
  }

  // ── Published items (user's contributions visible per tab) ───────────────
  readonly myPublishedSkills  = signal([
    { id: 'ps1', nombre: 'Smart Routing de Novedades v2', desc: 'Logística', usos: '234', rating: 4.8, pendingReview: false },
    { id: 'ps2', nombre: 'Recuperación carrito 3 mensajes', desc: 'WhatsApp · CAS', usos: '87', rating: 4.6, pendingReview: false },
    { id: 'ps3', nombre: 'Anti-fatiga audiencia Meta', desc: 'Marketing', usos: '12', rating: 0, pendingReview: true },
  ]);
  readonly myPublishedAgentes = signal([
    { id: 'pa1', nombre: 'CAS Express', desc: 'Fork de Chatea Pro', usos: '41', rating: 4.5, pendingReview: false },
  ]);
  readonly myPublishedReglas  = signal([
    { id: 'pr1', nombre: 'Anticipo zona rural $25k', desc: 'Pedidos · Chatea Pro', usos: '156', rating: 4.7, pendingReview: false },
  ]);

  get myPublishedForCategory() {
    return { skills: this.myPublishedSkills, agentes: this.myPublishedAgentes, reglas: this.myPublishedReglas, conexiones: this.myPublishedSkills }[this.mainCategory()]();
  }

  openPublishModal(): void {
    this.publishStep.set('choose');
    this.publishName.set('');
    this.publishDesc.set('');
    this.publishPickId.set(null);
    this.publishOpen.set(true);
  }
  closePublishModal(): void { this.publishOpen.set(false); }

  goPublishNew():      void { this.publishStep.set('new'); }
  goPublishExisting(): void { this.publishStep.set('existing'); }
  goPublishBack():     void { this.publishStep.set('choose'); this.publishPickId.set(null); }

  selectExistingItem(id: string): void { this.publishPickId.set(id); }

  confirmPublish(): void {
    const cat = this.mainCategory();
    if (this.publishStep() === 'new') {
      const name = this.publishName().trim();
      if (!name) return;
      const newItem = { id: `p${Date.now()}`, nombre: name, desc: this.publishDesc().trim() || cat, usos: '0', rating: 0, pendingReview: true };
      if (cat === 'skills')  this.myPublishedSkills.update(l => [newItem, ...l]);
      if (cat === 'agentes') this.myPublishedAgentes.update(l => [newItem, ...l]);
      if (cat === 'reglas')  this.myPublishedReglas.update(l => [newItem, ...l]);
    } else if (this.publishStep() === 'existing') {
      const pid = this.publishPickId();
      if (!pid) return;
      const src = this.myExistingForCategory?.find(x => x.id === pid);
      if (!src) return;
      const newItem = { id: `p${Date.now()}`, nombre: src.nombre, desc: src.desc, usos: '0', rating: 0, pendingReview: true };
      if (cat === 'skills')  this.myPublishedSkills.update(l => [newItem, ...l]);
      if (cat === 'agentes') this.myPublishedAgentes.update(l => [newItem, ...l]);
      if (cat === 'reglas')  this.myPublishedReglas.update(l => [newItem, ...l]);
    }
    this.publishStep.set('done');
    setTimeout(() => this.publishOpen.set(false), 2000);
  }
  // ────────────────────────────────────────────────────────────────────────

  // Preview modals
  readonly previewAgent = signal<MktAgente | null>(null);
  readonly previewRegla  = signal<MktRegla  | null>(null);
  readonly previewSkillItem = signal<any | null>(null);
  readonly installedAgentIds = signal<string[]>([]);
  readonly installedReglaIds = signal<string[]>([]);

  // Agent assignment (for rule install / create)
  readonly assignAgentIds = signal<string[]>([]);
  readonly allKnownAgents = [
    { id: 'roax',      nombre: 'Roax',       color: '#f97316', custom: false },
    { id: 'vigilante', nombre: 'Vigilante',   color: '#fbbf24', custom: false },
    { id: 'chatea-pro',nombre: 'Chatea Pro',  color: '#34d399', custom: false },
    { id: 'ada-spy',   nombre: 'ADA Spy',     color: '#818cf8', custom: false },
    { id: 'kronos',    nombre: 'Kronos',       color: '#60a5fa', custom: false },
    { id: 'custom-1',  nombre: 'Mi Agente Drops v2', color: '#a78bfa', custom: true },
  ];

  openAgentPreview(ag: MktAgente): void { this.previewAgent.set(ag); }
  closeAgentPreview(): void { this.previewAgent.set(null); }
  openSkillPreview(skill: any): void { this.previewSkillItem.set(skill); }
  closeSkillPreview(): void { this.previewSkillItem.set(null); }
  confirmInstallSkillFromPreview(): void {
    const s = this.previewSkillItem();
    if (s?.id) { this.installPersonalized(s.id); }
    this.previewSkillItem.set(null);
  }
  confirmInstallAgent(): void {
    const ag = this.previewAgent();
    if (!ag) return;
    this.installedAgentIds.update(ids => ids.includes(ag.id) ? ids : [...ids, ag.id]);
    this.previewAgent.set(null);
  }
  isAgentInstalled(id: string): boolean {
    const ag = this.mktAgentes.find(a => a.id === id);
    return (ag?.instalado ?? false) || this.installedAgentIds().includes(id);
  }

  openReglaPreview(r: MktRegla): void {
    // Pre-select the native agent
    const match = this.allKnownAgents.find(a => a.nombre === r.agente);
    this.assignAgentIds.set(match ? [match.id] : []);
    this.previewRegla.set(r);
  }
  closeReglaPreview(): void { this.previewRegla.set(null); }
  toggleAssignAgent(id: string): void {
    this.assignAgentIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }
  confirmInstallRegla(): void {
    const r = this.previewRegla();
    if (!r) return;
    this.installedReglaIds.update(ids => ids.includes(r.id) ? ids : [...ids, r.id]);
    this.previewRegla.set(null);
  }
  isReglaInstalled(id: string): boolean {
    const r = this.mktReglas.find(x => x.id === id);
    return (r?.instalada ?? false) || this.installedReglaIds().includes(id);
  }

  readonly sectionFilters = ['Pedidos', 'Marketing', 'Finanzas', 'Logística', 'Productos', 'CAS'];

  readonly mktAgentes = [
    { id: 'roax', nombre: 'Roax', color: '#f97316', instalado: true, creador: 'Dropi Team', rating: 4.9, usos: '12.4k',
      descripcion: 'Agente de marketing autónomo: pausa campañas, escala presupuesto y rota creativos según ROAS real y CTR.',
      habilidades: ['Auto-pausa CTR', 'Escalado ROAS', 'Anti-fatiga audiencia', 'Dayparting'] },
    { id: 'vigilante', nombre: 'Vigilante', color: '#fbbf24', instalado: true, creador: 'Dropi Team', rating: 4.8, usos: '9.7k',
      descripcion: 'Agente logístico: monitorea novedades por ciudad, reasigna transportadoras y confirma pedidos con huella verde.',
      habilidades: ['Smart routing', 'Monitoreo novedades', 'Auto-confirmación', 'Alerta garantías'] },
    { id: 'chatea-pro', nombre: 'Chatea Pro', color: '#34d399', instalado: true, creador: 'Dropi Team', rating: 4.7, usos: '6.2k',
      descripcion: 'Agente de CAS: responde WhatsApp, recupera carritos abandonados y escala casos complejos al dropshipper.',
      habilidades: ['Respuesta WhatsApp', 'Recuperación carrito', 'Escalamiento inteligente'] },
    { id: 'ada-spy', nombre: 'ADA Spy', color: '#818cf8', instalado: false, creador: 'Dropi Team', rating: 4.6, usos: '4.1k',
      descripcion: 'Agente de inteligencia de mercado: detecta productos trending en LATAM y alerta cuando hay ventana de oportunidad.',
      habilidades: ['Alerta nichos', 'Trending LATAM', 'Score oportunidad', 'Análisis competencia'] },
    { id: 'kronos', nombre: 'Kronos', color: '#60a5fa', instalado: false, creador: 'Dropi Team', rating: 4.8, usos: '3.9k',
      descripcion: 'Agente financiero: monitorea P&L real, proyecta flujo de caja y conecta con Siigo para facturación.',
      habilidades: ['P&L real', 'Proyección flujo caja', 'Siigo sync', 'ROAS break-even'] },
  ];

  readonly mktReglas = [
    { id: 'r1', titulo: 'Si ROAS < 2x por 24h → pausar campaña', agente: 'Roax', agentColor: '#f97316',
      descripcion: 'Pausa automáticamente la campaña activa cuando el ROAS cae bajo el objetivo durante un día completo.',
      ejemplo: 'IF roas_real < 2.0 AND duracion >= 24h THEN pausar_campaña + notificar', usos: '8.4k', instalada: true },
    { id: 'r2', titulo: 'Si novedad Bogotá > 10% → reasignar a Servientrega', agente: 'Vigilante', agentColor: '#fbbf24',
      descripcion: 'Cambia transportadora automáticamente en pedidos de Bogotá cuando la tasa de novedad supera el umbral.',
      ejemplo: 'IF novedad_ciudad["Bogotá"] > 0.10 THEN reasignar_transportadora("Servientrega")', usos: '3.1k', instalada: true },
    { id: 'r3', titulo: 'Si frecuencia > 2.5x → rotar creativo', agente: 'Roax', agentColor: '#f97316',
      descripcion: 'Sustituye el creativo activo por el siguiente en la cola cuando la frecuencia de impacto supera 2.5.',
      ejemplo: 'IF frecuencia > 2.5 THEN activar_siguiente_creativo + archivar_actual', usos: '2.7k', instalada: false },
    { id: 'r4', titulo: 'Si pedido huella verde → auto-confirmar', agente: 'Vigilante', agentColor: '#fbbf24',
      descripcion: 'Confirma pedidos sin intervención del dropshipper cuando todos los indicadores de riesgo están en verde.',
      ejemplo: 'IF huella === "verde" AND wallet_ok AND direccion_valida THEN confirmar_pedido', usos: '11.2k', instalada: false },
    { id: 'r5', titulo: 'Si CTR < 0.8% por 48h → diagnóstico Gali', agente: 'Roax', agentColor: '#f97316',
      descripcion: 'Solicita un diagnóstico cruzado automático cuando el CTR se mantiene bajo dos días seguidos.',
      ejemplo: 'IF ctr < 0.008 AND duracion >= 48h THEN solicitar_diagnostico_cruzado', usos: '1.9k', instalada: false },
  ];

  readonly mktConexiones: MktConexion[] = [
    { id: 'meta-ads', nombre: 'Meta Ads Manager', icono: '📣', categoria: 'Ads',
      proveedor: 'Meta Business', conectado: true, gratis: false,
      agentesUsando: ['Roax'],
      descripcion: 'Roax lee ROAS, CTR y gasto en tiempo real. Pausa y escala presupuestos automáticamente.',
      datosQueProvee: ['ROAS en tiempo real', 'CTR por creativo', 'Gasto diario', 'Frecuencia de impacto'] },
    { id: 'whatsapp', nombre: 'WhatsApp Business', icono: '💬', categoria: 'Mensajería',
      proveedor: 'Meta', conectado: true, gratis: false,
      agentesUsando: ['Chatea Pro'],
      descripcion: 'Chatea Pro responde mensajes, recupera carritos abandonados y escala casos complejos.',
      datosQueProvee: ['Conversaciones activas', 'Tasa de respuesta', 'Carritos recuperados', 'Casos escalados'] },
    { id: 'gdrive', nombre: 'Google Drive', icono: '📁', categoria: 'Storage',
      proveedor: 'Google', conectado: true, gratis: true,
      agentesUsando: ['ADA Spy', 'Kronos'],
      descripcion: 'Gali lee y escribe reportes en Drive. ADA Spy exporta análisis de competencia automáticamente.',
      datosQueProvee: ['Reportes semanales', 'CSVs de pedidos', 'Creativos de campaña', 'P&L histórico'] },
    { id: 'gsheets', nombre: 'Google Sheets', icono: '📊', categoria: 'Storage',
      proveedor: 'Google', conectado: true, gratis: true,
      agentesUsando: ['Kronos', 'ADA Spy'],
      descripcion: 'Kronos actualiza tu P&L y métricas de campañas en tiempo real directamente en Sheets.',
      datosQueProvee: ['P&L en vivo', 'ROAS histórico', 'Inventario', 'Métricas de campañas'] },
    { id: 'tiktok', nombre: 'TikTok Shop', icono: '🎵', categoria: 'Ads',
      proveedor: 'TikTok for Business', conectado: false, gratis: false,
      agentesUsando: ['Roax'],
      descripcion: 'Gestiona campañas TikTok y ventas en tienda. Roax unifica métricas junto con Meta Ads.',
      datosQueProvee: ['Ventas TikTok Shop', 'ROAS TikTok', 'Creativos activos', 'Audiencias similares'] },
    { id: 'shopify', nombre: 'Shopify', icono: '🛍', categoria: 'Commerce',
      proveedor: 'Shopify Inc.', conectado: false, gratis: false,
      agentesUsando: ['Vigilante', 'Kronos'],
      descripcion: 'Sincroniza inventario bidireccional. Vigilante monitorea stock y Kronos registra ventas.',
      datosQueProvee: ['Inventario real', 'Órdenes en tiempo real', 'Productos activos', 'Ventas por SKU'] },
    { id: 'notion', nombre: 'Notion', icono: '📝', categoria: 'Storage',
      proveedor: 'Notion Labs', conectado: false, gratis: true,
      agentesUsando: ['Kronos'],
      descripcion: 'Kronos sincroniza proyectos y tareas. Mantén tu base de conocimiento actualizada con datos reales.',
      datosQueProvee: ['Bases de datos', 'Páginas de proyecto', 'Calendarios', 'Documentos compartidos'] },
    { id: 'woocommerce', nombre: 'WooCommerce', icono: '🛒', categoria: 'Commerce',
      proveedor: 'Automattic', conectado: false, gratis: false,
      agentesUsando: ['Vigilante', 'Kronos'],
      descripcion: 'Conecta tu tienda WooCommerce para sincronizar pedidos, inventario y métricas de ventas.',
      datosQueProvee: ['Pedidos en tiempo real', 'Stock', 'Ingresos', 'Historial de clientes'] },
  ];

  readonly installedConexionIds = signal<string[]>([]);

  isConexionConnected(id: string): boolean {
    const cx = this.mktConexiones.find(c => c.id === id);
    return (cx?.conectado ?? false) || this.installedConexionIds().includes(id);
  }
  toggleConexion(id: string): void {
    this.installedConexionIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }
  get connectedConexionCount(): number {
    return this.mktConexiones.filter(c => this.isConexionConnected(c.id)).length;
  }

  readonly mktPlugins = [
    { id: 'siigo', nombre: 'Siigo', icono: '📊', tipo: 'Contabilidad', proveedor: 'Siigo SAS', gratis: false, instalado: true,
      descripcion: 'Kronos registra ventas y costos en Siigo automáticamente. Declaración de renta simplificada.' },
    { id: 'wms', nombre: 'WMS / ERP', icono: '🏭', tipo: 'Logística', proveedor: 'Multi-proveedor', gratis: false, instalado: false,
      descripcion: 'Conecta tu WMS o ERP para que Vigilante tenga visibilidad de inventario en tiempo real.' },
    { id: 'openai', nombre: 'OpenAI API', icono: '🧠', tipo: 'IA', proveedor: 'OpenAI', gratis: false, instalado: false,
      descripcion: 'Extiende las capacidades de análisis de Gali con modelos GPT-4o para tareas especializadas.' },
    { id: 'sendgrid', nombre: 'SendGrid', icono: '✉', tipo: 'Email', proveedor: 'Twilio', gratis: true, instalado: false,
      descripcion: 'Envía emails transaccionales automáticos desde las reglas de Chatea Pro y confirmaciones de pedido.' },
    { id: 'webhook', nombre: 'Webhook MCP', icono: '🔗', tipo: 'Integración', proveedor: 'Custom', gratis: true, instalado: false,
      descripcion: 'Conecta cualquier sistema externo mediante webhooks. Ideal para integrar tu ERP propio.' },
    { id: 'stripe', nombre: 'Stripe', icono: '💳', tipo: 'Pagos', proveedor: 'Stripe Inc.', gratis: false, instalado: false,
      descripcion: 'Kronos registra cobros y reembolsos. Ideal para modelos de suscripción o pagos contra entrega digital.' },
  ];

  readonly allSkills: CommunitySkill[] = [
    {
      id: 'pop-1', nombre: 'Auto-pausa CTR bajo', tipo: 'Operación',
      secciones: ['Marketing'], uses: '3.4k', rating: 4.9, copias: 312, comments: 48,
      descripcion: 'Pausa la campaña activa cuando el CTR cae por debajo del 0.8% durante 48h y notifica con diagnóstico.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true, tag: 'Top usado',
    },
    {
      id: 'pop-2', nombre: 'P&L real vs ROAS declarado', tipo: 'Operación',
      secciones: ['Finanzas', 'Marketing'], uses: '2.1k', rating: 4.8, copias: 189, comments: 37,
      descripcion: 'Detecta discrepancias entre el ROAS reportado en Meta y el P&L real descontando flete, novedades y COGS.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true,
    },
    {
      id: 'pop-3', nombre: 'Smart routing novedad Cali', tipo: 'Operación',
      secciones: ['Logística', 'Pedidos'], uses: '1.8k', rating: 4.7, copias: 134, comments: 22,
      descripcion: 'Reasigna pedidos automáticamente a la transportadora con menor novedad cuando un umbral regional supera el 10%.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true,
    },
    {
      id: 'pop-4', nombre: 'Auto-confirmación pedidos verdes', tipo: 'Operación',
      secciones: ['Pedidos'], uses: '4.5k', rating: 4.9, copias: 401, comments: 67,
      descripcion: 'Confirma automáticamente pedidos con huella verde sin intervención del dropshipper. Ahorra 30-45 min/día.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true, tag: 'Más popular',
    },
    {
      id: 'exp-1', nombre: 'Scaling vertical — 20% cada 48h', tipo: 'Experto',
      secciones: ['Marketing'], uses: '847', rating: 4.9, copias: 203, comments: 34,
      descripcion: 'Escala presupuesto +20% cada 48h si el ROAS se mantiene sobre el objetivo. Con límites inteligentes y rollback automático.',
      autor: 'Alejandro Torres', handle: '@AlejandroTorres',
      autorBio: 'Dropshipper top · 1.200+ ventas/mes · 3 años en Dropi',
      autorAvatar: 'AT', autorColor: '#f97316', verificado: true,
    },
    {
      id: 'exp-2', nombre: 'P&L simplificado para declarar', tipo: 'Experto',
      secciones: ['Finanzas'], uses: '623', rating: 4.7, copias: 118, comments: 19,
      descripcion: 'Calcula automáticamente tu utilidad real descontando flete, novedad, pauta y COGS. Compatible con declaración de renta.',
      autor: 'Carlos Pérez CPA', handle: '@ContadorDropi',
      autorBio: 'Contador certificado · especialista en dropshipping',
      autorAvatar: 'CP', autorColor: '#3b82f6', verificado: true,
    },
    {
      id: 'exp-3', nombre: 'Bundle mascotas: 5 productos ganadores', tipo: 'Experto',
      secciones: ['Productos'], uses: '412', rating: 4.6, copias: 76, comments: 12,
      descripcion: 'Alerta cuando los 5 productos clave del nicho mascotas tienen ventana simultánea. Incluye configuración de scoring.',
      autor: 'María Gómez', handle: '@PetDropper',
      autorBio: 'Nicho mascotas · Top seller noviembre 2025',
      autorAvatar: 'MG', autorColor: '#10b981', verificado: false,
    },
    {
      id: 'exp-4', nombre: 'CAS → Recuperación carrito abandonado', tipo: 'Experto',
      secciones: ['CAS', 'Marketing'], uses: '389', rating: 4.8, copias: 91, comments: 27,
      descripcion: 'Secuencia de 3 mensajes WhatsApp: recordatorio suave → urgencia → oferta final. Personalizado con nombre del producto.',
      autor: 'Luis Vargas', handle: '@ChateaProLuis',
      autorBio: 'Chatea Pro power user · tasa recuperación 38%',
      autorAvatar: 'LV', autorColor: '#8b5cf6', verificado: true,
    },
    {
      id: 'new-1', nombre: 'Confirmación inteligente pedidos', tipo: 'Operación',
      secciones: ['Pedidos'], uses: '312', rating: 4.5, copias: 28, comments: 8,
      descripcion: 'Confirma pedidos con huella verde automáticamente en el horario que configures.',
      autor: 'Dropi Team', autorAvatar: 'DT', autorColor: '#f49a3d', verificado: true, tag: 'Nuevo',
    },
    {
      id: 'new-2', nombre: 'Detector de productos trending', tipo: 'Operación',
      secciones: ['Productos'], uses: '198', rating: 4.4, copias: 14, comments: 5,
      descripcion: 'Detecta productos con tendencia creciente en Dropi LATAM antes de que saturen el mercado.',
      autor: 'Equipo ADA Spy', autorAvatar: 'AS', autorColor: '#818cf8', verificado: true, tag: 'Nuevo',
    },
    {
      id: 'new-3', nombre: 'Anti-fatiga de audiencia', tipo: 'Operación',
      secciones: ['Marketing'], uses: '445', rating: 4.6, copias: 39, comments: 11,
      descripcion: 'Rota creativos automáticamente cuando la frecuencia supera 2.5x para evitar saturación.',
      autor: 'Roax Team', autorAvatar: 'RX', autorColor: '#f97316', verificado: true, tag: 'Nuevo',
    },
  ];

  readonly filteredSkills = computed(() => {
    const tab = this.activeTab();
    const section = this.activeSectionFilter();
    const q = this.searchQuery().toLowerCase();

    let skills = this.allSkills;

    if (q) {
      skills = skills.filter(s =>
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q) ||
        s.secciones.some(sec => sec.toLowerCase().includes(q))
      );
    }

    if (section) {
      skills = skills.filter(s => s.secciones.includes(section));
    }

    if (tab === 'populares') {
      return skills.filter(s => s.tipo === 'Operación').sort((a, b) => parseInt(b.uses) - parseInt(a.uses));
    }
    if (tab === 'expertos') {
      return skills.filter(s => s.tipo === 'Experto');
    }
    if (tab === 'nuevas') {
      return skills.filter(s => s.tag === 'Nuevo');
    }
    // por-seccion: all
    return skills;
  });

  setSection(section: string | null): void {
    this.activeSectionFilter.set(section);
    this.activeTab.set('por-seccion');
  }

  activateSkill(id: string): void {
    this.router.navigate(['/gali-v5/skills/nueva'], { queryParams: { base: id } });
  }

  activateRegla(id: string): void {
    this.router.navigate(['/gali-v5/reglas'], { queryParams: { nueva: '1', base: id } });
  }

  forkSkill(id: string): void {
    this.router.navigate(['/gali-v5/skills/nueva'], { queryParams: { fork: id } });
  }

  openShareModal(): void {
    this.showShareModal.set(true);
  }

  confirmShare(): void {
    this.showShareModal.set(false);
    this.shareDone.set(true);
    setTimeout(() => this.shareDone.set(false), 4000);
  }

  goToMySkills(): void {
    this.router.navigate(['/gali-v5/skills']);
  }

  installPersonalized(id: string): void {
    this.personalizedInstalled.update(l => [...l, id]);
  }

  isPersonalizedInstalled(id: string): boolean {
    return this.personalizedInstalled().includes(id);
  }
}

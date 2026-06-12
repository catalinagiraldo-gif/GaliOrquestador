import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GaliAgencyThresholdsPanelComponent } from '../../components/gali-agency-thresholds-panel/gali-agency-thresholds-panel.component';
import { SkillPickerModalComponent } from './skill-picker-modal.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { AgentCardAliveComponent, AgentCardData } from '../../components/agent-card-alive/agent-card-alive.component';
import { GaliGlosarioDirective } from '../../directives/gali-glosario.directive';
import { GaliOntologyStripComponent } from '../../components/gali-ontology-strip/gali-ontology-strip.component';
import USER_SKILLS from '../../../../../../mocks/gali-v5/user-skills.json';

interface DataSource {
  id: string;
  nombre: string;
  tipo: 'dropi' | 'ads' | 'contabilidad' | 'externo';
  status: 'conectado' | 'desconectado';
  ultimaSync: string;
  icon: string;
}

const AGENT_DATA_SOURCES: Record<string, DataSource[]> = {
  roax: [
    { id: 'ds-dropi', nombre: 'Dropi Data', tipo: 'dropi', status: 'conectado', ultimaSync: 'hace 15 min', icon: '🛒' },
    { id: 'ds-meta', nombre: 'Meta Ads API', tipo: 'ads', status: 'conectado', ultimaSync: 'hace 30 min', icon: '📘' },
    { id: 'ds-google', nombre: 'Google Ads', tipo: 'ads', status: 'desconectado', ultimaSync: 'Sin conectar', icon: '🔵' },
  ],
  vigilante: [
    { id: 'ds-dropi', nombre: 'Dropi Data', tipo: 'dropi', status: 'conectado', ultimaSync: 'hace 5 min', icon: '🛒' },
    { id: 'ds-pedidos', nombre: 'Pedidos en tránsito', tipo: 'dropi', status: 'conectado', ultimaSync: 'hace 2 min', icon: '📦' },
  ],
  'chatea-pro': [
    { id: 'ds-dropi', nombre: 'Dropi Data', tipo: 'dropi', status: 'conectado', ultimaSync: 'hace 10 min', icon: '🛒' },
    { id: 'ds-whatsapp', nombre: 'WhatsApp Business', tipo: 'externo', status: 'conectado', ultimaSync: 'hace 1 min', icon: '💬' },
  ],
  'ada-spy': [
    { id: 'ds-dropi', nombre: 'Dropi Marketplace', tipo: 'dropi', status: 'conectado', ultimaSync: 'hace 20 min', icon: '🛒' },
    { id: 'ds-csv', nombre: 'Archivo CSV competidores', tipo: 'externo', status: 'desconectado', ultimaSync: 'Sin conectar', icon: '📄' },
  ],
  kronos: [
    { id: 'ds-dropi', nombre: 'Dropi Finanzas', tipo: 'dropi', status: 'conectado', ultimaSync: 'hace 3 min', icon: '🛒' },
    { id: 'ds-siigo', nombre: 'Siigo', tipo: 'contabilidad', status: 'conectado', ultimaSync: 'hace 6 días', icon: '📊' },
    { id: 'ds-meta', nombre: 'Meta Ads (costos)', tipo: 'ads', status: 'conectado', ultimaSync: 'hace 45 min', icon: '📘' },
  ],
};

interface AgentSkill {
  name: string;
  status: 'active' | 'paused';
  runs: number;
}

interface AgentAction {
  text: string;
  time: string;
  result: 'ok' | 'warn' | 'info';
  impact?: string;
  tipo?: 'ejecutó' | 'alertó' | 'esperó';
  antes?: string;
  despues?: string;
}

interface AgentCTA {
  label: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'warn';
}

interface AgentRule {
  id: string;
  titulo: string;
  descripcion: string;
  activa: boolean;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  status: 'activo' | 'esperando' | 'pausa';
  lastAction: string;
  lastActionTime: string;
  successRate: number;
  actionsThisWeek: number;
  autopilotEnabled: boolean;
  skills: AgentSkill[];
  description: string;
  capabilities: string[];
  recentHistory: AgentAction[];
  ctas: AgentCTA[];
  activeRules: AgentRule[];
}

const AGENTS: Agent[] = [
  {
    id: 'roax',
    name: 'Roax',
    role: 'Media Buyer',
    color: '#f97316',
    status: 'activo',
    lastAction: 'Escaló presupuesto de Collar GPS +30%',
    lastActionTime: 'hace 2h',
    successRate: 94,
    actionsThisWeek: 18,
    autopilotEnabled: true,
    description: 'Gestiona tus campañas en Meta Ads. Monitorea ROAS, escala presupuestos cuando funcionan y pausa cuando no.',
    capabilities: [
      'Escalar presupuesto cuando ROAS supera meta',
      'Pausar adsets con CTR bajo por 3 días',
      'Cambiar creativos con saturación alta',
      'Generar informes de atribución',
      'Configurar audiencias lookalike automáticas',
    ],
    skills: [
      { name: 'Auto-pausa si CTR cae', status: 'active', runs: 7 },
      { name: 'Escalado ROAS automático', status: 'active', runs: 3 },
    ],
    recentHistory: [
      { text: 'Escaló presupuesto Collar GPS de $50k → $65k/día', time: 'hace 2h', result: 'ok', impact: '+23% pedidos estimados', tipo: 'ejecutó', antes: '$50k/día', despues: '$65k/día · ROAS 1.93→2.1x' },
      { text: 'Pausó adset "Jóvenes 18-24 Cali" — CTR 0.4% por 4 días', time: 'hace 6h', result: 'warn', impact: 'Ahorró $35k en gasto ineficiente', tipo: 'ejecutó', antes: 'CTR 0.4% · activo', despues: 'Pausado · gasto diario -$35k' },
      { text: 'Detectó saturación creativo "Collar rojo" — sugiere nueva versión', time: 'hace 2 días', result: 'warn', tipo: 'alertó' },
      { text: 'Informe semanal generado — ROAS promedio 3.2x', time: 'ayer 9pm', result: 'info', tipo: 'ejecutó' },
    ],
    ctas: [
      { label: 'Escalar campaña activa', icon: 'pi-arrow-up-right', variant: 'primary' },
      { label: 'Ver informe de ROAS', icon: 'pi-chart-line', variant: 'secondary' },
      { label: 'Pausar todo hasta revisar', icon: 'pi-pause', variant: 'warn' },
    ],
    activeRules: [
      { id: 'roax-r1', titulo: 'Auto-pausa si CTR < 1% por 48h', descripcion: 'Pausa el adset y notifica con resumen de impacto. Se ejecuta a las 6am.', activa: true },
      { id: 'roax-r2', titulo: 'Escalar presupuesto si ROAS > meta', descripcion: 'Aumenta hasta 30% el presupuesto diario si ROAS supera el objetivo 3 días seguidos.', activa: true },
      { id: 'roax-r3', titulo: 'Rotar creativo con saturación > 80%', descripcion: 'Sugiere reemplazo si la frecuencia supera 3.5 impresiones por usuario.', activa: false },
    ],
  },
  {
    id: 'vigilante',
    name: 'Vigilante',
    role: 'Logística & Pedidos',
    color: '#fbbf24',
    status: 'activo',
    lastAction: 'Cambió 12 pedidos de Coordinadora a Servientrega',
    lastActionTime: 'hace 2h',
    successRate: 91,
    actionsThisWeek: 34,
    autopilotEnabled: true,
    description: 'Monitorea tus pedidos 24/7. Detecta novedades, cambia transportadoras automáticamente y alerta cuando algo requiere tu atención.',
    capabilities: [
      'Detectar pedidos estancados +72h en bodega',
      'Cambiar transportadora automáticamente en novedades',
      'Evaluar "huella digital" del cliente antes de despachar',
      'Alertar pedidos con riesgo de fraude',
      'Reagendar entregas fallidas con cliente',
    ],
    skills: [
      { name: 'Smart routing de novedades', status: 'active', runs: 12 },
      { name: 'Alerta de pedidos estancados', status: 'paused', runs: 5 },
    ],
    recentHistory: [
      { text: 'Redirigió 12 pedidos Bogotá de Coordinadora a Servientrega por novedades', time: 'hace 2h', result: 'ok', impact: 'Tasa de entrega 94%→97%', tipo: 'ejecutó', antes: 'Coordinadora · novedad 15%', despues: 'Servientrega · ruta activa' },
      { text: 'Detectó 3 pedidos estancados en Medellín +72h — enviado a CAS', time: 'hace 5h', result: 'warn', impact: 'Clientes notificados', tipo: 'alertó' },
      { text: 'Alertó: pedido #P-4892 con historial de fraude — requiere revisión', time: 'hace 1 día', result: 'warn', tipo: 'alertó' },
      { text: 'Procesó 89 despachos sin novedades', time: 'ayer', result: 'ok', impact: '$2.3M en pedidos', tipo: 'ejecutó' },
    ],
    ctas: [
      { label: 'Ver pedidos con novedad', icon: 'pi-exclamation-triangle', variant: 'warn' },
      { label: 'Activar smart routing', icon: 'pi-cog', variant: 'primary' },
      { label: 'Ver torre logística', icon: 'pi-map', variant: 'secondary' },
    ],
    activeRules: [
      { id: 'vig-r1', titulo: 'Smart routing de novedad', descripcion: 'Cambia transportadora si la tasa de éxito cae bajo el 90% en los últimos 50 despachos.', activa: true },
      { id: 'vig-r2', titulo: 'Alerta pedidos estancados > 72h', descripcion: 'Envía alerta si un pedido lleva más de 72h en bodega sin movimiento.', activa: false },
      { id: 'vig-r3', titulo: 'Revisión de huella digital', descripcion: 'Bloquea despacho si el cliente tiene más de 2 novedades sin resolver en los últimos 30 días.', activa: true },
    ],
  },
  {
    id: 'chatea',
    name: 'Chatea Pro',
    role: 'Cierre & CAS',
    color: '#34d399',
    status: 'activo',
    lastAction: 'Confirmó 43 pedidos por WhatsApp',
    lastActionTime: 'hace 4h',
    successRate: 88,
    actionsThisWeek: 127,
    autopilotEnabled: true,
    description: 'Gestiona tus conversaciones de WhatsApp. Confirma pedidos, responde preguntas frecuentes y escala a ti cuando no puede resolver.',
    capabilities: [
      'Confirmar pedidos nuevos por WhatsApp',
      'Responder preguntas de estado de envío',
      'Recuperar carritos abandonados',
      'Escalar a CAS cuando no puede resolver',
      'Aprender de tus respuestas para mejorar',
    ],
    skills: [
      { name: 'Confirmación automática de pedidos', status: 'active', runs: 89 },
      { name: 'Recuperación de carritos abandonados', status: 'active', runs: 23 },
    ],
    recentHistory: [
      { text: 'Confirmó 43 pedidos por WhatsApp sin intervención', time: 'hace 4h', result: 'ok', impact: '$4.7M en pedidos', tipo: 'ejecutó' },
      { text: 'Recuperó 7 carritos abandonados — respondió "¿llegará a tiempo?"', time: 'hace 8h', result: 'ok', impact: '+$630k recuperados', tipo: 'ejecutó' },
      { text: 'Escaló 3 tickets a CAS — no pudo resolver reclamo de garantía', time: 'hace 1 día', result: 'warn', tipo: 'alertó' },
      { text: 'Aprendió nueva respuesta sobre cambios de dirección', time: 'hace 2 días', result: 'info', tipo: 'ejecutó' },
    ],
    ctas: [
      { label: 'Ver bandeja CAS', icon: 'pi-inbox', variant: 'primary' },
      { label: 'Enseñarle nueva respuesta', icon: 'pi-book', variant: 'secondary' },
      { label: 'Ver historial de conversaciones', icon: 'pi-comments', variant: 'secondary' },
    ],
    activeRules: [
      { id: 'chat-r1', titulo: 'Confirmación automática de pedidos', descripcion: 'Confirma pedidos entrantes en < 2 minutos con mensaje personalizado según el canal.', activa: true },
      { id: 'chat-r2', titulo: 'Recuperación de carrito abandonado', descripcion: 'Envía recordatorio a las 2h si el usuario consultó precio pero no confirmó.', activa: true },
      { id: 'chat-r3', titulo: 'Escalar si no puede resolver en 2 intentos', descripcion: 'Deriva al agente humano de CAS si lleva 2 turnos sin resolver la solicitud.', activa: true },
    ],
  },
  {
    id: 'ada',
    name: 'ADA Spy',
    role: 'Research & Oportunidades',
    color: '#818cf8',
    status: 'esperando',
    lastAction: 'Detectó oportunidad: Difusor aromaterapia (score 87)',
    lastActionTime: 'hace 8h',
    successRate: 79,
    actionsThisWeek: 6,
    autopilotEnabled: false,
    description: 'Analiza el mercado para encontrar productos con alta demanda y baja competencia. Evalúa márgenes, tendencias y riesgo.',
    capabilities: [
      'Detectar productos con alta demanda y baja saturación',
      'Calcular margen real incluyendo flete y COGS',
      'Analizar competencia y ventana de oportunidad',
      'Rankear productos por "fit" con tu historial de nichos',
      'Buscar por descripción semántica de audiencia',
    ],
    skills: [
      { name: 'Alerta de oportunidades diaria', status: 'active', runs: 14 },
    ],
    recentHistory: [
      { text: 'Detectó: Difusor aromaterapia — score 87, ventana 12 días', time: 'hace 8h', result: 'ok', impact: 'Margen estimado 65%', tipo: 'ejecutó' },
      { text: 'Analizó 34 productos en nicho salud y bienestar', time: 'ayer', result: 'info', tipo: 'ejecutó' },
      { text: 'Alertó: Rodillo de jade aumenta 40% en Bogotá esta semana', time: 'hace 2 días', result: 'warn', impact: '8 días de ventana', tipo: 'alertó' },
      { text: 'Completó análisis de competencia para Collar GPS', time: 'hace 3 días', result: 'ok', tipo: 'ejecutó' },
    ],
    ctas: [
      { label: 'Buscar nueva oportunidad', icon: 'pi-search', variant: 'primary' },
      { label: 'Ver análisis de mercado', icon: 'pi-eye', variant: 'secondary' },
      { label: 'Ir a Caza Productos', icon: 'pi-bolt', variant: 'secondary' },
    ],
    activeRules: [
      { id: 'ada-r1', titulo: 'Alerta de oportunidades diaria', descripcion: 'Envía reporte matutino con top 3 productos con score > 80 que aún tienen ventana.', activa: true },
      { id: 'ada-r2', titulo: 'Ventana crítica < 5 días', descripcion: 'Alerta urgente si un producto tiene ventana < 5 días y score > 85.', activa: false },
    ],
  },
  {
    id: 'kronos',
    name: 'Kronos',
    role: 'Finanzas & P&L',
    color: '#60a5fa',
    status: 'activo',
    lastAction: 'Detectó 28 pedidos entregados sin facturar en Siigo',
    lastActionTime: 'hace 1h',
    successRate: 96,
    actionsThisWeek: 22,
    autopilotEnabled: false,
    description: 'Gestiona tu P&L en tiempo real. Facturación automática en Siigo al estado "Entregado", análisis de márgenes por canal y alertas de riesgo fiscal.',
    capabilities: [
      'Calcular P&L real descontando flete, COGS, novedades y garantías',
      'Facturar automáticamente en Siigo cuando el pedido llega a "Entregado"',
      'Desglosar ROAS real por canal: Meta, TikTok Shop, Shopify, WhatsApp',
      'Alertar sobre deuda fiscal acumulada sin facturar',
      'Proyectar utilidad neta de las próximas 4 semanas según el escenario actual',
    ],
    skills: [
      { name: 'Facturación automática Siigo', status: 'paused', runs: 0 },
      { name: 'Alerta umbral P&L semanal', status: 'active', runs: 8 },
    ],
    recentHistory: [
      { text: 'Detectó 28 pedidos entregados sin facturar — riesgo fiscal', time: 'hace 1h', result: 'warn', impact: '$4.2M sin declarar', tipo: 'alertó' },
      { text: 'Calculó P&L real Mayo: $3.8M utilidad neta (25.7% margen)', time: 'hace 3h', result: 'ok', impact: 'ROAS Meta 3.1× · real Dropi 1.93×', tipo: 'ejecutó' },
      { text: 'Alertó: ROAS TikTok Shop supera Meta en formato video corto', time: 'ayer', result: 'info', impact: 'Oportunidad de redistribución presupuesto', tipo: 'alertó' },
      { text: 'Conectó pipeline Siigo — pendiente activación de regla por ti', time: 'hace 2 días', result: 'warn', tipo: 'esperó' },
    ],
    ctas: [
      { label: 'Conectar Siigo', icon: 'pi-link', variant: 'primary' },
      { label: 'Ver P&L por canal', icon: 'pi-chart-bar', variant: 'secondary' },
      { label: 'Ver Dashboard Financiero', icon: 'pi-wallet', variant: 'secondary' },
    ],
    activeRules: [
      { id: 'kro-r1', titulo: 'Facturación automática Siigo', descripcion: 'Factura en Siigo cuando el pedido llega a estado "Entregado". Requiere conexión activa.', activa: false },
      { id: 'kro-r2', titulo: 'Alerta umbral P&L semanal', descripcion: 'Notifica si el margen neto cae por debajo del 20% en la semana en curso.', activa: true },
      { id: 'kro-r3', titulo: 'Reporte ROAS real semanal', descripcion: 'Genera comparativo ROAS reportado vs real descontando flete, novedades y COGS.', activa: true },
    ],
  },
];

interface CustomAgentDraft {
  nombre: string;
  rol: string;
  descripcion: string;
  skills: string[];
  reglaCondicion: string;
  reglaAccion: string;
  autopilotEnabled: boolean;
  autonomyThreshold: number;
  conexiones: string[];
  step: 1 | 2 | 3 | 4 | 5;
}

const DRAFT_DEFAULT: CustomAgentDraft = {
  nombre: '', rol: '', descripcion: '', skills: [],
  reglaCondicion: '', reglaAccion: '', autopilotEnabled: false, autonomyThreshold: 70, conexiones: [], step: 1,
};

@Component({
  selector: 'app-agentes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GaliAgencyThresholdsPanelComponent, SkillPickerModalComponent, AgentCardAliveComponent, GaliGlosarioDirective, GaliOntologyStripComponent],
  templateUrl: './agentes-page.component.html',
  styleUrl: './agentes-page.component.scss',
})
export class AgentesPageComponent implements OnInit, OnDestroy {
  private readonly ws = inject(GaliWorkspaceService);

  // Onboarding primera visita
  readonly showOntologyOnboarding = signal(false);
  private ontologyTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const seen = localStorage.getItem('gali_ontology_seen');
    if (!seen) {
      this.showOntologyOnboarding.set(true);
      this.ontologyTimer = setTimeout(() => {
        this.dismissOntologyOnboarding();
      }, 20000);
    }
  }

  ngOnDestroy(): void {
    if (this.ontologyTimer) clearTimeout(this.ontologyTimer);
  }

  dismissOntologyOnboarding(): void {
    this.showOntologyOnboarding.set(false);
    localStorage.setItem('gali_ontology_seen', 'true');
    if (this.ontologyTimer) {
      clearTimeout(this.ontologyTimer);
      this.ontologyTimer = null;
    }
  }

  // Lista mutable — los agentes creados se añaden aquí
  readonly agentsList = signal<Agent[]>([...AGENTS]);
  selectedAgent = signal<Agent>(AGENTS[0]);
  readonly showCreateAgent = signal(false);
  readonly showAgencyPanel = signal(false);
  readonly showHowItWorks = signal(false);
  readonly showSkillPicker = signal(false);
  readonly agentDetailTab = signal<'ahora' | 'configurar' | 'historial'>('ahora');
  readonly historialFilter = signal<'todos' | 'ejecutó' | 'alertó' | 'esperó'>('todos');

  readonly filteredHistory = computed(() => {
    const agent = this.selectedAgent();
    const f = this.historialFilter();
    if (f === 'todos') return agent.recentHistory;
    return agent.recentHistory.filter(h => h.tipo === f);
  });

  readonly agentListData = computed<AgentCardData[]>(() =>
    this.agentsList().map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      color: a.color,
      status: (a.status === 'esperando' && a.lastAction === 'Configurando…') ? 'configurando' : a.status,
      lastAction: a.lastAction,
      lastActionTime: a.lastActionTime,
      lastActionImpact: a.recentHistory[0]?.impact,
      autopilotEnabled: a.autopilotEnabled,
      actionsThisWeek: a.actionsThisWeek,
      successRate: a.successRate,
      isSelected: this.selectedAgent().id === a.id,
    }))
  );

  /** Umbrales de confianza por agente (id → porcentaje 0-100) */
  private readonly agentThresholds = signal<Record<string, number>>(
    Object.fromEntries(AGENTS.map(a => [a.id, 70]))
  );

  getAgentThreshold(): number {
    return this.agentThresholds()[this.selectedAgent().id] ?? 70;
  }

  setAgentThreshold(val: number): void {
    const id = this.selectedAgent().id;
    this.agentThresholds.update(t => ({ ...t, [id]: val }));
  }

  toggleAgentAutonomous(): void {
    const agent = this.selectedAgent();
    const nowEnabled = !agent.autopilotEnabled;
    const updated: Agent = {
      ...agent,
      autopilotEnabled: nowEnabled,
      status: nowEnabled ? 'activo' : 'pausa',
    };
    this.agentsList.update(list => list.map(a => a.id === agent.id ? updated : a));
    this.selectedAgent.set(updated);
  }

  openSkillPicker(): void { this.showSkillPicker.set(true); }
  closeSkillPicker(): void { this.showSkillPicker.set(false); }

  get selectedAgentSkillNames(): string[] {
    return this.selectedAgent().skills.map(s => s.name);
  }

  addSkillToAgent(skillName: string): void {
    const agent = this.selectedAgent();
    if (agent.skills.some(s => s.name === skillName)) return;
    const newSkill: AgentSkill = { name: skillName, status: 'active', runs: 0 };
    const updated = { ...agent, skills: [...agent.skills, newSkill] };
    this.agentsList.update(list => list.map(a => a.id === agent.id ? updated : a));
    this.selectedAgent.set(updated);
    this.showSkillPicker.set(false);
  }

  readonly DROPI_BENCHMARK = 89;
  readonly successRateTooltip = 'Tasa de éxito = acciones ejecutadas sin requerir intervención manual. Promedio Dropi: 89%.';

  successRateColor(rate: number): string {
    if (rate >= 80) return '#22c55e';
    if (rate >= 70) return '#f59e0b';
    return '#ef4444';
  }

  successRateLabel(rate: number): 'ok' | 'warn' | 'danger' {
    if (rate >= 80) return 'ok';
    if (rate >= 70) return 'warn';
    return 'danger';
  }

  readonly createAgentDraft = signal<CustomAgentDraft>({ ...DRAFT_DEFAULT });
  readonly createAgentDone = signal(false);

  selectAgent(agent: Agent): void {
    const found = this.agentsList().find(a => a.id === agent.id) ?? agent;
    this.selectedAgent.set(found);
    this.agentDetailTab.set('ahora');
    this.historialFilter.set('todos');
  }

  selectAgentById(id: string): void {
    const found = this.agentsList().find(a => a.id === id);
    if (found) this.selectAgent(found);
  }

  setAgentTab(tab: 'ahora' | 'configurar' | 'historial'): void {
    this.agentDetailTab.set(tab);
  }

  setHistorialFilter(f: 'todos' | 'ejecutó' | 'alertó' | 'esperó'): void {
    this.historialFilter.set(f);
  }

  toggleAgentRule(ruleId: string): void {
    const agent = this.selectedAgent();
    const updated = {
      ...agent,
      activeRules: agent.activeRules.map(r => r.id === ruleId ? { ...r, activa: !r.activa } : r),
    };
    this.agentsList.update(list => list.map(a => a.id === agent.id ? updated : a));
    this.selectedAgent.set(updated);
  }

  prefillRuleHelp(ruleId: string): void {
    const agent = this.selectedAgent();
    const rule = agent.activeRules.find(r => r.id === ruleId);
    if (!rule) return;
    const improved = `Si ${rule.descripcion.toLowerCase().replace(/\.$/, '')} → notificar con resumen de impacto (afectados, monto estimado) y esperar aprobación antes de ejecutar.`;
    const updated: AgentRule = { ...rule, descripcion: improved };
    const updatedAgent = {
      ...agent,
      activeRules: agent.activeRules.map(r => r.id === ruleId ? updated : r),
    };
    this.agentsList.update(list => list.map(a => a.id === agent.id ? updatedAgent : a));
    this.selectedAgent.set(updatedAgent);
    this.ws.showToast({
      id: `rule-improved-${ruleId}`,
      agente: 'Gali',
      message: 'Regla mejorada con contexto de impacto y aprobación',
      tipo: 'ok',
    });
  }

  getStatusLabel(status: Agent['status']): string {
    return { activo: 'Activo', esperando: 'Esperando', pausa: 'En pausa' }[status];
  }

  getDataSources(): DataSource[] {
    return AGENT_DATA_SOURCES[this.selectedAgent().id] ?? [];
  }

  toggleDataSource(sourceId: string): void {
    // Mock toggle — no real logic
    this.ws.showToast({
      id: `ds-toggle-${sourceId}`,
      agente: 'Gali',
      message: 'Configuración de fuente actualizada',
      tipo: 'ok',
    });
  }

  openCreateAgent(): void {
    this.createAgentDraft.set({ ...DRAFT_DEFAULT });
    this.createAgentDone.set(false);
    this.showCreateAgent.set(true);
  }

  nextCreateStep(): void {
    this.createAgentDraft.update(d => ({ ...d, step: Math.min(5, d.step + 1) as CustomAgentDraft['step'] }));
  }

  prevCreateStep(): void {
    this.createAgentDraft.update(d => ({ ...d, step: Math.max(1, d.step - 1) as CustomAgentDraft['step'] }));
  }

  toggleConexion(source: string): void {
    this.createAgentDraft.update(d => {
      const conexiones = d.conexiones.includes(source)
        ? d.conexiones.filter(c => c !== source)
        : [...d.conexiones, source];
      return { ...d, conexiones };
    });
  }

  isConexionSelected(source: string): boolean {
    return this.createAgentDraft().conexiones.includes(source);
  }

  readonly availableConexiones = [
    { id: 'meta', label: 'Meta Ads', icon: '📣', desc: 'Campañas, ROAS, creativos' },
    { id: 'dropi', label: 'Dropi Plataforma', icon: '📦', desc: 'Pedidos, novedades, inventario' },
    { id: 'siigo', label: 'Siigo', icon: '🧾', desc: 'Facturación y P&L' },
    { id: 'chatea', label: 'Chatea Pro', icon: '💬', desc: 'Conversaciones WhatsApp' },
    { id: 'ada', label: 'ADA Spy', icon: '🔍', desc: 'Research de productos y competencia' },
  ];

  setDraftNombre(v: string): void {
    this.createAgentDraft.update(d => ({ ...d, nombre: v }));
  }

  setDraftRol(v: string): void {
    this.createAgentDraft.update(d => ({ ...d, rol: v }));
  }

  setDraftReglaCondicion(v: string): void {
    this.createAgentDraft.update(d => ({ ...d, reglaCondicion: v }));
  }

  setDraftReglaAccion(v: string): void {
    this.createAgentDraft.update(d => ({ ...d, reglaAccion: v }));
  }

  prefillReglaExample(): void {
    this.createAgentDraft.update(d => ({
      ...d,
      reglaCondicion: 'el CTR cae por debajo del 1% durante 48 horas',
      reglaAccion: 'pausar el adset y notificarme con un resumen del impacto',
    }));
  }

  get reglaResumen(): string {
    const d = this.createAgentDraft();
    if (!d.reglaCondicion && !d.reglaAccion) return '';
    return `Si ${d.reglaCondicion} → ${d.reglaAccion}`;
  }

  toggleAutopilot(): void {
    this.createAgentDraft.update(d => ({ ...d, autopilotEnabled: !d.autopilotEnabled }));
  }

  setAutonomyThreshold(v: number): void {
    this.createAgentDraft.update(d => ({ ...d, autonomyThreshold: v }));
  }

  launchAgent(): void {
    const d = this.createAgentDraft();
    const agentId = `custom-${Date.now()}`;
    const newAgent: Agent = {
      id: agentId,
      name: d.nombre || 'Mi Agente',
      role: d.rol || 'Personalizado',
      color: '#a855f7',
      status: 'esperando',
      lastAction: 'Configurando…',
      lastActionTime: 'ahora',
      successRate: 0,
      actionsThisWeek: 0,
      description: d.descripcion || `Agente personalizado con rol: ${d.rol}`,
      capabilities: d.skills.length ? d.skills : ['Pendiente de configuración'],
      skills: d.skills.map(s => ({ name: s, status: 'active' as const, runs: 0 })),
      recentHistory: [],
      ctas: [{ label: 'Configurar acciones', icon: 'pi-cog', variant: 'primary' }],
      autopilotEnabled: d.autopilotEnabled,
      activeRules: (d.reglaCondicion || d.reglaAccion)
        ? [{ id: `rule-${agentId}`, titulo: 'Regla inicial', descripcion: `Si ${d.reglaCondicion} → ${d.reglaAccion}`, activa: true }]
        : [],
    };
    this.agentsList.update(list => [...list, newAgent]);
    this.selectedAgent.set(newAgent);
    this.createAgentDone.set(true);
    this.ws.showToast({
      id: `agent-created-${agentId}`,
      agente: 'Gali',
      message: `Gali está configurando ${newAgent.name}...`,
      tipo: 'ok',
    });
    setTimeout(() => {
      const activated: Agent = { ...newAgent, status: 'activo', lastAction: 'Activo y listo para operar', lastActionTime: 'ahora' };
      this.agentsList.update(list => list.map(a => a.id === agentId ? activated : a));
      if (this.selectedAgent().id === agentId) {
        this.selectedAgent.set(activated);
      }
      this.ws.showToast({
        id: `agent-activated-${agentId}`,
        agente: 'Gali',
        message: `${newAgent.name} activado y listo`,
        tipo: 'ok',
      });
    }, 1500);
  }

  toggleSkillForAgent(skill: string): void {
    this.createAgentDraft.update(d => {
      const skills = d.skills.includes(skill)
        ? d.skills.filter(s => s !== skill)
        : [...d.skills, skill];
      return { ...d, skills };
    });
  }

  isSkillSelected(skill: string): boolean {
    return this.createAgentDraft().skills.includes(skill);
  }

  isRolSelected(rol: string): boolean {
    return this.createAgentDraft().rol === rol;
  }

  readonly availableSkills = (USER_SKILLS as { nombre: string; agente: string }[]).map(s => ({
    nombre: s.nombre,
    agente: s.agente,
  }));

  readonly skillSearch = signal('');

  readonly filteredWizardSkills = computed(() => {
    const q = this.skillSearch().trim().toLowerCase();
    const list = this.availableSkills;
    if (!q) return list;
    return list.filter(s => s.nombre.toLowerCase().includes(q) || s.agente.toLowerCase().includes(q));
  });

  readonly rolSuggestions = [
    'Analista de campañas',
    'Gestor de novedades',
    'Asistente de ventas',
    'Coordinador logístico',
    'Monitor de stock',
  ];
}

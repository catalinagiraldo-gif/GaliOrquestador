import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import PROJECTS from '../../../../../../mocks/gali-v5/projects.json';
import KPIS_GLOBAL from '../../../../../../mocks/gali-v5/kpis-global.json';

const STORAGE_KEY = 'gali_goal_configured';

// Maps onboarding answers to visible modules — pure function (sprint 11.2)
function resolveVisibleModules(objetivo: string, friccion: string): string[] {
  const siempre = ['home', 'configurar', 'academy'];

  if (objetivo === 'primer-producto' && friccion === 'que-vender')
    return [...siempre, 'productos', 'proyectos', 'cas'];

  if (objetivo === 'escalar-pedidos' && friccion === 'roas')
    return [...siempre, 'proyectos', 'marketing', 'reportes'];

  if (friccion === 'tiempo')
    return [...siempre, 'pedidos', 'cas'];

  if (friccion === 'novedades')
    return [...siempre, 'proyectos', 'logistica', 'pedidos'];

  return ['home', 'productos', 'proyectos', 'pedidos', 'logistica',
          'marketing', 'reportes', 'financiero', 'cas', 'academy', 'configurar'];
}

interface GoalOption {
  id: string;
  label: string;
  icon: string;
  agente: 'vigilante' | 'roax' | 'chatea' | 'ada';
}

const GOAL_OPTIONS: GoalOption[] = [
  { id: 'primer-millon', label: 'Llegar a mi primer millón en ganancias este mes', icon: '💰', agente: 'roax' },
  { id: 'escalar-pedidos', label: 'Escalar de 20 a 50 pedidos por semana', icon: '📈', agente: 'vigilante' },
  { id: 'primer-producto', label: 'Lanzar mi primer producto ganador', icon: '🚀', agente: 'ada' },
  { id: 'automatizar', label: 'Automatizar mi operación para trabajar menos horas', icon: '⚡', agente: 'vigilante' },
];

const AGENT_MAP: Record<string, { nombre: string; color: string; desc: string }> = {
  vigilante: { nombre: 'Vigilante', color: '#fbbf24', desc: 'protege tus pedidos y detecta novedades antes de que te dañen' },
  roax: { nombre: 'Roax', color: '#f97316', desc: 'gestiona tus campañas en Meta para que tu producto llegue a las personas correctas' },
  ada: { nombre: 'ADA Spy', color: '#818cf8', desc: 'analiza el mercado y encuentra el producto con mayor oportunidad de éxito' },
  chatea: { nombre: 'Chatea Pro', color: '#34d399', desc: 'responde a tus clientes automáticamente y cierra más ventas' },
};

interface DayOneStep {
  num: string;
  title: string;
  desc: string;
  cta: string;
  route: string;
}

export function shouldShowOnboarding(): boolean {
  return !localStorage.getItem(STORAGE_KEY);
}

@Component({
  selector: 'gali-goal-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-goal-onboarding.component.html',
  styleUrl: './gali-goal-onboarding.component.scss',
})

export class GaliGoalOnboardingComponent {
  private readonly ws = inject(GaliWorkspaceService);
  private readonly router = inject(Router);

  readonly closed = output<void>();

  readonly step = signal<1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly onboardingPath = signal<'nuevo' | 'veterano'>('nuevo');
  readonly selectedGoal = signal<GoalOption | null>(null);
  /** Pedidos/semana — fuente autoritativa: kpis-global.json (Dropi ya lo sabe) */
  readonly kpiPedidosTotal = (KPIS_GLOBAL as { pedidos_sem_total: { valor: number } }).pedidos_sem_total.valor;
  readonly kpiDataAvailable = true;
  readonly customGoal = signal('');
  readonly showCustom = signal(false);
  readonly connectedSources = signal<string[]>([]);

  readonly focusModules = signal<string[]>(['pedidos', 'marketing']);

  readonly focusModuleOptions = [
    { key: 'pedidos',    label: 'Pedidos',      icon: '📦', color: '#fbbf24', desc: 'Novedades, confirmaciones' },
    { key: 'marketing',  label: 'Marketing',    icon: '📢', color: '#f97316', desc: 'Campañas, ROAS, pauta' },
    { key: 'logistica',  label: 'Logística',    icon: '🚚', color: '#60a5fa', desc: 'Transportadoras, tracking' },
    { key: 'financiero', label: 'Financiero',   icon: '💰', color: '#34d399', desc: 'PIL, márgenes, cartera' },
    { key: 'proyectos',  label: 'Proyectos',    icon: '🎯', color: '#a78bfa', desc: 'Productos en campaña' },
    { key: 'chatea',     label: 'Chatea Pro',   icon: '💬', color: '#10b981', desc: 'WhatsApp, respuestas auto' },
  ];

  toggleFocusModule(key: string): void {
    this.focusModules.update(list =>
      list.includes(key) ? list.filter(k => k !== key) : [...list, key]
    );
  }
  // sprint 11.2: fricción derivada del objetivo seleccionado
  readonly selectedFriccion = computed<string>(() => {
    const g = this.selectedGoal();
    if (!g) return '';
    const map: Record<string, string> = {
      'primer-producto':  'que-vender',
      'primer-millon':    'roas',
      'escalar-pedidos':  'roas',
      'automatizar':      'tiempo',
    };
    return map[g.id] ?? '';
  });

  // sprint 11.3: proyecto activo — prioridad sobre slider del step 2
  readonly proyectoActivo = computed(() => {
    const id = localStorage.getItem('gali_proyecto_activo') ?? 'collar-gps-2026';
    return (PROJECTS as any[]).find((p: any) => p.id === id) ?? (PROJECTS as any[])[0];
  });

  toggleSource(id: string): void {
    this.connectedSources.update(s =>
      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
    );
  }

  readonly goalOptions = GOAL_OPTIONS;

  get recommendedAgent(): { nombre: string; color: string; desc: string } | null {
    const g = this.selectedGoal();
    return g ? AGENT_MAP[g.agente] : null;
  }

  get pedidosLabel(): string {
    const fromProject = (this.proyectoActivo() as { pedidos_sem_label?: string })?.pedidos_sem_label;
    if (fromProject) return fromProject;
    const v = this.kpiPedidosTotal;
    if (v === 0) return '0 pedidos';
    if (v <= 5) return '0–5 pedidos';
    return `~${v}/sem`;
  }

  get isNewDropshipper(): boolean {
    return this.kpiPedidosTotal === 0;
  }

  readonly onboardingContextMsg = computed(() => {
    const total = this.kpiPedidosTotal;
    if (total === 0) return null;
    if (total <= 10) return `Tienes ${total} pedidos esta semana — vas bien empezando.`;
    if (total <= 50) return `Tienes ${total} pedidos esta semana. ¿Cuál es tu objetivo este mes?`;
    return `Tienes ${total} pedidos esta semana — operación activa. ¿Qué quieres lograr ahora?`;
  });

  selectGoal(g: GoalOption): void {
    this.selectedGoal.set(g);
    this.showCustom.set(false);
  }

  selectCustom(): void {
    this.selectedGoal.set(null);
    this.showCustom.set(true);
  }

  goToStep2(): void {
    if (!this.selectedGoal() && !this.customGoal().trim()) return;
    const esVeterano = this.kpiPedidosTotal > 20;
    this.onboardingPath.set(esVeterano ? 'veterano' : 'nuevo');
    this.step.set(esVeterano ? 6 : 3);
  }

  goToStep4(): void {
    this.step.set(4);
  }

  goToStep5(): void {
    this.step.set(5);
  }

  get dayOneSteps(): DayOneStep[] {
    const g = this.selectedGoal();
    if (!g || g.id === 'primer-producto' || g.id === 'primer-millon') {
      return [
        { num: '1', title: 'Busca tu primer producto ganador', desc: 'ADA Spy analiza tendencias del mercado colombiano y te muestra los 3 mejores productos ahora mismo.', cta: 'Abrir ADA Spy →', route: '/gali-v5/productos/caza-productos' },
        { num: '2', title: 'Crea tu primer proyecto', desc: 'Define precio, costo y objetivo de pedidos. Gali calcula el ROAS mínimo y activa las skills de protección.', cta: 'Nuevo proyecto →', route: '/gali-v5/proyectos/nuevo' },
        { num: '3', title: 'Activa Modo Operar', desc: 'Vigilante monitorea tus pedidos 24/7. Cuando algo requiera tu atención, te llegará una señal en el Hub.', cta: 'Ver Hub →', route: '/gali-v5' },
      ];
    }
    if (g.id === 'escalar-pedidos') {
      return [
        { num: '1', title: 'Revisa el P&L real de tus campañas', desc: 'Antes de escalar, necesitas saber tu ROAS real (no el declarado). Gali ya tiene los datos — solo abre el dashboard.', cta: 'Ver P&L →', route: '/gali-v5/reportes/dashboard-financiero' },
        { num: '2', title: 'Activa las reglas de escalamiento de Roax', desc: 'ROAS > objetivo × 1.3 por 48h → escalar +20%. Están listas — solo actívalas en la página de Reglas.', cta: 'Ver reglas →', route: '/gali-v5/reglas' },
        { num: '3', title: 'Configura Smart Routing en Logística', desc: 'Vigilante sugiere automáticamente la mejor transportadora por ciudad. Actívalo una vez y olvídate.', cta: 'Torre logística →', route: '/gali-v5/logistica/torre-logistica' },
      ];
    }
    return [
      { num: '1', title: 'Activa las reglas de automatización', desc: 'Confirmación automática, WhatsApp inteligente y routing de novedades. 3 reglas que ahorran 2h/día.', cta: 'Ver reglas →', route: '/gali-v5/reglas' },
      { num: '2', title: 'Configura el alcance del Autopilot', desc: 'Dile a Gali exactamente qué puede hacer sin pedirte permiso. Presupuesto máx, transportadora segura, WhatsApp.', cta: 'Configurar Autopilot →', route: '/gali-v5' },
      { num: '3', title: 'Crea tu primera Skill personalizada', desc: 'Si una regla se queda corta, una Skill tiene historial, métricas de impacto y puede afectar múltiples módulos.', cta: 'Crear Skill →', route: '/gali-v5/skills/nueva' },
    ];
  }

  goToDayOneStep(step: DayOneStep): void {
    this.finish();
    this.router.navigate([step.route]);
  }

  activateAgent(): void {
    this.finish();
  }

  finishVeterano(): void {
    this.ws.setComplexityLevel('expert');
    this.ws.showAllModules();
    this.finish();
  }

  // sprint 11.2: nuevo user path — set visible modules based on answers
  finishNuevo(): void {
    const objetivo = this.selectedGoal()?.id ?? '';
    const friccion = this.selectedFriccion();
    const modules  = resolveVisibleModules(objetivo, friccion);
    this.ws.setVisibleModules(modules);
    this.finish();
  }

  goToMicromundo(): void {
    this.finish();
    this.router.navigate(['/gali-v5/micromundo'], { queryParams: { tab: 'documentos' } });
  }

  /** Maps actual step signal value to 1-4 visual dot progress for the header indicator */
  get visualStep(): number {
    const map: Record<number, number> = { 1: 1, 3: 2, 4: 3, 5: 4, 6: 1 };
    return map[this.step()] ?? 1;
  }

  skip(): void {
    this.finish();
  }

  private finish(): void {
    localStorage.setItem(STORAGE_KEY, '1');
    const g = this.selectedGoal();
    const custom = this.customGoal().trim();

    if (g) {
      localStorage.setItem('gali_goal_label', g.label);
      localStorage.setItem('gali_goal_id', g.id);
    } else if (custom) {
      localStorage.setItem('gali_goal_label', custom);
      localStorage.setItem('gali_goal_id', 'custom');
    } else if (!localStorage.getItem('gali_goal_id')) {
      localStorage.setItem('gali_goal_label', 'Automatizar mi operación para trabajar menos horas');
      localStorage.setItem('gali_goal_id', 'automatizar');
    }
    localStorage.setItem('gali_goal_pedidos_target', String(this.kpiPedidosTotal));
    this.ws.updateGoalLabel(localStorage.getItem('gali_goal_label') ?? '');

    // Save weekly plan for Hub widget
    const goalId = g?.id ?? (custom ? 'custom' : (localStorage.getItem('gali_goal_id') ?? 'automatizar'));
    const weeklyPlanMap: Record<string, string[]> = {
      'escalar-pedidos': ['Activa Roax en tu campaña principal', 'Revisa ROAS vs meta esta semana', 'Configura auto-pausa si CTR < 0.8%'],
      'primer-producto': ['Elige tu primer producto en Caza Productos', 'Crea tu primer proyecto con precio y costo', 'Activa Vigilante para proteger pedidos'],
      'primer-millon': ['Revisa tu P&L real vs ROAS declarado', 'Activa escalado automático de presupuesto', 'Conecta tus campañas Meta Ads'],
      'automatizar': ['Configura Chatea Pro para respuestas automáticas', 'Activa confirmación automática pedidos verdes', 'Revisa umbrales de Vigilante'],
    };
    const planSteps = weeklyPlanMap[goalId] ?? weeklyPlanMap['automatizar'];
    localStorage.setItem('gali_weekly_plan', JSON.stringify(planSteps));
    localStorage.setItem('gali_onboarding_done', '1');

    // Zero-state: user has 0 orders/week = needs guided setup
    if (this.kpiPedidosTotal === 0) {
      localStorage.setItem('gali_zero_state', '1');
    } else {
      localStorage.removeItem('gali_zero_state');
    }
    const isNovice = this.kpiPedidosTotal <= 5;
    localStorage.setItem('gali_complexity', isNovice ? 'novice' : 'expert');
    localStorage.setItem('gali_connected_sources', JSON.stringify(this.connectedSources()));
    localStorage.setItem('gali_dia_a_dia_modules', JSON.stringify(this.focusModules()));
    this.closed.emit();
  }
}

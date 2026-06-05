import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import PROJECTS from '../../../../../../mocks/gali-v5/projects.json';

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
  readonly pedidosPerWeek = signal(20);
  readonly mesesOperando = signal<string>('1-6');
  readonly customGoal = signal('');
  readonly showCustom = signal(false);
  readonly connectedSources = signal<string[]>([]);
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
    // sprint 11.3: projects.json is authoritative; slider is fallback for first session
    const fromProject = (this.proyectoActivo() as any)?.pedidos_sem_label as string | undefined;
    if (fromProject) return fromProject;
    const v = this.pedidosPerWeek();
    if (v <= 5) return '0–5 pedidos';
    if (v <= 20) return `~${v}/sem`;
    if (v <= 50) return `~${v}/sem`;
    if (v <= 100) return `~${v}/sem`;
    return '100+/sem';
  }

  get mesesLabel(): string {
    const m = this.mesesOperando();
    return m === 'nuevo' ? 'menos de 1 mes' :
           m === '1-6'   ? '1 a 6 meses' :
           m === '6-12'  ? '6 a 12 meses' : 'más de 1 año';
  }

  selectGoal(g: GoalOption): void {
    this.selectedGoal.set(g);
    this.showCustom.set(false);
  }

  selectCustom(): void {
    this.selectedGoal.set(null);
    this.showCustom.set(true);
  }

  goToStep2(): void {
    if (this.selectedGoal() || this.customGoal().trim()) {
      this.step.set(2);
    }
  }

  goToStep3(): void {
    const meses = this.mesesOperando();
    const pedidos = this.pedidosPerWeek();
    const esVeterano = meses === '6-12' || meses === '1y+' || pedidos > 20;
    if (esVeterano) {
      this.onboardingPath.set('veterano');
      this.step.set(6);
    } else {
      this.step.set(3);
    }
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

  skip(): void {
    this.finish();
  }

  private finish(): void {
    localStorage.setItem(STORAGE_KEY, '1');
    const g = this.selectedGoal();
    if (g) {
      localStorage.setItem('gali_goal_label', g.label);
      localStorage.setItem('gali_goal_id', g.id);
      localStorage.setItem('gali_goal_pedidos_target', String(this.pedidosPerWeek()));
    }
    // Zero-state: user has 0 orders/week = needs guided setup
    if (this.pedidosPerWeek() === 0) {
      localStorage.setItem('gali_zero_state', '1');
    } else {
      localStorage.removeItem('gali_zero_state');
    }
    // Complexity level: new users start in novice mode
    const isNovice = this.mesesOperando() === 'nuevo' || this.pedidosPerWeek() <= 5;
    localStorage.setItem('gali_complexity', isNovice ? 'novice' : 'expert');
    localStorage.setItem('gali_connected_sources', JSON.stringify(this.connectedSources()));
    this.closed.emit();
  }
}

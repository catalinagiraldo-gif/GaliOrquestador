import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DropiPrototypeFeedbackService } from '../services/dropi-prototype-feedback.service';
import { GaliStateService } from '../services/gali-state.service';
import { GALI_V5_DROPI_LOGO } from '../gali-v5.constants';

interface SectionAgent { name: string; color: string; status: string; }

interface HealthComponent {
  label: string;
  weight: number;
  score: number;
  color: string;
  statusIcon: string;
  detail: string;
}

interface HealthRec {
  puntos: number;
  accion: string;
  porQue: string;
  ctaLabel: string;
  ruta: string;
}

const SECTION_AGENTS: Array<{ patterns: string[]; agent: SectionAgent }> = [
  {
    patterns: ['productos', 'catalogo', 'proveedores', 'negociaciones', 'caza-productos'],
    agent: { name: 'ADA Spy', color: '#818cf8', status: 'analizando catálogo' },
  },
  {
    patterns: ['pedidos', 'novedades', 'garantias', 'logistica', 'transportadoras', 'torre-logistica', 'etiquetas', 'ordenes-de-despacho', 'validador'],
    agent: { name: 'Vigilante', color: '#fbbf24', status: 'monitoreando pedidos' },
  },
  {
    patterns: ['marketing', 'campanas', 'automatizacion', 'roax', 'creador-de-paginas'],
    agent: { name: 'Roax', color: '#f97316', status: '3 campañas activas' },
  },
  {
    patterns: ['cas', 'chatea-pro'],
    agent: { name: 'Chatea Pro', color: '#34d399', status: 'respondiendo clientes' },
  },
];

function resolveAgentForUrl(url: string): SectionAgent {
  const path = url.toLowerCase();
  for (const entry of SECTION_AGENTS) {
    if (entry.patterns.some(p => path.includes(p))) {
      return entry.agent;
    }
  }
  return { name: 'Gali', color: '#ff6102', status: 'orquestando tu negocio' };
}

@Component({
  selector: 'dropi-header-ia2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-ia2">
      <!-- Brand -->
      <div class="header-ia2__brand">
        <a routerLink="/home" class="header-ia2__gallery" title="Volver a la galería">
          <i class="pi pi-th-large" aria-hidden="true"></i>
          <span>Galería</span>
        </a>
        <a routerLink="/gali-v5" class="header-ia2__logo-link" title="Inicio Gali V5">
          <img [src]="logoSrc" alt="dropi" class="header-ia2__logo" />
        </a>
      </div>

      <!-- ── ZONA CONTEXTUAL TRANSVERSAL ──────────────────────────── -->
      <div class="header-ia2__context">

        <!-- Business Health Score -->
        <button
          type="button"
          class="header-ia2__health"
          [style.--health-color]="healthColor"
          (click)="showHealthPanel.set(!showHealthPanel())"
          [title]="healthLabel + ' — clic para desglose'">
          <span class="header-ia2__health-num" [style.color]="healthColor">{{ healthScore }}</span>
          <div class="header-ia2__health-bar">
            <div class="header-ia2__health-fill" [style.width.%]="healthScore" [style.background]="healthColor"></div>
          </div>
          <span class="header-ia2__health-label">salud</span>
        </button>

        <!-- Agente activo en la sección actual -->
        <button
          type="button"
          class="header-ia2__agent-ctx"
          data-proto-skip
          [title]="'Abrir panel de ' + sectionAgent().name"
          (click)="openAgentPanel()">
          <span class="header-ia2__ctx-dot" [style.background]="sectionAgent().color"></span>
          <span class="header-ia2__ctx-name">{{ sectionAgent().name }}</span>
          <span class="header-ia2__ctx-sep">·</span>
          <span class="header-ia2__ctx-status">{{ sectionAgent().status }}</span>
        </button>

        <!-- Señales pendientes -->
        <a routerLink="/gali-v5" class="header-ia2__signals-pill" title="Ver señales pendientes en Gali Hub">
          <span class="header-ia2__signals-num">{{ signalCount }}</span>
          <span class="header-ia2__signals-label">señales</span>
        </a>

        <!-- Autopilot badge -->
        @if (autopilotOn) {
          <span class="header-ia2__auto-badge">● AUTO</span>
        }
      </div>
      <!-- ─────────────────────────────────────────────────────────── -->

      <div class="header-ia2__actions">
        <div class="header-ia2__wallet">
          <i class="pi pi-wallet header-ia2__wallet-icon"></i>
          @if (walletVisible()) {
            <span class="header-ia2__wallet-amount">{{ formattedBalance }}</span>
          } @else {
            <span class="header-ia2__wallet-mask">••••••••</span>
          }
          <button
            type="button"
            class="header-ia2__eye"
            data-proto-skip
            (click)="toggleWallet()"
            [attr.aria-label]="walletVisible() ? 'Ocultar saldo' : 'Mostrar saldo'">
            <i [class]="walletVisible() ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>

        <button type="button" class="header-ia2__avatar" aria-label="Perfil" (click)="onProfile()">
          <img [src]="avatarUrl" [alt]="userName" />
        </button>
      </div>
    </header>

    <!-- ── HEALTH SCORE PANEL — panel lateral ── -->
    @if (showHealthPanel()) {
      <div class="health-panel-backdrop" (click)="showHealthPanel.set(false)" role="presentation">
        <div class="health-panel" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-label="Salud del negocio">

          <!-- Header panel -->
          <div class="health-panel__header">
            <div class="health-panel__score-wrap">
              <svg class="health-ring" viewBox="0 0 64 64" width="64" height="64">
                <circle class="health-ring__track" cx="32" cy="32" r="26" />
                <circle class="health-ring__fill"
                  cx="32" cy="32" r="26"
                  [attr.stroke]="healthColor"
                  [attr.stroke-dasharray]="ringDash + ' 163.4'"
                  stroke-dashoffset="0" />
              </svg>
              <div class="health-panel__score-center">
                <span class="health-panel__score-num" [style.color]="healthColor">{{ healthScore }}</span>
                <span class="health-panel__score-denom">/100</span>
              </div>
            </div>
            <div class="health-panel__headline">
              <h3 class="health-panel__title">Salud del negocio</h3>
              <span class="health-panel__status" [style.color]="healthColor">{{ healthLabel }}</span>
              <div class="health-panel__benchmark">
                <span class="health-panel__benchmark-label">Promedio Dropi:</span>
                <strong class="health-panel__benchmark-val">82/100</strong>
                <span class="health-panel__benchmark-delta">·
                  @if (healthScore < 82) {
                    <span class="health-panel__delta health-panel__delta--below">{{ 82 - healthScore }} pts por debajo</span>
                  } @else {
                    <span class="health-panel__delta health-panel__delta--above">{{ healthScore - 82 }} pts por encima</span>
                  }
                </span>
              </div>
            </div>
            <button type="button" class="health-panel__close" (click)="showHealthPanel.set(false)" aria-label="Cerrar">×</button>
          </div>

          <!-- Componentes del score -->
          <div class="health-panel__section">
            <h4 class="health-panel__section-title">Componentes del score</h4>
            <div class="health-panel__components">
              @for (comp of healthComponents; track comp.label) {
                <div class="health-comp">
                  <div class="health-comp__meta">
                    <span class="health-comp__label">{{ comp.label }}</span>
                    <div class="health-comp__right">
                      <span class="health-comp__score" [style.color]="comp.color">{{ comp.score }}</span>
                      <span class="health-comp__weight">· peso {{ comp.weight }}%</span>
                      <span class="health-comp__status">{{ comp.statusIcon }}</span>
                    </div>
                  </div>
                  <div class="health-comp__bar-track">
                    <div class="health-comp__bar-fill"
                      [style.width.%]="comp.score"
                      [style.background]="comp.color">
                    </div>
                    <div class="health-comp__bar-marker" style="left: 82%"></div>
                  </div>
                  <span class="health-comp__detail">{{ comp.detail }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Recomendaciones priorizadas -->
          <div class="health-panel__section">
            <h4 class="health-panel__section-title">Gali recomienda para subir tu score</h4>
            <div class="health-panel__recs">
              @for (rec of healthRecs; track rec.accion) {
                <div class="health-rec">
                  <span class="health-rec__impact">+{{ rec.puntos }} pts</span>
                  <div class="health-rec__body">
                    <span class="health-rec__accion">{{ rec.accion }}</span>
                    <span class="health-rec__porque">{{ rec.porQue }}</span>
                  </div>
                  <a class="health-rec__cta" [routerLink]="rec.ruta" (click)="showHealthPanel.set(false)">
                    {{ rec.ctaLabel }} →
                  </a>
                </div>
              }
            </div>
          </div>

          <span class="health-panel__footer">Actualizado hace 15min · calculado por Gali · ROAS(30%) + Novedades(25%) + Conversión(20%) + P&amp;L(25%)</span>

        </div>
      </div>
    }
  `,
  styleUrl: './dropi-header-ia2.component.scss',
})
export class DropiHeaderIa2Component implements OnInit {
  private feedback = inject(DropiPrototypeFeedbackService);
  private router = inject(Router);
  readonly galiState = inject(GaliStateService);

  readonly logoSrc = GALI_V5_DROPI_LOGO;

  @Input() userName = 'Alejandra';
  @Input() walletBalance = 2717360700;
  @Input() avatarUrl = 'assets/images/dropi-baseline/avatar-user.png';
  @Input() galiMode: 0 | 1 | 2 = 0;
  @Input() autopilotOn = false;

  readonly signalCount = 3;
  readonly showHealthPanel = signal(false);

  // Business Health Score
  readonly healthScore = 78; // 0–100: ROAS(30%) + novedad(25%) + conversión(20%) + P&L vs goal(25%)

  get healthColor(): string {
    if (this.healthScore >= 70) return '#22c55e';
    if (this.healthScore >= 40) return '#f59e0b';
    return '#ef4444';
  }

  get healthLabel(): string {
    if (this.healthScore >= 70) return 'Negocio saludable';
    if (this.healthScore >= 40) return 'Requiere atención';
    return 'Atención urgente';
  }

  get ringDash(): number {
    const circumference = 2 * Math.PI * 26; // r=26 → 163.4
    return (this.healthScore / 100) * circumference;
  }

  readonly healthComponents: HealthComponent[] = [
    {
      label: 'ROAS promedio 7 días',
      weight: 30,
      score: 87,
      color: '#22c55e',
      statusIcon: '✓',
      detail: '1.93× real · Meta 2.9× — objetivo 2.5×',
    },
    {
      label: 'Tasa de novedades',
      weight: 25,
      score: 70,
      color: '#f59e0b',
      statusIcon: '⚠',
      detail: '14% actual — objetivo: ≤ 10%',
    },
    {
      label: 'Conversión',
      weight: 20,
      score: 80,
      color: '#22c55e',
      statusIcon: '✓',
      detail: '3.2% — promedio Dropi: 2.8%',
    },
    {
      label: 'P&L vs objetivo',
      weight: 25,
      score: 75,
      color: '#22c55e',
      statusIcon: '✓',
      detail: '+12% sobre objetivo mensual · $3.8M netos',
    },
  ];

  readonly healthRecs: HealthRec[] = [
    {
      puntos: 5,
      accion: 'Reducir novedades al 10%',
      porQue: 'Coordinadora Bogotá tiene 15% — el punto más débil de tu score actual',
      ctaLabel: 'Ver smart routing',
      ruta: '/gali-v5/logistica/torre-logistica',
    },
    {
      puntos: 3,
      accion: 'Cerrar gap ROAS Meta vs real',
      porQue: 'Declarado 2.9× vs real 1.91× — gap del 34% afecta el score',
      ctaLabel: 'Ver análisis Roax',
      ruta: '/gali-v5/marketing/roax-informes',
    },
  ];

  sectionAgent = signal<SectionAgent>(resolveAgentForUrl(window.location.pathname));
  walletVisible = signal(true);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.sectionAgent.set(resolveAgentForUrl(e.urlAfterRedirects)));
  }

  get formattedBalance(): string {
    return `$ ${this.walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }

  openAgentPanel(): void {
    this.galiState.togglePanel();
  }

  toggleWallet(): void {
    this.walletVisible.update(v => !v);
  }

  onProfile(): void {
    this.feedback.action('Perfil de usuario');
  }
}

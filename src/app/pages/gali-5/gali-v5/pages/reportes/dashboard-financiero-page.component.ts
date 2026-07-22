import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliInsightDirective } from '../../directives/gali-insight.directive';
import { GaliGlosarioDirective } from '../../directives/gali-glosario.directive';
import { GaliModuleActivationBarComponent } from '../../components/gali-module-activation-bar/gali-module-activation-bar.component';
import { Gali6AgentPresenceBarComponent } from '../../../../gali-6/components/gali6-agent-presence-bar.component';
import { Gali6ScreenArtifactsComponent } from '../../../../gali-6/components/gali6-screen-artifacts.component';
import KPIS_GLOBAL from '../../../../../../../mocks/gali-v5/kpis-global.json';

interface WaterfallBar {
  label: string;
  value: number;
  type: 'revenue' | 'cost' | 'subtotal' | 'net';
  tooltip: string;
}

interface WeekRow {
  week: string;
  ventas: number;
  pauta: number;
  flete: number;
  novedad: number;
  cogs: number;
  utilidad: number;
  roas: number;
}

interface GaliProjection {
  scenario: 'conservador' | 'base' | 'optimista';
  label: string;
  semanas: number;
  utilidadProyectada: number;
  roasProyectado: number;
  acciones: string[];
}

interface ChannelRow {
  channel: string;
  emoji: string;
  ventas: number;
  pedidos: number;
  roas: number;
  roasReal: number;
  novedad: number;
  pauta: number;
  utilidad: number;
  margen: number;
  kronosInsight: string;
}

@Component({
  selector: 'app-dashboard-financiero-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliInsightDirective, GaliGlosarioDirective, GaliModuleActivationBarComponent, Gali6AgentPresenceBarComponent, Gali6ScreenArtifactsComponent],
  templateUrl: './dashboard-financiero-page.component.html',
  styleUrl: './dashboard-financiero-page.component.scss',
})
export class DashboardFinancieroPageComponent implements OnInit, OnDestroy {
  private ws = inject(GaliWorkspaceService);
  readonly Math = Math;

  ngOnInit(): void { this.ws.primaryAlertActive.set(true); }
  ngOnDestroy(): void { this.ws.primaryAlertActive.set(false); }

  readonly activeWeekFilter = signal<'4s' | '8s' | '12s'>('4s');
  readonly activeProjection = signal<'conservador' | 'base' | 'optimista'>('base');
  // C2: expose for template tooltip
  readonly roasEfetivoLabel = KPIS_GLOBAL.roas_efectivo_global.label;

  // ── P&L Waterfall data — 10 barras desde kpis-global.json (0 literales hardcodeados) ──
  readonly waterfallBars: WaterfallBar[] = [
    { label: 'Ingresos brutos', value: KPIS_GLOBAL.ingresos_brutos_mensual.valor, type: 'revenue', tooltip: '2.470 pedidos × $6.000 precio promedio' },
    { label: 'Costo del producto (COGS)', value: (KPIS_GLOBAL as any).cogs_mensual.valor, type: 'cost', tooltip: '30% de los ingresos brutos' },
    { label: 'Flete pagado', value: (KPIS_GLOBAL as any).flete_mensual.valor, type: 'cost', tooltip: '$600/pedido promedio Servientrega + Coordinadora' },
    { label: 'Subtotal post-flete/COGS', value: (KPIS_GLOBAL as any).subtotal_post_flete.valor, type: 'subtotal', tooltip: 'Margen bruto después de producto y flete' },
    { label: 'Pauta Meta (Roax)', value: (KPIS_GLOBAL as any).pauta_mensual.valor, type: 'cost', tooltip: '21% de los ingresos · ROAS 2.9x declarado por Meta' },
    { label: 'Novedades / devoluciones', value: (KPIS_GLOBAL as any).novedades_mensual.valor, type: 'cost', tooltip: '14% tasa novedad · $300 pérdida promedio por novedad' },
    { label: 'Comisión Dropi', value: (KPIS_GLOBAL as any).comision_mensual.valor, type: 'cost', tooltip: '4% de ingresos brutos' },
    { label: 'Subtotal post-marketing', value: (KPIS_GLOBAL as any).subtotal_post_marketing.valor, type: 'subtotal', tooltip: 'Margen después de todos los costos variables' },
    { label: 'Gastos fijos operativos', value: (KPIS_GLOBAL as any).gastos_fijos_mensual.valor, type: 'cost', tooltip: 'Herramientas, plataformas, suscripciones' },
    { label: 'Utilidad neta del mes', value: KPIS_GLOBAL.utilidad_neta_mensual.valor, type: 'net', tooltip: 'P&L real de Mayo 2026 — Gali calculado' },
  ];

  get maxAbsValue(): number {
    return Math.max(...this.waterfallBars.map(b => Math.abs(b.value)));
  }

  barWidth(value: number): number {
    return (Math.abs(value) / this.maxAbsValue) * 100;
  }

  formatCOP(val: number): string {
    const abs = Math.abs(val);
    if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}k`;
    return `$${abs}`;
  }

  formatCOPFull(val: number): string {
    return `$${Math.abs(val).toLocaleString('es-CO')}`;
  }

  // ── Weekly breakdown ─────────────────────────────────────────
  readonly weeks4: WeekRow[] = [
    { week: 'Sem 1 Mayo', ventas: 3_820_000, pauta: 780_000, flete: 382_000, novedad: 190_000, cogs: 1_146_000, utilidad: 1_124_000, roas: 4.9 },
    { week: 'Sem 2 Mayo', ventas: 3_650_000, pauta: 810_000, flete: 365_000, novedad: 210_000, cogs: 1_095_000, utilidad: 970_000, roas: 4.5 },
    { week: 'Sem 3 Mayo', ventas: 3_920_000, pauta: 750_000, flete: 392_000, novedad: 165_000, cogs: 1_176_000, utilidad: 1_237_000, roas: 5.2 },
    { week: 'Sem 4 Mayo', ventas: 3_430_000, pauta: 760_000, flete: 343_000, novedad: 175_000, cogs: 1_029_000, utilidad: 923_000, roas: 4.5 },
  ];

  readonly weeks8: WeekRow[] = [
    ...this.weeks4.map(w => ({ ...w, week: w.week.replace('Mayo', 'Abr') })),
    ...this.weeks4,
  ];

  get activeWeeks(): WeekRow[] {
    if (this.activeWeekFilter() === '4s') return this.weeks4;
    if (this.activeWeekFilter() === '8s') return this.weeks8;
    return this.weeks8;
  }

  totalRow = computed(() => {
    const rows = this.activeWeeks;
    return {
      ventas: rows.reduce((s, r) => s + r.ventas, 0),
      pauta: rows.reduce((s, r) => s + r.pauta, 0),
      flete: rows.reduce((s, r) => s + r.flete, 0),
      novedad: rows.reduce((s, r) => s + r.novedad, 0),
      cogs: rows.reduce((s, r) => s + r.cogs, 0),
      utilidad: rows.reduce((s, r) => s + r.utilidad, 0),
      roas: rows.length ? rows.reduce((s, r) => s + r.roas, 0) / rows.length : 0,
    };
  });

  // ── Gali projections ─────────────────────────────────────────
  readonly projections: GaliProjection[] = [
    {
      scenario: 'conservador',
      label: 'Conservador',
      semanas: 4,
      utilidadProyectada: 3_400_000,
      roasProyectado: 4.2,
      acciones: [
        'Mantener presupuesto actual $66k/día',
        'No escalar campañas nuevas',
        'Optimizar solo novedades (meta: 12%)',
      ],
    },
    {
      scenario: 'base',
      label: 'Base (recomendado)',
      semanas: 4,
      utilidadProyectada: 4_600_000,
      roasProyectado: 4.8,
      acciones: [
        'Escalar Video B a $85k/día (+20%)',
        'Lanzar Difusor Aromaterapia con skill Roax',
        'Chatea Pro: recuperar 15% carritos',
        'Meta tasa novedad: 11%',
      ],
    },
    {
      scenario: 'optimista',
      label: 'Optimista',
      semanas: 4,
      utilidadProyectada: 6_200_000,
      roasProyectado: 5.5,
      acciones: [
        'Nuevo nicho: Accesorios Gaming (ADA Score 94)',
        'Escalar 3 productos simultáneamente',
        'Bundle Skincare Pack lanzado en semana 2',
        'Reducir novedad a 10% con smart routing',
      ],
    },
  ];

  get activeProjectionData(): GaliProjection {
    return this.projections.find(p => p.scenario === this.activeProjection())!;
  }

  // ── KPI summary — etiquetas desde kpis-global.json ──────────
  readonly kpis = [
    { label: 'Ingresos brutos', value: KPIS_GLOBAL.ingresos_brutos_mensual.label, delta: '+12%', tone: 'ok',
      insight: 'Crecimiento sostenido 3 meses seguidos. Proyección Gali: $16.5M próximo mes si escalas Difusor.' },
    { label: 'Utilidad neta', value: KPIS_GLOBAL.utilidad_neta_mensual.label, delta: '+8%', tone: 'ok',
      insight: 'Por encima del promedio histórico tuyo ($3.1M). El 60% viene del proyecto Skincare Pack.' },
    { label: 'Margen real', value: '25.7%', delta: '+1.4pp', tone: 'ok',
      insight: 'Margen saludable para dropshipping. La reducción de novedad de 16% a 14% aportó 0.9pp.' },
    { label: 'ROAS efectivo', value: KPIS_GLOBAL.roas_efectivo_global.label, delta: '-0.2×', tone: 'warn',
      insight: 'ROAS real ponderado por pauta de todos los proyectos activos. Meta declara 2.9× para Collar GPS — diferencia de 0.99× absorbida por novedades.' },
    { label: 'Tasa novedad', value: '14%', delta: '-2pp', tone: 'warn',
      insight: 'Bajó de 16% → 14% pero sigue sobre el umbral ideal (10%). Coordinadora Bogotá es el foco.' },
    { label: 'Costo adquisición', value: '$1.255', delta: '-$120', tone: 'ok',
      insight: 'Mejora real. El escalado de Video B mejoró la eficiencia. Objetivo Gali: <$1.100 en 2 semanas.' },
  ];

  // ── Economía unitaria por producto ──────────────────────────
  readonly unitEconomics = [
    {
      product: 'Collar GPS Mascotas',
      precio: 189_000, cogs: 65_000, flete: 12_000, pauta: 42_000, novedad: 8_000, comision: 7_560,
      margenUnit: 54_440, roasBreakeven: 1.52, roasReal: 4.5,
      ltv: 310_000, cac: 42_000, ltvCacRatio: 7.4,
      semanaBreakeven: 3, status: 'escala',
    },
    {
      product: 'Skincare K-Beauty Pack',
      precio: 125_000, cogs: 38_000, flete: 11_500, pauta: 38_000, novedad: 6_500, comision: 5_000,
      margenUnit: 26_000, roasBreakeven: 1.97, roasReal: 1.8,
      ltv: 240_000, cac: 38_000, ltvCacRatio: 6.3,
      semanaBreakeven: 6, status: 'riesgo',
    },
    {
      product: 'Bandas de Fitness',
      precio: 89_000, cogs: 28_000, flete: 10_000, pauta: 35_000, novedad: 9_000, comision: 3_560,
      margenUnit: 3_440, roasBreakeven: 2.14, roasReal: 1.1,
      ltv: 160_000, cac: 35_000, ltvCacRatio: 4.6,
      semanaBreakeven: 14, status: 'pausado',
    },
  ];

  unitStatusLabel(s: string): string {
    return { escala: '↑ escalando', riesgo: '⚠ en riesgo', pausado: '⏸ pausado' }[s] ?? s;
  }

  unitStatusClass(s: string): string {
    return `eco-status--${s}`;
  }

  formatCOPShort(v: number): string {
    if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v/1_000).toFixed(0)}k`;
    return `$${v}`;
  }

  // ── P&L por canal (Kronos) ───────────────────────────────────
  readonly channelRows: ChannelRow[] = [
    {
      channel: 'Meta Ads',
      emoji: '📘',
      ventas: 9_340_000,
      pedidos: 1_557,
      roas: 3.1,
      roasReal: 1.93, // ROAS real calculado por Dropi — Meta declara 3.1× (atribución plataforma)
      novedad: 15,
      pauta: 3_100_000,
      utilidad: 2_530_000,
      margen: 27.1,
      kronosInsight: 'Mayor canal. ROAS real Dropi 1.93× vs Meta declarado 3.1× — diferencia de 1.17× absorbida por novedades en Cali (40%). Oportunidad: reducir tasa de novedad.',
    },
    {
      channel: 'TikTok Shop',
      emoji: '🎵',
      ventas: 2_960_000,
      pedidos: 493,
      roas: 4.2,
      roasReal: 3.8,
      novedad: 11,
      pauta: 720_000,
      utilidad: 890_000,
      margen: 30.1,
      kronosInsight: 'Mejor ROAS real del portafolio. Videos cortos <47s tienen 3× más CVR. Canal en expansión — considera aumentar presupuesto.',
    },
    {
      channel: 'Shopify',
      emoji: '🛍',
      ventas: 1_540_000,
      pedidos: 257,
      roas: 0,
      roasReal: 0,
      novedad: 9,
      pauta: 0,
      utilidad: 590_000,
      margen: 38.3,
      kronosInsight: 'Canal orgánico — sin pauta. Mayor margen del portafolio (38%). Priorizar retención y upsell aquí.',
    },
    {
      channel: 'WhatsApp',
      emoji: '💚',
      ventas: 680_000,
      pedidos: 113,
      roas: 0,
      roasReal: 0,
      novedad: 8,
      pauta: 0,
      utilidad: 290_000,
      margen: 42.6,
      kronosInsight: 'Mejor margen neto (42.6%). Canal de alta conversión. Chatea Pro gestiona el 89% sin intervención manual.',
    },
    {
      channel: 'Directo',
      emoji: '🔗',
      ventas: 300_000,
      pedidos: 50,
      roas: 0,
      roasReal: 0,
      novedad: 12,
      pauta: 0,
      utilidad: 98_000,
      margen: 32.7,
      kronosInsight: 'Canal directo con tráfico orgánico. Novedad 12% — ligeramente sobre el ideal. Activar landing Page Pilot reduciría este ratio.',
    },
  ];

  get channelTotalVentas(): number {
    return this.channelRows.reduce((s, r) => s + r.ventas, 0);
  }

  channelSharePct(ventas: number): number {
    return Math.round((ventas / this.channelTotalVentas) * 100);
  }
}

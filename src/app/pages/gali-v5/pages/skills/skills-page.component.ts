import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliSkillBuilderV2Component, SkillRule } from '../../components/gali-skill-builder-v2/gali-skill-builder-v2.component';
import { GaliNewSkillOverlayComponent } from '../../components/gali-new-skill-overlay/gali-new-skill-overlay.component';

@Component({
  selector: 'app-skills-page',
  standalone: true,
  imports: [CommonModule, GaliSkillBuilderV2Component, GaliNewSkillOverlayComponent],
  templateUrl: './skills-page.component.html',
  styleUrl: './skills-page.component.scss',
})
export class SkillsPageComponent {
  readonly ws = inject(GaliWorkspaceService);
  private router = inject(Router);

  readonly selectedSkillId = signal<string>('skill-001');

  readonly skills: SkillRule[] = [
    {
      id: 'skill-001',
      nombre: 'Auto-pausa si CTR cae',
      descripcion: 'Pausa la campaña activa y activa la alternativa cuando el CTR cae bajo umbral por 48h',
      trigger: { event: 'roax_check', agent: 'roax', interval: 'cada 4h' },
      condition: { metric: 'CTR', operator: '<', value: 0.8, unit: '%', duration: '48h' },
      action: { type: 'pause_and_activate', params: { pause: 'active_video', activate: 'backup_video' } },
      notification: { message: 'Cambié Video A → Video B por CTR bajo', cta: 'Ver detalle' },
      status: 'active',
      ultima_ejecucion: 'hace 2h',
      ejecuciones_total: 7,
      runHistory: [
        { fecha: '2026-05-29 14:30', resultado: 'ejecutado', detalle: 'CTR Video A fue 0.7% — Pausé, activé Video B', impacto: 'CTR: 1.2% → 1.8%' },
        { fecha: '2026-05-28 10:15', resultado: 'ejecutado', detalle: 'CTR Video C fue 0.6% — Pausé campaña', impacto: 'ROAS estabilizado' },
        { fecha: '2026-05-27 —', resultado: 'no_activado', detalle: 'CTR sobre umbral todo el día', impacto: '—' },
        { fecha: '2026-05-26 08:00', resultado: 'ejecutado', detalle: 'CTR cayó a 0.5% — Pausé, activé backup', impacto: 'CTR: 0.5% → 1.4%' },
        { fecha: '2026-05-25 —', resultado: 'no_activado', detalle: 'CTR sobre umbral', impacto: '—' },
      ],
    },
    {
      id: 'skill-002',
      nombre: 'Escalado ROAS automático',
      descripcion: 'Incrementa el presupuesto cuando el ROAS supera el objetivo durante 48h continuas',
      trigger: { event: 'roax_check', agent: 'roax', interval: 'cada 6h' },
      condition: { metric: 'ROAS', operator: '≥', value: 2.8, duration: '48h' },
      action: { type: 'budget_increase', params: { percent: 15, max_daily: 100000 } },
      notification: { message: 'Escalé presupuesto +15% (ROAS ≥ 2.8x por 48h)' },
      status: 'active',
      ultima_ejecucion: 'hace 4h',
      ejecuciones_total: 3,
      runHistory: [
        { fecha: '2026-05-29 10:00', resultado: 'ejecutado', detalle: 'ROAS fue 2.9x por 52h — Budget $57.5k → $66k', impacto: '+$8.500/día' },
        { fecha: '2026-05-22 09:30', resultado: 'ejecutado', detalle: 'ROAS fue 3.1x por 60h — Budget $50k → $57.5k', impacto: '+$7.500/día' },
        { fecha: '2026-05-15 —', resultado: 'no_activado', detalle: 'ROAS 2.3x, no alcanzó umbral', impacto: '—' },
      ],
    },
    {
      id: 'skill-003',
      nombre: 'Smart routing novedad',
      descripcion: 'Cambia transportadora automáticamente cuando la novedad supera el umbral',
      trigger: { event: 'vigilante_alert', agent: 'vigilante', interval: 'cada 2h' },
      condition: { metric: 'novedad_pct', operator: '>', value: 8, unit: '%' },
      action: { type: 'reroute_orders', params: { from: 'coordinadora', to: 'servientrega' } },
      notification: { message: 'Reasigné pedidos por novedad alta en Bogotá' },
      status: 'paused',
      ultima_ejecucion: 'hace 3 días',
      ejecuciones_total: 12,
      runHistory: [
        { fecha: '2026-05-26 14:00', resultado: 'ejecutado', detalle: 'Novedad Coordinadora 11% — Reasigné 8 pedidos', impacto: '4 novedades ahorradas' },
        { fecha: '2026-05-20 09:00', resultado: 'ejecutado', detalle: 'Novedad 9% — Reasigné 5 pedidos', impacto: '2 novedades ahorradas' },
      ],
    },
  ];

  readonly marketplaceSkills = [
    { id: 'mkt-1', nombre: 'P&L real vs ROAS declarado', category: 'Financiero', uses: '1.2k', descripcion: 'Detecta discrepancias entre el ROAS reportado y el P&L real.' },
    { id: 'mkt-2', nombre: 'Alerta saturación de nicho', category: 'Productos', uses: '987', descripcion: 'Monitorea cuando 3+ competidores nuevos entran a tu nicho.' },
    { id: 'mkt-3', nombre: 'Resolución automática novedades', category: 'CAS', uses: '756', descripcion: 'Clasifica y resuelve novedades recurrentes sin intervención.' },
  ];

  get selectedSkill(): SkillRule | undefined {
    return this.skills.find(s => s.id === this.selectedSkillId());
  }

  selectSkill(id: string): void {
    this.selectedSkillId.set(id);
  }

  readonly showNewSkill = signal(false);

  goToHub(): void {
    this.ws.setMode('construir');
    this.router.navigate(['/gali-v5']);
  }

  goToNewSkill(): void {
    this.router.navigate(['/gali-v5/skills/nueva']);
  }
}

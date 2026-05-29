import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliWorkspaceModeBarComponent } from '../../components/gali-workspace-mode-bar/gali-workspace-mode-bar.component';
import { GaliSkillBuilderV2Component, SkillRule } from '../../components/gali-skill-builder-v2/gali-skill-builder-v2.component';
import { GaliNewSkillOverlayComponent } from '../../components/gali-new-skill-overlay/gali-new-skill-overlay.component';

@Component({
  selector: 'app-skills-page',
  standalone: true,
  imports: [CommonModule, GaliWorkspaceModeBarComponent, GaliSkillBuilderV2Component, GaliNewSkillOverlayComponent],
  templateUrl: './skills-page.component.html',
  styleUrl: './skills-page.component.scss',
})
export class SkillsPageComponent {
  readonly ws = inject(GaliWorkspaceService);
  readonly router = inject(Router);

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
  readonly activeMktTab = signal<'populares' | 'por-agente' | 'nuevas'>('populares');

  readonly marketplaceByAgent = [
    { id: 'ma-1', nombre: 'Smart routing novedad Cali', category: 'Logística', agent: 'vigilante', uses: '3.4k', descripcion: 'Reasigna pedidos cuando la novedad supera el umbral en ciudades específicas.' },
    { id: 'ma-2', nombre: 'Escalado gradual ROAS', category: 'Marketing', agent: 'roax', uses: '4.5k', descripcion: 'Sube el presupuesto +10% cada 24h mientras el ROAS se mantiene.' },
    { id: 'ma-3', nombre: 'Resolución PQR automática', category: 'CAS', agent: 'chatea', uses: '2.1k', descripcion: 'Clasifica y responde PQRs recurrentes con plantillas verificadas.' },
    { id: 'ma-4', nombre: 'Alerta saturación de nicho', category: 'Research', agent: 'ada', uses: '987', descripcion: 'Avisa cuando 3+ competidores nuevos entran a tu nicho en 7 días.' },
  ];

  readonly marketplaceNew = [
    { id: 'mn-1', nombre: 'Confirmación inteligente pedidos', category: 'Pedidos', agent: 'chatea', uses: '312', descripcion: 'Confirma pedidos con huella verde automáticamente en horario configurado.' },
    { id: 'mn-2', nombre: 'Detector de productos trending', category: 'Research', agent: 'ada', uses: '198', descripcion: 'Detecta productos con tendencia creciente antes de que saturen.' },
    { id: 'mn-3', nombre: 'Anti-fatiga de audiencia', category: 'Marketing', agent: 'roax', uses: '445', descripcion: 'Rota creativos automáticamente cuando la frecuencia supera 2.5x.' },
  ];

  goToHub(): void {
    this.ws.setMode('construir');
    this.router.navigate(['/gali-v5']);
  }

  goToNewSkill(): void {
    this.router.navigate(['/gali-v5/skills/nueva']);
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliSkillBuilderV2Component, SkillRule, SkillRegla } from '../../components/gali-skill-builder-v2/gali-skill-builder-v2.component';
import { GaliNewSkillOverlayComponent } from '../../components/gali-new-skill-overlay/gali-new-skill-overlay.component';
import { GaliOntologyStripComponent } from '../../components/gali-ontology-strip/gali-ontology-strip.component';

@Component({
  selector: 'app-skills-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliSkillBuilderV2Component, GaliNewSkillOverlayComponent, GaliOntologyStripComponent],
  templateUrl: './skills-page.component.html',
  styleUrl: './skills-page.component.scss',
})
export class SkillsPageComponent {
  readonly ws = inject(GaliWorkspaceService);
  readonly router = inject(Router);

  readonly selectedSkillId = signal<string>('skill-001');
  readonly selectedAgentId = signal<string | null>(null);
  readonly mainTab = signal<'mis-skills' | 'marketplace'>('mis-skills');
  readonly skillAgentFilter = signal<string | null>(null);

  readonly filteredSkills = computed(() => {
    const f = this.skillAgentFilter();
    if (!f) return this.skills;
    return this.skills.filter(s =>
      s.agentesQueLaUsan?.some((a: any) => a.nombre.toLowerCase().includes(f.toLowerCase()))
    );
  });

  readonly skills: SkillRule[] = [
    {
      id: 'skill-001',
      nombre: 'Auto-pausa si CTR cae',
      descripcion: 'Pausa la campaña activa y activa la alternativa cuando el CTR cae bajo el umbral configurado por 48h continuas. Libera presupuesto hacia el creativo de mayor rendimiento.',
      notification: { message: 'Cambié Video A → Video B por CTR bajo', cta: 'Ver detalle' },
      status: 'active',
      ultima_ejecucion: 'hace 2h',
      ejecuciones_total: 7,
      agentesQueLaUsan: [
        { nombre: 'Roax', color: '#f97316' },
      ],
      reglas: [
        { id: 'r-001-1', texto: 'Si el CTR cae debajo del 0.8% por más de 48h, pausar el creativo activo y activar el backup automáticamente.', agenteAsignado: 'Roax', agenteColor: '#f97316', activa: true },
      ],
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
      descripcion: 'Incrementa el presupuesto en un porcentaje configurable cuando el ROAS supera el objetivo durante 48h continuas. Incluye rollback automático si el ROAS cae.',
      notification: { message: 'Escalé presupuesto +15% (ROAS ≥ 2.8x por 48h)' },
      status: 'active',
      ultima_ejecucion: 'hace 4h',
      ejecuciones_total: 3,
      agentesQueLaUsan: [
        { nombre: 'Roax', color: '#f97316' },
      ],
      reglas: [
        { id: 'r-002-1', texto: 'Escalar presupuesto máximo +15% cada 48h. No superar $100.000 COP diarios sin aprobación manual.', agenteAsignado: 'Roax', agenteColor: '#f97316', activa: true },
        { id: 'r-002-2', texto: 'Si el ROAS cae debajo de 2.0x después del escalado, hacer rollback al presupuesto anterior.', agenteAsignado: 'Roax', agenteColor: '#f97316', activa: true },
      ],
      runHistory: [
        { fecha: '2026-05-29 10:00', resultado: 'ejecutado', detalle: 'ROAS Meta 2.9x por 52h (≥ umbral 2.8x) — Budget $57.5k → $66k', impacto: '+$8.500/día' },
        { fecha: '2026-05-22 09:30', resultado: 'ejecutado', detalle: 'ROAS fue 3.1x por 60h — Budget $50k → $57.5k', impacto: '+$7.500/día' },
        { fecha: '2026-05-15 —', resultado: 'no_activado', detalle: 'ROAS 2.3x, no alcanzó umbral', impacto: '—' },
      ],
    },
    {
      id: 'skill-003',
      nombre: 'Smart routing novedad',
      descripcion: 'Reasigna pedidos automáticamente a la transportadora con menor novedad cuando una supera el umbral configurado. Reduce novedades sin intervención manual.',
      notification: { message: 'Reasigné pedidos por novedad alta en Bogotá' },
      status: 'paused',
      ultima_ejecucion: 'hace 3 días',
      ejecuciones_total: 12,
      agentesQueLaUsan: [
        { nombre: 'Vigilante', color: '#fbbf24' },
      ],
      reglas: [
        { id: 'r-003-1', texto: 'Solo reasignar si el pedido tiene menos de 12h de creado. Pedidos más viejos requieren revisión manual.', agenteAsignado: 'Vigilante', agenteColor: '#fbbf24', activa: false },
      ],
      runHistory: [
        { fecha: '2026-05-26 14:00', resultado: 'ejecutado', detalle: 'Novedad Coordinadora 11% — Reasigné 8 pedidos', impacto: '4 novedades ahorradas' },
        { fecha: '2026-05-20 09:00', resultado: 'ejecutado', detalle: 'Novedad 9% — Reasigné 5 pedidos', impacto: '2 novedades ahorradas' },
      ],
    },
  ];

  readonly marketplaceSkills = [
    { id: 'mkt-1', nombre: 'P&L real vs ROAS declarado', category: 'Financiero', uses: '1.2k', rating: 4.8, clonaciones:89, descripcion: 'Detecta discrepancias entre el ROAS reportado y el P&L real.' },
    { id: 'mkt-2', nombre: 'Alerta saturación de nicho', category: 'Productos', uses: '987', rating: 4.7, clonaciones:64, descripcion: 'Monitorea cuando 3+ competidores nuevos entran a tu nicho.' },
    { id: 'mkt-3', nombre: 'Resolución automática novedades', category: 'CAS', uses: '756', rating: 4.6, clonaciones:41, descripcion: 'Clasifica y resuelve novedades recurrentes sin intervención.' },
  ];

  readonly ontologyAgents = [
    { id: 'roax',      name: 'Roax',       role: 'Marketing',   color: '#f97316' },
    { id: 'vigilante', name: 'Vigilante',  role: 'Logística',   color: '#fbbf24' },
    { id: 'chatea',    name: 'Chatea Pro', role: 'CAS',         color: '#34d399' },
    { id: 'ada',       name: 'ADA Spy',    role: 'Productos',   color: '#818cf8' },
    { id: 'kronos',    name: 'Kronos',     role: 'Finanzas',    color: '#60a5fa' },
  ];

  get selectedSkill(): SkillRule | undefined {
    return this.skills.find(s => s.id === this.selectedSkillId());
  }

  selectSkill(id: string): void {
    this.selectedSkillId.set(id);
  }

  readonly showNewSkill = signal(false);
  readonly activeMktTab = signal<'populares' | 'por-seccion' | 'nuevas' | 'expertos'>('populares');
  readonly activeSectionFilter = signal<string | null>(null);

  readonly dropiRecomendaciones = [
    { id: 'dr-1', nombre: 'Smart routing novedad', tipo: 'Operación', secciones: ['Pedidos', 'Logística'], uses: '3.4k', rating: 4.9, autor: 'Dropi Team', descripcion: 'Cambia automáticamente la transportadora cuando la novedad supera el umbral.' },
    { id: 'dr-2', nombre: 'Auto-confirmación pedidos', tipo: 'Operación', secciones: ['Pedidos'], uses: '2.1k', rating: 4.8, autor: 'Dropi Team', descripcion: 'Confirma pedidos con huella verde automáticamente sin intervención manual.' },
  ];

  readonly expertosSkills = [
    {
      id: 'ex-1', nombre: 'Scaling vertical — 20% cada 48h', tipo: 'Experto',
      secciones: ['Marketing'], uses: '847', rating: 4.9, clonaciones:203,
      autor: 'Alejandro Torres', handle: '@AlejandroTorres',
      autorBio: 'Dropshipper top · 1.200+ ventas/mes · 3 años en Dropi',
      autorAvatar: 'AT', autorColor: '#f97316',
      descripcion: 'Escala presupuesto +20% cada 48h si el ROAS se mantiene sobre el objetivo. Con límites inteligentes y rollback automático.',
      comments: 34, shared: true,
    },
    {
      id: 'ex-2', nombre: 'P&L simplificado para declarar', tipo: 'Experto',
      secciones: ['Finanzas'], uses: '623', rating: 4.7, clonaciones:118,
      autor: 'Carlos Pérez CPA', handle: '@ContadorDropi',
      autorBio: 'Contador certificado · especialista en dropshipping',
      autorAvatar: 'CP', autorColor: '#3b82f6',
      descripcion: 'Calcula automáticamente tu utilidad real descontando flete, novedad, pauta y COGS. Compatible con declaración de renta.',
      comments: 19, shared: true,
    },
    {
      id: 'ex-3', nombre: 'Bundle mascotas: 5 productos ganadores', tipo: 'Experto',
      secciones: ['Productos'], uses: '412', rating: 4.6, clonaciones:76,
      autor: 'María Gómez', handle: '@PetDropper',
      autorBio: 'Nicho mascotas · Top seller noviembre 2025',
      autorAvatar: 'MG', autorColor: '#10b981',
      descripcion: 'Alerta cuando los 5 productos clave del nicho mascotas tienen ventana simultánea. Incluye configuración de scoring.',
      comments: 12, shared: false,
    },
    {
      id: 'ex-4', nombre: 'CAS → Recuperación carrito abandonado', tipo: 'Experto',
      secciones: ['CAS', 'Marketing'], uses: '389', rating: 4.8, clonaciones:91,
      autor: 'Luis Vargas', handle: '@ChateaProLuis',
      autorBio: 'Chatea Pro power user · tasa recuperación 38%',
      autorAvatar: 'LV', autorColor: '#8b5cf6',
      descripcion: 'Secuencia de 3 mensajes WhatsApp: recordatorio suave → urgencia → oferta final. Personalizado con nombre del producto.',
      comments: 27, shared: true,
    },
  ];

  readonly showShareModal = signal(false);
  readonly shareSkillName = signal('');

  openShareModal(skillName: string): void {
    this.shareSkillName.set(skillName);
    this.showShareModal.set(true);
  }

  forkSkill(skillId: string): void {
    this.goToNewSkill();
  }

  readonly sectionFilters = ['Pedidos', 'Marketing', 'Finanzas', 'Logística', 'Productos', 'CAS'];

  filteredMarketplaceSkills = computed(() => {
    const section = this.activeSectionFilter();
    if (!section) return this.marketplaceByAgent;
    return this.marketplaceByAgent.filter(s =>
      (s as any).sections?.includes(section) || s.category === section
    );
  });

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

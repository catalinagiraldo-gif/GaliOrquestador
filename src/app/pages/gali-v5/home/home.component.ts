import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GaliWorkspaceService } from '../services/gali-workspace.service';
import { GaliWorkspaceModeBarComponent } from '../components/gali-workspace-mode-bar/gali-workspace-mode-bar.component';
import {
  GaliSignalCardV2Component,
  GaliSignalData,
} from '../components/gali-signal-card-v2/gali-signal-card-v2.component';
import {
  GaliProjectPanelComponent,
  ProjectPanelData,
} from '../components/gali-project-panel/gali-project-panel.component';
import { GaliNewSkillOverlayComponent } from '../components/gali-new-skill-overlay/gali-new-skill-overlay.component';

type AgentStatus = 'activo' | 'esperando' | 'pausa';

interface AgentLive {
  id: string;
  nombre: string;
  icono: string;
  estado: AgentStatus;
  descripcion: string;
  ultimaAccion: string;
  color: string;
}

@Component({
  selector: 'app-dropi-home',
  standalone: true,
  imports: [
    CommonModule,
    GaliWorkspaceModeBarComponent,
    GaliSignalCardV2Component,
    GaliProjectPanelComponent,
    GaliNewSkillOverlayComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class DropiHomeComponent {
  readonly ws = inject(GaliWorkspaceService);
  private router = inject(Router);
  private auth = inject(AuthService);

  userName = signal('Alejandra');

  readonly signals: GaliSignalData[] = [
    {
      id: 'sig-001',
      agente: 'Vigilante',
      agente_id: 'vigilante',
      tipo: 'critica',
      estado: 'pending_decision',
      titulo: 'Coordinadora Bogotá: 15% novedad hoy',
      contexto:
        'Tasa 3× por encima del umbral (5%). 12 pedidos de hoy en riesgo. Último pico: hace 3 días con 11%.',
      timestamp: 'hace 18 min',
      urgencia: 'alta',
      afectados: 12,
      metrica_label: 'Novedad Coordinadora',
      metrica_valor: '15%',
      umbral: '5%',
      opciones: [
        { id: 'a', label: 'Cambiar todos → Servientrega', sublabel: 'Tasa actual: 3.8%' },
        { id: 'b', label: 'Cambiar solo los de hoy', sublabel: 'Esperar datos de mañana' },
        { id: 'c', label: 'Crear regla automática', sublabel: 'Para futuros picos' },
      ],
      tabla_label: 'pedidos afectados',
      tabla_items: [
        { id: 'P-8841', cliente: 'María L.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'En camino' },
        { id: 'P-8839', cliente: 'Carlos M.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'En camino' },
        { id: 'P-8835', cliente: 'Sandra P.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'Entregando' },
        { id: 'P-8832', cliente: 'Jorge R.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'En camino' },
      ],
    },
    {
      id: 'sig-002',
      agente: 'Roax',
      agente_id: 'roax',
      tipo: 'completada',
      estado: 'completed',
      titulo: 'Cambié Video A → Video B (CTR mejora)',
      contexto: 'Video A cayó a CTR 0.7% durante 48h. Activé Video B automáticamente.',
      timestamp: 'hace 2h',
      urgencia: 'baja',
      resultado_antes: 'CTR: 1.2% · ROAS: 2.6x',
      resultado_despues: 'CTR: 1.8% · ROAS: 2.9x',
      cta_followup: '¿Crear skill para esto?',
      cta_followup_label: 'Crear skill',
    },
    {
      id: 'sig-003',
      agente: 'Chatea Pro',
      agente_id: 'chatea',
      tipo: 'decision',
      estado: 'pending_decision',
      titulo: '1 novedad requiere tu decisión',
      contexto:
        '8 novedades resueltas automáticamente. Pedido P-8801 tiene reporte inusual de transportadora.',
      timestamp: 'hace 1h',
      urgencia: 'media',
      afectados: 1,
      opciones: [
        { id: 'a', label: 'Autorizar devolución', sublabel: 'Crédito automático al cliente' },
        { id: 'b', label: 'Llamar al cliente', sublabel: 'Verificar antes de resolver' },
        { id: 'c', label: 'Escalar a CAS', sublabel: 'Asignar a agente humano' },
      ],
    },
    {
      id: 'sig-004',
      agente: 'ADA Spy',
      agente_id: 'ada',
      tipo: 'oportunidad',
      estado: 'pending_decision',
      titulo: 'Difusor aromaterapia: +340% ventas',
      contexto: 'Margen est: 68%. Ventana de 10–14 días antes de saturación. Score: 87/100.',
      timestamp: 'hace 1h',
      urgencia: 'baja',
      metrica_label: 'Score oportunidad',
      metrica_valor: '87/100',
      opciones: [
        { id: 'a', label: 'Lanzar proyecto', sublabel: 'Ir a Modo Lanzar' },
        { id: 'b', label: 'Ver análisis completo', sublabel: 'Caza Productos' },
        { id: 'c', label: 'Guardar para después', sublabel: 'Alerta si baja el score' },
      ],
    },
  ];

  readonly proyectos: ProjectPanelData[] = [
    {
      id: 'collar-gps-2026',
      nombre: 'Collar GPS para mascotas',
      estado: 'en_escala',
      roas: '2.9x',
      pedidos: '47/sem',
      ganancia: '$411k',
      alertaActiva: true,
      alertaMensaje: 'Novedad alta en Cali',
      galiMensaje: 'Tu novedad en Cali está afectando el margen. Actúa hoy.',
      agentes: [
        { nombre: 'Roax', id: 'roax', activo: true },
        { nombre: 'Vigilante', id: 'vigilante', activo: true },
        { nombre: 'Chatea Pro', id: 'chatea', activo: true },
      ],
      skills: [
        { nombre: 'Auto-pausa CTR', activa: true },
        { nombre: 'Escalado ROAS', activa: true },
        { nombre: 'Smart routing', activa: false },
      ],
    },
    {
      id: 'skincare-kbeauty',
      nombre: 'Skincare K-Beauty',
      estado: 'activo',
      roas: '2.1x',
      pedidos: '23/sem',
      ganancia: '$187k',
      alertaActiva: false,
      galiMensaje: 'Todo en orden. Margen estable esta semana.',
      agentes: [
        { nombre: 'Roax', id: 'roax', activo: true },
        { nombre: 'ADA Spy', id: 'ada', activo: false },
      ],
      skills: [{ nombre: 'Auto-pausa CTR', activa: true }],
    },
    {
      id: 'fitness-bands',
      nombre: 'Bandas de Fitness',
      estado: 'pausado',
      roas: '—',
      pedidos: '—',
      ganancia: '—',
      alertaActiva: false,
      galiMensaje: 'CTR se recuperó. ¿Reanudamos?',
      agentes: [{ nombre: 'ADA Spy', id: 'ada', activo: false }],
      skills: [],
    },
  ];

  readonly agentes: AgentLive[] = [
    {
      id: 'roax',
      nombre: 'Roax',
      icono: '⚡',
      estado: 'activo',
      descripcion: 'ROAS 2.9x · Pauta $66k/día · Video B ganando',
      ultimaAccion: 'Escaló presupuesto +15% · hace 2h',
      color: '#f97316',
    },
    {
      id: 'vigilante',
      nombre: 'Vigilante',
      icono: '🚛',
      estado: 'activo',
      descripcion: '12 pedidos en zona de riesgo (Coordinadora)',
      ultimaAccion: 'Detectó novedad 15% Bogotá · hace 18 min',
      color: '#fbbf24',
    },
    {
      id: 'chatea',
      nombre: 'Chatea Pro',
      icono: '💬',
      estado: 'activo',
      descripcion: '43/47 confirmados · 1 caso pendiente',
      ultimaAccion: 'Resolvió 8 novedades · hace 1h',
      color: '#34d399',
    },
    {
      id: 'ada',
      nombre: 'ADA Spy',
      icono: '🔍',
      estado: 'esperando',
      descripcion: '3 oportunidades analizadas esta semana',
      ultimaAccion: 'Difusor aromaterapia · hace 1h',
      color: '#818cf8',
    },
  ];

  readonly adaOportunidades = [
    { nombre: 'Difusor aromaterapia', score: 87, margen: '68%', ventana: '10–14 días' },
    { nombre: 'Collar GPS v2', score: 82, margen: '42%', ventana: '14–21 días' },
    { nombre: 'Bandas fitness premium', score: 71, margen: '38%', ventana: '21–28 días' },
    { nombre: 'Purificador de agua mini', score: 65, margen: '44%', ventana: '7–10 días' },
  ];

  readonly skillHistory = [
    { fecha: '29/05 14:30', resultado: 'ejecutado', detalle: 'CTR Video A fue 0.7% — Pausé, activé B', impacto: 'CTR: 1.2%→1.8%' },
    { fecha: '28/05 10:15', resultado: 'ejecutado', detalle: 'CTR Video C fue 0.6% — Pausé', impacto: 'ROAS estabilizado' },
    { fecha: '27/05 —', resultado: 'no_activado', detalle: 'CTR sobre umbral todo el día', impacto: '—' },
    { fecha: '26/05 08:00', resultado: 'ejecutado', detalle: 'CTR cayó 0.5% — Pausé, activé backup', impacto: 'CTR: 0.5%→1.4%' },
  ];

  readonly marketplaceSkills = [
    { nombre: 'Smart routing novedad', uses: '3.4k' },
    { nombre: 'P&L real vs ROAS', uses: '1.2k' },
    { nombre: 'Restock alerta proveedor', uses: '890' },
  ];

  readonly communitySkills = [
    { id: 'cs-1', category: 'Logística', nombre: 'Auto-reasignación por novedad', descripcion: 'Cambia automáticamente la transportadora cuando la novedad supera el umbral en cualquier ciudad.', uses: '3.4k' },
    { id: 'cs-2', category: 'Marketing', nombre: 'Escalado ROAS inteligente', descripcion: 'Incrementa el presupuesto de forma gradual cuando el ROAS supera 2.5x durante 24h.', uses: '2.1k' },
    { id: 'cs-3', category: 'Financiero', nombre: 'P&L real vs ROAS declarado', descripcion: 'Detecta discrepancias entre el ROAS reportado por la plataforma y el P&L real del negocio.', uses: '1.2k' },
    { id: 'cs-4', category: 'Productos', nombre: 'Alerta saturación de nicho', descripcion: 'Monitorea cuando 3+ competidores nuevos entran a tu nicho en 7 días.', uses: '987' },
    { id: 'cs-5', category: 'CAS', nombre: 'Resolución automática de novedades comunes', descripcion: 'Clasifica y resuelve novedades recurrentes sin intervención humana.', uses: '756' },
    { id: 'cs-6', category: 'Marketing', nombre: 'Pausa-por-CTR + A/B automático', descripcion: 'Pausa el creativo con CTR bajo y activa el alternativo. Registra el resultado.', uses: '1.8k' },
  ];

  get pendingSignals(): number {
    return this.signals.filter(s => s.estado === 'pending_decision').length;
  }

  goToProject(id: string): void {
    this.router.navigate(['/gali-v5/proyecto', id]);
  }

  readonly showNewSkill = signal(false);

  openNewSkill(): void {
    this.showNewSkill.set(true);
  }

  goToMode(mode: 'lanzar' | 'construir' | 'medir'): void {
    this.ws.setMode(mode);
  }

  constructor() {
    this.auth.user$.subscribe(u => {
      if (u?.name) this.userName.set(u.name.split(' ')[0]);
    });
  }
}

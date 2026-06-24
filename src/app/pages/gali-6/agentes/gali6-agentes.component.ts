import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  AGENTES_ESPECIALIZADOS,
  PAQUETE_PRINCIPIANTES,
  AgenteEspecializado,
  AgenteProcesoTipo,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
  TIER_LABEL,
} from '../../../../../mocks/gali-v6/agentes-especializados';

type AgenteDetallTab = 'config' | 'historial';

interface HistorialItem {
  id: string;
  timestamp: string;
  accion: string;
  tipo: AgenteProcesoTipo;
  resultado: string;
  auto: boolean;
}

const HISTORIAL_POR_AGENTE: Record<string, HistorialItem[]> = {
  'stock-guardian': [
    { id: 'h1', timestamp: 'hace 15 min', accion: 'Detectó stock bajo en Difusor ultrasónico (<50 un.)', tipo: 'deterministico', resultado: 'Alerta enviada — pausa de campaña pendiente', auto: true },
    { id: 'h2', timestamp: 'hace 2h', accion: 'Verificó niveles de stock en 8 campañas activas', tipo: 'deterministico', resultado: 'Todo normal · sin alertas', auto: true },
    { id: 'h3', timestamp: 'hace 5h', accion: 'Coordinó reabastecimiento con proveedor Collar GPS', tipo: 'deterministico', resultado: 'Notificación enviada', auto: false },
    { id: 'h4', timestamp: 'ayer 14:20', accion: 'Pausa preventiva — stock Rodillo Jade < 30 un.', tipo: 'deterministico', resultado: 'Campaña Meta pausada · reactivar cuando stock > 80', auto: true },
    { id: 'h5', timestamp: 'ayer 09:00', accion: 'Scan matutino de inventarios — 12 productos', tipo: 'deterministico', resultado: 'Sin anomalías', auto: true },
  ],
  'roax-ads': [
    { id: 'h6', timestamp: 'hace 23 min', accion: 'Escaló presupuesto TikTok Collar GPS +20% (ROAS 2.3x)', tipo: 'deterministico', resultado: '+$7.000/día → estimado +5 pedidos/sem', auto: true },
    { id: 'h7', timestamp: 'hace 1h 40min', accion: 'Detectó ROAS bajo en K-Beauty (<1.5x) — análisis de audiencias', tipo: 'ia-ligera', resultado: 'Recomendación: cambiar creativos o pausar', auto: false },
    { id: 'h8', timestamp: 'hace 3h', accion: 'Optimizó horario de pauta — Difusor Aromaterapia Meta', tipo: 'deterministico', resultado: 'Concentró $15.000/día en franja 18-22h', auto: true },
    { id: 'h9', timestamp: 'ayer 21:00', accion: 'Revisión automática de presupuestos nocturnos', tipo: 'deterministico', resultado: '3 campañas ajustadas, 1 pausada por ROAS', auto: true },
    { id: 'h10', timestamp: 'ayer 16:30', accion: 'Generó informe semanal de pauta — 5 campañas', tipo: 'ia-ligera', resultado: 'Enviado a dashboard · disponible en Señales', auto: true },
  ],
  'vigilante-logistico': [
    { id: 'h11', timestamp: 'hace 45 min', accion: 'Resolvió novedad — pedido #45821 devuelto sin justificación', tipo: 'deterministico', resultado: 'Reclamo iniciado con transportadora', auto: true },
    { id: 'h12', timestamp: 'hace 2h', accion: 'Detectó patrón: 8 pedidos Medellín sin actualizar 48h', tipo: 'ia-ligera', resultado: 'Alerta crítica enviada · requería tu OK', auto: false },
    { id: 'h13', timestamp: 'hace 4h', accion: 'Reasignó 4 pedidos de Envia a Coordinadora · Cali', tipo: 'deterministico', resultado: '$42.000 ahorro en flete · tiempo -1 día', auto: true },
    { id: 'h14', timestamp: 'ayer 11:00', accion: 'Scan de pedidos con novedad activa — 23 pedidos', tipo: 'deterministico', resultado: '18 sin problema · 5 con acción pendiente', auto: true },
  ],
};

const PROYECTOS_POR_AGENTE: Record<string, Array<{ nombre: string; estado: string; id: string }>> = {
  'stock-guardian': [
    { id: 'pv-003', nombre: 'Collar GPS — Escalando', estado: 'en_escala' },
    { id: 'pv-004', nombre: 'K-Beauty — Bajo rendimiento', estado: 'en_riesgo' },
  ],
  'roax-ads': [
    { id: 'pv-003', nombre: 'Collar GPS — Escalando', estado: 'en_escala' },
    { id: 'pv-004', nombre: 'K-Beauty — Bajo rendimiento', estado: 'en_riesgo' },
    { id: 'pv-002', nombre: 'Estrategia Q3', estado: 'configurando' },
  ],
  'vigilante-logistico': [
    { id: 'pv-003', nombre: 'Collar GPS — Escalando', estado: 'en_escala' },
  ],
};

@Component({
  selector: 'app-gali6-agentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali6-agentes.component.html',
  styleUrls: ['./gali6-agentes.component.scss'],
})
export class Gali6AgentesComponent {
  readonly router = inject(Router);

  readonly paqueteBasico = PAQUETE_PRINCIPIANTES;
  readonly todosLosAgentes = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;
  readonly tierLabel = TIER_LABEL;

  readonly agentesActivos = computed(() =>
    this.agentesEstado().filter(a => a.estado === 'activo')
  );

  readonly agentesDisponibles = computed(() =>
    this.todosLosAgentes.filter(a => a.estado === 'disponible')
  );

  readonly expandedAgenteId = signal<string | null>(null);
  readonly expandedTab = signal<Record<string, AgenteDetallTab>>({});
  readonly showCrearModal = signal(false);
  readonly toastMsg = signal<string | null>(null);

  // ── G4.1: Panel chatbot crear agente ─────────────────────────────────────
  readonly panelCrear = signal(false);
  readonly chatMensajes = signal<Array<{ tipo: 'gali' | 'user'; texto: string }>>([]);
  readonly chatInput = signal('');
  readonly chatEscribiendo = signal(false);
  readonly chatPaso = signal(0);
  readonly agentePropuesto = signal<{
    nombre: string; proposito: string; tipo: string;
    skills: string[]; regla: string; autonomia: string;
  } | null>(null);
  readonly agenteCreado = signal(false);

  // ── G4.2: Forms inline regla/skill ────────────────────────────────────────
  readonly nuevaReglaOpen = signal<Record<string, boolean>>({});
  readonly nuevaReglaSi = signal<Record<string, string>>({});
  readonly nuevaReglaEntonces = signal<Record<string, string>>({});
  readonly skillsDispOpen = signal<Record<string, boolean>>({});

  getHistorial(agenteId: string): HistorialItem[] {
    return HISTORIAL_POR_AGENTE[agenteId] ?? [];
  }

  getProyectosActivos(agenteId: string): Array<{ nombre: string; estado: string; id: string }> {
    return PROYECTOS_POR_AGENTE[agenteId] ?? [];
  }

  getAgenteTab(agenteId: string): AgenteDetallTab {
    return this.expandedTab()[agenteId] ?? 'config';
  }

  setAgenteTab(agenteId: string, tab: AgenteDetallTab): void {
    this.expandedTab.update(m => ({ ...m, [agenteId]: tab }));
  }

  getHistorialTipoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico: 'tipo--deterministic',
      'ia-ligera': 'tipo--ia-ligera',
      'ia-compleja': 'tipo--ia-compleja',
    };
    return map[tipo];
  }

  getProyectoEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      en_escala: 'estado--escala', activo: 'estado--activo',
      en_riesgo: 'estado--riesgo', configurando: 'estado--config',
      pausado: 'estado--pausado',
    };
    return map[estado] ?? '';
  }

  /** Mutable copy of agentes with extra interactive state */
  readonly agentesEstado = signal(
    AGENTES_ESPECIALIZADOS.map(ag => ({
      ...ag,
      estado: ag.estado as 'activo' | 'pausado' | 'disponible',
      autonomiaPct: 60,
      skills: ag.skillsDefecto.map(sk => ({ ...sk, activa: true })),
      reglas: ag.reglasDefecto.map((r, i) => ({ ...r, id: `${ag.id}-r${i}`, activa: true })),
    }))
  );

  toggleDetalle(id: string): void {
    this.expandedAgenteId.update(cur => (cur === id ? null : id));
  }

  toggleSkill(agenteId: string, skillId: string): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId
        ? { ...ag, skills: ag.skills.map(sk => sk.id === skillId ? { ...sk, activa: !sk.activa } : sk) }
        : ag
      )
    );
  }

  setAutonomia(agenteId: string, pct: number): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId ? { ...ag, autonomiaPct: pct } : ag)
    );
  }

  onAutonomiaInput(agenteId: string, event: Event): void {
    const v = parseInt((event.target as HTMLInputElement).value, 10);
    this.setAutonomia(agenteId, v);
  }

  eliminarRegla(agenteId: string, reglaId: string): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId
        ? { ...ag, reglas: ag.reglas.filter(r => r.id !== reglaId) }
        : ag
      )
    );
  }

  desactivarAgente(agenteId: string): void {
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId ? { ...ag, estado: 'pausado' as const } : ag)
    );
    this.expandedAgenteId.set(null);
    this.showToast('Agente pausado. Puedes reactivarlo desde Marketplace.');
  }

  crearAgente(): void {
    this.panelCrear.set(true);
    this.chatPaso.set(0);
    this.agentePropuesto.set(null);
    this.agenteCreado.set(false);
    this.chatMensajes.set([
      { tipo: 'gali', texto: '¡Hola! Voy a ayudarte a crear tu agente personalizado. ¿Qué quieres que haga este agente?' },
    ]);
  }

  cerrarCrearModal(): void {
    this.panelCrear.set(false);
    this.chatMensajes.set([]);
    this.chatInput.set('');
    this.agentePropuesto.set(null);
    this.agenteCreado.set(false);
  }

  enviarMensajeCrear(): void {
    const texto = this.chatInput().trim();
    if (!texto || this.chatEscribiendo()) return;
    this.chatMensajes.update(m => [...m, { tipo: 'user', texto }]);
    this.chatInput.set('');
    this.chatEscribiendo.set(true);
    const paso = this.chatPaso();
    setTimeout(() => {
      this.chatEscribiendo.set(false);
      if (paso === 0) {
        this.chatPaso.set(1);
        this.chatMensajes.update(m => [...m, {
          tipo: 'gali',
          texto: `Perfecto. ¿Con qué frecuencia debería actuar: continuamente (monitoring), una vez al día, o solo cuando ocurra un evento específico?`,
        }]);
      } else if (paso === 1) {
        this.chatPaso.set(2);
        const propuesta = this.generarPropuestaAgente(
          this.chatMensajes()[1]?.texto ?? texto,
          this.chatMensajes()[3]?.texto ?? texto
        );
        this.agentePropuesto.set(propuesta);
        this.chatMensajes.update(m => [...m, {
          tipo: 'gali',
          texto: `Basado en lo que me dijiste, aquí está la propuesta para tu agente. Revísala abajo y dime si la creamos así.`,
        }]);
      }
    }, 1100);
  }

  private generarPropuestaAgente(proposito: string, frecuencia: string): {
    nombre: string; proposito: string; tipo: string;
    skills: string[]; regla: string; autonomia: string;
  } {
    const esContinuo = /continu|monitor|siempre|constan/i.test(frecuencia);
    return {
      nombre: 'Mi Agente ' + (proposito.split(' ').slice(0, 2).join(' ')),
      proposito,
      tipo: esContinuo ? 'Monitoreo continuo' : 'Por evento',
      skills: ['monitor-métricas', 'notificaciones-push'],
      regla: `Si se detecta la condición → notificar y esperar aprobación`,
      autonomia: 'Solo notifica (20%)',
    };
  }

  confirmarCrearAgente(): void {
    this.agenteCreado.set(true);
    this.showToast('✦ Agente creado — aparecerá en tu lista al activarlo');
    setTimeout(() => this.cerrarCrearModal(), 2000);
  }

  ajustarAgente(): void {
    this.agentePropuesto.set(null);
    this.chatPaso.set(0);
    this.chatMensajes.set([
      { tipo: 'gali', texto: '¡Claro! Cuéntame qué quieres ajustar del agente.' },
    ]);
  }

  // ── G4.2: Inline regla/skill ──────────────────────────────────────────────
  toggleNuevaRegla(agenteId: string): void {
    this.nuevaReglaOpen.update(m => ({ ...m, [agenteId]: !m[agenteId] }));
    if (!this.nuevaReglaOpen()[agenteId]) {
      this.nuevaReglaSi.update(m => ({ ...m, [agenteId]: '' }));
      this.nuevaReglaEntonces.update(m => ({ ...m, [agenteId]: '' }));
    }
  }

  setNuevaReglaSi(agenteId: string, valor: string): void {
    this.nuevaReglaSi.update(m => ({ ...m, [agenteId]: valor }));
  }

  setNuevaReglaEntonces(agenteId: string, valor: string): void {
    this.nuevaReglaEntonces.update(m => ({ ...m, [agenteId]: valor }));
  }

  agregarRegla(agenteId: string): void {
    const si = (this.nuevaReglaSi()[agenteId] ?? '').trim();
    const entonces = (this.nuevaReglaEntonces()[agenteId] ?? '').trim();
    if (!si || !entonces) return;
    this.agentesEstado.update(list =>
      list.map(ag => ag.id === agenteId
        ? { ...ag, reglas: [...ag.reglas, {
            id: `${agenteId}-r${Date.now()}`, condicion: si, accion: entonces,
            activa: true, tipo: 'deterministico' as const,
          }] }
        : ag
      )
    );
    this.nuevaReglaOpen.update(m => ({ ...m, [agenteId]: false }));
    this.nuevaReglaSi.update(m => ({ ...m, [agenteId]: '' }));
    this.nuevaReglaEntonces.update(m => ({ ...m, [agenteId]: '' }));
    this.showToast('Regla agregada');
  }

  toggleSkillsDisp(agenteId: string): void {
    this.skillsDispOpen.update(m => ({ ...m, [agenteId]: !m[agenteId] }));
  }

  irAMarketplace(): void {
    this.router.navigate(['/gali-6/marketplace']);
  }

  getProcesoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico:  'tipo--deterministic',
      'ia-ligera':     'tipo--ia-ligera',
      'ia-compleja':   'tipo--ia-compleja',
    };
    return map[tipo];
  }

  getAutonomiaLabel(pct: number): string {
    if (pct <= 20) return 'Solo notifica';
    if (pct <= 45) return 'Pide aprobación';
    if (pct <= 70) return 'Opera con límites';
    return 'Autopilot total';
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }
}

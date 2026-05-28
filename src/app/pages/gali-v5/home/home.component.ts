import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

export type SignalUrgency = 'alta' | 'media' | 'baja';
export type AgentStatus = 'activo' | 'esperando' | 'pausa';
export type ProjectStatus = 'activo' | 'en_escala' | 'pausado' | 'borrador';

export interface GaliSignal {
  id: string;
  icon: string;
  titulo: string;
  contexto: string;
  cta: string;
  urgencia: SignalUrgency;
  timestamp: string;
  agente: string;
  loopResult?: { antes: string; despues: string; label: string };
}

export interface GaliAgent {
  id: string;
  nombre: string;
  herramienta: string;
  icono: string;
  estado: AgentStatus;
  descripcion: string;
  ultimaAccion: string;
}

export interface LoopEntry {
  id: string;
  icon: string;
  agente: string;
  accion: string;
  resultado: string;
  hace: string;
  tipo: 'positivo' | 'neutro' | 'pendiente';
  cta?: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  estado: ProjectStatus;
  roas: string;
  pedidos: string;
  galiMessage: string;
  signalType: 'ok' | 'warning' | 'info';
}

export interface ObjetivoActivo {
  titulo: string;
  meta: number;
  actual: number;
  unidad: string;
  semana: string;
  galiMensaje: string;
}

@Component({
  selector: 'app-dropi-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class DropiHomeComponent {
  private auth = inject(AuthService);

  userName = signal('Alejandra');
  modoGaliActivo = signal(false);

  readonly objetivo: ObjetivoActivo = {
    titulo: '50 ventas/semana',
    meta: 50,
    actual: 38,
    unidad: 'ventas',
    semana: 'Sem 3 de 4',
    galiMensaje: 'Vas a 38. Aumenté la pauta 15% para las próximas 48h.',
  };

  readonly agentes: GaliAgent[] = [
    {
      id: 'ada-spy',
      nombre: 'ADA Spy',
      herramienta: 'Producto Research',
      icono: '🔍',
      estado: 'esperando',
      descripcion: '3 competidores entraron al nicho esta semana',
      ultimaAccion: 'Diagnóstico de saturación listo · hace 4h',
    },
    {
      id: 'roax',
      nombre: 'Roax',
      herramienta: 'Media Buyer',
      icono: '⚡',
      estado: 'activo',
      descripcion: 'ROAS 2.9x · Pauta $66k/día · Video B ganando',
      ultimaAccion: 'Escaló presupuesto +15% · hace 2h',
    },
    {
      id: 'chatea-pro',
      nombre: 'Chatea Pro',
      herramienta: 'Cierre & Logística',
      icono: '💬',
      estado: 'activo',
      descripcion: '43/47 confirmados · 3 anticipo zona rural',
      ultimaAccion: 'Resolvió 8 novedades hoy · hace 1h',
    },
  ];

  readonly signals: GaliSignal[] = [
    {
      id: 'sig-critica-1',
      icon: '⚠',
      titulo: 'Coordinadora Bogotá: 15% novedad hoy',
      contexto: 'Tasa 3× por encima del umbral. Gali recomienda reasignar 12 pedidos de hoy.',
      cta: 'Cambiar ahora',
      urgencia: 'alta',
      timestamp: 'hace 18 min',
      agente: 'Vigilante Logístico',
    },
    {
      id: 'sig-ok-1',
      icon: '✓',
      titulo: '8 novedades resueltas por Chatea Pro',
      contexto: 'Sin intervención tuya. 1 caso pendiente de tu decisión.',
      cta: 'Ver caso pendiente',
      urgencia: 'media',
      timestamp: 'hace 1h',
      agente: 'Chatea Pro',
    },
    {
      id: 'sig-sug-1',
      icon: '💡',
      titulo: 'Video B tiene mejor CTR (+50%). ¿Creo una receta?',
      contexto: 'CTR: 1.2% → 1.8% después de activarlo. Podría automatizar este switch.',
      cta: 'Crear receta',
      urgencia: 'baja',
      timestamp: 'hace 3h',
      agente: 'Roax',
    },
    {
      id: 'sig-sug-2',
      icon: '🎯',
      titulo: 'Difusor de aromaterapia: +340% ventas esta semana',
      contexto: 'Encaja con tu perfil (margen 68%). Ventana de 10-14 días antes de saturación.',
      cta: 'Ver análisis',
      urgencia: 'baja',
      timestamp: 'hace 1h',
      agente: 'ADA Spy',
    },
  ];

  readonly loopEntries: LoopEntry[] = [
    {
      id: 'lp-1',
      icon: '⚡',
      agente: 'Roax',
      accion: 'Pausé Video A (CTR -40%) → activé Video B',
      resultado: 'CTR: 1.2%→1.8% · ROAS: 2.6x→2.9x',
      hace: 'hace 2h',
      tipo: 'positivo',
      cta: 'Ver detalle',
    },
    {
      id: 'lp-2',
      icon: '🚛',
      agente: 'Vigilante',
      accion: 'Cambié 12 pedidos Coordinadora → Servientrega',
      resultado: '4 novedades ahorradas estimadas',
      hace: 'hace 4h',
      tipo: 'positivo',
      cta: 'Ver detalle',
    },
    {
      id: 'lp-3',
      icon: '✅',
      agente: 'Chatea Pro',
      accion: 'Resolvió 8 novedades · 1 requiere tu decisión',
      resultado: 'Pedido con reporte inusual de transportadora',
      hace: 'hace 6h',
      tipo: 'pendiente',
      cta: 'Decidir ahora',
    },
    {
      id: 'lp-4',
      icon: '📊',
      agente: 'ADA Spy',
      accion: 'Detectó: 3 competidores entraron al nicho',
      resultado: 'Ángulo "mamá" posiblemente saturando. Diagnóstico listo.',
      hace: 'hace 8h',
      tipo: 'neutro',
      cta: 'Ver diagnóstico',
    },
    {
      id: 'lp-5',
      icon: '⚡',
      agente: 'Roax',
      accion: 'Escalé presupuesto +15% (ROAS ≥ 2.8x por 48h)',
      resultado: '$57.500 → $66.000/día',
      hace: 'hace 10h',
      tipo: 'positivo',
      cta: 'Revertir',
    },
  ];

  readonly proyectos: Proyecto[] = [
    {
      id: 'collar-gps-2026',
      nombre: 'Collar GPS para mascotas',
      estado: 'en_escala',
      roas: '2.9x',
      pedidos: '47/sem',
      galiMessage: 'Revisar novedad en Cali',
      signalType: 'warning',
    },
    {
      id: 'skincare-kbeauty',
      nombre: 'Skincare K-Beauty',
      estado: 'activo',
      roas: '2.1x',
      pedidos: '23/sem',
      galiMessage: 'Todo normal',
      signalType: 'ok',
    },
    {
      id: 'fitness-bands',
      nombre: 'Bandas de Fitness',
      estado: 'pausado',
      roas: '—',
      pedidos: '—',
      galiMessage: 'CTR se recuperó. ¿Reanudamos?',
      signalType: 'info',
    },
  ];

  readonly kpisHoy = {
    ganancia: '$411k',
    gananciaTendencia: -4,
    pedidos: 47,
    roas: '2.9x',
    roasTendencia: 1,
    semana: 'Semana 21',
    pauta: '$66k/día',
  };

  get progresoObjetivoWidth(): string {
    return `${(this.objetivo.actual / this.objetivo.meta) * 100}%`;
  }

  toggleModoGali(): void {
    this.modoGaliActivo.update(v => !v);
  }

  getAgentStatusClass(estado: AgentStatus): string {
    return {
      activo: 'agent-status--active',
      esperando: 'agent-status--waiting',
      pausa: 'agent-status--paused',
    }[estado];
  }

  getSignalClass(urgencia: SignalUrgency): string {
    return {
      alta: 'signal--critical',
      media: 'signal--ok',
      baja: 'signal--suggestion',
    }[urgencia];
  }

  getLoopTypeClass(tipo: LoopEntry['tipo']): string {
    return {
      positivo: 'loop-chip--positive',
      neutro: 'loop-chip--neutral',
      pendiente: 'loop-chip--pending',
    }[tipo];
  }

  getProjectStatusLabel(estado: ProjectStatus): string {
    return {
      activo: 'Activo',
      en_escala: 'En escala',
      pausado: 'Pausado',
      borrador: 'Borrador',
    }[estado];
  }

  getProjectStatusClass(estado: ProjectStatus): string {
    return {
      activo: 'badge--activo',
      en_escala: 'badge--escala',
      pausado: 'badge--pausado',
      borrador: 'badge--borrador',
    }[estado];
  }

  constructor() {
    this.auth.user$.subscribe(u => {
      if (u?.name) this.userName.set(u.name.split(' ')[0]);
    });
  }
}

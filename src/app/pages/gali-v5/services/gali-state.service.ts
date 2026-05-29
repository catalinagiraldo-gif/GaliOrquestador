import { Injectable, signal } from '@angular/core';

export type GaliMode = 0 | 1 | 2;

export interface AgentStatus {
  id: string;
  name: string;
  color: string;
  status: 'activo' | 'esperando' | 'pausado';
  action: string;
}

export interface GaliSignal {
  id: string;
  type: 'critica' | 'info' | 'sugerencia';
  emoji: string;
  message: string;
  time: string;
  cta?: string;
}

export interface ChatMessage {
  id: string;
  from: 'gali' | 'user';
  text: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class GaliStateService {
  readonly galiMode = signal<GaliMode>(0);

  readonly agents = signal<AgentStatus[]>([
    {
      id: 'ada',
      name: 'ADA Spy',
      color: '#3b82f6',
      status: 'activo',
      action: 'Evaluando 3 productos · ventana 18 días',
    },
    {
      id: 'roax',
      name: 'Roax',
      color: '#ff6102',
      status: 'activo',
      action: 'ROAS 2.9x · pauta $66k/día activa',
    },
    {
      id: 'chatea',
      name: 'Chatea Pro',
      color: '#10b981',
      status: 'activo',
      action: '43 de 47 pedidos confirmados',
    },
    {
      id: 'vigilante',
      name: 'Vigilante Logístico',
      color: '#f59e0b',
      status: 'activo',
      action: 'Smart routing activo · 0 alertas',
    },
  ]);

  readonly galiSignals = signal<GaliSignal[]>([
    {
      id: 's1',
      type: 'critica',
      emoji: '⚠',
      message: 'Coordinadora Bogotá 15% novedad · 12 pedidos en riesgo',
      time: 'hace 14 min',
      cta: 'Ver opciones',
    },
    {
      id: 's2',
      type: 'sugerencia',
      emoji: '⚡',
      message: 'Video B de Collar GPS: CTR +50% · Roax aumentó pauta 15%',
      time: 'hace 2h',
      cta: 'Ver campaña',
    },
    {
      id: 's3',
      type: 'info',
      emoji: '✓',
      message: '8 novedades resueltas hoy · $480k en pérdidas evitadas',
      time: 'hace 3h',
    },
    {
      id: 's4',
      type: 'sugerencia',
      emoji: '💡',
      message: 'Proyector Portátil pausado: el CTR se recuperó. ¿Reanudamos?',
      time: 'hace 5h',
      cta: 'Reanudar',
    },
  ]);

  readonly chatHistory = signal<ChatMessage[]>([
    {
      id: 'c1',
      from: 'gali',
      text: 'Hola Valentina. Tienes 1 señal crítica activa: Coordinadora tiene 15% de novedad en Bogotá. Tengo 3 alternativas listas. ¿Las veo?',
      time: 'hace 14 min',
    },
    {
      id: 'c2',
      from: 'user',
      text: 'Sí, muéstrame las opciones',
      time: 'hace 12 min',
    },
    {
      id: 'c3',
      from: 'gali',
      text: 'Servientrega tiene 3.8% novedad en Bogotá esta semana. Envía tiene 4.1%. Coordinadora sigue en 15%. Recomiendo cambiar los 12 pedidos a Servientrega. ¿Lo hago?',
      time: 'hace 11 min',
    },
  ]);

  readonly criticalCount = signal(1);

  togglePanel(): void {
    this.galiMode.update(m => (m === 0 ? 1 : 0));
  }

  setAutopilot(on: boolean): void {
    this.galiMode.set(on ? 2 : 1);
  }

  sendMessage(text: string): void {
    const msg: ChatMessage = {
      id: `u-${Date.now()}`,
      from: 'user',
      text,
      time: 'ahora',
    };
    this.chatHistory.update(h => [...h, msg]);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `g-${Date.now()}`,
        from: 'gali',
        text: 'Entendido. Estoy procesando tu solicitud y te aviso en cuanto tenga resultados.',
        time: 'ahora',
      };
      this.chatHistory.update(h => [...h, reply]);
    }, 800);
  }
}

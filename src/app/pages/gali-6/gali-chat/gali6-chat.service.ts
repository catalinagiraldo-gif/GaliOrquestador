import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatMessage, VisualResponse, VisualAccion } from './models/gali6-chat.model';
import { Gali6ScreenContext, Gali6ScreenContextService } from '../services/gali6-screen-context.service';
import { Gali6LiveMutationsService } from '../services/gali6-live-mutations.service';
import { MOCK_CAMPANAS } from '../../../../../mocks/gali-v6/campanas.mock';
import { PROYECTOS_MOCK } from '../../../../../mocks/gali-v6/proyectos.mock';

let seq = 0;
function genId(): string {
  return `g6msg-${Date.now()}-${seq++}`;
}

function ahora(): string {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

interface CampanaResumen {
  id: string;
  nombre: string;
  canal: string;
  estado: string;
}

/** Misma prioridad de fuente que Gali6ProyectosCasaComponent.getCampanas(): MOCK_CAMPANAS primero, fallback a PROYECTOS_MOCK. */
function campanasDeProyecto(proyectoId: string): CampanaResumen[] {
  const deMock = MOCK_CAMPANAS.filter(c => c.proyectoId === proyectoId);
  if (deMock.length > 0) {
    return deMock.map(c => ({ id: c.id, nombre: c.nombre, canal: c.canal, estado: c.estado }));
  }
  const pv = PROYECTOS_MOCK.find(p => p.id === proyectoId);
  return (pv?.campanas ?? []).map(c => ({ id: c.id, nombre: c.nombre, canal: c.canal, estado: c.estado }));
}

// Dos esquemas de canal conviven en los mocks: 'tiktok-ads' (MOCK_CAMPANAS) vs
// 'tiktok' (fallback embebido en PROYECTOS_MOCK). startsWith() cubre ambos sin
// necesitar saber de qué fuente vino la campaña (ver campanasDeProyecto()).
function canalDelTexto(t: string): string | null {
  if (/tiktok/.test(t)) return 'tiktok';
  if (/meta|facebook/.test(t)) return 'meta';
  if (/google/.test(t)) return 'google';
  if (/whatsapp/.test(t)) return 'whatsapp';
  return null;
}

/**
 * Motor de respuestas. Reglas contextuales (dependientes de ctx.viewId/entity)
 * se evalúan antes que el fallback genérico por keyword — así "pausa la
 * campaña de TikTok" se resuelve sin que el usuario tenga que buscarla, si el
 * contexto de pantalla ya sabe qué proyecto tiene abierto. Catálogo cerrado y
 * ordenado por prioridad, apropiado para un prototipo sin LLM real.
 * Ver §2.4 y §4.4 de /Users/user/.claude/plans/usando-skill-de-ui-swift-wolf.md
 */
function generateResponse(texto: string, ctx: Gali6ScreenContext | null): { texto: string; visual?: VisualResponse } {
  const t = texto.toLowerCase();
  const esIntencionDeAccion = /pausa|reasigna|ejecuta|activa|confirma|resuelve/.test(t);

  if (esIntencionDeAccion) {
    if (ctx?.viewId === 'proyectos-casa') {
      if (ctx.entity?.kind !== 'proyecto') {
        return { texto: 'Estás en Proyectos, pero no tienes ninguno abierto. Expande uno para que pueda actuar directo sobre su campaña.' };
      }

      const proyectoId = ctx.entity.id;
      const proyectoLabel = ctx.entity.label;
      const activas = campanasDeProyecto(proyectoId).filter(c => c.estado === 'activa');

      if (activas.length === 0) {
        return { texto: `"${proyectoLabel}" no tiene campañas activas para pausar ahora mismo.` };
      }

      const canal = canalDelTexto(t);
      const candidatas = canal ? activas.filter(c => c.canal.startsWith(canal)) : activas;

      if (candidatas.length === 1) {
        const c = candidatas[0];
        return {
          texto: `¿Confirmas que pauso "${c.nombre}"?`,
          visual: {
            kind: 'acciones',
            acciones: [
              { label: `Pausar "${c.nombre}"`, actionId: `pausar-campana::${proyectoId}::${c.id}`, isPrimary: true },
              { label: 'Cancelar', actionId: 'cancelar' },
            ],
          },
        };
      }

      const acciones: VisualAccion[] = [
        ...candidatas.map(c => ({ label: c.nombre, actionId: `pausar-campana::${proyectoId}::${c.id}` })),
        { label: 'Cancelar', actionId: 'cancelar' },
      ];
      return {
        texto: `"${proyectoLabel}" tiene varias campañas activas. ¿Cuál pauso?`,
        visual: { kind: 'acciones', acciones },
      };
    }

    if (ctx?.viewId === 'senales' && ctx.entity?.kind === 'alerta') {
      return {
        texto: `¿Marco como resuelta la alerta "${ctx.entity.label}"?`,
        visual: {
          kind: 'acciones',
          acciones: [
            { label: 'Sí, resolver', actionId: `resolver-alerta-${ctx.entity.id}`, isPrimary: true },
            { label: 'Cancelar', actionId: 'cancelar' },
          ],
        },
      };
    }

    if (ctx?.viewId === 'mi-contexto') {
      // Decisión de producto: el chat NO edita el objetivo directo, deriva al wizard propio de la página (ver §3.5 del plan).
      return {
        texto: 'La edición de objetivos vive en su propio flujo para no duplicarlo. Te lo abro:',
        visual: {
          kind: 'acciones',
          acciones: [{ label: 'Abrir editor de objetivo', actionId: 'abrir-editor-objetivo', isPrimary: true }],
        },
      };
    }

    // Sin contexto de pantalla utilizable: no hay suficiente información para ejecutar nada.
    return {
      texto: 'No tengo claro sobre qué actuar desde aquí. Ve a Proyectos o Señales y dime de nuevo qué quieres que haga.',
    };
  }

  if (/roas/.test(t)) {
    return {
      texto: 'Así viene tu ROAS en las últimas 4 semanas:',
      visual: {
        kind: 'comparativa',
        comparativa: [
          { label: 'Sem 18', valuePct: 58 },
          { label: 'Sem 19', valuePct: 66 },
          { label: 'Sem 20', valuePct: 74 },
          { label: 'Sem 21', valuePct: 83, highlight: true },
        ],
      },
    };
  }

  if (/pedidos/.test(t)) {
    return {
      texto: 'Resumen de pedidos de esta semana:',
      visual: {
        kind: 'metric',
        metric: { label: 'Pedidos esta semana', value: '47', delta: '+12% vs. semana pasada', trend: 'up' },
      },
    };
  }

  if (/campañ|campan/.test(t)) {
    return {
      texto: 'Estas son tus campañas activas:',
      visual: {
        kind: 'tabla',
        tabla: {
          columns: ['Proyecto', 'Canal', 'Estado', 'ROAS'],
          rows: [
            ['Collar GPS', 'TikTok', 'Activa', '2.9x'],
            ['Skincare K-Beauty', 'Meta', 'Activa', '2.1x'],
            ['Proyector Portátil', 'Meta', 'Pausada', '1.4x'],
          ],
        },
      },
    };
  }

  return {
    texto: 'Todavía estoy aprendiendo a responder esto. Prueba preguntando por "roas", "pedidos" o "campañas activas".',
  };
}

/**
 * Estado del panel de chat propio de Gali 6 (fork aislado de GaliStateService/gali-5).
 * Ver /Users/user/.claude/plans/usando-skill-de-ui-swift-wolf.md para el plan completo.
 */
@Injectable({ providedIn: 'root' })
export class Gali6ChatService {
  private readonly router = inject(Router);
  private readonly mutations = inject(Gali6LiveMutationsService);
  readonly screenCtx = inject(Gali6ScreenContextService);

  readonly messages = signal<ChatMessage[]>([
    {
      id: genId(),
      rol: 'gali',
      texto: 'Hola, soy Gali. Puedo ver lo que tienes en pantalla y ayudarte a actuar sobre ello. ¿Qué necesitas?',
      timestamp: ahora(),
    },
  ]);

  readonly isTyping = signal(false);

  /** Banner de contexto mostrado en el header del panel — screen-awareness visible. */
  readonly screenAwareBanner = computed(() => {
    const c = this.screenCtx.context();
    if (!c) return null;
    if (c.entity) return `Viendo: ${c.viewLabel} — ${c.entity.label}`;
    if (c.summary) return `Viendo: ${c.viewLabel} — ${c.summary}`;
    return `Viendo: ${c.viewLabel}`;
  });

  constructor() {
    // Invalidación automática del contexto al salir de la ruta que lo publicó —
    // así las páginas nunca tienen que acordarse de limpiar (ver §2.3 del plan).
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const path = e.urlAfterRedirects.split('?')[0];
        const ctx = this.screenCtx.context();
        if (ctx && !path.startsWith(ctx.route)) {
          this.screenCtx.clear();
        }
      });
  }

  sendMessage(texto: string): void {
    const trimmed = texto.trim();
    if (!trimmed) return;

    this.messages.update(msgs => [...msgs, { id: genId(), rol: 'usuario', texto: trimmed, timestamp: ahora() }]);
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);
      const respuesta = generateResponse(trimmed, this.screenCtx.context());
      this.messages.update(msgs => [
        ...msgs,
        { id: genId(), rol: 'gali', texto: respuesta.texto, timestamp: ahora(), visual: respuesta.visual },
      ]);
    }, 700);
  }

  /**
   * Maneja el click en una card de acciones. Devuelve un payload dirigido
   * cuando la acción mutó algo visible en pantalla, para que el panel emita
   * galiActing y el shell dispare el highlight puntual (ver §3.2 del plan).
   */
  handleAction(actionId: string): { targetId: string; kind: 'mutate' } | null {
    if (actionId === 'cancelar') {
      this.messages.update(msgs => [...msgs, { id: genId(), rol: 'gali', texto: 'Listo, no hice ningún cambio.', timestamp: ahora() }]);
      return null;
    }

    if (actionId === 'abrir-editor-objetivo') {
      this.router.navigate(['/gali-6/mi-negocio/objetivo']);
      return null;
    }

    if (actionId.startsWith('pausar-campana::')) {
      const [, proyectoId, campanaId] = actionId.split('::');
      const ok = this.mutations.pausarCampana(proyectoId, campanaId);
      this.messages.update(msgs => [
        ...msgs,
        {
          id: genId(),
          rol: 'gali',
          texto: ok
            ? 'Listo, pausé la campaña. Gali deja de optimizarla hasta que la reactives.'
            : 'No encontré esa campaña para pausarla.',
          timestamp: ahora(),
        },
      ]);
      return ok ? { targetId: campanaId, kind: 'mutate' } : null;
    }

    if (actionId.startsWith('resolver-alerta-')) {
      const alertaId = actionId.replace('resolver-alerta-', '');
      const ok = this.mutations.resolverAlerta(alertaId);
      this.messages.update(msgs => [
        ...msgs,
        {
          id: genId(),
          rol: 'gali',
          texto: ok ? 'Listo, marqué la alerta como resuelta.' : 'No encontré esa alerta para resolverla.',
          timestamp: ahora(),
        },
      ]);
      return ok ? { targetId: alertaId, kind: 'mutate' } : null;
    }

    this.messages.update(msgs => [
      ...msgs,
      { id: genId(), rol: 'gali', texto: `Anotado (${actionId}). En una fase siguiente esta acción va a modificar la pantalla en vivo.`, timestamp: ahora() },
    ]);
    return null;
  }
}

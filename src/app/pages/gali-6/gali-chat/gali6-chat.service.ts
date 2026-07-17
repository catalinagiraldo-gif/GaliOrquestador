import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatMessage, VisualResponse, VisualAccion } from './models/gali6-chat.model';
import { Gali6ScreenContext, Gali6ScreenContextService } from '../services/gali6-screen-context.service';
import { Gali6LiveMutationsService } from '../services/gali6-live-mutations.service';
import { GaliStateService } from '../../gali-5/gali-v5/services/gali-state.service';
import { MOCK_CAMPANAS } from '../../../../../mocks/gali-v6/campanas.mock';
import { PROYECTOS_MOCK } from '../../../../../mocks/gali-v6/proyectos.mock';
import addressesData from '../../../../../mocks/gali-v5/validador-addresses.json';

/** Mismo dato mock que la tarjeta Siigo en gali6-conexiones-casa.component.ts:38 — citado literal, no reinventado. */
const SIIGO_ALERTA = '$450k sin facturar · 6 días sin sync · riesgo tributario.';

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
  const esIntencionDeAccion = /pausa|reasigna|ejecuta|activa|confirma|resuelve|corrig/.test(t);

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

    if (ctx?.viewId === 'validador-direcciones') {
      const pendiente = addressesData.addresses.find(a => !a.validated);
      if (!pendiente) {
        return { texto: 'No veo direcciones pendientes de corregir — todas están validadas.' };
      }
      return {
        texto: `¿Confirmas que corrijo la dirección de "${pendiente.alias}" (${pendiente.city})?`,
        visual: {
          kind: 'acciones',
          acciones: [
            { label: `Corregir "${pendiente.alias}"`, actionId: `corregir-direccion::${pendiente.id}`, isPrimary: true },
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

  // Flujo D (18.FlujoUsuarioGali6.md §1.5) — pantalla stub: "recuperación explicada".
  // A diferencia de las reglas de arriba, esta dispara para CUALQUIER pregunta en esta
  // vista (no solo una palabra clave) — el punto es que Gali admite que no tiene
  // contexto profundo aquí, en vez de fingir una respuesta que no puede sostener.
  if (ctx?.viewId === 'integraciones-config') {
    return {
      texto: 'Estás en una vista simplificada de Configuraciones — todavía no tengo mucho contexto aquí. ' +
        'Lo que sí puedo hacer es llevarte a Conexiones, donde WhatsApp Business aparece como urgente.',
      visual: {
        kind: 'acciones',
        acciones: [{ label: 'Ir a Conexiones', actionId: 'ir-a-conexiones', isPrimary: true }],
      },
    };
  }

  // Flujo B (18.FlujoUsuarioGali6.md §1.3) — sección analítica: Gali no interrumpe
  // solo, pero si preguntan por facturación cruza el contexto con la conexión Siigo.
  if (ctx?.viewId === 'facturas-pendientes' && /factur/.test(t)) {
    return {
      texto: `Tu conexión con Siigo lleva 6 días sin sincronizar, por eso estas facturas no cuadran: ${SIIGO_ALERTA}`,
      visual: {
        kind: 'acciones',
        acciones: [{ label: 'Ir a reconectar Siigo', actionId: 'ir-a-conexiones', isPrimary: true }],
      },
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
  private readonly galiState = inject(GaliStateService);
  readonly screenCtx = inject(Gali6ScreenContextService);

  readonly messages = signal<ChatMessage[]>([
    {
      id: genId(),
      rol: 'gali',
      texto: 'Hola, soy Gali. Puedo ver lo que tienes en pantalla y ayudarte a actuar sobre ello. ¿Qué necesitas?',
      timestamp: ahora(),
      visual: {
        kind: 'acciones',
        acciones: [{ label: 'Buscar productos →', actionId: 'ir-a-catalogo' }],
      },
    },
  ]);

  readonly isTyping = signal(false);

  /** IDs de alertas proactivas ya mostradas esta sesión — evita repetir el mismo aviso en cada visita a la pantalla. */
  private readonly proactiveShown = new Set<string>();

  /**
   * Empuja un mensaje de Gali sin que el usuario haya preguntado nada — el
   * comportamiento "vigilante permanente" que la tabla de intervención por
   * sección (Gali6.md §Modelo de intervención) exige para secciones
   * operativas/transaccionales (18.FlujoUsuarioGali6.md §1.2, Flujo A).
   * Deduplicado por `id` para no repetir el mismo aviso en cada visita.
   */
  pushProactiveAlert(id: string, texto: string, visual?: VisualResponse): void {
    if (this.proactiveShown.has(id)) return;
    this.proactiveShown.add(id);
    this.messages.update(msgs => [...msgs, { id: genId(), rol: 'gali', texto, timestamp: ahora(), visual }]);
  }

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

    if (actionId === 'ir-a-conexiones') {
      this.router.navigate(['/gali-6/conexiones']);
      return null;
    }

    if (actionId === 'ir-a-catalogo') {
      this.router.navigate(['/gali-6/productos/catalogo']);
      return null;
    }

    if (actionId === 'ver-oportunidad-catalogo') {
      this.router.navigate(['/gali-6/productos/catalogo']);
      this.galiState.openCatalogPanel();
      return null;
    }

    if (actionId.startsWith('pausar-recoleccion::')) {
      const [, productoId] = actionId.split('::');
      const ok = this.mutations.pausarRecoleccion(productoId);
      this.messages.update(msgs => [
        ...msgs,
        {
          id: genId(),
          rol: 'gali',
          texto: ok
            ? 'Listo, pausé la recolección mientras repones stock. Te aviso cuando vuelva a estar disponible.'
            : 'No encontré esa recolección para pausarla.',
          timestamp: ahora(),
        },
      ]);
      if (ok) {
        // Flujo A paso 8 (18.FlujoUsuarioGali6.md §1.2) — cierre del Loop de Acción
        // Cerrada: siguiente paso propuesto después del resultado visible.
        this.messages.update(msgs => [
          ...msgs,
          {
            id: genId(),
            rol: 'gali',
            texto: '¿Quieres que te avise 5 días antes la próxima vez?',
            timestamp: ahora(),
            visual: {
              kind: 'acciones',
              acciones: [
                { label: 'Crear regla', actionId: `crear-regla-aviso-stock::${productoId}`, isPrimary: true },
                { label: 'No gracias', actionId: 'cancelar' },
              ],
            },
          },
        ]);
      }
      return ok ? { targetId: productoId, kind: 'mutate' } : null;
    }

    if (actionId.startsWith('crear-regla-aviso-stock::')) {
      const [, productoId] = actionId.split('::');
      localStorage.setItem(`gali-6-regla-aviso-stock::${productoId}`, 'true');
      this.messages.update(msgs => [
        ...msgs,
        {
          id: genId(),
          rol: 'gali',
          texto: 'Listo, creé la regla — la próxima vez que este producto baje de umbral, te aviso 5 días antes.',
          timestamp: ahora(),
        },
      ]);
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

    if (actionId.startsWith('corregir-direccion::')) {
      const [, addressId] = actionId.split('::');
      const ok = this.mutations.corregirDireccion(addressId);
      this.messages.update(msgs => [
        ...msgs,
        {
          id: genId(),
          rol: 'gali',
          texto: ok
            ? 'Listo, marqué la dirección como validada.'
            : 'No encontré esa dirección para corregirla.',
          timestamp: ahora(),
        },
      ]);
      return ok ? { targetId: addressId, kind: 'mutate' } : null;
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

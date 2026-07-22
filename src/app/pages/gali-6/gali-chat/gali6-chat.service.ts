import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatMessage, VisualResponse, VisualAccion } from './models/gali6-chat.model';
import { Gali6ScreenContext, Gali6ScreenContextService } from '../services/gali6-screen-context.service';
import { Gali6LiveMutationsService } from '../services/gali6-live-mutations.service';
import { Gali6CreationRegistryService } from '../services/gali6-creation-registry.service';
import { Gali6ScreenArtifactsService } from '../services/gali6-screen-artifacts.service';
import { Gali6CreationTipo, Gali6CreationModo, PropuestaAgente, PropuestaRegla, PropuestaSkill } from './models/gali6-creation.model';
import { GaliStateService } from '../../gali-5/gali-v5/services/gali-state.service';
import { MOCK_CAMPANAS } from '../../../../../mocks/gali-v6/campanas.mock';
import { PROYECTOS_MOCK } from '../../../../../mocks/gali-v6/proyectos.mock';
import { AGENTES_ESPECIALIZADOS } from '../../../../../mocks/gali-v6/agentes-especializados';
import { gali6ScreenCatalog, gali6ScreenLabel } from '../models/gali6-screen-catalog';
import addressesData from '../../../../../mocks/gali-v5/validador-addresses.json';

/** Mismo dato mock que la tarjeta Siigo en gali6-conexiones-casa.component.ts:38 — citado literal, no reinventado. */
const SIIGO_ALERTA = '$450k sin facturar · 6 días sin sync · riesgo tributario.';

/**
 * Detección de intención para el Flujo K — deliberadamente gruesa (regex, no NLU):
 * solo decide QUÉ flujo abrir, nunca interpreta el contenido (eso lo hace la
 * conversación guiada paso a paso). Se excluye el patrón "cambia/mueve el agente de
 * X a Y" (Flujo I) para no competir con esa regla ya existente en generateResponse().
 */
function detectarIntencionCreacion(t: string): { tipo: Gali6CreationTipo; modo: Gali6CreationModo; agenteNombre?: string } | null {
  const crearMatch = t.match(/(?:^|\s)(?:crea|crear|nuevo|nueva|agrega|agregar)\s+(?:un[ae]?\s+)?(agente|regla|skill)\b/i);
  if (crearMatch) {
    return { tipo: crearMatch[1].toLowerCase() as Gali6CreationTipo, modo: 'crear' };
  }

  const esFormaDeMover = /agente\s+de\s+.+\s+a\s+.+/i.test(t);
  if (!esFormaDeMover) {
    const editarMatch = t.match(/(?:edita|editar|modifica|modificar|ajusta|ajustar|cambia|cambiar)\s+(?:el\s+)?agente\s+(.+)/i);
    if (editarMatch) {
      return { tipo: 'agente', modo: 'editar', agenteNombre: editarMatch[1].trim() };
    }
  }
  return null;
}

/**
 * Estado del Flujo K (18.FlujoUsuarioGali6.md §5.8) — creación/edición conversacional
 * compartida, en curso dentro del hilo principal del chat. `campo1`/`campo2` guardan
 * las respuestas capturadas en lenguaje natural (sin NLU real, ver estrategia de
 * retroalimentación del plan); `diffCampo`/`diffValor` solo se usan en modo 'editar'.
 */
interface Gali6CreationFlowState {
  tipo: Gali6CreationTipo;
  modo: Gali6CreationModo;
  paso: number;
  agenteId?: string;
  campo1?: string;
  campo2?: string;
  diffCampo?: 'autonomiaPct' | 'apareceEn';
  diffValor?: string;
  diffLabel?: string;
}

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

  // Flujo I extendido (18.FlujoUsuarioGali6.md §5.2) — "cambia/mueve el agente de X a Y".
  // Se evalúa antes que esIntencionDeAccion porque no depende del ctx de una pantalla
  // específica: el usuario puede pedirlo desde cualquier lugar del chat.
  const moverMatch = t.match(/(?:cambia|mueve|reasigna)\s+(?:el\s+)?agente\s+de\s+(.+?)\s+a\s+(.+)/);
  if (moverMatch) {
    const [, origenTxt, destinoTxt] = moverMatch;
    const catalogo = gali6ScreenCatalog();
    const origen = catalogo.find(s => s.label.toLowerCase().includes(origenTxt.trim()));
    const destino = catalogo.find(s => s.label.toLowerCase().includes(destinoTxt.trim()));
    if (!origen || !destino) {
      return {
        texto: 'No reconozco esa pantalla. Escribe el nombre tal como aparece en el menú, por ejemplo: ' +
          '"cambia el agente de Garantías recolecciones a Validador de direcciones".',
      };
    }
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.apareceEn?.includes(origen.id));
    if (!agente) {
      return { texto: `No tengo ningún agente activo en "${origen.label}" ahora mismo.` };
    }
    return {
      texto: `¿Confirmas que muevo a ${agente.nombre} de "${origen.label}" a "${destino.label}"?`,
      visual: {
        kind: 'acciones',
        acciones: [
          { label: `Mover a "${destino.label}"`, actionId: `mover-agente::${agente.id}::${destino.id}`, isPrimary: true },
          { label: 'Cancelar', actionId: 'cancelar' },
        ],
      },
    };
  }

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
        acciones: [{ label: 'Fijar en pantalla', actionId: 'fijar-artefacto', requiereDestino: true }],
      },
    };
  }

  if (/pedidos/.test(t)) {
    return {
      texto: 'Resumen de pedidos de esta semana:',
      visual: {
        kind: 'metric',
        metric: { label: 'Pedidos esta semana', value: '47', delta: '+12% vs. semana pasada', trend: 'up' },
        acciones: [{ label: 'Fijar en pantalla', actionId: 'fijar-artefacto', requiereDestino: true }],
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
        acciones: [{ label: 'Fijar en pantalla', actionId: 'fijar-artefacto', requiereDestino: true }],
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
  private readonly creationRegistry = inject(Gali6CreationRegistryService);
  private readonly artifacts = inject(Gali6ScreenArtifactsService);
  private readonly galiState = inject(GaliStateService);

  /** Último visual metric/comparativa/tabla mostrado — lo que "Fijar en pantalla" termina guardando. */
  private lastVisual: { titulo: string; visual: VisualResponse } | null = null;
  readonly screenCtx = inject(Gali6ScreenContextService);

  /** Flujo K en curso, si lo hay — mientras no sea null, sendMessage() enruta el texto aquí en vez de a generateResponse(). */
  readonly creationFlow = signal<Gali6CreationFlowState | null>(null);

  /** Contador que Gali6ShellComponent y Gali6ChatPanelComponent observan para abrir el dock y enfocar el tab "chat" desde cualquier página (botón "+ Crear con Gali" / "Editar con Gali"). */
  readonly focusRequest = signal(0);
  requestFocusChat(): void {
    this.focusRequest.update(v => v + 1);
  }

  /** Texto que el panel debe precargar en el input sin enviarlo (spot "Nuevo en Gali") — el panel lo
   * consume vía effect() y lo limpia, mismo patrón de "pedido de una sola vez" que focusRequest. */
  readonly pendingDraft = signal<string | null>(null);
  precargarEjemplo(texto: string): void {
    this.pendingDraft.set(texto);
  }

  readonly messages = signal<ChatMessage[]>([
    {
      id: genId(),
      rol: 'gali',
      texto: 'Hola, soy Gali. Puedo ver lo que tienes en pantalla y ayudarte a actuar sobre ello. ¿Qué necesitas?',
      timestamp: ahora(),
      visual: {
        kind: 'acciones',
        acciones: [
          { label: 'Buscar productos →', actionId: 'ir-a-catalogo' },
          { label: '✦ Crea algo hablando →', actionId: 'demo-crear-agente' },
        ],
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
      if (this.creationFlow()) {
        this.continuarFlujoCreacion(trimmed);
        return;
      }

      const intent = detectarIntencionCreacion(trimmed);
      if (intent) {
        if (intent.tipo === 'agente' && intent.modo === 'editar') {
          const candidatos = [...AGENTES_ESPECIALIZADOS, ...this.creationRegistry.agentesCreados()];
          const nombreBuscado = (intent.agenteNombre ?? '').toLowerCase();
          const agente = candidatos.find(a =>
            nombreBuscado.includes(a.nombre.toLowerCase()) || a.nombre.toLowerCase().includes(nombreBuscado)
          );
          if (!agente) {
            this.decirGali(`No encontré ningún agente que coincida con "${intent.agenteNombre}". Prueba con el nombre completo, ej: "Stock Guardian".`);
            return;
          }
          this.iniciarFlujoCreacion('agente', 'editar', agente.id);
          return;
        }
        this.iniciarFlujoCreacion(intent.tipo, intent.modo);
        return;
      }

      const respuesta = generateResponse(trimmed, this.screenCtx.context());
      if (respuesta.visual && respuesta.visual.kind !== 'acciones') {
        this.lastVisual = { titulo: respuesta.texto, visual: respuesta.visual };
      }
      this.messages.update(msgs => [
        ...msgs,
        { id: genId(), rol: 'gali', texto: respuesta.texto, timestamp: ahora(), visual: respuesta.visual },
      ]);
    }, 700);
  }

  /** Usado por gali6-agent-presence-bar — nunca muta directo, solo dispara la misma propuesta preview-then-confirm que el texto libre (Fase 1). */
  proponerMoverAgente(agenteId: string, screenIdDestino: string): void {
    const agente = [...AGENTES_ESPECIALIZADOS, ...this.creationRegistry.agentesCreados()].find(a => a.id === agenteId);
    if (!agente) return;
    const label = gali6ScreenLabel(screenIdDestino);
    this.decirGali(
      `¿Confirmas que muevo a ${agente.nombre} a "${label}"?`,
      {
        kind: 'acciones',
        acciones: [
          { label: `Mover a "${label}"`, actionId: `mover-agente::${agenteId}::${screenIdDestino}`, isPrimary: true },
          { label: 'Cancelar', actionId: 'cancelar' },
        ],
      },
    );
  }

  private decirGali(texto: string, visual?: VisualResponse): void {
    this.messages.update(msgs => [...msgs, { id: genId(), rol: 'gali', texto, timestamp: ahora(), visual }]);
  }

  /**
   * Punto de entrada único del Flujo K — invocado por la detección de intención en
   * texto libre (sendMessage/generateResponse) y por los botones "+ Crear con Gali" /
   * "Editar con Gali" de las páginas de Agentes/Reglas/Skills (Fase 4). La conversación
   * guiada ocurre como mensajes normales en este mismo hilo, nunca en un panel aparte.
   */
  iniciarFlujoCreacion(tipo: Gali6CreationTipo, modo: Gali6CreationModo, agenteId?: string): void {
    if (modo === 'editar' && (tipo !== 'agente' || !agenteId)) {
      this.decirGali('Por ahora solo puedo editar agentes desde el chat — crear reglas o skills nuevas sí, editarlas todavía no.');
      return;
    }

    this.creationFlow.set({ tipo, modo, paso: 0, agenteId });

    if (modo === 'crear') {
      const preguntas: Record<Gali6CreationTipo, string> = {
        agente: '¡Vamos a crear tu agente! ¿Qué quieres que haga?',
        regla: 'Vamos a crear una regla. ¿Cuál es la condición? Por ejemplo: "el ROAS cae bajo 1.5x".',
        skill: '¿Cómo se llama esta skill?',
      };
      this.decirGali(preguntas[tipo]);
      return;
    }

    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) {
      this.decirGali('No encontré ese agente para editarlo.');
      this.creationFlow.set(null);
      return;
    }
    const seccion = agente.apareceEn?.length ? gali6ScreenLabel(agente.apareceEn[0]) : 'ninguna sección todavía';
    this.decirGali(
      `Estos son los datos de ${agente.nombre} hoy: autonomía ${agente.autonomiaPct ?? 60}%, aparece en ${seccion}. ` +
      '¿Qué quieres cambiar? Puedo ajustar la autonomía (ej: "sube la autonomía a 80%") o la sección donde aparece ' +
      '(ej: "muévelo a Validador de direcciones").'
    );
  }

  private continuarFlujoCreacion(texto: string): void {
    const state = this.creationFlow();
    if (!state) return;

    if (state.paso >= 2) {
      if (/cancelar/i.test(texto)) {
        this.creationFlow.set(null);
        this.decirGali('Listo, no hice ningún cambio.');
        return;
      }
      this.decirGali('Usa los botones de arriba para confirmar o ajustar — o escribe "cancelar" si prefieres dejarlo así.');
      return;
    }

    if (state.modo === 'editar') {
      this.continuarEditarAgente(state, texto);
      return;
    }

    if (state.tipo === 'agente') this.continuarCrearAgente(state, texto);
    else if (state.tipo === 'regla') this.continuarCrearRegla(state, texto);
    else this.continuarCrearSkill(state, texto);
  }

  private accionesConfirmarCrear(actionId: string): VisualAccion[] {
    return [
      { label: 'Crear así', actionId, isPrimary: true },
      { label: 'Ajustar', actionId: 'ajustar-creacion' },
      { label: 'Cancelar', actionId: 'cancelar' },
    ];
  }

  private continuarCrearAgente(state: Gali6CreationFlowState, texto: string): void {
    if (state.paso === 0) {
      this.creationFlow.set({ ...state, paso: 1, campo1: texto });
      this.decirGali(
        `Entendido: quieres que revise "${texto}". ¿Con qué frecuencia debería actuar: continuamente, ` +
        'una vez al día, o solo cuando ocurra un evento específico?'
      );
      return;
    }
    if (!/continu|monitor|siempre|constan|diari|semanal|evento|cada/i.test(texto)) {
      this.decirGali('No reconozco esa frecuencia. Prueba con algo como "continuamente", "una vez al día" o "cuando pase X".');
      return;
    }
    const nombre = `Mi Agente ${(state.campo1 ?? '').split(' ').slice(0, 2).join(' ')}`;
    this.creationFlow.set({ ...state, paso: 2, campo2: texto });
    this.decirGali(
      `Entendido: actuará ${texto}. Esta es la propuesta: "${nombre}" — ${state.campo1}, autonomía inicial 20% (solo notifica). ¿La creamos así?`,
      { kind: 'acciones', acciones: this.accionesConfirmarCrear('confirmar-creacion::agente') },
    );
  }

  private continuarCrearRegla(state: Gali6CreationFlowState, texto: string): void {
    if (state.paso === 0) {
      if (texto.trim().length < 4) {
        this.decirGali('Cuéntame la condición con un poco más de detalle. Ej: "el stock baja de 10 unidades".');
        return;
      }
      this.creationFlow.set({ ...state, paso: 1, campo1: texto });
      this.decirGali(`Entendido: "${texto}". ¿Qué debe hacer Gali cuando pase eso? Ej: "notificarme y pausar la campaña".`);
      return;
    }
    if (texto.trim().length < 4) {
      this.decirGali('Cuéntame la acción con un poco más de detalle. Ej: "notificarme" o "pausar la campaña".');
      return;
    }
    this.creationFlow.set({ ...state, paso: 2, campo2: texto });
    this.decirGali(
      `Esta es la regla: Si ${state.campo1} → ${texto}. ¿La creamos así?`,
      { kind: 'acciones', acciones: this.accionesConfirmarCrear('confirmar-creacion::regla') },
    );
  }

  private continuarCrearSkill(state: Gali6CreationFlowState, texto: string): void {
    if (state.paso === 0) {
      if (texto.trim().length < 3) {
        this.decirGali('Necesito un nombre un poco más descriptivo para la skill.');
        return;
      }
      this.creationFlow.set({ ...state, paso: 1, campo1: texto });
      this.decirGali(`"${texto}" — descríbela en una frase: ¿qué hace exactamente?`);
      return;
    }
    if (texto.trim().length < 6) {
      this.decirGali('Cuéntame un poco más qué hace esta skill exactamente.');
      return;
    }
    this.creationFlow.set({ ...state, paso: 2, campo2: texto });
    this.decirGali(
      `Esta es la skill: "${state.campo1}" — ${texto}. ¿La creamos así?`,
      { kind: 'acciones', acciones: this.accionesConfirmarCrear('confirmar-creacion::skill') },
    );
  }

  private continuarEditarAgente(state: Gali6CreationFlowState, texto: string): void {
    const t = texto.toLowerCase();
    const agenteId = state.agenteId!;
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) {
      this.decirGali('Ya no encuentro ese agente.');
      this.creationFlow.set(null);
      return;
    }

    const pctMatch = t.match(/autonom[ií]a.*?(\d{1,3})/);
    if (pctMatch) {
      const pct = Math.min(100, Math.max(0, parseInt(pctMatch[1], 10)));
      this.creationFlow.set({ ...state, paso: 2, diffCampo: 'autonomiaPct', diffValor: String(pct) });
      this.decirGali(
        `¿Confirmas que cambio la autonomía de ${agente.nombre} de ${agente.autonomiaPct ?? 60}% a ${pct}%?`,
        {
          kind: 'acciones',
          acciones: [
            { label: 'Aplicar cambio', actionId: `confirmar-edicion-agente::${agenteId}::autonomiaPct::${pct}`, isPrimary: true },
            { label: 'Cancelar', actionId: 'cancelar' },
          ],
        },
      );
      return;
    }

    const destino = gali6ScreenCatalog().find(s => t.includes(s.label.toLowerCase()));
    if (destino) {
      this.creationFlow.set({ ...state, paso: 2, diffCampo: 'apareceEn', diffValor: destino.id, diffLabel: destino.label });
      this.decirGali(
        `¿Confirmas que muevo a ${agente.nombre} a "${destino.label}"?`,
        {
          kind: 'acciones',
          acciones: [
            { label: 'Aplicar cambio', actionId: `confirmar-edicion-agente::${agenteId}::apareceEn::${destino.id}`, isPrimary: true },
            { label: 'Cancelar', actionId: 'cancelar' },
          ],
        },
      );
      return;
    }

    this.decirGali(
      'No reconozco ese cambio todavía. Puedo ajustar la autonomía (ej: "sube la autonomía a 80%") o la sección ' +
      'donde aparece (ej: "muévelo a Validador de direcciones").'
    );
  }

  /**
   * Maneja el click en una card de acciones. Devuelve un payload dirigido
   * cuando la acción mutó algo visible en pantalla, para que el panel emita
   * galiActing y el shell dispare el highlight puntual (ver §3.2 del plan).
   */
  handleAction(actionId: string): { targetId: string; kind: 'mutate' } | null {
    if (actionId === 'cancelar') {
      this.creationFlow.set(null);
      this.messages.update(msgs => [...msgs, { id: genId(), rol: 'gali', texto: 'Listo, no hice ningún cambio.', timestamp: ahora() }]);
      return null;
    }

    if (actionId === 'ajustar-creacion') {
      const state = this.creationFlow();
      if (!state) return null;
      this.iniciarFlujoCreacion(state.tipo, state.modo, state.agenteId);
      return null;
    }

    if (actionId.startsWith('confirmar-creacion::')) {
      const [, tipo] = actionId.split('::') as [string, Gali6CreationTipo];
      const state = this.creationFlow();
      if (!state) {
        this.decirGali('Ya no tengo esa propuesta activa. ¿La repetimos?');
        return null;
      }
      let creadoId: string | null = null;
      if (tipo === 'agente') {
        const propuesta: PropuestaAgente = {
          nombre: `Mi Agente ${(state.campo1 ?? '').split(' ').slice(0, 2).join(' ')}`,
          proposito: state.campo1 ?? '',
          frecuencia: state.campo2 ?? '',
          autonomiaPct: 20,
        };
        const creado = this.creationRegistry.crearAgente(propuesta);
        creadoId = creado.id;
        this.decirGali(`✦ Listo — creé "${creado.nombre}". Ya aparece en tu lista de agentes.`);
      } else if (tipo === 'regla') {
        const creada = this.creationRegistry.crearRegla({ condicion: state.campo1 ?? '', accion: state.campo2 ?? '' });
        creadoId = creada.id;
        this.decirGali('✦ Listo — creé la regla. Ya está activa.');
      } else {
        const creada = this.creationRegistry.crearSkill({ nombre: state.campo1 ?? '', descripcion: state.campo2 ?? '' });
        creadoId = creada.id;
        this.decirGali('✦ Listo — creé la skill. Ya aparece en tu lista.');
      }
      this.creationFlow.set(null);
      // Highlight conectado (Gali6HighlightService, vía onGaliActing en el shell) — misma
      // señal visual que ya usan Señales/Proyectos, aplicada aquí a lo recién creado por chat.
      return creadoId ? { targetId: creadoId, kind: 'mutate' } : null;
    }

    if (actionId.startsWith('confirmar-edicion-agente::')) {
      const [, agenteId, campo, valor] = actionId.split('::');
      const ok = campo === 'autonomiaPct'
        ? this.mutations.setAutonomiaAgente(agenteId, parseInt(valor, 10))
        : this.mutations.moverAgenteASeccion(agenteId, valor);
      this.decirGali(ok ? 'Listo, apliqué el cambio.' : 'No pude aplicar ese cambio.');
      this.creationFlow.set(null);
      return ok ? { targetId: agenteId, kind: 'mutate' } : null;
    }

    if (actionId === 'demo-crear-agente') {
      this.iniciarFlujoCreacion('agente', 'crear');
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

    if (actionId.startsWith('mover-agente::')) {
      const [, agenteId, screenId] = actionId.split('::');
      const ok = this.mutations.moverAgenteASeccion(agenteId, screenId);
      this.messages.update(msgs => [
        ...msgs,
        {
          id: genId(),
          rol: 'gali',
          texto: ok
            ? `Listo — ahora aparece activo en "${gali6ScreenLabel(screenId)}".`
            : 'No pude mover ese agente.',
          timestamp: ahora(),
        },
      ]);
      return ok ? { targetId: agenteId, kind: 'mutate' } : null;
    }

    if (actionId.startsWith('fijar-artefacto::')) {
      const [, screenId] = actionId.split('::');
      if (!this.lastVisual) {
        this.decirGali('No tengo un resultado reciente para fijar. Pídeme algo primero (ej: "roas") y luego fíjalo.');
        return null;
      }
      const artefacto = this.artifacts.crear(screenId, this.lastVisual.titulo, this.lastVisual.visual);
      this.decirGali(`Listo — quedó fijado en "${gali6ScreenLabel(screenId)}". Puedes verlo en el tab Artefactos.`);
      // Highlight conectado: si el destino es la pantalla actual, el usuario ve el pulso ahí mismo;
      // si es otra pantalla, <gali6-screen-artifacts> lo muestra "recién fijado" al navegar (ver computed reciente()).
      return { targetId: artefacto.id, kind: 'mutate' };
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

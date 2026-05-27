# Gali v3 — AI-First Híbrido (Builder + Orquestador)
## Spec de reescritura disruptiva del prototipo

> **Versión:** 1.0 · Mayo 2026
> **Estado:** Implementado (slice foundational) · iterable
> **Fuente original:** `/Users/user/.claude/plans/revisa-como-esta-gali-sorted-island.md`
> **Contexto interno:** [/Users/user/Documents/Claude/Projects/DropiOrquestador/](file:///Users/user/Documents/Claude/Projects/DropiOrquestador/)

---

## Contexto

**Problema con Gali v3 hoy:** El prototipo previo ([src/app/pages/gali-v3/](../../src/app/pages/gali-v3/)) era un *dashboard personalizable en canvas* con 11 bloques que el usuario reordena. Aunque tenía triggers conversacionales ([canvas.service.ts](../../src/app/services/gali-v3/canvas.service.ts)), **no se sentía AI-first**: el chat era secundario, no había proyectos persistentes con memoria, no había artifacts editables tipo Claude/Cursor, no había automatizaciones, no se asomaba sobre el resto de Dropi. Era un Notion-grid, no un asistente-constructor.

**Lo que el equipo necesita demostrar:** Que Dropi puede ser un **orquestador AI-first** donde Gali no solo analiza/sugiere sino que **construye** con el dropshipper (proyectos, automatizaciones, landings, vistas, agentes), conserva memoria de negocio, y a la vez vive como capa ambiental sobre el Dropi clásico.

**Outcome deseado:** Un prototipo navegable que cualquier dropshipper experimente en 90 segundos y diga *"esto es Dropi con interfaz de Cursor/Claude — soy experto sin ser experto"*. El prototipo debe transmitir 4 sensaciones simultáneas:
1. **Personalización** — todo se adapta a quién eres y qué has hecho
2. **Automatización** — Gali ejecuta, tú apruebas
3. **Compañía con memoria** — no es un chatbot, es un socio que recuerda
4. **Ecosistema todo-en-uno** — plantillas, agentes y conexiones a un click

**Decisiones tomadas con el usuario:**
- **Pilar central:** Híbrido (Builder + Orquestador en uno)
- **Versión:** Reescribir Gali v3 in-place (no crear v4)
- **Profundidad UX:** Chat + Canvas (artifact-style) estilo Claude/Cursor

**Visión sintetizada de DropiOrquestador:**
- *Gali no es un chatbot, es un sistema de agencia contextual con memoria* — [Plan_Gali_Explicito.md](file:///Users/user/Documents/Claude/Projects/DropiOrquestador/Plan_Gali_Explicito.md)
- *Componentes que "se despiertan" con el ícono ✦* — [Plan_NuevoConcepto_Gali_OpenCanvas.md](file:///Users/user/Documents/Claude/Projects/DropiOrquestador/Plan_NuevoConcepto_Gali_OpenCanvas.md)
- *Conversación + Materialización + Orquestación* — [Referentes_Dropi_AIFirst_Orchestrador.md](file:///Users/user/Documents/Claude/Projects/DropiOrquestador/Referentes_Dropi_AIFirst_Orchestrador.md)
- *Data LATAM real es el activo diferenciador irreplicable* — [Plan_Disruptivo_Gali_V2.md](file:///Users/user/Documents/Claude/Projects/DropiOrquestador/Plan_Disruptivo_Gali_V2.md)

---

## Arquitectura de la experiencia

### Layout tri-pane (artifact-style — referente: Claude + Cursor)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✦ GALI    [Inicio · Builder · Mercado · Catálogo]   [3 señales●]  [Avatar] │
├──────────────┬──────────────────────────────────────┬───────────────────────┤
│              │                                      │                       │
│  NAVIGATOR   │         CANVAS / ARTIFACT            │   NEGOCIO LIVE        │
│              │                                      │                       │
│ ─ MI NEGOCIO │  ┌─────────────────────────────┐    │  📦 Pedidos       12  │
│ 🛒 Pedidos 12│  │                              │    │  💰 Wallet  $1.2M  ↗  │
│ 📦 Catálogo  │  │   [Artifact activo:          │    │  📣 Campañas  3 act.  │
│ 📣 Campañas●│  │    landing / flow / vista]   │    │  🟢 ROAS 2.8x        │
│ 💰 Wallet    │  │                              │    │                       │
│              │  │   ← editable in-place        │    │  ─ SEÑALES (3)        │
│ ─ PROYECTOS  │  │                              │    │  ⚡ Producto en alza  │
│ ● Collar GPS │  │   versiones v1·v2·v3         │    │  ⚠️  CTR cayó 40%     │
│ ○ Skincare   │  │                              │    │  🎯 Oportunidad esc.  │
│ ○ Fitness    │  └─────────────────────────────┘    │                       │
│ + Nuevo      │                                      │  ─ MEMORIA GALI       │
│              │  ┌─────────────────────────────┐    │  · Vendes mascotas    │
│ ─ MERCADO    │  │ 💬 CHAT GALI (streaming)    │    │  · Tono emocional     │
│ ⚡ Plantillas│  │ ▸ Tú: arma una landing      │    │  · ROAS objetivo 3x   │
│ 🤖 Agentes   │  │   con ángulo mamá           │    │  [Editar memoria]     │
│ 🔌 Conexiones│  │ ▸ Gali: ✓ generando ●●●     │    │                       │
│              │  │ [adjunto] [voz] [⌘+K]       │    │                       │
└──────────────┴──────────────────────────────────────┴───────────────────────┘
```

**3 zonas, una arquitectura mental simple:**
- **Izquierda (Navigator)** — Tu negocio (operativo Dropi) + Tus Proyectos (memoria-aware) + Mercado (plantillas/agentes) + Builder.
- **Centro (Canvas/Artifact)** — Aquí vive lo que Gali **materializa**: una landing editable, un flow de automatización, una vista personalizada, una tarjeta de producto despertada, un agente en construcción.
- **Derecha (Negocio Live + Memoria)** — Estado del negocio en tiempo real + lo que Gali recuerda. Reemplaza widgets sueltos por algo siempre visible y consistente.

**Chat persistente debajo del canvas** — siempre disponible (no es un dock que se abre/cierra), con streaming visible palabra por palabra, slash-commands, adjuntos, y voz mock. La conexión entre chat y canvas define la sensación Claude/Cursor.

### Rutas

```
/gali-v3                          → Shell tri-pane (Inicio: WelcomeArtifact)
/gali-v3/proyecto/:id             → Workspace de proyecto (memoria visible)
/gali-v3/proyecto/nuevo           → Crear proyecto desde objetivo en lenguaje natural
/gali-v3/builder                  → Builder visual de automatizaciones (Make-style)
/gali-v3/builder/:flowId          → Editar flow existente (próxima iteración)
/gali-v3/mercado                  → Marketplace: plantillas + agentes + conexiones
/gali-v3/mercado/agente/:id       → Detalle de agente + instalar (próxima iteración)
/gali-v3/dropi/catalogo           → Catálogo "despertado" (componentes con ✦)
/gali-v3/dropi/pedidos            → Pedidos "despertados" con triage Gali
/gali-v3/dropi/campanas           → Campañas con health-indicator Gali
/gali-v3/vista/:slug              → Vista personalizada generada por Gali (próxima iteración)
/gali-v3/onboarding               → Onboarding 3 preguntas (heredado, se rediseña)
```

---

## Componentes nuevos

### Shell tri-pane ([src/app/components/gali-v3/shell/](../../src/app/components/gali-v3/shell/))
- **GaliTopbarComponent** — Brand + nav primaria + popover de señales proactivas + avatar memoria.
- **GaliNavigatorComponent** — Sidebar izquierdo: Mi Negocio · Proyectos · Mercado · Builder · footer (maestría, salir).
- **GaliBusinessContextComponent** — Panel derecho: métricas live, señales (3 zonas), memoria editable con chips, proyectos activos mini-list.
- **GaliV3ShellComponent** ([reescrito](../../src/app/pages/gali-v3/gali-v3-shell.component.ts)) — Layout tri-pane con context-aware routing (cambia el contexto del chat según la ruta activa).

### Chat + Artifacts (referente: Claude Artifacts)
- **GaliChatComponent** ([src/app/components/gali-v3/chat/](../../src/app/components/gali-v3/chat/)) — Chat con streaming simulado (palabra por palabra con `setInterval`), slash-commands contextuales, attach popover (imagen/URL/producto/artifact previo), voz mock con waveform, ⌘+K placeholder. Expandible con tap.
- **GaliArtifactWrapperComponent** *(próxima iteración)* — Envuelve cualquier artifact con título editable, badge de versión, history, "Guardar en proyecto", "Compartir".
- **WelcomeArtifactComponent** ([src/app/components/gali-v3/artifacts/welcome-artifact.component.ts](../../src/app/components/gali-v3/artifacts/welcome-artifact.component.ts)) — Saludo memory-aware (nombre + nicho + tono + ROAS objetivo + señales) + 3 cards (Reanudar último proyecto / Construir nuevo / Builder) + plantillas destacadas + cierre filosófico.
- **LandingArtifactComponent / FlowArtifactComponent / VistaArtifactComponent / AgenteArtifactComponent** *(próxima iteración)* — Implementación inicial: existen como referencias dentro de los proyectos.

### Componentes "despertados" (capa orquestadora sobre Dropi clásico)
- **Awake ProductCard** (inline en [dropi-catalogo](../../src/app/pages/gali-v3/dropi-catalogo/dropi-catalogo.component.ts)) — Ícono ✦ que al click expande análisis LATAM + 3 ángulos + acciones in-card.
- **Awake OrderRow** (inline en [dropi-pedidos](../../src/app/pages/gali-v3/dropi-pedidos/dropi-pedidos.component.ts)) — Triage en 3 zonas: críticas / Gali manejando / resueltas hoy.
- **Awake CampaignCard** (inline en [dropi-campanas](../../src/app/pages/gali-v3/dropi-campanas/dropi-campanas.component.ts)) — Health-indicator score + diagnóstico Gali + acción sugerida.
- **SignalChipComponent** *(integrado en topbar)* — Popover de señales proactivas con dismiss individual.

### Builder / Mercado / Proyectos
- **GaliV3BuilderComponent** ([builder.component.ts](../../src/app/pages/gali-v3/builder/builder.component.ts)) — Sidebar con lista de flows + paleta tabbed (Triggers/Acciones/Lógica). Canvas central con nodos encadenados verticales. Terminal oscura con log de ejecución en vivo.
- **GaliV3MercadoComponent** ([mercado.component.ts](../../src/app/pages/gali-v3/mercado/mercado.component.ts)) — 3 tabs (Plantillas / Agentes / Conexiones), buscador, filtros por categoría/nivel, instalar/conectar funcional.
- **GaliV3ProyectoComponent** ([proyecto.component.ts](../../src/app/pages/gali-v3/proyecto/proyecto.component.ts)) — Hero con pipeline Producto→Landing→Campaña→ROAS, panel "Siguiente acción", panel "Lo que sé de este proyecto" (decisiones + aprendizajes), tabs (Conversaciones/Decisiones/Artifacts). Variante "/nuevo" para crear desde objetivo.

---

## Servicios y modelo de datos

### Servicios nuevos ([src/app/services/gali-v3/](../../src/app/services/gali-v3/))
- **GaliProjectService** — CRUD de proyectos con memoria, persiste en `localStorage`. Estado computado de proyectos activos/pausados/completados. Set active project.
- **GaliMemoryService** — Modelo de 3 capas (negocio / proyectos / sesión). Chips editables, addAprendizaje/removeAprendizaje/setNivel persistidos.
- **GaliChatService** — Historial por thread (un thread por proyecto + thread "inicio"), streaming simulado palabra por palabra (`setInterval` 28ms tick), slash-commands, contexto activo (proyecto + ruta), 6 respuestas mock heurísticas según el contenido del prompt.
- **GaliSignalsService** — Señales proactivas con dismiss persistido. Computeds para count y críticas.
- **GaliBusinessService** — Snapshot del negocio (pedidos/wallet/campañas/automatizaciones). Formatter de moneda.
- **GaliMarketplaceService** — Plantillas, agentes y conexiones. Toggle instalar/conectar.
- **GaliFlowService** — Catálogo de bloques + CRUD de flows + ejecución mock con eventos streamed (`tick` con setTimeout y push al log).
- **types.ts** — Interfaces compartidas (sin caracteres acentuados en identifiers — Angular template lexer no los acepta).

### Servicios reusados
- **CanvasService** — Conservado para futura "Vista personalizada" (artifact = layout de widgets).
- **BlockRegistry** — Conservado como catálogo de widgets para VistaArtifact.
- **GaliLearningService** — Niveles aprendiz/operador/estratega siguen siendo el modelo de adaptación novato/avanzado.

### Modelo de datos (claves)

```typescript
interface GaliProject {
  id: string;
  name: string;
  status: 'activo' | 'pausado' | 'completado';
  icon: string;
  created_at: string;
  last_activity: string;
  days_active: number;
  product: ProjectProduct;
  pipeline: PipelineStage[];
  artifacts: { landings, flows, vistas, agentes };
  memory: {
    decisiones_clave: string[];
    aprendizajes: string[];
    siguiente_accion: string;
    siguiente_accion_razonamiento: string;
  };
  metrics: { roas_actual, ventas_totales, ventas_semana, presupuesto_diario, ctr_actual, dias_antes_saturacion };
}

interface FlowBlock {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  category: 'pedidos' | 'campanas' | 'productos' | 'wallet' | 'notificacion' | 'agente';
  label: string;
  icon: string;
  color: string;
  x: number;  // posición en cadena
}

interface ChatMessage {
  id: string;
  role: 'user' | 'gali';
  timestamp: string;
  content: string;
  streaming?: boolean;
  artifacts?: Array<{ type: string; ref: string }>;
  context?: { projectId?: string; route?: string };
}

interface Signal {
  id: string;
  tipo: 'oportunidad' | 'riesgo' | 'optimizacion';
  icon: string;
  titulo: string;
  contexto: string;
  accion_sugerida: { label: string; target_route: string };
  urgencia: 'alta' | 'media' | 'baja';
  timestamp: string;
  fuente: string;
}
```

---

## Mock data ([mocks/gali-v3/](../../mocks/gali-v3/))

- `proyectos.json` — 3 proyectos: Collar GPS (activo con memoria rica), Skincare coreano (pausado con razones), Bandas fitness (completado).
- `gali-memory.json` — Perfil de Alejandra (vende mascotas, tono emocional, ROAS objetivo 3x, decisiones históricas con fechas).
- `chat-history-collar-gps.json` — 9 mensajes mostrando cómo Gali conserva contexto a lo largo de 18 días.
- `signals.json` — 5 señales mock: oportunidades, riesgos, optimizaciones.
- `chat-prompts.json` — Slash-commands globales + sugerencias contextuales por ruta.
- `flow-blocks-catalog.json` — 8 triggers + 12 acciones + 3 condiciones.
- `mercado/plantillas.json` — 12 plantillas (Lanzar primer producto, Auto-pausa CTR, Reporte WA semanal, Recuperar abandonos, Escala lo que funciona, Mi operación de hoy, Diagnóstico Claude, Vigilante anti-baneo, Renueva creatives, Reto 50 ventas, Import URL, Asistente WA 24/7).
- `mercado/agentes.json` — 8 agentes (Vigilante anti-baneo, Analista de novedades, Generador de copies, Detector productos en alza, Asistente WA, Optimizador de presupuesto, Espía de competidores, Líder comunidad virtual).
- `mercado/conexiones.json` — 6 conexiones (Meta Ads, TikTok Ads, Shopify, Tienda Nube, WhatsApp Business, Claude).
- `business-snapshot.json` — Snapshot live: pedidos, wallet, campañas, productos, automatizaciones, alertas.

> **Persistencia:** Todo se guarda en `localStorage` (proyectos, memoria, señales descartadas, chat threads, flows). Persiste entre recargas pero se resetea limpiando el storage.

---

## DS Registry — componentes a respetar

Antes de tocar UI, consultar:
- [ds-registry/index.json](../../ds-registry/index.json) — inventario completo.
- [ds-registry/components/](../../ds-registry/components/) — specs de dropi-button, dropi-input, dropi-card, dropi-modal, dropi-tag, dropi-badge, dropi-tabs, dropi-alert.
- [ds-registry/tokens/](../../ds-registry/tokens/) — colors, spacing, typography, radius, shadows. Usar SCSS variables de [_variables.scss](../../src/styles/_variables.scss) siempre.

**Tokens propios de Gali v3** ([_gali-v3-tokens.scss](../../src/styles/_gali-v3-tokens.scss)) — extendidos con:
- Dimensiones tri-pane (`$gv3-topbar-h`, `$gv3-navigator-w`, `$gv3-business-w`, `$gv3-chat-h`).
- Artifact surfaces (`$gv3-artifact-radius`, `$gv3-artifact-shadow`, `$gv3-artifact-shadow-hover`).
- Signal chip colors (oportunidad/riesgo/optimización).
- Animaciones (`@keyframes gv3-streaming-pulse`, `gv3-cursor-blink`, `gv3-artifact-enter`, `gv3-signal-pulse`, `gv3-voice-wave`, `gv3-spin`).
- Mixins (`gv3-artifact`, `gv3-pill`, `gv3-streaming-dots`, `gv3-scrollbar-subtle`).

**Identidad visual mantenida:**
- Naranja Dropi `#F49A3D` para CTA primario.
- Ícono ✦ (4-point star) marcador exclusivo de Gali con drop-shadow glow.
- Fraunces para display, IBM Plex Sans para body, JetBrains Mono para código/streaming.
- Paleta cream operativa (`#FAF7F2`) con contraste WCAG AAA.

---

## Detalles que hacen la diferencia (sesgo Cursor/Claude)

1. **Streaming visible siempre** — Gali responde palabra por palabra con `setInterval` (28ms tick). Cursor blinking visible en el mensaje en construcción.
2. **Slash-commands** — `/` en el chat abre menú de comandos con icono + descripción.
3. **⌘+K palette** — Atajo visual en topbar y chat (placeholder para iteración con palette real).
4. **Versions** — Cualquier artifact mostrará `v1·v2·v3` arriba con click para restaurar (planificado).
5. **Artifact "live"** — LandingArtifact: click-to-edit in-place (planificado).
6. **Execution stream** — Cuando ejecuta un flow del Builder, log en vivo en terminal oscura: `▸ icono Pausar campaña... ✓ Hecho`.
7. **Memoria editable visible** — Panel derecho muestra "Lo que sé de ti" con chips editables/borrables. Add inline.
8. **Adjuntos en chat** — Popover con 4 opciones (imagen / URL / producto / artifact previo).
9. **Modo voz** — Botón mic con waveform animado; suelta texto mock al input al "terminar".
10. **Persistencia visible** — Al recargar, el proyecto activo retoma con su "Última actividad: hace 2h".

---

## Adaptación novato/avanzado (sin pasos forzados)

El sistema de niveles existe en [gali-learning.service.ts](../../src/app/services/gali-learning.service.ts) (aprendiz/operador/estratega).

| Nivel | Welcome muestra | Chat sugiere | Builder | Mercado |
|---|---|---|---|---|
| **Aprendiz** | "Construye tu primer producto" + 3 plantillas guiadas | Sugerencias verbales explicativas | Modo simple: plantilla preconstruida con tutorial | Resalta agentes "para empezar" |
| **Operador** | Reanudar proyecto + métricas del día | Slash-commands operativos | Builder libre con sugerencias | Filtros por nicho propio |
| **Estratega** | Centro de mando: 3 proyectos + señales + flows activos | Comandos densos, modo agéntico | Builder avanzado: condiciones, ramas, custom agentes | Vista completa, instala/crea propios |

**Importante:** Nunca hay wizard. Siempre se puede ir a cualquier ruta. La adaptación es en el **contenido sugerido**, no en restringir navegación.

---

## Verificación end-to-end

### Tests cualitativos (pasados ✓)

1. **Build compila limpio** — `yarn build` termina sin errores. Solo warnings menores (NG8107 optional chaining, bundle ~35kB sobre budget — aceptable para prototipo).
2. **Smoke test HTTP** — 21/21 rutas devuelven HTTP 200 tras Quinta Ola (incluye nueva `/retos` y mapa con DnD):
   - `/gali-v3` · `/gali-v3/mapa` · `/gali-v3/retos` ⭐ · `/gali-v3/proyecto/collar-gps-2026` · `/gali-v3/proyecto/nuevo`
   - `/gali-v3/builder` · `/gali-v3/mercado` · `/gali-v3/mercado/agente/ag-1` · `/gali-v3/mercado/agente/nuevo`
   - `/gali-v3/dropi/catalogo` · `/gali-v3/dropi/pedidos` · `/gali-v3/dropi/campanas`
   - `/gali-v3/dropi/proveedores` · `/gali-v3/dropi/caza-productos` · `/gali-v3/dropi/cartera`
   - `/gali-v3/legacy/cas` · `/gali-v3/legacy/academy` · `/gali-v3/legacy/dropi-card`
   - `/gali-v3/artifact/landing/land-1`
   - `/gali-v3/vista/operacion-hoy` · `/gali-v3/vista/productos-ganadores` · `/gali-v3/vista/centro-mando` · `/gali-v3/vista/nueva`
   - `/gali-v3/onboarding`
   - `/gali-v3/proyecto/collar-gps-2026?signal=sig-2` ⭐ (signal highlight)
3. **Hot-reload funcional** — Cambios se aplican en ~3s en dev mode.

### Tests cualitativos pendientes de validación humana

1. **Test de la primera impresión (15s):** Abrir `/gali-v3` por primera vez. ¿Se reconoce como "interfaz tipo Claude/Cursor adaptada a Dropi"?
2. **Test del proyecto con memoria:** Abrir proyecto Collar GPS. ¿El panel derecho muestra cosas concretas que Gali "recuerda"? ¿Se siente como un socio, no un chatbot?
3. **Test de no-secuencialidad:** Desde catálogo despertado, ¿se puede ir directo al Builder sin pasos? ¿Y vice-versa?
4. **Test del Builder:** Crear flow `Trigger CTR<2% → Pausar campaña → Notif WA`. ¿Se ve el streaming de ejecución?
5. **Test del Mercado:** Instalar agente "Vigilante anti-baneo". ¿Se refleja en panel derecho? ¿Se puede invocar desde el chat?
6. **Test responsivo:** Resize a 1280px y 1440px. ¿El tri-pane se mantiene usable? (NO mobile — desktop-first según [CLAUDE.md](../../CLAUDE.md)).

### Comandos de verificación

```bash
# Build limpio
yarn build

# Dev server
yarn start          # arranca en :4200

# Smoke test rutas
for path in "" "/proyecto/collar-gps-2026" "/proyecto/nuevo" "/builder" "/mercado" \
            "/dropi/catalogo" "/dropi/pedidos" "/dropi/campanas"; do
  /usr/bin/curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4200/gali-v3${path}"
done
```

---

## Archivos creados/modificados

### Modificados
- [src/app/app.routes.ts](../../src/app/app.routes.ts) — 8 rutas nuevas hijas de `/gali-v3`.
- [src/app/pages/gali-v3/gali-v3-shell.component.{ts,html,scss}](../../src/app/pages/gali-v3/) — Reescrito como tri-pane.
- [src/app/pages/gali-v3/inicio/inicio.component.ts](../../src/app/pages/gali-v3/inicio/inicio.component.ts) — Reescrito a WelcomeArtifact (template inline).
- [src/styles/_gali-v3-tokens.scss](../../src/styles/_gali-v3-tokens.scss) — Tokens AI-first agregados.
- [navigation-map.json](../../navigation-map.json) — Módulo `gali-v3` agregado con 9 views.
- [src/app/pages/prototype-gallery/prototype-gallery.component.ts](../../src/app/pages/prototype-gallery/prototype-gallery.component.ts) — Título y componentes actualizados.

### Creados — Componentes (24 archivos)

**Shell:**
- `src/app/components/gali-v3/shell/gali-topbar.component.{ts,html,scss}`
- `src/app/components/gali-v3/shell/gali-navigator.component.{ts,html,scss}`
- `src/app/components/gali-v3/shell/gali-business-context.component.{ts,html,scss}`

**Chat:**
- `src/app/components/gali-v3/chat/gali-chat.component.{ts,html,scss}`

**Artifacts:**
- `src/app/components/gali-v3/artifacts/welcome-artifact.component.{ts,html,scss}`

### Creados — Páginas (18 archivos)
- `src/app/pages/gali-v3/proyecto/proyecto.component.{ts,html,scss}`
- `src/app/pages/gali-v3/builder/builder.component.{ts,html,scss}`
- `src/app/pages/gali-v3/mercado/mercado.component.{ts,html,scss}`
- `src/app/pages/gali-v3/dropi-catalogo/dropi-catalogo.component.{ts,html,scss}`
- `src/app/pages/gali-v3/dropi-pedidos/dropi-pedidos.component.{ts,html,scss}`
- `src/app/pages/gali-v3/dropi-campanas/dropi-campanas.component.{ts,html,scss}`

### Creados — Servicios (8 archivos)
- `src/app/services/gali-v3/types.ts`
- `src/app/services/gali-v3/memory.service.ts`
- `src/app/services/gali-v3/project.service.ts`
- `src/app/services/gali-v3/signals.service.ts`
- `src/app/services/gali-v3/chat.service.ts`
- `src/app/services/gali-v3/business.service.ts`
- `src/app/services/gali-v3/marketplace.service.ts`
- `src/app/services/gali-v3/flow.service.ts`

### Creados — Mocks (10 archivos)
- `mocks/gali-v3/proyectos.json`
- `mocks/gali-v3/gali-memory.json`
- `mocks/gali-v3/chat-history-collar-gps.json`
- `mocks/gali-v3/signals.json`
- `mocks/gali-v3/chat-prompts.json`
- `mocks/gali-v3/flow-blocks-catalog.json`
- `mocks/gali-v3/business-snapshot.json`
- `mocks/gali-v3/mercado/plantillas.json`
- `mocks/gali-v3/mercado/agentes.json`
- `mocks/gali-v3/mercado/conexiones.json`

---

## Próximas iteraciones (out of scope del primer slice)

### Segunda ola — completados ✓

- ✓ **⌘+K command palette global** — Implementado en [command-palette.component.ts](../../src/app/components/gali-v3/shell/command-palette.component.ts). Listener global de `Cmd/Ctrl + K`, fuzzy search por título/subtítulo/keywords, ↑↓ navegación, ↵ ejecuta, esc cierra. Agrega proyectos, agentes, flows y acciones rápidas Gali dinámicamente.
- ✓ **LandingArtifact editable in-place** — `/gali-v3/artifact/landing/:id` con click-to-edit en cada elemento (title, CTA, subhead, bullets, precio, testimonio), 3 paletas (mamá/aspiracional/racional) que cambian skin, preview desktop/mobile, versions restorables, save-version, generar variación con Gali.
- ✓ **VistaArtifact generator** — `/gali-v3/vista/:slug` con 3 templates (operacion-hoy, productos-ganadores, centro-mando) + `/vista/nueva` para componer desde prompt natural. Gali infiere widgets por heurística semántica y los pinta progresivamente con animación.
- ✓ **AgenteDetail** — `/gali-v3/mercado/agente/:id` con hero rich, qué hace, requisitos, cómo trabaja con tu negocio (3 pasos), agentes relacionados por color, install/uninstall + invocar funcional.
- ✓ **Slash-commands navegan** — `/proyecto-nuevo`, `/automatiza`, `/vista`, `/recuerda` ahora navegan a la ruta correspondiente además de generar respuesta.
- ✓ **Onboarding sincronizado con memoria nueva** — Al completar, `GaliMemoryService.setNivel()` se actualiza para reflejar antiguedad → aprendiz/operador/estratega.
- ✓ **Landing linkeada desde proyecto** — Artifacts del proyecto ahora son `<a>` clickeables que abren el LandingArtifact editable.
- ✓ **WelcomeArtifact con atajos rápidos** — Nueva sección con 4 shortcuts directos a landing, vista operación-hoy, componer vista, agent detail.

### Tercera ola — completados ✓

- ✓ **Mapa del Negocio** (`/gali-v3/mapa`) — Grafo de 21 nodos en 6 zonas con "estás aquí" pulsando, hover resalta conexiones, KPIs live en cada nodo, footer ProximosPasos. Implementado en [mapa.component.ts](../../src/app/pages/gali-v3/mapa/mapa.component.ts) + [business-map.service.ts](../../src/app/services/gali-v3/business-map.service.ts) + [business-map.json](../../mocks/gali-v3/business-map.json).
- ✓ **Patrón "Próximos pasos"** — Componente compartido [proximos-pasos.component.ts](../../src/app/components/gali-v3/shared/proximos-pasos.component.ts) + [proximos-pasos.service.ts](../../src/app/services/gali-v3/proximos-pasos.service.ts) con 18 contextos. Insertado en Welcome, Project, Landing, Vista, Builder, Mapa, Proveedores, Caza, Cartera (9 lugares).
- ✓ **Breadcrumb conversacional** ([gali-breadcrumb.component.ts](../../src/app/components/gali-v3/shell/gali-breadcrumb.component.ts)) — Sub-fila de 28px bajo la topbar con `✦ Gali · Estás en: X · Próximo: Y` reactivo a la ruta.
- ✓ **⌘M shortcut** — Agregado a [command-palette.component.ts](../../src/app/components/gali-v3/shell/command-palette.component.ts): `Cmd/Ctrl + M` desde cualquier ruta navega a `/gali-v3/mapa`.
- ✓ **Despertados nuevos (3)**:
  - **Proveedores** (`/gali-v3/dropi/proveedores`) con score Gali, entrega, devoluciones, fit-aware + chip ✦ expandible.
  - **Caza productos** (`/gali-v3/dropi/caza-productos`) ordenados por fit con recomendación lanzar/esperar/pasar + razón + filtros.
  - **Historial Cartera** (`/gali-v3/dropi/cartera`) con sparkline SVG mock + 3 sugerencias Gali + tabla movimientos categorizada.
- ✓ **Legacy hosts (3)** con AwakenOverlay flotante (`✦ Gali` bottom-right + drawer 340px):
  - `/gali-v3/legacy/cas` — Bandeja CAS preview + sugerencias Gali para triage tickets.
  - `/gali-v3/legacy/academy` — Grid de cursos preview + cursos sugeridos según perfil.
  - `/gali-v3/legacy/dropi-card` — Card visual + stats + análisis de uso Gali.
- ✓ **Onboarding sincronizado con mapa** — Momento Wow agregado tercer CTA `🗺 Ver mapa del negocio` para invitar al recorrido visual antes de la primera misión.
- ✓ **Navegación visible del navigator** — Entrada destacada "Mapa del negocio" con badge `⌘M` arriba de "Mi negocio".

**Verificación pasada:**
- `yarn build` limpio · 14/14 rutas devuelven HTTP 200 incluyendo las 7 nuevas.

### Cuarta ola — completados ✓

- ✓ **Drag-and-drop libre en Builder** — Native HTML5 DnD: arrastra desde paleta al canvas, reordena nodos arrastrando handles `⋮⋮`, drop slots entre bloques con feedback visual (`is-active` + dashed border). Métodos `insertNode`/`reorderNode` en [flow.service.ts](../../src/app/services/gali-v3/flow.service.ts). Líneas SVG curvas (Bézier) reemplazan los conectores rectos.
- ✓ **Editor de agente custom** (`/gali-v3/mercado/agente/nuevo`) — Wizard de 4 pasos: identidad (nombre/tagline/icon/color con preview live) → trigger (8 opciones del catalog) → prompt + herramientas conectadas (6 conexiones) + plantilla salida → test dry-run con log streaming + guardar (persistir en marketplace localStorage). Disponible vía botón "+ Crear agente custom" en la grid de Mercado · tab Agentes.
- ✓ **Voz real con Web Speech API** — Nuevo [voice.service.ts](../../src/app/services/gali-v3/voice.service.ts) que:
  - Usa `SpeechRecognition`/`webkitSpeechRecognition` con `lang='es-CO'`, `interimResults=true`.
  - Conecta MediaDevices al AudioContext para waveform **real** de 8 bars derivado de `getByteFrequencyData`.
  - Banner rojo "Escuchando…" con pulse + transcript interim en vivo + botón Detener.
  - Si el navegador no soporta, el botón mic se deshabilita con tooltip explicativo.
  - El transcript final/interim se vuelca automáticamente al input del chat.
- ✓ **Adjuntos funcionales** — Popover con 5 opciones:
  - **📷 Subir imagen** — `<input type="file">` + `FileReader` → base64 preview thumbnail en chip.
  - **🔗 Pegar URL** — Sub-popover con input dedicado, parsea hostname para chip + meta.
  - **📦 Adjuntar Collar GPS / Serum** — Productos del catálogo Dropi pre-cargados.
  - **✦ Adjuntar artifact previo** — Adjunta referencia a Landing existente.
  - Chips de adjunto con thumb, label, meta, botón × para quitar. Se envían al chat junto con el texto.
- ✓ **Highlight target al click en señal** — Nueva directiva [signal-highlight.directive.ts](../../src/app/components/gali-v3/shared/signal-highlight.directive.ts):
  - Topbar agrega `?signal=ID` a la URL al click en una señal.
  - Componentes target (`proyecto`, `dropi-campanas`, `dropi-catalogo`) aplican la directiva `signalHighlight` y marcan elementos relevantes con `data-signal="ID"`.
  - Al detectar el queryParam, la directiva añade clase `is-highlighted-signal` que **pulsa 3 veces** con `@keyframes gv3-signal-highlight` (token en `_gali-v3-tokens.scss`) + `scrollIntoView` smooth.
  - Mapeo: `sig-1`/`sig-2`/`sig-4` → bloque "Siguiente acción" del proyecto · `sig-2` (riesgo CTR) también resalta campañas con salud=mala · `sig-3` (producto en alza) resalta el difusor en el catálogo.

**Verificación pasada:**
- `yarn build` limpio · **21/21 rutas devuelven HTTP 200** incluyendo `/mercado/agente/nuevo` y URLs con `?signal=` para validar highlight.

### Quinta ola — completados ✓

- ✓ **Sistema de Retos / Gamificación** (`/gali-v3/retos`) — Página completa nueva alineada al brief original del usuario:
  - **Perfil de jugador**: nombre, nivel, puntos totales, racha de días 🔥, rank en cohorte.
  - **4 retos diarios** con check + puntos + ruta para iniciar (resetea cada día).
  - **4 retos semanales** con progress bar + comparación con cohorte ("28 de tu cohorte ya lo completó").
  - **2 misiones largas** con checkpoints + razonamiento Gali ("Tu nicho lo permite. Necesitas escalar presupuesto + expandir ciudades.").
  - **Líder de Comunidad Virtual**: agente activable basado en el Top 1 de Dropi. Activar → da consejo en su voz + se conecta al chat.
  - **6 insignias ganadas** (incluyendo 1 rara) + **3 insignias próximas** con progress.
  - **Top 5 cohorte** con rank, ciudad, puntos. El usuario aparece destacado donde corresponde.
  - **RetosService** persistente en localStorage, todo el estado interactivo (toggle reto, activar líder).
- ✓ **Mapa interactivo con DnD** — Modo edición (toggle "✎ Editar mapa") + handle `⋮⋮` por nodo:
  - Drag entre zonas para mover un nodo de Descubrimiento → Estrategia, etc.
  - Drag dentro de zona para reordenar.
  - Persistencia del orden en localStorage (`gali_v3_map_order`).
  - Botón "↺ Restaurar orden" para volver al default.
  - En edit mode no se navega al hacer click (solo drag).
  - Visual feedback: `is-dragging` (opacity 0.4), `is-drop-over` (orange ring), `is-drop-target` zone (dashed outline).
- ✓ **A11y improvements**:
  - **Skip link** ("Saltar al contenido principal") visible al tab al inicio del shell.
  - **focus-visible** consistente con ring naranja 2px en todos los interactivos de gali-v3.
  - **`<main>` con `id="shell-main-content"`** + `aria-label` + `tabindex="-1"` para que el skip link aterrice.
  - **`prefers-reduced-motion`** media query desactiva todas las animaciones (signal-highlight incluido) cuando el sistema lo solicita.
  - **`gv3-sr-only`** utility para texto solo-screen-reader.
  - Navigator: `aria-hidden="true"` en iconos decorativos para que screen readers no los lean.
- ✓ **Conexión completa de Retos**:
  - Entrada destacada `🎯 Retos y progreso` con badge `🔥 12` en el Navigator.
  - Nodo `n-retos` agregado al mapa del negocio (zona Gali Core).
  - Entrada `Retos y gamificación` en el command palette (⌘K).
  - Próximos pasos contextual desde mapa, retos e inicio.
  - Breadcrumb conversacional para ruta `/retos`.

**Verificación pasada:**
- `yarn build` limpio · **21/21 rutas devuelven HTTP 200** incluyendo nuevo `/retos`.

### Lo que genuinamente queda fuera (backend territory real)

1. **Persistencia en backend** — API real para proyectos/memoria/chat/retos/insignias.
2. **MCP real** — Cliente MCP para Meta/Shopify/WhatsApp/Claude.
3. **WhatsApp Business real** — Hoy es solo conexión visual.
4. **Voice con Whisper** — Mejor precisión LATAM.
5. **Líder virtual real con LLM** — Hoy responde con ejemplo fijo; con LLM real ajustaría según contexto.

---

## Fuera de scope explícito (v1 del rediseño)

Para evitar scope creep, lo siguiente NO entra en este rediseño:
- Backend real / API real / LLM real — todo simulado con interceptor mock y `setInterval`.
- Persistencia en servidor — todo en `localStorage`.
- Autenticación real — se reusa el `authGuard` actual con usuarios mock.
- Colaboración multi-usuario en proyectos.
- Modo móvil — explícitamente desktop-first.
- Integraciones MCP reales (Meta, Shopify, WhatsApp) — todo mock.
- Voz real — solo UI mock con waveform.
- A11y review profunda (queda para iteración siguiente, pero respetar contraste WCAG mínimo).

---

## Referentes visuales (de [Referentes_Dropi_AIFirst_Orchestrador.md](file:///Users/user/Documents/Claude/Projects/DropiOrquestador/Referentes_Dropi_AIFirst_Orchestrador.md))

- **Cursor 3** — Agentes como objetos de primer nivel · planes y ejecuciones visibles en sidebar.
- **Claude + Artifacts** — Canvas persistente al lado del chat · materializa lo conversacional.
- **Perplexity Shopping** — Chat que devuelve tarjetas accionables · compra sin salir.
- **Vercel v0** — Describir → ver resultado · editar en canvas bidireccional.
- **Shopify MCP UI** — Servidores que devuelven componentes UI nativos · intents semánticos.
- **Vercel AI SDK Gen UI** — IA decide qué componente renderizar según intención.
- **Notion** — Organización de proyectos · pages anidadas.
- **Linear** — Timeline de decisiones · velocity visible.
- **Make.com / n8n** — Visual flow editor con triggers + acciones encadenadas.

---

*Spec creado: Mayo 26, 2026 · Versión 1.0 · Estado: implementado (slice foundational)*
*Plan original: `/Users/user/.claude/plans/revisa-como-esta-gali-sorted-island.md`*
*Owner: Sebastián (sebas@mono.la) · Equipo DropiOrquestador*

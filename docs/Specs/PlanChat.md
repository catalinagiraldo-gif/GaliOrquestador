# Plan: Conexiones IA con tokens + arreglo de navegación y modelo de intervención de Gali 6

## Contexto

Catalina está replanteando dos cosas sobre Gali:

1. **De dónde viene la inteligencia de Gali.** Hoy se habla de Gali como una IA "interna" única. La idea nueva es que el usuario pueda *conectar* distintos motores de IA (Claude, Gemini, GPT...) desde Dropi y gastar tokens de esas conexiones — extendiendo el patrón que **ya existe** en `gali6-conexiones-casa.component.ts` para herramientas de negocio (Meta Ads, Shopify, Siigo, etc. con flujo de API key). La transcripción del equipo (2 jun) ya venía rondando esto: Cata propuso un "mapa de conexiones" estilo Obsidian donde se ven los nodos de qué IA/herramienta afecta qué parte de la operación (líneas 867-909), y Diana lo resumió como "herramientas que se conectan a los agentes... el conocimiento se puede llevar a otro nivel" (línea 917). Ya existe además un `ConexionesPageComponent` en gali-v5 con un grafo de nodos (agentes + plataformas, incluyendo un nodo literal "Meta Ads MCP") — es el prototipo de esa idea, pero no incluye proveedores de IA.
   **Decisión confirmada con Catalina:** el entregable de esta parte es un **documento de spec**, no código. Y una restricción de producto explícita: aunque la UI muestre varios motores de IA como conectables, **no hay conexión real a otros proveedores** — cualquier respuesta compleja real (si algún día se conecta algo de verdad en el prototipo) se resuelve con **Claude Haiku** por debajo. Los "motores" mostrados son fachada/mock, igual que ya lo son Meta Ads, Siigo, etc. en `gali6-conexiones-casa`.

2. **La navegación del panel lateral de Gali 6 está rota.** Calendario, Garantía de órdenes de despacho, Garantía de recolecciones, Etiquetas (parcialmente), Marketing→Automatización/Configuraciones, Lanzador de campañas y Configurar no llevan a ninguna parte, o caen en la pantalla "Hoy" (lo que Catalina transcribió como "Loy"). Diagnóstico confirmado en código: `gali-6-sections.config.ts` reexporta el menú lateral completo de gali-v5 (`DROPI_SECTION_PANELS`/`DROPI_ICON_RAIL`) reescribiendo `/gali-v5` → `/gali-6` con un simple `string.replace()`, **sin verificar que la ruta reescrita exista** en `gali-6.routes.ts`. Cuando no existe, Angular cae en el wildcard `{ path: '**', redirectTo: '' }` (línea 295) y aterriza silenciosamente en Home ("Hoy"). Comparé mecánicamente todas las rutas que el menú referencia contra las que `gali-6.routes.ts` registra: **hay 25 rutas huérfanas** (el conteo inicial de "20" contaba ítems de menú, no rutas individuales — p. ej. "Configurar" es 1 ítem pero cubre 11 rutas; la lista completa de §B1 abajo es la fuente de verdad y quedó corregida a 25 tras la implementación), no solo las 7 que Catalina notó a simple vista.
   Además, no existe hoy un modelo documentado de "qué tanto interviene Gali" por tipo de sección, ni cómo el chat lateral (que ya es screen-aware vía `Gali6ScreenContextService`) debe reaccionar según qué pantalla esté viendo el usuario.
   **Decisiones confirmadas con Catalina:** "Garantías recolecciones" y "Validador de direcciones" quedan como pantallas **separadas** (no se fusionan/redirigen una a la otra). El arreglo de rutas aplica **solo a `/gali-6`** (la versión activa) — `/gali-6-v1` y `/gali-6-v2` son snapshots congelados y no se tocan.

---

## Parte A — Spec: "Conexiones IA" (documento, sin código)

**Archivo nuevo:** `docs/SpecsNuevos/18.ConexionesIA.md` (siguiente número libre; el último usado es `17.GaliMinimal.md`).

Estructura del documento, siguiendo el formato ya establecido en `docs/Conocimientos/AlcancesIADropi.md` (visión → capas → matriz → límites → fases):

1. **Visión.** Gali sigue siendo el único "cerebro" que razona (Claude Haiku, real si algún día se conecta algo de verdad) — lo que el usuario conecta no son cerebros alternativos, son **fuentes de contexto y ejecución adicionales**, exactamente como ya conecta Meta Ads o Shopify. Esto evita prometer algo que el prototipo no puede sostener y resuelve la restricción que puso Catalina.

2. **Modelo de conexión — nueva categoría dentro de Conexiones existente.**
   Extiende el `Mcp.tipo` de `gali6-conexiones-casa.component.ts` (hoy: `pauta | logistica | contabilidad | comunicacion | contexto`) con un quinto tipo: **`ia`**. Tarjetas mock a nivel del mismo array `mcps[]`: Claude, Gemini, GPT, (opcional Llama/Mistral como "próximamente"), cada una con el mismo shape `{ nombre, glyph, estado, dato, contexto, tipo: 'ia' }` — reusa el flujo de conexión ya construido (`abrirPanel`, `apiKeyInput`, `conectarMcp`, `getPasosConexion`) sin inventar un componente nuevo.
   Aclarar en el spec — con una nota de implementación explícita — que estas tarjetas son **decorativas/mock**: no disparan ninguna llamada real distinta a otros MCP ya mockeados en este componente.

3. **Modelo de tokens.** Cada tarjeta de tipo `ia` muestra, en el panel de detalle: consumo del período (mock), límite mensual configurable por el usuario, alerta de saldo bajo. Diseñar esto con el dimensión **Calibration** y **Budget visibility** de `ai-experience-patterns.md` (sección "Agent Loops → Budget visibility"): nunca mostrar un número de confianza o "tokens ahorrados" que no salga de un mock coherente; usar el mismo patrón de alerta proactiva que ya usan los agentes especializados (`AGENTES_ESPECIALIZADOS`, campo `advertenciaIA`).

4. **Selector de motor por tarea (model-routing UI).** Documentar un control tipo "¿qué motor uso para esto?" en el editor de reglas/skills (`gali6-agentes.component.ts` ya tiene un slider de autonomía por agente — el selector de motor vive al lado). Aclarar en el spec que la resolución real interna es siempre Haiku; el selector es una superficie de producto para cuando exista routing real, no una promesa activa hoy.

5. **Fases futuras.** Referenciar el "mapa de conexiones" tipo grafo (Obsidian-like) que Catalina describió en la transcripción y que ya existe parcialmente como `ConexionesPageComponent` (gali-v5, con `agentNodes`/`platformNodes`) como Fase 2 — fusionar esa vista de grafo dentro de `gali6-conexiones-casa` más adelante, no en este spec.

6. **Límites inamovibles (extender la lista de `AlcancesIADropi.md` §VIII).** Ej.: "Gali nunca envía datos del negocio del usuario a un proveedor de IA externo sin una conexión explícita y aprobada por el usuario", "Gali nunca cambia el motor que resuelve una tarea sin que el usuario lo haya configurado así".

No se toca código en esta parte — es puramente el documento.

---

## Parte B — Arreglo de navegación + modelo de intervención de Gali por sección

### B1. Registrar las 25 rutas huérfanas en `gali-6.routes.ts`

Cada una reutiliza el componente ya existente en `gali-5/gali-v5/`, mismo patrón `loadComponent` que las demás entradas del archivo. Lista completa (confirmada por diff mecánico + lectura de `gali-v5.routes.ts`):

| Ruta faltante | Componente a reusar (gali-5) | Nota |
|---|---|---|
| `reportes/calendario` | `ReportesCalendarioPageComponent` | Reportada por Catalina |
| `mis-pedidos/ordenes-de-despacho` | `GarantiasPageComponent` (`data: { variant: 'ordenes-despacho' }`) | Reportada |
| `mis-pedidos/garantias-recolecciones` | `DropiScreenPageComponent` (`screenId: 'garantias-recolecciones'`, vía helper `screen()`) | Reportada; queda como pantalla propia (decisión: no fusionar con validador) |
| `mis-pedidos/validador-direcciones` | `ValidadorDireccionesPageComponent` | Mencionada por Catalina como destino deseado de garantías-recolecciones; ahora queda con ruta propia también |
| `marketing/configuraciones` | `ConfiguracionesMarketingPageComponent` | Reportada |
| `marketing/roax-lanzador` | `RoaxLanzadorPageComponent` | Reportada ("Lanzador de campañas") |
| `configuraciones/datos-personales` … 10 más (`seguridad`, `integraciones`, `referidos`, `configuracion-de-tienda`, `usuarios-equipo`, `dropi-testers`, `planes`, `mis-sesiones`, `historial-de-actividades`, `preferencias-cuenta`) | `DropiScreenPageComponent` por `screenId` (helper `screen()`) | Reportada como "Configurar" (ítem del icon rail) |
| `reportes/descargas` | `ReportesDescargasPageComponent` | Encontrada en la auditoría, no mencionada explícitamente — mismo arreglo mecánico |
| `cas/tickets` | `DropiScreenPageComponent` (`screenId: 'tickets'`) | Encontrada en la auditoría |
| `financiero/datos-bancarios`, `retiros-de-saldo`, `datos-facturacion`, `facturas-pendientes`, `notas-credito` | `DropiScreenPageComponent` por `screenId` | Encontradas en la auditoría |
| `micromundo` | `MicromundoPageComponent` | Encontrada en la auditoría |

Todas van dentro de `GALI_6_CHILD_ROUTES` en `src/app/pages/gali-6/gali-6.routes.ts`, siguiendo exactamente el patrón ya usado (ver `mis-pedidos/etiquetas` como referencia de una entrada ya correcta).

### B2. Mejorar el fallback del wildcard (defensa en profundidad)

`gali-6.routes.ts:295` hoy hace `{ path: '**', redirectTo: '', pathMatch: 'full' }` — silencioso, viola "Visibility of System Status" (Nielsen) y es la causa exacta de la confusión "Loy"/"Hoy". Con las rutas de B1 esto deja de dispararse en los casos reportados, pero como red de seguridad ante futuros drifts: agregar un toast/banner breve cuando el shell detecta que se llegó a Home vía un `redirectTo` no solicitado (o, más simple, loggear en consola en dev para detectarlo rápido). Mantener acotado — no es el foco de esta sesión, solo evitar que el mismo bug reaparezca en silencio.

### B3. Modelo de intervención de Gali por sección (documentar en `docs/SpecsNuevos/Gali6.md`)

Agregar una sección nueva **"Modelo de intervención de Gali por sección"** al final del archivo de estado existente (no crear otro doc — `Gali6.md` es la referencia viva de Gali 6). Aplicar el **AI-UX Trust Stack** de `ai-experience-patterns.md` y la escala de "Nivel de agencia" ya definida en `AlcancesIADropi.md` §II:

| Tipo de sección | Ejemplos | Nivel de agencia | Comportamiento del chat lateral |
|---|---|---|---|
| Operativas/transaccionales | Pedidos, Novedades, Garantías, Órdenes de despacho, Logística | Vigilante permanente (proactiva) | Banner de contexto siempre visible; acciones vía patrón *preview-then-confirm* ya usado en `pausar-campana`/`resolver-alerta` (Reversibility) |
| Analíticas | Reportes, Calendario, Financiero | Analítica + alertante | Pasiva por defecto, responde bajo demanda; alerta solo ante anomalías |
| Creación/marketing | Campañas, Automatización, Roax, Etiquetas | Generativa + confirmativa | Propone, nunca publica sin aprobación explícita (Steering + Reversibility) |
| Configuración | Configurar, Conexiones | Silenciosa / solo ayuda contextual | Gali no sugiere cambios de seguridad/facturación sin que se le pida (coherente con el límite "nunca mueve dinero sin aprobación") |
| Pantallas stub (recién arregladas en B1) | Garantías-recolecciones, los 11 de Configuraciones, CAS/Tickets, Financiero secundario | Recuperación explicada | El chat reconoce el límite: *"Estás en una vista simplificada, todavía no tengo mucho contexto aquí"* — en vez de fingir capacidad completa (Refusal & Recovery, evita el anti-patrón de calibración) |

### B4. Extender screen-awareness a 1-2 pantallas como patrón de referencia

`Gali6ScreenContextService` + `screenAwareBanner` + las reglas contextuales en `Gali6ChatService.generateResponse()` (hoy cubren `proyectos-casa` y `senales`) son el mecanismo real de "intervención de chat según lo que hay en pantalla". En esta pasada:
- Publicar contexto (`viewId`, `viewLabel`) desde **Validador de direcciones** y **Garantías** (las de mayor prioridad operativa según la tabla de B3), replicando cómo ya lo hace `proyectos-casa`.
- Agregar una regla contextual de ejemplo en `generateResponse()` para Validador de direcciones (p.ej. intención "corrige la dirección" → mismo patrón de 2 pasos que `pausar-campana`).
- El resto de las 18 pantallas quedan documentadas como backlog en la nueva sección de `Gali6.md` (tabla de B3 sirve de spec), no implementadas en este pase — evita una tarea de alcance descontrolado.

---

## Verificación

1. `ng build --configuration development` desde la raíz (con `nvm use` primero) — sin errores.
2. Levantar el dev server y navegar manualmente a cada una de las 25 rutas de B1 bajo `/gali-6/...` — confirmar que cargan su componente real y ya no caen en "Hoy".
3. Click en cada ítem del panel lateral (`dropi-section-nav`) y del icon rail (`Configurar`) desde `/gali-6` — confirmar que ninguno redirige silenciosamente.
4. Abrir el chat lateral en Validador de direcciones y Garantías — confirmar que el banner "Viendo: ..." aparece y que la regla contextual nueva responde.
5. Revisar `docs/SpecsNuevos/18.ConexionesIA.md` y la sección nueva de `Gali6.md` por completitud frente a esta lista de decisiones.

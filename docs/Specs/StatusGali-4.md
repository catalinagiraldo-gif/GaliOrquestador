# Status — Gali V4 (Re-arquitectura AI-First sobre V3)

> **Palabra clave para retomar:** `ContinuarGali4`
>
> Cuando el usuario escriba esta palabra en una conversación nueva (Claude Code chat o terminal), leer este archivo y la spec `docs/Specs/Galiv-4.md`, revisar el plan en `/Users/user/.claude/plans/apartir-de-gali-v3-humble-blum.md`, y continuar desde la siguiente fase pendiente.

---

## Snapshot

- **Spec V4:** `docs/Specs/Galiv-4.md` (refactor armonizado con V3 vivo)
- **Plan de refactor:** `/Users/user/.claude/plans/apartir-de-gali-v3-humble-blum.md`
- **Inventario V3 base:** `docs/Specs/EstadoActualGaliV3.md` + `docs/Specs/PlanGaliV3_AIFirst_Hibrido_BuilderOrquestador.md`
- **Navegación:** `navigation-map.json` (rutas registradas)
- **Galería de prototipos:** http://localhost:4200/home
- **Última actualización:** 2026-05-27
- **Rama:** `main`
- **Dev server:** `yarn start` → http://localhost:4200/gali-v3

---

## Estado por fase

| Fase | Descripción | Estado |
|---|---|---|
| **Fase 0** — Auditoría y armonización | Refactor de `Galiv-4.md` reconociendo V3 implementado; análisis heurístico Nielsen + 4 AI-first; clasificación NUEVA/EVOLUCIÓN/CONSERVAR de 8 vistas | ✅ Completada |
| **Fase 1** — Las 3 preguntas sobre el tri-pane V3 | Vista 5 (Objetivo) · Vista 3 (Comunidad) · Vista 4 (Mi Stack) | ✅ Completada |
| **Fase 2 (Vista 8)** — Constructor de Bloques Custom | Modal split chat 40% + preview 60% sobre `block-registry.ts` V3 + integración cross-view Tier 1 (Inicio · sidebar · ⌘K · slash · welcome render) | ✅ Completada |
| **Fase 2 (Refactor shell)** — Right Panel Cursor-style | Chat de Gali + business-context → panel lateral derecho colapsable (⌘J). Sidebar real (`gali-navigator`) ahora tiene entrada al Constructor. Welcome con sección destacada "Bloques de Gali" | ✅ Completada |
| **Fase 2 (Vista 8 — Tier 2 flow)** — Cross-view integration | Vista nueva · Mi Stack · Builder · Mapa + queryParam preset | ✅ Completada |
| **Fase 2 (Engine real)** — Specs para backend | `docs/Specs/EngineRealV4.md` con contratos: Claude API streaming · OAuth real · Recipes engine · Memoria backend · Engine de bloques custom · Marketplace endpoints | ✅ Completada (spec doc) |
| **Fase 3 (Tab Bloques)** — Marketplace de bloques de comunidad | Tab "Bloques de comunidad" en `/mercado` + 11 bloques mock + install flow que clona al store local | ✅ Completada |
| **Fase 3 (resto)** — Templates de recipes · API · programa builders | "Compartir recipe" CTA en builder + API blocks en paleta + `/gali-v4/builders` con perfil completo | ✅ Completada |
| **Fase 4** — Expansión multi-plataforma + data flywheel | `/gali-v4/roadmap` con timeline 5 hitos post-V4 · Data flywheel visible en Comunidad declarando origen de datos | ✅ Completada (prototipo + spec) |

---

## Lo que está vivo (Fases 0 y 1)

### Fase 0 — Spec refactorizada
- `docs/Specs/Galiv-4.md` 1018 líneas con:
  - Parte 0 nueva — Inventario V3 vivo (rutas + servicios + componentes + mocks + tokens)
  - Parte 1 reescrita — Nielsen 10 + 4 AI-first agentic-UX (transparencia razonamiento, control humano, incertidumbre, memoria explicable) + tabla 14×8 vistas
  - Parte 2 conservada con sub-bloque "Qué se reutiliza de V3" por cada pregunta
  - Parte 3.2/3.3 modificadas para reconocer evolución del tri-pane V3
  - Parte 4 con clasificación 🔴 NUEVA / 🟡 EVOLUCIÓN / 🟢 CONSERVAR + bloque "Estado V3 → Delta V4" por vista
  - Parte 5.2 con columna Estado (mock V3 vs engine real V4)
  - Parte 7 reemplazada — Roadmap incremental V3→V4 con reuso explícito + fases descartadas que ya entrega V3
  - Cierre con "Tensiones a resolver con equipo"

### Fase 1 — 3 vistas navegables en el shell V3

| Vista | Ruta | Archivos clave |
|---|---|---|
| **Vista 5 — Mi Objetivo → Roadmap** 🔴 NUEVA | `/gali-v3/objetivo` | `pages/gali-v3/objetivo/objetivo.component.{ts,html,scss}` · `services/gali-v3/objetivo.service.ts` · `mocks/gali-v3/objetivos.json` · types en `services/gali-v3/types.ts` |
| **Vista 3 — Comunidad / Líder Virtual** 🔴 NUEVA | `/gali-v3/comunidad` | `pages/gali-v3/comunidad/comunidad.component.{ts,html,scss}` · `services/gali-v3/comunidad.service.ts` · `mocks/gali-v3/comunidad.json` · types en `services/gali-v3/types.ts` |
| **Vista 4 — Mi Stack personal** 🟡 EVOLUCIÓN | `/gali-v3/mi-stack` | `pages/gali-v3/mi-stack/mi-stack.component.{ts,html,scss}` · `services/gali-v3/mi-stack.service.ts` · `mocks/gali-v3/mi-stack.json` |
| **Vista 8 — Constructor de Bloques Custom** 🔴 NUEVA (Fase 2) | `/gali-v3/bloque-builder` | `pages/gali-v3/bloque-builder/bloque-builder.component.{ts,html,scss}` · `services/gali-v3/bloque-builder.service.ts` · `mocks/gali-v3/bloques-custom-ejemplos.json` · tipos en `services/gali-v3/types.ts` |

### Cambios transversales aplicados
- **Sidebar V3** (`components/gali-v3/gali-v3-sidebar/`) — 4 entradas nuevas en sección Gali: Mi Objetivo · Comunidad · Mi Stack · Constructor (+ ícono `constructor` SVG)
- **app.routes.ts** — rutas registradas para las 4 vistas (objetivo, comunidad, mi-stack, bloque-builder)
- **navigation-map.json** — entradas `mi-objetivo`, `comunidad-en-vivo`, `mi-stack`, `bloque-builder` agregadas
- **proximos-pasos.service.ts** — 4 contextos nuevos (`objetivo`, `comunidad`, `mi-stack`, `bloque-builder`) + breadcrumbs e iconos
- **gali-v3-shell.component.ts** — routing context route para `/bloque-builder`
- **prototype-gallery** — 4 tarjetas nuevas (V4 · V5 · V4 · V3 · V4 · V8 · V4)

### Heurísticas AI-first cumplidas en Fase 1
- **H#11 Transparencia del razonamiento** — Razonamientos expandibles, fuentes citadas anonimizadas, insights generados visibles
- **H#13 Gestión de incertidumbre** — Confianza con color (sage/amber/rust) en cada señal, paso, score
- **H#14 Memoria explicable** — Reutiliza `memory.service.ts` V3 sin tocarlo (chips editables)
- **H#5 Prevención de errores** — Stack tiene alertas explícitas de compliance (banca) y privacidad (Gmail); conexión reversible
- **H#12 Control humano** — Toggle desconectar; toggle modo mentor; ajustar objetivo cuando quieras

### Heurísticas AI-first cumplidas en Fase 2 (Vista 8)
- **H#10 Reconocimiento sobre recuerdo** — El novato no enfrenta un input vacío: 5 ejemplos chips con prompt + preview demo (ventas por ciudad, margen efectivo, cohorts, fuga de pedidos, proyección Gali)
- **H#11 Transparencia del razonamiento** — Cada preview muestra "Razonamiento de Gali" expandible con la lógica de filtros, fuentes y supuestos
- **H#13 Gestión de incertidumbre** — Badge "Datos simulados" / "Datos reales" siempre visible + Badge "Confianza Gali %" con color tier (sage ≥80, amber 60-79, rust <60), clickeable para que Gali explique por qué
- **H#5 Prevención de errores** — Cada bloque muestra costo computacional estimado (registros + ms) y advertencia cuando supera umbral antes de "Guardar"
- **H#12 Control humano** — Toggle Modo Chat / Modo Manual, cancelar sin guardar, toggle compartir-con-comunidad opt-in

---

## Inventario Vista 8 (detalle)

### Mock data — `mocks/gali-v3/bloques-custom-ejemplos.json`
- `ejemplos_iniciales[5]` — chips de arranque para el novato
- `fuentes_disponibles[6]` — Dropi core (pedidos, productos, cartera), Stack Personal (campañas), Comunidad anonimizada, Memoria de Gali. Cada fuente declara `campos`, `origen`, `confianza_dato`, `requiere_stack?`
- `tipos_visualizacion[8]` — métrica, barras, barras agrupadas, líneas, tabla, funnel, cohort heatmap, lista top
- `previews_demo{5}` — datos completos pre-calculados por ejemplo (categorias / filas / cohortes / pasos / series) con `razonamiento_gali`, `confianza_gali`, `costo_computacional`
- `respuestas_gali_iteracion{5}` — mock de respuestas a refinamientos (ordenar por crecimiento, filtrar por Meta, cambiar viz, comparar mes anterior, explicar confianza)

### Servicio — `services/gali-v3/bloque-builder.service.ts`
Signals: `modo`, `bloque`, `preview`, `historial`, `fuentes`, `visualizaciones`, `ejemplos`, `datosReales`, `compartirComunidad`, `bloquesGuardados`
Computed: `hayPreview`, `fuenteActiva`, `visualizacionActiva`, `puedeGuardar`, `advertenciaCosto`
Métodos públicos: `aplicarEjemplo`, `enviarPrompt`, `cambiarFuente`, `cambiarVisualizacion`, `cambiarVentana`, `agregarFiltro`, `removerFiltro`, `toggleDatosReales`, `toggleCompartir`, `guardar`, `explicarConfianza`, `reset`
Persistencia: `localStorage` con clave `gali_v3_bloques_custom`

### Tipos agregados a `services/gali-v3/types.ts`
`BloqueCategoria`, `BloqueVisualizacion`, `BloqueVentanaTemporal`, `BloqueModoConstruccion`, `BloqueOrigenFuente`, `BloqueFuente`, `BloqueTipoVisualizacion`, `BloqueFiltro`, `BloqueOrdenamiento`, `BloqueCostoComputacional`, `BloqueChatMessage`, `BloqueEjemplo`, `BloqueCustom`, `BloquePreviewData`, `BloquePreviewState`

### Componente — `pages/gali-v3/bloque-builder/`
- Layout `grid-template-columns: minmax(380px, 40%) 1fr` (collapse a 50/50 en <980px)
- 5 render-paths de preview: barras agrupadas con leyenda · tabla con hover · cohort heatmap con intensidad de fondo · funnel con drop% por etapa · líneas SVG con serie de proyección punteada
- ⌘+↵ envía el prompt del chat (handler en `onPromptKey`)
- Toast de confirmación al guardar con CTA "Ir al Inicio →" (auto-fade 6s)
- Tokens 100% de `_gali-v3-tokens.scss` (no se inventan colores)

---

## Flujo de usuario integrado Vista 8

> Auditoría post-construcción: la Vista 8 estaba aislada (sólo accesible desde sidebar y gallery, sin output visible en otras pantallas). Esta sección documenta cómo se cerró el flujo end-to-end en la sesión 2026-05-27.

### Puntos de entrada al Constructor

| Origen | CTA | Estado |
|---|---|---|
| **Inicio** `/gali-v3` | Card "✦ Bloques con Gali" (4ª card en `.welcome__cards`) | ✅ Vivo |
| **Inicio** `/gali-v3` | Sección "Mis bloques custom" → "Crear otro →" (o "Empezar →" si vacía) | ✅ Vivo |
| **Sidebar V3** (cualquier ruta) | Entrada "Constructor" en sección Gali | ✅ Vivo |
| **Command Palette** `⌘K` | "Crear bloque custom con Gali" en grupo Crear | ✅ Vivo |
| **Command Palette** `⌘K` | Bloques guardados aparecen en grupo "Mis Bloques" (buscables) | ✅ Vivo |
| **Chat de Gali** (cualquier ruta) | Slash command `/bloque-nuevo` | ✅ Vivo |
| **Chat de Gali** (inicio) | Prompt sugerido "Construye un bloque que muestre ventas por ciudad" | ✅ Vivo |
| **Gallery** `/home` | Card GALI-V4 · V8 | ✅ Vivo |
| **Vista nueva** `/vista/nueva` | "Componer vista con bloque custom" — referenciar bloque guardado como widget | ⏳ Tier 2 |
| **Mi Stack** `/mi-stack` | "Crear bloque con datos de [tool conectado]" cuando se conecta una plataforma | ⏳ Tier 2 |
| **Builder** `/builder` | "Output: guardar resultado como bloque custom" en una recipe | ⏳ Tier 2 |
| **Mapa** `/mapa` | Nodo "Constructor" en zona Gali Core | ⏳ Tier 2 |

### Flujo post-acción

- **Guardar** → bloque persiste en `localStorage` con clave `gali_v3_bloques_custom` → aparece automáticamente en:
  - Sección "Mis bloques custom" del Inicio (`welcome-artifact`)
  - Grupo "Mis Bloques" del Command Palette
  - Toast con CTA explícito "Ir al Inicio →" para cerrar el loop
- **Cancelar** → navega a `/gali-v3` sin guardar; el draft se descarta
- **Compartir con comunidad** (toggle) → el flag queda en el bloque guardado, pero el endpoint de publicación al marketplace es **Fase 3** (no implementado)

### Heurísticas de flujo cubiertas

- **H#7 Flexibilidad y eficiencia** — el usuario experto puede usar ⌘K o `/bloque-nuevo` desde cualquier vista; el novato sigue el camino visual desde el Inicio
- **H#1 Visibilidad del estado del sistema** — los bloques guardados son siempre visibles en el Inicio; ya no hay output "perdido" en localStorage
- **H#4 Consistencia** — patrón visual idéntico al de "Plantillas para ti" y "Atajos rápidos" del welcome
- **H#10 Reconocimiento sobre recuerdo** — el primer card del welcome cuando no hay bloques guardados invita explícitamente con copy descriptivo, no requiere recordar la ruta

### Archivos tocados en esta integración

```
mocks/gali-v3/chat-prompts.json                                          → /bloque-nuevo global + prompts contextuales inicio + ctx bloque-builder
src/app/services/gali-v3/chat.service.ts                                 → handler navegación slash command
src/app/components/gali-v3/artifacts/welcome-artifact.component.ts       → inject GaliBloqueBuilderService + signals bloquesCustom/bloquesCustomTop
src/app/components/gali-v3/artifacts/welcome-artifact.component.html     → card "Bloques con Gali" + sección "Mis bloques custom" (vacía + con items)
src/app/components/gali-v3/artifacts/welcome-artifact.component.scss     → grid 4 cols (era 3) + welcome__card--construct + welcome__custom-*
src/app/components/gali-v3/shell/command-palette.component.ts            → inject service + "Crear bloque custom" + iterar bloquesGuardados()
src/app/pages/gali-v3/bloque-builder/bloque-builder.component.html       → toast con cuerpo + CTA "Ir al Inicio →"
src/app/pages/gali-v3/bloque-builder/bloque-builder.component.scss       → estilos builder__toast-{icon,body,cta}
src/app/pages/gali-v3/bloque-builder/bloque-builder.component.ts         → timeout toast 3s → 6s
navigation-map.json                                                       → origin_points[7] + post_action_flow del entry bloque-builder
```

---

## Cierre total V4 — Fases 2 engine + 3 resto + 4 (2026-05-27 · sesión 7)

> Ejecución de todas las fases pendientes en una sola sesión.

### Fase 2 (Engine real) — Spec para backend ✅

**Archivo:** `docs/Specs/EngineRealV4.md` (~470 líneas).

Contratos definidos:
1. **Chat real con Claude API** — SSE streaming, eventos `token`/`reasoning`/`artifact`/`done`, prompt caching obligatorio, fallback con retry
2. **OAuth real** — tabla con 7 plataformas (Meta · TikTok · Google Ads · Sheets · WhatsApp · Shopify · Webhook), flujo popup + WebSocket event de confirmación, scopes mínimos
3. **Recipes engine** — Temporal/Airflow para evaluación, schemas tipados anti-error, dry-run obligatorio, cost estimate antes de activar, rollback últimas 10 acciones
4. **Memoria backend** — Postgres JSONB con optimistic locking, thread IDs por proyecto, audit log
5. **Engine de bloques custom** — endpoint `/api/gali/bloques/preview` con cache 5min, K-anonymity ≥ 50 para fuente comunidad
6. **Marketplace endpoints** — publish/install/list/rating con moderación primeros 30 días manual

Incluye: 4 stages de despliegue, métricas de éxito (P95 latencies), tabla de riesgos+mitigaciones, 5 decisiones pendientes con equipo.

### Fase 3 (resto) — Recipes compartidas + API blocks + Builders ✅

**A. Compartir recipe desde Builder**
- Botón `.builder__share-recipe` en `builder.component.html` junto a "Ejecutar"
- Método `compartirRecipe()` que muestra toast con CTA "Ver en mercado →"
- Mock: en engine real → POST /api/gali/marketplace/publish con recipe_id

**B. API blocks arrastrables en Builder**
- 4ª tab "⛁ API" en la paleta del builder
- 8 endpoints mock en `flow-blocks-catalog.json#api_blocks`:
  - 4 Dropi-core (Pedidos list/update · Catálogo search · Wallet balance)
  - 2 Comunidad con K-anonymity threshold (trending · benchmark)
  - 2 Claude (analyze · generate)
- Cada bloque API muestra: endpoint REST, auth method, rate limit, threshold de anonimidad
- Drag-and-drop al canvas igual que triggers/actions
- Tipo `ApiBlockDef` en `types.ts` + propiedad opcional `api_blocks` en `FlowBlocksCatalog`

**C. Programa de builders `/gali-v4/builders`**
- Mock `mocks/gali-v3/builder-profile.json` con perfil completo: "Operador Medellín · Tier Plata · $1.84M lifetime · #23 global · #4 nicho"
- Hero con identidad anonimizada + tier card lateral con bar de progreso al siguiente nivel
- Stats row (6 cards: items, instalaciones, rating, ranking global, ranking nicho, trending score)
- 6 badges desbloqueados con tier color (bronze/silver) — `🎯 Primera publicación`, `💯 100 instalaciones`, `🏆 1.000 instalaciones`, `⭐ Rating ★4.8+`, `🥉 Top 10 nicho`, `💰 Primer $1M ganado`
- Tabla de 7 items publicados (4 bloques + 3 recipes) con instalaciones, rating, ganancias, fecha
- Feed "Instalaciones recientes" en tiempo real con fee por instalación
- Sección "Camino a Builder Oro" con 4 requisitos + barra de progreso por cada uno
- Footer CTAs: "Construir + publicar otro bloque" + "Compartir una recipe"

### Fase 4 — Roadmap + Data flywheel ✅

**A. Página `/gali-v4/roadmap`**
- Mock `roadmap-post-v4.json` con 5 hitos post-V4:
  - **V4.1 — Engine real (Q3 2026)** — backend implementation
  - **V4.2 — Monetización builders (Q3-Q4 2026)** — revenue share 70/30, tiers Bronce→Platino
  - **V5.0 — App iOS nativa (Q4 2026 - Q1 2027)** — path Escala/Power
  - **V5.1 — Data flywheel (Q1-Q2 2027)** — recipes comunidad alimentan Líder Virtual
  - **V6.0 — Ecosistema abierto / SDK (2027+)** — visión partner Dropi + MercadoLibre + Shopify
- Cada hito declara: estado (en_planeacion/diseño/exploración/concepto/visión), fecha objetivo, items concretos, dependencias, riesgos
- Timeline visual con dots conectados por gradient (orange → terracota → amber → sage)
- Sección "Principios no-negociables" con 4 reglas que aplican a toda fase futura
- Stagger animation 100ms entre fases

**B. Data flywheel visible en Comunidad**
- `mocks/gali-v3/comunidad.json` → resumen_lider_virtual extendido con objeto `data_flywheel`
- Hero de `/gali-v4/comunidad` muestra sección `.comunidad__flywheel`:
  - 4 stats: 312 recipes activas aportando · 142 bloques compartidos · 87 vendedores publicando · K≥50 anonimización
  - Texto explicativo: "Las señales se alimentan en tiempo real de recipes activas + bloques compartidos. Cada nuevo dropshipper mejora la precisión para todos."
- Cierra el loop conceptual: V4 marketplace produce datos → V3 Comunidad los consume → V3 Comunidad inspira más recipes en V4 → ciclo virtuoso

**C. Navigator V3 extendido**
- Nueva sección "Programa V4" en `gali-navigator.component.html` con:
  - 🏆 Mi perfil de builder → `/gali-v3/builders`
  - 🗺 Roadmap post-V4 → `/gali-v3/roadmap`

### Heurísticas Nielsen cubiertas en este cierre

| H# | Aplicación |
|---|---|
| **H#1 Visibilidad** | Profile builder muestra explícitamente earnings + tier + progreso. Roadmap declara estado de cada fase. Flywheel declara de dónde vienen los datos. |
| **H#5 Prevención errores** | API blocks declaran rate limits + K-anonymity threshold visible antes de arrastrar. Engine spec define `cost_estimate` antes de activar recipe. |
| **H#11 Transparencia** | Roadmap explica dependencias y riesgos de cada hito (no solo "viene en Q3"). Flywheel explica el ciclo. Engine spec define eventos `reasoning` en streaming. |
| **H#12 Control humano** | Spec engine real obliga `Pausar` siempre visible + rollback 10 acciones. Builders puede ver "ranking nicho" para entender su posicionamiento real. |
| **H#13 Incertidumbre** | Roadmap declara estados (en_planeacion / diseño / exploración / concepto / visión) — no todo es certeza. |

### Archivos tocados — Cierre total

```
NUEVOS:
  docs/Specs/EngineRealV4.md                                            → spec backend completa
  mocks/gali-v3/builder-profile.json                                    → perfil del builder + tier + earnings
  mocks/gali-v3/roadmap-post-v4.json                                    → 5 hitos + 4 principios
  src/app/pages/gali-v3/builders/builders.component.{ts,html,scss}      → página /gali-v4/builders
  src/app/pages/gali-v3/roadmap/roadmap.component.{ts,html,scss}        → página /gali-v4/roadmap

MODIFICADOS:
  mocks/gali-v3/flow-blocks-catalog.json                                → 8 api_blocks añadidos
  mocks/gali-v3/comunidad.json                                          → data_flywheel en resumen_lider_virtual
  src/app/services/gali-v3/types.ts                                     → ApiBlockDef + FlowBlocksCatalog.api_blocks?
  src/app/pages/gali-v3/builder/builder.component.{ts,html,scss}        → tab 'api' + compartirRecipe() + toast
  src/app/pages/gali-v3/comunidad/comunidad.component.{ts,html,scss}    → sección .comunidad__flywheel
  src/app/components/gali-v3/shell/gali-navigator.component.html         → sección "Programa V4" con 2 links
  src/app/app.routes.ts                                                 → rutas /builders y /roadmap
```

---

## Fase 3 — Marketplace de bloques de comunidad (2026-05-27 · sesión 6)

> Tab "Bloques de comunidad" en `/mercado` que cierra el loop "Compartir con comunidad" del Constructor: los bloques que un dropshipper publica aparecen aquí para que otros los instalen con un click. Aprovecha el toggle "Compartir con comunidad" existente en V8.

### Mock data — `mocks/gali-v3/bloques-comunidad.json`

- **Meta:** 87 vendedores publicando · 142 bloques totales · actualizado en tiempo real
- **6 categorías filtro:** Todos · Ventas · Métricas · Pedidos · Análisis · Proyección (con counts)
- **11 bloques publicados** con datos completos:
  - ROAS real por ciudad (387 instalaciones, ★4.8)
  - Margen efectivo con fees logísticos (524 instalaciones, ★4.9)
  - Funnel de confirmación por hora
  - Fuga por transportadora
  - Cohorts de recompra trimestral
  - Ventas atribuidas por creative activo
  - Saldo proyectado a 14 días (632 instalaciones, ★4.9)
  - Novedades por tipo (publicado por aprendiz)
  - Top productos vendidos hoy
  - Ticket promedio por nicho (cruce con comunidad anonimizada)
  - Mapa de calor: pedidos por hora × día
- Cada bloque declara: `creado_por` (perfil anonimizado: "Operador Medellín · ROAS 3.2x"), `instalaciones`, `rating`, `publicado_hace`, `tags`, `confianza_promedio`, `destacado`, `requiere_stack`

### Servicio extendido — `GaliBloqueBuilderService`

Nuevos signals + métodos:
- `bloquesComunidad` — lista de bloques publicados
- `comunidadMeta` — métricas del marketplace
- `comunidadCategorias` — categorías con counts
- `estaInstalado(id)` — verifica si ya está clonado al store local
- `instalarBloqueComunidad(c)` — clona al store con id prefijo `com-installed-`, marca como `datos_simulados: true`, hereda `confianza_gali` del rating de comunidad, copia `requiere_stack` como advertencia de costo
- `desinstalarBloqueComunidad(id)` — quita del store local

Reutiliza la persistencia localStorage existente (`gali_v3_bloques_custom`) — los bloques instalados de comunidad coexisten con los construidos por el usuario.

### Tipos nuevos en `types.ts`

`BloqueComunidad`, `BloquesComunidadMeta`, `BloqueComunidadCategoria`.

### UI nueva en `/mercado`

- **4ª tab** "✦ Bloques de comunidad" con count `11`
- **Header del tab** con métrica de marketplace ("87 vendedores publicaron 142 bloques · hace 2 min") + CTA "Construir uno propio" que navega al Constructor
- **Filtros por categoría** (chips horizontales con count por categoría, estado activo en naranja)
- **Sección "Destacados de la comunidad"** — 4 bloques con `destacado: true`, cards más grandes (380px min), gradient warm, badge "★ Top"
- **Sección "Todos los bloques"** — el resto, cards 320px min, layout más denso
- **Card de bloque** muestra: ícono · título · categoría/visualización · descripción · tags · stack requerido (chip ámbar) · meta (rating con estrellas, instalaciones, autor anonimizado, tiempo de publicación) · CTA "Instalar en mi lienzo"
- **Estado is-installed** cuando ya lo instalaste: card con tinte sage + botón "✓ Instalado · quitar" (rust en hover)
- **Empty state** con copy "Sé el primero — construye uno y compártelo" + CTA Constructor
- **Toast post-instalación** con ícono ✓ + CTA "Ir al Inicio" para ver el bloque en el lienzo
- **Stagger animation** 60ms entre cards al filtrar/cargar

### Heurísticas Nielsen cubiertas

| H# | Aplicación |
|---|---|
| **H#1 Visibilidad** | El bloque instalado aparece inmediatamente en welcome + rpanel + ⌘K |
| **H#4 Consistencia** | Misma estructura de card que Plantillas/Agentes (header + body + footer + CTA) |
| **H#7 Flexibilidad** | Filtros por categoría + búsqueda global de mercado (textinput compartido entre tabs) |
| **H#10 Reconocimiento** | Vista previa de qué hace cada bloque (tipo viz declarado + tags + descripción) antes de instalar |
| **H#11 Transparencia** | Razonamiento Gali en el bloque instalado: "Autor original: X. Y instalaciones. Rating Z/5" — el usuario sabe de dónde vino el bloque |
| **H#13 Incertidumbre** | `confianza_promedio` de la comunidad heredada al bloque instalado, visible como tier color |

### Flujo end-to-end del marketplace

```
[Constructor V8]                     [Mercado tab "Bloques"]
toggle "Compartir            ───►    11 bloques listables
con comunidad" + Guardar             rating + instalaciones
                                     filtro por categoría
                                            │
                                            ▼
                                     [Instalar en mi lienzo]
                                     clona al localStorage
                                     hereda confianza
                                            │
                                            ▼
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                       Welcome Inicio   Right panel    ⌘K palette
                       "Mis bloques"    "Mis bloques"  grupo bloques
```

### Archivos tocados — Fase 3

```
mocks/gali-v3/bloques-comunidad.json                                  → 11 bloques + meta + categorías filtro
src/app/services/gali-v3/types.ts                                     → BloqueComunidad + BloquesComunidadMeta + BloqueComunidadCategoria
src/app/services/gali-v3/bloque-builder.service.ts                    → signals bloquesComunidad/comunidadMeta + estaInstalado() + instalarBloqueComunidad() + desinstalarBloqueComunidad()
src/app/pages/gali-v3/mercado/mercado.component.ts                    → tab 'bloques' + filtros + ratingStars helper + instalarBloque action
src/app/pages/gali-v3/mercado/mercado.component.html                  → sección completa del tab Bloques con destacados/resto/empty/toast
src/app/pages/gali-v3/mercado/mercado.component.scss                  → 350+ líneas estilos mercado__bloques-*
```

### Lo que aún falta de Fase 3

- **Compartir recipe** — link/código instalable de recipes del Builder a la comunidad
- **API documentada como bloques arrastrables** — endpoints de Dropi expuestos como bloques al builder
- **Programa de builders** — sistema de reputación/monetización para creadores

Decisión: estas piezas pueden quedar como specs separadas si Cata quiere navegar primero el prototipo del marketplace de bloques con el equipo.

---

## Tier 2 cross-view del Constructor (2026-05-27 · sesión 5)

> **Status doc recomendaba** cerrar las 4 integraciones cross-view pendientes (Vista nueva · Mi Stack · Builder · Mapa). Ejecutadas en esta sesión.

### 1. Constructor acepta `queryParams` para preset

`bloque-builder.component.ts` ahora lee `route.queryParamMap`:
- `?fuente=campanas` → precarga la fuente al abrir
- `?prompt=...` → envía el prompt automáticamente para que Gali empiece a construir
- `?origen=mi-stack|builder` → reservado para mostrar breadcrumb contextual futuro

Permite que otras vistas naveguen al constructor con contexto pre-cargado.

### 2. Vista nueva (`/vista/nueva`) muestra los bloques custom como widgets

`vista.component.{ts,html,scss}`:
- Inject `GaliBloqueBuilderService` → expone `bloquesCustom`
- Nueva sección `.vista__custom-blocks` después de las plantillas
- Cuando hay bloques: grid con chips (ícono + título + categoría) + CTA "Construir un bloque nuevo"
- Cuando no hay: estado vacío con copy "¿Necesitas un dato que no está en los widgets default?" + CTA al constructor

**Heurística cubierta:** H#7 reutilización — el output de V8 se reusa como input de V6.

### 3. Mi Stack: CTA contextual "Construir bloque con [tool]"

`mi-stack.component.{ts,html,scss}`:
- Nuevo botón `.stack__btn-construct` visible solo cuando `p.estado === 'conectada'`
- Mapeo plataforma → fuente del constructor:
  - `categoria === 'ads'` → `fuente=campanas`
  - `categoria === 'finanzas'` → `fuente=cartera`
  - `categoria === 'ecommerce'` → `fuente=productos`
  - resto → sin fuente preset, Gali infiere del prompt
- Navega a `/gali-v3/bloque-builder?fuente=...&prompt=Construye+un+bloque+que+use+datos+de+[nombre]&origen=mi-stack`

**Heurística cubierta:** H#7 + H#1 — al conectar una tool, el siguiente paso natural (crear un bloque) es visible inline.

### 4. Builder: footer "Guardar resultado como bloque custom"

`builder.component.{ts,html,scss}`:
- Footer `.builder__output-bloque` debajo del log de ejecución (solo visible si la recipe se ejecutó)
- Inferencia de fuente desde los `blockId` de los nodos:
  - Nodos con `meta|tiktok|google|ads|roas|ctr|campan` → `fuente=campanas`
  - Nodos con `pedido|orden|novedad|entrega` → `fuente=pedidos`
- Navega a `/gali-v3/bloque-builder?fuente=...&prompt=Convierte+el+resultado+de+la+recipe+"X"+en+un+bloque&origen=builder`

**Heurística cubierta:** H#7 — la recipe automatiza el cálculo, el bloque lo visualiza. Cierra el loop trigger → action → output visible.

### 5. Mapa del negocio: nodo "Constructor" en zona Gali Core

`mocks/gali-v3/business-map.json`:
- Nuevo nodo `n-constructor` en `zona: 'gali-core'` entre `n-vista` y `n-retos`
- KPI: `"V8 · 5 ejemplos · datos sim/real"`
- Ruta: `/gali-v3/bloque-builder`
- Aparece automáticamente en el grafo del mapa (la `BusinessMapService` ya itera los nodos del JSON)

**Heurística cubierta:** H#1 visibilidad — el Constructor ahora forma parte del mapa mental del sistema, no es una pestaña oculta.

### Flujo cerrado end-to-end

```
                ┌──────────────────┐
                │  CONSTRUCTOR V8  │
                │  /bloque-builder │
                └────────▲─────────┘
                         │
   ┌─────────────────────┼─────────────────────┐
   │                     │                     │
┌──┴───┐  ┌──────────┐ ┌─┴────────┐  ┌────────┴──┐
│Inicio│  │Mi Stack  │ │Builder   │  │Mapa Neg.  │
│ ✦card│  │tool conec│ │ recipe   │  │ nodo core │
└──┬───┘  └──────────┘ └──────────┘  └───────────┘
   │
   ▼
┌─────────────────────┐
│ Vista nueva /vista  │
│  (bloques widgets)  │
└─────────────────────┘
```

Ahora el bloque custom es **producible** desde 4 contextos distintos y **consumible** en 3 destinos (Inicio welcome, Vista compuesta, ⌘K palette). Output ya no es huérfano.

### Archivos modificados Tier 2

```
src/app/pages/gali-v3/bloque-builder/bloque-builder.component.ts  → ActivatedRoute + queryParamMap subscribe
src/app/pages/gali-v3/vista/vista.component.ts                    → inject GaliBloqueBuilderService
src/app/pages/gali-v3/vista/vista.component.html                  → sección .vista__custom-blocks
src/app/pages/gali-v3/vista/vista.component.scss                  → estilos custom-blocks
src/app/pages/gali-v3/mi-stack/mi-stack.component.ts              → construirBloqueDesdeStack() + fuenteParaPlataforma()
src/app/pages/gali-v3/mi-stack/mi-stack.component.html            → botón .stack__btn-construct
src/app/pages/gali-v3/mi-stack/mi-stack.component.scss            → estilos btn-construct
src/app/pages/gali-v3/builder/builder.component.ts                → guardarOutputComoBloque() con inferencia de fuente
src/app/pages/gali-v3/builder/builder.component.html              → footer .builder__output-bloque
src/app/pages/gali-v3/builder/builder.component.scss              → estilos output-bloque + cta
mocks/gali-v3/business-map.json                                    → nodo n-constructor en gali-core
```

---

## Fix responsive crítico (2026-05-27 · sesión 4)

> **Auditoría visual reveló 2 bugs del refactor del shell** (sesión 2):

### Bug 1 — Navigator overflow tapaba el canvas

**Síntoma:** el menu lateral izquierdo (navigator de 248px) se desbordaba sobre el área de contenido principal en TODOS los viewports.

**Causa:** al refactorizar el shell para el right panel, dejé el grid en `$gv3-navigator-w-collapsed` (60px) — pero el componente `gali-navigator` tiene `:host { width: $gv3-navigator-w }` (248px) hard-coded. Resultado: 188px del navigator se renderizaban por encima del canvas, tapando el contenido.

**Fix:**
- `gali-v3-shell.component.scss` → grid corregido a `$gv3-navigator-w` (248px) base
- `gali-navigator.component.scss` → `:host` cambiado de `width: $gv3-navigator-w` → `width: 100%` (respeta el grid column del shell)
- `gali-business-context.component.scss` → `:host` cambiado de `width: $gv3-business-w` → `width: 100%` (ahora vive dentro del rpanel acordeón) + borde izquierdo removido (ya no es panel standalone)

### Bug 2 — Chat de Gali fijo en 220px, no se expandía

**Síntoma:** dentro del right panel, el chat ocupaba solo 220px de alto (o 360px si estaba expandido) — el resto del panel quedaba vacío.

**Causa:** `gali-chat.component.scss` tiene `.chat { height: $gv3-chat-h }` (220px fijo) heredado del diseño bottom-bar original. Cuando se metió en el right panel (que tiene full height), la altura fija ganaba.

**Fix:** override con `::ng-deep` en `gali-right-panel.component.scss`:
```scss
::ng-deep > gali-chat { height: 100%; display: block; border-top: 0; }
::ng-deep .chat, ::ng-deep .chat.is-expanded {
  height: 100% !important;
  min-height: 0;
}
::ng-deep .chat__messages {
  min-height: 0;
  overflow-y: auto;
}
```
El chat es `display: grid` con `grid-template-rows: auto 1fr auto auto` — al darle `height: 100%`, la fila `1fr` (messages) absorbe todo el alto disponible y los mensajes scrollean naturalmente.

### Breakpoints responsive nuevos

Aplicados en `gali-v3-shell.component.scss`:

| Viewport | Navigator | Canvas | Right panel |
|---|---|---|---|
| **> 1440px** | 248px | flex | 380px abierto / 40px chip |
| **1280-1440px** | 248px | flex | 340px abierto / 40px chip |
| **1024-1280px** | 220px | flex | 320px abierto / 40px chip |
| **768-1024px** | 200px | flex | 360px **overlay absoluto** cuando abierto (no roba ancho al canvas) |
| **< 768px** | hidden | flex | 100vw / max 380px overlay |

### Heurísticas Nielsen ahora cubiertas (responsive)

| H# | Antes | Después |
|---|---|---|
| **H#8 Diseño minimalista** | Navigator tapaba 188px del canvas en todos los tamaños | ✅ Navigator respeta su columna del grid |
| **H#7 Flexibilidad** | Chat 220px fijo aún teniendo 600px+ disponibles | ✅ Chat ocupa 100% del rpanel |
| **H#1 Visibilidad** | Contenido escondido detrás del navigator overflow | ✅ Canvas siempre visible al 100% |
| **Responsive** | Solo 2 breakpoints (1399, 1100) sin overlay | ✅ 5 breakpoints + overlay en tablets pequeñas/mobile |

### Archivos modificados

```
src/app/pages/gali-v3/gali-v3-shell.component.scss                       → grid 248px + 5 breakpoints responsive
src/app/components/gali-v3/shell/gali-navigator.component.scss           → width 100% (era $gv3-navigator-w)
src/app/components/gali-v3/shell/gali-business-context.component.scss    → width 100% + border-left removido
src/app/components/gali-v3/shell/gali-right-panel.component.scss         → ::ng-deep override chat height 100%
```

---

## Consolidación de versiones (2026-05-27 · sesión 3)

> **Problema:** la `prototype-gallery` tenía 7 cards mezclando `GALI-V4 · V8`, `GALI-V4 · V4`, `GALI-V4 · V3`, `GALI-V4 · V5`, `GALI-V3`, `GALI-V2`, `AI-FIRST` — imposible saber cuál es la versión actual.
> **Solución:** una sola card destacada "Gali V4" con shortcuts a sus 8 vistas internas. Versiones anteriores colapsadas en `<details>` archivadas.

### Cambios aplicados

1. **`prototype-gallery` reescrita:**
   - Una sola `<article class="featured">` con CTA grande "Abrir Gali V4" → `/gali-v4`
   - 8 atajos directos a vistas clave (Inicio · Constructor · Objetivo · Comunidad · Mi Stack · Builder · Mercado · Mapa) con badge de versión (V8/V5/V3/V4/V6/V7/⌘M)
   - 6 capacidades del shell V4 listadas (right panel · ⌘K · slash commands · memoria · heurísticas · navigator)
   - `<details>` colapsable "Versiones anteriores" con GALI-V2 y AI-FIRST (archivadas, opacidad 0.78)
   - GALI-V3 ya no aparece como card separada — es la base de V4, no una versión distinta

2. **Ruta alias `/gali-v4`** en `app.routes.ts`:
   - `/gali-v4` → redirect `/gali-v3`
   - `/gali-v4/:childPath` → redirect `/gali-v3/:childPath`
   - `/gali-v4/:childPath/:grandchildPath` → redirect `/gali-v3/:childPath/:grandchildPath`
   - Permite navegar con URL "V4" sin tener que renombrar los 100+ `routerLink` internos

3. **Topbar marca la versión:**
   - Brand reescrito: `✦ Gali [V4] · Dropi orquestador`
   - Badge V4 con tinte naranja para que sea inequívoco en qué versión estás
   - `routerLink="/gali-v4"` en el brand (antes apuntaba a `/gali-v3`)

### Lo que queda accesible pero archivado

| Versión | Ruta | Estado |
|---|---|---|
| `GALI-V2` | `/gali-v2` | Archivada (legacy dark + lienzo 4 zonas) |
| `AI-FIRST` | `/gali` | Archivada (workspace AI-First original) |
| `GALI-V3` (base) | `/gali-v3` | Sigue funcionando — es la implementación física de V4 |

### Lo que verás al cargar `/home`

```
┌─────────────────────────────────────────────────────────────────┐
│  Prototype Gallery                                               │
│  La versión actual del prototipo es Gali V4. Las versiones      │
│  anteriores quedan archivadas abajo.                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ✦ VERSIÓN ACTUAL · GALI V4                       activo  │  │
│  │                                                            │  │
│  │ Gali V4 — Orquestador AI-first sobre Dropi                │  │
│  │ Re-arquitectura AI-first sobre V3 vivo. Shell con right…  │  │
│  │                                                            │  │
│  │ Vistas de V4                                              │  │
│  │  ┌─Inicio─┐ ┌─Constructor─V8┐ ┌─Objetivo─V5┐ ┌─Comunidad─│  │
│  │  └────────┘ └───────────────┘ └────────────┘ └───────────│  │
│  │  ┌─Mi Stack─V4┐ ┌─Builder─V6┐ ┌─Mercado─V7┐ ┌─Mapa─⌘M┐  │  │
│  │  └────────────┘ └───────────┘ └───────────┘ └────────┘  │  │
│  │                                                            │  │
│  │ Capacidades del shell V4                                  │  │
│  │  ✦ Right panel colapsable (⌘J)                            │  │
│  │  ✦ Sidebar navigator + Constructor                        │  │
│  │  ✦ Command Palette ⌘K                                     │  │
│  │  ✦ Memoria viva editable                                  │  │
│  │  ✦ Heurísticas H#11 + H#13                                │  │
│  │  ✦ Slash commands (/bloque-nuevo, /vista, …)              │  │
│  │                                                            │  │
│  │  [ ✦ Abrir Gali V4 → ]  o usa ⌘K dentro                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ▸ Versiones anteriores                       2 archivadas      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Refactor arquitectónico — Right Panel Cursor-style (2026-05-27 · sesión 2)

> **Driver de la sesión:** auditoría visual reveló que (1) el sidebar `gali-v3-sidebar` que estaba editando era código muerto — el sidebar real es `gali-navigator`, y (2) el shell tri-pane (sidebar 56px + canvas + business 320px + chat-bottom 220px) sobrecargaba el viewport, especialmente en el constructor que ya tiene split 40/60 propio.

### Diagrama del nuevo shell

```
┌─────────────────────────────────────────────────────────────┬────────┐
│ TOPBAR · ✦ Brand · nav · Señales [⌘J Gali ●] · Avatar      │        │
│ BREADCRUMB                                                   │  ✦    │
├──────┬───────────────────────────────────────────────────────┤ Gali  │
│ NAV  │                                                       │ Panel │
│ 56px │                CANVAS                                 │ 380px │
│      │  Welcome / Constructor / Proyecto / etc.              │       │
│      │  (full alto, sin chat-bottom robando espacio)         │ Tabs: │
│      │                                                       │ [Gali]│
│      │                                                       │ [▦   │
│      │                                                       │  Mis  │
│      │                                                       │  Bloq]│
│      │                                                       │       │
│      │                                                       │ Negoc.│
│      │                                                       │ live  │
│      │                                                       │ (↧)   │
│      │                                                       │       │
└──────┴───────────────────────────────────────────────────────┴───────┘

Estado COLAPSADO (⌘J):
┌─────────────────────────────────────────────────────────────────┬──┐
│  NAV │              CANVAS (full ancho)                          │✦ │  ← chip 40px
└─────────────────────────────────────────────────────────────────┴──┘
```

### Cambios estructurales

| Antes | Después |
|---|---|
| Shell grid: `56px 1fr 320px` (nav + canvas + business) | Shell grid: `56px 1fr 380px / 40px` (nav + canvas + rpanel toggleable) |
| Chat de Gali fijo en el bottom del `.shell__main` (220-360px) | Chat dentro del rpanel tab "Gali", scroll independiente |
| Business-context = panel derecho independiente, siempre visible | Business-context = acordeón colapsable dentro del rpanel tab Gali |
| Sin output global de bloques custom | Tab "Mis bloques" en rpanel — visible desde cualquier ruta |
| Sin atajo para colapsar chat | `⌘J` global toggle + botón en topbar `[✦ Gali ⌘J]` |
| Persistencia de UI: ninguna | `localStorage.gali_v3_rpanel` → `{open, tab, businessExpanded}` |
| Constructor con `✕` ambiguo arriba | Constructor con **`← Volver al Inicio Esc`** + breadcrumb `Inicio › ✦ Constructor` + ESC global handler + confirm si hay draft sin guardar |
| Sidebar (gali-v3-sidebar) editado por error — código muerto | Sidebar real `gali-navigator` con entrada "✦ Constructor de bloques" en sección Builder |
| Welcome con 4 cards apretadas + sección de bloques al fondo | Welcome con 3 cards originales + **sección destacada "Bloques de Gali"** arriba de Atajos (banner con gradient + CTA grande + lista lateral) |
| Constructor con `h1` $gv3-text-xl (22px) | Constructor con `h1` $gv3-text-2xl (28px) + breadcrumb $gv3-text-xs |
| Split min 380px → preview cramped | Split min 420px → preview respira |

### Auto-comportamiento del rpanel

- Al entrar a `/gali-v3/bloque-builder` → **rpanel se colapsa automáticamente** (`handlePanelAutoCollapse` en shell.ts) para que el split 40/60 tenga aire. El usuario puede reabrirlo con ⌘J si quiere.
- Persiste preferencia entre sesiones (`localStorage`).
- Inicia abierto por default la primera vez.

### Servicios y componentes nuevos

| Archivo | Propósito |
|---|---|
| `services/gali-v3/right-panel.service.ts` | Estado `{open, tab, businessExpanded}` con persistencia localStorage |
| `components/gali-v3/shell/gali-right-panel.component.ts/html/scss` | Panel con tabs Gali \| Mis bloques + acordeón Negocio en vivo + chip colapsado |

### Heurísticas Nielsen ahora cubiertas

| H# | Antes (auditoría) | Después |
|---|---|---|
| **H#1 Visibilidad del estado** | Output del constructor solo se veía en `/gali-v3` | ✅ Tab "Mis bloques" visible desde cualquier ruta |
| **H#2 Mundo real** | ✕ ambiguo (¿cierra modal o navega?) | ✅ "← Volver al Inicio" explícito |
| **H#3 Control y libertad** | Sin breadcrumb, sin esc, sin volver | ✅ Breadcrumb + ESC + `← Volver` + confirm draft |
| **H#4 Consistencia** | 3 patrones de tarjetas competían en welcome | ✅ Sección "Bloques de Gali" con su propio frame, no compite |
| **H#7 Flexibilidad** | Chat ocupaba 220-360px de alto siempre | ✅ Colapsable con ⌘J (estándar Cursor/Claude editor), persistido |
| **H#8 Diseño minimalista** | 4 superficies competían (nav + canvas + business + chat) | ✅ 3 superficies (nav + canvas + rpanel unificado) |
| **H#10 Reconocimiento sobre recuerdo** | Bloques perdidos en localStorage | ✅ Output siempre visible + empty state con CTA + ilustración SVG |

### Archivos modificados en este refactor

```
NUEVOS:
  src/app/services/gali-v3/right-panel.service.ts                       (signals + persistencia)
  src/app/components/gali-v3/shell/gali-right-panel.component.ts        (panel con tabs)
  src/app/components/gali-v3/shell/gali-right-panel.component.html      (markup tabs + acordeón + lista)
  src/app/components/gali-v3/shell/gali-right-panel.component.scss      (styles incl. animaciones)

MODIFICADOS:
  src/styles/_gali-v3-tokens.scss                                       (+tokens $gv3-rpanel-*)
  src/app/pages/gali-v3/gali-v3-shell.component.ts                      (inject rpanelSvc + auto-collapse)
  src/app/pages/gali-v3/gali-v3-shell.component.html                    (rpanel reemplaza chat+business)
  src/app/pages/gali-v3/gali-v3-shell.component.scss                    (grid dinámico is-rpanel-open)
  src/app/components/gali-v3/shell/command-palette.component.ts         (atajo ⌘J)
  src/app/components/gali-v3/shell/gali-topbar.component.ts             (toggle del rpanel)
  src/app/components/gali-v3/shell/gali-topbar.component.html           (botón ✦ Gali ⌘J)
  src/app/components/gali-v3/shell/gali-topbar.component.scss           (.topbar__rpanel-toggle)
  src/app/components/gali-v3/shell/gali-navigator.component.html        (entry Constructor en Builder section)
  src/app/components/gali-v3/artifacts/welcome-artifact.component.html  (sección bloques rediseñada)
  src/app/components/gali-v3/artifacts/welcome-artifact.component.scss  (welcome__bloques-*)
  src/app/pages/gali-v3/bloque-builder/bloque-builder.component.ts      (HostListener Esc + confirm draft)
  src/app/pages/gali-v3/bloque-builder/bloque-builder.component.html    (back btn + breadcrumb)
  src/app/pages/gali-v3/bloque-builder/bloque-builder.component.scss    (header reescrito + split 420px)
```

### Cómo ver visualmente los cambios

```bash
yarn start
# Abrir http://localhost:4200/gali-v3
# Probar: ⌘J alterna el panel · click en topbar [✦ Gali ⌘J] · entrar a /bloque-builder y ver auto-collapse · Esc para volver
```

---

## Lo que falta (Fase 2 — siguiente al retomar)

### ~~Vista 8 — Constructor de Bloques Custom~~ ✅ Completada
Construida en `/gali-v3/bloque-builder`. Ver fila en tabla "Lo que está vivo" arriba.

### Engine real reemplazando mocks (Fase 2 — scope mayor)
Estos no son prototipo navegable — son cambios de backend que requieren coordinación con el equipo:
- **Chat real con Claude API** — reemplazar las 6 respuestas mock heurísticas en `chat.service.ts` por streaming real (SSE/WebSocket)
- **Recipes engine** — reemplazar el log streamed mock en `builder/terminal` por motor real de evaluación con triggers verificables
- **OAuth real** — Meta Ads, TikTok, Google Sheets, WhatsApp Biz, Shopify, Webhook (hoy mock 3 pasos en `mi-stack.component`)
- **Memoria backend** — promover `memory.service.ts` de localStorage a backend con thread IDs persistidos

**Decisión pendiente:** estos cambios pueden quedar como specs detalladas en `docs/Specs/` para el equipo de backend, mientras el prototipo continúa con Vista 8 + Fase 3.

---

## Fase 3 — Marketplace abierto (pendiente)
- Extender `pages/gali-v3/mercado/` de 3 tabs (Plantillas/Agentes/Conexiones) a 4 (+ Bloques Custom compartidos por usuarios)
- Templates de recipes compartidas por comunidad (galería filtrable por módulo)
- "Compartir recipe" — link/código para que otros dropshippers la instalen
- API documentada como bloques arrastrables en el builder
- Programa de builders de la comunidad

## Fase 4 — Expansión (post-Fase 3)
- App iOS nativa para path Escala/Power (consume mismas APIs)
- Programa de builders monetizado
- Data flywheel: recipes de comunidad alimentan Líder Virtual (Vista 3)

---

## Cómo retomar (instrucciones para Claude)

Cuando el usuario diga `ContinuarGali4`:

1. **Leer este archivo** primero (`docs/Specs/StatusGali-4.md`).
2. **Leer la spec V4 completa** en `docs/Specs/Galiv-4.md`.
3. **Leer el plan de refactor** en `/Users/user/.claude/plans/apartir-de-gali-v3-humble-blum.md` para entender la lógica de las clasificaciones NUEVA/EVOLUCIÓN/CONSERVAR.
4. **Verificar estado del repo** con:
   ```bash
   yarn build 2>&1 | tail -10
   for r in /gali-v3/objetivo /gali-v3/comunidad /gali-v3/mi-stack /gali-v3/bloque-builder; do
     printf "%-30s " "$r"; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4200$r"
   done
   ```
5. **Identificar la siguiente fase pendiente** según la tabla "Estado por fase" arriba.
6. **Antes de empezar a construir**, preguntar al usuario qué capa de la siguiente fase quiere priorizar — opciones disponibles: Fase 2 (specs de engine real para backend), Fase 3 (marketplace abierto de bloques compartidos), o mejoras puntuales a vistas existentes.
7. **Crear tasks con TaskCreate** para las sub-fases que se ejecutarán en la sesión.
8. **Ejecutar siguiendo el protocolo de wireframe** definido en `CLAUDE.md` (Step 0 → 3) — DS Registry + navigation map + mocks + componente standalone + ruta + sidebar + verificación.

---

## Reglas duras al retomar

- **NO duplicar trabajo**: las Vistas 3, 4, 5 y 8 ya están construidas. Modificarlas solo si el usuario lo pide explícitamente.
- **NO reescribir** `Galiv-4.md` — el refactor está hecho. Solo agregar entradas a Parte 0 (inventario) si se construyen vistas nuevas.
- **Reusar V3 explícitamente** — antes de crear un servicio o componente nuevo, verificar si ya existe algo en `services/gali-v3/` o `components/gali-v3/` que sirva.
- **Heurísticas H#11 y H#13** son obligatorias en toda vista NUEVA — razonamiento expandible + badges de confianza con color.
- **Cada vista nueva** debe agregarse a: `app.routes.ts` · sidebar V3 · `navigation-map.json` · `proximos-pasos.service.ts` (RutaContexto + breadcrumb + icon) · `prototype-gallery`.
- **Tokens V3** (`_gali-v3-tokens.scss`) son la única fuente de tokens — no inventar paletas nuevas.
- **Cada fase termina con** `yarn build` limpio + curl 200 a las rutas nuevas + actualizar este archivo moviendo la fila a ✅ Completada.

---

## Próxima acción al retomar

Vista 8 está construida **y conectada al flujo end-to-end del prototipo**. Tier 1 (entry desde Inicio · sidebar · ⌘K · slash · welcome render) ✅ + Tier 2 cross-view (Vista nueva · Mi Stack · Builder · Mapa + queryParam preset) ✅. Opciones para la próxima sesión:

### ~~Opción A — Tier 2 del flujo Vista 8~~ ✅ Completada (sesión 5)

### ~~Opción C (parcial) — Tab "Bloques de comunidad" en `/mercado`~~ ✅ Completada (sesión 6)

### ~~Opción B — Fase 2 (engine real) — specs para backend~~ ✅ Completada en `docs/Specs/EngineRealV4.md` (sesión 7)

### ~~Opción C (resto) — Recipes compartidas · API blocks · Builders · Roadmap · Flywheel~~ ✅ Completada (sesión 7)

### Próxima sesión — V4 está cerrada. Decisiones a tomar:

**V4 está 100% entregada como prototipo navegable + spec de backend.** No queda nada en la tabla "Estado por fase" pendiente.

Las opciones para futuro (V4.1+) están documentadas en `/gali-v4/roadmap`:

1. **Aprobar EngineRealV4.md con backend lead** — agendar revisión técnica con equipo backend Dropi
2. **Validación con usuarios reales del prototipo** — sesiones de testing con 5-8 dropshippers operadores/estrategas en `/gali-v4/*`
3. **Empezar V4.1 (engine real)** — backend implementa los contratos según el spec doc, frontend agrega flag `BACKEND_REAL=true` y migra gradualmente
4. **Empezar V4.2 (monetización builders)** — solo cuando V4.1 + marketplace tengan tracción (≥ 200 builders activos)

Si surge un caso de uso no cubierto en las 8 vistas + páginas auxiliares, agregar una **Vista 9** siguiendo el mismo protocolo (NUEVA/EVOLUCIÓN/CONSERVAR + heurísticas H#11/H#13/H#5 obligatorias).

---

*Status Gali V4.0 · Dropi Orquestador · 2026-05-27 (sesión 7 — V4 cerrada)*
*Construido sobre V3 implementado (`/gali-v3/*` · alias `/gali-v4/*`) · Todas las fases 0-4 entregadas*
*Prototipo navegable: shell V4 + 8 vistas + Constructor + Marketplace + Builders + Roadmap · Spec backend: `docs/Specs/EngineRealV4.md`*
*Catalina Giraldo · catalina.giraldo@dropi.co · sebas@mono.la*
*Catalina Giraldo · catalina.giraldo@dropi.co · sebas@mono.la*

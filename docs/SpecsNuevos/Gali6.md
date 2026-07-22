# Gali 6 — "La Casita Definitiva" · Documento de Estado

> **Keyword de reanudación:** `ContinuarGali6`
> **Última actualización:** 2026-07-16
> **Fuentes:** `docs/SpecsNuevos/ultimate-plan.md` · `docs/SpecsNuevos/gali-projects-plan.md` · `docs/Specs/PlanChat.md` · `docs/SpecsNuevos/18.FlujoUsuarioGali6.md` · `docs/SpecsNuevos/19.ConexionesIA.md`

---

## ¿Cómo retomar?

Cuando quieras continuar el proceso de Gali 6, escribe:

```
ContinuarGali6
```

Claude leerá este archivo, verificará el estado de compilación, y continuará desde donde quedó.

---

## Qué es Gali 6

Gali 6 es la versión definitiva del hub orquestador de Dropi. Convive con Gali 5 (archivada bajo `/gali-5`) y vive en `/gali-6`. La premisa: **Gali es el Director de E-commerce que el dropshipper nunca pudo pagar** — no un dashboard, no un CRM con IA.

Ruta raíz: `/gali-6`
Carpeta: `src/app/pages/gali-6/`
Shell: `gali-6-shell.component.ts/html/scss`

---

## Estado de implementación al 2026-06-16

### ✅ TODO IMPLEMENTADO (Sprint 0-A → 0-D + Specs 13–17)

#### Shell y Chrome
- `gali-6-shell.component.*` — topbar con modo básico/experto, barra de progreso de meta, wallet toggle, icon rail 72px, section nav agrupado
- ZeroState onboarding 3 pasos (P0: meta pedidos, P1: fricción, P2: canal) + pantalla de confirmación
- Micro-onboarding modo experto: aparece primera vez que se activa, slide card oscura desde topbar derecho (`experto-slide`)
- Icon rail: `gali-6-icon-rail.component.ts` — iconos SVG de sidebar, rutas `/gali-6/*`
- Section nav filtrado por modo: oculta `centro-gali` en modo básico
- FAB flotante de Gali: `gali6-fab.component.ts`

#### Home (Bloque "Hoy")
- `gali-6/home/gali6-hoy-home.component.*`
- **Bloque 1 · Estado:** título de saludo + KPIs + badge "Semanal" + sparkline + % meta
- **Bloque 2 · Decisión:** `GaliDecisionTheaterComponent` (máx 1 decisión/día) + toast de feedback al tomar decisión + modo calma cuando está resuelta + toggle "delegar a Gali"
- **Bloque 3 · Impacto:** 4 stats de lo que hizo Gali esta semana (desde `impact-ledger.json`)
- **Bloque 4 · Palanca:** próximo paso sugerido, CTA a `/gali-6/proyectos/nuevo`

#### Proyectos (La Casita)
- `gali-6/proyectos/gali6-proyectos-casa.component.*`
- **Bloque 1 · Objetivo:** texto, tipo (escalar/diversificar/recuperar), progreso con breakdown por proyecto, submetas, botón editar
- **Bloque 2 · Check-ins de Gali:** alertas activas con nivel de urgencia, propuestas de acción
- **Bloque 3 · Recomendaciones:** señales del mock + "por qué encaja con tu objetivo" (`porqueObjetivo`)
- **Bloque 4 · Portfolio:** tabla filtrable (activos/pausados/cerrados/borradores) con estado, contribución, ROAS, salud — **stagger animation** con `animationDelay` por índice (55ms × i)
- **Modal editar objetivo:** tipo picker + texto + meta + plazo + submetas
- **Modal editar proyecto:** budget slider + 4 agentes toggle + estado

#### Nuevo Proyecto (Brújula)
- `gali-6/proyectos/gali6-nuevo-proyecto.component.*`
- Calculadora Brújula: ingresa margen, precio, costo ads → Gali calcula ROAS break-even
- Launch animation overlay al crear proyecto

#### Proyecto Detalle (Canvas)
- `gali-6/proyectos/gali-6-proyecto-detalle-page.component.*`
- Variantes de estado: `recien_lanzado`, `pausado`, `cerrado` (con postmortem), `borrador`
- Timeline de acciones del agente (`ProyectoTimelineComponent`)
- Feed de acciones de agentes

#### Señales (Signal Center)
- `gali-6/senales/` — listado de señales con filtros, detalle modal

#### Impacto (Ledger)
- `gali-6/impacto/` — historial de acciones de Gali, tiempo liberado, pesos ahorrados

#### Centro de Control (solo modo experto)
- `gali-6/centro-control/` — visible solo en modo experto vía section nav

#### Rutas operacionales (lazy, apuntan a componentes gali-5)
Todas disponibles bajo `/gali-6/*`:
`productos`, `mis-pedidos`, `logistica`, `reportes`, `financiero`, `marketing`, `cas`, `academy`, `agentes`, `skills`, `reglas`, `marketplace`, `mi-negocio`

---

## Sesión 2026-07-15 — Navegación recuperada + modelo de intervención de Gali

Trabajo hecho sobre `docs/Specs/PlanChat.md` Parte B (navegación + intervención) y Parte A
(Conexiones IA). Detalle completo abajo en §Modelo de intervención de Gali por sección; resumen
ejecutivo aquí:

- **§B1 — 25 rutas huérfanas registradas** en `gali-6.routes.ts` (el bug "Loy"/"Hoy": el sidebar
  referenciaba rutas que nunca se registraron y caían silenciosamente en Home). Incluye Calendario,
  Garantías recolecciones, Validador de direcciones, Roax Lanzador, las 11 de Configuraciones, CAS/Tickets
  y 5 de Financiero. Ver nota de conteo (20 → 25) más abajo.
- **§B2 — Defensa del wildcard.** `gali-6-shell.component.ts` compara `NavigationEnd.url` vs
  `urlAfterRedirects` y loggea en dev si algo aterriza en Home sin haberlo pedido — red de seguridad para
  que un futuro drift entre sidebar y rutas no vuelva a pasar en silencio.
- **§B3 — Modelo de intervención de Gali por sección**, tabla nueva más abajo en este documento.
- **§B4 — Screen-awareness extendida a 7 pantallas** (Validador de direcciones, Garantías/Órdenes de
  despacho, Garantías-recolecciones, Facturas pendientes + 4 pantallas más de Financiero, Configuración→
  Integraciones), con comportamientos reales de Gali (proactivo, reactivo o "recuperación explicada") en
  4 de ellas — ver tabla "Estado de implementación" más abajo.
- **Roax Lanzador rediseñado:** paso nuevo "Presupuesto" en el wizard (Target ROAS y presupuesto diario
  editables, toggle de escalamiento automático) + se conectó el botón "Continuar", que antes no tenía
  ningún `(click)` cableado.
- **Parte A — `docs/SpecsNuevos/19.ConexionesIA.md` escrito**: spec formal (visión → capas → modelo de
  tokens → selector de motor → fases → límites), puramente documento, sin código, tal como pedía el plan.

**Build:** `ng build --configuration development` limpio. Verificado también con smoke tests en
navegador real (Playwright) para las 25 rutas, el wildcard, y cada flujo de intervención.

---

## Sesión 2026-07-16 — Expansión de plan (PARTE 5) + Auditoría de diseño completa (Fases 1-3)

Dos hilos de trabajo en la misma sesión: (1) documentar la siguiente capa de la relación chat↔Dropi
sobre `18.FlujoUsuarioGali6.md`, y (2) correr `/design-audit` sobre todo `/gali-6` y ejecutar sus tres
fases de hallazgos. 17 builds limpios (`ng build --configuration development`, exit 0) a lo largo de la
sesión, uno por cada lote de cambios.

### Documento — PARTE 5 de `18.FlujoUsuarioGali6.md` (diseñado, sin código)

Nueva sección al final de ese documento, continuando la numeración de Partes 1-4:

- **Flujo H** — tab "Conexiones" condensado dentro del panel de chat (junto a Señales), extiende
  `Gali6PanelTab` con un quinto valor `'conexiones'`, calcado del patrón de `gali6-tab-senales.component.ts`.
- **Flujo I** — agentes configurables por sección: nuevo campo `apareceEn?: string[]` en
  `AgenteEspecializado`, UI de reasignación en `gali6-agentes.component.ts`, nueva mutación
  `Gali6LiveMutationsService.moverAgenteASeccion()`. Señala como bloqueante el bug ya documentado de
  `agentesEstado` (no relee `version()`).
- **Flujo J** — artefactos personalizados: el chat puede "fijar" una respuesta visual (metric/comparativa/
  tabla) en una pantalla real de Dropi vía un nuevo `Gali6ScreenArtifactsService` + componente compartido
  `<gali6-screen-artifacts>`, reusando las mismas cards que ya renderiza el chat.

`docs/SpecsNuevos/19.ConexionesIA.md` §2 se **reescribió** (con nota de changelog en el propio doc): el
diseño original ("tarjeta `tipo: 'ia'` más en el grid plano de `mcps[]`") no sostenía un mockup real que
Catalina mostró — un panel de 3 tabs LLM/Tools/MCPs con datos que no caben en el shape de `Mcp`. Ahora §2
diseña una sub-vista propia "Motor de Gali" dentro de Conexiones, con la tab LLM reusando el flujo de
conexión ya existente (`abrirPanel`/`apiKeyInput`/`conectarMcp`) para el caso "Mi propia IA".

### Quick win implementado — shortcut de Dashboard

`G6_ICON_RAIL` en `gali-6-sections.config.ts` reordena el ítem "Reportes" (ya apunta a
`/gali-6/reportes/dashboard`) a la 2ª posición, justo después de Productos, sin tocar el
`DROPI_ICON_RAIL` compartido con `/gali-v5`.

### Auditoría de diseño — Fase 1 (Crítico)

- **Migración completa de tokens legacy → `$os-*`** (el hallazgo raíz que explicaba casi todo lo demás:
  gran parte de Gali 6 seguía en el sistema de tokens de `/gali-v5` en vez del propio `_gali-os-tokens.scss`)
  en: `gali6-senales.component.scss` (doble naranja `#f49a3d`/`$os-accent` unificado), `gali-6-shell.component.scss`
  (811 líneas — topbar, ZeroState, panel contextual de Catálogo), `gali6-proyecto-detalle.component.scss`
  (875 líneas, ~225 refs), `gali6-marketplace.component.scss` (785 líneas, ~180 refs),
  `gali6-conexiones-casa.component.scss` (65 refs), `gali6-centro-control.component.scss`,
  `dashboard-financiero-page.component.scss` (1200+ líneas — incluye un bug real de hover donde el botón
  "Ejecutar plan" cambiaba de naranja al pasar el mouse).
- **Navegación rota dentro de Centro de Gali**: `reglas-page.component.html`/`skills-page.component.html`
  tenían `routerLink="/gali-v5/..."` en vez de `/gali-6/...` (7 links) — sacaban al usuario del hub sin
  avisar. Además se les agregó un input `embedded` (mismo patrón que `Gali6ConexionesCasaComponent`) para
  no duplicar banner/título cuando viven dentro de `gali6-centro-control`.
- **Binding roto**: `validador-direcciones-page.component.html:2` — `[breadcrumbs="breadcrumbs"` sin
  cerrar el corchete.
- **Anatomía de "card" unificada**: `.mcp`/`.nube-item` (Conexiones) y las cards de Marketplace pasaron
  de sombra permanente a sombra solo en `:hover`, igual que ya hacía Agentes.
- **Señal de stock-out ahora visible en pantalla**: `garantias-recolecciones` (`dropi-screens.registry.ts`)
  ganó columnas `Producto`/`Riesgo` — 3 de 10 filas mock marcan "Collar GPS para mascotas" con "Riesgo
  stock-out" (mismo caso real que ya citaba `stock-guardian.ejemploSenal`), pintado en rojo reusando el
  mecanismo genérico `shouldBadge()`/`statusTagClass()` de `DropiScreenPageComponent` (se le agregó la
  palabra clave `riesgo`, cambio inerte para las demás ~20 pantallas que sirve ese componente).
- **Kronos recoloreado**: `dashboard-financiero-page.component.scss/html` usaba `#60a5fa` (azul ad-hoc,
  19 ocurrencias) para el agente "Kronos"; ahora usa `$os-agent-financiero` (violeta), el token ya
  reservado para ese rol y que estaba sin usar. No se renombró ni se reemplazó el agente — sigue siendo
  una decisión de producto pendiente si Kronos debe mapear a un agente real del roster de `AGENTES_ESPECIALIZADOS`.
- **Catálogo de Productos conectado al chat** — antes era la única pantalla operativa que el chat
  ignoraba. `CatalogPageComponent.ngOnInit()` ahora publica `Gali6ScreenContextService` y empuja una
  alerta proactiva citando el mismo texto que ya tiene `.catalog-gali-cta` en pantalla ("Difusor de
  aromaterapia..."), con un botón que abre el panel real (`GaliStateService.openCatalogPanel()`). El
  primer mensaje de bienvenida del chat también ganó un botón "Buscar productos →" (`actionId: 'ir-a-catalogo'`).

### Auditoría de diseño — Fase 2 (Refinamiento)

- **Touch targets**: `DropiScreenPageComponent` (~20 pantallas) `__row-actions button` 24→32px,
  `__page-btn` 32→44px (de paso corrigió un bug real: `padding: 12px` dentro de un box fijo con
  `border-box` dejaba solo 8×8px útiles); `.g6-agente-card__toggle` y `.port__kebab-btn` 24→32px.
- **Breadcrumb unificado**: 7 pantallas de Configuraciones decían "Configuraciones" en vez de "Configurar"
  (el nombre real del ítem del icon rail) — corregido en `dropi-screens.registry.ts`, sin tocar el dato
  mock homónimo que aparece como valor de columna en Historial de actividades.

### Auditoría de diseño — Fase 3 (Pulido)

- **CSS muerto eliminado**: ~300 líneas — el tab completo "Fuentes y Conexiones" en `gali6-senales.component.scss`
  (0 referencias en el HTML) y `.g6-mkt-regla*` en Marketplace (ídem).
- **Animación infinita limitada**: `.port__item--recien` (`recien-pulse`) pasó de `infinite` a 4 iteraciones.
- **Iconografía consistente**: el empty state "Todo bajo control" de Señales pasó del glifo `✦` a
  `pi-check-circle`, coherente con el `pi-eye` del panel vecino — ambos con `aria-hidden`.
- **Auto-grow real en el textarea del chat** (`gali6-chat-panel.component.ts/html/scss`) — crece hasta el
  `max-height: 96px` ya definido en CSS, con scroll interno si lo supera, y colapsa al enviar.
- **Placeholder literal corregido**: Financiero → Datos de facturación mostraba "Campo 1 / Valor de
  ejemplo" (fallback genérico de `DropiScreenPageComponent.formFields()`); ahora tiene datos mock reales
  de facturación electrónica colombiana (Razón social, NIT, Régimen tributario, etc.).
- **Modal de Proyectos unificado en tokens**: `.modal`/`.tipo-picker`/`.gali-mejorar` en
  `gali6-proyectos-casa.component.scss` migrados a `$os-*` — visualmente igual ahora al modal ZeroState y
  al panel `.g6-cat-panel` del shell (no se fusionaron en un solo componente Angular, solo se igualó el
  lenguaje visual).

### Deliberadamente no tocado esta sesión

- **ARIA de toggles** — se corrigió en los 2 toggles de skill de Agentes; `.g6-mkt-regla__toggle` de
  Marketplace resultó ser CSS muerto (eliminado, no necesitaba el fix).
- **Checkbox → switch visual en Roax Lanzador** — `input[type=checkbox]` de "Escalar presupuesto
  automáticamente" se restyled en CSS puro (sin tocar `[(ngModel)]` ni lógica) para verse como el resto de
  los switches de la app.
- **Wizard de Roax Lanzador con 3 pasos vacíos** ("Entendimiento del producto", "Ángulos de venta",
  "Guiones" solo muestran un placeholder) — necesita contenido real de formulario, no es un fix de diseño.
- **"Recuperación explicada" en los 10 stubs restantes de Configuraciones** — solo `integraciones-config`
  la tiene; generalizarla implica escribir diálogo nuevo en `gali6-chat.service.ts`, contenido/lógica, no CSS.
- **Dark mode** — ausente por completo en `_gali-os-tokens.scss`; requiere diseñar un tema completo, fuera
  de alcance de una auditoría de refinamiento.
- **Fusionar los 3 modales en un componente Angular compartido** — se unificó el token visual, no la
  estructura; sería un refactor con más riesgo que los cambios de esta sesión.

---

## Sesión 2026-07-17 — Creación conversacional compartida + Artefactos con destino + Presencia de agentes

Catalina retomó el proceso pidiendo ir más allá de lo diseñado (sin código) en PARTE 5 de
`18.FlujoUsuarioGali6.md`: que el chat de Gali pueda crear/editar agentes, reglas y skills hablando, que un
artefacto fijado desde el chat pueda ir a cualquier pantalla (no solo la actual), y que se vea en qué
secciones operativas está activo cada agente — no solo como texto en `/gali-6/agentes`. Implementado en 7
fases secuenciales, cada una con `ng build --configuration development` limpio (exit 0) antes de pasar a la
siguiente. Ver plan completo en `/Users/user/.claude/plans/en-una-sesi-n-anterior-rustling-meteor.md`.

### Fase 0 — Fix del bug de sincronización de `agentesEstado`

El bug ya documentado (`gali6-live-mutations.service.ts`, comentario sobre `toggleAgenteEstado`) quedó
resuelto: `agentesEstado` en `gali6-agentes.component.ts` pasó de signal local a `computed` que relee
`Gali6LiveMutationsService.version()`. Se promovieron `autonomiaPct`, `activa` (por skill) e `id` (por regla)
al mock base `AgenteEspecializado`/`AgenteSkillDefault`/`AgenteReglaDefault`
(`mocks/gali-v6/agentes-especializados.ts`), y se agregaron los setters correspondientes a
`Gali6LiveMutationsService` (`setAutonomiaAgente`, `toggleSkillAgente`, `agregarReglaAgente`,
`eliminarReglaAgente`, `setEstadoAgente`). Esto desbloqueó todo lo demás de la sesión.

### Fase 1 — Flujo I: `apareceEn` + mover agente (ver extensión inline en `18.FlujoUsuarioGali6.md` §5.2)

Implementado tal como estaba diseñado: `apareceEn?: string[]` con defaults (`stock-guardian` →
`garantias-recolecciones`, `roas-tracker` → `roax-lanzador`), `moverAgenteASeccion`/`agregarSeccionAAgente`/
`quitarSeccionDeAgente` en `Gali6LiveMutationsService`, caso `mover-agente::` en
`Gali6ChatService.handleAction()`, y chips "Aparece en" en `gali6-agentes.component.ts` con selector de
sección derivado de `DROPI_SCREEN_REGISTRY` (nuevo helper `gali6-screen-catalog.ts`, fuente única para
cualquier selector de pantalla del resto de la sesión).

### Fase 2 — `Gali6CreationRegistryService`

Nuevo store compartido (`services/gali6-creation-registry.service.ts`), persistido en `localStorage`, con
`agentesCreados`/`reglasCreadas`/`skillsCreadas`. `gali6-agentes.component.ts`, `reglas-page.component.ts` y
`skills-page.component.ts` ahora leen de ahí además de sus fuentes base (mezclado en un `computed`).
Hallazgos no previstos, encontrados al implementar esto: `SkillsPageComponent.skills` era un array `readonly`
plano (no signal) — se convirtió en `computed`; `ReglasPageComponent.persist()` solo guardaba el mapa de
activo/inactivo, nunca el contenido de una regla nueva creada con el form inline original, que se perdía al
refrescar (bug preexistente, evitado por el nuevo registro, no arreglado en el mecanismo viejo).

### Fase 3-4 — Flujo K: creación/edición conversacional compartida (nuevo, ver `18.FlujoUsuarioGali6.md` §5.8)

Sin spec previo — Catalina lo pidió al retomar el proceso. El mini-chat modal aislado que ya existía para
crear agentes (`panelCrear` en `gali6-agentes.component.ts`, que además nunca persistía nada realmente) se
retiró por completo y se reemplazó por un state machine dentro de `Gali6ChatService`
(`iniciarFlujoCreacion(tipo, modo, agenteId?)`) que genera mensajes normales en el hilo principal del chat —
nunca un panel flotante aparte, para que "crear mientras conversas" sea literal. Cubre crear agente/regla/
skill y editar agente (autonomía o sección, con diff antes de confirmar). Botones **"+ Crear con Gali"** /
**"✦ Editar con Gali"** en Agentes/Reglas/Skills abren y enfocan el panel de chat
(`Gali6ChatService.requestFocusChat()`, observado por `Gali6ShellComponent`/`Gali6ChatPanelComponent` vía
`effect()`) y arrancan el mismo flujo — sin duplicar UI. Estrategia de retroalimentación (el motor sigue
siendo reglas/keywords, no un LLM real): detección de intención gruesa solo para elegir el flujo, validación
por paso con ejemplos de respaldo si no reconoce la respuesta, nunca aplica un cambio sin confirmación
explícita.

### Fase 5 — Flujo J extendido: artefactos con selector de destino + tab "Artefactos"

`VisualAccion` ganó `requiereDestino?: boolean`; `Gali6ChatCardAccionesComponent` muestra un `<select>` de
pantalla destino antes de resolver `fijar-artefacto::<screenId>`. Nuevo `Gali6ScreenArtifactsService`
(localStorage) y 5º tab del panel de chat, `gali6-tab-artefactos.component.ts`, que lista todo lo fijado con
acciones de reubicar/eliminar. Nuevo componente compartido `<gali6-screen-artifacts [screenId]>` (reusa las
3 cards del chat, cero widgets nuevos), montado en `DropiScreenPageComponent` y en Roax Lanzador/Catálogo de
Productos.

### Fase 6 — Flujo I extendido: barra de presencia de agentes en páginas operativas

Nuevo `gali6-agent-presence-bar.component.ts`, nativo de Gali 6 (no extiende `GaliModuleActivationBarComponent`
de gali-v5 porque su `agentId` es una unión cerrada de un roster distinto y solo soporta un agente por barra).
Muestra chip(s) "Agente activo aquí" por cada agente cuyo `apareceEn` incluye la pantalla, con "Mover a otra
sección" que solo dispara la propuesta en el chat (preview-then-confirm, nunca muta directo). Montada debajo
del header en `DropiScreenPageComponent` (cubre Garantías y recolecciones automáticamente, sin wiring extra)
y en Roax Lanzador/Catálogo de Productos.

### No tocado esta sesión (queda de backlog)

- **Editar regla/skill desde el chat** — el Flujo K solo cubre editar agentes; Catalina pidió explícitamente
  "editar los agentes", no reglas/skills, así que se dejó fuera de alcance en vez de inventarlo.
- **Reubicación de artefactos por drag-and-drop real** — Catalina eligió explícitamente selector/menú en vez
  de HTML5 DnD al validar el alcance.
- **Flujo H** (tab Conexiones condensado) — sigue sin código, no era parte de lo pedido esta sesión.

---

## Archivos clave

| Archivo | Descripción |
|---|---|
| `src/app/pages/gali-6/gali-6-shell.component.*` | Chrome principal, ZeroState, modo experto |
| `src/app/pages/gali-6/gali-6.routes.ts` | Todas las rutas lazy de Gali 6 |
| `src/app/pages/gali-6/gali-6-sections.config.ts` | Paneles de navegación por ruta |
| `src/app/pages/gali-6/home/gali6-hoy-home.component.*` | Home "Hoy" con 4 bloques |
| `src/app/pages/gali-6/proyectos/gali6-proyectos-casa.component.*` | Hub de proyectos |
| `src/app/pages/gali-6/proyectos/gali6-nuevo-proyecto.component.*` | Brújula + crear proyecto |
| `mocks/gali-v5/projects.json` | 12 proyectos en todos los estados |
| `mocks/gali-v5/senales.mock.ts` | Señales y alertas |
| `mocks/gali-v5/kpis-global.json` | KPIs semanales |
| `mocks/gali-v5/impact-ledger.json` | Historial de impacto de Gali |

---

## Mock Data

- **Proyectos** (`mocks/gali-v5/projects.json`): 12 proyectos — `en_escala`, `activo`, `pausado` (3), `recien_lanzado` (2), `cerrado` (3, con `postmortem`), `borrador` (2). Todos tienen `timeline` y `agent_actions`.
- **Señales** (`mocks/gali-v5/senales.mock.ts`): `MOCK_SENALES` + `MOCK_ALERTAS` exportados
- **KPIs** (`mocks/gali-v5/kpis-global.json`): pedidos semana, ROAS, revenue, etc.
- **Ledger** (`mocks/gali-v5/impact-ledger.json`): `summary_semana` con acciones, pesos ahorrados, horas

---

## Features implementados en sesión 2026-06-16

Estos 4 ítems estaban pendientes del `ultimate-plan.md §9` ("Should Have" / "Nice to Have"):

| # | Feature | Archivo(s) |
|---|---|---|
| 1 | Toast feedback al tomar decisión (bloque 2) | `gali6-hoy-home.component.ts/html/scss` |
| 2 | Badge "Semanal" en bloque de estado | `gali6-hoy-home.component.html/scss` |
| 3 | Micro-onboarding al activar modo experto | `gali-6-shell.component.ts/html/scss` |
| 4 | Stagger animation en items del portfolio | `gali6-proyectos-casa.component.html/scss` |

---

## Estado de compilación

```
Application bundle generation complete. [~13-20s]
```

Verificado por última vez el 2026-07-16, tras la sesión de expansión de plan + auditoría de diseño
(Fases 1-3). 17 builds limpios a lo largo de la sesión, uno por lote de cambios. Sin errores de
TypeScript nuevos.

Warnings existentes (pre-existentes, no bloqueantes):
- TypeScript optional chain en `GaliProjectPanelComponent` y `SkillEditorPageComponent`
- SASS deprecation `margin: -$size-1 -$size-2` en `gali6-nuevo-proyecto.component.scss:238`

---

## Posibles siguientes pasos

Al retomar con `ContinuarGali6`, verificar si hay algo en `ultimate-plan.md §9` aún pendiente o si el equipo tiene nuevas specs.

### De la sesión 2026-07-16 (expansión de plan + auditoría de diseño)

- [ ] Implementar Flujo H de PARTE 5 (`18.FlujoUsuarioGali6.md`): tab "Conexiones" condensado en el chat
- [x] Implementar Flujo I: agentes configurables por sección — hecho 2026-07-17, ampliado con barra de
      presencia visible en páginas operativas (ver sesión 2026-07-17 más abajo)
- [x] Implementar Flujo J: artefactos personalizados fijables en pantalla desde el chat — hecho 2026-07-17,
      ampliado con selector de destino + tab "Artefactos"
- [ ] Wizard de Roax Lanzador: contenido real para los 3 pasos vacíos (Entendimiento del producto,
      Ángulos de venta, Guiones) — hoy solo muestran un placeholder genérico
- [ ] Generalizar "recuperación explicada" a los 10 stubs restantes de Configuraciones (hoy solo
      `integraciones-config` la tiene) — requiere diálogo nuevo en `gali6-chat.service.ts`
- [ ] Fusionar ZeroState / modal de Proyectos / `.g6-cat-panel` en un solo componente Angular compartido
      (ya comparten el mismo lenguaje visual `$os-*`, falta la unificación estructural)
- [ ] Dark mode — `_gali-os-tokens.scss` no define ninguna variante oscura
- [ ] Decidir si "Kronos" (Dashboard Financiero) debe mapear a un agente real de
      `AGENTES_ESPECIALIZADOS` o mantenerse como identidad propia (ya tiene color correcto,
      `$os-agent-financiero`, pendiente la decisión de nombre/roster)
- [ ] Reconciliar el spec 19.ConexionesIA.md §2 (ya reescrito con la sub-vista "Motor de Gali") con
      código real — sigue siendo puro documento

### De la sesión 2026-07-15 (navegación + intervención de Gali)

- [ ] Roax Lanzador: conectar `escalarAutomatico` al `autonomiaPct` real de `roas-tracker` — el bug de
      sincronización de `agentesEstado` que bloqueaba esto ya se arregló (sesión 2026-07-17), sigue
      pendiente solo el cableado del wizard mismo
- [ ] Roax Lanzador: Loop de Acción Cerrada del paso 7 (CTR cae → Gali pausa creativo → resultado visible)
      — necesita un modelo de campaña en vivo con métricas evolucionando, que el prototipo no tiene
- [ ] Screen-awareness para el resto de las ~13 pantallas genéricas de `DropiScreenPageComponent`
      (7 de 20 ya están cubiertas) — dejado como backlog explícito para no expandir el alcance de una sola vez
- [ ] Implementación real de código de Parte A (Conexiones IA): `tipo: 'ia'` en `Mcp`, modelo de tokens
      en el panel de detalle, selector de motor en `gali6-agentes.component.ts` — el spec ya está escrito
      en `19.ConexionesIA.md`, pero la implementación es trabajo aparte, explícitamente no incluido ahí
- [ ] Fase 2 de Conexiones IA: fusionar el grafo tipo Obsidian de `ConexionesPageComponent` (gali-v5)
      dentro de `gali6-conexiones-casa`

### De sesiones anteriores (sin retomar aún)

- [ ] Persistencia del objetivo entre sesiones (ya hay `localStorage` para meta; pendiente sincronizar subtareas)
- [ ] Animación de transición entre filtros del portfolio
- [ ] Vista móvil completa (responsive ya existe pero no se testeó en profundidad)
- [ ] Conexión del FAB de Gali con decisiones pendientes (actualmente abre panel genérico)
- [ ] Tests de accesibilidad (aria-labels, focus management en modales)

---

## Modelo de intervención de Gali por sección

> Escrito en la implementación de `docs/Specs/PlanChat.md` §B3, como referencia viva citada por
> `docs/SpecsNuevos/18.FlujoUsuarioGali6.md` §1.1. Aplica el AI-UX Trust Stack y la escala de
> "Nivel de agencia" de `docs/Conocimientos/AlcancesIADropi.md` §II a las 5 familias de pantallas
> que hoy tiene Gali 6.

| Tipo de sección | Ejemplos | Nivel de agencia | Comportamiento del chat lateral |
|---|---|---|---|
| Operativas/transaccionales | Pedidos, Novedades, Garantías, Órdenes de despacho, Logística | Vigilante permanente (proactiva) | Banner de contexto siempre visible; acciones vía patrón *preview-then-confirm* ya usado en `pausar-campana`/`resolver-alerta` (Reversibility) |
| Analíticas | Reportes, Calendario, Financiero | Analítica + alertante | Pasiva por defecto, responde bajo demanda; alerta solo ante anomalías |
| Creación/marketing | Campañas, Automatización, Roax, Etiquetas | Generativa + confirmativa | Propone, nunca publica sin aprobación explícita (Steering + Reversibility) |
| Configuración | Configurar, Conexiones | Silenciosa / solo ayuda contextual | Gali no sugiere cambios de seguridad/facturación sin que se le pida (coherente con el límite "nunca mueve dinero sin aprobación") |
| Pantallas stub (recuperadas en §B1) | Garantías-recolecciones, los 11 de Configuraciones, CAS/Tickets, Financiero secundario | Recuperación explicada | El chat reconoce el límite: *"Estás en una vista simplificada, todavía no tengo mucho contexto aquí"* — en vez de fingir capacidad completa (Refusal & Recovery, evita el anti-patrón de calibración) |

### Estado de implementación (2026-07-15)

| Pantalla | Fila de la tabla | Screen-awareness (`Gali6ScreenContextService.publish`) | Comportamiento narrado en `18.FlujoUsuarioGali6.md` |
|---|---|---|---|
| Validador de direcciones | Operativas | ✅ implementado (`validador-direcciones-page.component.ts`) | ✅ Regla reactiva "corrige la dirección" con preview-then-confirm → `Gali6LiveMutationsService.corregirDireccion()` |
| Garantías / Órdenes de despacho | Operativas | ✅ implementado (`garantias-page.component.ts`, ambas variantes) | ⚠️ Solo banner pasivo (`viewLabel` + conteo). No implementa el mensaje proactivo del Flujo A — ese se implementó en la pantalla vecina `garantias-recolecciones`, no aquí |
| Garantías y recolecciones | Operativas | ✅ implementado (`dropi-screen-page.component.ts`, gated a `screenId === 'garantias-recolecciones'`) | ✅ Flujo A **completo, incluido el paso 8**: banner "3 en riesgo de stock-out" + mensaje proactivo citando el `ejemploSenal` real de `stock-guardian` + acción `pausar-recoleccion::<producto>` + siguiente paso propuesto ("¿te aviso 5 días antes?") vía `actionId: 'crear-regla-aviso-stock::<producto>'` |
| Facturas pendientes | Analíticas | ✅ implementado (`dropi-screen-page.component.ts`, gated a `screenId === 'facturas-pendientes'`) | ✅ Flujo B: sin banner proactivo (sección analítica); regla reactiva ante la palabra "facturar" cita el dato mock real de la conexión Siigo y ofrece deep-link a Conexiones |
| Financiero — Datos bancarios, Retiros de saldo, Datos de facturación, Notas crédito | Analíticas | ✅ implementado (`dropi-screen-page.component.ts`, gated por `screenId`) | Solo banner de contexto (mismo trato pasivo que Facturas pendientes) — ninguna regla reactiva nueva para estas 4, extensión chica agregada además de los Flujos A-D |
| Roax Lanzador (Flujo C) | Creación/marketing | ✅ implementado (`roax-lanzador-page.component.ts`) | ⚠️ Parcial pero con más cobertura que antes: banner (ahora se re-publica en cada paso del wizard, no solo al entrar) + mensaje proactivo citando Break-even ROAS 4.0x / Target ROAS 5.0x + **paso nuevo "Presupuesto"** en el wizard (Target ROAS y presupuesto diario editables, toggle de escalamiento automático) + confirmación en el chat al avanzar ese paso. **Sigue sin implementar:** la lectura real del `autonomiaPct` de `roas-tracker` (`escalarAutomatico` es un toggle propio del wizard, no está cableado al slider de Agentes — ese slider tiene un bug conocido de sincronización que no valía la pena heredar) y el Loop de Acción Cerrada del paso 7 (CTR cae → Gali pausa creativo) — requiere un modelo de campaña en vivo que este wizard no tiene |
| Configuración → Integraciones (Flujo D) | Stub | ✅ implementado (`dropi-screen-page.component.ts`, gated a `screenId === 'integraciones-config'`) | ✅ Flujo D completo: banner "Viendo: Integraciones" + regla "recuperación explicada" (dispara ante cualquier pregunta en esta vista, no solo una palabra clave) + deep-link a Conexiones vía `actionId: 'ir-a-conexiones'` |
| Resto de las ~13 pantallas genéricas (`DropiScreenPageComponent`) | Todas | ❌ no implementado | Documentado como backlog por diseño (`PlanChat.md` §B4: "evita una tarea de alcance descontrolado") — este componente sirve ~20 pantallas distintas por `screenId`; 7 ya están gateadas explícitamente (`garantias-recolecciones`, `facturas-pendientes`, `integraciones-config` + las 4 de Financiero) |
| Spec formal "Conexiones IA" (Parte A de `PlanChat.md`) | — | ✅ documento escrito (`docs/SpecsNuevos/19.ConexionesIA.md`) | Puramente documento, sin código — así lo pidió `PlanChat.md` §Parte A. Formato visión → capas → modelo de tokens → selector de motor → fases → límites, siguiendo la convención de `AlcancesIADropi.md` |

### Nota — corrección 20 → 25 rutas huérfanas

`PlanChat.md` (texto narrativo, línea 10) y las primeras versiones de `18.FlujoUsuarioGali6.md` dicen
"20 rutas huérfanas". La tabla de `PlanChat.md` §B1 ("Lista completa") en realidad enumera **25** rutas
— la tabla, no el resumen narrativo, fue la fuente de verdad usada al implementar §B1, porque es la que
tiene el detalle mecánico (componente + screenId) necesario para escribir cada entrada de
`gali-6.routes.ts`. Las 25 rutas están registradas y verificadas (build limpio + smoke test en
navegador: ninguna cae en el wildcard). Los "20" del texto narrativo probablemente contaban ítems de
menú (p. ej. "Configurar" como 1 ítem) en vez de rutas individuales — "Configurar" solo son 11 rutas.

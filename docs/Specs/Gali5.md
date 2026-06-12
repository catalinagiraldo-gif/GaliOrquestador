# Gali v5 — Business Operating System

**Versión**: 5.0 — OS Architecture + Business Intelligence + UX Clarity + Dual E-commerce + MCP Ecosystem + Multi-Channel  
**Fecha**: Junio 2026 (actualizado Jun 10, 2026)  
**Estado**: Prototipo activo v25.0 — Spec 10 WorkspaceChat ejecutado · multi-thread con secciones · rich cards ROAS/pedidos/novedad/acciones · selector de contexto inline · pins localStorage · pre-carga desde proyecto y agente · Specs pipeline 16✅ 15✅ 14✅ 10✅ completados

---

## ¿Qué es Gali?

Gali no es un asistente. Es el **sistema operativo del negocio dropshipping**. Gali orquesta agentes especializados, ejecuta automatizaciones (skills), y presenta un workspace configurable donde el operador puede intervenir en su negocio desde un solo lugar — sin navegar entre módulos dispersos.

**Antes**: Gali era un panel lateral con notificaciones y botones que "decían" que actuaban.  
**Ahora**: Gali es el shell oscuro con 5 modos de workspace donde cada señal tiene un loop completo de intervención.

---

## Modelo Conceptual: Agentes, Skills y Reglas

Es crítico distinguir estos 3 conceptos:

| Concepto | Qué es | Dónde vive | Historial |
|---|---|---|---|
| **Skill** | Capacidad reutilizable que un agente invoca (plugin/función). **No** tiene trigger/condición/acción | Skills page + detalle skill | Sí — historial de ejecuciones |
| **Agente** | Entidad autónoma que usa skills + reglas con su propia lógica de cuándo actuar | Agentes page + señales + ficha detalle | No — es el ejecutor |
| **Regla** | Condicional If-Then que controla cuándo el agente activa una skill | Ficha del agente (tab Configuración) + Reglas page | Parcial — toggles persisten en `localStorage` |

- Los **Agentes** son personas virtuales con rol específico. No son genéricos "IA". El trigger/condición/acción vive en su ficha, no en la skill.
- Las **Skills** son capacidades asignables a uno o más agentes. Se muestran por nombre, descripción y agentes que las usan — sin pipeline trigger→condición→acción en el listado.
- Las **Reglas** son If-Then por agente. Chatea Pro las usa en WhatsApp; Roax y Vigilante tienen reglas de escalamiento y logística. Editor libre en `/gali-v5/reglas`.

---

## Arquitectura de 4 Capas (v6.0+)

```
CAPA 1 — WORKSPACE OS (shell)
  5 modos con layouts de paneles distintos
  Cambiar de modo reconfigura el workspace visualmente
  Header transversal: salud del negocio + agente activo + señales pendientes

CAPA 2 — INTERVENTION LAYER (señales accionables)
  Cada señal abre contexto completo con opciones A/B/C
  Aprobar / rechazar / modificar en el mismo panel
  Resultado visible inmediatamente con before/after

CAPA 3 — SKILLS RUNTIME (automatizaciones vivas)
  Skill = Trigger + Condición + Acción + Notificación
  Historial de ejecución por skill
  Estado live: activo / ejecutando / pausado

CAPA 4 — BUSINESS MEMORY + AMBIENT INTELLIGENCE (v6.0)
  Memory Panel: patrones, decisiones, preferencias de autopilot (localStorage)
  Cloud Files Panel: creativos y docs del proyecto
  galiInsight: tooltips contextuales de Gali sobre métricas al hover
  Business Health Score en header (glanceable 0–100)
```

---

## Estética: Light Command OS

Gali mantiene identidad visual propia dentro de Dropi con fondos ligeramente diferenciados del blanco puro (#fff) y tipografía Syne/DM Sans. El OS usa `#f4f4f7` (gris muy suave) vs el `#fff` de los módulos de Dropi.

| Token | Valor | Uso |
|---|---|---|
| `$os-bg` | `#f4f4f7` | Fondo del workspace (gris suave) |
| `$os-surface` | `#ffffff` | Paneles y headers |
| `$os-surface-2` | `#f8f8fb` | Cards dentro de paneles |
| `$os-surface-3` | `#f0f0f4` | Hover / filas seleccionadas |
| `$os-text-primary` | `#1a1a22` | Texto principal |
| `$os-text-secondary` | `#5a5a6e` | Texto secundario |
| `$os-text-muted` | `#9898a8` | Texto apagado |
| `$os-accent` | `#ff6102` | Naranja Dropi — brand continuidad |
| `$os-ok` | `#22c55e` | Estado positivo / activo |
| `$os-warn` | `#f59e0b` | Alertas / decisiones |
| `$os-crit` | `#ef4444` | Señales críticas |
| `$os-font-display` | `'Syne'` | Títulos del OS (identidad diferenciadora) |
| `$os-font-body` | `'DM Sans'` | Cuerpo y labels |

Tokens definidos en: `src/styles/_gali-os-tokens.scss`

---

## Los 5 Modos de Workspace

La barra de modos (`GaliWorkspaceModeBarComponent`) es siempre visible. Cada modo reconfigura el layout de paneles sin navegación.

| Modo | Ícono | Layout | Panel 1 | Panel 2 | Panel 3 |
|---|---|---|---|---|---|
| **Operar** | ⚡ | 3 col | Señales (accionables) | Proyectos (con contexto) | Agentes live |
| **Lanzar** | 🚀 | 2 col | Conversación con Gali | Oportunidades ADA Spy | — |
| **Medir** | 📊 | 2 col | P&L por proyecto | Campañas + atribución | — |
| **Construir** | 🔧 | 2 col | Lista de skills activas | Historial + marketplace | — |
| **Comunidad** | 🌐 | Full | Marketplace de skills | — | — |

El cambio de modo es inmediato (transición CSS, no navegación). Estado gestionado por `GaliWorkspaceService`.

---

## Componentes Críticos

### GaliIntentBarComponent (v5.0)
**Path**: `src/app/pages/gali-v5/components/gali-intent-bar/`

Command bar sticky visible en todas las rutas `/gali-v5`. Input de lenguaje natural + 3 shortcuts (⚡ Señales, 🚀 Lanzar, 📊 Medir). Cuando el usuario escribe un intent, detecta el modo correspondiente y hace `ws.setMode()` sin navegar.

### GaliGoalOnboardingComponent (v5.0 → v17.0)
**Path**: `src/app/pages/gali-v5/components/gali-goal-onboarding/`

Modal fullscreen que aparece en la primera visita a `/gali-v5`. Almacena en `localStorage('gali_goal_configured')`. Exporta `shouldShowOnboarding()` helper.

**Flujo actual (v17.0)** — 5–6 pasos según perfil:
1. Objetivo de 30 días (4 opciones + custom)
2. **Contexto Dropi pre-cargado** — lee `kpis-global.json`; si hay pedidos, muestra banner KPI en vez de preguntar "¿cuántos pedidos tienes?" (B1/B5 Spec 8)
3. Agente recomendado por objetivo
4. Tu plan para hoy (pasos accionables con rutas)
5. Conexiones opcionales (Meta, Drive, etc.)
6. Veterano: path alternativo si ya tiene historial

**Separación de flujos (C4)**: "Editar objetivo" en Hub abre mini-modal de 1 paso (`openEditGoal()` en `home.component.ts`). "Reconfigurar Gali" abre el wizard completo — flujos distintos.

### GaliAdaSpyDetailComponent (v5.0)
**Path**: `src/app/pages/gali-v5/components/gali-ada-spy-detail/`

Overlay lateral derecho (480px, `position: fixed`) con análisis completo de una oportunidad ADA Spy. Datos: score gauge SVG, ventana, precio/COGS/margen, ciudades top con bar chart, ROI proyectado (tabla), saturación. CTA "Lanzar con Gali" → navega a NuevoProyecto con query params pre-llenados. Acepta `productId` como input. Datos en `ADA_PRODUCTS` array en el mismo componente.

### GaliAutopilotConfigComponent (v5.0)
**Path**: `src/app/pages/gali-v5/components/gali-autopilot-config/`

Overlay lateral (440px) que abre el mode-bar ANTES de activar autopilot. Configura: budget máximo (slider $10k-$150k con presets), cambio de transportadora (toggle), WhatsApp confirm/recuperar (toggles). Muestra acciones que siempre requieren aprobación. Al confirmar llama `ws.toggleAutopilot()` y cierra.

### GaliWorkspaceService
**Path**: `src/app/pages/gali-v5/services/gali-workspace.service.ts`

Servicio singleton que gestiona el modo activo del workspace, el estado de Gali (activo / autopilot / pausado), complejidad del Hub, DNA de negocio, y coordinación de alertas primarias entre páginas.

```typescript
type WorkspaceMode = 'operar' | 'lanzar' | 'medir' | 'construir' | 'comunidad';

class GaliWorkspaceService {
  readonly activeMode = signal<WorkspaceMode>('operar');
  readonly galiPaused = signal(false);
  readonly autopilot = signal(false);
  readonly complexityLevel = signal<'novice' | 'expert'>('novice');  // localStorage: gali_complexity
  readonly connectedSources = signal<string[]>([]);                    // localStorage: gali_connected_sources
  readonly visibleModules = signal<string[] | null>(null);             // null = todos visibles
  readonly primaryAlertActive = signal(false);                       // suprime intent-bar globalmente
  readonly hubEntryContext = signal<HubEntryContext | null>(null);   // banner al llegar desde catálogo/caza
  readonly businessDNA = computed(() => ({ goalId, goalLabel, pedidosTarget, complexity, sources, sessionCount, hasData }));
  updateGoalLabel(label: string): void;
  ensureGoalFromStorage(): void;
}
```

**`primaryAlertActive`**: cada página con banner crítico (Hub, Wallet, Dashboard Financiero, Novedades) setea `true` en `ngOnInit` y `false` en `ngOnDestroy`. El `GaliIntentBarComponent` se oculta mientras esté activo.

---

### GaliWorkspaceModeBarComponent
**Path**: `src/app/pages/gali-v5/components/gali-workspace-mode-bar/`

Barra superior siempre visible. Muestra:
- Tabs de los 5 modos (activo con fill naranja + sombra — v7.0) — navegan vía `ws.setMode()` sin URL
- Progreso del objetivo activo (barra + fracción + periodo)
- **Toggle Básico/Experto** (v16.0/v17.0) — movido aquí desde la sección Decisiones del Hub
- Estado de Gali (activo / autopilot / pausado) — clickeable
- **Autopilot** (v16.0): link "Configurar autopilot →" que navega a `/gali-v5/agentes` — lugar canónico; ya no es toggle directo en mode-bar

---

### DropiHeaderIa2Component — Zona contextual transversal (v4.0 / v6.0)
**Path**: `src/app/pages/gali-v5/components/dropi-header-ia2.component.*`

Reemplaza chips de proyecto muertos (Collar, Skincare Pack). Muestra en todas las secciones:
- **Business Health Score** (0–100) con breakdown al click
- **Agente activo** de la sección actual (ej. Roax en Marketing) — abre right panel
- **Pill de señales** → navega al Gali Hub
- Badge AUTO cuando autopilot está activo

---

### GaliRightPanelComponent — Tabs ampliados (v6.0 / v7.0)
**Path**: `src/app/pages/gali-v5/components/gali-right-panel/`

6 tabs con scroll horizontal e iconos: Chat, Señales, Agentes, Live, Memoria, Archivos.
Barra de contexto bajo el header: agente activo + hint del tab actual (ej. "Decisiones pendientes").

| Tab | Contenido |
|---|---|
| Chat | Conversación + panel de contexto split |
| Señales | Señales pending_decision |
| Agentes | Estado de los 4 agentes |
| Live | Log de autopilot en tiempo real |
| Memoria | Patrones, decisiones, preferencias autopilot |
| Archivos | Drive + locales del proyecto |

---

### GaliInsightDirective (v6.0)
**Path**: `src/app/pages/gali-v5/directives/gali-insight.directive.ts`

Directiva `[galiInsight]="texto"`. Tooltip custom al hover con análisis de Gali. Usada en Dashboard Financiero (KPIs, ROAS badges). Pendiente extender a Pedidos, Campañas, Logística.

---

### DashboardFinancieroPageComponent (v6.0)
**Path**: `src/app/pages/gali-v5/pages/reportes/dashboard-financiero-page.component.*`
**Ruta**: `/gali-v5/reportes/dashboard-financiero`

Waterfall P&L consolidado, desglose semanal, proyecciones 3 escenarios. Glosario colapsable para novatos (P&L, ROAS, CPA, Novedad, Margen neto). CTA desde Productos Vendidos: "Ver P&L completo →".

---

### GaliSignalCardV2Component
**Path**: `src/app/pages/gali-v5/components/gali-signal-card-v2/`

Señal con ciclo de vida completo:

```
pending_decision → executing → completed → archived
```

- **Collapsed**: muestra título + agente + CTAs rápidos (máx 2)
- **Expanded**: muestra contexto, métricas, tabla de afectados, opciones A/B/C
- **Executing**: spinner + label "Gali está aplicando..."
- **Completed**: before/after con before tachado → resultado verde + CTA de follow-up

Acepta: `signal_data: GaliSignalData` — con tipo, estado, opciones, tabla_items, resultado.

---

### GaliProjectPanelComponent
**Path**: `src/app/pages/gali-v5/components/gali-project-panel/`

El proyecto como lente cruzado del negocio:
- KPIs del proyecto (ROAS, pedidos, ganancia)
- Agentes asignados con estado live
- Mensaje contextual de Gali
- Acciones directas → abren `GaliInterventionOverlay` (no navegan)
- Skills activas del proyecto

---

### GaliInterventionOverlayComponent
**Path**: `src/app/pages/gali-v5/components/gali-intervention-overlay/`

Overlay contextual (no global-modal) para decisiones:
- **deciding**: descripción + opciones A/B/C (la A siempre primaria)
- **executing**: spinner + "Gali está aplicando..."
- **result**: ícono ✓ verde + texto de resultado + botón cerrar

Se instancia dentro del componente padre (e.g., `GaliProjectPanel`), no en el shell global.

---

### GaliSkillBuilderV2Component
**Path**: `src/app/pages/gali-v5/components/gali-skill-builder-v2/`

Visualizador/editor de skill en formato pipeline:

```
TRIGGER → CONDICIÓN → ACCIÓN → NOTIFICACIÓN
```

Con barra de estado (activo/pausado/total ejecuciones) y tabla de historial de runs con columnas: fecha, estado, detalle, impacto.

---

### Componentes Shared (v17.0)

**Path**: `src/app/pages/gali-v5/components/shared/`

| Componente | Selector | Uso |
|---|---|---|
| `GaliTermTooltipComponent` | `gali-term-tooltip` | Tooltip ⓘ reutilizable para glosario (PIL, ROAS, huella, etc.) — exportado en `shared/index.ts` |
| `ConfirmActionModalComponent` | `confirm-action-modal` | Modal de confirmación con impacto + pedidos afectados — usado en Señales para alertas críticas |

### DropiPrototypeFeedbackService (v17.0)
**Path**: `src/app/pages/gali-v5/services/dropi-prototype-feedback.service.ts`

Toast global (`Prototipo · {acción}`) para botones sin handler real. El shell (`gali-v5-shell.component.ts`) intercepta clicks en botones sin `data-proto-skip` y sin `routerLink` para evitar sensación de UI rota. Se limpia automáticamente en `NavigationEnd`.

### SkillPickerModalComponent (v17.0)
**Path**: `src/app/pages/gali-v5/pages/agentes/skill-picker-modal.component.*`

Modal de búsqueda para asignar skills a un agente desde su ficha. Catálogo de 10 skills con categoría y agentes que las usan. Emite `skillAdded` → actualiza `agentsList` en `AgentesPageComponent`.

### AgentesPageComponent — Wizard y ficha (v16.0/v17.0)
**Path**: `src/app/pages/gali-v5/pages/agentes/agentes-page.component.*`
**Ruta**: `/gali-v5/agentes`

- **Wizard crear agente**: 6 pasos — Identidad (rol libre textarea) → Skills (multi-select) → Regla inicial If-Then → Autopilot + umbral → Confirmar → Conexiones (Meta, Dropi, Siigo, Chatea, ADA)
- **`launchAgent()`** persiste el agente en `agentsList` signal; estado inicial "Configurando…" → "Activo" tras 1.5s + toast Gali
- **Tabs ficha detalle**: Actividad · Skills · **Configuración** (autopilot toggle, umbral slider 0–100%, reglas activas)
- **Umbrales por agente**: `agentThresholds` signal — cableados en sliders (sin `data-proto-skip`)
- **Agregar skill**: abre `SkillPickerModal` en vez de navegar a `/skills` genérico

### ReglasPageComponent — Editor libre (v17.0)
**Path**: `src/app/pages/gali-v5/pages/reglas/reglas-page.component.*`

- Editor "+ Nueva regla" con textarea libre, selector de agente, asignación multi-agente
- Persistencia toggles en `localStorage('gali_reglas_state')`
- Sección Escalamiento Roax: 6 reglas estilo Revealbot con tooltips
- Copy ontología corregido: skill ≠ regla

### MarketplacePageComponent — Sección propia (v17.0)
**Path**: `src/app/pages/gali-v5/pages/marketplace/marketplace-page.component.*`
**Ruta**: `/gali-v5/marketplace`

Marketplace **desanidado** de Skills. Tabs: Skills · Agentes · Reglas · Plugins · APIs. Skills page enlaza vía `routerLink="/gali-v5/marketplace"` en lugar de tab embebido.

### DropiHomeComponent — Hub widgets (v17.0)
**Path**: `src/app/pages/gali-v5/home/home.component.*`

Además del layout 3 zonas (Spec 3):
- **Goal strip editable** — click en objetivo → mini-modal inline
- **Ciclo de Negocio ARRIBA** de Decisiones en modo experto (C1)
- **FAB acciones rápidas** en header modo básico (Nuevo proyecto, Señales, etc.)
- **Mis metas esta semana** — widget con progreso + link a editar objetivo
- **Tu plan esta semana** — pasos del onboarding con checkboxes persistentes
- **Dashboard tabs** — múltiples tabs personalizables (`gali_dashboard_tabs`, `gali_active_tab` en localStorage)
- **Customizer** funcional sin `data-proto-skip` — guarda secciones por tab
- Copy "Señales →" en vez de "Ver todas"
- Tooltips PIL/ROAS inline (pTooltip)

---

### SkillEditorPageComponent (NUEVO)
**Path**: `src/app/pages/gali-v5/pages/skills/skill-editor-page.component.*`
**Ruta**: `/gali-v5/skills/nueva`

Editor full-page de skills con 2 columnas:
- **Izquierda**: Configurador con secciones por bloque (Agente, Trigger, Condición, Acción, Notificación)
- **Derecha**: Preview en vivo del pipeline + info de configuración + plantillas del marketplace

Triggers soportados:
- **Por tiempo**: cada 30min a 24h
- **Por evento**: específico por agente (ej: "Cuando se detecta una novedad", "Al crear un pedido")
- **Por umbral**: primera vez que una métrica cruza un valor

Múltiples condiciones con lógica AND/OR. Pre-rellena desde query params `?agente=roax&contexto=campana&metrica=CTR` para integración desde señales y campañas.

Interface de skill:
```typescript
interface SkillRule {
  id: string;
  nombre: string;
  trigger: { event: string; agent: string; interval: string };
  condition: { metric: string; operator: string; value: number; duration?: string };
  action: { type: string; params: Record<string, unknown> };
  notification: { message: string };
  status: 'active' | 'paused' | 'executing';
  runHistory: RunLog[];
}
```

---

## Estructura de Archivos

```
src/app/pages/gali-v5/
├── home/
│   ├── home.component.ts          ← OS Workspace Hub (5 modos)
│   ├── home.component.html        ← @switch(mode) → layouts de panel
│   └── home.component.scss        ← Dark OS styles, mode layouts
├── services/
│   ├── gali-workspace.service.ts       ← Modos, businessDNA, primaryAlertActive, complexity
│   ├── gali-state.service.ts           ← Panel derecho + customizer desde chat
│   └── dropi-prototype-feedback.service.ts ← Toast acciones prototipo (v17.0)
├── components/
│   ├── gali-workspace-mode-bar/   ← Barra de modos
│   ├── gali-signal-card-v2/       ← Señal con lifecycle
│   ├── gali-project-panel/        ← Proyecto como lente
│   ├── gali-intervention-overlay/ ← Decisión contextual
│   ├── gali-skill-builder-v2/     ← Editor de skills
│   ├── gali-agent-alert/          ← [v4.0] Alerta unificada de agente
│   ├── gali-autopilot-config/     ← [v5.0] Configurador scope autopilot
│   ├── gali-context-strip/        ← [v5.0] Strip de contexto en rutas
│   ├── gali-intent-bar/           ← [v5.0] Command bar lenguaje natural
│   ├── gali-goal-onboarding/      ← [v5.0] Onboarding 3 pasos primera visita
│   ├── gali-ada-spy-detail/       ← [v5.0] Overlay análisis ADA Spy
│   ├── gali-chip/                 ← Presencia de agente (legacy)
│   ├── dropi-gali-bar/            ← Bar de agente en secciones (máx 1 por vista)
│   └── shared/
│       ├── gali-term-tooltip.component.ts   ← [v17.0] Glosario ⓘ
│       └── confirm-action-modal.component.ts ← [v17.0] Confirmación alertas
├── pages/
│   ├── agentes/                   ← [v4.0/v17.0] AgentesPageComponent + skill-picker-modal
│   ├── marketplace/               ← [v17.0] MarketplacePageComponent (sección propia)
│   ├── proyectos/
│   │   ├── nuevo-proyecto-page.*  ← [NUEVO v4.0] Pantalla completa de creación
│   │   └── proyectos-list-page.*
│   ├── skills/                    ← Modo Construir dedicado
│   ├── akademy/                   ← Akademy integrado (cursos + rec Gali)
│   └── ... (módulos de negocio)
└── gali-v5-shell.component.*      ← Shell (icon-rail + section-nav)
```

Tokens OS: `src/styles/_gali-os-tokens.scss`

---

## Flujos Principales

### Señal → Intervención → Resultado
1. Vigilante detecta novedad alta → `GaliSignalCardV2` aparece con estado `pending_decision`
2. Usuario hace click en "Cambiar → Servientrega" → estado pasa a `executing`
3. Después de 1.8s (simulado) → estado pasa a `completed` con before/after
4. Card muestra CTA "¿Crear skill para esto?" → conecta con Modo Construir

### Proyecto → Decisión Contextual
1. `GaliProjectPanel` muestra "Novedad alta en Cali"
2. Usuario hace click en "Ver la novedad" → `GaliInterventionOverlay` se abre (anclado al panel)
3. Usuario selecciona Opción A → overlay ejecuta → muestra resultado
4. No hay navegación — el usuario sigue en el mismo workspace

### Modo Lanzar — Nuevo Proyecto
1. Usuario hace click en "+ Nuevo" en la columna de Proyectos
2. `ws.setMode('lanzar')` reconfigura el workspace a split 60/40
3. Panel izquierdo: conversación con Gali (chat + sugerencias)
4. Panel derecho: oportunidades de ADA Spy con scores
5. Usuario selecciona producto → Gali construye el proyecto conversacionalmente

### Modo Construir — Skill con Historial
1. Ruta `/gali-v5/skills` (desde sidebar) → `SkillsPageComponent` en tema oscuro
2. Sidebar de skills → seleccionar una → `GaliSkillBuilderV2` en el panel principal
3. Pipeline: TRIGGER → CONDICIÓN → ACCIÓN → NOTIFICACIÓN
4. Tabla de historial: cada run con fecha, resultado, detalle, impacto

---

## Mocks Disponibles

| Archivo | Contenido |
|---|---|
| `mocks/gali-v5/signals.json` | 5 señales con estados, opciones, tablas |
| `mocks/gali-v5/senales.mock.ts` | Señales predictivas + alertas operativas con `resolucionResumen`, `beforeState`, `afterState`, `galiFlowDesc` |
| `mocks/gali-v5/projects.json` | Proyectos canónicos — incluye `recien_lanzado`, `pausado`, `campaña_fallida`, `borrador` (C12) |
| `mocks/gali-v5/kpis-global.json` | KPIs maestros — ROAS 1.93x, pedidos/sem; consumido por onboarding y dashboard |
| `mocks/gali-v5/skill-rules.json` | 3 skills con historial de ejecución |
| `mocks/gali-v5/user-skills.json` | Skills de usuario (legacy) |
| `mocks/gali-v5/wallet-transactions.json` | Transacciones wallet + alertas Kronos/Siigo |
| `mocks/gali-v5/pqr-patterns.json` | Patrones PQR del CAS |
| `mocks/gali-v5/problem-network.json` | Red de problemas |

---

## Agentes del Sistema

| Agente | Color OS | Especialidad | Estado típico |
|---|---|---|---|
| **Roax** | `#f97316` naranja | Media Buyer / Campañas | Activo (siempre) |
| **Vigilante** | `#fbbf24` ámbar | Logística / Novedades | Activo / Alerta |
| **Chatea Pro** | `#34d399` verde | Cierre & CAS | Activo |
| **ADA Spy** | `#818cf8` índigo | Research / Oportunidades | Esperando |
| **Kronos** | `#60a5fa` azul | Finanzas / P&L / Siigo | Activo (v12.0) |
| **Custom** | `#a855f7` púrpura | Agente personalizado del usuario | Configurando → Activo (v17.0) |

---

## Principios de Diseño

1. **No navegar para decidir**: Toda intervención ocurre en el mismo workspace. Los overlays reemplazan la navegación a módulos.
2. **Estado visible**: Cada señal muestra su estado (pendiente / ejecutando / completado). Los cambios de Gali siempre dejan rastro.
3. **Señal → Loop cerrado**: Una señal no desaparece cuando se actúa — muestra el resultado y propone la siguiente acción (crear skill, ajustar regla).
4. **Skills como ciudadanos de primera clase**: Una skill no es un formulario — es un objeto vivo con historial, estado, y conexión directa con los agentes.
5. **OS, no módulos**: El cambio de modo reconfigura el workspace. No hay URLs por modo — es estado local del workspace.
6. **Claridad conceptual**: Agentes (ejecutores) ≠ Skills (recetas) ≠ Reglas (condicionales Chatea Pro). Estas distinciones deben ser visibles en la UI. Cada concepto tiene su propia página y su propia entrada en el rail.
7. **Gali como capa de inteligencia transversal**: Cada módulo (catálogo, proveedores, automatizaciones, finanzas) tiene integración con Gali mediante banners contextuales, ADA scores y smart responses. El header refleja qué agente está activo en la sección actual.
8. **Dashboard personalizable**: El hub de Gali permite al usuario activar/desactivar secciones. La personalización es accesible desde UI y desde chat.
9. **Máximo 1 alerta por sección**: El `GaliAgentAlertComponent` consolida todas las alertas de agentes. Cola de prioridad: decision > opportunity > monitoring > completed. No más de 3 tipos de alerta en una misma vista.
10. **Lenguaje claro para novatos**: Términos técnicos (P&L, swap automático, smart routing) siempre acompañados de su definición en lenguaje de dropshipper. P&L = "tu rentabilidad real". Swap = "cambio de transportadora".
11. **Inteligencia Ambiental**: La IA de Gali no vive solo en overlays y paneles. Está presente donde el usuario trabaja — overlays de análisis emergentes, respuestas sugeridas, ángulos de venta contextuales. El usuario no busca a Gali; Gali aparece cuando es relevante.
12. **Comunidad como flywheel**: El marketplace de skills no es un catálogo estático. Es un ecosistema donde los mejores dropshippers crean, comparten y forkan automizaciones. El valor crece con cada nuevo creator.
13. **Transparencia del agente**: El usuario siempre sabe qué puede y qué no puede hacer Gali de forma autónoma. El Autopilot Scope Configurator garantiza que el control siempre esté en manos del usuario. Antes de actuar en modo autónomo, Gali muestra claramente los permisos habilitados.
14. **Loop completo de mercado**: ADA Spy no es solo una lista de oportunidades. Cada oportunidad tiene un ciclo completo: Score → Análisis (ciudades, ROI, competencia) → Crear proyecto → Configurar campaña → Monitorear. Ningún CTA es un dead-end.
15. **Visibilidad del sistema (v7.0)**: El usuario siempre sabe dónde está — mode bar con tab activo de alto contraste, section nav con borde naranja, right panel con hint de tab. Sin chips muertos ni indicadores animados sin etiqueta.
16. **Follow-through en acciones**: Personalizar dashboard guarda y confirma con feedback de Gali. Campañas masivas incluyen copiloto Roax con decisión pendiente y pasos explicados. No dead-ends post slide-over.

---

---

## Expansión Arquitectónica Jun 3, 2026 (ver GaliAjustesJun3.md)

### Micromundo del Usuario (Bloque 1)

El usuario tiene un **grafo de negocio propio** que Gali debe modelar explícitamente — no como secciones separadas sino como un objeto unificado:

| Dimensión | Datos | Fuente |
|---|---|---|
| Perfil operativo | Rol, nivel, volumen/semana, antigüedad | Onboarding + inferencia |
| Grafo de negocio | Proyectos → campañas → pedidos → proveedores → transportadoras | Dropi Core |
| Historial comportamiento | Skills activados, alertas ignoradas, decisiones, reglas creadas | GaliWorkspaceService |
| Documentos propios | CSVs WMS, catálogos, facturas, reportes externos | Upload / Drive MCP |
| Objetivo declarado | Meta de 30 días como filtro de relevancia | GaliGoalOnboarding |

**Principio**: "Gali no te pregunta lo que Dropi ya sabe." El onboarding parte del historial real — no de cero.

---

### Macromundo de Dropi (Bloque 2)

El diferenciador real de Gali frente a cualquier LLM genérico es la **data real del dropshipping LATAM**:

| Dataset | Qué contiene | Actualización |
|---|---|---|
| Catálogo vivo | 20.000+ productos, precios, stock, tasas devolución históricas | Continua |
| Benchmark transportadoras | Novedad por ciudad / semana / ruta | Diaria |
| Inteligencia de mercado | Productos escalando esta semana en Colombia / México / Chile | Semanal |
| Patrones de riesgo | Huella digital del comprador — probabilidad de devolución | Continua |
| Skills colectiva | Recetas de comunidad con resultados en contexto | Tiempo real |

**La ecuación**: `Data global Dropi × Contexto específico usuario = Insight hiperpersonalizado + Acción ejecutable`

---

### Agente Kronos (Nuevo — Bloque 3)

Formalizar un **5° agente especializado en Finanzas / P&L / Facturación**:

| Agente | Color | Especialidad | Agencia |
|---|---|---|---|
| **Kronos** | `#60a5fa` azul | P&L real · Facturación · Siigo · Proyección de flujo de caja | Analítico + alertante — nunca mueve dinero sin aprobación |

Kronos asume las funciones que hoy viven difusas en el Dashboard Financiero. Darle nombre e identidad visual aumenta la confianza del usuario en las acciones financieras.

---

### Nuevos Canales de Venta (Bloque 4)

Cuatro canales de venta que Gali debe orquestar además del flujo directo de Dropi:

**TikTok Shop MCP** — Compras embebidas en video:
- Webhook de órdenes TikTok Shop → flujo logístico Dropi (mismo pipeline)
- Roax lee métricas del video (views, CTR, CVR) y las cruza con ROAS real
- UI: card en Conexiones + indicador de origen en Pedidos

**Page Pilot MCP** — Landings no-code:
- Conectar el paso 3 de `NuevoProyectoPageComponent` (Landing Preview) con Page Pilot real
- Gali genera la landing desde el ángulo de venta confirmado + copies que han convertido en LATAM
- CTA "Publicar" ejecuta el deploy real, no solo un preview

**Shopify MCP** — Backend logístico para tiendas propias:
- Sincronización bidireccional: catálogo Dropi ↔ inventario Shopify
- Órdenes Shopify → flujo Dropi (mismo pipeline de Vigilante)
- Kronos lee métricas de conversión de la tienda y las integra en el P&L

**WhatsApp Commerce** — Formalizar Chatea Pro como canal de venta:
- Gali detecta intención de compra en el hilo y envía formulario estructurado
- Valida dirección, anticipo y riesgo en el mismo hilo
- El pedido entra a Dropi sin que el dropshipper lo llene manual

---

### Modelo Dual de E-commerce (Bloque 5)

Dropi tiene dos capas de valor que se deben monetizar por separado:

**E-commerce Logístico** (negocio core):
- Red de transportadoras + Smart Routing + gestión de novedades
- Revenue: flete por pedido + servicio de novedades gestionadas por Gali

**E-commerce Tecnológico** (negocio de plataforma):
- CRM / WMS / Automatización / Analytics / Tiendas virtuales
- Revenue: Gali Pro (MCPs externos) + revenue share Page Pilot + Skills premium

**La integración que ningún otro sistema LATAM tiene**:
> "Tu ROAS de Meta es 2.9x. Tu ROAS real neto (descontando flete, novedad y garantías) es 1.7x. El 40% se va en novedades de Cali. Cambiando a Servientrega en esa ciudad, el ROAS real sube a 2.1x."

---

### MCP Ecosystem — Prioridades (Bloque 7)

**Prioridad 1 — Core (sprint 1-2)**:
- `Meta Ads MCP` — leer métricas, pausar/escalar desde Gali
- `Siigo MCP` — facturación automática al estado "entregado"
- `WhatsApp Business MCP` — formalizar Chatea Pro con flujo completo
- `Coordinadora / Servientrega API` — Smart Routing real

**Prioridad 2 — Expansión (sprint 3-4)**:
- `TikTok Ads MCP` + `TikTok Shop MCP`
- `Shopify MCP` — bidireccional catálogo + órdenes
- `Page Pilot MCP` — landing deploy desde Gali
- `Google Sheets MCP` — export de P&L y reportes

**Prioridad 3 — Ecosistema (sprint 5+)**:
- ADA Spy / Minea MCP · AdCreative.ai MCP · HeyGen MCP · Google Drive MCP

---

## Estado vs. CorrecionesGali5 (Mayo 2026)

| Feedback usuario | Estado v7.0 | Notas |
|---|---|---|
| Chips header (Collar/Skincare) no navegan | ✅ Resuelto | Zona contextual transversal en header |
| Scroll roto en muchas secciones | 🟡 Parcial | Hub chat/señales corregido; auditar resto de módulos |
| Dos alertas ADA Spy en catálogo | ✅ Resuelto | Una sola strip; eliminado `dropi-gali-bar` duplicado |
| Ver análisis completo → wallet | ✅ Resuelto | → `/reportes/dashboard-financiero` |
| P&L sin explicación | ✅ Resuelto | Glosario + abbr en dashboard financiero |
| Swap automático incomprensible | ✅ Resuelto | `<abbr>` explicativo en Torre Logística |
| Personalizar dashboard dead-end | ✅ Resuelto | Botón Guardar + toast Gali post-acción |
| Campañas masivas sin guía Gali | ✅ Resuelto | Panel Roax Copilot Guide |
| Scroll señales/chat Hub | ✅ Resuelto | Altura fija + overflow en `.mission__bottom` |
| Navegación paneles confusa | ✅ Mejorado | Mode bar, tabs panel, section nav activo |
| Skills/Agentes/Reglas mezclados | 🟡 Mejorado v17.0 | Ontología en banners + wizard + editor reglas; skill-editor pipeline legacy pendiente |
| CAS UI incomprensible | 🟡 Parcial | Banner v4.0 + grid fix v8.0; rediseño profundo pendiente |
| Colapso menú → pantalla blanco | 🟡 Verificar | Fix v4.0/v9.0 en código; pendiente verificación visual |
| Nuevo proyecto paso a paso desde cero | ✅ v17.0 | 6 etapas + confirmación lanzamiento + toast borrador + agentes en launch |
| Marketplace skills poco visible | ✅ v17.0 | `/gali-v5/marketplace` sección propia 5 tabs |
| Chat "personalizar dashboard" | ✅ v10.0 | Comando abre customizer vía `gali-state.service` |
| Hub sin jerarquía / objetivo no editable | ✅ v17.0 | Ciclo arriba · toggle en mode-bar · mini-modal objetivo · widgets metas |
| Agentes decorativos / crear no persiste | ✅ v17.0 | Wizard 6 pasos · `launchAgent()` persiste · tab Configuración |
| Alertas acumuladas | 🟡 Parcial v17.0 | `primaryAlertActive` en 4 páginas; marketing/logística pendiente |

---

## Correcciones Post-Auditoría Jun 8, 2026 (v16.0)

**Fuente**: `docs/Descubrimientos/Correcionescata8jun.md`  
**Spec**: `docs/SpecsNuevos/8.AuditoriaJun8.md`  
**14 P0s detectados** — Hub Clarity + Ontología + Agentes funcionales + Explicabilidad

### Cambios al Modelo Conceptual (v16.0)

La definición de **Skill** se clarifica y corrige. La v15.0 tenía la ontología parcialmente rota:

| Concepto | Definición correcta (v16.0) | Analogía |
|---|---|---|
| **Skill** | Capacidad reutilizable que un agente puede invocar. No tiene trigger/condición/acción — eso pertenece al agente. | Plugin o función |
| **Agente** | Entidad autónoma que usa skills + reglas con su propia lógica de cuándo actuar. Tiene trigger/condición/acción propio. | Empleado con instrucciones |
| **Regla** | Condicional If-Then que controla cuándo el agente activa una skill. Vive en la ficha del agente, no en la skill. | Manual de procedimientos del empleado |

**Lo que cambia en UI**: Las cards de skill dejan de mostrar `trigger/condición/acción`. La ficha del agente tiene tab "Configuración" donde se configura su lógica, sus skills asignadas y su autopilot.

### Cambios de Arquitectura Visual (v16.0)

| Elemento | Antes (v15.0) | Después (v16.0) |
|---|---|---|
| Hub modo experto | Ciclo de Negocio debajo de Decisiones | Ciclo de Negocio ARRIBA de Decisiones |
| Toggle Básico/Experto | Dentro de sección Decisiones Pendientes | En el header del Hub (fuera de Decisiones) |
| Alertas por pantalla | Hasta 3 capas simultáneas: crítica + insight + sugerencia | Máx 1 activa: jerarquía crítica > info > sugerencia |
| Autopilot | En mode-bar + skills + chat lateral (3 lugares) | Solo en ficha del agente (1 lugar canónico) |
| Editar objetivo | Abre wizard completo de onboarding | Mini-modal inline solo para el objetivo |
| Onboarding | Pregunta pedidos/semana + tiempo en Dropi | Datos que Dropi ya sabe — eliminadas esas preguntas |

### GaliGoalOnboardingComponent (v16.0 — update)
**Path**: `src/app/pages/gali-v5/components/gali-goal-onboarding/`

Cambio: eliminar steps con `pedidosPerWeek` y "¿Cuánto tiempo llevas en Dropi?". Si el usuario tiene historial, Gali lo muestra como contexto desde `kpis-global.json`. Si es nuevo, mensaje: "Gali irá aprendiendo conforme lances tus primeros proyectos." El wizard no pregunta lo que el sistema ya sabe.

### Cambios Post-Revisionplan (v17.0 — Jun 10, 2026)

**Fuente**: `docs/Descubrimientos/Revisionplan.md` · Plan: `.cursor/plans/gali_v5_pendientes_cata_613e261a.plan.md`

| Área | Cambio implementado |
|---|---|
| **Hub jerarquía** | Ciclo arriba de Decisiones (experto) · Toggle Básico/Experto en mode-bar · Objetivo editable mini-modal · FAB acciones · Widgets metas/plan semanal |
| **Alertas** | `primaryAlertActive` en Hub + Wallet + Dashboard + Novedades · Intent-bar se suprime · Confirm modal en Señales |
| **Explicabilidad** | `resolucionResumen` en señales · "Ver qué hizo Gali/Vigilante" en proyecto-detalle y novedades · `GaliTermTooltip` shared |
| **Agentes** | Wizard 6 pasos · Persistencia · Tab Configuración · Umbrales cableados · Skill picker modal |
| **Reglas** | Editor libre + localStorage · Ontología copy corregido |
| **Skills/Marketplace** | Marketplace desanidado a `/gali-v5/marketplace` con 5 tabs · Skills sidebar sin trigger.agent fallback |
| **Proyectos** | Lista mergea `projects.json` · Portfolio health · Confirmación lanzamiento + toast borrador · Deep link `?signalId=` |
| **UX prototipo** | `DropiPrototypeFeedbackService` — feedback en botones sin handler |

### Pendiente post-v17.0 (Fases 4–5 Revisionplan)

- Tab "Capacidad" aditivo en skill-editor (sin borrar pipeline legacy)
- Multi-chat con threads/carpetas en right-panel
- Grafo Obsidian en micromundo (extender SVG existente)
- Búsqueda IA conversacional en nuevo-proyecto (panel adicional)
- `GaliTermTooltip` adoptado transversalmente en wallet/dashboard (componente creado, integración parcial)
- Verificación visual alertas mutuamente excluyentes en todos los módulos

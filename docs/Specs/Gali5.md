# Gali v5 — Business Operating System

**Versión**: 5.0 — OS Architecture + Business Intelligence + UX Clarity + Dual E-commerce + MCP Ecosystem + Multi-Channel  
**Fecha**: Junio 2026 (actualizado Jun 4, 2026)  
**Estado**: Prototipo activo v15.0 — Pipeline 7 specs ejecutado Jun 4: UniDatos · RediNavega · HubNegocio · Señales · ZeroState · Finance · Salud (ver SpecsNuevos/)

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
| **Agente** | Entidad especializada (Roax, Vigilante, Chatea Pro, ADA Spy) que ejecuta skills | En el workspace y en señales | No — es el ejecutor |
| **Skill** | Receta automatizable: Trigger + Condición + Acción | En Skills page + Skill Editor | Sí — historial auditable |
| **Regla** | Condicional simple Si/Entonces solo para Chatea Pro | En Chatea Pro, columna derecha | No — es operacional |

- Los **Agentes** son personas virtuales con rol específico. No son genéricos "IA".
- Las **Skills** tienen historial, pueden asignarse a cualquier agente, y se gestionan desde el OS workspace.
- Las **Reglas** son solo para Chatea Pro (WhatsApp). Son If-Then sin contexto de negocio. Para lógica más compleja → convertir a Skill.

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

### GaliGoalOnboardingComponent (v5.0)
**Path**: `src/app/pages/gali-v5/components/gali-goal-onboarding/`

Modal fullscreen de 3 pasos que aparece en la primera visita a `/gali-v5`. Almacena en `localStorage('gali_goal_configured')`. Pasos: objetivo de 30 días → pedidos/sem actuales + antigüedad → agente recomendado por objetivo. Exporta `shouldShowOnboarding()` helper.

### GaliAdaSpyDetailComponent (v5.0)
**Path**: `src/app/pages/gali-v5/components/gali-ada-spy-detail/`

Overlay lateral derecho (480px, `position: fixed`) con análisis completo de una oportunidad ADA Spy. Datos: score gauge SVG, ventana, precio/COGS/margen, ciudades top con bar chart, ROI proyectado (tabla), saturación. CTA "Lanzar con Gali" → navega a NuevoProyecto con query params pre-llenados. Acepta `productId` como input. Datos en `ADA_PRODUCTS` array en el mismo componente.

### GaliAutopilotConfigComponent (v5.0)
**Path**: `src/app/pages/gali-v5/components/gali-autopilot-config/`

Overlay lateral (440px) que abre el mode-bar ANTES de activar autopilot. Configura: budget máximo (slider $10k-$150k con presets), cambio de transportadora (toggle), WhatsApp confirm/recuperar (toggles). Muestra acciones que siempre requieren aprobación. Al confirmar llama `ws.toggleAutopilot()` y cierra.

### GaliWorkspaceService
**Path**: `src/app/pages/gali-v5/services/gali-workspace.service.ts`

Servicio singleton que gestiona el modo activo del workspace, el estado de Gali (activo / autopilot / pausado), y expone señales reactivas para todos los componentes.

```typescript
type WorkspaceMode = 'operar' | 'lanzar' | 'medir' | 'construir' | 'comunidad';

class GaliWorkspaceService {
  readonly activeMode = signal<WorkspaceMode>('operar');
  readonly galiPaused = signal(false);
  readonly autopilot = signal(false);
}
```

---

### GaliWorkspaceModeBarComponent
**Path**: `src/app/pages/gali-v5/components/gali-workspace-mode-bar/`

Barra superior siempre visible. Muestra:
- Tabs de los 5 modos (activo con fill naranja + sombra — v7.0)
- Progreso del objetivo activo (barra + fracción)
- Estado de Gali (activo / autopilot / pausado) — clickeable
- Autopilot abre `GaliAutopilotConfigComponent` antes de activar; scope persiste en `localStorage`

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
│   ├── gali-workspace.service.ts  ← Modos, estado de Gali
│   └── gali-state.service.ts      ← Panel derecho legacy
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
│   └── dropi-gali-bar/            ← Bar de agente en secciones (máx 1 por vista)
├── pages/
│   ├── agentes/                   ← [NUEVO v4.0] AgentesPageComponent
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
| `mocks/gali-v5/skill-rules.json` | 3 skills con historial de ejecución |
| `mocks/gali-v5/user-skills.json` | Skills de usuario (legacy) |
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
| Skills/Agentes/Reglas mezclados | 🔴 Pendiente v8.0 | Existe `/agentes` pero UX aún confusa |
| CAS UI incomprensible | 🟡 Parcial | Banner v4.0; rediseño completo pendiente |
| Colapso menú → pantalla blanco | 🔴 Verificar | Fix v4.0 documentado; re-test en browser |
| Nuevo proyecto paso a paso desde cero | 🟡 Parcial | `/proyectos/nuevo` 6 etapas; falta onboarding cero |
| Marketplace skills poco visible | 🟡 Parcial | Comunidad v6.0 en Skills; falta pantalla dedicada |
| Chat "personalizar dashboard" | 🔴 Pendiente | Comando en chat no abre customizer aún |

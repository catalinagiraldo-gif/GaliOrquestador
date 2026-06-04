# Gali v5 — Status del Prototipo

**Última actualización**: Junio 4, 2026 (v15.0 — Pipeline SpecsNuevos completo: 7 specs ejecutados · UniDatos→RediNavega→HubNegocio→Señales→ZeroState→Finance→Salud · Build limpio)  
**Anterior v14.0**: Coherencia + Estado Cero + Flujo Completo: dobles barras eliminadas · Panel Intensamente (3 tarjetas) · Strip propuesta de valor · Señales filtradas a críticas · Micromundo↔Onboarding conectados · Kronos en Dashboard Financiero · Build limpio  
**Arquitectura actual**: OS Architecture v15.0 — Pipeline SpecsNuevos 7/7 ejecutado · Hub 3 zonas · Vista /senales · Onboarding veterano · Tabs proyecto con datos reales

---

## Snapshot Actual (v11.0 + Jun 3 backlog)

> **Jun 3, 2026 (v12.0)** — Plan `GaliAjustesJun3.md` ejecutado en prototipo. Kronos activo como 5° agente. TikTok Shop MCP + Shopify MCP + Meta Ads MCP en Conexiones con badge Gali Pro. P&L desglosado por canal en Dashboard Financiero (identidad Kronos). Indicador de canal en tabla de Pedidos. Capa Determinista visual en Agentes. Los ítems 🔵 restantes (Micromundo estructurado + Page Pilot MCP real) permanecen en backlog.

| Capa | Estado | Descripción |
|---|---|---|
| Workspace OS | ✅ Implementado | Shell light + 5 modos + barra de modos |
| Señales con intervención | ✅ Implementado | GaliSignalCardV2 con lifecycle + link a SkillEditor |
| Proyectos como lente | ✅ Implementado | GaliProjectPanelComponent con acciones inline |
| Intervention Overlay | ✅ Implementado | Decisión contextual A/B/C + ejecución simulada |
| Skills Runtime | ✅ Implementado | GaliSkillBuilderV2 con pipeline + historial |
| Skill Editor Full-Page | ✅ Implementado | SkillEditorPageComponent en `/gali-v5/skills/nueva` |
| Modo Lanzar | ✅ Implementado | Chat interactivo conectado, sugerencias funcionales, typing indicator, ADA Spy con selección |
| Modo Medir | ✅ Implementado | P&L real con waterfall, ROAS real vs Meta, campañas Roax, atribución |
| Modo Comunidad | ✅ Implementado | Marketplace grid de skills |
| Skills Page | ✅ Implementado | Página dedicada + link a editor |
| Light OS Theme | ✅ Implementado | _gali-os-tokens.scss convertido a light mode |
| Live Mode / Autopilot | ✅ Implementado | Toggle bidireccional + badge "EN VIVO" + eventos enriquecidos |
| Chat → Workspace | ✅ Implementado | 11 comandos que cambian modo + akademy + personalizar |
| Campañas → Skill | ✅ Implementado | CTA navega a SkillEditor con agente=roax preconfigurado |
| **Modelo conceptual A/S/R** | ✅ **NUEVO v3.0** | Banner Agentes≠Skills≠Reglas en Skills page, rules as if/then en ChateaPro |
| **Agentes cards expandidos** | ✅ **NUEVO v3.0** | Skills page sidebar: agent cards con skills asignadas, última acción, estado |
| **ADA Spy strip catálogo** | ✅ **NUEVO v3.0** | Panel de 3 oportunidades con score + "Lanzar →" directamente desde catálogo |
| **Anatomía ciclo de negocio** | ✅ **NUEVO v3.0** | Arrows → en lugar de ←, "REPORTES" en lugar de "RENDIMIENTO", label "↻ Ciclo" |
| **Dashboard personalizable** | ✅ **NUEVO v3.0** | Botón Personalizar + slide-over panel + toggles de secciones + chat tip |
| **Akademy integrado** | ✅ **NUEVO v3.0** | AkademyPageComponent con cursos, recomendaciones por agente, progreso |
| **Nuevo proyecto modal** | ✅ **NUEVO v3.0** | 3 pasos conversacionales: producto → confirmar → lanzar |
| **Automatización flow diagram** | ✅ **NUEVO v3.0** | Diagrama visual Automatización→Skill→Agente→Resultado |
| **Campañas flow stepper** | ✅ **NUEVO v3.0** | Stepper Producto→Ángulo→Landing→Campaña→Mapa con estados |
| **Proveedores Gali insight** | ✅ **NUEVO v3.0** | Strip contextual con info de proveedor ligado al proyecto activo |
| **Productos vendidos sumario** | ✅ **NUEVO v3.0** | Gali Financial Agent summary con ROAS real, CTA a análisis completo |
| **Fix: colapso menú** | ✅ **NUEVO v4.0** | Bug crítico: `grid-column: 4` en shell content — menú colapsado ya no deja pantalla en blanco |
| **Fix: scroll universal** | ✅ **NUEVO v4.0** | `dropi-page-host` mixin: `flex:1; min-height:0; overflow-y:auto` — scroll funciona en todas las secciones |
| **Header contextual** | ✅ **NUEVO v4.0** | Zona central del header muestra agente responsable de la sección actual |
| **GaliAgentAlertComponent** | ✅ **NUEVO v4.0** | Componente unificado de alertas — 4 variantes: decision/monitoring/opportunity/completed |
| **Fix: alertas coherentes** | ✅ **NUEVO v4.0** | Garantías: eliminada alerta redundante. Logística: lenguaje claro. Campañas: eliminado skill banner duplicado |
| **AgentesPageComponent** | ✅ **NUEVO v4.0** | Página dedicada `/gali-v5/agentes` — 4 agent cards con skills, métricas, customización |
| **Agentes en rail IA** | ✅ **NUEVO v4.0** | Entrada "Agentes" en grupo AI del icon rail |
| **NuevoProyectoPageComponent** | ✅ **NUEVO v4.0** | Pantalla completa `/gali-v5/proyectos/nuevo` — 3 etapas iniciales |
| **Campañas copiloto** | ✅ **NUEVO v4.0** | Panel de Roax guiando el paso activo |
| **CAS explainer** | ✅ **NUEVO v4.0** | Banner colapsable en CAS explicando el flujo: cliente → Chatea Pro → tú decides |
| **Fix: CTA análisis** | ✅ **NUEVO v4.0** | "Ver análisis completo" en Productos Vendidos → va al dashboard |
| **P&L tooltip** | ✅ **NUEVO v4.0** | Tooltip explicativo + tab renombrado a "P&L Real (Ganancias)" |
| **GaliIntentBarComponent** | ✅ **NUEVO v5.0** | Command bar sticky bajo el header — lenguaje natural + shortcuts ⚡🚀📊 |
| **Rail hover-expand** | ✅ **NUEVO v5.0** | Icon rail expande a 200px con labels al hover |
| **GaliGoalOnboardingComponent** | ✅ **NUEVO v5.0** | Modal 3 pasos en primera visita: objetivo → estado → agente recomendado |
| **GaliAdaSpyDetailComponent** | ✅ **NUEVO v5.0** | Overlay lateral 480px: score gauge, ciudades, ROI proyectado, competencia |
| **Conexiones como Mapa Visual** | ✅ **NUEVO v5.0** | Grafo GALI CORE → Agentes → Plataformas con panel de detalles |
| **Proyecto 6 etapas** | ✅ **NUEVO v5.0** | Estrategia Creativa + Landing Preview + Configuración Campaña + ángulos Gali |
| **GaliAutopilotConfigComponent** | ✅ **NUEVO v5.0** | Overlay configurador: presupuesto máx, transportadora, WhatsApp |
| **CAS bandeja categorizada** | ✅ **NUEVO v5.0** | Urgente / Chatea Pro gestionando / Resueltos 24h + respuesta editable |
| **Business Health Score** | ✅ **NUEVO v6.0** | Widget en header (0–100) con breakdown ROAS/novedades/conversión/P&L |
| **Gali Memory Panel** | ✅ **NUEVO v6.0** | Tab Memoria en right panel — patrones, decisiones, preferencias autopilot |
| **Cloud Files Panel** | ✅ **NUEVO v6.0** | Tab Archivos en right panel — Drive + locales con filtros |
| **Autopilot Scope persistencia** | ✅ **NUEVO v6.0** | `localStorage` — presupuesto, transportadora, WhatsApp; reflejado en Memory |
| **Skill Marketplace comunidad** | ✅ **NUEVO v6.0** | Creator profiles, ratings, forks, share modal, "Usar como base" |
| **Dashboard Financiero P&L** | ✅ **NUEVO v6.0** | Waterfall + semanal + proyecciones Gali + `galiInsight` en KPIs |
| **Ambient Intelligence (`galiInsight`)** | ✅ **NUEVO v6.0** | Directiva tooltip Gali al hover — aplicada en dashboard financiero |
| **Mode bar visibilidad activa** | ✅ **NUEVO v7.0** | Tab activo: fill naranja + sombra; tooltips en hover |
| **Right panel navegación** | ✅ **NUEVO v7.0** | 6 tabs scroll horizontal, iconos, context bar con hint de tab |
| **Section nav activo** | ✅ **NUEVO v7.0** | Borde naranja inset + semibold en ítem activo |
| **Hub scroll chat/señales** | ✅ **NUEVO v7.0** | Secciones con altura fija + overflow-y en mensajes y lista señales |
| **Catálogo alerta única** | ✅ **NUEVO v7.0** | Eliminado `dropi-gali-bar` duplicado; solo ADA Spy strip |
| **Glosario P&L novatos** | ✅ **NUEVO v7.0** | `<details>` expandible + abbr en header dashboard financiero |
| **Personalizar follow-through** | ✅ **NUEVO v7.0** | Botón Guardar + toast Gali "Dashboard actualizado" |
| **Campañas Roax Copilot** | ✅ **NUEVO v7.0** | Panel guía: KPIs, decisión escala, 3 pasos explicados |
| **Swap automático explicado** | ✅ **NUEVO v7.0** | Abbr en Torre Logística con definición en lenguaje claro |
| **CAS grid layout fix** | ✅ **NUEVO v8.0** | Grid rows corregidos. Host overflow:hidden, paneles scroll interno independiente |
| **CAS intro narrativo** | ✅ **NUEVO v8.0** | Header compacto con flow visual: Cliente→Chatea Pro (88%)→Tú decides (12%) |
| **ADA Spy "Ver análisis"** | ✅ **NUEVO v8.0** | CTA wired en Caza Productos → `GaliAdaSpyDetailComponent` |
| **Agentes: capacidades + historial** | ✅ **NUEVO v8.0** | Lista de capacidades + 4 acciones recientes con impacto + CTAs específicos por agente |
| **Concepto A/S/R visual** | ✅ **NUEVO v8.0** | Banner Agentes page: cards individuales con íconos, grid 3 columnas |
| **Section panels A/S/R/M/C** | ✅ **NUEVO v9.0** | Agentes, Skills, Reglas, Marketplace y Conexiones con paneles contextuales + cross-links. `NO_PANEL_RAIL_KEYS` actualizado. |
| **Responsive universal (7 páginas)** | ✅ **NUEVO v9.0** | Agentes, Skills, CAS Bandeja, Conexiones, Proyectos List, Dashboard Financiero, Reglas — grids fijos colapsados a 1fr en ≤900px |
| **Persistent section collapse** | ✅ **NUEVO v9.0** | `sectionNavCollapsed` persiste en `localStorage` — no se resetea en cada navegación |
| **Concepto A/S/R accionable** | ✅ **NUEVO v9.0** | Banner: Agente→usa Skills vs Reglas. CTAs "Mis skills →" + "+ Crear skill" + "Mis reglas →". Descripción diferenciada por tipo. |
| **Onboarding Día 1** | ✅ **NUEVO v11.0** | Paso 4 del onboarding muestra 3 pasos accionables según el objetivo: navegan directamente a ADA Spy / Reglas / Proyectos |
| **Toasts con link a Memoria** | ✅ **NUEVO v11.0** | Toast de agente incluye botón "Ver en Memoria →" que abre el panel derecho en el tab de Memoria vía `requestedPanelTab` signal |
| **Alertas unificadas Garantías** | ✅ **NUEVO v11.0** | `GaliAgentAlertComponent` reemplaza `dropi-gali-bar` en Garantías — formato decision, Vigilante, con CTA + link a señales |
| **Diagnóstico campaña fallida** | ✅ **NUEVO v11.0** | Panel post-mortem Roax en Campañas: 3 factores (CTR/CVR/saturación) con % de culpa, causa y acción recomendada por agente |
| **Economía unitaria Dashboard** | ✅ **NUEVO v11.0** | Nueva sección en Dashboard Financiero: LTV/CAC ratio, margen/unidad, ROAS break-even vs real, semanas de recuperación — con galiInsight |
| **Skill Creator Dashboard** | ✅ **NUEVO v11.0** | Sección en Marketplace con stats (3 skills, 47 usuarios, 12 forks, 4.7★), lista de skills publicadas con versión y estado |
| **Crear agente personalizado** | ✅ **NUEVO v11.0** | Slide-over 3 pasos en Agentes: nombre+rol → skills → confirmar → lanzar. Con sugerencias de roles y skills seleccionables |
| **Chat → Customizer auto-conectado** | ✅ **NUEVO v10.0** | Escribir "personalizar dashboard" en chat abre el customizer automáticamente sin necesidad de click en botón de acción |
| **Panel escalamiento Roax** | ✅ **NUEVO v10.0** | Sección en Reglas con 6 reglas estilo Revealbot: ROAS/CTR/Frecuencia/Dayparting/CPA/CPM — con toggles y tooltips explicativos |
| **galiInsight en Pedidos** | ✅ **NUEVO v10.0** | Directiva `galiInsight` aplicada a columnas de transportadora (insight por carrier) y recaudo en órdenes |
| **galiInsight en Campañas** | ✅ **NUEVO v10.0** | Directiva aplicada a KPIs del panel Roax: ROAS, presupuesto/día, estado de escalamiento |
| **galiInsight en Torre Logística** | ✅ **NUEVO v10.0** | Directiva aplicada a efectividad % de cada transportadora con análisis Vigilante |
| **Smart Routing Vigilante** | ✅ **NUEVO v10.0** | Panel en Torre Logística: tabla por ciudad con carrier actual vs sugerido, % novedad, pedidos pendientes, botón "Aplicar todas" |
| **Buscador semántico Catálogo** | ✅ **NUEVO v10.0** | Sección ADA Spy en catálogo: búsqueda en lenguaje natural ("colágeno para Bogotá a $50k"), chips de sugerencia, resultados con score/margen/razón |
| **Agente Kronos** | ✅ **NUEVO v12.0** | 5° agente Finanzas / P&L / Facturación / Siigo · Color `#60a5fa` · Card en Agentes con 5 capacidades + historial · Visible en Conexiones como agente conectado · Header Kronos en Dashboard Financiero |
| **TikTok Shop MCP** | ✅ **NUEVO v12.0** | Card en Conexiones (categoría E-commerce) · Badge Gali Pro · Panel detalle con impacto real · Indicador canal en Pedidos |
| **Shopify MCP** | ✅ **NUEVO v12.0** | Card en Conexiones (categoría E-commerce) · Badge Gali Pro · Descripción sincronización bidireccional · Indicador canal en Pedidos |
| **Meta Ads MCP** | ✅ **NUEVO v12.0** | Nodo separado explícito en Conexiones (antes fusionado con TikTok Ads) · Métricas ROAS real vs Meta en panel |
| **Siigo MCP** | ✅ **NUEVO v12.0** | Descripción actualizada con Kronos como responsable · Alerta 28 pedidos sin facturar · Urgente |
| **P&L desglosado por canal** | ✅ **NUEVO v12.0** | Sección completa en Dashboard Financiero: 5 canales (Meta, TikTok Shop, Shopify, WhatsApp, Directo) con ventas, ROAS real, novedad, utilidad y margen · Bar chart de participación · Insight Kronos |
| **Indicador canal en Pedidos** | ✅ **NUEVO v12.0** | Columna "Canal" en tabla de pedidos con chips de color por canal (Meta/TikTok Shop/Shopify/WhatsApp/Directo) · Campo `channel` + `channelLabel` en `orders.json` |
| **Capa Determinista visual** | ✅ **NUEVO v12.0** | Banner en Agentes page: 4 validaciones pre-LLM con dots de estado · Link a Reglas · Principio de confianza progresiva |
| **Gali Pro tier** | ✅ **NUEVO v12.0** | Badge PRO en nodos TikTok Shop y Shopify en mapa de Conexiones · Banner informativo en panel de detalle · Leyenda actualizada en mapa |
| **🔵 Micromundo estructurado** | 🔵 **BACKLOG** | Grafo de negocio del usuario como objeto unificado. Upload de contexto externo (CSV, Drive, Shopify URL) para construir el perfil |
| **🔵 Page Pilot MCP real** | 🔵 **BACKLOG** | Conectar Landing Preview de NuevoProyectoPage con deploy real en lugar de solo preview |
| **Unificación de datos (Spec 1)** | ✅ **NUEVO v15.0** | `projects.json` + `kpis-global.json` canónicos · ROAS 1.93x corregido en todo el prototipo · dashboard-financiero consume mock maestro · campanas SMS/Email sin pauta Meta |
| **Rediseño Navegación (Spec 2)** | ✅ **NUEVO v15.0** | Rail reducido a 10 ítems · "Centro de Gali" accordion en panel · Tab "Mi negocio" · `/gali-v5/senales` en matchPrefixes · Fix proyectos/nuevo ruta |
| **Hub Tres Zonas (Spec 3)** | ✅ **NUEVO v15.0** | Zona 1 borde naranja + Zona 2 ciclo horizontal + Zona 3 colapsable · ROAS 1.93x en tarjeta Marketing · "Gali esta semana" · Modal 2 pasos acción masiva |
| **Vista Señales (Spec 4)** | ✅ **NUEVO v15.0** | Ruta `/gali-v5/senales` · SenalesPageComponent · 5 señales predictivas + 3 alertas operativas · bloque macromundo Dropi · filtros funcionales |
| **ZeroState & Progresivo (Spec 5)** | ✅ **NUEVO v15.0** | Step 6 veterano en onboarding · Toggle Básico/Experto en Zona 1 · visibleModules en rail · Tabs proyecto con datos reales de projects.json (47/sem, 15% novedad) |
| **Finanzas Kronos (Spec 6)** | ✅ **NUEVO v15.0** | Wallet Kronos bar + accordion transacciones · Error card Siigo cuantificado · Period badges Mensual/Semanal · kpis-global.json en dashboard |
| **Score de Salud (Spec 7)** | ✅ **NUEVO v15.0** | health-panel con ring + benchmark 82/100 · Semáforo tasa éxito agentes · Panel umbrales desde Hub y Agentes · Bloques "Gali ya lo hizo" / "Necesitas decidir" · "Modo básico" en footer |

---

## Componentes Nuevos (OS v2.0+)

| Componente | Path | Estado |
|---|---|---|
| `GaliWorkspaceService` | `services/gali-workspace.service.ts` | ✅ Toggle autopilot real + 13 eventos en pool |
| `GaliStateService` | `services/gali-state.service.ts` | ✅ 9 respuestas workspace-aware + acción autopilot |
| `GaliWorkspaceModeBarComponent` | `components/gali-workspace-mode-bar/` | ✅ Badge "EN VIVO" pulsante |
| `GaliSignalCardV2Component` | `components/gali-signal-card-v2/` | ✅ Followup CTA navega a SkillEditor |
| `GaliProjectPanelComponent` | `components/gali-project-panel/` | ✅ |
| `GaliInterventionOverlayComponent` | `components/gali-intervention-overlay/` | ✅ |
| `GaliSkillBuilderV2Component` | `components/gali-skill-builder-v2/` | ✅ |
| `SkillEditorPageComponent` | `pages/skills/skill-editor-page.component.*` | ✅ Editor full-page |
| `GaliRightPanelComponent` | `components/gali-right-panel/` | ✅ 6 tabs + Memory + Files (v6/v7) |
| `GaliInsightDirective` | `directives/gali-insight.directive.ts` | ✅ Dashboard financiero |
| `DashboardFinancieroPageComponent` | `pages/reportes/dashboard-financiero-page.*` | ✅ v6.0 |
| `DropiHeaderIa2Component` | `components/dropi-header-ia2.component.*` | ✅ Health Score + agente ctx |
| `AgentesPageComponent` | `pages/agentes/agentes-page.component.*` | ✅ v4.0 — separado de Skills |
| `NuevoProyectoPageComponent` | `pages/proyectos/nuevo-proyecto-page.component.*` | ✅ v4.0/v5.0 — 6 etapas |
| `GaliIntentBarComponent` | `components/gali-intent-bar/` | ✅ v5.0 — command bar |
| `GaliGoalOnboardingComponent` | `components/gali-goal-onboarding/` | ✅ v5.0 — modal primera visita |
| `GaliAdaSpyDetailComponent` | `components/gali-ada-spy-detail/` | ✅ v5.0/v8.0 — overlay análisis |
| `GaliAutopilotConfigComponent` | `components/gali-autopilot-config/` | ✅ v5.0 — configurador scope |
| `GaliContextStripComponent` | `components/gali-context-strip/` | ✅ v5.0 — strip contextual |
| `DropiIaRailComponent` | `components/dropi-ia-rail/` | ✅ v9.0 — rail IA con sección Agentes |
| `_gali-os-tokens.scss` | `src/styles/` | ✅ Light mode |

---

## Componentes Previos (aún activos)

| Componente | Estado | Nota |
|---|---|---|
| `GaliChipComponent` | ✅ Activo | Presencia de agente en secciones de negocio |
| `DropiGaliBarComponent` | ✅ Activo | Bar de agente en secciones — máx 1 alerta; catálogo usa solo ADA strip (v7) |
| `CrearProyectoModalComponent` | 🔄 Supersedido | Reemplazado por Modo Lanzar en el workspace |
| `SkillsEditorModalComponent` | 🔄 Supersedido | Reemplazado por GaliSkillBuilderV2 |

---

## Build Status

```
✅ ng build --configuration development: sin errores
⚠  3 warnings (nullish coalescing triviales — no rompen funcionalidad)
```

---

## Rutas Activas del OS

| Ruta | Componente | Estado |
|---|---|---|
| `/gali-v5` | `DropiHomeComponent` (OS Workspace) | ✅ Workspace Hub + Akademy strip |
| `/gali-v5/skills` | `SkillsPageComponent` | ✅ Modo Construir + agents cards + responsive v9 |
| `/gali-v5/skills/nueva` | `SkillEditorPageComponent` | ✅ Editor full-page con preview en vivo |
| `/gali-v5/skills/comunidad` | `SkillsPageComponent` (tab comunidad) | ✅ Marketplace comunidad v6.0 |
| `/gali-v5/proyectos` | `ProyectosListPageComponent` | ✅ Lista + responsive v9 |
| `/gali-v5/proyecto/:id` | `ProyectoDetallePageComponent` | ✅ Detalle |
| `/gali-v5/proyectos/nuevo` | `NuevoProyectoPageComponent` | ✅ Pantalla completa 6 etapas |
| `/gali-v5/academy` | `AkademyPageComponent` | ✅ Cursos + Gali rec + progreso |
| `/gali-v5/agentes` | `AgentesPageComponent` | ✅ Agentes separados de Skills + responsive v9 |
| `/gali-v5/reglas` | `ReglasPageComponent` | ✅ Si/Entonces + responsive v9 |
| `/gali-v5/conexiones` | `ConexionesPageComponent` | ✅ Mapa visual + responsive v9 |
| `/gali-v5/productos/catalogo` | `CatalogPageComponent` | ✅ ADA Spy strip (1 alerta, v7) |
| `/gali-v5/productos/caza-productos` | `CazaPageComponent` | ✅ ADA Spy detail overlay wired |
| `/gali-v5/productos/proveedores` | `ProvidersPageComponent` | ✅ Gali insight bar |
| `/gali-v5/marketing/chatea-pro` | `ChateaProPageComponent` | ✅ Rules redesign if/then |
| `/gali-v5/marketing/campanas` | `CampanasPageComponent` | ✅ Flow stepper + Roax Copilot Guide |
| `/gali-v5/marketing/automatizacion` | `AutomatizacionPageComponent` | ✅ Flow diagram |
| `/gali-v5/reportes/productos-vendidos` | `ProductosVendidosPageComponent` | ✅ Financial summary |
| `/gali-v5/reportes/dashboard-financiero` | `DashboardFinancieroPageComponent` | ✅ Waterfall P&L + proyecciones + responsive v9 |
| `/gali-v5/cas/bandeja` | `CasBandejaPageComponent` | ✅ CAS rediseñado + responsive v9 |

---

## Arquitectura Visual

```
Shell (gali-v5-shell)
├── dropi-header-ia2 (salud + agente ctx + señales — transversal)
├── dropi-ia-rail + dropi-icon-rail (left rails)
├── dropi-section-nav (submenu — activo borde naranja, persiste collapse en localStorage)
└── main content
    ├── gali-context-strip + gali-intent-bar
    ├── router-outlet → módulos de negocio
    └── gali-right-panel (overlay — 6 tabs: Chat/Señales/Agentes/Live/Memoria/Archivos)
        └── DropiHomeComponent en /gali-v5
            ├── gali-workspace-mode-bar (modos — tab activo naranja)
            └── mission layout: insight | anatomía | señales+chat | akademy

Responsive (v9.0):
  ≤900px  → section-nav collapse forzado (48px), grids fijos → 1fr
  ≤767px  → ia-rail y section-nav hidden, icon-rail visible, content full-width
```

---

## Seguimiento CorrecionesGali5.md

| # | Issue | Estado |
|---|---|---|
| 1 | Header: chips proyecto muertos | ✅ v4/v7 — zona contextual transversal con agente activo por sección |
| 2 | Scroll roto en secciones | ✅ v4 scroll universal + v9 responsive — verificado en Agentes, Skills, CAS, Proyectos, Financiero |
| 3 | Dos alertas ADA Spy catálogo | ✅ v7 — una sola strip |
| 4 | Ver análisis → nada | ✅ v8 — CTA wired en Caza Productos → overlay funcional |
| 5 | Lanzar con Gali → Hub sin guía | 🟡 Onboarding v5 existe; falta señal contextual específica al llegar desde catálogo |
| 6 | Alertas incoherentes (órdenes/garantías/logística) | 🟡 Catálogo OK (v7); garantías y logística usan formatos distintos — pendiente unificación total |
| 7 | Torre Logística / swap automático | ✅ v7 — abbr explicativo |
| 8 | Ver análisis completo → wallet | ✅ v6 — dashboard financiero |
| 9 | P&L sin explicación | ✅ v7 — glosario expandible |
| 10 | Campañas sin guía Gali | ✅ v7 — Roax Copilot |
| 11 | Personalizar dashboard dead-end | 🟡 v7 tiene guardar + toast; comando chat "personalizar dashboard" aún no conecta al customizer real |
| 12 | Scroll señales/chat Hub | ✅ v7 |
| 13 | Skills/Agentes/Reglas mezclados | ✅ v8/v9 — banner A/S/R con jerarquía semántica, CTAs de creación, section panels separados |
| 14 | Marketplace skills poco visible | 🟡 v6 comunidad existe; falta acceso directo desde rail o módulo independiente |
| 15 | Nuevo proyecto paso a paso | 🟡 v5 tiene 6 etapas; falta onboarding completo para usuario desde cero |
| 16 | CAS UI confusa | ✅ v8 — grid fix + intro narrativo + panels scroll independiente |
| 17 | Colapso menú → pantalla en blanco | 🟡 Fix aplicado en código (v4/v9); pendiente verificación visual en browser |
| 18 | Chat "personalizar dashboard" no conectado | 🔴 Comando escrito en chat no abre el customizer — flujo roto |

---

---

## Nuevas Capacidades — Backlog Jun 3, 2026 (desde GaliAjustesJun3.md)

### ✅ Implementado en v13.0 (Jun 3, 2026) — Visibilidad + Backlog completo

| Item | Estado | Descripción |
|---|---|---|
| **Micromundo estructurado** | ✅ | Página dedicada `/gali-v5/micromundo` con 4 tabs: Perfil operativo (6 cards) · Grafo de negocio (capas Proyectos→Campañas→Pedidos→Proveedores→Transportadoras) · Comportamiento (timeline de decisiones/skills/alertas) · Contexto externo (upload CSV/Drive/Shopify/Meta) |
| **Page Pilot MCP real** | ✅ | En paso "Landing" de NuevoProyecto: flujo simulado completo → Generando → Desplegando → Live con URL real `dropi.co/lp/...`, CVR estimado, pixel instalado automaticamente |
| **Dashboard Financiero visible** | ✅ | Añadido "P&L · Kronos 💎" al panel lateral de Reportes con badge NUEVO — ahora se ve en la nav |
| **Kronos en panel Agentes** | ✅ | Entrada "Kronos · Finanzas 💎" en el panel lateral de Agentes con badge NUEVO |
| **Conexiones categorizado** | ✅ | Panel lateral de Conexiones reorganizado: MCPs Core (Meta Ads, WhatsApp, Siigo ⚠) · Canales Pro (TikTok Shop PRO, Shopify PRO, Page Pilot) · Utilidades (Drive) |
| **Micromundo en GALI_MISSION_PANEL** | ✅ | "Mi Negocio 🌐" con badge NUEVO en el panel hub de Gali — accesible desde home |
| **Conexiones visible desde hub** | ✅ | "Conexiones" añadido al GALI_MISSION_PANEL — antes invisible desde el hub |

### ✅ Implementado en v12.0 (Jun 3, 2026)

| Item | Estado | Descripción |
|---|---|---|
| **Agente Kronos** | ✅ | 5° agente en Agentes page + Conexiones. Color `#60a5fa`. 5 capacidades, 4 acciones recientes, 3 CTAs. Badge pulsante Kronos en Dashboard Financiero |
| **TikTok Shop MCP** | ✅ | Card en Conexiones con badge Gali Pro. Descripción webhook → pipeline Dropi. Panel de detalle completo |
| **Shopify MCP** | ✅ | Card en Conexiones con badge Gali Pro. Descripción sincronización bidireccional. Vigilante como responsable logístico |
| **Meta Ads MCP** | ✅ | Nodo dedicado en Conexiones (categoría Publicidad). Métricas ROAS Meta vs real. Separado de TikTok Ads |
| **Siigo MCP** | ✅ | Actualizado: Kronos como responsable. Alerta 28 pedidos sin facturar ($4.2M riesgo fiscal). Urgente |
| **P&L desglosado por canal** | ✅ | Sección "P&L por Canal" en Dashboard Financiero: 5 canales con ventas/pedidos/ROAS real/novedad/utilidad/margen + bar chart + insight Kronos |
| **Indicador canal en Pedidos** | ✅ | Columna "Canal" en tabla órdenes con chips por canal · `channel` + `channelLabel` en `orders.json` · 5 canales distribuidos en 20 pedidos |
| **Capa Determinista** | ✅ | Banner visual en Agentes page: 4 validaciones con dots de estado verde · principio explicado · link a Reglas |
| **Gali Pro tier** | ✅ | Badge `PRO` naranja en nodos TikTok Shop y Shopify del mapa · Banner en panel detalle · Leyenda actualizada |

### 🔵 Pendiente — Backlog residual

| Item | Descripción | Bloque |
|---|---|---|
| **Dashboard estado cero** | Cuando el usuario es nuevo: solo 2-3 módulos según su objetivo (hub vacío) | Bloque 6 |
| **Dashboard estado experto** | Grafo visual del negocio en home (nodos: proyectos → campañas → pedidos → P&L) | Bloque 6 |

---

## Lo que Falta — Backlog Priorizado v10.0

### 🔴 Alta prioridad (bloqueantes de UX o flujos rotos)

| Item | Descripción | Fuente |
|---|---|---|
| ~~**Chat → customizer conectado**~~ | ✅ **Resuelto v10.0** — Auto-abre customizer al detectar "personalizar" en el chat | CorrecionesGali5 #18 |
| ~~**Break-even ROAS calculator**~~ | ✅ **Ya existía** — Implementado en paso 5 (Campaña) de NuevoProyectoPage | AlcancesIADropi2 + Skills doc |
| ~~**Panel escalamiento Roax (Si/Entonces visual)**~~ | ✅ **Resuelto v10.0** — Sección en Reglas con 6 reglas Revealbot: ROAS/CTR/Freq/Dayparting/CPA/CPM | Skills para Dropshipping doc |
| **Verificación colapso menú en browser** | El fix de `localStorage` + grid está en código pero no verificado visualmente — puede seguir roto | CorrecionesGali5 #17 |

### 🟡 Media prioridad (valor diferencial alto)

| Item | Descripción | Fuente |
|---|---|---|
| ~~**galiInsight en Pedidos, Campañas, Logística**~~ | ✅ **Resuelto v10.0** — Directiva aplicada en transportadora/recaudo (Pedidos), ROAS/presupuesto/estado (Campañas), efectividad % (Logística) | StatusGali5 v9.0 plan |
| ~~**Señal contextual al llegar desde catálogo**~~ | ✅ **Ya existía** — HubEntryContext implementado v4.0, banner en home.component al venir del catálogo | CorrecionesGali5 #5 |
| ~~**Onboarding usuario desde cero**~~ | ✅ **Resuelto v11.0** — Paso 4 conectado con camino Día 1: 3 pasos con navegación directa según el objetivo del usuario | CorrecionesGali5 #15 |
| ~~**Buscador semántico en Catálogo**~~ | ✅ **Resuelto v10.0** — Panel ADA Spy en catálogo con búsqueda en lenguaje natural, chips, resultados con score/margen/ciudad/razón | AlcancesIADropi2 sección A |
| ~~**Smart Routing en Pedidos / Torre Logística**~~ | ✅ **Resuelto v10.0** — Panel Vigilante Smart Routing en Torre Logística: ciudad/carrier actual/sugerido/novedad/pedidos, botón "Aplicar todas" | AlcancesIADropi2 sección C |
| ~~**Unificación visual de alertas**~~ | ✅ **Resuelto v11.0** — `GaliAgentAlertComponent` aplicado en Garantías (decision) y Torre Logística (monitoring). Sistema de alertas unificado en todas las páginas. | CorrecionesGali5 #6 |

### 🟡 Baja prioridad (funcionalidad avanzada)

| Item | Descripción | Fuente |
|---|---|---|
| **Skill Creator Dashboard** | Vista de skills publicadas en comunidad: métricas de uso, forks, versiones, ingresos si es de pago. Para dropshippers que crean y comparten skills | StatusGali5 v9.0 plan |
| **Toasts de agentes** | Cuando un agente ejecuta algo en background, mostrar toast con link al Memory Panel: "Vigilante pausó 2 transportadoras con más del 20% novedad → Ver en Memoria" | StatusGali5 v9.0 plan |
| **"Huella digital" del cliente en Pedidos** | Score de riesgo por cliente basado en historial: bloqueo automático de pedidos de alto riesgo, sugerencia de cobro de anticipo | AlcancesIADropi2 sección C |
| **Diagnóstico de campaña fallida** | Post-mortem automático de Roax: si una campaña falla, analizar si fue el anuncio (CTR bajo), la landing (CVR bajo) o el producto (saturación) | AlcancesIADropi2 sección B |
| **Economía unitaria en Dashboard** | Panel LTV/CAC, margen de contribución por producto, proyección de escalamiento con Target ROAS calculado | Skills para Dropshipping doc |
| **Integración Siigo / facturación** | Pantalla de configuración contable: conectar Siigo, regla "facturar solo órdenes Entregado", facturación masiva | AlcancesIADropi2 sección D |
| **Crear agente personalizado** | Flujo para que el dropshipper cree su propio agente con nombre, rol, skills asignadas y reglas propias — más allá de los 4 agentes de fábrica | CorrecionesGali5 análisis |

---

## Completado en v9.0 (Responsive + A/S/R clarity — Junio 1, 2026)

| Item | Descripción |
|---|---|
| **Responsive Agentes page** | Grid 320px+1fr → 1fr en ≤900px; header-actions con flex-wrap; banner concepto A/S/R apila verticalmente |
| **Responsive Skills page** | Sidebar 260px oculta en ≤900px; grid colapsa a 1fr |
| **Responsive CAS Bandeja** | Grid 360px+1fr+320px → 300px+1fr en ≤1100px → 1fr en ≤900px |
| **Responsive Conexiones** | Panel lateral 380px colapsa a 1fr en ≤900px al abrirse |
| **Responsive Proyectos List** | 5 columnas fijas → 4 cols en ≤1000px → 2 cols en ≤767px |
| **Responsive Dashboard Financiero** | `waterfall-row` 220px fija → 1fr en ≤767px |
| **Section panels habilitados** | Eliminado de `NO_PANEL_RAIL_KEYS`: agentes, skills, reglas, marketplace, conexiones. Cada uno tiene panel lateral contextual con menú y cross-links |
| **Persistent collapse** | `sectionNavCollapsed` en `localStorage`; `syncNav()` no resetea en navegación |
| **Banner A/S/R accionable** | Conector semántico "usa" (agente usa skills) y "vs" (skills vs reglas); CTAs "+ Crear skill" con estilo pill naranja; "Mis reglas →" |
| **StatusGali5.md actualizado** | Backlog priorizado con fuentes (CorrecionesGali5, AlcancesIADropi2, Skills doc) |

---

## Completado en v8.0 (Arquitectura conceptual limpia — Junio 1, 2026)

| Item | Descripción |
|---|---|
| **CAS rediseño completo** | Grid fix (row 5 1fr), host overflow:hidden, intro narrativo con flow visual |
| **ADA Spy "Ver análisis"** | CTA wired en CazaPage → GaliAdaSpyDetailComponent con mapping de productos |
| **Agentes: capacidades + historial + CTAs** | 5 capacidades, 4 acciones con impacto, CTAs específicos por agente |
| **Concepto A/S/R visual** | Banner Agentes page rediseñado con cards individuales, íconos, grid 3 columnas |

---

## Completado en v7.0 (UX Fix Sprint — Mayo 31, 2026)

| Item | Descripción |
|---|---|
| **Mode bar visibilidad** | Tab activo con fill naranja, sombra coloreada, tooltip descripción en hover |
| **Right panel tabs** | Scroll horizontal, iconos PrimeNG, context bar agente + hint de tab |
| **Section nav activo** | `box-shadow: inset 3px 0 0` naranja + font-semibold |
| **Hub scroll fix** | Chat y señales con altura fija 380px + overflow interno |
| **Alerta única catálogo** | Removido `dropi-gali-bar` duplicado en catálogo |
| **Glosario P&L** | Panel `<details>` en dashboard financiero + abbr en subtítulo |
| **Personalizar follow-through** | `saveAndCloseCustomizer()` + toast Gali 5s post-guardado |
| **Roax Copilot campañas** | KPIs, decisión escala, 3 pasos "cómo te ayuda Roax" |
| **Swap automático** | Definición inline en loop de Vigilante (Torre Logística) |

---

## Completado en v6.0 (Business Intelligence — Mayo 31, 2026)

| Item | Descripción |
|---|---|
| **Gali Memory Panel** | Tab en right panel — patrones aprendidos, decisiones con undo, preferencias de autopilot, insights de negocio |
| **Cloud Files Panel** | Tab en right panel — Google Drive, archivos locales, creativos accesibles desde flujo de campaña con filtros |
| **Persistencia Autopilot Scope** | Config de autopilot guardada en localStorage — presupuesto máx, transportadora, WhatsApp. Refleja en Memory Panel |
| **Skill Marketplace Comunidad** | Creator profiles con avatar/bio, forks count, ratings, "Usar como base", share modal al publicar |
| **Dashboard Financiero Completo** | `/reportes/dashboard-financiero` — Waterfall P&L consolidado, desglose semanal, proyecciones 3 escenarios (Gali) |
| **Ambient Intelligence Layer** | Directiva `galiInsight` — hover sobre métricas muestra análisis de Gali. Aplicada en KPIs financieros + ROAS badges |
| **Fix: "Ver análisis completo"** | Productos vendidos → ahora navega al Dashboard Financiero real |

---

## Completado en v5.0 (Orquestación Total)

| Item | Descripción |
|---|---|
| Intent Bar | Command bar con lenguaje natural + shortcuts ⚡🚀📊 |
| Rail hover-expand | Labels visibles en hover — estilo VS Code Activity Bar |
| Goal Onboarding | Modal 3 pasos en primera visita — objetivo + estado + agente recomendado |
| ADA Spy Detail Overlay | Análisis completo con score gauge, ciudades, ROI proyectado, competencia |
| Conexiones como Mapa Visual | Grafo Gali Core → Agentes → Plataformas con panel de detalles |
| Proyecto 6 etapas | Estrategia Creativa (ángulos Gali), Landing Preview, Campaña con skills |
| Autopilot Scope Configurator | El usuario define qué puede hacer Gali sin pedir permiso |
| CAS bandeja categorizada | Urgente / Gestionando / Resueltos + respuesta Chatea Pro editable |

---

## Señales del Sistema (Mock)

| Signal | Agente | Estado | Tipo |
|---|---|---|---|
| Coordinadora Bogotá 15% novedad | Vigilante | pending_decision | critica |
| Video A → Video B (CTR mejora) | Roax | completed | completada |
| 1 novedad requiere decisión | Chatea Pro | pending_decision | decision |
| Difusor aromaterapia oportunidad | ADA Spy | pending_decision | oportunidad |
| Escalado ROAS +15% | Roax | completed | completada |

---

## Skills Mockeadas

| Skill | Estado | Ejecuciones |
|---|---|---|
| Auto-pausa si CTR cae | ● Activa | 7 |
| Escalado ROAS automático | ● Activa | 3 |
| Smart routing novedad | ○ Pausada | 12 |

---

## Flujos Adyacentes Implementados

| Módulo | Gali Integration | Acción |
|---|---|---|
| Catálogo | ADA Spy GaliBar | "Lanzar con Gali →" → Modo Lanzar |
| Caza Productos | ADA Spy Detail | "Ver análisis →" → GaliAdaSpyDetailComponent |
| Pedidos | Chatea Pro GaliBar | "Ver señales →" → Modo Operar |
| Novedades | Banner Gali clasificación | "Ver señales en Gali →" → Modo Operar |
| Proveedores | ADA Spy GaliBar | "Lanzar producto →" → Modo Lanzar |
| Automatización | Banner conexión skills | "Crear skill Gali" por fila → SkillEditor |
| Proyectos lista | GaliBar + "Nuevo" | → NuevoProyectoPage (6 etapas) |
| Proyecto detalle | Alert bar conectado | → Señales / SkillEditor / Medir |
| Roax Campañas | Stepper + Copilot | → Modo Medir al completar |
| Campañas | Skill banner | "Crear skill Roax →" → SkillEditor |
| Agentes page | Banner A/S/R | "Mis skills →" / "+ Crear skill" / "Mis reglas →" |

---

## Decisiones Arquitectónicas

| Decisión | Motivo |
|---|---|
| Modo como estado local (signal) | No necesita URL por modo — el workspace es stateful |
| Overlay anclado al panel padre | No contaminar el DOM global; mantiene el contexto visual |
| SkillRule como objeto tipado | Permite futura persistencia y validación en backend |
| Señales con lifecycle (enum estado) | El usuario ve el antes y después — no "desaparecen" tras actuar |
| DM Sans + Syne en el OS | Diferencia visual clara entre Dropi (Inter) y el OS de Gali |
| `localStorage` para colapso + autopilot | Estado de UI persistente sin backend — prototipo stateful |
| `NO_PANEL_RAIL_KEYS` vacío para módulos IA | Agentes/Skills/Reglas/Marketplace/Conexiones necesitan panel contextual para su complejidad |
| Responsive breakpoint en 900px | Coincide con el threshold donde la section-nav colapsa — coherencia visual |

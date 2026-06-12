# Gali v5 — Inventario de auditoría v2

**Base path:** `src/app/pages/gali-v5/`  
**Fecha:** 11 Jun 2026  
**Estado post-fix:** Fase 1–3 documentada en [AuditoriaUI11jun.md](./AuditoriaUI11jun.md)  
**Versión anterior (estructural):** inventario read-only del chat de auditoría (v1, pre-política de chrome)

Este documento extiende v1 con política de chrome verificada en código, estados por hallazgo (`open | fixed | by_design | orphan_scss | dead_import`) y backlog priorizado.

---

## 0. Shell — política de chrome global

**Fuente:** [`gali-v5-shell.component.ts`](../../src/app/pages/gali-v5/gali-v5-shell.component.ts) · [`gali-v5-shell.component.html`](../../src/app/pages/gali-v5/gali-v5-shell.component.html)

### 0.1 Capas del shell

| Nivel | Componente | Condición | Notas |
|-------|------------|-----------|-------|
| Persistente | `dropi-header-ia2` | Siempre | `galiMode`, autopilot |
| Persistente | `dropi-icon-rail` | Siempre | |
| Persistente | `dropi-section-nav` + `dropi-panel-splitter` | `hasSectionPanel()` | Colapsable, ancho en localStorage |
| Condicional | `gali-workspace-mode-bar` | `isHubHome()` (`/gali-v5`, `/gali-v5/`) | Toggle Básico/Experto canónico (Spec 3) |
| Condicional | `gali-context-strip` | `showContextStrip()` | Ver §0.2 |
| Condicional | `gali-intent-bar` | `showIntentBar()` | Suprimido en Hub home (`isHubHome`) y rutas §0.2 |
| Persistente | `<router-outlet>` | Siempre | |
| Condicional | `gali-right-panel` + splitter | `galiMode() > 0` | 968 LOC template |
| Persistente | `dropi-menu-action` | Siempre | FAB |
| Overlay | Toast Gali (`ws.toast()`) | Cross-módulo | Link a Memoria |
| Overlay | Toast feedback (`feedback.toast()`) | Prototipo | `data-proto-skip` en CTAs reales |

### 0.2 Reglas de visibilidad (shell)

```ts
showContextStrip = !isHubHome && !hasPageLevelAgentChrome
showIntentBar    = galiMode === 0 && !hasPageLevelAgentChrome && !primaryAlertActive
```

**Lista de supresión shell** (`pageLevelAgentChromePrefixes`; incluye rutas con `gali-agent-alert`):

| Ruta absoluta | Tipo barra página |
|---------------|-------------------|
| `/gali-v5/mis-pedidos/mis-pedidos` | `dropi-gali-bar` |
| `/gali-v5/mis-pedidos/garantias` | `gali-agent-alert` |
| `/gali-v5/marketing/campanas` | `dropi-gali-bar` |
| `/gali-v5/marketing/chatea-pro` | `dropi-gali-bar` |
| `/gali-v5/productos/caza-productos` | `dropi-gali-bar` |
| `/gali-v5/productos/catalogo` | `catalog-ada-strip` (page chrome) |
| `/gali-v5/productos/proveedores` | `dropi-gali-bar` |
| `/gali-v5/cas/bandeja` | `dropi-gali-bar` |
| `/gali-v5/proyectos` (lista exacta) | `dropi-gali-bar` |
| `/gali-v5/proyecto/*` | `proyecto__gali-bar` inline |
| `/gali-v5/reportes/dashboard` | `dropi-gali-bar` |
| `/gali-v5/reportes/dashboard-financiero` | `gali-module-activation-bar` |
| `/gali-v5/financiero/historial-de-cartera` | `kronos-bar` |
| `/gali-v5/logistica/transportadoras` | `dropi-gali-bar` |
| `/gali-v5/logistica/torre-logistica` | `gali-agent-alert` |

**Objetivo de diseño:** ≤2 capas de chrome Gali antes del contenido (header + 1 barra). Ver [AuditoriaUI11jun.md § Política de chrome](./AuditoriaUI11jun.md).

### 0.3 Tres niveles de chrome (metodología)

| Nivel | Qué cuenta | Ejemplos |
|-------|------------|----------|
| 1 — Global persistente | No se audita duplicación | header, rail, section-nav |
| 2 — Global condicional | Sí — stacking shell | mode-bar, context-strip, intent-bar, right-panel |
| 3 — Página | Sí — stacking con nivel 2 | dropi-gali-bar, agent-alert, titulos, ontology-strip, modales |

Los modales/overlays no cuentan como duplicación de chrome superior.

---

## 1. Matriz chrome por ruta

Columnas: **M** = mode-bar · **C** = context-strip · **I** = intent-bar · **P** = barra agente página · **T** = dropi-titulos · **Total** = capas Gali nivel 2+3 antes del contenido principal · **Estado**

> En rutas con supresión shell (§0.2), C e I = suprimidos (`—`).

### 1.1 Hub OS (sin section panel)

| Ruta | M | C | I | P (tipo) | T | Total | Estado |
|------|---|---|---|----------|---|-------|--------|
| `''` (home) | ✓ | — | ✓* | impact-widget (Momento 3) | — | 2–3 | `by_design` |
| `proyecto/:id` | — | ✓ | ✓ | inline `proyecto__gali-bar` | — | 3 | `open` |
| `proyectos/nuevo` | — | ✓ | ✓ | — | — | 2 | OK |
| `proyectos` | — | — | — | `dropi-gali-bar` | — | 1 | OK (post-fix) |
| `agentes` | — | ✓ | ✓ | `gali-ontology-strip` | — | 3 | OK (strip colapsable) |
| `micromundo` | — | ✓ | ✓ | — | — | 2 | OK |
| `skills/nueva` | — | ✓ | ✓ | `gali-workspace-mode-bar` (página) | — | 3 | OK |
| `skills` | — | ✓ | ✓ | `gali-ontology-strip` | — | 3 | OK |
| `skills/comunidad` | — | — | — | — | — | — | Redirect → `marketplace` |
| `reglas` | — | ✓ | ✓ | `gali-ontology-strip` | — | 3 | OK |
| `marketplace` | — | ✓ | ✓ | — | — | 2 | OK |
| `conexiones` | — | ✓ | ✓ | — | — | 2 | OK |
| `senales` | — | ✓ | ✓ | — | — | 2 | OK (referencia) |
| `impacto` | — | ✓ | ✓ | `app-gali-impact-widget` | — | 3 | OK |

\* `intent-bar` suprimido si `primaryAlertActive()` o `galiMode > 0`.

### 1.2 Módulos Dropi (con section panel)

| Ruta | C | I | P (tipo) | T | Total | Estado |
|------|---|---|----------|---|-------|--------|
| `productos/catalogo` | ✓ | ✓ | `catalog-ada-strip` | — | 3 | `open` |
| `productos/proveedores` | — | — | `dropi-gali-bar` | — | 1 | OK (post-fix) |
| `productos/caza-productos` | — | — | `dropi-gali-bar` | ✓ | 2 | OK |
| `productos/negociaciones` | ✓ | ✓ | — | — | 2 | OK |
| `mis-pedidos/mis-pedidos` | — | — | `dropi-gali-bar` | — | 1 | OK |
| `mis-pedidos/novedades` | ✓ | ✓ | — | ✓ | 3 | OK |
| `mis-pedidos/garantias` | — | — | `gali-agent-alert` | — | 1 | OK |
| `mis-pedidos/ordenes-de-despacho` | — | — | `gali-agent-alert` | — | 1 | OK (mismo componente) |
| `mis-pedidos/validador-direcciones` | ✓ | ✓ | — | ✓ | 3 | OK |
| `mis-pedidos/etiquetas` | ✓ | ✓ | — | ✓ | 3 | OK |
| `logistica/transportadoras` | — | — | `dropi-gali-bar` | — | 1 | OK |
| `logistica/torre-logistica` | — | — | `gali-agent-alert` | ✓ | 2 | OK |
| `reportes/dashboard` | — | — | `dropi-gali-bar` | ✓ | 2 | OK |
| `reportes/dashboard-financiero` | ✓ | ✓ | `gali-module-activation-bar` | — | 3 | `open` |
| `reportes/productos-vendidos` | ✓ | ✓ | — | ✓ | 3 | OK |
| `reportes/clientes` | ✓ | ✓ | — | ✓ | 3 | OK |
| `reportes/calendario` | ✓ | ✓ | — | ✓ | 3 | OK |
| `reportes/descargas` | ✓ | ✓ | — | ✓ | 3 | OK |
| `financiero/historial-de-cartera` | ✓ | ✓ | `kronos-bar` + impact-widget | ✓ | 4–5 | `open` |
| `marketing/campanas` | — | — | `dropi-gali-bar` | ✓ | 2 | OK |
| `marketing/chatea-pro` | — | — | `dropi-gali-bar` | ✓ | 2 | OK (post-fix) |
| `marketing/automatizacion` | ✓ | ✓ | — | ✓ | 3 | OK |
| `marketing/configuraciones` | ✓ | ✓ | — | ✓ | 3 | OK |
| `marketing/roax-informes` | ✓ | ✓ | — | ✓ | 3 | OK |
| `marketing/roax-lanzador` | ✓ | ✓ | — | ✓ | 3 | OK |
| `marketing/creador-de-paginas` | ✓ | ✓ | — | ✓ | 3 | OK |
| `cas/bandeja` | — | — | `dropi-gali-bar` + intro | — | 2 | OK (post-fix) |
| `dropi-card/cards` | ✓ | ✓ | — | ✓ | 3 | OK |
| `academy` | ✓ | ✓ | — | — | 2 | OK |

### 1.3 Stubs `DropiScreenPageComponent` (20 rutas)

Todas reciben **C + I** del shell (no están en lista de supresión). Sin barra agente página.

| Grupo | Rutas (`screenId`) |
|-------|-------------------|
| Pedidos | `garantias-recolecciones` |
| Financiero (8) | `datos-bancarios`, `retiros-de-saldo`, `datos-facturacion`, `facturas-pendientes`, `notas-credito`, `depositos-manuales`, `transacciones`, `movimientos-billetera` |
| CAS | `tickets` |
| Configuraciones (11) | `datos-personales`, `seguridad`, `integraciones-config`, `referidos`, `configuracion-de-tienda`, `usuarios-equipo`, `dropi-testers`, `planes`, `mis-sesiones`, `historial-de-actividades`, `preferencias-cuenta` |

**Estado:** `by_design` (placeholder baseline). Template compartido: 665 LOC.

---

## 2. Ruta → componente → spec dueño

Rutas relativas a `/gali-v5/`. Redirects omitidos (ver §4).

| Ruta | Componente | Spec dueño |
|------|------------|------------|
| `''` | `DropiHomeComponent` | Spec 9 Hub Narrativa · Spec 5 Zero State |
| `productos/catalogo` | `CatalogPageComponent` | Dropi baseline + ADA |
| `productos/proveedores` | `ProvidersPageComponent` | Dropi baseline |
| `productos/caza-productos` | `CazaPageComponent` | Spec 3 Hub · Spec 13 |
| `productos/negociaciones` | `NegotiationsPageComponent` | Dropi baseline |
| `mis-pedidos/mis-pedidos` | `OrdersPageComponent` | Dropi + Gali insight |
| `mis-pedidos/novedades` | `NovedadesPageComponent` | Dropi baseline |
| `mis-pedidos/garantias` · `ordenes-de-despacho` | `GarantiasPageComponent` | Dropi + agent-alert |
| `mis-pedidos/validador-direcciones` | `ValidadorDireccionesPageComponent` | Dropi baseline |
| `mis-pedidos/etiquetas` | `EtiquetasPageComponent` | Dropi baseline |
| `logistica/transportadoras` | `CarrierPreferencesPageComponent` | Dropi baseline |
| `logistica/torre-logistica` | `TorreLogisticaPageComponent` | Dropi + logística inteligente |
| `reportes/dashboard` | `ReportDashboardKpiPageComponent` | Dropi baseline |
| `reportes/dashboard-financiero` | `DashboardFinancieroPageComponent` | Spec 6 Finance |
| `reportes/*` (resto) | Varios | Dropi baseline |
| `financiero/historial-de-cartera` | `WalletPageComponent` | Spec 6 · Spec 15 Impacto |
| `dropi-card/cards` | `DropicardPageComponent` | Dropi baseline |
| `marketing/*` | Varios | Dropi + marketing Gali |
| `cas/bandeja` | `CasBandejaPageComponent` | Chatea/CAS flow |
| `academy` | `AkademyPageComponent` | Dropi baseline |
| `proyecto/:id` | `ProyectoDetallePageComponent` | Spec 13 Proyecto Canvas |
| `proyectos/nuevo` | `NuevoProyectoPageComponent` | Spec 13 |
| `proyectos` | `ProyectosListPageComponent` | Spec 13 |
| `agentes` | `AgentesPageComponent` | Spec 11 Agentes Vivos |
| `micromundo` | `MicromundoPageComponent` | Spec 1 UniDatos |
| `skills/nueva` | `SkillEditorPageComponent` | Spec 7 Skills |
| `skills` | `SkillsPageComponent` | Spec 7 · Spec 14 |
| `reglas` | `ReglasPageComponent` | Spec 14 Ontología |
| `marketplace` | `MarketplacePageComponent` | Spec 7 |
| `conexiones` | `ConexionesPageComponent` | Spec 1 |
| `senales` | `SenalesPageComponent` | Spec 12 Signal Center |
| `impacto` | `GaliImpactoPageComponent` | Spec 15 Impacto |
| 20× `screen(...)` | `DropiScreenPageComponent` | Dropi baseline stub |

**Orphans (sin ruta):**

| Archivo | LOC html | Acción sugerida |
|---------|----------|-----------------|
| `pages/reportes/report-dashboard-page.component.ts` | — | Borrar o cablear ruta |
| ~~`pages/skills/skills-comunidad-page`~~ | — | Migrado a `marketplace-page` (11 Jun) |

---

## 3. Componentes compartidos (por tipo)

| Componente | Tipo | Alcance | Count efectivo |
|------------|------|---------|----------------|
| `gali-workspace-mode-bar` | bar | Shell hub + skill-editor | 2 |
| `gali-context-strip` | strip | Shell (no hub, no supresión) | Global |
| `gali-intent-bar` | bar | Shell (condicional) | Global |
| `gali-right-panel` | panel | Shell `galiMode > 0` | Global |
| `dropi-gali-bar` | bar | 9 templates página | 9 |
| `gali-agent-alert` | bar | garantías, torre-logística | 2 |
| `gali-ontology-strip` | strip | agentes, skills, reglas | 3 |
| `gali-module-activation-bar` | bar | dashboard-financiero | 1 |
| `app-gali-impact-widget` | widget | home Momento 3, wallet, impacto | 3 |
| `dropi-titulos` | header | ~18 páginas Dropi | Alto |
| `gali-hub-brief` | block | home | 1 |
| `gali-decision-theater` | block | home | 1 |
| `gali-goal-onboarding` | modal | home | 1 |
| `DiagnosticoModalComponent` | modal | home, proyectos list, proyecto detalle | 3 |
| `CrearProyectoModalComponent` | modal | caza, proyectos list | 2 |
| `GaliAgencyThresholdsPanelComponent` | panel | home, agentes | 2 |
| `GaliNewSkillOverlayComponent` | overlay | skills, campañas | 2 |
| `GaliAdaSpyDetailComponent` | drawer | catalog, caza | 2 |
| `SkillsEditorModalComponent` | modal | marketplace, proyecto detalle | 2 |
| `app-agent-card-alive` | card | agentes (`@for`) | 1 |
| `app-proyecto-timeline` | timeline | proyecto detalle | 1 |
| `app-senal-detalle` | detail | senales master-detail | 1 |
| `ConfirmActionModalComponent` | modal | senales | 1 |

**Hub-only (sin leakage a módulos Dropi):** `gali-hub-brief`, `gali-decision-theater`, `gali-goal-onboarding`.

---

## 4. Directivas · servicios · mocks · redirects

### 4.1 Directivas

| Directiva | Páginas |
|-----------|---------|
| `GaliInsightDirective` | orders, campañas, torre-logística, dashboard-financiero |
| `GaliGlosarioDirective` | home, orders, agentes, dashboard-financiero |
| `AlertHierarchyDirective` | home |

### 4.2 Servicios (impacto en chrome)

| Servicio | Rol en auditoría |
|----------|------------------|
| `GaliStateService` | `galiMode`, `panelWidth` — intent-bar y right-panel |
| `GaliWorkspaceService` | `primaryAlertActive`, `businessDNA`, toasts — suprime intent-bar |
| `DropiPrototypeFeedbackService` | Toast global en shell |

### 4.3 Mocks (fuente de verdad)

| Mock | Consumidores |
|------|--------------|
| `mocks/gali-v5/wallet-transactions.json` | `GaliImpactWidgetComponent`, página impacto, wallet |
| `mocks/gali-v5/projects.json` | home, proyecto detalle, proyectos list |
| `mocks/gali-v5/senales.mock.ts` | senales, senal-detalle |

### 4.4 Redirects (`gali-v5.routes.ts`)

| Desde | Hacia |
|-------|-------|
| `mis-pedidos/carritos-abandonados` | `productos/catalogo` |
| `mis-pedidos/configuracion-de-pedidos` | `mis-pedidos/mis-pedidos` |
| `mis-garantias/*` (6 rutas) | garantías / torre-logística |
| `transportadora/preferencias` | `logistica/transportadoras` |
| `reportes/torre-logistica` | `logistica/torre-logistica` |
| `dashboard` | `reportes/dashboard` |
| `historial-de-cartera` | `financiero/historial-de-cartera` |
| `configuraciones/datos-bancarios` | `financiero/datos-bancarios` |
| `configuraciones/retiros-de-saldo` | `financiero/retiros-de-saldo` |
| `skills/comunidad` | `marketplace` |

---

## 5. Hallazgos — registro con estado

### 5.1 Corregidos respecto a inventario v1 (`fixed` / `incorrect`)

| Hallazgo v1 | Estado real | Etiqueta |
|-------------|-------------|----------|
| Triple stacking en 9 páginas con `dropi-gali-bar` | Shell suprime C+I en 11 rutas (§0.2) | `fixed` |
| Chatea: `status-bar` duplica gali-bar | Template sin status-bar; solo SCSS huérfano | `fixed` + `orphan_scss` |
| CAS: intro + explainer siempre duplicados | Explainer solo primera visita (`gali_cas_explainer_seen`) | `by_design` |
| Dead import `DropiGaliBar` en catalog/garantías/torre/wallet | Imports ya eliminados en `.ts` | `fixed` |
| Dead import `GaliImpactWidget` en impacto | Widget renderizado L31 de `gali-impacto-page.component.html` | `incorrect` (v1) |
| `skills/comunidad` como página propia | Redirect a `marketplace` | `incorrect` (v1) |
| home 587 LOC · agentes 738 LOC | 538 y 695 LOC hoy | `incorrect` (v1) |
| O-01 … O-04 chrome P0 | Rutas añadidas a `pageLevelAgentChromePrefixes` (11 Jun) | `fixed` |
| O-05 dead import panel | `GaliProjectPanelComponent` quitado de `imports[]` home | `fixed` |
| O-06 chatea SCSS huérfano | Bloque `.chatea-status-bar` eliminado | `fixed` |
| O-07 skills-comunidad orphan | Contenido migrado a `marketplace-page`; archivos borrados | `fixed` |
| O-08 report-dashboard orphan | Componente sin ruta eliminado | `fixed` |
| O-10 naming prefixes | Renombrado a `pageLevelAgentChromePrefixes` | `fixed` |
| Hub mode-bar 5 tabs | Tabs Operar/Lanzar/… eliminados; Básico/Experto promovido | `fixed` |
| Marketplace slim 288 LOC | Restaurado multi-categoría (~159k lazy chunk) | `fixed` |

### 5.2 Abiertos (`open`)

| ID | Ubicación | Issue | Severidad |
|----|-----------|-------|-----------|
| O-09 | `gali-right-panel` | 968 LOC — candidato a split por tab | P2 |

### 5.3 Verificación automatizable

Ejecutar desde raíz del repo:

```bash
# Dead import: componente en imports[] pero selector ausente en .html
rg -l "DropiGaliBarComponent" src/app/pages/gali-v5 --glob "*.ts" | while read f; do
  html="${f%.component.ts}.component.html"
  [ -f "$html" ] && ! grep -q "dropi-gali-bar" "$html" && echo "DEAD: $f"
done

rg -l "GaliImpactWidgetComponent" src/app/pages/gali-v5 --glob "*.ts" | while read f; do
  html="${f%.component.ts}.component.html"
  [ -f "$html" ] && ! grep -q "app-gali-impact-widget" "$html" && echo "DEAD: $f"
done

rg -l "GaliProjectPanelComponent" src/app/pages/gali-v5 --glob "*.ts" | while read f; do
  html="${f%.component.ts}.component.html"
  [ -f "$html" ] && ! grep -q "gali-project-panel" "$html" && echo "DEAD: $f"
done

# Templates más grandes (priorizar refactor)
find src/app/pages/gali-v5 -name "*.component.html" -exec wc -l {} + | sort -rn | head -15
```

**Última ejecución (11 Jun 2026, post-plan):** `DropiGaliBar`, `GaliImpactWidget`, `GaliProjectPanelComponent` en `imports[]` — sin dead imports. `ng build --configuration development` OK.

---

## 6. Backlog priorizado

### P0 — Chrome narrativo redundante ✅ (11 Jun 2026)

Catálogo, wallet, dashboard-financiero y proyecto detalle en `pageLevelAgentChromePrefixes`.

### P1 — Deuda huérfana ✅ (11 Jun 2026)

Dead import home, chatea SCSS, skills-comunidad migrado a marketplace, report-dashboard eliminado.

### P2 — Compresión vertical (abierto)

1. `gali-right-panel.component.html` (968 LOC) — sub-componentes por tab.
2. `proyecto-detalle` (787), `agentes` (695).
3. Home Momento 3 — validar above-the-fold post `max-height` fix.

### P3 — Consistencia semántica

1. ~~Renombrar `pageLevelGaliBarPrefixes` → `pageLevelAgentChromePrefixes`.~~ ✅
2. Hub: `intent-bar` suprimido en home; `mode-bar` solo Básico/Experto + objetivo + reconfigurar.

---

## 7. Referencia cruzada — [AuditoriaUI11jun.md](./AuditoriaUI11jun.md)

| Tema en AuditoriaUI11jun | Sección en este inventario |
|--------------------------|----------------------------|
| Política de chrome shell | §0 |
| Matriz rutas post-fix | §1.1–1.2 (ampliada) |
| Hub / Chatea / CAS / Ontología / Impacto | §3, §5.1 |
| Verificación `ng build` | Ejecutar antes de cerrar ítems P0–P1 |

**Relación de versiones:**

- **v1** — Mapa estructural rutas + imports (chat auditoría, pre-política).
- **v2** — Este documento: matriz chrome + estados + backlog.
- **AuditoriaUI11jun** — Log de cambios implementados Fase 1–3 (fuente de verdad post-fix).

---

## Apéndice A — Página → imports Angular (actualizado)

| Page | Imports clave (template) |
|------|--------------------------|
| Home | goal-onboarding, hub-brief, decision-theater, agency panel, diagnostico, impact-widget, alert-hierarchy, glosario |
| Catalog | ada-spy-detail; ada-strip inline |
| Providers | dropi-gali-bar |
| Caza | gali-bar, titulos, crear-proyecto, ada-spy-detail |
| Orders | gali-bar, insight, glosario |
| Garantías | gali-agent-alert |
| Torre logística | gali-agent-alert, titulos, insight |
| Wallet | titulos, impact-widget; kronos-bar custom |
| Dashboard financiero | module-activation-bar, insight, glosario |
| Campañas | gali-bar, titulos, new-skill overlay, insight |
| Chatea Pro | titulos, gali-bar |
| CAS | gali-bar, search, tags |
| Agentes | agent-card-alive, agency panel, skill-picker, ontology-strip, glosario |
| Skills | skill-builder-v2, new-skill overlay, ontology-strip |
| Skill editor | workspace-mode-bar |
| Reglas | ontology-strip inline |
| Señales | senal-detalle, confirm modal |
| Impacto | impact-widget, AbsPipe |
| Proyecto detalle | timeline, diagnostico, skills-editor modal |

---

## Apéndice B — Templates más grandes (11 Jun 2026)

| LOC | Template |
|-----|----------|
| 968 | `gali-right-panel.component.html` |
| 787 | `proyecto-detalle-page.component.html` |
| ~440 | `marketplace-page.component.html` (restaurado desde comunidad) |
| 695 | `agentes-page.component.html` |
| 665 | `dropi-screen-page.component.html` |
| 605 | `nuevo-proyecto-page.component.html` |
| 538 | `home.component.html` |
| 477 | `dashboard-financiero-page.component.html` |

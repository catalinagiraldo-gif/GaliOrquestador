# Auditoría de Inconsistencias de Datos — Gali v5

> Auditoría realizada: 4 jun 2026  
> Archivos analizados: `home.component.ts`, `dashboard-financiero-page.component.ts`, `campanas-page.component.ts`, `mocks/gali-v5/orders.json`, `mocks/gali-v5/marketing-campanas.json`

---

## 1. Tabla de Inconsistencias

| # | Campo | Valor en Hub (`home.component.ts`) | Valor en Reportes / Detalle | ¿Hay mock unificado? |
|---|---|---|---|---|
| 1 | **ROAS real Collar GPS** | `2.9x` (proyectos, agentes, campanasMedir signal, insight) | `4.78×` KPI global · `4.5` unitEconomics · `4.5–5.2` semanal (weeks4) | ❌ No |
| 2 | **ROAS Meta (declarado) Collar GPS** | `5.0x` (proyectosPL `roas_meta`) | `3.1x` (channelRows Meta, campanasMedir c1) | ❌ No |
| 3 | **ROAS real — nodeDetailMap reportes** | `1.93x` real vs Meta `2.9x` (nodo "reportes") | `2.9x` real vs Meta `3.1x` (nodo "rendimiento") — contradicción interna | ❌ No (ni siquiera es consistente dentro del mismo archivo) |
| 4 | **Margen neto Collar GPS / global** | `22%` (proyectosPL, objetivo `20%`) | `25.7%` KPI global · `27.1%` canal Meta · `34%` nodeDetailMap marketing/rendimiento/reportes | ❌ No |
| 5 | **Presupuesto escala propuesta** | `$66k → $86k/día` (currentInsight, confirmScale action) | `$85k/día` (proyecciones base — "Escalar Video B a $85k/día +20%") | ❌ No |
| 6 | **ROAS real Skincare K-Beauty** | `2.1x` (proyectos, proyectosPL `roas_dropi`, campanasMedir c3) | `1.8` (unitEconomics `roasReal`) | ❌ No |
| 7 | **Pauta $66k/día en campanas-page** | `$66k/día` pauta total (galiStats en `campanas-page`) — pero es la página de SMS/Email | `$66k/día` es presupuesto de Meta Ads, no de SMS/Email | ❌ Semánticamente incorrecto |
| 8 | **Revenue mensual vs semanal Collar GPS** | `$1.82M` revenue en proyectosPL (¿semanal?) | `$14.82M` total bruto en waterfall (mensual, todos los proyectos) | ❌ No — escala ambigua |
| 9 | **Ganancia neta Collar GPS** | `$411k` (proyectos + proyectosPL — consistentes) | `$3.808M` utilidad neta mensual (reportes — todos los proyectos) | ⚠️ Distintas unidades/alcance |
| 10 | **Score Difusor aromaterapia** | `87/100` (adaOportunidades, signals sig-004, nodeDetailMap producto) | — | ✅ Consistente en hub |
| 11 | **CTR Video B** | `1.8%` (campanasMedir, signals sig-002, skillHistory) | — | ✅ Consistente en hub |
| 12 | **Pedidos en riesgo (Vigilante)** | `12` (signals sig-001, agentes Vigilante, nodeDetailMap logística) | — | ✅ Consistente en hub |
| 13 | **Tasa novedad Coordinadora** | `15%` Coordinadora Bogotá (sig-001) | `14%` tasa global (kpis reportes) · `15%` channelRows Meta | ⚠️ Son métricas distintas, pero sin etiqueta clara |
| 14 | **Pedidos/sem Collar GPS** | `47/sem` (proyectos, proyectosPL, nodeDetailMap pedidos, agentes Chatea Pro "43/47") | `2.470` pedidos totales del mes (waterfallBars tooltip, todos los proyectos) | ⚠️ Distintas unidades/alcance — sin mock que mapee uno al otro |

---

## 2. Contradicciones Internas en `home.component.ts`

Estos conflictos ocurren dentro del **mismo archivo**, sin cruzar hacia reportes:

| Campo | Nodo A | Nodo B | Diferencia |
|---|---|---|---|
| ROAS real vs Meta | `nodeDetailMap.rendimiento`: real `2.9x` vs Meta `3.1x` | `nodeDetailMap.reportes`: real `1.93x` vs Meta `2.9x` | ROAS real: `2.9x` ≠ `1.93x` · ROAS Meta: `3.1x` ≠ `2.9x` |
| Margen neto global | `nodeDetailMap.marketing`: `34% margen` | `proyectosPL.collar-gps`: `margen: 22` | `34%` ≠ `22%` |
| ROAS Meta Collar GPS | `proyectosPL.roas_meta`: `5.0x` | `campanasMedir` c1 campo `roas`: `3.1x` | `5.0x` ≠ `3.1x` |

---

## 3. Campos sin Fuente de Verdad Única (necesitan mock maestro)

Los siguientes campos aparecen hardcodeados en múltiples lugares con valores distintos. Todos deben vivir en un único mock, idealmente `mocks/gali-v5/projects.json` o similar:

1. **`roas_real`** — ROAS real (Dropi) por proyecto
2. **`roas_meta`** — ROAS declarado por Meta Ads por proyecto
3. **`margen_neto_pct`** — margen neto real por proyecto (% y valor absoluto)
4. **`pedidos_sem`** — pedidos por semana por proyecto
5. **`pauta_diaria`** — presupuesto de pauta activo por proyecto/campaña
6. **`pauta_escala_propuesta`** — el valor al que Roax sugiere escalar ($86k vs $85k)
7. **`revenue_semanal`** — ingresos semanales por proyecto (confundidos con mensuales)
8. **`ganancia_neta`** — ganancia neta por proyecto (semanal vs mensual sin distinción)
9. **`tasa_novedad_pct`** — tasa de novedad global y por transportadora (14% global vs 15% Coordinadora)

---

## 4. Problemas Estructurales de los Mocks Actuales

| Mock | Qué tiene | Qué le falta |
|---|---|---|
| `orders.json` | IDs, productos, clientes, transportadora, estado, canal | Precio de venta, COGS, flete, comisión, novedad, ganancia por pedido |
| `marketing-campanas.json` | ID, nombre, estado, fecha, canal SMS/Email | ROAS, spend, conversiones, CTR — los datos de campañas Meta son todos hardcoded en `home.ts` |
| *(inexistente)* `projects.json` | — | Datos P&L por proyecto: revenue, COGS, flete, pauta, novedades, margen, ROAS real, ROAS Meta, pedidos/sem |
| *(inexistente)* `kpis-global.json` | — | KPIs globales: ingresos brutos totales, utilidad neta mensual, ROAS efectivo global, tasa novedad global |

---

---

## 6. Inventario de Textos Prototipo / Placeholder Visibles al Usuario

> Auditoría de todos los `.html` de `src/app/pages/gali-v5/`  
> Patrón buscado: "prototipo", "próximamente", "TODO", "placeholder", "ouiui", `data-proto-skip`, estados vacíos estructurales.  
> Clasificación: **🗑 Eliminar** · **🔧 Reemplazar con comportamiento real** · **🔬 Mover a `?mode=prototype`**

### 6.1 Textos visibles al usuario — Acción requerida

| # | Archivo | Línea | Texto visible / Elemento | Tipo | Clasificación |
|---|---|---|---|---|---|
| 1 | `screens/dropi-screen-page.component.html` | 615 | `"Esta vista aún no está enlazada en el prototipo Gali V5. Usa el menú lateral para navegar."` | label visible | 🔧 Reemplazar — cambiar por "Esta sección está en desarrollo" o redirigir al hub sin mencionar "prototipo" |
| 2 | `pages/agentes/agentes-page.component.html` | 116 | `"Próximamente — diseña tu propio flujo"` | label en tarjeta "Crear mi agente" | 🔬 Mover a `?mode=prototype` o cambiar a badge `PRÓXIMAMENTE` sin lógica falsa detrás |
| 3 | `pages/marketing/campanas-page.component.html` | 270 | `"Expandir audiencia simulada"` (botón `data-proto-skip`) | botón con texto engañoso — dice "simulada" | 🗑 Eliminar el adjetivo "simulada" o 🔧 Reemplazar con botón con acción real |
| 4 | `screens/dropi-screen-page.component.html` | 260 | `<option>Placeholder</option>` en select de estado de orden | opción de formulario visible | 🗑 Eliminar — reemplazar con opción real "Pendiente" como valor por defecto |
| 5 | `pages/proyecto/proyecto-detalle-page.component.html` | 281–291 | `"Esta sección conecta con [link] con vista filtrada para este proyecto."` dentro de `tab-panel--placeholder` | estado vacío de 4 tabs (Producto, Estrategia, Campañas, Pedidos) | 🔬 Mover a `?mode=prototype` — en producción estas tabs deben mostrar datos reales filtrados por proyecto |

### 6.2 Atributo `data-proto-skip` — Botones sin comportamiento real

El atributo `data-proto-skip` está presente en **más de 80 botones** a lo largo del prototipo. Estos son botones que tienen UI pero no lógica conectada. El inventario por archivo:

| Archivo | Instancias `data-proto-skip` | Casos de mayor riesgo (botones con texto de acción irreversible) |
|---|---|---|
| `gali-right-panel.component.html` | ~28 | "Autopilot on/off", "Undo" en memoria, conectar GDrive/local |
| `catalog-page.component.html` | ~8 | "Lanzar →" en resultados de búsqueda semántica |
| `nuevo-proyecto-page.component.html` | ~7 | "Copiar link", "Escalar", "Investigar" en paso final |
| `campanas-page.component.html` | ~5 | "Crear skill desde campaña", "Probar nuevo ángulo", "Expandir audiencia simulada" |
| `chatea-pro-page.component.html` | ~8 | "Enviar mensaje", reglas toggle on/off |
| `proyecto-detalle-page.component.html` | ~5 | "Ver diagnóstico", CTA de agentes por proyecto |
| `agentes-page.component.html` | ~3 | "Personalizar agente", CTAs de acción por agente |
| `marketplace-page.component.html` | ~3 | "Compartir mi receta", instalar skill personalizada |
| `conexiones-page.component.html` | ~2 | "Conectar" y "Revocar" integración |
| `torre-logistica-page.component.html` | ~2 | "Ver análisis", "Aplicar smart routing" |
| `skills-comunidad-page.component.html` | ~2 | "Editar →" en skills propias del usuario |
| `reglas-page.component.html` | ~4 | Toggles on/off de reglas activas |

**Total estimado: 83+ botones con `data-proto-skip`.**

### 6.3 Secciones con `placeholder-state` estructural (tabs vacíos)

| Archivo | Elemento | Tabs afectados | Clasificación |
|---|---|---|---|
| `pages/proyecto/proyecto-detalle-page.component.html` L.268–291 | `tab-panel--placeholder` / `placeholder-state` | Producto, Estrategia, Campañas, Pedidos | 🔧 Reemplazar con datos reales filtrados por `proyectoId` o 🔬 mantener en `?mode=prototype` con nota interna |

### 6.4 Inputs `placeholder` — Válidos (no requieren acción)

Estos son `placeholder` de inputs HTML estándar — son correctos y no deben eliminarse:

| Archivo | Texto placeholder | Juicio |
|---|---|---|
| `home.component.html` L.25 | `"Nombre del dashboard…"` | ✅ Correcto — input de texto |
| `home.component.html` L.210, 500 | `"¿Qué necesitas hoy? Escríbele a Gali…"` | ✅ Correcto — chat input |
| `gali-goal-onboarding.component.html` L.51 | `"Ej: Tener 3 productos activos rentables con ROAS > 2.5x"` | ✅ Correcto — ejemplo orientativo |
| `orders-page.component.html` L.15 | `"Buscar por ID, cliente o guía…"` | ✅ Correcto — filtro de búsqueda |
| `nuevo-proyecto-page.component.html` L.58 | `"Ej: collar GPS para mascotas, crema anti-edad..."` | ✅ Correcto — input de producto |
| `skill-editor-page.component.html` L.50, 162–164 | `"Ej: Auto-pausa si CTR cae..."`, `"valor"`, `"por ej: 48h"` | ✅ Correcto — formulario de skill |
| `caza-page.component.html` L.23 | `'Ej: "algo para vender en Bogotá a madres jóvenes"'` | ✅ Correcto — prompt orientativo |
| `catalog-page.component.html` L.77 | `"Ej: colágeno para vender en Bogotá a $50.000..."` | ✅ Correcto — búsqueda semántica |
| Múltiples | `"Buscar..."`, `"Mín"`, `"Máx"` | ✅ Correctos — filtros estándar |

### 6.5 Resumen ejecutivo de acciones

| Clasificación | Cantidad de items | Prioridad |
|---|---|---|
| 🗑 **Eliminar** (texto engañoso o vacío) | 2 items (opción "Placeholder", botón "simulada") | Alta |
| 🔧 **Reemplazar con comportamiento real** | 2 items (mensaje "prototipo", tabs vacíos) | Alta |
| 🔬 **Mover a `?mode=prototype`** | 2 items (tabs placeholder, "Próximamente" en agentes) | Media |
| 📋 **Documentar `data-proto-skip`** | 83+ botones a priorizar para implementación real | Backlog |
| ✅ **No tocar** (placeholders HTML válidos) | ~25 inputs con placeholder orientativo | — |

---

## 7. Mapa de Navegación — Estado de Rutas

> Auditoría de: `gali-v5.routes.ts`, `dropi-sections.config.ts`, `sidebar-nav.config.ts`  
> Tipos de componente: **Real** = componente propio standalone · **Screen** = `DropiScreenPageComponent` (shell genérico) · **Redirect** = alias de otra ruta

### 7.1 Rutas por módulo — estado de componente

| Ruta (`/gali-v5/…`) | Componente | Tipo | ¿Está en nav? | Estado |
|---|---|---|---|---|
| *(vacío)* | `DropiHomeComponent` | Real | ✅ Rail "Gali Hub" | ✅ Activo |
| `productos/catalogo` | `CatalogPageComponent` | Real | ✅ Panel productos | ✅ Activo |
| `productos/proveedores` | `ProvidersPageComponent` | Real | ✅ Panel productos | ✅ Activo |
| `productos/caza-productos` | `CazaPageComponent` | Real | ✅ Panel productos | ✅ Activo |
| `productos/negociaciones` | `NegotiationsPageComponent` | Real | ✅ Panel productos | ✅ Activo |
| `mis-pedidos/mis-pedidos` | `OrdersPageComponent` | Real | ✅ Panel pedidos | ✅ Activo |
| `mis-pedidos/novedades` | `NovedadesPageComponent` | Real | ✅ Panel pedidos | ✅ Activo |
| `mis-pedidos/garantias` | `GarantiasPageComponent` | Real | ✅ Panel pedidos | ✅ Activo |
| `mis-pedidos/ordenes-de-despacho` | `GarantiasPageComponent` | Real (variante) | ✅ Panel pedidos | ✅ Activo |
| `mis-pedidos/garantias-recolecciones` | `DropiScreenPageComponent` | **Screen** | ✅ Panel pedidos | ⚠️ Shell genérico |
| `mis-pedidos/validador-direcciones` | `ValidadorDireccionesPageComponent` | Real | ✅ Panel pedidos | ✅ Activo |
| `mis-pedidos/etiquetas` | `EtiquetasPageComponent` | Real | ✅ Panel pedidos | ✅ Activo |
| `logistica/transportadoras` | `CarrierPreferencesPageComponent` | Real | ✅ Panel logística | ✅ Activo |
| `logistica/torre-logistica` | `TorreLogisticaPageComponent` | Real | ✅ Panel logística | ✅ Activo |
| `reportes/dashboard` | `ReportDashboardKpiPageComponent` | Real | ✅ Panel reportes | ✅ Activo |
| `reportes/dashboard-financiero` | `DashboardFinancieroPageComponent` | Real | ✅ Panel reportes | ✅ Activo |
| `reportes/productos-vendidos` | `ProductosVendidosPageComponent` | Real | ✅ Panel reportes | ✅ Activo |
| `reportes/clientes` | `ClientesPageComponent` | Real | ✅ Panel reportes | ✅ Activo |
| `reportes/calendario` | `ReportesCalendarioPageComponent` | Real | ✅ Panel reportes | ✅ Activo |
| `reportes/descargas` | `ReportesDescargasPageComponent` | Real | ✅ Panel reportes | ✅ Activo |
| `financiero/historial-de-cartera` | `WalletPageComponent` | Real | ✅ Panel financiero | ✅ Activo |
| `financiero/datos-bancarios` | `DropiScreenPageComponent` | **Screen** | ✅ Panel financiero | ⚠️ Shell genérico |
| `financiero/retiros-de-saldo` | `DropiScreenPageComponent` | **Screen** | ✅ Panel financiero | ⚠️ Shell genérico |
| `financiero/datos-facturacion` | `DropiScreenPageComponent` | **Screen** | ✅ Panel financiero | ⚠️ Shell genérico |
| `financiero/facturas-pendientes` | `DropiScreenPageComponent` | **Screen** | ✅ Panel financiero | ⚠️ Shell genérico |
| `financiero/notas-credito` | `DropiScreenPageComponent` | **Screen** | ✅ Panel financiero | ⚠️ Shell genérico |
| `financiero/depositos-manuales` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Ruta huérfana |
| `financiero/transacciones` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Ruta huérfana |
| `financiero/movimientos-billetera` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Ruta huérfana |
| `dropi-card/cards` | `DropicardPageComponent` | Real | ✅ Panel financiero | ✅ Activo |
| `marketing/campanas` | `CampanasPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `marketing/automatizacion` | `AutomatizacionPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `marketing/configuraciones` | `ConfiguracionesMarketingPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `marketing/chatea-pro` | `ChateaProPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `marketing/roax-informes` | `RoaxInformesPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `marketing/roax-lanzador` | `RoaxLanzadorPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `marketing/creador-de-paginas` | `CreadorPaginasPageComponent` | Real | ✅ Panel marketing | ✅ Activo |
| `cas/bandeja` | `CasBandejaPageComponent` | Real | ✅ Panel CAS | ✅ Activo |
| `cas/tickets` | `DropiScreenPageComponent` | **Screen** | ✅ Panel CAS | ⚠️ Shell genérico |
| `academy` | `AkademyPageComponent` | Real | ✅ Rail academy | ✅ Activo |
| `configuraciones/datos-personales` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/seguridad` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/integraciones` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/referidos` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/configuracion-de-tienda` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/usuarios-equipo` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/dropi-testers` | `DropiScreenPageComponent` | **Screen** | ✅ Panel config | ⚠️ Shell genérico |
| `configuraciones/planes` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Shell + ruta huérfana |
| `configuraciones/mis-sesiones` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Shell + ruta huérfana |
| `configuraciones/historial-de-actividades` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Shell + ruta huérfana |
| `configuraciones/preferencias-cuenta` | `DropiScreenPageComponent` | **Screen** | ❌ Sin ítem de nav | ⚠️ Shell + ruta huérfana |
| `proyecto/:id` | `ProyectoDetallePageComponent` | Real | Acceso por click en lista | ✅ Activo |
| `proyectos/nuevo` | `NuevoProyectoPageComponent` | Real | ✅ Panel proyectos | ✅ Activo |
| `proyectos` | `ProyectosListPageComponent` | Real | ✅ Panel proyectos | ✅ Activo |
| `agentes` | `AgentesPageComponent` | Real | ✅ Rail agentes | ✅ Activo |
| `micromundo` | `MicromundoPageComponent` | Real | ⚠️ Solo en GALI_MISSION_PANEL como "Mi Negocio 🌐" | ⚠️ Sin rail propio, no en DROPI_SCREENS |
| `skills/nueva` | `SkillEditorPageComponent` | Real | ✅ Panel skills | ✅ Activo |
| `skills/comunidad` | `SkillsComunidadPageComponent` | Real | ✅ Panel skills | ✅ Activo |
| `skills` | `SkillsPageComponent` | Real | ✅ Rail skills | ✅ Activo |
| `reglas` | `ReglasPageComponent` | Real | ✅ Rail reglas | ✅ Activo |
| `marketplace` | `MarketplacePageComponent` | Real | ✅ Rail marketplace | ⚠️ Conflicto: ver 7.3 |
| `conexiones` | `ConexionesPageComponent` | Real | ✅ Rail conexiones | ✅ Activo |

**Resumen del tipo de componente:**  
- ✅ Componentes reales: **36 rutas**  
- ⚠️ `DropiScreenPageComponent` (shell genérico): **21 rutas**  
- → Redirect (alias): **12 rutas**

---

### 7.2 Rutas del sidebar legacy (`sidebar-nav.config.ts`) sin contraparte en gali-v5

El `sidebar-nav.config.ts` es el sidebar del app antiguo (roles dropshipper/proveedor/admin). Sus rutas **NO tienen el prefijo `/gali-v5/`**, por lo que apuntan al app legacy. Ítems relevantes que se esperaría ver en gali-v5 pero no están registrados:

| Ítem sidebar legacy | Ruta legacy | Equivalente gali-v5 | Estado |
|---|---|---|---|
| Dashboard (dropshipper) | `/dashboard` | `/gali-v5/reportes/dashboard` | ⚠️ Solo redirect a raíz, no ruta dedicada |
| Clientes | `/clientes` | `/gali-v5/reportes/clientes` | ⚠️ Existe ruta pero no está en rail |
| Mis integraciones | `/mis-integraciones` | (conexiones) | ❌ Sin equivalente gali-v5 |
| Mis usuarios | `/mis-usuarios` | (config/usuarios-equipo) | ❌ Sin equivalente gali-v5 |
| Mis referidos | `/mis-referidos` | (config/referidos) | ❌ Sin equivalente gali-v5 |
| Calendario | `/calendario` | `/gali-v5/reportes/calendario` | ⚠️ Existe ruta pero no está en rail principal |
| Facturas | `/facturas/facturas` | `/gali-v5/financiero/facturas-pendientes` | ⚠️ Ruta diferente, path no coincide |
| Notas de crédito | `/facturas/notas-de-credito` | `/gali-v5/financiero/notas-credito` | ⚠️ Path diferente |
| Buscador de anuncios (admin) | `/marketing/buscador-de-anuncios` | ❌ Sin ruta gali-v5 | ❌ No registrado |
| Desempeño proveeduría (prov.) | `/reportes/desempeno-proveeduria` | ❌ Sin ruta gali-v5 | ❌ No registrado |
| Reel Management (admin) | `/reel-management` | ❌ Sin ruta gali-v5 | ❌ No registrado |

---

### 7.3 Inconsistencias internas de navegación en `dropi-sections.config.ts`

| Problema | Detalle |
|---|---|
| **"Marketplace" apunta a dos rutas distintas** | Rail icon `marketplace` → `/gali-v5/marketplace` · Pero `GALI_MISSION_PANEL`, panel `agentes`, panel `reglas`, panel `marketplace` usan `/gali-v5/skills/comunidad`. Son dos páginas distintas con el mismo concepto. |
| **Todos los agentes apuntan a la misma ruta** | En panel `agentes`, los 5 ítems (Roax, Vigilante, Chatea Pro, ADA Spy, Kronos) tienen `route: '/gali-v5/agentes'` — sin deep-link al agente individual. |
| **Todas las conexiones apuntan a la misma ruta** | En panel `conexiones`, los 8 ítems (Meta Ads, WhatsApp, Siigo, TikTok Shop, etc.) tienen `route: '/gali-v5/conexiones'` — sin anchor o parámetro por integración. |
| **`micromundo` no está en `DROPI_ICON_RAIL`** | La ruta `/gali-v5/micromundo` existe y tiene componente, pero no aparece en el rail principal. Solo es accesible desde `GALI_MISSION_PANEL` como "Mi Negocio 🌐". No está en `DROPI_SCREENS`. |
| **`proyectos?nuevo=true` no navega a ruta nueva** | El panel `proyectos` tiene ítem "Nuevo proyecto" con `route: '/gali-v5/proyectos?nuevo=true'`. No existe guardián que capture el query param y abra el modal. La ruta de nuevo proyecto real es `/gali-v5/proyectos/nuevo`. |
| **`HOME_EXACT` no captura `/gali-v5` sin slash** | `resolveActiveRailKey` trata `/gali-v5` (sin barra) como home, pero algunos enlaces de la app generan `/gali-v5` y otros `/gali-v5/` — pequeño riesgo de resalte incorrecto del rail. |

---

### 7.4 Botones del top bar (Workspace Mode Bar) — estado real

Los 5 botones de modo del `gali-workspace-mode-bar` **NO navegan a ninguna ruta**. Solo actualizan `ws.activeMode` (signal):

| Botón modo | `id` | ¿Navega? | Efecto real | `data-proto-skip` |
|---|---|---|---|---|
| ⚡ Operar | `operar` | ❌ No | Cambia layout del hub a `three-col` | ✅ Sí |
| 🚀 Lanzar | `lanzar` | ❌ No | Cambia layout a `two-col` — muestra chat "Modo Lanzar" | ✅ Sí |
| 📊 Medir | `medir` | ❌ No | Cambia layout a `two-col` — muestra tabla P&L | ✅ Sí |
| 🔧 Construir | `construir` | ❌ No | Cambia layout a `two-col` — muestra skills editor | ✅ Sí |
| 🌐 Comunidad | `comunidad` | ❌ No | Cambia layout a `full` | ✅ Sí |
| ✦ Autopilot ON/OFF | — | ❌ No | `data-proto-skip` — solo toggle visual | ✅ Sí |
| Gali status pill | — | ❌ No | `data-proto-skip` — abre panel lateral (simulado) | ✅ Sí |

**Consecuencia**: Cambiar de modo en el top bar no modifica la URL. No es posible hacer deep-link a `/gali-v5?mode=lanzar`. El browser back/forward no navega entre modos.

---

### 7.5 Botones con `(click)` sin navegación real en vistas clave

| Archivo | Línea | Elemento | Handler | Problema |
|---|---|---|---|---|
| `home.component.html` | 437 | Botón "ver señales" | `gali.requestedPanelTab.set('señales')` + `data-proto-skip` | No abre señales reales — solo setea una variable de panel |
| `proyecto-detalle-page.html` | 48 | "Ver señales en Gali" | `goToSignals()` | Navega al hub, no a señales filtradas del proyecto |
| `gali-workspace-mode-bar.html` | 44 | Autopilot toggle | `onAutopilotClick()` + `data-proto-skip` | No persiste estado, solo visual |
| `gali-workspace-mode-bar.html` | 63 | Gali status pill | `onGaliStatusClick()` + `data-proto-skip` | Acción no conectada |
| `campanas-page.html` | 90, 93 | "Crear skill" / "Recordar más tarde" | `data-proto-skip` | Sin acción real |
| `home.component.ts` | `goToProject(id)` | Router navigate | `router.navigate(['/gali-v5/proyecto', id])` | ✅ Funciona — único botón de proyecto que navega correctamente |

---

## 5. Recomendaciones de Acción

1. **Crear `mocks/gali-v5/projects.json`** con un array de proyectos que incluya todos los campos financieros y métricas de rendimiento. Que sea la única fuente que alimenta `home.ts`, `reportes`, y cualquier vista que consuma datos de proyecto.

2. **Definir unidades explícitas** en cada campo del mock: `revenue_semanal` vs `revenue_mensual`, `pedidos_sem` vs `pedidos_mes`. Nunca un campo ambiguo llamado solo `revenue`.

3. **Eliminar `nodeDetailMap` hardcodeado en `home.ts`** — los valores de descripción de cada nodo deben derivarse del mock de proyectos (no duplicar `ROAS 2.9x` en 4 strings de texto distintos).

4. **Mover la pauta de Meta Ads** fuera de `campanas-page.ts` (que es la página de SMS/Email). El `$66k/día` de Meta pertenece al proyecto o a la vista de campañas Meta.

5. **Alinear la escala temporal** en `reportes`: decidir si los datos son semanales o mensuales y etiquetarlo consistentemente. El P&L waterfall de `dashboard-financiero-page` mezcla cifras mensuales ($14.82M) con el contexto semanal del hub ($1.82M revenue Collar GPS).

---

## 8. Matriz de Brechas — Propuesta de Valor vs. Prototipo Gali v5

> **Fuentes**: `AlcancesIADropi.md` · `AlcancesIADropi2.md` · `GaliAjustesJun3.md` · `CorrecionesGali5.md` (Descubrimientos)  
> **Criterio de estado**: **Existe** = flujo/UI creíble y alineado al spec · **Parcial** = mock o piezas sueltas sin cerrar el loop · **Ausente** = no hay superficie dedicada ni comportamiento demostrable  
> **Lente**: arquitectura de dominio — cada promesa debe tener una entidad, una vista ancla y un loop verificable; sin eso es narrativa, no producto.

### 8.1 Matriz principal

| # | Promesa de valor | Estado en prototipo | Pantalla(s) donde debería vivir | Gap a cerrar |
|---|---|---|---|---|
| 1 | **Hiperpersonalización predictiva** (objetivo + data usuario × data Dropi → estrategia/insights) | **Parcial** | Hub (`currentInsight` + `businessDNA`) · Onboarding (`gali-goal-onboarding`) · `/gali-v5/micromundo` | Hay objetivo declarado y perfil en `localStorage`, pero no hay **caminos predictivos** (Día 1→7 / Semana 1→4 del spec), ni cruce macromundo×micromundo en runtime. Insights son strings hardcodeados, no derivados de mocks unificados. |
| 2 | **Data macromundo Dropi visible** (benchmark LATAM: catálogo, transportadoras, tendencias, skills colectivas) | **Parcial** | Vista “Inteligencia Dropi” o pestaña en Micromundo / Reportes · Torre logística · Dashboard financiero (Kronos) | Micromundo muestra el **grafo del usuario**, no el dataset global. Benchmarks aparecen como copy suelto (ej. novedad Coordinadora 15% Bogotá) sin panel “data de todo Dropi”. Falta `macromundo.json` o sección con catálogo vivo, tasas por ciudad/semana y skills de comunidad agregadas. |
| 3 | **ROI acumulado de Gali** (valor entregado: $ ahorrados, acciones autónomas, tiempo) | **Ausente** | Hub (widget persistente) · Panel Agente Gali · `/gali-v5/agentes` (métricas por agente) | No existe contador de ROI, % acciones iniciadas por Gali, ni historial “antes/después” agregado. `liveEvents` y toasts narran acciones pero no suman impacto. Métricas del spec (>40% acciones Gali, loop cerrado >80%) no tienen UI. |
| 4 | **Estado Cero / onboarding inteligente** (3 preguntas → workspace mínimo; “Gali no repregunta lo que Dropi sabe”) | **Parcial** | Onboarding full-screen · Hub zero-state (`gali_zero_state`) · Complejidad novice/expert | Onboarding goal-based **sí existe** (5 pasos, fuentes, agente recomendado). Falta **ocultar módulos** según objetivo (spec: 2–3 módulos visibles). No se usa historial real de Dropi (pedidos/sem) para saltar preguntas — solo `sessionCount` y flags locales. |
| 5 | **Vista Señales diferenciada** (cola de decisiones con jerarquía, separada del chat) | **Parcial** | Modo **Operar** como vista primaria · Ruta `/gali-v5/senales` o tab dedicada · Panel “Decisiones pendientes” | Cards `gali-signal-card-v2` con tipos (crítica, oportunidad, completada) en Hub + tab `senales` del panel derecho. **No hay ruta propia** ni modo Operar como destino real (top bar solo cambia signal, `data-proto-skip`). Chat y señales compiten en el mismo layout (CorrecionesGali5 §4). |
| 6 | **Loop cerrado de acción visible** (señal → acción → resultado → siguiente paso) | **Parcial** | `gali-signal-card-v2` · Hub señales · Post-acción en campañas/skills | Una señal completada (sig-002) muestra antes/después y CTA “Crear skill”. El patrón **no es sistemático**: muchas CTAs con `data-proto-skip`, sin persistencia de resultado ni propuesta de skill/regla automática tras cada decisión. |
| 7 | **Gali como Director (no dashboard)** (usuario dirige; Gali opera y prioriza) | **Parcial** | Hub Mission Control · Mode bar · Insight único · Sin KPI wall duplicado | Hub tiene ciclo de negocio, agentes en vivo, insight adaptativo — pero la experiencia sigue siendo **dashboard-first**: tabs “Principal/ouiui”, score de salud genérico, doble sidebar Dropi clásico + Gali, reportes KPI tradicionales. Falta narrativa única “qué debe hacer hoy Gali” vs. “qué mirar”. |
| 8 | **Kronos como agente financiero activo** (P&L real, alertas ROAS declarado vs real, proyecciones) | **Parcial** | `/gali-v5/reportes/dashboard-financiero` · Agente Kronos en `/gali-v5/agentes` · Señales financieras en Hub | P&L waterfall, proyecciones y `channelRows` con `kronosInsight` **sí existen**. Kronos aparece en panel reportes y conexiones, pero **no en la lista de agentes del Hub** (solo Roax, Vigilante, Chatea, ADA). No emite señales propias ni ejecuta acciones (Siigo sigue “sin conectar”). Agente es identidad visual más que orquestador activo. |
| 9 | **Escalabilidad en 1 clic** (aprobar escala de pauta dentro de límites) | **Parcial** | Insight Hub “Aprobar escala” · Modal confirmación · Roax informes / campañas | `openScaleConfirm` / `confirmScale` en Hub añade evento live ($66k→$86k). **Sin integración real** (proto-skip en mode bar y muchos CTAs). Cifras inconsistentes con proyecciones ($85k en financiero). Falta vínculo con regla/skill “Escalado ROAS” activada tras aprobación. |
| 10 | **Umbral de agencia configurable** (límites por proceso: presupuesto, novedad %, montos garantía, ROAS meta) | **Parcial** | `gali-autopilot-config` · `/gali-v5/reglas` · Skills editor (umbrales CTR/48h) | Autopilot config: presupuesto máx, cambio transportadora, pausar campañas — **no persiste** en motor de reglas. Reglas y skills tienen umbrales puntuales, pero **no la matriz por bloque** del spec (8 procesos × nivel de agencia). Falta UI “hasta dónde puede llegar Gali sin permiso” por dominio (finanzas vs logística vs ads). |

### 8.2 Resumen por estado

| Estado | Promesas (#) | % |
|---|---|---|
| **Existe** (completo alineado al spec) | 0 | 0% |
| **Parcial** | 9 | 90% |
| **Ausente** | 1 | 10% |

Ninguna de las 10 promesas está **cerrada end-to-end** en el prototipo actual. Todas tienen UI o narrativa, pero faltan datos unificados, rutas ancla, persistencia y loops verificables.

### 8.3 Priorización de cierre (orden sugerido)

| Prioridad | Promesa | Por qué primero |
|---|---|---|
| P0 | (3) ROI acumulado de Gali | Sin esto no se demuestra la propuesta “Gali te hace ganar/ahorrar”; es el KPI de negocio del orquestador. |
| P0 | (1) Hiperpersonalización + (2) Macromundo | Son el diferenciador vs. ChatGPT genérico; requieren `projects.json` + `macromundo.json` y un servicio de insight. |
| P1 | (5) Vista Señales + (6) Loop cerrado | Convierten el Hub en producto accionable; desbloquean modos Operar/Lanzar/Medir con rutas reales. |
| P1 | (8) Kronos activo | Cierra la promesa financiera y alinea ROAS (ver §1 inconsistencias de datos). |
| P2 | (4) Estado Cero completo | Reduce fricción de primer uso; depende de leer historial Dropi real. |
| P2 | (9) Escala 1 clic + (10) Umbrales | Confianza progresiva; enlazar autopilot → reglas → skills. |
| P3 | (7) Director vs dashboard | Refactor de IA/UX del Hub tras datos y señales estables. |

### 8.4 Mapa promesa → artefacto técnico faltante

| Promesa | Artefacto / trabajo mínimo |
|---|---|
| Hiperpersonalización predictiva | `GaliInsightService` + caminos por `goalId` en mock; insight derivado de `businessDNA` × `macromundo` |
| Macromundo visible | `mocks/gali-v5/macromundo.json` + sección en Micromundo o Reportes |
| ROI acumulado | `GaliImpactLedger` (acciones, $ estimado, timestamp) + widget en Hub header |
| Estado Cero | Guard de módulos en `dropi-sections.config` / shell según `goalId` + skip onboarding si `hasOrders` |
| Vista Señales | Ruta `/gali-v5/senales` o `?mode=operar` con layout señales-first; quitar `data-proto-skip` en mode bar |
| Loop cerrado | Modelo `Signal` con estados + post-action hook → crear skill/regla |
| Gali Director | Un solo “siguiente paso” sticky; colapsar KPIs duplicados; unificar navegación |
| Kronos activo | Agente #5 en Hub; señales tipo financiero; conexión Siigo con estado real |
| Escala 1 clic | Aprobación → llamada mock Roax + actualización `pauta_diaria` en `projects.json` |
| Umbrales agencia | `AgencyProfile` por usuario (JSON) + UI en Autopilot alineada a 8 bloques de AlcancesIADropi |

### 8.5 Alineación con fases del spec (`GaliAjustesJun3` / `AlcancesIADropi`)

| Fase spec | Estado en prototipo v5 |
|---|---|
| Fase 0 — Chat, módulos, proyectos básicos, onboarding | ✅ Mayormente cubierta |
| Fase 1 — Loop cerrado, Vigilante visible, P&L por proyecto, panel multi-agente | ⚠️ Parcial (P&L con datos inconsistentes; loop solo en 1–2 señales) |
| Fase 2 — Proyectos unificados, goal-based, dashboard objetivo en sidebar | ⚠️ Parcial (proyectos sin tabs con datos; sin barra de progreso 38/50 en sidebar) |
| Fase 3 — MCPs reales (Meta, Siigo, WhatsApp, routing) | ❌ Ausente (conexiones UI; sin ejecución) |
| Fase 4 — Comunidad skills economía | ⚠️ Parcial (`/skills/comunidad`, `/marketplace`; activar no persiste) |
| Fase 5 — Autopilot total, agentes paralelos | ❌ Ausente (simulación live events) |

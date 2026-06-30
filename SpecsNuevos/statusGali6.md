# Status Gali 6 — Proyectos Rediseño
**Fecha:** 26 jun 2026  
**Rama:** main  
**Build:** ✅ Limpio (solo warnings de bundle budget, sin errores TS/SCSS)

---

## Resumen ejecutivo

Se ejecutó un rediseño completo de la sección **Proyectos** de Gali 6 (`/gali-6/proyectos`), atacando 5 problemas identificados en la revisión del 17 jun 2026:

| # | Problema | Estado |
|---|---|---|
| 1 | Alertas redundantes (check-ins + recomendaciones separados) | ✅ Resuelto |
| 2 | "Editar" objetivo redirigía a ruta inexistente | ✅ Resuelto |
| 3 | Proyectos asumían siempre tener campañas | ✅ Resuelto |
| 4 | Wizard desalineado (producto primero, pauta después de precio) | ✅ Resuelto |
| 5 | Accordion de campañas con elementos superpuestos | ✅ Resuelto |

---

## Archivos modificados

### Mocks

| Archivo | Cambio |
|---|---|
| `mocks/gali-v6/proyectos.mock.ts` | + tipo `TipoProyecto` (5 valores) · + interfaz `TipoProyectoMeta` · + array `TIPOS_PROYECTO` con emoji/descripción/agentesDefault · + campo `tipo?` en `ProyectoDetalle` · mock entries actualizados |
| `mocks/gali-v6/campanas.mock.ts` | + tipo `IntegracionId` · + interfaz `IntegracionStatus` · + array `INTEGRACIONES_CAMPANA` (Meta=conectado, TikTok=conectado, Shopify=conectado, Chatea=pendiente) con `pasosConexion` |

### Componente: Portafolio (`gali6-proyectos-casa`)

| Archivo | Cambio |
|---|---|
| `.component.ts` | + interfaz `AlertaUnificada` · + computed `alertasUnificadas` (merge MOCK_ALERTAS + MOCK_SENALES + checkins, max 3, con agente byline) · + `tipo?` en `ProyectoRow` · fix `openEdit()` → navega a `/gali-6/mi-negocio` · fix filtro `a.tipo === 'critical'` (era `a.urgencia`) |
| `.component.html` | Reemplazó `<section class="checkins">` + `<section class="reco">` → `<section class="alertas-unif">` única · accordion toggle solo si `campanaCount > 0` · chip "Sin campañas" para proyectos sin ellas · hint borrador → "Proyecto en construcción" |
| `.component.scss` | + `.alertas-unif`, `.alerta-item`, `.alerta-item__agente`, `.alertas-unif__ver-todas` · + `.port__sin-campanas` · fix `.campana-row__left { flex-wrap: wrap }` · fix `.campana-row__metrics { flex-wrap: wrap }` |

### Componente: Agentes (`gali6-agentes`)

| Archivo | Cambio |
|---|---|
| `.component.ts` | + `OnInit` · + `ActivatedRoute` injection · `ngOnInit` lee `?crear=true` y llama `setTimeout(() => crearAgente(), 300)` |

### Componente: Wizard nuevo proyecto (`gali6-nuevo-proyecto`)

| Archivo | Cambio |
|---|---|
| `.component.ts` | **Reescritura completa.** 12 steps (`tipo \| nombre \| agentes \| agregar-campana \| campana-integraciones \| campana-enfoque \| campana-productos \| campana-presupuesto \| campana-brujula \| campana-creativos \| campana-resumen \| exito`) · PROJ_STEPS[4] + CAMP_STEPS[7] · señales para tipo, nombre, agentes (Roax locked para lanzar/escalar/experimentar), integraciones, enfoque, multi-select productos, presupuesto, brújula, creativos · `pautaEfectivaPorPedido` computed · `selectTipo()` pre-rellena agentes + nombre · `elegirAgregarCampana()` bifurca a integraciones o borrador · `irCrearAgente()` navega a `/gali-6/agentes?crear=true` · progress bar dual-segment · `getTipoLabel()` + `productosNombres` computed |
| `.component.html` | **Reescritura completa.** Implementa los 12 pasos: grilla de 5 tipos de proyecto, input nombre pre-rellenado, toggles de agentes con badge "Obligatorio", bifurcación Sí/Después, check de integraciones con guías colapsibles + warning si ninguna conectada, 4 botones de enfoque + textarea, multi-select productos con chips, **presupuesto ANTES que brújula**, brújula con fila pauta/pedido destacada, creativos condicionados por integración (landing/ads/whatsapp), resumen completo con animación de lanzamiento, pantalla éxito/borrador |
| `.component.scss` | + estilos nuevos: `.tipo-grid`, `.tipo-card`, `.nombre-input`, `.nombre-reset`, `.agente-opt` (nuevo estilo label), `.agente-crear-link`, `.agregar-card`, `.launch-mini`, `.integ-row`, `.integ-guide`, `.integ-warning`, `.enfoque-btn`, `.desc-field`, `.prod-chips`, `.prod-chip`, `.presupuesto-insight`, `.presupuesto-aviso`, `.brujula-metric--pauta`, `.creativo-section`, `.creativo-check`, `.launch-success__emoji`, `.wizard__eyebrow`, `.wizard__gali-hint`, `.sr-only` |

### Navigation map

| Archivo | Cambio |
|---|---|
| `navigation-map.json` | + módulo `gali-6` con 4 vistas: `proyectos` (route, prototype, CTAs), `nuevo-proyecto` (wizard 12 pasos, on_success/on_cancel, notas UX), `agentes` (?crear=true), `mi-negocio` |

---

## Flujos UX implementados

### Wizard Nuevo Proyecto — flujo completo

```
[Tipo] → [Nombre pre-rellenado] → [Agentes inline]
   └─ Continuar sin campaña → animación → [Éxito borrador]
   └─ Agregar campaña:
        [Integraciones check] → [Enfoque ×4] → [Productos multi-select]
        → [Presupuesto pauta] → [Brújula precio] → [Creativos]
        → [Resumen] → animación lanzamiento → detalle proyecto
```

### Agente auto-panel
- Wizard paso Agentes → "Crear agente personalizado →" navega a `/gali-6/agentes?crear=true`
- Agentes component `ngOnInit` detecta el param y abre el panel de creación automáticamente

### Alertas unificadas
- Máx 3 items fusionando MOCK_ALERTAS críticas + MOCK_SENALES de escala/riesgo
- Cada alerta muestra: `[Agente] detectó → Título → Cuerpo → CTA`
- Footer "Ver todas en Señales →" → `/gali-6/senales`

---

## Decisiones de diseño clave

| Decisión | Razón |
|---|---|
| Pauta (presupuesto) **antes** que precio (brújula) | El costo de pauta/pedido afecta directamente el precio de venta mínimo |
| Proyectos sin campañas muestran chip "Sin campañas" | Un proyecto es una iniciativa estratégica, no solo un contenedor de campañas |
| Roax Ads bloqueado (ON obligatorio) para tipos lanzar/escalar/experimentar | Estos tipos siempre requieren optimización de pauta activa |
| Integraciones como primer paso de campaña | Sin conexión activa la campaña no puede lanzarse; mejor advertir antes |
| Alertas con byline de agente | "Roax Ads detectó..." da contexto de por qué es relevante vs. alerta anónima |

---

## Pendientes / próximos pasos sugeridos

- [x] Vista detalle de proyecto (`/gali-6/proyecto/:id`) con timeline de campañas ✅
- [x] Vista detalle de campaña con métricas Roax en tiempo real (mock) ✅
- [ ] Panel "Conexiones" (`/gali-6/conexiones`) para gestionar integraciones
- [ ] Señales filtradas por proyecto en `/gali-6/senales?proyectoId=X`
- [ ] Smoke test manual en `/gali-6/proyectos/nuevo` de principio a fin

---

## Correcciones 29 Jun 2026

**Build:** ✅ Limpio (16.19s)

| # | Corrección | Estado |
|---|---|---|
| C1 | Alertas grid 3 columnas | ✅ Ya estaba en SCSS |
| C2 | CTAs alertas → destino correcto (Siigo/Adaspi) | ✅ Ya estaba en TS |
| C3 | Salud portafolio: chips semáforo activo/riesgo/pausado/borrador + score | ✅ Implementado |
| C4 | Sub-objetivo visible en project cards | ✅ Ya mapeado en pvRows |
| C5 | Bug `@if (false)` en modal editar → `@if (editProyectoOpen())` | ✅ Implementado |
| C6 | Semántica pausa: "Pausar campañas" (no proyecto), borradores con Descartar | ✅ Implementado |
| W1 | Wizard: productos primero → tipo → canal → presupuesto → brújula | ✅ Implementado |
| W2 | Bug "Proyecto no encontrado" post-wizard → estado de carga transitorio | ✅ Implementado |
| W3 | Brújula: accordion por producto + sliders en tiempo real + utilidad COP | ✅ Implementado |
| W4 | Ruta de venta: costos explícitos Shopify $89k/Chatea Pro $149k/mes | ✅ Implementado |
| W5 | Drawer "Agregar producto" en campana-detalle | ✅ Ya correcto |
| D1 | Tabla rendimiento por producto en proyecto-detalle (campañas accordion) | ✅ Ya existía |
| D2 | Sub-objetivo en header de proyecto-detalle | ✅ Implementado |
| CD1 | Tabla rendimiento en campana-detalle (`tieneMetricasRendimiento`) | ✅ Ya existía |
| Mock | pv-001 subObjetivo, pv-003 ya tenía en línea 363 | ✅ Correcto |

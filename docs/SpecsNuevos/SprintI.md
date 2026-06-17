# Sprint I — Mejoras Gali 6 (post-revisión Catalina 17 jun 2026)

> **Estado:** Pendiente de implementación  
> **Basado en:** feedback oral de Catalina + análisis de brechas vs. reunión 16-jun  
> **Ruta del prototipo:** `/gali-6`  
> **Prerequisito:** H1–H7 completamente implementados (commit c925e27)

---

## Contexto

Catalina revisó Gali 6 en vivo y entregó feedback en dos rondas:

- **Ronda 1 (20 puntos):** Home saturado verticalmente, chat con alerta bloqueante, autopilot global en lugar de por agente, Mi Negocio/Contexto fragmentado, objetivo ocupando demasiado espacio en Proyectos, galería sin versión "punto cero".
- **Ronda 2 (proyectos):** Lista de proyectos sin búsqueda ni acción de pausar, borradores muestran demasiada info, wizard mal ordenado (pide pedidos antes de saber producto/precio), brújula no incluye flete fijo ni comisión ni expectativa realista calculada, objetivo demasiado rígido (solo pedidos+plazo), al lanzar no redirige al proyecto, falta flujo de creativos/landing post-lanzamiento.

Los 10 specs de este sprint resuelven todos esos puntos en orden de menor a mayor complejidad.

---

## Spec I1 — Home "Hoy": layout 2 columnas

**Problema:** Las 6 secciones verticales saturan visualmente. El usuario quiere una lectura de izquierda a derecha: lo que tiene que decidir (izquierda) vs. el estado de su operación (derecha).

**Skills:** `/interface-design` (layout del dashboard) · `/design-taste-frontend` (evitar genérico en la composición de 2 cols)

**Archivo principal:** `src/app/pages/gali-6/home/gali6-hoy-home.component.html` + `.scss`

**Cambios:**
1. Cambiar el layout del `.hoy` a CSS Grid de 2 columnas (`grid-template-columns: 1fr 1fr`), con breakpoint que colapsa a 1 columna en pantallas < 900px.
2. **Columna izquierda:** sección `status` (línea de estado) + sección `block` (Decisión de hoy) + sección `impacto` (Gali hizo por mí).
3. **Columna derecha:** sección `palanca` (renombrada "Tu recorrido") + sección `cola` (alertas pendientes compactas, siempre visibles sin toggle, máx 4 items, link "Ver todas →" a `/gali-6/senales`) + bloque asistentes activos (spec I7).
4. Eliminar el `<button class="cola__toggle">` — las alertas del lado derecho son siempre visibles.
5. Eyebrow de `modulos` → "Lo que falta para completar tu ciclo".

**CA:** Build limpio. Desktop muestra 2 columnas. Izquierda: decisión + Gali hizo. Derecha: recorrido + alertas compactas + asistentes.

---

## Spec I2 — Galería: 2 entradas Gali 6 + fix contraste íconos FAB

**Problema:** La galería tiene una sola entrada para Gali 6. El equipo necesita poder demostrar el "punto cero" (usuario sin historial) por separado. Los íconos de huella y torre en el FAB no tienen contraste.

**Skills:** `/bencium-controlled-ux-designer` (decisión visual del contraste y tarjeta punto-cero)

**Archivos:**
- Galería: `src/app/pages/home/home.component.html` (o componente equivalente de la galería)
- FAB: `src/app/pages/gali-6/components/gali6-fab.component.ts`
- Icon rail: `src/app/pages/gali-6/gali-6-icon-rail.component.ts`

**Cambios:**
1. En la galería, añadir segunda tarjeta "Gali 6 — Punto cero" con ruta `/gali-6?zero=1`. La shell detecta `?zero=1` en `ngOnInit`, resetea `localStorage.removeItem('gali-6-onboarding-done')` y navega a `/gali-6` limpio.
2. En el FAB (`Gali6FabComponent`), los íconos SVG o `<img>` de huella y torre logística deben añadir `filter: brightness(0) invert(1)` en su SCSS para que se vean blancos sobre el fondo naranja.

**CA:** Build limpio. Galería muestra 2 tarjetas de Gali 6. "Punto cero" muestra ZeroState. Íconos huella/torre visibles en blanco.

---

## Spec I3 — Chat: alerta compacta en topbar + pantalla reactiva

**Problema:** La alerta que aparece al abrir el panel de chat bloquea el acceso real al chat (necesita doble clic). Las señales dentro del chat no son las mismas que en `/gali-6/senales`. Cuando el usuario le dice algo al chat, la pantalla principal no reacciona visiblemente.

**Skills:** `/agentic-ux-design-relationship-centric-interfaces` (UX del chat como canal de acción, no solo consulta) · `/bencium-innovative-ux-designer` (microinteracción reactiva pantalla principal)

**Archivos:**
- `src/app/pages/gali-6/gali-6-shell.component.html` + `.ts`
- `src/app/pages/gali-5/gali-v5/components/gali-right-panel/gali-right-panel.component.html`

**Cambios:**

### Badge en topbar
En `gali-6-shell.component.html`, añadir en `<div class="topbar__right">` antes del avatar:
```html
<a routerLink="/gali-6/senales" class="topbar__alerts-badge"
   [attr.aria-label]="'Ver alertas: ' + alertCount + ' pendientes'">
  ◎ <span class="topbar__alerts-count">{{ alertCount }}</span>
</a>
```
`alertCount` es un `computed()` en el shell que cuenta `MOCK_ALERTAS.filter(a => a.tipo === 'critical').length` (el mock ya está importado).

### Quitar bloque bloqueante del panel
En `gali-right-panel.component.html`, identificar el bloque inicial de alerta (`@if (showAlert)` o similar) y eliminarlo del primer plano del panel. El panel debe abrir directamente al chat.

### Chat reactivo (simulación visual)
Cuando el usuario envía un mensaje con keywords `crea / proyecto / lanza / activa / hazlo`:
- Mostrar bajo el input: `.chat-action-preview` con texto "Gali está aplicando esto en tu panel →" + pulso animado (CSS keyframes).
- Después de 1.2s: añadir clase `.g6shell--gali-acting` al host del shell durante 1.5s (borde naranja sutil en `<main>` via transición CSS).

### Señales del chat = MOCK_ALERTAS
La sección de alertas dentro del panel debe leer el mismo `MOCK_ALERTAS` que usa el resto del prototipo, no datos hardcodeados locales.

**CA:** Build limpio. Chat abre sin bloque. Badge en topbar con count. Escribir "crea proyecto" → feedback visual en pantalla.

---

## Spec I4 — Autopilot por agente en panel derecho

**Problema:** El autopilot aparece como un toggle global de Gali. No es un modo general, es una configuración por asistente.

**Skills:** `/agentic-ux-design-relationship-centric-interfaces` (UX de confianza progresiva por agente — el usuario cede autonomía de forma granular)

**Archivo:** `src/app/pages/gali-5/gali-v5/components/gali-right-panel/gali-right-panel.component.html` (tab agentes/autopilot)

**Cambios:**
1. Reemplazar el toggle global por una lista de los 5 asistentes: Roax, Vigilante, Chatea Pro, ADA Spy, Kronos.
2. Cada asistente: nombre + color chip + toggle `ON/OFF` + texto de estado ("3 acciones hoy" / "esperando").
3. Los estados son signals locales en el panel (mock inicial):
   ```ts
   readonly autopilotStates = signal({ roax: true, vigilante: true, chatea: false, ada: false, kronos: false });
   ```
4. Bajo la lista: botón "Ver detalles →" que navega a `/gali-6/agentes` si `modo === 'experto'`. En básico, muestra tooltip: "Activa modo experto para gestionar asistentes".

**CA:** Build limpio. Panel muestra 5 asistentes con toggle individual. En básico el botón tiene tooltip. En experto navega a /agentes.

---

## Spec I5 — Mi Contexto: fusionar Conexiones + Marketplace + Archivos

**Problema:** "Mi Contexto" apunta al micromundo de V5. Las conexiones, señales e integraciones están dispersas. El usuario quiere un único lugar que consolide todo el contexto de su negocio: señales activas, conexiones con APIs/MCPs, marketplace de integraciones, y archivos cargados.

**Skills:** `/interface-design` (layout de página de configuración/contexto con 3 tabs) · `/human-architect-mindset` (IA de la página: qué va en cada tab y por qué) · `/full-output-enforcement` (componente grande — evitar código truncado)

**Archivos a crear:**
- `src/app/pages/gali-6/mi-contexto/gali6-mi-contexto.component.ts`
- `src/app/pages/gali-6/mi-contexto/gali6-mi-contexto.component.html`
- `src/app/pages/gali-6/mi-contexto/gali6-mi-contexto.component.scss`

**Ruta:** `gali-6.routes.ts` → `path: 'mi-negocio'` apunta al nuevo componente (reemplaza micromundo V5).

**Estructura (3 tabs):**

### Tab 1 — Señales
- Mismas alertas que `/gali-6/senales` (leer `MOCK_ALERTAS`)
- Agrupadas: Críticas | Diagnóstico | Oportunidades
- Sección "Actividad reciente de Gali": últimas 3 acciones ejecutadas (de `wallet-transactions.json` o alertas con estado `ejecutada`)
- Link "Ver panel completo →" a `/gali-6/senales`

### Tab 2 — Conexiones
- **Sección A — Activas:** Meta, TikTok, Shopify, Google Drive, ChateaPro — estado: conectado/pendiente con indicador de color.
- **Sección B — Explorar integraciones:** grid de cards agrupadas por tipo (APIs, MCPs, E-commerce, Analítica, Archivos). Badge "próximamente" en no disponibles. "Activar" en disponibles. Link "Ver marketplace completo →" a `/gali-6/marketplace`.
- **Sección C — Archivos y contexto:** zona drag-drop para subir archivo local + mock de 2 archivos ya cargados (`operacion_jun2026.csv`, `productos_activos.xlsx`) + botón "Conectar Google Sheets".

### Tab 3 — Mi Operación
- Objetivo: texto + barra progreso + botón "✦ Mejorar con Gali" (mismo patrón de Cambio E).
- Mayor fricción: chip editable (stock / ads / pedidos / otro).
- Canal principal: chips Meta / TikTok / Ambos.
- Datos de facturación: campo de Siigo (conectado / pendiente).

**CA:** Build limpio. `/gali-6/mi-negocio` muestra 3 tabs. Tab Conexiones tiene las 3 secciones. Tab Señales usa MOCK_ALERTAS.

---

## Spec I6 — Proyectos: objetivo compacto

**Problema:** El bloque de objetivo en `/gali-6/proyectos` es enorme (tipo, plazo, barra, sub-metas, contribución por proyecto). Ocupa demasiado espacio empujando la lista de proyectos hacia abajo.

**Skills:** `/minimalist-ui` (reducir a lo esencial sin perder información clave) · `/redesign-existing-projects` (modificar el bloque existente sin romper el modal de edición)

**Archivos:** `src/app/pages/gali-6/proyectos/gali6-proyectos-casa.component.html` + `.scss`

**Cambios:**
1. Colapsar toda la sección `.goal` a un bloque compacto de max 48px de altura:
```html
<div class="objetivo-compact">
  <span class="objetivo-compact__texto">{{ objetivo().texto }}</span>
  <div class="objetivo-compact__bar">
    <div class="objetivo-compact__fill" [style.width.%]="metaPct()"></div>
  </div>
  <span class="objetivo-compact__val">{{ pedidosActual }}/{{ objetivo().meta_pedidos_sem }} · {{ metaPct() }}%</span>
  <a routerLink="/gali-6/mi-negocio" [queryParams]="{tab: 'operacion'}" class="objetivo-compact__edit">
    Editar →
  </a>
</div>
```
2. Eliminar del template la sección `goal__submetas` y `goal__breakdown` — esa info va en Mi Contexto tab Operación.
3. Mantener el modal de edición (`editOpen`) funcionando desde el link "Editar →" del bloque compacto.

**CA:** Build limpio. Objetivo ocupa 1 línea. "Editar →" abre modal o navega a Mi Contexto.

---

## Spec I7 — Copy + nav + asistentes en home

**Problema:** (a) Falta consistencia en el label "Mi Negocio" en la nav. (b) Los asistentes de Gali no son visibles en el Home. (c) El breadcrumb de /gali-6 no muestra la jerarquía Mi Negocio / Hoy.

**Skills:** `/design-audit` (auditar inconsistencias de copy en nav y breadcrumbs) · `/using-ux-designer` (IA de navegación y accesibilidad de la estructura Mi Negocio)

**Archivos:**
- `src/app/pages/gali-6/gali-6-sections.config.ts`
- `src/app/pages/gali-6/home/gali6-hoy-home.component.html` + `.ts`

**Cambios:**

### Nav: accordion "Mi Negocio" con sub-items coherentes
En `GALI_6_MISSION_PANEL`, el accordion `mi-negocio` tiene children: Hoy | Señales | Conexiones | Impacto | Mi Contexto. Actualizar:
- "Conexiones" y "Mi Contexto" apuntan a `/gali-6/mi-negocio?tab=conexiones` y `/gali-6/mi-negocio?tab=operacion` respectivamente (la página de I5 lee el queryParam `tab` para activar la tab correcta).
- "Señales" apunta a `/gali-6/mi-negocio?tab=senales`.

### Breadcrumb
En `gali6-hoy-home.component.html`, el `app-g6-page-header` debe mostrar `breadcrumbs="['Mi Negocio', 'Hoy']"`.

### Asistentes activos en columna derecha del home
En la columna derecha (spec I1), añadir al final un bloque compacto:
```html
<div class="asistentes-compact">
  <span class="asistentes-compact__eyebrow">Asistentes activos</span>
  <div class="asistentes-compact__chips">
    @for (a of asistentes; track a.id) {
      <span class="asistentes-compact__chip" [attr.data-on]="a.autopilot">
        {{ a.nombre }}
      </span>
    }
  </div>
  <a routerLink="/gali-6/agentes" class="asistentes-compact__link">Ver asistentes →</a>
</div>
```
`asistentes` es un array inline: `[{id:'roax', nombre:'Roax', autopilot:true}, ...]`.

**CA:** Build limpio. Breadcrumb dice "Mi Negocio / Hoy". Columna derecha muestra chips de asistentes. Nav accordion tiene sub-items correctos.

---

## Spec I8 — Lista de proyectos: búsqueda + layout + pausar/editar desde dentro + borradores limpios

**Problema:** No hay búsqueda en la lista de proyectos. Los proyectos en escala muestran demasiadas columnas saturadas. Los borradores muestran ROAS y salud vacíos sin sentido. No se puede pausar ni editar un proyecto desde dentro de su vista de detalle.

**Skills:** `/interface-design` (rediseño de tabla/lista de proyectos a 4 columnas) · `/redesign-existing-projects` (mejorar sin romper funcionalidad existente) · `/full-output-enforcement` (dos componentes en un spec — evitar truncación)

**Archivos:**
- `src/app/pages/gali-6/proyectos/gali6-proyectos-casa.component.html` + `.ts` + `.scss`
- `src/app/pages/gali-5/gali-v5/pages/proyecto/proyecto-detalle-page.component.html` (pausar/editar desde dentro)

**Cambios:**

### 8a — Search bar
Encima de `port__filters`, añadir:
```html
<div class="port__search">
  <input type="search" class="port__search-input"
         placeholder="Buscar proyecto..."
         [ngModel]="searchQuery()"
         (ngModelChange)="searchQuery.set($event)">
</div>
```
`proyectosFiltrados()` computed ya filtra por estado — extender: también filtrar por `p.nombre.toLowerCase().includes(searchQuery().toLowerCase())`. Inicializar `searchQuery = signal('')`.

### 8b — Layout compacto de tarjetas (skill `interface-design`)
Reducir las columnas de la tabla `port__legend` de 6 a 4: `Estado | Proyecto | Salud | →`.
- ROAS y contribución se muestran al expandir (hover o clic en la fila).
- Usar `grid-template-columns: 80px 1fr 120px 40px` en `.port__item`.
- Detalle expandido: `position: absolute` debajo de la fila con ROAS, contribución y última señal de Gali.

### 8c — Borradores simplificados
```html
@if (p.estado === 'borrador') {
  <li class="port__item port__item--borrador" (click)="continuar(p.id)">
    <span class="port__estado" data-estado="borrador">Borrador</span>
    <span class="port__name">{{ p.nombre }}</span>
    <span class="port__borrador-hint">Falta elegir producto y precio</span>
    <span class="port__go">Completar →</span>
  </li>
}
```
Los borradores NO entran al `@for` general — tienen su propio bloque que no muestra ROAS ni salud.

### 8d — Pausar/editar desde dentro del proyecto
En `proyecto-detalle-page.component.html`, en el header del proyecto (donde está el título y estado), añadir:
```html
<div class="proy-detail__header-actions">
  @if (proyecto.estado === 'activo' || proyecto.estado === 'escala') {
    <button class="proy-detail__pause-btn" (click)="pausarProyecto()">⏸ Pausar</button>
  } @else if (proyecto.estado === 'pausado') {
    <button class="proy-detail__pause-btn proy-detail__pause-btn--reanudar" (click)="reanudarProyecto()">▶ Reanudar</button>
  }
  <button class="proy-detail__edit-btn" (click)="editarProyecto()">✎ Editar</button>
</div>
```
`pausarProyecto()` muestra toast "Proyecto pausado · Gali detuvo las acciones automáticas".
`editarProyecto()` abre el mismo modal de edición de la lista (`openEditProyecto`).

**CA:** Build limpio. Search bar filtra proyectos. Borradores muestran solo nombre + "Completar". Tarjetas activas tienen 4 columnas. Desde detalle se puede pausar y editar.

---

## Spec I9 — Wizard nuevo proyecto: reordenar + brújula ampliada + objetivo libre

**Problema:** El paso 1 actual pregunta "¿cuántos pedidos quieres?" — nadie sabe la respuesta y todos pondrán el máximo. La brújula no incluye todos los costos reales (flete fijo de la plataforma, comisión, pauta estimada). El objetivo (modal de edición) es demasiado rígido (solo pedidos + plazo). La expectativa de pedidos debería ser un resultado calculado, no un input del usuario.

**Skills:** `/renaissance-architecture` (repensar desde cero el orden y la lógica del wizard) · `/bencium-controlled-ux-designer` (UX de formulario con campos read-only vs editables, glosario inline) · `/full-output-enforcement` (wizard multi-paso con muchos cambios — evitar truncación)

**Archivos:**
- `src/app/pages/gali-6/proyectos/gali6-nuevo-proyecto.component.html` + `.ts`
- `mocks/gali-v5/projects.json`

**Cambios:**

### 9a — Reordenar pasos
Nuevo `STEPS` en el componente:
```ts
const STEPS = ['producto', 'brujula', 'presupuesto', 'lanzar'];
```
Eliminar el paso `'objetivo'` (paso actual 1). La contribución al objetivo se muestra como resultado calculado en la brújula, no como input preguntado al usuario.

### 9b — Paso 1 (Producto): búsqueda libre + alerta de riesgo
El paso ya existe con recomendaciones de ADA. Añadir:
- Input de búsqueda libre `"Buscar un producto diferente..."` encima de las cards — filtra las cards disponibles.
- Sin resultados en búsqueda: "Gali no tiene datos de este producto todavía. ¿Continuar con él? [Sí →]"
- Al seleccionar producto con `adaScore < 55`: alerta amber inline "⚠ ADA detecta riesgo: tendencia baja o stock limitado. Puedes continuar."

### 9c — Brújula ampliada (Paso 2)
La brújula actual tiene `costoProd` (editable) y `fleteEst` (editable). Cambiar:

| Campo | Tipo | Fuente |
|---|---|---|
| Costo del producto | Editable | El usuario puede corregirlo |
| Flete | **Read-only** | Valor fijo plataforma ($7.000). Texto: "Establecido por Dropi" |
| Comisión de plataforma | **Read-only** | 8% del precio de venta, recalcula en tiempo real |
| Pauta estimada por pedido | **Read-only** | `(presupuestoDiario × 7) / pedidosEstSem`. Badge "✦ de tu cuenta Meta" |
| Ganancia real por pedido | Calculado | `precioFinal - costoProd - flete - comisión - pautaPorPedido` |
| Expectativa de pedidos/sem | Calculado | `(presupuestoDiario × 7 × ROAS) / precioFinal`. Mostrar como "Gali estima X pedidos/sem" |

Añadir ícono `ⓘ` con glosario inline junto a: `margen`, `ganancia real`, `ROAS`. Los tooltips del glosario ya tienen la directiva `galiGlosario` en V5 — usarla aquí también.

Valores mock iniciales: `fleteEst = 7000` (readonly), `comisionPct = 8`, `presupuestoDiario = 25000`, `ROAS = 1.9`.

### 9d — Paso 3 (Presupuesto): vinculado a expectativa
El paso de presupuesto ahora parte de la base calculada en 9c. Al ajustar el presupuesto diario, la expectativa de pedidos se actualiza en tiempo real. No pedir pedidos esperados — mostrarlos como resultado.

### 9e — Objetivo libre en modal de edición
En `gali6-proyectos-casa.component.html` modal de editar objetivo, reemplazar el `tipo-picker` (volumen/financiero/expansión) por:
- Textarea libre: `placeholder="¿Qué quieres lograr? Ej: generar $3M/mes en ganancia, o tener 5 proyectos simultáneos..."`
- Botón "✦ Gali, ayúdame a definir esto" → después de 800ms muestra propuesta reformulada (mock, mismo patrón del Cambio E).
- Mantener barra de progreso de pedidos como métrica operativa secundaria (no el eje principal).

**CA:** Build limpio. Wizard empieza en Producto. Brújula muestra flete/comisión como read-only con ganancia real y expectativa calculada. Modal de objetivo tiene textarea libre.

---

## Spec I10 — Post-lanzamiento: redirect al proyecto + creativos pendientes

**Problema:** Al lanzar el proyecto, solo aparece un toast y queda en el listado. Falta: (1) redirigir al proyecto recién lanzado, (2) mostrar que falta lo más crítico para que la campaña corra: landing page y creativos.

**Skills:** `/high-end-visual-design` (momento de alto impacto: sección "Falta lo más importante" debe sentirse crítica y bien diseñada) · `/agentic-ux-design-relationship-centric-interfaces` (la sección refleja la relación Gali-usuario: Gali puede tomar acción, o el usuario lo hace él mismo)

**Archivos:**
- `src/app/pages/gali-6/proyectos/gali6-nuevo-proyecto.component.ts` (función `lanzar()`)
- `src/app/pages/gali-5/gali-v5/pages/proyecto/proyecto-detalle-page.component.html`
- `mocks/gali-v5/projects.json`

**Cambios:**

### 10a — Redirect al lanzar
En `lanzar()`, después de la animación de confirmación (ya existe el modal de éxito):
```ts
// Después del setTimeout de la animación
this.router.navigate(['/gali-6/proyecto', nuevoProyecto.id]);
```
Añadir al nuevo proyecto mock: `creativos_pendientes: true`.

### 10b — Sección "Falta lo más importante" en proyecto recién lanzado
En `proyecto-detalle-page.component.html`, si `proyecto.estado === 'recien_lanzado'` y `proyecto.creativos_pendientes`:

```html
<section class="proy-pendiente-creative">
  <span class="proy-pendiente-creative__eyebrow">⚡ Falta lo más importante</span>
  <h2 class="proy-pendiente-creative__title">Tu campaña necesita landing page y creativos</h2>
  <p class="proy-pendiente-creative__sub">
    Sin esto la pauta no puede correr. Gali puede generarlos o puedes hacerlo tú.
  </p>
  <div class="proy-pendiente-creative__opciones">
    <button class="proy-pendiente-creative__opt proy-pendiente-creative__opt--auto"
            (click)="galiAutomatiza()">
      <span aria-hidden="true">✦</span>
      <strong>Que Gali lo haga</strong>
      <span>Conecta con tus asistentes para generar página y creativos</span>
    </button>
    <button class="proy-pendiente-creative__opt proy-pendiente-creative__opt--manual"
            (click)="irACreador()">
      <span aria-hidden="true">✎</span>
      <strong>Lo hago yo</strong>
      <span>Ir al Creador de Páginas con asistencia de IA</span>
    </button>
  </div>
</section>
```

`galiAutomatiza()` → toast "Gali está configurando tu landing..." → después de 2s: `proyecto.creativos_pendientes = false` + muestra preview mock de la página.  
`irACreador()` → `router.navigate(['/gali-6/marketing/creador-de-paginas'])`.

**CA:** Build limpio. Al lanzar → navega a /proyecto/:id en estado recién lanzado. Sección creativos pendientes visible. Ambos CTAs responden.

---

## Orden de ejecución

| # | Spec | Skills a invocar | Build |
|---|---|---|---|
| I1 | Home 2 columnas | `/interface-design` · `/design-taste-frontend` | ✅ |
| I2 | Galería 2 entradas + íconos blancos | `/bencium-controlled-ux-designer` | ✅ |
| I3 | Chat badge topbar + pantalla reactiva | `/agentic-ux-design-relationship-centric-interfaces` · `/bencium-innovative-ux-designer` | ✅ |
| I4 | Autopilot por agente en panel | `/agentic-ux-design-relationship-centric-interfaces` | ✅ |
| I5 | Mi Contexto nueva página (3 tabs) | `/interface-design` · `/human-architect-mindset` · `/full-output-enforcement` | ✅ |
| I6 | Proyectos: objetivo compacto | `/minimalist-ui` · `/redesign-existing-projects` | ✅ |
| I7 | Copy + nav + asistentes en home | `/design-audit` · `/using-ux-designer` | ✅ |
| I8 | Lista proyectos: search + layout + pausar | `/interface-design` · `/redesign-existing-projects` · `/full-output-enforcement` | ✅ |
| I9 | Wizard: reordenar + brújula ampliada | `/renaissance-architecture` · `/bencium-controlled-ux-designer` · `/full-output-enforcement` | ✅ |
| I10 | Post-lanzamiento: redirect + creativos | `/high-end-visual-design` · `/agentic-ux-design-relationship-centric-interfaces` | ✅ |

**Regla:** compilar limpio entre cada spec. No mezclar specs en un mismo commit.

---

## Verificación end-to-end

1. `/gali-6` → 2 columnas. Izq: decisión + Gali hizo. Der: recorrido + alertas + chips asistentes
2. Topbar: badge ◎ con count → navega a /senales
3. Chat: abre sin bloque. "crea proyecto" → feedback naranja en pantalla
4. Panel derecho → 5 asistentes con toggle autopilot individual
5. `/gali-6/mi-negocio` → 3 tabs: Señales / Conexiones+Marketplace+Archivos / Mi Operación
6. `/gali-6/proyectos` → objetivo 1 línea + search bar + borradores simplificados
7. Desde dentro de un proyecto → botón Pausar/Reanudar + Editar
8. Nuevo proyecto: paso 1 = Producto (con búsqueda libre + alerta de riesgo ADA)
9. Brújula: flete read-only, comisión calculada, pauta estimada, ganancia real, expectativa de pedidos como OUTPUT
10. Modal objetivo: textarea libre + "Gali, ayúdame a definir esto"
11. Al lanzar → /proyecto/:id con sección "Falta lo más importante"
12. Galería: 2 tarjetas Gali 6. Punto cero resetea onboarding. Íconos FAB en blanco

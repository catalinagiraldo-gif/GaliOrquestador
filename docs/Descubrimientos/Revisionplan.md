# Revisionplan — Post-Cata 8 Jun 2026

**Fuente primaria:** `docs/Descubrimientos/Correcionescata8jun.md`
**Estado real vs estimado:** Specs 3 y 5 están al ~40-50% implementado, no al 75-80% que dice el pipeline.

---

## Resumen ejecutivo

El prototipo se siente como **piezas desconectadas que compiten por atención**: Hub sin jerarquía, Agentes sin persistencia, Skills confundidas con Agentes, alertas acumuladas en cada pantalla, y Gali como chatbot único en vez de workspace IA. No es un bug puntual — es un patrón que se repite en cada módulo. El orden de ataque por impacto emocional (lo que más bloquea a Cata): Hub que tenga sentido → Crear agente que funcione → Ontología clara (skill ≠ agente) → Explicabilidad (dropshipper entiende PIL, ROAS) → Multi-chat + flujos completos.

---

## Diagnóstico real por componente

### 1. Gali Hub — `home.component.html`

| # | Problema | Path / línea | Gravedad |
|---|---|---|---|
| 1 | Objetivo read-only — solo editable desde "Reconfigurar Gali" al fondo | L61-67 (goal strip) | 🔴 P0 |
| 2 | Toggle básico/experto junto a "Decisiones Pendientes" — confunde | L246-261 | 🔴 P0 |
| 3 | En modo experto: Ciclo de negocio (L409+) está DEBAJO de Decisiones — debería estar ARRIBA | `@if complexityLevel === 'expert'` L409 | 🔴 P0 |
| 4 | Doble "¿Qué quieres hacer?": intent bar global + chat en body del Hub | `gali-intent-bar` + chat en modo novato L218-230 | 🟡 P1 |
| 5 | FAB acciones rápidas enterrado (L277-306) — poco protagonista en modo básico | L277-306 | 🟡 P1 |
| 6 | Botón "Ver todas" → debe decir "Señales" + deep link a señal concreta | `navigateToSenales()` L269 | 🟢 P2 |
| 7 | Dashboard tabs no persisten — `showCustomizer` tiene `data-proto-skip` | L418 | 🟡 P1 |
| 8 | Ciclo de negocio UI cortado: Finanzas "bonos activos" truncado; falta flechas entre tarjetas | L452-628 | 🟡 P1 |

---

### 2. Onboarding / Reconfigurar Gali — `gali-goal-onboarding.component.ts`

| # | Problema | Path / señal | Gravedad |
|---|---|---|---|
| 9 | Pregunta `pedidosPerWeek` que Dropi ya sabe — absurdo para usuario con historial | signal `pedidosPerWeek` L74 | 🔴 P0 |
| 10 | Mismo wizard para "Editar objetivo" y "Reconfigurar Gali" — `resetOnboarding()` abre todo el wizard | función `resetOnboarding()` | 🔴 P0 |
| 11 | Step 6 "tu día a día" existe en onboarding pero no queda widget en Hub post-onboarding | Step 6 onboarding, Hub sin widget | 🟡 P1 |
| 12 | Conexiones Meta/Drive: no queda claro cómo se conectan realmente los datos | Step con `connectedSources` | 🟡 P1 |

---

### 3. Agentes — `agentes-page.component.ts` / `.html`

| # | Problema | Path / línea | Gravedad |
|---|---|---|---|
| 13 | `launchAgent()` es mock puro — agente creado NO aparece en el listado | `launchAgent()` L284-286 | 🔴 P0 |
| 14 | Dos CTAs de crear agente: botón header (L57 con `data-proto-skip`) + card "PRÓXIMAMENTE" (L163-167) | L57 + L163-167 | 🔴 P0 |
| 15 | Wizard limitado: rol no es libre, solo 7 skills hardcodeadas, sin reglas ni conexiones ni autopilot | Wizard steps en TS | 🔴 P0 |
| 16 | Umbrales configurables solo en Hub > Decisiones, NO en la ficha del agente | Agentes detail panel | 🔴 P0 |
| 17 | Autopilot aparece en mode-bar, chat lateral Y skills — nadie sabe cómo activarlo | Múltiples ubicaciones | 🟡 P1 |
| 18 | "Agregar skill" a agente existente navega a skills page genérica — sin flujo de asignación directa | CTAs de agente con `data-proto-skip` L198 | 🟡 P1 |

---

### 4. Skills / Reglas — `skills-comunidad-page.component.html`

| # | Problema | Path / sección | Gravedad |
|---|---|---|---|
| 19 | Skills tienen trigger/condición/acción → eso es del AGENTE, no de la skill | Descripción "Receta automatizable…" en agentes-page L83-88 también | 🔴 P0 estratégico |
| 20 | No se muestra en qué agente(s) está cada skill; no hay botón para asignar a otro agente | Detalle skill, right panel | 🔴 P0 |
| 21 | Diagrama "Gali orquesta" saturado y confuso — Cata pide rediseño radical | L20-71 skills HTML | 🔴 P0 |
| 22 | Marketplace de skills DENTRO de la página de skills = marketplace dentro de marketplace | Tabs marketplace en skills-page | 🟡 P1 |
| 23 | Reglas: solo activo/desactivo — sin editor libre ni "Gali, ayúdame a crear esta regla" | Reglas section | 🟡 P1 |
| 24 | Reglas activas sin indicar en qué agente están | Reglas list | 🟡 P1 |
| 25 | Tipografías en skills y marketplace distintas al resto del prototipo (rompe DS) | skills-comunidad-page.scss | 🟢 P2 |

---

### 5. Proyectos — `nuevo-proyecto-page.component.html` / `proyecto-detalle-page.component.html`

| # | Problema | Path | Gravedad |
|---|---|---|---|
| 26 | Búsqueda de producto plana — versiones anteriores tenían búsqueda IA interactiva por características | nuevo-proyecto step búsqueda | 🟡 P1 |
| 27 | Presupuesto diario sin recomendación de Gali — dropshipper no sabe cuánto poner | Step configurar campaña | 🟡 P1 |
| 28 | Falta calculadora costo+flete → precio de venta recomendado (existía antes) | Step precio de venta | 🟡 P1 |
| 29 | "Skills que se activarán" = solo 2 skills hardcodeadas — deberían ser AGENTES asignados | Step launch, skills section | 🟡 P1 |
| 30 | Lanzar proyecto no da confirmación / borrador sin feedback de "guardado" | `launchProject()` / save draft | 🔴 P0 |
| 31 | Todos los proyectos mock en fase campaña/ROAS — falta variedad: recién lanzado, pausado, campaña fallida | `mocks/gali-v5/projects.json` | 🟡 P1 |
| 32 | Señales del proyecto → navegan al Hub genérico, no a `?signalId=` específico | Links en proyecto-detalle | 🟡 P1 |
| 33 | "Crear skill automática" sin contexto — no se entiende qué skill ni qué problema resuelve | proyecto-detalle alertas | 🟢 P2 |
| 34 | "Loops" confuso — Cata quiere ver acciones por agente con timeline | proyecto-detalle acciones | 🟢 P2 |

---

### 6. Saturación de alertas — patrón transversal (todas las páginas)

| # | Problema | Alcance | Gravedad |
|---|---|---|---|
| 35 | Vigilante banner + insight Gali + panel "¿Qué quieres hacer?" + agente por sección = saturación visual | home, dashboard, pedidos, marketing, wallet, proyecto-detalle | 🔴 P0 |
| 36 | PIL, "Ferrín completado", "huella vigilante", diagnóstico cruzado — sin explicación para principiante | dashboard, wallet, financiero | 🔴 P0 |
| 37 | Botón "Ver señales Gali" → Cata quiere "Ver qué hizo Gali" con antes/después concreto | Múltiples módulos | 🟡 P1 |
| 38 | Scroll con mouse no funciona en sección diagnóstico cruzado | home.component diagnóstico | 🟡 P1 |

---

### 7. Mi negocio / Dashboard / Otros módulos

| # | Problema | Módulo | Gravedad |
|---|---|---|---|
| 39 | Metas de la semana no visibles en ningún lugar del prototipo | Hub, mi-negocio, dashboard | 🟡 P1 |
| 40 | Grafo de negocio muy limitado — quiere tipo Obsidian, interactivo, con conexiones proyecto/campaña/pedido | micromundo-page | 🟢 P2 |
| 41 | Marketplace solo de skills — quiere marketplace de agentes, reglas, plugins MCP, APIs externas | marketplace-page | 🟢 P2 |
| 42 | Señales: botones "Lanzar / Medir / Operar" en header del módulo no llevan a nada | senales-page header | 🟡 P1 |
| 43 | Transportadora por ciudad debería estar en módulo Transportadoras, no en Torre Logística | torre-logistica / transportadoras | 🟢 P2 |
| 44 | Chat Gali = un solo chat acumulado — quiere múltiples threads por agente/proyecto/tema (como Cursor) | gali-right-panel | 🟢 P2 |

---

## Fase 1 — Quick wins del Hub (P0s que Cata ve en los primeros 60 segundos)

**Archivo principal**: `src/app/pages/gali-v5/home/home.component.html` + `.ts` + `gali-workspace-mode-bar.component.ts`

**Items a resolver**: #1, #2, #3, #4, #5, #6, #8, #35, #36

### Prompt 1A — Reordenar Hub y objetivo editable

```
Implementa cambios en el Hub de Gali V5 (home.component.html + home.component.ts):

1. Objetivo editable inline: en el goal strip (L61-67) el texto del objetivo debe ser clickeable y abrir un modal de 1 paso ("Editar objetivo") — NO el wizard completo de reconfiguración. El modal tiene: campo de texto pre-relleno con el objetivo actual, botón Guardar que actualiza el signal y cierra el modal.

2. Reordenar zonas en modo experto: el bloque Ciclo de Negocio (@if complexityLevel === 'expert', L409+) debe renderizarse ANTES del bloque de Decisiones + Señales (L237+). Invertir el orden en el template.

3. Mover toggle básico/experto: eliminar el toggle de L246-261 (Zona 1) y añadirlo en gali-workspace-mode-bar.component.html, al lado del progress bar del objetivo.

4. FAB acciones rápidas (L277-306): en modo básico, mover el FAB al header del Hub (visible sin scroll). En modo experto puede quedarse donde está.

5. Fix UI ciclo de negocio (L452-628): las tarjetas del ciclo no deben truncar contenido. Ajustar el CSS para que "Finanzas — bonos activos" no se corte. Añadir flechas conectoras entre las 6 tarjetas del ciclo (Producto→Marketing→Pedidos→Logística→Finanzas→Reportes).

CA: ng build sin errores. En modo básico el FAB es visible sin scroll. En modo experto el Ciclo aparece arriba y Decisiones abajo. Clic en objetivo abre modal edición. El toggle está en la barra de modos.
```

### Prompt 1B — Quitar doble chat y fix copy

```
Cambios en home.component.html (Gali V5):

1. Quitar doble chat: el intent bar de Gali ("¿Qué quieres hacer hoy?") aparece dos veces — en el shell global y en el cuerpo del Hub en modo novato (L218-230). Eliminar el que está en el cuerpo del Hub; dejar solo el panel lateral / intent bar del shell.

2. Copy "Ver todas" → "Señales": en L269, cambiar el texto del botón a "Señales →". La navegación ya existe (`navigateToSenales()`), no cambiar la lógica.

3. Tooltips de términos técnicos: en el hub, donde aparezcan los términos PIL, ROAS, y "diagnóstico cruzado", añadir un ícono (ⓘ) con tooltip que explique en 1 línea qué significa para un dropshipper principiante. Ejemplos:
   - PIL → "Porcentaje de Inventario Liquidable: cuánto de tu stock no está vendiendo"
   - ROAS → "Retorno sobre inversión en pauta: por cada $1 en anuncios, cuántos $ en ventas"
   - Diagnóstico cruzado → "Comparación automática entre tus proyectos para detectar patrones"

4. Fix scroll mouse: en la sección diagnóstico cruzado del Hub, verificar que overflow-y: auto esté en el contenedor correcto para que el scroll con mouse funcione.

CA: ng build sin errores. No aparecen dos barras de chat. Botón dice "Señales →". Los íconos ⓘ muestran tooltip al hover.
```

### Prompt 1C — Sistema de alertas (1 primaria por pantalla)

```
Crear Spec nuevo: sistema de alertas unificado. Aplicar en home, dashboard, pedidos, proyecto-detalle, wallet-page.

Regla: máximo 1 banner de alerta PRIMARIA por vista. Las alertas secundarias van al inbox de señales con badge en el header.

Implementación mínima viable:
1. En home.component.html: si hay banner Vigilante Y insight Gali activos al mismo tiempo, mostrar solo el de mayor prioridad (crítico > recomendación > informativo). El otro se convierte en una señal en el inbox.
2. En cada página afectada: el panel "¿Qué quieres hacer hoy?" que flota debe suprimirse si ya hay un banner primario activo.
3. Botón "Ver señales Gali" → cambiar copy a "Ver qué hizo Gali" en los lugares donde Gali ejecutó una acción automática. Añadir junto al botón un micro-resumen de 1 línea del antes/después (ej: "Pausó campaña · CTR era 0.8%, umbral 1.2%").

CA: ng build sin errores. En home, el usuario ve máximo 1 banner de alerta. El botón "Ver qué hizo Gali" tiene resumen inline visible.
```

---

## Fase 2 — Modelo mental: Agentes + Skills + Ontología

**Archivos**: `agentes-page.component.ts/html`, `skills-comunidad-page.component.html/ts/scss`

**Items a resolver**: #13, #14, #15, #16, #17, #18, #19, #20, #21, #22, #23, #24, #25

### Prompt 2A — Crear agente que persiste + eliminar duplicados

```
Completar flujo "Crear agente" en agentes-page.component.ts / .html:

1. Función launchAgent() (L284-286): al confirmar la creación, el nuevo agente debe añadirse a la lista de agentes existentes en el componente (array `agentes` o signal equivalente). Usar mock local — no hace falta API real. El agente nuevo debe aparecer en el grid/lista sin recargar la página.

2. Eliminar CTA duplicada: quitar la card "Crear mi agente — PRÓXIMAMENTE" (L163-167). Solo debe existir el botón "Crear agente" en el header. Quitar también el `data-proto-skip` del botón header (L57) para que abra el wizard.

3. Expandir wizard de creación (5 pasos):
   - Paso 1: Nombre + Rol. El campo Rol debe ser INPUT LIBRE (no dropdown limitado), con sugerencias debajo que el usuario puede ignorar.
   - Paso 2: Skills — lista con detalle expandible por skill (descripción + en qué otros agentes está). Búsqueda con @mention.
   - Paso 3: Reglas — editor libre (textarea) + opción "Gali, ayúdame a crear esta regla" (botón que pre-rellena un ejemplo).
   - Paso 4: Autopilot — toggle para activar/desactivar autopilot para ESTE agente específico, con slider de umbral de autonomía.
   - Paso 5: Confirmar + lanzar.

4. Umbrales en ficha de agente: en el panel de detalle de cada agente (columna derecha), añadir una sección "Umbrales" con los mismos controles que existen en Hub > Decisiones Pendientes. No duplicar lógica — si es posible usar el mismo componente.

CA: ng build sin errores. Al crear un agente, aparece en la lista. No hay card "próximamente". El wizard tiene 5 pasos con rol libre, regla editable, y autopilot por agente.
```

### Prompt 2B — Redefinir Skills (ontología) + diagrama + asignación a agentes

```
Refactorizar la sección Skills en skills-comunidad-page.component.html/ts/scss:

ONTOLOGÍA (aplicar en todos los textos y UI):
- Skill = capacidad reutilizable. NO necesita trigger/condición/acción. Piénsala como un plugin que el agente puede usar.
- Agente = ejecutor con reglas, umbrales, conexiones, autopilot. El agente SÍ tiene trigger/condición/acción.
- Regla = restricción o prompt que se asigna a un agente.

Cambios específicos:
1. En la descripción de cada skill, eliminar el campo "trigger / condición / acción". Reemplazar con: "Qué hace esta skill" (descripción libre) + "Qué agentes la usan" (badges con nombres de agentes).

2. En el detalle de cada skill: añadir sección "Agentes que usan esta skill" con chips clickeables (nombre del agente). Agregar botón "+ Asignar a otro agente" que abre un dropdown con los agentes disponibles.

3. Rediseñar el diagrama "Gali orquesta" (L20-71 del HTML actual): reemplazarlo por un layout tipo grid limpio — Gali en el centro, cada agente en una card a su alrededor, y dentro de cada card sus 2-3 skills principales como chips. Sin SVG tipo árbol. Más espacio, menos líneas, más legible.

4. Reglas: en la sección de reglas, añadir a cada regla un campo visible "Agente asignado" (badge). Añadir botón "Nueva regla" que abre un editor libre (textarea) con placeholder "Describe la regla en lenguaje natural..." y botón "Gali, ayúdame a mejorarla" (solo visual, no necesita backend).

5. Marketplace: moverlo a su propia tab o sección separada dentro de skills-page, con el título "Marketplace" claramente distinto del listado de "Mis skills". No anidado dentro de las skills existentes.

6. Tipografías: verificar que skills-comunidad-page.scss use las mismas variables DS que el resto del prototipo ($font-primary: Inter, $font-menu: IBM Plex Sans). Eliminar cualquier font-family hardcodeada.

CA: ng build sin errores. Las skills no muestran trigger/condición/acción. Cada skill muestra los agentes que la usan. El diagrama es un grid legible. Las tipografías coinciden con el resto del prototipo.
```

### Prompt 2C — Autopilot consolidado en ficha de agente

```
Consolidar la configuración de Autopilot en agentes-page:

El autopilot actualmente aparece en 3 lugares distintos (mode-bar, chat lateral, skills). Cata no entiende cómo activarlo.

1. En la ficha de detalle de cada agente (columna derecha), añadir una sección "Autopilot" con:
   - Toggle ON/OFF "Modo autónomo"
   - Slider "Umbral de autonomía" (0-100%) con descripción: "Por debajo de este umbral de confianza, el agente te pide aprobación"
   - Texto de estado: "Activo · 12 acciones ejecutadas esta semana" o "Pausado · esperando aprobación"

2. En el mode-bar (gali-workspace-mode-bar.component): el botón Autopilot existente debe simplificarse a un indicador de estado — si algún agente tiene autopilot activo, muestra el badge "● EN VIVO". El toggle ya NO activa/desactiva desde aquí — solo navega a la ficha del agente correspondiente.

3. En skills y el chat lateral: eliminar cualquier referencia a configurar autopilot desde allí.

CA: ng build sin errores. El autopilot se configura por agente en su ficha. El mode-bar muestra estado pero no configura.
```

---

## Fase 3 — Flujos completos: Proyectos + Onboarding + Metas

**Archivos**: `gali-goal-onboarding.component.ts`, `nuevo-proyecto-page.component.html`, `proyecto-detalle-page.component.html`, `mocks/gali-v5/projects.json`

**Items a resolver**: #9, #10, #11, #26, #27, #28, #29, #30, #31, #32, #39

### Prompt 3A — Onboarding inteligente + separar "Editar objetivo"

```
Cambios en gali-goal-onboarding.component.ts y home.component.ts:

1. No preguntar pedidos que Dropi ya sabe: en el onboarding, el paso con `pedidosPerWeek` (signal L74) debe pre-rellenarse automáticamente desde `mocks/gali-v5/kpis-global.json`. Si el usuario tiene datos, el campo aparece pre-relleno y es editable (no vacío). Si es usuario nuevo sin datos, saltar ese paso y mostrar path "primer producto".

2. Separar "Editar objetivo" de "Reconfigurar Gali":
   - "Editar objetivo": modal de 1 solo paso. Campo de texto con el objetivo actual, botón Guardar. Se abre desde el goal strip del Hub (ya implementado en Fase 1).
   - "Reconfigurar Gali" (ya existe como wizard): mantenerlo para cuando el usuario quiere cambiar perfil completo. Cambiar el label del botón en el Hub a "Reconfigurar Gali desde cero" para dejarlo claro.

3. Widget "Tu plan esta semana": después de terminar el onboarding, el Hub debe mostrar en la Zona 3 un widget con las 3 acciones del paso "tu día a día" del onboarding. El widget es colapsable y tiene un botón "Editar plan".

CA: ng build sin errores. En el onboarding el campo pedidos está pre-relleno. El modal "Editar objetivo" tiene 1 paso. El Hub muestra el widget "Tu plan esta semana" post-onboarding.
```

### Prompt 3B — Flujo de proyectos mejorado + calculadora + estados mock

```
Cambios en nuevo-proyecto-page.component.html y mocks/gali-v5/projects.json:

1. Calculadora costo → precio de venta (agregar en el step de "Brújula de precio"):
   - Inputs: Costo del producto + Costo flete
   - Output automático: Precio de venta sugerido = (costo_total × 2.5) como base, con nota "Ajusta según tu margen objetivo"
   - Mostrar margen proyectado en tiempo real mientras el usuario ajusta el precio.

2. Presupuesto diario con recomendación de Gali: en el step de presupuesto, añadir un badge "Gali recomienda: $25.000/día" basado en el ROAS del proyecto. Junto al input, texto: "Para alcanzar tu objetivo de X pedidos esta semana". El usuario puede ajustarlo libremente.

3. Agentes en lugar de skills: en el step de "Skills que se activarán", renombrar la sección a "Agentes que trabajarán en este proyecto". Mostrar los 5 agentes (Roax, Vigilante, Chatea Pro, ADA Spy, Kronos) con toggle para activar/desactivar cada uno en el proyecto. Eliminar las 2 skills hardcodeadas.

4. Confirmación al lanzar: al hacer clic en "Lanzar proyecto", mostrar un modal de confirmación (2 segundos de animación de "Gali está configurando tu proyecto..." + mensaje de éxito). Al guardar en borrador, mostrar toast "Borrador guardado — puedes continuar más tarde".

5. Diversificar estados en projects.json: añadir al menos 3 proyectos nuevos con estados distintos:
   - uno en estado "recien_lanzado" (< 48h, sin datos de ROAS aún)
   - uno en estado "campaña_fallida" (ROAS < 1, pausado, con recomendación de Gali)
   - uno en estado "borrador" (incompleto, sin campaña)

CA: ng build sin errores. La calculadora muestra precio sugerido en tiempo real. El presupuesto tiene recomendación de Gali. El step de lanzamiento muestra agentes. Al lanzar aparece modal de éxito. El listado de proyectos muestra los 3 nuevos estados.
```

### Prompt 3C — Deep links señales + metas visibles

```
Cambios en proyecto-detalle-page.component.html y home.component.html:

1. Deep links en señales del proyecto: en proyecto-detalle, cada alerta o señal que diga "Ver señales Gali" debe navegar a `/gali-v5/senales?signalId=ID_SEÑAL&projectId=ID_PROYECTO`. El signalId debe corresponder a una señal real del mock senales.mock.ts.

2. Acciones por agente (reemplazar "Loops"): en proyecto-detalle, renombrar la sección "Loops" a "Acciones del proyecto". Mostrar un timeline vertical de las acciones recientes con: nombre del agente que la ejecutó, descripción corta de la acción, fecha/hora, resultado (éxito/pendiente/fallido).

3. Metas de la semana visibles: añadir en home.component.html (Zona 3 o Zona 1 en modo experto) un bloque "Mis metas esta semana" con:
   - Meta principal (del objetivo del onboarding): "Automatizar operación en <2 horas"
   - KPI tracking: "Pedidos: 38/50 esta semana · 76%"
   - Estado: en camino / en riesgo / cumplida
   El bloque debe ser clickeable para editar el objetivo (mismo modal de Fase 1).

CA: ng build sin errores. Las señales del proyecto tienen deep link con ?signalId. La sección "Loops" dice "Acciones del proyecto" con timeline. El Hub muestra el bloque de metas con progreso.
```

---

## Fase 4 — Detalles y módulos secundarios (P2 — para después)

Estos ítems son importantes pero no bloquean el demo:

| # | Acción | Archivo | Notas |
|---|---|---|---|
| 40 | Grafo de negocio tipo Obsidian | `micromundo-page.component` | Requiere lib de grafos (D3 o ngx-graph) |
| 41 | Marketplace de agentes/reglas/MCP | `marketplace-page` | Nuevo spec — Marketplace expandido |
| 42 | Botones "Lanzar/Medir/Operar" en señales | `senales-page.component.html` | Definir destinos en `navigation-map.json` |
| 43 | Transportadora por ciudad → módulo Transportadoras | transportadoras-page | Mover UI, no duplicar |
| 44 | Multi-chat por agente/proyecto | `gali-right-panel.component` | Nuevo spec — Workspace conversacional |

---

## Orden de ejecución recomendado

```
Prompt 1A (Hub reorder + objetivo editable)
    → ng build ✅
Prompt 1B (quitar doble chat + copy PIL/ROAS)
    → ng build ✅
Prompt 1C (sistema alertas 1 primaria)
    → ng build ✅
Prompt 2A (crear agente persiste + wizard 5 pasos)
    → ng build ✅
Prompt 2B (ontología skills + diagrama + asignación)
    → ng build ✅
Prompt 2C (autopilot por agente)
    → ng build ✅
Prompt 3A (onboarding inteligente)
    → ng build ✅
Prompt 3B (proyectos: calculadora + agentes + estados)
    → ng build ✅
Prompt 3C (deep links + metas visibles)
    → ng build ✅
```

**Regla**: cada prompt debe compilar antes de pasar al siguiente. No mezclar prompts.

---

## Specs pendientes de crear (Fase 5 — largo plazo)

| Spec nuevo | Qué cubre |
|---|---|
| **Spec 8 — ObjetivosMetas** | Metas visibles, editar objetivo vs reconfigurar |
| **Spec 9 — DashboardPersonalizable** | Tabs que persisten, widgets arrastrables |
| **Spec 10 — CrearAgente** | Wizard completo con persistencia |
| **Spec 11 — OntologiaAgentes** | Definiciones vinculantes: agente vs skill vs regla |
| **Spec 12 — WorkspaceChat** | Multi-thread por agente/proyecto/tema |
| **Spec 13 — BrujulaProyecto** | Calculadora costo→precio, recomendación presupuesto |
| **Spec 14 — AlertasUnificadas** | 1 primaria por pantalla, glosario inline |
| **Spec 15 — ConexionesMCP** | Marketplace de agentes, reglas, plugins, APIs externas |
 
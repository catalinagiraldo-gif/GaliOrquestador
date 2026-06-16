# Ultimate Plan — Gali 6 "La Casita" · Versión Definitiva

> **Fecha:** 2026-06-15 · **Actualizado:** 2026-06-15 · **Autor:** Análisis profundo de todo el repositorio  
> **Fuentes:** `docs/Conocimientos/` · `docs/Descubrimientos/` · `src/app/pages/gali-v5/` · `src/app/pages/gali-v5-v2/` · `mocks/gali-v5/` · specs 3–17  
> **Principio rector:** *Gali no es un dashboard. Es el Director de E-commerce que el dropshipper nunca pudo pagar. La versión ultimate se siente como "mi primer empleado que ya lo sabe todo", no como "otro CRM con IA encima".*
>
> **Decisión de arquitectura (Jun 15):** La versión ultimate se construye como **Gali 6** — una carpeta nueva `src/app/pages/gali-6/`, ruta `/gali-6`, con identidad propia y limpia. Todo el trabajo anterior de `gali-v5/` y `gali-v5-v2/` se **agrupa bajo una carpeta `gali-5/`** que permanece accesible en `/gali-5` como archivo navegable desde la galería. Nada se elimina — se reorganiza.

---

## Índice

0. [Decisión: de v5-v2 a Gali 6 — por qué y cómo](#0-decisión-de-v5-v2-a-gali-6--por-qué-y-cómo)
1. [Estado actual del repositorio](#1-estado-actual-del-repositorio)
2. [Reglas de oro — non-negotiable](#2-reglas-de-oro--non-negotiable)
3. [Anti-patrones confirmados](#3-anti-patrones-confirmados)
4. [Lo mejor de cada prototipo](#4-lo-mejor-de-cada-prototipo)
5. [Arquitectura de componentes definitiva](#5-arquitectura-de-componentes-definitiva)
6. [Flujo de UX definitivo](#6-flujo-de-ux-definitivo)
7. [Dirección visual](#7-dirección-visual)
8. [Decisiones técnicas](#8-decisiones-técnicas)
9. [Features priorizados](#9-features-priorizados)
10. [Orden de implementación](#10-orden-de-implementación)
11. [Riesgos y decisiones abiertas](#11-riesgos-y-decisiones-abiertas)

---

## 0. Decisión: de v5-v2 a Gali 6 — por qué y cómo

### 0.1 Por qué un Gali 6 limpio en lugar de seguir en v5-v2

`gali-v5-v2` nació como un parche sobre `gali-v5`: heredar todas sus rutas y sobreescribir 5 pantallas. Esa estrategia sirvió para explorar la dirección, pero tiene un techo bajo:

- El shell de v5-v2 arrastra los servicios y el estado de v5 (`GaliStateService`, `GaliWorkspaceService`) — cualquier bug o cambio en v5 puede romper v5-v2 de forma inesperada.
- El acordeón nav de v5-v2 sigue dependiendo de `dropi-sections.config.ts` de v5 remapeado — dos configs para un mismo arbol de navegación es deuda desde el día 1.
- La galería de prototipos ya tiene `gali-v2`, `gali-v3`, `gali-v5`, `gali-v5-v2` — cuatro entradas que confunden a quien revisa el repo. Un `gali-6` limpio comunica "esta es la versión definitiva".
- La identidad de marca merece un salto de número: Gali 6 es el resultado del aprendizaje de todas las versiones anteriores, no una corrección de una corrección.

### 0.2 Qué pasa con gali-v5 y gali-v5-v2

**Se agrupan bajo una carpeta `gali-5/`** — son el archivo de aprendizaje, no la papelera. La reorganización física es:

```
src/app/pages/
  gali-5/               ← NUEVO contenedor (renombrar carpetas existentes)
    gali-v5/            ← gali-v5 actual (sin tocar ningún archivo interno)
    gali-v5-v2/         ← gali-v5-v2 actual (sin tocar ningún archivo interno)
  gali-6/               ← NUEVO — carpeta limpia de Gali 6
```

Las rutas quedan:
- `/gali-5` → acceso al shell de gali-v5 (o galería interna que muestra v5 y v5-v2)
- `/gali-6` → Gali 6 "La Casita" definitiva
- La galería de prototipos (`/prototype-gallery`) sigue mostrando ambos como tarjetas separadas

**Los archivos internos de gali-v5 y gali-v5-v2 no se modifican.** Solo cambia la carpeta contenedora en el filesystem y las rutas en `app.routes.ts`.

### 0.3 Qué toma Gali 6 de las versiones anteriores

Gali 6 **no hereda rutas automáticamente** como hacía v5-v2. En cambio, toma lo mejor de forma selectiva e intencional:

| Qué toma | De dónde | Cómo |
|---|---|---|
| Mocks JSON | `mocks/gali-v5/` | Import directo — los mocks NO se mueven, son compartidos |
| `GaliDecisionTheaterComponent` | `gali-v5/components/` | Import standalone — no depende del shell de v5 |
| `GaliGlosarioDirective` | `gali-v5-v2/directives/` | Copiar/mover a `gali-6/directives/` — es pequeña y sin dependencias |
| Animaciones | `_animations.scss` (global) | Ya es global — disponible sin hacer nada |
| Tokens DS | `_variables.scss` (global) | Ya es global |
| Páginas operativas (Catálogo, Pedidos, etc.) | `gali-v5/pages/` | **No se importan automáticamente** — Gali 6 decide qué pantallas operativas necesita y las enlaza por ruta lazy con `loadComponent` apuntando a los archivos de v5 |

El resultado: Gali 6 tiene su propio shell, su propia nav, sus propios componentes de "La Casita", y llama a los componentes de v5 como lazy-loaded cuando el usuario navega a operación. Sin herencia frágil de config ni servicios compartidos involuntarios.

### 0.4 Estructura de carpeta de Gali 6

```
src/app/pages/gali-6/
  gali-6-shell.component.ts          ← shell propio (no fork de v5)
  gali-6-shell.component.html
  gali-6-shell.component.scss
  gali-6.routes.ts                   ← rutas propias + lazy refs a v5/pages
  gali-6-nav.config.ts               ← config de nav del acordeón (fuente única)
  home/
    hoy-home.component.ts            ← los 4 bloques (evolución de v5-v2)
    hoy-home.component.html
    hoy-home.component.scss
  proyectos/
    proyectos-casa.component.ts
    proyectos-casa.component.html
    proyectos-casa.component.scss
  conexiones/
    conexiones-casa.component.ts
    conexiones-casa.component.html
    conexiones-casa.component.scss
  impacto/
    impacto-ledger.component.ts
    impacto-ledger.component.html
    impacto-ledger.component.scss
  directives/
    gali-glosario.directive.ts       ← copiada de v5-v2, sin dependencias
  models/
    gali-6.models.ts                 ← interfaces TypeScript propias
```

### 0.5 Cambios en `app.routes.ts` y galería

```ts
// app.routes.ts — entradas a agregar/modificar
{
  path: 'gali-5',
  loadComponent: () => import('./pages/gali-5/gali-v5/gali-v5-shell.component')
    .then(m => m.GaliV5ShellComponent),
  children: GALI_V5_CHILD_ROUTES,
},
// La ruta /gali-v5 puede mantenerse como alias o eliminarse de la galería visible
{
  path: 'gali-6',
  loadComponent: () => import('./pages/gali-6/gali-6-shell.component')
    .then(m => m.Gali6ShellComponent),
  children: GALI_6_CHILD_ROUTES,
},
```

En la galería de prototipos (`prototype-gallery`):
- Tarjeta **"Gali 5"** → `/gali-5` — "Archivo de desarrollo: Gali V5 + V5v2"
- Tarjeta **"Gali 6"** → `/gali-6` — "La Casita · Versión definitiva" (tarjeta principal destacada)

---

## 1. Estado actual del repositorio

### 1.1 Mapa de prototipos

| Prototipo | Ruta actual | Ruta futura | Stack | Estado |
|---|---|---|---|---|
| `gali-v2` | `/gali-v2/*` | sin cambio | Angular standalone | Archivado — referencia histórica |
| `gali-v3` | `/gali-v3/*` | sin cambio | Angular standalone | Archivado — referencia histórica |
| `gali-dashboard` | `/gali-dashboard/*` | sin cambio | Angular standalone | Archivado |
| `gali-v5` | `/gali-v5/*` | **`/gali-5`** (alias) | Angular 17 + signals + PrimeNG | **ARCHIVO ACTIVO — 38 rutas** |
| `gali-v5-v2` | `/gali-v5-v2/*` | accesible desde `/gali-5` o galería | Same stack | **ARCHIVO — 5 pantallas casita v1** |
| `gali-6` | *(no existe aún)* | **`/gali-6`** | Angular 17 + signals | **A CONSTRUIR — La Casita definitiva** |

**Reorganización física de carpetas:**
```
src/app/pages/
  [antes]                     [después]
  gali-v5/          →         gali-5/gali-v5/   (sin tocar archivos internos)
  gali-v5-v2/       →         gali-5/gali-v5-v2/ (sin tocar archivos internos)
  [nuevo]                     gali-6/            (carpeta limpia de Gali 6)
```

### 1.2 Qué hay hecho en gali-v5-v2 (capital a reusar en Gali 6)

El trabajo de `gali-v5-v2` no se bota — es el prototipo de validación de "La Casita". Gali 6 toma sus pantallas como punto de partida y las reescribe con shell propio.

```
/gali-v5-v2  (pasa a /gali-5 como archivo)
  ├── shell        GaliV5V2ShellComponent ← sirve de referencia, no se forkea
  ├── home/        HoyHomeComponent — 4 bloques ← punto de partida de gali-6/home/
  ├── proyectos/   ProyectosCasaComponent ← punto de partida de gali-6/proyectos/
  ├── conexiones/  ConexionesCasaComponent ← punto de partida de gali-6/conexiones/
  ├── impacto/     ImpactoLedgerComponent ← punto de partida de gali-6/impacto/
  ├── centro-control/ CentroControlComponent ← referencia para gali-6
  └── directives/  GaliGlosarioDirective ← se copia a gali-6/directives/
```

**Gali 6 NO hereda rutas automáticamente.** Toma los archivos `.ts`/`.html`/`.scss` de las 5 pantallas de v5-v2 como base, los adapta con el nuevo shell, y enlaza las páginas operativas de gali-v5 como lazy routes apuntando a sus archivos originales.

**Mocks existentes (fuente única):**
`projects.json` · `kpis-global.json` · `impact-ledger.json` · `senales.mock.ts` · `wallet-transactions.json` · `marketing-campanas.json` · `orders.json` · y 14 más.

### 1.3 Carpeta de Conocimientos — síntesis

Los documentos en `docs/Conocimientos/` establecen:

- **El dropshipper 2026 es un arquitecto de sistemas**, no un vendedor manual. Gali debe actuar como el orquestador que delega trabajo repetitivo a agentes especializados.
- **Valor real de Dropi con IA**: cruzar data global de la red Dropi (tendencias LATAM, comportamiento de transportadoras, tasas de novedad por ciudad) con la data específica del usuario para dar estrategias hiperpersonalizadas que nadie más puede dar.
- **Fase 1 consensuada** (reunión 12 jun, `correccionescata12jun.md`): Objetivo → Proyectos → Conexiones → Señales. No el universo entero. La casita primero.
- **El dolor #1 del dropshipper**: no saber qué hacer en Dropi. Gali es el mentor que le dice qué hacer y por qué — en lenguaje simple, no en jerga de finanzas.
- **Cinco conexiones vitales**: Meta, TikTok, Shopify, Google Drive, Chatea Pro. Estas son las que dan contexto a Gali para operar.

---

## 2. Reglas de oro — non-negotiable

Estas reglas emergen de la confluencia de `CLAUDE.md`, specs 1–17, y los descubrimientos documentados. **Violarlas es retroceder.**

| # | Regla | Fuente | Por qué es no-negociable |
|---|---|---|---|
| 1 | Color primario = naranja `#f49a3d` ($primary-500). Nunca azul, nunca verde en CTAs. | DS Registry + CLAUDE.md | Identidad visual de Dropi |
| 2 | Tipografía: Inter (cuerpo), IBM Plex Sans (menú). Nunca otra. | DS Registry | Cohesión con el DS real |
| 3 | **ALS-4**: cero literales financieros en TS. Todo viene de mocks JSON. | DesADIGali5.md §3 + Spec 17 §4 | ROAS 2.9x vs 1.93x en 4 strings distintos destruyó la confianza en v5 |
| 4 | **ROAS real canónico = 1.93x** (Collar GPS). ROAS Meta declarado = 2.9x como sublabel gris. | DesADIGali5.md §2 + CorrecionesGali5.md Mejora 1 | Dato inconsistente = agente indigno de confianza |
| 5 | **Chrome policy ≤2 capas** antes del contenido. | AuditoriaUI11jun.md | Más de 2 capas = banner blindness confirmado |
| 6 | `/gali-v5` intacto. Nunca tocar rutas o archivos de la versión anterior. | Spec 17 §8 | Parallel build — no destructivo |
| 7 | **Menos es más = progresiva, NO amputación**. El toggle básico/experto controla densidad, no elimina secciones. | feedback_v2_no_eliminar.md | La corrección explícita del 12 jun: rescatar Mi Negocio, ciclo, salud, agentes |
| 8 | Submenús completos de Operación preservados (Productos, Pedidos, Logística, Reportes, Financiero, Marketing, CAS). | Spec 17 §2 | "Estaban por algo" — Cata 12 jun |
| 9 | Íconos de dominio: `<img>` SVG 20×20px. Nunca `<i class="pi-*">` en contexto de dominio. | CLAUDE.md | Consustancial con el DS |
| 10 | Badges de periodo (Semanal/Mensual) en todo KPI. Nunca mezclar escalas temporales sin etiqueta. | DesADIGali5.md §5 | $1.82M semanal vs $14.82M mensual sin etiqueta generó confusión severa |
| 11 | Modo calma cuando no hay decisión pendiente. No forzar urgencia artificial. | Spec 17 §3.1 CA-3.1 | Un orquestador en paz es señal de salud, no de inactividad |
| 12 | `galiGlosario` en todos los términos técnicos (ROAS, PIL, P&L, CPA, novedad, huella). | Spec 16 + Spec 17 §3.6 | La consultoría de alto nivel prometida se rompe si el usuario no entiende los términos |

---

## 3. Anti-patrones confirmados

Cada anti-patrón tiene un descubrimiento documentado que lo respalda. La versión ultimate los evita explícitamente.

### 3.1 Datos

| Anti-patrón | Prototipo donde ocurrió | Evidencia | Solución en ultimate |
|---|---|---|---|
| ROAS hardcodeado en múltiples strings con valores distintos | gali-v5 `home.component.ts` `nodeDetailMap` | DesADIGali5.md §1–2: ROAS real aparece como 1.93x, 2.9x, 4.78x en distintas vistas | ALS-4 estricto: todo desde `projects.json`; ROAS real = campo `roas_real`, nunca texto literal |
| Escalas temporales mezcladas sin etiqueta | gali-v5 dashboard-financiero | `$1.82M revenue semanal` vs `$14.82M mensual` en el mismo contexto | Badge de periodo obligatorio en todo KPI financiero |
| Campo `pauta_diaria` de Meta Ads en página de SMS/Email | gali-v5 `campanas-page` | DesADIGali5.md #7: "$66k/día pauta" en página de Chatea Pro | Cada dato tiene un dueño semántico explícito en el mock |
| `nodeDetailMap` duplicando campos de projects.json | gali-v5 `home.ts` | DesADIGali5.md §3 | Eliminar nodeDetailMap — leer directamente del proyecto líder |

### 3.2 Chrome / navegación

| Anti-patrón | Evidencia | Solución en ultimate |
|---|---|---|
| 4–5 capas de chrome apiladas (mode-bar + context-strip + intent-bar + gali-bar + titulos) | InventarioAuditoriaGaliV5-v2.md §1.2: `/gali-v5/financiero/historial-de-cartera` tenía 4–5 capas | Shell de la casita: máximo mode-bar (toggle básico/experto) + 1 barra funcional de la vista |
| Botones de modo (Señales/Lanzar/Medir) con `data-proto-skip` — no hacen nada | CorrecionesGali5.md §2, DesADIGali5.md §2 | En la casita los modos son rutas reales o tabs navegables; si no están listos, no existen en la UI |
| Doble punto de entrada al chat de Gali (intent bar superior + "Hablar con Gali" en hub) | CorrecionesGali5.md §4 | Un solo punto de entrada: el FAB naranja o la barra superior. Nunca los dos a la vez |
| Arquitectura técnica (Agentes/Skills/Reglas/Marketplace) en navegación de primer nivel | CorrecionesGali5.md §3.4 | Centro de Control como ítem secundario (modo experto) — no visible en modo básico |

### 3.3 UX / propuesta de valor

| Anti-patrón | Evidencia | Solución en ultimate |
|---|---|---|
| Gali invisible — nada diferencia a Gali de un Excel con métricas | CorrecionesGali5.md BLOQUE 2 §1 | `ImpactoLedgerComponent` + widget "Gali hizo por ti" en el home: N acciones, $X ahorrados, Nh libres |
| Señales solo reactivas — ningún ejemplo de señal predictiva | CorrecionesGali5.md §2 | Separación 🔮 predictivas / 🚨 reactivas ya definida en `senales.mock.ts`; la palanca de Hoy = la señal predictiva top |
| Onboarding que asume usuario con operación madura (47 pedidos/sem, ROAS 2.9x) | CorrecionesGali5.md §3.1 | ZeroState con 3 preguntas → workspace mínimo; si `hasOrders` (Dropi ya lo sabe), se saltan preguntas redundantes |
| 83+ botones `data-proto-skip` visibles al usuario | DesADIGali5.md §6.2 | La versión ultimate no incluye un CTA si no tiene comportamiento. Si no está listo, no aparece o aparece con badge "Próximamente" solo si es un ítem de roadmap secundario |
| "Próximamente — diseña tu propio flujo" con mismo peso visual que agentes activos | DesADIGali5.md §6.1 | Crear agente vive en Centro de Control experto; badge diferenciado visualmente |
| Tabs "Producto/Estrategia/Campañas/Pedidos" en proyecto detalle vacíos | DesADIGali5.md §6.3 | En la casita, ProyectosCasaComponent solo muestra datos que existen en projects.json; no tabs vacíos |
| Score de salud 78/100 huérfano — sin explicación ni acción | CorrecionesGali5.md #9, AnalisisHeurístico §9 | Score de salud: solo visible en modo experto; cuando aparece, el clic abre panel con 4 métricas + recomendación Gali |
| "Academy" y "Akademy" inconsistentes | CorrecionesGali5.md #15 | Nombre único: **Academy**. Nunca "Akademy" en UI |

---

## 4. Lo mejor de cada prototipo

### gali-v5 — La maquinaria más completa

**✅ Qué funciona y debe preservarse:**
- **Shell con política de chrome**: `pageLevelAgentChromePrefixes` suprime correctamente context-strip + intent-bar en 11 rutas. El patrón es elegante.
- **GaliDecisionTheaterComponent**: el componente de "decisión de hoy" con contexto, riesgo, impacto, 2 opciones y "decidir después" es la mejor pieza de UX del repositorio. Reutilizar al 100%.
- **Agentes como personajes**: Roax, Vigilante, Chatea Pro, ADA Spy, Kronos tienen identidad, lenguaje colombiano auténtico y funciones claras. Esto no se cambia.
- **GaliInsightDirective / GaliGlosarioDirective**: directivas de enriquecimiento semántico elegantes.
- **Animaciones**: `gali-fade-up`, `gali-breathe`, `gali-count-in`, stagger 60–80ms con `prefers-reduced-motion`. Limpias y coherentes.
- **Mock data richness**: `projects.json` con estados variados (en_escala, activo, pausado, lanzando, recien_lanzado, cerrado, borrador); `senales.mock.ts` con señales predictivas y reactivas separadas.
- **NuevoProyectoPageComponent**: flujo completo de creación de proyecto con P&L, calculadora precio-brújula y elección de ángulo de venta.
- **ProyectoDetallePageComponent**: timeline horizontal de fases + skills del proyecto + diagnóstico.
- **WalletPageComponent con Kronos**: la integración de datos financieros con el agente Kronos es el módulo más maduro de la v5.
- **Señales mock**: `MOCK_SENALES` + `MOCK_ALERTAS` en `senales.mock.ts` — la separación predictiva/reactiva ya existe en datos, solo falta en UI.

**❌ Qué está roto:**
- 83+ botones `data-proto-skip` sin comportamiento real.
- ROAS inconsistente en 8+ lugares del mismo código.
- Hub con 7 bloques saturados + tabs "Principal/ouiui" + doble chat.
- Botones Señales/Lanzar/Medir en el mode-bar no navegan.
- Tabs vacíos en ProyectoDetalle (Producto, Estrategia, Campañas, Pedidos).
- `gali-right-panel.component.html` con 968 LOC — monolito sin dividir.

**💎 Aporte exclusivo de gali-v5:**
La **cobertura operativa total**: 36 componentes reales cubriendo productos, pedidos, logística, reportes, financiero, marketing, CAS, academy. Ningún otro prototipo tiene esta profundidad. No se reconstruye — se hereda.

---

### gali-v5-v2 "La Casita" — La arquitectura limpia

**✅ Qué funciona bien:**
- **Estrategia de herencia**: `GALI_V5_CHILD_ROUTES` filtrado con `CASITA_OVERRIDE` — cero duplicación de código.
- **HoyHomeComponent**: 4 bloques exactos (estado, 1 decisión, impacto, 1 palanca). El layout "sala de decisiones" es el UI insignia correcto.
- **GaliGlosarioDirective**: `<span galiGlosario="ROAS">ROAS</span>` → ⓘ tooltip 2 niveles. El ⓘ desaparece tras 3 vistas (localStorage). Muy bien ejecutado.
- **ALS-4 aplicado desde el inicio**: `HoyHomeComponent` ya lee de `kpis-global.json`, `projects.json`, `impact-ledger.json` y `senales.mock.ts`. Cero hardcoding.
- **Accordion nav**: espinazo (Hoy · Mi Negocio · Proyectos · Conexiones) + Operación (submenús completos) + Centro Gali (experto). La información architecture es la correcta.
- **`impact-ledger.json`**: el mock del ledger de acciones de Gali existe y tiene la estructura correcta.
- **CentroControlComponent**: host experto que agrupa Agentes/Skills/Reglas/Marketplace — la arquitectura técnica sale del primer nivel de nav.

**❌ Qué falta:**
- `HoyHomeComponent` tiene un template (`.html`) que aún no se evaluó en profundidad — puede tener brechas de los 4 bloques definitivos.
- `ConexionesCasaComponent` necesita validar que cada card explica qué contexto da a Gali (no solo estado conectado/pendiente).
- `ProyectosCasaComponent` necesita la barra de progreso objetivo editable inline con modal 1-paso.
- Modo básico/experto (toggle) en el shell — controla qué secciones del acordeón son visibles.
- Onboarding de 3 preguntas — ZeroState si `sessionCount === 0`.

**💎 Aporte exclusivo de gali-v5-v2:**
La **diagramación limpia** como filosofía de construcción desde la base, y la **directiva de glosario** como traductor automático de jerga a lenguaje de dropshipper.

---

## 5. Arquitectura de componentes definitiva

### 5.1 Shell de Gali 6 (propio — no fork de v5)

```
Gali6ShellComponent                        src/app/pages/gali-6/gali-6-shell.component.ts
├── [nav] accordion lateral propio
│    ├── ✦ HOY                            → /gali-6
│    ├── ◇ MI NEGOCIO                     → /gali-6/mi-negocio  (lazy → gali-5/gali-v5/pages/micromundo)
│    ├── ◎ PROYECTOS                      → /gali-6/proyectos
│    ├── ⬡ CONEXIONES                     → /gali-6/conexiones
│    ├── [▸ Operación] acordeón — modo básico y experto
│    │    ├── Productos  ▸ Catálogo · Proveedores · Negociaciones · Caza
│    │    ├── Pedidos    ▸ Órdenes · Novedades · Garantías · Etiquetas…
│    │    ├── Logística  ▸ Transportadoras · Torre
│    │    ├── Reportes   ▸ Dashboard · P&L Kronos · Productos · Clientes…
│    │    ├── Financiero ▸ Wallet · Dropicard
│    │    ├── Marketing  ▸ Campañas · Automatización · Chatea Pro · ROAX · Páginas
│    │    └── CAS        ▸ Bandeja · Tickets
│    └── [⚙ Centro de Gali] — solo modo experto
│         ├── Agentes · Skills · Reglas · Marketplace
│         └── Impacto · Academy
├── [header] toggle básico/experto         — signal local, persiste localStorage
├── <router-outlet>
└── [fab] botón flotante naranja           — único punto de entrada al chat de Gali
```

**Fuente de la nav**: `gali-6/gali-6-nav.config.ts` — config propia e independiente de gali-5. Las rutas operativas apuntan a `/gali-6/...` y se enlazan lazy a los componentes de `gali-5/gali-v5/pages/`.

### 5.2 Pantallas propias de Gali 6 (a construir desde cero con base v5-v2)

| Componente | Ruta Gali 6 | Base de partida | Prioridad |
|---|---|---|---|
| `Gali6ShellComponent` | `/gali-6` (wrapper) | Shell nuevo — no fork | **P0** |
| `Gali6HoyHomeComponent` | `/gali-6` | `gali-v5-v2/home/hoy-home` | **P0** |
| `Gali6ProyectosCasaComponent` | `/gali-6/proyectos` | `gali-v5-v2/proyectos/proyectos-casa` | **P0** |
| `Gali6ConexionesCasaComponent` | `/gali-6/conexiones` | `gali-v5-v2/conexiones/conexiones-casa` | **P0** |
| `Gali6ImpactoComponent` | `/gali-6/impacto` | `gali-v5-v2/impacto/impacto-ledger` | P1 |
| `Gali6CentroControlComponent` | `/gali-6/centro-control` | `gali-v5-v2/centro-control/centro-control` | P1 |

### 5.3 Páginas operativas — lazy refs a gali-5 (no reconstruir)

Gali 6 enlaza las páginas operativas de gali-v5 como `loadComponent` lazy. Los archivos físicos permanecen en `gali-5/gali-v5/pages/` — no se duplican.

```ts
// gali-6/gali-6.routes.ts — patrón para páginas operativas
{
  path: 'productos/catalogo',
  loadComponent: () =>
    import('../gali-5/gali-v5/pages/catalog/catalog-page.component')
      .then(m => m.CatalogPageComponent),
},
{
  path: 'proyectos/nuevo',
  loadComponent: () =>
    import('../gali-5/gali-v5/pages/proyectos/nuevo-proyecto-page.component')
      .then(m => m.NuevoProyectoPageComponent),
},
// ... mismo patrón para cada módulo operativo
```

**Páginas operativas a enlazar:**
- `CatalogPageComponent` → `/gali-6/productos/catalogo`
- `OrdersPageComponent` → `/gali-6/mis-pedidos/mis-pedidos`
- `NuevoProyectoPageComponent` → `/gali-6/proyectos/nuevo`
- `ProyectoDetallePageComponent` → `/gali-6/proyecto/:id`
- `SenalesPageComponent` → `/gali-6/senales`
- `WalletPageComponent` → `/gali-6/financiero/historial-de-cartera`
- `CampanasPageComponent` → `/gali-6/marketing/campanas`
- `AgentesPageComponent` → `/gali-6/centro-control/agentes`
- `AkademyPageComponent` → `/gali-6/academy`
- *(resto de módulos operativos según mismo patrón)*

**Servicios compartidos**: `GaliWorkspaceService`, `GaliStateService` son `providedIn: 'root'` — funcionan en Gali 6 sin inyección extra.

### 5.4 Componentes compartidos que Gali 6 importa directamente

| Componente | Importado desde | Uso en Gali 6 |
|---|---|---|
| `GaliDecisionTheaterComponent` | `gali-5/gali-v5/components/` | Bloque 2 del home — la decisión de hoy |
| `GaliGlosarioDirective` | Copiar a `gali-6/directives/` | En todos los términos financieros |
| `GaliImpactWidgetComponent` | `gali-5/gali-v5/components/` | Widget "Gali hizo por ti" en home bloque 3 |
| `gali-count-in` keyframe | `_animations.scss` (global) | Contadores en impacto y KPIs |
| `gali-breathe` animation | `_animations.scss` (global) | Modo calma cuando no hay decisión |
| `DiagnosticoModalComponent` | `gali-5/gali-v5/components/` | Accesible desde ProyectosCasa |

---

## 6. Flujo de UX definitivo

### 6.1 La narrativa que la pantalla debe contar

**Lunes 8am. El dropshipper abre Gali:**

> *"Esta semana tu negocio va bien — ROAS 1.93x real, 70 pedidos. Meta al 70%."*  
> *"Hoy hay una decisión: Coordinadora Bogotá 15% novedad. Cambio inteligente → Servientrega. ¿Lo hago?"*  
> *"Mientras dormías, Gali escaló Video B +$15k/día · ahorró $85.000 en novedades · liberó 3h de gestión."*  
> *"Tu mayor palanca esta semana: ventana en Cali (7 días). Difusor aromaterapia. ¿Creamos el proyecto?"*

Eso es el home de la casita. **4 oraciones. 4 bloques. Nada más.**

### 6.2 Flujo canónico de primera sesión (ZeroState)

```
[Entrada] → Modal 3 preguntas (si sessionCount === 0)
    P1: "¿Cuál es tu meta para los próximos 30 días?" [slider: pedidos/sem]
    P2: "¿Cuál es tu mayor fricción hoy?" [opciones: stock, ads, pedidos, otro]
    P3: "¿Cuál es tu canal principal?" [Meta / TikTok / ambos / ninguno aún]
    → Gali responde: "Para tu meta de X pedidos, te sugiero empezar por estos 2 proyectos..."
    → Workspace mínimo: solo Hoy + Proyectos + Conexiones en nav (modo básico default)
    
[Si hasOrders en Dropi] → Saltar P1 — Gali ya sabe cuántos pedidos tienes
[Si hasActiveProducts] → Saltar P2 de stock — ADA ya tiene datos
```

### 6.3 Flujo de decisión (el loop más importante)

```
Señal reactiva (🚨) en senales.mock.ts
    ↓
Aparece en bloque 2 de HoyHome como GaliDecisionTheater
    ↓ Usuario elige una opción (o "Decidir después")
    ↓
Resultado visible en bloque 3 "Gali hizo por ti" (++acciones en impact-ledger)
    ↓
Toggle de confianza: "La próxima vez, ¿Gali lo hace solo?"
    → Persiste umbral en localStorage → Agente tiene más autonomía → loop de confianza
```

### 6.4 Flujo de proyectos (el espinazo de negocio)

```
ProyectosCasaComponent
    [Objetivo global] editable inline (1-paso modal, no wizard)
    Barra de progreso: {actual}/{meta} pedidos/sem · {pct}%
    ─────────────────────────────────────────
    [Portafolio] cards de proyectos con salud %
        → clic → ProyectoDetallePageComponent (heredado de v5)
    ─────────────────────────────────────────
    [Gali recomienda] 1–2 proyectos para tu objetivo
        justificación: "Tu audiencia en Cali tiene 34% más conversión en bienestar este mes"
        → [Crear proyecto →] → NuevoProyectoPageComponent
```

### 6.5 Edge cases no resueltos en ningún prototipo (con propuesta)

| Edge case | Propuesta para ultimate |
|---|---|
| Usuario sin ningún pedido — todo el hub está vacío | ZeroState activa onboarding de 3 preguntas + workspace mínimo. El primer proyecto recomendado es "Buscar tu primer producto ganador" con ADA Spy como agente. |
| Usuario con stock agotado de proveedor sin aviso | Señal 🚨 de Vigilante: "ADA detectó stock bajo en tu proveedor de Collar GPS (<50 unidades). ¿Pausar campaña automáticamente?" → toggle confianza |
| Dos señales críticas simultáneas | Solo una en bloque 2; la segunda aparece como chip "1 decisión más" con badge 🚨 en el header. Clic → `SenalesPageComponent` |
| Facturación sin Siigo conectado | Card en `ConexionesCasaComponent` con estado URGENTE: "$450k sin facturar · 6 días · [Conectar Siigo →]". No solo un badge de color. |
| Modo experto recién activado — usuario se abruma | El modo experto se activa toggle a toggle, con un micro-onboarding de 1 slide: "Ahora ves Agentes, Skills, Reglas — la maquinaria de Gali. Puedes volver a modo básico cuando quieras." |

---

## 7. Dirección visual

### 7.1 Paleta definitiva

```scss
// Tokens vigentes de _variables.scss — nunca hardcodear
$primary-500:    #f49a3d;   // Naranja — CTAs, highlights Gali (✦), momentos de decisión
$gray-50:        #f7f8fa;   // Fondo base de páginas (no blanco puro)
$white:          #ffffff;   // Cards, modales, paneles
$gray-100:       #f1f3f5;   // Superficies secundarias
$gray-600:       #6c757d;   // Texto secundario, sublabels (ROAS Meta declarado)
$gray-900:       #1a1a2e;   // Texto primario
$success-500:    #22c55e;   // Estado positivo (ROAS bien)
$warning-500:    #f59e0b;   // Alerta media (40-79% objetivo)
$error-500:      #ef4444;   // Alerta crítica (< 40% objetivo, novedad > 15%)
$shadow-medium:  0.5px 4px 8px rgba(0,0,0,0.08);  // Sombra cards
```

**Lo que NO repetir de gali-v5:**
- Fondos `#ffffff` puro en el body — usar `$gray-50`
- Gradientes azules en el Hub — no pertenecen al DS de Dropi
- Sombras agresivas (> 16px blur) que compiten con el contenido

### 7.2 Tipografía

```scss
// Regla estricta — nunca otra fuente
font-family: 'Inter', sans-serif;        // Cuerpo, KPIs, CTAs, labels
font-family: 'IBM Plex Sans', sans-serif; // Solo ítems de menú lateral
```

**Jerarquía de tamaños en la casita:**
- Línea de estado (bloque 1): `font-size: 14px; font-weight: 500` — modesto, no grita
- Nombre del negocio / sparkline label: `font-size: 18px; font-weight: 600`
- Métricas de impacto (contadores): `font-size: 28px; font-weight: 700` — los números de Gali son los protagonistas
- Body / descripciones: `font-size: 14px; font-weight: 400`
- Sub-labels (ROAS Meta declarado): `font-size: 12px; font-weight: 400; color: $gray-600`

### 7.3 El elemento signature — "Inteligencia calmada con profundidad"

El **Modo Calma** es el diferenciador visual. Cuando no hay decisiones pendientes:

```scss
// En HoyHomeComponent — bloque 2 vacío
.modo-calma {
  background: rgba($primary-500, 0.04);  // Tinte naranja muy sutil
  border: 1px solid rgba($primary-500, 0.12);
  border-radius: $radius-md;
  animation: gali-breathe 4s ease-in-out infinite;
}

// Texto: "Todo está corriendo · Última acción de Gali hace 12 min · escaló campaña +15%"
// Font: 15px / Inter 400 / color $gray-600
```

El **Sparkline de negocio** (bloque 1) es el segundo elemento signature: una línea SVG de 88×22px que muestra la tendencia del ROAS real de la semana. Sin etiquetas de eje, sin rejilla — solo el pulso del negocio.

El **ícono de Gali ✦** en color naranja aparece solo cuando Gali habla, recomienda o actuó. Nunca como decoración.

### 7.4 Motion — tokens de animación (ya existentes en `_animations.scss`)

| Token | Uso en casita |
|---|---|
| `gali-fade-up` | Entrada de cards en proyectos, conexiones |
| `gali-breathe` | Modo calma en bloque 2 de HoyHome |
| `gali-count-in` | Contadores de impacto (acciones, $ ahorrado, horas) |
| `.gali-stagger-in` | Lista de proyectos — stagger 60–80ms por ítem |
| `prefers-reduced-motion` | Siempre respetado en `_animations.scss` |

**Regla de motion**: solo 1 animación activa por viewport. No stagger + breathe + count-in simultáneos. El home dispara `count-in` solo en bloque 3 cuando el usuario hace scroll hasta él.

---

## 8. Decisiones técnicas

### 8.1 Stack definitivo

```
Angular 17.3 Standalone Components  ✅ No cambiar
SCSS con DS tokens (_variables.scss)  ✅ No cambiar
Angular Signals (computed, signal, effect)  ✅ Patrón reactivo correcto
PrimeNG 17 (solo donde el DS lo requiere)  ✅ No introducir ni quitar
Mock API via HTTP Interceptor  ✅ No cambiar
Yarn 1.22 / Node 22.7 (nvm)  ✅ No cambiar
```

### 8.2 Patrones de estado

**Estado de usuario (localStorage — ya implementado):**
```ts
// Claves existentes que se preservan
'gali-v2-objetivo-meta'     // objetivo en pedidos/sem
'gali_zero_state'           // si completó onboarding
'gali_cas_explainer_seen'   // primera visita CAS
'gali-glosario-{term}'      // veces que vio tooltip de término
'gali-complexity-level'     // 'basic' | 'expert'
```

**Patrón de confianza (nuevo — implementar):**
```ts
// Nueva clave para el toggle de autonomía por señal
'gali-trust-{signalType}'   // 'auto' | 'confirm' por tipo de señal
// Ej: 'gali-trust-routing' = 'auto' → Vigilante cambia transportadora sin preguntar
```

**Fuente única de datos (ALS-4):**
```ts
// En cualquier componente de la casita — patrón obligatorio
import PROJECTS from 'mocks/gali-v5/projects.json';
import KPIS from 'mocks/gali-v5/kpis-global.json';
import LEDGER from 'mocks/gali-v5/impact-ledger.json';
import { MOCK_SENALES, MOCK_ALERTAS } from 'mocks/gali-v5/senales.mock';
// NUNCA: const roas = 2.9; — esto rompió la confianza en v5
```

### 8.3 Qué código es salvageable vs. qué reescribir en Gali 6

**Importar directo desde gali-5 (sin duplicar):**
- Todos los componentes operativos `gali-5/gali-v5/pages/*` — lazy `loadComponent`
- `GaliDecisionTheaterComponent` — import standalone desde gali-5
- `GaliImpactWidgetComponent` — import standalone desde gali-5
- `DiagnosticoModalComponent` — import standalone desde gali-5
- Todos los mocks en `mocks/gali-v5/` — los mocks NO se mueven ni duplican
- `_animations.scss` y `_variables.scss` — ya globales, disponibles automáticamente

**Copiar y adaptar en gali-6 (base v5-v2, ajustar imports y selector):**
- `HoyHomeComponent` → `Gali6HoyHomeComponent` (selector `app-gali6-hoy-home`)
- `ProyectosCasaComponent` → `Gali6ProyectosCasaComponent`
- `ConexionesCasaComponent` → `Gali6ConexionesCasaComponent`
- `ImpactoLedgerComponent` → `Gali6ImpactoComponent`
- `CentroControlComponent` → `Gali6CentroControlComponent`
- `GaliGlosarioDirective` → copiar a `gali-6/directives/gali-glosario.directive.ts`

**Crear desde cero en gali-6:**
- `Gali6ShellComponent` — shell propio sin herencia de v5
- `gali-6-nav.config.ts` — config de nav propia con rutas `/gali-6/*`
- `gali-6.routes.ts` — rutas propias + lazy refs a gali-5

**No tocar nunca:**
- `gali-5/gali-v5/` — ningún archivo interno. Solo se referencian desde gali-6.
- `gali-5/gali-v5-v2/` — queda como archivo de aprendizaje intacto.
- Mocks JSON — solo añadir campos nuevos, nunca renombrar campos existentes.

### 8.4 Convención de módulos en Gali 6

```ts
// Cada componente propio de Gali 6 sigue este patrón
@Component({
  selector: 'app-gali6-[nombre]',      // prefijo gali6- para distinguir de v5
  standalone: true,
  imports: [CommonModule, RouterModule, Gali6GlosarioDirective, /* otros */],
  templateUrl: './[nombre].component.html',
  styleUrl: './[nombre].component.scss',
})
export class Gali6[Nombre]Component {
  // Sin HttpClient — datos de mocks importados directamente (ALS-4)
  // Signals para estado local
  // computed() para derivar valores de mocks
  // localStorage para persistencia de preferencias de usuario
}
```

---

## 9. Features priorizados

### 🔴 Must Have (Fase 1 de la casita — Spec 17 §7)

| Feature | Dónde vive | Estado |
|---|---|---|
| Home "Hoy" con 4 bloques exactos (estado · 1 decisión · impacto · 1 palanca) | `HoyHomeComponent` | En proceso — validar CA-3.1 |
| Objetivo editable inline en Proyectos (modal 1-paso, no wizard) | `ProyectosCasaComponent` | Pendiente |
| Barra de progreso objetivo: {actual}/{meta} · {pct}% · estado en_camino/riesgo/cumplida | `ProyectosCasaComponent` | Pendiente |
| Gali recomienda: 1–2 proyectos con justificación hiperpersonalizada | `ProyectosCasaComponent` | Pendiente |
| 5 MCPs core en Conexiones con estado + "qué contexto da a Gali" | `ConexionesCasaComponent` | En proceso — añadir contexto |
| Toggle básico/experto en shell — controla densidad del acordeón | `GaliV5V2ShellComponent` | Pendiente |
| `galiGlosario` en todos los términos financieros de las 5 pantallas nuevas | `GaliGlosarioDirective` | ✅ Directiva lista |
| ALS-4 compliant — cero literales ROAS/margen en TS | Todas las pantallas nuevas | ✅ HoyHome compliant |
| Modo calma: cuando no hay decisión → respiración sutil + "última acción de Gali" | `HoyHomeComponent` bloque 2 | Pendiente |

### 🟡 Should Have (Fase 2 — datos + glosario + confianza)

| Feature | Dónde vive |
|---|---|
| Toggle de confianza por decisión: "La próxima vez, que Gali lo haga solo" | `HoyHomeComponent` bloque 2 + `ImpactoLedgerComponent` |
| Palanca predictiva (bloque 4): señal 🔮 top → deep link a `/proyectos/nuevo` | `HoyHomeComponent` |
| % acciones iniciadas por Gali (meta >40%) + % loops con resultado (meta >80%) | `ImpactoLedgerComponent` |
| Hito gamificado al superar $1M acumulado en ledger | `ImpactoLedgerComponent` |
| Onboarding de 3 preguntas (ZeroState) si `sessionCount === 0` | Modal en shell de v5-v2 |
| Badge de periodo (Semanal/Mensual) en todos los KPIs | Global en todos los componentes nuevos |
| Sparkline de 6 puntos en bloque 1 del home | `HoyHomeComponent` |
| `gali-count-in` en contadores de impacto | `HoyHomeComponent` bloque 3 |

### 🟢 Nice to Have (Fase 3 — pulido)

| Feature |
|---|
| Stagger `.gali-stagger-in` en lista de proyectos |
| Estado vacío / carga / error para cada bloque del home |
| Toast feedback cuando el usuario toma una decisión en el theater |
| Centro de Control con tabs accordion que muestran estado de cada agente/skill/regla |
| Panel informativo "Gali como Director" en onboarding experto |
| `SenalesPageComponent` con layout dos columnas (heredado de v5) visible desde palanca bloque 4 |
| Tooltip "Tasa de éxito = acciones ejecutadas sin intervención manual" + benchmark en agentes |

---

## 10. Orden de implementación

Este orden minimiza el riesgo de caer en los mismos loops de complejidad de versiones anteriores. La regla: **`ng build --configuration development` limpio entre cada sprint**.

### Sprint 0 — Reorganización de carpetas + andamiaje de Gali 6

1. **Mover carpetas** sin tocar archivos internos:
   - `src/app/pages/gali-v5/` → `src/app/pages/gali-5/gali-v5/`
   - `src/app/pages/gali-v5-v2/` → `src/app/pages/gali-5/gali-v5-v2/`
   - Crear `src/app/pages/gali-5/index.ts` si el barrel lo requiere.

2. **Actualizar `app.routes.ts`**: cambiar los paths de import de gali-v5 y gali-v5-v2 al nuevo prefijo `gali-5/`. Añadir entrada para `/gali-5` (alias a gali-v5 shell) y placeholder para `/gali-6`.

3. **Crear `src/app/pages/gali-6/`** con la estructura de carpeta definida en §0.4.

4. **Crear `gali-6-shell.component.ts`** mínimo (solo el acordeón nav con las 5 rutas del espinazo y `<router-outlet>`).

5. **Crear `gali-6.routes.ts`** con la ruta vacía `''` apuntando al home placeholder.

6. **Actualizar galería** (`prototype-gallery`): añadir tarjeta "Gali 6 · La Casita" → `/gali-6`; actualizar tarjeta anterior a "Gali 5 · Archivo" → `/gali-5`.

7. **Build limpio** → gate. Si algo se rompe en los imports de gali-5, resolverlo antes de continuar.

### Sprint A — Las 5 pantallas de La Casita en Gali 6

8. **`Gali6HoyHomeComponent`**: copiar base de `gali-v5-v2/home/hoy-home` → adaptar selector e imports al shell de Gali 6. Validar 4 bloques completos. Añadir modo calma (`gali-breathe`). Añadir sparkline SVG.

9. **`Gali6ProyectosCasaComponent`**: copiar base de `gali-v5-v2/proyectos/proyectos-casa` → añadir objetivo editable (modal 1-paso), barra de progreso con color condicional, card "Gali recomienda" derivada de `projects.json`.

10. **`Gali6ConexionesCasaComponent`**: copiar base de `gali-v5-v2/conexiones/conexiones-casa` → validar que cada MCP muestra "Esto le da contexto a Gali para: {acción}". Siigo urgente = impacto cuantificado.

11. **`Gali6ImpactoComponent`**: copiar base de `gali-v5-v2/impacto/impacto-ledger` → añadir % acciones Gali + hito $1M.

12. **`Gali6CentroControlComponent`**: copiar base de `gali-v5-v2/centro-control` → validar tabs Agentes/Skills/Reglas/Marketplace con lazy refs a gali-5.

13. **Build limpio** → gate.

### Sprint B — Rutas operativas + toggle básico/experto

14. Añadir en `gali-6.routes.ts` las rutas operativas con `loadComponent` apuntando a `gali-5/gali-v5/pages/*`. Empezar con los módulos más usados: Catálogo, Órdenes, Wallet, Campañas, Señales, Proyecto/nuevo, Proyecto/:id.

15. Implementar toggle básico/experto en el header del shell de Gali 6:
    - Modo básico: acordeón muestra espinazo + Operación (sin Centro de Gali).
    - Modo experto: acordeón completo.
    - Persistir en `localStorage('gali-complexity-level')`.

16. Añadir `gali-count-in` en bloque 3 del home (IntersectionObserver al entrar en viewport).

17. **Build limpio** → gate.

### Sprint C — Conexión narrativa

18. Bloque 4 del home: señal 🔮 top de `MOCK_SENALES` con deep-link a `/gali-6/proyectos/nuevo`.
19. Toggle de confianza en `GaliDecisionTheaterComponent`: "¿La próxima vez que Gali lo hace solo?" — persiste en localStorage por tipo de señal.
20. `GaliGlosarioDirective` en todos los términos financieros de las 5 pantallas propias.
21. **Build limpio** → gate.

### Sprint D — ZeroState (si tiempo permite)

22. Modal de 3 preguntas en shell de Gali 6 si `sessionCount === 0`.
23. Si `kpis-global.json` tiene pedidos > 0 → saltar pregunta de objetivo de pedidos.
24. Al completar, guardar `gali-complexity-level = 'basic'` por defecto.
25. **Build limpio** → gate.

### No hacer en esta versión

- Multi-thread chat (Spec 10) — diferido
- Grafo Obsidian en Mi Negocio — diferido (hereda la página de micromundo de gali-5)
- Señales layout dos columnas — hereda `SenalesPageComponent` de gali-5 que ya funciona
- Ejecución real de MCPs — sigue siendo mock
- Modificar ningún archivo dentro de `gali-5/` — es zona de archivo intocable

---

## 11. Riesgos y decisiones abiertas

### 11.1 Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Renaming de carpetas rompe todos los imports existentes** — `gali-v5/` → `gali-5/gali-v5/` es un cambio de path que afecta `app.routes.ts`, barrel files y cualquier import cruzado | Alta | Alto | Hacer el rename en un solo commit. Usar búsqueda global (`rg "pages/gali-v5"`) antes de mover. Correr `ng build` inmediatamente para confirmar 0 errores antes de seguir. |
| Rutas lazy en Gali 6 apuntan a `../gali-5/gali-v5/pages/...` — si el path relativo no coincide con la estructura real de carpetas, falla en tiempo de build | Media | Alto | Verificar paths relativos con `ls` antes de escribir el `loadComponent`. El build es el gate — si el path está mal, falla visible e inmediatamente. |
| `GaliStateService`/`GaliWorkspaceService` con estado contaminado entre gali-5 y gali-6 (son `providedIn: 'root'`) | Media | Medio | Gali 6 tiene su propio shell y no monta `gali-right-panel`. Si se detecta contaminación, registrar el servicio a nivel de shell de Gali 6 con `providers: [GaliStateService]` para aislar la instancia. |
| `impact-ledger.json` con campos que no coinciden con `Gali6ImpactoComponent` | Media | Medio | Leer el mock y el componente en paralelo antes de escribir código. El mock es fuente de verdad — el componente se adapta al mock, no al revés. |
| Toggle básico/experto no actualiza el estado activo del acordeón al cambiar de modo | Baja | Bajo | Signal `complexityLevel = signal<'basic'|'expert'>('basic')` en el shell; el acordeón usa `@if (complexityLevel() === 'expert')` para las secciones del Centro de Gali. |

### 11.2 Decisiones de producto abiertas (necesitan validación de Catalina/equipo)

| Decisión | Opciones | Recomendación |
|---|---|---|
| **¿El score de salud (78/100) aparece en la casita?** | A) Solo en modo experto en el header · B) En Mi Negocio tab · C) No aparece en v2 | **Recomendación: B** — en Mi Negocio tab, nunca en el header (genera ansiedad sin contexto) |
| **¿La palanca predictiva (bloque 4) siempre existe?** | A) Siempre hay una señal 🔮 hardcoded · B) Si no hay señales predictivas → se oculta el bloque 4 | **Recomendación: B** — el home puede tener 3 bloques sin palanca si no hay señal predictiva. Honestidad > contenido forzado |
| **¿Kronos aparece en el sidebar de la casita como agente visible?** | A) Solo en Centro de Control experto · B) Tiene un ítem en Financiero del acordeón · C) Solo en `/financiero/historial-de-cartera` | **Recomendación: C** — Kronos vive en la página de wallet (heredada de v5 y funcionando bien). No duplicar en nav. |
| **¿`/gali-v5-v2/micromundo` es "Mi Negocio" en el nav?** | A) Sí, mismo componente de v5 con label diferente · B) No existe en v2 hasta que se cree un componente nuevo | **Recomendación: A** — hereda `MicromundoPageComponent` de v5 con label "Mi Negocio" en la nav. No reconstruir. |
| **¿Academy es accesible desde el acordeón básico o solo experto?** | A) Básico (es valor para todos) · B) Experto | **Recomendación: A** — Academy es el recurso de aprendizaje más democrático. Siempre visible. |

### 11.3 La pregunta estratégica no resuelta

La reunión del 12 jun (`correccionescata12jun.md`) dejó una pregunta pendiente: **¿cuándo mostrar esta versión a María / al equipo de producto para validar la viabilidad tecnológica?**

El prototipo de la casita en su Fase 1 (sprints A+B) es presentable como **"norte de UX validado"** — muestra el flujo de Objetivo → Proyectos → Conexiones → Señales de forma limpia, con datos coherentes y sin `data-proto-skip` visibles. Eso es suficiente para desbloquear la conversación técnica.

---

*Ultimate Plan · Gali V5 v2 · Jun 15 2026 · basado en análisis completo del repositorio.*  
*Generado a partir de: `docs/Conocimientos/` (4 docs) · `docs/Descubrimientos/` (6 docs) · `docs/SpecsNuevos/` (specs 3–17) · código de `gali-v5` (38 rutas) · código de `gali-v5-v2` (5 pantallas nuevas) · `mocks/gali-v5/` (26 archivos de datos).*

---

## Gestión de Proyectos Orientada a Objetivos

> **Fecha:** 2026-06-15 · Re-análisis completo de todas las versiones de Gali  
> **Fuente principal:** `docs/Descubrimientos/correccionescata12jun.md` (transcript reunión Laura, Diana, Cata) · `docs/SpecsNuevos/13.ProyectoCanvas.md` · análisis de `src/app/pages/gali-6/` (implementación real)

---

### Resumen ejecutivo de hallazgos de la revisión

La reunión del 12 jun produjo el acuerdo de producto más importante: **el valor de Gali es ayudar al dropshipper a tomar decisiones**, y la puerta de entrada es la **arquitectura Objetivo Global → Proyectos → Señales**, no el universo completo de módulos.

Cuatro principios emergieron como no-negociables de esa conversación:

1. **Objetivo primero, proyectos como camino** — El usuario define su objetivo global ("llegar a 100 pedidos/semana") y Gali crea o recomienda proyectos que contribuyen a ese objetivo. No es onboarding paso a paso — es libertad con guía contextual.
2. **Cada proyecto alimenta el objetivo global** — La conexión visual objetivo ↔ proyecto ↔ % de contribución es el hilo narrativo de la casita.
3. **Señales como "paso a paso dinámico"** — En lugar de un wizard rígido de qué hacer, las señales de Gali son las sugerencias contextuales del momento. Son el mentor que Cata mencionó: "cuando eres dropper sin mentor, no sabes qué hacer".
4. **Fase 1 es: Objetivo → Proyectos → Conexiones → Señales** — Todo lo demás (agentes, skills, reglas, marketplace) va al Centro de Gali en modo experto.

---

### Mapa de versiones de Gali — cronología y característica diferenciadora

| Versión | Ruta | Intención | Lo único de esta versión |
|---|---|---|---|
| `gali-v2` | `/gali-v2` | Chat assistant contextual | Dock flotante + respuestas superpuestas + Memory Inspector — Gali como overlay |
| `gali-v3` | `/gali-v3` | Builder-Orquestador híbrido | Menú builder estructurado + sidebar contextual + block-wrapper — más estructurado que chat |
| `gali-dashboard` | `/gali-dashboard` | Dashboard KPI puro | Dashboard de métricas sin capas de IA |
| `gali-descubrimiento` | `/gali-descubrimiento` | Journey de onboarding/descubrimiento | Hero + avatar animado + suggestion chips + execution stream — narrativa de primera sesión |
| `gali-estrategia / lanzamiento / creacion / onboarding` | rutas propias | Flujos específicos del ciclo de vida | Pantallas aisladas de etapas: antes del hub |
| `gali-v5` | `/gali-5` | Orquestador completo — el universo | 38+ rutas, 5 agentes vivos, cobertura operativa total, mocks ricos |
| `gali-v5-v2` | (bajo `/gali-5`) | La Casita v1 — minimalismo sobre v5 | Shell limpio, 5 pantallas casita, GaliGlosarioDirective, ALS-4 desde el día 1 |
| **`gali-6`** | `/gali-6` | **La Casita definitiva — versión ultimate** | Shell propio sin herencia, nav config propio, 4 bloques del home canónicos, objetivo editable inline |

---

### Correcciones de `correccionescata12jun.md` — tabla de estado

El archivo es el transcript de la reunión del 12 jun entre Laura Contreras, Diana Aldana y Catalina Giraldo. Todas las decisiones vienen de consenso del equipo de producto.

| Corrección / Decisión | Versión afectada | ¿Resuelta en Gali 6? | Acción en ultimate |
|---|---|---|---|
| El prototipo es muy vasto — priorizar una "Fase 1 pequeña" (casita) | gali-v5 | ✅ Resuelta — gali-6 es la casita | Mantener el scope: Objetivo → Proyectos → Conexiones → Señales |
| Onboarding basado en objetivo propio, NO paso a paso rígido | gali-v5 (ZeroState) | ⏳ Pendiente — ZeroState no implementado en gali-6 | Sprint D: modal 3 preguntas si `sessionCount === 0` |
| El núcleo de la interfaz debe ser Proyectos con salud + progreso al objetivo | gali-v5 hub | ✅ Parcialmente — `Gali6ProyectosCasaComponent` tiene objetivo + barra progreso | Agregar % de contribución por proyecto al objetivo global |
| Objetivo global → proyectos como sub-objetivos que alimentan el meta principal | gali-v5 | ⏳ Pendiente — la jerarquía visual objetivo→proyecto→contribución falta | Ver §arquitectura de datos más abajo |
| Gali recomienda proyectos específicos para cumplir el objetivo principal | gali-v5 | ✅ Parcialmente — hay tarjetas "Gali recomienda" derivadas de `MOCK_SENALES` | Agregar contexto "este proyecto te ayuda a cerrar X pedidos faltantes para el objetivo" |
| Señales como "paso a paso dinámico" (no wizard rígido) | gali-v5 (botones no funcionales) | ✅ Bloque 4 del home tiene palanca predictiva | Asegurar que la señal top diga "tu siguiente acción recomendada" |
| 5 conexiones vitales: Meta, TikTok, Shopify, Google Drive, Chatea Pro | gali-v5 conexiones | ✅ Resuelta — gali-6/conexiones tiene estas 5 como prioritarias | Mantener |
| Submenús de Operación preservados (no eliminar por minimalismo) | feedback v2 | ✅ Resuelta — acordeón de Operación completo en gali-6-nav.config | Mantener |
| Básico/experto = densidad, no amputación de secciones | gali-v5-v2 | ⏳ Pendiente — toggle existe pero no cambia el acordeón | Sprint B: toggle controla visibilidad del Centro de Gali |
| Señales sí son importantes para Fase 1 (Cata las rescató de Fase 2) | Plan inicial | ✅ Resuelta — bloque 4 del home tiene palanca 🔮 | Mantener señales en Fase 1 |

---

### Lo que Gali 6 implementó bien vs. lo que sigue pendiente

**Implementado bien ✅:**

| Feature | Componente | Por qué está bien |
|---|---|---|
| Home 4 bloques exactos | `Gali6HoyHomeComponent` | Lee 100% de mocks (ALS-4), modo calma con `gali-breathe`, sparkline SVG, GaliDecisionTheater importado de v5 |
| Objetivo editable inline | `Gali6ProyectosCasaComponent` | Modal 1-paso (no wizard), persiste en localStorage, barra de progreso con estado en_camino/en_riesgo/cumplida |
| Recomendaciones desde señales | `Gali6ProyectosCasaComponent` | Filtra `MOCK_SENALES` por `canLaunch` + tipo trend/opportunity — datos reales, no hardcoded |
| Shell propio sin herencia | `Gali6ShellComponent` | Nav config propio, no depende de servicios de v5 |
| GaliGlosarioDirective | `gali-6/directives/` | Copiada de v5-v2, funciona standalone en gali-6 |
| ALS-4 estricto | Todos los componentes de gali-6 | Cero literales financieros en TS |
| Agentes como personajes | Heredados de v5 vía lazy routes | Roax, Vigilante, Kronos, ADA, Chatea Pro — identidad preservada |

**Pendiente o incompleto ⏳:**

| Feature | Qué falta | Spec / Sprint |
|---|---|---|
| Contribución por proyecto al objetivo | % que aporta cada proyecto activo al `pedidosActual` | Nuevo campo en proyectos · ver §arquitectura de datos |
| ProyectoCanvas completo | Variantes de estado (recien_lanzado, pausado, cerrado, borrador) + Calculadora Brújula + Agent Actions feed | Spec 13 — Sprint A/B |
| ZeroState onboarding | Modal 3 preguntas si `sessionCount === 0` | Spec 5/16 — Sprint D |
| Toggle básico/experto funcional | Que cambie visibilidad del Centro de Gali en el acordeón | Sprint B |
| "Siguiente acción recomendada" explícita | Señal del home debe decir "tu próximo paso es X" | Señales mock — ampliar texto |
| Justificación de recomendación de proyecto | "Este proyecto te da 15 pedidos/sem extra — cerrarías tu objetivo al 100%" | Enriquecer lógica de recomendaciones |

---

### Decisiones de arquitectura: modelo de datos objetivo→proyecto

El modelo conceptual definido en la reunión del 12 jun y reafirmado en `ultimate-plan.md` §6.4 es:

```
Objetivo Global
  ├── texto: "Automatizar y escalar a 100 pedidos/semana"
  ├── meta_pedidos_sem: 100
  ├── actual_pedidos_sem: 70  (suma de todos los proyectos activos)
  ├── progreso_pct: 70%
  └── Proyectos (contribuyentes)
       ├── Collar GPS          → 47 pedidos/sem → contribución 67%
       ├── K-Beauty Skincare   → 23 pedidos/sem → contribución 33%
       └── [Recomendado] Difusor aromaterapia → +18 pedidos estimados → llegaría a 106%
```

**Reglas del modelo:**
- `pedidos_sem_total` = suma de `pedidos_sem` de proyectos con `estado ∈ ['activo', 'en_escala']`
- `contribucion_pct` de cada proyecto = `(proyecto.pedidos_sem / objetivoMeta) * 100`
- Si un proyecto pasa a `pausado` o `cerrado`, su contribución se resta automáticamente y la señal de Gali alerta
- Gali recomienda un nuevo proyecto cuando `progreso_pct < 80%` y hay señales tipo `trend/opportunity` disponibles

**En código (implementar en `Gali6ProyectosCasaComponent`):**

```typescript
// Enriquecer cada proyecto con su % de contribución al objetivo
readonly proyectosConContribucion = computed(() =>
  this.proyectos.map(p => ({
    ...p,
    contribucionPct: Math.round(((p.pedidosSem ?? 0) / this.objetivoMeta()) * 100),
  }))
);

// Mensaje de señal cuando contribución baja
readonly alertaObjetivo = computed(() => {
  const enRiesgo = this.metaEstado() === 'en_riesgo';
  const pausados = this.proyectosPausados.length;
  if (enRiesgo && pausados > 0)
    return `${pausados} proyecto${pausados > 1 ? 's' : ''} pausado${pausados > 1 ? 's' : ''}. Tu objetivo está al ${this.metaPct()}%.`;
  return null;
});
```

---

### Anti-patrones confirmados en gestión de proyectos

Los siguientes patrones se detectaron en múltiples versiones y el ultimate los evita explícitamente:

| Anti-patrón | Dónde ocurrió | Por qué es dañino | Solución en ultimate |
|---|---|---|---|
| Tabs de proyecto vacíos con "Ir al módulo →" | gali-v5 `ProyectoDetallePageComponent` | El usuario entra a su proyecto y tiene que salir para ver sus datos — quiebre de contexto total | Tabs con datos reales del mock filtrados por `proyectoId` (Spec 13) |
| Solo el estado "en_escala" / "activo" en proyectos | gali-v5, gali-v5-v2 | El dropshipper no puede ver proyectos recién lanzados, pausados, cerrados — el ciclo de vida está invisible | Diversificar `projects.json` con 4 estados nuevos + componentes de estado diferenciados |
| Recomendaciones sin justificación hiperpersonalizada | gali-v5-v2, gali-6 parcial | "Gali recomienda este producto" sin decir POR QUÉ es bueno para ESTE usuario hoy | Agregar `porque` derivado de señales con contexto de la red Dropi |
| Objetivo editable solo desde onboarding | gali-v5 | Si el usuario quiere cambiar su objetivo después del onboarding, no puede | Modal inline editable desde la pantalla de Proyectos (implementado en gali-6 ✅) |
| Proyectos cerrados = silencio | gali-v5 | Un proyecto fallido desaparece sin aprendizaje | Postmortem de Gali: "qué funcionó, qué no, lección" — el fracaso es un activo de conocimiento |
| Wizard de nuevo proyecto sin calculadora de margen | gali-v5 (parcial) | El dropshipper lanza sin saber si el precio cubre el costo + flete + pauta | Calculadora Brújula en Step 3 del wizard (Spec 13 §6) |
| Presupuesto sin recomendación contextual | gali-v5 | El usuario escribe un presupuesto a ciegas | Badge "Gali sugiere $X/día" calculado desde ROAS histórico × pedidos faltantes para el objetivo |

---

### Principios NON-NEGOTIABLE para gestión de proyectos (de Conocimientos)

Estos emergen de `docs/Conocimientos/AlcancesIADropi.md` y la reunión del 12 jun:

1. **El objetivo es del negocio, no de Gali** — Gali no impone un objetivo. Lo pregunta, lo aprende, y trabaja para cumplirlo.
2. **Proyectos = hiperpersonalización en acción** — Dos dropshippers con el mismo objetivo pueden tener proyectos completamente diferentes según su audiencia, región y historial. Gali no recomienda lo mismo a todos.
3. **El tiempo del dropshipper vale más que sus datos** — La pantalla de proyectos debe responder "qué hago hoy" en menos de 10 segundos. No es un reporte — es una sala de decisiones.
4. **El fracaso documentado es capital** — Un proyecto cerrado con postmortem vale más que 10 proyectos activos sin historial. Gali convierte cada experimento en aprendizaje persistente.
5. **Gali recomienda, el usuario decide** — Ninguna acción sobre un proyecto debe ejecutarse sin confirmación del usuario (excepto las acciones de agentes dentro del umbral de confianza configurado).

---

*Sección "Gestión de Proyectos Orientada a Objetivos" añadida Jun 15 2026 · Re-análisis completo post-reunión Cata/Laura/Diana 12 jun.*  
*Fuentes: `correccionescata12jun.md` · `13.ProyectoCanvas.md` · análisis de `gali-6/proyectos/` implementación real.*

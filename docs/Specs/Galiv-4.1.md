# Gali V4.1 — Workspaces + Grafo + Orquestador visible
## Plan adaptado: validación interna primero, expansión después

> **Basado en:** Feedback real de usuarios · gali-v3 (Fases 0–4 completas) · Plan adaptado V4.1  
> **Fecha:** Mayo 2026 · Cata Giraldo  
> **Estado prototipo:** Fase A implementada · Fase B implementada (post-go interno simulado)

---

## Resumen ejecutivo

Galiv-4.1 no reinicia V4 — es la **Fase 5** sobre el tri-pane existente. La estrategia acordada:

| Fase | Alcance | Cuándo |
|---|---|---|
| **Fase A** | 5 pantallas clave (WF-1 → WF-5-C) | Construir y validar con equipo interno |
| **Fase B** | Navigator, grafo, modos, chat-first, Mi equipo | Solo tras go/no-go interno |

**Skills aplicados:** Relationship Design (H#11–14) + tokens `_gali-v3-tokens.scss` (naranja `#F49A3D`, terracota Gali `#B8593A` — **no** bordes azules del mockup original).

---

## 1. Diagnóstico del feedback (conservado de Galiv-4.1)

El feedback recibido sigue siendo válido. Traduce tres problemas estructurales:

### Problema 1 — Vocabulario desconectado del dropshipper

| Lo que dijo el usuario | Lo que revela |
|---|---|
| "¿Qué orquesta? No sé qué significa eso" | "Dropi Orquestador" es concepto de producto, no beneficio visible |
| "Bloques de Gali... ¿qué los diferencia de un reporte?" | "Bloque" es jerga de producto |
| "Mis bloques" vs "Builder" vs "automatizaciones" | Tres palabras para conceptos distintos |
| "Triggers y acciones me dan ansiedad" | Builder presentado como Make/n8n |

**Diagnóstico:** El prototipo hablaba idioma de producto, no del dropshipper LATAM.

### Problema 2 — Gali presente pero no visible actuando

| Lo que dijo el usuario | Lo que revela |
|---|---|
| "Gali habla pero no actúa" | No hay loop sugerencia → ejecución → resultado |
| "Ejecuté la pausa... ¿y luego qué?" | Señal cerrada sin rastro |
| "Chat e interfaz son dos mundos" | Sin conexión visual chat ↔ lienzo |
| "Quiero múltiples chats tipo Cursor" | Un solo chat lineal, sin agentes paralelos |

### Problema 3 — Gaps operativos del día a día

| Lo que dijo el usuario | Lo que revela |
|---|---|
| "No veo logística" | Vigilante anti-baneo sí; Vigilante logístico no |
| "ROAS sí, ganancia neta no" | P&L sigue en Excel externo |
| "Nada sobre proveedores" | Proveedor = caja negra |
| "No hay gestión de equipos" | Asistentes invisibles para Dropi |

---

## 2. Corrección crítica al mapa de vocabulario

En código existen **tres conceptos**, no dos:

| Término actual | Propuesta Galiv-4.1 | **Adaptación V4.1** |
|---|---|---|
| Builder / Automatizaciones | Recetas | **Recetas** ✓ |
| Mis bloques (tab panel) | Mis vistas | **Mis tableros** — evita colisión |
| Bloques de Gali / Constructor | Mis vistas | **Constructor de tableros** |
| Vistas guardadas (`/vista/:slug`) | (no mencionado) | **Mis vistas** — presets de lienzo |
| Dropi orquestador (topbar) | Modo activo dinámico | **"⚡ Operando · Hoy"** según contexto |
| Stack conectado | Mis apps conectadas | Alinear con `/mi-stack` existente |

Esto evita confundir "vista del día" con "bloque de métricas custom".

---

## 3. Fase A vs Fase B

### Fase A — Validación interna (5 pantallas)

| # | Wireframe | Qué valida | Ruta demo |
|---|---|---|---|
| 1 | WF-1 Panel Orquestador | Gali actúa · loop señal→resultado · vocabulario header | Cualquier vista + ⌘J |
| 2 | WF-2 Onboarding 90s | "¿Qué orquesta?" → mostrar, no decir | `/gali-v3/onboarding` |
| 3 | WF-3 Vigilante Logístico | "No veo logística" | Bloque en vista compuesta |
| 4 | WF-4 Rentabilidad Real | ROAS sí, ganancia neta no | Bloque en vista compuesta |
| 5 | WF-5-C Operación hoy | Cómo encaja el día a día | `/gali-v3/vista/operacion-hoy` |

**Incluido en WF-1 (no cuenta extra):** header modo dinámico, renombres Recetas/Tableros/Vistas, badge confianza en señales.

**Flujo sesión interna (45–60 min):**

```
WF-2 Onboarding → WF-5-C Operación hoy → WF-1 Panel abierto → WF-3 + WF-4 en scroll → Debrief 15 min
```

**Criterios go/no-go (María, Diana, Jhainey, Michael):**

- ¿Entienden qué hace Gali sin explicación del facilitador? (WF-2)
- ¿Nombran 1 agente activo sin abrir chat? (WF-1)
- ¿Saben qué pasó tras ejecutar la señal CTR? (WF-1 loop sig-2)
- ¿El Vigilante Logístico responde al dolor de novedades? (WF-3)
- ¿El P&L comunica ganancia neta mejor que ROAS solo? (WF-4)
- ¿La vista compuesta se siente "mi operación de hoy"? (WF-5-C)

**Si go:** ejecutar Fase B. **Si no-go:** iterar solo las 5 pantallas.

### Fase B — Post-validación (diferido en plan original, implementado en prototipo)

| Bloque | Wireframes | Entregables |
|---|---|---|
| Navigator + wiring | — | Sección ⚡ Ahora + Objetivo/Comunidad/Mi Stack |
| Grafo Obsidian | WF-5, WF-6, WF-7 | Nodos proveedor enriquecidos, backlinks, vista rentabilidad-semana |
| Chat ↔ lienzo | WF-8 + highlight CSS | Recetas chat-first, clases `gali-active`/`gali-done` |
| Workspace Blender | WF-9, WF-10 | Mi equipo (mock) · Blender split **spec-only** |

---

## 4. Principios UX relacional (H#11–14)

Integrados desde Sprint 1, no después:

| Principio | Dónde en V4.1 |
|---|---|
| **H#11 Transparencia** | Cada agente y señal: expandir "¿Por qué?" con fuentes |
| **H#13 Confianza graduada** | Badge `confianza` sage/amber/rust en señales + agentes |
| **H#12 Control humano** | Agentes: pausar · ver log · deshacer (mock) |
| **H#14 Memoria explicable** | Chip "Usa memoria: Collar GPS, Cali" → memory-inspector |
| **Trust evolution** | Aprendiz = reasoning expandido; estratega = tarjetas compactas |

---

## 5. Arquitectura en 4 capas

```
Capa A — Panel orquestador (Fase A)
Capa B — Header + navigator + renombres (Fase A parcial + Fase B)
Capa C — Modos preset + módulos operativos (Fase A bloques + Fase B modos)
Capa D — Split Blender + Mi equipo (Fase B — WF-10 spec-only)
```

### Capa A — Panel orquestador

**Archivo central:** `gali-right-panel.component.*`

3 zonas verticales (no tabs):

1. **Agentes activos** — `agent-orchestrator.service.ts` + `mocks/gali-v3/agentes-activos.json`
2. **Señales con loop** — extendido en `signals.service.ts`; sig-2 con before/after CTR
3. **Chat** — siempre al fondo (patrón Cursor)

Tipo extendido `Signal`:

```typescript
interface Signal {
  confianza?: number;
  razonamiento?: string;
  estado_ejecucion?: 'pendiente' | 'ejecutado' | 'resultado';
  resultado?: { metrica, antes, despues, delta_label, roas_antes?, roas_despues? };
  propuesta_receta?: { label, route };
}
```

### Capa B — Header + navigator

| Cambio | Archivos |
|---|---|
| Modo dinámico topbar | `workspace-context.service.ts`, `gali-topbar.*` |
| Renombres transversales | topbar, navigator, welcome-artifact |
| Navigator ⚡ Ahora | `gali-navigator.*` — KPIs live + Objetivo/Comunidad/Mi Stack |

**Modos dinámicos (ejemplos):**
- `/gali-v3` → `⚡ Operando · Hoy`
- `/proyecto/collar-gps-2026` → `🚀 Lanzando · Collar GPS`
- `/builder` → `🔧 Construyendo · Recetas`

### Capa C — Módulos operativos + modos preset

| Módulo | Implementación |
|---|---|
| Vigilante Logístico | `block-vigilante-logistico` + `block-registry.ts` |
| Rentabilidad Real | `block-rentabilidad` — P&L 5 líneas mock Collar GPS |
| Proveedor en mapa | Nodos enriquecidos en `business-map.json` |
| Backlinks Obsidian | `backlinks.service.ts` + panel WF-1 |
| 5 Modos topbar | Presets → rutas `/vista/*`, `/builder`, `/comunidad` |

**Modos → rutas:**

| Modo | Destino |
|---|---|
| ⚡ Operar | `/gali-v3/vista/operacion-hoy` |
| 🚀 Lanzar | `/gali-v3/proyecto/collar-gps-2026` |
| 📊 Medir | `/gali-v3/vista/rentabilidad-semana` |
| 🔧 Construir | `/gali-v3/builder` |
| 🌐 Comunidad | `/gali-v3/comunidad` |

### Capa D — Highlight + Recetas chat-first + Blender

| Item | Enfoque prototipo |
|---|---|
| Resaltado contextual | `canvas-highlight.service.ts` + clases terracota en block-wrapper |
| Recetas chat-first | Builder: entrada conversacional primero; nodos = modo revisión |
| Mi equipo | `/gali-v3/equipo` — mock básico 2 miembros |
| Blender split | **Spec-only** (WF-10) — ver §10 |

---

## 6. Especificaciones wireframe

### WF-1 · Panel Orquestador — FASE A · Pantalla 1

- **Tipo:** overlay persistente (⌘J)
- **Mock:** 3 agentes (activo/esperando/pausa) + 5 señales (sig-2 con loop cerrado)
- **Interacciones:** expandir agentes/señales; ejecutar señal → mock 2s → resultado; pausar agente; "Crear receta" post-resultado
- **Tokens:** terracota Gali, no azul

### WF-2 · Onboarding "Gali ya está trabajando" — FASE A · Pantalla 2

- **Ruta:** `/gali-v3/onboarding` (paso 4 evolucionado)
- **Mock:** checklist 4 ítems + 4 hallazgos Collar GPS
- **CTA:** "Ver qué encontró Gali" → `/vista/operacion-hoy?panel=open` + panel agentes activos
- **Skip:** persiste hallazgos en localStorage

### WF-3 · Vigilante Logístico — FASE A · Pantalla 3

- **Componente:** `block-vigilante-logistico`
- **Mock:** 3 alertas críticas + 4 transportadoras + receta activa
- **CTAs:** Ver pedidos (filtro novedad) · "Gali, inicia reclamo" → agente activo en panel

### WF-4 · Rentabilidad Real — FASE A · Pantalla 4

- **Componente:** `block-rentabilidad`
- **Mock:** P&L Collar GPS 5 líneas + ROAS real vs mostrado
- **CTAs:** Analizar Cali (highlight + chat) · Ver receta de protección

### WF-5-C · Operación hoy — FASE A · Pantalla 5

- **Ruta:** `/gali-v3/vista/operacion-hoy`
- **Layout:** 6 widgets incluyendo WF-3 + WF-4
- **Default:** panel Gali abierto · header `⚡ Operando · Hoy`

### WF-5 · Mapa proveedor enriquecido — FASE B

- Extender `business-map.json` — 3 proveedores con KPIs stock/precio/cumplimiento
- Click nodo → backlinks + navegación

### WF-6 · Backlinks — FASE B

- Panel "Conectado con…" en right-panel al seleccionar entidad
- 5 backlinks mock Collar GPS

### WF-7 · Vista rentabilidad-semana — FASE B

- **Ruta:** `/gali-v3/vista/rentabilidad-semana`
- Preset modo 📊 Medir: P&L + campañas + vigilante + wallet

### WF-8 · Recetas chat-first — FASE B

- Builder: textarea + ejemplos primero; canvas nodos toggle "Ver como nodos"
- Renombrar triggers → "Cuando pase esto…"

### WF-9 · Mi Equipo — FASE B

- **Ruta:** `/gali-v3/equipo`
- Mock: dueño + asistente + toggle WhatsApp + actividad reciente

### WF-10 · Blender split — FASE B · SPEC ONLY

> **No implementado en prototipo** — requiere layout engine nuevo.

- Drag esquina → split horizontal/vertical
- Selector módulo por zona
- Desbloqueo por maestría `estratega`
- Persistencia localStorage por modo
- **Prerequisito:** validación externa con dropshippers post-Fase A

---

## 7. Lo que NO cambiar

- ⌘K Command Palette (+ acciones "Ver agentes activos", "Modo Operar")
- Proyectos con memoria (`project.service.ts`)
- Plantillas mercado para novatos
- Comunidad / Objetivo / Mi Stack Phase 1
- Bloque-builder Tier 2 (renombrar UI, no lógica)
- Tokens `_gali-v3-tokens.scss`

---

## 8. Métricas de éxito

### Fase A — Equipo interno

Ver criterios go/no-go §3.

### Fase B — Dropshippers (Duvan, Alejandra, Cristhian)

- ¿Distinguen Receta vs Tablero vs Vista?
- Comfort con autonomía (escala mock maestría)
- ¿Mapa/backlinks ayudan a decidir qué revisar?

---

## 9. Archivos clave

| Fase | Crear / modificar |
|---|---|
| **A** | `gali-right-panel.*`, `agent-orchestrator.service.ts`, `signals.*`, `workspace-context.service.ts`, `onboarding/*`, `block-vigilante-logistico`, `block-rentabilidad`, `vista/operacion-hoy` |
| **B** | `gali-navigator.*`, `business-map.json`, `backlinks.service.ts`, `canvas-highlight.service.ts`, `builder/*`, `equipo/*`, topbar modos |

---

*Gali V4.1 · Workspace + Grafo + Orquestador visible · Mayo 2026*  
*Cata Giraldo · catalina.giraldo@dropi.co*  
*Siguiente paso: sesión go/no-go con equipo interno*

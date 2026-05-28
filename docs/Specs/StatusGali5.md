# Status — Gali V5 (Dropi como Orquestador Total)

> **Palabra clave para retomar:** `ContinuarGali5`
>
> Cuando el usuario escriba esta palabra en una conversación nueva, leer este archivo + `docs/Specs/Gali5.md` + el plan en `/Users/user/.claude/plans/necesito-que-leas-archivo-mutable-pretzel.md`, revisar el estado por sprint abajo, y continuar desde la siguiente fase pendiente.

---

## Snapshot

- **Spec completa:** `docs/Specs/Gali5.md` (1.633 líneas — todos los módulos, agentes, matrix, wireframes, roadmap)
- **Plan de implementación:** `/Users/user/.claude/plans/necesito-que-leas-archivo-mutable-pretzel.md`
- **Navigation map:** `navigation-map.json` — módulo `gali-v5` con todas las rutas registradas
- **Stack:** Angular 17.3 Standalone · SCSS · PrimeNG 17 · Mock API interceptor
- **Rutas base:** `/gali-v5/*` — `src/app/pages/gali-v5/`
- **Mocks:** `mocks/gali-v5/` (17 archivos JSON)
- **Dev server:** `npx ng serve` → http://localhost:4200/gali-v5
- **Última actualización:** 2026-05-28
- **Rama:** `main`

---

## Contexto: qué es Gali V5

Gali V5 NO es una sección de Dropi — es la **capa de inteligencia** que atraviesa todo Dropi. Se construye sobre el baseline de `gali-v5` (shell con FAB, rail 56px, panel 200px, 23 vistas base del Figma).

**La premisa central:** El dropshipper declara un objetivo → Gali coordina 3 agentes especializados → el resultado es visible con loop cerrado (señal → acción → resultado → siguiente paso propuesto).

**Los 3 agentes del orquestador:**
- **ADA Spy** — Producto Research: evalúa rentabilidad, saturación, competencia
- **Roax** — Media Buyer: configura campañas, escala/pausa según ROAS/CTR, detecta saturación
- **Chatea Pro** — Cierre & Logística: WhatsApp confirmaciones, recuperación carritos, novedades

---

## Estado por Sprint

### Sprint 1 — Gali Hub ✅ COMPLETADO

**Qué hace:** Reemplazó la home `/gali-v5` con el puente de mando del orquestador.

| Elemento | Archivo | Estado |
|---|---|---|
| Header objetivo oscuro (gradiente, barra progreso, toggle modo) | `home/home.component.{ts,html,scss}` | ✅ |
| 3 agent cards con borde-estado y dot pulsante | idem | ✅ |
| Señales del día (crítica roja / ok verde / sugerencias naranjas) | idem | ✅ |
| KPIs de hoy ($411k, 47 pedidos, ROAS 2.9x, $66k/día) | idem | ✅ |
| Loop cerrado horizontal (5 chips con antes→resultado→CTA) | idem | ✅ |
| Mis Proyectos (3 rows linkeados a `/gali-v5/proyecto/:id`) | idem | ✅ |

---

### Sprint 2 — Proyecto Detalle ✅ COMPLETADO

**Qué hace:** Vista unificada de un proyecto con todos los agentes coordinados + loop de acciones + P&L real.

| Elemento | Archivo | Estado |
|---|---|---|
| Hero con pipeline de 5 stages (coloreados por estado) | `pages/proyecto/proyecto-detalle-page.component.{ts,html,scss}` | ✅ |
| Gali Alert Bar en naranja (acción inline) | idem | ✅ |
| 7 tabs: Resumen / Producto / Estrategia / Creativos / Campañas / Pedidos / P&L Real | idem | ✅ |
| Tab Resumen: 6 métricas + 3 agent rows + loop del proyecto + memoria Gali | idem | ✅ |
| Tab Creativos: Video B (ganador), Video A (pausado), banners, card "Generar nuevo" | idem | ✅ |
| Tab P&L Real: desglose completo + comparativa ROAS declarado vs real vs gap | idem | ✅ |
| Tabs Producto/Estrategia/Campañas/Pedidos: placeholder con link al módulo correspondiente | idem | ✅ |
| Modal Diagnóstico Cross-Data: abre desde "Ver análisis" del P&L tab | `components/diagnostico-modal/` | ✅ |
| Modal Skills Editor: abre desde "Ver reglas" en cada agent row | `components/skills-editor-modal/` | ✅ |

---

### Sprint 3 — Marketplace + Modales ✅ COMPLETADO

**Qué hace:** Ecosistema de skills de comunidad + editor de reglas + diagnóstico cruzado.

| Elemento | Archivo | Estado |
|---|---|---|
| Marketplace `/gali-v5/marketplace` — 20 skills, filtros por agente/tipo, instalación reactiva | `pages/marketplace/marketplace-page.component.*` | ✅ |
| Diagnóstico Cross-Data modal — hipótesis % + evidencias expandibles + acciones seleccionables | `components/diagnostico-modal/diagnostico-modal.component.*` | ✅ |
| Skills & Rules Editor wizard 3 pasos — trigger + acción + dry-run simulación + activar | `components/skills-editor-modal/skills-editor-modal.component.*` | ✅ |
| Mocks para skills, diagnóstico y reglas del usuario | `mocks/gali-v5/skills-marketplace.json`, `diagnostico-cross-data.json`, `user-rules.json` | ✅ |

---

### Sprint 4 — Módulos existentes con capa Gali ✅ COMPLETADO

**Qué hace:** Integra el layer de Gali sobre las 4 vistas de mayor uso diario.

| Módulo | Ruta | Qué se añadió | Estado |
|---|---|---|---|
| **Órdenes** | `/gali-v5/mis-pedidos/mis-pedidos` | Triage banner (auto/managing/decisión) + chips por fila + row highlight para decisiones | ✅ |
| **Novedades** | `/gali-v5/mis-pedidos/novedades` | Clasificación automática por tipo (Recuperable/Irreversible/Por cliente/Transportadora) + botón "✦ Gali resuelve" + badge "Resuelta por Gali" | ✅ |
| **ROAX Informes** | `/gali-v5/marketing/roax-informes` | Caja oscura ROAS real vs declarado (4 boxes) + health indicator campañas (semáforo) + reglas activas de Roax | ✅ |
| **Dashboard** | `/gali-v5/reportes/dashboard` | Banner oscuro P&L gap: ganancia real $18.9M vs Meta $27.9M + link diagnóstico | ✅ |

---

## ⚠️ Pendiente — 11 Módulos sin capa Gali

Estas vistas existen como baseline Figma pero **no tienen la inteligencia de Gali** todavía:

| Módulo | Ruta | Agente responsable | Qué añadir | Mock disponible | Prioridad |
|---|---|---|---|---|---|
| **Torre Logística** | `/gali-v5/logistica/torre-logistica` | Vigilante Logístico | Panel "Vigilante activo": N pedidos monitoreados + log de swaps automáticos de transportadora + proyección de novedades | — | 🔴 Alta |
| **CAS / Bandeja** | `/gali-v5/cas/bandeja` | Chatea Pro | Clasificación "Chatea Pro gestionando" por conversación + estado del flujo (en proceso / requiere humano) + contador resueltas hoy | `cas-tickets.json` | 🔴 Alta |
| **Chatea Pro** | `/gali-v5/marketing/chatea-pro` | Chatea Pro | Estado en tiempo real de conversaciones activas + tasa de confirmación actual + anticipo pendientes zona rural | — | 🟡 Media |
| **Garantías** | `/gali-v5/mis-pedidos/garantias` | Vigilante | Clasificación automática por tipo + detección fraude (mismo tel múltiples garantías) + SLA tracker | — | 🟡 Media |
| **Historial Wallet** | `/gali-v5/financiero/historial-de-cartera` | Agente Financiero | Banner "Fecha óptima de retiro: X" + alerta de discrepancia si saldo ≠ esperado + P&L período | `wallet-transactions.json` | 🟡 Media |
| **Catálogo** | `/gali-v5/productos/catalogo` | ADA Spy | Badge de score ADA Spy por producto (0-100) + tag de saturación (Oportunidad/Creciendo/Saturado) + "Ventana: N días" | — | 🟡 Media |
| **Caza Productos** | `/gali-v5/productos/caza-productos` | ADA Spy | Score de viabilidad prominente + match con perfil del dropshipper + "Esta semana: N ventas en Dropi LATAM" | — | 🟡 Media |
| **Campañas Marketing** | `/gali-v5/marketing/campanas` | Roax | Health indicator por campaña + señal de estado Roax (escala/pausa/alerta) | `marketing-campanas.json` | 🟡 Media |
| **Validador Direcciones** | `/gali-v5/mis-pedidos/validador-direcciones` | Vigilante | Tag de "zona rural" automático + regla anticipo aplicada | `validador-addresses.json` | 🟢 Baja |
| **ROAX Lanzador** | `/gali-v5/marketing/roax-lanzador` | Roax | Pre-llenado desde Proyecto activo: parámetros de ADA Spy ya validados | — | 🟢 Baja |
| **Transportadoras** | `/gali-v5/logistica/transportadoras` | Vigilante | Recomendación dinámica Gali por tasa entrega de la semana (no el histórico) | — | 🟢 Baja |

---

## 🔴 Pendiente crítico — Shell / FAB (el más impactante sin construir)

El **FAB de activación del Modo Gali** es la interacción central que conecta todo, y aún no está construida:

### Qué debe hacer el FAB mejorado

```
Estado normal (Mode 0):
  FAB naranja pulsando suavemente
  Badge contador de señales activas (ej. "3")
  Click → activa Mode 1

Mode 1 — Gali Activo:
  Panel derecho desliza desde la derecha (380px)
  3 tabs: Chat | Agentes | Señales
  Topbar: badge de señales críticas + indicador "N agentes corriendo"
  Cada módulo activo muestra chip ✦ para diagnóstico contextual
  ⌘K command palette disponible

Mode 2 — Autopiloto (toggle en topbar):
  Gali opera en background
  Notificaciones push de acciones ejecutadas
  Solo escala al humano cuando hay decisión estratégica
  Daily report automático
```

### Archivos a crear/modificar para el FAB

| Archivo | Cambio |
|---|---|
| `gali-v5-shell.component.ts` | Signal `galiMode: 0|1|2` + lógica de apertura del right panel |
| `gali-v5-shell.component.html` | Condición `*ngIf="galiMode() > 0"` para el right panel |
| `gali-v5-shell.component.scss` | Transición del panel (slide-in 250ms ease-out) |
| `components/dropi-menu-action.component.ts` | Badge contador en FAB + toggle de modo |
| (nuevo) `components/gali-right-panel.component.*` | Panel derecho: Chat / Agentes activos / Señales |

### El Right Panel (Gali Mode 1)

```
┌─────────────────────────────────────────────┐
│  [Chat] [Agentes] [Señales]                 │  ← tabs
├─────────────────────────────────────────────┤
│  TAB CHAT:                                   │
│  Historial de conversación con Gali          │
│  Input de texto + voz                        │
│  Quick actions contextuales                  │
│                                              │
│  TAB AGENTES:                                │
│  ADA Spy ● activo — "monitoring 3 productos" │
│  Roax ● activo — "ROAS 2.9x pauta $66k"     │
│  Chatea Pro ● activo — "43/47 confirmados"  │
│  [Pausar todos] [+ Agregar agente]           │
│                                              │
│  TAB SEÑALES:                                │
│  ⚠ Crítica: Coordinadora Bogotá 15% novedad │
│  ✓ Info: 8 novedades resueltas              │
│  💡 Sugerencia: Video B mejor CTR           │
└─────────────────────────────────────────────┘
```

---

## Consideraciones técnicas

### Tokens de diseño (siempre usar)
```scss
// Fondo principal (NO blanco puro)
$hub-bg: #fafaf8;

// Cards
$hub-card: #ffffff;
$hub-border: #e5e7eb;

// Textos
$hub-text: #1c1c1e;
$hub-muted: #6b7280;
$hub-caption: #9ca3af;

// Semánticos
$hub-success: #10b981;
$hub-warning: #f59e0b;
$hub-danger: #ef4444;
$hub-info: #3b82f6;

// DS primary (siempre usar $primary-500, no hardcodear)
// $primary-500: #f49a3d (naranja Dropi)
```

### Patrón de cards con acento de estado (usar en todos los agentes)
```scss
.agent-card {
  border-left: 3px solid [estado-color];
  // activo → $hub-success (#10b981)
  // esperando → $hub-warning (#f59e0b)
  // pausado → $hub-border (#e5e7eb)
}
```

### Dot pulsante para agentes activos
```scss
@keyframes pulseDot {
  0%, 100% { box-shadow: 0 0 0 0 rgba($hub-success, 0.4); }
  50%       { box-shadow: 0 0 0 5px rgba($hub-success, 0); }
}
// duration: 2s infinite
```

### Anti-hallucination: Angular templates
- **NO usar `ñ`** en expresiones de templates Angular — causa NG5002. Renombrar a `signal`, `galiMessage`, `signalType`, etc.
- **NO usar `as any`** en templates — extraer a método del componente.
- **Siempre verificar compilación** (`npx ng build --configuration=development`) antes de declarar terminado.

### Patrón de layout scroll interno (obligatorio en todas las páginas)
```scss
:host {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.page-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: $size-4 $size-8;
}
```

### Añadir capa Gali a módulos existentes (sin romper lo que hay)
El patrón para Sprint 4 que funcionó: agregar clases con prefijo `.gali-` al final del SCSS existente, no modificar las clases base. Ejemplo:
```scss
// Al final del archivo SCSS del módulo:
.gali-triage-bar { ... }
.gali-chip { ... }
.gali-nov-banner { ... }
```

### Modales (overlay pattern)
```scss
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $size-5;
}
// El contenido del modal: max-height 90vh, display flex, flex-direction column
// Body del modal: min-height explícito (no flex:1 que colapsa el grid interno)
```

### Auth para testing headless
```javascript
// Inyectar auth en localStorage antes de navegar (Playwright)
await page.evaluate(() => {
  localStorage.setItem('dropi_auth_user', JSON.stringify({
    id: "USR-001", name: "Valentina Mejía",
    email: "valentina@dropi.co", role: "dropshipper",
    isActive: true
  }));
});
```

---

## Estructura de archivos clave

```
src/app/pages/gali-v5/
├── home/                          ← Gali Hub (Sprint 1) ✅
├── pages/
│   ├── proyecto/                  ← Proyecto Detalle (Sprint 2) ✅
│   ├── marketplace/               ← Marketplace Skills (Sprint 3) ✅
│   ├── orders/                    ← Órdenes + Gali triage (Sprint 4) ✅
│   ├── novedades/                 ← Novedades + clasificación Gali (Sprint 4) ✅
│   ├── marketing/
│   │   └── roax-informes-page.*   ← ROAX + ROAS real vs declarado (Sprint 4) ✅
│   ├── reportes/
│   │   └── report-dashboard-kpi-page.* ← Dashboard + P&L banner (Sprint 4) ✅
│   ├── [otros módulos sin capa Gali...] ← Pendiente
├── components/
│   ├── diagnostico-modal/         ← Modal diagnóstico cruzado (Sprint 3) ✅
│   ├── skills-editor-modal/       ← Wizard skills editor (Sprint 3) ✅
│   ├── dropi-menu-action.*        ← FAB — MEJORAR para activar Modo Gali ⚠️
│   └── shared/
├── gali-v5.routes.ts              ← Rutas (proyecto/:id + marketplace añadidas)
└── gali-v5-shell.component.*      ← Shell — AÑADIR right panel lógica ⚠️

mocks/gali-v5/
├── orders.json                    ← Órdenes (usado) ✅
├── novedades.json                 ← Novedades (usado) ✅
├── marketing-roax-informes.json   ← ROAX (usado) ✅
├── skills-marketplace.json        ← Marketplace (datos hardcodeados en TS, mock de ref) ⚠️
├── user-rules.json                ← Skills editor (datos hardcodeados en TS, mock de ref) ⚠️
├── diagnostico-cross-data.json    ← Diagnóstico (datos hardcodeados en TS, mock de ref) ⚠️
├── cas-tickets.json               ← CAS Bandeja — sin usar, lista para conectar
├── wallet-transactions.json       ← Wallet — sin usar, lista para conectar
├── marketing-campanas.json        ← Campañas — sin usar, lista para conectar
└── validador-addresses.json       ← Validador — sin usar, lista para conectar
```

---

## Mocks pendientes de conectar a componentes reales

Los modales y el Marketplace actualmente usan datos hardcodeados en el TS del componente. Cuando se quiera conectar a los JSONs:

| Mock | Componente a actualizar | Qué cambiar |
|---|---|---|
| `skills-marketplace.json` | `marketplace-page.component.ts` | Importar el JSON e inicializar `allSkills` desde él en lugar del array hardcodeado |
| `user-rules.json` | `skills-editor-modal.component.ts` | Importar para inicializar `reglas` y `triggers_disponibles` |
| `diagnostico-cross-data.json` | `diagnostico-modal.component.ts` | Importar para `hipotesis` y `acciones` (actualmente hardcodeados) |
| `cas-tickets.json` | `cas/cas-bandeja-page.component.ts` | Añadir la capa de clasificación Gali por tipo de ticket |
| `wallet-transactions.json` | `financiero/wallet-page.component.ts` | Añadir banner de Agente Financiero + fecha óptima retiro |

---

## Heurísticas Nielsen aplicadas por vista

| Vista | Heurísticas principales |
|---|---|
| Gali Hub | H1 (estado del sistema visible en tiempo real), H8 (diseño minimalista — señales colapsadas por defecto) |
| Proyecto Detalle | H1 (pipeline de estados), H6 (memoria Gali siempre visible — no hay que recordar decisiones pasadas) |
| Diagnóstico Cross-Data | H2 (lenguaje del dropshipper), H13-AI (probabilidad explícita, no certeza absoluta) |
| Skills Editor | H5 (vista previa antes de guardar), H9 (dry-run detecta conflictos) |
| Marketplace | H2 (nombres en lenguaje real), H6 (reconocimiento — thumbnails del agente) |
| Órdenes (Sprint 4) | H1 (triage visible al entrar, no hay que buscar) |
| Novedades (Sprint 4) | H7 (eficiencia — "✦ Gali resuelve" en 1 clic), H8 (tags de clasificación sin ruido) |
| ROAX Informes (Sprint 4) | H9 (gap ROAS declarado vs real — ayuda a reconocer el error), H13-AI (ganancia real, no la que Meta reporta) |
| Dashboard (Sprint 4) | H1 (el gap es lo primero visible), H9 (causa explicada inline) |

---

## Límites inamovibles de Gali (no prototipar como autónomo)

Nunca mostrar en el prototipo que Gali:
1. **Mueve dinero** sin aprobación explícita del dropshipper
2. **Cancela campañas** completamente (puede pausar temporalmente)
3. **Toma decisiones de nicho** (propone, el humano confirma)
4. **Comparte datos** del negocio del dropshipper con otros usuarios
5. **Actúa** en áreas donde no tiene contexto suficiente (prefiere preguntar)

---

## Próxima acción sugerida

**Opción A — Alto impacto visual (si el objetivo es demo):**
Construir el FAB mejorado → Right Panel (Modo Gali activo). Una sola interacción que cambia la percepción de todo el prototipo. Tiempo estimado: 1 sprint.

**Opción B — Completar la cobertura (si el objetivo es exhaustividad):**
Torre Logística + CAS Bandeja → son los dos módulos más usados diariamente después de Órdenes y tienen los agentes Vigilante y Chatea Pro más visibles. Tiempo estimado: 1 sprint.

**Opción C — Conectar mocks reales a los modales:**
Los 3 modales (Diagnóstico, Skills Editor, Marketplace) usan datos hardcodeados. Conectarlos a sus JSONs hace el prototipo más mantenible y fácil de actualizar para demos.

---

*Gali V5 · Dropi AI Orchestrator · Cata Giraldo · catalina.giraldo@dropi.co*
*Última actualización: 2026-05-28*

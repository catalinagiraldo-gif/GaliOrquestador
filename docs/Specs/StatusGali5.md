# Status — Gali V5 (Dropi como Orquestador Total)

> **Palabra clave para retomar:** `ContinuarGali5`
>
> Cuando el usuario escriba esta palabra en una conversación nueva, leer este archivo + `docs/Specs/Gali5.md` + el plan en `/Users/user/.cursor/plans/gali_v5_deep_reconstruction_3b6bb392.plan.md`, revisar el estado por sprint abajo, y continuar desde la siguiente fase pendiente.

---

## Snapshot

- **Spec completa:** `docs/Specs/Gali5.md` (v5.1 — incluye §12 Deep Reconstruction V1–V10)
- **Plan de implementación (Deep Reconstruction):** `/Users/user/.cursor/plans/gali_v5_deep_reconstruction_3b6bb392.plan.md`
- **Navigation map:** `navigation-map.json` — módulo `gali-v5` con rutas registradas
- **Stack:** Angular 17.3 Standalone · SCSS · PrimeNG 17 · Mock API interceptor
- **Rutas base:** `/gali-v5/*` — `src/app/pages/gali-v5/`
- **Mocks:** `mocks/gali-v5/` (20+ archivos JSON)
- **Dev server:** `npx ng serve` → http://localhost:4200/gali-v5
- **Build:** `npx ng build --configuration=development` ✅ limpio (2026-05-29 — post-arquitectura)
- **Última actualización:** 2026-05-29
- **Rama:** `main`

---

## Contexto: qué es Gali V5

Gali V5 NO es una sección de Dropi — es la **capa de inteligencia** que atraviesa todo Dropi.

**La premisa central:** El dropshipper declara un objetivo → Gali coordina agentes especializados → el resultado es visible con loop cerrado (señal → acción → resultado → siguiente paso).

**Los agentes del orquestador:**
- **ADA Spy** — Producto Research
- **Roax** — Media Buyer
- **Chatea Pro** — Cierre & Logística
- **Vigilante** — Logística / novedades
- **Agente Financiero** — P&L / wallet

---

## Deep Reconstruction — Estado V1–V10 (Mayo 2026)

| ID | Vista | Route | Estado | Notas |
|---|---|---|---|---|
| V1 | Gali Hub + Health Grid | `/gali-v5` | 🟡 Parcial | Grid 9 secciones + SCSS ✅. Falta layout 60/40, FAB badge cross-sección |
| V2 | Proyectos List | `/gali-v5/proyectos` | ✅ | GaliBar + modal Crear Proyecto integrado. Falta ampliar a 6 proyectos |
| V3 | Proyecto Detalle | `/gali-v5/proyecto/:id` | ✅ | Pipeline, tabs, P&L, modales |
| V4 | Modal Crear Proyecto | modal (proyectos + caza) | ✅ | Wizard 3 pasos conversacional. Abre desde Proyectos y Caza |
| V5 | Diagnóstico Cross-Data | modal | ✅ | `diagnostico-modal/` |
| V6 | Mis Skills | `/gali-v5/skills` tab 0 | ✅ | `user-skills.json`, filtros, stats |
| V7 | Crear Skill Wizard | `/gali-v5/skills` tab 1 | ✅ | 4 pasos inline en skills-page |
| V8 | Marketplace | `/gali-v5/skills` tab 2 | ✅ | Embed marketplace + redirect `/marketplace` |
| V9 | Caza Historial + Red Problemas | `/gali-v5/productos/caza-productos` | ✅ | 3 modos + `problem-network.json` + GaliChip + link a modal V4 |
| V10 | CAS PQR Intelligence | `/gali-v5/cas/bandeja` | 🟡 Parcial | Panel PQR 5 patrones ✅. Falta clasificación bandeja, 25+ tickets |

### Arquitectura Transversal — DropiGaliBarComponent (NUEVO)

| Elemento | Archivo | Estado |
|---|---|---|
| Componente reutilizable config-driven | `components/dropi-gali-bar/*` | ✅ NUEVO |
| Integrado en Catálogo | `catalog-page.component.*` | ✅ Migrado |
| Integrado en Órdenes | `orders-page.component.*` | ✅ Migrado |
| Integrado en Torre Logística | `torre-logistica-page.component.*` | ✅ Migrado |
| Integrado en Campañas Marketing | `campanas-page.component.*` | ✅ Migrado |
| Integrado en Financiero/Wallet | `wallet-page.component.*` | ✅ Migrado |
| Integrado en Reportes/Dashboard | `report-dashboard-kpi-page.component.*` | ✅ Migrado |
| Integrado en Proyectos List | `proyectos-list-page.component.*` | ✅ Migrado |
| Garantías, Chatea Pro, resto | garantias, chatea-pro, novedades | ⏳ |

### Transversal — GaliChipComponent (lightweight)

| Elemento | Archivo | Estado |
|---|---|---|
| Componente reutilizable | `components/gali-chip/*` | ✅ |
| Integrado en Caza | `caza-page.component.*` | ✅ |
| Integrado en Skills | `skills-page.component.*` | ✅ |
| Integrado en CAS | `cas-bandeja-page.component.*` | ✅ |

### Navegación — Skills + Proyectos como secciones de primer nivel

| Elemento | Archivo | Estado |
|---|---|---|
| Ruta `/gali-v5/skills` | `gali-v5.routes.ts` | ✅ |
| Redirect `/marketplace` → `/skills` | `gali-v5.routes.ts` | ✅ |
| Proyectos en icon rail | `dropi-sections.config.ts` | ✅ NUEVO |
| Skills en icon rail | `dropi-sections.config.ts` | ✅ NUEVO |
| Panel sección Proyectos | `dropi-sections.config.ts` | ✅ NUEVO |
| Panel sección Skills | `dropi-sections.config.ts` | ✅ NUEVO |
| HOME_OVERVIEW_PANEL simplificado | `dropi-sections.config.ts` | ✅ |

### Mocks nuevos (Deep Reconstruction)

| Mock | Uso | Estado |
|---|---|---|
| `user-skills.json` | V6 Mis Skills | ✅ conectado |
| `pqr-patterns.json` | V10 CAS PQR | ✅ conectado |
| `problem-network.json` | V9 Caza modos | ✅ conectado |
| `cas-tickets.json` | CAS bandeja | ✅ (ampliar a 25+) |
| `skills-marketplace.json` | V8 Marketplace | ⚠️ hardcode en TS |
| `user-rules.json` | Skills editor | ⚠️ hardcode en TS |
| `diagnostico-cross-data.json` | V5 Diagnóstico | ⚠️ hardcode en TS |

---

## Estado por Sprint (histórico)

### Sprint 1 — Gali Hub ✅

Objetivo oscuro, agentes, señales, KPIs, loop cerrado, mini-proyectos.

### Sprint 2 — Proyecto Detalle ✅

Pipeline, tabs, P&L, modales diagnóstico + skills editor.

### Sprint 3 — Marketplace + Modales ✅

Marketplace 20 skills, diagnóstico, editor wizard 3 pasos.

### Sprint 4 — Capa Gali en módulos ✅

Órdenes, Novedades, ROAX, Dashboard, Torre, CAS, Garantías, Campañas, Catálogo, Caza, Wallet.

### Sprint A — Fundación navegación + panel ✅

FAB, GaliStateService, GaliRightPanel, header objetivo, panel splitter.

### Sprint B — Agent Bar 4 módulos ✅

Torre, CAS, Garantías, Campañas.

### Sprint C — Agent Bar comerciales ✅

Catálogo, Caza, Wallet.

### Fase 2 — Funcionalidad real ✅

CAS dinámico, Chatea Pro operativo, CTAs navegables, Gali en sidebar Dropi, lista Proyectos.

---

## ⏳ Pendiente — Prioridad alta

1. **V10 CAS completo** — columnas clasificación Gali, filtro, banner PQR en ticket, ampliar mock tickets a 25+
2. **V1 Hub layout asimétrico** — 60/40 según plan, FAB badge total alertas cross-sección
3. **GaliBar en secciones restantes** — garantías, chatea-pro, novedades, validador
4. **Conectar mocks hardcodeados** — marketplace, user-rules, diagnostico a JSON
5. **navigation-map.json** — registrar `/gali-v5/skills`, `/gali-v5/proyectos` y actualizar prototype fields
6. **Iconos conectores MCP** — `src/assets/icons/connectors/` (10 SVG)

## ⏳ Pendiente — Prioridad baja

| Módulo | Qué añadir |
|---|---|
| Chatea Pro (página) | Agent bar + status panel tiempo real |
| Validador Direcciones | Tag "zona rural" automático |
| ROAX Lanzador | Pre-llenado desde Proyecto activo |
| Transportadoras | Recomendación dinámica por tasa semanal |

---

## Consideraciones técnicas

### Tokens de diseño
Usar `src/styles/_variables.scss` + `src/styles/_gali-v5-tokens.scss` para `$primary-500`–`700`.

### Anti-hallucination Angular
- **NO usar `ñ`** en templates — NG5002
- **NO `$radius-1` / `$radius-2`** — usar `$radius-sm`, `$radius-md`, `$radius-lg`
- **SCSS imports en components/** — 5 niveles: `../../../../../styles/variables`
- Verificar build antes de declarar terminado

### Patrón DropiGaliBar (agente en sección)
```html
<dropi-gali-bar
  agent="ADA Spy"
  status="analizando catálogo"
  message="3 oportunidades detectadas"
  ctaLabel="Solo oportunidades"
  secondaryCta="Cómo funciona"
  (ctaClick)="onCta()"
/>

<!-- Con stats chip array -->
<dropi-gali-bar
  agent="Chatea Pro"
  status="gestionando"
  [stats]="[{value: 31, label: 'confirmadas', variant: 'ok'}, ...]"
  ctaLabel="Ver pendientes"
/>
```

### Patrón GaliChip (inline contextual)
```html
<gali-chip
  agentName="ADA Spy"
  message="1 oportunidad detectada"
  [count]="1"
  status="running"
  ctaLabel="Ver oportunidades"
  (ctaClick)="onCta()"
/>
```

### Modal Crear Proyecto (V4)
```html
<crear-proyecto-modal
  (closed)="showModal.set(false)"
  (created)="onCreated($event)"
/>
```

### Layout scroll interno
```scss
:host { display: block; width: 100%; height: 100%; overflow: hidden; }
.page-wrapper { height: 100%; overflow-y: auto; padding: $size-4 $size-8; }
```

---

## Estructura de archivos clave (post Deep Reconstruction — Arquitectura unificada)

```
src/app/pages/gali-v5/
├── home/                              ← V1 Hub + health grid 🟡
├── pages/
│   ├── skills/                        ← V6–V8 ✅
│   ├── caza-productos/                ← V9 ✅ + link V4
│   ├── cas/                           ← V10 🟡
│   ├── proyectos/                     ← V2 ✅ + V4 modal
│   ├── proyecto/                      ← V3 ✅
│   ├── catalog/                       ← DropiGaliBar ✅
│   ├── orders/                        ← DropiGaliBar ✅
│   ├── logistica/torre/               ← DropiGaliBar ✅
│   ├── marketing/campanas/            ← DropiGaliBar ✅
│   ├── financiero/wallet/             ← DropiGaliBar ✅
│   └── reportes/dashboard/            ← DropiGaliBar ✅
├── components/
│   ├── dropi-gali-bar/                ← NUEVO ✅ Componente unificado por sección
│   ├── crear-proyecto-modal/          ← NUEVO ✅ Wizard V4
│   ├── gali-chip/                     ← inline contextual
│   ├── gali-right-panel/
│   ├── diagnostico-modal/
│   ├── skills-editor-modal/
│   └── dropi-panel-splitter/
├── services/gali-state.service.ts
├── dropi-sections.config.ts           ← proyectos + skills en icon rail
└── gali-v5.routes.ts

mocks/gali-v5/
├── user-skills.json
├── pqr-patterns.json
├── problem-network.json
└── [17 archivos existentes]
```

---

## Próxima acción sugerida

**Opción A — V10 CAS completo:** Clasificación bandeja Gali, 25+ tickets mock, filtro PQR. Cierra el loop PQR → acción.

**Opción B — V1 Hub layout 60/40:** Asimetría visual, FAB con badge de alertas totales cross-sección.

**Opción C — Conectar mocks hardcodeados:** marketplace, user-rules, diagnostico a JSON real.

---

*Gali V5 · Dropi AI Orchestrator · Cata Giraldo · catalina.giraldo@dropi.co*
*Última actualización: 2026-05-29 · Arquitectura unificada — DropiGaliBar + V4 Modal + Rail Proyectos/Skills*

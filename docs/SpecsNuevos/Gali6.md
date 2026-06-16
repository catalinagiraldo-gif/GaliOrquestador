# Gali 6 — "La Casita Definitiva" · Documento de Estado

> **Keyword de reanudación:** `ContinuarGali6`
> **Última actualización:** 2026-06-16
> **Fuentes:** `docs/SpecsNuevos/ultimate-plan.md` · `docs/SpecsNuevos/gali-projects-plan.md`

---

## ¿Cómo retomar?

Cuando quieras continuar el proceso de Gali 6, escribe:

```
ContinuarGali6
```

Claude leerá este archivo, verificará el estado de compilación, y continuará desde donde quedó.

---

## Qué es Gali 6

Gali 6 es la versión definitiva del hub orquestador de Dropi. Convive con Gali 5 (archivada bajo `/gali-5`) y vive en `/gali-6`. La premisa: **Gali es el Director de E-commerce que el dropshipper nunca pudo pagar** — no un dashboard, no un CRM con IA.

Ruta raíz: `/gali-6`
Carpeta: `src/app/pages/gali-6/`
Shell: `gali-6-shell.component.ts/html/scss`

---

## Estado de implementación al 2026-06-16

### ✅ TODO IMPLEMENTADO (Sprint 0-A → 0-D + Specs 13–17)

#### Shell y Chrome
- `gali-6-shell.component.*` — topbar con modo básico/experto, barra de progreso de meta, wallet toggle, icon rail 72px, section nav agrupado
- ZeroState onboarding 3 pasos (P0: meta pedidos, P1: fricción, P2: canal) + pantalla de confirmación
- Micro-onboarding modo experto: aparece primera vez que se activa, slide card oscura desde topbar derecho (`experto-slide`)
- Icon rail: `gali-6-icon-rail.component.ts` — iconos SVG de sidebar, rutas `/gali-6/*`
- Section nav filtrado por modo: oculta `centro-gali` en modo básico
- FAB flotante de Gali: `gali6-fab.component.ts`

#### Home (Bloque "Hoy")
- `gali-6/home/gali6-hoy-home.component.*`
- **Bloque 1 · Estado:** título de saludo + KPIs + badge "Semanal" + sparkline + % meta
- **Bloque 2 · Decisión:** `GaliDecisionTheaterComponent` (máx 1 decisión/día) + toast de feedback al tomar decisión + modo calma cuando está resuelta + toggle "delegar a Gali"
- **Bloque 3 · Impacto:** 4 stats de lo que hizo Gali esta semana (desde `impact-ledger.json`)
- **Bloque 4 · Palanca:** próximo paso sugerido, CTA a `/gali-6/proyectos/nuevo`

#### Proyectos (La Casita)
- `gali-6/proyectos/gali6-proyectos-casa.component.*`
- **Bloque 1 · Objetivo:** texto, tipo (escalar/diversificar/recuperar), progreso con breakdown por proyecto, submetas, botón editar
- **Bloque 2 · Check-ins de Gali:** alertas activas con nivel de urgencia, propuestas de acción
- **Bloque 3 · Recomendaciones:** señales del mock + "por qué encaja con tu objetivo" (`porqueObjetivo`)
- **Bloque 4 · Portfolio:** tabla filtrable (activos/pausados/cerrados/borradores) con estado, contribución, ROAS, salud — **stagger animation** con `animationDelay` por índice (55ms × i)
- **Modal editar objetivo:** tipo picker + texto + meta + plazo + submetas
- **Modal editar proyecto:** budget slider + 4 agentes toggle + estado

#### Nuevo Proyecto (Brújula)
- `gali-6/proyectos/gali6-nuevo-proyecto.component.*`
- Calculadora Brújula: ingresa margen, precio, costo ads → Gali calcula ROAS break-even
- Launch animation overlay al crear proyecto

#### Proyecto Detalle (Canvas)
- `gali-6/proyectos/gali-6-proyecto-detalle-page.component.*`
- Variantes de estado: `recien_lanzado`, `pausado`, `cerrado` (con postmortem), `borrador`
- Timeline de acciones del agente (`ProyectoTimelineComponent`)
- Feed de acciones de agentes

#### Señales (Signal Center)
- `gali-6/senales/` — listado de señales con filtros, detalle modal

#### Impacto (Ledger)
- `gali-6/impacto/` — historial de acciones de Gali, tiempo liberado, pesos ahorrados

#### Centro de Control (solo modo experto)
- `gali-6/centro-control/` — visible solo en modo experto vía section nav

#### Rutas operacionales (lazy, apuntan a componentes gali-5)
Todas disponibles bajo `/gali-6/*`:
`productos`, `mis-pedidos`, `logistica`, `reportes`, `financiero`, `marketing`, `cas`, `academy`, `agentes`, `skills`, `reglas`, `marketplace`, `mi-negocio`

---

## Archivos clave

| Archivo | Descripción |
|---|---|
| `src/app/pages/gali-6/gali-6-shell.component.*` | Chrome principal, ZeroState, modo experto |
| `src/app/pages/gali-6/gali-6.routes.ts` | Todas las rutas lazy de Gali 6 |
| `src/app/pages/gali-6/gali-6-sections.config.ts` | Paneles de navegación por ruta |
| `src/app/pages/gali-6/home/gali6-hoy-home.component.*` | Home "Hoy" con 4 bloques |
| `src/app/pages/gali-6/proyectos/gali6-proyectos-casa.component.*` | Hub de proyectos |
| `src/app/pages/gali-6/proyectos/gali6-nuevo-proyecto.component.*` | Brújula + crear proyecto |
| `mocks/gali-v5/projects.json` | 12 proyectos en todos los estados |
| `mocks/gali-v5/senales.mock.ts` | Señales y alertas |
| `mocks/gali-v5/kpis-global.json` | KPIs semanales |
| `mocks/gali-v5/impact-ledger.json` | Historial de impacto de Gali |

---

## Mock Data

- **Proyectos** (`mocks/gali-v5/projects.json`): 12 proyectos — `en_escala`, `activo`, `pausado` (3), `recien_lanzado` (2), `cerrado` (3, con `postmortem`), `borrador` (2). Todos tienen `timeline` y `agent_actions`.
- **Señales** (`mocks/gali-v5/senales.mock.ts`): `MOCK_SENALES` + `MOCK_ALERTAS` exportados
- **KPIs** (`mocks/gali-v5/kpis-global.json`): pedidos semana, ROAS, revenue, etc.
- **Ledger** (`mocks/gali-v5/impact-ledger.json`): `summary_semana` con acciones, pesos ahorrados, horas

---

## Features implementados en sesión 2026-06-16

Estos 4 ítems estaban pendientes del `ultimate-plan.md §9` ("Should Have" / "Nice to Have"):

| # | Feature | Archivo(s) |
|---|---|---|
| 1 | Toast feedback al tomar decisión (bloque 2) | `gali6-hoy-home.component.ts/html/scss` |
| 2 | Badge "Semanal" en bloque de estado | `gali6-hoy-home.component.html/scss` |
| 3 | Micro-onboarding al activar modo experto | `gali-6-shell.component.ts/html/scss` |
| 4 | Stagger animation en items del portfolio | `gali6-proyectos-casa.component.html/scss` |

---

## Estado de compilación

```
Application bundle generation complete. [~10s]
```

Warnings existentes (pre-existentes, no bloqueantes):
- TypeScript optional chain en `GaliProjectPanelComponent` y `SkillEditorPageComponent`
- SASS deprecation `margin: -$size-1 -$size-2` en `gali6-nuevo-proyecto.component.scss:238`

---

## Posibles siguientes pasos

Al retomar con `ContinuarGali6`, verificar si hay algo en `ultimate-plan.md §9` aún pendiente o si el equipo tiene nuevas specs. Posibles ítems a explorar:

- [ ] Persistencia del objetivo entre sesiones (ya hay `localStorage` para meta; pendiente sincronizar subtareas)
- [ ] Animación de transición entre filtros del portfolio
- [ ] Vista móvil completa (responsive ya existe pero no se testeó en profundidad)
- [ ] Conexión del FAB de Gali con decisiones pendientes (actualmente abre panel genérico)
- [ ] Tests de accesibilidad (aria-labels, focus management en modales)

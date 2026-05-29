# Gali v5 — Business Operating System

**Versión**: 2.0 — OS Architecture  
**Fecha**: Mayo 2026  
**Estado**: En implementación activa

---

## ¿Qué es Gali?

Gali no es un asistente. Es el **sistema operativo del negocio dropshipping**. Gali orquesta agentes especializados, ejecuta automatizaciones (skills), y presenta un workspace configurable donde el operador puede intervenir en su negocio desde un solo lugar — sin navegar entre módulos dispersos.

**Antes**: Gali era un panel lateral con notificaciones y botones que "decían" que actuaban.  
**Ahora**: Gali es el shell oscuro con 5 modos de workspace donde cada señal tiene un loop completo de intervención.

---

## Arquitectura de 3 Capas

```
CAPA 1 — WORKSPACE OS (shell)
  5 modos con layouts de paneles distintos
  Cambiar de modo reconfigura el workspace visualmente

CAPA 2 — INTERVENTION LAYER (señales accionables)
  Cada señal abre contexto completo con opciones A/B/C
  Aprobar / rechazar / modificar en el mismo panel
  Resultado visible inmediatamente con before/after

CAPA 3 — SKILLS RUNTIME (automatizaciones vivas)
  Skill = Trigger + Condición + Acción + Notificación
  Historial de ejecución por skill
  Estado live: activo / ejecutando / pausado
```

---

## Estética: Dark Command OS

Gali tiene un shell oscuro que lo distingue visualmente del Dropi tradicional. El contraste señala: "estás en el OS, no en un módulo de producto".

| Token | Valor | Uso |
|---|---|---|
| `$os-bg` | `#0e0e10` | Fondo del workspace |
| `$os-surface` | `#17171a` | Paneles y headers |
| `$os-surface-2` | `#1e1e23` | Cards dentro de paneles |
| `$os-surface-3` | `#252529` | Hover / filas seleccionadas |
| `$os-accent` | `#ff6102` | Naranja Dropi — brand continuidad |
| `$os-ok` | `#22c55e` | Estado positivo / activo |
| `$os-warn` | `#f59e0b` | Alertas / decisiones |
| `$os-crit` | `#ef4444` | Señales críticas |
| `$os-font-display` | `'Syne'` | Títulos del OS |
| `$os-font-body` | `'DM Sans'` | Cuerpo y labels |

Tokens definidos en: `src/styles/_gali-os-tokens.scss`

---

## Los 5 Modos de Workspace

La barra de modos (`GaliWorkspaceModeBarComponent`) es siempre visible. Cada modo reconfigura el layout de paneles sin navegación.

| Modo | Ícono | Layout | Panel 1 | Panel 2 | Panel 3 |
|---|---|---|---|---|---|
| **Operar** | ⚡ | 3 col | Señales (accionables) | Proyectos (con contexto) | Agentes live |
| **Lanzar** | 🚀 | 2 col | Conversación con Gali | Oportunidades ADA Spy | — |
| **Medir** | 📊 | 2 col | P&L por proyecto | Campañas + atribución | — |
| **Construir** | 🔧 | 2 col | Lista de skills activas | Historial + marketplace | — |
| **Comunidad** | 🌐 | Full | Marketplace de skills | — | — |

El cambio de modo es inmediato (transición CSS, no navegación). Estado gestionado por `GaliWorkspaceService`.

---

## Componentes Críticos

### GaliWorkspaceService
**Path**: `src/app/pages/gali-v5/services/gali-workspace.service.ts`

Servicio singleton que gestiona el modo activo del workspace, el estado de Gali (activo / autopilot / pausado), y expone señales reactivas para todos los componentes.

```typescript
type WorkspaceMode = 'operar' | 'lanzar' | 'medir' | 'construir' | 'comunidad';

class GaliWorkspaceService {
  readonly activeMode = signal<WorkspaceMode>('operar');
  readonly galiPaused = signal(false);
  readonly autopilot = signal(false);
}
```

---

### GaliWorkspaceModeBarComponent
**Path**: `src/app/pages/gali-v5/components/gali-workspace-mode-bar/`

Barra superior siempre visible. Muestra:
- Tabs de los 5 modos (activo resaltado)
- Progreso del objetivo activo (barra + fracción)
- Estado de Gali (activo / autopilot / pausado) — clickeable

---

### GaliSignalCardV2Component
**Path**: `src/app/pages/gali-v5/components/gali-signal-card-v2/`

Señal con ciclo de vida completo:

```
pending_decision → executing → completed → archived
```

- **Collapsed**: muestra título + agente + CTAs rápidos (máx 2)
- **Expanded**: muestra contexto, métricas, tabla de afectados, opciones A/B/C
- **Executing**: spinner + label "Gali está aplicando..."
- **Completed**: before/after con before tachado → resultado verde + CTA de follow-up

Acepta: `signal_data: GaliSignalData` — con tipo, estado, opciones, tabla_items, resultado.

---

### GaliProjectPanelComponent
**Path**: `src/app/pages/gali-v5/components/gali-project-panel/`

El proyecto como lente cruzado del negocio:
- KPIs del proyecto (ROAS, pedidos, ganancia)
- Agentes asignados con estado live
- Mensaje contextual de Gali
- Acciones directas → abren `GaliInterventionOverlay` (no navegan)
- Skills activas del proyecto

---

### GaliInterventionOverlayComponent
**Path**: `src/app/pages/gali-v5/components/gali-intervention-overlay/`

Overlay contextual (no global-modal) para decisiones:
- **deciding**: descripción + opciones A/B/C (la A siempre primaria)
- **executing**: spinner + "Gali está aplicando..."
- **result**: ícono ✓ verde + texto de resultado + botón cerrar

Se instancia dentro del componente padre (e.g., `GaliProjectPanel`), no en el shell global.

---

### GaliSkillBuilderV2Component
**Path**: `src/app/pages/gali-v5/components/gali-skill-builder-v2/`

Visualizador/editor de skill en formato pipeline:

```
TRIGGER → CONDICIÓN → ACCIÓN → NOTIFICACIÓN
```

Con barra de estado (activo/pausado/total ejecuciones) y tabla de historial de runs con columnas: fecha, estado, detalle, impacto.

Interface de skill:
```typescript
interface SkillRule {
  id: string;
  nombre: string;
  trigger: { event: string; agent: string; interval: string };
  condition: { metric: string; operator: string; value: number; duration?: string };
  action: { type: string; params: Record<string, unknown> };
  notification: { message: string };
  status: 'active' | 'paused' | 'executing';
  runHistory: RunLog[];
}
```

---

## Estructura de Archivos

```
src/app/pages/gali-v5/
├── home/
│   ├── home.component.ts          ← OS Workspace Hub (5 modos)
│   ├── home.component.html        ← @switch(mode) → layouts de panel
│   └── home.component.scss        ← Dark OS styles, mode layouts
├── services/
│   ├── gali-workspace.service.ts  ← Modos, estado de Gali
│   └── gali-state.service.ts      ← Panel derecho legacy
├── components/
│   ├── gali-workspace-mode-bar/   ← Barra de modos
│   ├── gali-signal-card-v2/       ← Señal con lifecycle
│   ├── gali-project-panel/        ← Proyecto como lente
│   ├── gali-intervention-overlay/ ← Decisión contextual
│   ├── gali-skill-builder-v2/     ← Editor de skills
│   ├── gali-chip/                 ← Presencia de agente (legacy)
│   └── dropi-gali-bar/            ← Bar de agente en secciones
├── pages/
│   ├── skills/                    ← Modo Construir dedicado
│   └── ... (módulos de negocio)
└── gali-v5-shell.component.*      ← Shell (icon-rail + section-nav)
```

Tokens OS: `src/styles/_gali-os-tokens.scss`

---

## Flujos Principales

### Señal → Intervención → Resultado
1. Vigilante detecta novedad alta → `GaliSignalCardV2` aparece con estado `pending_decision`
2. Usuario hace click en "Cambiar → Servientrega" → estado pasa a `executing`
3. Después de 1.8s (simulado) → estado pasa a `completed` con before/after
4. Card muestra CTA "¿Crear skill para esto?" → conecta con Modo Construir

### Proyecto → Decisión Contextual
1. `GaliProjectPanel` muestra "Novedad alta en Cali"
2. Usuario hace click en "Ver la novedad" → `GaliInterventionOverlay` se abre (anclado al panel)
3. Usuario selecciona Opción A → overlay ejecuta → muestra resultado
4. No hay navegación — el usuario sigue en el mismo workspace

### Modo Lanzar — Nuevo Proyecto
1. Usuario hace click en "+ Nuevo" en la columna de Proyectos
2. `ws.setMode('lanzar')` reconfigura el workspace a split 60/40
3. Panel izquierdo: conversación con Gali (chat + sugerencias)
4. Panel derecho: oportunidades de ADA Spy con scores
5. Usuario selecciona producto → Gali construye el proyecto conversacionalmente

### Modo Construir — Skill con Historial
1. Ruta `/gali-v5/skills` (desde sidebar) → `SkillsPageComponent` en tema oscuro
2. Sidebar de skills → seleccionar una → `GaliSkillBuilderV2` en el panel principal
3. Pipeline: TRIGGER → CONDICIÓN → ACCIÓN → NOTIFICACIÓN
4. Tabla de historial: cada run con fecha, resultado, detalle, impacto

---

## Mocks Disponibles

| Archivo | Contenido |
|---|---|
| `mocks/gali-v5/signals.json` | 5 señales con estados, opciones, tablas |
| `mocks/gali-v5/skill-rules.json` | 3 skills con historial de ejecución |
| `mocks/gali-v5/user-skills.json` | Skills de usuario (legacy) |
| `mocks/gali-v5/pqr-patterns.json` | Patrones PQR del CAS |
| `mocks/gali-v5/problem-network.json` | Red de problemas |

---

## Agentes del Sistema

| Agente | Color OS | Especialidad | Estado típico |
|---|---|---|---|
| **Roax** | `#f97316` naranja | Media Buyer / Campañas | Activo (siempre) |
| **Vigilante** | `#fbbf24` ámbar | Logística / Novedades | Activo / Alerta |
| **Chatea Pro** | `#34d399` verde | Cierre & CAS | Activo |
| **ADA Spy** | `#818cf8` índigo | Research / Oportunidades | Esperando |

---

## Principios de Diseño

1. **No navegar para decidir**: Toda intervención ocurre en el mismo workspace. Los overlays reemplazan la navegación a módulos.
2. **Estado visible**: Cada señal muestra su estado (pendiente / ejecutando / completado). Los cambios de Gali siempre dejan rastro.
3. **Señal → Loop cerrado**: Una señal no desaparece cuando se actúa — muestra el resultado y propone la siguiente acción (crear skill, ajustar regla).
4. **Skills como ciudadanos de primera clase**: Una skill no es un formulario — es un objeto vivo con historial, estado, y conexión directa con los agentes.
5. **OS, no módulos**: El cambio de modo reconfigura el workspace. No hay URLs por modo — es estado local del workspace.

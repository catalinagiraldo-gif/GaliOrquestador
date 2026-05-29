# Gali v5 — Status del Prototipo

**Última actualización**: Mayo 29, 2026 (v2.5 — Plan completo ejecutado: chips de modo, skill builder editable, toasts cross-módulo, marketplace tabs, status pill→Live)
**Arquitectura actual**: OS Architecture v2.1

---

## Snapshot Actual

| Capa | Estado | Descripción |
|---|---|---|
| Workspace OS | ✅ Implementado | Shell light + 5 modos + barra de modos |
| Señales con intervención | ✅ Implementado | GaliSignalCardV2 con lifecycle + link a SkillEditor |
| Proyectos como lente | ✅ Implementado | GaliProjectPanelComponent con acciones inline |
| Intervention Overlay | ✅ Implementado | Decisión contextual A/B/C + ejecución simulada |
| Skills Runtime | ✅ Implementado | GaliSkillBuilderV2 con pipeline + historial |
| Skill Editor Full-Page | ✅ Implementado | SkillEditorPageComponent en `/gali-v5/skills/nueva` |
| Modo Lanzar | ✅ Implementado | Chat interactivo conectado, sugerencias funcionales, typing indicator, ADA Spy con selección |
| Modo Medir | ✅ Implementado | P&L real con waterfall, ROAS real vs Meta, campañas Roax, atribución |
| Modo Comunidad | ✅ Implementado | Marketplace grid de skills |
| Skills Page | ✅ Implementado | Página dedicada + link a editor |
| Light OS Theme | ✅ Implementado | _gali-os-tokens.scss convertido a light mode |
| Live Mode / Autopilot | ✅ Implementado | Toggle bidireccional + badge "EN VIVO" + eventos enriquecidos |
| Chat → Workspace | ✅ Implementado | 9 comandos que cambian modo del workspace |
| Campañas → Skill | ✅ Implementado | CTA navega a SkillEditor con agente=roax preconfigurado |
| Responsive Fix | ✅ Implementado | Section nav collapse sin romper layout; mobile panel fix |

---

## Componentes Nuevos (OS v2.0)

| Componente | Path | Estado |
|---|---|---|
| `GaliWorkspaceService` | `services/gali-workspace.service.ts` | ✅ Toggle autopilot real + 13 eventos en pool |
| `GaliStateService` | `services/gali-state.service.ts` | ✅ 9 respuestas workspace-aware + acción autopilot |
| `GaliWorkspaceModeBarComponent` | `components/gali-workspace-mode-bar/` | ✅ Badge "EN VIVO" pulsante |
| `GaliSignalCardV2Component` | `components/gali-signal-card-v2/` | ✅ Followup CTA navega a SkillEditor |
| `GaliProjectPanelComponent` | `components/gali-project-panel/` | ✅ |
| `GaliInterventionOverlayComponent` | `components/gali-intervention-overlay/` | ✅ |
| `GaliSkillBuilderV2Component` | `components/gali-skill-builder-v2/` | ✅ |
| `SkillEditorPageComponent` | `pages/skills/skill-editor-page.component.*` | ✅ NUEVO |
| `_gali-os-tokens.scss` | `src/styles/` | ✅ Light mode |

---

## Componentes Previos (Deep Reconstruction v1 — aún activos)

| Componente | Estado | Nota |
|---|---|---|
| `GaliChipComponent` | ✅ Activo | Presencia de agente en secciones de negocio |
| `DropiGaliBarComponent` | ✅ Activo | Bar de agente en secciones (catálogo, logística…) |
| `GaliRightPanelComponent` | ✅ Activo | Panel lateral derecho (toggle desde header) |
| `CrearProyectoModalComponent` | 🔄 Supersedido | Reemplazado por Modo Lanzar en el workspace |
| `SkillsEditorModalComponent` | 🔄 Supersedido | Reemplazado por GaliSkillBuilderV2 |

---

## Build Status

```
✅ ng build --configuration development: sin errores
⚠  2 warnings (nullish coalescing triviales — no rompen funcionalidad)
```

---

## Rutas Activas del OS

| Ruta | Componente | Estado |
|---|---|---|
| `/gali-v5` | `DropiHomeComponent` (OS Workspace) | ✅ Workspace Hub |
| `/gali-v5/skills` | `SkillsPageComponent` | ✅ Modo Construir |
| `/gali-v5/skills/nueva` | `SkillEditorPageComponent` | ✅ Editor full-page con preview en vivo |
| `/gali-v5/proyectos` | `ProyectosListPageComponent` | ✅ Lista de proyectos |
| `/gali-v5/proyecto/:id` | `ProyectoDetallePageComponent` | ✅ Detalle |

---

## Arquitectura Visual

```
Shell (gali-v5-shell)
├── dropi-header-ia2 (top header — Dropi brand)
├── dropi-icon-rail (left rail — íconos módulos)
├── dropi-section-nav (submenu de sección)
└── main content
    └── router-outlet
        └── DropiHomeComponent (Gali OS Workspace)
            ├── gali-workspace-mode-bar (barra de modos siempre visible)
            └── @switch(activeMode)
                ├── operar → 3 columnas: señales | proyectos | agentes
                ├── lanzar → 2 col: conversación | ADA Spy context
                ├── medir  → 2 col: P&L | campañas
                ├── construir → 2 col: mis skills | historial
                └── comunidad → full: marketplace grid
```

---

## Señales del Sistema (Mock)

| Signal | Agente | Estado | Tipo |
|---|---|---|---|
| Coordinadora Bogotá 15% novedad | Vigilante | pending_decision | critica |
| Video A → Video B (CTR mejora) | Roax | completed | completada |
| 1 novedad requiere decisión | Chatea Pro | pending_decision | decision |
| Difusor aromaterapia oportunidad | ADA Spy | pending_decision | oportunidad |
| Escalado ROAS +15% | Roax | completed | completada |

---

## Skills Mockeadas

| Skill | Estado | Ejecuciones |
|---|---|---|
| Auto-pausa si CTR cae | ● Activa | 7 |
| Escalado ROAS automático | ● Activa | 3 |
| Smart routing novedad | ○ Pausada | 12 |

---

## Flujos Adyacentes Implementados (v2.4)

| Módulo | Gali Integration | Acción |
|---|---|---|
| Catálogo | ADA Spy GaliBar | "Lanzar con Gali →" → Modo Lanzar |
| Pedidos | Chatea Pro GaliBar | "Ver señales →" → Modo Operar |
| Novedades | Banner Gali clasificación | "Ver señales en Gali →" → Modo Operar |
| Proveedores | ADA Spy GaliBar | "Lanzar producto →" → Modo Lanzar |
| Automatización | Banner conexión skills | "Crear skill Gali" por fila → SkillEditor |
| Proyectos lista | GaliBar + "Nuevo" | → Modo Lanzar |
| Proyecto detalle | Alert bar conectado | → Señales / SkillEditor / Medir |
| Roax Lanzador | Stepper + éxito | → Modo Medir al completar |
| Roax Informes | Waterfall + Skills | "→ SkillEditor" / "→ Medir" |
| Campañas | Skill banner | "Crear skill Roax →" → SkillEditor |

## Completado en v2.5 (plan final)

| Item del plan | Estado |
|---|---|
| Chat mode-switch chips ("→ Modo Operar activado") | ✅ |
| GaliSkillBuilderV2 "Editar" → navega al SkillEditor | ✅ |
| Footer skill builder: "Ver en Proyectos" + "Nueva desde historial" | ✅ |
| Toasts cross-módulo cuando Gali ejecuta acciones | ✅ |
| Status pill → abre right panel | ✅ |
| Marketplace tabs en Skills: Populares / Por agente / Nuevas | ✅ |
| Skills + Hub como módulo unificado (mode-bar en sub-rutas) | ✅ |
| Skill toggle status con estado local reactivo | ✅ |

## Próximos Pasos Sugeridos (post-plan)

1. **Conexión con backend real**: Los skills deben conectarse al interceptor mock para simular ejecuciones persistentes entre navegaciones
2. **Onboarding de objetivo**: "¿Cuál es tu meta de 30 días?" para configurar el objetivo en el mode-bar
3. **Agentes configuración**: Página para activar/desactivar skills por agente
4. **Proyectos desde Figma**: El diseño del detalle de proyecto necesita actualización para el nuevo OS

---

## Decisiones Arquitectónicas

| Decisión | Motivo |
|---|---|
| Modo como estado local (signal) | No necesita URL por modo — el workspace es stateful |
| Overlay anclado al panel padre | No contaminar el DOM global; mantiene el contexto visual |
| SkillRule como objeto tipado | Permite futura persistencia y validación en backend |
| Señales con lifecycle (enum estado) | El usuario ve el antes y después — no "desaparecen" tras actuar |
| DM Sans + Syne en el OS | Diferencia visual clara entre Dropi (Inter) y el OS de Gali |

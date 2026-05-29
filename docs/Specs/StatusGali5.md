# Gali v5 — Status del Prototipo

**Última actualización**: Mayo 29, 2026  
**Arquitectura actual**: OS Architecture v2.0 (reescritura completa)

---

## Snapshot Actual

| Capa | Estado | Descripción |
|---|---|---|
| Workspace OS | ✅ Implementado | Shell oscuro + 5 modos + barra de modos |
| Señales con intervención | ✅ Implementado | GaliSignalCardV2 con lifecycle completo |
| Proyectos como lente | ✅ Implementado | GaliProjectPanelComponent con acciones inline |
| Intervention Overlay | ✅ Implementado | Decisión contextual A/B/C + ejecución simulada |
| Skills Runtime | ✅ Implementado | GaliSkillBuilderV2 con pipeline + historial |
| Modo Lanzar | ✅ Implementado | Split panel conversación + ADA Spy context |
| Modo Medir | ✅ Implementado | P&L básico por proyecto (layout) |
| Modo Comunidad | ✅ Implementado | Marketplace grid de skills |
| Skills Page | ✅ Implementado | Página dedicada con GaliSkillBuilderV2 |
| Dark OS Theme | ✅ Implementado | _gali-os-tokens.scss + fuentes Syne/DM Sans |

---

## Componentes Nuevos (OS v2.0)

| Componente | Path | Estado |
|---|---|---|
| `GaliWorkspaceService` | `services/gali-workspace.service.ts` | ✅ |
| `GaliWorkspaceModeBarComponent` | `components/gali-workspace-mode-bar/` | ✅ |
| `GaliSignalCardV2Component` | `components/gali-signal-card-v2/` | ✅ |
| `GaliProjectPanelComponent` | `components/gali-project-panel/` | ✅ |
| `GaliInterventionOverlayComponent` | `components/gali-intervention-overlay/` | ✅ |
| `GaliSkillBuilderV2Component` | `components/gali-skill-builder-v2/` | ✅ |
| `_gali-os-tokens.scss` | `src/styles/` | ✅ |

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
| `/gali-v5/skills` | `SkillsPageComponent` (OS Dark Theme) | ✅ Modo Construir |
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

## Próximos Pasos Sugeridos

1. **Conexión con backend real**: Los skills deben conectarse al interceptor mock para simular ejecuciones persistentes entre navegaciones
2. **Modo Medir completo**: P&L real calculado desde datos de pedidos + campañas
3. **Skill editor inline**: Formulario de edición dentro del GaliSkillBuilderV2 (actualmente solo vista)
4. **Notificaciones push**: Cuando un skill ejecuta mientras el usuario está en otro módulo, mostrar toast desde GaliWorkspaceService
5. **Proyectos desde Figma**: El diseño del detalle de proyecto necesita actualización para el nuevo OS

---

## Decisiones Arquitectónicas

| Decisión | Motivo |
|---|---|
| Modo como estado local (signal) | No necesita URL por modo — el workspace es stateful |
| Overlay anclado al panel padre | No contaminar el DOM global; mantiene el contexto visual |
| SkillRule como objeto tipado | Permite futura persistencia y validación en backend |
| Señales con lifecycle (enum estado) | El usuario ve el antes y después — no "desaparecen" tras actuar |
| DM Sans + Syne en el OS | Diferencia visual clara entre Dropi (Inter) y el OS de Gali |

Ejecuta el pipeline completo de Gali V5 en el orden estricto definido abajo.

═══════════════════════════════════════════════════════════════════
CONTEXTO — QUÉ YA ESTÁ HECHO (NO reimplementar)
═══════════════════════════════════════════════════════════════════

✅ Spec 1 (UniDatos) — CA-1 a CA-12 verificados
✅ Spec 2 (RediNavega) — CA-1 a CA-18 verificados, incluye AJ-2 microinteracciones
✅ Spec 8 (AuditoriaJun8) — CA-1 a CA-10 verificados

Antes de tocar cualquier spec marcado como hecho: leer sus CAs en el archivo .md y
verificar que el código los cumple. Si están cumplidos → marcar como "saltado"
y avanzar. Si algún CA falla → completarlo primero.

═══════════════════════════════════════════════════════════════════
REGLAS GLOBALES (aplican a TODOS los specs)
═══════════════════════════════════════════════════════════════════

1. Leer el archivo .md del spec COMPLETO antes de escribir una sola línea de código.
2. Leer ds-registry/ según la tabla de CLAUDE.md antes de tocar UI.
3. No iniciar spec N+1 hasta que spec N tenga todos sus CAs en ✅ y ng build OK.
4. Si un spec dice "Lo que NO cambia" → no tocarlo bajo ninguna circunstancia.
5. Specs 3-7 y 9-16 consumen mocks/gali-v5/ — NUNCA hardcodear valores financieros en TS.
6. Primary color: naranja #f49a3d. Font: Inter (cuerpo), IBM Plex Sans (menú). Íconos: <img> SVG 20×20px.
7. ng build --configuration development sin errores es gate obligatorio entre cada spec.
8. Al terminar cada spec: reportar "Spec N ✅ — [lista de archivos tocados]" antes de continuar.

═══════════════════════════════════════════════════════════════════
ORDEN DE EJECUCIÓN Y SKILLS
═══════════════════════════════════════════════════════════════════

━━━ FASE 1 — Completar la base (specs 3→7) ━━━━━━━━━━━━━━━━━━━━━

SPEC 3 — HubNegocio
  Archivo:  docs/SpecsNuevos/3.HubNegocio.md
  Skill 1:  /bencium-impact-designer   → invocar ANTES de escribir código
  Skill 2:  /interface-design          → invocar para componentes visuales
  DS:       dropi-modal.json · dropi-button.json · dropi-card.json · dropi-badge.json
  Gate:     CA-1 a CA-19 en ✅ + ng build OK
  Nota:     DOM Zona 1 SIEMPRE antes de Zona 2 en el HTML (no CSS order).
            ROAS real = 1.93x como primario; Meta 2.9x como sublabel.

SPEC 4 — Señales
  Archivo:  docs/SpecsNuevos/4.Señales.md
  Skill 1:  /bencium-impact-designer   → invocar ANTES de escribir código
  Skill 2:  /interface-design
  DS:       dropi-button.json · dropi-card.json · dropi-badge.json · tokens/colors.json
  Gate:     CA-1 a CA-13 (Fase 1) en ✅ + ng build OK
  Nota:     Spec 4 es DUEÑO de /gali-v5/senales — no crear placeholder, crear el componente real.
            Fase 2 (modal confirmación) requiere Spec 3 ConfirmActionModalComponent listo.

SPEC 5 — ZeroState
  Archivo:  docs/SpecsNuevos/5.ZeroState.md
  Skill:    /agentic-ux-design-relationship-centric-interfaces → invocar ANTES de escribir código
  DS:       dropi-steps.json · dropi-tabs.json · dropi-modal.json
  Gate:     CA de todos los grupos en ✅ + ng build OK
  Nota:     Depende de Spec 3 (toggle complexityLevel en Zona 1). Ejecutar Spec 3 completo primero.
            "Gali no te pregunta lo que Dropi ya sabe" — eliminar steps pedidosPerWeek y tiempoEnDropi.

SPEC 6 — Finance (cierre ~90%)
  Archivo:  docs/SpecsNuevos/6.Finance.md
  Skill:    /interface-design → invocar ANTES de cambios visuales
  DS:       dropi-card.json · tokens/colors.json · tokens/spacing.json
  Gate:     CA-1 a CA-8 en ✅ + ng build OK
  Nota:     Solo completar el ~10% restante — cableado kpis-global.json, drawer Siigo, ROI Gali.
            No reimplementar lo que ya está hecho (wallet Kronos, badges periodo).

SPEC 7 — Salud (cierre ~95%)
  Archivo:  docs/SpecsNuevos/7.Salud.md
  Skill:    /interface-design → solo si hay cambios visuales pendientes
  Gate:     CA-9 (explainer jerarquía) y CA-10 (copy dinámico header) en ✅ + ng build OK
  Nota:     Solo completar las brechas documentadas. No reimplementar health-panel ni umbrales.
            AJ-7.1 (ring animation) y AJ-7.3 (headerSubtitle computed) de Cambios10jun.md §9.7.

━━━ FASE 2 — Specs nuevos (9→10) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPEC 9 — HubNarrativa
  Archivo:  docs/SpecsNuevos/9.HubNarrativa.md
  Skill 1:  /bencium-impact-designer   → invocar ANTES de escribir código
  Skill 2:  /interface-design
  DS:       dropi-card.json · dropi-button.json · dropi-badge.json · tokens/colors.json
  Gate:     CA-1 a CA-18 en ✅ + ng build OK
  Nota:     EXTIENDE Spec 3, no lo revierte. Las 3 Zonas → 3 Momentos con renombramiento.
            Crear: gali-hub-brief · gali-decision-theater · AlertHierarchyDirective.
            Añadir motion tokens a _variables.scss y keyframes a _animations.scss (C7).
            Modo calma cuando pendingApprovalSignals.length === 0 (C6).
            Depende de: Spec 8 ✅ · Spec 3 ✅ · Spec 1 ✅

SPEC 12 — SignalCenter
  Archivo:  docs/SpecsNuevos/12.SignalCenter.md
  Skill 1:  /bencium-impact-designer   → invocar ANTES de escribir código
  Skill 2:  /interface-design
  DS:       dropi-card.json · dropi-button.json · tokens/colors.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     EXTIENDE /gali-v5/senales de Spec 4. No eliminar componente existente, extenderlo.
            Layout dos columnas: lista izquierda + detalle derecho.
            Señales predictivas (🔮) separadas de Alertas reactivas (🚨).
            Botones Operar/Lanzar/Medir con destino real (C5 del spec).
            Depende de: Spec 4 ✅

SPEC 11 — AgentesVivos
  Archivo:  docs/SpecsNuevos/11.AgentesVivos.md
  Skill 1:  /interface-design           → invocar ANTES de escribir código
  Skill 2:  /agentic-ux-design-relationship-centric-interfaces → para el wizard y ficha viva
  DS:       dropi-card.json · dropi-tabs.json · dropi-badge.json · dropi-steps.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     agent-card-alive: avatar + estado real + última acción.
            Ficha con 3 tabs: Ahora / Configurar / Historial.
            launchAgent() persiste en array agentes + animación 1.5s.
            Autopilot SOLO en tab Configurar — quitar de mode-bar y skills.
            Depende de: Spec 8 ✅ (base agentes funcionales)

SPEC 13 — ProyectoCanvas
  Archivo:  docs/SpecsNuevos/13.ProyectoCanvas.md
  Skill 1:  /bencium-impact-designer   → invocar ANTES de escribir código
  Skill 2:  /interface-design
  DS:       dropi-card.json · dropi-tabs.json · dropi-steps.json · dropi-modal.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     proyecto-timeline como barra horizontal con fases.
            Tabs Producto/Campaña/Pedidos/Agentes con datos reales del mock (no placeholders).
            Diversificar projects.json: recien_lanzado / pausado / cerrado / borrador (C7).
            Calculadora precio brújula con slider (C4).
            Deep links a /senales?signalId=X&projectId=Y.
            Depende de: Spec 12 ✅ (deep links señales)

SPEC 16 — GlosarioInteligente
  Archivo:  docs/SpecsNuevos/16.GlosarioInteligente.md
  Skill:    /interface-design           → invocar ANTES de cambios visuales
  DS:       dropi-badge.json · tokens/typography.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     Directiva Angular galiGlosario con 2 niveles (simple + expandir).
            Aplicar en: Dashboard Financiero (PIL, P&L), Hub (ROAS, diagnóstico cruzado),
                        Pedidos (novedad, huella), Agentes (CPA, LTV).
            Onboarding: eliminar pasos redundantes (C5) — Spec 16 actúa sobre
            gali-goal-onboarding.component.ts, elimina steps pedidosPerWeek y tiempoEnDropi.
            Tooltips adaptativos: si visto >3 veces, ícono ⓘ desaparece (localStorage).
            Puede ejecutarse en PARALELO con cualquier spec — mínimas dependencias.

SPEC 15 — ImpactoGali
  Archivo:  docs/SpecsNuevos/15.ImpactoGali.md
  Skill:    /interface-design           → invocar ANTES de cambios visuales
  DS:       dropi-card.json · tokens/colors.json · tokens/spacing.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     Crear modelo GaliImpactLedger (array de acciones con timestamp, agente, impacto_$).
            Widget gali-impact-widget visible en Hub Momento 3 y ficha de cada agente.
            Vista /gali-v5/impacto (accesible desde Hub + menú perfil).
            Hito gamificado al superar $1M acumulado.
            Depende de: Spec 9 ✅ (Momento 3 del Hub)

SPEC 14 — OntologiaViva
  Archivo:  docs/SpecsNuevos/14.OntologiaViva.md
  Skill:    /interface-design           → invocar ANTES de cambios visuales
  DS:       dropi-card.json · dropi-badge.json · dropi-tabs.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     Skills: eliminar trigger/condición/acción de cards. Mostrar: nombre + descripción +
            badge "Agentes que la usan" + status.
            Rediseñar diagrama "Gali orquesta": grid flexbox, no SVG con líneas.
            Tooltip onboarding 20s primera visita a Agentes (jerarquía Gali→Agente→Skill→Regla).
            "Forks" → "Copias de la comunidad".
            Depende de: Spec 11 ✅ (agentes funcionales para las relaciones skill→agente)

SPEC 10 — WorkspaceChat
  Archivo:  docs/SpecsNuevos/10.WorkspaceChat.md
  Skill 1:  /agentic-ux-design-relationship-centric-interfaces → invocar ANTES
  Skill 2:  /interface-design
  DS:       dropi-card.json · tokens/colors.json
  Gate:     CAs en ✅ + ng build OK
  Nota:     Refactorizar gali-right-panel para soportar array de threads (local state).
            Secciones: FIJADOS / Por Proyecto / Por Agente.
            Botón "Nuevo thread" con selector de contexto.
            Respuestas Gali incluyen rich cards (micro-gráficos, mini-mapas).
            Thread fijado persiste en localStorage.
            Independiente — puede ejecutarse en cualquier momento, al final por conveniencia.

═══════════════════════════════════════════════════════════════════
CHECKLIST DE CALIDAD (verificar antes de marcar cualquier spec ✅)
═══════════════════════════════════════════════════════════════════

Visual:
  □ Fondos usan var(--surface-50) o blanco — nunca gris sólido
  □ CTAs primarios en naranja var(--primary-500) — nunca azul ni verde
  □ Valores financieros tienen badge de periodo (Semanal / Mensual)
  □ Iconos de dominio son <img> SVG 20×20px — sin <i class="pi-*"> en contexto de dominio

Movimiento:
  □ Entradas de cards/listas tienen stagger (no aparecen todas juntas)
  □ Paneles laterales hacen slide-in desde la derecha
  □ Contadores numéricos animan desde 0 en primer render
  □ @media (prefers-reduced-motion: reduce) existe en _animations.scss

Datos:
  □ ng build sin errores ni warnings críticos
  □ grep "2\.9x" en gali-v5 = 0 ocurrencias como ROAS real sin etiqueta "Meta declarado"
  □ 0 literales financieros hardcodeados en TS — todo viene de projects.json o kpis-global.json

Interacción:
  □ Modales/panels se cierran con click en backdrop
  □ Acciones masivas (>1 entidad) tienen modal confirmación 2 pasos
  □ Sin texto "Prototipo", "data-proto-skip" visible, ni "PRÓXIMAMENTE" en flujos principales

═══════════════════════════════════════════════════════════════════
ENTREGABLE FINAL
═══════════════════════════════════════════════════════════════════

Al terminar el pipeline completo, generar tabla resumen:

| Spec | Nombre         | Estado  | Archivos principales tocados | Notas |
|------|----------------|---------|------------------------------|-------|
| 3    | HubNegocio     | hecho/saltado/bloqueado | | |
| 4    | Señales        | hecho/saltado/bloqueado | | |
| 5    | ZeroState      | hecho/saltado/bloqueado | | |
| 6    | Finance        | hecho/saltado/bloqueado | | |
| 7    | Salud          | hecho/saltado/bloqueado | | |
| 9    | HubNarrativa   | hecho/saltado/bloqueado | | |
| 12   | SignalCenter   | hecho/saltado/bloqueado | | |
| 11   | AgentesVivos   | hecho/saltado/bloqueado | | |
| 13   | ProyectoCanvas | hecho/saltado/bloqueado | | |
| 16   | GlosarioInt.   | hecho/saltado/bloqueado | | |
| 15   | ImpactoGali    | hecho/saltado/bloqueado | | |
| 14   | OntologiaViva  | hecho/saltado/bloqueado | | |
| 10   | WorkspaceChat  | hecho/saltado/bloqueado | | |

Estados: hecho = CAs ✅ + build OK · saltado = ya cumplía CAs · bloqueado = dependencia rota (motivo en Notas)


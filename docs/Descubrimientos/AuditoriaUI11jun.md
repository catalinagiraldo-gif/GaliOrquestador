# Auditoría UI Gali v5 — 11 Jun 2026

Inventario post-implementación de correcciones Fase 1–3 del plan de auditoría pantalla por pantalla.

> **Inventario extendido (v2):** matriz chrome por ruta, estados por hallazgo, directivas, servicios, orphans y backlog abierto → [InventarioAuditoriaGaliV5-v2.md](./InventarioAuditoriaGaliV5-v2.md)

## Política de chrome (shell)

| Capa | Cuándo visible |
|------|----------------|
| `gali-workspace-mode-bar` | Solo Hub (`/gali-v5`) — toggle Básico/Experto canónico |
| `gali-context-strip` | Rutas sin barra Gali a nivel página |
| `gali-intent-bar` | `galiMode === 0`, sin barra página, sin `primaryAlertActive` |
| `dropi-gali-bar` / `gali-agent-alert` | 11 rutas operativas (página) |

**Rutas con barra página (suprimen context-strip + intent-bar):**

- `/gali-v5/mis-pedidos/mis-pedidos`
- `/gali-v5/mis-pedidos/garantias`
- `/gali-v5/marketing/campanas`
- `/gali-v5/marketing/chatea-pro`
- `/gali-v5/productos/caza-productos`
- `/gali-v5/productos/proveedores`
- `/gali-v5/cas/bandeja`
- `/gali-v5/proyectos` (lista exacta)
- `/gali-v5/reportes/dashboard`
- `/gali-v5/logistica/transportadoras`
- `/gali-v5/logistica/torre-logistica`

**Objetivo:** ≤2 capas de chrome antes del contenido (header + 1 barra Gali).

## Cambios por zona

### Hub
- Toggle Básico/Experto movido a `gali-workspace-mode-bar` en shell
- `hub-gali-week` hardcoded eliminado → `app-gali-impact-widget mode="hub"`
- Card memoria duplicada eliminada (vive en right-panel)
- Momento 3: `max-height` acotado a `min(72vh, 900px)` con scroll interno

### Chatea Pro / CAS
- Chatea: `dropi-gali-bar` con stats unificada; status-bar duplicada eliminada
- CAS: explainer solo primera visita (`gali_cas_explainer_seen`); `gali-chip` fusionado en barra

### Ontología A/S/R
- Nuevo `gali-ontology-strip` (colapsable) en Agentes, Skills, Reglas
- Copy Regla unificado: IF-THEN general para todos los agentes
- Modal 20s en Agentes conservado para primera visita

### Impacto
- Fuente única: `wallet-transactions.json` → `GaliImpactWidgetComponent`
- Hub Momento 3 y página `/gali-v5/impacto` usan widget `mode="hub"`

### Marketplace
- `/gali-v5/skills/comunidad` redirige a `/gali-v5/marketplace`
- Nav config y breadcrumbs actualizados

### SCSS / viewport
- `health-panel` y `agency-panel`: `100vh` → `calc(100vh - 53px)`
- Report KPI y Torre logística: `min-height` fijo eliminado
- Panel derecho: animación `gali-panel-slide-in`

### Motion (Spec 9)
- Stagger `.gali-stagger-in` en Momento 3 e impacto
- Modo calma: `gali-breathe`
- Contadores impacto: `gali-count-in` en `.impact-stat__val`
- `prefers-reduced-motion` preservado en `_animations.scss`

## Matriz rutas (chrome count post-fix)

| Ruta | Chrome antes | Chrome después | Estado |
|------|-------------|----------------|--------|
| Hub | 2 (intent + narrativa) | 2 (mode-bar + intent) | OK |
| Chatea Pro | 4 | 2 (titulos + gali-bar) | OK |
| CAS | 5 | 2 (intro + gali-bar) | OK |
| Campañas | 4 | 2 | OK |
| Agentes | 3 + ontología | 2 + strip colapsado | OK |
| Señales | 2 | 2 | OK (referencia) |

## Verificación

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use && yarn ng build --configuration development
```

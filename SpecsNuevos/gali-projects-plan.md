# Gestión de Proyectos Orientada a Objetivos — Gali v6

## Contexto

Gali v6 ya tiene una página de Proyectos (`/gali-6/proyectos`) con un objetivo básico
(texto + meta de pedidos/sem guardados en localStorage) y una lista de proyectos con
salud y métricas.

Lo que falta: el objetivo es decorativo — no conecta dinámicamente con los proyectos,
no muestra cuánto contribuye cada uno, y Gali no actúa como asistente activo del portafolio.

---

## Modelo de Datos (Bloque 1)

### Objetivo (`G6Objetivo`)
- `texto: string` — descripción libre del objetivo
- `tipo: 'volumen' | 'financiero' | 'expansion'` — tipo de meta
- `meta_pedidos_sem: number` — meta numérica principal
- `meta_ganancia_mensual: number | null` — meta financiera opcional
- `plazo_semanas: number` — duración del objetivo
- `fecha_inicio: string` — ISO date
- `sub_metas: SubMeta[]` — pasos intermedios con estado logrado/pendiente

Persiste en `localStorage` con clave `gali-6-objetivo-v2`.

### Proyecto (extensión del mock existente)
Cada proyecto en `projects.json` ya tiene `pedidos_sem: number`.
La contribución al objetivo se calcula en runtime: `contribucionPct = (pedidos_sem / meta_pedidos_sem) * 100`.

---

## Bloque 1: Modelo de datos ✅
Archivo: `mocks/gali-v6/objetivo.ts`
- Interface `G6Objetivo` + `SubMeta`
- `DEFAULT_OBJETIVO` con sub-metas realistas
- `getObjetivo()` y `saveObjetivo()` con localStorage

## Bloque 2: Creación de proyecto vinculada al objetivo ✅
Archivo: `src/app/pages/gali-6/proyectos/gali6-nuevo-proyecto.component.*`
Ruta: `/gali-6/proyectos/nuevo` (override de la ruta anterior que iba a gali-5)
- Paso `objetivo`: muestra meta actual, input de contribución esperada, preview en vivo
- Paso `producto`: selector con recomendaciones de ADA Spy
- Paso `config`: presupuesto y agentes
- Paso `lanzar`: resumen + confirmación

## Bloque 3: Edición de proyectos ✅
En `gali6-proyectos-casa`:
- Botón editar en cada fila del portafolio
- Modal para editar nombre, meta de contribución, notas para Gali
- Cambios persisten en `localStorage` como overrides del mock

## Bloque 4: Vista de objetivo y progreso ✅
En `gali6-proyectos-casa` (sección objetivo renovada):
- Pill de tipo (Volumen / Financiero / Expansión)
- Barra de progreso con desglose por proyecto
- Lista de sub-metas con checkbox interactivo
- Semanas transcurridas vs. plazo total

## Bloque 5: Gali como asistente de portafolio ✅
En `gali6-proyectos-casa` (sección check-ins):
- Detección automática de proyectos estancados (pausados + sin acción)
- Detección de brecha de contribución (falta X ped/sem para objetivo)
- Reconocimiento de proyectos que cumplen milestone (en_escala)
- CTAs contextuales: reactivar, nuevo proyecto, ver detalle

---

## Log de implementación

### Decisiones tomadas

**Sobre el modelo de datos**: Se optó por localStorage en lugar de un servicio Angular
porque es prototipo — facilita resetear el estado sin servidor.

**Sobre la ruta de creación**: Se reemplazó la ruta `proyectos/nuevo` que apuntaba al
wizard de gali-5 por un nuevo componente gali-6 específico. El wizard de gali-5 sigue
disponible para gali-5 directamente.

**Sobre las contribuciones**: Se calculan en runtime desde `pedidos_sem` del mock.
No hay una columna explícita en el JSON — es intencional para mantener el mock como
fuente de verdad de métricas.

**Sobre el bloque 3 (edición de proyectos)**: Los cambios de nombre/notas se guardan
en localStorage como un mapa `{ [proyectoId]: { nombre?, notasGali? } }`.
Los datos de rendimiento (ROAS, pedidos, salud) no son editables — vienen siempre del mock.

### Implementado completamente (Jun 15 2026)

**Bloque 5 — Toast cambio de objetivo**: Al guardar el modal de edición, `saveEdit()`
detecta si cambió `meta_pedidos_sem` o `texto`. Si cambió, genera un mensaje contextual
en `galiCambioMensaje` signal (ej. "Ajustaste tu meta a 120 pedidos/sem — actualizando
el plan de tu portafolio"). El toast aparece con animación `slideDown` y desaparece
automáticamente en 5–8 segundos.

**Verificación (Playwright headless)**:
- Página proyectos carga sin ZeroState cuando localStorage tiene las claves
- Modal editar objetivo: tipo picker (3 opciones), textarea, meta, plazo, sub-metas CRUD, "Agregar paso" ✅
- Cambiar meta 100 → 120 + Guardar: modal cierra, toast aparece, nueva meta reflejada ✅
- Modal editar proyecto: nombre, contribución, notas ✅
- Escape cierra ambos modales ✅
- Sin errores JS en consola ✅

### Completado Jun 15 2026 — segunda ronda

**Edición avanzada de proyectos**: Modal ampliado con:
- Campo presupuesto diario (slider $5k–$200k + valor formateado en vivo)
- Grid de 4 agentes con toggle ON/OFF: Roax Ads, Vigilante, ADA Spy, Chatea Pro
- Persiste `presupuestoDiario` y `agentes` en el override de localStorage

**Timeline de sub-metas**: 
- `SubMeta` ahora tiene `fecha_logro?: string` (ISO date)
- Al hacer toggle a `lograda: true` se asigna la fecha del prototipo (`PROTO_DATE`)
- La UI muestra la fecha en verde junto a cada paso logrado (`.goal__submeta-fecha`)
- Default data incluye fechas reales para los 3 pasos ya logrados
- El draft del modal de editar objetivo también propaga `fecha_logro`

**Verificación (Playwright)**:
- 2 fechas visibles al cargar (sub-metas ya logradas) ✅
- Toggle sm-3: aparece tercera fecha inmediatamente ✅  
- Modal edit proyecto: 4 agentes, slider presupuesto, toggle ON/OFF funcional ✅
- Sin errores JS ✅

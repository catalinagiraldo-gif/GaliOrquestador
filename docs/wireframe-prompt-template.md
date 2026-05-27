# RPP Wireframe Prompt Template
> Plantilla para solicitar wireframes interactivos al pipeline RPP.
> Cualquier product designer del equipo puede usar esta plantilla para generar wireframes con Claude Code.

---

## Instrucciones de uso

1. Copia la sección **"Prompt"** de abajo
2. Completa cada campo (los campos con `*` son obligatorios)
3. Pégalo en Claude Code dentro del repo `dropi-prototypes`
4. Claude ejecutará el checklist automáticamente antes de codificar

---

## Prompt

```
Genera un wireframe interactivo para la siguiente vista:

### Vista *
- Nombre: [ej: Catálogo de productos]
- Módulo: [ej: productos > catalogo]
- Rol de usuario: [dropshipper | proveedor | admin]

### Figma *
- URL: [pega la URL completa de Figma con node-id]
  Ejemplo: https://www.figma.com/design/InvoCKay8rCZ2t2s9N5cUt/Productos-v2.0?node-id=3396-23328
- Nodos adicionales (si aplica):
  - Filtros: [node-id]
  - Card: [node-id]
  - Modal: [node-id]

### Tipo de vista *
- [ ] Página completa (page)
- [ ] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: [ej: catálogo]
  - ¿Qué CTA lo abre?: [ej: "Enviar a cliente" en card de producto]
  - ¿Qué pasa al completar? (on_success): [ej: cierra modal + toast de éxito]
  - ¿Qué pasa al cancelar? (on_cancel): [ej: cierra modal, vuelve al catálogo]

### Datos mock
- Entidad principal: [ej: productos, órdenes, usuarios]
- Cantidad mínima de items: [ej: 20+ para scroll natural]
- Propiedades importantes: [ej: nombre, precio proveedor, precio sugerido, stock, categoría, imagen, proveedor]
- ¿Hay imágenes en el diseño de Figma?: [sí/no]
  - Si sí: descargarlas a src/assets/images/[módulo]/

### Interacciones clave
Describe las interacciones principales que debe tener el wireframe:
- [ej: Click en "Enviar a cliente" → abre modal de Crear Orden]
- [ej: Filtros con switches toggle (Favoritos, Privados, Con ordenes, Combos)]
- [ej: Búsqueda por texto en el input del header]
- [ej: Cambiar vista grid/lista con segmented buttons]

### Contexto adicional (opcional)
- Ticket Jira: [ej: DROP-9268]
- Notas de diseño: [cualquier aclaración que no sea evidente en Figma]
- Componentes DS a usar: [ej: dropi-button, dropi-input, dropi-card]
```

---

## Ejemplo completado

```
Genera un wireframe interactivo para la siguiente vista:

### Vista *
- Nombre: Catálogo de productos
- Módulo: productos > catalogo
- Rol de usuario: dropshipper

### Figma *
- URL: https://www.figma.com/design/InvoCKay8rCZ2t2s9N5cUt/Productos-v2.0?node-id=3396-23328
- Nodos adicionales:
  - Filtros: 3396:23381
  - Card producto: 3396:23383
  - Breadcrumb: 3396:23334

### Tipo de vista *
- [x] Página completa (page)
- [ ] Modal (overlay)

### Datos mock
- Entidad principal: productos
- Cantidad mínima de items: 21 productos
- Propiedades importantes: id, name, price, suggestedPrice, stock, category, tags, badge, imageUrl, supplierId, supplierName
- ¿Hay imágenes en el diseño de Figma?: sí
  - Descargar a src/assets/images/products/

### Interacciones clave
- Click en "Enviar a cliente" (footer de card) → abre modal de Crear Orden sobre el catálogo
- 4 switches toggle: Favoritos (corazón), Privados (candado), Con ordenes (carrito), Combos (boxes)
- Búsqueda por texto en input con icono buscar + icono imagen
- Botón "Filtros avanzados" a la derecha
- Barra inferior: "Más de 60.000 productos" + Ordenar por dropdown + Vista segmented (grid/lista)
- Carousel de proveedores con scroll horizontal + botón float de avance

### Contexto adicional
- Ticket Jira: RPP-PILAR10
- Notas: Los filtros NO son botones, son switches con labels. Inputs del form de cliente solo tienen placeholders, no labels encima.
- Componentes DS: dropi-card, dropi-button (text-button variant), dropi-input
```

---

## Checklist interno (lo que Claude ejecuta automáticamente)

Claude Code seguirá este orden al recibir el prompt:

1. ☐ Leer `navigation-map.json` — ubicar módulo, vista, tipo, origin points
2. ☐ Consultar Figma `get_design_context` por cada sección (no asumir nada)
3. ☐ Leer DS Registry specs para cada componente involucrado
4. ☐ Descargar assets (imágenes, iconos) de Figma → `src/assets/`
5. ☐ Crear mock data con cantidad suficiente y propiedades completas
6. ☐ Crear componente Angular standalone con SCSS (tokens de `_variables.scss`)
7. ☐ Agregar ruta lazy-loaded en `app.routes.ts`
8. ☐ Si es modal: implementar overlay con backdrop + animación, NO navegación
9. ☐ Actualizar `prototype` field en `navigation-map.json`
10. ☐ Verificar compilación sin errores

---

## Tips para el designer

- **Mientras más nodos de Figma des, mejor.** Claude puede leer cada sección individualmente y así no inventa nada.
- **Si hay un detalle que no es obvio** (ej: "ese botón es un switch, no un button"), ponlo en "Notas de diseño".
- **Las imágenes importan.** Si el diseño tiene product shots, dilo explícitamente para que se descarguen.
- **El tipo de vista es crítico.** Modal vs página cambia completamente la implementación.
- **Textos exactos.** Si en Figma dice "Número de télefono", Claude debe poner exactamente eso, no "Teléfono".

---

## Variante: Wireframes derivados de spec (sin Figma)

Para prototipos cuya fuente de verdad es un documento de spec (no Figma) — típicamente visiones de producto, exploraciones AI-First, o ideas pre-design — usa este template alternativo. Cuando exista Figma, migrar al template estándar de arriba.

```
Genera un wireframe interactivo derivado de un spec narrativo:

### Vista *
- Nombre: [ej: Gali — Modo Descubrimiento]
- Módulo: [ej: gali > descubrimiento]
- Rol de usuario: [dropshipper | proveedor | admin]

### Spec source *  (reemplaza al Figma URL)
- Ruta: [ej: docs/Specs/DropiAiFirst.md]
- Sección / anchor: [ej: "## 5. PANTALLA 2: MODO DESCUBRIMIENTO" (líneas 635-753)]
- Sub-secciones relevantes:
  - Componentes detallados: [línea range]
  - Diálogos literales: [línea range]
  - Mock data canónica: [línea range]

### Tipo de vista *
- [ ] Página completa (page)
- [ ] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: [ej: dashboard]
  - ¿Qué CTA lo abre?: [...]
  - ¿Qué pasa al completar? (on_success): [...]
  - ¿Qué pasa al cancelar? (on_cancel): [...]

### Componentes Gen UI a renderizar  (reemplaza a "Nodos adicionales")
Lista los componentes que el sistema/agente materializa según el contexto:
- [ej: ProductCard — aparece tras "ver tendencias"]
- [ej: BuyerPersonaCard — aparece tras seleccionar producto]
- [ej: ExecutionStream — siempre mientras Gali procesa]
- [ej: ConfidenceMeter — anidado en cada respuesta de Gali]

### Datos mock
- Entidad principal: [ej: productos, misiones, buyer personas]
- Cantidad mínima de items: [ej: 20+ productos]
- Propiedades importantes: [ej: id, name, image, category, margin, salesWeek, confidence, badge, reasoning]
- ¿Hay imágenes en el spec?: [sí/no — generalmente no, reusa src/assets/images/*]

### Interacciones clave
- [ej: Click chip sugerencia → equivale a Enter con texto del chip]
- [ej: Hover >800ms en card → tooltip "¿Por qué este?"]
- [ej: Click "Elegir este" → toast + mission ribbon avanza + nuevo mensaje Gali]
- [ej: 25s sin interacción → idle nudge proactivo]

### Decisiones de diseño que el spec NO resuelve (preguntar al usuario)
Lista las decisiones tácticas que el spec deja abiertas y que afectan implementación:
- Layout específico (hero permanente vs colapsable)
- Identidad tipográfica (respeta DS o introduce display nueva)
- Sensación target (premium | vivo y activo | latino | técnico)
- Memoria entre sesiones (efímera | localStorage | mock con perfil)
- Razonamiento visible (execution stream + confidence | solo stream | nada)

### Contexto adicional (opcional)
- Skills a aplicar: [ej: bencium-innovative-ux-designer, agentic-ux-design-relationship-centric-interfaces]
- Sensación buscada: [ej: "esto no se parece a Dropi" + "Gali está leyendo mi mente"]
- Out of scope explícito: [lista de qué NO se prototipa]
- Referentes visuales: [ej: Cursor 3, Claude Artifacts, Perplexity Shopping]
```

### Ejemplo completado — Gali Modo Descubrimiento

Ver el spec ejecutado en [Specs/PlanPrototipo_DropiAiFirst_ModoDescubrimiento.md](./Specs/PlanPrototipo_DropiAiFirst_ModoDescubrimiento.md) como referencia de cómo expandir este template a un plan accionable.

### Diferencias clave respecto al template estándar

| Aspecto | Template estándar (Figma) | Variante spec-derived |
|---|---|---|
| Fuente de verdad | Figma node-id | Markdown anchor + líneas |
| Anti-hallucination | `get_design_context` por sub-nodo | Lectura literal del spec + AskUserQuestion para gaps |
| Imágenes | `upload_assets` desde Figma | Reutilizar `src/assets/images/*` existentes |
| Componentes | Mapeo 1:1 con nodos Figma | Componentes Gen UI inferidos del comportamiento descrito |
| Iteración | Diseñador actualiza Figma → re-generar | Conversar con el usuario para resolver gaps antes de codear |

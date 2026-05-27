# Gali en Dropi — Plan de Ejecución Explícito
### Sistema nervioso del dropshipper: de la visión a los pasos concretos

> **Contexto Dropi Orquestador:** Este plan vive dentro del proyecto de orquestación AI-first de Dropi, donde el objetivo es que cualquier flujo operativo del dropshipper pueda ser automatizado, aumentado o asistido por inteligencia artificial. Gali es la manifestación visible de ese sistema para el usuario final. Este documento expande el análisis estratégico original en pasos accionables por equipo, con criterios de "done" claros, prompts RPP listos para usar, y dependencias explícitas entre fases.

---

## Antes de empezar: los tres supuestos fundacionales

Antes de ejecutar cualquier paso, el equipo entero tiene que alinearse en estos tres puntos. Si alguien en el equipo no está de acuerdo con alguno, hay que resolverlo **antes** de tocar Figma o escribir código.

**Supuesto 1 — Gali no es un chatbot.**
Es un sistema de agencia contextual. La diferencia operativa: un chatbot espera preguntas, Gali actúa con contexto del negocio aunque nadie le haya preguntado nada. Esto implica diseño proactivo, no reactivo.

**Supuesto 2 — El "Header IA 2" ya en el Figma es el punto de entrada.**
No rediseñamos la arquitectura de navegación de Dropi. Extendemos el componente que ya existe en las 57 secciones. Esto minimiza la deuda de diseño y acelera la implementación.

**Supuesto 3 — La memoria es el producto.**
Gali sin memoria es otro chatbot más. La inversión en el modelo de memoria (negocio + proyectos + sesión) es lo que hace que Gali sea estructuralmente imposible de replicar por un competidor con ChatGPT.

---

## Mapa de fases

```
FASE 0 — Spec y Alineación          (Semana 1)
FASE 1 — Header IA 2 / Gali Global  (Semanas 1–2)
FASE 2 — Gali Contextual por módulo (Semanas 2–5)
FASE 3 — Sistema de Proyectos       (Semanas 5–7)
FASE 4 — Vistas Personalizadas      (Semanas 7–9)
FASE 5 — Onboarding de Gali         (Semana 9)
FASE 6 — Backend / Memoria          (Paralelo desde Semana 2)
```

Cada fase tiene: pasos numerados, dueño sugerido, criterio de "done", y el prompt RPP listo para el prototipo.

---

## FASE 0 — Spec y Alineación de Equipo
**Duración:** 1 semana | **Dueño:** Product + Design lead

Esta fase no produce wireframes ni código. Produce los documentos de referencia que todos los demás necesitan para trabajar sin bloquearse entre sí.

### Paso 0.1 — Leer el Figma completo de re-arquitectura

**Quién:** Product Designer + PM  
**Qué hacer:**
- Abrir el archivo Figma "Re-arquitectura — UI Oficial" (node 7797:113243)
- Navegar las 57 secciones e identificar en cuáles aparece el componente "Header IA 2"
- Identificar en cuáles aparece "Busqueda IA Banner"
- Documentar en una tabla: sección → tiene Header IA 2 → tiene Busqueda IA Banner → tiene algún elemento de IA → notas

**Entregable:** `docs/mapa-ia-en-figma.md` — tabla de 57 filas con el inventario completo  
**Done cuando:** Todos los módulos listados en la tabla con su estado de IA actual

---

### Paso 0.2 — Escribir el Spec de Gali

**Quién:** PM + Product Designer  
**Qué hacer:**

El spec es el documento al que Claude Code, design y engineering van a acudir cuando tengan dudas. Debe cubrir exactamente estos bloques:

```
# Spec de Gali v1.0

## 1. Definición del sistema
## 2. Los 3 niveles de presencia (Ambiental / Contextual / Proyectos)
## 3. Modelo de memoria (negocio / proyectos / sesión)
## 4. Comportamientos proactivos (qué dispara a Gali sin que el usuario pregunte)
## 5. Límites claros de lo que Gali NO hace en v1
## 6. Decisiones de diseño abiertas (lo que no está resuelto aún)
## 7. Glosario de términos (Proyecto, Vista, Señal, Misión, Modo)
```

**Entregable:** `docs/Specs/Gali_v1_Spec.md` en el repo  
**Done cuando:** PM y Tech Lead firman el spec (comentan "LGTM" en el PR)

---

### Paso 0.3 — Crear el navigation-map.json de Gali

**Quién:** Tech Lead + Product Designer  
**Qué hacer:**

El `navigation-map.json` es el archivo que Claude Code usa en el pipeline RPP para saber cómo navegar entre pantallas del prototipo. Antes de generar ningún wireframe, este mapa tiene que existir con los módulos de Gali incluidos.

Agregar al `navigation-map.json` existente las siguientes rutas nuevas:

```json
{
  "gali": {
    "header-input": {
      "type": "component",
      "description": "Campo de entrada de Gali siempre visible en el header",
      "origin_points": ["todas las vistas"],
      "target": "gali/response-overlay"
    },
    "response-overlay": {
      "type": "overlay",
      "description": "Panel de respuesta contextual de Gali",
      "stacks_on": "current_view",
      "on_close": "returns_to_origin"
    },
    "proyectos": {
      "type": "page",
      "description": "Vista de un Proyecto activo",
      "children": ["resumen", "historial", "assets", "siguiente-accion"]
    },
    "vistas-personalizadas": {
      "type": "dynamic-page",
      "description": "Vistas generadas por Gali para cada dropshipper",
      "parent": "menu-lateral"
    },
    "onboarding": {
      "type": "page",
      "description": "Primera vez: 3 preguntas de Gali para construir perfil",
      "trigger": "primer_login"
    }
  }
}
```

**Entregable:** PR con `navigation-map.json` actualizado  
**Done cuando:** Claude Code puede parsear el archivo sin errores

---

### Paso 0.4 — Alinear el equipo en una sesión de 1 hora

**Quién:** Todos (Design, Product, Engineering, QA si existe)  
**Agenda:**
1. Leer los supuestos fundacionales en voz alta — 5 min
2. Walkthrough del spec de Gali v1.0 — 20 min
3. Walkthrough del navigation-map.json nuevo — 10 min
4. Identificar dependencias críticas entre equipos — 15 min
5. Firmar el acuerdo de no-scope-creep: qué NO entra en v1 — 10 min

**Entregable:** `docs/alineacion-kickoff.md` con las decisiones tomadas y los "fuera de scope" explícitos  
**Done cuando:** Todos los asistentes mencionados han confirmado en el doc

---

## FASE 1 — Header IA 2 / Gali Global
**Duración:** 1,5 semanas | **Dueño:** Product Designer principal

Esta es la fase más crítica del proyecto. Si el Header IA 2 está bien diseñado, Gali ya está presente en las 57 secciones de Dropi sin tocar ninguna de ellas individualmente.

### Paso 1.1 — Auditar el componente "Header IA 2" actual en Figma

**Quién:** Product Designer  
**Qué hacer:**
- Abrir el componente "Header IA 2" en el archivo de componentes de Dropi DS
- Documentar: qué elementos contiene hoy, qué estados tiene (default, hover, focus), qué propiedades son editables
- Identificar: ¿Hay espacio para el input de Gali? ¿O hay que rediseñar el layout?
- Screenshot del componente actual con anotaciones

**Entregable:** `docs/auditoria-header-ia2.md` con screenshots y análisis  
**Done cuando:** Diseñador sabe exactamente qué puede reusar y qué hay que agregar

---

### Paso 1.2 — Diseñar el Header IA 2 con Gali activo

**Quién:** Product Designer  
**Qué hacer:**

El header rediseñado debe tener estos estados:

```
Estado 1 — Default (Gali presente pero en reposo)
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Nav principal]                    [✦ Gali] [Avatar] │
│ ✦ "¿Qué quieres hacer hoy?"  ________________________       │
└─────────────────────────────────────────────────────────────┘

Estado 2 — Focus (usuario está escribiendo)
┌─────────────────────────────────────────────────────────────┐
│ [Logo]                                              [Avatar] │
│ ✦ [input expandido con cursor activo]      [Enviar] [⌘+K]  │
│ Sugerencias: "Analizar este producto" · "Ver novedades" · + │
└─────────────────────────────────────────────────────────────┘

Estado 3 — Con señal proactiva (Gali tiene algo que decir)
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Nav principal]             [✦ Gali · 2 señales] [▲] │
│ ✦ "Tu campaña del collar GPS lleva 72h — ROAS 2.8x ↑"      │
└─────────────────────────────────────────────────────────────┘

Estado 4 — Gali respondiendo (loading / streaming)
┌─────────────────────────────────────────────────────────────┐
│ [Logo]                                              [Avatar] │
│ ✦ [Input con texto del usuario]              [⏹ Detener]   │
│ ● ● ●  Gali está analizando tu catálogo...                  │
└─────────────────────────────────────────────────────────────┘
```

Diseñar todos los estados en Figma. Crear variantes del componente para cada estado.

**Entregable:** Sección "Gali / Header IA 2" en el archivo Figma de componentes, con 4+ variantes  
**Done cuando:** Otro diseñador puede usar el componente sin preguntar cómo funciona

---

### Paso 1.3 — Diseñar el Response Overlay de Gali

**Quién:** Product Designer  
**Qué hacer:**

El overlay es lo que aparece cuando Gali responde. No es una página nueva — es una capa que se apila sobre donde estás. Debe incluir:

- El texto/acción de Gali (streaming, como Claude)
- Componentes Gen UI que Gali puede renderizar: ProductCard, ActionButton, ProjectCard
- Botones de acción directa: "Hacer esto", "Guardar en proyecto", "Más opciones"
- Botón de cerrar que devuelve al contexto original sin perder nada

Diseñar también el estado de "Gali actúa": cuando Gali no solo responde sino que ejecuta una acción (ej: "Creando tu landing...").

**Entregable:** Componente "Gali / Response Overlay" en Figma con variantes: text-only, con-product-card, con-action, gali-actuando  
**Done cuando:** Cubre los 5 casos de uso principales de Gali descritos en el spec

---

### Paso 1.4 — Prototipo del Header IA 2 con RPP

**Quién:** Product Designer (usa el pipeline RPP / Claude Code)  
**Cuándo:** Una vez que los pasos 1.2 y 1.3 están en Figma

Usar el siguiente prompt en Claude Code dentro del repo `dropi-prototypes`:

---

#### 🔧 PROMPT RPP — Header IA 2 Global

```
Genera un wireframe interactivo para la siguiente vista:

### Vista *
- Nombre: Gali — Header IA 2 Global
- Módulo: gali > header-global
- Rol de usuario: dropshipper

### Figma *
- URL: [pegar URL del componente Header IA 2 en el Figma de re-arquitectura]
- Nodos adicionales:
  - Estado default: [node-id del estado 1]
  - Estado focus: [node-id del estado 2]
  - Estado con señal: [node-id del estado 3]
  - Response overlay: [node-id del overlay]

### Tipo de vista *
- [x] Página completa (page) — usar Catálogo como vista base donde vive el header
- [ ] Modal (overlay)

### Datos mock
- Entidad principal: señales proactivas de Gali
- Cantidad mínima de items: 3 señales activas (1 de campaña, 1 de novedad, 1 de oportunidad)
- Propiedades importantes: tipo (campaña|novedad|oportunidad), titulo, descripcion_corta, accion_sugerida, urgencia (alta|media|baja)
- ¿Hay imágenes en el diseño de Figma?: no

### Interacciones clave
- Click en input del header → estado Focus con sugerencias contextuales
- Escribir texto + Enter → aparece Response Overlay con streaming de Gali (simular con texto progresivo)
- Click en señal proactiva (campana/badge) → expandir panel de señales
- Dentro del overlay: click "Hacer esto" → toast de confirmación + cerrar overlay
- Dentro del overlay: click "Guardar en proyecto" → mini-drawer para elegir o crear proyecto
- ESC o click fuera → cerrar overlay, volver al estado default del header

### Contexto adicional
- Ticket Jira: GALI-001
- Notas: El input de Gali NO es una búsqueda. Es un campo de lenguaje natural. No filtrar resultados — abrir el overlay de Gali. El placeholder debe cambiar según la sección activa (ej: en Catálogo → "¿Qué producto buscas o qué quieres hacer?", en Pedidos → "¿Qué necesitas revisar hoy?").
- Componentes DS a usar: dropi-input, dropi-button, dropi-overlay, dropi-toast
- Referentes visuales: Claude chat (streaming), Perplexity (respuesta con acciones), Cursor (command palette)
```

---

**Done cuando:** El prototipo compila y un dropshipper ajeno al proyecto puede entender qué hace Gali al verlo 2 minutos

---

## FASE 2 — Gali Contextual por módulo
**Duración:** 3 semanas | **Dueño:** Product Designer + PM por módulo

En esta fase, Gali "despierta" dentro de cada sección de Dropi. No rediseñamos las secciones — añadimos el estado "con Gali activa" a los componentes clave de cada módulo.

El orden de implementación está dado por impacto en el dropshipper (de mayor a menor):

```
Prioridad 1: Catálogo / Caza Productos   (donde empieza todo)
Prioridad 2: Pedidos / Novedades         (donde se pierde más tiempo hoy)
Prioridad 3: Marketing / Campañas        (donde está el dinero)
Prioridad 4: Reportes / ROAX Dashboard   (donde está la inteligencia)
Prioridad 5: Financiero / Wallet         (donde está la proyección)
```

---

### Módulo Prioridad 1 — Catálogo / Caza Productos

#### Paso 2.1 — Diseñar el estado "despertado por Gali" de la ProductCard

**Quién:** Product Designer  
**Qué hacer:**

La ProductCard en el catálogo tiene hoy un estado default. Necesita un estado nuevo: "expandida por Gali". Este estado se activa cuando el usuario toca el ícono ✦ en la tarjeta, o cuando Gali la destaca proactivamente.

El estado expandido debe mostrar:
- Análisis de tendencia: "En curva de entrada en Bogotá — 10 días antes de saturación"
- ROAS promedio de vendedores con ese producto en LATAM
- 2–3 ángulos de venta que han funcionado para ese producto
- Acciones posibles con un solo tap: "Crear landing", "Ver proveedores", "Añadir a proyecto", "Analizar con Gali"

**Entregable:** Variante "gali-expandida" en el componente ProductCard del DS de Figma

---

#### Paso 2.2 — Prototipo de Catálogo con Gali activa (RPP)

Usar el siguiente prompt en Claude Code:

---

#### 🔧 PROMPT RPP — Catálogo con Gali Contextual

```
Genera un wireframe interactivo para la siguiente vista:

### Vista *
- Nombre: Catálogo de productos — con Gali contextual
- Módulo: productos > catalogo > gali-contextual
- Rol de usuario: dropshipper

### Figma *
- URL: https://www.figma.com/design/InvoCKay8rCZ2t2s9N5cUt/Productos-v2.0?node-id=3396-23328
- Nodos adicionales:
  - Filtros: 3396:23381
  - Card producto (default): 3396:23383
  - Card producto (gali-expandida): [node-id del nuevo estado diseñado en paso 2.1]
  - Header IA 2 con Gali: [node-id del header rediseñado en fase 1]

### Tipo de vista *
- [x] Página completa (page)
- [ ] Modal (overlay)

### Datos mock
- Entidad principal: productos
- Cantidad mínima de items: 21 productos
- Propiedades importantes: id, name, price, suggestedPrice, stock, category, tags, badge, imageUrl, supplierId, supplierName, gali_tendencia, gali_roas_promedio, gali_angulos (array), gali_dias_antes_saturacion
- ¿Hay imágenes en el diseño de Figma?: sí
  - Descargar a src/assets/images/products/

### Interacciones clave
- Click en ✦ de cualquier ProductCard → esa tarjeta se expande al estado "gali-expandida"
  - El resto del catálogo se atenúa (overlay sutil)
  - La tarjeta expandida muestra análisis + ángulos + acciones de Gali
- Click "Crear landing" dentro de la tarjeta expandida → navegar a Creador de Páginas con contexto del producto pre-cargado
- Click "Añadir a proyecto" → mini-overlay para elegir o crear un Proyecto de Gali
- Click "Analizar con Gali" → abre el Header Input de Gali con el producto como contexto pre-cargado
- Click fuera de la tarjeta expandida → vuelve al estado default del catálogo
- El "Busqueda IA Banner" en el header también dispara el input de Gali (misma lógica que Header IA 2)

### Contexto adicional
- Ticket Jira: GALI-010
- Notas: Los datos `gali_*` en el mock son generados por Gali. Para el prototipo, hardcodear valores realistas para 3–4 productos estrella y valores genéricos para el resto. El ícono ✦ en la card debe ser sutil — no competir con el diseño actual de la tarjeta.
- Componentes DS a usar: dropi-card, dropi-button, dropi-overlay, dropi-badge
```

---

#### Paso 2.3 — Diseñar y prototipar Caza Productos con Gali

**Quién:** Product Designer  
**Qué hacer:**

Caza Productos es donde el dropshipper descubre qué vender. Con Gali, se convierte en el modo "Descubrimiento Inteligente": en lugar de navegar pasivamente, Gali puede hacer recomendaciones proactivas basadas en el perfil del dropshipper.

Diseñar la vista "Modo Descubrimiento Gali" dentro de Caza Productos. Esta vista tiene:
- Un header de Gali con la pregunta "¿Qué tipo de producto estás buscando hoy?"
- Chips de sugerencia generados por Gali según el historial del dropshipper
- Resultados que Gali rankea según el perfil del usuario, no solo por popularidad general
- Cada resultado con su "razonamiento" visible: por qué Gali sugiere este producto para este dropshipper

Usar el template RPP variante spec-derived (sin Figma aún, con el spec de Gali como fuente de verdad).

**Done cuando:** Un dropshipper puede usar el prototipo de Caza Productos y entiende en 30 segundos por qué Gali le sugiere cada producto

---

### Módulo Prioridad 2 — Pedidos / Novedades

#### Paso 2.4 — Diseñar la vista "Novedades filtradas por Gali"

**Quién:** Product Designer + PM de operaciones  
**Qué hacer:**

La vista de Novedades hoy es una lista plana. Con Gali, se convierte en un sistema de triage inteligente.

Diseñar tres zonas en la vista de Novedades:
```
ZONA 1 — Críticas (requieren tu decisión)
  Muestra: N novedades que Gali no puede resolver sola
  Cada novedad: tipo + resumen en 1 línea + acción recomendada

ZONA 2 — Gali las está manejando
  Muestra: N novedades en proceso automático
  Cada novedad: tipo + estado del proceso + ETA de resolución
  Puede expandirse para ver el detalle

ZONA 3 — Resueltas hoy por Gali
  Muestra: N novedades ya cerradas automáticamente
  Colapsada por default — expandir para auditar
```

**Entregable:** Sección "Pedidos / Novedades — Gali Triage" en Figma  
**Done cuando:** PM de operaciones confirma que el flujo cubre los tipos de novedad más comunes

---

#### 🔧 PROMPT RPP — Novedades con Triage de Gali

```
Genera un wireframe interactivo para la siguiente vista:

### Vista *
- Nombre: Novedades — Triage Gali
- Módulo: pedidos > novedades > gali-triage
- Rol de usuario: dropshipper

### Figma *
- URL: [URL de la sección Novedades en el Figma de re-arquitectura]
- Nodos adicionales:
  - Header Novedades: [node-id]
  - Card de novedad (default): [node-id]
  - Card de novedad (gali-resolviendo): [node-id — diseñado en paso 2.4]
  - Header IA 2 con Gali: [node-id de la Fase 1]

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: novedades
- Cantidad mínima de items: 14 novedades (3 críticas + 6 en proceso + 5 resueltas)
- Propiedades importantes: id, tipo (direccion_incorrecta|devolucion|no_entregado|fraude), pedido_id, cliente, fecha, estado_gali (pendiente|procesando|resuelto), accion_gali, requiere_humano (boolean), urgencia
- ¿Hay imágenes?: no

### Interacciones clave
- Vista carga con las 3 zonas (Críticas / En proceso / Resueltas)
- Click en novedad crítica → expande detalle con contexto completo + acción recomendada por Gali + botones "Aprobar acción de Gali" y "Manejar yo"
- Click "Aprobar acción de Gali" → toast de confirmación + novedad pasa a zona "En proceso"
- Click en novedad en proceso → expande con log de lo que Gali está haciendo en tiempo real
- Zona "Resueltas" colapsada por default — click para expandir y ver auditoría
- Input de Gali en header → preguntar cosas como "¿Cuánto perdí por novedades esta semana?"

### Contexto adicional
- Ticket Jira: GALI-020
- Notas: El objetivo emocional es que el dropshipper sienta alivio al ver esta pantalla, no ansiedad. El diseño debe transmitir control y que Gali tiene la situación manejada. Evitar colores rojos en masa — reservar el rojo solo para las novedades donde Gali realmente necesita la decisión humana.
- Componentes DS a usar: dropi-card, dropi-badge, dropi-button, dropi-toast, dropi-log-stream
```

---

### Módulo Prioridad 3 — Marketing / Campañas

#### Paso 2.5 — Diseñar el indicador de salud de campaña calculado por Gali

**Quién:** Product Designer  
**Qué hacer:**

Cada campaña activa en la sección Marketing tiene hoy métricas básicas (impresiones, CTR, costo). Con Gali, cada campaña tiene un "indicador de salud" calculado en contexto:

```
CAMPAÑA: Collar GPS — Meta Ads              SALUD: 🟢 Buena (8.2/10)
ROAS: 2.8x | CTR: 3.4% | Presupuesto: $50/día
────────────────────────────────────────────────
GALI DICE: "Está funcionando bien. El creative Video B tiene 2x más
CTR que el A. Considera pausar el A y redirigir el presupuesto."
ACCIÓN SUGERIDA: [Pausar creative A]  [Ver comparativa]  [Más info]
```

Para campañas en mal estado:
```
CAMPAÑA: Silla ergonómica — Meta Ads        SALUD: 🔴 Atención (3.1/10)
ROAS: 0.8x | CTR: 0.9% | Presupuesto: $30/día
────────────────────────────────────────────────
GALI DICE: "Estás perdiendo $8 por día. El ángulo no está resonando.
Los mejores vendedores de este producto usan el ángulo 'dolor de espalda
en home office'. El tuyo habla de 'calidad premium'."
ACCIÓN SUGERIDA: [Pausar campaña]  [Cambiar ángulo]  [Ver ejemplos que sí funcionan]
```

**Entregable:** Componente "CampaignCard — con Gali health indicator" en Figma (variantes: salud-buena, salud-media, salud-mala, gali-expandida)

---

### Módulos Prioridad 4 y 5 — ROAX Dashboard y Financiero

#### Paso 2.6 — Diseñar los diagnósticos de Gali en métricas

**Quién:** Product Designer  
**Qué hacer:**

Para ROAX / Dashboard:
- Cada métrica clave (ROAS, CTR, conversión) tiene un tooltip expandible de Gali
- El tooltip no repite el número — da contexto: "Tu ROAS es 2.1x. El promedio para tu perfil en Colombia es 2.8x. La brecha está en el CTR."
- Diseñar el componente "Metric + Gali Context" como variante del componente de métrica existente

Para Financiero / Wallet:
- Un panel de "Proyección de Gali" debajo del saldo actual
- Muestra: liquidez proyectada a 30 días con el ritmo actual de ventas
- Muestra: recomendación de fecha óptima de retiro
- Diseñar como componente "WalletProjection" nuevo

**Entregable:** Dos nuevos componentes en Figma: "MetricGaliContext" y "WalletProjection"  
**Done cuando:** Un dropshipper puede leer la proyección sin saber qué es un ROAS

---

## FASE 3 — Sistema de Proyectos de Gali
**Duración:** 2 semanas | **Dueño:** Product Designer + Tech Lead

Esta es la pieza más nueva y la más diferenciadora. No existe nada parecido en Dropi hoy.

### Paso 3.1 — Diseñar la arquitectura de datos de un Proyecto

**Quién:** Tech Lead + PM  
**Qué hacer:**

Antes de diseñar la UI, definir exactamente qué guarda un Proyecto. Esta decisión de arquitectura determina qué puede mostrar Figma y qué puede hacer Claude Code.

Estructura de datos de un Proyecto:

```typescript
interface GaliProject {
  id: string;
  name: string;  // "Lanzamiento collar GPS — Oct 2026"
  status: 'activo' | 'pausado' | 'completado' | 'archivado';
  created_at: Date;
  last_activity: Date;
  
  // El producto/nicho central del proyecto
  product?: {
    id: string;
    name: string;
    catalog_link: string;
    angulo_elegido: string;
  };
  
  // Assets creados en el contexto del proyecto
  assets: {
    landings: LandingRef[];
    creatives: CreativeRef[];
    campaigns: CampaignRef[];
  };
  
  // Memoria de Gali para este proyecto
  gali_memory: {
    decisiones: Decision[];       // qué se eligió y por qué
    aprendizajes: Aprendizaje[];  // qué funcionó, qué no
    siguiente_accion: string;     // qué dice Gali que viene
    conversaciones: ConvRef[];    // historial de conversaciones
  };
  
  // Métricas agregadas del proyecto
  metrics: {
    roas_actual: number;
    ventas_totales: number;
    novedades_relacionadas: number;
    dias_activo: number;
  };
}
```

**Entregable:** `docs/arquitectura-gali-projects.md` con el schema completo y las decisiones de trade-off  
**Done cuando:** Frontend y Backend saben exactamente qué van a guardar y mostrar

---

### Paso 3.2 — Diseñar la UI del Proyecto en Figma

**Quién:** Product Designer  
**Qué hacer:**

La vista de un Proyecto activo tiene cuatro bloques:

```
┌────────────────────────────────────────────────────────────────┐
│ BLOQUE 1 — Hero del proyecto                                    │
│ ✦ PROYECTO: Lanzamiento collar GPS          [Activo] [···]     │
│ Creado hace 5 días · Última actividad: hace 2h                 │
│                                                                  │
│ [Producto] → [Landing] → [Campaña] → [ROAS: 2.8x ↑]          │
│  pipeline visual del estado actual del proyecto                 │
├────────────────────────────────────────────────────────────────┤
│ BLOQUE 2 — Gali recuerda                                        │
│ ✦ Lo que sé de este proyecto:                                   │
│ • Elegiste el ángulo "Mamá / seguridad emocional"              │
│ • El creative Video B tiene 2x más CTR que el A               │
│ • Tienes 14 días antes de saturación en Bogotá                 │
├────────────────────────────────────────────────────────────────┤
│ BLOQUE 3 — Siguiente acción sugerida                            │
│ ✦ ¿Qué sigue?                                                   │
│ "Expandir a Medellín — hay demanda sin competencia activa.     │
│  Estimo +$200/día con el mismo creative."                       │
│ [Sí, hazlo]  [Cuéntame más]  [Más tarde]                       │
├────────────────────────────────────────────────────────────────┤
│ BLOQUE 4 — Historial del proyecto                               │
│ [Conversaciones] [Decisiones] [Assets] [Resultados]             │
│ (tabs, cada una con su contenido histórico)                     │
└────────────────────────────────────────────────────────────────┘
```

**Entregable:** Frame "Gali / Vista Proyecto" en Figma con 4 bloques completos y estados de cada uno

---

#### 🔧 PROMPT RPP — Vista de Proyecto de Gali (variante spec-derived)

```
Genera un wireframe interactivo derivado de un spec narrativo:

### Vista *
- Nombre: Gali — Vista de Proyecto Activo
- Módulo: gali > proyectos > detalle
- Rol de usuario: dropshipper

### Spec source *
- Ruta: docs/Specs/Gali_v1_Spec.md
- Sección / anchor: "## Sistema de Proyectos"
- Sub-secciones relevantes:
  - Estructura de datos: docs/arquitectura-gali-projects.md
  - Wireframe de referencia: Frame "Gali / Vista Proyecto" en Figma (diseñado en paso 3.2)

### Tipo de vista *
- [x] Página completa (page)

### Componentes Gen UI a renderizar
- ProjectHero — header con nombre, estado y pipeline visual de progreso
- GaliMemoryPanel — lista de lo que Gali recuerda: ángulos, learnings, alertas
- NextActionCard — la sugerencia de siguiente acción con botones de decisión
- ProjectHistory (tabs) — conversaciones / decisiones / assets / resultados

### Datos mock
- Entidad principal: proyecto + producto + campañas
- Cantidad mínima de items: 1 proyecto completo con datos realistas
- Propiedades importantes (del proyecto): name, product.name, product.angulo, days_active, roas_actual, creative_ganador, ciudad_principal, dias_antes_saturacion, siguiente_accion_gali
- ¿Hay imágenes?: sí — reusar src/assets/images/products/ para la imagen del producto del proyecto

### Interacciones clave
- Pipeline visual (Producto → Landing → Campaña → ROAS): click en cualquier nodo → navegar a esa sección con el contexto del proyecto pre-cargado
- Click "Sí, hazlo" en siguiente acción → Gali inicia la acción con un execution stream visible
- Click "Cuéntame más" → abre input de Gali con contexto del proyecto para conversar
- Tab "Conversaciones" → historial de mensajes con Gali en este proyecto (formato chat)
- Tab "Decisiones" → timeline de decisiones tomadas con razonamiento
- Tab "Assets" → grid de landings y creatives creados, cada uno linkeable
- Tab "Resultados" → gráfica simple de ROAS + ventas en el tiempo

### Decisiones de diseño que el spec NO resuelve
- ¿El pipeline es horizontal scrollable o siempre visible? → preguntar al usuario
- ¿Los proyectos son ilimitados o el plan del dropshipper limita cuántos puede tener?
- ¿La memoria de Gali es editable por el dropshipper? ¿Puede borrar un "aprendizaje" incorrecto?

### Contexto adicional
- Ticket Jira: GALI-030
- Sensación buscada: "Esto es como tener un socio que recuerda todo y siempre sabe qué sigue"
- Out of scope explícito: NO implementar colaboración entre usuarios en un mismo proyecto (v2)
- Referentes visuales: Notion (organización de info), Linear (timeline de decisiones), Cursor (execution stream de Gali actuando)
```

---

### Paso 3.3 — Diseñar la entrada de Proyectos desde el menú lateral

**Quién:** Product Designer  
**Qué hacer:**

En el menú de navegación de Dropi, debajo de las secciones estándar, agregar:

```
NAVEGACIÓN ESTÁNDAR
  📦 Catálogo
  🛒 Pedidos
  📣 Marketing
  📊 Reportes
  💰 Financiero
  ⚙️ Configuraciones

─────────────────────────
✦ MIS PROYECTOS  [+ Nuevo]
  🚀 Collar GPS      ●  (activo)
  🔍 Fitness nicho   ◌  (pausado)
  ────────────────────
  📂 Archivados (3)
```

Diseñar también el estado vacío: qué ve un dropshipper que aún no tiene proyectos (onboarding implícito).

**Entregable:** Variante del componente de menú lateral de Dropi con la sección "Mis Proyectos"

---

## FASE 4 — Vistas Personalizadas
**Duración:** 2 semanas | **Dueño:** Product Designer + Tech Lead

Las Vistas Personalizadas son el nivel más avanzado de personalización de Dropi. Gali crea una sección nueva en el menú lateral que es única para cada dropshipper.

### Paso 4.1 — Diseñar el flujo de creación de una Vista

**Quién:** Product Designer  
**Qué hacer:**

El flujo tiene tres entradas posibles:
1. El dropshipper le pide a Gali una vista desde el input del header ("Gali, crea una vista de mi operación de hoy")
2. El dropshipper hace click en "+ Nueva" en la sección "Mis Vistas" del menú
3. Gali lo sugiere proactivamente ("Veo que revisas estas 4 secciones todos los días — ¿te armo una vista que las combine?")

En todos los casos, el flujo es:
```
Input de intención → Gali confirma lo que entendió → Gali muestra preview → Dropshipper aprueba → Vista guardada en menú
```

Diseñar cada pantalla de este flujo.

**Entregable:** Flujo "Creación de Vista Personalizada" en Figma — 5 estados: input, confirmación de Gali, preview, aprobación, guardado

---

### Paso 4.2 — Diseñar los templates de Vista más comunes

**Quién:** Product Designer + PM  
**Qué hacer:**

Hay 3 Vistas que el 80% de los dropshippers van a querer. Diseñar estas como templates predefinidos que Gali puede generar rápidamente:

**Vista: "Mi operación de hoy"**
- Pedidos del día + novedades pendientes + campañas activas con estado + saldo disponible

**Vista: "Mis productos ganadores"**
- Catálogo filtrado por los productos con ROAS > 2x, con estado de campaña y stock

**Vista: "Lanzamiento: [nombre del proyecto]"**
- Todo lo de un Proyecto específico en una sola pantalla sin tabs: producto + landing + campaña + resultados + siguiente acción

Diseñar las 3 vistas en Figma como pantallas completas con datos mock realistas.

**Entregable:** 3 frames de "Vistas Personalizadas" en Figma  
**Done cuando:** PM puede usarlas en una demo sin explicar qué son

---

#### 🔧 PROMPT RPP — Vista Personalizada "Mi operación de hoy"

```
Genera un wireframe interactivo derivado de un spec narrativo:

### Vista *
- Nombre: Mi operación de hoy — Vista Personalizada Gali
- Módulo: gali > vistas-personalizadas > operacion-hoy
- Rol de usuario: dropshipper

### Spec source *
- Ruta: docs/Specs/Gali_v1_Spec.md
- Sección / anchor: "## Vistas Personalizadas — Template: Operación de hoy"
- Sub-secciones: definición de los 4 bloques, criterios de dato fresco vs. cacheado

### Tipo de vista *
- [x] Página completa (page)

### Componentes Gen UI a renderizar
- DayOrdersWidget — resumen de pedidos del día (nuevos / en tránsito / entregados)
- NovedadesPendientesWidget — lista corta de novedades críticas (máx 5, ver más)
- CampañasActivasWidget — tabla mini con campañas activas + ROAS + salud
- WalletWidget — saldo disponible + proyección de Gali a 7 días

### Datos mock
- Entidad principal: vista compuesta (pedidos + novedades + campañas + wallet)
- Propiedades para pedidos: total_dia, nuevos, en_transito, entregados, novedades_criticas
- Propiedades para campañas: nombre, roas, salud_gali, presupuesto_diario
- Propiedades para wallet: saldo, proyeccion_7d, recomendacion_retiro

### Interacciones clave
- Click en cualquier número de pedidos → navegar a Pedidos con el filtro aplicado
- Click en novedad → navegar a Novedades con esa novedad expandida
- Click en campaña → navegar a Marketing con esa campaña seleccionada
- Click en saldo wallet → navegar a Financiero
- Input de Gali en header con contexto de "operación de hoy" pre-cargado
- Botón "Editar esta vista" (top right) → mini-drawer para cambiar qué widgets muestra

### Contexto adicional
- Ticket Jira: GALI-040
- Sensación buscada: "Mi centro de comando. Todo lo importante de hoy, sin navegar."
- Notas: Esta vista se actualiza automáticamente al abrirla (no hay botón refresh manual — Gali la mantiene fresca). El timestamp "Actualizada hace 3 min" debe ser visible.
```

---

## FASE 5 — Onboarding de Gali
**Duración:** 1 semana | **Dueño:** Product Designer + UX Writer

El onboarding de Gali es la primera impresión del sistema. Determina si el dropshipper entiende que esto es diferente a un chatbot.

### Paso 5.1 — Diseñar el flujo de onboarding (3 preguntas)

**Quién:** Product Designer + UX Writer  
**Qué hacer:**

Cuando un dropshipper usa Gali por primera vez (primer login o primer click en el input de Gali), en lugar de mostrar un tutorial vacío, Gali hace 3 preguntas que construyen el perfil inicial:

```
PREGUNTA 1: ¿En qué está tu negocio ahora?
  [ ] Estoy empezando — todavía buscando mi primer producto ganador
  [ ] Ya tengo un producto que vende — quiero escalarlo
  [ ] Tengo varios productos activos — necesito organizar la operación
  [ ] Busco un nicho nuevo para diversificar

PREGUNTA 2: ¿Cuánto tiempo llevas en Dropi?
  [ ] Soy nuevo (menos de 3 meses)
  [ ] Llevo algunos meses (3-12 meses)
  [ ] Llevo más de un año
  [ ] Soy proveedor que quiere entender el lado dropshipper

PREGUNTA 3: ¿Cuál es el mayor dolor que sientes hoy?
  [ ] No sé qué productos vender / tengo miedo de elegir mal
  [ ] Mis campañas no están dando el ROAS que quiero
  [ ] Me pierdo entre novedades y no tengo tiempo para lo importante
  [ ] No entiendo bien mis finanzas y flujo de caja
  [ ] Otro: [input libre]
```

Con esas 3 respuestas, Gali genera el perfil inicial y sugiere la primera misión.

**Entregable:** Flujo "Onboarding Gali — 3 preguntas" en Figma (4 pantallas: pregunta 1, pregunta 2, pregunta 3, resultado + primera misión sugerida)

---

### Paso 5.2 — Diseñar el "Momento Wow" del onboarding

**Quién:** Product Designer  
**Qué hacer:**

Después de las 3 preguntas, Gali no muestra un "¡Configuración completa!" genérico. Muestra algo específico y sorprendente:

```
┌────────────────────────────────────────────────────────────────┐
│  ✦ Ya te conozco, Alejandra.                                    │
│                                                                  │
│  Eres una vendedora con 8 meses de experiencia que tiene un     │
│  producto funcionando pero quiere escalar. Tu mayor bloqueo     │
│  son las campañas de Meta.                                       │
│                                                                  │
│  Aquí está tu primera misión:                                    │
│                                                                  │
│  🎯 MISIÓN: Optimiza tu campaña actual                           │
│  Hay 3 cosas específicas que los dropshippers con tu perfil     │
│  hacen diferente. Vamos a revisar la tuya juntos.               │
│                                                                  │
│  [Empezar esta misión →]                    [Explorar Dropi primero] │
└────────────────────────────────────────────────────────────────┘
```

Este momento es el que determina si el dropshipper va a usar Gali o no. El diseño debe transmitir: "Gali ya me entiende".

**Entregable:** Frame "Onboarding Gali — Momento Wow" en Figma con 3 variantes según el perfil del dropshipper (principiante / intermedio / avanzado)

---

## FASE 6 — Backend / Infraestructura de Memoria
**Duración:** Paralelo desde Semana 2 | **Dueño:** Tech Lead + Backend Engineer

Esta fase corre en paralelo con las fases de diseño y prototipado. Su objetivo es que cuando el prototipo esté aprobado, el backend pueda soportarlo.

### Paso 6.1 — Definir el stack de memoria de Gali

**Quién:** Tech Lead  
**Qué hacer:**

Gali necesita tres tipos de almacenamiento:

```
MEMORIA DE NEGOCIO (largo plazo, permanente)
  → Base de datos relacional (PostgreSQL/Supabase)
  → Tablas: gali_user_profiles, gali_business_history, gali_product_learnings
  → Se actualiza con cada acción del dropshipper en Dropi

MEMORIA DE PROYECTOS (por proyecto, semi-permanente)
  → Tablas: gali_projects, gali_decisions, gali_assets, gali_project_convos
  → Se archiva cuando el proyecto se completa pero no se borra

MEMORIA DE SESIÓN (corto plazo, contexto de conversación)
  → Vector store o context window gestionado por el orquestador
  → Se limpia entre sesiones pero se resume y persiste lo importante
```

**Entregable:** `docs/arquitectura-memoria-gali.md` con el schema de BD, decisiones de stack, y plan de migración  
**Done cuando:** Tech Lead puede estimar el costo de infraestructura con un ±20% de confianza

---

### Paso 6.2 — Construir el orquestador de Gali (v0)

**Quién:** Backend Engineer + Tech Lead  
**Qué hacer:**

El orquestador es el sistema que decide qué hace Gali cuando recibe un input. Para v0 (prototipo funcional):

```
INPUT DEL DROPSHIPPER
         ↓
ROUTER DE INTENCIÓN
  → ¿Es una pregunta informativa? → Responder con contexto del negocio
  → ¿Es una tarea ejecutable? → Ejecutar herramienta (buscar producto, crear landing, etc.)
  → ¿Es una señal proactiva? → Registrar + notificar al dropshipper cuando corresponda
         ↓
CONTEXTO DE MEMORIA
  → Cargar perfil del dropshipper
  → Cargar proyecto activo (si aplica)
  → Cargar contexto de la sección actual
         ↓
EJECUCIÓN
  → LLM con contexto → Respuesta
  → Tool call → Acción en Dropi
  → Ambos → Respuesta + confirmación de acción
         ↓
ACTUALIZACIÓN DE MEMORIA
  → ¿Qué aprendió Gali de esta interacción?
  → Guardar en memoria de negocio y/o proyecto
```

**Entregable:** API endpoint `/api/gali/message` funcionando con los 3 tipos de respuesta (informativa, ejecutable, proactiva)

---

## Criterios de éxito globales del proyecto

Al final de las 6 fases, Gali en Dropi debe poder superar esta prueba con un dropshipper real que no conoce el proyecto:

**Test 1 — El test del header:**
"Abre Dropi, ve al Catálogo, escribe en el input de Gali: 'Ayúdame a elegir qué producto vender esta semana'". ¿Gali da una respuesta contextual y útil? ¿Puede el dropshipper entender cómo usarla en los primeros 30 segundos?

**Test 2 — El test de las novedades:**
"Abre Novedades. Sin explicar nada, ¿el dropshipper entiende que Gali ya está manejando algunas? ¿Siente alivio o confusión?"

**Test 3 — El test de la memoria:**
"Crea un proyecto. Cierra Dropi. Vuelve al día siguiente. ¿Gali recuerda dónde quedamos? ¿El dropshipper siente que tiene un socio con memoria, no un chatbot?"

**Test 4 — El test de la personalización:**
"Pídele a Gali una Vista de 'mis campañas activas'. ¿La crea? ¿Aparece en el menú lateral? ¿El dropshipper puede encontrarla mañana?"

Si los 4 tests pasan, Gali está lista para beta.

---

## Apéndice — Template RPP Completo para Wireframes de Gali

> Esta sección es la referencia de trabajo para el equipo de diseño. Cualquier product designer puede usar estos templates directamente en Claude Code dentro del repo `dropi-prototypes` para generar wireframes de cualquier componente de Gali.

### Template estándar (con nodos de Figma)

```
Genera un wireframe interactivo para la siguiente vista:

### Vista *
- Nombre: [ej: Gali — Header IA 2 Global]
- Módulo: [ej: gali > header-global]
- Rol de usuario: [dropshipper | proveedor | admin]

### Figma *
- URL: [pegar URL completa de Figma con node-id]
  Ejemplo: https://www.figma.com/design/InvoCKay8rCZ2t2s9N5cUt/...?node-id=XXXX
- Nodos adicionales (si aplica):
  - Estado X: [node-id]
  - Componente Y: [node-id]
  - Overlay Z: [node-id]

### Tipo de vista *
- [ ] Página completa (page)
- [ ] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: [ej: catálogo]
  - ¿Qué CTA lo abre?: [ej: ícono ✦ en ProductCard]
  - ¿Qué pasa al completar? (on_success): [ej: cierra + toast]
  - ¿Qué pasa al cancelar? (on_cancel): [ej: cierra, vuelve al origen]

### Datos mock
- Entidad principal: [ej: señales de Gali, proyectos, novedades]
- Cantidad mínima de items: [ej: 3 señales activas]
- Propiedades importantes: [lista de campos con tipos]
- ¿Hay imágenes en el diseño de Figma?: [sí/no]
  - Si sí: descargarlas a src/assets/images/[módulo]/

### Interacciones clave
- [describir cada interacción con formato: Trigger → Resultado]
- [ej: Click en ✦ de ProductCard → expande estado gali-expandida]
- [ej: Escribir en input + Enter → abre Response Overlay con streaming]

### Contexto adicional (opcional)
- Ticket Jira: [GALI-XXX]
- Notas de diseño: [detalles que no son evidentes en Figma]
- Componentes DS a usar: [dropi-card, dropi-button, etc.]
- Referentes visuales: [Claude, Cursor, Perplexity, etc.]
```

---

### Template variante spec-derived (para vistas de Gali sin Figma aún)

Para cualquier funcionalidad nueva de Gali donde el diseño en Figma aún no existe:

```
Genera un wireframe interactivo derivado de un spec narrativo:

### Vista *
- Nombre: [ej: Gali — Vista de Proyecto Activo]
- Módulo: [ej: gali > proyectos > detalle]
- Rol de usuario: [dropshipper | proveedor | admin]

### Spec source *
- Ruta: [ej: docs/Specs/Gali_v1_Spec.md]
- Sección / anchor: [ej: "## Sistema de Proyectos" (líneas XXX-YYY)]
- Sub-secciones relevantes:
  - Estructura de datos: [ruta al schema]
  - Wireframe de referencia: [frame de Figma si existe]

### Tipo de vista *
- [ ] Página completa (page)
- [ ] Modal (overlay)
  - Si es modal, ¿sobre qué vista se apila?: [...]
  - ¿Qué CTA lo abre?: [...]
  - ¿Qué pasa al completar? (on_success): [...]
  - ¿Qué pasa al cancelar? (on_cancel): [...]

### Componentes Gen UI a renderizar
Lista los componentes que Gali materializa en esta vista:
- [ej: ProjectHero — header con nombre, estado y pipeline visual]
- [ej: GaliMemoryPanel — lo que Gali recuerda del proyecto]
- [ej: NextActionCard — sugerencia de siguiente acción]
- [ej: ExecutionStream — cuando Gali está actuando]

### Datos mock
- Entidad principal: [ej: proyecto activo]
- Cantidad mínima de items: [ej: 1 proyecto con 3+ decisiones]
- Propiedades importantes: [lista completa de campos]
- ¿Hay imágenes?: [sí/no — generalmente reusar src/assets/images/*]

### Interacciones clave
- [ej: Click "Sí, hazlo" → Gali inicia acción con execution stream visible]
- [ej: Tab "Conversaciones" → historial de mensajes con Gali (formato chat)]
- [ej: Click en nodo del pipeline → navegar a esa sección con contexto del proyecto]

### Decisiones de diseño que el spec NO resuelve
Lista explícita de lo que hay que preguntar al usuario antes de codear:
- [ej: ¿El pipeline es horizontal scrollable o siempre visible?]
- [ej: ¿La memoria de Gali es editable por el dropshipper?]

### Contexto adicional (opcional)
- Ticket Jira: [GALI-XXX]
- Sensación buscada: [ej: "Esto es como tener un socio que recuerda todo"]
- Out of scope explícito: [lista de qué NO se prototipa en esta iteración]
- Referentes visuales: [ej: Cursor (execution stream), Notion (organización), Linear (timeline)]
```

---

### Checklist interno de Claude Code (se ejecuta automáticamente)

Claude Code sigue este orden al recibir cualquier prompt de Gali:

1. ☐ Leer `navigation-map.json` — ubicar módulo gali, tipo de vista, origin points
2. ☐ Leer `docs/Specs/Gali_v1_Spec.md` — verificar que la vista está dentro del spec v1
3. ☐ Consultar Figma `get_design_context` por cada nodo especificado (no asumir nada)
4. ☐ Leer DS Registry specs para cada componente involucrado
5. ☐ Resolver las "Decisiones de diseño abiertas" antes de codear (AskUserQuestion si aplica)
6. ☐ Descargar assets (imágenes, iconos) de Figma → `src/assets/[módulo]/`
7. ☐ Crear mock data con propiedades `gali_*` realistas y en español latinoamericano
8. ☐ Crear componente Angular standalone con SCSS (tokens de `_variables.scss`)
9. ☐ Agregar ruta lazy-loaded en `app.routes.ts`
10. ☐ Si es overlay: implementar con backdrop + animación de entrada, NO navegación
11. ☐ Actualizar `prototype` field en `navigation-map.json`
12. ☐ Verificar compilación sin errores

---

### Tips específicos para wireframes de Gali

- **El ícono ✦ es el marcador de Gali.** Úsalo en todos los elementos donde Gali tiene presencia — no uses otros iconos ni variaciones.
- **El streaming de texto es clave.** Simular la respuesta de Gali como texto que aparece progresivamente (no de golpe) cambia completamente la sensación del prototipo.
- **Las acciones de Gali tienen consecuencias visibles.** Si Gali "hace algo", el prototipo debe mostrar que algo cambió — un toast, un estado actualizado, un log de actividad.
- **Los datos mock de Gali son en español LATAM.** Nada de "Lorem ipsum". Usar nombres de productos colombianos, ciudades reales, precios en COP.
- **Si el spec dice "Gali dice:", ese texto va literal.** No parafrasear los mensajes de Gali — si el spec dice exactamente cómo Gali se expresa, ese tono es parte del diseño.
- **El tipo de vista es crítico para Gali.** Un overlay de Gali que se confunde con una página nueva destruye la sensación de "asistente contextual". Siempre debe quedar claro que Gali se está apilando sobre donde ya estabas.

---

*Documento generado en el contexto del proyecto Dropi Orquestador — Mayo 2026*  
*Versión: 1.0 — Plan explícito paso a paso con prompts RPP integrados*  
*Basado en: análisis de 57 secciones del Figma "Re-arquitectura — UI Oficial" (node 7797:113243)*
# Gali Projects Plan — Gestión de Proyectos Orientada a Objetivos

> **Fecha:** 2026-06-15 · Re-análisis completo de todas las versiones de Gali  
> **Autor:** Análisis profundo de `correccionescata12jun.md` + todas las versiones del repositorio  
> **Principio rector:** *El dropshipper no necesita un gestor de tareas — necesita un director de e-commerce que le diga qué proyecto abrir hoy para cumplir su objetivo de negocio mañana.*

---

## Índice

1. [Contexto estratégico — por qué Proyectos es el core](#1-contexto-estratégico)
2. [Features priorizados — Must / Should / Nice](#2-features-priorizados)
3. [Modelo de datos: objetivo → proyectos](#3-modelo-de-datos)
4. [Flujos UX detallados](#4-flujos-ux-detallados)
5. [Rol de Gali como asistente en proyectos](#5-rol-de-gali-como-asistente)
6. [Estado de implementación en Gali 6](#6-estado-de-implementación-en-gali-6)
7. [Riesgos y preguntas abiertas](#7-riesgos-y-preguntas-abiertas)
8. [Correcciones del 16 de junio — Análisis y Plan de Acción](#8-correcciones-del-16-de-junio--análisis-y-plan-de-acción)
9. [Análisis extendido 16 jun — "Avancemos en Gali" — Puntos no cubiertos en §8](#9-análisis-extendido-16-jun--avancemos-en-gali)

---

## 1. Contexto estratégico

### 1.1 El acuerdo del 12 jun (fuente: `correccionescata12jun.md`)

La reunión entre Laura Contreras, Diana Aldana y Catalina Giraldo produjo el acuerdo más importante del producto:

> **"Para ti [Catalina dropshipper] el objetivo es global, y por objetivo haces proyectos. Y que Gali te recomiende qué proyectos deberías hacer para cumplir el objetivo principal."**
> — Laura Contreras, 12 jun 2026

**La Fase 1 consensuada (norte de implementación):**
1. Construir la estructura de Proyectos: crear, dar objetivo, seguir progreso
2. Conectar contexto: Meta, TikTok, Shopify, Google Drive, Chatea Pro
3. Gali da señales como "paso a paso dinámico" (no wizard rígido)

**El dolor #1 del dropshipper que esta arquitectura resuelve:**
> "Cuando eres dropper sin mentor, no sabes qué hacer. El valor es que Gali me pueda decir fácilmente qué hacer en Dropi, porque en Dropi tú llegas y no sabes qué hacer."
> — Catalina Giraldo, 12 jun 2026

### 1.2 Por qué Proyectos es el espinazo de Gali

Sin proyectos, Gali es un dashboard con métricas. Con proyectos, Gali es un director de e-commerce que:
- Sabe cuál es el objetivo del negocio
- Conoce qué está funcionando y qué no
- Puede recomendar qué abrir, qué escalar, qué cerrar
- Mide el impacto de cada experimento en el objetivo global

Un proyecto es la **unidad narrativa mínima** de Gali: tiene un producto, una estrategia, agentes asignados, un ciclo de vida, y una contribución cuantificable al objetivo global.

---

## 2. Features priorizados

### 🔴 Must Have — Fase 1 (Casita)

| Feature | Descripción | Componente |
|---|---|---|
| **Objetivo global editable** | El usuario define su norte: texto + meta en pedidos/sem. Editable en cualquier momento con modal 1-paso. Barra de progreso `actual/meta` con estado en_camino/en_riesgo/cumplida. | `Gali6ProyectosCasaComponent` ✅ implementado |
| **Portfolio de proyectos con salud** | Cards de proyectos activos mostrando estado, pedidos/sem, ROAS real, % de salud. Card de proyectos cerrados/pausados colapsada por defecto. | `Gali6ProyectosCasaComponent` ✅ implementado |
| **% de contribución por proyecto al objetivo** | Cada card muestra "aporta X pedidos/sem = Y% de tu objetivo". Si un proyecto se pausa, el % del objetivo baja visiblemente. | `Gali6ProyectosCasaComponent` ⏳ pendiente |
| **Gali recomienda: 1-2 proyectos con justificación** | Derivado de señales tipo trend/opportunity de `MOCK_SENALES`. La justificación menciona pedidos faltantes para el objetivo + ventana de mercado. | `Gali6ProyectosCasaComponent` ⏳ justificación pendiente |
| **Nuevo proyecto — wizard 6 pasos** | Producto → Ángulo → Calculadora Brújula → Presupuesto con badge Gali → Agentes → Revisión + lanzamiento animado. | Spec 13 ⏳ pendiente |
| **Calculadora Brújula en wizard** | Inputs: costo producto + flete. Outputs: precio mínimo (break-even), precio recomendado (40% margen), slider de ajuste, margen proyectado con semáforo. | Spec 13 ⏳ pendiente |
| **Badge "Gali sugiere $X/día" en presupuesto** | Calculado desde `(pedidosFaltantes × precioVenta) / roasHistorico / 7`. Botón "Usar este →" rellena el input. | Spec 13 ⏳ pendiente |
| **Variantes de estado en detalle de proyecto** | `recien_lanzado` → mensaje aprendizaje 24h. `pausado` → diagnóstico Roax + 3 factores. `cerrado` → postmortem completo. `borrador` → checklist de pasos faltantes. | Spec 13 ⏳ pendiente |

### 🟡 Should Have — Fase 2

| Feature | Descripción |
|---|---|
| **Feed "Acciones de los agentes" por proyecto** | Timeline vertical de acciones de Roax/Vigilante/Kronos en este proyecto (últimas 24h). Formato: agente + tiempo + acción + impacto medido. Reemplaza "Loops" vacíos. |
| **Timeline de ciclo de vida** | Barra horizontal con hitos cronológicos: Lanzado → Primeros datos → Escalado → [Estás aquí]. Nodo naranja con pulse en el hito actual. |
| **Deep link señal → proyecto** | Cada alerta de proyecto clicable navega a `/gali-6/senales?signalId=X&projectId=Y`. |
| **Postmortem de Gali en proyecto cerrado** | "Qué funcionó", "qué no funcionó", "lección aprendida" — el fracaso como activo de conocimiento. Guardado en `projects.json`. |
| **Alerta de objetivo en riesgo** | Si un proyecto activo se pausa, señal en el home: "Tu objetivo bajó de 70% a 55%. Proyecto Licuadora pausado. ¿Crear alternativa?" |
| **Step "Agentes asignados" en wizard** | Reemplaza "Skills que se activarán". 5 agentes con toggle individual. Roax pre-seleccionado. Descripción del agente se expande al activar. |
| **Lanzamiento animado** | Al confirmar wizard: overlay con progreso 0→100% en 2s, 3 steps animados (crear proyecto → asignar agentes → configurar señales). Navega al detalle al completar. |
| **ZeroState onboarding si sesión 0** | Modal 3 preguntas antes de mostrar proyectos vacíos. Si `hasOrders` en Dropi, saltar pregunta de pedidos. |

### 🟢 Nice to Have — Fase 3

| Feature | Descripción |
|---|---|
| **Dashboards configurables por el usuario** | El usuario puede reordenar qué KPIs ve en cada card de proyecto. Propuesto en reunión 12 jun. |
| **Proyección "si cierras estos proyectos"** | Simulador: "Si pausas K-Beauty, tu objetivo baja al 33%. Te recomiendo Difusor aromaterapia para compensar." |
| **Proyectos como etapas de evolución** | Proyecto de "Buscar producto ganador" → transiciona a proyecto de "Escalar marca" cuando el dropshipper evoluciona. Conecta con la visión de Dropi para marcas. |
| **Comparativo inter-proyectos** | "Diagnóstico cruzado": qué tienen en común los proyectos exitosos vs. los fallidos. Gali identifica patrones. |
| **Historial de objetivos** | Registro de objetivos anteriores del usuario con % alcanzado. "En mayo tuviste objetivo de 80 pedidos/sem y lo cumpliste al 87%." |
| **Stagger `.gali-stagger-in`** | Lista de proyectos aparece con animación escalonada 60ms por card. |
| **Toast al tomar decisión desde proyecto** | Al aprobar una acción de agente desde el detalle del proyecto, toast de confirmación "Roax escalará presupuesto mañana 9am". |

---

## 3. Modelo de datos

### 3.1 Estructura conceptual

```
ObjetivoGlobal
  ├── texto: "Automatizar mi operación y escalar a 100 pedidos/semana"
  ├── meta_pedidos_sem: 100
  ├── actual_pedidos_sem: 70  ← suma de proyectos activos/en_escala
  ├── progreso_pct: 70%       ← computed: actual / meta × 100
  ├── estado: "en_camino"     ← en_camino ≥55% | en_riesgo <55% | cumplida ≥90%
  └── proyectos_contribuyentes:
       ├── Collar GPS          → pedidos_sem: 47 → contribucion_pct: 47%
       ├── K-Beauty Skincare   → pedidos_sem: 23 → contribucion_pct: 23%
       └── [Recomendado] Difusor → pedidos_sem_estimado: 18 → llevaría al 108%
```

### 3.2 Campos nuevos a añadir en `mocks/gali-v5/projects.json`

Para los proyectos existentes (Collar GPS, K-Beauty), añadir:

```json
{
  "contribucion_objetivo_pct": 47,
  "agent_actions": [
    {
      "id": "aa-1",
      "agente": "Roax",
      "agente_color": "orange",
      "status": "verde",
      "tiempo_label": "hace 2h",
      "accion": "Escaló presupuesto 15% ($57k→$66k)",
      "impacto": "ROAS mejoró 0.3x"
    }
  ],
  "timeline": {
    "estadoActual": "en_escala",
    "semanaActual": 3,
    "eventos": [
      { "id": "t1", "fecha": "2026-05-18", "label": "Lanzado", "esActual": false },
      { "id": "t2", "fecha": "2026-05-19", "label": "Primeros datos", "esActual": false },
      { "id": "t3", "fecha": "2026-05-24", "label": "Escalado", "esActual": true }
    ]
  }
}
```

Para los 4 proyectos nuevos (Spec 13 §9), ver definición completa en `13.ProyectoCanvas.md`.

### 3.3 Computed en `Gali6ProyectosCasaComponent` (ampliar)

```typescript
// Proyectos activos con contribución al objetivo
readonly proyectosConContribucion = computed(() =>
  this.proyectos
    .filter(p => ['activo', 'en_escala'].includes(p.estado))
    .map(p => ({
      ...p,
      contribucionPct: Math.round(((p.pedidosSem ?? 0) / this.objetivoMeta()) * 100),
    }))
);

// Proyectos pausados/cerrados (sección colapsada)
readonly proyectosInactivos = computed(() =>
  this.proyectos.filter(p => ['pausado', 'cerrado', 'borrador'].includes(p.estado))
);

// Alerta si el objetivo está en riesgo por proyectos pausados
readonly alertaObjetivo = computed(() => {
  if (this.metaEstado() !== 'en_riesgo') return null;
  const pausados = this.proyectosInactivos().filter(p => p.estado === 'pausado');
  if (!pausados.length) return null;
  return `${pausados.length} proyecto${pausados.length > 1 ? 's' : ''} pausado${pausados.length > 1 ? 's' : ''}. Tu objetivo está al ${this.metaPct()}%.`;
});

// Recomendación con contexto de pedidos faltantes
readonly recomendacionesConContexto = computed(() => {
  const faltantes = this.objetivoMeta() - this.pedidosActual;
  return MOCK_SENALES
    .filter(s => s.canLaunch && (s.tipo === 'trend' || s.tipo === 'opportunity'))
    .slice(0, 2)
    .map(s => ({
      titulo: s.titulo,
      porque: s.contextoMacromundo,
      ventana: `${s.ventanaDias} días`,
      impactoEstimado: s.pedidosEstimados ?? 15,
      cerrariaObjetivo: faltantes <= (s.pedidosEstimados ?? 15),
    }));
});
```

### 3.4 Invariantes del modelo

- `pedidos_sem` de un proyecto en `pausado`, `cerrado` o `borrador` = 0 para el cálculo del objetivo global
- `contribucion_pct` siempre se calcula desde `pedidos_sem` del mock — nunca hardcodeado
- El orden de los proyectos: `en_escala` → `activo` → `lanzando` → `recien_lanzado` → `borrador` → `pausado` (al fondo)
- Los proyectos `cerrados` solo se muestran en sección colapsada "Proyectos cerrados" — no en el listado principal

---

## 4. Flujos UX detallados

### 4A. Flujo: Crear objetivo

```
[Pantalla de Proyectos — primera visita o sin objetivo]
    ↓
Card de objetivo vacía: "¿Cuál es tu objetivo de negocio?"
    ↓
[Clic en "Definir objetivo"] → Modal 1-paso:
    Campo 1: "Descríbelo en tus palabras" (textarea, ej: "Llegar a 100 pedidos/semana")
    Campo 2: "Meta de pedidos/semana" (number input, ej: 100)
    [Guardar objetivo →]
    ↓
Gali confirma: "✦ Entendido. Tu objetivo es 100 pedidos/sem.
Actualmente estás al 70% (70 pedidos/sem).
Te faltan 30 pedidos para cumplirlo."
    ↓
Barra de progreso animada aparece con estado en_camino (naranja)
```

**Cuándo editar:** El chip del objetivo en la parte superior de Proyectos tiene icono de lápiz siempre visible. El modal es el mismo que al crear.

**Cuando el objetivo cambia:**
- Si sube (más ambicioso): "Para llegar a X pedidos/sem, con tus proyectos actuales llegarás al 70%. Gali recomienda 2 proyectos nuevos."
- Si baja (más conservador): "Con tus proyectos actuales ya superas ese objetivo. ¿Quieres pausar alguno o mantenerlos corriendo?"

---

### 4B. Flujo: Crear proyecto vinculado a objetivo

```
[Pantalla de Proyectos] → [+ Nuevo proyecto]
    ↓
STEP 1 — Producto
    Búsqueda en catálogo (ADA Spy filtra por potencial)
    ✦ Gali dice: "Para tu objetivo de 100 pedidos/sem, este nicho tiene alta conversión"
    → Seleccionar producto → Continuar
    ↓
STEP 2 — Ángulo de venta
    3 opciones: Dolor / Aspiracional / Urgencia
    Cada una con ejemplo de copy + score estimado de CTR
    ✦ Gali sugiere el ángulo basado en historial del usuario
    → Seleccionar ángulo → Continuar
    ↓
STEP 3 — Calculadora Brújula 🧭
    Input: Costo producto ($)  +  Flete estimado ($)
    Output tiempo real:
      - Precio mínimo (break-even)
      - ✦ Precio recomendado (40% margen) — en naranja
      - Slider de ajuste de precio
      - Margen proyectado: X% — verde/ámbar/rojo
    → [Usar precio recomendado] o ajustar slider → Continuar
    ↓
STEP 4 — Presupuesto diario
    ✦ Badge "Gali sugiere $X/día"
      (calculado: pedidosFaltantes × precioVenta / roasHistórico / 7)
      Contexto: "Para tus 30 pedidos faltantes con ROAS 1.93x, necesitas al menos $48k/día"
    Input: presupuesto diario (número)
    → [Usar sugerencia de Gali] o ingresar manual → Continuar
    ↓
STEP 5 — Agentes asignados
    5 agentes con toggle individual:
      ✅ Roax (pre-seleccionado, badge "Recomendado")
      ○ Vigilante
      ○ Kronos
      ○ ADA Spy
      ○ Chatea Pro
    Al activar cada agente, aparece descripción en fade-up
    → Seleccionar agentes → Continuar
    ↓
STEP 6 — Revisión
    Resumen: producto + ángulo + precio + presupuesto + agentes
    ✦ Gali dice: "Con este presupuesto y Roax activo, estimas 18 pedidos/sem.
      Tu objetivo llegaría al 88%."
    [Lanzar proyecto →]
    ↓
LANZAMIENTO ANIMADO (2 segundos)
    Overlay con progreso 0→100%:
      30% ✓ Proyecto creado en Dropi
      60% ✓ Agentes asignados al proyecto
      90% ✓ Señales de monitoreo configuradas
    → Navega automáticamente a /gali-6/proyecto/:id
```

---

### 4C. Flujo: Editar proyecto activo

```
[Card de proyecto en Proyectos] → [···] → Editar
    ↓
Modal inline (no wizard) con:
    - Nombre del proyecto (text)
    - Objetivo de pedidos/sem del proyecto (number)
    - Presupuesto diario (number)
    - Agentes asignados (mismo UI de toggles del wizard)
    
Campos NO editables post-lanzamiento:
    - Producto elegido (para mantener integridad histórica)
    - Ángulo de venta original (puede añadirse uno alternativo, no reemplazar)
    
Confirmaciones requeridas:
    ✅ Cambio de nombre → sin confirmación
    ✅ Cambio de presupuesto ±30% → confirmación simple "¿Confirmar?"
    ⚠️ Pausar proyecto → modal: "Este proyecto aporta X pedidos/sem (Y% de tu objetivo). ¿Pausar?"
    ⚠️ Cerrar proyecto → modal: "Esto cerrará el proyecto permanentemente. Gali documentará el postmortem."
```

---

### 4D. Flujo: Revisar progreso del objetivo

**Punto de entrada 1 — Home Gali 6 (bloque 1):**
```
Línea de estado: "Semana 23 · Collar GPS ROAS 1.93x · 70 pedidos"
Sparkline SVG de tendencia del ROAS
Barra compacta: "70/100 pedidos · 70% del objetivo · en camino"
→ Clic en la barra → navega a /gali-6/proyectos
```

**Punto de entrada 2 — Pantalla de Proyectos (vista completa):**
```
CHIP OBJETIVO (arriba, editable):
  "Automatizar y escalar a 100 pedidos/sem"    [✏ Editar]
  ████████░░░░░░ 70%  →  70/100 pedidos/sem
  Estado: ● En camino

DESGLOSE POR PROYECTO:
  Collar GPS          ████████████░░ 47/sem  47% del objetivo
  K-Beauty Skincare   ██████░░░░░░░░ 23/sem  23% del objetivo
  ────────────────────────────────────────────
  Total activos:      70/100 pedidos/sem

PROYECTOS INACTIVOS (colapsado):
  ▸ 2 proyectos pausados / 1 borrador

✦ GALI RECOMIENDA:
  Difusor aromaterapia · ventana 7 días · +18 ped. estimados
  "Lanzarlo cerraría tu objetivo al 108%"    [Crear proyecto →]
```

---

### 4E. Flujo: Reasignar o archivar proyecto

```
[Proyecto en riesgo / sin contribución] → Gali detecta
    ↓
Señal en bloque 4 del home: "Licuadora Portátil no aporta pedidos desde hace 5 días.
  Diagnóstico de Roax disponible." [Ver señal →]
    ↓
Usuario decide:
    
Opción A — Reactivar:
    → Abrir modal de edición → ajustar presupuesto/agentes → Reactivar
    Gali: "Roax retomará el monitoreo. Primeros datos en 24h."
    
Opción B — Pausar temporalmente:
    → Modal de confirmación: "Este proyecto aportaba 15 pedidos/sem.
      Tu objetivo bajará del 70% al 55%. ¿Pausar de todas formas?"
    [Pausar] → Estado cambia a 'pausado' → Señal de objetivo en riesgo si baja de 55%
    
Opción C — Cerrar definitivamente:
    → Modal: "Gali documentará el postmortem antes de cerrar. ¿Continuar?"
    → Postmortem se genera desde los campos del mock: queFuncionó / queNoFuncionó / leccion
    → Estado cambia a 'cerrado' → mueve a sección colapsada
    → Gali dice: "Proyecto archivado. Lección documentada. Ya puedes usarla como referencia."
```

---

### 4F. Flujo: Cambiar objetivo personal

```
[Objetivo chip] → [✏ Editar] → Modal
    ↓
Usuario cambia: "Llegar a 100 pedidos/sem" → "Llegar a 150 pedidos/sem"
    ↓
Gali evalúa en tiempo real mientras el usuario escribe el número:
    "Con tus proyectos actuales (70 pedidos/sem) llegarías al 47%.
    Necesitarías 2 proyectos nuevos de ≥40 pedidos/sem para cumplir esto."
    ↓
[Guardar objetivo] → Barra de progreso se recalcula → Estado pasa a 'en_riesgo' (47%)
    ↓
Señal automática en bloque 4 del home: "Tu objetivo subió a 150 pedidos/sem.
  Faltan 80 pedidos/sem. ✦ Gali recomienda: [nombre del producto + ventana]"
```

---

## 5. Rol de Gali como asistente en proyectos

### 5A. Al crear un nuevo proyecto

**Gali no espera que el usuario le diga qué hacer — anticipa:**

| Momento | Qué hace Gali | Cómo se muestra |
|---|---|---|
| Usuario abre "Nuevo proyecto" | Si hay señales predictivas activas → presugiere el producto top | Badge "✦ Recomendado por Gali" en la primera opción del catálogo |
| Usuario elige producto | Gali evalúa el margen potencial vs. ROAS histórico | Microtext debajo del precio: "Con tu ROAS 1.93x, este producto necesita mínimo $X de precio" |
| Usuario configura presupuesto | Gali calcula cuántos pedidos faltan para el objetivo | Badge "Gali sugiere $X/día — te daría Y pedidos/sem extra, llegarías al Z% del objetivo" |
| Usuario selecciona agentes | Gali pre-selecciona Roax (siempre) y sugiere Vigilante si el producto tiene tasa de novedad alta en la categoría | Badge "Recomendado para este nicho" en agentes sugeridos |
| Usuario en revisión final | Gali calcula el impacto proyectado en el objetivo | "Con este proyecto, tu objetivo subiría del 70% al 88%. Quedarían 12 pedidos para el 100%." |

### 5B. Durante la vida del proyecto

**Check-ins automáticos (via señales):**

| Trigger | Señal de Gali | Tipo |
|---|---|---|
| 24-48h post lanzamiento | "Difusor aromaterapia lleva 48h. CTR 2.1% (bien). Primeros 8 pedidos. ¿Mantenemos el presupuesto?" | 🔮 Predictiva |
| 5 días sin cambio de ROAS | "Collar GPS está estable en 1.93x por 5 días. ¿Escalamos presupuesto +15%?" | 🔮 Predictiva |
| ROAS baja de umbral (< 1.5x) | "K-Beauty cayó a 1.3x en las últimas 48h. Roax recomienda pausar hasta revisar creatividad." | 🚨 Reactiva |
| Proyecto pausado > 7 días | "Licuadora Portátil lleva 8 días pausada. ¿La cerramos o la reactivamos con nueva estrategia?" | 🚨 Reactiva |
| Objetivo cumplido | "✦ ¡Lo lograste! 103 pedidos/sem. Tu objetivo está cumplido al 103%." | 🟢 Positiva |

**Detección de proyectos estancados:**
- Si `pedidos_sem` no cambia en 7+ días → Gali envía señal con diagnóstico de Roax
- El diagnóstico incluye 3 factores y una recomendación concreta
- El usuario puede "posponer" la señal (snooze 3 días) o actuar

### 5C. Cuando el objetivo personal cambia

**Si el objetivo sube:**
1. Gali recalcula el gap inmediatamente
2. Filtra `MOCK_SENALES` buscando oportunidades que cubran el gap
3. Presenta hasta 2 recomendaciones con justificación personalizada
4. No genera señal de alarma — genera señal de oportunidad (🔮)

**Si el objetivo baja (usuario fue más conservador):**
1. Gali verifica si los proyectos actuales ya lo superan
2. Si sí: "Ya estás al 140% de tu nuevo objetivo. ¿Quieres pausar algún proyecto o subir el objetivo de nuevo?"
3. No hace nada automáticamente — el usuario decide

### 5D. Vista de objetivo — lo que Gali puede mostrar

```
PANTALLA DE PROYECTOS — lo que el usuario ve:

  Tu objetivo    ████████░░  70%   en camino         [✏ Editar]
  "100 pedidos/semana"       70 de 100

  CON TUS PROYECTOS ACTUALES:
  Collar GPS        ████████████░░  47/sem  [En escala ●]   47%
  K-Beauty          ██████░░░░░░░░  23/sem  [Activo ●]      23%
  
  ✦ GALI RECOMIENDA PARA CERRAR EL OBJETIVO:
  ┌─────────────────────────────────────────────────┐
  │ Difusor aromaterapia   ventana: 7 días           │
  │ "Según 847 dropshippers en Cali esta semana,    │
  │  búsquedas de difusores subieron 34%. Con un    │
  │  presupuesto de $35k/día, estimas 18 ped/sem    │
  │  → llegarías al 88% del objetivo."              │
  │                          [Crear proyecto →]     │
  └─────────────────────────────────────────────────┘
```

**Diferencia de Gali en contexto de objetivo vs. proyecto individual:**
- **En contexto de objetivo:** Gali habla en términos de "cuánto te falta" y "cómo cerrarlo"
- **En contexto de proyecto individual:** Gali habla en términos de "cómo va este experimento" y "qué ajustar"
- El tono cambia: objetivo = estratégico, proyecto = táctico

---

## 6. Estado de implementación en Gali 6

### 6.1 Lo que ya funciona

| Feature | Componente | Estado |
|---|---|---|
| Objetivo editable con modal 1-paso | `Gali6ProyectosCasaComponent` | ✅ Funcional — guarda en localStorage |
| Barra de progreso con estados | `Gali6ProyectosCasaComponent` | ✅ Funcional — en_camino / en_riesgo / cumplida |
| Cards de proyectos activos | `Gali6ProyectosCasaComponent` | ✅ Funcional — filtra cerrados automáticamente |
| Recomendaciones de Gali (básicas) | `Gali6ProyectosCasaComponent` | ✅ Funcional — sin justificación con pedidos faltantes |
| ALS-4 compliant — sin literales | Todos los componentes | ✅ Todo desde JSON |
| Navegación a detalle de proyecto | `Gali6ProyectosCasaComponent` | ✅ Router navega a `/gali-6/proyecto/:id` |
| Home con 4 bloques | `Gali6HoyHomeComponent` | ✅ Funcional — sparkline, decision theater, impacto, palanca |
| Modo calma cuando no hay decisión | `Gali6HoyHomeComponent` | ✅ `gali-breathe` cuando `decisionResuelta()` |

### 6.2 Lo que falta implementar (priorizado)

**Sprint inmediato:**

1. **Contribución por proyecto al objetivo** (1-2h)
   - Añadir campo `contribucionPct` al computed de proyectos
   - Mostrar en cada card: "Aporta 47 pedidos/sem · 47% del objetivo"
   - Señal de `alertaObjetivo` si cae por pausado

2. **Justificación en recomendaciones** (1h)
   - Añadir `cerrariaObjetivo` y `impactoEstimado` al computed de recomendaciones
   - Mostrar en card: "Con este proyecto llegarías al 88% del objetivo"

3. **Proyectos pausados/borrador en sección colapsada** (2h)
   - Filtrar proyectos por `['pausado', 'cerrado', 'borrador']` en sección separada
   - Colapsada por defecto, expandible

**Sprint A (Spec 13):**
4. ProyectoCanvas — variantes de estado (recien_lanzado, pausado, cerrado, borrador)
5. Calculadora Brújula en wizard
6. Badge presupuesto Gali
7. Feed "Acciones de los agentes"
8. Timeline del proyecto
9. Step "Agentes asignados" en wizard
10. Overlay de lanzamiento animado

**Sprint D:**
11. ZeroState — onboarding 3 preguntas si `sessionCount === 0`

### 6.3 Archivos a modificar (contribución por proyecto)

```
src/app/pages/gali-6/proyectos/
  gali6-proyectos-casa.component.ts   ← añadir proyectosConContribucion, alertaObjetivo
  gali6-proyectos-casa.component.html ← añadir chip de contribución % en cada card
  gali6-proyectos-casa.component.scss ← estilos del chip de contribución

mocks/gali-v5/projects.json           ← añadir agent_actions + timeline a proyectos existentes
                                          añadir 4 proyectos nuevos (Spec 13 §9)
```

---

## 7. Riesgos y preguntas abiertas

### 7.1 Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| `pedidos_sem` de proyectos en `projects.json` no coincide con el `pedidos_sem_total` de `kpis-global.json` | Alta (ya detectado en v5) | Alto — el % del objetivo no cuadra | Hacer que `pedidos_sem_total` en `kpis-global.json` = suma de `pedidos_sem` de proyectos activos. Es un campo derivado, no independiente. Calcular en el componente, no en el mock. |
| Gali 6 lazy routes hacia proyecto detalle de v5 — el `ProyectoDetallePageComponent` de v5 no tiene las variantes de estado | Media | Medio — no muestra postmortem ni estados correctos | Spec 13 debe aplicarse sobre v5, y gali-6 lo hereda por lazy route. O crear un `Gali6ProyectoDetalleComponent` propio. |
| `canLaunch` en `MOCK_SENALES` — si ninguna señal lo tiene, las recomendaciones de Gali quedan vacías | Media | Medio — la sección "Gali recomienda" desaparece | Verificar que al menos 2 señales en `senales.mock.ts` tengan `canLaunch: true` + `tipo: 'trend'` o `'opportunity'`. |
| Toggle básico/experto en shell no actualiza el acordeón | Baja | Bajo | Signal `complexityLevel` en shell; el acordeón usa `@if (complexityLevel() === 'expert')` para Centro de Gali. |
| El `ZeroState` (sessionCount === 0) interfiere con proyectos ya creados en el mock | Baja | Bajo | `ZeroState` solo activa si `sessionCount === 0` EN localStorage. Si `kpis-global.json` ya tiene pedidos > 0, el ZeroState es opcional. |

### 7.2 Preguntas abiertas de producto (necesitan validación del equipo)

| Pregunta | Opciones | Por qué importa ahora |
|---|---|---|
| **¿El objetivo es solo en "pedidos/semana" o también puede ser "ingresos mensuales"?** | A) Solo pedidos/sem (más simple) · B) El usuario elige la métrica | Afecta todo el modelo de datos. La reunión del 12 jun usó pedidos como métrica, pero Diana mencionó ingresos. **Recomendación: pedidos/sem en Fase 1, ingresos en Fase 2.** |
| **¿Puede un usuario tener más de un objetivo activo?** | A) Un objetivo global único · B) Objetivos por rol (dropshipper + marca) | La reunión del 12 jun asumió un objetivo único. Si el usuario evoluciona a marca, ¿cambia el objetivo o añade uno nuevo? **Recomendación: un objetivo único, editable.** |
| **¿Los proyectos cerrados son visibles desde la lista principal?** | A) Solo en sección colapsada "Proyectos cerrados" · B) Mezclados con los activos pero con estado visual diferente | Afecta el scrolling y la densidad de la lista. **Recomendación: colapsados por defecto — el portfolio activo es el foco.** |
| **¿El "% de contribución" se muestra en modo básico o solo experto?** | A) Siempre visible — es el dato más importante del proyecto · B) Solo en modo experto para no abrumar | El % de contribución es el nexo entre proyecto y objetivo — es la diferencia entre un gestor de tareas y un director de negocio. **Recomendación: siempre visible, incluso en modo básico.** |
| **¿Gali puede sugerir cerrar un proyecto automáticamente?** | A) Solo sugiere, el usuario decide siempre · B) Si el usuario configuró autonomía alta, puede pausar automáticamente | El umbral de confianza (localStorage `gali-trust-routing`) ya existe en la arquitectura. **Recomendación: Gali solo sugiere en Fase 1. Automatismo en Fase 2 con toggle de confianza explícito.** |
| **¿El postmortem lo genera Gali o lo escribe el usuario?** | A) Gali lo genera desde campos del mock (queFuncionó, queNoFuncionó, leccion) · B) El usuario lo escribe | En el prototipo es desde mock, lo cual es suficiente para validar la idea. **Recomendación: Fase 1 = generado desde mock. Fase 2 = Gali genera + usuario edita.** |

### 7.3 La decisión estratégica más importante pendiente

La reunión del 12 jun dejó abierta la pregunta que María debe validar: **¿cuándo mostrar este prototipo al equipo de producto para validar la viabilidad tecnológica?**

Los features de gestión de proyectos (contribución al objetivo, recomendaciones con justificación, variantes de estado) son los que más diferencian a Gali de un gestor de tareas genérico. Sin ellos, el prototipo puede verse como "otro tablero Kanban con IA encima".

**Recomendación:** Implementar en este orden antes de la próxima revisión:
1. Contribución por proyecto al objetivo (rápido, alto impacto visual)
2. Justificación en recomendaciones ("llegarías al 88%")
3. Al menos 1 variante de estado: proyecto `pausado` con diagnóstico de Roax

Eso es suficiente para que el equipo de producto vea el norte de UX y pueda empezar la conversación técnica con María.

---

*Gali Projects Plan · Jun 15 2026 · Re-análisis completo post reunión Cata/Laura/Diana 12 jun.*  
*Fuentes: `correccionescata12jun.md` · `13.ProyectoCanvas.md` · `ultimate-plan.md` · código de `gali-6/proyectos/` · `mocks/gali-v5/projects.json` · `mocks/gali-v5/senales.mock.ts`.*

---

## 8. Correcciones del 16 de junio — Análisis y Plan de Acción

> **Fuente:** Transcripción de llamada `docs/Descubrimientos/correcciones16jun.md`  
> **Participantes:** Catalina Giraldo (Cata), Diana Aldana (Dianis), Laura Contreras  
> **Contexto:** Revisión del prototipo Gali 6 y redefinición estratégica del MVP antes de presentación con María

---

### 8.1 Resumen ejecutivo

La reunión del 16 de junio produjo **cinco giros estratégicos** sobre el plan del 12 de junio:

1. **El MVP se contrae al módulo de Productos + Proveedores.** Órdenes y Logística quedan en standby; si llegas a órdenes es porque ya tuviste éxito en productos. Esto simplifica radicalmente el alcance del prototipo para la próxima revisión con María.

2. **La creación de proyectos debe tener dos caminos, no uno.** El wizard de 6 pasos se percibe como "demasiado paso a paso". La solución es ofrecer: (a) *Correr el proyecto que Gali propone* (casi automático, un clic), y (b) *Crear de cero* (el wizard actual, para quien quiere hiperpersonalizar).

3. **Gali entra al módulo operativo como panel lateral, no como pantalla aparte.** El flujo de proyecto NO navega a otra ruta — aparece como un modal lateral DENTRO de la vista de productos/proveedores.

4. **La navegación de Gali se colapsa a 2 módulos principales:** "Mi Negocio" (que absorbe Señales, Conexiones y Contexto) y "Proyectos". El "Hoy" actual podría fusionarse con "Mi Negocio".

5. **Se establece la propuesta de valor central:** "Tú pones la visión, Gali se encarga de orquestar el resto." El verbo clave es **facilitar** (no automatizar, no democratizar). El dolor #1 es que en Dropi hoy no sabes qué hacer cuando llegas — Gali resuelve eso.

---

### 8.2 Análisis detallado por cambio

---

#### Cambio A — Dos caminos para crear un proyecto (Auto vs. Manual)

**Context:**  
Diana: *"Es que está muy paso a paso todavía, Cata. Vamos a caer otra vez en lo mismo del paso a paso que se ve extenso."* La percepción es que el wizard actual tiene 6 pasos visibles que generan fricción antes de que el usuario sienta ningún valor. Laura propone el punto medio: el camino automático donde Gali te propone el proyecto y tú simplemente dices "correr", y el camino manual para quien quiere control total.

**Goal:**  
Que el primer proyecto de un usuario pueda crearse en 1 clic ("Correr"). Que el usuario avanzado que quiere hiperpersonalizar tenga el wizard completo disponible sin que nadie se lo imponga.

**Style:**  
- Los dos caminos aparecen como dos tarjetas/opciones en la sección "Nuevo proyecto", no como un modal de elección — se presentan como dos cards visuales lado a lado.
- El camino Auto tiene un badge prominente "✦ Recomendado por Gali" y muestra un resumen de lo que Gali propone (producto, presupuesto estimado, pedidos proyectados) antes de cualquier clic.
- El camino Manual tiene texto secundario: "Define tú cada paso", tono más neutral.
- Botón del camino Auto: `Correr este proyecto →` (acción inmediata, naranja, DS primario).
- Botón del camino Manual: `Crear de cero →` (ghost button o secundario).

**Componentes:**  
- `Gali6ProyectosCasaComponent` — modificar el botón `+ Nuevo proyecto` para abrir un modal de 2 opciones antes de ir al wizard.
- `Gali6NuevoProyectoComponent` — el wizard existente. Se mantiene intacto para el camino Manual.
- Nuevo: `Gali6ProyectoAutoComponent` (inline o modal) — una sola pantalla que muestra el proyecto sugerido por Gali con resumen + botón "Correr".

**Estados del camino Auto:**
- `cargando` — Gali está "analizando" (spinner 1.5s simulado con señales del mock)
- `listo` — muestra la propuesta: producto top, presupuesto sugerido, pedidos estimados, por qué lo recomienda
- `confirmado` — animación de lanzamiento (la misma que ya existe en el wizard) → navega al detalle del proyecto

---

#### Cambio B — Gali como panel lateral en el módulo operativo (no pantalla separada)

**Context:**  
Diana: *"Así debería aparecer el paso a paso en un modal lateral, no enviarme a otra pantalla. Lo que yo haga en esta sección de Hola, Gali, modifica mis pantallas."* La visión es que Gali aparece DENTRO de la pantalla de catálogo de productos, como un panel deslizable que guía al usuario sin sacarle del contexto operativo.

**Goal:**  
El usuario está en `/productos/catalogo`, ve que Gali tiene una recomendación, le da clic, y un panel lateral aparece con el flujo de proyecto sin cambiar de ruta. La pantalla de productos detrás se adapta (highlight del producto sugerido, filtros pre-aplicados).

**Style:**  
- Panel lateral que desliza desde la derecha (width: 400px, `position: fixed`).
- Fondo con blur backdrop leve sobre el contenido operativo — no oscurece, solo separa.
- El panel tiene header con "✦ Gali recomienda" y botón de cierre.
- El contenido operativo detrás permanece visible y reacciona: el producto sugerido recibe un anillo de highlight naranja.
- Transición: `transform: translateX(100%) → translateX(0)` en 300ms ease-out.

**Componentes:**  
- Este panel lateral de Gali ya existe como `GaliRightPanelComponent` en el shell de Gali 6. Lo que falta es hacer que también se active DESDE los módulos operativos (no solo desde el FAB de chat).
- Nuevo trigger: un CTA contextual en el catálogo de productos — "✦ Gali recomienda para tu objetivo →" — que abre el panel con el contexto del módulo actual.
- El panel lateral, cuando viene de "productos", muestra el flujo Auto del cambio A directamente (no el chat genérico).

**Estados:**
- Panel cerrado (estado default operativo)
- Panel abierto desde catálogo → muestra propuesta de proyecto para ese módulo
- Panel en flujo de confirmación → "¿Corremos este proyecto?"
- Panel después de confirmar → "Proyecto creado. Gali empieza a monitorear." con CTA a `/gali-6/proyectos`

---

#### Cambio C — Módulos MVP: solo Productos + Proveedores

**Context:**  
Diana: *"Me enfocaría en esta primera versión, chicas, realmente minimizándolo en hacer un muy buen proyecto de productos. Hagamos el de productos y proveedores. Enfoquémonos en ese módulo."* Laura agrega: *"El proyecto de productos tuvo algún éxito o alguna acción, una toma de decisión, y ese ya me empieza a correr proyectos de Gali en órdenes."* Esto no es retroactivo — es priorización de dónde el dolor del dropshipper es más agudo: en productos se cae la gente antes de empezar.

**Goal:**  
El prototipo para la revisión con María muestra solo la integración de Gali en Catálogo + Caza Productos + Proveedores. El módulo de órdenes y logística siguen en el prototipo pero sin el flujo de Gali inyectado — aparecen como "próximamente" o simplemente sin el trigger de Gali.

**Style:**  
- En los módulos que están fuera del MVP (pedidos, logística), el CTA de Gali no aparece — o aparece con un badge `Próximamente` en tono muted, nunca bloqueando el flujo operativo actual.
- En los módulos MVP (catálogo, caza productos, proveedores) el CTA de Gali es prominente.

**Componentes:**  
- No requiere cambios en el código de Gali 6 — los módulos operativos son los de `gali-v5` lazy-loaded.
- Requiere agregar el trigger de Gali a los componentes de `gali-v5/pages/catalogo/` y `gali-v5/pages/proveedores/`.
- El shell de Gali 6 ya intercepta las rutas `/gali-v5` y las redirige a `/gali-6` — el panel lateral de Gali podría activarse en esos contextos.

**Estados:**
- Módulo operativo SIN Gali integrado (estado actual de todos los módulos)
- Módulo operativo CON Gali integrado (catálogo, caza productos, proveedores — post cambio)
- Módulo operativo en standby de Gali (pedidos, logística — badge "Próximamente")

---

#### Cambio D — Simplificación de navegación: 2 módulos principales

**Context:**  
Laura: *"Solo nos quedaría Cata Mi negocio y proyectos. Y así vamos simplificando mucho más."* Diana propone unir Conexiones + Señales + Contexto bajo "Mi Negocio". La idea es que "Hoy" podría fusionarse también con "Mi Negocio" ya que es un resumen del negocio. Esto simplifica radicalmente el menú de Gali 6.

**Goal:**  
La navegación de Gali 6 queda en máximo 3 items en el rail: **Mi Negocio** (home + señales + conexiones + contexto), **Proyectos**, y (en modo experto) **Centro de Gali**. Señales pasa a ser una subsección de Mi Negocio, no un item raíz.

**Style:**  
- El icon-rail de Gali 6 pasa de 5-6 ítems a 2-3 ítems visibles.
- "Hoy" → se funde con "Mi Negocio": el home de Mi Negocio muestra el resumen diario (lo que hoy es el "Hoy") + las conexiones + las señales.
- El toggle básico/experto sigue siendo el mecanismo para ocultar/revelar "Centro de Gali".
- Señales como subsección: en Mi Negocio hay una tab o sección "Señales" en lugar de ser una ruta raíz.

**Componentes a modificar:**  
- `gali-6-icon-rail.component.ts` — reducir items del rail
- `gali-6-nav.config.ts` — actualizar config de navegación
- `gali-6-sections.config.ts` — fusionar los paneles de Hoy/Mi Negocio/Señales/Conexiones bajo un mismo panel
- `gali-6.routes.ts` — reorganizar rutas: `/gali-6` → Mi Negocio (nuevo home), `/gali-6/proyectos` (sin cambios), `/gali-6/centro-gali` (solo experto)
- `Gali6HoyHomeComponent` — posiblemente renombrar a `Gali6MiNegocioComponent` o convertir en la vista default de Mi Negocio

**Estados:**
- Mi Negocio — tab Hoy (lo que hay ahora en el home)
- Mi Negocio — tab Señales (lo que hay ahora en Señales)
- Mi Negocio — tab Conexiones (lo que hay ahora en Conexiones)
- Mi Negocio — tab Mi Contexto (la subsección de archivos/datos del negocio)

---

#### Cambio E — Gali con más presencia en el objetivo ("Mejorar con Gali")

**Context:**  
Cata: *"Acá le faltaría como más presencia a Gali, como más de día para que me lo haga solita. Quizás yo pueda darle un botón de mejorar con Gali — dile a Gali qué quieres hacer y lo mejore."* El objetivo actual se edita manualmente. La reunión sugiere que Gali pueda co-crear el objetivo: el usuario escribe su intención en lenguaje natural y Gali lo convierte en objetivo estructurado con meta de pedidos.

**Goal:**  
En el modal de editar objetivo, agregar un campo de texto libre con el CTA "✦ Mejorar con Gali →". Al darle clic, Gali (simulado) transforma el texto del usuario en una propuesta de objetivo con texto depurado + meta de pedidos sugerida + plazo.

**Style:**  
- El campo de texto libre tiene placeholder: "Cuéntale a Gali qué quieres lograr con tu negocio…"
- Después de "Mejorar con Gali", aparece una propuesta de Gali en un bloque destacado (fondo naranja muy tenue, `$orange-light` del DS): texto generado + meta sugerida.
- El usuario puede aceptar la propuesta (rellena los campos del modal) o descartarla.
- No hay llamada real a API — la respuesta de Gali viene de una función simulada basada en keywords del texto (p.ej. si menciona "100 pedidos" → meta: 100; si menciona "escalar" → meta: actual + 50%).

**Componentes:**  
- `Gali6ProyectosCasaComponent` — agregar el campo + botón + lógica de simulación en el modal de objetivo.
- No requiere componentes nuevos.

**Estados:**
- Modal objetivo — modo edición manual (estado actual)
- Modal objetivo — campo "Mejorar con Gali" escribiendo
- Modal objetivo — Gali procesando (spinner 800ms)
- Modal objetivo — Gali propone objetivo (bloque con propuesta)
- Modal objetivo — propuesta aceptada (rellena campos) o descartada

---

#### Cambio F — Propuesta de valor y framing de Gali

**Context:**  
Laura: *"Tú pones la visión, Gali se encarga de armonizar el resto."* Diana: *"Orquestar."* Cata: *"Facilitar."* La reunión convergió en que el verbo clave para la propuesta de valor es **facilitar** (no automatizar, no democratizar — esa última fue criticada previamente por alguien del equipo). La propuesta de valor final para el MVP: *Dropy siempre te dio las herramientas. Ahora Gali te dice cómo usarlas.*

**Goal:**  
Este cambio es principalmente conceptual y de copy, no de código. Impacta: el ZeroState onboarding (3 preguntas), los textos del home, y los tooltips de Gali.

**Style:**  
- Tono: director de estrategia, no asistente. Gali habla con convicción, no con sugerencias tímidas.
- En el ZeroState: cambiar "¿Qué quieres lograr?" por algo más directo como "¿Cuál es tu próxima meta de negocio?"
- En el home "Hoy": el subtítulo de Gali debe resonar con orquestar/facilitar — no con "analizar" o "monitorear".

**Componentes:**  
- `gali-6-shell.component.ts/html` — ZeroState copy
- `gali6-hoy-home.component.html` — textos del home
- `gali6-proyectos-casa.component.html` — copy de las recomendaciones de Gali

---

#### Cambio G — Proveedor como usuario válido (exploración pendiente)

**Context:**  
Cata: *"Sería muy chévere explorar la manera de cómo podemos, porque entiendo que un proveedor tiene tres rutas: fabricar, puede importar, o es una marca."* *"Si tenemos la sesión, también nos enfoquemos en esta parte proveedor."* Esto NO es un cambio para el prototipo actual — es una bandera para una sesión futura de discovery con el equipo de producto y el equipo de proveedores.

**Goal:**  
Identificar los 2-3 proyectos base que un proveedor podría tener en Gali: (a) expandir catálogo, (b) gestionar stock/bodega, (c) atraer más dropshippers a sus productos.

**Componentes:**  
- Ninguno todavía. Requiere sesión de discovery primero.
- Si se avanza, implicaría una variante de `Gali6ProyectosCasaComponent` con proyectos mockados para rol `proveedor`.

---

### 8.3 Lista completa de cambios

| # | Cambio | Origen (transcripción) | Estado en Gali v6 | Prioridad | Tipo |
|---|---|---|---|---|---|
| A | Dos caminos para crear proyecto: Auto (1-clic) y Manual (wizard) | Diana: "está muy paso a paso" + Laura: propuesta de dos opciones | No existe — solo el wizard de 6 pasos | 🔴 Alta | UI + lógica |
| B | Gali aparece como panel lateral DENTRO del módulo operativo, no como pantalla nueva | Diana: "modal lateral, no enviarme a otra pantalla" | No existe en módulos operativos | 🔴 Alta | UI + integración |
| C | MVP acotado a Productos + Proveedores; Órdenes/Logística en standby | Diana: "hagamos el de productos y proveedores" | No requiere cambios en Gali 6 — requiere enfocar qué módulos tienen el CTA de Gali | 🔴 Alta | Priorización |
| D | Navegación simplificada: Mi Negocio + Proyectos (2 módulos) | Laura: "solo nos quedaría Mi negocio y proyectos" | Hay 5-6 items en el rail actual | 🟡 Media | UI + config |
| E | Botón "Mejorar con Gali" en el modal de objetivo | Cata: "faltaría más presencia a Gali... un botoncito de mejorar con Gali" | No existe | 🟡 Media | UI + lógica simulada |
| F | Copy y tono: "facilitar", "orquestar", propuesta de valor clara | Laura/Diana/Cata en los últimos 15 min de la llamada | Parcialmente — el copy actual es genérico | 🟡 Media | Copy |
| G | Sesión de discovery con rol Proveedor | Cata: "sería muy chévere explorar" | No existe | 🟢 Baja | Discovery (no código) |

---

### 8.4 Qué hacer con Gali v6

#### Cambios que se implementan directamente (sin romper nada existente)

**E — Botón "Mejorar con Gali" en objetivo:**  
Es additive puro dentro del modal existente en `Gali6ProyectosCasaComponent`. No toca el flujo existente, solo agrega un campo + CTA + bloque de respuesta simulada.

**F — Copy y tono:**  
Reemplazar textos en el ZeroState, home y proyectos. No requiere lógica nueva, solo cambiar strings en los templates. Bajo riesgo, alto impacto en la percepción del prototipo.

**C — Foco en Productos + Proveedores:**  
No requiere cambios en Gali 6 en sí. Es una decisión de QUÉ mostrar en la presentación. El prototipo ya tiene los módulos — simplemente no navegar hacia órdenes/logística en el demo.

#### Cambios que requieren refactor de lo existente

**D — Simplificación de navegación:**  
Requiere modificar `gali-6-icon-rail.component.ts`, `gali-6-nav.config.ts`, `gali-6-sections.config.ts`, y `gali-6.routes.ts`. Es un refactor de configuración — no de lógica de negocio. Riesgo medio porque el panel lateral de la sección depende de la config de nav.

**ANTES de hacer el cambio D**, verificar que el `DropiSectionNavComponent` funcione correctamente con un panel reducido de 2 items en modo básico. Ya funciona así en modo básico (filtra `centro-gali`) — solo añadir el filtro de Hoy/Señales/Conexiones para que queden como sub-tabs de Mi Negocio.

#### Cambios aditivos puros (features nuevas sin tocar lo existente)

**A — Dos caminos para crear proyecto:**  
Agregar un modal intermedio (2 cards: Auto / Manual) entre el botón `+ Nuevo proyecto` y el wizard existente. El wizard (`Gali6NuevoProyectoComponent`) no se modifica. El camino Auto es un nuevo componente pequeño que usa las señales existentes del mock.

**B — Panel lateral de Gali en módulos operativos:**  
El `GaliRightPanelComponent` ya existe en el shell. Lo que falta es un trigger contextual en los módulos operativos. Dos opciones de implementación:
- Opción 1 (más limpia): Agregar un output/event a los componentes de `gali-v5/pages/catalogo/` que emite cuando el usuario quiere abrir Gali con contexto. El shell de Gali 6 lo escucha y abre el panel.
- Opción 2 (más rápida para el prototipo): Agregar directamente un botón flotante "✦ Gali recomienda para este módulo" en el catálogo de productos, que al darle clic ejecuta `galiStateService.openPanel()`.

Para el prototipo, Opción 2 es suficiente.

#### Orden recomendado de implementación (para no generar conflictos)

```
Paso 1 → F (Copy y tono) — 30 min, sin riesgo, impacto visual inmediato
Paso 2 → E (Mejorar con Gali en objetivo) — 1h, additive, sin tocar flujos
Paso 3 → A (Dos caminos para crear proyecto) — 2h, additive, wizard intacto
Paso 4 → B (Panel lateral en catálogo) — 2h, Opción 2 del prototipo
Paso 5 → D (Simplificación de navegación) — 2-3h, refactor controlado
```

Pasos 1-4 son todos aditivos y no tienen dependencias entre sí — se pueden hacer en cualquier orden. El paso 5 (D) va último porque toca la arquitectura de navegación y puede afectar a todos los anteriores si hay un bug.

---

### 8.5 Contradicciones y aclaraciones respecto a planes anteriores

| Punto del plan anterior | Qué dijo la reunión del 16 jun | Resolución |
|---|---|---|
| Wizard de 6 pasos como "Must Have Fase 1" (§2) | "Está muy paso a paso, se percibe extenso" | El wizard NO se elimina — es el camino Manual. Se agrega el camino Auto de 1-clic. Ambos coexisten. |
| Órdenes y Logística en scope del MVP (§2 features priorizados) | "Órdenes lo podemos dejar un poquito standby" + "logística stand by" | Se sacan del scope del demo inmediato. El código sigue en el repo — no se elimina. |
| Navegación con Hoy / Proyectos / Conexiones / Señales / Impacto / Centro | "Solo nos quedaría Mi Negocio y Proyectos" | Refactor de nav (Cambio D). Hoy se funde con Mi Negocio. Impacto puede quedar como tab o desaparecer del rail. |
| "Gali 6 tiene su propia pantalla separada de todo" (ultimate-plan §0.3) | "No me lo imaginaba como una pantalla adicional — inmerso en la misma pantalla" | Gali 6 sigue siendo el shell principal. Pero el flow de proyecto debe poder activarse DESDE módulos operativos (panel lateral), no solo desde el hub de Gali. |

---

### 8.6 Riesgos y preguntas abiertas post-16 jun

| Riesgo / Pregunta | Tipo | Acción recomendada |
|---|---|---|
| ¿Qué tan rápido hay que tener el prototipo actualizado? La reunión menciona "mañana" para mostrar a María. | Urgencia no clara | Confirmar con Cata cuál es la fecha real de la revisión con María. |
| En el camino Auto (Cambio A), ¿Gali propone el proyecto desde las señales del mock o desde el comportamiento del usuario en la demo? | Datos mock | Para el prototipo: usar las señales de `MOCK_SENALES` con `canLaunch: true` — ya están en el código. |
| Si la navegación se simplifica a "Mi Negocio", ¿desaparece el bloque de "Impacto de Gali" del home actual? | UX | El impacto ("Gali hizo por ti") puede quedar como bloque dentro de Mi Negocio — no desaparece, se reubica. |
| ¿El panel lateral de Gali (Cambio B) usa el mismo `GaliRightPanelComponent` (chat) o es un panel nuevo especializado en proyectos? | Arquitectura | Para el prototipo: usar el panel existente pero con contenido contextual inyectado. En producción: panel especializado por módulo. |
| El Cambio D (simplificación de nav) puede romper el `resolveG6SectionPanel` si se cambian las rutas | Técnico | Actualizar `gali-6-sections.config.ts` en el mismo commit del cambio de rutas. Test manual obligatorio. |
| ¿El concepto de "agente default" (Gali general sin agentes específicos) aplica también al prototipo de Gali 6, que ya tiene agentes mockados? | Producto | Los agentes mockados (Roax, Vigilante, Kronos) siguen visibles en modo experto. En modo básico, solo aparece "Gali" como único actor — esto ya está implementado con el toggle básico/experto. No requiere cambio adicional. |
| ¿La sesión de discovery con proveedor (Cambio G) tiene fecha? | Discovery | No quedó definido en la transcripción. Pendiente de Cata/Laura. |

---

*Correcciones 16 jun · Análisis generado 2026-06-16.*  
*Fuentes: `correcciones16jun.md` · código `gali-6/` · `gali-projects-plan.md` §1-7 · `ultimate-plan.md`.*

---

## 9. Análisis extendido 16 jun — "Avancemos en Gali"

> **Fuente:** Lectura completa de `docs/Descubrimientos/correcciones16jun.md` (816 líneas)  
> **Propósito:** Documentar los puntos de la llamada que NO quedaron en §8 (5 cambios macro) pero que tienen implicaciones de diseño y producto para sprints futuros.  
> **Participantes:** Catalina Giraldo (Cata · ~00:00–00:50), Diana Aldana (Dianis), Laura Contreras

---

### 9.1 Resumen ejecutivo

§8 capturó los 5 cambios tácticos para el prototipo (copy, botón Mejorar, dos caminos, panel catálogo, nav simplificada). Lo que §8 NO capturó son las **decisiones estratégicas de producto y visión** que surgieron en la segunda mitad de la llamada (~00:15–00:50):

1. El "punto cero" no es una pantalla de onboarding nueva — es Dropi tal como existe hoy, con Gali como capa contextual encima (modal lateral, no nueva ruta).
2. El paradigma de Diana: **modal lateral en TODOS los módulos operativos**, no solo catálogo.
3. La progresión modular es un **funnel secuencial**: Productos → Órdenes → Logística. Llegar a Órdenes significa haber tenido éxito en Productos.
4. Los **agentes con nombre propio** (Roax, Vigilante, etc.) quedan en standby para usuarios MVP; el MVP presenta solo "Gali" como actor unificado.
5. La misión/visión se construyó en vivo: verbo final consensuado = **"facilitar"** (no orquestar, no democratizar). Laura propuso "armonizar", pero Cata y Diana convergieron en "facilitar".
6. **Proveedores** requieren una sesión de discovery propia — sus 3 rutas (fabricar / importar / marca) son completamente diferentes al flujo dropshipper y no entran en MVP.

---

### 9.2 Checklist completo — 31 puntos de la llamada

#### Categoría A: Redefinición del punto cero / onboarding dual

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| A1 | El "punto cero" son DOS modos: (a) usuario nuevo en Dropi → onboarding clásico; (b) usuario ya en Dropi → Gali aparece como capa sobre pantallas existentes | Diana | ~00:05 | ✅ ZeroState para (a); 5 paneles contextuales para (b) | 🔴 Crítico |
| A2 | "la esencia más pura" del punto cero = lo que ya hay en Dropi + AI encima. No una pantalla nueva. | Diana | ~00:08 | ✅ 5 strips + paneles laterales en catálogo, proveedores, caza, señales, nego | 🔴 Crítico |
| A3 | Onboarding solo se muestra una vez (guard en localStorage) — ya acordado, ya implementado | Cata | ~00:02 | ✅ Implementado | — |
| A4 | El onboarding pregunta objetivo (qué quiero hacer), no impone paso a paso rígido | Cata | ~00:02 | ✅ ZeroState 3 pasos | ✅ Hecho |

#### Categoría B: Percepción de "paso a paso" — cómo resolverla

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| B1 | "Está muy paso a paso todavía" — no es que no deba haber pasos, es que NO deben VERSE como pasos numerados | Diana | ~00:10 | ⚠️ Wizard tiene 6 pasos numerados visibles | 🟡 Importante |
| B2 | La percepción de "paso a paso" = múltiples pantallas independientes. La alternativa = todo en una sola pantalla con contexto que evoluciona | Diana | ~00:25 | ⚠️ Auto path resuelve parcialmente (Cambio A) | 🟡 Importante |
| B3 | "Un paso a paso que salga de un modal lateral, no que me envíe a otra pantalla" | Diana | ~00:25 | ✅ 5 módulos con panel lateral: catálogo, proveedores, caza, señales, nego | 🟡 Importante |

#### Categoría C: Dos modos de creación de proyecto (extensión de §8/Cambio A)

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| C1 | Modo Auto = "correr el proyecto" — Gali propone, usuario dice "sí" con 1 click. Sin opciones de personalización en MVP. | Laura | ~00:22 | ✅ Implementado (Cambio A) | ✅ Hecho |
| C2 | Modo Manual = "crear de cero" — hiperpersonalización, el wizard de 6 pasos ya construido | Cata | ~00:22 | ✅ Wizard existe | ✅ Hecho |
| C3 | En MVP: el Auto no permite personalizar el proyecto propuesto por el agente default | Laura | ~00:22 | ⚠️ La mini-card actual podría mostrar demasiadas opciones | 🟡 Importante |
| C4 | Nombre de camino: "Agente default" (interno) / "Correr proyecto" (de cara al usuario) | Laura | ~00:22 | ✅ "Correr este proyecto →" en v6 | ✅ Hecho |

#### Categoría D: Alcance del MVP y progresión modular

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| D1 | MVP = solo Productos + Proveedores. Catálogo, Caza Productos, Negociaciones | Diana | ~00:30 | ✅ Cambio C — standby visible | ✅ Hecho |
| D2 | Órdenes solo se desbloquea cuando el usuario ha tenido éxito en Productos | Laura | ~00:30 | ✅ Check-in 5 en proyectos + track de progresión en home + 🔒 en rail | 🟡 Importante |
| D3 | Logística (torre, transportadoras) = segundo unlock, después de Órdenes | Cata | ~00:30 | ✅ Track de 3 nodos en home (Productos → Órdenes → Logística) | 🟢 Nice |
| D4 | "Si llegas al módulo de órdenes es porque ya fuiste exitoso en productos" — el progreso en productos DESBLOQUEA el siguiente nivel | Diana | ~00:30 | ✅ Implementado como progresión modular en home + check-in en proyectos | 🟡 Importante |

#### Categoría E: Simplificación de navegación (extensión de §8/Cambio D)

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| E1 | "Solo nos quedarían Mi Negocio y Proyectos" — dos módulos principales | Laura | ~00:35 | ✅ Cambio D | ✅ Hecho |
| E2 | "Hoy" podría fusionarse con "Mi Negocio" — debate no resuelto | Laura | ~00:35 | ⚠️ "Hoy" es sub-item de "Mi Negocio" accordion — suficiente | 🟡 Pendiente |
| E3 | Señales podría estar dentro de "Mi Negocio" O como acceso rápido en nav | Cata | ~00:35 | ✅ Señales está como sub-item de Mi Negocio accordion | ✅ Hecho |
| E4 | Conexiones + Mi Contexto = un solo ítem "Mi Negocio" que los contiene | Laura | ~00:35 | ✅ Mi Negocio accordion: Hoy + Señales + Conexiones + Impacto + Mi Contexto | ✅ Hecho |

#### Categoría F: Propuesta de valor — misión, visión, verbo clave

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| F1 | Propuesta central: "Tú pones la visión, Gali se encarga de armonizar el resto" | Laura | ~00:37 | ✅ En ZeroState y copy (Cambio F) | ✅ Hecho |
| F2 | Verbo rechazado: "democratizar" — María lo criticó explícitamente | Diana | ~00:43 | ✅ No usado en v6 | — |
| F3 | Verbo rechazado: "orquestar" — suena técnico para usuario final | Cata | ~00:40 | ⚠️ "Gali tiene el timón" lo usa de forma metafórica — aceptable | 🟡 Revisar |
| F4 | **Verbo acordado: "facilitar"** — fácil de entender, no impone autonomía | Cata + Diana | ~00:44 | ✅ Auditado: "orquesta/automatiza" solo en backstage; "facilita" en CTAs y copy usuario | 🟡 Revisar copy |
| F5 | Misión provisional: "facilitar la operación, que escalar sea fácil" | Diana | ~00:44 | ⏳ No documentado formalmente | 🟢 Conceptual |
| F6 | Visión provisional: "convertir a Gali en el director de operaciones donde cualquier persona pueda escalar definiendo solo sus metas" | Laura (copiloto) | ~00:44 | ⏳ No documentado formalmente | 🟢 Conceptual |

#### Categoría G: Dashboard, switch de métricas y rol de Gali

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| G1 | Switch "lo que Gali ha movido" vs. métricas baseline — usuario puede prender/apagar la vista de impacto atribuible a Gali | Diana | ~00:37 | ✅ Toggle `verImpactoGali` en home: delta chips, banner comparativo sin/con Gali | 🟡 Importante |
| G2 | Dashboard de indicadores ya existe en Dropi — no duplicar, mejorar lo que hay | Diana | ~00:37 | ✅ Lazy routes apuntan al dashboard existente | ✅ Hecho |

#### Categoría H: Proveedor y casos futuros

| # | Punto | Quién | Timestamp | Estado en v6 | Prioridad |
|---|---|---|---|---|---|
| H1 | Proveedor tiene 3 rutas distintas: fabricar / importar / marca+laboratorio — cada una necesita flujo diferente | Cata | ~00:48 | ⏳ No contemplado en v6 | 🟢 Pendiente discovery |
| H2 | Para proveedor: guía de verificación de bodega, administración de stock, expansión de catálogo hacia nuevos canales | Cata | ~00:48 | ⏳ No implementado | 🟢 Pendiente discovery |
| H3 | Solicitar sesión de discovery específica para caso proveedor (Cata + equipo) | Cata | ~00:50 | ⏳ Pendiente agendar | 🟡 Acción pendiente |

---

### 9.3 Análisis detallado — puntos críticos nuevos (no en §8)

---

#### Punto A2 — El punto cero NO es una nueva pantalla

**Context:**
Diana repite en varios momentos que Gali no debe crear un mundo nuevo para el usuario que ya está en Dropi. El "punto cero" para alguien ya en la plataforma es exactamente la pantalla de Productos tal como existe hoy, con Gali apareciendo **dentro** de esa pantalla como una capa contextual. Diana: *"Acá me está mostrando, me está dando información complementaria de los productos y me está comunicando la estrategia y el paso a paso. Así debería aparecer el paso a paso en un modal lateral, no enviarme a otra pantalla."*

**Goal:**
Que la sensación del usuario sea: "Dropi que ya conozco + Gali como asistente que aparece cuando es útil". No: "Me sacaron a una nueva aplicación llamada Gali".

**Style:**
- El panel lateral de Gali (Cambio B) ya materializa esto para catálogo. La extensión es aplicar el mismo patrón a otros módulos operativos.
- El modal lateral NO ocupa toda la pantalla. La pantalla base sigue visible detrás.
- El panel Gali responde a lo que el usuario hace en la pantalla base (contextual, no genérico).

**Componentes:**
- El panel `g6-cat-panel` existente (Cambio B) es el prototipo del patrón general.
- Para un siguiente sprint: extender el mismo patrón a Proveedores y Caza Productos.
- La señal `gali.galiCatalogPanelOpen()` debería generalizarse a `gali.openContextualPanel(moduleId)`.

**Estados:**
- Panel cerrado (default) → el módulo operativo funciona solo
- Panel abierto por CTA de Gali → overlay lateral sin bloquear la pantalla base
- Panel con propuesta activa → usuario puede "correr" o "ignorar"

---

#### Punto D2/D4 — Progresión modular tipo funnel

**Context:**
Laura: *"Yo primero tengo que crear todo lo de los productos, o sea, tengo que tener un proyecto corriente, que se generen órdenes y ya luego llegamos a los proyectos en órdenes."*
Diana: *"Si llegas al módulo de órdenes es porque ya fuiste exitoso en productos. Aquí se nos cae mucha gente."*

**Goal:**
Mostrar visualmente que Órdenes y Logística no son módulos paralelos — son recompensas del éxito en Productos. Esto no elimina las rutas lazy existentes (el prototipo navega a ellas) pero añade un estado visual de "próximamente cuando logres X en productos".

**Style:**
En el rail de iconos de Gali 6, los módulos Órdenes y Logística podrían mostrar un chip "🔒 Cuando tengas pedidos activos" en modo básico. En modo experto, accesibles sin restricción.

**Componentes:**
- `gali6-icon-rail` — añadir prop `locked` a los items de órdenes/logística
- Tooltip sobre el icono locked: "Disponible cuando tengas proyectos activos generando órdenes"

**Estado en v6 actual:**
Las rutas existen y navegan. No hay estado "locked" visible. Baja prioridad para el demo con María pero importante para la narrativa de onboarding.

---

#### Punto F3/F4 — "Facilitar" como verbo rector del copy

**Context:**
La llamada terminó con consenso en "facilitar" como el verbo clave de la propuesta de valor. Cata: *"a facilitar porque pues por el cuello de botella que tenemos para la activación."* Diana: *"Hay nuestra misión es facilitar."*

**Goal:**
Auditar el copy de v6 para asegurar que "facilitar" aparece donde antes decía "orquestar" o "automatizar" de forma no metafórica.

**Excepciones permitidas:**
- "Gali tiene el timón" = metáfora aceptable, no el verbo literal
- "orquestar el resto" en la frase de Laura = aceptable en contexto narrativo si va acompañado del sujeto usuario
- Ejemplos donde NO usar: "Gali orquesta tus campañas", "automatización de pedidos" (en títulos/CTAs)

**Audit pendiente:**
Revisar ZeroState, home "Hoy", modal objetivo, recomendaciones, CTAs de panel catálogo. Cambiar cualquier instancia de "automatiza", "orquesta" (como verbo directo de Gali sobre el usuario) por "facilita", "te ayuda", "te guía".

---

#### Punto G1 — Switch "lo que Gali ha movido"

**Context:**
Diana: *"debería entonces permitir prender y apagar un switch para ver lo que ha movido Gali, este, agrupar todo lo que sea el centro operativo de data en un solo lugar, así sea que yo active a Gali o no."*

**Goal:**
En el home / "Mi Negocio", un toggle que muestra: "Vista estándar Dropi" vs "Vista con impacto atribuible a Gali". Cuando está en modo Gali, los números de KPIs tienen un delta: "+18 pedidos por acción de Gali esta semana".

**Style:**
- Toggle pequeño en el header de la sección de KPIs del home
- Delta en naranja con ✦: "✦ +18 por Gali"
- Sin Gali activo: números baseline sin delta

**Estado en v6:**
La sección "Impacto" en v6 (`gali6-impacto-ledger`) ya muestra acciones de Gali. Lo que falta es el toggle que permita comparar "con Gali" vs "sin Gali" directamente en el home.

---

### 9.4 Tabla consolidada de todos los cambios identificados

| # | Cambio | Categoría | Quién | Timestamp | Estado en v6 | Prioridad | Tipo |
|---|---|---|---|---|---|---|---|
| A | Dos caminos crear proyecto (Auto + Manual) | C | Todas | ~00:22 | ✅ Hecho (Cambio A §8) | 🔴 | UI |
| B | Panel lateral Gali en catálogo | E | Diana | ~00:25 | ✅ Hecho (Cambio B §8) | 🔴 | UI |
| C | MVP = Productos + Proveedores solamente | D | Diana | ~00:30 | ✅ Hecho (Cambio C §8) | 🔴 | Estrategia |
| D | Nav simplificada Mi Negocio + Proyectos | E | Laura | ~00:35 | ✅ Hecho (Cambio D §8) | 🔴 | UI |
| E | Botón "Mejorar con Gali" en objetivo | — | Cata | ~00:02 | ✅ Hecho (Cambio E §8) | 🔴 | UI |
| F | Copy/tono: "facilitar", directo, sin pasos | F | Todas | ~00:44 | ✅ Hecho (Cambio F §8) | 🔴 | Copy |
| G | Discovery sesión proveedor | H | Cata | ~00:50 | ⏳ Pendiente | 🟡 | Proceso |
| A2 | Punto cero = Dropi existente + Gali como capa | A | Diana | ~00:08 | ✅ Panel lateral en 5 módulos operativos | 🔴 | Concepto |
| B1 | Wizard no debe verse como pasos numerados | B | Diana | ~00:10 | ⚠️ Camino Auto resuelve; wizard manual sigue con pasos | 🟡 | UI |
| B3 | Modal lateral en todos los módulos (no solo catálogo) | B | Diana | ~00:25 | ✅ 5 paneles: catálogo + proveedores + caza + señales + nego | 🟡 | UI |
| D2 | Órdenes se desbloquea cuando Productos tiene éxito | D | Laura/Diana | ~00:30 | ✅ Check-in 5 en proyectos + track de progresión en home | 🟡 | UI+Lógica |
| F4 | "Facilitar" como verbo dominante en todo el copy | F | Cata+Diana | ~00:44 | ✅ Auditado: "orquesta/automatiza" solo en backstage | 🟡 | Copy |
| G1 | Switch "lo que Gali ha movido" en home/dashboard | G | Diana | ~00:37 | ✅ Toggle `verImpactoGali` + delta chips + banner comparativo | 🟡 | UI+Datos |
| H1-H3 | Proveedores: 3 rutas distintas, discovery necesario | H | Cata | ~00:48 | ⏳ No contemplado | 🟢 | Discovery |
| F5 | Misión formal: "facilitar la operación, escalar fácil" | F | Diana | ~00:44 | ⏳ Solo implícito | 🟢 | Conceptual |
| F6 | Visión formal documentada | F | Laura | ~00:44 | ⏳ No documentada | 🟢 | Conceptual |

---

### 9.5 Qué implementar a continuación (solo lo que §8 no cubrió)

> **Estado al 2026-06-16:** Los sprints 1, 2, 3 y 4 están completados.

**Sprint inmediato ✅ COMPLETO:**

1. **Auditar copy con "facilitar"** ✅ — Auditado: "orquesta/automatiza" solo aparece en backstage (centro de control, diagrama de flujo). CTAs y copy de usuario usan "facilita/facilitar".

2. **Extender panel lateral a Proveedores** ✅ — Implementado como 5 strips + 5 paneles laterales en: catálogo, proveedores, caza-productos, señales, negociaciones.

3. **Switch de métricas Gali en home** ✅ — Toggle `verImpactoGali` en home "Hoy": muestra delta chips (✦ todas por Gali, ✦ atribuibles a Gali) y banner comparativo "sin Gali X pedidos vs con Gali Y pedidos".

**Sprint siguiente ✅ COMPLETO:**

4. **Estado "próximamente" para Órdenes/Logística** ✅ — Tres capas: `STANDBY_KEYS` con 🔒 en el rail, track de progresión modular en home (Productos→Órdenes→Logística), y check-in 5 en proyectos ("¡Casi desbloqueas Gestión de Pedidos!").

5. **Sesión discovery proveedor** — definir los 3 flujos de proveedor (fabricar/importar/marca) antes de prototipar.

**Standby hasta validación con María:**

6. **Agentes con nombre en MVP** — Roax/Vigilante/etc. solo en modo experto. En modo básico, el actor es "Gali" (unificado). Ya implementado en §8/Cambio D.

---

### 9.6 Notas conceptuales de propuesta de valor

**"Facilitar" vs "Orquestar" — diferencia práctica en UX:**

| "Facilitar" | "Orquestar" |
|---|---|
| Sugiero, tú decides | Yo coordino, tú apruebas |
| Bajo umbral cognitivo | Implica complejidad sistémica |
| Accesible para nuevo dropshipper | Suena a herramienta avanzada |
| María lo validó (no dijo "democratizar") | Cata dice "no sé si cualquier persona lo entienda" |

**Regla de copy resultante:** Gali "facilita" al usuario humano. Gali puede "orquestar" las conexiones o los procesos internos (como backstage), pero nunca "te orquesta a ti". El usuario siempre es el decisor.

**Frase propuesta para v6 (refinamiento):**
> "Tú defines la meta. Gali facilita el camino."

**Misión provisional (para sesión con María):**
> Facilitar la operación de e-commerce para que cualquier persona pueda escalar definiendo solo sus metas.

**Visión provisional:**
> Que cualquier emprendedor en Dropi, sin importar su experiencia, pueda operar como si tuviera un equipo experto trabajando para él.

---

### 9.7 Riesgos y preguntas abiertas post-llamada

| Pregunta | Por qué importa | Recomendación |
|---|---|---|
| ¿Aplican los mismos módulos (Proyectos + Mi Negocio) para proveedores? | Los flujos de proveedor son completamente distintos a dropshipper. Un proveedor no "crea un proyecto de venta", gestiona catálogo y stock. | Discovery sesión proveedor antes de prototipar |
| ¿"Hoy" como sub-ítem vs. "Hoy" fusionado en "Mi Negocio"? | Laura sugirió fusionarlos; Cata prefirió mantenerlos. No resuelto en la llamada. | Mantener "Hoy" como sub-ítem de accordion (ya implementado en Cambio D); testear con usuaria real |
| ¿El modal lateral de Diana aplica también al wizard de nuevo proyecto? | Diana quiere que el paso a paso "no parezca paso a paso" y esté dentro de la pantalla base, no en una ruta separada. | Evaluar si el Cambio A (modal en proyectos) satisface la visión de Diana, o si hace falta refactorizar el wizard a formato modal lateral |
| ¿Cómo se calcula el "rango ideal de objetivo" según la operación real del usuario? | Cata menciona que a veces el usuario pone un objetivo de 80 pedidos/sem pero su operación no lo soporta. | En MVP: mostrar mensaje informativo si objetivo > 3x el actual. No bloquear. Validar con María. |
| ¿El switch "métricas Gali" reemplaza o complementa el dashboard existente? | Diana dice "no duplicar el dashboard de indicadores, sino mejorarlo". El switch es una capa sobre lo existente. | Implementar como banner/toggle dentro de la vista "Impacto" existente, no como nuevo dashboard |
| ¿Cuándo mostrar "Centro de Gali" (agentes, skills, reglas) al usuario? | En modo básico está oculto. ¿Cuánto tiempo permanece oculto? ¿Qué trigger lo muestra? | Por ahora: manual (botón "modo experto"). Futura validación: trigger automático cuando el usuario tenga proyectos exitosos |

---

*§9 — Análisis extendido "Avancemos en Gali" · Generado 2026-06-16.*  
*Fuente: `correcciones16jun.md` completo (816 líneas) · Cruza con `correccionescata12jun.md` y §8 de este documento.*

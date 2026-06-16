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

# Dropi: El Flujo Ideal AI-First
## Replanteando la experiencia desde cero — Mayo 2026

> **Premisa:** Dropi no tiene pantallas. Dropi tiene **misiones**. Gali no es un chatbot flotante. Gali es el motor que decide qué ves, qué herramienta necesitas y qué debes lograr a continuación — adaptando el workspace completo según el momento del dropshipper.

---

## El Quiebre Conceptual

### Lo que somos hoy
Una plataforma con catálogo, flujo de pasos, y herramientas aisladas que el usuario tiene que conectar mentalmente. El dropshipper navega, hace clics, y se pierde entre pantallas.

### Lo que necesitamos ser
Un **orquestador con inteligencia de negocio**: Gali sabe en qué etapa está cada usuario, qué ha logrado, qué le falta, y le ofrece el contexto visual y las herramientas exactas para avanzar — sin que tenga que adivinar qué hacer.

**La ecuación:**
```
Intención del usuario (voz/texto)
+ Inteligencia de Gali (LLM + datos LATAM de Dropi)
+ Herramientas conectadas (MCP ecosystem)
= Resultado materializado visualmente en contexto
```

---

## 1. El Sistema de Misiones: la Nueva Navegación

### ¿Por qué misiones?
Porque el dropshipper no sabe navegar — sabe **qué quiere lograr**. "Quiero vender 50 pedidos esta semana." "Quiero lanzar mi primer producto." "Quiero escalar lo que ya funciona." Las misiones convierten esa intención en un camino claro con pasos ejecutables.

Además: los datos de Dropi permiten algo que ningún competidor puede hacer → **mostrar cuántos usuarios con el mismo perfil ya lograron esa misión, en cuánto tiempo y con qué productos.** Eso es el mayor motivador posible.

### Tipos de misiones

**Misiones de inicio** *(para quienes están empezando)*
- "Lanza tu primer producto ganador en 72 horas"
- "Configura tu primera campaña con menos de $200k COP de inversión"
- "Consigue tus primeras 5 ventas"

**Misiones de escala** *(para quienes ya venden)*
- "Lleva este producto a 50 ventas semanales"
- "Optimiza tu ROAS al 3x con nuevos creatives"
- "Diversifica: lanza 2 productos más en tu nicho"

**Misiones de operación** *(recurrentes)*
- "Revisa y responde tus novedades logísticas"
- "Analiza el rendimiento de esta semana con Gali"
- "Renueva tus creatives: los actuales llevan 15 días"

### Cómo funciona una misión
Cada misión tiene:
- **Objetivo claro y medible** (no "crear contenido" sino "tener 3 creatives listos para publicar")
- **Herramientas disponibles** exactas para esa misión (no todo el menú)
- **Datos de contexto**: "312 dropshippers con tu perfil completaron esta misión en promedio en 4 días"
- **Indicador de progreso** visible en todo momento
- **Notificaciones programadas** para los hitos del camino

---

## 2. Los 4 Modos del Workspace

Inspirado en Devin AI: el workspace de Dropi no tiene pantallas estáticas — **Gali muta la interfaz completa** según la fase activa de la misión.

---

### MODO 1 — Descubrimiento
*"Quiero encontrar un producto ganador"*

**Lo que ve el usuario:**

```
┌─────────────────────────────────────────────────────────────┐
│  GALI (centro, expandida)                                   │
│  "¿Qué nicho te interesa? ¿O quieres que te proponga       │
│   algo basado en lo que está vendiendo ahora en Colombia?"  │
│                                                             │
│  [Texto / Voz]        [Sugerencias rápidas]                │
│                                                             │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  [ProductCard] [ProductCard] [ProductCard] [ProductCard]   │
│   Skincare X    Collar perro  Proyector     Yoga mat       │
│   Margen: 62%   Margen: 71%   Margen: 55%   Margen: 68%   │
│   🔥 340 vtas   ⚡ Tendencia  🆕 Nuevo       ✅ Estable    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Qué hace Gali detrás:**
- Llama al MCP Server de Dropi → devuelve `ProductCard` con MCP UI
- Usa datos reales de ROAX para mostrar métricas de ventas LATAM
- Si el usuario tiene historial: filtra automáticamente por niches afines
- Puede llamar MCP de herramientas de research (Minea) para cruzar con tendencias de TikTok/Meta

**Componente Gen UI activo:** `ProductCard` con margen, volumen de ventas LATAM, proveedor, imágenes, y botón "Elegir este"

---

### MODO 2 — Estrategia
*"Tengo el producto, ahora defino cómo venderlo"*

**Lo que ve el usuario:**

```
┌──────────────────┬──────────────────────────────────────────┐
│                  │  GALI (chat, margen derecho)             │
│  PRODUCTO        │  "Encontré 3 ángulos que han funcionado  │
│  [anclado fijo]  │   para productos similares en Colombia.  │
│                  │   ¿Con cuál quieres empezar?"            │
│  Collar perro    │                                          │
│  $12 costo       │  ─────────────────────────────────────   │
│  $49 precio sug. │                                          │
│  Margen: 71%     │  [BuyerPersonaCard] [BuyerPersonaCard]  │
│                  │   Dueño de mascota   Mamá con 2 hijos   │
│  340 ventas/sem  │   Dolor: soledad     Dolor: control      │
│  en Colombia     │   Tono: emocional    Tono: seguridad     │
│                  │   Editar ↗            Editar ↗           │
│                  │                                          │
│                  │  [BuyerPersonaCard]                     │
│                  │   Regalo perfecto                        │
│                  │   Dolor: qué regalar                     │
│                  │   Tono: urgencia/gifting                 │
│                  │   Editar ↗                               │
│                  │                                          │
│                  │  ─────────────────────────────────────   │
│                  │  ✅ Confirmar estrategia → siguiente     │
└──────────────────┴──────────────────────────────────────────┘
```

**Qué hace Gali detrás:**
- El producto queda anclado como contexto inmutable en toda esta fase
- Genera `BuyerPersonaCard` interactivas y editables (Gen UI)
- Cada tarjeta tiene campos editables: tono, dolor principal, edad, canal preferido
- **Approval UI antes de avanzar**: Gali resume la estrategia elegida y pide confirmación explícita → esto previene que el usuario avance con una estrategia equivocada
- Los ángulos de venta que propone se nutren de **datos reales de Dropi**: qué copies han funcionado en productos similares vendidos en LATAM

**Componentes Gen UI activos:** `BuyerPersonaCard`, `SalesAngleSelector`, `ApprovalUI`

---

### MODO 3 — Creación
*"Tengo la estrategia, ahora creo la landing y los creatives"*

**Lo que ve el usuario:**

```
┌──────────────┬──────────────────────────────────┬──────────┐
│ Producto     │                                  │  Gali    │
│ [mini, fijo] │   CANVAS BIDIRECCIONAL           │  (barra  │
│              │                                  │  esbelza)│
│ Collar perro │  [Landing Page en vivo]          │          │
│ Ángulo:      │  ┌────────────────────────────┐  │  "El CTA │
│ Mamá control │  │ 🐕 ¿Tu perro se escapa?    │  │  quedó   │
│              │  │ [Imagen producto]           │  │  muy     │
│              │  │ El collar GPS que...        │  │  largo.  │
│              │  │ [CTA: Ver precio]           │  │  ¿Lo     │
│              │  └────────────────────────────┘  │  ajusto?"│
│              │  ← haz clic para editar          │          │
│              │                                  │  [Sí]    │
│              │  ─────────────────────────────   │  [Déjalo]│
│              │  CREATIVES                       │          │
│              │  [Video1] [Banner1] [Video2]     │          │
│              │  [Banner2] [Video3] [Banner3]    │          │
│              │  + Generar más variaciones       │          │
└──────────────┴──────────────────────────────────┴──────────┘
```

**Qué hace Gali detrás:**
- La landing se construye en tiempo real usando los datos del producto + el ángulo de venta confirmado
- **Canvas bidireccional** (inspirado en v0.dev Design Mode): el usuario puede hacer clic en cualquier elemento de la landing y editarlo directamente — sin tener que escribir un prompt
- La edición visual sincroniza con el estado de Gali: Gali "aprende" las preferencias estéticas del usuario para futuras creaciones
- Los creatives se generan via MCP de herramientas de video/imagen (HeyGen, AdCreative.ai)
- Todo queda versionado — el usuario puede volver a una versión anterior
- **Dropi AI Plus exclusivo:** acceso a más variaciones de creatives, videos con avatar, A/B testing automático de copies

**Componentes activos:** `LandingCanvas`, `CreativeGrid`, `VersionHistory`, `GaliCopilot` (barra lateral esbelta)

---

### MODO 4 — Lanzamiento
*"Tengo todo listo, voy a publicar"*

**Lo que ve el usuario:**

```
┌─────────────────────────────────────────────────────────────┐
│  CONFIGURACIÓN DE CAMPAÑA                                   │
│                                                             │
│  Gali pre-llenó todo basado en tu flujo:                   │
│                                                             │
│  Plataforma:  [Meta Ads] [TikTok] (selecciona)            │
│  Producto:    Collar GPS perro ✓                           │
│  Landing:     landing-collar-mama-v2.dropi.co ✓           │
│  Creative:    Video_B_mamá.mp4 ✓                           │
│  Ángulo:      Mamá preocupada por seguridad ✓             │
│                                                             │
│  Presupuesto diario:  [$50.000 COP] ←→ ajusta             │
│  Duración:            [7 días] ←→ ajusta                  │
│  Audiencia:           Colombia, 25-45 años, mascotas ✓    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📊 Gali estima: basado en productos similares,            │
│     podrías ver 8-15 ventas en los primeros 7 días        │
│     con este presupuesto. (Dato de ROAX + historial LATAM) │
│                                                             │
│  🔔 Te avisaré en 24h con las métricas iniciales          │
│     y en 72h con la primera recomendación de optimización  │
│                                                             │
│  ──────────────────────────────────────────────────────    │
│  [← Revisar creatives]          [🚀 Publicar campaña]     │
└─────────────────────────────────────────────────────────────┘
```

**Qué hace Gali detrás:**
- El formulario de campaña es **Gen UI pre-llenado** con todos los datos del flujo anterior
- El usuario solo ajusta presupuesto y duración — todo lo demás ya está contextualizado
- Al publicar: Gali conecta via **MCP de Meta/TikTok** y ejecuta la creación de la campaña
- Se programan notificaciones automáticas para los hitos clave (24h, 72h, 7 días)
- La misión queda marcada como "En ejecución" con seguimiento activo

**Componentes activos:** `CampaignSetupForm` (Gen UI), `ROASEstimator`, `NotificationScheduler`, `LaunchConfirmation`

---

## 3. Personalización Progresiva de Gali

Gali no trata igual a un usuario nuevo que a uno con 6 meses de experiencia. Se adapta:

| Nivel | Perfil | Cómo actúa Gali |
|---|---|---|
| **Descubridor** | Primeras semanas, sin ventas | Propone todo. Explica el porqué de cada decisión. Usa misiones muy guiadas. |
| **Activo** | Tiene ventas, busca escalar | Propone con opciones. El usuario elige y ajusta. Gali ejecuta. |
| **Experto** | Vende consistentemente | El usuario da el objetivo, Gali ejecuta solo y pide aprobación antes de publicar. |
| **Mentor** | Caso de éxito documentado | Sus datos alimentan las recomendaciones para otros usuarios de su misma etapa. |

**Lo que Gali aprende con el tiempo:**
- Qué nichos prefiere el usuario
- Qué tipo de ángulos de venta tienen mejor respuesta en su audiencia
- Con qué presupuestos históricos ha tenido mejor ROAS
- Qué herramientas externas usa y cómo integrarlas en su flujo

---

## 4. IA Conversacional Contextual

### La idea: el punto de partida cambia según dónde estás

En lugar de un chat genérico, Gali ofrece **conversaciones sugeridas según el contexto actual del usuario:**

**Si el usuario acaba de entrar sin misión activa:**
> "Bienvenido de vuelta. Esta semana 87 dropshippers con tu perfil lanzaron productos de skincare. ¿Quieres explorar esa vertical?"

**Si el usuario está en medio de una misión:**
> "Llevas 2 días en tu misión. Ya tienes el producto y la estrategia. El siguiente paso es la landing. ¿Empezamos?"

**Si el usuario tiene una campaña activa:**
> "Tu campaña del collar GPS lleva 48h. CTR: 2.3% (bueno). CPC: $320 (algo alto). Te sugiero probar el creativo B. ¿Lo activamos?"

**Si el usuario está inactivo hace días:**
> "Hace 5 días que no lanzas nada. Tu competidor en el nicho de mascotas publicó 3 nuevos creatives. ¿Revisamos qué está pasando?"

---

## 5. El Kit de Herramientas del Usuario

### La idea: Gali recomienda, el usuario arma su stack

Cada usuario puede tener un "kit personalizado" de herramientas externas conectadas a Dropi vía MCP. Gali recomienda cuáles activar según la etapa:

**Para el Descubridor:**
- MCP Dropi (catálogo, órdenes) — siempre activo
- MCP de research básico — incluido

**Para el Activo:**
- + MCP Meta Ads — para ver métricas y publicar campañas
- + MCP de creatives (AdCreative.ai) — para generar piezas en volumen

**Para el Experto (Dropi AI Plus):**
- + MCP TikTok Shop — para vender directamente en TikTok
- + MCP HeyGen — para videos con avatar y voice-over
- + MCP Shopify — para los que tienen tienda propia
- + MCP de herramientas de investigación premium (Minea, Sell The Trend)

**El usuario puede añadir herramientas propias** — si ya usa una herramienta de su ecosistema, Dropi la conecta y Gali la incorpora al flujo sin salir de la plataforma.

---

## 6. Modelo de Monetización: Dropi AI Plus

### La pregunta: ¿cómo monetizamos sin que se sienta como un paywall?

La clave está en que el plan gratuito ya sea poderoso — y el Plus sea obvio para quien quiere escalar.

| | **Dropi Free** | **Dropi AI Plus** |
|---|---|---|
| Gali (modo guiado) | ✅ | ✅ |
| Misiones básicas | ✅ | ✅ |
| Catálogo estándar | ✅ | ✅ |
| Datos de ventas básicos | ✅ | ✅ |
| Canvas de landing (básico) | ✅ | ✅ |
| MCP Dropi (catálogo + órdenes) | ✅ | ✅ |
| Gali modo agéntico (ejecuta solo) | — | ✅ |
| Datos avanzados ROAX + tendencias | — | ✅ |
| Generación de creatives con IA | — | ✅ (ilimitado) |
| Canvas bidireccional con Design Mode | — | ✅ |
| MCP Meta / TikTok (publicar directo) | — | ✅ |
| MCP herramientas externas premium | — | ✅ |
| Notificaciones inteligentes | — | ✅ |
| Historial de misiones + versiones | — | ✅ |
| Conectar con Claude para flujos custom | — | ✅ |
| Soporte de comunidad de mentores | ✅ básico | ✅ prioritario |

**La propuesta de valor del Plus en una frase:**
> "Dropi AI Plus es para los que quieren que Gali trabaje por ellos, no solo con ellos."

---

## 7. Las Notificaciones Inteligentes

### La idea: Gali te avisa en el momento correcto, no solo cuando tú la buscas

Esto resuelve uno de los dolores más grandes del dropshipper: **la incertidumbre**. Gali elimina el "¿cómo va todo?" porque te dice proactivamente qué está pasando.

**Tipos de notificaciones:**
- **De misión:** "Llevas 3 días sin avanzar en tu misión. ¿Necesitas ayuda con el siguiente paso?"
- **De campaña:** "Tu campaña está gastando más de lo estimado. CTR bajó 40% desde ayer. Te recomiendo pausarla."
- **De oportunidad:** "Este producto explotó en ventas hoy en México. ¿Quieres añadirlo a tu catálogo?"
- **De logística:** "Tienes 3 novedades pendientes que pueden afectar tu tasa de entrega. Revisemos."
- **De optimización:** "Tus creatives llevan 14 días activos. Es hora de renovarlos — generamos nuevos?"

**El dropshipper puede programar sus propios horarios** de revisión (ej: "avísame todos los días a las 8am con el resumen de lo que necesito atender").

---

## 8. Qué Resuelve Esto de lo que Dropi Hoy No Cubre

Cruzando con la matriz de cobertura actual:

| Problema | Cobertura hoy | Cómo lo resuelve el nuevo flujo |
|---|---|---|
| Creatives efectivos | 🔴 Rojo | Modo Creación + MCP de herramientas generativas + canvas bidireccional |
| Ángulos de venta | 🔴 Rojo | Modo Estrategia + BuyerPersonaCard + datos de copies exitosos LATAM |
| Entender productos ganadores | 🟡 Medio | Modo Descubrimiento + MCP UI con datos ROAX + integración research tools |
| Rentabilidad real | 🟡 Medio | ROASEstimator + datos históricos de campañas similares + notificaciones de optimización |
| Onboarding y curva de aprendizaje | 🟡 Medio | Sistema de misiones + Gali modo guiado + conversaciones contextuales |
| Gestión logística | ✅ Bien | Notificaciones proactivas de novedades + Gali puede consultar estado directamente |
| Acceso a crédito | 🔴 Rojo | (Oportunidad futura: misión "Accede a tu primera línea de crédito Dropi" basada en historial de ventas) |

---

## 9. El Principio de Diseño que Gobierna Todo

> **La función define la forma. Siempre.**

No diseñamos pantallas y les añadimos IA. Diseñamos para la **intención del dropshipper** en cada momento de su flujo — y la interfaz surge de esa intención.

Cuando el usuario quiere descubrir: la interfaz es exploratoria y visual.
Cuando el usuario quiere planear: la interfaz es consultiva y confirmativa.
Cuando el usuario quiere crear: la interfaz es un canvas editable.
Cuando el usuario quiere ejecutar: la interfaz es una consola de lanzamiento.

**Gali no vive en una ventana. Gali es la interfaz.**

---

## 10. El Siguiente Paso Concreto

Para la próxima sesión con el equipo (incluido Michael Giovanni), llevar:

**Mini-concepto para mostrar:**
1. Un prototipo del **Modo Descubrimiento** con MCP UI: cómo se vería Gali respondiendo con tarjetas de producto en lugar de texto
2. El demo de [Shopify MCP UI](https://mcpstorefront.com/?store=demostore.mock.shop&style=default) como referente vivo de cómo se ven componentes interactivos desde un MCP
3. El demo de [Vercel Gen UI](https://ai-sdk-preview-rsc-genui.vercel.app/) para mostrar el patrón de "el agente decide qué componente renderizar"
4. Una exploración del **Sistema de Misiones**: cómo se vería el dashboard cuando no hay pantallas sino misiones activas

**Preguntas para la sesión:**
- ¿Cuál de los 4 modos es el MVP más valioso para comenzar?
- ¿Gali vive siempre visible o aparece bajo demanda?
- ¿El canvas de landing reemplaza completamente el builder actual o coexisten?
- ¿Cómo se siente el usuario cuando Gali ejecuta algo sin que él lo pidió explícitamente?

---

*Documento creado: Mayo 25, 2026 | Dropi Orquestador — Equipo de Producto y Diseño*


-----

# Spec de Prototipo — Dropi Orquestador AI-First
## Versión 1.0 — Mayo 2026

---

## ÍNDICE

1. Alcance y objetivo del prototipo
2. Arquitectura de la experiencia
3. Pantalla 0: Entrada y onboarding con Gali
4. Pantalla 1: Dashboard de misiones
5. Pantalla 2: Modo Descubrimiento (buscar producto)
6. Pantalla 3: Modo Estrategia (ángulos de venta)
7. Pantalla 4: Modo Creación (landing + creatives)
8. Pantalla 5: Modo Lanzamiento (campaña)
9. Pantalla 6: Seguimiento post-lanzamiento
10. Componentes Gen UI — especificación detallada
11. Gali — guiones y estados conversacionales
12. Sistema de transiciones entre modos
13. Estados de error y edge cases
14. Qué es mock vs. qué sería real
15. Criterios de éxito del prototipo

---

## 1. ALCANCE Y OBJETIVO DEL PROTOTIPO

### ¿Para qué sirve este prototipo?
Validar con usuarios reales (dropshippers actuales de Dropi) y con el equipo interno si el modelo de interacción conversacional + visual es comprensible, deseable y reduce la fricción del flujo actual.

### Flujo completo a prototipar (happy path)
```
Entrada → Dashboard de misiones → Descubrimiento → Estrategia → Creación → Lanzamiento → Confirmación
```

### Qué SÍ incluye el prototipo
- Flujo completo end-to-end del happy path
- Todos los componentes Gen UI en estado interactivo (clickeables, con hover, seleccionables)
- Diálogos de Gali guionizados para cada pantalla
- Transiciones y animaciones entre modos
- Versión mobile del flujo principal (solo Modo Descubrimiento y Estrategia)
- Estado "Dropi AI Plus" bloqueado visible en Modo Creación

### Qué NO incluye el prototipo
- Conexión real con APIs (todo es data mockeada)
- Generación real de creatives o landing pages
- Autenticación real
- Flujos de error complejos (solo estados básicos)
- Configuración del kit de herramientas externas

### Herramienta recomendada
**Figma** para diseño visual y prototipado click-through.
**Framer o ProtoPie** si se quiere simular las animaciones de transición entre modos y los estados de streaming de Gali.

---

## 2. ARQUITECTURA DE LA EXPERIENCIA

### Layout global — Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR (56px)                                                  │
│  [Logo Dropi]  [Misión activa: ...]  [Notif] [Avatar]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WORKSPACE (variable según modo)                                │
│                                                                 │
│  El área de trabajo muta completamente entre los 4 modos.      │
│  No hay sidebar de navegación tradicional.                      │
│  No hay menú de páginas.                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Los 4 modos y su layout base

| Modo | Layout | Gali | Canvas |
|---|---|---|---|
| **Descubrimiento** | Gali centrada, resultados debajo | Grande, central | No |
| **Estrategia** | Producto anclado izq. + Gali dcha. | Mediana, lateral | No |
| **Creación** | Canvas central | Mínima, barra dcha. | Sí, bidireccional |
| **Lanzamiento** | Formulario central | Mediana, encima | No |

### Topbar — especificación

```
┌────────────────────────────────────────────────────────────────┐
│  🔵 Dropi    │  🎯 Misión: Lanza tu primer producto — 60%  │ 🔔 │ 👤│
└────────────────────────────────────────────────────────────────┘
```

- **Logo Dropi:** clic → vuelve al Dashboard de misiones
- **Misión activa:** muestra nombre de la misión + barra de progreso (%) → clic abre el panel de misión
- **🔔 Notificaciones:** badge con número de alertas pendientes → clic abre panel lateral de notificaciones
- **👤 Avatar:** menú desplegable con perfil, nivel de Gali, plan actual (Free/Plus), y cierre de sesión

---

## 3. PANTALLA 0: ENTRADA Y ONBOARDING CON GALI

### Cuándo aparece
Solo en el primer login o cuando el usuario no tiene misión activa. Usuarios con misión activa van directo al Dashboard.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              [Logo Dropi]                                       │
│                                                                 │
│         ┌─────────────────────────────────────────┐            │
│         │  👋 Hola, [Nombre].                     │            │
│         │                                         │            │
│         │  Soy Gali, tu copiloto de ventas.       │            │
│         │  Para recomendarte la mejor misión para │            │
│         │  empezar, necesito hacerte 3 preguntas  │            │
│         │  rápidas.                               │            │
│         │                                         │            │
│         │  ¿Cuánto tiempo llevas en dropshipping? │            │
│         │                                         │            │
│         │  [Soy nuevo, nunca he vendido]          │            │
│         │  [Menos de 3 meses]                     │            │
│         │  [3-12 meses, tengo algunas ventas]     │            │
│         │  [Más de 1 año, vendo regularmente]     │            │
│         └─────────────────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de onboarding (3 preguntas)

**Pregunta 1:** ¿Cuánto tiempo llevas en dropshipping?
→ Opciones: Nunca he vendido / Menos de 3 meses / 3-12 meses / Más de 1 año

**Pregunta 2:** ¿Tienes algún nicho en mente?
→ Opciones: No, necesito ayuda para encontrarlo / Sí, tengo uno (campo de texto libre) / Quiero explorar varias opciones

**Pregunta 3:** ¿Cuál es tu objetivo más urgente?
→ Opciones: Hacer mi primera venta / Llegar a ventas consistentes / Escalar lo que ya funciona / Explorar productos nuevos

### Respuesta de Gali post-onboarding

Después de las 3 respuestas, Gali muestra (animado, como si estuviera "pensando" 2s):

```
┌──────────────────────────────────────────────┐
│  ✨ Perfecto, [Nombre].                       │
│                                              │
│  Basado en tu perfil, te propongo empezar   │
│  con esta misión:                            │
│                                              │
│  🎯 "Lanza tu primer producto ganador        │
│      en 72 horas"                            │
│                                              │
│  📊 247 dropshippers como tú la completaron │
│     esta semana. Promedio: 2.4 días.         │
│                                              │
│  [🚀 Empezar esta misión]                   │
│  [Ver otras misiones disponibles]            │
└──────────────────────────────────────────────┘
```

### Comportamiento de la animación de Gali
- Avatar de Gali: círculo con gradiente animado (pulsante mientras "piensa")
- Texto aparece palabra por palabra (streaming effect, 30ms por palabra)
- Las opciones aparecen con un fade-in escalonado (100ms entre cada una)

---

## 4. PANTALLA 1: DASHBOARD DE MISIONES

### Cuándo aparece
Cuando el usuario ya tiene historial. Es el "home" de la nueva Dropi.

### Layout — Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR                                                          │
├──────────────────┬──────────────────────────────────────────────┤
│                  │                                              │
│  MISIÓN ACTIVA   │  GALI — Resumen del día                     │
│  (panel izq.)    │  (panel der.)                               │
│  280px           │  flex                                        │
│                  │                                              │
│  🎯 Lanza tu     │  "Buenos días, [Nombre]. Esto es lo que     │
│  primer producto │   necesitas atender hoy:"                   │
│                  │                                              │
│  ████████░░ 60%  │  [AlertCard] Tu campaña lleva 48h.         │
│                  │  CTR: 2.1% · Recomiendo ajustar budget      │
│  Próximo paso:   │                                              │
│  Crear tu        │  [AlertCard] 2 novedades logísticas         │
│  landing page    │  pendientes de resolución                   │
│                  │                                              │
│  [Continuar →]   │  [MissionCard] Misión disponible:           │
│                  │  "Renueva tus creatives" · 📊 Alta prioridad│
│  ─────────────   │                                              │
│                  │  ─────────────────────────────────────────  │
│  OTRAS MISIONES  │                                             │
│                  │  💬 ¿Qué quieres hacer hoy?                │
│  [MissionCard]   │  [Buscar un nuevo producto]                 │
│  [MissionCard]   │  [Revisar rendimiento de mis campañas]      │
│  [MissionCard]   │  [Generar creatives nuevos]                 │
│                  │  [Escribir a Gali...]                       │
└──────────────────┴──────────────────────────────────────────────┘
```

### Componente: MissionCard

```
┌──────────────────────────────────────────┐
│  🎯 Lanza tu primer producto             │
│                                          │
│  ████████░░░░ 60%                        │
│  Paso 3 de 5: Crear landing page         │
│                                          │
│  📊 247 usuarios la completaron esta sem.│
│  ⏱ Promedio de completación: 2.4 días   │
│                                          │
│  [Continuar misión →]                    │
└──────────────────────────────────────────┘
```

**Estados de MissionCard:**
- `active`: borde azul, botón "Continuar"
- `available`: borde gris, botón "Empezar"
- `completed`: borde verde, badge "✓ Completada", botón "Ver resumen"
- `locked` (Plus): borde gris punteado, badge "Plus 🔒"

### Componente: AlertCard

```
┌──────────────────────────────────────────┐
│  ⚠️  Tu campaña lleva 48h               │
│                                          │
│  CTR: 2.1% (por debajo del promedio)    │
│  Gali recomienda: ajustar segmentación  │
│                                          │
│  [Ver campaña]  [Aplicar sugerencia]    │
└──────────────────────────────────────────┘
```

---

## 5. PANTALLA 2: MODO DESCUBRIMIENTO

### Cuándo aparece
Cuando el usuario entra al paso "Buscar producto" de su misión, o escribe/dice "quiero buscar un producto".

### Transición desde Dashboard
- La pantalla anterior hace un fade-out (300ms)
- El workspace hace un zoom-out suave
- La interfaz del Modo Descubrimiento hace un fade-in (400ms)
- La topbar actualiza el indicador de misión

### Layout — Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: 🎯 Misión: Lanza tu primer producto — Paso 1: Producto  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                   GALI                                  │  │
│   │                                                         │  │
│   │  🔵  "¿Qué tipo de producto estás buscando?            │  │
│   │       Puedo sugerirte algo basado en lo que            │  │
│   │       está vendiendo ahora en Colombia, o si           │  │
│   │       tienes algún nicho en mente, cuéntame."          │  │
│   │                                                         │  │
│   │  [Quiero ver tendencias de hoy]                        │  │
│   │  [Busco algo en la categoría de hogar]                 │  │
│   │  [Tengo un producto en mente]                          │  │
│   │  [🎤 Hablar con Gali]  [✏️ Escribir]                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
│   RESULTADOS (aparecen después de que el usuario responde)     │
│                                                                 │
│   Filtros rápidos: [Todos] [Skincare] [Hogar] [Mascotas]       │
│                    [Tech] [Fitness] [Bebés]                    │
│                                                                 │
│   Ordenar: [🔥 Más vendidos] [📈 Tendencia] [💰 Mayor margen]  │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │ Product  │  │ Product  │  │ Product  │  │ Product  │      │
│   │ Card     │  │ Card     │  │ Card     │  │ Card     │      │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │ Product  │  │ Product  │  │ Product  │  │ Product  │      │
│   │ Card     │  │ Card     │  │ Card     │  │ Card     │      │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Componente: ProductCard — especificación completa

**Tamaño:** 280px × 360px

```
┌──────────────────────────────────────┐
│  [Badge: 🔥 Más vendido esta semana] │  ← badge posicionado top-left
│                                      │
│  [Imagen del producto — 280×180px]   │  ← ratio 16:9, object-fit: cover
│  [⬡ ⬡ ⬡ ⬡] ← carrusel dots        │
│                                      │
│  Collar GPS para perros              │  ← título, 2 líneas max, font 14px bold
│  Proveedor: ✅ Verificado            │  ← badge proveedor
│                                      │
│  💰 Precio sugerido venta: $89.000   │  ← COP, color texto principal
│  📦 Costo: $26.000 · Margen: 71%    │  ← margen en verde si >50%, amarillo 30-50%
│                                      │
│  📊 340 ventas esta semana en Col.   │  ← dato de ROAX, color accent
│  📈 +23% vs semana anterior         │  ← tendencia
│                                      │
│  [Ver detalles]  [✓ Elegir este]    │  ← botones primario/secundario
└──────────────────────────────────────┘
```

**Estados de ProductCard:**
- `default`: sombra suave, hover eleva la card (translateY -4px, sombra más pronunciada)
- `selected`: borde azul 2px, checkmark en top-right, botón "Elegir este" → "✓ Seleccionado"
- `loading`: skeleton animation (shimmer) en imagen y textos

**Al hacer clic en "Ver detalles":**
Se expande una modal o drawer con:
- Galería completa de imágenes (carrusel)
- Descripción del producto
- Especificaciones técnicas
- Historial de ventas (gráfica simple de 30 días)
- Proveedores disponibles con tiempos de entrega
- Productos similares en el catálogo

**Al hacer clic en "Elegir este":**
1. La card entra en estado `selected` (animación de check, 300ms)
2. Un toast aparece: "✓ Collar GPS seleccionado"
3. Gali responde (aparece encima de los resultados):
   ```
   "Buena elección. Este producto tiene 340 ventas esta semana
   en Colombia con un margen del 71%. Ahora definamos cómo vas
   a diferenciarte para venderlo. ¿Continuamos con los ángulos
   de venta?"
   [Sí, vamos] [Quiero ver más productos]
   ```
4. Si el usuario dice "Sí, vamos" → transición a Modo Estrategia

### Diálogos de Gali en Modo Descubrimiento

**Estado inicial (sin búsqueda):**
> "¿Qué tipo de producto estás buscando? Puedo sugerirte algo basado en lo que está vendiendo ahora en Colombia, o si tienes algún nicho en mente, cuéntame."

**Después de "Quiero ver tendencias de hoy":**
> "Aquí están los 8 productos con mayor tracción en Colombia hoy. Los ordené por combinación de volumen de ventas y margen. El primero es un outlier interesante esta semana."

**Después de una búsqueda con texto (ej: "algo para mascotas"):**
> "Encontré 24 productos en la categoría mascotas. Te muestro los que tienen mejor combinación de margen y demanda actual. El collar GPS está rompiendo tendencia esta semana con +23% de ventas."

**Si el usuario ve muchas cards y no elige:**
> "¿Quieres que te ayude a comparar? Cuéntame qué te importa más: ¿el margen, la facilidad de venta o la competencia en el nicho?"

---

## 6. PANTALLA 3: MODO ESTRATEGIA

### Cuándo aparece
Después de que el usuario confirma el producto. Transición desde Modo Descubrimiento.

### Transición
- Las ProductCards hacen shrink y desaparecen (scale 0.8 + fade, 400ms)
- La card del producto seleccionado "vuela" hacia el panel izquierdo (animación de reposicionamiento, 500ms)
- El layout de Modo Estrategia aparece con fade-in

### Layout — Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: 🎯 Misión: Lanza tu primer producto — Paso 2: Estrategia│
├────────────────────┬────────────────────────────────────────────┤
│                    │                                            │
│  PRODUCTO ANCLADO  │  GALI + ÁNGULOS DE VENTA                  │
│  (280px, fijo)     │  (flex, scroll)                           │
│                    │                                            │
│  [Imagen producto] │  🔵 Gali:                                 │
│                    │  "Analicé 847 ventas de productos          │
│  Collar GPS perros │   similares en LATAM. Encontré 3          │
│  Margen: 71%       │   perfiles de comprador que funcionan.    │
│  340 vtas/sem      │   ¿Cuál resuena más con tu idea?"         │
│                    │                                            │
│  ─────────────     │  ──────────────────────────────────────   │
│                    │                                            │
│  📊 Datos de       │  [BuyerPersonaCard 1]                     │
│  productos         │  [BuyerPersonaCard 2]                     │
│  similares:        │  [BuyerPersonaCard 3]                     │
│                    │                                            │
│  Top 3 categorías  │  ──────────────────────────────────────   │
│  de compradores:   │                                            │
│  • Mamás 35-44     │  [Approval UI — aparece al seleccionar]   │
│  • Dueños mascotas │                                            │
│  • Regalos         │  [✏️ Escribir a Gali sobre la estrategia] │
│                    │                                            │
└────────────────────┴────────────────────────────────────────────┘
```

### Componente: BuyerPersonaCard — especificación completa

**Tamaño:** full width del panel derecho, height: 200px (expandible a 320px)

```
┌──────────────────────────────────────────────────────────────────┐
│  1  👩 Mamá preocupada por la seguridad de su mascota            │
│                                                                  │
│  Edad: 28-42 · Colombia, ciudades principales                   │
│  Dolor principal: "Mi perro se me escapa y no sé dónde está"   │
│                                                                  │
│  Tono recomendado: [Emocional ▼]  Canal: [Instagram ▼]         │
│                                                                  │
│  Ángulo de copy: "¿Sabes dónde está tu perro en este momento?" │
│                                                                  │
│  📊 Este perfil generó el 38% de ventas en productos similares  │
│                                                                  │
│  [✓ Elegir este perfil]                        [Ver más datos ↓]│
└──────────────────────────────────────────────────────────────────┘
```

**Campos editables dentro de la card:**
- `Tono recomendado`: dropdown → [Emocional / Racional / Urgente / Aspiracional / Educativo]
- `Canal`: dropdown → [Instagram / TikTok / Facebook / WhatsApp]
- `Ángulo de copy`: campo de texto editable, 1 línea, con placeholder

**Al editar un campo:**
- La card entra en estado `modified` (borde amarillo sutil)
- Un badge "Editado ✏️" aparece en top-right
- Gali responde automáticamente en el chat: "Bien. Cambiaste el tono a Racional. Este enfoque funcionó mejor en diciembre para productos de control. ¿Lo mantenemos?"

**Estados de BuyerPersonaCard:**
- `default`: sin borde
- `expanded`: muestra datos adicionales (gráfica de % de ventas por perfil, ejemplos de copies que funcionaron)
- `selected`: borde azul, checkmark, botón cambia a "✓ Seleccionado"

### Componente: Approval UI

Aparece después de que el usuario selecciona un BuyerPersona. Es la confirmación explícita antes de avanzar al Modo Creación.

```
┌──────────────────────────────────────────────────────────────────┐
│  📋 RESUMEN DE TU ESTRATEGIA                                     │
│                                                                  │
│  Producto:     Collar GPS para perros                           │
│  Perfil:       Mamá preocupada por la seguridad de su mascota   │
│  Tono:         Emocional                                         │
│  Canal:        Instagram                                         │
│  Ángulo:       "¿Sabes dónde está tu perro en este momento?"   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  🔵 Gali: "Con esta estrategia, estimo que tu landing          │
│           debería convertir entre 2.8% y 4.1% basada           │
│           en 34 casos similares en los últimos 90 días."        │
│                                                                  │
│  [✏️ Cambiar algo]                [✅ Confirmar y crear →]      │
└──────────────────────────────────────────────────────────────────┘
```

**Al hacer clic en "Confirmar y crear":**
→ Transición al Modo Creación

**Al hacer clic en "Cambiar algo":**
→ La Approval UI se cierra y el usuario puede editar cualquier card

---

## 7. PANTALLA 4: MODO CREACIÓN

### Cuándo aparece
Después de que el usuario confirma la estrategia en la Approval UI.

### Transición desde Modo Estrategia
- El panel izquierdo (producto anclado) se encoge hacia el margen izquierdo (280px → 60px)
- En los 60px queda un mini-widget con la foto del producto y el nombre
- El panel de Gali se encoge hacia la derecha (barra de 280px)
- El canvas aparece en el centro con un efecto de "despliegue" (scale 0.8 → 1, fade-in, 600ms)

### Layout — Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: 🎯 Misión: Lanza tu primer producto — Paso 3: Creación  │
├────┬──────────────────────────────────────────────────┬─────────┤
│    │                                                  │         │
│ 🐕  │  CANVAS BIDIRECCIONAL                           │  GALI   │
│    │  (central, editable)                            │  BARRA  │
│ 60px│                                                 │  280px  │
│    │  TABS: [Landing Page] [Creatives]               │         │
│    │                                                  │  🔵     │
│    │  ─────────────────────────────────────────────  │  "Aquí  │
│    │                                                  │  está   │
│    │  [LANDING PAGE PREVIEW]                         │  tu     │
│    │                                                  │  landing│
│    │  ┌──────────────────────────────────────────┐   │  El CTA │
│    │  │ ¿Sabes dónde está tu perro               │   │  lo     │
│    │  │ en este momento?                         │   │  centré │
│    │  │                                          │   │  en la  │
│    │  │ [imagen collar perro] 🐕                 │   │  emoción│
│    │  │                                          │   │  ¿Cómo  │
│    │  │ El único collar GPS que te da            │   │  lo ves?"│
│    │  │ tranquilidad real.                       │   │         │
│    │  │                                          │   │  ─────  │
│    │  │ [Ver precio → $89.000]                   │   │         │
│    │  └──────────────────────────────────────────┘   │  [✏️ Me-│
│    │                                                  │  nsaje] │
│    │  ← Haz clic en cualquier elemento para editarlo │         │
│    │                                                  │  ─────  │
│    │  Escala: [50%▼] [Desktop] [Mobile]              │ 🔒 PLUS │
│    │                                                  │  Genera │
│    │                                                  │  hasta  │
│    │                                                  │  20     │
│    │                                                  │  variaciones│
└────┴──────────────────────────────────────────────────┴─────────┘
```

### Sub-tab: Landing Page

**Estructura de la landing generada (elementos editables):**

Cada elemento tiene un tooltip al hacer hover: "Haz clic para editar"

```
SECCIÓN 1: HERO
├── [Headline] — click → edita el texto directamente (contenteditable)
├── [Subheadline] — click → edita
├── [Imagen principal] — click → abre modal de cambio de imagen
└── [CTA Button] — click → edita texto y color del botón

SECCIÓN 2: BENEFICIOS
├── [Ícono + Texto x3] — cada uno editable
└── [Orden] — drag & drop para reordenar

SECCIÓN 3: SOCIAL PROOF
├── [Testimonio 1] — click → edita o reemplaza
├── [Testimonio 2] — click → edita o reemplaza
└── [Rating / Stars] — edita número

SECCIÓN 4: CTA FINAL
├── [Texto de urgencia] — click → edita
├── [Precio con tachado] — click → edita precio
└── [Botón CTA] — click → edita
```

**Al hacer clic en cualquier elemento del canvas:**
1. El elemento se encierra en un borde azul punteado
2. Aparece un mini toolbar flotante encima del elemento:
   ```
   [Editar texto] [Cambiar imagen] [Cambiar color] [Eliminar] [Mover ↕]
   ```
3. Gali en la barra derecha: "Estás editando el headline. El actual tiene buen gancho emocional. Si quieres, puedo sugerirte 3 alternativas."

**Botones del canvas (barra inferior del canvas):**
```
[Vista Desktop] [Vista Mobile]    [Escala: 50% ▼]    [Exportar] [→ Siguiente]
```

### Sub-tab: Creatives

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  GALI: "Generé 6 piezas basadas en tu estrategia.             │
│         2 videos para TikTok/Reels y 4 banners estáticos."    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  [Video 1]      [Video 2]      [Banner 1]    [Banner 2] │  │
│  │  TikTok 9:16   Reels 9:16     Feed 1:1      Story 9:16  │  │
│  │  ▶ Preview     ▶ Preview      [img]          [img]      │  │
│  │  ★ Favorito    ★ Favorito    ★ Favorito    ★ Favorito  │  │
│  │                                                          │  │
│  │  [Banner 3]     [Banner 4]    [+ 🔒 Generar más — Plus] │  │
│  │  Carrusel       Banner wide                              │  │
│  │  [img]          [img]                                    │  │
│  │  ★ Favorito    ★ Favorito                               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Seleccionados para campaña: 0 de 6 ← debe seleccionar ≥1    │
│                                                                 │
│  [← Volver a Landing]              [Continuar con campaña →]  │
└─────────────────────────────────────────────────────────────────┘
```

**Al hacer hover en una pieza de creative:**
```
┌──────────────┐
│  [preview]   │
│  ────────    │
│  [Usar este] │
│  [Editar]    │
│  [Descargar] │
└──────────────┘
```

**Bloque Plus (Dropi AI Plus):**
```
┌──────────────────────────────────────┐
│  🔒 Generar más variaciones — Plus   │
│                                      │
│  Con Dropi AI Plus puedes generar    │
│  hasta 20 variaciones por producto   │
│  y hacer A/B automático.             │
│                                      │
│  [Ver planes]                        │
└──────────────────────────────────────┘
```

---

## 8. PANTALLA 5: MODO LANZAMIENTO

### Cuándo aparece
Cuando el usuario hace clic en "Continuar con campaña" desde el tab de Creatives.

### Transición
- El canvas se contrae hacia la izquierda (slide-out, 400ms)
- El formulario de lanzamiento aparece desde la derecha (slide-in, 400ms)
- Gali vuelve a un tamaño normal en la parte superior

### Layout — Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: 🎯 Misión: Lanza tu primer producto — Paso 4: Campaña   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔵 GALI:                                                       │
│  "Todo listo para lanzar. Pre-llené la campaña con los datos   │
│   de tu flujo. Solo ajusta el presupuesto y la duración.       │
│   Cuando confirmes, me conecto con Meta y publico."            │
│                                                                 │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                      │
│  CONFIGURACIÓN           │  RESUMEN VISUAL                     │
│  (formulario Gen UI)     │                                      │
│                          │  ┌──────────────────────────────┐   │
│  Plataforma              │  │                              │   │
│  [● Meta Ads] [○ TikTok] │  │  [Preview miniatura         │   │
│                          │  │   de la landing]             │   │
│  Producto                │  │                              │   │
│  ✅ Collar GPS perros    │  │  [Thumbnail del creative     │   │
│                          │  │   seleccionado]              │   │
│  Landing                 │  │                              │   │
│  ✅ landing-collar-v1    │  └──────────────────────────────┘   │
│                          │                                      │
│  Creative seleccionado   │  📊 ESTIMACIÓN DE GALI:            │
│  ✅ Video B - mamá       │                                      │
│                          │  Con $50.000/día durante 7 días:   │
│  Ángulo                  │  • Alcance est.: 12.000–18.000     │
│  ✅ Mamá / emocional     │  • Ventas est.: 8–15               │
│                          │  • ROAS est.: 2.1x–3.4x            │
│  Presupuesto diario      │                                      │
│  [$50.000 COP] ←slider→ │  📊 Basado en 34 campañas          │
│  Min: $20k  Max: $500k  │  similares en Colombia              │
│                          │  los últimos 90 días.              │
│  Duración                │                                      │
│  [7 días      ] ←→      │                                      │
│                          │                                      │
│  Audiencia               │  🔔 NOTIFICACIONES PROGRAMADAS:     │
│  ✅ Col., 25-45, mascotas│                                      │
│  [Editar audiencia]      │  ✓ 24h: métricas iniciales         │
│                          │  ✓ 72h: primera optimización       │
│                          │  ✓ 7d: reporte final + siguiente   │
│                          │       misión sugerida              │
│                          │                                      │
├──────────────────────────┴──────────────────────────────────────┤
│                                                                 │
│  [← Volver a creatives]            [🚀 Publicar campaña →]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Slider de Presupuesto

```
PRESUPUESTO DIARIO
$20.000 ──────●────────────────── $500.000
              $50.000 COP / día

              ↑
  Gali actualiza la estimación en tiempo real
  al mover el slider
```

Al mover el slider: la estimación de la derecha se actualiza instantáneamente (animación de número contando).

### Pantalla de Confirmación (modal pre-publicación)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ⚡ ¿Estás listo para publicar?                              │
│                                                              │
│  Gali va a conectarse con Meta Ads y crear tu campaña       │
│  con la siguiente configuración:                            │
│                                                              │
│  ✓ Presupuesto total: $350.000 COP (7 días × $50.000)      │
│  ✓ Creative: Video B - mamá emocional                       │
│  ✓ Landing: landing-collar-v1.dropi.co                      │
│  ✓ Audiencia: Colombia, 25-45, interés mascotas            │
│                                                              │
│  Una vez publicada, recibirás notificaciones                │
│  en las próximas 24h, 72h y 7 días.                        │
│                                                              │
│  [Cancelar]              [✅ Sí, publicar ahora]            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Post-publicación: estado de éxito

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              🎉                                              │
│                                                              │
│       ¡Tu campaña está en el aire!                          │
│                                                              │
│  Meta está procesando tu anuncio.                           │
│  Estará activo en aproximadamente 30 minutos.               │
│                                                              │
│  🔔 Te avisaré mañana a las 9am con las primeras           │
│     métricas.                                               │
│                                                              │
│  ✅ Misión completada: Lanza tu primer producto            │
│     ████████████ 100%                                       │
│                                                              │
│  ─────────────────────────────────────────────────         │
│                                                              │
│  📊 Gali te sugiere tu próxima misión:                     │
│  "Lleva este producto a 50 ventas semanales"               │
│                                                              │
│  [Ver siguiente misión]      [Ir al dashboard]              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. PANTALLA 6: SEGUIMIENTO POST-LANZAMIENTO

### Panel de notificación (24h después del lanzamiento)

Aparece en la topbar como badge en 🔔. Al hacer clic:

```
┌──────────────────────────────────────────────────────────────┐
│  📊 Primeras 24h de tu campaña                              │
│                                                              │
│  Collar GPS · Campaña Meta · Lanzada hace 24h              │
│                                                              │
│  Alcance:     4.200 personas                               │
│  Impresiones: 6.800                                         │
│  Clics:       142 (CTR: 2.09%)                             │
│  Ventas:      3                                             │
│  Inversión:   $50.000 COP                                  │
│  ROAS:        2.1x                                          │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  🔵 Gali: "El CTR está bien (promedio del sector: 1.8%).   │
│   Sin embargo, el ROAS está en el límite bajo de mi         │
│   estimación. Te recomiendo probar el Banner 1 en          │
│   paralelo para ver si mejora la conversión."              │
│                                                              │
│  [Activar Banner 1 como variante]   [Revisar más tarde]    │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. COMPONENTES GEN UI — ESPECIFICACIÓN DETALLADA

### Inventario completo de componentes

| Componente | Modo | Interactividad | Descripción |
|---|---|---|---|
| `GaliAvatar` | Todos | Animado (pulsante, thinking) | Avatar + estado visual de Gali |
| `GaliMessage` | Todos | Texto con streaming effect | Burbuja de diálogo de Gali |
| `GaliSuggestion` | Todos | Clickeable | Chip de sugerencia de Gali |
| `ProductCard` | Descubrimiento | Click, hover, selectable | Tarjeta de producto del catálogo |
| `ProductCardMini` | Estrategia, Creación | Display only | Versión colapsada del producto anclado |
| `BuyerPersonaCard` | Estrategia | Click, editable, expandable | Tarjeta de buyer persona |
| `ApprovalUI` | Estrategia | Click confirm/edit | Resumen de estrategia + confirmación |
| `LandingCanvas` | Creación | Click-to-edit, drag | Preview editable de landing page |
| `CanvasElement` | Creación | Click, mini-toolbar | Elemento editable dentro del canvas |
| `CreativeGrid` | Creación | Hover, select, favorite | Galería de piezas publicitarias |
| `CreativeCard` | Creación | Hover menu, selectable | Tarjeta de una pieza creativa |
| `CampaignForm` | Lanzamiento | Slider, radio, display | Formulario de configuración de campaña |
| `ROASEstimator` | Lanzamiento | Reactivo al slider | Estimación en tiempo real |
| `MissionCard` | Dashboard | Click | Tarjeta de misión |
| `AlertCard` | Dashboard | Click actions | Alerta de Gali |
| `NotifPanel` | Global | Drawer | Panel lateral de notificaciones |
| `PlusBlock` | Creación | Click to upsell | Bloque de feature bloqueada por plan |

### Componente: GaliAvatar — estados

```
IDLE:        ● azul sólido, sin animación
THINKING:    ● azul con pulso (scale 0.9 → 1.1, 800ms loop)
SPEAKING:    ● azul con onda sonora a los lados (streaming)
ALERT:       ● naranja sólido con badge !
SUCCESS:     ● verde sólido, ícono ✓ por 2s luego vuelve a idle
```

### Componente: GaliMessage — animación de streaming

El texto de Gali aparece palabra por palabra, como si estuviera escribiendo en tiempo real:
- Velocidad: 30ms entre palabras (ajustable)
- Un cursor parpadeante al final mientras el texto no termina
- Al terminar el texto: cursor desaparece, aparecen las opciones/chips con fade-in escalonado (80ms entre cada chip)

---

## 11. GALI — GUIONES Y ESTADOS CONVERSACIONALES

### Tono y personalidad de Gali
- **Directa pero cálida:** no usa palabras innecesarias, pero tampoco es fría
- **Data-driven:** siempre que dice algo, lo respalda con un dato ("38% de ventas", "34 casos similares")
- **Proactiva:** no espera que el usuario le pregunte — sugiere, anticipa, avisa
- **Sin juzgar:** si el usuario hace algo diferente a lo que sugiere, no lo cuestiona — se adapta

### Biblioteca de mensajes de Gali para el prototipo

**Bienvenida (onboarding):**
> "Hola, [Nombre]. Soy Gali, tu copiloto de ventas en Dropi. Para recomendarte la mejor misión para empezar, necesito hacerte 3 preguntas rápidas."

**Sugerencia de misión:**
> "Basado en tu perfil, te propongo empezar con la misión [nombre]. 247 dropshippers como tú la completaron esta semana — el promedio fue 2.4 días. ¿Empezamos?"

**Al mostrar productos:**
> "Encontré 8 productos con alta tracción en Colombia esta semana. Los ordené por combinación de margen y demanda. [Producto X] es el outlier interesante."

**Al confirmar producto:**
> "Buena elección. [Producto] tiene [X] ventas esta semana en Colombia con un margen del [Y]%. Analicé [N] ventas de productos similares y encontré 3 perfiles de comprador que funcionan bien."

**Al mostrar buyer personas:**
> "Este perfil generó el 38% de ventas en productos similares en LATAM en los últimos 90 días. El tono emocional convierte mejor que el racional para este tipo de producto."

**Al confirmar estrategia (Approval UI):**
> "Con esta estrategia, estimo que tu landing debería convertir entre 2.8% y 4.1% basada en 34 casos similares en los últimos 90 días."

**Al generar landing:**
> "Aquí está tu landing. La construí con el ángulo emocional que elegiste. El CTA lo centré en la urgencia sin ser agresivo. ¿Cómo lo ves?"

**Al generar creatives:**
> "Generé 6 piezas basadas en tu estrategia: 2 videos para TikTok/Reels y 4 banners estáticos. El Video B tuvo mejor rendimiento en pruebas A/B similares — te lo marqué como recomendado."

**Pre-lanzamiento:**
> "Todo listo para lanzar. Pre-llené la campaña con los datos de tu flujo. Solo ajusta el presupuesto y la duración. Cuando confirmes, me conecto con Meta y publico."

**Post-lanzamiento:**
> "¡Tu campaña está en el aire! Meta está procesando el anuncio. Te avisaré mañana con las primeras métricas."

**Notificación 24h:**
> "El CTR está bien — promedio del sector es 1.8% y estás en 2.09%. Sin embargo, el ROAS está en el límite bajo. Te recomiendo probar el Banner 1 en paralelo."

---

## 12. SISTEMA DE TRANSICIONES ENTRE MODOS

| Transición | Duración | Animación |
|---|---|---|
| Dashboard → Descubrimiento | 500ms | Fade + zoom-out del dashboard, fade-in del modo |
| Descubrimiento → Estrategia | 700ms | ProductCards shrink + vuela al panel izq., layout de estrategia emerge |
| Estrategia → Creación | 600ms | Panel izq. se colapsa a 60px, canvas emerge desde el centro |
| Creación → Lanzamiento | 500ms | Canvas slide-out izq., formulario slide-in der. |
| Lanzamiento → Post-lanzamiento | 800ms | Modal de éxito con confetti, luego navega al dashboard actualizado |

**Principios de animación:**
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` — Material Design standard
- **Nunca instant:** el workspace siempre anima (refuerza que el sistema está "trabajando")
- **El elemento más importante siempre anima último:** el usuario sigue el movimiento y llega al foco correcto

---

## 13. ESTADOS DE ERROR Y EDGE CASES

### Error: Gali tarda en responder
- Si Gali tarda más de 3s: aparece un estado "Gali está analizando..." con el avatar pulsante
- Si tarda más de 8s: "Esto está tomando más de lo usual. ¿Quieres que continúe o prefiero mostrarte resultados más rápidos?" → [Continuar esperando] [Resultados rápidos]

### Error: No hay productos en el nicho buscado
> "No encontré productos en ese nicho específico en el catálogo actual. ¿Quieres explorar nichos relacionados? También puedo mostrarte los nichos con más demanda esta semana."

### Edge case: El usuario quiere saltarse un paso
Si el usuario en Modo Estrategia escribe "ya sé qué quiero, llévame directo a la landing":
> "Claro. Para generar la landing necesito saber al menos el ángulo de venta. ¿Puedes decirme a quién le vas a vender y cuál es el mensaje principal?"
→ Acepta la respuesta en texto libre y usa esa info para generar la landing sin pasar por las BuyerPersonaCards

### Edge case: El usuario quiere usar su propio copy
En el canvas, si el usuario edita completamente el headline:
> "Usaste tu propio headline — bien. Lo incorporé. ¿Quieres que adapte el resto de la landing a este nuevo tono, o prefieres mantener lo que generé?"

---

## 14. QUÉ ES MOCK VS. QUÉ SERÍA REAL

| Elemento | En el prototipo | En producción |
|---|---|---|
| Diálogos de Gali | Texto fijo (guionizado) | LLM (Claude/GPT) |
| Productos del catálogo | 8-12 productos reales de Dropi | 160k+ del catálogo real |
| Datos de ventas (ROAX) | Datos reales o aproximados reales | ROAX API en tiempo real |
| BuyerPersonas | Generadas manualmente para el prototipo | Gen UI con LLM |
| Landing page generada | Template fija con variables intercambiables | Generación dinámica con LLM + template engine |
| Creatives | Imágenes/videos reales del banco de activos de Dropi | Generación con HeyGen/AdCreative.ai via MCP |
| Formulario de campaña | Interactivo pero no conectado | MCP Meta Ads / TikTok API |
| Estimación de ROAS | Cálculo estático basado en inputs | Modelo predictivo con datos de Dropi |
| Notificaciones | Simuladas (sin envío real) | Push + email + in-app |
| Animaciones de streaming de Gali | CSS animation / setTimeout | SSE o WebSocket con LLM streaming |

---

## 15. CRITERIOS DE ÉXITO DEL PROTOTIPO

### Métricas de sesiones de testing (usuarios reales)

**Comprensión del modelo:**
- ≥80% de usuarios entienden qué es una "misión" sin explicación adicional
- ≥70% de usuarios identifican correctamente en qué paso del flujo están en cualquier momento

**Deseo de uso:**
- ≥75% de usuarios prefieren este flujo al flujo actual de Dropi (medido por NPS relativo)
- ≥60% de usuarios dicen que usarían Gali diariamente si estuviera disponible

**Reducción de fricción:**
- El tiempo promedio para pasar de "inicio" a "campaña configurada" en el prototipo < 12 minutos (vs. estimado actual de 45+ minutos)
- Menos del 20% de usuarios piden ayuda o se pierden durante el flujo

**Deseo del modelo Plus:**
- ≥50% de usuarios que llegan al bloque "Plus" hacen clic en "Ver planes"

### Preguntas para el testing cualitativo

1. "¿Entiendes qué hace Gali? ¿Qué crees que haría si le dices [X]?"
2. "¿Cuándo sentiste más confianza en el proceso?"
3. "¿Hubo algún momento en que no supiste qué hacer?"
4. "¿Qué te pareció el canvas de la landing? ¿Lo usarías o preferirías seguir usando el builder actual?"
5. "¿Qué te faltó que esperabas que Gali hiciera?"
6. "Si Dropi Plus cuesta $X al mes, ¿lo pagarías? ¿Por qué?"

---

## APÉNDICE: DATOS MOCK PARA EL PROTOTIPO

### Productos sugeridos por Gali (mock data)

**Producto 1: Collar GPS para perros**
- Costo: $26.000 COP · Precio sugerido: $89.000 COP · Margen: 71%
- Ventas esta semana: 340 (Colombia) · Tendencia: +23%
- Badge: 🔥 Más vendido esta semana

**Producto 2: Organizador de cables magnético**
- Costo: $8.500 COP · Precio sugerido: $29.900 COP · Margen: 72%
- Ventas esta semana: 218 · Tendencia: +8%
- Badge: ⚡ Estable

**Producto 3: Mascarilla LED para rostro**
- Costo: $42.000 COP · Precio sugerido: $149.000 COP · Margen: 72%
- Ventas esta semana: 190 · Tendencia: +41%
- Badge: 📈 Tendencia al alza

**Producto 4: Tapete de acupresión**
- Costo: $18.000 COP · Precio sugerido: $59.000 COP · Margen: 69%
- Ventas esta semana: 167 · Tendencia: -4%
- Badge: (sin badge)

### Estimación de ROAS para el prototipo (función del presupuesto)

```
$20.000/día × 7d = $140.000 → Ventas est.: 3-6 · ROAS: 1.8x-2.8x
$50.000/día × 7d = $350.000 → Ventas est.: 8-15 · ROAS: 2.1x-3.4x
$100.000/día × 7d = $700.000 → Ventas est.: 18-30 · ROAS: 2.3x-3.8x
$200.000/día × 7d = $1.400.000 → Ventas est.: 38-60 · ROAS: 2.5x-4.1x
```

---

*Spec del prototipo — Dropi Orquestador AI-First*
*Versión 1.0 — Mayo 2026*
*Equipo: Producto, Diseño y Tecnología Dropi*
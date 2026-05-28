# Plan Spec: Gali — La IA Total de Dropi
## Del orquestador al cerebro completo del negocio dropshipper

> **Versión:** 1.0 · Mayo 2026  
> **Autora:** Cata Giraldo · catalina.giraldo@dropi.co  
> **Contexto:** Este documento consolida la visión estratégica de Gali como sistema central de Dropi, fortalece la Matriz de Automatización con el rol explícito de Gali en cada proceso, e introduce tres dimensiones nuevas: Sistema de Proyectos, Comunidad de Skills y el modelo Goal-Based de onboarding.  
> **Base:** Propuesta_GaliV4_Workspace_Orquestador · Flujo_Ideal_Dropi_AIFirst · Research Skills IA · feedback prototipo gali-v3

---

## La Visión Central: Todo Dropi Sea Una IA

La pregunta que guía este documento no es "¿cómo le añadimos IA a Dropi?" — esa pregunta ya está resuelta. La pregunta correcta es:

> **¿Qué pasa cuando el dropshipper ya no necesita operar Dropi — porque Gali lo opera por él?**

Esto implica un quiebre radical: Dropi deja de ser una plataforma de herramientas que el usuario navega, y se convierte en un **sistema agéntico que el usuario dirige**. La diferencia es:

- **Plataforma:** el usuario va a Dropi a hacer cosas.
- **Sistema agéntico:** el usuario le dice a Gali qué quiere lograr, y Dropi lo hace.

La interfaz, los módulos, las secciones — todo existe para que Gali tenga contexto y capacidad de ejecución. El usuario solo ve lo que Gali decide mostrarle en ese momento, según lo que está ocurriendo en su negocio.

**El dropshipper del futuro en Dropi no opera. Dirige.**

---

## I. Cómo Conectar Todo el Negocio y Orquestarlo: El Modelo de Orquestación Total

Para que Gali pueda ser el cerebro del negocio, necesita conectividad en tres capas:

### Capa 1 — Los datos de Dropi (ya existe)
Catálogo, pedidos, novedades, wallet, métricas de campañas, historial de transportadoras. Gali ya tiene acceso a esto en el prototipo.

### Capa 2 — Las herramientas externas del dropshipper (MCP Ecosystem)
El dropshipper no vive solo en Dropi. Usa Meta Ads, TikTok, WhatsApp, Google Sheets, Siigo, Shopify. Gali necesita conectarse a estas herramientas mediante MCP Servers para poder leer y actuar en ellas sin que el usuario tenga que salir de Dropi.

```
ECOSISTEMA CONECTADO A GALI
────────────────────────────────────────────────────────────────

[DROPI CORE]          [PUBLICIDAD]        [CONTABILIDAD]
• Catálogo            • Meta Ads MCP      • Siigo MCP
• Pedidos/Novedades   • TikTok Ads MCP    • Google Sheets MCP
• Wallet              • Google Ads MCP
• Transportadoras
                      [CONTENIDO]         [COMUNICACIÓN]
[PROVEEDORES]         • AdCreative.ai MCP • WhatsApp Business MCP
• Stock en tiempo real• HeyGen MCP        • Email MCP
• Precios             • Canva MCP
• Historial calidad
                      [RESEARCH]          [LOGÍSTICA]
                      • Minea/AdSpy MCP   • Coordinadora API
                      • ADA Spy MCP       • Servientrega API
                      • Trends MCP        • Envía/Interrapidísimo
```

### Capa 3 — El cerebro de negocio de Gali (LLM + datos LATAM de Dropi)
Gali no solo conecta herramientas — las interpreta con el contexto específico del dropshipping en LATAM. Sabe qué ROAS es bueno para Colombia, qué transportadora falla en Cali, qué productos están tendiendo esta semana, qué copies han funcionado en nichos similares.

**La ecuación de orquestación total:**
```
Objetivo del usuario (voz/texto)
+ Estado actual del negocio (datos Dropi en tiempo real)
+ Inteligencia LATAM de Gali (LLM entrenado en contexto dropshipping)
+ Herramientas conectadas (MCP Ecosystem)
= Acción ejecutada + resultado visible en el workspace
```

---

## II. Matriz Fortalecida: Automatización IA vs. Intervención Humana + Rol de Gali

Esta es la matriz original enriquecida con tres columnas nuevas: el rol específico de Gali, el nivel de agencia que ejerce, y la señal al usuario.

### BLOQUE 1 — Búsqueda y Selección de Productos

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Búsqueda semántica en catálogo, cruce con tendencias (ADA Spy), alertas de stock-out, sugerencias de productos complementarios |
| **Lo que automatiza Gali (nuevo)** | Propone el producto con el ángulo correcto para el perfil del dropshipper. Cruza historial de ventas propio con tendencias LATAM. Descarta proactivamente productos con alta tasa de devolución en el ecosistema Dropi. Compara márgenes reales (no solo el precio del proveedor — incluye flete, novedad histórica, y pauta estimada) |
| **Intervención humana requerida** | Decisión estratégica de nicho. Validación del "ángulo de venta" (Gali propone, el humano confirma el que resuena con su audiencia). Definición del avatar del cliente |
| **Nivel de agencia de Gali** | Proactiva — Gali no espera que le pregunten. Si detecta que un producto del catálogo del usuario está a punto de agotarse con campaña activa, alerta sin que el usuario la consulte |
| **Señal al usuario** | "📦 Tu proveedor de Collar GPS tiene 12 unidades. Con tu ritmo actual (47 ventas/semana), se agota en 2 días. Tengo 3 alternativas con stock alto y margen similar. ¿Las veo?" |

---

### BLOQUE 2 — Ideación y Creación de Creativos

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Generación de guiones (Hooks, cuerpo, CTA), creación de copies, ensamblaje de landing pages vía Page Builder |
| **Lo que automatiza Gali (nuevo)** | Genera landing completa con el ángulo de venta confirmado por el usuario. Produce 3-5 variaciones de creative (video + imagen) sin salir de Dropi via MCP de AdCreative.ai / HeyGen. Detecta cuál copy ha tenido mejor CTR histórico en productos similares en LATAM y lo usa como base. Propone el formato correcto según la plataforma (video corto para TikTok, carrusel para Meta, texto largo para Google) |
| **Intervención humana requerida** | Definición del dolor del cliente y del avatar (Gali no puede inventar esto sin riesgo de desconexión). Aprobación del ángulo de venta antes de generar el contenido. Revisión final de la landing antes de publicar |
| **Nivel de agencia de Gali** | Generativa + Confirmativa — Gali genera el contenido completo y espera aprobación explícita del usuario antes de publicar. El usuario puede editar directamente en el canvas |
| **Señal al usuario** | "✦ Generé tu landing para el ángulo 'Mamá preocupada' con 4 creatives. Revisa y me dices si publico." [Ver landing] [Editar] [Publicar] |

---

### BLOQUE 3 — Confirmación de Órdenes y Gestión de Riesgo

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Filtros por Huella Digital del cliente. Lectura de historial de devoluciones. Llamadas/Chats IA para cobros anticipados (Chatea Pro). Validación de direcciones |
| **Lo que automatiza Gali (nuevo)** | Confirma automáticamente pedidos de clientes con huella verde y wallet suficiente, sin intervención del usuario. Para clientes con riesgo medio, envía el mensaje de anticipo y gestiona la conversación completa. Si el cliente acepta el anticipo, confirma el pedido sola. Genera reportes semanales de patrón de riesgo: "Esta semana bloqueaste 8 pedidos de alto riesgo. Ahorraste $480.000 en posibles devoluciones" |
| **Intervención humana requerida** | Decisiones atípicas: zonas rurales sin cobertura, clientes con historia ambigua que el dropshipper conoce personalmente, montos inusualmente altos que el dropshipper quiere revisar |
| **Nivel de agencia de Gali** | Autónoma con supervisión — Gali actúa sola en los casos claros (verde/rojo). En los grises, presenta el caso y espera decisión |
| **Señal al usuario** | "⚠️ Pedido #4821 — Juan Pérez, Cali. Historial: 3 pedidos, 2 devueltos. Gali recomienda retener. ¿Confirmo, cancelo, o le pido anticipo?" |

---

### BLOQUE 4 — Logística: Transporte y Direcciones

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Selección de transportadora por métricas regionales. Asignación de dirección exacta desde base de datos |
| **Lo que automatiza Gali (nuevo)** | Smart Routing dinámico: Gali elige la transportadora en tiempo real según la tasa de entrega de esa semana (no solo el histórico). Si Coordinadora tiene 18% de novedad en Medellín esta semana pero Servientrega está en 4%, Gali cambia automáticamente sin que el usuario lo note. Vigila el estado de todos los pedidos activos y actúa si alguno lleva más de 3 días sin movimiento. Detecta patrones de falla por zona geográfica y los reporta proactivamente |
| **Intervención humana requerida** | Direcciones que no existen en ninguna base de datos y requieren referencias visuales del cliente. Pedidos en zonas de conflicto o de acceso restringido donde el dropshipper conoce el contexto local |
| **Nivel de agencia de Gali** | Vigilante permanente — el Vigilante Logístico corre en background 24/7. No necesita que el usuario lo active |
| **Señal al usuario** | "🚛 Cambié 12 pedidos de hoy de Coordinadora a Servientrega. Coordinadora lleva 3 días con 15%+ de novedad en Bogotá. Ahorré 4 novedades estimadas. [Ver detalle]" |

---

### BLOQUE 5 — Gestión de Novedades

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Lectura de motivos de transportadoras. Mensajería automatizada al cliente. Bloqueo de opciones erróneas según el motivo |
| **Lo que automatiza Gali (nuevo)** | Clasifica automáticamente cada novedad por tipo (irreversible / recuperable / cliente / transportadora). Para novedades recuperables, gestiona la resolución completa: contacta al cliente, coordina la reentrega, y cierra el ciclo sin intervención. Identifica falso telemercadeo de transportadoras cruzando la queja del cliente con el registro de la transportadora. Genera un informe semanal de causas raíz: "El 60% de tus novedades esta semana fueron por dirección incompleta. Propongo activar la validación de dirección en el momento del pedido" |
| **Intervención humana requerida** | Disputas donde haya dinero en juego con el proveedor o transportadora. Negociación de quién asume el flete en casos ambiguos. Decisiones de relación comercial (cambiar de proveedor, escalar queja con transportadora) |
| **Nivel de agencia de Gali** | Resolutiva en primeras instancias — Gali resuelve el 70-80% de novedades sola. Solo escala al dropshipper lo que requiere decisión estratégica |
| **Señal al usuario** | "✅ Resolvió 8 novedades hoy. 1 requiere tu decisión: pedido con 'fallecido' reportado por Envía, pero el cliente contactó por WhatsApp hace 2h. ¿Reintento o devolución?" |

---

### BLOQUE 6 — Garantías y Posventa

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Recepción de evidencias (fotos/videos). Clasificación del tipo de garantía. Procesamiento de reposiciones o devoluciones base |
| **Lo que automatiza Gali (nuevo)** | Recibe y analiza las evidencias visuales del cliente (foto/video del producto dañado) y determina automáticamente si aplica garantía según los criterios del proveedor. Si aplica, genera la reposición directamente. Si no aplica, comunica al cliente con el razonamiento y los pasos alternativos. Lleva estadísticas de garantías por producto para alertar al dropshipper si un producto supera el umbral de defectos ("Collar GPS: 4.2% de garantías esta semana. Límite normal: 2%. Revisa con el proveedor") |
| **Intervención humana requerida** | Disputas complejas donde cliente y proveedor tienen versiones contradictorias. Decisiones sobre si ofrecer producto sustituto o devolución de dinero cuando el costo afecta el margen significativamente |
| **Nivel de agencia de Gali** | Autónoma con umbrales — Gali resuelve sola por debajo de cierto monto. Por encima del umbral definido por el dropshipper, siempre pide autorización |
| **Señal al usuario** | "📊 Esta semana: 3 garantías procesadas solas ($48.000 en reposiciones). 1 caso requiere tu aprobación: cliente pide devolución de $120.000 por producto 'no es lo esperado' (sin evidencia de daño). ¿Autorizo o negocio?" |

---

### BLOQUE 7 — Finanzas y Facturación

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza la IA (hoy)** | Sincronización con Siigo. Generación de facturas. Cálculo de utilidad cruzando ROAS, fletes y costos |
| **Lo que automatiza Gali (nuevo)** | P&L en tiempo real por producto y por campaña (no solo el ROAS bruto). Calcula la ganancia neta real descontando costo proveedor, pauta, flete, novedades y garantías. Detecta automáticamente cuándo el ROAS declarado en Meta no coincide con la rentabilidad real y alerta ("Tu ROAS es 2.8x pero tu ganancia neta es 1.3x después de descuentos. El 40% se va en novedades de Cali"). Proyecta el flujo de caja de la próxima semana basado en pedidos activos y tasas históricas de entrega. Sugiere cuándo y cuánto reinvertir en pauta |
| **Intervención humana requerida** | Planeación fiscal y tributaria (declaraciones, regímenes). Decisiones de inversión grandes (escalar a nuevo mercado, contratar equipo). Revisión y firma de cierres contables mensuales |
| **Nivel de agencia de Gali** | Analítica + Alertante — Gali no maneja el dinero, pero lo entiende mejor que cualquier dashboard estático. Avisa proactivamente cuando algo no cuadra |
| **Señal al usuario** | "💰 Semana 21: ganancia neta $411.000 (↓4pts vs semana 20). Causa: novedades de Cali subieron de 4% a 12%. ¿Quiero ver las opciones para reducirlo?" |

---

### BLOQUE 8 — Publicidad y Optimización de Campañas (NUEVO)

Este bloque no existía en la matriz original. Es crítico porque la publicidad es donde se va la mayor parte del capital del dropshipper.

| Dimensión | Detalle |
|---|---|
| **Lo que automatiza Gali (nuevo)** | Monitorea CTR, ROAS, CPA y CPM de todas las campañas activas en tiempo real. Aplica reglas de escalamiento automático: si ROAS ≥ objetivo durante 48h, aumenta presupuesto 15-20%. Si CTR cae > 30%, pausa la campaña y activa el creative alternativo. Detecta la "curva de saturación" de una audiencia antes de que el ROAS colapse. Sugiere nuevos ángulos de creative cuando los actuales llevan más de 14 días. Genera reportes de atribución real (MMM simplificado): qué canal está generando las ventas reales |
| **Intervención humana requerida** | Definición del Target ROAS objetivo y del presupuesto máximo diario (los límites del sistema). Decisión de escalar a nuevos mercados (ej. México, Chile). Aprobación de creatives nuevos antes de que Gali los publique |
| **Nivel de agencia de Gali** | Autónoma dentro de los límites del dropshipper — Gali opera como un media buyer especializado que respeta los parámetros definidos por el usuario |
| **Señal al usuario** | "⚡ Video B de Collar GPS: CTR 1.2% → 1.8% (+50%) después de activarlo. ROAS subió de 2.6x a 2.9x. Aumenté el presupuesto 15% ($57.500 → $66.000/día). [Ver detalle] [Revertir]" |

---

### Resumen Visual de la Matriz: Niveles de Agencia de Gali

```
ESCALA DE AGENCIA DE GALI EN CADA PROCESO
────────────────────────────────────────────────────────────────

PROCESO                          GALI ACTÚA ASÍ
─────────────────────────────────────────────────
Búsqueda de productos            ▓▓▓▓░  Proactiva (alerta y propone)
Creación de creativos            ▓▓▓▓░  Generativa (crea, espera aprobación)
Confirmación de órdenes          ▓▓▓▓▓  Autónoma en casos claros
Logística / Smart Routing        ▓▓▓▓▓  Autónoma con reporte
Gestión de novedades             ▓▓▓░░  Resolutiva en 1ra instancia
Garantías y posventa             ▓▓▓░░  Autónoma con umbrales de monto
Finanzas y P&L                   ▓▓▓░░  Analítica + alertante
Publicidad y campañas            ▓▓▓▓▓  Media buyer autónomo con límites

░░░░░ = Solo alerta
▓░░░░ = Propone
▓▓░░░ = Ejecuta lo que el usuario pide
▓▓▓░░ = Ejecuta con reporte posterior
▓▓▓▓░ = Ejecuta sola, pide confirmación en casos límite
▓▓▓▓▓ = Completamente autónoma dentro de límites definidos
```

---

## III. Sistema de Proyectos: El Hilo Conductor que Dropi No Tiene

### El Problema que Resuelve

Hoy el dropshipper salta entre Productos → Marketing → Órdenes sin un hilo conductor. Una campaña de "Collar GPS" tiene su búsqueda en Catálogo, sus creatives dispersos, su landing en otra pestaña, sus pedidos en Órdenes, y su rendimiento en Campañas. Nunca están juntos. Gali no sabe que todo eso es el mismo negocio.

**Un Proyecto en Dropi es un objeto unificador**: todo lo que pertenece a la misma iniciativa comercial vive en el mismo espacio, y Gali lo entiende como una sola entidad con historia, estado y objetivo.

### Anatomía de un Proyecto

```
┌──────────────────────────────────────────────────────────────────┐
│  📦 PROYECTO: Collar GPS para mascotas                           │
│  Estado: En escala · Semana 3 · Meta: 100 ventas/semana         │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  PRODUCTO          ESTRATEGIA           CREACIÓN                │
│  Collar GPS        Ángulo: Mamá         3 landings activas       │
│  PetStore Colombia preocupada           Video A (ganador ✓)      │
│  Stock: 847 un.    Avatar: 28-40 años   Video B (pausado)        │
│  Precio: $28.500   Canal: Meta + TikTok Banner x4               │
│                                                                  │
│  CAMPAÑAS          PEDIDOS              RENTABILIDAD             │
│  Meta: ROAS 2.9x   Esta semana: 47      Ganancia neta: $411k     │
│  TikTok: en prueba Novedades: 3 (6.4%) ROAS real: 1.93x         │
│  Gasto: $310k/sem  Entregados: 41       Margen: 33%              │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│  GALI DICE: "Tu novedad en Cali está afectando el margen.       │
│  ¿Quiero cambiar a Servientrega en esa ciudad?"                 │
│  [Sí, cambiar] [Ver análisis] [Ignorar]                         │
│                                                                  │
│  [+ Nueva acción] [Ver historial completo] [⌘M Ver en mapa]    │
└──────────────────────────────────────────────────────────────────┘
```

### Cómo se Crea un Proyecto

El proyecto no se crea con un formulario. Se crea con una conversación:

```
Usuario: "Quiero lanzar collar GPS para mascotas"

Gali: "Perfecto. Ya encontré el producto en el catálogo.
       ¿Empezamos ahora o guardamos el proyecto para después?"

[Empezar ahora → Modo Lanzar]
[Guardar para después → Proyecto en borrador]
```

Cuando el usuario dice "Empezar ahora", Gali abre el flujo de misión dentro del proyecto. Todo lo que se crea durante el flujo (landing, creatives, configuración de campaña) queda anclado al proyecto automáticamente.

### Los Estados de un Proyecto

```
Borrador → En desarrollo → Activo → En escala → Pausado → Archivado
   |              |              |           |
  Gali        Gali genera    Gali opera   Gali optimiza
  propone     el contenido   el ciclo     para crecer
```

En cada estado, lo que Gali hace de manera autónoma cambia. En "En desarrollo" es generativa (crea contenido). En "Activo" es operativa (gestiona pedidos y campañas). En "En escala" es optimizadora (ajusta presupuesto, rota creatives, detecta saturación).

### Múltiples Proyectos: El Dashboard del Operador

```
┌──────────────────────────────────────────────────────────────────┐
│  MIS PROYECTOS                              [+ Nuevo proyecto]   │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  ● Collar GPS         En escala  · ROAS 2.9x · 47 pedidos/sem  │
│    Gali: ⚠ Revisar novedad en Cali                             │
│                                                                  │
│  ● Skincare K-Beauty  Activo     · ROAS 2.1x · 23 pedidos/sem  │
│    Gali: ✓ Todo normal                                          │
│                                                                  │
│  ○ Proyector Portátil En pausa   · Pausado hace 5 días          │
│    Gali: 💡 El CTR se recuperó. ¿Reanudamos?                   │
│                                                                  │
│  ○ Reloj Smartwatch   Borrador   · Sin lanzar aún               │
│    Gali: "Llevas 8 días sin avanzar en este. ¿Lo descartamos?" │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│  ESTA SEMANA: 70 pedidos · $411k ganancia neta · 3 proyectos   │
└──────────────────────────────────────────────────────────────────┘
```

---

## IV. Comunidad: Skills Gratuitos del Ecosistema

### La Idea Central

El dropshipper más exitoso de Dropi tiene un conjunto de flujos, recetas y configuraciones que le funcionan. Hoy ese conocimiento muere con él — no se transfiere. La Comunidad de Skills convierte ese conocimiento tácito en activos reutilizables que cualquier dropshipper puede activar con un clic.

Un **Skill de Comunidad** es una receta de Gali empaquetada, nombrada y compartida por otro dropshipper o por el equipo de Dropi.

```
SKILL: "Auto-pausa si CTR < 0.8% en 48h"
Creado por: @JuanDropper · Medellín · 847 ventas/mes
Usado por: 1.247 dropshippers
Rating: ⭐⭐⭐⭐⭐ (4.8)

Descripción: Si tu campaña lleva 48h con CTR menor a 0.8%,
Gali la pausa automáticamente y te notifica con el diagnóstico.
Incluye el mensaje que Gali envía y las opciones de acción.

[Activar en mis proyectos] [Ver cómo funciona] [Clonar y editar]
```

### Tipos de Skills de Comunidad

**Skills de Operación (gratis, siempre)**
- Auto-pausa CTR bajo
- Alerta de stock crítico
- Confirmación automática de pedidos verdes
- Novedad > X% → cambiar transportadora
- Recordatorio de renovar creatives cada 14 días

**Skills de Lanzamiento (gratis, creados por Dropi)**
- "Flujo completo: producto a campaña en 4 horas"
- "Lanza con $50k COP en Meta"
- "Tu primera landing en 30 minutos"

**Skills de Expertos (creados por la comunidad, verificados por Dropi)**
- "Estrategia de scaling vertical de Alejandro Torres" (1.200 ventas/mes)
- "P&L simplificado para declarar en Dropi" — por contador de la comunidad
- "Bundle de nicho mascotas: los 5 productos que venden juntos"

**Skills Premium (Dropi AI Plus)**
- Skills con IA generativa integrada (generar creatives automáticamente)
- Skills con MCP externos (conectar directamente con Meta/TikTok)
- Skills personalizados por Gali según el historial del usuario

### El Marketplace de Skills

```
┌──────────────────────────────────────────────────────────────────┐
│  🌐 COMUNIDAD — Skills de la Comunidad                          │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  [🔥 Populares] [⭐ Mejor valorados] [🆕 Nuevos] [Mi nicho]    │
│                                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │ Auto-pausa CTR          │  │ P&L Real vs ROAS        │       │
│  │ ⭐ 4.9 · 3.4k usuarios  │  │ ⭐ 4.8 · 1.2k usuarios  │       │
│  │ Por: Dropi Team         │  │ Por: @DropiPro_Alex      │       │
│  │ Operación · Gratis      │  │ Finanzas · Gratis        │       │
│  │ [Activar]               │  │ [Activar]               │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
│                                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │ Scaling Vertical Meta   │  │ Bundle Mascotas x5      │       │
│  │ ⭐ 4.7 · 892 usuarios   │  │ ⭐ 4.6 · 2.1k usuarios  │       │
│  │ Por: @MarinaDrops       │  │ Por: @PetDropCO         │       │
│  │ Publicidad · Gratis     │  │ Producto · Gratis        │       │
│  │ [Activar]               │  │ [Ver bundle]            │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│  ¿Tienes un skill que funciona? [Compartir mi receta →]         │
└──────────────────────────────────────────────────────────────────┘
```

### Incentivos para Contribuir a la Comunidad

El dropshipper que comparte un skill recibe:
- Badge de "Contribuidor" visible en su perfil
- Acceso anticipado a features de Dropi AI Plus
- Si su skill supera 500 activaciones: mención en newsletter de Dropi + caso de éxito
- (Futuro): porcentaje de suscripciones si el skill se convierte en Premium

---

## V. Goal-Based: "Dime Tu Objetivo, Te Doy el Camino"

### El Paradigma

El onboarding tradicional enseña la plataforma. El onboarding goal-based entiende el objetivo del usuario y construye un camino personalizado para llegar a él.

**La pregunta de entrada no es "¿Qué quieres hacer hoy?" — es "¿Qué quieres lograr este mes?"**

### El Momento de la Declaración de Objetivos

En el primer acceso (o cuando el usuario lo active), Gali hace UNA pregunta:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ✦ Hola [Nombre]. Soy Gali.                                    │
│                                                                  │
│   Antes de mostrarte Dropi, necesito saber una cosa:            │
│                                                                  │
│   ¿Cuál es tu objetivo para los próximos 30 días?               │
│                                                                  │
│   ○  Hacer mi primera venta                                      │
│   ○  Llegar a 50 ventas por semana                              │
│   ○  Pasar de 50 a 200 ventas por semana                        │
│   ○  Quiero contarte más sobre lo que necesito...  ← texto libre│
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

Según la respuesta, el workspace de Dropi se configura completamente diferente. No es solo un onboarding — es una interfaz adaptativa.

### Los Caminos según el Objetivo

**Si el objetivo es "Primera venta":**

```
GALI CONSTRUYE ESTE CAMINO
──────────────────────────────────────────────────────────────────

DÍA 1  → "Elige tu producto ganador" (Modo Descubrimiento guiado)
          Gali propone 3 productos validados para primeros pasos
          en Colombia. El usuario elige uno.

DÍA 2  → "Define a quién le vas a vender" (Modo Estrategia)
          Gali presenta 2 avatares predefinidos del producto elegido.
          El usuario confirma el que más le resuena.

DÍA 3  → "Tu landing en 30 minutos" (Modo Creación)
          Gali genera la landing con el ángulo confirmado.
          El usuario revisa y aprueba.

DÍA 4  → "Tu primera campaña con $50.000 COP" (Modo Lanzamiento)
          Gali pre-llena todo. El usuario solo define el presupuesto.

DÍA 7  → "Tus primeros resultados" (Check-in automático)
          Gali analiza las métricas y presenta el diagnóstico.
          Si hubo ventas: celebra y propone escalar.
          Si no: diagnostica y propone cambiar el creative.

CONTEXTO: "1.847 dropshippers con tu perfil lograron su primera
venta en promedio en 5.3 días con este proceso."
```

**Si el objetivo es "50 ventas/semana":**

```
GALI CONSTRUYE ESTE CAMINO
──────────────────────────────────────────────────────────────────

SEMANA 1 → Auditoría del estado actual
           Gali revisa el historial del usuario:
           - ¿Qué productos ha vendido?
           - ¿Cuál tiene mejor ROAS real?
           - ¿Dónde se están yendo las ventas perdidas (novedades)?

SEMANA 2 → Optimización del producto que ya funciona
           Gali propone: nuevo creative, nuevo ángulo, o nueva zona.
           El usuario elige la apuesta.

SEMANA 3 → Activación del vigilante logístico + ajuste de pauta
           Gali configura las recetas de optimización automática
           para que el dropshipper no tenga que monitorear a diario.

SEMANA 4 → Evaluación y decisión de siguiente nivel
           ¿Llegó a 50? → Gali propone el camino a 100.
           ¿No llegó? → Gali diagnóstical as causas y recalibra.

CONTEXTO: "Con tu historial actual (23 ventas/semana),
Dropi estima que puedes llegar a 50 en 3-4 semanas
optimizando primero las novedades de Cali."
```

**Si el objetivo es texto libre (ej: "Quiero vender más en Navidad"):**

```
Gali: "Navidad es en 28 días. Para que eso funcione,
       necesitas tener tu campaña corriendo mínimo 14 días antes
       para que Meta optimice bien.

       Tienes 14 días para elegir el producto, crear el creative
       y lanzar. ¿Empezamos hoy o mañana?"

[Empezar ahora] [Empezar mañana a las 9am]
```

### El Dashboard del Objetivo: Seguimiento en Tiempo Real

Una vez declarado el objetivo, el sidebar siempre muestra el progreso hacia él:

```
┌─────────────────────────────┐
│  🎯 MI OBJETIVO             │
│  50 ventas/semana           │
│  ───────────────────────   │
│  Semana 3 de 4              │
│  ████████████░░  38/50     │
│                             │
│  Gali dice:                 │
│  "Vas a 38. Para llegar     │
│   a 50 necesitas 12 más     │
│   en los próximos 2 días.  │
│   Aumenté el presupuesto    │
│   15% para ayudarte."      │
│  [Ver plan] [Cambiar meta]  │
└─────────────────────────────┘
```

---

## VI. Arquitectura de Gali: Cómo Todo Se Conecta

### Los 5 Modos del Workspace (revisados con los nuevos pilares)

| Modo | Qué hace el usuario | Qué hace Gali | Skills disponibles |
|---|---|---|---|
| **⚡ Operar** | Gestión diaria: pedidos, novedades, wallet | Vigila logística, resuelve novedades, confirma órdenes. Muestra el estado de todos los proyectos activos | Skills de operación (auto-pausa, alertas, confirmación) |
| **🚀 Lanzar** | Nuevo producto/campaña (flujo misión) | Guía el flujo completo: producto → avatar → landing → campaña. Pre-llena todo lo que puede | Skills de lanzamiento (flujo 4 horas, primera venta) |
| **📊 Medir** | Analítica y rentabilidad | Muestra P&L real por proyecto. Detecta dónde se van las ganancias. Propone optimizaciones basadas en datos | Skills de análisis (P&L, ROAS real, MMM simplificado) |
| **🔧 Construir** | Crear y personalizar recetas | Genera recetas por chat. El usuario revisa el canvas visual antes de activar | Skills de automatización + constructor de skills propios |
| **🌐 Comunidad** | Aprender del ecosistema | Recomienda los skills más relevantes según el perfil y objetivo del usuario | Marketplace de skills de la comunidad |

### El Grafo de Negocio: Cómo Gali Ve el Negocio del Dropshipper

Gali no ve secciones separadas — ve un grafo de entidades conectadas. Cada entidad tiene estado, historia y relaciones.

```
                    [OBJETIVO ACTIVO]
                    50 ventas/semana
                          |
              ┌───────────┴───────────┐
              |                       |
         [PROYECTO]              [PROYECTO]
         Collar GPS              Skincare K-Beauty
        ROAS 2.9x ✅            ROAS 2.1x ✅
              |                       |
    ┌─────────┼─────────┐      ┌──────┼──────┐
    |         |         |      |             |
[Campaña] [Pedidos] [Proveedor] [Campaña]  [Pedidos]
 Meta Ads   47/sem  PetStore     Meta Ads   23/sem
 ⚡ Activa  ⚠ Cali   Stock 847   ⚡ Activa   ✅ OK
    |         |
 [Creative] [Logística]
 Video B ✓  Coordinadora
            ⚠ 12% novedad
```

Los nodos rojos o amarillos son lo primero que Gali muestra al usuario cuando entra. No tiene que buscar los problemas — Gali los trae.

### El Loop de Acción Cerrada (el principio más importante)

Todo lo que Gali hace tiene un ciclo completo: señal → acción → resultado visible → siguiente paso propuesto.

```
SEÑAL
"⚡ CTR cayó 40% en Collar GPS"
        ↓
ACCIÓN
"Gali pausó Video A y activó Video B [hace 2h]"
        ↓
RESULTADO
"CTR: 1.2% → 1.8% (+50%) · ROAS: 2.6x → 2.9x"
        ↓
SIGUIENTE PASO
"Video B funciona mejor. ¿Creo una receta para que Gali
 haga esto automáticamente la próxima vez?"
[Crear receta] [No gracias]
```

Sin loop cerrado, el usuario no aprende, no confía en Gali, y no delega más. El loop cerrado es lo que construye la confianza progresiva.

---

## VII. Plan de Implementación: De Aquí a Gali como IA Total

### Fase 0 — Bases (ya en prototipo gali-v3)
- ✅ Chat de Gali funcionando
- ✅ Módulos de pedidos, novedades, campañas
- ✅ Sistema básico de proyectos
- ✅ Command palette (⌘K)

### Fase 1 — El Orquestador Visible (Sprint 1-2, ~1 mes)

Objetivo: El usuario puede VER a Gali actuando, no solo conversando.

- Panel multi-agente con estado visible (Gali está haciendo esto ahora)
- Loop cerrado en señales (antes → acción → resultado → propuesta)
- Renombramiento: Builder → Recetas, Bloques → Vistas
- Vigilante Logístico (espejo del anti-baneo)
- P&L simplificado por proyecto (5 líneas que muestran ganancia neta real)

### Fase 2 — Sistema de Proyectos y Goal-Based (Sprint 3-4, ~1 mes)

Objetivo: El usuario organiza todo su negocio en proyectos. Gali entiende el objetivo.

- Proyectos como objeto central: producto + estrategia + creative + campañas + pedidos en un solo espacio
- Declaración de objetivos en el primer login (onboarding goal-based)
- Dashboard del objetivo en el sidebar (progreso en tiempo real)
- Caminos predefinidos según el objetivo (primera venta / escalar / optimizar)

### Fase 3 — Conexiones Externas y Autonomía Real (Sprint 5-6, ~2 meses)

Objetivo: Gali puede actuar en herramientas externas sin que el usuario salga de Dropi.

- MCP Meta Ads: Gali puede ver métricas y pausar/escalar campañas
- MCP Siigo: facturación automática al estado "entregado"
- MCP WhatsApp Business: Gali gestiona la conversación de novedades con el cliente
- Smart Routing de transportadoras en tiempo real
- Confirmación automática de órdenes verdes

### Fase 4 — Comunidad y Economía de Skills (Sprint 7-8, ~2 meses)

Objetivo: El conocimiento del ecosistema Dropi se vuelve un activo compartido.

- Marketplace de Skills de la Comunidad
- Publicación de skills desde el constructor de Recetas
- Skills verificados por Dropi (badge oficial)
- Skills premium (Dropi AI Plus)
- Sistema de reputación de contribuidores

### Fase 5 — Gali como IA Total (continuo)

Objetivo: El dropshipper no opera Dropi. Gali opera Dropi por él.

- Modo "Dropi en autopiloto": el usuario define objetivos y límites, Gali maneja el resto
- Agentes especializados paralelos (Gali Logística, Gali Creatives, Gali Finanzas) corriendo simultáneamente
- Reportes diarios automáticos sin que el usuario los pida
- Integración con todos los MCP del ecosistema de herramientas del dropshipper
- Gali puede negociar con proveedores (precio, stock) en nombre del dropshipper

---

## VIII. Lo que Gali Nunca Hará (Los Límites Inamovibles)

Para que el dropshipper confíe en Gali, necesita saber qué está fuera de su alcance. Gali nunca:

- **Mueve dinero sin aprobación explícita.** Ninguna transacción financiera ocurre sin un clic del dropshipper.
- **Cancela una campaña por completo sin avisar.** Puede pausarla temporalmente, pero nunca la elimina.
- **Toma decisiones de nicho o de mercado.** Puede proponer, pero la dirección estratégica del negocio es siempre del humano.
- **Comparte datos del negocio del dropshipper** con otros usuarios sin consentimiento explícito.
- **Actúa en áreas donde no tiene contexto suficiente.** Gali prefiere preguntar a adivinar cuando el riesgo de error es alto.

---

## IX. Métricas de Éxito del Modelo

Para saber si este sistema está funcionando, medimos:

| Métrica | Qué mide | Meta 6 meses |
|---|---|---|
| % de acciones iniciadas por Gali (no por el usuario) | Nivel de agencia real de Gali | > 40% |
| Loop cerrado: % de señales con resultado visible | Confianza en las acciones de Gali | > 80% |
| Adopción de Proyectos | % usuarios con al menos 1 proyecto activo | > 60% |
| Activación de Skills de Comunidad | Skills activados por usuario activo | > 2 skills |
| Goal-based completion rate | % usuarios que completan su objetivo declarado en 30 días | > 25% |
| Retención a 90 días (usuarios con Gali activa vs sin) | Valor del orquestador para la retención | > 20pp de diferencia |

---

## X. Resumen: La Transformación en 5 Puntos

| Antes | Después |
|---|---|
| El dropshipper navega pantallas y herramientas | El dropshipper declara objetivos, Gali arma el camino |
| Los datos de pedidos, campañas y finanzas viven separados | Todo el negocio vive en Proyectos que Gali entiende como una sola entidad |
| Gali responde cuando le preguntan | Gali actúa proactivamente y reporta con resultados medibles |
| El conocimiento exitoso muere con cada dropshipper | El conocimiento se empaqueta en Skills que la Comunidad activa con un clic |
| Dropi es una plataforma de herramientas | Dropi es el sistema operativo del negocio dropshipper, con Gali como CEO virtual |

---

*Plan Spec Gali — IA Total de Dropi · Mayo 2026*  
*Cata Giraldo · catalina.giraldo@dropi.co*  
*Siguiente paso: revisar con el equipo de producto y definir el orden de Fase 1 para prototipar*
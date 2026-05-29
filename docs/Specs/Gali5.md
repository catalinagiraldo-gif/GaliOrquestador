# Gali v5 — Spec de Producto e Ingeniería
## Dropi AI Orchestrator para Dropshippers LATAM · Mayo 2026

> **Versión:** 5.1 · Cata Giraldo · Deep Reconstruction (Mayo 2026)  
> **Stack:** Angular 17.3 Standalone · SCSS · PrimeNG 17 · Mock API interceptor  
> **Rutas base:** `/gali-v5/*` — `src/app/pages/gali-v5/`  
> **Mock data:** `mocks/gali-v5/` (skills, PQR, problem-network, cas-tickets, etc.) + `mocks/gali-v3/` (proyectos, signals legacy)  
> **Plan de reconstrucción:** `/Users/user/.cursor/plans/gali_v5_deep_reconstruction_3b6bb392.plan.md`

---

## 1. Visión: Gali como Sistema Operativo del Dropshipper

### El quiebre conceptual

Dropi ha sido, hasta hoy, una plataforma que el usuario navega. El dropshipper entra, hace clic en un menú, encuentra una herramienta, la usa, sale, y tiene que volver a entrar a otra sección para hacer la siguiente tarea. La inteligencia está repartida en el usuario — él conecta los puntos, él decide qué hace primero, él diagnostica por qué las ventas bajaron.

Gali v5 invierte esa ecuación.

En v5, Gali no es un chatbot flotante ni un panel lateral de sugerencias. Gali es el motor que orquesta el negocio del dropshipper: sabe en qué etapa está, qué ha logrado, qué le falta, y dispara las acciones necesarias — sea notificando, proponiendo, o ejecutando directamente — sin que el usuario tenga que adivinar qué paso viene.

**La premisa del AlcancesIADropi.md:**

```
Dropi no tiene pantallas. Dropi tiene misiones.
Gali no es un chatbot. Gali es el motor que decide qué ves,
qué herramienta necesitas y qué debes lograr a continuación.
```

### De plataforma a sistema operativo

| Modelo anterior | Modelo Gali v5 |
|---|---|
| El usuario navega menús | Gali propone el siguiente paso |
| El usuario diagnostica problemas | Gali cruza datos y diagnostica |
| Las herramientas son aisladas | Los agentes operan en paralelo sobre un objetivo |
| Las decisiones son del usuario sin contexto | Las decisiones son del usuario con benchmark LATAM |
| El éxito depende del conocimiento del dropshipper | El éxito se apoya en 150k+ casos del ecosistema Dropi |

### La ecuación

```
Intención del usuario (voz/texto/clic)
+ Inteligencia de Gali (LLM + datos LATAM Dropi)
+ Agentes especializados (ADA Spy + Roax + Chatea Pro + Vigilante + Financiero)
+ Herramientas conectadas (Meta Ads API, WhatsApp Biz, transportadoras)
= Resultado materializado con loop cerrado visible
```

Gali v5 no reemplaza al dropshipper. Le amplifica la capacidad. Las decisiones estratégicas siempre son humanas. La ejecución operativa y el diagnóstico proactivo son de Gali.

---

## 2. Los 4 Pilares Arquitectónicos

### Pilar 1 — Orquestación de Agentes

Gali es el manager. Cuando el dropshipper lanza un **Proyecto** (ej. "Lanzamiento Collar GPS"), Gali no ejecuta todo solo — coordina a tres agentes especializados que operan simultáneamente sobre distintas dimensiones del negocio.

#### El modelo de Proyecto

Un Proyecto en Gali v5 es la unidad de trabajo. Contiene:
- Un producto elegido
- Un objetivo medible (ej. "50 ventas semanales con ROAS 3x")
- Un pipeline de etapas (Producto → Landing → Creatives → Campaña → ROAS → Escala)
- Tres agentes coordinados, cada uno con su dominio

#### Los tres agentes especializados

**Agente de Producto — ADA Spy**

ADA Spy evalúa la viabilidad comercial de un producto antes de invertir en publicidad y monitorea la competencia de forma continua.

- Analiza rentabilidad real: costo del producto, precio de venta promedio en Dropi, margen neto después de logística y comisiones
- Evalúa saturación del mercado: cuántos dropshippers en Colombia/LATAM están vendiendo el mismo producto actualmente
- Detecta ventana de oportunidad: tiempo estimado antes de que el nicho se sature (basado en curva histórica de productos similares)
- Vigila a la competencia: si un competidor lanza el mismo producto con mejor precio o ángulo, ADA Spy notifica
- Sugiere el ángulo de venta óptimo: qué angle del producto convierte mejor según datos históricos Dropi (ej. "seguridad emocional" vs "funcionalidad técnica")

*Fuentes de datos:* catálogo Dropi, datos de ventas LATAM agregados, precios de proveedores, historial de saturación de nichos

**Agente de Marketing — Roax**

Roax configura, monitorea y optimiza campañas de pago. Nunca las apaga completamente sin aprobación humana.

- Configura campañas Meta Ads y TikTok Ads con los parámetros validados del proyecto (audiencia, presupuesto inicial, creative seleccionado)
- Monitorea CPA, ROAS, CTR y frecuencia en tiempo real
- Auto-escala presupuesto cuando el ROAS supera el umbral definido por el usuario (ej. "si ROAS > 2.5x por 48h consecutivas, escalar 20%")
- Pausa creatives con bajo rendimiento y activa los alternativos del set
- Detecta señales de restricción de cuenta (patrón de caída de CTR >35% en 6h = 67% probabilidad de restricción)
- Propone nuevos creatives basados en ángulos que funcionan en la comunidad

*Fuentes de datos:* Meta Ads API, TikTok Ads API, datos de campañas similares en Dropi LATAM

**Agente de Cierre y Logística — Chatea Pro**

Chatea Pro gestiona el contacto post-clic con el comprador, desde la confirmación del pedido hasta la resolución de novedades logísticas.

- Confirma pedidos por WhatsApp con el mensaje exacto configurado por el dropshipper
- Recupera carritos abandonados con secuencias personalizadas (cadencia, tono, urgencia según la regla definida)
- Gestiona novedades logísticas: notifica al comprador cuando hay dirección incorrecta, intento fallido, o paquete devuelto
- Escala a decisión humana cuando la novedad requiere negociación o reembolso
- Propone scripts de cierre basados en los que mejor convierten en el mismo nicho
- Activa flujos de recompra para compradores entregados con buen historial

*Fuentes de datos:* WhatsApp Business API, estado de pedidos Dropi, historial de novedades, scripts comunitarios

#### Cómo Gali coordina a los tres

Cuando el usuario aprueba lanzar un Proyecto:

```
Gali Manager
├── ADA Spy → "¿El producto tiene margen suficiente y ventana de oportunidad?"
│   └── Output: margen validado, ángulo sugerido, días estimados antes de saturación
├── Roax → "Configura campaña con este ángulo, este presupuesto, este creative"
│   └── Output: campaña activa, ROAS objetivo definido, umbral de auto-escala configurado
└── Chatea Pro → "Activa confirmación WhatsApp para pedidos de este producto"
    └── Output: flujo activo, script personalizado, umbral de escalación definido
```

Gali Manager no ejecuta nada directamente — propone, espera aprobación, y delega. Registra cada decisión en la memoria del proyecto para que el loop sea auditable.

---

### Pilar 2 — Sistema de Skills y Rules (Hiperpersonalización)

Cada dropshipper tiene su estilo, su umbral de riesgo, sus reglas de negocio. El sistema de Skills y Rules permite que el dropshipper defina exactamente cómo quiere que operen sus agentes.

#### Tipos de reglas

**Reglas de tono y comunicación** (para Chatea Pro)
- Qué emoji usar o no usar en mensajes de WhatsApp
- Si confirmar con voz formal o informal
- Qué responder si el cliente pregunta por precio después de comprar

**Reglas de umbral** (para todos los agentes)
- "Si novedad logística > 5 días sin resolución, escalarme con resumen"
- "Si ROAS < 1.5x por 12h, pausar campaña y notificarme"
- "Si CTR cae >30% en 6h, cambiar creative automáticamente"

**Reglas de protección estricta** (no negociables)
- "Si zona rural o municipio sin cobertura validada, requerir siempre pago anticipado antes de despachar"
- "Nunca ofrecer descuento por encima del 10% sin mi aprobación explícita"
- "Si el pedido viene de este número de teléfono, no confirmar — está en lista negra"

**Reglas de escala automática** (para Roax)
- "Si ROAS > 3x por 72h, escalar presupuesto 25% sin pedir permiso"
- "Si el producto llega a 50 ventas en una semana, abrir segunda ciudad automáticamente"

#### Marketplace de Skills de la Comunidad

> **Actualización v5.1:** El Marketplace ya no vive en `/gali-v5/marketplace` aislado. Se unificó en **`/gali-v5/skills` tab 3** junto con Mis Skills y el wizard Crear. La ruta `/marketplace` redirige a `/skills?tab=marketplace`.

Las skills de la comunidad son reglas If/Then que otros dropshippers han creado y compartido. Gali las adapta al contexto del usuario al instalarlas (ROAS actual, nichos, transportadoras activas).

Los dropshippers más experimentados pueden compartir sus recetas de reglas como Skills en el Marketplace. El modelo tiene tres capas:

- **Skills gratuitas:** publicadas por la comunidad, probadas y etiquetadas por nivel
- **Skills de expertos verificados:** los top performers de Dropi comparten sus reglas de oro; identificados con badge verificado
- **Skills premium:** paquetes completos de un experto (reglas + creatives + ángulos) disponibles por suscripción o pago único

El sistema de incentivos para contribuir: cada vez que un skill tuyo es usado por otro dropshipper y genera resultados positivos (ROAS > objetivo), recibes puntos de reputación en Dropi. Los 10 contribuidores del mes aparecen en el leaderboard del Marketplace.

**Privacidad:** los Skills no exponen datos individuales. Cuando se comparte una receta, Dropi anonimiza todos los valores específicos (presupuestos, productos, teléfonos) y solo comparte la estructura lógica If/Then.

---

### Pilar 3 — Soporte a la Toma de Decisiones (Diagnóstico Cross-Data)

Este es el diferenciador más fuerte de Gali frente a cualquier herramienta de automatización. No se trata solo de ejecutar reglas — se trata de entender por qué el negocio se comporta como se comporta.

#### El problema que resuelve

Cuando el ROAS de una campaña baja, el dropshipper hoy tiene que revisar manualmente: ¿Es la audiencia saturada? ¿Es el creative que se quemó? ¿Es que la competencia bajó precio? ¿Es un problema logístico que genera reseñas negativas? ¿Es la landing page? ¿Es que el pixel tiene datos viejos?

Gali v5 hace ese diagnóstico cruzando datos de todos los frentes.

#### Ejemplo real: diagnóstico de caída de ROAS

```
SEÑAL: ROAS Collar GPS cayó de 2.8x a 1.9x en 48h

Gali cruza:
├── Meta Ads API → CTR estable, CPM subió 18% (señal: más competidores en subasta)
├── Dropi LATAM → 3 nuevos dropshippers vendiendo Collar GPS en Bogotá esta semana
├── ADA Spy → Precio promedio mercado bajó $8k (competidor agresivo detectado)
└── Chatea Pro → Tasa de cierre confirmación WhatsApp cayó 12% (posible fricción de precio)

Diagnóstico de Gali:
"La caída no es de tu campaña — es de mercado. Hay presión competitiva de precio.
Tu creative sigue siendo el mejor (CTR estable), pero el CPM subió porque hay
más anunciantes. Opciones:
  A) Mover a público más amplio (menor competencia directa)
  B) Bajar precio $5k para mantener conversión
  C) Cambiar ángulo a diferenciación (garantía, envío gratis) para salir de guerra de precios"
```

#### Principio: no reemplaza al humano, informa su decisión

Gali siempre termina con opciones concretas y su impacto estimado, pero la decisión final es del dropshipper. El sistema no ejecuta ninguna opción sin aprobación.

---

### Pilar 4 — Marketplace de Agentes/Skills (Futuro Q3 2026)

La evolución natural del sistema de Skills es un ecosistema donde los agentes se vuelven activos de negocio.

#### Concepto

Un dropshipper con 2 años de experiencia en el nicho de mascotas puede empaquetar todo su conocimiento — reglas de producto, ángulos de campaña, scripts de WhatsApp, umbrales de ROAS — en un Agente personalizado y publicarlo en el Marketplace.

Otro dropshipper que quiere entrar al nicho de mascotas puede "contratar" ese agente por $30k COP/mes. Recibe toda la inteligencia del experto sin tener que construirla desde cero.

#### Modelo de monetización

- El creador del agente recibe el 70% de los ingresos de suscripción
- Dropi retiene el 30% por plataforma, soporte y garantía de calidad
- Rating y reviews del marketplace mantienen la calidad

#### Salvaguardas

- Los agentes del marketplace son instancias independientes por usuario — nunca comparten datos entre compradores
- Todo agente marketplace tiene un período de prueba de 7 días con métricas visibles antes de cobrar
- El comprador puede "desactivar" el agente en cualquier momento

---

## 3. Arquitectura de Modos de Operación

Gali v5 opera en tres modos distintos. El modo no lo define Gali — lo define el nivel de confianza y delegación que el dropshipper ha configurado.

### Mode 0 — Dropi Normal (Gali Silencioso)

**Activación:** estado por defecto para usuarios nuevos o que no han activado Gali

**Lo que ve el usuario:**
- FAB de Gali en esquina inferior derecha, con pulso suave
- Badge contador en el FAB mostrando señales pendientes (ej. "3")
- La interfaz de Dropi opera como siempre — no hay intervención visual de Gali

**Lo que hace Gali en segundo plano:**
- Monitorea las señales (ROAS, novedades, patrones de riesgo)
- Acumula diagnósticos pero no los muestra
- Prepara el contexto para cuando el usuario entre a Mode 1

**Propósito:** no generar ruido para usuarios que no han dado permiso. El FAB pulsando con badge es el único indicador de que hay algo que atender.

---

### Mode 1 — Gali Activo (Recomendaciones visibles)

**Activación:** usuario hace clic en el FAB, o entra al Gali Hub en el menú lateral

**Lo que ve el usuario:**
- Panel derecho deslizable con las señales activas clasificadas por urgencia
- En la topbar aparecen chips de contexto (ej. "⚡ ROAS 2.8x · Collar GPS" o "⚠️ 1 novedad crítica")
- En las tarjetas de módulos del dashboard aparece el icono ✦ junto a los ítems donde Gali tiene contexto adicional
- El Gali Hub muestra: señales, agentes activos, loop de resultados, proyectos en curso

**Lo que hace Gali:**
- Presenta señales con razonamiento visible ("detecté esto porque...")
- Propone acciones específicas con CTA claro ("Escalar a $160k/día")
- Espera aprobación antes de ejecutar cualquier acción
- Registra cada ejecución en el loop cerrado para que sea auditable

**Propósito:** el usuario tiene contexto y control. Ve las señales, entiende el razonamiento, decide si ejecuta.

---

### Mode 2 — Dropi Autopiloto (Gali con delegación extendida)

**Activación:** usuario configura explícitamente qué reglas Gali puede ejecutar sin consultar

**Lo que ve el usuario:**
- Dashboard simplificado con resultados: "Gali ejecutó 4 acciones hoy. Resultado: +$340k en ventas estimadas"
- Centro de comando solo para decisiones estratégicas que Gali escala
- Historial completo de todo lo que Gali hizo y por qué

**Lo que hace Gali:**
- Ejecuta autónomamente dentro de los límites definidos por las Rules del usuario
- Escala únicamente las decisiones que el usuario marcó como "siempre consultar" (ej. subir presupuesto > $200k/día, cambiar precio, cancelar pedidos en bloque)
- Genera informe diario de actuaciones

**Propósito:** el dropshipper que ya confía en Gali puede delegar la operativa diaria y enfocarse en estrategia.

---

## 4. MATRIZ DE AUTOMATIZACIÓN — El núcleo del documento

> Esta matriz cubre todos los módulos de Dropi para el rol **dropshipper**. Para cada proceso define: qué automatiza Gali, qué requiere intervención humana, el nivel de agencia, y el estado en gali-v5.

### Leyenda de Nivel de Agencia

| Nivel | Significado |
|---|---|
| **Proactivo** | Gali detecta y notifica, el humano decide y ejecuta |
| **Generativo** | Gali genera contenido/propuesta, el humano aprueba o edita |
| **Asistido** | Gali ejecuta con un clic de confirmación del humano |
| **Autónomo limitado** | Gali ejecuta dentro de reglas preconfiguradas sin consultar |
| **Vigilante permanente** | Gali monitorea en continuo y solo interrumpe ante anomalía |

---

### Módulo 1 — Catálogo / Búsqueda de Productos

**Agente responsable:** ADA Spy

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Búsqueda de producto ganador | ADA Spy filtra catálogo por margen > umbral, volumen de ventas LATAM, y saturación baja. Ordena por score compuesto. | Elegir el producto final. Definir el ángulo de venta. | Proactivo | Implementado (`pages/catalog/catalog-page.component.ts`) |
| Análisis de competencia | ADA Spy detecta cuántos dropshippers activos venden el mismo SKU en la misma región | Decidir si competir o cambiar nicho | Proactivo | Pendiente (UI existe, lógica pendiente) |
| Análisis de margen real | Calcula margen neto considerando costo + comisión Dropi + costo de logística promedio por ciudad destino | Aprobar el precio de venta sugerido | Proactivo | Implementado |
| Alertas de saturación de nicho | Notifica cuando el número de vendedores de un producto supera el umbral histórico de rentabilidad | Decidir si salir del nicho o diferenciarse | Vigilante permanente | Pendiente |
| Detección de ventana de oportunidad | Detecta productos con curva de crecimiento < 3 semanas de la cúspide y estima días antes de saturación | Decidir si entrar | Proactivo | Pendiente |

---

### Módulo 2 — Caza Productos

**Agente responsable:** ADA Spy

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Escaneo de tendencias LATAM | ADA Spy cruza datos de ventas Dropi + señales de mercado externo para detectar productos en alza en las últimas 72h | Validar si el producto encaja con el perfil del dropshipper | Proactivo | Implementado (`pages/caza-productos/caza-page.component.ts`) |
| Match con perfil del dropshipper | Filtra tendencias por afinidad con nichos históricos del dropshipper (basado en qué ha vendido o favoriteado) | Aprobación final del producto | Proactivo | Pendiente |
| Score de viabilidad | Calcula score 0-100 combinando: margen, saturación, competencia, tendencia, historial de éxito en Dropi | Interpretar el score y decidir si asumir el riesgo | Generativo | Implementado (parcial) |
| Guardado y seguimiento | Si el dropshipper favorita un producto, ADA Spy lo sigue automáticamente y notifica si el score cambia significativamente | — | Autónomo limitado | Pendiente |

---

### Módulo 3 — Mis Pedidos / Órdenes

**Agente responsable:** Chatea Pro

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Confirmación de pedidos por WhatsApp | Chatea Pro envía mensaje de confirmación al comprador según el script configurado, dentro del tiempo límite definido | Revisar pedidos antes de despachar (validación final) | Autónomo limitado | Implementado (`pages/orders/orders-page.component.ts`) |
| Priorización de pedidos urgentes | Clasifica automáticamente pedidos por ventana de confirmación (ej. >6h sin confirmar = urgente) y los surfacea al tope | — | Autónomo limitado | Implementado |
| Detección de pedidos duplicados | Detecta pedidos del mismo teléfono o dirección en < 24h y alerta antes de despachar | Decidir si confirmar o cancelar el duplicado | Proactivo | Pendiente |
| Recuperación de carritos abandonados | Chatea Pro activa secuencia automática de recuperación (cadencia, tono, límite de intentos) según reglas configuradas | Aprobar el script inicial y la cadencia | Asistido | Pendiente |
| Cierre de órdenes batch | Procesa confirmaciones masivas en bloque cuando todos los pedidos cumplen los criterios de validación automática | Aprobar el lote o revisar individualmente los flagueados | Asistido | Pendiente |

---

### Módulo 4 — Novedades Logísticas

**Agente responsable:** Chatea Pro + Vigilante Logístico

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Clasificación de novedades por tipo | Vigilante Logístico clasifica novedades en: dirección incorrecta / intento fallido / paquete devuelto / cliente ausente | — | Autónomo limitado | Implementado (`pages/novedades/novedades-page.component.ts`) |
| Contacto al comprador por novedad | Chatea Pro envía mensaje automático notificando la novedad y solicitando corrección de datos según el tipo | Intervenir si el comprador no responde o pide reembolso | Autónomo limitado | Pendiente |
| Escalación de novedades críticas | Si una novedad lleva > N días sin resolución (umbral configurable), Gali escala con resumen y propuesta de acción | Decidir si reintentar entrega, recoger, o reembolsar | Proactivo | Pendiente |
| Reintento automático de entrega | Si el cliente corrige la dirección por WhatsApp, Vigilante actualiza el dato en la transportadora sin intervención humana (donde la API lo permite) | Confirmar la nueva dirección si hay ambigüedad | Asistido | Nuevo módulo requerido |
| Seguimiento de tasa de novedad por ciudad | Alerta si la tasa de novedad en una ciudad supera el umbral histórico (indicador de problemas de cobertura de transportadora) | Decidir si ajustar reglas de despacho para esa zona | Proactivo | Pendiente |

---

### Módulo 5 — Garantías y Posventa

**Agente responsable:** Vigilante Logístico

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Clasificación de solicitudes de garantía | Categoriza automáticamente: devolución, cambio, defecto de fábrica, daño en tránsito | — | Autónomo limitado | Implementado (`pages/garantias/garantias-page.component.ts`) |
| Detección de patrones de fraude | Alerta si un mismo número/dirección tiene múltiples garantías en el mismo mes, o si el patrón coincide con comportamiento fraudulento conocido | Decidir si procesar o rechazar la garantía | Proactivo | Pendiente |
| Seguimiento de tiempo de resolución | Alerta si una garantía lleva más de 5 días sin actualización. Propone acción siguiente. | Ejecutar la acción propuesta | Proactivo | Pendiente |
| Actualización de estado al comprador | Chatea Pro notifica al comprador cada cambio de estado en su garantía | — | Autónomo limitado | Pendiente |

---

### Módulo 6 — Validador de Direcciones

**Agente responsable:** Vigilante Logístico

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Validación masiva de direcciones | Vigilante Logístico valida el lote completo contra la base de cobertura de transportadoras. Clasifica: válida / ambigua / sin cobertura. | Resolver direcciones ambiguas | Autónomo limitado | Implementado (`pages/validador/validador-direcciones-page.component.ts`) |
| Corrección proactiva | Para direcciones ambiguas, Chatea Pro contacta al comprador automáticamente para confirmar | — | Asistido | Pendiente |
| Regla de prepago en zona rural | Si la dirección corresponde a municipio sin cobertura validada o zona rural, Chatea Pro aplica automáticamente la regla de prepago (si está configurada en Rules) | Configurar la regla inicialmente | Autónomo limitado | Pendiente |
| Sugerencia de transportadora óptima | Para cada dirección válida, Vigilante sugiere la transportadora con mejor tasa de entrega en esa zona | Aprobar la sugerencia o cambiar manualmente | Generativo | Pendiente |

---

### Módulo 7 — Etiquetas

**Agente responsable:** Sistema autónomo (sin agente especializado)

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Generación batch de etiquetas | Genera etiquetas para todos los pedidos confirmados del día en un solo clic | Revisar si hay pedidos que no deben ser despachados aún | Asistido | Implementado (`pages/etiquetas/etiquetas-page.component.ts`) |
| Detección de errores pre-impresión | Antes de generar, verifica: dirección validada, pedido confirmado, producto en stock. Alerta si alguno falla. | Corregir los flagueados | Proactivo | Pendiente |
| Alertas de etiquetas vencidas | Notifica si hay etiquetas generadas que llevan > 24h sin ser impresas ni despachadas | Decidir si regenerar o cancelar | Proactivo | Pendiente |

---

### Módulo 8 — Logística / Torre Logística

**Agente responsable:** Vigilante Logístico

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Monitoreo de estado de envíos | Vigilante Logístico monitorea en tiempo real todos los envíos activos. Clasifica: en tránsito / entregado / en intento / devuelto / retenido. | — | Vigilante permanente | Implementado (`pages/logistica/torre-logistica-page.component.ts`) |
| Alerta de paquetes retenidos | Notifica inmediatamente cuando un paquete es retenido por transportadora. Sugiere la acción (contactar a la transportadora, reprogramar, etc.) | Ejecutar la acción de contacto | Proactivo | Pendiente |
| Análisis de performance por transportadora | Cruza tasa de entrega efectiva, tiempo promedio, y tasa de novedad por transportadora en las rutas del dropshipper. Alerta si una cae debajo del umbral. | Decidir si cambiar la transportadora por defecto en esa ruta | Proactivo | Pendiente |
| Proyección de entregas del día | Estima cuántos pedidos se entregarán hoy y mañana basado en el estado actual y los tiempos históricos de cada transportadora | — | Generativo | Pendiente |

---

### Módulo 9 — Transportadoras

**Agente responsable:** Vigilante Logístico

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Recomendación de transportadora por ruta | Para cada nuevo pedido, Vigilante recomienda la transportadora con mejor historial de entrega en esa ciudad destino | Cambiar manualmente si hay razón específica | Generativo | Implementado (`pages/logistica/carrier-preferences-page.component.ts`) |
| Detección de degradación de servicio | Si una transportadora muestra más novedades o demoras de lo habitual en la última semana, alerta antes de que afecte al cliente | Decidir si pausar esa transportadora | Proactivo | Pendiente |
| Configuración de reglas por zona | El dropshipper puede definir "para zona rural en el Pacífico, siempre usar transportadora X" — Vigilante aplica la regla automáticamente | Configurar la regla inicial | Autónomo limitado | Pendiente |

---

### Módulo 10 — Marketing / Campañas ROAX

**Agente responsable:** Roax

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Monitoreo de ROAS en tiempo real | Roax trackea ROAS, CPA, CTR y frecuencia de cada campaña activa. Actualiza el dashboard cada hora. | — | Vigilante permanente | Implementado (`pages/marketing/roax-informes-page.component.ts`) |
| Auto-escala de presupuesto | Si ROAS supera el umbral configurado por el usuario por el período definido, Roax escala el presupuesto el porcentaje acordado sin consultar | Configurar la regla inicialmente. Aprobar escalas grandes (>50%). | Autónomo limitado | Pendiente |
| Auto-pausa de creatives | Si un creative cae debajo del umbral de CTR por > N horas, Roax lo pausa y activa el siguiente del set | Revisar el creative pausado y decidir si optimizar o descartar | Autónomo limitado | Pendiente |
| Detección de señales de restricción | Si detecta el patrón de caída de CTR >35% en 6h (precursor de restricción de cuenta en 67% de casos), alerta inmediatamente con propuesta de acción | Decidir si actuar preventivamente | Proactivo | Implementado (mock, pendiente API real) |
| Lanzamiento de campaña desde Proyecto | El dropshipper aprueba el Proyecto → Roax configura la campaña con los parámetros validados por ADA Spy | Aprobar el presupuesto inicial y el creative a usar | Asistido | Implementado (`pages/marketing/roax-lanzador-page.component.ts`) |
| Propuesta de nuevos creatives | Cuando un creative lleva > 14 días activo, Roax alerta que está en riesgo de quemarse y sugiere ángulos nuevos basados en lo que convierte en la comunidad | Crear el nuevo creative (Gali no genera el video, sugiere el concepto) | Generativo | Pendiente |

---

### Módulo 11 — Marketing / Chatea Pro

**Agente responsable:** Chatea Pro

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Confirmación automática de pedidos | Envía mensaje de confirmación al comprador en el momento del pedido, con el script y el tono configurados | Revisar el script inicial | Autónomo limitado | Implementado (`pages/marketing/chatea-pro-page.component.ts`) |
| Flujo de recuperación de carrito | Activa secuencia de N mensajes a quien abandonó el carrito, con cadencia y condiciones de parada configuradas | Definir la secuencia y aprobar el texto | Autónomo limitado | Pendiente |
| Gestión de conversación de novedad | Cuando se genera una novedad, Chatea Pro inicia el contacto con el comprador usando el script de novedad correspondiente al tipo | Intervenir si el comprador responde con queja o pide hablar con una persona | Asistido | Pendiente |
| Scripts A/B automatizados | Chatea Pro corre dos versiones de script en pedidos alternos y mide tasa de confirmación. Después de N pedidos, aplica el ganador. | Revisar los resultados y aprobar el cambio | Asistido | Nuevo módulo requerido |
| Recompra | Para compradores con historial positivo (entregado + sin novedad), Chatea Pro activa flujo de recompra a los 30 días | Aprobar la activación del flujo de recompra | Asistido | Nuevo módulo requerido |

---

### Módulo 12 — Marketing / Automatización

**Agente responsable:** Gali Manager

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Builder de Recetas (flows) | El dropshipper diseña flujos If/Then en el builder visual (estilo Make.com) — Gali los valida y activa | Diseñar la lógica del flujo | Asistido | Implementado (`pages/marketing/automatizacion-page.component.ts`) |
| Ejecución de recetas activas | Gali ejecuta los flows según los triggers configurados (nuevo pedido, novedad, ROAS cae, etc.) | — | Autónomo limitado | Implementado (mock) |
| Log de ejecuciones | Registra cada ejecución con timestamp, resultado, y razón | — | Autónomo limitado | Implementado (mock) |
| Sugerencia de receta desde señal | Cuando Gali detecta un patrón recurrente (ej. ROAS cae siempre a la misma hora), sugiere crear una receta para automatizarlo | Aprobar la receta sugerida | Generativo | Pendiente |
| Skills importadas del marketplace | El dropshipper importa una skill del Marketplace → Gali la adapta al contexto del usuario (productos, umbrales, tono) | Revisar y ajustar la skill importada | Asistido | Nuevo módulo requerido |

---

### Módulo 13 — Reportes / Dashboard

**Agente responsable:** Agente Financiero

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Resumen ejecutivo diario | Agente Financiero genera automáticamente un resumen a las 8am: pedidos, ROAS, saldo, novedad crítica si existe | — | Autónomo limitado | Implementado (`pages/reportes/report-dashboard-kpi-page.component.ts`) |
| Alerta de anomalías en KPIs | Si algún KPI cae > 20% respecto al promedio de los últimos 7 días, alerta con contexto (no solo el número, sino "por qué creemos que pasó") | Decidir qué acción tomar | Proactivo | Pendiente |
| Proyección de cierre de semana | Basado en el ritmo actual y el histórico, proyecta ventas, ingresos y ROAS al cierre de la semana | — | Generativo | Pendiente |
| Diagnóstico cross-data ante caída | Ver Pilar 3 — diagnóstico cruzando Meta Ads + Dropi + ADA Spy | Decidir cuál acción ejecutar | Proactivo | Nuevo módulo requerido (modal Diagnóstico) |
| Exportación inteligente | Genera el reporte con los cortes que el dropshipper necesita para declarar impuestos o presentar a un inversionista | Aprobar el formato y el período | Generativo | Pendiente (`pages/reportes/reportes-descargas-page.component.ts`) |

---

### Módulo 14 — Reportes / Calendario

**Agente responsable:** Sistema (sin agente especializado)

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Marcación de días clave | El sistema marca automáticamente días de pago de plataforma, picos históricos de ventas (ej. Día sin IVA, Black Friday LATAM), y las fechas de vencimiento de campañas activas | — | Autónomo limitado | Implementado (`pages/reportes/reportes-calendario-page.component.ts`) |
| Alertas de ventanas de escala | Si históricamente el dropshipper tiene picos de venta en fechas específicas, Gali alerta 7 días antes para preparar stock, presupuesto y logística | Aprobar la preparación | Proactivo | Pendiente |

---

### Módulo 15 — Financiero / Wallet

**Agente responsable:** Agente Financiero

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Proyección de saldo | Proyecta el saldo disponible a 7 días basado en pedidos en tránsito + tasa histórica de novedad | — | Generativo | Implementado (`pages/financiero/wallet-page.component.ts`) |
| Alerta de fecha óptima de retiro | Agente Financiero identifica la ventana óptima de retiro considerando los pagos pendientes de plataformas | Ejecutar el retiro | Proactivo | Pendiente |
| Detección de discrepancias | Si el saldo liquidado no coincide con lo esperado según los pedidos entregados, alerta con el detalle de la discrepancia | Investigar y reclamar si aplica | Proactivo | Pendiente |
| P&L simplificado por período | Cruza ingresos por ventas, costo de productos, gasto en publicidad, y comisiones Dropi para generar un P&L básico | — | Generativo | Nuevo módulo requerido |

---

### Módulo 16 — CAS / Bandeja

**Agente responsable:** Chatea Pro

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Clasificación automática de mensajes | Chatea Pro clasifica mensajes entrantes por tipo: novedad / consulta de estado / queja / recompra / no relacionado con Dropi | — | Autónomo limitado | Implementado (`pages/cas/cas-bandeja-page.component.ts`) |
| Respuestas automáticas a consultas estándar | Para consultas de estado de pedido, responde automáticamente con la información real del pedido | Manejar quejas o situaciones no estándar | Autónomo limitado | Pendiente |
| Escalación a soporte Dropi | Si el mensaje requiere intervención de soporte Dropi (falla de plataforma, cargo incorrecto, etc.), Chatea Pro lo escala automáticamente con el contexto completo | — | Autónomo limitado | Pendiente |

---

### NUEVO Módulo 17 — Gali Hub (Sprint 1 — DONE)

**Agente responsable:** Gali Manager (orquestador)

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Resumen proactivo al abrir Gali | Al entrar al Hub, Gali presenta inmediatamente: señales activas ordenadas por urgencia, agentes corriendo, loop de resultados recientes, y proyecto activo con el siguiente paso | — | Autónomo limitado | Implementado (`home/home.component.ts`) |
| Señales con razonamiento visible | Cada señal expone el "por qué": qué datos cruzó Gali, cuántos casos similares analizó, el nivel de confianza | — | Generativo | Implementado |
| Loop cerrado de resultados | Muestra: qué acción se ejecutó, antes/después de la métrica clave, cuánto tiempo después | — | Autónomo limitado | Implementado |
| Agentes activos con estado | Panel de agentes mostrando qué está haciendo cada uno en este momento, con CTA de intervenir si está esperando decisión | Responder cuando un agente está en estado "esperando" | Proactivo | Implementado |
| Objetivo activo con progreso | Muestra el objetivo de la semana con progreso vs meta, días restantes, y mensaje contextual de Gali | Definir el objetivo | Proactivo | Implementado |

---

### NUEVO Módulo 18 — Proyecto Detalle (Sprint 2)

**Agente responsable:** Todos los agentes coordinados

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Vista unificada de un proyecto activo | Muestra el pipeline completo (Producto → Landing → Creatives → Campaña → ROAS → Escala) con el estado de cada etapa y el agente responsable | — | Autónomo limitado | Pendiente (Sprint 2) |
| Memoria del proyecto visible | Muestra las decisiones clave tomadas, los aprendizajes acumulados, y el "siguiente paso propuesto" con razonamiento | — | Generativo | Pendiente |
| Artifacts del proyecto | Lista todos los artifacts generados: landings, flows activos, scripts WhatsApp, creatives en uso | — | Autónomo limitado | Pendiente |
| Diagnóstico on-demand | El dropshipper puede pedir "¿por qué bajó mi ROAS?" desde el proyecto y Gali lanza el diagnóstico cross-data | Interpretar el diagnóstico y elegir la acción | Generativo | Pendiente |

---

### NUEVO Módulo 19 — Skills & Rules Editor (Sprint 3)

**Agente responsable:** Gali Manager

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Editor visual de reglas | Interface If/Then visual para crear, editar y probar reglas por agente | Diseñar la lógica de la regla | Asistido | Nuevo módulo requerido |
| Validación de conflictos entre reglas | Antes de activar una regla nueva, Gali detecta si entra en conflicto con una existente y alerta | Resolver el conflicto | Proactivo | Nuevo módulo requerido |
| Test en dry-run | Permite probar la regla con datos históricos del propio usuario antes de activarla en producción | — | Asistido | Nuevo módulo requerido |
| Activar / pausar / eliminar skills | CRUD completo de reglas activas con historial de cambios | — | Asistido | Nuevo módulo requerido |

---

### NUEVO Módulo 20 — Marketplace de Skills (Sprint 3)

**Agente responsable:** Gali Manager

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Exploración de skills por categoría | Muestra skills organizadas por agente, nivel de dificultad, y categoría (producto, marketing, logística, cierre) | — | — | Nuevo módulo requerido |
| Instalación de skill con un clic | El dropshipper elige una skill, Gali la adapta a su contexto (reemplaza valores genéricos por los del usuario) y la pone en modo revisión | Revisar la skill adaptada y confirmar | Asistido | Nuevo módulo requerido |
| Publicación de skill propia | El dropshipper empaqueta una regla suya como skill pública, Gali anonimiza los valores sensibles antes de publicar | Aprobar la publicación y elegir si es gratuita o de pago | Asistido | Nuevo módulo requerido |
| Rating y reviews | Después de 7 días usando una skill, Gali solicita feedback del resultado. Actualiza el rating de la skill. | — | Autónomo limitado | Nuevo módulo requerido |

---

### NUEVO Módulo 21 — Diagnóstico Cross-Data (Sprint 2)

**Agente responsable:** Gali Manager

| Proceso | Qué automatiza Gali | Qué requiere intervención humana | Nivel de agencia | Estado en gali-v5 |
|---|---|---|---|---|
| Detección proactiva de anomalías | Gali detecta cuando una métrica clave cae fuera del rango esperado y abre el diagnóstico automáticamente | — | Vigilante permanente | Nuevo módulo requerido |
| Cruce de fuentes de datos | Gali cruza Meta Ads API + Dropi data + ADA Spy + Chatea Pro para construir el diagnóstico completo | — | Autónomo limitado | Nuevo módulo requerido |
| Presentación del diagnóstico | Modal con hipótesis ordenadas por probabilidad, evidencia de cada una, y opciones de acción concretas con impacto estimado | Elegir qué acción ejecutar | Generativo | Nuevo módulo requerido |
| Loop de resultado post-acción | Después de ejecutar la acción elegida, Gali hace seguimiento y actualiza el diagnóstico con el resultado real | — | Vigilante permanente | Nuevo módulo requerido |

---

## 5. Evaluación por Sección — ¿IA posible, necesita mejora, o nueva sección?

| Módulo Dropi | IA Posible Hoy | Mejora Necesaria en UI/Datos | Nueva Sección Requerida |
|---|---|---|---|
| Catálogo / Búsqueda | Scoring de productos por margen + saturación. Filtros AI-powered. | Exponer datos de volumen de ventas por SKU en tiempo real | No |
| Caza Productos | Detección de tendencias + match con perfil. | Agregar señal de "tiempo hasta saturación" en el card | No |
| Mis Pedidos | Priorización automática + alertas de confirmación pendiente | Agregar columna "tiempo en cola" + flag de urgencia visual | No |
| Novedades Logísticas | Clasificación automática + contacto WhatsApp automático | UI necesita campo "acción de Gali" por novedad + estado de contacto al comprador | No |
| Garantías | Detección de fraude + seguimiento de SLA | Agregar timeline de historial por garantía | No |
| Validador de Direcciones | Validación masiva + sugerencia de transportadora | UI necesita modo batch con progreso y categorías de resultado | No |
| Etiquetas | Validación pre-generación + alerta de etiquetas vencidas | Agregar panel de validación pre-batch | No |
| Torre Logística | Monitoreo en tiempo real + proyección de entregas | Agregar vista por agrupación (en riesgo / en tránsito / entregado) con filtro rápido | No |
| Transportadoras | Recomendación por ruta + detección de degradación | Agregar gráfica de tendencia de KPI por transportadora en los últimos 30 días | No |
| Campañas ROAX | Auto-escala + auto-pausa + detección de restricción | Agregar panel de "reglas activas" con estado y última ejecución | No |
| Chatea Pro | Confirmación automática + recuperación carrito | Agregar vista de "conversaciones activas" con estado por flujo | No |
| Automatización | Builder de flows + ejecución de recetas | Agregar dry-run real con datos históricos + rollback de última ejecución | No |
| Dashboard Reportes | Resumen diario + alertas de anomalías + proyección semanal | Agregar sección "por qué cambió esto" en cada KPI card | No |
| Calendario Reportes | Marcación de días clave + alertas de ventanas de escala | Agregar categorías de eventos (pago / pico histórico / vencimiento campaña) | No |
| Descargas Reportes | Generación inteligente de reportes por propósito | Agregar templates predefinidos (fiscal / inversionista / operativo) | No |
| Financiero Wallet | Proyección de saldo + fecha óptima de retiro + P&L básico | Agregar P&L simplificado con breakdown por categoría de gasto | Sí — P&L simplificado dentro del módulo financiero |
| CAS Bandeja | Clasificación automática + respuestas estándar | Agregar tag de "clasificación Gali" por mensaje y estado de respuesta automática | No |
| — | — | — | Sí — Gali Hub: orquestador central (Sprint 1 DONE) |
| — | — | — | Sí — Proyecto Detalle: vista unificada por proyecto activo (Sprint 2) |
| — | — | — | Sí — Diagnóstico Cross-Data: modal de diagnóstico ante anomalía (Sprint 2) |
| — | — | — | Sí — Skills & Rules Editor: constructor de reglas por agente (Sprint 3) |
| — | — | — | Sí — Marketplace de Skills: ecosistema comunitario de recetas (Sprint 3) |

---

## 6. Alcance de los Agentes dentro del Orquestador

### ADA Spy — Agente de Producto

**Dominio:** Evaluación de productos, análisis de mercado, saturación de nichos, competencia

**Fuentes de datos que consume:**
- Catálogo Dropi (SKUs, precios, márgenes por proveedor)
- Datos de ventas LATAM agregados (anonimizados por SKU)
- Historial de saturación de nichos (curva temporal de vendedores por producto)
- Precios de la competencia (scraping de marketplaces públicos donde aplica)
- Señales de tendencia: TikTok trending, Google Trends LATAM

**Acciones que puede ejecutar autónomamente:**
- Calcular el score de viabilidad de un producto y mostrarlo en el catálogo
- Actualizar el badge de estado de saturación de un producto (oportunidad / en crecimiento / saturado)
- Enviar señal proactiva cuando detecta un producto con alto potencial en el nicho del usuario
- Actualizar el "tiempo estimado antes de saturación" en el proyecto activo
- Monitorear diariamente los favoritos del usuario y notificar si el score cambia

**Límites de autonomía — no puede sin aprobación:**
- Agregar un producto al proyecto activo del usuario
- Cambiar el precio de un producto
- Iniciar un Proyecto nuevo
- Contactar al proveedor

**Loop cerrado:**
```
SEÑAL: "Difusor aromaterapia +340% en 72h — compatible con tu perfil"
↓
ACCIÓN: El usuario hace clic en "Ver análisis completo"
↓
RESULTADO VISIBLE: ADA Spy muestra análisis completo: margen, competidores activos, ventana estimada, ángulos sugeridos
↓
SIGUIENTE PASO: "¿Quieres iniciar un Proyecto con este producto?" [CTA]
```

**Skills disponibles:**
- `umbral-margen-minimo`: No mostrar productos con margen < N%
- `nichos-excluidos`: Lista de nichos que el usuario no quiere ver
- `alerta-competencia-directa`: Notificar si hay un nuevo vendedor del mismo producto en mi ciudad
- `ventana-entrada-maxima`: Solo alertar de productos con ventana > N días

---

### Roax — Agente de Marketing

**Dominio:** Campañas de pago (Meta Ads, TikTok Ads), optimización de ROAS, gestión de creatives

**Fuentes de datos que consume:**
- Meta Ads API (ROAS, CPA, CTR, frecuencia, CPM, impresiones)
- TikTok Ads API (cuando está integrado)
- Historial de campañas del usuario en Dropi
- Benchmarks de campañas similares en LATAM (datos anonimizados de la comunidad)
- ADA Spy (estado de saturación del producto — si el producto se está saturando, la caída de ROAS tiene una causa diferente)

**Acciones que puede ejecutar autónomamente:**
- Escalar el presupuesto diario dentro del porcentaje configurado por el usuario
- Pausar un creative específico cuando cae debajo del umbral de CTR configurado
- Activar el creative alternativo del set cuando el principal es pausado
- Generar el resumen diario de performance de campañas
- Actualizar el badge de ROAS en el panel de proyecto

**Límites de autonomía — no puede sin aprobación:**
- Pausar una campaña completa (puede pausar un creative, no la campaña entera)
- Escalar el presupuesto más del porcentaje máximo configurado
- Crear una nueva campaña
- Cambiar el público objetivo de una campaña existente
- Mover presupuesto entre campañas

**Loop cerrado:**
```
SEÑAL: "CTR cayó 40% en 6h — patrón precursor de restricción detectado"
↓
ACCIÓN: El usuario aprueba "Pausar Banner B, activar Video A"
↓
RESULTADO VISIBLE (2 horas después): "CTR +50% (1.2% → 1.8%) · ROAS 2.6x → 2.9x"
↓
SIGUIENTE PASO: "¿Quieres guardar esta acción como receta automática?"
```

**Skills disponibles:**
- `umbral-roas-escala`: Si ROAS > X por N horas, escalar Y%
- `umbral-ctr-pausa`: Si CTR < X%, pausar creative
- `max-escala-diaria`: Límite máximo de escala en un solo día
- `horas-sin-interrupciones`: Horario en el que no quiero alertas (ej. 11pm-7am)
- `vigilante-anti-bano`: Activar monitoreo de señales de restricción de cuenta

---

### Chatea Pro — Agente de Cierre y Logística

**Dominio:** Comunicación con el comprador, confirmaciones de pedido, recuperación de carrito, novedades logísticas, recompra

**Fuentes de datos que consume:**
- Pedidos Dropi (estado, datos del comprador, historial de la dirección)
- WhatsApp Business API
- Estado de novedades logísticas
- Scripts comunitarios (los más efectivos por tipo de mensaje en LATAM)
- Historial de conversaciones del usuario con sus compradores (para personalizar tono)

**Acciones que puede ejecutar autónomamente:**
- Enviar mensaje de confirmación de pedido según el script configurado
- Enviar notificación de novedad logística al comprador
- Enviar mensaje de recuperación de carrito (N1, cadencia inicial)
- Actualizar el estado de confirmación de un pedido en Dropi cuando el comprador confirma por WhatsApp
- Enviar resumen de estado al comprador cuando lo solicita

**Límites de autonomía — no puede sin aprobación:**
- Ofrecer descuento o compensación de ningún tipo
- Confirmar la cancelación de un pedido
- Comprometerse a una fecha de entrega específica que no esté en el sistema
- Continuar el flujo de recuperación más allá del N máximo de mensajes configurado
- Responder preguntas sobre precio, garantía, o devoluciones fuera del script

**Loop cerrado:**
```
SEÑAL: "Pedido #4821 — dirección no reconocida por Coordinadora"
↓
ACCIÓN: Chatea Pro envía mensaje automático al comprador: "Hola Luis, necesitamos confirmar tu dirección para el envío de tu Collar GPS..."
↓
RESULTADO VISIBLE: "Comprador respondió con dirección corregida. Dirección actualizada en el pedido."
↓
SIGUIENTE PASO: "¿Quieres procesar el despacho ahora?" [CTA]
```

**Skills disponibles:**
- `tono-de-voz`: Formal / informal / neutro (modifica todos los scripts del agente)
- `prepago-zona-rural`: Si dirección es zona rural o municipio sin cobertura, solicitar prepago antes de despachar
- `lista-negra-telefonos`: Números que nunca deben recibir mensajes automáticos
- `horario-envio-mensajes`: Ventana horaria para enviar WhatsApps (respeta horario del comprador)
- `limite-recuperacion-carrito`: Máximo N mensajes de recuperación por carrito
- `umbral-novedad-escalar`: Si novedad lleva > N días sin resolución, escalarme con resumen

---

### Vigilante Logístico

**Dominio:** Monitoreo de estado de envíos, novedades logísticas, validación de direcciones, performance de transportadoras

**Fuentes de datos que consume:**
- APIs de transportadoras integradas (Coordinadora, Servientrega, Envia, TCC, etc.)
- Base de datos de cobertura por municipio
- Historial de novedades por dirección, transportadora, y ciudad
- Tasa de entrega histórica por ruta

**Acciones que puede ejecutar autónomamente:**
- Clasificar novedades entrantes por tipo
- Actualizar el estado de un envío en Dropi cuando la transportadora reporta cambio
- Generar el reporte diario de estado de flota (en tránsito / en intento / devueltos / críticos)
- Actualizar la dirección en el sistema cuando el comprador confirma la corrección por WhatsApp (si la API de la transportadora lo permite)
- Alertar ante degradación de performance de una transportadora

**Límites de autonomía — no puede sin aprobación:**
- Cambiar la transportadora asignada a un pedido ya despachado
- Emitir una orden de recogida
- Comunicarse con la transportadora en nombre del dropshipper para reclamar
- Cancelar un despacho

**Loop cerrado:**
```
SEÑAL: "3 envíos con Coordinadora llevan > 5 días sin movimiento — zona Pacífico"
↓
ACCIÓN: El usuario revisa el listado y aprueba "Escalar con Coordinadora"
↓
RESULTADO VISIBLE: "Coordinadora confirmó: retención por feriado regional. Entrega estimada mañana."
↓
SIGUIENTE PASO: "¿Quieres crear una regla para alertar más temprano sobre esta zona?"
```

**Skills disponibles:**
- `umbral-dias-sin-movimiento`: Alertar si un envío lleva > N días sin actualización de transportadora
- `transportadora-preferida-por-ciudad`: Regla fija de qué transportadora usar en qué ciudad
- `excluir-transportadora`: Nunca asignar pedidos a esta transportadora (ej. por mala experiencia)
- `alerta-tasa-novedad`: Si la tasa de novedad de una ruta supera X%, alertar

---

### Agente Financiero

**Dominio:** Análisis financiero del negocio, proyecciones de saldo, P&L simplificado, alertas de flujo de caja

**Fuentes de datos que consume:**
- Historial de cartera Dropi (pagos, saldos, liquidaciones)
- Pedidos entregados y pendientes de pago
- Gasto en publicidad (Meta Ads API, TikTok Ads API)
- Costo de productos por SKU
- Comisiones Dropi por transacción
- Costo de logística por envío

**Acciones que puede ejecutar autónomamente:**
- Generar el resumen financiero diario (saldo disponible, cobros pendientes, gasto del día)
- Calcular el P&L del período seleccionado
- Proyectar el saldo disponible a 7 y 30 días
- Identificar la ventana óptima de retiro
- Alertar si el gasto en publicidad supera el umbral de porcentaje sobre ventas configurado

**Límites de autonomía — no puede sin aprobación:**
- Ejecutar un retiro de saldo
- Modificar datos bancarios
- Activar o desactivar pagos automáticos
- Acceder a datos de facturación sin solicitud explícita

**Loop cerrado:**
```
SEÑAL: "Gasto en publicidad esta semana = 42% de las ventas brutas — umbral superado (35%)"
↓
ACCIÓN: El usuario revisa el breakdown (qué campaña consume más) y decide pausar la de menor ROAS
↓
RESULTADO VISIBLE: "Relación publicidad/ventas ajustada a 31% proyectado para el resto de la semana"
↓
SIGUIENTE PASO: "¿Quieres revisar el P&L del mes con este ajuste?"
```

**Skills disponibles:**
- `umbral-gasto-publicidad`: Alertar si el gasto en ads supera X% de las ventas
- `objetivo-saldo-minimo`: Alertar si el saldo cae debajo de $N COP (fondo de emergencia)
- `reporte-fiscal-mensual`: Generar reporte automático el día 1 de cada mes
- `moneda-principal`: Para operadores multi-país, definir la moneda base del P&L

---

## 7. Loop Cerrado — El Principio Central

El loop cerrado es el mecanismo que construye la confianza del dropshipper en Gali de forma progresiva. No es suficiente que Gali recomiende — el usuario tiene que ver qué pasó después de cada acción.

### El patrón

```
SEÑAL
  (Gali detecta algo: oportunidad, riesgo, anomalía)
  → Incluye: qué detectó, por qué es importante, nivel de confianza, fuente de datos
  
ACCIÓN
  (El usuario aprueba, modifica, o rechaza)
  → La acción queda registrada con timestamp y el usuario que la aprobó
  
RESULTADO VISIBLE
  (Gali muestra qué pasó: métrica antes y después, en cuánto tiempo)
  → Si el resultado fue positivo: refuerza la confianza
  → Si el resultado fue negativo o neutro: Gali explica por qué y ajusta el modelo
  
SIGUIENTE PASO PROPUESTO
  (Gali cierra el loop sugiriendo qué hacer ahora con este contexto)
  → Puede ser: crear una receta para automatizar esta acción en el futuro
  → O: ampliar la acción a otro proyecto o región
  → O: simplemente marcar como aprendizaje en la memoria del proyecto
```

### Ejemplos concretos por agente

**ADA Spy — Loop de oportunidad de producto:**
```
SEÑAL: "Difusor aromaterapia +340% ventas semana Colombia. Encaja con tu perfil (margen 68%)."
↓
ACCIÓN: Usuario inicia Proyecto con este producto
↓
RESULTADO VISIBLE (14 días después): "Proyecto Difusor: 23 ventas, ROAS 2.4x, novedad 8%"
↓
SIGUIENTE PASO: "ADA Spy detecta que el nicho tiene 8-12 días más de ventana. ¿Expandir a Medellín?"
```

**Roax — Loop de optimización de campaña:**
```
SEÑAL: "Creative Banner B cayó CTR 40% en 6h. Patrón de restricción en 67% de casos similares."
↓
ACCIÓN: Usuario aprueba "Pausar Banner B, activar Video A"
↓
RESULTADO VISIBLE (2h): "CTR 1.2% → 1.8% (+50%). ROAS 2.6x → 2.9x."
↓
SIGUIENTE PASO: "¿Quieres crear una receta para que esto pase automáticamente la próxima vez?"
```

**Chatea Pro — Loop de novedad resuelta:**
```
SEÑAL: "Pedido #4821 — dirección no reconocida por Coordinadora"
↓
ACCIÓN: Chatea Pro contacta al comprador (aprobado por el usuario con un clic)
↓
RESULTADO VISIBLE (45 min): "Comprador corrigió dirección. Despacho reprogramado para mañana."
↓
SIGUIENTE PASO: "¿Quieres que Chatea Pro haga esto automáticamente para todas las novedades tipo dirección?"
```

**Vigilante Logístico — Loop de alerta de degradación:**
```
SEÑAL: "Tasa de novedad Coordinadora en Costa Caribe: 23% esta semana (normal: 12%)"
↓
ACCIÓN: Usuario decide cambiar transportadora preferida para esa zona a Servientrega
↓
RESULTADO VISIBLE (1 semana): "Tasa de novedad Costa Caribe con Servientrega: 9%"
↓
SIGUIENTE PASO: "¿Quieres establecer Servientrega como transportadora por defecto para esta zona de forma permanente?"
```

**Agente Financiero — Loop de alerta de gasto:**
```
SEÑAL: "Gasto en publicidad: 42% de ventas brutas esta semana (umbral: 35%)"
↓
ACCIÓN: Usuario pausa la campaña de menor ROAS
↓
RESULTADO VISIBLE (fin de semana): "Relación publicidad/ventas: 29% — P&L semanal positivo"
↓
SIGUIENTE PASO: "¿Quieres que Gali te avise automáticamente cuando el ratio supere el 35%?"
```

### Por qué el loop construye confianza

Los usuarios que ven el loop completo — señal, qué hicieron, qué pasó — tienen evidencia empírica de que Gali funciona. Eso contrasta con las interfaces de automatización que ejecutan silenciosamente: el usuario no sabe si la herramienta ayudó o si las ventas subieron solas.

El principio de diseño: **nunca ejecutes una acción sin que el usuario vea el resultado**. Si Gali no puede garantizar visibilidad del resultado, la acción debe ser propuesta, no autónoma.

---

## 8. Sistema de Skills y Rules — Arquitectura Técnica

### Estructura de una Rule

```typescript
interface GaliRule {
  id: string;
  nombre: string;
  agente: 'ada-spy' | 'roax' | 'chatea-pro' | 'vigilante' | 'financiero';
  estado: 'activa' | 'pausada' | 'draft';
  
  trigger: {
    tipo: 'metrica' | 'evento' | 'tiempo' | 'externo';
    condicion: string;         // ej: "roas < 1.5"
    fuente: string;            // ej: "meta-ads-api"
    ventana_temporal?: string; // ej: "12h"
  };
  
  condicion_adicional?: {
    campo: string;
    operador: 'mayor' | 'menor' | 'igual' | 'contiene';
    valor: string | number;
  };
  
  accion: {
    tipo: 'pausar' | 'escalar' | 'notificar' | 'enviar-mensaje' | 'crear-tarea';
    parametros: Record<string, string | number | boolean>;
    requiere_aprobacion: boolean;
  };
  
  notificacion: {
    canal: 'in-app' | 'whatsapp' | 'email';
    mensaje_template: string;
  };
  
  historial: {
    total_ejecuciones: number;
    ultima_ejecucion: string;
    tasa_exito: number;
  };
}
```

### Tipos de Triggers

| Tipo | Ejemplos |
|---|---|
| **Métrica cruzando umbral** | ROAS < 1.5, CTR < 1%, novedad_rate > 15%, saldo < $500k COP |
| **Evento de negocio** | Nuevo pedido recibido, pedido entregado, novedad creada, campaña pausa |
| **Tiempo** | Cada mañana a las 8am, el primer lunes del mes, 7 días antes de vencimiento |
| **Patrón detectado** | Tres pedidos del mismo número en 24h, creative sin impresiones por 2h |

### Builder Visual (If/Then nodes)

El editor visual de Rules tiene tres tipos de nodos:

**Nodo Trigger** (morado, entrada)
```
┌──────────────────────────┐
│  ⚡ TRIGGER               │
│  Cuando ROAS < [1.5x]    │
│  en las últimas [12h]    │
│  Fuente: Meta Ads API    │
└──────────────────────────┘
```

**Nodo Condición** (gris, bifurcación)
```
┌──────────────────────────┐
│  ◈ CONDICIÓN             │
│  Y el producto está      │
│  en estado [activo]      │
│  Sí → [rama A]           │
│  No → [rama B]           │
└──────────────────────────┘
```

**Nodo Acción** (naranja, ejecución)
```
┌──────────────────────────┐
│  ▶ ACCIÓN                │
│  Pausar campaña          │
│  Notificar vía in-app    │
│  Requiere aprobación: Sí │
└──────────────────────────┘
```

### Comunidad de Skills

**Estructura de un Skill publicado:**

```json
{
  "id": "skill-anti-bano-meta",
  "nombre": "Vigilante Anti-Baneo Meta",
  "descripcion": "Detecta señales de restricción y actúa preventivamente",
  "agente": "roax",
  "autor": "dropshipper_verified_001",
  "nivel": "intermedio",
  "tipo": "gratuita",
  "rating": 4.8,
  "instalaciones": 1243,
  "tags": ["meta-ads", "proteccion", "campanas"],
  "reglas": [
    {
      "trigger": "CTR cae >35% en 6h",
      "accion": "Pausar creative activo, activar alternativo del set",
      "requiere_aprobacion": true
    }
  ],
  "resultados_comunidad": {
    "usuarios_que_la_usan": 1243,
    "tasa_de_mejora": 0.67,
    "metrica_mejorada": "CTR +40% promedio post-aplicacion"
  }
}
```

**Incentivos para contribuir:**
- Cada instalación exitosa suma +1 punto de reputación
- Si la skill genera mejora de KPI medible, suma +5 puntos
- Los top 10 del mes aparecen en el leaderboard del Marketplace
- Contribuidores con > 500 puntos reciben badge "Experto Dropi"
- Skills premium: el creador recibe el 70% de los ingresos de suscripción

**Privacidad en el sistema de Skills:**
- Los Skills compartidos no incluyen valores absolutos del usuario (presupuestos, nombres, teléfonos)
- Solo se comparte la estructura lógica (If/Then) con valores genéricos
- Los resultados de la comunidad son completamente anonimizados antes de agregarse
- El usuario puede configurar qué métricas propias se pueden usar para mejorar los modelos comunitarios

---

## 9. Roadmap de Implementación (Sprints)

> **Estado al 2026-05-29.** Sprints 1–4 y replanteo A–C están implementados. La **Deep Reconstruction** (plan V1–V10) está en curso — ver §12.

### Sprint 1 — Gali Hub ✅ DONE

**Archivos:** `home/home.component.{ts,html,scss}`

**Entregó:** Objetivo activo, agentes, señales, KPIs, loop cerrado, mini-lista de proyectos.

**Deep Reconstruction (V1):** Añadido **Section Health Grid** (9 secciones, navegación directa, badge de alertas). Pendiente: layout asimétrico 60/40 del plan, animación stagger completa, FAB badge cross-sección.

---

### Sprint 2 — Proyecto Detalle + Diagnóstico ✅ DONE

**Archivos:**
- `pages/proyecto/proyecto-detalle-page.component.*`
- `components/diagnostico-modal/diagnostico-modal.component.*`
- `mocks/gali-v5/diagnostico-cross-data.json`

**Deep Reconstruction (V3–V5):** Detalle operativo. Pendiente: modal **Crear Proyecto** (V4) conversacional 3 pasos.

---

### Sprint 3 — Skills & Marketplace ✅ DONE (pre-unificación)

**Archivos originales:**
- `pages/marketplace/marketplace-page.component.*`
- `components/skills-editor-modal/skills-editor-modal.component.*`

**Deep Reconstruction (V6–V8):** Nueva **`/gali-v5/skills`** con 3 tabs:
1. **Mis Skills** — lista desde `mocks/gali-v5/user-skills.json`
2. **Crear skill** — wizard 4 pasos (intención → If/Then → connectors → dry-run)
3. **Marketplace** — embed del marketplace existente

`/gali-v5/marketplace` → redirect a `/skills`.

---

### Sprint 4 — Capa Gali en módulos core ✅ DONE

Órdenes, Novedades, ROAX Informes, Dashboard, Torre Logística, CAS, Garantías, Campañas, Catálogo, Caza, Wallet.

---

### Sprint Deep Reconstruction — En curso (V1–V10)

| Vista | Route | Estado prototipo | Archivo principal |
|---|---|---|---|
| **V1** Gali Hub + Health Grid | `/gali-v5` | 🟡 Parcial | `home/*` |
| **V2** Proyectos List | `/gali-v5/proyectos` | 🟡 Parcial | `pages/proyectos/*` |
| **V3** Proyecto Detalle | `/gali-v5/proyecto/:id` | ✅ | `pages/proyecto/*` |
| **V4** Modal Crear Proyecto | modal | ⏳ Pendiente | — |
| **V5** Diagnóstico Cross-Data | modal | ✅ | `components/diagnostico-modal/*` |
| **V6** Mis Skills | `/gali-v5/skills` tab 0 | ✅ | `pages/skills/*` |
| **V7** Crear Skill Wizard | `/gali-v5/skills` tab 1 | ✅ | `pages/skills/*` |
| **V8** Skills Marketplace | `/gali-v5/skills` tab 2 | ✅ | `pages/skills/*` + marketplace embed |
| **V9** Caza — Historial + Red Problemas | `/gali-v5/productos/caza-productos` | ✅ | `pages/caza-productos/*` |
| **V10** CAS — PQR Intelligence | `/gali-v5/cas/bandeja` | 🟡 Parcial | `pages/cas/*` |

**Transversal — GaliChipComponent:** Creado en `components/gali-chip/`. Integrado en Caza, Skills, CAS. Pendiente: Catálogo, Pedidos, Logística, Marketing, Financiero, Reportes, Proyectos (7 secciones).

**Mocks nuevos:**
- `mocks/gali-v5/user-skills.json` (12 skills)
- `mocks/gali-v5/pqr-patterns.json` (5 patrones)
- `mocks/gali-v5/problem-network.json` (historial + red de problemas)

---

## 10. Lo que Gali NUNCA hará (Límites Inamovibles)

Estos límites no son configurables. Son parte del contrato de confianza entre Gali y el dropshipper.

### Dinero

- **Nunca moverá dinero sin aprobación explícita del usuario**. Esto incluye: ejecutar un retiro, activar pagos automáticos, cambiar datos bancarios, o cualquier operación que modifique el saldo del wallet.
- La excepción es el gasto en publicidad dentro de las reglas de auto-escala configuradas — pero con un límite máximo absoluto definido por el usuario y nunca superando ese límite.

### Campañas

- **Nunca pausará una campaña completa de forma autónoma**. Puede pausar un creative específico dentro de una campaña. Puede alertar sobre una campaña con mal rendimiento. Pero pausar la campaña entera siempre requiere aprobación.
- La razón: pausar una campaña completa tiene costos de reaprendizaje del algoritmo que el dropshipper tiene que entender.

### Estrategia de negocio

- **Nunca tomará decisiones de dirección estratégica sin el humano**. Qué nicho atacar, qué productos lanzar, cuánto invertir en publicidad como porcentaje del negocio, si expandir a otro país — estas decisiones siempre son humanas.
- Gali informa, contextualiza, y propone opciones con pros y contras. Nunca elige.

### Datos de otros usuarios

- **Nunca compartirá datos de un usuario con otro usuario** sin consentimiento explícito.
- Los benchmarks de la comunidad son completamente anonimizados antes de ser usados como contexto.
- Los Skills compartidos no incluyen ningún dato identificable del creador ni de sus compradores.

### Comunicación con compradores

- **Nunca hará compromisos que Dropi no puede cumplir** en nombre del dropshipper. Si el sistema no tiene una fecha de entrega confirmada por la transportadora, Chatea Pro no dará una.
- **Nunca ofrecerá compensación económica** (descuento, reembolso, bono) sin aprobación del dropshipper.
- **Nunca continuará un flujo de mensajes** si el comprador indica que quiere hablar con una persona real.

---

## 11. Wireframe Specs — Por Vista Nueva

### Vista 1: Gali Hub

**Sprint 1 — DONE · Deep Reconstruction V1 — 🟡 Parcial**

- **Módulo / Route:** `/gali-v5`
- **Tipo:** page
- **Rol:** dropshipper
- **Archivo:** `src/app/pages/gali-v5/home/home.component.ts`
- **Mock data:** hardcoded en TS + `mocks/gali-v3/` legacy

**Nuevo en V1 (Deep Reconstruction):**
- **Section Health Grid:** 9 celdas clicables (Productos, Pedidos, Logística, Marketing, Financiero, CAS, Proyectos, Skills, Reportes) con status `ok | warn | critical`, badge de alertas y mensaje contextual.
- **Total alertas:** suma visible en header del grid.
- **Navegación:** click en celda → ruta de la sección.
- **Pendiente del plan:** layout asimétrico 60/40, agentes sticky inferior, animación stagger completa, FAB badge cross-sección.

**Estructura visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: [Logo Dropi] [⚡ ROAS 2.8x · Collar GPS] [⚠️ 1 novedad] │
├──────────────────┬──────────────────────────────────────────────┤
│ SIDEBAR          │ MAIN CONTENT                                 │
│ [Gali Hub ●]     │                                              │
│ [Proyectos]      │ ┌──────────────────────────────────────────┐ │
│ [Productos ›]    │ │ SEÑALES ACTIVAS (ordenadas por urgencia) │ │
│ [Pedidos ›]      │ │                                          │ │
│ [Marketing ›]    │ │ ⚠️ ALTA: CTR cayó 40% — [Revisar]        │ │
│ [Logística ›]    │ │ ⚡ MEDIA: Campaña puede escalar — [Ver]  │ │
│ [Reportes ›]     │ │ 🎯 MEDIA: Nuevo producto en tendencia    │ │
│ [Financiero ›]   │ └──────────────────────────────────────────┘ │
│                  │                                              │
│                  │ ┌────────────────┬───────────────────────┐  │
│                  │ │ AGENTES ACTIVOS │ LOOP DE RESULTADOS    │  │
│                  │ │                │                        │  │
│                  │ │ 🚛 Vigilante   │ ✅ CTR +50% → 1.8%   │  │
│                  │ │ activo · 91%   │ 2h ago · Ver detalle  │  │
│                  │ │ 📊 Collar GPS  │ ✅ Novedad resuelta   │  │
│                  │ │ esperando      │ 45min ago             │  │
│                  │ │ ⚙️ Novedades   │                        │  │
│                  │ │ en pausa       │                        │  │
│                  │ └────────────────┴───────────────────────┘  │
│                  │                                              │
│                  │ ┌──────────────────────────────────────────┐ │
│                  │ │ PROYECTOS ACTIVOS                        │ │
│                  │ │                                          │ │
│                  │ │ 🐕 Collar GPS · ROAS 2.8x · 47 ventas  │ │
│                  │ │ "Tu campaña puede escalar ahora"         │ │
│                  │ │ [Ver proyecto →]                         │ │
│                  │ │                                          │ │
│                  │ │ + Nuevo proyecto                         │ │
│                  │ └──────────────────────────────────────────┘ │
│                  │                                              │
│                  │ ┌──────────────────────────────────────────┐ │
│                  │ │ OBJETIVO ACTIVO: 50 pedidos esta semana  │ │
│                  │ │ [████████████░░░░░] 34/50 · 3 días       │ │
│                  │ │ "Al ritmo actual, llegarás el jueves"    │ │
│                  │ └──────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────┘
```

**Interacciones clave:**
- Clic en señal: abre el contexto completo con razonamiento y CTA de acción
- Clic en agente "esperando": abre el panel de decisión pendiente
- Clic en "Ver proyecto": navega a Proyecto Detalle
- Dismiss de señal: la persiste como "revisada" en el estado local

**Heurísticas Nielsen aplicadas:**
- H1 (Visibilidad del estado): todas las señales tienen timestamp y nivel de urgencia
- H7 (Flexibilidad): el usuario puede ignorar las señales o actuar en ellas
- H8 (Diseño estético): prioridad visual clara — alta urgencia (rojo), media (naranja), baja (azul)
- H11-AI (Transparencia del razonamiento): cada señal expone la fuente y el nivel de confianza

**Tokens de diseño:**
- Background: `$color-background-primary` (#FAF7F2 si usando gali-v3-tokens, o `$color-neutral-100`)
- Señal alta urgencia: `$color-error-100` border-left
- Señal media: `$color-warning-100` border-left
- Loop de resultado positivo: `$color-success-100` border-left
- Agente activo: `$color-primary` (naranja `#F49A3D`) dot pulsante
- Tipografía: Inter para todo el contenido, IBM Plex Sans para etiquetas de menú

---

### Vista 2: Proyecto Detalle

**Sprint 2 — ✅ DONE**

- **Módulo / Route:** `/gali-v5/proyecto/:id`
- **Tipo:** page
- **Rol:** dropshipper
- **Archivo a crear:** `src/app/pages/gali-v5/proyecto/proyecto-detalle-page.component.ts`
- **Datos mock necesarios:** `mocks/gali-v3/proyectos.json` (proyecto "collar-gps-2026" — ya existe, ampliar con artifacts y memoria detallada)

**Estructura visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMB: Gali Hub > Proyectos > Collar GPS                   │
│ HEADER: 🐕 Lanzamiento Collar GPS · [activo] · 18 días         │
│ [Pausar proyecto] [Diagnóstico] [Ajustar con Gali]             │
├─────────────────────────────────────────────────────────────────┤
│ PIPELINE VISUAL                                                  │
│ [✅ Producto] → [✅ Landing] → [✅ Creatives] → [⚡ Campaña] → [🎯 ROAS] │
│  Collar GPS     v2 activa     3 piezas        $80k/día  2.8x   │
├────────────────────────────┬────────────────────────────────────┤
│ AGENTES EN EL PROYECTO     │ MÉTRICAS LIVE                      │
│                            │                                    │
│ ADA Spy ✅                 │ ROAS: 2.8x    Ventas: 47          │
│ Producto validado          │ CTR: 3.4%     Budget: $80k/día    │
│ Ventana: 14 días           │ Novedad: 6%   Días activo: 18     │
│                            │                                    │
│ Roax ⚡ activo             │ ┌────────────────────────────┐    │
│ 3 campañas · $80k/día      │ │ ⚡ Gali recomienda:        │    │
│ 1 creative en riesgo       │ │ "Escalar a Medellín ahora" │    │
│                            │ │ [Ver razonamiento] [Actuar]│    │
│ Chatea Pro ✅              │ └────────────────────────────┘    │
│ 47 confirmaciones hoy      │                                    │
│ Tasa de cierre: 94%        │                                    │
├────────────────────────────┴────────────────────────────────────┤
│ MEMORIA DEL PROYECTO                                             │
│ Decisiones clave:                                                │
│ • Elegiste ángulo 'Mamá / seguridad' (+38% ventas en LATAM)    │
│ • Pausaste Creative A — Video B 2x más CTR                      │
│ • Escalaste presupuesto a $80k/día                              │
│                                                                  │
│ Aprendizajes acumulados:                                         │
│ • Audiencia: mujeres 28-45, mascotas pequeñas                  │
│ • Mejor hora: 7-9pm COL · Bogotá responde 18% mejor           │
├─────────────────────────────────────────────────────────────────┤
│ ARTIFACTS DEL PROYECTO                                           │
│ [🌐 landing-collar-mama-v2] [⚙️ Auto-pausa CTR<2%] [📋 Script WhatsApp] │
└─────────────────────────────────────────────────────────────────┘
```

**Interacciones clave:**
- Clic en agente con estado "esperando": abre panel lateral con la decisión pendiente
- Clic en "Diagnóstico": abre el modal de Diagnóstico Cross-Data
- Clic en etapa del pipeline: expande el detalle de esa etapa
- Clic en "Ver razonamiento": expande el panel de razonamiento de Gali

**Heurísticas Nielsen aplicadas:**
- H1 (Visibilidad del estado): pipeline con estado visual por etapa
- H6 (Reconocimiento vs recuerdo): memoria del proyecto siempre visible, no hay que recordar decisiones pasadas
- H9 (Ayuda a reconocer y recuperarse de errores): si una etapa está en riesgo, se indica con ícono de advertencia
- H13-AI (Incertidumbre): el tiempo estimado de ventana incluye el rango de confianza

**Tokens de diseño:**
- Pipeline: `$color-primary` (#F49A3D) para etapa activa, `$color-success-500` para completada, `$color-neutral-300` para pendiente
- Cards de agente: `$radius-lg` + `$shadow-sm`
- Memoria: background `$color-neutral-50` con border-left `$color-primary`
- Spacing entre secciones: `$size-6`

---

### Vista 3: Diagnóstico Cross-Data

**Sprint 2 — ✅ DONE**

- **Módulo / Route:** modal (se puede abrir desde Gali Hub, Proyecto Detalle, o cualquier módulo)
- **Tipo:** modal
- **Vista padre:** Cualquier vista del shell gali-v5
- **CTA que lo abre:** "Diagnóstico", señal de anomalía con CTA, o invocación por Gali proactivamente
- **on_success:** Cierra el modal. Si el usuario aprueba una acción, la ejecuta y muestra el inicio del loop.
- **on_cancel:** Cierra el modal sin cambios
- **Rol:** dropshipper
- **Archivo a crear:** `src/app/pages/gali-v5/components/diagnostico-modal/diagnostico-modal.component.ts`
- **Datos mock necesarios:** crear `mocks/gali-v5/diagnostico-cross-data.json` con 3+ diagnósticos de ejemplo (ROAS caída, novedad alta, saldo bajo)

**Estructura visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│ MODAL OVERLAY (backdrop blur, position: fixed)                  │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Diagnóstico: ¿Por qué cayó tu ROAS?          [✕ Cerrar] │ │
│ │ Análisis cruzado de 4 fuentes · hace 2 min                 │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ FUENTES CRUZADAS:                                           │ │
│ │ ✅ Meta Ads API  ✅ Dropi LATAM  ✅ ADA Spy  ⏳ Chatea Pro │ │
│ │                                                              │ │
│ │ HIPÓTESIS (ordenadas por probabilidad)                       │ │
│ │                                                              │ │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │ │
│ │ 1. Presión competitiva de precio · 68% probabilidad         │ │
│ │    Evidencia: CPM +18% · 3 nuevos vendedores esta semana   │ │
│ │    Impacto: ROAS -0.9x                                      │ │
│ │    Acción sugerida: [Cambiar ángulo a diferenciación]       │ │
│ │                                                              │ │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │ │
│ │ 2. Creative en saturación · 24% probabilidad                │ │
│ │    Evidencia: Frecuencia 3.2x (umbral: 3x) · CTR estable   │ │
│ │    Impacto: ROAS -0.4x adicional si no se actúa            │ │
│ │    Acción sugerida: [Rotar creative a Video B]              │ │
│ │                                                              │ │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │ │
│ │ 3. Problema logístico · 8% probabilidad                     │ │
│ │    Evidencia: Tasa de novedad estable (6%)                  │ │
│ │    No hay señales de impacto logístico en conversión        │ │
│ │                                                              │ │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │ │
│ │ [No actuar por ahora]  [Cambiar ángulo]  [Rotar creative]   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Interacciones clave:**
- El modal se abre con animación (scale-in + fade del backdrop)
- Mientras Gali cruza los datos, se muestra un loading con "Analizando Meta Ads... ✅ · Dropi LATAM... ✅ · ADA Spy..."
- Cada hipótesis se puede expandir para ver la evidencia completa
- Clic en una acción: cierra el modal, ejecuta la acción, y muestra el inicio del loop en la vista padre
- Si hay más de una acción sugerida, el usuario puede ejecutar más de una

**Heurísticas Nielsen aplicadas:**
- H1 (Visibilidad): indicador de qué fuentes se cruzaron y cuándo fue el análisis
- H2 (Match con realidad): vocabulario del diagnóstico en lenguaje del dropshipper, no técnico
- H3 (Control del usuario): puede cerrar en cualquier momento, puede "no actuar"
- H7 (Eficiencia): acciones con un clic desde el diagnóstico
- H13-AI (Incertidumbre): probabilidad explícita por hipótesis, no se presenta como certeza absoluta

**Tokens de diseño:**
- Modal container: `$radius-xl` + `$shadow-lg` + backdrop-filter: blur(8px)
- Hipótesis alta probabilidad: border-left `$color-primary`
- Hipótesis media: border-left `$color-warning-500`
- Hipótesis baja: border-left `$color-neutral-300`
- CTAs principales: botón tipo "New" del DS (`dropi-button.json`)
- Scroll: dentro del modal container con header/footer fixed

---

### Vista 4: Skills & Rules Editor

**Sprint 3 — Pendiente**

- **Módulo / Route:** modal (se abre desde Gali Hub → "Mis reglas" o desde una señal que sugiere crear una receta)
- **Tipo:** modal
- **Vista padre:** Gali Hub o cualquier vista del shell
- **CTA que lo abre:** "Crear regla", "Configurar agente", o "Guardar como receta" en el loop de resultado
- **on_success:** Regla creada y activada (o en draft para activar después). Regresa a la vista padre.
- **on_cancel:** Cierra sin guardar
- **Rol:** dropshipper
- **Archivo a crear:** `src/app/pages/gali-v5/skills/skills-editor-modal.component.ts`
- **Datos mock necesarios:** crear `mocks/gali-v5/user-rules.json` con 5+ reglas de ejemplo por agente

**Estructura visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│ MODAL OVERLAY                                                    │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⚙️ Nueva Regla · Roax                           [✕ Cerrar] │ │
│ │ Paso 1 de 3: Define cuándo actuar               [● ○ ○]    │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │                                                              │ │
│ │  CUANDO...                                                   │ │
│ │  ┌────────────────────────────────────────────────────────┐ │ │
│ │  │  📊 ROAS          ▼  │  cae por debajo de  │  [1.5] x  │ │ │
│ │  └────────────────────────────────────────────────────────┘ │ │
│ │                                                              │ │
│ │  POR MÁS DE...                                               │ │
│ │  ┌────────────────────────────────────────────────────────┐ │ │
│ │  │  [12] horas consecutivas                               │ │ │
│ │  └────────────────────────────────────────────────────────┘ │ │
│ │                                                              │ │
│ │  Y ADEMÁS (opcional)                                         │ │
│ │  ┌────────────────────────────────────────────────────────┐ │ │
│ │  │  + Agregar condición adicional                         │ │ │
│ │  └────────────────────────────────────────────────────────┘ │ │
│ │                                                              │ │
│ │  Vista previa del trigger:                                   │ │
│ │  "Cuando el ROAS caiga debajo de 1.5x por 12 horas o más"  │ │
│ │                                                              │ │
│ │  [← Cancelar]                           [Continuar: Acción →] │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Interacciones clave:**
- Wizard de 3 pasos: Trigger → Acción → Configurar notificación
- Cada paso tiene vista previa en lenguaje natural de lo que se está configurando
- Paso 2 permite elegir si la acción requiere aprobación o es autónoma
- Antes de guardar: dry-run con datos históricos del usuario ("Si esta regla hubiera existido el mes pasado, se habría activado 3 veces")
- CTA final: "Activar ahora" o "Guardar como draft"

**Heurísticas Nielsen aplicadas:**
- H4 (Consistencia): terminología consistente con el loop cerrado (trigger → acción → notificación)
- H5 (Prevención de errores): vista previa en lenguaje natural confirma que la regla tiene sentido antes de guardar
- H6 (Reconocimiento): dropdowns con los triggers y acciones disponibles, no campo de texto libre
- H9 (Recuperación de errores): el dry-run detecta si la regla conflictúa con otra existente

**Tokens de diseño:**
- Wizard progress: `$color-primary` para pasos completados
- Vista previa trigger: background `$color-neutral-50`, borde dashed `$color-primary`
- Controles de formulario: `dropi-input.json` especificaciones del DS
- CTA principal: botón "New" `$color-primary` del DS

---

### Vista 5: Marketplace de Skills

**Sprint 3 — Pendiente**

- **Módulo / Route:** `/gali-v5/marketplace`
- **Tipo:** page
- **Rol:** dropshipper
- **Archivo a crear:** `src/app/pages/gali-v5/marketplace/marketplace-page.component.ts`
- **Datos mock necesarios:** crear `mocks/gali-v5/skills-marketplace.json` con 20+ skills mínimo (gratuitas + expertos + premium), distribuidas entre los 5 agentes

**Estructura visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: Marketplace de Skills · Mejora tus agentes con         │
│         recetas creadas por la comunidad Dropi                  │
├─────────────────────────────────────────────────────────────────┤
│ FILTROS:                                                         │
│ [Todos los agentes ▼] [Gratuitas · Expertos · Premium]         │
│ [Nivel: Todos ▼] [Ordenar: Más usadas ▼] [🔍 Buscar...]       │
├─────────────────────────────────────────────────────────────────┤
│ TABS: [Destacadas] [ADA Spy] [Roax] [Chatea Pro] [Vigilante] [Financiero] │
├─────────────────────────────────────────────────────────────────┤
│ GRID (3 columnas)                                                │
│                                                                  │
│ ┌──────────────────────┐ ┌──────────────────────┐               │
│ │ 🛡️ Anti-Baneo Meta  │ │ 🎯 Escalador ROAS    │               │
│ │ por Roax             │ │ por Roax             │               │
│ │ ⭐ 4.8 · 1.2k usos  │ │ ⭐ 4.6 · 847 usos   │               │
│ │ GRATUITA             │ │ EXPERTO VERIFICADO   │               │
│ │ "Detecta señales de  │ │ "Escala presupuesto  │               │
│ │ restricción y actúa" │ │ con reglas probadas" │               │
│ │                      │ │                      │               │
│ │ [Ver detalle]        │ │ [Ver detalle]        │               │
│ └──────────────────────┘ └──────────────────────┘               │
│                                                                  │
│ ┌──────────────────────┐ ┌──────────────────────┐               │
│ │ 🌍 Prepago Rural    │ │ 💬 Cierre Cálido     │               │
│ │ por Vigilante        │ │ por Chatea Pro       │               │
│ │ ⭐ 4.9 · 2.1k usos  │ │ ⭐ 4.7 · 634 usos   │               │
│ │ GRATUITA             │ │ PREMIUM · $29.900    │               │
│ │ "Exige prepago en    │ │ "Script de 5 pasos   │               │
│ │ zona sin cobertura"  │ │ para confirmar el    │               │
│ │                      │ │ pedido por WhatsApp" │               │
│ │ [Ver detalle]        │ │ [Ver detalle]        │               │
│ └──────────────────────┘ └──────────────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│ MIS SKILLS PUBLICADAS · [Publicar nueva skill]                  │
│ (solo visible si el usuario tiene skills publicadas)            │
└─────────────────────────────────────────────────────────────────┘
```

**Interacciones clave:**
- Filtro por agente: tabs + dropdown (responsive)
- Clic en card: abre página de detalle con descripción completa, resultados de la comunidad, reviews, y CTA de instalar
- Instalar skill: wizard corto de 2 pasos (adaptar valores al contexto del usuario → confirmar)
- Publicar skill: abre el flujo de publicación (toma la regla desde el editor y la anonimiza)
- Badge "Experto verificado": tooltip con criterios de verificación

**Heurísticas Nielsen aplicadas:**
- H1 (Visibilidad): contador de skills instaladas en el perfil del usuario
- H2 (Match con realidad): nombres de skills en lenguaje del dropshipper, no técnico
- H6 (Reconocimiento): thumbnails visuales con ícono del agente y tipo (gratuita/experto/premium)
- H8 (Diseño estético): cards premium diferenciadas visualmente (borde naranja sutil, badge dorado)

**Tokens de diseño:**
- Card base: `dropi-card.json` del DS Registry
- Badge "Gratuita": `$color-success-100` / `$color-success-700` (texto)
- Badge "Experto": `$color-primary` / blanco (texto)
- Badge "Premium": gradiente naranja-dorado del DS
- Grid: CSS Grid 3 columnas, `gap: $size-4`, responsive a 2 col en tablet y 1 col en mobile
- Filtros: `flex-wrap: wrap` + `gap: $size-2`

---

### Vista 6–8: Skills Hub unificado (`/gali-v5/skills`) — ✅ DONE

**Deep Reconstruction — Sprint C**

- **Route:** `/gali-v5/skills` (tabs: `mis-skills` | `crear` | `marketplace`)
- **Redirect:** `/gali-v5/marketplace` → `/skills`
- **Archivo:** `pages/skills/skills-page.component.{ts,html,scss}`
- **Mocks:** `mocks/gali-v5/user-skills.json`, `skills-marketplace.json` (embed)

**V6 — Mis Skills:** stats (activas/pausadas/ejecuciones), banner sugerencia Gali, filtros por agente/estado, cards con conectores MCP, CTA Editar → `SkillsEditorModalComponent`.

**V7 — Crear Wizard (4 pasos):** intención conversacional → canvas If/Then → conectores MCP + upload archivos → alcance + dry-run + activar.

**V8 — Marketplace tab:** embed de `MarketplacePageComponent` con filtros comunidad.

**Navegación:** accesible desde `HOME_OVERVIEW_PANEL` (Mis Skills, Marketplace) y `GALI_HUB_PREFIXES` en `dropi-sections.config.ts`.

---

### Vista 9: Caza Productos — Historial + Red de Problemas — ✅ DONE

**Deep Reconstruction — Sprint D**

- **Route:** `/gali-v5/productos/caza-productos`
- **Archivo:** `pages/caza-productos/caza-page.component.*`
- **Mock:** `mocks/gali-v5/problem-network.json`
- **Componente transversal:** `GaliChipComponent` (ADA Spy)

**Modos (segmented control):**
1. **Historial** — productos con fit-score desde nichos del usuario (ADA Spy)
2. **Red de Problemas** — búsqueda semántica + mapa de nodos + drawer lateral con productos/ángulos/perfiles
3. **Publicaciones** — grid original de publicaciones

**Interacciones clave:** click producto historial → Crear Proyecto (V4 pendiente); click nodo problema → drawer; CTA "Analizar con ADA Spy".

---

### Vista 10: CAS Bandeja — PQR Intelligence — 🟡 Parcial

**Deep Reconstruction — Sprint E**

- **Route:** `/gali-v5/cas/bandeja`
- **Archivo:** `pages/cas/cas-bandeja-page.component.*`
- **Mocks:** `mocks/gali-v5/cas-tickets.json`, `pqr-patterns.json`
- **Componente transversal:** `GaliChipComponent` (Chatea Pro)

**Implementado:**
- Panel derecho **Inteligencia PQR** con 5 patrones (insight cards, severidad, tendencia, CTA acción)
- CTAs navegan a Skills, Proyecto o acción inline según patrón
- Layout grid: bandeja | chat | PQR

**Pendiente del plan:**
- Columnas clasificación Gali + auto-respuesta en bandeja
- Filtro "Clasificados por Gali"
- Banner PQR en detalle de ticket
- Ampliar `cas-tickets.json` a 25+ items con `gali_classification` y `gali_response_status`

---

## 12. Deep Reconstruction — Arquitectura Transversal

> Fuente: plan `gali_v5_deep_reconstruction_3b6bb392.plan.md`

### Problema raíz que resuelve

Secciones construidas pero inaccesibles (`/proyectos`, `/marketplace`), Gali periférica (solo panel lateral), Skills sin sistema operativo. Las secciones eran islas.

### Tres capas de presencia Gali

| Capa | Qué es | Dónde |
|---|---|---|
| **0 — Navegación** | Proyectos + Skills en panel Gali (`HOME_OVERVIEW_PANEL`) | `dropi-sections.config.ts` |
| **1 — Shell persistente** | FAB + panel derecho 360px (Chat/Agentes/Señales) | `gali-v5-shell`, `gali-right-panel` |
| **2 — GaliChip por sección** | Pill agente + mensaje + CTA en header de cada módulo | `components/gali-chip/` |
| **3 — Hub Business OS** | Section Health Grid + loop cerrado + objetivo | `home/` |

### GaliChipComponent — contrato

```typescript
// Props
agentName: 'ADA Spy' | 'Roax' | 'Chatea Pro' | 'Vigilante' | 'Gali' | 'Agente Financiero'
message: string
count?: number
status: 'ok' | 'warn' | 'critical' | 'running' | 'neutral'
ctaLabel?: string
(ctaClick): EventEmitter
```

**Diseño:** pill `rgba(244,154,61,0.12)`, borde izquierdo 3px naranja, IBM Plex Sans 12px, dot pulsante si `running`.

**Integración actual:** Caza Productos, Skills, CAS. **Pendiente:** 7 secciones restantes.

### Skills como CORE

Ruta unificada `/gali-v5/skills` reemplaza marketplace aislado. El dropshipper define hiperpersonalización via:
- Skills propias (Mis Skills + wizard)
- Skills comunidad (Marketplace tab)
- Conectores MCP/apps/archivos (Paso 3 del wizard)

### Descubrimiento de productos (Caza)

Dos modos complementarios:
- **Historial:** ADA Spy cruza nichos vendidos → fit-score
- **Red de Problemas:** búsqueda por problema → grafo de nodos → productos + ángulos

### Retroalimentación CAS → inteligencia de negocio

Patrones PQR detectados en tickets alimentan:
- Panel PQR en CAS (V10)
- Penalización score ADA Spy del producto
- Sugerencias de script Chatea Pro / alerta proveedor

### Principios transversales (todas las vistas)

**Loop cerrado visible:** señal → acción → resultado → siguiente paso.

**Trust evolution:** Modo 0 (silencioso) → Modo 1 (aprobación) → Modo 2 (autopiloto con límites).

**Innovative UX:** Inter + IBM Plex Sans, primario `#f49a3d`, backgrounds `#fafaf8`, stagger en listas, dot pulsante en `running`/`critical`.

---

## Apéndice A — Estructura de Archivos Relevantes

```
src/app/pages/gali-v5/
├── gali-v5-shell.component.*           # Shell + panel derecho Gali
├── gali-v5.routes.ts                   # Rutas incl. /skills, /proyectos, redirect /marketplace
├── dropi-sections.config.ts            # Nav rail + HOME_OVERVIEW_PANEL (Skills, Proyectos)
├── home/                               # Gali Hub + Section Health Grid (V1)
├── pages/
│   ├── skills/                         # Skills Hub 3 tabs (V6–V8) ✅
│   ├── proyectos/                      # Lista proyectos (V2) 🟡
│   ├── proyecto/                       # Detalle proyecto (V3) ✅
│   ├── caza-productos/                 # Historial + Red Problemas (V9) ✅
│   ├── cas/                            # Bandeja + PQR panel (V10) 🟡
│   ├── marketplace/                    # Embed en Skills tab marketplace
│   ├── catalog/                        # Catálogo + ADA Spy bar
│   ├── orders/                         # Órdenes + triage Gali
│   ├── novedades/                      # Novedades + clasificación
│   ├── marketing/                      # ROAX, Campañas, Chatea Pro
│   ├── logistica/                      # Torre + Transportadoras
│   ├── reportes/                       # Dashboard KPI + P&L gap
│   └── financiero/                     # Wallet + Agente Financiero
├── components/
│   ├── gali-chip/                      # Chip transversal agente+CTA ✅
│   ├── gali-right-panel/               # Panel 360px Chat/Agentes/Señales ✅
│   ├── diagnostico-modal/              # Diagnóstico cross-data (V5) ✅
│   ├── skills-editor-modal/            # Editor reglas If/Then ✅
│   └── dropi-panel-splitter/           # Splitter panel nav ✅
└── services/
    └── gali-state.service.ts           # Estado global Gali (modo, señales, chat)

mocks/gali-v5/
├── user-skills.json                    # 12 skills usuario (V6) ✅
├── pqr-patterns.json                   # 5 patrones PQR (V10) ✅
├── problem-network.json                # Historial + red problemas (V9) ✅
├── cas-tickets.json                    # Tickets CAS + galiStatus ✅
├── skills-marketplace.json             # Marketplace comunidad
├── user-rules.json                     # Reglas editor skills
├── diagnostico-cross-data.json         # Hipótesis diagnóstico
├── orders.json, novedades.json         # Sprint 4
└── marketing-roax-informes.json        # ROAS real vs declarado
```

---

## Apéndice B — Tokens de Diseño Relevantes

Todos los valores de diseño viven en `src/styles/_variables.scss`. Los tokens más usados en gali-v5:

```scss
// Colores primarios
$color-primary: #F49A3D;             // Naranja Dropi — acciones principales, estado activo
$color-primary-light: #FEF3E3;       // Background de elementos primarios

// Colores de estado
$color-success-500: #22C55E;         // Loop positivo, etapa completada
$color-warning-500: #F59E0B;         // Señal de urgencia media, etapa en riesgo
$color-error-500: #EF4444;           // Señal de urgencia alta, restricción detectada
$color-neutral-100: #F5F5F5;         // Background de secciones secundarias

// Sombras
$shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
$shadow-md: 0 4px 12px rgba(0,0,0,0.12);
$shadow-lg: 0 8px 24px rgba(0,0,0,0.16);

// Radio
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;

// Spacing
$size-2: 8px;
$size-3: 12px;
$size-4: 16px;
$size-6: 24px;
$size-8: 32px;

// Tipografía
// Inter: todo el contenido informativo y de datos
// IBM Plex Sans: labels de menú y navegación
// Montserrat: avatares únicamente
```

---

*Fin del documento. Versión 5.1 · Deep Reconstruction · Mayo 2026 · Dropi AI Orchestrator.*

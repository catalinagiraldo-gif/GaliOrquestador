# Gali — Ajustes Arquitectónicos Jun 3, 2026

**Versión**: 1.0  
**Fecha**: Junio 3, 2026  
**Autora**: Sesión de trabajo Cata + equipo → sintetizado por IA  
**Base**: AlcancesIADropi.md · AlcancesIADropi2.md · Transcript Avancemos en Gali (Jun 2) · IA_Futuro de Interacción Humano-Mundo.md  
**Propósito**: Consolidar la visión arquitectónica de orquestación total — cómo el micromundo del usuario se conecta con el macromundo de Dropi, y cómo se habilitan nuevos canales y el modelo dual de e-commerce.

---

## Por qué este documento

El prototipo actual (v11.0) tiene la estructura correcta. Lo que falta es formalizar tres dimensiones que la sesión del Jun 2 dejó claras:

1. **La metadata del micromundo** del usuario no está estructurada — Gali no tiene un modelo formal de "quién es este usuario y qué negocio tiene"
2. **Los nuevos canales de venta** (TikTok Shop, Shopify, landing no-code) no están como MCPs en la arquitectura
3. **El modelo dual de e-commerce** (logístico + tecnológico) no está explícito como modelo de monetización diferenciada

Este documento los formaliza.

---

## BLOQUE 1 — El Micromundo del Usuario

El micromundo es la metadata personal del dropshipper. Hoy Dropi la tiene dispersa (pedidos, campañas, wallet). Gali necesita un **modelo de negocio unificado por usuario**.

### Qué compone el micromundo

| Dimensión | Datos | Fuente |
|---|---|---|
| **Perfil operativo** | Rol (dropshipper / proveedor / marca), nivel, volumen/semana, antigüedad | Onboarding + inferencia |
| **Grafo de negocio** | Proyectos activos → campañas → pedidos → proveedores → transportadoras | Dropi Core |
| **Historial de comportamiento** | Skills activados, alertas ignoradas, decisiones tomadas, reglas creadas | GaliWorkspaceService |
| **Documentos propios** | CSVs de pedidos, catálogos WMS, facturas, reportes externos | Upload / Drive MCP |
| **Objetivo declarado** | La meta de 30 días que Gali usa como filtro de relevancia para todo | GaliGoalOnboarding |

### Cómo se construye (3 vías)

**Vía 1 — Onboarding conversacional** (ya existe en v5.0, necesita profundización):
- Gali no repite lo que Dropi ya sabe
- Si el usuario lleva 6 meses, el onboarding parte del historial — no de cero
- 3 preguntas de alta señal: objetivo → canal principal → mayor fricción actual

**Vía 2 — Uploads de contexto** (nuevo):
- El usuario sube un CSV de su WMS, pega URL de su tienda Shopify, o conecta su Drive
- Gali extrae metadata estructurada: SKUs, volúmenes, zonas, márgenes
- Se construye el grafo de negocio desde esa data, no manualmente

**Vía 3 — Observación pasiva** (ya parcialmente implementado):
- Gali aprende qué alertas actúa el usuario, cuáles ignora, cómo responde
- Calibra el nivel de agencia según el comportamiento observado
- Después de 7 días de uso, el perfil de confianza ya tiene señal suficiente

### Principio fundamental del micromundo

> "Gali no te pregunta lo que Dropi ya sabe."

Si el usuario lleva 3 meses y tiene 40 pedidos semanales, Gali ya sabe eso. El onboarding no lo vuelve a preguntar — lo usa como baseline para personalizar la propuesta.

---

## BLOQUE 2 — El Macromundo de Dropi

El macromundo es lo que diferencia a Gali de cualquier Claude o ChatGPT genérico: **la data real del dropshipping LATAM**.

### Qué compone el macromundo

| Dataset | Qué contiene | Actualización |
|---|---|---|
| **Catálogo vivo** | 20.000+ productos, precios en tiempo real, stock por proveedor, tasas de devolución históricas | Continua |
| **Benchmark transportadoras** | Tasa de novedad por ciudad / semana / ruta — Coordinadora, Servientrega, Envía, Interrapidísimo | Diaria |
| **Inteligencia de mercado** | Qué productos escalan esta semana en Colombia / México / Chile | Semanal |
| **Patrones de riesgo** | Perfiles de huella digital del comprador final. Probabilidad de devolución por zona+historial+monto | Continua |
| **Base de skills colectiva** | Qué recetas usa la comunidad, con qué resultado, en qué contexto de mercado | Tiempo real |

### Cómo el macromundo se adapta al micromundo

```
Data global Dropi (macromundo)
    × Contexto específico del usuario (micromundo)
    = Insight hiperpersonalizado + Acción ejecutable
```

**El diferenciador real**: Dropi no le da a todos la misma lectura — le da a cada usuario la interpretación de la data global filtrada por su negocio específico.

Ejemplo:
- Macromundo: "Coordinadora tiene 15% de novedad en Bogotá esta semana"
- Micromundo: "Este usuario tiene 23 pedidos activos hacia Bogotá con Coordinadora"
- Output de Gali: "⚠️ Cambié 23 pedidos a Servientrega. Coordinadora lleva 3 días con 15%+ de novedad en Bogotá. Ahorré ~4 novedades estimadas."

Sin el micromundo, la alerta es genérica. Con él, es una acción ejecutada con contexto real.

---

## BLOQUE 3 — Arquitectura de Orquestación: Los 5 Agentes

Formalización de los agentes especializados. Actualmente el prototipo tiene 4 (Roax, Vigilante, Chatea Pro, ADA Spy). La visión completa tiene 5 con un **Agente de Finanzas** dedicado.

### Los 5 Agentes Especializados

| Agente | Color | Especialidad | Nivel de Agencia |
|---|---|---|---|
| **Roax** | `#f97316` naranja | Media Buyer / Campañas (Meta, TikTok, Google) | Autónomo dentro de límites del usuario |
| **Vigilante** | `#fbbf24` ámbar | Logística / Novedades / Smart Routing | Vigilante 24/7, escala anomalías |
| **Chatea Pro** | `#34d399` verde | Cierre / CAS / WhatsApp | Resolutivo en primera instancia |
| **ADA Spy** | `#818cf8` índigo | Research / Tendencias / Oportunidades | Proactivo — propone sin que se le pida |
| **Kronos** | `#60a5fa` azul | Finanzas / P&L / Facturación / Siigo | Analítico + alertante — nunca mueve dinero sin aprobación |

> **Nota de implementación**: Kronos puede reemplazar la función del "agente financiero" que hoy vive difuso entre el dashboard financiero y las señales. Darle nombre e identidad visual aumenta la confianza del usuario en las acciones financieras.

### La Capa Determinista (lo que hace a Gali confiable)

Antes de que cualquier LLM actúe, una capa simbólica valida:

1. ¿Esta acción viola alguna regla del usuario? (ej: "nunca pausar campañas entre 8am-10pm")
2. ¿El monto está dentro del umbral autorizado?
3. ¿La zona de entrega está en lista negra?
4. ¿El proveedor tiene stock suficiente para el pedido?

Si falla cualquier validación → el LLM no actúa → escala al usuario con contexto completo.

Esta capa es el fundamento de la confianza progresiva. Sin ella, el usuario no delega.

### El Loop Cerrado de Acción (principio más importante)

```
Señal detectada
    → Acción tomada (con contexto de por qué)
    → Resultado medible (before / after)
    → Siguiente paso propuesto (crear skill, ajustar regla)
```

Sin resultado visible, el usuario no confía. Sin propuesta de siguiente paso, no delega más. Este loop es lo que construye la confianza progresiva a lo largo del tiempo.

---

## BLOQUE 4 — Nuevos Canales de Venta

### Canal 1 — TikTok Shop (Compras Embebidas)

**Flujo**: El dropshipper sube un video a TikTok → TikTok Shop ejecuta la venta → el pedido llega a Dropi como si viniera del flujo normal.

**Arquitectura del MCP `TikTok Shop MCP`**:
- Recibe webhooks de órdenes TikTok Shop
- Gali mapea automáticamente el producto TikTok al SKU de Dropi
- El Vigilante toma el pedido desde ahí (mismo flujo logístico)
- Roax lee métricas del video (views, CTR, CVR) y las cruza con ROAS real

**Output de Gali**: "Tu video de 47s tuvo 3x más CVR que el de 90s. Para tu próximo lanzamiento en TikTok Shop, recomiendo formato corto con gancho en los primeros 3 segundos."

**UI requerida**:
- Sección en Conexiones: card "TikTok Shop" con estado de conexión y métricas del canal
- Señal específica cuando hay órdenes TikTok pendientes de confirmar
- En Dashboard Financiero: P&L desglosado por canal (Meta vs TikTok vs Shopify vs directo)

---

### Canal 2 — Landing Pages No-Code (Page Pilot / Page Builder)

**Flujo**: El dropshipper elige un ángulo de venta → Gali genera la landing completa alineada al ángulo → se publica en dominio propio o de Dropi.

**Arquitectura del MCP `Page Pilot MCP`**:
- Recibe el producto + ángulo + copies de Gali
- Genera la estructura HTML/CSS con el template seleccionado
- Devuelve URL publicada + métricas de conversión (si tiene pixel)
- Gali lee CVR de la landing y lo cruza con ROAS real de la campaña

**Diferenciador crítico**: La landing no es genérica — está construida desde la data de qué copies han convertido mejor para ese producto específico en LATAM.

**Conexión con el flujo actual**: El paso 3 de `NuevoProyectoPageComponent` ya tiene "Landing Preview". Conectar ese preview con Page Pilot MCP para que el "Publicar" sea real.

---

### Canal 3 — Shopify (Tienda Propia Conectada)

**Flujo**: El dropshipper ya tiene una tienda Shopify → quiere que Dropi la abastezca logísticamente.

**Arquitectura del MCP `Shopify MCP`**:
- Sincroniza catálogo Dropi → inventario Shopify en tiempo real (stock en ambas direcciones)
- Órdenes Shopify → flujo de Dropi automáticamente (mismo flujo que pedido manual)
- Tracking Dropi → estado de orden en Shopify (el cliente recibe actualizaciones)
- Kronos puede leer métricas de conversión de la tienda y cruzarlas con el P&L real

**Esto convierte a Dropi en el backend logístico de cualquier tienda Shopify LATAM**.

**UI requerida**:
- Card en Conexiones: "Shopify" con estado + métricas de sincronización
- Indicador en Pedidos: origen del pedido (Shopify / TikTok Shop / directo)
- En Proyectos: un proyecto puede tener como canal "Shopify" además de Meta/TikTok

---

### Canal 4 — WhatsApp Commerce (ya existe, formalizar)

**Flujo**: El dropshipper vende directo por WhatsApp → Chatea Pro gestiona el flujo conversacional.

**Lo que falta**:
- Gali gestiona el flujo completo (no solo notificaciones)
- Detecta intención de compra y envía formulario de pedido estructurado
- Valida dirección, anticipo y riesgo en el mismo hilo conversacional
- El pedido entra al sistema de Dropi sin que el dropshipper lo llene manual

---

## BLOQUE 5 — E-commerce Logístico + E-commerce Tecnológico

Esta es la dualidad de negocio que Dropi puede monetizar de forma diferenciada.

### Definición de cada capa

**E-commerce Logístico** — El negocio core de Dropi:
- Red de transportadoras (Coordinadora, Servientrega, Envía, Interrapidísimo)
- Smart Routing dinámico (Vigilante elige la mejor ruta en tiempo real)
- Gestión de novedades (Chatea Pro resuelve el 70-80% autónomamente)
- Seguimiento end-to-end por pedido
- **Revenue**: por flete de cada pedido enviado + servicio de novedades gestionadas por Gali

**E-commerce Tecnológico** — El negocio de plataforma:
- CRM conversacional (WhatsApp, Email, Chatea Pro)
- WMS en la nube (stock, proveedores, historial de calidad)
- Automatización de facturación (Siigo MCP, Kronos)
- Analytics e inteligencia (tráfico, conversión, huella digital)
- Tiendas virtuales (Shopify MCP, Page Pilot MCP)
- **Revenue**: suscripción Gali Pro (MCPs externos) + revenue share de Page Pilot + Marketplace de Skills premium

### El usuario que conecta ambas capas

El dropshipper avanzado no separa logística de tecnología. Su P&L tiene ambas como variables críticas. Gali es el único sistema que puede mostrar:

> "Tu ROAS de Meta es 2.9x. Pero tu ROAS real neto (descontando flete, novedad y garantías) es 1.7x. El 40% se va en novedades de Cali. Cambiando a Servientrega en esa ciudad, el ROAS real sube a 2.1x."

Eso es e-commerce logístico y tecnológico integrados en una sola lectura. **Ningún otro sistema LATAM puede hacer eso**.

---

## BLOQUE 6 — GenUI Progresiva: La Interfaz Adaptativa

Inspirado en el documento "IA: Futuro de Interacción Humano-Mundo" y en la arquitectura A2UI (Agent-to-UI): la interfaz no debe ser fija, debe revelarse según el nivel y contexto del usuario.

### Los 3 estados de complejidad

**Estado Cero** (usuario nuevo, sin data):
- 3 preguntas de alta señal → workspace con 2-3 módulos relevantes para su objetivo
- Todo lo demás oculto hasta que sea necesario
- Analogía de Diana: "panel sencillo estilo Intensamente — 3 emociones"

**Estado Activo** (usuario con proyectos en curso):
- Dashboard modular (drag & drop ya existe, profundizar)
- Gali propone el layout óptimo según el objetivo de la semana
- Alertas consolidadas — no múltiples notificaciones, una señal con jerarquía clara
- Tabs de dashboard personalizados por rol

**Estado Experto** (operador avanzado, múltiples proyectos):
- Grafo visual del negocio (nodos: proyectos → campañas → pedidos → P&L)
- Panel multi-agente en tiempo real
- Constructor de skills avanzado
- Marketplace con skills propias publicadas

### El principio de densidad progresiva

> La complejidad existe. Solo se revela cuando el usuario está listo para recibirla.

Gali decide qué mostrar según:
1. Objetivo declarado del usuario
2. Nivel de expertise (medido por comportamiento, no autodiagnóstico)
3. Momento del ciclo del proyecto (lanzamiento vs. escala vs. optimización)

---

## BLOQUE 7 — MCP Ecosystem: Prioridades de Implementación

### Prioridad 1 — Core (sprint 1-2)

| MCP | Función | Por qué primero |
|---|---|---|
| Meta Ads MCP | Leer métricas, pausar/escalar campañas desde Gali | Mayor capital del dropshipper |
| Siigo MCP | Facturación automática al estado "entregado" | Dolor contable #1 |
| WhatsApp Business MCP | Gestión completa de novedades y confirmaciones | Chatea Pro ya existe — formalizar |
| Coordinadora / Servientrega API | Smart Routing en tiempo real | Core de la ventaja logística |

### Prioridad 2 — Expansión (sprint 3-4)

| MCP | Función |
|---|---|
| TikTok Ads MCP | Métricas y gestión de campañas TikTok |
| TikTok Shop MCP | Ingesta de órdenes TikTok Shop |
| Shopify MCP | Sincronización bidireccional catálogo + órdenes |
| Page Pilot MCP | Generación de landing pages desde Gali |
| Google Sheets MCP | Export de reportes y P&L a hojas del usuario |

### Prioridad 3 — Ecosistema (sprint 5+)

| MCP | Función |
|---|---|
| ADA Spy / Minea MCP | Inteligencia de anuncios de competidores |
| AdCreative.ai MCP | Generación de creatives sin salir de Dropi |
| HeyGen MCP | Videos con avatar para demos de producto |
| Google Drive MCP | Almacenamiento de documentos del negocio |

---

## BLOQUE 8 — Los Límites que Construyen la Confianza

Gali nunca:
- **Mueve dinero sin aprobación explícita** (clic del dropshipper)
- **Cancela una campaña por completo** — solo pausa temporal con reporte de por qué
- **Toma decisiones de nicho o mercado** — propone, el humano confirma
- **Comparte datos de un usuario con otro** sin consentimiento explícito
- **Actúa sin contexto suficiente** — prefiere preguntar a adivinar cuando el riesgo es alto

El usuario define sus propios umbrales de agencia por proceso. Gali opera estrictamente dentro de esos límites.

---

## Hoja de Ruta de Prototipos

| Fase | Qué se prototipa | Bloque |
|---|---|---|
| Fase 0 ✅ | Chat + módulos + proyectos básicos + onboarding goal-based | Bloques 1, 3 parciales |
| Fase 1 — **siguiente** | Micromundo estructurado (grafo de negocio) · Loop cerrado completo · Alertas jerarquizadas (un solo tipo) | Bloques 1, 3, 6 |
| Fase 2 | Dashboard modular 3 estados · Proyectos multi-canal · Kronos (agente financiero dedicado) | Bloques 2, 3, 6 |
| Fase 3 | MCPs Core: Meta + Siigo + WhatsApp real + Smart Routing real | Bloques 3, 7 |
| Fase 4 | TikTok Shop · Shopify · Page Pilot integrado | Bloques 4, 5 |
| Fase 5 | Marketplace de Skills · Grafo de negocio visual · Comunidad activa | Bloques 3, 6 |

---

## Propuesta de Valor Consolidada

> **"Gali aprende contigo para que puedas escalar como un experto."**

Los tres diferenciadores reales:

1. **Hiperpersonalización**: Tú no te adaptas a Dropi — Dropi se adapta a tu modelo de negocio y operación
2. **Data + Ecosistema**: Te damos acceso a nuestra data de todo LATAM para que la uses como ventaja competitiva
3. **Escalabilidad sin fricción**: Gali actúa como Director de Operaciones 24/7 — el operador dirige, no opera

---

*Gali Ajustes Jun 3 · Cata Giraldo + equipo · catalina.giraldo@dropi.co*

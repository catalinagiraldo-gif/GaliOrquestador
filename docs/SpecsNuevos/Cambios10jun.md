# Plan Estratégico Gali V5 — Cambios 10 Jun 2026

> **Autor:** Análisis sobre `docs/Conocimientos/`, `docs/Descubrimientos/`, `docs/SpecsNuevos/` (Specs 1-8), sesiones de revisión Cata  
> **Fecha:** 2026-06-10  
> **Estado:** PLAN — no ejecutar hasta aprobación  
> **Principio rector:** Menos capas, más inteligencia visible. Gali debe sentirse como un CEO que reporta, no como un dashboard que acumula.

---

## 0. Diagnóstico Heurístico Consolidado

Antes de definir qué hacer, hay que entender el patrón sistémico de los problemas. Los 10 specs anteriores resuelven bugs puntuales; este plan ataca las **causas raíz** que los generan.

### 10 Heurísticas de Nielsen — Estado Actual de Gali V5

| # | Heurística | Estado | Problema central detectado |
|---|---|---|---|
| 1 | Visibilidad del estado del sistema | ⚠️ | 4 indicadores de estado compiten (pill Gali, score salud, alerta vigilante, signals counter). El usuario no sabe qué mirar primero. |
| 2 | Match con el mundo real | ✅ | El lenguaje colombiano (novedad, huella, escalar) es excelente. Es el punto más fuerte. |
| 3 | Control y libertad del usuario | ⚠️ | "Cambiar todos → Servientrega" sin confirmación. "Reconfigurar Gali" sin advertencia. Acciones masivas sin reversibilidad visible. |
| 4 | Consistencia y estándares | ❌ | Doble nav (Dropi clásico + Gali), "Academy" vs "Akademy", skills con propiedades de agentes, Autopilot en 3 lugares distintos. |
| 5 | Prevención de errores | ⚠️ | Sin confirmación para acciones de alto impacto. "Crear agente" no persiste. Datos inconsistentes (ROAS 1.93x ≠ 2.9x). |
| 6 | Reconocimiento vs recuerdo | ✅ | Contextual suggestions en Hub y Pedidos funcionan bien. Debilidad: wallet con descripciones en caps de sistema. |
| 7 | Flexibilidad y eficiencia | ⚠️ | Intent bar es potente, pero los botones flotantes no tienen labels. FAB sin menú. Modos sin destino real. |
| 8 | Diseño estético y minimalista | ❌ | **7 bloques de información en un viewport del Hub**. Cada pantalla tiene 3 capas de alertas. Es el problema más grave. |
| 9 | Ayudar a recuperarse de errores | ⚠️ | Errores de integración sin estructura consistente. Siigo "URGENTE" sin consecuencias visibles ni pasos de resolución. |
| 10 | Ayuda y documentación | ⚠️ | Ayuda contextual excelente (Gali explica en lenguaje natural). Sin acceso unificado: el usuario busca ayuda en secciones distintas. |

### Los 5 Problemas Sistémicos (causas raíz)

Todos los bugs que aparecen en `CorrecionesGali5.md`, `Correcionescata8jun.md` y `DesADIGali5.md` son síntomas de **5 causas raíz** que no se resuelven arreglando archivos sueltos:

**CR1 — Arquitectura expuesta como UI**  
El usuario ve "Agentes", "Skills", "Reglas", "Marketplace", "Conexiones" como ítems de nav de primer nivel. Esto contradice la promesa de que Gali opera "de fondo". La tubería técnica es visible y confunde al 90% de usuarios que no son desarrolladores.

**CR2 — Sin jerarquía de urgencia transversal**  
No existe un sistema centralizado de alertas. Cada módulo genera su propia alerta con su propia prioridad visual. El resultado: 3-4 banners compitiendo en cada pantalla, ninguno claramente "el más importante". El usuario desarrolla ceguera de banners (banner blindness).

**CR3 — Gali como chatbot, no como workspace**  
Un solo hilo de conversación acumulativo no escala. El usuario necesita hablar de Collar GPS en un contexto, de Meta Ads en otro, y de novedades de Cali en un tercero. El modelo Cursor/Claude Code de múltiples threads por contexto es el que corresponde a la promesa de Gali como orquestador.

**CR4 — Datos inconsistentes destruyen la confianza**  
Si el ROAS aparece como 1.93x en Reportes y 2.9x en Hub, el usuario no sabe en qué número confiar y no puede delegar decisiones a Gali. La confianza es el activo más importante de un orquestador de IA — y datos contradictorios la erosionan por completo.

**CR5 — El impacto de Gali es invisible**  
La propuesta dice "Gali te ahorra tiempo y dinero". Pero en ningún lugar del prototipo existe el número "Gali ejecutó 47 acciones esta semana · ahorró $420.000 en novedades evitadas · escaló 2 campañas con ROAS >2.5x". Sin ese número, el usuario no puede justificar emocionalmente por qué Gali es indispensable.

---

## 1. Principios de Rediseño para los Nuevos Specs

Antes de generar specs, estos son los principios que deben gobernar cada decisión de implementación:

### P1 — "Una pantalla, una historia"
Cada pantalla responde a UNA pregunta: Hub → "¿Qué pasa con mi negocio HOY?", Señales → "¿Qué debo decidir AHORA?", Proyectos → "¿Cómo va mi campaña X?". Si una pantalla responde más de una pregunta, debe dividirse o colapsarse.

### P2 — "La complejidad es premium"
El usuario novato ve exactamente lo que necesita para su próxima acción. El usuario experto puede activar capas adicionales. Nunca al revés. La vista "básica" no es una versión recortada — es la versión optimizada.

### P3 — "Gali reporta, no acumula"
Gali no debe mostrar más de 1 señal activa de alta prioridad simultáneamente. El resto va al buzón de señales con badge. La pantalla principal siempre debe estar "en calma" cuando todo funciona bien.

### P4 — "El impacto siempre es visible"
Cada acción que Gali ejecuta tiene un antes/después medible. Ese delta ($ ahorrados, pedidos confirmados, CTR mejorado) debe sumar en un contador acumulado visible desde el Hub.

### P5 — "Un lugar para cada cosa"
Autopilot: solo en la ficha del agente. Señales: solo en la vista Señales. Chat: solo en el panel lateral. Eliminar toda duplicación — aunque "parezca conveniente" tenerlo en dos lugares, siempre genera confusión.

---

## 2. Specs Nuevos a Crear

### Spec 9 — "HubNarrativa" (Refactor del Hub como historia de negocio)

**El problema**  
El Hub actual es un dashboard de KPIs con 7 bloques compitiendo. La visión dice que el Hub debe responder: "¿Qué pasa con tu negocio hoy?". Eso es una **historia**, no un grid de tarjetas.

**La propuesta**  
Reemplazar la estructura Hub actual por un modelo de 3 momentos secuenciales que el usuario lee de arriba a abajo:

```
┌─────────────────────────────────────────────────────────────────┐
│  MOMENTO 1 — El resumen de Gali (siempre primero)               │
│  "Hola [nombre]. Tu negocio va bien esta semana.                │
│   Hay 1 decisión que necesito de ti y 3 cosas que ya resolví." │
│  [Ver qué resolví →]  [Ver la decisión →]                       │
├─────────────────────────────────────────────────────────────────┤
│  MOMENTO 2 — La decisión pendiente (máximo 1 a la vez)          │
│  Full-width. Un solo card con TODA la info necesaria.           │
│  Contexto · Riesgo · Opciones · Impacto estimado               │
│  [Opción A]  [Opción B]  [Decidir después →]                   │
├─────────────────────────────────────────────────────────────────┤
│  MOMENTO 3 — El estado del negocio (en modo experto)            │
│  Ciclo de negocio: Producto→Marketing→Pedidos→Logística→Fin    │
│  Colapsable por defecto en modo básico.                         │
└─────────────────────────────────────────────────────────────────┘
```

**Tareas del spec:**  
- C1: Crear componente `gali-hub-brief` (Momento 1) — resumen narrativo de Gali en lenguaje natural, derivado de signals del mock  
- C2: Crear componente `gali-decision-theater` (Momento 2) — una decisión full-width con full context  
- C3: Mover `mission__anatomy` (ciclo de negocio) al Momento 3, colapsable por defecto  
- C4: Eliminar del layout principal: double-chat, banner vigilante duplicado, insight card flotante  
- C5: Implementar "1 alerta primaria" como regla CSS-level: `gali-alert[data-priority="secondary"]` se oculta automáticamente si hay un `[data-priority="critical"]` activo  
- C6: El Hub en "Modo calma" (sin decisiones pendientes, todo OK) debe mostrar un estado vacío positivo: "Todo está corriendo. Última acción de Gali: hace 12 min · escaló campaña +15%."

**Anti-saturación:**  
- El Hub nunca muestra más de 1 decisión pendiente a la vez  
- Las otras decisiones están en cola: badge con contador en el header  
- El ciclo de negocio solo aparece si el usuario lo activa (o en modo experto)

**Innovación:**  
El "brief" de Gali es generado con template dinámico desde los signals del mock. No es texto hardcodeado — tiene lógica condicional: si ROAS > objetivo → "Tu negocio va bien", si hay decisión crítica → "Hay algo que necesito de ti". Esto materializa la promesa de "Gali como Director que reporta".

---

### Spec 10 — "WorkspaceChat" (Multi-thread conversacional como Cursor)

**El problema**  
Un solo chat acumulativo no puede manejar simultáneamente conversaciones sobre productos, campañas, novedades y finanzas. El contexto se contamina. El usuario no puede volver a una conversación anterior. Gali "olvida" el contexto de proyectos previos.

**La propuesta**  
Modelo de threads múltiples en el panel lateral de Gali. Cada thread tiene un contexto específico y se puede fijar, archivar u organizar.

```
PANEL GALI — WORKSPACE CONVERSACIONAL
┌───────────────────────────────────────┐
│  🧠 Gali                    [+ Nuevo] │
│  ─────────────────────────────────── │
│  📌 FIJADOS                           │
│  ● Collar GPS — campaña Meta          │
│    "Aumenté presupuesto 15%..."       │
│  ─────────────────────────────────── │
│  POR PROYECTO                         │
│  💬 Collar GPS                        │
│  💬 Skincare K-Beauty                 │
│  ─────────────────────────────────── │
│  POR AGENTE                           │
│  💬 Roax — campañas                   │
│  💬 Vigilante — novedades             │
│  💬 Kronos — P&L                      │
│  ─────────────────────────────────── │
│  💬 Sin categoría                     │
└───────────────────────────────────────┘
```

**Tareas del spec:**  
- C1: Refactorizar `gali-right-panel.component` para soportar array de threads (local state)  
- C2: Crear componente `gali-thread-list` con secciones Fijados / Por Proyecto / Por Agente  
- C3: Botón "Nuevo thread" abre un thread vacío con selector de contexto (proyecto, agente, o libre)  
- C4: Cada thread mantiene su historial de mensajes independiente (signal o array en memoria)  
- C5: Thread de proyecto pre-cargado con el contexto del proyecto al abrir desde un card de proyecto  
- C6: Thread de agente pre-cargado con las acciones recientes del agente seleccionado  
- C7: Respuestas de Gali incluyen "rich cards" además de texto: gráficos de ROAS inline, resumen de pedidos, botones de acción directa  
- C8: Al "fijar" un thread, sube a la sección FIJADOS y persiste en localStorage

**Innovación:**  
Las respuestas de Gali no son solo texto. Cuando Gali reporta ROAS, muestra un micro-gráfico de tendencia. Cuando reporta novedades, muestra un mini-mapa de ciudad. Esto convierte el chat en un workspace visual, no un chatbot de texto.

---

### Spec 11 — "AgentesVivos" (Agentes con actividad visible en tiempo real)

**El problema**  
Los agentes son "decorativos": existen como tarjetas con nombres, pero no muestran qué están haciendo ahora, qué hicieron ayer, ni cómo configurarlos realmente. Crear un agente no persiste. Autopilot está en 3 lugares sin coherencia.

**La propuesta**  
Cada agente tiene una **ficha viva** con 3 tabs: Estado actual / Configuración / Historial de acciones.

**Tareas del spec:**  
- C1: Crear componente `agent-card-alive` que en el listado muestra: avatar del agente, estado en tiempo real (ejecutando X / en espera / pausado), última acción realizada hace X minutos  
- C2: Ficha de agente con 3 tabs:
  - Tab "Ahora": feed en tiempo real de qué está monitoreando, acción más reciente con antes/después  
  - Tab "Configurar": autopilot toggle + umbral de autonomía + skills asignadas + reglas activas — TODO en un solo lugar  
  - Tab "Historial": timeline de las últimas 50 acciones, filtrable por tipo (ejecutó / alertó / esperó aprobación)  
- C3: `launchAgent()` debe persistir el agente en el array `agentes` (signal) y mostrar animación "Gali está configurando [nombre]..." por 1.5s antes de cambiar estado a "Activo"  
- C4: Wizard de crear agente ampliado a 5 pasos:
  - Paso 1: Nombre + rol libre (textarea con placeholder y chips de sugerencia)  
  - Paso 2: Skills — buscador con `@mention`, grouping por categoría  
  - Paso 3: Regla inicial — editor If-Then visual + botón "Gali ayúdame a redactar esta regla"  
  - Paso 4: Autopilot — toggle + slider umbral de autonomía (0-100%)  
  - Paso 5: Revisión + confirmar (resumen visual antes de lanzar)  
- C5: Autopilot centralizado: quitar referencias de mode-bar, skills, y chat. Solo en Tab "Configurar" de la ficha del agente. Mode-bar muestra solo indicador: "● 3 agentes en autopilot" con link a Agentes  
- C6: Badge en cada agente en el listado: "Autopilot ON" naranja si está activo  
- C7: Remover card "Crear mi agente — PRÓXIMAMENTE" y quitar `data-proto-skip` del botón principal

**Innovación:**  
El **Activity Feed** de cada agente funciona como un git log de decisiones de negocio. El usuario puede ver: "Vigilante detectó 15% de novedad en Bogotá → cambió 12 pedidos a Servientrega → ROAS sin afectar". Esto hace visible el valor real del agente de manera narrativa.

---

### Spec 12 — "SignalCenter" (Centro de inteligencia de señales: predictivo + reactivo)

**El problema**  
Las señales y alertas son puramente reactivas (novedades, CTR bajo). La visión de Gali dice que el diferenciador es la parte **predictiva**: "en 14 días, tu segmento de mascotas se satura" o "hay una ventana de mercado en Cali esta semana". Eso no existe en el prototipo.

**La propuesta**  
Separar definitivamente en dos zonas:

```
SEÑALES — GALI INTELLIGENCE CENTER
┌─────────────────────┬──────────────────────────────────────┐
│ 🔮 SEÑALES         │  PANEL DETALLE                        │
│ (predictivas)       │                                       │
│ ─────────────────  │  Señal: Ventana de mercado en Cali    │
│ ⚡ Ventana Cali    │  Gali detectó que el volumen de       │
│   Próx 7 días      │  búsquedas de "collar mascotas" en    │
│                     │  Cali subió 34% esta semana.          │
│ 📈 Mascotas sube   │                                       │
│   Oportunidad      │  Datos base: 847 búsquedas locales    │
│                     │  vs 631 semana anterior.              │
│ 🔄 Saturación Meta │                                       │
│   Pronto           │  Ventana: 10-14 días antes de que     │
│                     │  competidores reaccionen.             │
├─────────────────────│                                       │
│ 🚨 ALERTAS         │  Acción recomendada:                   │
│ (reactivas)         │  "Lanzar creatividad nueva en Cali    │
│ ─────────────────  │   con ángulo emocional (mascotas)     │
│ ⚠️ Coordinadora   │   antes del viernes."                 │
│   15% novedad      │                                       │
│                     │  [Crear proyecto ahora →]             │
│ 🔴 Stock bajo       │  [Guardar para después]               │
│   Collar GPS 12u   │  [Ignorar esta señal]                 │
└─────────────────────┴──────────────────────────────────────┘
```

**Tareas del spec:**  
- C1: Crear vista `/gali-v5/senales` con layout dos columnas: lista izquierda + detalle derecho  
- C2: Lista izquierda con dos secciones claramente diferenciadas: "Señales" (🔮 ícono) y "Alertas" (🚨 ícono)  
- C3: Crear mock `mocks/gali-v5/senales.mock.ts` con al menos:
  - 5 señales predictivas (oportunidades de mercado, saturación futura, ventanas de precio)  
  - 5 alertas reactivas (novedades, stock bajo, CTR caído, ROAS bajo umbral)  
- C4: Cada señal tiene: tipo (predictiva/reactiva), urgencia, ventana de tiempo, datos base, acción recomendada, CTA  
- C5: Botones del header (Lanzar / Medir / Operar) ahora SÍ tienen destino:
  - Operar → filtra lista solo mostrando alertas activas que necesitan acción  
  - Lanzar → abre /proyectos/nuevo pre-relleno con el contexto de la señal seleccionada  
  - Medir → abre thread de Kronos en Gali chat con datos de la señal  
- C6: Signal card en Hub (Momento 2) hace deep link a señal específica en `/gali-v5/senales?signalId=X`  
- C7: Badge en nav: número de señales activas sin atender (predictivas en naranja, alertas en rojo)  
- C8: Las señales predicen con contexto de la red Dropi: "Según 1.200 dropshippers en Colombia esta semana..."

**Innovación:**  
La distinción entre señal predictiva (oportunidad) y alerta reactiva (problema) **cambia el modelo mental del usuario**. Gali deja de ser un sistema de alarmas para convertirse en un estratega que ve el futuro. Esta es la diferencia entre "tu tienda está en fuego" y "hay una ventana de mercado antes de que llegue la competencia". Esa segunda voz es la que crea dependencia del producto.

---

### Spec 13 — "ProyectoCanvas" (Proyectos como historias vivas con ciclo completo)

**El problema**  
Los proyectos solo muestran el estado "en campaña activa". No existen proyectos recién lanzados, proyectos fallidos, ni proyectos en borrador. El usuario no puede ver la diferencia entre estas fases. Las tabs de Producto / Estrategia / Campañas / Pedidos están vacías con "Ir al módulo →". La calculadora costo→precio desapareció.

**La propuesta**  
Un proyecto es una historia con ciclo completo. Su UI debe mostrar dónde está en esa historia.

```
PROYECTO — COLLAR GPS PARA MASCOTAS
Estado: ● En escala    Semana 3 de campaña activa

┌──── Timeline ──────────────────────────────────────────────┐
│ Lanzado 18 may → Primeros datos 19 may → Escalado 24 may  │
│              [Estás aquí →]                                 │
└────────────────────────────────────────────────────────────┘

┌── Producto ──┬── Campaña ──┬── Pedidos ──┬── Agentes ──┐
│ Collar GPS   │ ROAS 1.93x  │ 47/sem      │ 4 activos  │
│ Stock: 847   │ $66k/día    │ Novedad 6%  │ 1 alerta   │
└──────────────┴─────────────┴─────────────┴────────────┘

ACCIONES DE LOS AGENTES (últimas 24h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 Roax · hace 2h   → Escaló presupuesto 15% ($57k→$66k) · ROAS mejoró 0.3x
🟡 Vigilante · 4h   → Alertó: novedad en Cali subió a 9%. Esperando decisión.
✅ Vigilante · ayer  → Cambió 8 pedidos de Coordinadora a Servientrega · 0 novedades.
```

**Tareas del spec:**  
- C1: Crear componente `proyecto-timeline` — barra horizontal que muestra las fases del proyecto con el estado actual marcado  
- C2: Las tabs de Producto / Campaña / Pedidos dejan de ser placeholders — mostrar datos reales filtrados por `proyectoId` del mock  
- C3: Crear sección "Acciones de los agentes" — timeline vertical, reemplaza "Loops". Formato: agente + tiempo + descripción + impacto medido  
- C4: Calculadora brújula de precio (paso de nuevo proyecto):
  - Input: Costo producto + Flete  
  - Output en tiempo real: precio de venta mínimo (break-even), precio recomendado (2.5x margen), margen proyectado  
  - Slider para ajustar precio con margen visual  
- C5: Presupuesto con recomendación de Gali: badge "Gali sugiere $25.000/día" basado en pedidos objetivo y ROAS histórico  
- C6: Al lanzar proyecto: modal de confirmación con animación "Gali está configurando tu proyecto..." (2s) + navegación automática al detalle  
- C7: Diversificar `projects.json`:
  - Estado `recien_lanzado`: mensaje "Primeros datos en 24h — Gali está aprendiendo tu campaña"  
  - Estado `pausado`: causa del pause + diagnóstico de Roax (3 factores) + recomendación  
  - Estado `cerrado`: postmortem completo (qué funcionó, qué no, lección aprendida)  
  - Estado `borrador`: progress bar de cuánto falta para lanzar  
- C8: Deep link señales del proyecto: cada alerta en proyecto-detalle navega a `/gali-v5/senales?signalId=X&projectId=Y`  
- C9: En nuevo proyecto — paso "Agentes asignados" reemplaza "Skills que se activarán". Los 5 agentes con toggle individual. Roax pre-seleccionado.

**Innovación:**  
El **timeline del proyecto** convierte la experiencia en una historia con capítulos. El usuario puede ver dónde está en el ciclo de vida, qué pasó antes, y qué viene después. Los proyectos fallidos tienen postmortem narrativo de Gali — no son fracasos, son aprendizajes documentados. Esto materializa el aprendizaje continuo que la visión promete.

---

### Spec 14 — "OntologiaViva" (Skills ≠ Agentes ≠ Reglas — diferenciación total)

**El problema**  
Skills muestran trigger/condición/acción (propiedades de Agentes). El usuario no puede distinguir qué es cada cosa. La documentación conceptual está al fondo de la página de Agentes donde nadie la lee. La jerarquía real (Gali orquesta → Agentes ejecutan → usando Skills → gobernados por Reglas) nunca se muestra visualmente de forma clara.

**La propuesta**  
Un único lugar donde la ontología se enseña: la primera vez que el usuario llega a Agentes/Skills, Gali hace una explicación visual de 20 segundos. Luego cada elemento refleja su rol real en la UI.

**Definiciones vinculantes (usar en TODO el prototipo):**

| Concepto | Qué es | Analogía colombiana |
|---|---|---|
| **Skill** | Capacidad que un agente puede usar. Como un herramienta en la caja. NO necesita trigger propio. | "La destreza del mecánico" |
| **Agente** | Ejecutor especializado con objetivo, reglas y autonomía. Usa Skills. Tiene trigger/condición/acción. | "El mecánico especializado" |
| **Regla** | Instrucción explícita que limita o define cuándo actúa un agente. IF-THEN en lenguaje natural. | "Las instrucciones del jefe al mecánico" |
| **Gali** | El orquestador que coordina todos los agentes, interpreta el negocio, y reporta al dropshipper. | "El gerente general" |

**Tareas del spec:**  
- C1: Skills page — eliminar trigger/condición/acción de las cards. Mostrar: Nombre + Descripción libre + Badge "Agentes que la usan" (chips clickeables) + Status  
- C2: En detalle de cada skill: añadir "Agentes que usan esta skill" con botón "+ Asignar a otro agente" (dropdown con agentes disponibles)  
- C3: Rediseñar diagrama "Gali orquesta" — reemplazar árbol SVG saturado por grid limpio: Gali al centro, 5 agentes como cards alrededor, dentro de cada card sus 2-3 skills principales como chips. Sin SVGs de líneas, solo layout flexbox  
- C4: Reglas — añadir a cada regla: badge "Agente asignado" + editor libre (textarea con "Describe la regla en lenguaje natural") + botón "Gali, ayúdame a mejorarla" (pre-rellena un ejemplo)  
- C5: Primera visita a Agentes: tooltip onboarding de 20 segundos con la jerarquía Gali → Agente → Skill → Regla (puede cerrarse con "Ya entendí")  
- C6: Marketplace: separar en tab propia con título "Marketplace" claramente diferenciado del listado de "Mis skills". Marketplace de skills + futuro marketplace de agentes + reglas + conexiones MCP  
- C7: Unificar tipografías: skills-comunidad-page.scss debe usar variables DS (`$font-primary`, `$font-menu`) sin hardcoding  
- C8: Forks → renombrar a "Copias de la comunidad" (en español, sin jerga GitHub)

---

### Spec 15 — "ImpactoGali" (El ROI acumulado de Gali — el activo de confianza)

**El problema**  
Ninguna pantalla muestra el valor total que Gali ha entregado. El dropshipper no puede justificar emocionalmente por qué Gali es indispensable. "Gali te ahorró $420.000 en novedades este mes" no existe en ningún lugar del prototipo.

**La propuesta**  
Un widget persistente y una vista dedicada que acumula el impacto de Gali en el tiempo.

```
IMPACTO DE GALI ESTA SEMANA
┌──────────────────────────────────────────────────┐
│  ✦ Gali en números (semana 21)                   │
│  ─────────────────────────────────────────────── │
│  127 acciones ejecutadas                         │
│  $420.000 ahorrados (novedades evitadas)         │
│  2 campañas escaladas (+15% ROAS promedio)       │
│  3 señales de mercado detectadas                 │
│  41h que no tuviste que dedicar a la operación   │
│                                                  │
│  [Ver historial completo →]                      │
└──────────────────────────────────────────────────┘
```

**Tareas del spec:**  
- C1: Crear modelo de datos `GaliImpactLedger` — array de acciones con: timestamp, agente, tipo_acción, descripción, impacto_$ estimado (hardcodeado en mock)  
- C2: Widget `gali-impact-widget` visible en Hub (Momento 3, modo experto) y en la ficha de cada agente  
- C3: Vista `/gali-v5/impacto` (accesible desde Hub + menú de perfil) con historial semanal y acumulado  
- C4: Calcular desde mock: novedades_evitadas × costo_promedio_novedad, campañas_escaladas × delta_ROAS, acciones_autónomas  
- C5: Métricas del spec de negocio visibles: % acciones iniciadas por Gali (objetivo: >40%) y % loops con resultado visible (objetivo: >80%)  
- C6: En la ficha de cada agente: mini-resumen de impacto del agente específico (ej: "Vigilante · 8 novedades evitadas esta semana · $220.000 ahorrados")  
- C7: Comparación temporal: "Esta semana Gali ahorró más que la semana pasada ↑12%"  
- C8: Hito gamificado: al superar $1M en ahorro acumulado, Gali celebra con un mensaje especial y badge para el dropshipper

**Innovación:**  
El impacto acumulado convierte a Gali en un socio con historial, no en una herramienta de sesión. El dropshipper que lleva 3 meses con Gali tiene un registro de valor que le cuesta abandonar. Es el equivalente al "cuánto tiempo has ahorrado" de Grammarly o la "energía generada" de un panel solar. La adherencia al producto crece con el impacto visible acumulado.

---

### Spec 16 — "GlosarioInteligente" (Explicabilidad radical sin salir de contexto)

**El problema**  
PIL, ROAS, P&L, "diagnóstico cruzado", "huella vigilante", "capa determinista" — términos técnicos que el dropshipper promedio no maneja. La visión dice que Gali democratiza la consultoría de alto nivel. Eso requiere que el lenguaje de alto nivel se traduzca automáticamente.

**La propuesta**  
Un sistema de tooltips y explicaciones contextuales que Gali dispara automáticamente la primera vez que el usuario ve cada término, y que están siempre disponibles con un clic.

**Términos a cubrir (mínimo obligatorio):**

| Término | Explicación para el dropshipper |
|---|---|
| ROAS | "Por cada $1 que gastas en anuncios, cuánto en ventas recuperas. ROAS 2x = $2 en ventas por $1 de pauta. Mínimo para no perder: depende de tu margen." |
| PIL | "Porcentaje de Inventario Liquidable: qué tan fácil venden tus productos vs cuánto tienes en stock." |
| P&L | "Ganancias y pérdidas: cuánto entró menos cuánto salió. Tu utilidad real, no el ROAS de Meta." |
| CPA | "Costo por adquisición: cuánto te costó conseguir una venta. Incluye anuncio + flete + novedad." |
| Diagnóstico cruzado | "Gali compara tus proyectos entre sí para encontrar patrones — qué tienen en común los que funcionan y los que no." |
| Huella Vigilante | "El registro de cada decisión que tomó Vigilante sobre un pedido: qué detectó, qué hizo, cuándo." |
| LTV | "Valor de vida del cliente: cuánto en total te comprará un cliente durante toda su relación contigo." |
| Novedad | "Cualquier problema en la entrega de un paquete: cliente no contestó, dirección incorrecta, paquete perdido." |

**Tareas del spec:**  
- C1: Crear directiva Angular `galiGlosario` que envuelve cualquier término con tooltip explicativo y ícono ⓘ  
- C2: Aplicar la directiva en: Dashboard Financiero (PIL, P&L), Hub (ROAS, diagnóstico cruzado), Pedidos (novedad, huella), Agentes (CPA, LTV)  
- C3: El tooltip tiene dos niveles: "Explicación simple" (1 línea) y "Ver más" que expande a ejemplo práctico  
- C4: "Ferrín completado" → eliminar completamente → reemplazar por "Perfil completado X%" con checklist de qué falta  
- C5: Onboarding — eliminar pregunta "¿Cuántos pedidos tienes?" (Dropi lo sabe). Eliminar "¿Cuánto tiempo llevas en Dropi?" (dato del sistema)  
- C6: Si el usuario es nuevo (0 pedidos), onboarding muestra: "Gali irá aprendiendo de tu operación. Cuéntame qué quieres lograr en los próximos 30 días"  
- C7: Si el usuario tiene pedidos, el onboarding los pre-muestra: "Tienes 47 pedidos esta semana. ¿Cuál es tu objetivo para este mes?"  
- C8: Tooltips adaptativos: si el usuario ha visto el término >3 veces, el ícono ⓘ desaparece (se lo aprendió). Se guarda en `localStorage`

---

## 3. Modificaciones a Specs Existentes (1-8)

Los specs 1-7 ya están ejecutados. El spec 8 está escrito pero no ejecutado. Aquí se documentan ajustes necesarios para que los nuevos specs no generen conflictos.

### Modificaciones al Spec 3 (HubNegocio)

**Ajuste requerido:** El Hub tiene 3 zonas (Zona 1: Decisiones, Zona 2: Ciclo de Negocio, Zona 3: Chat + Akademy). El Spec 9 (HubNarrativa) propone reemplazar esa estructura por el modelo Momento 1/2/3.

**Resolución:** Spec 9 extiende Spec 3, no lo revierte. Las 3 Zonas pasan a ser los 3 Momentos con renombramiento. La lógica de `complexityLevel` se mantiene. El componente `mission__anatomy` permanece en Momento 3.

### Modificaciones al Spec 4 (Señales)

**Ajuste requerido:** Spec 12 (SignalCenter) crea una vista de señales más completa con distinción predictiva/reactiva y botones de modo funcionales.

**Resolución:** Spec 12 extiende la ruta `/gali-v5/senales` creada en Spec 4. El componente `senales-page.component` recibe las nuevas secciones sin eliminar las existentes. Los mocks se amplían.

### Modificaciones al Spec 5 (ZeroState)

**Ajuste requerido:** Spec 16 (GlosarioInteligente) elimina preguntas redundantes del onboarding que aún pueden estar en Spec 5.

**Resolución:** Spec 16 actúa sobre `gali-goal-onboarding.component.ts` — elimina solo los steps `pedidosPerWeek` y `tiempoEnDropi`. No toca la estructura de steps de Spec 5.

### Modificaciones al Spec 8 (AuditoriaJun8)

**Ajuste requerido:** Spec 8 tiene tareas que se solapan con los nuevos specs (C5-C7 del Grupo B son parte de Spec 14; C6 del Grupo C es parte de Spec 11; C13-C14 son parte de Spec 16).

**Resolución:** Ejecutar Spec 8 primero como está. Los specs 9-16 extienden y completan lo que Spec 8 inicia. No reimplementar si Spec 8 ya cerró los CAs correspondientes.

---

## 4. Arquitectura de Información Renovada

El cambio más importante no es de componentes — es de arquitectura de información. El sidebar debe reflejar el modelo mental correcto:

### Nav actual (problemática)
```
DROPI CLÁSICO          GALI (superpuesto)
Pedidos                Gali Hub
Logística              Proyectos
Reportes               Mi Negocio
Financiero             Agentes          ← arquitectura expuesta
Marketing              Skills           ← arquitectura expuesta
CAS                    Reglas           ← arquitectura expuesta
Academy                Marketplace      ← arquitectura expuesta
                       Conexiones       ← arquitectura expuesta
```

### Nav propuesta (orientada al trabajo del usuario)
```
GALI HUB               (dashboard narrativo)
SEÑALES                (señales + alertas)
MIS PROYECTOS          (canvas de proyectos)
──────────────────
OPERAR
  Pedidos
  Logística / Torre
  Novedades
CRECER
  Marketing / Campañas
  Productos / Catálogo
FINANZAS
  Wallet / Historial
  Reportes
──────────────────
[Centro de control ⚙]  ← Agentes, Skills, Reglas, Conexiones aquí
Academy
```

El "Centro de control" es una sección de configuración avanzada accesible, pero no de primer nivel. El usuario cotidiano nunca necesita ver "Reglas" en su navegación diaria — las reglas están configuradas y operando en background.

---

## 5. Anti-Saturación — Reglas de Sistema para Implementar

Estas reglas deben implementarse como directivas o guards globales para que **ningún spec futuro** pueda volver a saturar visualmente las pantallas:

### Regla ALS-1 — Máximo 1 alerta primaria por pantalla
```typescript
// En cada page component:
// Si existe un alertPrimaria activo, ocultar automáticamente
// todos los elementos con data-priority="secondary"
// Implementar como directive: AlertHierarchyDirective
```

### Regla ALS-2 — Panel "¿Qué quieres hacer?" solo en modo novato
```typescript
// El intent bar global (header) siempre existe.
// El chat secundario en el cuerpo del Hub SOLO aparece si
// complexityLevel === 'novice' Y NO hay alertPrimaria activo.
```

### Regla ALS-3 — Acciones masivas requieren confirmación 2 pasos
```typescript
// Cualquier acción que afecte más de 1 entidad o sea irreversible
// debe mostrar un modal de confirmación que incluya:
// - Número de entidades afectadas
// - Impacto estimado
// - Indicación si es reversible o no
// Excepciones: acciones de solo-lectura
```

### Regla ALS-4 — Datos de ROAS desde fuente única
```typescript
// mocks/gali-v5/projects.json es la ÚNICA fuente de ROAS, márgenes,
// presupuesto y pedidos. No hardcodear en ningún TS.
// Si un componente necesita un dato financiero, debe importarlo
// desde el mock service, nunca definirlo inline.
```

---

## 6. Priorización de Implementación

### Prioridad P0 — Resolver hoy (bloquean la demo)

| # | Spec | Qué resuelve | Impacto emocional |
|---|---|---|---|
| 1 | **Spec 8** (ya escrito) | Hub jerarquía, agentes persistentes, ontología básica | El Hub "tiene sentido" al primer vistazo |
| 2 | **Spec 9 — HubNarrativa** | Elimina saturación visual, 1 decisión a la vez | El usuario sabe qué hacer en los primeros 30 segundos |
| 3 | **Spec 12 — SignalCenter** | Señales funcionales con destino, distinción predictiva/reactiva | Gali parece "inteligente" no solo "ruidosa" |

### Prioridad P1 — Próxima iteración (consolidan la propuesta)

| # | Spec | Qué resuelve | Impacto emocional |
|---|---|---|---|
| 4 | **Spec 11 — AgentesVivos** | Agentes con actividad real, wizard completo | El dropshipper entiende qué hace cada agente |
| 5 | **Spec 13 — ProyectoCanvas** | Proyectos con ciclo completo, calculadora, estados variados | Los proyectos cuentan una historia |
| 6 | **Spec 16 — GlosarioInteligente** | PIL, ROAS, P&L explicados en contexto | Principiante puede entender todo sin formación |

### Prioridad P2 — Próximas semanas (diferencian el producto)

| # | Spec | Qué resuelve | Impacto emocional |
|---|---|---|---|
| 7 | **Spec 15 — ImpactoGali** | ROI acumulado visible | El dropshipper no puede imaginarse sin Gali |
| 8 | **Spec 10 — WorkspaceChat** | Multi-thread por proyecto/agente | La conversación con Gali escala |
| 9 | **Spec 14 — OntologiaViva** | Skills ≠ Agentes en toda la UI | El modelo mental del usuario es correcto |

---

## 7. Mapa de Dependencias entre los Nuevos Specs

```
Spec 8 (AuditoriaJun8) — EJECUTAR PRIMERO
    │
    ├── Spec 9 (HubNarrativa) — necesita zonas del Hub del Spec 3 + alertas del Spec 4
    │       └── Spec 15 (ImpactoGali) — Momento 3 del Hub nuevo
    │
    ├── Spec 12 (SignalCenter) — extiende ruta de Spec 4 (Señales)
    │       └── Spec 13 (ProyectoCanvas) — deep links señales necesitan SignalCenter
    │
    ├── Spec 11 (AgentesVivos) — sobre base de Spec 8 (C8/C9)
    │       └── Spec 14 (OntologiaViva) — rediseño skills/reglas sobre base de agentes funcionales
    │
    ├── Spec 16 (GlosarioInteligente) — puede ejecutarse en paralelo con cualquier spec
    │
    └── Spec 10 (WorkspaceChat) — independiente, puede ejecutarse al final
```

**Orden de ejecución recomendado:**
```
Spec 8 → Spec 9 → Spec 12 → Spec 11 → Spec 13 → Spec 16 → Spec 15 → Spec 14 → Spec 10
```

---

## 8. Resumen Ejecutivo del Plan

| Problema sistémico | Spec que lo resuelve |
|---|---|
| Hub saturado con 7 bloques competidores | Spec 9 — HubNarrativa |
| Chat único que no escala | Spec 10 — WorkspaceChat |
| Agentes decorativos sin actividad visible | Spec 11 — AgentesVivos |
| Señales solo reactivas, nunca predictivas | Spec 12 — SignalCenter |
| Proyectos sin ciclo completo ni calculadora | Spec 13 — ProyectoCanvas |
| Skills confundidas con Agentes | Spec 14 — OntologiaViva |
| Impacto de Gali invisible | Spec 15 — ImpactoGali |
| Términos técnicos sin explicación | Spec 16 — GlosarioInteligente |
| Datos inconsistentes (ROAS 1.93 ≠ 2.9x) | Spec 8 (ya escrito) + regla ALS-4 |
| Autopilot en 3 lugares | Spec 8 + Spec 11 |
| Acciones masivas sin confirmación | Regla ALS-3 (transversal) |
| Nav con arquitectura expuesta | Propuesta nueva de IA (no spec aún) |

**La promesa que cierra este plan:**  
Cuando el dropshipper abre Gali el lunes por la mañana, ve:  
1. Un resumen en 2 líneas de cómo fue el fin de semana  
2. Una sola decisión esperando — con todo el contexto para tomarla en 10 segundos  
3. El impacto de lo que Gali hizo mientras él dormía  

Eso es Gali como Director de E-commerce. No un dashboard que acumula. Una inteligencia que reporta.

---

*Plan Cambios 10 Jun 2026 — Cata Giraldo · catalina.giraldo@dropi.co*  
*Este documento es el paso previo a crear los archivos de spec individuales (Spec 9.md → Spec 16.md). No ejecutar código hasta que cada spec tenga su archivo con CAs definidos.*

---

## 9. Ajustes por Spec (1-7) — Skills, Microinteracciones y Look & Feel

> **Objetivo de esta sección:** Para cada uno de los 7 specs ejecutados, documentar qué ajustar con todo el análisis acumulado (heurísticas, feedback de Cata, auditoría de datos, descubrimientos), qué skill invocar antes de tocar código, y cómo elevar la calidad de interacción, animación y look & feel para que Gali V5 se sienta como un producto de clase mundial.

---

### 9.0 — Lenguaje de Movimiento de Gali V5 (Motion Language Global)

Antes de especificar animaciones por spec, establecer el vocabulario de movimiento que aplica a **toda la UI de Gali V5**. Consistencia en el movimiento genera confianza igual que consistencia en los colores.

#### Principios de Movimiento

| Principio | Regla | Razón |
|---|---|---|
| **Propósito sobre decoración** | Animar solo cuando el movimiento comunica algo (estado, jerarquía, causa-efecto) | Gali es un CEO que reporta — el movimiento debe reflejar seriedad, no show |
| **Brevedad** | Duración máxima: 300ms para entradas, 150ms para salidas | Las salidas deben ser más rápidas que las entradas — el usuario ya vio el elemento |
| **Física consistente** | Entradas: `ease-out`. Salidas: `ease-in`. Transiciones: `ease-in-out` | Objetos aceleran al aparecer, desaceleran al desaparecer |
| **Un actor por momento** | Si hay más de 1 animación simultánea, usar `stagger` (60-80ms entre ítems) | Múltiples animaciones simultáneas compiten y producen ruido visual |
| **Respeto por `prefers-reduced-motion`** | Todas las animaciones CSS deben tener `@media (prefers-reduced-motion: reduce)` con duración 1ms | Accesibilidad no negociable |

#### Tokens de Duración (añadir a `src/styles/_variables.scss`)

```scss
// Motion tokens — Gali V5
$motion-instant:    50ms;   // feedback táctil inmediato (hover, focus)
$motion-fast:      120ms;   // transiciones de estado (botón activo, badge)
$motion-medium:    200ms;   // entradas de componentes (cards, paneles)
$motion-slow:      300ms;   // entradas de pantallas, paneles laterales
$motion-xslow:     500ms;   // contadores numéricos, efectos dramáticos

$ease-entrance:    cubic-bezier(0.0, 0.0, 0.2, 1);  // ease-out agresivo
$ease-exit:        cubic-bezier(0.4, 0.0, 1.0, 1);  // ease-in rápido
$ease-standard:    cubic-bezier(0.4, 0.0, 0.2, 1);  // Material standard
$ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1); // overshoot suave
```

#### Keyframes globales (añadir a `src/styles/_animations.scss`)

```scss
@keyframes gali-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes gali-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes gali-slide-right {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes gali-slide-left-in {
  from { transform: translateX(420px); }
  to   { transform: translateX(0); }
}

@keyframes gali-pulse-border {
  0%, 100% { border-color: var(--red-400); opacity: 1; }
  50%       { border-color: var(--red-200); opacity: 0.7; }
}

@keyframes gali-pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.6; }
}

@keyframes gali-count-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes gali-bar-grow {
  from { width: 0%; }
  to   { width: var(--bar-target-width); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; }
}
```

#### Look & Feel Global de Gali V5

El objetivo visual es: **"inteligencia calmada con profundidad"**. No un dashboard de startup con gradientes saturados. No una herramienta corporativa gris. El punto medio:

| Atributo | Valor | Aplicación |
|---|---|---|
| **Fondos** | `var(--surface-50)` (#fafafa) como base, no blanco puro | Toda la app — el blanco puro genera fatiga visual en sesiones largas |
| **Profundidad** | Capas de `box-shadow` sutiles: `0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)` | Cards, paneles, dropdowns — nunca flat |
| **Naranjas** | Solo para: CTAs primarios, highlights activos, Gali brand moments (✦) | No usar naranja para info o decoración — reservar su impacto |
| **Tipografía** | Inter — weights 400/500/600/700 únicos (sin 300 ni 800) | Consistencia visual — IBM Plex Sans solo para items de menú |
| **Radio** | `$radius-1` (6px) para chips/badges, `$radius-2` (8px) para cards, `$radius-3` (12px) para modales | Escala progresiva — no mezclar radios arbitrarios |
| **Iconos de acción** | Solo SVGs de 20×20px via `<img>` (nunca PrimeIcons para iconos de dominio) | PrimeIcons solo para `pi-clock`, `pi-chevron-*`, `pi-exclamation-triangle` en casos sin SVG alternativo |

---

### 9.1 — Spec 1: UniDatos

**Estado actual:** ~85% implementado. Faltan C1 (propagación canónica de ROAS), C2 (waterfall desde mock), C3 (auditoría campanas), C4 (fix channelRows).

**Skill recomendada:** `/full-output-enforcement` para asegurar que todos los outputs de componentes usan el mock maestro sin literales. Combinar con `/interface-design` para el componente visual de explicación del gap.

#### Ajustes basados en el análisis

**AJ-1.1 — El gap ROAS no solo se "corrige" — se explica visualmente**  
El error no es técnico, es narrativo. El usuario ve 1.93x en un lugar y 2.9x en otro y pierde la confianza. La solución no es solo alinear números — es hacer la distinción explícita:

```
ROAS real del negocio: 1.93×  ← lo que Dropi confirma
ROAS que Meta declara: 2.90×  ← lo que Meta atribuye a sus anuncios
Diferencia: $68.000/sem en pauta que Meta no explica completamente
```

Añadir un componente `roas-explainer-inline` que aparece siempre que se muestran ambos valores en la misma pantalla. No es un tooltip — es un bloque de contexto inline de 2 líneas debajo de los dos valores.

**AJ-1.2 — `kpis-global.json` como única fuente de verdad para el Hub**  
Todo componente que hoy tiene ROAS, margen, pedidos o pauta hardcodeados en TS debe migrarse al patrón:

```typescript
import KPIS from '../../../../../mocks/gali-v5/kpis-global.json';
const { roas_real_global, roas_meta_global, margen_neto_pct, pauta_diaria } = KPIS;
```

La regla ALS-4 (datos desde fuente única) no puede ser solo un comentario — debe verificarse con `ng build` y búsqueda de literales ROAS en el código.

**AJ-1.3 — Alinear escala temporal en todos los componentes**  
El problema identificado en DesADIGali5: $14.82M (mensual) y $1.82M (semanal) aparecen juntos sin etiqueta. Cada KPI en cualquier pantalla debe tener badge de periodo:
- Badge "Semanal" — fondo `var(--blue-50)`, texto `var(--blue-700)`
- Badge "Mensual" — fondo `var(--indigo-50)`, texto `var(--indigo-700)`

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| KPI cards en carga | `gali-fade-up` con stagger de 80ms entre cards | 200ms, ease-out |
| Contador ROAS al cargar | Número sube animado de 0 a 1.93 con `requestAnimationFrame` | 400ms, ease-out |
| Badge de periodo | Fade-in suave al cargar la sección | 150ms |
| Waterfall bars | Cada barra crece horizontalmente desde 0 con 80ms stagger | 250ms por barra |
| Roas explainer inline | `gali-fade-up` al primer render, nunca en re-renders | 200ms |
| Tab change en dashboard | Cross-fade de contenido (`opacity 0→1`) | 150ms |
| Tooltip "Declarado Meta" | `scale(0.9)→1` + `opacity` en hover | 120ms |

#### Look & Feel específico

- El `roas-explainer-inline` tiene fondo `var(--surface-100)` con borde izquierdo `3px solid var(--primary-200)` — neutral, no alarmante
- Los badges de periodo son `border-radius: $radius-full` (pills), nunca cuadrados
- Los valores financieros grandes (>$1M) usan Inter Bold 700 en 24px; los labels debajo Inter Regular 11px `var(--gray-500)` — jerarquía clara

---

### 9.2 — Spec 2: RediNavega

**Estado actual:** 0% implementado. Es el spec más crítico porque todos los demás dependen de la navegación.

**Skill recomendada:** `/interface-design` como base. Antes de escribir una línea de código, leer `dropi-sidebar.json` del DS Registry y verificar que la nueva estructura cumple todas las `designRules`.

#### Ajustes basados en el análisis

**AJ-2.1 — La nueva nav debe reflejar el modelo mental del Section 4**  
El spec original define 10 ítems en el rail + "Centro de Gali" accordion. El análisis de Section 4 propone una agrupación diferente. Reconciliar:

```
RAIL PRINCIPAL (visible siempre):
1. Gali Hub          ← home principal
2. Señales           ← con badge naranja (count señales predictivas) + rojo (count alertas)
3. Mis Proyectos     ← acceso directo a la lista de proyectos
────── separador ──────
4. Pedidos           }
5. Logística         } OPERAR
6. Marketing         }
7. Productos         }
────── separador ──────
8. Wallet/Finanzas   }
9. Reportes          } FINANZAS
────── separador ──────
10. CAS / Bandeja    ← soporte

CENTRO DE GALI (accordion colapsado al pie del rail):
   ⚙  Agentes
   ⚙  Skills
   ⚙  Reglas
   ⚙  Conexiones / Marketplace
```

**AJ-2.2 — Badge vivo en ítem "Señales"**  
El badge del ítem "Señales" debe mostrar dos conteos diferenciados:
- Pill naranja: señales predictivas activas (de `MOCK_SENALES.filter(no completed)`)
- Pill roja: alertas críticas activas (de `MOCK_ALERTAS.filter(crítica)`)

Cuando el usuario visita `/gali-v5/senales`, los badges se borran (`localStorage.setItem('gali_signals_seen', Date.now())`).

**AJ-2.3 — El panel "Centro de Gali" no es un submenú clásico**  
Cuando el usuario abre el accordion, los 4 ítems aparecen con stagger animation — no aparecen todos de golpe. Esto da la sensación de "desplegar" un centro de control, no de expandir un menú.

**AJ-2.4 — Breadcrumb contextual en header global**  
Al navegar entre secciones del rail, el header muestra un breadcrumb sutil:
```
Gali ›  Señales           (al estar en /gali-v5/senales)
Gali ›  Proyectos ›  Collar GPS   (al estar en detalle de proyecto)
```
Implementar en `dropi-header-ia2.component.ts` leyendo la ruta activa.

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| Rail item hover | `background: var(--surface-100)` transition | 120ms, ease |
| Active item border-left | `transform: scaleY(0)→scaleY(1)` desde el centro | 150ms, ease-out |
| Badge count (señales) | Al actualizarse: `scale(1)→scale(1.3)→scale(1)` (bounce) | 300ms, spring |
| "Centro de Gali" open | Ítems aparecen con stagger de 50ms, `gali-fade-up` | 150ms por ítem |
| "Centro de Gali" close | Ítems desaparecen juntos (`opacity→0`) | 100ms simultáneo |
| Page transition | `opacity: 0→1` + `translateY(6px)→0` al navegar | 200ms, ease-out |
| Breadcrumb update | Fade-in del nuevo segmento | 150ms |

#### Look & Feel específico

- Rail item activo: `border-left: 2px solid var(--primary-500)` + `background: var(--orange-50)` + icono con `filter: brightness(0) saturate(100%) invert(60%) sepia(90%)` para tonalizar el SVG en naranja
- "Centro de Gali" header: Inter SemiBold 11px, uppercase, `letter-spacing: 0.08em`, `color: var(--gray-400)` — tono "avanzado", no de primer nivel
- Separadores entre grupos: `border-top: 1px solid var(--surface-200)`, `margin: 8px 0` — invisibles pero organizadores

---

### 9.3 — Spec 3: HubNegocio

**Estado actual:** 0% propio (parcialmente cubierto por Spec 7 que implementó algunos elementos del Hub). Bloqueado hasta que los specs anteriores tengan sus CA en ✅.

**Skill recomendada:** `/bencium-impact-designer` + `/interface-design`. El Hub es la pantalla más importante del producto — requiere el skill de mayor impacto visual disponible.

#### Ajustes basados en el análisis

**AJ-3.1 — El Hub debe alinearse con la arquitectura de Spec 9 (3 Momentos)**  
Las 3 Zonas del spec original (Decisiones / Ciclo / Gali+Academy) son correctas en concepto pero deben renombrarse para alinearse con el modelo Momento 1/2/3 de Spec 9:

- Zona 1 → "Momento 2": La decisión urgente (máximo 1 visible)
- Zona 2 → "Momento 3": El ciclo de negocio (solo en modo experto)
- Agregar "Momento 1" arriba: El brief narrativo de Gali (resumen en 2 líneas)
- Zona 3 (Gali esta semana) → integrar en Momento 3

**AJ-3.2 — La Zona 2 (Ciclo de Negocio) necesita impacto visual**  
El ciclo horizontal de 5 etapas (Producto→Marketing→Pedidos→Logística→Finanzas) no puede ser 5 cards planas. Cada etapa debe:
- Mostrar su indicador de estado con color semáforo (verde/ámbar/rojo)
- Conectarse visualmente a la siguiente con un conector animado que fluye cuando todo está bien
- El conector se vuelve rojo y "roto" si hay una alerta en esa transición

**AJ-3.3 — El modal de confirmación de 2 pasos es un pattern reutilizable global**  
El `ConfirmActionModalComponent` definido en este spec debe crearse en `shared/` desde el inicio, no en el Hub específico. Todos los specs que lo necesitan (Spec 4, Spec 13) lo importan de `shared/`.

**AJ-3.4 — "Gali esta semana" conecta con Spec 15 (ImpactoGali)**  
El bloque de ROI (23 acciones, $85k ahorrados, 2 oportunidades) debe derivar sus datos del mismo modelo `GaliImpactLedger` que va a crear Spec 15. Preparar la interfaz ahora — el bloque puede usar datos del mock directamente.

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| Hub load — Momento 1 | `gali-fade-up` inmediato | 0ms delay, 200ms |
| Hub load — Momento 2 | `gali-fade-up` con 80ms delay | 80ms delay, 200ms |
| Hub load — Momento 3 | `gali-fade-up` con 160ms delay | 160ms delay, 200ms |
| Decision card entrance | `translateY(12px)→0` + `opacity` | 200ms, ease-out |
| Decision card exit (aprobada) | `opacity→0` + `max-height→0` | 300ms, ease-in |
| Counter "1 decisión pendiente" actualiza | `scale(1)→scale(1.2)→scale(1)` en rojo | 200ms, spring |
| Ciclo de negocio — conector flujo | Gradiente lineal animado que fluye derecha→izquierda | CSS animation 2s loop |
| Ciclo de negocio — conector roto | Conector rojo con `animation: gali-pulse-border 1.5s` | Loop continuo |
| ROI counter en Momento 3 | Cuenta desde 0 al entrar al viewport (`IntersectionObserver`) | 500ms, ease-out |
| Horizontal scroll arrows | Arrows aparecen solo en hover sobre el contenedor | `opacity: 0→1` en 120ms |
| Ciclo card hover | `translateY(-2px)` + `box-shadow` más profundo | 150ms, ease |

#### Look & Feel específico

- Momento 1 (brief de Gali): fondo `var(--surface-50)` con borde bottom `1px solid var(--surface-200)`. El ✦ Gali tiene `color: var(--primary-500)` y size 16px — presente pero no dominante
- Momento 2 (decisión): fondo blanco con borde izquierdo `3px solid var(--primary-500)` + sombra `0 2px 12px rgba(244,154,61,0.12)` — la naranja sombra da calidez sin alarma
- El ciclo de negocio: las 5 cards en `background: white`, `border: 1px solid var(--surface-200)`, `border-radius: $radius-2`. El conector entre cards: `height: 2px`, `background: linear-gradient(90deg, var(--green-400), var(--surface-200))` cuando OK
- "Gali esta semana": fondo `var(--surface-100)`, colapsado por defecto, toggle con `pi-chevron-down/up`

---

### 9.4 — Spec 4: Señales

**Estado actual:** 0% implementado. El spec está bien definido pero necesita upgrades visuales y de datos.

**Skill recomendada:** `/bencium-impact-designer` + `/interface-design`. Las señales son el diferenciador de Gali — deben sentirse poderosas y claras a la vez.

#### Ajustes basados en el análisis

**AJ-4.1 — El panel SEÑALES necesita más "profundidad de macromundo"**  
El bloque `macromundo-tag` ("Según datos de la red Dropi") es el elemento más diferenciador del spec — es lo que separa a Gali de cualquier IA genérica. Pero el diseño actual es solo texto en fondo gris. Elevar:

- `macromundo-tag` debería tener un subtle gradient horizontal `linear-gradient(90deg, var(--orange-50), transparent)`
- El número de dropshippers ("847 dropshippers") debe estar en **bold naranja** para hacerlo escaneable
- Añadir un micro-ícono de red/comunidad (SVG de 12px) junto al tag

**AJ-4.2 — La "ventana de acción" debe comunicar urgencia visual**  
Los X días de ventana no dicen cuánta urgencia hay. Agregar un color dinámico:
- ≥10 días: `var(--green-600)` — tiempo suficiente
- 7-9 días: `var(--amber-600)` — pronto
- ≤6 días: `var(--red-600)` + ícono de reloj pulsando — urgente

**AJ-4.3 — El estado vacío "Todo tranquilo" necesita ser emocionalmente positivo**  
Un ícono estático con texto gris no comunica que Gali está trabajando activamente. Elevar el estado vacío:
```
✦ (animado suavemente)
"Todo bajo control."
Gali monitoreó tu negocio en las últimas 24h.
0 riesgos detectados · 0 oportunidades sin atender.
[Lo último que hizo Gali: escaló campaña hace 2h →]
```

**AJ-4.4 — Las señales completadas deben "archivarse" visualmente**  
Las señales de tipo `completed` no deben tener la misma opacidad reducida que en otros specs — aquí deben mostrarse como "logros documentados" con un check verde prominente y el impacto medido (antes/después).

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| Signal cards list entrada | `gali-fade-up` con stagger 60ms por card | 200ms each |
| Alert cards entrada | `gali-slide-right` para diferenciarse de señales | 150ms each |
| Filter button active | Pill de fondo desliza con `transition: left 200ms ease` | 200ms |
| Ventana countdown (<7 días) | Icono de reloj: `gali-pulse-dot` animation | 1.5s loop |
| Alert crítica — left border | `gali-pulse-border` animation continua | 1.5s loop |
| Estado vacío — ✦ icono | Scale 1→1.06→1 respira suavemente | 2s loop, ease-in-out |
| Macromundo block | `gali-fade-in` con 100ms delay después del card | 200ms |
| Card hover | `translateY(-2px)` + `box-shadow: 0 4px 16px rgba(0,0,0,0.1)` | 150ms |
| Número de dropshippers | Contador animado de 0 a N cuando el card entra al viewport | 400ms |

#### Look & Feel específico

- Panel SEÑALES: `border-top: 3px solid var(--primary-200)` — naranja pastel, no agresivo
- Panel ALERTAS críticas: `border-top: 3px solid var(--red-400)` + fondo `var(--red-50)` — la diferencia debe ser obvia sin texto
- `macromundo-tag`: `font-size: 10px`, uppercase, naranja — como un "clasificado" editorial
- Los datos clave dentro del macromundo (847, $86k, 14 días) van en `font-weight: 700` y `color: var(--gray-900)` — resaltan en el texto regular gris
- Badges de tipo de señal (Oportunidad, Escala, Tendencia): cada uno con su paleta de color distinct pero todos con la misma forma pill `$radius-full`

---

### 9.5 — Spec 5: ZeroState

**Estado actual:** 0% implementado. Es el spec de mayor impacto emocional para nuevos usuarios.

**Skill recomendada:** `/agentic-ux-design-relationship-centric-interfaces`. Este spec trata sobre el diseño de una relación entre el usuario y Gali — requiere el skill de interfaces relacionales y agénticas.

#### Ajustes basados en el análisis

**AJ-5.1 — El onboarding no puede verse como un formulario**  
El flujo actual (3-6 pasos, opciones de botones) se siente como un formulario de registro. La visión es una conversación. Elevar:
- Entre cada step, Gali "responde" al input anterior antes de hacer la siguiente pregunta
- Ej: Step 1 → usuario elige "Escalar pedidos" → Gali responde "Perfecto. ¿Con qué canal de venta trabajas principalmente?" (ya siendo contextuales)
- Esta respuesta de Gali aparece como un mensaje de chat, no como un título de formulario
- Usar una burbuja de chat naranja para la pregunta de Gali + área de selección debajo

**AJ-5.2 — El Step 6 (veterano) debe ser un momento especial**  
"Ya sé quién eres" debe sentirse como magia, no como una pantalla de resumen. Propuesta:
- La pantalla empieza con solo el texto "Ya sé quién eres." centrado, apareciendo letra por letra (typing)
- Después de 1.2s, el resumen aparece con stagger
- Los 3 checkmarks de "Esto ya lo tengo listo" aparecen uno por uno con animación tick

**AJ-5.3 — El toggle Vista Simple/Experto necesita ser más encontrable**  
El segmented control en el header de Zona 1 (Decisiones) puede pasarse por alto. Añadir un tratamiento "primer uso":
- En la primera sesión, el toggle tiene un tooltip de onboarding "Cambia tu vista aquí" con flecha apuntando al control
- El tooltip desaparece al primer clic en cualquier lugar
- Se guarda en `localStorage.setItem('gali_toggle_hint_seen', true)`

**AJ-5.4 — Los tabs del proyecto con datos reales necesitan skeleton loading**  
Cuando el usuario cambia entre tabs de Producto/Estrategia/Campañas/Pedidos, mostrar un skeleton loader por 300ms (aunque los datos sean síncronos del mock) — esto comunica que los datos se están "consultando", lo cual hace que el prototipo se sienta más real.

**AJ-5.5 — La barra "Siguiente acción" sticky debe tener presencia visual fuerte**  
El componente `.siguiente-accion-sticky` tiene fondo `var(--orange-50)` — muy sutil. Elevar:
- Fondo: `var(--primary-500)` (naranja sólido) — la única barra naranja en la pantalla
- Texto: blanco
- El ✦ icono en blanco más grande (16px)
- Sombra: `0 2px 8px rgba(244,154,61,0.3)` — resplandor naranja suave

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| Onboarding step transition | `translateX(-100%)→0` para entrada, `translateX(100%)` para salida | 250ms, ease-in-out |
| Step 6 — "Ya sé quién eres." | Typing effect letra por letra | 20ms por caracter |
| Step 6 — resumen items | `gali-fade-up` con stagger 150ms entre líneas | 200ms each |
| Step 6 — checkmarks | SVG stroke-dashoffset animation (dibuja el tick) | 300ms, ease-out |
| Toggle active pill | Slide de fondo: `left: 0→50%` con `transition: left 200ms ease` | 200ms |
| Tab content change | Skeleton aparece (`opacity→1`), luego contenido (`opacity: 0→1`) | skeleton 300ms, contenido 200ms |
| Skeleton shimmer | `linear-gradient` animado de izquierda a derecha | 1.5s loop |
| Sticky bar — scroll shadow | `box-shadow` aparece al scroll via `IntersectionObserver` | 120ms |
| Memoria toggle open | `max-height: 0→300px` + `opacity: 0→1` | 250ms, ease-out |
| Rail item filter (módulos visibles) | Items que aparecen/desaparecen: `max-height` + `opacity` | 200ms each |

#### Look & Feel específico

- El modal de onboarding: background `rgba(0,0,0,0.4)` con `backdrop-filter: blur(4px)` — el Hub visible detrás, borroso
- La burbuja de pregunta de Gali: `border-radius: 16px 16px 16px 4px` (esquina inferior izquierda recta — estilo chat entrante), fondo `var(--primary-500)`, texto blanco
- El Paso 6 de veterano: fondo oscuro `var(--gray-900)` con texto blanco — un "momento aparte" que contrasta con el resto del onboarding claro. El ✦ Gali en naranja brillante.
- Tabs de proyecto: tab activo con underline naranja (`border-bottom: 2px solid var(--primary-500)`), no con background fill — más sutil

---

### 9.6 — Spec 6: Finanzas con Contexto (Kronos)

**Estado actual:** ~90% implementado. Faltan 3 tareas de cierre (C1, C2, C3) + 2 brechas adicionales (C4 drawer Siigo, C5 ROI de Gali).

**Skill recomendada:** `/interface-design`. La mayor parte de los cambios son de cableado de datos y mejoras visuales del componente ya implementado.

#### Ajustes basados en el análisis

**AJ-6.1 — El "typing effect" del narrador Kronos**  
La narrativa de Kronos ("Esta semana generaste $2.74M...") actualmente aparece estática. Añadir un typing effect de 30ms por carácter al primer render del componente. Si el usuario ya vio la wallet antes (check localStorage), skip el typing y mostrar directo — solo en el primer render de la sesión.

```typescript
// En wallet-page.component.ts
readonly showTyping = signal(!localStorage.getItem('gali_wallet_seen'));

ngOnInit() {
  if (this.showTyping()) {
    localStorage.setItem('gali_wallet_seen', 'true');
  }
}
```

**AJ-6.2 — Las "fugas de dinero" necesitan más impacto visual**  
El bloque de fugas está bien estructurado pero se siente genérico. Elevar:
- Cada fuga tiene un número de impacto grande y rojo (`font-size: 20px`, `font-weight: 700`, `color: var(--red-600)`)
- Debajo del número, una barra de calor visual que muestra cuánto representa del margen total (barra horizontal proporcional)
- El CTA secundario de cada fuga tiene el color del agente que lo diagnosticó (Roax naranja, Kronos azul)

**AJ-6.3 — El drawer de Siigo (C4) conecta la wallet con la acción**  
En vez de navegar a otra pantalla, el drawer permanece sobre la wallet — el usuario mantiene el contexto financiero mientras resuelve. El drawer debe:
- Slide desde la derecha con `gali-slide-left-in`
- Tener backdrop `rgba(0,0,0,0.3)` con blur
- Cerrar con click en el backdrop o con "×"

**AJ-6.4 — La sección ROI de Gali (C5) conecta con Spec 15**  
El bloque "Lo que Gali hizo por ti este mes" en la wallet debe tener la misma estructura visual que el widget de ImpactoGali del Spec 15. Diseñar la estructura ahora con datos del mock para que Spec 15 solo necesite cambiar la fuente de datos.

**AJ-6.5 — El waterfall animado comunica el P&L como historia**  
Las barras del waterfall no deben aparecer todas simultáneamente. La animación debe ser secuencial — la barra de Ingresos aparece primero, luego el COGS se "resta" visualmente (barra roja que crece hacia abajo desde la barra anterior), y así sucesivamente. Esto convierte el P&L en una narrativa visual de cómo el dinero fluye y se consume.

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| Kronos narrative — typing | Caracter por caracter en primer render | 25ms/char |
| Waterfall bars — secuencial | Cada barra aparece 100ms después de la anterior, crece desde 0 | 250ms per bar |
| Barras negativas (costos) | Crecen en dirección opuesta (hacia abajo desde baseline) con color rojo | 250ms |
| Siigo error card — pulso | `gali-pulse-border` en el left border rojo | 1.5s loop |
| Fugas block — entrada | `gali-fade-up` con stagger 80ms | 200ms each |
| Drawer Siigo — entrada | `translateX(420px)→0` | 250ms, ease-out |
| Drawer Siigo — salida | `translateX(0)→420px` | 150ms, ease-in |
| ROI stats counters | Cuenta de 0 al valor en viewport | 600ms, ease-out |
| Barra de impacto de fuga | Crece desde 0 al porcentaje del margen | 400ms, ease-out |
| Accordion transacciones | `max-height: 0→auto` smooth | 200ms, ease |

#### Look & Feel específico

- La identidad visual de Kronos (#60a5fa) debe ser consistente: el azul aparece siempre en `border-left`, nunca como fondo sólido de sección grande
- El dot de Kronos en la wallet: `width: 8px; height: 8px; background: #60a5fa; border-radius: 50%` — igual que los dots de agentes en Spec 7
- Las fugas: el número de impacto (`$185k/sem`) en `font-size: 22px`, `font-weight: 800`, `color: var(--red-600)` — el impacto debe saltar visualmente
- La barra de impacto: `background: linear-gradient(90deg, var(--red-400), var(--red-100))` — degradado que comunica magnitud

---

### 9.7 — Spec 7: Score de Salud, Agentes y Umbrales

**Estado actual:** ~95% implementado. Tareas pendientes: V1-V3 (smoke tests), brecha A (explainer jerarquía), brecha B (copy header dinámico), CA-9 y CA-10.

**Skill recomendada:** `/interface-design`. Los cambios son de polish, copy y connections — no de arquitectura nueva.

#### Ajustes basados en el análisis

**AJ-7.1 — El SVG ring del health panel debe animarse al abrir**  
El `ringDash` es un valor estático que se calcula en `ngOnInit`. Para que el panel tenga impacto visual, el stroke debe animarse desde el círculo completo vacío hasta el valor final:

```scss
.health-ring circle.fill {
  stroke-dashoffset: 163.4; // circumferencia completa = "vacío"
  animation: ring-fill 600ms ease-out forwards;
  animation-delay: 200ms; // esperar a que el panel termine de slide-in
}

@keyframes ring-fill {
  to { stroke-dashoffset: var(--ring-target); }
}
```

**AJ-7.2 — Los component bars del health panel necesitan stagger**  
Los 4 componentes (ROAS 30%, Novedades 25%, Conversión 20%, P&L 25%) aparecen actualmente todos juntos. Con stagger:
- ROAS barra aparece primero (0ms delay)
- Novedades barra (80ms delay)
- Conversión (160ms delay)
- P&L (240ms delay)

**AJ-7.3 — El copy del header debe ser dinámico basado en el estado real del mock**  
La brecha B (CA-10) requiere 3 estados de copy. Implementar como computed signal en `dropi-header-ia2.component.ts`:

```typescript
readonly headerSubtitle = computed(() => {
  const pendientes = this.pendingDecisions();
  const alertas = this.criticalAlerts();
  
  if (pendientes > 0) return `Gali · hay ${pendientes} ${pendientes === 1 ? 'decisión que necesita' : 'decisiones que necesitan'} tu aprobación`;
  if (alertas === 0)  return 'Gali · negocio en orden · 0 alertas activas';
  return 'Gali · tu Director de E-commerce activo';
});
```

El cambio de copy debe hacer crossfade con `opacity: 0→1` en 200ms.

**AJ-7.4 — El panel de agentes en la página `/agentes` necesita la jerarquía visual correcta**  
La brecha A (CA-9) — el explainer "¿Cómo funciona esto?" — debe diseñarse como un panel informativo de alta calidad, no como un tooltip genérico:
- Modal centrado pequeño (`max-width: 480px`)
- Diagrama visual simple: Gali (círculo grande naranja) → flechas a 5 círculos de agentes (colores de cada uno)
- 3 párrafos cortos: orquestador, módulos especializados, umbrales de autonomía

**AJ-7.5 — Los dots de semáforo en agentes deben tener más presencia**  
El dot de 6px es funcional pero casi invisible. Elevar:
- Verde: `width: 8px; height: 8px; box-shadow: 0 0 0 3px rgba(34,197,94,0.2)` (halo verde sutil)
- Ámbar: `box-shadow: 0 0 0 3px rgba(245,158,11,0.2)`
- Rojo: `box-shadow: 0 0 0 3px rgba(239,68,68,0.2)` + `animation: gali-pulse-dot` (el único que pulsa — urgencia)

#### Microinteracciones y Animaciones

| Elemento | Animación | Timing |
|---|---|---|
| Health panel slide-in | `gali-slide-left-in` (desde la derecha) | 250ms, ease-out |
| Health panel backdrop | `opacity: 0→0.4` | 200ms |
| SVG ring fill | `strokeDashoffset` anima desde 163.4 al target | 600ms, ease-out, 200ms delay |
| Score label "78/100" | Counter desde 0 a 78 | 500ms, ease-out |
| Component bars stagger | `gali-bar-grow` con 80ms stagger | 300ms each |
| Benchmark marker line | Aparece con `opacity: 0→1` después de las barras | 150ms, 400ms delay |
| Recomendaciones | `gali-fade-up` con 100ms stagger | 200ms each |
| Agency panel slide-in | Mismo `gali-slide-left-in` que health panel | 250ms, ease-out |
| Agent row stagger | `gali-fade-up` con 50ms stagger en lista de agentes | 150ms each |
| Header subtitle crossfade | `opacity: 0→1` al cambiar el texto | 200ms |
| "Necesitas decidir" badge | Si count > 0: dot rojo con `gali-pulse-dot` | 1.5s loop |
| Semáforo verde dot | Halo `box-shadow` permanente (no animated) | — |
| Semáforo rojo dot | `gali-pulse-dot` continuo | 1.5s loop |

#### Look & Feel específico

- El health panel interior: fondo `var(--surface-50)` — no blanco puro, para diferenciarse visualmente del panel al estar sobre el Hub
- El score prominente ("78/100"): Inter Bold 48px, `color: var(--gray-900)` — el número más grande del panel
- "Negocio saludable" label: Inter Medium 14px, `color: var(--green-600)` — la única palabra en verde del panel
- El benchmark "82/100 Dropi · Estás 4pts por debajo": `color: var(--gray-500)`, debajo del score principal pero visible sin buscarla
- Las recomendaciones: cada una tiene `border-left: 2px solid var(--primary-200)` — referencia visual a la narrativa de Gali

---

### 9.8 — Resumen de Skills por Spec

| Spec | Nombre | Skill Principal | Skill Complementaria |
|---|---|---|---|
| **Spec 1** | UniDatos | `/full-output-enforcement` | `/interface-design` |
| **Spec 2** | RediNavega | `/interface-design` | leer `dropi-sidebar.json` antes |
| **Spec 3** | HubNegocio | `/bencium-impact-designer` | `/interface-design` |
| **Spec 4** | Señales | `/bencium-impact-designer` | `/interface-design` |
| **Spec 5** | ZeroState | `/agentic-ux-design-relationship-centric-interfaces` | `/interface-design` |
| **Spec 6** | Finanzas | `/interface-design` | — |
| **Spec 7** | Salud | `/interface-design` | — |

> **Regla de invocación:** invocar el skill ANTES de escribir código. El skill se invoca en el inicio de la sesión de implementación, no al final para verificar.

---

### 9.9 — Checklist de Calidad Look & Feel antes de dar CAs por cerrados

Antes de marcar cualquier spec como ✅ completo, verificar esta lista en el navegador:

#### Visual
- [ ] Todos los fondos usan `var(--surface-50)` o blanco, nunca gris plano ni color sólido no-token
- [ ] Todos los CTAs primarios son naranja `var(--primary-500)` — ningún CTA primario en azul, verde o gris
- [ ] Todos los valores financieros tienen badge de periodo (Semanal/Mensual)
- [ ] No existen más de 2 tamaños de border-radius en la misma pantalla
- [ ] Todos los iconos de dominio son `<img>` SVG de 20×20px — ningún `<i class="pi-*">` en contexto de dominio

#### Movimiento
- [ ] Las entradas de cards/listas tienen stagger (no aparecen todas juntas)
- [ ] Los paneles laterales (health, umbrales, drawer) hacen slide-in desde la derecha
- [ ] Los contadores numéricos (ROI, score, ROAS) animan desde 0 en primer render
- [ ] El `@media (prefers-reduced-motion: reduce)` existe en `_animations.scss` global
- [ ] Los estados hover tienen `transition` declarada — ningún cambio abrupto

#### Datos
- [ ] `ng build --configuration development` sin errores ni warnings críticos
- [ ] Buscar en el TS del componente: no existen literales ROAS, pauta, pedidos hardcodeados
- [ ] Todos los ROAS, márgenes y valores financieros derivan de `projects.json` o `kpis-global.json`
- [ ] Los textos de la UI no contienen "Ir al módulo →", "data-proto-skip", ni "PRÓXIMAMENTE"

#### Interacción
- [ ] Los modales/panels se cierran con click en el backdrop
- [ ] Las acciones masivas (>1 entidad afectada) tienen modal de confirmación 2 pasos
- [ ] Los filtros/tabs muestran el estado activo claramente (no solo con color — también con forma o borde)
- [ ] El scroll es siempre interno al componente — nunca hay scroll de página global

---

*Sección 9 — Actualización 10 Jun 2026 — Cata Giraldo*

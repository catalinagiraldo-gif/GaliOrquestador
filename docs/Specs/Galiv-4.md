# Gali V4 — El Orquestador Disruptivo
## Plan de Re-arquitectura AI-First · Dropi 2026

> **Construido sobre V3 implementado** (ver Parte 0) · Spec_Prototipo_Dropi_Gali.md · Plan_Dropi_Orquestador_V3.md · Referente Make.ai · dropi_user_personas · Re-arquitectura UI Oficial (Figma)
> **Referencias V3:** `docs/Specs/EstadoActualGaliV3.md` · `docs/Specs/PlanGaliV3_AIFirst_Hibrido_BuilderOrquestador.md` · `navigation-map.json`
> **Versión:** 4.0 · Mayo 2026

---

## PARTE 0 — INVENTARIO V3 IMPLEMENTADO (PUNTO DE PARTIDA)

> Antes de proponer V4, declaramos lo que V3 ya entrega hoy en `/gali-v3/*`. Este inventario es la línea base sobre la que se construyen las Partes 2-7. **No se reescribe lo que ya funciona — se evoluciona.**

### Estado de madurez

V3 está implementado como prototipo navegable. 14+ rutas vivas, 15 servicios, 30+ componentes, mock data rica. Compilación limpia (`yarn build` ✅). Lo que falta — engine real (Claude API, OAuth, evaluación de recipes), datos agregados LATAM, backend de memoria — es lo que V4 viene a completar.

### Inventario por capa

| Capacidad V3 | Archivo(s) que la implementa(n) | Madurez |
|---|---|---|
| **Layout tri-pane** (Navigator / Canvas+Chat / Negocio Live) | `components/gali-v3/shell/*` + `pages/gali-v3/gali-v3-shell.component.ts` | Listo-prod |
| **Tokens light cálidos** (crema `#FAF7F2`, naranja `#F49A3D`, terracota `#B8593A` para Gali) | `src/styles/_gali-v3-tokens.scss` (cumple WCAG AAA en pares definidos) | Listo-prod |
| **Header IA 2 (Figma)** + **Sidebar 56px** | `components/gali-v3/gali-v3-header/`, `gali-v3-sidebar/` | Listo-prod |
| **Sistema de Proyectos con memoria persistente** | `services/gali-v3/project.service.ts` + `mocks/gali-v3/proyectos.json` (3 proyectos: Collar GPS activo 18 días, Skincare pausado, Fitness completado) | Funcional (localStorage; falta backend) |
| **Memoria de 3 capas** (negocio / proyectos / sesión) con chips editables | `services/gali-v3/memory.service.ts` + `memory-inspector` | Funcional |
| **Chat artifact-style** con streaming palabra-por-palabra (28ms tick) | `components/gali-v3/chat/` + `services/gali-v3/chat.service.ts` | Funcional (6 respuestas mock heurísticas; falta Claude API) |
| **Slash-commands**, **adjuntos** (imagen/URL/producto/artifact), **voz Web Speech API real** | `chat.service.ts` + `services/gali-v3/voice.service.ts` | Funcional |
| **⌘+K Command Palette** | `components/gali-v3/shared/command-palette.component.ts` | Funcional |
| **Componentes "despertados"** sobre Dropi clásico (✦ que expande análisis LATAM + 3 ángulos) | Inline en `pages/gali-v3/dropi-catalogo/`, `dropi-pedidos/`, `dropi-campanas/`, `dropi-proveedores/`, `dropi-caza-productos/`, `dropi-cartera/` | Funcional |
| **Welcome Artifact memory-aware** + **Landing Artifact editable in-place** | `components/gali-v3/artifacts/` | Funcional |
| **Builder Make-style** (sidebar flows + paleta Triggers/Acciones/Lógica + canvas nodos + terminal log streamed) | `pages/gali-v3/builder/` + `services/gali-v3/flow.service.ts` + `mocks/gali-v3/flow-blocks-catalog.json` (8 triggers + 12 acciones + 3 condiciones) | Funcional (ejecución mock) |
| **Mercado** (3 tabs: Plantillas / Agentes / Conexiones) + wizard 4 pasos para agente | `pages/gali-v3/mercado/` + `services/gali-v3/marketplace.service.ts` + `mocks/gali-v3/mercado/*` (12+8+6) | Funcional |
| **Mapa del negocio** (grafo 21 nodos en 6 zonas, DnD edit mode, KPIs live) | `pages/gali-v3/mapa/` + `services/gali-v3/business-map.service.ts` | Funcional |
| **Retos / Gamificación** (4 diarios + 4 semanales + 2 misiones + insignias + leaderboard) | `pages/gali-v3/retos/` + `services/gali-v3/retos.service.ts` | Funcional |
| **Onboarding light** (3 preguntas → starter pack al canvas) | `pages/gali-v3/onboarding/` + `services/gali-v3/starter-packs.ts` | Funcional |
| **Canvas libre personalizable** (grid 4 cols, 11 bloques: pedidos/cartera/misiones/integraciones/landings/productos/novedades/memoria/métricas/proyecto-activo/starter-tour) | `services/gali-v3/canvas.service.ts` + `block-registry.ts` + `components/gali-v3/blocks/*` | Funcional |
| **Vistas personalizadas guardadas** | `pages/gali-v3/vista/:slug` (operacion-hoy, productos-ganadores, centro-mando) | Funcional |
| **Señales proactivas** con dismiss persistido | `services/gali-v3/signals.service.ts` + `signals.json` (5 señales) | Funcional |
| **Próximos pasos contextuales** (18+ contextos) | `services/gali-v3/proximos-pasos.service.ts` | Funcional |
| **Maestría / niveles** (aprendiz / operador / estratega) | `services/gali-v3/gali-learning.service.ts` (heredado v2) | Funcional |

### Rutas vivas en `navigation-map.json`

`/gali-v3` · `/proyecto/:id` · `/proyecto/nuevo` · `/builder` · `/mercado` · `/mercado/agente/:id` · `/mercado/agente/nuevo` · `/dropi/catalogo` · `/dropi/pedidos` · `/dropi/campanas` · `/dropi/proveedores` · `/dropi/caza-productos` · `/dropi/cartera` · `/artifact/landing/:id` · `/vista/:slug` · `/onboarding` · `/mapa` · `/retos` · `/integraciones` · `/landings` · `/playground-maestria`

### Qué V3 NO tiene aún (la zona de delta V4)

- ❌ Líder Virtual de Comunidad (síntesis 150k dropshippers LATAM en tiempo real)
- ❌ Mi Stack Personal con OAuth real (hoy solo mock de 7 plataformas)
- ❌ Modo Objetivos → Roadmap auto-generado por Gali con benchmarks
- ❌ Engine real de Recipes (hoy ejecución mock con log streamed)
- ❌ Constructor de Bloques Custom (modal chat + preview en vivo)
- ❌ Claude API real (hoy 6 respuestas mock heurísticas)
- ❌ Memoria persistente en backend (hoy localStorage)
- ❌ Datos LATAM agregados (hoy todo es local del usuario)

---

## PARTE 1 — ANÁLISIS HEURÍSTICO (NIELSEN + AI-FIRST) DEL V3 IMPLEMENTADO

> Este análisis evalúa el V3 **REAL** que ya está navegable en `/gali-v3/*` (ver Parte 0), no una versión imaginada. Aplica 14 principios: las **10 heurísticas Nielsen clásicas** + **4 principios AI-first agentic-UX** específicos para interfaces donde una IA tiene agencia.

### Los 4 principios AI-first agentic-UX (definición + aplicación V3)

**11. Transparencia del razonamiento**
La IA muestra *cómo* llegó a su recomendación — pasos, fuentes, nivel de confianza — no solo el output final. El usuario puede auditar la decisión.
*Aplicación V3:* `chat.service.ts` muestra streaming pero no expone razonamiento. `memory.decisiones_clave` registra qué decidió Gali pero no por qué. **Riesgo:** el usuario acepta sugerencias sin entenderlas. **Ejemplo deseado V4:** al hacer hover sobre una señal, Gali expande "Detecté esto porque vi X en tu memoria + Y en datos de la comunidad".

**12. Control humano sobre la IA**
Toda acción autónoma es reversible, pausable y revisable antes de ejecutarse. La IA no actúa sin permiso explícito en pasos críticos.
*Aplicación V3:* el builder tiene "Probar recipe" (dry-run mock) y approval UI parcial. **Riesgo:** cuando V4 conecte engine real, sin dry-run obligatorio + rollback se pierde control. **Ejemplo deseado V4:** toda recipe en producción tiene botón "Pausar" siempre visible + log de ejecución revisable + rollback de las últimas 10 acciones.

**13. Gestión de incertidumbre y confianza**
La IA comunica grados de certeza ("estoy 70% segura"), zonas grises, y los límites de su conocimiento. No simula seguridad falsa.
*Aplicación V3:* `signals.service.ts` tiene `urgencia: 'alta'|'media'|'baja'` pero no `confianza`. **Riesgo crítico:** el usuario interpreta toda recomendación como verdad absoluta. **Ejemplo deseado V4:** "Sugerencia con 65% de confianza — basada en 23 dropshippers similares al tuyo. ¿Quieres ver el detalle?"

**14. Memoria explicable**
El usuario puede ver, editar y eliminar lo que la IA recuerda. La memoria no es caja negra.
*Aplicación V3:* ✅ **Resuelto en V3.** `memory-inspector` con chips editables y `addAprendizaje/removeAprendizaje` persistidos. Excelente implementación; mantener en V4 sin cambios.

### Hallazgos por vista (solo riesgos críticos — no inventamos problemas si V3 ya cumple)

**Vista 1 — Home / Proyectos** *(EVOLUCIÓN de `inicio/` + Welcome Artifact)*
- ✅ H#6 Reconocimiento: Welcome Artifact memory-aware retoma contexto. Resuelto.
- ⚠️ H#13 Incertidumbre: las cards de proyectos no muestran si Gali tiene alta/baja confianza en su lectura del estado.
- ⚠️ H#11 Transparencia: el saludo "mientras no estabas, vi…" no expone qué señales miró.

**Vista 2 — Lienzo de Proyecto** *(CONSERVAR `proyecto.component.ts`)*
- ✅ H#7 Flexibilidad: ⌘+K + slash-commands ya implementados. Resuelto.
- ✅ H#14 Memoria explicable: `memory-inspector` editable. Resuelto.
- ⚠️ H#3 Control: hoy no hay "Modo Constructor" con conexiones visibles entre bloques (V4 lo agrega).
- ❌ H#11 Transparencia: cuando Gali sugiere "siguiente acción", razonamiento no visible.

**Vista 3 — Comunidad en Vivo** *(NUEVA — no existe equivalente en V3)*
- ❌ H#9 Errores: cuando datos agregados estén vacíos/incompletos para un nicho, ¿qué dice Gali? Definir antes de construir.
- ❌ H#13 Incertidumbre: "847 vendedores como tú lanzaron X" — ¿dato real o estimación? Comunicarlo.
- ❌ H#11 Transparencia: la voz de "líder virtual" debe citar fuentes (anónimas) o pierde credibilidad.

**Vista 4 — Mi Stack Personal** *(EVOLUCIÓN de `/gali-v3/integraciones` + `mercado/conexiones`)*
- ⚠️ H#5 Prevención errores: OAuth flow debe ser claramente reversible. V3 hoy es mock; en V4 con datos reales el costo de un mal permiso es alto.
- ⚠️ H#11 Transparencia: "Gali intelligence score por integración" debe explicar qué mejora exactamente.
- ⚠️ H#12 Control: "pausar conexión" a un click; "desconectar" debe pedir confirmación.

**Vista 5 — Modo Objetivos → Roadmap** *(NUEVA — solo gamificación existe en V3)*
- ❌ H#13 Incertidumbre: el roadmap "200 pedidos en 4 semanas" debe ser claramente probabilístico, no determinístico.
- ❌ H#3 Control: editar el roadmap generado debe ser granular (no solo "Ajustar mi objetivo").
- ❌ H#11 Transparencia: cada paso debe decir "Gali sugiere esto porque [razón con datos]".

**Vista 6 — Orquestador de Recipes** *(EVOLUCIÓN de `builder.component.ts`)*
- ✅ H#5 Prevención errores: dry-run ya existe en V3 (mock). Resuelto conceptualmente; mantener en engine real.
- ✅ H#4 Consistencia: paleta Triggers/Acciones/Lógica clara. Resuelto.
- ⚠️ H#9 Errores: cuando recipe falla en producción (V4), comunicación de fallos críticos no definida.
- ❌ H#11 Transparencia: cuando Gali construye recipe desde chat, debe mostrar pasos de razonamiento (principio Make AI Agents: `executionSteps` + `reasoning`).

**Vista 7 — Negocio Hoy** *(CONSERVAR canvas libre + 11 bloques)*
- ✅ H#1 Visibilidad estado: KPIs live + sparklines (`block-metricas`). Resuelto.
- ⚠️ H#8 Minimalismo: 8 KPIs + pedidos + campañas pueden saturar. Aplicar regla "máx 3 above-the-fold".
- ⚠️ H#11 Transparencia: "diagnóstico de Gali" por KPI debe estar siempre visible, no solo on-hover.

**Vista 8 — Constructor de Bloques Custom** *(NUEVA — `block-registry.ts` existe pero no la UI de construcción)*
- ❌ H#13 Incertidumbre: preview en vivo debe mostrar cuándo datos son simulados vs reales.
- ❌ H#5 Prevención errores: validar que el bloque no consume recursos excesivos antes de guardar.
- ❌ H#10 Ayuda: el novato que llega aquí necesita ejemplos visuales antes que campo de chat vacío.

### Tabla resumen: heurísticas × 8 vistas V4

| Heurística | V1 Home | V2 Lienzo | V3 Comun. | V4 Stack | V5 Obj. | V6 Recipes | V7 Hoy | V8 Constr. |
|---|---|---|---|---|---|---|---|---|
| 1. Visibilidad estado | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ⚠️ |
| 2. Mundo real | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ |
| 3. Control y libertad | ⚠️ | ⚠️ | ✅ | ✅ | ❌ | ✅ | ✅ | ⚠️ |
| 4. Consistencia | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| 5. Prevención errores | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ⚠️ | ❌ |
| 6. Reconocimiento | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| 7. Flexibilidad | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| 8. Minimalismo | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| 9. Errores | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ |
| 10. Ayuda | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ |
| **11. Transparencia razonamiento** | ⚠️ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ⚠️ | ❌ |
| **12. Control humano sobre IA** | ✅ | ✅ | ⚠️ | ❌ | ⚠️ | ✅ | ✅ | ⚠️ |
| **13. Incertidumbre y confianza** | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ | ⚠️ | ⚠️ | ❌ |
| **14. Memoria explicable** | ✅ | ✅ | ✅ | ✅ | ✅ | n/a | n/a | n/a |

✅ = Resuelto en V3 o por diseño · ⚠️ = Riesgo a mitigar · ❌ = Crítico a resolver antes de implementar

---

### 🚀 Recomendaciones prioritarias post-análisis V3+V4

- 🔴 **Crítico transversal:** Implementar **H#11 Transparencia del razonamiento** en toda la spec. Cada sugerencia de Gali debe poder expandirse a "¿por qué dices esto?" mostrando fuentes + datos consultados. Hoy V3 no lo tiene en ningún lado, y todas las vistas nuevas de V4 (Comunidad, Objetivos, Constructor) lo necesitan desde el día 1.
- 🟠 **Importante transversal:** Implementar **H#13 Gestión de incertidumbre** — badges de confianza en señales, roadmap probabilístico, "no sé suficiente" como respuesta legítima. Mitiga el riesgo de que el usuario acepte alucinaciones.
- 🟡 **Sugerido (engine real):** Reforzar **H#5 Prevención de errores** antes de conectar engine real de Recipes — dry-run obligatorio + rollback + límites computacionales visibles (regla Make-style en §5.3).

---

## PARTE 2 — LAS 3 PREGUNTAS QUE CAMBIAN TODO

Estos tres "¿Qué pasa si...?" son el motor conceptual de Gali V4. Cada uno responde a un problema real de los dropshippers que ninguna plataforma latinoamericana ha resuelto.

---

### ❓ PREGUNTA 1: ¿Qué pasa si virtualizamos al Líder de Comunidad de Dropi?

**El problema real:**
Dropi tiene comunidad. Hay líderes que saben qué productos están subiendo, qué ángulos de venta están funcionando esta semana, qué transportadoras están fallando en Cali, cuánto están gastando los top vendedores en Meta Ads para un producto específico. Ese conocimiento existe — pero vive disperso en grupos de WhatsApp, reuniones de comunidad y la cabeza de líderes específicos. El 90% de los dropshippers nunca accede a él.

**La transformación:**
Gali se convierte en el **Líder de Comunidad Virtualizado** de Dropi. No inventa datos — los sintetiza de la comunidad real:

```
GALI COMO LÍDER VIRTUAL =
  Datos ROAX en tiempo real
  + Comportamiento agregado de 150.000 dropshippers
  + Señales de tendencia de la comunidad (qué está lanzando quién)
  + Experiencia de los top sellers (sus patrones de éxito)
  + Alertas colectivas (lo que está fallando en el ecosistema)
```

**Cómo se ve en la UI:**
- Gali dice: "Esta semana 847 vendedores como tú lanzaron el Collar GPS. El 68% usó tono emocional hacia mamás. Los que mejor resultado tuvieron gastaron entre $80k-120k COP/día los primeros 3 días."
- No es contenido genérico — es la síntesis de lo que la comunidad Dropi está haciendo AHORA.
- El Líder Virtual aparece en el panel "Señales de la comunidad" — que reemplaza al banner genérico de ChateaPro.

**Implicación de diseño:** Nueva vista `ComunidadEnVivo` — no es un foro, es un feed inteligente filtrado por Gali según el perfil del usuario.

**Qué se reutiliza de V3:**
- `signals.service.ts` — patrón de señales con `urgencia` + `dismiss` persistido sirve para señales de comunidad. Solo se amplía con `confianza` y `fuente_agregada`.
- `welcome-artifact.component.ts` — la anatomía del Welcome Artifact memory-aware sirve de base para el `gali-community-hero`.
- Tokens y tipografía de `_gali-v3-tokens.scss` — toda la vista nueva respira el mismo lenguaje visual.

---

### ❓ PREGUNTA 2: ¿Qué pasa si conecto todas mis apps/herramientas personales para que la IA aprenda de mi gestión?

**El problema real:**
Los dropshippers más avanzados (Jeferson, Valentina, Stiven) gestionan su negocio en múltiples herramientas: Meta Ads Manager, Google Sheets para sus finanzas, WhatsApp Business para sus clientes, TikTok for Business, Shopify, Notion para sus procesos. Cada herramienta tiene su silo de datos. Gali hoy solo conoce lo que pasa dentro de Dropi — una vista parcial del negocio.

**La transformación:**
`Mi Stack Personal` — el dropshipper conecta sus herramientas propias, y Gali aprende de TODO su ecosistema de gestión:

```
CONEXIONES DISPONIBLES (inspirado en Make MCP):
  📊 Google Sheets → Gali lee tu P&L personalizado
  📱 WhatsApp Business → Gali analiza patrones de mensajes
  📣 Meta Business Manager → Gali ve tus campañas reales
  🎵 TikTok for Business → Gali monitorea tus creatives
  🛍 Shopify → Gali ve tu tienda completa
  📓 Notion → Gali accede a tus procesos y notas
  📧 Gmail/Outlook → Gali detecta comunicaciones con proveedores
  💰 Bancolombia/Nequi → (con permiso) Gali ve tu flujo real de caja
```

**El diferencial:**
La IA que analiza tus datos no es genérica — es tuya. Gali aprende:
- Cómo tú tomas decisiones (qué datos miras antes de lanzar)
- Cuándo eres más productivo (qué días procesas más pedidos)
- Cuáles herramientas usas para qué (tus patrones de gestión)
- Qué problemas se repiten (y cómo automatizarlos)

**Implicación de diseño:** Nueva vista `Mi Stack` — similar a la pantalla de integraciones de Make, pero con onboarding guiado por Gali y sugerencias de "qué conectar primero según tu perfil".

**Qué se reutiliza de V3:**
- `/gali-v3/integraciones` ya existe con 7 plataformas mock (Tienda Nube, Shopify, Woo, Meta, Google Ads, Mailchimp, WhatsApp Biz) + modal de conexión 3 pasos. V4 extiende a 15+ plataformas y conecta OAuth real.
- `marketplace.service.ts` ya gestiona toggle de conexiones y `mercado/conexiones.json` ya tiene la estructura. V4 agrega `intelligence_score` y `insights_generados`.
- Layout 4-categorías (Ads / Finanzas / Comms / E-commerce) se puede construir sobre los componentes de `mercado/` existentes.

---

### ❓ PREGUNTA 3: ¿Qué pasa si el usuario nos da sus objetivos y Dropi entrega un paso a paso para cumplirlos?

**El problema real:**
Ninguna plataforma de dropshipping le pregunta al vendedor "¿qué quieres lograr?" y le da un plan real para lograrlo basado en su situación específica. El dropshipper llega a Dropi con un objetivo ("quiero ganar $3M COP este mes") pero la plataforma solo le ofrece herramientas dispersas — no un camino.

**La transformación:**
`Modo Objetivos` — el dropshipper declara su meta, y Gali construye un roadmap personalizado:

```
USUARIO: "Quiero llegar a 200 pedidos por mes"

GALI ANALIZA:
  → Tienes 47 pedidos este mes (mes actual)
  → Tu ROAS promedio histórico: 2.3x
  → Tus productos top: Collar GPS (60% del volumen)
  → Tus ciudades top: Bogotá 55%, Medellín 25%
  → Tu inversión actual en ads: $180k COP/semana

GALI ENTREGA:
  ┌─────────────────────────────────────────────────────┐
  │  ROADMAP PARA 200 PEDIDOS/MES                       │
  │                                                     │
  │  SEMANA 1: Diversificación (meta: 60 pedidos)       │
  │  └── Lanzar 2 productos adicionales al Collar GPS   │
  │       Gali sugiere: [Tapete Acupresión] [LED Facial]│
  │                                                     │
  │  SEMANA 2: Escalar ads (meta: 100 pedidos)          │
  │  └── Aumentar budget a $280k COP/semana             │
  │       Foco: Bogotá + probar Cali                    │
  │                                                     │
  │  SEMANA 3: Nuevas ciudades (meta: 150 pedidos)      │
  │  └── Activar Medellín con creative adaptado         │
  │                                                     │
  │  SEMANA 4: Consolidar (meta: 200 pedidos)           │
  │  └── Automatizar confirmación + resolver novedades  │
  │                                                     │
  │  [Empezar semana 1 →]  [Ajustar mi objetivo]       │
  └─────────────────────────────────────────────────────┘
```

**Implicación de diseño:** Nueva vista `Mi Objetivo` — el usuario declara su meta, Gali la convierte en un roadmap de bloques ejecutables. Cada bloque del roadmap es un `Proyecto` clickeable.

**Qué se reutiliza de V3:**
- `project.service.ts` + modelo `GaliProject` — cada bloque del roadmap se materializa como un proyecto V3 con memoria propia (no se inventa entidad nueva).
- `block-misiones.component.ts` y `retos.service.ts` — la mecánica de gamificación con metas semanales se aprovecha para el roadmap (progreso visual + insignias al completar fase).
- `proximos-pasos.service.ts` — el patrón "siguiente acción contextual" ya existente sirve como CTA dentro de cada paso del roadmap.

---

## PARTE 3 — LA NUEVA ARQUITECTURA: GALI V4

### 3.1 — Metáfora rectora: "El sistema operativo personal del dropshipper"

Gali V4 combina cuatro paradigmas en uno:

| Paradigma | Referente | Qué le da a Dropi |
|---|---|---|
| **Proyectos con contexto** | Claude / Cursor | El dropshipper crea proyectos con memoria persistente. Gali recuerda todo lo que pasó en ese proyecto. |
| **Constructor visual de automatizaciones** | Make.ai | Triggers + condiciones + acciones visuales. Dropi como orquestador de tu stack. |
| **Líder de comunidad virtualizado** | (único en LATAM) | Gali sintetiza la inteligencia colectiva de 150k dropshippers en tiempo real. |
| **Modo Objetivos** | (único en el sector) | El usuario declara su meta. Gali construye el camino basado en sus datos reales. |

### 3.2 — Layout Global V4 (evolución del tri-pane V3)

> **El layout V4 NO es nuevo — es la evolución del tri-pane V3 ya implementado** (`gali-v3-shell.component.ts` + `components/gali-v3/shell/*`). Cambia: 3 entradas adicionales en TopBar (Comunidad / Mi Stack / Objetivo) y 2 zonas adicionales en el panel derecho. El resto del shell se mantiene.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ✦ Dropi  [⌘K Buscar o pedir algo...]  [Comunidad] [Mi Stack] [Objetivo]  👤 │  ← TopBar (V3 + 3 entradas nuevas)
├──────────────────┬──────────────────────────────────────────┬────────────────┤
│                  │                                          │                │
│  SIDEBAR V3      │        ÁREA PRINCIPAL                    │  GALI V4       │
│  (existente)     │        (cambia según contexto)           │  PANEL         │
│                  │                                          │  (V3 + 2 zonas)│
│  ✦ PROYECTOS    │   [Vista Home / Proyectos]               │                │
│  + Nuevo         │   [Vista Objetivo Activo]                │  📡 Líder      │
│  • Collar GPS    │   [Vista Constructor]                    │  Virtual NEW   │
│  • Skincare      │   [Vista Orquestador]                    │  🔨 Construir  │
│                  │   [Mapa del Negocio (V3)]                │  💬 Chat libre │
│  ─ MI NEGOCIO    │   [Retos (V3)]                           │  🎯 Mi         │
│  Hoy             │                                          │  Objetivo  NEW │
│  Pedidos ✦      │                                          │  ⚡ Stack      │
│  Catálogo ✦     │                                          │  conectado     │
│  Campañas ✦     │                                          │  (extiende V3) │
│  Wallet          │                                          │                │
│                  │                                          │  ─ MEMORIA     │
│  ─ RECIPES       │                                          │  (V3 intacta)  │
│  ⌘ BLOQUES       │                                          │                │
│  🌐 MI STACK     │                                          │                │
└──────────────────┴──────────────────────────────────────────┴────────────────┘
```

### 3.3 — El Panel Gali V4: de 3 zonas (V3) a 5 zonas (V4)

El panel derecho ya existe en V3 con **3 zonas**: Negocio Live (KPIs/señales) · Memoria editable · Chat con streaming.

V4 lo evoluciona a **5 zonas**, agregando 2:

1. **📡 Líder Virtual** *(NUEVA)* — Síntesis de inteligencia comunitaria relevante para el usuario ahora. Reemplaza el banner promo del shell V3 cuando aplica.
2. **🔨 Construir aquí** *(YA EXISTE en V3 como acciones contextuales del chat + slash commands)* — Se mantiene; solo se amplía con comandos para Recipes.
3. **💬 Chat libre** *(YA EXISTE en V3, `chat.service.ts` con streaming)* — Se mantiene; en V4 se conecta a Claude API real.
4. **🎯 Mi Objetivo** *(NUEVA)* — Progreso hacia el objetivo declarado + próximo paso. Usa `proximos-pasos.service.ts` existente.
5. **⚡ Stack activo** *(EVOLUCIÓN del bloque integraciones de V3)* — Status de las conexiones del `Mi Stack` personal con `intelligence_score`.

**Memoria de Gali** (sección existente en V3 panel derecho, con `memory-inspector` y chips editables) **se conserva tal cual** — es el principio H#14 ya bien implementado.

---

## PARTE 4 — SPECS DE PANTALLAS CLAVE (8 vistas)

---

### VISTA 1 — HOME / PROYECTOS

**Clasificación:** 🟡 EVOLUCIÓN
**Estado V3 → Delta V4:**
- V3 ya tiene `pages/gali-v3/inicio/` con Welcome Artifact memory-aware + 3 cards (Reanudar último proyecto / Construir nuevo / Builder) + plantillas destacadas + chips de vistas guardadas. `project.service.ts` provee 3 proyectos mock con memoria rica.
- **Delta V4:** agregar briefing "mientras no estabas" alimentado por **Líder Virtual** (síntesis comunitaria) + chip de objetivo activo del **Modo Objetivos** + redirección de "+ Nuevo proyecto" al onboarding 3-preguntas de objetivo.

```markdown
### Vista *
- Nombre: Home — Proyectos y Centro de Comando
- Módulo: Home (reemplaza el dashboard actual)
- Rol de usuario: dropshipper (todos los segmentos)

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: proyectos activos + señales de negocio
- Cantidad mínima de items: 3 proyectos activos + 5 señales
- Propiedades importantes:
  • Proyecto: nombre, objetivo, % progreso, última actividad, productos vinculados
  • Señal: tipo (oportunidad/riesgo/comunidad), descripción, acción sugerida
- ¿Hay imágenes en el diseño?: sí — thumbnail del producto por proyecto

### Interacciones clave
- Click en proyecto → abre el lienzo del proyecto con contexto completo (memoria de Gali)
- "+ Nuevo proyecto" → Gali pregunta "¿Cuál es tu objetivo con este proyecto?" (3 opciones + texto libre)
- Panel Gali → muestra "Buenos días [nombre]. Mientras no estabas:" + señales priorizadas
- ⌘+K → abre command palette con sugerencias contextuales para el día
- Click en "Mi Objetivo" en el panel Gali → muestra el roadmap del objetivo activo
- TopBar "Comunidad" → abre vista ComunidadEnVivo
- TopBar "Mi Stack" → abre vista de conexiones personales

### Contexto adicional
- Notas de diseño: Esta vista reemplaza el concepto de "Dashboard de misiones" del gali-v3.
  La diferencia clave: los proyectos tienen memoria persistente (Gali recuerda todo lo que pasó).
  Para el novato: el primer proyecto es pre-creado por Gali ("Tu primer lanzamiento").
  Para el power user: esta pantalla puede estar vacía de proyectos predefinidos — el construye los suyos.
- Componentes DS a usar: dropi-project-card, dropi-signal-card, dropi-button, gali-briefing-hero
- Accesibilidad WCAG AA:
  • Cada proyecto card debe tener aria-label descriptivo con nombre + % progreso
  • El panel Gali debe ser navegable por teclado (Tab para pasar entre señales)
  • Contraste mínimo 4.5:1 en todos los textos sobre fondos coloreados de señales
```

---

### VISTA 2 — LIENZO DE PROYECTO (el corazón de V4)

**Clasificación:** 🟢 CONSERVAR + amplificar
**Estado V3 → Delta V4:**
- V3 ya tiene `pages/gali-v3/proyecto/:id/` con hero pipeline (Producto→Landing→Campaña→ROAS), panel "Siguiente acción", panel "Lo que sé de este proyecto", tabs (Conversaciones/Decisiones/Artifacts). Memoria por proyecto vía thread IDs en `chat.service.ts`. Streaming palabra-por-palabra ya funciona.
- **Delta V4:** agregar toggle "Modo Constructor" (líneas de conexión entre bloques visibles, puntos de anclaje expuestos) + "Conectar con Recipe" al seleccionar 2 bloques + comandos slash adicionales (`/automatizar`, `/conectar`, `/exportar`) sobre el catálogo de slash-commands existente.

```markdown
### Vista *
- Nombre: Proyecto — Lienzo con memoria Gali
- Módulo: Proyectos
- Rol de usuario: dropshipper

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: bloques del proyecto + historial de Gali
- Cantidad mínima de items: 4-6 bloques en el lienzo
- Propiedades importantes:
  • Bloque: tipo, título, estado, datos internos, última actualización
  • Memoria Gali: últimas 10 interacciones en contexto del proyecto
  • Producto anclado: nombre, imagen, margen, ventas/semana
- ¿Hay imágenes?: sí — thumbnail del producto anclado al proyecto

### Interacciones clave
- Drag & drop de bloques para reorganizar el lienzo
- Click en "+" o escribir a Gali "agrega un bloque de [X]" → Gali crea el bloque
- Click en cualquier bloque → aparece toolbar contextual (editar, conectar, eliminar, exportar)
- Toggle "Modo Constructor" (sidebar) → líneas de conexión entre bloques visibles, puntos de anclaje expuestos
- Gali recuerda el contexto: "La última vez que abriste este proyecto dejaste pendiente X"
- Comandos slash en el chat: /analizar, /crear, /automatizar, /conectar, /exportar
- Seleccionar 2 bloques + click derecho → "Conectar con Recipe" (abre editor de recipe entre ellos)
- "Guardar como vista" → guarda el estado actual del lienzo como vista reutilizable

### Contexto adicional
- Notas de diseño: Cada proyecto tiene su propia memoria con Gali. Al entrar a un proyecto,
  Gali carga el contexto completo: qué productos, qué estrategias, qué resultados.
  La experiencia es como abrir un proyecto en Cursor: el contexto está listo.
  El panel Gali muestra en este contexto:
  1. Resumen del proyecto ("Llevas 5 días en este proyecto, lanzaste 1 campaña")
  2. Señales específicas del proyecto ("Tu Collar GPS bajó ROAS 0.3 desde ayer")
  3. Siguiente acción sugerida con base en el historial del proyecto
- Componentes DS a usar: dropi-canvas, dropi-block, dropi-connector, gali-panel, dropi-toolbar
- Accesibilidad WCAG AA:
  • Los bloques deben ser navegables con teclado (arrow keys para moverse entre bloques)
  • Las conexiones entre bloques deben describirse con aria-describedby para screen readers
  • El modo Constructor debe tener indicadores visuales además de las líneas (iconos en bordes)
  • Focus visible en todo elemento interactivo del lienzo (outline 3px mínimo)
```

---

### VISTA 3 — LÍDER VIRTUAL DE COMUNIDAD

**Clasificación:** 🔴 NUEVA
**Estado V3 → Delta V4:**
- V3 NO tiene equivalente. `signals.service.ts` solo emite 5 señales locales del usuario, no datos agregados de la comunidad. No hay vista `/comunidad`.
- **Delta V4 (todo nuevo):** vista completa `/gali-v3/comunidad`, mock `mocks/gali-v3/comunidad.json` (10 señales + 5 productos trending + 3 casos top), componente `gali-community-hero`, filtros de relevancia, modo mentor. **Riesgos críticos del análisis heurístico (Parte 1):** H#11 (transparencia/fuentes citadas), H#13 (badges de confianza), H#9 (qué dice Gali cuando no hay datos suficientes para el nicho).

```markdown
### Vista *
- Nombre: Comunidad en Vivo — Señales del ecosistema
- Módulo: Comunidad (nuevo módulo en TopBar)
- Rol de usuario: dropshipper

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: señales comunitarias + tendencias + rankings
- Cantidad mínima de items: 10 señales, 5 productos en tendencia, 3 casos de éxito
- Propiedades importantes:
  • Señal comunitaria: tipo (tendencia/alerta/estrategia), descripción, # vendedores afectados,
    relevancia para el usuario (% match con su perfil), fuente (anonimizada)
  • Producto trending: nombre, % de crecimiento esta semana, # vendedores activos,
    margen promedio, saturación estimada (días antes de saturar)
  • Caso de éxito: segmento del vendedor, producto, resultado, estrategia usada (anonimizado)
- ¿Hay imágenes?: sí — thumbnails de productos en tendencia

### Interacciones clave
- Filtro de relevancia: "Para mi perfil" (default) / "Todo el ecosistema" / "Mi nicho"
- Click en señal comunitaria → Gali expande con análisis y acción sugerida
- Click en producto trending → abre ProductCard con datos de comunidad integrados
- Click en "Aplicar a mi proyecto" en cualquier insight → Gali lo integra al proyecto activo
- Sección "¿Qué haría el top 10% esta semana?" → Gali sintetiza los 3 movimientos más inteligentes
  que los mejores vendedores están haciendo AHORA
- Toggle "Modo mentor" → Gali habla como un líder senior: "Lo que yo haría en tu lugar es..."
- Sección "Alertas de la comunidad" → qué está fallando (transportadoras, proveedores, saturación)

### Contexto adicional
- Notas de diseño: Esta es la pantalla que virtualiza al líder de comunidad.
  NO es un foro, NO es un muro de testimonios.
  Es inteligencia colectiva destilada y personalizada por Gali.
  El vocabulario es de mentor/experto, no de chatbot.
  Gali habla aquí como si fuera la voz combinada de los top 5% vendedores de Dropi.
  
  Layout sugerido:
  ┌────────────────────────────────────────────────────────┐
  │  ✦ GALI como Líder: "Esta semana en la comunidad..."  │
  │  [resumen ejecutivo de 3 frases]                       │
  ├────────────────────────────────────────────────────────┤
  │  🔥 EN TENDENCIA     │  ⚠️ ALERTAS        │  🏆 TOP    │
  │  [ProductCards]      │  [AlertCards]      │  [Casos]   │
  └────────────────────────────────────────────────────────┘

- Componentes DS a usar: gali-community-hero, dropi-trend-card, dropi-alert-card, dropi-success-card
- Accesibilidad WCAG AA:
  • Las alertas (⚠️) deben tener role="alert" para ser anunciadas por screen readers inmediatamente
  • Los filtros de relevancia deben ser radio buttons accesibles, no tabs visuales sin role
  • Las cards de éxito anónimas deben indicar que son datos anonimizados (aria-label + texto visible)
  • Color de alertas: no depender solo del rojo — acompañar siempre con ícono de advertencia
```

---

### VISTA 4 — MI STACK PERSONAL (conexión de apps)

**Clasificación:** 🟡 EVOLUCIÓN
**Estado V3 → Delta V4:**
- V3 ya tiene `/gali-v3/integraciones` con 7 plataformas mock (Tienda Nube, Shopify, Woo, Meta, Google Ads, Mailchimp, WhatsApp Biz) agrupadas por tienda/ads/mensajería + modal de conexión 3 pasos. `marketplace.service.ts` y `mocks/gali-v3/mercado/conexiones.json` (6 conexiones) ya gestionan el toggle.
- **Delta V4:** (1) extender de 7 a 15+ plataformas (agregar TikTok, Google Sheets, Notion, Gmail, banca, Webhook, etc.), (2) layout 4-categorías (Ads / Finanzas / Comms / E-commerce), (3) **"Gali intelligence score"** por integración (cuánto mejora Gali con esa conexión), (4) sección "insights generados por Gali gracias a esta conexión", (5) **OAuth real** reemplazando el mock actual. **Riesgo H#5 (Parte 1):** OAuth flow debe ser claramente reversible.

```markdown
### Vista *
- Nombre: Mi Stack — Herramientas conectadas
- Módulo: Mi Stack (sidebar + configuración)
- Rol de usuario: dropshipper (operador / escala / power)

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: integraciones disponibles + estado de conexión
- Cantidad mínima de items: 15 integraciones disponibles, agrupadas por categoría
- Propiedades importantes:
  • Integración: nombre, logo, estado (conectado/desconectado/error), última sync,
    datos que comparte con Gali, # de insights generados por Gali con estos datos
  • Categorías: Ads, Finanzas, Comunicación, E-commerce, Productividad, Logistics
- ¿Hay imágenes?: sí — logos de las integraciones (Meta, TikTok, Google, Shopify, etc.)

### Interacciones clave
- Click en integración desconectada → flow OAuth (ventana popup) o input de API key
- Click en integración conectada → ver datos compartidos con Gali + insights generados
- "Gali recomienda conectar [X]" → chip de sugerencia basado en el perfil del usuario
- Toggle per integración → pausar/reanudar sin desconectar
- "¿Qué datos usa Gali de esta integración?" → tooltip/modal explicativo
- "Ver insights generados por Gali gracias a esta conexión" → lista de insights recientes
- Drag & drop para reordenar integraciones por prioridad personal
- Sección "Importar datos históricos" → para integraciones nuevas, traer historial

### Contexto adicional
- Notas de diseño: Esta vista está inspirada en la pantalla de conexiones de Make.ai,
  pero simplificada para el dropshipper no técnico.
  
  El principio es: "Cada integración que conectas hace a Gali más inteligente para ti."
  
  Cada integración muestra un "Gali intelligence score" — cuánto mejor es Gali
  con esa conexión activa vs. sin ella. Esto motiva a conectar más.
  
  Layout sugerido (inspirado en Make):
  ┌──────────────────────────────────────────────────────────┐
  │  ✦ Gali dice: "Tienes 3/8 conexiones recomendadas.      │
  │  Con Google Sheets conectado, podría analizar tu P&L    │
  │  real y darte proyecciones más precisas."               │
  ├──────────────────────────────────────────────────────────┤
  │  ADS          FINANZAS        COMMS        E-COMMERCE   │
  │  [Meta ✓]     [GSheets ✗]    [WA Biz ✓]  [Shopify ✗]  │
  │  [TikTok ✓]   [Nequi ✗]     [Gmail ✗]   [MeLi ✗]     │
  └──────────────────────────────────────────────────────────┘

- Componentes DS a usar: dropi-integration-card, dropi-oauth-button, gali-recommendation-chip
- Accesibilidad WCAG AA:
  • Los estados de conexión deben usar texto + icono (no solo color verde/rojo)
  • El flow OAuth abre en popup — debe manejar el retorno del foco al botón original
  • Los logos de integraciones deben tener alt text descriptivo
  • La lista de integraciones debe ser navegable por teclado con filtros por categoría
```

---

### VISTA 5 — MODO OBJETIVOS → ROADMAP

**Clasificación:** 🔴 NUEVA
**Estado V3 → Delta V4:**
- V3 tiene gamificación (`pages/gali-v3/retos/` con 4 retos diarios + 4 semanales + 2 misiones + insignias + leaderboard) y misiones en `block-misiones.component.ts`, pero NO tiene Modo Objetivos declarados por el usuario con roadmap auto-generado por Gali.
- **Delta V4 (todo nuevo):** vista completa `/gali-v3/objetivo`, servicio `objetivo.service.ts`, mock `mocks/gali-v3/objetivos.json`, componente `roadmap-timeline`. Onboarding 3 preguntas ("¿Qué quieres lograr?" + "¿Para cuándo?" + "¿Qué tienes hoy?"). Cada paso del roadmap se materializa como un `GaliProject` (reutiliza modelo V3). **Riesgos críticos del análisis (Parte 1):** H#13 (roadmap probabilístico, no determinístico) + H#11 (cada paso explica "Gali sugiere esto porque...") + H#3 (edición granular del roadmap).

```markdown
### Vista *
- Nombre: Mi Objetivo — Roadmap personalizado por Gali
- Módulo: Objetivos (panel Gali + vista completa)
- Rol de usuario: dropshipper

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: objetivo declarado + roadmap generado + progreso
- Cantidad mínima de items: 1 objetivo activo, roadmap de 4 semanas, 12+ pasos
- Propiedades importantes:
  • Objetivo: descripción en lenguaje del usuario, métrica (# pedidos, $ ingresos, % ROAS),
    plazo (semanas), % completado actual, % proyectado
  • Semana del roadmap: meta parcial, pasos específicos (2-4 por semana), estado
  • Paso: título, descripción, acción concreta, bloque de Dropi vinculado, estado
- ¿Hay imágenes?: no (visualización de datos)

### Interacciones clave
- Onboarding del objetivo: Gali hace 3 preguntas ("¿Qué quieres lograr?" + "¿Para cuándo?" + "¿Qué tienes hoy?")
- Gali genera el roadmap basado en datos reales del usuario + benchmarks de la comunidad
- Click en semana del roadmap → expande los pasos específicos con acciones ejecutables
- Click en un paso → navega directo al bloque de Dropi correspondiente (p.ej. click en "Lanzar campaña Cali" → abre el CampaignBuilder con la ciudad pre-configurada)
- "Ajustar mi objetivo" → Gali recalcula el roadmap sin perder el progreso existente
- Barra de progreso visual: real vs. proyectado (línea de Gali en gráfica)
- "¿Voy bien?" → Gali compara tu progreso vs. usuarios similares que tuvieron el mismo objetivo
- Notificación semanal de progreso (configurable por el usuario)

### Contexto adicional
- Notas de diseño: Esta es la vista que transforma la intención del usuario en un plan accionable.
  
  Es el equivalente a "lo que haría un buen coach de negocios" si tuviera acceso a todos tus datos.
  
  La clave es que el roadmap NO es genérico — Gali usa:
  1. Tu historial de ventas (qué tan rápido creces normalmente)
  2. Tus productos actuales (dónde hay potencial real de escala)
  3. Benchmarks de la comunidad (qué hicieron los que lograron el mismo objetivo)
  4. Tu stack conectado (con qué herramientas operas)
  
  Layout sugerido:
  ┌──────────────────────────────────────────────────────────┐
  │  🎯 META: 200 pedidos/mes  │ HOY: 47  │ Fecha: Jun 30   │
  │  ████░░░░░░░░░░ 23.5%      │ Proyección Gali: 195       │
  ├──────────────────────────────────────────────────────────┤
  │  SEMANA 1  │  SEMANA 2  │  SEMANA 3  │  SEMANA 4        │
  │  Meta: 60  │  Meta: 100 │  Meta: 150 │  Meta: 200       │
  │  [Pasos]   │  [Pasos]   │  [Pasos]   │  [Pasos]         │
  └──────────────────────────────────────────────────────────┘

- Componentes DS a usar: dropi-goal-hero, dropi-roadmap-timeline, dropi-step-card, gali-projection-chart
- Accesibilidad WCAG AA:
  • El progreso debe usar tanto la barra visual como texto "23.5% completado, 76.5% restante"
  • Los pasos completados/pendientes deben diferenciarse por más que color (ícono ✓ vs. ○)
  • La gráfica de proyección debe tener tabla de datos accesible como alternativa
  • Las semanas del roadmap deben ser navegables con teclado como accordions
```

---

### VISTA 6 — ORQUESTADOR DE RECIPES (Make-style)

**Clasificación:** 🟡 EVOLUCIÓN
**Estado V3 → Delta V4:**
- V3 ya tiene `pages/gali-v3/builder/` con sidebar de flows + paleta tabbed (Triggers/Acciones/Lógica) + canvas con nodos encadenados verticales + terminal oscura con log de ejecución en vivo (mock). `services/gali-v3/flow.service.ts` ya tiene CRUD de flows y ejecución mock con eventos streamed. `mocks/gali-v3/flow-blocks-catalog.json` define **8 triggers + 12 acciones + 3 condiciones**.
- **Delta V4:** (1) **modo chat-to-flow primario** — usuario describe en español y Gali construye visualmente en tiempo real (hoy V3 es solo visual), (2) **engine real de evaluación** reemplazando log streamed mock con triggers verificables sobre eventos Dropi + Stack conectado, (3) schema tipado en inputs/outputs (anti-error, regla §5.3), (4) templates de la comunidad, (5) "Compartir recipe" con link de instalación. **Riesgo H#11 (Parte 1):** cuando Gali construye desde chat, debe mostrar `executionSteps + reasoning` visibles (principio Make AI Agents).

```markdown
### Vista *
- Nombre: Editor de Recipe — Orquestador visual
- Módulo: Recipes
- Rol de usuario: dropshipper (operador / escala / power)

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: recipe (automatización) en construcción
- Cantidad mínima de items: 1 recipe con 3-5 nodos
- Propiedades importantes:
  • Nodo Trigger: tipo, condición, descripción en lenguaje natural
  • Nodo Condición: operador lógico (si/y/o), valor de comparación
  • Nodo Acción: qué hacer, parámetros de la acción
  • Nodo Notificación: canal (WhatsApp/email/push), mensaje
  • Recipe: nombre, estado (activa/pausa/borrador), # ejecuciones, última ejecución
- ¿Hay imágenes?: no (canvas con nodos visuales)

### Interacciones clave
- MODO CHAT: "Gali, automatiza X si Y pasa" → Gali construye la recipe visualmente en tiempo real
- MODO VISUAL: drag & drop de nodos desde la librería al canvas
- Click en nodo → abre panel de configuración del nodo (igual que Make)
- Líneas de conexión entre nodos = flujo de datos (dibujables con click+drag)
- "Probar recipe" → dry-run sin ejecutar realmente (como Make test mode)
- "Ver log" → historial de ejecuciones con estado (éxito/fallo/saltado)
- Zoom in/out en el canvas con scroll
- Templates: galería de recipes pre-construidas por la comunidad (filtrable por módulo)
- "Compartir recipe" → genera un link/código para que otros dropshippers la instalen
- "Recetas sugeridas por Gali" → basadas en el comportamiento del usuario (patrones repetitivos)

### Contexto adicional
- Notas de diseño: Esta vista está directamente inspirada en Make.ai.
  
  La diferencia con Make: el lenguaje natural es el modo primario.
  El usuario puede describir la automatización en español y Gali la construye.
  El canvas visual es el modo secundario (para revisar, ajustar, entender).
  
  Anatomía de un nodo (inspirada en Make):
  ┌─────────────────┐
  │  [Ícono módulo] │
  │  TRIGGER        │
  │  Nueva orden    │
  │  recibida       │
  │                 │
  │  ⚙ Configurar  │
  └─────────────────┘
  
  Tipos de nodos disponibles (inspirados en Make categorías):
  • Triggers de Dropi (pedidos, productos, wallet, logística)
  • Triggers de tiempo (cron, fecha específica)
  • Triggers externos (webhook, mensaje WhatsApp)
  • Condiciones (si/y/o, con comparadores)
  • Acciones de Dropi (confirmar pedido, crear campaña, notificar)
  • Acciones externas (enviar WhatsApp, email, llamar API)
  • Acciones de Gali (analizar, generar, predecir)
  
- Componentes DS a usar: dropi-recipe-canvas, dropi-node, dropi-connector-line, dropi-node-library
- Accesibilidad WCAG AA:
  • El canvas debe tener un modo de lista accesible (alternativa a la vista gráfica)
  • Los nodos deben ser seleccionables y configurables solo con teclado
  • Las conexiones entre nodos deben describirse con texto (p.ej: "Trigger conectado a Condición 1")
  • El dry-run debe mostrar el resultado en texto, no solo en animación visual
```

---

### VISTA 7 — NEGOCIO EN VIVO (visibilidad siempre disponible)

**Clasificación:** 🟢 CONSERVAR
**Estado V3 → Delta V4:**
- V3 ya tiene esta vista completa: canvas libre personalizable con grid 4-cols + starter pack "operacion-diaria" + 11 bloques (`block-pedidos`, `block-cartera`, `block-misiones`, `block-integraciones`, `block-landings`, `block-productos`, `block-novedades`, `block-memoria`, `block-metricas`, `block-proyecto-activo`, `block-starter-tour`) + 6 pantallas Dropi "despertadas" con triage/scoring/diagnóstico de Gali + GaliBriefing al abrir. Vistas guardadas en `vista/:slug`. Mapa del negocio en `/gali-v3/mapa` (21 nodos, 6 zonas).
- **Delta V4 (mínimo):** (1) completar "diagnóstico de Gali" siempre visible por KPI (hoy parcial), (2) "Vista condensada" mobile que colapsa todo a 1 pantalla, (3) límite "máx 3 above-the-fold" para mitigar H#8 minimalismo.

```markdown
### Vista *
- Nombre: Mi Negocio Hoy — Centro de comando en vivo
- Módulo: Home (vista "Hoy" en sidebar)
- Rol de usuario: dropshipper (operador / escala)

### Tipo de vista *
- [x] Página completa (page)

### Datos mock
- Entidad principal: métricas en vivo + actividad del día
- Cantidad mínima de items: 8 KPIs, 15+ pedidos, 3+ campañas activas
- Propiedades importantes:
  • KPI: nombre, valor actual, variación vs ayer/semana, diagnóstico de Gali, acción sugerida
  • Pedido: ID, estado, ciudad, monto, novedad activa (si aplica)
  • Campaña: nombre, ROAS, CTR, inversión, estado, señal de Gali
  • Señal del día: tipo, descripción, urgencia (alta/media/baja), acción directa
- ¿Hay imágenes?: no (datos y gráficas)

### Interacciones clave
- GaliBriefing al abrir: "Hola [nombre]. Mientras no estabas: [X pedidos, Y novedades, Z señales]"
- Cada KPI es clickeable → expande con diagnóstico de Gali + histórico + acción sugerida
- KPI drag & drop para reordenar según prioridad personal
- "Agregar KPI" → lista de métricas disponibles para agregar al lienzo
- Pedidos en mini-kanban (máximo 5 estados visibles, scroll horizontal)
- Click en pedido con novedad → abre modal de triage de la novedad
- Campañas con scoring visual (verde/amarillo/rojo por ROAS) + botón de acción rápida
- "Gali, ¿cómo va mi día?" → Gali genera un resumen verbal en tiempo real
- Toggle "Vista condensada" → colapsa todo a un resumen de 1 pantalla para mobile

### Contexto adicional
- Notas de diseño: Esta vista responde a la pregunta "¿qué pasa con mi negocio en Dropi?"
  Es la que coexiste con los proyectos — el usuario puede tener proyectos de lanzamiento
  en la vista Proyectos, y al mismo tiempo ver qué pasa en su operación diaria aquí.
  
  La diferencia con el dashboard actual: cada número tiene diagnóstico de Gali.
  No es un reporte — es un centro de comando activo donde cada dato invita a una acción.
  
  Layout (lienzo de bloques como en el V3):
  ┌────────────────────────────────────────────────────────────┐
  │  ✦ Gali: "Buenos días. Vendiste 14 units. 2 novedades."   │
  ├──────────┬──────────┬──────────┬──────────┬───────────────┤
  │ Pedidos  │  ROAS    │ Wallet   │ Novedades │  Campañas     │
  │ hoy: 14  │  2.8x    │ $380k   │  🔴 2    │  [Grid 3]     │
  │ ▲+3      │  ▼-0.2  │ ▲+8%    │  pendien.│               │
  └──────────┴──────────┴──────────┴──────────┴───────────────┘

- Componentes DS a usar: gali-briefing-hero, dropi-kpi-tile, dropi-mini-kanban, dropi-campaign-health
- Accesibilidad WCAG AA:
  • Variaciones numéricas (▲▼) deben acompañarse de texto ("aumento de 3" / "baja de 0.2")
  • Los colores de estado (verde/amarillo/rojo) deben tener siempre ícono adicional
  • El mini-kanban debe ser navegable por teclado con roles de lista apropiados
  • El GaliBriefing debe poder ser detenido/pausado (para usuarios con preferencia de movimiento reducido)
```

---

### VISTA 8 — CONSTRUCTOR DE COMPONENTES (Modo Constructor)

**Clasificación:** 🔴 NUEVA
**Estado V3 → Delta V4:**
- V3 tiene `block-registry.ts` que permite registrar bloques con manifest (sizes, datasource, expandRoute) y 11 bloques ya registrados, pero NO tiene UI de construcción de bloques personalizados por chat.
- **Delta V4 (todo nuevo):** modal con split chat (40% izq) + preview en vivo (60% der). Modo Chat (usuario describe el bloque) + Modo Manual (formulario estructurado para power user). "Probar con datos reales" carga datos del usuario en el preview. "Guardar en mis bloques" lo agrega a `block-registry.ts` (reutiliza infraestructura V3). **Riesgos críticos (Parte 1):** H#13 (preview debe mostrar cuándo datos son simulados vs reales) + H#5 (validar costo computacional antes de guardar) + H#10 (novato necesita ejemplos antes que campo vacío).

```markdown
### Vista *
- Nombre: Modo Constructor — Crear bloque personalizado
- Módulo: Bloques Custom
- Rol de usuario: dropshipper (operador / power — no novatos)

### Tipo de vista *
- [ ] Modal (overlay)
  - ¿Sobre qué vista se apila?: puede abrirse desde cualquier vista del lienzo
  - ¿Qué CTA lo abre?: "✦ Crear bloque con Gali" o toggle "Modo Constructor" en sidebar
  - ¿Qué pasa al completar? (on_success): el bloque queda en el lienzo activo + guardado en "Mis Bloques"
  - ¿Qué pasa al cancelar? (on_cancel): cierra modal, el lienzo queda intacto

### Datos mock
- Entidad principal: configuración del bloque en construcción
- Cantidad mínima de items: 1 bloque en proceso de construcción
- Propiedades importantes:
  • Bloque: tipo (lista/gráfica/métrica/formulario/custom), fuente de datos,
    filtros aplicados, visualización, título, descripción
  • Vista previa: renderizado en tiempo real del bloque según configuración
  • Historial de chat: conversación con Gali para construir el bloque
- ¿Hay imágenes?: sí — preview del bloque generado

### Interacciones clave
- Modo Chat: usuario describe el bloque → Gali lo genera en preview a la derecha
  Ejemplo: "Quiero ver mis ventas por ciudad esta semana comparado con la semana pasada"
  → Gali genera gráfica de barras agrupadas con preview en tiempo real
- Ajustes iterativos: "Ordénalo por mayor crecimiento" → Gali actualiza el preview
- Modo Manual (para power user): formulario estructurado con los mismos parámetros
  (tipo, fuente, filtros, visualización) para quienes prefieren no usar chat
- "Probar con datos reales" → carga datos reales del usuario en el preview
- "Guardar en mis bloques" → nombre + categoría + ícono personalizado
- "Compartir con comunidad" → publicar en marketplace de bloques (toggle + descripción)
- Seleccionar fuente de datos: dropdown con todas las entidades de Dropi + datos del Stack conectado

### Contexto adicional
- Notas de diseño: Esta vista es la manifestación del concepto "constructor" de Gali V4.
  
  Layout del modal:
  ┌────────────────────────────────────────────────────────────────┐
  │  ✦ Constructor de Bloques                              [×]    │
  ├────────────────────────────┬───────────────────────────────────┤
  │  CHAT CON GALI             │  PREVIEW EN VIVO                  │
  │  (izquierda, 40%)          │  (derecha, 60%)                   │
  │                            │                                   │
  │  "Describe el bloque       │  [Renderizado del bloque          │
  │   que necesitas..."        │   se actualiza en tiempo real]    │
  │                            │                                   │
  │  [historial de chat]       │  ──────────────────────           │
  │                            │  Fuente: [dropdown]               │
  │  [input de texto]          │  Tipo: [dropdown]                 │
  │  [⌘+↵ para enviar]        │  Filtros: [tags]                  │
  └────────────────────────────┴───────────────────────────────────┘
  │                    [Guardar bloque →]                          │
  └────────────────────────────────────────────────────────────────┘

  Para el novato que llega aquí por error: Gali detecta el nivel y ofrece
  "¿Quieres que yo te elija el bloque más útil para tu situación?"

- Componentes DS a usar: dropi-block-builder, gali-chat-inline, dropi-block-preview, dropi-source-selector
- Accesibilidad WCAG AA:
  • El modal debe tener role="dialog" con aria-labelledby apuntando al título
  • Foco debe moverse al modal al abrirse y volver al botón original al cerrarse
  • El preview debe tener descripción textual alternativa (aria-label)
  • El campo de chat debe tener placeholder y aria-label descriptivos
  • Shortcut ⌘+↵ debe tener alternativa de botón visible para teclado y móvil
```

---

## PARTE 5 — INTEGRACIÓN MAKE-STYLE: CÓMO FUNCIONA EL ORQUESTADOR

Basado en el análisis del documento Make.ai Architecture, estas son las decisiones de arquitectura para el orquestador de Dropi V4:

### 5.1 — Analogía de Make aplicada a Dropi

| Concepto Make | Equivalente Dropi V4 | Diferencia clave |
|---|---|---|
| **Escenario** | Recipe | La recipe tiene lenguaje natural como modo primario |
| **Trigger** | Evento Dropi | Los eventos ya están definidos por Dropi (no hay que configurar webhooks manualmente) |
| **Módulo App** | Bloque de integración | Se instala arrastrando al lienzo, no configurando conexiones técnicas |
| **Herramienta interna** | Bloque nativo Dropi | Lógica sin API externa (filtros, agregaciones, condiciones) |
| **Iterador/Agregador** | Procesamiento de listas | Gali maneja esto automáticamente al construir recipes de procesamiento masivo |
| **Filtro** | Condición de recipe | Visual como IF/THEN, no código |
| **Router** | Bifurcación de recipe | Ramas paralelas con lógica OR (como Make) |
| **Bundle/Paquete** | Registro de datos | Cada acción procesa registros individuales (1 pedido = 1 operación) |
| **AI Agent** | Gali + Claude | Gali coordina, Claude ejecuta creatividad/análisis |

### 5.2 — Tipos de triggers disponibles para recipes

> **Línea base V3:** `mocks/gali-v3/flow-blocks-catalog.json` ya define **8 triggers + 12 acciones + 3 condiciones** mock. El catálogo abajo representa el objetivo final V4 (engine real). La columna *Estado* indica qué existe ya como mock vs qué requiere engine nuevo.

| Categoría | Triggers específicos | Estado |
|---|---|---|
| **Pedidos** | Nueva orden · Cambio de estado · Novedad detectada · Pedido vencido · Dirección inválida | Parcial en V3 mock; falta verificación real sobre eventos Dropi |
| **Productos** | Stock bajo · Precio cambió · Nuevo en catálogo · Anulado · Entró en tendencia | Parcial en V3 mock; "Entró en tendencia" requiere datos comunidad (Vista 3) |
| **Campañas** | ROAS sobre/bajo umbral · Presupuesto agotado · Creative pendiente · CTR anómalo | Mock V3; requiere webhook Meta/TikTok del Stack Personal (Vista 4) |
| **Wallet** | Saldo bajo umbral · Retiro disponible · Factura recibida · Pago procesado | Mock V3; engine real |
| **Logística** | Cambio transportadora · Retraso detectado · Devolución iniciada · Entrega confirmada | Mock V3; engine real |
| **Tiempo** | Cron · Fecha específica · Relativo al evento (N horas después) | Patrón estándar; implementable directo |
| **Gali** | Detecta oportunidad · Detecta riesgo · Completa análisis · Identifica patrón | `signals.service.ts` V3 ya emite 4 tipos; falta `confianza` (H#13) |
| **Stack Personal** | Meta Ads (nueva métrica) · WhatsApp (mensaje con keyword) · Shopify (nueva orden) · Webhook externo | NUEVO en V4 — requiere OAuth real (Vista 4) |
| **Comunidad** | Producto entra en tendencia · Alerta de proveedor · Benchmark superado | NUEVO en V4 — requiere pipeline datos agregados (Vista 3) |

### 5.3 — Reglas de diseño Make-inspiradas (anti-errores)

Aprendizajes directos del análisis de Make aplicados a Dropi:

1. **Nomenclatura semántica en herramientas de Gali:** Cada bloque/tool que Gali puede usar debe tener nombre + descripción explícita de cuándo NO usarlo. Esto evita que Gali invoque la herramienta equivocada (el mismo problema que Make documenta con los AI Agents).

2. **Schema tipado en inputs/outputs:** Cada nodo de recipe debe definir el tipo de dato que acepta y emite. Esto previene errores en cascada (el equivalente al HTTP 400 Bad Request de Make).

3. **Dry-run antes de activar:** Toda recipe debe poder ejecutarse en modo simulación. No hay activación directa sin preview de lo que va a pasar.

4. **Límites de procesamiento visible:** Si una recipe va a procesar 500 pedidos en batch, Dropi muestra el costo computacional estimado antes de ejecutar (como las "operaciones" de Make).

5. **Transparencia del razonamiento de Gali:** Cuando Gali construye una recipe automáticamente, debe mostrar sus pasos de razonamiento ("Detecté que confirmas pedidos de Bogotá manualmente. Propongo este trigger porque..."). Esto implementa el principio de `executionSteps` + `reasoning` de Make AI Agents.

6. **Thread IDs para contexto:** Cada proyecto tiene un thread ID propio para Gali. Esto asegura que Gali en el proyecto "Lanzamiento Collar GPS" no mezcle contexto con el proyecto "Escala Medellín".

---

## PARTE 6 — GUÍA DE ACCESIBILIDAD WCAG AA PARA GALI V4

> Principios transversales de accesibilidad que aplican a TODAS las vistas.
> **Punto de partida V3:** los tokens en `src/styles/_gali-v3-tokens.scss` ya cumplen contraste WCAG **AAA** en todos los pares texto/fondo definidos (crema `#FAF7F2`, naranja `#F49A3D`, terracota `#B8593A`). Los focus-visible y aria-labels están parciales; V4 completa la auditoría formal.

### 6.1 — El chat de Gali como elemento crítico de accesibilidad

El chat es el input/output principal del sistema. Debe cumplir:

- **Texto alternativo a voz:** El input de voz (`🎤`) siempre tiene equivalente de texto. Nunca es la única opción.
- **Streaming de texto:** El efecto de "Gali escribiendo" (30ms/palabra) debe poder desactivarse con un toggle de preferencia de usuario (aplica a `prefers-reduced-motion`).
- **Focus management:** Al abrir el panel de Gali, el foco va al input. Al cerrarlo, vuelve al elemento que lo abrió.
- **ARIA live regions:** Los mensajes nuevos de Gali deben anunciarse con `aria-live="polite"` para no interrumpir screen readers en medio de otras acciones.

### 6.2 — El lienzo de bloques

- **Navegación por teclado:** Tab para moverse entre bloques, arrow keys para moverlos, Enter para abrir/editar, Delete para eliminar. Toda acción de mouse tiene equivalente de teclado.
- **Alternativa de lista:** El lienzo gráfico debe tener un modo "Vista de lista" para usuarios que no pueden usar interfaces visuales drag-and-drop.
- **Contraste:** Todas las etiquetas sobre bloques deben cumplir contraste 4.5:1. Los fondos de bloques (si son coloreados) deben seleccionarse para cumplir.

### 6.3 — El orquestador de recipes

- **Canvas accesible:** Las conexiones entre nodos (líneas) deben describirse textualmente. Un screen reader debe poder "leer" la recipe como "Trigger: nueva orden → Condición: ciudad es Bogotá → Acción: confirmar pedido".
- **Formulario de nodo:** Al abrir la configuración de un nodo, debe funcionar completamente con teclado y sin dependencia de mouse.

### 6.4 — Paleta de colores con accesibilidad garantizada

| Estado | Color primario | Alternativa no-color |
|---|---|---|
| Éxito / Completado | Verde (#1DB954) | Ícono ✓ + texto "Completado" |
| Advertencia | Amarillo (#F59E0B) | Ícono ⚠ + texto "Atención" |
| Error / Crítico | Rojo (#EF4444) | Ícono ✕ + texto "Error" |
| Inactivo / Pausado | Gris (#9CA3AF) | Ícono ⏸ + texto "Pausado" |
| IA activa (Gali) | Azul índigo (#6366F1) | Ícono ✦ + texto "Gali" |

### 6.5 — Mobile-first considerations

- El lienzo de bloques en mobile usa layout vertical en lugar de 2D libre (bloques se apilan)
- El chat de Gali es el elemento más prominente en mobile (70% del viewport)
- Gestos táctiles (swipe, pinch-zoom) en el canvas tienen equivalente de botones visibles
- Las cards de la comunidad y el roadmap usan scroll vertical nativo de mobile (no scroll horizontal)

---

## PARTE 7 — ROADMAP INCREMENTAL V3 → V4

> **Principio rector:** V3 ya entrega 14+ rutas funcionales, 15 servicios, 30+ componentes. V4 **no se construye desde cero** — se evoluciona reutilizando V3 explícitamente en cada fase. Las fases descartadas del roadmap original (construir Proyectos con memoria, ⌘+K, layout tri-pane, sistema de bloques) **ya existen** en V3.

### Fase 0 — Semanas 1-2: Auditoría y armonización
- Validar este spec V4 refactorizado con equipo (Cata, María Ossa, Michael, Jhainey).
- Cierre del inventario V3 (Parte 0): actualizar `EstadoActualGaliV3.md` y `navigation-map.json` con cualquier cambio reciente.
- Decidir scope V4 vs V5 usando la clasificación NUEVA/EVOLUCIÓN/CONSERVAR de las 8 vistas (Parte 4).
- Wireframes en Figma SOLO de las 3 vistas NUEVAS: Comunidad en Vivo, Modo Objetivos→Roadmap, Constructor de Bloques Custom. Las demás reutilizan UI V3 existente.
- **Skill UX:** `human-architect-mindset` para mapear constraints de OAuth, datos comunidad, banca.

### Fase 1 — Semanas 3-8: Las 3 preguntas sobre el tri-pane existente
Construcción de las 3 nuevas zonas conceptuales sobre el shell V3 ya implementado.
- **Mi Objetivo** *(Vista 5 NUEVA)* — vista `/gali-v3/objetivo`, servicio `objetivo.service.ts`, mock `objetivos.json`, componente `roadmap-timeline`. Cada paso del roadmap se materializa como `GaliProject` (**reutiliza `project.service.ts` V3**).
- **Líder Virtual de Comunidad** *(Vista 3 NUEVA)* — vista `/gali-v3/comunidad`, mock `comunidad.json` (10 señales + 5 trending + 3 casos). **Reutiliza** patrón de `signals.service.ts` V3 y anatomía de `welcome-artifact`.
- **Mi Stack extendido** *(Vista 4 EVOLUCIÓN)* — extender `/gali-v3/integraciones` de 7 a 15+ plataformas, agregar `intelligence_score`, layout 4-categorías Make-style. **Reutiliza** `marketplace.service.ts` y `conexiones.json` V3 (OAuth sigue mock hasta Fase 2).
- **Panel Gali 5 zonas** *(Parte 3.3)* — agregar zonas Líder Virtual + Mi Objetivo al `GaliBusinessContextComponent` V3.
- **Reuso explícito en esta fase:** shell tri-pane, header IA 2, sidebar 56px, tokens `_gali-v3-tokens.scss`, chat streaming, `memory-inspector`, `project.service.ts`, `marketplace.service.ts`, `proximos-pasos.service.ts`, `signals.service.ts`.

### Fase 2 — Semanas 9-14: Engine real reemplazando mocks
Convertir las capas mock de V3 en motor real conectado.
- **Recipes engine** *(Vista 6 EVOLUCIÓN)* — reemplazar log streamed mock en `builder/terminal` por motor real de evaluación. Triggers verificables sobre eventos Dropi + Stack conectado. Schema tipado en `flow.service.ts` (anti-error §5.3). Modo chat-to-flow primario (Gali construye recipe desde español natural).
- **Chat real** — conectar `chat.service.ts` (hoy 6 respuestas mock heurísticas con tick 28ms) a Claude API con SSE/WebSocket. Conservar la UI de streaming intacta. Implementar **H#11 (transparencia del razonamiento)** mostrando `executionSteps + reasoning` en cada respuesta.
- **Memoria persistente backend** — promover `memory.service.ts` de localStorage a backend real con thread IDs por proyecto.
- **OAuth real** — Meta Ads, TikTok, Google Sheets, WhatsApp Biz, Shopify, Webhook. Reemplaza el modal mock de 3 pasos por flows OAuth con popup + handle de retorno de foco (H#5 prevención de errores).
- **Constructor de Bloques Custom** *(Vista 8 NUEVA)* — modal nuevo sobre `block-registry.ts` ya existente. Chat lateral + preview en vivo del bloque. "Guardar en mis bloques" extiende el registry V3.
- **Reuso explícito:** `flow-blocks-catalog.json` (8+12+3), builder UI completo, `block-registry.ts`, `memory.service.ts` (solo cambia capa de persistencia), mock OAuth previo de integraciones, `chat.service.ts` (solo cambia backend de respuestas).

### Fase 3 — Semanas 15-20: Marketplace abierto y ecosistema
- Marketplace de bloques publicados por usuarios — **extiende `mercado/` V3** de 3 tabs (Plantillas/Agentes/Conexiones) a 4 (+ Bloques Custom compartidos).
- Templates de recipes compartidas por comunidad (galería filtrable por módulo).
- "Compartir recipe" → genera link/código para que otros dropshippers la instalen.
- API documentada como bloques arrastrables en el builder.
- Programa de builders de la comunidad.
- **Skill UX:** `renaissance-architecture` para evitar copiar Make 1:1 — preguntarse qué versión LATAM-nativa del marketplace tiene sentido para Dropi.

### Fase 4 — Mes 7+: Expansión multi-plataforma y data flywheel
- App iOS nativa para path Escala/Power (consume mismas APIs).
- Programa de builders monetizado.
- Data flywheel: las recipes de la comunidad alimentan al Líder Virtual (Vista 3), creando el círculo virtuoso "más usuarios → mejores insights → más valor → más usuarios".

### Fases descartadas del V4 original (ya entregadas por V3)
- ❌ "Construir Sistema de Proyectos con memoria" → existe (`project.service.ts` + 3 proyectos mock).
- ❌ "Implementar ⌘+K command palette" → existe (`command-palette.component.ts`).
- ❌ "Layout tri-pane" → existe (`gali-v3-shell.component.ts`).
- ❌ "Sistema de bloques editables" → existe (`canvas.service.ts` + 11 bloques registrados).
- ❌ "Panel Gali con zonas" → existe (3 zonas en V3; V4 solo agrega 2).

---

## CIERRE — EL CONCEPTO EN UNA FRASE

> **Gali V4 no se construye desde cero — evoluciona el V3 ya vivo en `/gali-v3/*` para responder a tres preguntas que ningún competidor LATAM ha contestado: cómo virtualizar al líder de comunidad, cómo dejar que la IA aprenda de todo tu stack personal, y cómo convertir tus objetivos en un roadmap ejecutable. Lo demás — proyectos con memoria, tri-pane Claude-style, chat streaming, builder Make-style, command palette, bloques editables — ya existe. V4 es la capa que cierra el círculo y vuelve a Gali el sistema operativo personal del dropshipper.**

---

### Tensiones a resolver con equipo (zona de decisiones pendientes)

Durante el refactor de este spec surgieron preguntas que no se resuelven unilateralmente:

1. **Datos comunidad y privacidad** — la Vista 3 (Líder Virtual) requiere agregar datos de 150k dropshippers. ¿Qué nivel de anonimización? ¿Opt-in/opt-out? Definir antes de Fase 1.
2. **Memoria backend** — pasar `memory.service.ts` de localStorage a backend implica decisiones de retención, exportabilidad y derecho al olvido (H#14). Coordinar con legal/data.
3. **OAuth y banca** — la integración con Bancolombia/Nequi (mencionada en Pregunta 2) tiene compliance específico LATAM. Validar viabilidad real antes de prometer en UI.
4. **Engine de Recipes en producción** — definir SLA, costo computacional por operación (regla §5.3), y manejo de fallos de integraciones externas (Meta Ads cae → ¿qué hace la recipe?).

---

*Plan Disruptivo Gali V4.0 · Dropi Orquestador · Mayo 2026*
*Refactor armonizado con V3 implementado · referencias: `EstadoActualGaliV3.md`, `PlanGaliV3_AIFirst_Hibrido_BuilderOrquestador.md`, `navigation-map.json`*
*Construido sobre: Plan V3 vivo, Spec Prototipo Gali, Flujo Ideal AI-First, Make.ai Architecture, dropi_user_personas, Re-arquitectura UI Oficial (Figma 88 pantallas)*
*Cata Giraldo · catalina.giraldo@dropi.co*
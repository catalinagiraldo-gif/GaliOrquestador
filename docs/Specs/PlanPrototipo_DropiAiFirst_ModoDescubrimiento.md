# Spec de Planeación — Prototipo "Dropi AI-First: Modo Descubrimiento"

> Plan de implementación derivado de [DropiAiFirst.md](DropiAiFirst.md), Pantalla 2.
> **Skills aplicadas:** `bencium-innovative-ux-designer` (identidad visual distintiva, anti AI-slop) + `agentic-ux-design-relationship-centric-interfaces` (memoria, evolución de confianza, planificación colaborativa).
> **Estado:** planeación completa v2.0 — pendiente de ejecución.
> **Cambios v1 → v2:** identidad visual extendida, arquitectura relacional explícita, transparency phase de trust, execution stream + confidence meter, edge cases, accessibility, responsive, onboarding del demo, anexo de huecos resueltos.

---

## 1. Context

`docs/Specs/DropiAiFirst.md` (1380 líneas) contiene dos versiones del mismo concepto:

- **Parte 1 (líneas 1-385) — "El Flujo Ideal AI-First"**: visión narrativa. Sistema de Misiones, los 4 Modos del Workspace, personalización progresiva, monetización Free/Plus.
- **Parte 2 (líneas 390-1380) — "Spec de Prototipo v1.0"**: spec ejecutable. 6 pantallas detalladas, componentes Gen UI con dimensiones, guiones literales de Gali, mock data concreta, transiciones, criterios de éxito.

La Parte 2 es la **fuente de verdad** para construir el prototipo. Este plan v2.0 adapta el spec a `dropi-prototypes` (Angular 17 standalone + DS Registry + mock interceptor), específicamente para la **Pantalla 2: Modo Descubrimiento** (líneas 635-753 + ProductCard líneas 689-737 + diálogos líneas 740-753 + mock data líneas 1345-1365).

**Outcome esperado:** prototipo navegable que demuestre a Michael Giovanni — en la próxima sesión (línea 369 del spec) — el corazón de la propuesta AI-First. El demo debe lograr **3 reacciones** en el espectador:

1. *"Esto no se parece a Dropi"* — la identidad visual debe romper con lo conocido sin perder el alma de la marca (naranja #f49a3d).
2. *"Gali está pensando, no solo respondiendo"* — el razonamiento debe ser visible (execution stream + confidence meter).
3. *"Esto va a aprender de mí"* — la arquitectura relacional debe ser auto-evidente, no requerir explicación.

---

## 2. Decisiones de alcance confirmadas

| Decisión | Elección | ¿Override del spec? |
|---|---|---|
| Modo a prototipar | Solo Descubrimiento (Pantalla 2) | No — el spec sec. 10 lo prioriza |
| Layout de Gali | **Híbrido**: hero central → colapsa a sidebar derecho 340px al primer mensaje | Sí — spec dice Gali central permanente |
| Sidebar Dropi | **Mantener colapsable** (mini-rail 64px) | Sí — spec sec. 2 dice "no hay sidebar tradicional" |
| Streaming de Gali | Incluir (30ms/palabra + cursor + chips stagger) + toggle para accesibilidad | No — fiel a spec sec. 10 + accessibility |
| Inspiración visual | Cursor 3 para el sidebar post-colapso | No — complementa el spec |
| Fuente de imágenes | Reutilizar `src/assets/images/products/` | No — sin Figma |
| **Identidad tipográfica** | **Híbrido**: display nuevo + IBM Plex Sans (body) + IBM Plex Mono (datos). Inter queda como fallback técnico. | Sí — Inter es genérico, el demo amerita personalidad |
| **Sensación target** | "Vivo y activo" — sistema en movimiento, no chatbot pasivo | — |
| **Memoria** | **Híbrido pedagógico**: Gali no te conoce al inicio, pero muestra en vivo "Lo que estoy aprendiendo de ti" | — |
| **Razonamiento visible** | **Execution Stream + Confidence Meter** (Trust Stage 1 — Transparency Phase) | — |

---

## 3. Identidad Visual

### 3.1 Sistema tipográfico

**3 voces tipográficas**, cada una con un rol funcional:

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| **Display** | `Söhne Breit` (alt libre: `PP Editorial New` o `Migra`) | 400, 600 | Mensajes de Gali, titulares grandes, números heroicos |
| **Body** | `IBM Plex Sans` (en DS Registry) | 400, 500, 600 | UI, labels, descripciones de productos, botones |
| **Mono** | `IBM Plex Mono` | 400, 500 | Execution stream, métricas, confidence %, datos técnicos, IDs |

**Justificación del display:**
- Söhne Breit / PP Editorial New aportan **personalidad editorial** sin caer en lo decorativo
- Da peso emocional a las palabras de Gali (no se siente como un chatbot)
- Contrasta con Plex Sans (body) para crear jerarquía clara
- Inter queda **prohibido como primary** (skill anti AI-slop), aceptable solo como fallback

**Escala tipográfica (ratio 1.25, base 16px):**
```
xs:   12px / 16px line   — etiquetas micro, mono badges
sm:   14px / 20px line   — body small, captions
base: 16px / 24px line   — body, UI estándar
lg:   20px / 28px line   — body grande, sub-headers
xl:   25px / 32px line   — section headers
2xl:  31px / 40px line   — page headers
3xl:  39px / 48px line   — Gali messages en hero state
4xl:  49px / 56px line   — números heroicos (margen, ventas)
5xl:  61px / 64px line   — display extremo (uso muy puntual)
```

**Tracking:**
- Display 3xl+: -0.02em (apretado, editorial)
- Body: default
- Mono: +0.01em
- All-caps: +0.08em (etiquetas EXEC, MARGEN, etc.)

### 3.2 Paleta extendida

**Sensación "vivo y activo" requiere dark theme dominante** — opuesto al Dropi actual blanco/colorido. Esto da contraste con el resto de prototipos del repo y comunica visualmente "esto es nuevo".

```scss
// Backgrounds (escala oscura warm)
$bg-base:       #0F0F12;  // body — deep charcoal con tinte cool
$bg-surface:    #16161A;  // cards, panels
$bg-elevated:   #1E1E24;  // modales, drawers
$bg-overlay:    rgba(15,15,18,0.72);  // backdrops

// Borders
$border-subtle:  rgba(255,255,255,0.06);  // separadores
$border-default: rgba(255,255,255,0.12);  // cards
$border-strong:  rgba(255,255,255,0.20);  // inputs focused

// Text
$text-primary:   #F4F1EA;  // off-white warm — opuesto al gris frío
$text-secondary: #8A8A93;
$text-muted:     #545459;
$text-disabled:  #2F2F35;

// Marca — naranja Dropi mantenido como primary accent
$brand-orange:        #f49a3d;
$brand-orange-hover:  #ffae54;
$brand-orange-glow:   rgba(244,154,61,0.42);  // focus rings, hover halos
$brand-orange-soft:   rgba(244,154,61,0.08);  // backgrounds sutiles

// Acento Gali — cyan complementario para dar dualidad humano/máquina
$gali-cyan:        #4ECDC4;
$gali-cyan-glow:   rgba(78,205,196,0.35);
$gali-violet:      #8B5CF6;  // segundo color del gradient del avatar
$gali-blue:        #5570F1;  // tercer color del gradient

// Status (semánticos)
$status-success:  #6FCF97;
$status-warning:  #f49a3d;  // doble función — naranja Dropi
$status-error:    #E85D5D;
$status-info:     #4ECDC4;

// Datos (margen)
$margin-strong:   #6FCF97;  // >50% verde
$margin-medium:   #f4d03d;  // 30-50% amarillo
$margin-weak:     #E85D5D;  // <30% rojo
```

### 3.3 Atmósfera visual (no es decoración, comunica vida del sistema)

**Grain texture global:**
- SVG noise filter aplicado a `body::before` con `pointer-events: none`
- `opacity: 0.035` — apenas perceptible, da textura analógica al fondo
- Justifica el dark mode (sin grain se siente plástico)

**Gradient mesh ambiente:**
- 3 radial-gradients animados muy lento (28s loop) en el background del workspace
- Color 1: `$brand-orange-soft` desde top-left
- Color 2: `$gali-cyan-glow` desde bottom-right
- Color 3: `$gali-violet` al 0.04 desde center (apenas)
- Movimiento: shift de posición 10-15%, ease-in-out infinite
- Da sensación de "el sistema está vivo aunque tú no hagas nada"

**Sombras (no genéricas):**
```scss
// Sombras tintadas con la paleta de marca
$shadow-card:     0 1px 2px rgba(0,0,0,0.4),
                  0 8px 24px rgba(0,0,0,0.32);

$shadow-card-hover: 0 4px 8px rgba(0,0,0,0.4),
                    0 16px 48px rgba(0,0,0,0.42),
                    0 0 0 1px $border-default inset;

$shadow-cta:      0 1px 2px rgba(0,0,0,0.4),
                  0 12px 28px $brand-orange-glow;  // glow naranja en CTAs

$shadow-gali:     0 0 0 1px rgba(78,205,196,0.18),
                  0 12px 32px rgba(78,205,196,0.14);  // glow cyan en panel de Gali
```

**Border-radius:**
- Cards: 12px
- Chips/badges: 999px (pill)
- Inputs: 8px
- Modales/drawers: 16px (top corners)
- Avatar de Gali: 50% (círculo perfecto)

### 3.4 Avatar de Gali — sistema visual

**No es "círculo gradiente animado" genérico.** Es la identidad de Gali. Diseño específico:

**Composición:**
- Círculo de 80px (hero) / 48px (sidebar) / 32px (inline en mensajes)
- Interior: gradient mesh cónico animado con 3 colores en rotación: `$gali-cyan → $gali-blue → $gali-violet`
- Border exterior: 2px solid `$text-primary` con offset interno de 3px (efecto ring)
- Box-shadow: `$shadow-gali` (glow cyan sutil constante)

**5 estados (spec líneas 1196-1203, ampliados):**

| Estado | Trigger | Animación |
|---|---|---|
| **idle** | Sin actividad | Rotación lenta del gradient mesh (8s loop), pulso sutil de glow cyan (4s) |
| **thinking** | Procesando intención | Pulse rápido scale(0.95 ↔ 1.05) 800ms + aceleración rotación gradient a 2s |
| **speaking** | Mientras streaming texto | Halo cyan expandiéndose desde el borde (efecto sonar, opacity 0.4 → 0, 1.2s loop) |
| **alert** | Necesita atención del usuario | Gradient se desatura → naranja Dropi, single bounce scale(1.1) 400ms, 🔔 micro-overlay |
| **success** | Acción completada | Gradient → green `$status-success`, ✓ overlay 1.6s, vuelve a idle con cross-fade |

**Variante "thinking detallada":** cuando el execution stream está activo, el avatar muestra un mini-spinner orbital cyan alrededor del círculo (3 puntos en órbita, 1.2s loop).

---

## 4. Arquitectura Relacional

> Esta sección operacionaliza los 5 pilares de Agentic UX en el prototipo. Aplicamos **Trust Stage 1 (Transparency Phase)** porque el demo es la primera exposición — el equipo necesita VER el razonamiento, no asumirlo.

### 4.1 Trust Stage 1 — Transparency Phase

**Principio:** "Show all reasoning, decision processes, confidence levels". El usuario debe ver TODO lo que Gali "piensa" antes de confiar.

**Implementación concreta:**

**A. Execution Stream Visible**
- Cuando Gali recibe una intención, en lugar de mostrar solo "thinking spinner" muestra los pasos:
  ```
  ▸ Consultando catálogo Dropi  ✓ 1.4s
  ▸ Filtrando por margen >50%   ✓ 0.6s
  ▸ Cruzando con ventas LATAM   ✓ 0.9s
  ▸ Ranking por demanda actual  ⋯
  ```
- Cada paso aparece en orden, con check verde al completar y spinner cyan en curso
- Tipografía: `IBM Plex Mono` 12px, color `$text-secondary`
- Total visible 2-3 segundos antes de la respuesta — suficiente para que Michael vea "está trabajando", no demasiado para frustrar

**B. Confidence Meter en respuestas**
- Cada mensaje de Gali termina con un meter pequeño:
  ```
  [▰▰▰▰▰▰▰▰▱▱] 84%  Basado en 847 ventas similares — ver detalles ↗
  ```
- Click en "ver detalles" → tooltip flotante con razonamiento extendido:
  - Fuentes de datos consultadas
  - N de casos similares
  - % de match con el query
  - Caveat si aplica ("Tendencia reciente — datos de últimos 7 días")
- Color del meter:
  - >80% → `$status-success`
  - 60-80% → `$brand-orange`
  - <60% → `$status-warning` (Gali admite incertidumbre)

**C. Reasoning anchor en cada ProductCard del canvas**
- Encima de la grid de productos, una barra de contexto:
  ```
  💡 Te muestro estos 8 porque mencionaste "tendencia" — los ordené por
     ventas semanales + margen (>50%). ¿Quieres que ajuste el criterio?
     [Cambiar criterio ↗]
  ```
- Click → modal placeholder "Próximamente: ajustar criterios de Gali"

**D. Hover en cada card muestra el "por qué"**
- Tooltip al hover sobre una card:
  ```
  ¿Por qué este?
  • 340 ventas/sem en Colombia (top 5%)
  • Margen 71% (>50% mínimo que pediste implícito)
  • Tendencia +23% vs semana anterior
  ```

### 4.2 Memoria efímera + "Lo que Gali está aprendiendo de ti"

**Decisión:** Memoria solo en sesión (in-memory, no localStorage). El demo arranca limpio cada reload — pedagógicamente más útil para que Michael vea el sistema construyendo entendimiento desde cero.

**Panel "Aprendiendo de ti":**

Componente nuevo `GaliLearningRibbonComponent`, ubicado en el footer del sidebar de Gali (estado workspace). Visualiza en tiempo real lo que Gali infiere del usuario:

```
┌────────────────────────────────┐
│  LO QUE ESTOY APRENDIENDO       │
│  ─────────────────────────────  │
│  📊 Te interesa: tendencias     │
│     (mencionado 1×)              │
│                                 │
│  💰 Margen mínimo aceptable:    │
│     >50% (inferido)              │
│                                 │
│  🎯 Nicho explorado: mascotas    │
│     (cards revisadas: 3)         │
│                                 │
│  [🗑 Olvidar todo]              │
└────────────────────────────────┘
```

**Comportamiento:**
- Cada nuevo "learning" aparece con fade-in + scale-up animación 400ms
- Botón "🗑 Olvidar todo" → reset del estado de aprendizaje (forgetting control, principio agentic-ux #4)
- Items que llevan >2 minutos sin actualización se atenúan (opacidad 0.5) — comunica que la memoria es viva
- Hover sobre cualquier item: tooltip "Detectado por: [acción específica del usuario]"

**Triggers de aprendizaje (mockeados con reglas simples):**

| Acción del usuario | Lo que Gali "aprende" |
|---|---|
| Escribe keyword de categoría | "Te interesa: [categoría]" |
| Hover >2s en una card | "Producto considerado: [nombre]" |
| Click en "Ver detalles" | "Profundizando en: [nombre]" |
| Click en chip "mejor margen" | "Te importa: margen alto" |
| Click filtro categoría | "Nicho explorado: [categoría]" (incrementa counter) |
| Ordenar por tendencia | "Prefieres productos: en alza" |

### 4.3 Goal awareness y proactive nudging

**Topbar evolutiva** (sustituye el topbar estático del v1):

```
[Logo]  🎯 Tu misión: Encontrar producto ganador  ▰▰▱▱▱  20%  🔔₂  👤
                       └─ click → drawer de misión expandido
```

Componente `MissionRibbonComponent`. Estado mockeado pero realista:

- Step 1: Producto (en curso, 20%)
- Step 2: Estrategia (locked)
- Step 3: Creación (locked)
- Step 4: Lanzamiento (locked)

Cuando el usuario hace click en "Elegir este" en una card → la barra avanza visiblemente a 40% con animación de fill (500ms), Gali emite mensaje sobre continuar, y el step "Producto" se marca completado.

**Proactive nudging (idle behavior):**

Si el usuario lleva >25s sin interactuar en el workspace state, Gali emite un mensaje proactivo (con su streaming normal):

> "¿Te ayudo a comparar las primeras 3? Cuéntame qué te importa más: margen, facilidad de venta o competencia en el nicho."

Chips: `[Comparar margen]` `[Comparar competencia]` `[Estoy mirando, gracias]`

**Justificación agentic-ux:** "What goals are users really trying to achieve, and how could an agentic system help them get there more effectively?" — Gali no solo responde, anticipa.

### 4.4 Forgetting controls

Aunque la memoria es efímera en esta iteración, el patrón se establece:

- Botón **"🗑 Olvidar todo"** en el Learning Ribbon (reset estado de inferencias)
- Botón **"↺ Empezar de cero"** en el header del sidebar de Gali (reset thread completo + learning)
- Botón **"X"** en cada item del Learning Ribbon (forget item específico)
- Modal de confirmación solo para "Empezar de cero" (acción destructiva)

---

## 5. Componentes Gen UI

### 5.1 Inventario completo (expandido vs v1)

| Componente | Estado | Responsabilidad |
|---|---|---|
| `GaliDescubrimientoComponent` | Root | Orquestador del estado hero/workspace |
| `TopbarGaliComponent` | Topbar 56px | Logo + MissionRibbon + Notif + Avatar |
| `MissionRibbonComponent` | Dentro topbar | Misión activa + progress bar evolutiva |
| `GaliHeroComponent` | Estado A | Wrapper del hero state inicial |
| `GaliSidebarComponent` | Estado B | Wrapper del sidebar 340px post-colapso |
| `GaliAvatarComponent` | Universal | Círculo con 5 estados visuales |
| `GaliMessageComponent` | Thread | Burbuja de mensaje con streaming + cursor + confidence meter |
| `GaliExecutionStreamComponent` | Thread | Lista de pasos del razonamiento (mono, con check/spinner) |
| `ConfidenceMeterComponent` | Anidado | Barra de 10 segmentos + % + tooltip de razonamiento |
| `GaliSuggestionChipComponent` | Thread | Chip clickeable con stagger fade-in |
| `GaliInputComponent` | Thread | Input + 🎤 (fake) + ✏️ + toggle streaming |
| `GaliLearningRibbonComponent` | Footer sidebar | "Lo que estoy aprendiendo" + forgetting controls |
| `ReasoningAnchorComponent` | Canvas header | Barra contextual "te muestro X porque..." |
| `FiltersBarComponent` | Canvas | Chips de categoría + "Ordenar por" dropdown |
| `ProductCardComponent` | Canvas grid | Card 280×360 con hover-why tooltip |
| `ProductDrawerComponent` | Modal lateral | "Ver detalles" expandido (placeholder) |
| `IdleNudgeComponent` | Auto-trigger | Mensaje proactivo de Gali tras 25s idle |
| `ResetConfirmationModalComponent` | Modal | Confirmación de "Empezar de cero" |

### 5.2 ProductCard — especificación expandida (spec líneas 691-737 + capa agentic)

Dimensión: 280×360px. Sobre el spec original agrego:

**Hover "¿Por qué este?" tooltip:**
- Aparece a 800ms de hover sostenido (no instant — evita ruido)
- Posicionado a la derecha de la card (o izquierda si está cerca del borde)
- Background: `$bg-elevated`, border `$border-default`, padding 16px
- Contenido:
  ```
  ¿POR QUÉ ESTE?
  ▸ 340 ventas/sem en Colombia (top 5%)
  ▸ Margen 71% (>50% que necesitas)
  ▸ Tendencia +23% vs semana anterior
  ─────
  Coincidencia con tu intención: 91%
  ```
- Cierre con mouseleave + delay 200ms

**Estado `confidence` (nuevo):**
Cada card lleva en la esquina inferior derecha un mini-meter de 4 segmentos indicando qué tan confiable es la recomendación para esta sesión específica. Color según el % global de Gali en este conjunto.

### 5.3 GaliExecutionStreamComponent — nuevo

**Estructura visual:**
```
┌─────────────────────────────────────┐
│  EXEC                          1.8s │  ← header mono uppercase
│                                     │
│  ✓  Consultando catálogo Dropi      │  ← step completado verde
│  ✓  Filtrando margen >50%           │
│  ⋯  Cruzando con ventas LATAM       │  ← step en curso cyan
│  ○  Ranking por demanda actual      │  ← step pendiente gris
└─────────────────────────────────────┘
```

**Comportamiento:**
- Cada step aparece con stagger 120ms entre uno y otro
- Step en curso: spinner cyan rotando (`$gali-cyan`)
- Step completo: check verde con scale-bounce 240ms al transicionar
- Step pendiente: círculo vacío gris
- Al terminar todos los steps: collapse en accordion compacto "✓ Análisis completo · 3.7s" con disclosure triangle para volver a abrir

**Texto técnico del header:** "EXEC" (uppercase mono) + tiempo transcurrido en vivo (counter milisegundos)

### 5.4 ConfidenceMeterComponent — nuevo

**Anatomía:**
```
[▰▰▰▰▰▰▰▰▱▱] 84%  ◯
└─ 10 segmentos    └─ info icon → click abre tooltip
```

- Segmentos: 10 rectángulos de 6×3px con gap 2px
- Llenos: gradient horizontal `$status-success → $brand-orange` según %
- Vacíos: `$border-default`
- Tooltip onclick:
  ```
  CONFIANZA: 84%
  ─────────────────────────────
  Basado en:
  ▸ 847 ventas de productos similares
  ▸ Datos de últimos 30 días Colombia
  ▸ Match con tu intención: alto
  
  Caveat: ventas de últimas 48h tienden a
  inflar tendencia. Verifica con datos semanales.
  ```

### 5.5 Renderizado dinámico del thread

`GaliMessage[]` con `type` discriminante. Plantilla con `@switch` (Angular 17, no `ngComponentOutlet`):

```typescript
type GaliMessageType = 
  | 'user'        // mensaje del usuario
  | 'gali-text'   // texto de Gali con streaming
  | 'execution'   // execution stream
  | 'products'    // emisor del canvas update (no se renderiza en thread, solo dispara products$)
  | 'reasoning'   // anchor pre-cards en canvas
  | 'approval'    // resumen + confirmación
  | 'nudge'       // proactive nudge tras idle
```

---

## 6. Servicio `GaliService` — expandido

`src/app/services/gali.service.ts`. Estado:

```typescript
- messages$: BehaviorSubject<GaliMessage[]>
- products$: BehaviorSubject<Product[] | null>
- layout$: BehaviorSubject<'hero' | 'workspace'>
- avatarState$: BehaviorSubject<'idle' | 'thinking' | 'speaking' | 'alert' | 'success'>
- executionStream$: BehaviorSubject<ExecutionStep[]>  // pasos del razonamiento actual
- learnings$: BehaviorSubject<Learning[]>              // inferencias acumuladas
- mission$: BehaviorSubject<Mission>                   // misión + progreso
- idleTimer$: timer interno que dispara nudge tras 25s
- streamingEnabled$: BehaviorSubject<boolean>          // toggle accessibility
```

**Método `sendIntent(text: string)`:**

```
1. Push mensaje user (instant)
2. Avatar → thinking
3. Si es primera intención: dispara layout$ → 'workspace' con delay 200ms
4. Push mensaje execution con steps mockeados
   ├─ paso 1: 800ms simulado
   ├─ paso 2: 600ms simulado
   ├─ paso 3: 900ms simulado
   └─ paso 4: 700ms simulado
5. Mientras tanto, infiere learnings y los empuja a learnings$
6. Avatar → speaking
7. Push mensaje gali-text con streaming: true + canned response
8. Esperar duración del streaming (texto.length × 30ms / 5)
9. Avatar → idle
10. Push mensaje reasoning (anchor del canvas)
11. Pobla products$ con array según keyword
12. Resetea idleTimer
```

**Detección de keywords** (con tolerancia tildes/mayúsculas, sin librería):

```typescript
const normalize = (s: string) => s.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '');

const matches = (input: string, keywords: string[]) => 
  keywords.some(k => normalize(input).includes(normalize(k)));
```

**Biblioteca de respuestas canned** (del spec líneas 1230-1252):

| Keywords | Respuesta de Gali | Confidence | Products |
|---|---|---|---|
| `tendencia, tendencias, hoy, viral` | "Aquí están los 8 productos con mayor tracción en Colombia hoy. Los ordené por combinación de volumen de ventas y margen. El primero es un outlier interesante esta semana." | 87% | Top 8 mixed, Collar GPS primero |
| `mascota, perro, gato, pet` | "Encontré 24 productos en la categoría mascotas. Te muestro los que tienen mejor combinación de margen y demanda actual. El collar GPS está rompiendo tendencia esta semana con +23% de ventas." | 91% | Collar GPS + 7 |
| `skincare, piel, belleza, cosmetic` | "Productos de skincare con margen alto y demanda estable. La mascarilla LED para rostro está subiendo +41% esta semana en Colombia." | 84% | Mascarilla LED + 7 |
| `hogar, casa, organizar` | "Categoría hogar tiene productos estables con buen margen. El organizador de cables magnético lleva 8 semanas consistente." | 79% | Organizador + 7 |
| `fitness, ejercicio, yoga, gym` | "Fitness está en alza esta semana. El tapete de acupresión tiene buena conversión a pesar de tendencia ligera a la baja." | 72% | Tapete + 7 |
| `margen` (solo el filtro) | "Reordené por margen descendente. El top 3 tiene >70%." | 95% | Re-orden current set |
| default | "Te muestro 8 productos con buena tracción esta semana. Si quieres filtrar por nicho específico, dime cuál te interesa." | 68% | Mix top 8 |

**Sugerencias iniciales en estado hero** (spec línea 661-663, exactas):
- "Quiero ver tendencias de hoy"
- "Busco algo en la categoría de hogar"
- "Tengo un producto en mente"

**Sugerencias en estado workspace** (rotación según contexto):
- Si último filtro fue categoría: "¿Cuál tiene el mejor margen?"
- Si user lleva >2 productos hover: "¿Quieres que los compare?"
- Default: "¿Hay algo nuevo esta semana?" / "Muéstrame menos competidos"

---

## 7. Mock data

**Archivo:** `mocks/gali-discovery.json`

Estructura completa:

```json
{
  "user": {
    "id": "u-sebas-001",
    "name": "Sebas",
    "level": "descubridor",
    "joinedDays": 14,
    "salesCount": 1
  },
  "mission": {
    "id": "m-001",
    "title": "Lanza tu primer producto ganador",
    "totalSteps": 5,
    "currentStep": 1,
    "currentStepName": "Producto",
    "progressPct": 20,
    "stats": {
      "similarUsersCompleted": 247,
      "avgDays": 2.4
    }
  },
  "products": [
    {
      "id": "p001",
      "name": "Collar GPS para perros",
      "image": "/assets/images/products/[mapped].png",
      "category": "mascotas",
      "supplier": { "name": "DropiVerified Pet Co.", "verified": true },
      "cost": 26000,
      "suggestedPrice": 89000,
      "margin": 71,
      "salesWeek": 340,
      "trendPct": 23,
      "badge": { "icon": "🔥", "label": "Más vendido esta semana" },
      "reasoning": {
        "topPct": 5,
        "salesPercentile": "top 5% Colombia",
        "marginRationale": "Margen 71% supera mínimo recomendado 50%",
        "trendNote": "Tendencia +23% últimas 4 semanas"
      },
      "confidence": 91
    },
    {
      "id": "p002",
      "name": "Organizador de cables magnético",
      "category": "hogar",
      "cost": 8500,
      "suggestedPrice": 29900,
      "margin": 72,
      "salesWeek": 218,
      "trendPct": 8,
      "badge": { "icon": "⚡", "label": "Estable" },
      "confidence": 79
    },
    {
      "id": "p003",
      "name": "Mascarilla LED para rostro",
      "category": "skincare",
      "cost": 42000,
      "suggestedPrice": 149000,
      "margin": 72,
      "salesWeek": 190,
      "trendPct": 41,
      "badge": { "icon": "📈", "label": "Tendencia al alza" },
      "confidence": 84
    },
    {
      "id": "p004",
      "name": "Tapete de acupresión",
      "category": "fitness",
      "cost": 18000,
      "suggestedPrice": 59000,
      "margin": 69,
      "salesWeek": 167,
      "trendPct": -4,
      "badge": null,
      "confidence": 72
    }
    // ... +16 productos. Total mínimo 20. Categorías:
    // mascotas (4), hogar (4), skincare (4), fitness (3), tech (3), bebes (2)
  ],
  "responses": { /* ver tabla sec. 6 */ },
  "suggestions": {
    "hero": ["Quiero ver tendencias de hoy", "Busco algo en la categoría de hogar", "Tengo un producto en mente"],
    "workspace_default": ["¿Cuál tiene el mejor margen?", "Muéstrame solo productos en tendencia", "¿Hay algo nuevo esta semana?"],
    "workspace_idle_nudge": ["Comparar margen", "Comparar competencia", "Estoy mirando, gracias"]
  },
  "executionSteps": {
    "tendencia": [
      { "label": "Consultando catálogo Dropi", "duration": 1400 },
      { "label": "Filtrando por demanda > top 20%", "duration": 600 },
      { "label": "Cruzando con tendencia LATAM 7d", "duration": 900 },
      { "label": "Ranking final por score combinado", "duration": 700 }
    ]
    // ... un set por cada categoría
  }
}
```

**Mock API:** agregar al `src/app/common/interceptors/mock-api.interceptor.ts` el endpoint `GET /api/gali-discovery` que devuelve el JSON con `pipe(delay(300))`.

---

## 8. Coreografía de transiciones (NUEVO — detallado)

### 8.1 Hero → Workspace (al primer mensaje)

**Duración total: 720ms.** Secuencia orquestada:

```
T=0      Usuario presiona Enter en el input
T=0      Mensaje user aparece en posición de input (donde estaba)
T=80     El "hero card" (contenedor) inicia transform:
         translate(50vw → calc(100vw - 340px)) + scale(1 → 0.85)
         + width animation hacia 340px
T=200    Background del canvas inicia fade-in desde 0 → 1 (al fondo gradient)
T=280    Avatar de Gali pasa a thinking + pulse
T=400    Execution stream empieza a renderizar steps con stagger
T=600    Filters bar aparece desde arriba (translateY -16 → 0, opacity 0 → 1)
T=720    Layout final estable
```

**Easing:** `cubic-bezier(0.32, 0.72, 0, 1)` (Apple "spring-like") para el reposicionamiento del hero card. Material standard para el resto.

**Implementación:** NO destruir/recrear el componente — solo cambiar la clase `.gali-panel--hero` ↔ `.gali-panel--sidebar` y dejar que las CSS transitions hagan el trabajo. Para la transición del avatar y de los chips: Angular animations `:enter`/`:leave`.

### 8.2 ProductCards aparecen en grid

Tras execution stream + respuesta de Gali:

- Grid 4×2 (8 cards) con stagger reveal
- Cada card: `opacity 0 → 1` + `translateY(16px → 0)` + `scale(0.96 → 1)`
- Stagger: 80ms entre cards, total 640ms
- Direction: top-left → bottom-right (diagonal natural)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth out)

### 8.3 Card hover

- Lift: `translateY(0 → -4px)` 240ms
- Shadow: `$shadow-card → $shadow-card-hover`
- Border: subtle → default
- Image inside: `scale(1 → 1.04)` 600ms (slow zoom) — sensación cinematográfica

### 8.4 Click "Elegir este"

```
T=0    Click
T=0    Card → estado selected (border 2px $brand-orange + check top-right scale 0 → 1 con bounce)
T=200  Toast aparece desde bottom-right (slide-in)
T=240  Otras cards atenúan opacity 1 → 0.6 (no se distraen)
T=400  Avatar Gali → speaking
T=480  Mission ribbon progress 20% → 40% con fill animation (cubic ease-out)
T=520  Nuevo mensaje gali-text aparece en thread con streaming
T=...  Streaming completa
T=...  Chips [Sí, vamos] [Quiero ver más productos] aparecen con stagger
```

### 8.5 Filter category click

- Filter chip activo: scale-bounce 1.08 → 1 en 240ms + border `$brand-orange`
- Grid actual: cards atenúan opacity 1 → 0 + slight translateY 8 (400ms total)
- Avatar → thinking → speaking
- Execution stream nuevo (más breve, 1.5s)
- Nuevos cards entran con stagger reveal

### 8.6 Toggle sidebar Dropi (mini-rail 64px ↔ full 250px)

- Width animation 360ms, `cubic-bezier(0.32, 0.72, 0, 1)`
- Labels de items aparecen con fade-in 120ms delay tras el width
- Canvas del workspace ajusta su width complementariamente (flex)

---

## 9. Interacciones clave

### Estado `hero`:
- Click chip sugerencia → equivale a Enter en input con el texto del chip
- Enter → `sendIntent()`, dispara transición a workspace
- Click 🎤 → tooltip "Próximamente: input de voz"
- Toggle streaming (icono ⏱ en input) → desactiva streaming letra-a-letra (instant text)

### Estado `workspace`:
- Click filtro categoría → re-emite respuesta canned + nuevo execution stream
- Dropdown "Ordenar por" → reordena grid client-side (sin nuevo Gali)
- Click "Ver detalles" en card → abre `ProductDrawerComponent` (placeholder)
- Hover en card >800ms → tooltip "¿Por qué este?"
- Click "✓ Elegir este":
  1. Card → estado selected
  2. Toast "✓ [Nombre] seleccionado"
  3. Mission ribbon avanza
  4. Gali emite continuación (con streaming + confidence + steps)
  5. Chips `[Sí, vamos]` `[Quiero ver más productos]`
  6. "Sí, vamos" → modal placeholder "Próximamente: Modo Estrategia"
  7. "Quiero ver más productos" → deselecciona + restaura grid + new sugerencias

### Learning Ribbon:
- Click `X` en un item → forget item específico con fade-out
- Click "🗑 Olvidar todo" → reset learnings$
- Hover en item → tooltip "Detectado por: [acción]"

### Topbar:
- Click logo → `/`
- Click 🔔 → drawer placeholder
- Click avatar → menú placeholder
- Click misión → drawer expandido con 5 steps visibles (placeholder)
- Toggle sidebar Dropi → expande/colapsa entre 64px y 250px

### Idle nudge:
- Tras 25s sin interacción en workspace state → IdleNudgeComponent monta dentro del thread
- Mensaje proactivo + 3 chips
- Si el usuario interactúa antes de 25s, timer se resetea

---

## 10. Edge cases y error states (del spec sec. 13, ampliado)

| Caso | Comportamiento |
|---|---|
| Gali tarda >3s en cualquier paso (mock) | Avatar mantiene thinking + texto "Esto está tomando más de lo usual..." aparece en execution stream |
| Gali tarda >8s | Aparece chip "[Continuar esperando]" + "[Ver resultados parciales]" |
| Usuario escribe categoría inexistente (ej. "joyería") | Default response: "No encontré productos en ese nicho específico. ¿Quieres explorar nichos relacionados?" + chips de categorías cercanas (mascotas → "accesorios pet" no existe → fallback a mascotas) |
| Usuario clickea filtro rápidamente 3× | Debounce 300ms en filtros — solo último click ejecuta |
| Usuario presiona Enter con input vacío | No hace nada visible + sutil shake horizontal del input (200ms) |
| Usuario escribe mensaje pero ya hay execution stream activo | Botón Enter disabled hasta que termine + tooltip "Gali está procesando..." |
| Toast aparece pero usuario hace otra acción | Toast permanece 4s o hasta click "X" + nuevos toasts se apilan (máx 3) |
| Mission ribbon llega a 40% pero usuario clickea "Quiero ver más productos" | Ribbon revierte a 20% con animación fill-reverse (400ms) |
| Conexión mock falla (improbable, todo client-side) | Empty state: "No pude consultar el catálogo. Recarga la página." |
| Usuario clickea "🗑 Olvidar todo" sin learnings | Botón disabled con tooltip "Nada que olvidar todavía" |

---

## 11. Accessibility

**Keyboard navigation:**
- Tab order: topbar items → main content → Gali input → Gali sidebar items
- Enter en chips de sugerencia funciona igual que click
- ESC cierra modales/drawers
- Cmd/Ctrl + K abre el input de Gali con focus (keyboard shortcut)
- Flecha ↑ en input vacío → recupera último mensaje enviado (como terminal)

**Focus states:**
- Outline 2px `$brand-orange-glow` + offset 2px para todos los elementos interactivos
- NUNCA `outline: none` sin reemplazo
- Focus visible solo con teclado (`:focus-visible`)

**Screen reader:**
- Avatar de Gali: `aria-label="Avatar de Gali. Estado: pensando"` (dinámico según estado)
- Execution stream: `role="status" aria-live="polite"` para que screen readers anuncien pasos
- Confidence meter: `aria-label="Confianza 84 por ciento"` + descripción completa en sr-only
- Cada ProductCard: `aria-labelledby` con el title + datos clave en aria-describedby

**Streaming toggle:**
- Icono ⏱ en input de Gali abre dropdown: `[Streaming letra a letra ✓] [Texto instantáneo]`
- Para usuarios con cognitive disabilities, screen readers, o que prefieren leer rápido
- Preference persiste en `sessionStorage` durante el demo

**Color contrast:**
- Texto primario sobre bg-base: ratio 14.2:1 (AAA)
- Texto secundario sobre bg-base: ratio 5.8:1 (AA)
- Naranja Dropi sobre bg-base: ratio 7.4:1 (AAA en text size)
- No relying on color alone: badges siempre incluyen icono + texto

**Reduced motion:**
- `@media (prefers-reduced-motion: reduce)` desactiva:
  - Gradient mesh background animation
  - Avatar gradient rotation (queda estático)
  - Card hover transforms
  - Stagger reveals (instant)
- Streaming se mantiene (es contenido funcional, no decoración) pero se acelera 2×

---

## 12. Responsive strategy

Aunque mobile está fuera de scope, definir comportamiento defensivo en breakpoints intermedios:

| Viewport | Comportamiento |
|---|---|
| `≥ 1440px` | Layout completo: workspace 1100px + sidebar Gali 340px |
| `1280-1439px` | Workspace flex + sidebar Gali 320px. Grid 4×2. |
| `1024-1279px` | Sidebar Gali colapsable (botón). Grid 3 cols. Mission ribbon esconde sub-texto, solo % |
| `768-1023px` | Empty state "Esta experiencia está optimizada para desktop. Próximamente en mobile." con CTA "Ver en escritorio" |
| `< 768px` | Mismo empty state mobile |

Hero state en `< 1280px`: Gali card width 80% del viewport (en lugar de fixed 600px).

---

## 13. Onboarding del prototipo (primera vez)

**Problema:** Michael Giovanni abre el demo sin contexto. Necesita entender "qué carajos hago acá" en 5 segundos.

**Solución:** un mini-tour overlay en la primera carga (sessionStorage flag `gali-demo-seen`):

```
1. Overlay backdrop con 3 spotlights animados secuencialmente:
   T=0:    Spotlight sobre el avatar de Gali → tooltip "Soy Gali, tu copiloto"
   T=2.5s: Spotlight sobre el input → tooltip "Cuéntame qué buscas o usa una sugerencia"
   T=5s:   Spotlight sobre los chips → tooltip "Empieza por aquí 👇"
   T=7s:   Spotlight desaparece, hero state queda activo

2. Skip button "Saltar tour ✕" en top-right desde T=0
3. Indicador visual "1 de 3", "2 de 3", "3 de 3"
4. Una vez completado: flag en sessionStorage, no aparece de nuevo en esta sesión
```

**Easter egg para el demo:** botón sutil en footer del sidebar Dropi (mini-rail) "Reiniciar demo ↻" que limpia sessionStorage — útil para presentar a múltiples personas.

---

## 14. Métricas de éxito del demo (cualitativas para Michael)

Inspiradas en spec sec. 15 + agentic-ux quick reference table:

**Reacciones que esperamos provocar:**

| Reacción esperada | Indicador de éxito |
|---|---|
| "Esto no se parece a Dropi" | Comenta sobre el visual antes que sobre la funcionalidad |
| "Gali está pensando, no respondiendo" | Pausa al ver el execution stream |
| "Esto va a aprender de mí" | Señala el learning ribbon sin que se lo expliquemos |
| "Quiero probarlo con datos reales" | Pregunta por timeline de implementación real |
| "¿Cómo funciona la memoria entre sesiones?" | Pregunta espontánea sobre persistencia (es el siguiente paso natural) |

**Preguntas para la sesión** (del spec sec. 10, ampliadas):
- ¿Cuál de los 4 modos es el MVP más valioso?
- ¿Gali visible siempre o bajo demanda?
- ¿Confidence meter es valioso o ruidoso?
- ¿Learning ribbon empodera o intimida?
- ¿Cómo se siente la transparencia del execution stream — ayuda a confiar o sobra?

---

## 15. Out of scope (documentar explícitamente)

Del spec, **NO** se prototipa en esta iteración:

**Pantallas:**
- Pantalla 0 — Onboarding con 3 preguntas
- Pantalla 1 — Dashboard de misiones (MissionCard / AlertCard)
- Pantalla 3 — Modo Estrategia (BuyerPersonaCard, ApprovalUI)
- Pantalla 4 — Modo Creación (LandingCanvas, CreativeGrid)
- Pantalla 5 — Modo Lanzamiento (CampaignForm, ROASEstimator)
- Pantalla 6 — Seguimiento post-lanzamiento

**Sistemas:**
- Persistencia entre sesiones (memoria efímera in-memory)
- LLM real (Gali simulada con keywords + canned)
- MCP integrations (todo client-side)
- Modal Plus (no aplica al Modo Descubrimiento)
- Drawer "Ver detalles" expandido (placeholder)
- Input de voz funcional (solo botón + tooltip)
- Mobile completo
- Auth real

**Trust Stages 2 y 3:**
- Solo Stage 1 (Transparency) en esta iteración
- Stage 2 (Selective Disclosure) y Stage 3 (Autonomous) son futuras iteraciones

---

## 16. Archivos críticos a tocar

**Crear:**
- `src/app/pages/gali-descubrimiento/gali-descubrimiento.component.ts` + `.html` + `.scss`
- `src/app/pages/gali-descubrimiento/components/`:
  - `topbar-gali.component.*`
  - `mission-ribbon.component.*`
  - `gali-hero.component.*`
  - `gali-sidebar.component.*`
  - `gali-avatar.component.*`
  - `gali-message.component.*`
  - `gali-execution-stream.component.*`
  - `confidence-meter.component.*`
  - `gali-suggestion-chip.component.*`
  - `gali-input.component.*`
  - `gali-learning-ribbon.component.*`
  - `reasoning-anchor.component.*`
  - `filters-bar.component.*`
  - `product-card.component.*`
  - `product-drawer.component.*`
  - `idle-nudge.component.*`
  - `reset-confirmation-modal.component.*`
  - `demo-tour-overlay.component.*`
- `src/app/services/gali.service.ts`
- `src/app/services/gali-learning.service.ts` (separar lógica de inferencia)
- `mocks/gali-discovery.json`
- `src/styles/_gali-tokens.scss` (paleta extendida + tipografía + atmósfera)

**Editar:**
- `src/app/app.routes.ts` — ruta lazy `/gali/descubrimiento`
- `src/app/app.component.ts` — `isGaliWorkspace` colapsa sidebar y cambia header
- `src/app/layout/sidebar.component.*` — soporte mini-rail 64px
- `src/app/common/interceptors/mock-api.interceptor.ts` — endpoint `/api/gali-discovery` con `delay(300)`
- `navigation-map.json` — módulo `gali`
- `docs/wireframe-prompt-template.md` — agregar variante spec-derived al final
- `src/styles/_variables.scss` — importar `_gali-tokens.scss` si se necesita compartir tokens
- `src/index.html` — import de fonts (Söhne Breit o alternativa + IBM Plex Sans/Mono)
- `PrototypeGalleryComponent` (home `/`) — tarjeta de entrada con badge "Nuevo · AI-First"

**Reutilizar:**
- Imágenes en `src/assets/images/products/`
- Patrón `BehaviorSubject` + `asObservable()` de servicios existentes
- Estructura de chat de `src/app/pages/cas/` como referencia
- Tokens de `src/styles/_variables.scss` cuando aplique

---

## 17. Verificación end-to-end

1. `yarn start` arranca sin errores de compilación
2. Navegar a `/gali/descubrimiento`:
   - Sidebar Dropi colapsa a 64px mini-rail
   - Topbar 56px con mission ribbon "🎯 Tu misión: Encontrar producto ganador" + 20%
   - **Demo tour overlay** aparece con 3 spotlights secuenciales (skip disponible)
   - **Estado hero visible:** Gali avatar idle, mensaje con streaming aparece palabra por palabra
3. Avatar en hero pasa de thinking → idle al terminar streaming (4s loop)
4. 3 chips aparecen con stagger 80ms
5. Click "Quiero ver tendencias de hoy":
   - Mensaje user aparece en input position
   - **Transición 720ms**: hero shrink + slide-right → sidebar 340px
   - Background canvas fade-in con gradient mesh
   - Avatar → thinking (pulse)
   - **Execution stream** aparece con 4 pasos, stagger 120ms entre cada uno
   - Cada paso completa con check verde + scale-bounce
   - Total execution: ~3.5s visible
   - **Confidence meter 87%** aparece al final del mensaje de Gali
   - **Reasoning anchor** aparece encima del grid
   - **8 ProductCards** entran con stagger diagonal 80ms
   - **Learning ribbon** se actualiza con "Te interesa: tendencias"
6. Hover en una card >800ms → tooltip "¿Por qué este?" con 3 razones
7. Click en card "✓ Elegir este" del Collar GPS:
   - Card → estado selected (border naranja + check)
   - Toast "✓ Collar GPS seleccionado"
   - Otras cards atenúan opacity 0.6
   - **Mission ribbon avanza 20% → 40%** con fill animation
   - Avatar → speaking
   - Nuevo mensaje gali-text + execution stream + confidence
   - Chips [Sí, vamos] [Quiero ver más productos]
8. Click "Quiero ver más productos" → deselecciona + grid restaurado + ribbon revierte 40% → 20%
9. Click filtro "Mascotas" → grid actual atenúa + nuevo execution stream + nuevos cards + learning ribbon agrega "Nicho: mascotas (1)"
10. Click filtro "Mascotas" otra vez → counter incrementa "Nicho: mascotas (2)"
11. Esperar 25s sin interactuar → **idle nudge** aparece con mensaje proactivo + chips
12. Click "🗑 Olvidar todo" en learning ribbon → confirmación → reset learnings
13. Click toggle streaming (icono ⏱) → cambiar a "Texto instantáneo" → próximo mensaje aparece instantáneo
14. Cmd+K → focus al input de Gali
15. ESC en modal placeholder → cierra
16. Tab navigation: orden lógico, focus visible naranja
17. `prefers-reduced-motion: reduce` → animaciones desactivadas, contenido funcional intacto
18. Resize a 1024px → grid pasa a 3 cols
19. Resize a 768px → empty state "optimizado para desktop"
20. Console: 0 errores. Network: `/api/gali-discovery` se llama 1×

---

## 18. Riesgos técnicos identificados

1. **No hay precedente de renderizado dinámico Gen UI en el repo.** Implementar con `@switch` de Angular 17. Reto identificado por el agente de exploración.
2. **Animación hero → workspace de 720ms** sin destruir/recrear el componente. Solución: CSS transitions sobre clases `.gali-panel--hero` / `.gali-panel--sidebar`, Angular animations solo para `:enter`/`:leave` de chips y cards.
3. **Streaming + transición de layout simultáneos.** Race condition. Solución: pausar streaming durante la transición de 720ms y reanudar.
4. **Tipografía display custom (Söhne Breit es de pago).** Alternativas libres: PP Editorial New (free trial), Migra (free), o licenciar. Decisión: usar **`Migra` (free)** o fallback a **`PP Editorial New` trial**. Si bloqueante, fallback final a **`IBM Plex Sans Condensed` con weight 700 italic** — menos display, más coherente con DS.
5. **Execution stream con tiempos mockeados** puede sentirse fake si los pasos son siempre igual de rápidos. Mitigación: variar los tiempos (600-1400ms) entre runs.
6. **Learning Ribbon con auto-update** puede generar feedback loops si dispara re-renders en cascada. Solución: debounce 200ms en learning emissions + `OnPush` change detection.
7. **Demo tour overlay** debe respetar el toggle de reduced-motion y skip via keyboard.
8. **Performance de gradient mesh + grain** en background. Mitigación: usar `will-change: transform` solo donde anima + grain como SVG inline (no PNG repeating).

---

## 19. Anexo — Huecos de usabilidad identificados y resueltos en v2.0

Auditoría del plan v1 contra los principios de `bencium-innovative-ux-designer` + `agentic-ux-design-relationship-centric-interfaces`:

| # | Hueco identificado en v1 | Resuelto en v2.0 (sección) |
|---|---|---|
| 1 | Sin identidad tipográfica concreta (solo "DS Registry tokens") | §3.1 — display + body + mono específicos |
| 2 | Sin paleta extendida (solo "naranja Dropi") | §3.2 — paleta dark theme completa + variantes |
| 3 | Sin atmósfera visual (sin grain, gradient, shadows tintadas) | §3.3 — atmósfera definida con justificación |
| 4 | Avatar de Gali genérico ("círculo gradiente animado") | §3.4 — 5 estados visuales específicos con triggers |
| 5 | Sin Memory Revolution — Gali transaccional | §4.2 — Learning Ribbon en tiempo real |
| 6 | Sin Trust Evolution — Gali igual desde mensaje 1 | §4.1 — Stage 1 Transparency con execution + confidence |
| 7 | Sin Relationship Architecture — cada sesión empieza de cero | §4.2 — memoria efímera con narrativa pedagógica |
| 8 | Sin Goal Awareness — misión hardcoded | §4.3 — Mission Ribbon evolutiva + proactive nudging |
| 9 | Sin Memory Visualization | §4.2 — Learning Ribbon visualiza inferencias |
| 10 | Sin Forgetting Controls | §4.4 — botones olvidar item + olvidar todo + empezar de cero |
| 11 | Sin Confidence Indicators | §5.4 — ConfidenceMeterComponent en cada respuesta |
| 12 | Sin Execution Stream visible | §5.3 — GaliExecutionStreamComponent con 4 pasos |
| 13 | Cards aparecen sin contexto del "por qué" | §4.1.C — ReasoningAnchorComponent + §4.1.D hover-why tooltips |
| 14 | Sin coreografía detallada de transiciones | §8 — secuencias timeline-por-timeline |
| 15 | Sin edge cases ni error states | §10 — 10 casos cubiertos |
| 16 | Sin keyboard nav ni accessibility | §11 — accessibility completo |
| 17 | Sin responsive strategy defensiva | §12 — breakpoints definidos |
| 18 | Sin onboarding del demo para Michael | §13 — demo tour overlay 3 spotlights |
| 19 | Sin proactive nudging — Gali solo reactiva | §4.3 — idle nudge tras 25s |
| 20 | Sin diferenciación entre estados de avatar (5 mencionados, 0 especificados) | §3.4 — tabla de 5 estados con animación |
| 21 | Sin toggle accessibility de streaming | §11 — toggle ⏱ persistente en sessionStorage |
| 22 | Sin métricas de éxito del demo | §14 — reacciones esperadas + preguntas para la sesión |
| 23 | Sin debounce en filtros (riesgo de spam) | §10 — debounce 300ms |
| 24 | Empty states no contemplados (categoría inexistente, etc.) | §10 — tabla edge cases |
| 25 | Sin keyboard shortcuts (Cmd+K, ESC, ↑) | §11 — keyboard navigation completo |

---

*Plan v2.0 — Mayo 25, 2026. Auditoría por skills `bencium-innovative-ux-designer` + `agentic-ux-design-relationship-centric-interfaces`. Próximo paso: aprobación del usuario antes de ejecutar.*

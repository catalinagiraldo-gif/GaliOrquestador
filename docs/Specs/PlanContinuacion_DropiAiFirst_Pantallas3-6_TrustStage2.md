# Plan de Continuación — Dropi AI-First (Pantallas 3-6 + Trust Stage 2)

> Continuación del [PlanPrototipo_DropiAiFirst_ModoDescubrimiento.md](../../Documents/dropi-prototypes/docs/Specs/PlanPrototipo_DropiAiFirst_ModoDescubrimiento.md) (v2.0, ya ejecutado). Cierra las 5 pantallas restantes del spec [DropiAiFirst.md](../../Documents/dropi-prototypes/docs/Specs/DropiAiFirst.md) más la capa transversal de Trust Stage 2 (Selective Disclosure).
> Skills aplicadas: `bencium-innovative-ux-designer` + `agentic-ux-design-relationship-centric-interfaces`.
> Estado: **plan v3.0 — pendiente de ejecución por fases**.

---

## Context

El prototipo del **Modo Descubrimiento (Pantalla 2)** está terminado y corre en `/gali/descubrimiento`. Tiene 18 componentes Angular standalone, 2 servicios (`GaliService`, `GaliLearningService`), mock interceptor con delay, tokens visuales propios, sidebar Dropi mini-rail, demo tour overlay, y Trust Stage 1 operativo (execution stream + confidence meter + reasoning anchor + hover-why + learning ribbon).

El click en **"Sí, vamos"** tras seleccionar producto hoy abre un modal placeholder "Próximamente: Modo Estrategia". El spec define que ese punto debe encadenar las 4 fases restantes del flujo. Este plan completa esa cadena con una secuencia ejecutable de 5 fases + 1 transversal — cada una entregable de manera independiente sin romper lo ya construido.

**Outcome esperado al final del roadmap:** flujo end-to-end navegable de Descubrimiento → Estrategia → Creación → Lanzamiento → Seguimiento, accesible desde un Dashboard de Misiones (Pantalla 1), con Onboarding inicial (Pantalla 0) que pre-condiciona qué misión Gali sugiere. Trust evoluciona del Stage 1 (todo transparente) a Stage 2 (selective) con un toggle de demo "usuario nuevo vs usuario con experiencia" para mostrar a Michael Giovanni que el sistema sabe "callarse" cuando el usuario ya confía.

**Decisiones tomadas con el usuario:**
- Roadmap completo en fases secuenciales (no priorizar una sola)
- Transversal: **solo Trust Stage 2** (no localStorage real, no niveles 4x, no notificaciones funcionales en este roadmap — se posponen a v4)
- Trust Stage 2 se mockea con toggle de demo en `sessionStorage`, coherente con la decisión previa "memoria efímera pedagógica"

---

## Estado actual (lo que NO se vuelve a construir)

### Componentes reutilizables (no duplicar)
- `GaliAvatarComponent` (5 estados visuales) → reusar en todos los modos
- `GaliMessageComponent` (streaming + cursor + confidence) → reusar en threads de Gali
- `GaliExecutionStreamComponent` → reusar cuando Gali ejecuta tools
- `ConfidenceMeterComponent` → reusar en cada respuesta de Gali
- `GaliSuggestionChipComponent` → reusar para chips post-acción
- `GaliInputComponent` → reusar en sidebar de cada modo
- `GaliLearningRibbonComponent` + `GaliLearningService` → singleton, persiste durante sesión
- `MissionRibbonComponent` → evoluciona 20%→40%→60%→80%→100% según fase
- `TopbarGaliComponent` → reusar en todos los modos
- `GaliSidebarComponent` → reusable como sidebar derecho con minor variants
- `ReasoningAnchorComponent` → reusar en cualquier canvas
- `ProductCardComponent` + variante `ProductCardMiniComponent` (a crear, basada en este)
- `DemoTourOverlayComponent` → extender con nuevos tours por modo (sessionStorage flags por pantalla)
- Toast + Modal patterns del root component

### Servicios reutilizables
- `GaliService` — extender con métodos por modo (no crear servicios paralelos)
- `GaliLearningService` — agregar nuevas reglas de aprendizaje según contexto
- Mock interceptor pattern (`/api/gali-*` con `delay(300)`)

### Patrones visuales
- Tokens en `_gali-tokens.scss` (paleta + tipografía + atmósfera) — extender, no duplicar
- Atmósfera global (gradient mesh + grain) ya aplicada a `:host` de cualquier ruta `/gali/*`
- Animaciones canónicas: hero→workspace 720ms, cards stagger 80ms, chips 80ms, executionStream stagger 120ms

---

## Fase 1 — Modo Estrategia (Pantalla 3)

**Outcome:** tras "Sí, vamos" en Descubrimiento, en lugar de modal placeholder, transición al Modo Estrategia donde Gali propone 3 BuyerPersonaCards editables y un ApprovalUI antes de avanzar.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ TopbarGali — Mission ribbon 40% — "Paso 2: Estrategia"      │
├──────────────┬──────────────────────────────────┬───────────┤
│              │                                  │           │
│  PRODUCTO    │   CANVAS — BuyerPersonaCards     │   Gali    │
│  ANCLADO     │                                  │   Sidebar │
│  (280px fijo)│   ▸ BuyerPersonaCard 1            │   (340px) │
│              │     editable: tono, canal, copy  │           │
│  [imagen]    │   ▸ BuyerPersonaCard 2            │   [chat]  │
│  Collar GPS  │   ▸ BuyerPersonaCard 3            │   [input] │
│  Margen 71%  │                                  │           │
│  340 v/sem   │   ─────────────────────────────  │           │
│  📊 Top 5%   │   ApprovalUI (al seleccionar)    │           │
│              │   "Confirmar y crear →"          │           │
└──────────────┴──────────────────────────────────┴───────────┘
```

### Transición desde Modo Descubrimiento
- Tras click "Sí, vamos": la card seleccionada (Collar GPS) se anima `position: fixed` con `FLIP` technique hacia el panel izquierdo del Modo Estrategia (500ms, `$gali-ease-spring`)
- El grid de cards previas se hace fade-out con stagger inverso (80ms desde abajo-derecha)
- El BuyerPersonaCards entra desde la derecha con stagger 100ms
- Mission ribbon avanza 40% → 60% durante la transición

### Componentes nuevos
- `ProductAnchorComponent` — versión mini-fija del ProductCard (280px), muestra producto seleccionado durante toda la fase. Read-only.
- `BuyerPersonaCardComponent` — card 640×200px (expandible a 320), 3 campos editables (tono, canal, ángulo de copy) + datos de % de ventas históricas + botón "Elegir este perfil"
- `ApprovalUIComponent` — resumen estructurado de la estrategia confirmada + Gali predice rango de conversión + CTA "Confirmar y crear →" + "Cambiar algo"

### Componentes reusados
- `TopbarGali` + `MissionRibbon` (avanza a 60% al confirmar)
- `GaliSidebar` con nuevos chips contextuales
- `GaliMessage` + `ConfidenceMeter` + `ExecutionStream`
- `GaliLearningRibbon` — agrega learnings: "Tono preferido: emocional", "Canal preferido: Instagram"

### Cambios en GaliService
```typescript
selectProduct(p: Product) {
  // ya existe — actualizar para emitir layout$ → 'estrategia' en vez de modal
}
generatePersonas(): Observable<BuyerPersona[]> // mock devuelve 3 personas
selectPersona(persona: BuyerPersona)
confirmStrategy() → triggers transition to Modo Creación
```

### Mock data nuevo
**Archivo:** `mocks/gali-strategy.json`
```json
{
  "personasByCategory": {
    "mascotas": [
      {
        "id": "bp-001",
        "title": "Mamá preocupada por la seguridad de su mascota",
        "age": "28-42",
        "location": "Colombia, ciudades principales",
        "pain": "Mi perro se me escapa y no sé dónde está",
        "tone": "Emocional",
        "channel": "Instagram",
        "copyAngle": "¿Sabes dónde está tu perro en este momento?",
        "salesShare": 38,
        "confidence": 88,
        "reasoning": "Este perfil generó el 38% de ventas en productos similares (LATAM 90d)"
      }
      // ... 2 más por categoría
    ]
  },
  "executionSteps": {
    "strategy": [
      { "label": "Analizando ventas históricas categoría", "duration": 1200 },
      { "label": "Clusterizando perfiles compradores LATAM", "duration": 1500 },
      { "label": "Validando copies exitosos en redes", "duration": 1100 },
      { "label": "Generando 3 ángulos diferenciados", "duration": 800 }
    ]
  },
  "approvalCopy": "Con esta estrategia, estimo que tu landing debería convertir entre {minPct}% y {maxPct}% basada en {n} casos similares en los últimos 90 días."
}
```

### Archivos a crear/editar
**Crear:**
- `src/app/pages/gali-estrategia/gali-estrategia.component.{ts,html,scss}`
- `src/app/pages/gali-estrategia/components/product-anchor/*.{ts,scss}`
- `src/app/pages/gali-estrategia/components/buyer-persona-card/*.{ts,scss}`
- `src/app/pages/gali-estrategia/components/approval-ui/*.{ts,scss}`
- `mocks/gali-strategy.json`

**Editar:**
- `src/app/app.routes.ts` — agregar `/gali/estrategia`
- `src/app/services/gali.service.ts` — agregar `selectedPersona$`, `currentMode$` con `'descubrimiento' | 'estrategia' | ...`
- `src/app/pages/gali-descubrimiento/gali-descubrimiento.component.ts` — sustituir modal "Sí, vamos" por `router.navigate(['/gali/estrategia'])` con state que contiene producto seleccionado
- `mock-api.interceptor.ts` — endpoint `/api/gali-strategy`
- `navigation-map.json` — agregar vista `estrategia`

### Verificación Fase 1
1. Completar flujo Descubrimiento → elegir Collar GPS → "Sí, vamos"
2. Card del Collar GPS vuela al panel izquierdo (500ms)
3. Topbar: Mission ribbon 40% → 60%
4. Aparece execution stream de "Analizando ventas...", luego 3 BuyerPersonaCards
5. Editar tono de una persona → Gali responde proactivamente
6. Click "Elegir este perfil" → ApprovalUI aparece con resumen
7. Click "Confirmar y crear" → modal placeholder "Próximamente: Modo Creación"
8. Learning ribbon agrega 2 items (tono + canal)

---

## Fase 2 — Modo Creación (Pantalla 4)

**Outcome:** canvas bidireccional donde la landing page del producto se construye en vivo según el ángulo elegido. El usuario puede clickear cualquier elemento y editarlo directamente. Tab adicional con galería de creatives. Bloque visible "Plus" para variaciones extra.

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│ Topbar — Mission 80% — "Paso 3: Creación"                    │
├────┬──────────────────────────────────────────┬──────────────┤
│ 🐕 │ Tabs: [Landing] [Creatives]              │ Gali esbelta │
│ 64 │ ────────────────────────────────────────  │ (240px)      │
│ px │                                          │              │
│    │ Canvas con landing-preview o creative-grid│ "El CTA quedó│
│Col │                                          │  largo. Lo   │
│GPS │ Click cualquier elemento → mini-toolbar  │  ajusto?"    │
│    │ flotante con [Editar][Cambiar img][...]  │ [Sí] [Déjalo]│
│    │                                          │              │
│    │ [Escala 50%▼] [Desktop|Mobile]           │ [Input]      │
└────┴──────────────────────────────────────────┴──────────────┘
```

### Sub-componentes nuevos
- `ProductMiniRailComponent` — 64px rail izquierdo con foto producto + nombre vertical
- `LandingCanvasComponent` — preview de la landing en iframe-like contenedor, con secciones (Hero, Benefits, SocialProof, CTA Final)
- `CanvasElementComponent` — wrapper genérico para cualquier elemento clickeable. Estado `editing` agrega `contenteditable=true` + mini-toolbar flotante
- `CanvasMiniToolbarComponent` — toolbar flotante: [Editar texto][Cambiar imagen][Color][Eliminar][Mover ↕]
- `CreativeGridComponent` — grid 3×2 de creatives generados (videos + banners)
- `CreativeCardComponent` — card 9:16 o 1:1 con preview + hover menu [Usar][Editar][Descargar]
- `PlusBlockComponent` — bloque "Plus" con paywall placeholder ("Genera hasta 20 variaciones")
- `GaliCopilotComponent` — variante esbelta del GaliSidebar (240px) con menos chrome, mensajes contextuales sobre lo que se edita

### Componentes reusados
- `TopbarGali` + `MissionRibbon` (80%)
- `GaliMessage` (en GaliCopilot)
- `GaliLearningRibbon` — colapsado por default en este modo (ya hay mucha info en canvas)

### Mock data nuevo
**Archivo:** `mocks/gali-creation.json`
```json
{
  "landingTemplates": {
    "mascotas-mama-emocional": {
      "headline": "¿Sabes dónde está tu perro en este momento?",
      "subheadline": "El único collar GPS que te da tranquilidad real.",
      "ctaText": "Ver precio →",
      "benefits": [
        { "icon": "📍", "title": "Ubicación en tiempo real" },
        { "icon": "🔔", "title": "Alertas si se escapa" },
        { "icon": "🔋", "title": "Batería de 7 días" }
      ],
      "testimonials": [
        { "stars": 5, "text": "Encontré a mi Luna en 3 minutos cuando se perdió.", "author": "María, Medellín" }
      ],
      "ctaFinal": { "urgencyText": "Solo hoy", "price": 89000, "priceStruck": 149000 }
    }
  },
  "creatives": [
    { "id": "c-001", "type": "video", "ratio": "9:16", "platform": "TikTok", "thumbnail": "...", "isPlus": false },
    { "id": "c-002", "type": "video", "ratio": "9:16", "platform": "Reels", "isPlus": false },
    { "id": "c-003", "type": "banner", "ratio": "1:1", "platform": "Feed", "isPlus": false },
    { "id": "c-004", "type": "banner", "ratio": "9:16", "platform": "Story", "isPlus": false },
    { "id": "c-005", "type": "banner", "ratio": "16:9", "platform": "Wide", "isPlus": false },
    { "id": "c-006", "type": "carousel", "ratio": "1:1", "platform": "Feed", "isPlus": false }
  ],
  "executionSteps": {
    "creation": [
      { "label": "Generando estructura de landing", "duration": 1400 },
      { "label": "Inyectando ángulo emocional", "duration": 900 },
      { "label": "Creando 6 variaciones de creatives", "duration": 2200 },
      { "label": "Ajustando layout responsive", "duration": 700 }
    ]
  }
}
```

### Archivos a crear/editar
**Crear:**
- `src/app/pages/gali-creacion/gali-creacion.component.{ts,html,scss}`
- `src/app/pages/gali-creacion/components/{product-mini-rail,landing-canvas,canvas-element,canvas-mini-toolbar,creative-grid,creative-card,plus-block,gali-copilot}/*.{ts,scss}`
- `mocks/gali-creation.json`

**Editar:**
- `src/app/app.routes.ts` — `/gali/creacion`
- `src/app/services/gali.service.ts` — métodos `editLandingElement(id, newValue)`, `toggleCreativeFavorite(id)`, `proceedToLaunch()`
- `mock-api.interceptor.ts` — endpoint `/api/gali-creation`
- `navigation-map.json` — vista `creacion`

### Verificación Fase 2
1. Tras confirmar estrategia → transición 600ms al Modo Creación
2. Producto se encoge a mini-rail 64px izquierda
3. Landing canvas aparece con scale-up
4. Click headline → contenteditable + mini-toolbar flotante
5. Gali (esbelta derecha) responde: "Estás editando el headline..."
6. Tab Creatives → grid 3×2 + bloque Plus visible
7. Click "Continuar con campaña →" → navega a `/gali/lanzamiento`
8. Mission ribbon: 60% → 80%

---

## Fase 3 — Modo Lanzamiento (Pantalla 5)

**Outcome:** formulario pre-llenado con todo el contexto del flujo. El usuario solo ajusta presupuesto + duración. ROAS estimator reactivo en vivo al mover el slider. Confirmación pre-publicación y estado de éxito con confetti.

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│ Topbar — Mission 80% — "Paso 4: Campaña"                     │
├──────────────────────────────────────────────────────────────┤
│  🔵 Gali: "Todo listo. Pre-llené todo. Ajusta presupuesto"   │
├──────────────────────────┬───────────────────────────────────┤
│  CONFIG (form)           │   RESUMEN VISUAL + ROAS           │
│                          │                                   │
│  Plataforma: [Meta][TT]  │   [Mini landing preview]          │
│  Producto: ✅ Collar GPS │   [Thumb creative seleccionado]   │
│  Landing: ✅ landing-... │                                   │
│  Creative: ✅ Video B    │   📊 Estimación de Gali:          │
│  Ángulo: ✅ Mamá emocl   │   Alcance: 12k-18k                │
│                          │   Ventas: 8-15                    │
│  Presupuesto: $50k/día   │   ROAS: 2.1x-3.4x                 │
│  ◯─────●─────◯          │                                   │
│                          │   🔔 Notificaciones programadas:  │
│  Duración: [7 días]      │   ✓ 24h, 72h, 7d                  │
│  Audiencia: ✅ Col 25-45 │                                   │
│                          │                                   │
├──────────────────────────┴───────────────────────────────────┤
│  [← Volver]              [🚀 Publicar campaña]               │
└──────────────────────────────────────────────────────────────┘
```

### Sub-componentes nuevos
- `CampaignSetupFormComponent` — form Gen UI con valores pre-llenados (read-only excepto presupuesto + duración)
- `BudgetSliderComponent` — slider $20k-$500k con tick visual + valor mono large + Output reactivo
- `RoasEstimatorComponent` — bloque derecho con métricas calculadas en vivo según presupuesto (curve formula del spec sec. apéndice)
- `NotificationSchedulerComponent` — 3 checkboxes con previews de notificaciones
- `LaunchConfirmationModalComponent` — modal pre-publicación con resumen + "Sí, publicar ahora"
- `LaunchSuccessComponent` — full-screen estado éxito con confetti CSS + "¡Tu campaña está en el aire!" + Mission ribbon a 100% + CTA "Ver siguiente misión"
- `ConfettiComponent` — CSS-only confetti (40 partículas con animación dispersa, 4s)

### Componentes reusados
- `TopbarGali` + `MissionRibbon` (80% → 100% al publicar)
- `GaliMessage` (mensaje hero arriba del form)
- `ConfidenceMeter` (en estimator)

### Mock data nuevo
**Archivo:** `mocks/gali-launch.json`
```json
{
  "campaign": {
    "platforms": ["Meta Ads", "TikTok"],
    "audience": { "country": "Colombia", "age": "25-45", "interests": ["mascotas"] },
    "preFilledValues": {
      "platform": "Meta Ads",
      "budget": 50000,
      "duration": 7
    }
  },
  "roasCurve": [
    { "budget": 20000, "minSales": 3, "maxSales": 6, "minRoas": 1.8, "maxRoas": 2.8 },
    { "budget": 50000, "minSales": 8, "maxSales": 15, "minRoas": 2.1, "maxRoas": 3.4 },
    { "budget": 100000, "minSales": 18, "maxSales": 30, "minRoas": 2.3, "maxRoas": 3.8 },
    { "budget": 200000, "minSales": 38, "maxSales": 60, "minRoas": 2.5, "maxRoas": 4.1 }
  ],
  "notifications": [
    { "time": "24h", "label": "Métricas iniciales" },
    { "time": "72h", "label": "Primera optimización" },
    { "time": "7d", "label": "Reporte final + siguiente misión" }
  ]
}
```

### Cambios en GaliService
```typescript
updateBudget(value: number) // recalcula ROAS reactivamente
publishCampaign(): Observable<LaunchResult>
markMissionComplete()
```

### Archivos a crear/editar
**Crear:**
- `src/app/pages/gali-lanzamiento/gali-lanzamiento.component.{ts,html,scss}`
- `src/app/pages/gali-lanzamiento/components/{campaign-setup-form,budget-slider,roas-estimator,notification-scheduler,launch-confirmation-modal,launch-success,confetti}/*.{ts,scss}`
- `mocks/gali-launch.json`

**Editar:**
- `src/app/app.routes.ts` — `/gali/lanzamiento` + `/gali/exito`
- `src/app/services/gali.service.ts`
- `mock-api.interceptor.ts` — endpoint `/api/gali-launch`
- `navigation-map.json` — vista `lanzamiento`

### Verificación Fase 3
1. Tras "Continuar con campaña" → Modo Lanzamiento
2. Form pre-llenado, solo presupuesto + duración editables
3. Mover slider → ROAS estimator recalcula en vivo (animación de número contando)
4. Click "Publicar campaña" → modal de confirmación
5. Click "Sí, publicar ahora" → LaunchSuccess con confetti CSS
6. Mission ribbon: 80% → 100%
7. CTA "Ver siguiente misión" → navega a `/gali` (dashboard de Fase 4) o placeholder

---

## Fase 4 — Dashboard de Misiones + Onboarding (Pantallas 0 + 1)

**Outcome:** la **entry point** del workspace AI-First cambia. `/gali` ahora va al Dashboard. La primera vez que el usuario entra, va al Onboarding de 3 preguntas. El Dashboard muestra misión activa + misiones disponibles + alertas + chat libre con Gali.

### 4A — Onboarding (Pantalla 0)

**Cuándo aparece:** primera vez en `/gali` (sessionStorage flag `gali-onboarding-done`) o cuando no hay misión activa.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                  [Logo Dropi · AI-First]                     │
│                                                              │
│       ┌────────────────────────────────────────────┐         │
│       │  🔵 GaliAvatar (thinking)                  │         │
│       │                                            │         │
│       │  "Hola, [Nombre]. Soy Gali, tu copiloto.  │         │
│       │   Para recomendarte la mejor misión...     │         │
│       │   ¿Cuánto tiempo llevas en dropshipping?"  │         │
│       │  [streaming]                               │         │
│       │                                            │         │
│       │  [Soy nuevo, nunca he vendido]             │         │
│       │  [Menos de 3 meses]                        │         │
│       │  [3-12 meses, tengo algunas ventas]        │         │
│       │  [Más de 1 año, vendo regularmente]        │         │
│       │                                            │         │
│       │  Progress: ●●○                             │         │
│       └────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

3 preguntas con streaming + chips opciones + progress dots:
1. ¿Cuánto tiempo en dropshipping? → set `userLevel`
2. ¿Tienes nicho en mente? → set `userNiche`
3. ¿Cuál es tu objetivo más urgente? → set `userGoal`

Post-onboarding: Gali "piensa" 2s con execution stream, luego:
```
✨ Perfecto, Sebas.
Basado en tu perfil, te propongo:
🎯 "Lanza tu primer producto ganador en 72 horas"
📊 247 dropshippers como tú la completaron esta semana.
   Promedio: 2.4 días.
[🚀 Empezar esta misión]  [Ver otras misiones]
```

### 4B — Dashboard (Pantalla 1)

```
┌───────────────────────────────────────────────────────────────┐
│ Topbar — sin mission ribbon (esta es la casa)                 │
├──────────────────┬────────────────────────────────────────────┤
│  MISIÓN ACTIVA   │  GALI — Resumen del día                    │
│  (panel izq.)    │                                            │
│                  │  "Buenos días, Sebas. Esto es lo que       │
│  🎯 Lanza tu     │   necesitas atender hoy:"                  │
│  primer producto │                                            │
│  ▰▰▰▰▰▰░░░░ 60%  │  [AlertCard] Tu campaña lleva 48h. CTR 2.1%│
│                  │  [AlertCard] 2 novedades logísticas        │
│  Paso 3 de 5:    │                                            │
│  Crear landing   │  [MissionCard] Misión disponible:          │
│                  │  "Renueva tus creatives" · Alta prioridad  │
│  [Continuar →]   │                                            │
│                  │  ─────────────────────────────             │
│  ──────────      │  💬 ¿Qué quieres hacer hoy?               │
│  OTRAS MISIONES  │  [Buscar nuevo producto]                   │
│  [MissionCard]   │  [Revisar mis campañas]                    │
│  [MissionCard]   │  [Generar creatives nuevos]                │
│  [MissionCard]   │  [Escribir a Gali...]                      │
└──────────────────┴────────────────────────────────────────────┘
```

### Sub-componentes nuevos
- `OnboardingComponent` (`/gali/onboarding`)
- `OnboardingQuestionComponent` — wrapper de pregunta + chips
- `MissionRecommendationComponent` — post-onboarding card con CTA
- `DashboardComponent` (`/gali`)
- `MissionCardComponent` — 4 estados: `active`, `available`, `completed`, `locked` (Plus)
- `AlertCardComponent` — 3 variants: warning, info, success
- `DashboardGaliPanelComponent` — Gali resumen del día (variante sin sidebar derecho)
- `MissionListComponent` — lista vertical de misiones disponibles

### Mock data nuevo
**Archivo:** `mocks/gali-dashboard.json`
```json
{
  "user": { "name": "Sebas", "level": "descubridor", "joinedDays": 14, "salesCount": 1 },
  "activeMission": {
    "id": "m-001",
    "title": "Lanza tu primer producto ganador",
    "progressPct": 60,
    "currentStep": 3,
    "currentStepName": "Crear landing"
  },
  "availableMissions": [
    {
      "id": "m-002",
      "title": "Renueva tus creatives",
      "priority": "alta",
      "completedBy": 134,
      "avgDays": 1.2,
      "status": "available"
    },
    {
      "id": "m-003",
      "title": "Lleva tu producto a 50 ventas semanales",
      "completedBy": 89,
      "avgDays": 14,
      "status": "locked-plus"
    },
    {
      "id": "m-004",
      "title": "Configura tu primera campaña <$200k",
      "completedBy": 312,
      "avgDays": 3.1,
      "status": "completed"
    }
  ],
  "alerts": [
    {
      "id": "a-001",
      "type": "warning",
      "title": "Tu campaña lleva 48h",
      "subtitle": "CTR: 2.1% — por debajo del promedio",
      "recommendation": "Ajustar segmentación",
      "ctas": ["Ver campaña", "Aplicar sugerencia"]
    },
    {
      "id": "a-002",
      "type": "info",
      "title": "2 novedades logísticas pendientes",
      "subtitle": "Pueden afectar tu tasa de entrega"
    }
  ]
}
```

### Cambios de routing
- `/gali` ahora va a Dashboard (no a Descubrimiento directamente)
- `/gali/onboarding` para Pantalla 0
- `/gali/descubrimiento`, `/gali/estrategia`, `/gali/creacion`, `/gali/lanzamiento` siguen accesibles individualmente
- Flujo natural: `/gali/onboarding` → `/gali` (Dashboard) → click "Continuar misión" → siguiente paso del flujo

### Archivos a crear/editar
**Crear:**
- `src/app/pages/gali-onboarding/gali-onboarding.component.{ts,html,scss}`
- `src/app/pages/gali-dashboard/gali-dashboard.component.{ts,html,scss}`
- `src/app/pages/gali-dashboard/components/{mission-card,alert-card,dashboard-gali-panel}/*.{ts,scss}`
- `mocks/gali-dashboard.json`

**Editar:**
- `src/app/app.routes.ts` — agregar `/gali` (Dashboard) + `/gali/onboarding`. Esto cambia el routing default.
- `src/app/pages/prototype-gallery/prototype-gallery.component.ts` — tile principal apunta a `/gali` (dashboard) en lugar de `/gali/descubrimiento`
- `navigation-map.json` — agregar vistas `onboarding` y `dashboard`

### Verificación Fase 4
1. `/gali` primera vez → redirige a `/gali/onboarding`
2. 3 preguntas con streaming + chips + progress dots
3. Post-respuestas: execution stream "Calibrando recomendación..." + tarjeta de misión sugerida
4. Click "Empezar esta misión" → `/gali/descubrimiento` con `userLevel` ya seteado
5. Segunda vez en `/gali` → Dashboard (skip onboarding)
6. Dashboard muestra misión activa + 3 disponibles + 2 alertas + chat libre con Gali

---

## Fase 5 — Seguimiento post-lanzamiento (Pantalla 6)

**Outcome:** la 🔔 del topbar deja de ser placeholder. Tras "publicar" en Lanzamiento, se programan 3 notificaciones simuladas (24h, 72h, 7d) que aparecen al volver al Dashboard.

### Layout (drawer desde 🔔)
```
┌──────────────────────────────────────────────────────────────┐
│  📊 Primeras 24h de tu campaña                               │
│  Collar GPS · Meta · Lanzada hace 24h                        │
│                                                              │
│  Alcance:     4.200      Impresiones:  6.800                 │
│  Clics:       142 (2.09%) Ventas:      3                     │
│  Inversión:   $50.000    ROAS:         2.1x                  │
│                                                              │
│  ─────────────────────────────────────────────               │
│                                                              │
│  🔵 Gali: "El CTR está bien (1.8% sector promedio).         │
│   El ROAS está en el límite bajo. Recomiendo Banner 1        │
│   en paralelo."                                              │
│                                                              │
│  [Activar Banner 1]   [Revisar más tarde]                    │
└──────────────────────────────────────────────────────────────┘
```

### Componentes nuevos
- `NotificationsDrawerComponent` — drawer lateral desde topbar 🔔
- `PostLaunchPanelComponent` — contenido del drawer (métricas + recomendaciones de Gali)
- `MetricCardComponent` — tarjeta atómica con label + valor large + comparison

### Mock simulado
- Al "publicar" en Lanzamiento: `GaliService` programa un `setTimeout` mock que después de 8s (para demo) marca como "24h transcurridas" y agrega notificación al badge del topbar
- Click en 🔔 abre el drawer

### Archivos a crear/editar
**Crear:**
- `src/app/pages/gali-dashboard/components/notifications-drawer/*.{ts,scss}`
- `src/app/pages/gali-dashboard/components/post-launch-panel/*.{ts,scss}`
- `src/app/pages/gali-dashboard/components/metric-card/*.{ts,scss}`

**Editar:**
- `src/app/services/gali.service.ts` — añadir `notifications$` + `scheduleMockNotifications()` (timeouts)
- `src/app/pages/gali-descubrimiento/components/topbar-gali/*.ts` — wire el badge a `notifications$.length`

### Verificación Fase 5
1. Publicar campaña en Fase 3 → toast "Campaña lanzada"
2. Volver al `/gali` (Dashboard) → topbar 🔔 muestra badge "1" tras 8s mock
3. Click 🔔 → drawer con métricas + recomendación de Gali
4. "Activar Banner 1" → toast + Gali emite mensaje "Variante activada"

---

## Fase Transversal T1 — Trust Stage 2 (Selective Disclosure)

**Outcome:** demostrar que el sistema "sabe callarse" cuando el usuario ya tiene confianza. Toggle de demo: usuario nuevo (Stage 1, todo transparente) vs usuario con experiencia (Stage 2, selective).

### Implementación

**Toggle de demo:** botón discreto en el footer del Learning Ribbon: `[👤 Modo: usuario nuevo | usuario con experiencia]`. Click alterna el modo. Persiste en `sessionStorage` (coherente con la decisión "memoria efímera"; no localStorage).

**Diferencias Stage 1 → Stage 2:**

| Comportamiento | Stage 1 (default, usuario nuevo) | Stage 2 (con experiencia) |
|---|---|---|
| ConfidenceMeter | Visible en TODA respuesta | Solo cuando `confidence < 80%` |
| ExecutionStream | Visible expandido por default | Colapsado por default ("✓ Análisis completo · 3.7s"), expandible con disclosure |
| ReasoningAnchor | Aparece pre-grid de cards | No aparece (el usuario ya sabe el "por qué") |
| Hover-why tooltips | Aparecen a 800ms | Aparecen solo on `aria-describedby` keyboard focus, no en hover |
| Mensajes de Gali | Verbose ("Encontré 24 productos en mascotas. Te muestro...") | Concisos ("Aquí, 8 productos") |
| LearningRibbon | Visible siempre | Colapsable, oculto por default con badge "{N} aprendizajes" |

### Cambios en GaliService
```typescript
trustStage$: BehaviorSubject<1 | 2>  // 1 = transparency, 2 = selective
setTrustStage(s: 1 | 2)  // persiste en sessionStorage
```

### Cambios en componentes existentes
- `GaliMessageComponent` — `@Input() trustStage`. Si Stage 2 + confidence ≥ 80%, no renderiza el ConfidenceMeter
- `GaliExecutionStreamComponent` — `@Input() startCollapsed`. Si true, muestra summary collapsed por default
- `GaliLearningRibbonComponent` — `@Input() collapsedByDefault`. Si true, muestra solo header con badge
- `ReasoningAnchorComponent` — `@Input() hide`. Si true, no renderiza
- Mensajes canned en mock: agregar field `messageConcise` además de `message`. GaliService elige según trustStage

### Archivos a crear/editar
**Crear:**
- Componente nuevo `TrustStageToggleComponent` (sutil en footer del Learning Ribbon)

**Editar:**
- `src/app/services/gali.service.ts` — `trustStage$`
- `src/app/pages/gali-descubrimiento/components/gali-learning-ribbon/*.ts` — wire toggle
- `src/app/pages/gali-descubrimiento/components/{gali-message,gali-execution-stream,reasoning-anchor}/*.ts` — inputs + visibility logic
- `mocks/gali-discovery.json` (y futuros mocks) — agregar `messageConcise` por respuesta

### Verificación Fase T1
1. Cargar `/gali/descubrimiento` en Stage 1 (default) → todo visible como hoy
2. Click toggle "usuario con experiencia" en Learning Ribbon → confirmación rápida (sin modal)
3. Re-hacer "Quiero ver tendencias":
   - Execution stream aparece colapsado "✓ Análisis completo · 3.7s ▾"
   - Mensaje conciso "Aquí, 8 productos en tendencia"
   - ConfidenceMeter (87%) NO aparece (porque ≥ 80%)
   - ReasoningAnchor NO aparece
   - Learning Ribbon colapsado con badge "3 aprendizajes ▾"
4. Forzar respuesta con confidence < 80% (filtro "default") → ConfidenceMeter SÍ aparece (Stage 2 solo lo muestra cuando hay incertidumbre real)
5. Toggle de vuelta → todo visible
6. Demo lo cuenta solo: "Cuando Gali confía, se calla. Cuando duda, te lo dice."

---

## Reglas de oro durante la ejecución del roadmap

1. **No duplicar componentes ya construidos.** Si necesitas variante, agregar `@Input()` al componente existente o crear `XyzMiniComponent` que reuse el original con composición.
2. **Mantener un solo GaliService.** Extender con métodos por modo, no crear servicios paralelos.
3. **Mock JSON por fase** en `mocks/gali-{fase}.json`. Importar en interceptor con el mismo patrón actual.
4. **Mission ribbon es la lógica central de progreso.** Actualizar `mission$` en cada confirmación. La animación de fill es el feedback canónico de avance.
5. **Cada fase termina con Mission ribbon en un valor concreto:** Descubrimiento 40% · Estrategia 60% · Creación 80% · Lanzamiento 100%.
6. **DemoTourOverlay por modo.** Cada pantalla nueva tiene su propio mini-tour de 2-3 spotlights (sessionStorage flag distinto por pantalla).
7. **No mover lo ya construido.** El Modo Descubrimiento NO se refactoriza salvo el cambio del modal placeholder → router.navigate.
8. **Accesibilidad consistente.** Keyboard nav (ESC, Tab, Cmd+K), focus visible, aria-labels, prefers-reduced-motion. Reusar mixins de `_gali-tokens.scss`.

---

## Riesgos identificados del roadmap

1. **Fase 2 (Modo Creación) es la más compleja.** Canvas bidireccional con contenteditable + mini-toolbar flotante es no-trivial. Si bloquea, prototipar con elementos estáticos y solo `contenteditable` en headline + body (suficiente para demo).
2. **Confetti CSS en Fase 3** puede tener problemas de performance en viewports grandes. Limitar a 40 partículas + `will-change: transform`.
3. **Cambio del routing en Fase 4** (`/gali` ahora va a Dashboard) puede romper bookmarks. Mitigación: agregar redirect en routes para usuarios que vienen del tile actual.
4. **Trust Stage 2 requiere tocar varios componentes existentes.** Riesgo de regresión en el Modo Descubrimiento. Mitigación: todos los `@Input()` nuevos tienen default que reproduce el comportamiento Stage 1 actual.
5. **Tiempo total estimado:** Fase 1 (1-2d) + Fase 2 (2-3d) + Fase 3 (1-2d) + Fase 4 (2d) + Fase 5 (1d) + Fase T1 (1d) = **8-11 días** de implementación si se ejecuta secuencialmente.

---

## Estrategia de versionado del documento spec

Cuando empiece la ejecución de cada fase:
1. Crear sub-documento `docs/Specs/PlanFase{N}_DropiAiFirst_{NombreFase}.md` con los detalles ejecutables de esa fase (similar al v2.0 que ya existe para Pantalla 2)
2. Actualizar [navigation-map.json](../../Documents/dropi-prototypes/navigation-map.json) con la nueva vista
3. Tras completar fase: actualizar [PlanPrototipo_DropiAiFirst_ModoDescubrimiento.md](../../Documents/dropi-prototypes/docs/Specs/PlanPrototipo_DropiAiFirst_ModoDescubrimiento.md) sec. 15 (Out of scope) para mover el ítem cerrado de "out of scope" a "completado"

---

## Verificación end-to-end del roadmap completo

Cuando las 5 fases + T1 estén terminadas, el flujo demostrable es:

1. **Primera vez:** `/gali` → Onboarding (3 preguntas) → recomendación de misión
2. Click "Empezar misión" → `/gali/descubrimiento` con userLevel pre-cargado
3. Buscar tendencias → ver 8 cards → elegir Collar GPS → "Sí, vamos"
4. `/gali/estrategia` → editar buyer persona → ApprovalUI → "Confirmar"
5. `/gali/creacion` → tab Landing → editar headline → tab Creatives → elegir Video B → "Continuar"
6. `/gali/lanzamiento` → ajustar presupuesto $50k → ROAS estimator recalcula → "Publicar"
7. LaunchSuccess con confetti → "Ver siguiente misión" → `/gali` (Dashboard)
8. Dashboard muestra misión "Completada" + badge en 🔔 tras 8s
9. Click 🔔 → drawer con métricas 24h + recomendación de Gali
10. **Demo del Trust Stage 2:** toggle en Learning Ribbon → ver cómo la UI se simplifica
11. **Demo full reset:** botón ↺ en sidebar de Gali → vuelve al estado pre-onboarding

Resultado: la propuesta AI-First de Dropi completa, ejecutable como demo de 8-12 minutos con Michael Giovanni.

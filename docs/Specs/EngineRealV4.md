# Engine Real Gali V4 — Spec para Backend

> Documento de coordinación entre prototipo V4 (frontend) y equipo backend.
> Define los contratos que reemplazan las capas mock del prototipo.
> **Audiencia:** equipo backend Dropi + lead técnico de Gali.
> **Última actualización:** 2026-05-27

---

## 1. Chat real con Claude API (reemplaza mock `chat.service.ts`)

### Estado actual del prototipo
- `chat.service.ts` tiene 6 respuestas mock heurísticas con tick 28ms (`STREAM_TICK_MS`)
- Persistencia en localStorage `gali_v3_chat_threads`
- Thread IDs por proyecto (`activeThreadId` signal)

### Lo que se necesita del backend

**Endpoint:** `POST /api/gali/chat/message`

**Request:**
```typescript
{
  thread_id: string;           // 'inicio' | 'collar-gps-2026' | etc.
  user_id: string;             // ID del dropshipper
  message: string;             // texto del usuario
  context: {
    route: string;             // ruta actual del frontend para context
    memory_id: string;         // referencia a memoria persistida
    project_id?: string;       // si aplica
  };
  attachments?: Array<{ type: 'image' | 'url' | 'product'; ref: string }>;
}
```

**Response — Server-Sent Events (SSE):**
```
event: token
data: {"token": "Detecté"}

event: token
data: {"token": " que"}

event: reasoning
data: {"step": "Consultando memoria del proyecto Collar GPS", "source": "memory.service"}

event: reasoning
data: {"step": "Verificando datos comunidad LATAM últimos 7 días", "source": "community.signals"}

event: artifact
data: {"type": "vista", "ref": "vista-temp-123", "preview_url": "..."}

event: done
data: {"message_id": "msg-456", "total_tokens": 1247, "confidence": 0.87, "sources": ["memory", "comunidad", "pedidos"]}
```

**Eventos críticos:**
- `token` — para streaming del texto (mantiene la UX actual del cursor parpadeando)
- `reasoning` — implementa **H#11 transparencia del razonamiento**: cada step expandible en UI
- `artifact` — cuando Gali genera algo (landing, recipe, bloque)
- `done` — incluye confianza global de la respuesta (H#13)

**Modelo recomendado:** `claude-opus-4-7` (1M context) para respuestas complejas, `claude-sonnet-4-6` para chat conversacional rápido. Decidir por el `route` del contexto.

**Prompt caching obligatorio:** la memoria del usuario + perfil + decisiones históricas deben estar cacheadas. TTL 5 min. Cache hit rate objetivo > 85%.

**Fallback:** si la API falla, el chat muestra "Gali tuvo un hipo, reintentando..." y reintenta 2 veces con backoff exponencial antes de mostrar error definitivo.

---

## 2. OAuth real (reemplaza mock 3 pasos en `mi-stack.component`)

### Estado actual del prototipo
- 15 plataformas mock en `mocks/gali-v3/mi-stack.json`
- Toggle conexión en `localStorage gali_v3_mi_stack`
- Modal de 3 pasos puramente visual (sin OAuth real)

### Plataformas a integrar (prioridad)

| Plataforma | Tipo | Scope mínimo | Endpoint OAuth |
|---|---|---|---|
| Meta Ads | OAuth 2.0 | `ads_read,ads_management` | facebook.com/v18.0/dialog/oauth |
| TikTok Ads | OAuth 2.0 | `audience_data:read,reporting:read` | business-api.tiktok.com/portal/auth |
| Google Ads | OAuth 2.0 + Developer Token | `https://www.googleapis.com/auth/adwords` | accounts.google.com/o/oauth2/v2/auth |
| Google Sheets | OAuth 2.0 | `https://www.googleapis.com/auth/spreadsheets.readonly` | accounts.google.com/o/oauth2/v2/auth |
| WhatsApp Business Cloud API | Permanent token | `whatsapp_business_messaging,whatsapp_business_management` | developers.facebook.com/apps |
| Shopify | OAuth 2.0 | `read_orders,read_products,read_inventory` | {shop}.myshopify.com/admin/oauth |
| Webhook genérico | Bearer token | n/a | usuario provee URL + token |

### Contratos requeridos

**Endpoint:** `POST /api/gali/stack/{platform}/connect`

**Flow:**
1. Frontend abre popup a `redirect_url` que retorna backend
2. Usuario aprueba en plataforma externa
3. Plataforma redirige a backend con `code`
4. Backend intercambia `code` → `access_token + refresh_token`
5. Backend guarda en BD encriptado + emite WebSocket evento `stack:connected` al frontend
6. Frontend cierra popup, refresh del estado, muestra "✓ Conectado"

**Endpoint:** `DELETE /api/gali/stack/{platform}/disconnect`
- Revoca el token en la plataforma externa cuando es posible
- Marca conexión como inactiva en BD

**Heurística H#5 (prevención de errores):**
- Backend valida scopes antes de guardar → si faltan permisos críticos, retorna error con lista de scopes faltantes
- Frontend muestra "Necesitas autorizar X permiso adicional" y permite reintentar

**Cumplimiento:**
- Plataformas financieras (Nequi, Bancolombia) requieren validación adicional KYC del dropshipper antes de OAuth
- Gmail/correo personal: avisar al usuario "vamos a leer (no enviar) tus correos solo durante esta sesión" — H#3 control

---

## 3. Recipes engine (reemplaza log streamed mock en `builder/terminal`)

### Estado actual del prototipo
- `flow.service.ts` con `flows: signal<FlowGraph[]>` y `executionLog: signal<string[]>`
- `executeFlow()` simula log línea por línea con setTimeout
- 8 triggers + 12 actions + 3 conditions en `flow-blocks-catalog.json`

### Lo que se necesita del backend

**Motor de evaluación:**
- Engine basado en estado-máquina (Temporal/Airflow o similar)
- Triggers verificables sobre eventos Dropi reales (webhooks internos)
- Cada nodo de la recipe declara `inputs schema` + `outputs schema` (tipados)
- Esquema anti-error tipo Make (§5.3 del spec original) — schemas estrictos, errores en cascada bloqueados

**Endpoint:** `POST /api/gali/recipes/{recipe_id}/execute`

**Modos:**
- `dry_run: true` — ejecuta sobre datos del usuario sin efectos secundarios. Genera log.
- `dry_run: false` — ejecución real. Requiere confirmación si la recipe escribe en sistemas externos.

**Endpoint:** `POST /api/gali/recipes/{recipe_id}/activate`
- Pone la recipe en estado `active`
- Conecta los triggers reales a webhooks de Dropi
- Inicia evaluación continua

**Endpoint:** `GET /api/gali/recipes/{recipe_id}/log?since=...`
- Server-Sent Events para log en tiempo real
- Cada línea: `{ timestamp, node_id, status: 'ok'|'error'|'skipped', output_preview, latency_ms }`

**H#5 prevención de errores en recipes:**
- Antes de activar, backend calcula `cost_estimate`: cuántas operaciones/mes consumirá esta recipe basándose en volumen histórico del usuario
- Si supera umbral del plan, bloquea activación y muestra propuesta de optimización
- Rollback de las últimas 10 acciones siempre disponible (vista H#3)

**Pause/Resume:**
- Cada recipe en producción tiene botón "Pausar" siempre visible (no enterrado en menú)
- Pausar congela los triggers pero conserva estado

---

## 4. Memoria backend (reemplaza `memory.service.ts` localStorage)

### Estado actual del prototipo
- `memory.service.ts` lee `gali-memory.json` y persiste cambios a `localStorage`
- Memoria es un objeto con perfil, negocio, decisiones, aprendizajes, preferencias_esteticas, siguiente_accion_sugerida

### Lo que se necesita del backend

**Endpoint:** `GET /api/gali/memory/{user_id}`
**Endpoint:** `PATCH /api/gali/memory/{user_id}`

**Persistencia:**
- Postgres con JSONB para flexibilidad del schema de memoria
- Backup diario + audit log de cambios (quién/cuándo/qué cambió)
- Replicación por región LATAM para latencia < 50ms

**Schema:**
```typescript
interface GaliMemory {
  user_id: string;
  version: number;             // optimistic locking
  perfil: { ... };             // (igual al mock actual)
  negocio: { ... };
  decisiones: Array<{ id: string; fecha: ISO8601; que: string; por_que: string; gali_origen?: boolean }>;
  aprendizajes: Array<{ id: string; texto: string; capturado_en: ISO8601; fuente: 'chat' | 'manual' | 'gali_inferido' }>;
  preferencias_esteticas: { ... };
  siguiente_accion_sugerida: { texto: string; contexto: string; confianza: number; refresh_en: ISO8601 };
  updated_at: ISO8601;
}
```

**Thread IDs por proyecto:**
- Cada `GaliProject` declara `memory_thread_id`
- El chat puede consultar la memoria escopada al proyecto sin mezclar contexto con otros proyectos

**H#14 memoria explicable** (ya cubierto en V3, conservar):
- Cada `aprendizaje` es editable inline (chips)
- Cada `decision` muestra origen ("Gali infirió esto" vs "tú lo dijiste")
- Usuario puede borrar cualquier item, audit log lo registra

---

## 5. Engine de bloques custom (Vista 8 — reemplaza preview mock)

### Estado actual del prototipo
- `bloque-builder.service.ts` carga 5 ejemplos pre-calculados de `bloques-custom-ejemplos.json`
- "Probar con datos reales" toggle es puro flag visual

### Lo que se necesita del backend

**Endpoint:** `POST /api/gali/bloques/preview`

**Request:**
```typescript
{
  fuente_id: 'pedidos' | 'productos' | 'cartera' | 'campanas' | 'comunidad' | 'memoria';
  tipo_visualizacion: BloqueVisualizacion;
  ventana_temporal: BloqueVentanaTemporal;
  filtros: BloqueFiltro[];
  ordenamiento?: BloqueOrdenamiento;
  usar_datos_reales: boolean;     // si false, usa datos sintéticos del demo
}
```

**Response:**
```typescript
{
  preview_data: BloquePreviewData;       // datos reales del usuario
  cost: {
    registros_procesados: number;
    tiempo_ms: number;
    advertencia?: string;                // "Procesa 14k registros — toma ~1.1s"
  };
  confidence: number;                    // 0-1 basado en completitud de los datos
  reasoning: string;                     // H#11 — por qué Gali eligió este preview
}
```

**Endpoint:** `POST /api/gali/bloques/save`
- Persiste el bloque al store del usuario (reemplaza localStorage actual)
- Si `compartir_comunidad: true`, también lo agrega al marketplace público

**Engine de query:**
- Las fuentes son views sobre las tablas reales de Dropi (pedidos, productos, etc.)
- Para fuente `comunidad`: agregación anonimizada con K-anonymity ≥ 50 (mínimo 50 vendedores aportando datos al benchmark)
- Para fuente `memoria`: scoped al user_id sin mezclar con otros

**Cache:**
- Preview se cachea por 5 min con key = hash(query params + user_id)
- Si el usuario cambia un filtro, hit en cache si la combinación ya se evaluó

**Engine de evaluación continua:**
- Bloques activos se re-evalúan cada N minutos según la fuente:
  - `pedidos`/`productos`/`cartera`: cada 5 min
  - `campanas` (Stack): cada 15 min (rate limits externos)
  - `comunidad`: cada hora
  - `memoria`: bajo demanda

---

## 6. Marketplace de bloques + recipes compartidos (Fase 3)

### Estado actual del prototipo
- `mocks/gali-v3/bloques-comunidad.json` con 11 bloques publicados
- `mocks/gali-v3/mercado/*.json` con plantillas/agentes/conexiones
- "Compartir con comunidad" toggle en Constructor y "Compartir recipe" CTA en Builder

### Lo que se necesita del backend

**Endpoint:** `POST /api/gali/marketplace/publish`
- Acepta `bloque_id` o `recipe_id`
- Anonimiza el autor según preferencias (perfil + ciudad + métrica destacada, nunca el nombre real)
- Calcula `confianza_promedio` agregando rating de instaladores previos
- Valida que el bloque/recipe no contenga referencias a datos privados del autor

**Endpoint:** `POST /api/gali/marketplace/install/{item_id}`
- Clona el bloque/recipe al store del usuario instalador
- Incrementa contador `instalaciones`
- Genera notificación al autor original (opcional)

**Endpoint:** `GET /api/gali/marketplace/items?filter=...`
- Lista paginada con filtros: categoría, tipo (bloque/recipe), rating mínimo, fecha publicación, autor

**Rating + reviews:**
- Cada instalación pide rating opcional 1-5
- Comentarios mod-erados (anti-spam + anti-engagement bait)
- Trending = (instalaciones últimos 7d) × (rating promedio) / días desde publicación

**Programa de builders (monetización Fase 4):**
- Endpoint `GET /api/gali/builders/{user_id}/earnings` con histórico
- Modelo de revenue share: 70% creator / 30% Dropi en bloques premium (futuro)
- Badges: "Primer publicación", "100 instalaciones", "Rating ★4.8+", "Top 10 de su nicho"

---

## 7. Coordinación de despliegue

### Stages

| Stage | Frontend | Backend | Datos |
|---|---|---|---|
| **Stage 1** | Prototipo navegable actual (mock) | n/a | localStorage |
| **Stage 2** | Mismo frontend + flag `BACKEND_REAL` | API mock que retorna datos fake del backend | BD test |
| **Stage 3** | Frontend con flag `BACKEND_REAL=true` | Backend real con engines básicos (Chat + Memoria) | BD prod escopada beta |
| **Stage 4** | Frontend final | Backend full (OAuth + Recipes + Marketplace) | BD prod completa |

### Métricas de éxito

- **Chat:** P95 latency < 1.5s para primera token, completion full < 8s
- **Memoria:** P95 GET < 50ms, PATCH < 200ms
- **Recipes:** dry_run < 3s, evaluación continua < 30s desde trigger event
- **OAuth:** completion del flow < 90s (incluyendo plataforma externa)
- **Bloques preview:** P95 < 1.5s para fuentes Dropi-core, < 5s para fuente comunidad
- **Marketplace:** install action < 500ms (clonado al store local)

### Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Claude API costos disparados sin caching | Prompt caching obligatorio + monitor de cache hit rate en Grafana |
| OAuth tokens expirados sin refresh | Refresh tokens automáticos + alerting al usuario si una conexión lleva > 7 días sin sync |
| Recipes ejecutadas con datos parciales | Schema validation estricto + paused state si datasource falla > 3 veces seguidas |
| Marketplace inflado con bloques spam | Moderación humana primeros 30 días post-launch + auto-flag si rating < 2.5 con > 10 instalaciones |
| Data leak en fuente comunidad | K-anonymity ≥ 50 + audit log de cada query agregada |

---

## 8. Decisiones pendientes con equipo

1. **Vendor de SSE/WebSocket:** AWS API Gateway + Lambda WebSockets, o servicio dedicado (Ably/Pusher)?
2. **Moderación del marketplace:** manual primeros 30 días o auto desde día 1 con ML classifier?
3. **K-anonymity threshold:** ¿50 dropshippers mínimo es suficiente o subimos a 100 para datos sensibles?
4. **Rollback de recipes:** ¿últimas 10 acciones es suficiente o necesitamos 50?
5. **Earnings split builders:** 70/30 o 60/40? Discutir con legal + finanzas LATAM.

---

## 9. Cierre

Este documento es el **contrato vivo** entre prototipo V4 y backend.
Cuando algo del prototipo cambie de forma que afecte una de estas APIs, **se actualiza primero este doc**, después se notifica al equipo backend.

Owners: Catalina (frontend prototipo) · Backend lead Dropi · Tech lead Gali.

*Engine Real V4 · 2026-05-27*

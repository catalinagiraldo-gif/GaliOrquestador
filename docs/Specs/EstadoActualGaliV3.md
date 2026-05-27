# Estado actual — Gali v3 "Claude Dropi"

> **Palabra clave para retomar:** `ContinuarGali3`
>
> Cuando el usuario escriba esta palabra en una conversación nueva, leer este archivo, revisar el plan en `/Users/user/.claude/plans/lee-spec-de-docs-specs-plangali2-md-harmonic-cupcake.md`, y continuar desde la siguiente sub-fase pendiente.

---

## Snapshot

- **Plan completo:** `/Users/user/.claude/plans/lee-spec-de-docs-specs-plangali2-md-harmonic-cupcake.md`
- **Última actualización:** 2026-05-26
- **Rama prototipo:** `/gali-v3/*` (coexiste con `/gali-v2/*` legacy)
- **Dev server:** `yarn start` → http://localhost:4200/gali-v3
- **Galería:** http://localhost:4200/home → carta `GALI-V3`

---

## Sub-fases del plan

| Fase | Descripción | Estado |
|---|---|---|
| **F0** | Tokens light + shell + Header IA 2 (Figma) + Sidebar 56px | ✅ Completada |
| **F1** | Canvas grid + Block wrapper + paleta + 3 bloques starter (pedidos, cartera, misiones) | ✅ Completada |
| **F2** | Starter packs aplicados desde onboarding + onboarding light + maestría wiring | ✅ Completada |
| **F3** | Resto de 8 bloques (integraciones, landings, productos, novedades, memoria, métricas, proyecto-activo, starter-tour) + memory inspector light + header input light | ✅ Completada |
| **F4** | Páginas nuevas `/gali-v3/integraciones` (7 plataformas + modal flujo) + `/gali-v3/landings` (grid + crear-via-prompt) | ✅ Completada |
| **F5** | Wrappers operativos `/gali-v3/pedidos`, `/gali-v3/cartera`, `/gali-v3/catalogo` que embeben los componentes legacy con chrome v3 | ✅ Completada |
| **F6** | Composición conversacional "Claude Dropi mode" — Gali responde a "arma mi día" generando un layout temporal preview-able | ✅ Completada |
| **F7** | Polish — empty states, microinteracciones, responsive, keyboard nav, accesibilidad final | ✅ Completada (pass mínimo: Cmd/K, foco accesible, microinteracciones de preview) |

---

## Lo que está vivo y funcional

**Rutas activas:**
- `/gali-v3` — Inicio con canvas libre + saludo + CTAs descubrimiento + banner de propuesta conversacional + chips de vistas guardadas.
- `/gali-v3/onboarding` — Onboarding light (3 preguntas + momento wow) que guarda perfil, infiere nivel de Maestría y aplica el starter pack al canvas.
- `/gali-v3/playground-maestria` — Visualización adaptativa de la voz de Gali (3 niveles + samples + sello). Cambiar de nivel re-arma el canvas.
- `/gali-v3/integraciones` — 7 plataformas (Tienda Nube, Shopify, Woo, Meta, Google Ads, Mailchimp, WhatsApp Biz) agrupadas por tienda/ads/mensajería + modal de conexión 3 pasos.
- `/gali-v3/landings` — Grid de landings con thumb, estado (LIVE/DRAFT/PAUSADA) y stats + modal "crear con Gali" (prompt → loading → preview → publicar).
- `/gali-v3/pedidos` — Wrapper de `<app-mis-pedidos>` con chrome v3 (crumb + título + sub).
- `/gali-v3/cartera` — Wrapper de `<app-historial-cartera>` con chrome v3.
- `/gali-v3/catalogo` — Wrapper de `<app-catalog>` con chrome v3.

**F6 — Claude Dropi mode:**
- `CanvasService.proponerDesdePrompt(prompt)` produce `{layout, explicacion}` y lo emite por `pending$`.
- Header input intercepta prompts tipo "arma mi día", "subir ventas", "vista de semana", "enfoque" y los enruta al canvas (no al orquestador).
- Inicio muestra banner terracota con prompt + explicación + CTAs `guardar vista →` y `volver al lienzo`.
- Vistas aceptadas persisten en `localStorage` (`gali_v3_canvas_vistas`) y se exponen como chips arriba del canvas (`aplicarVista` / `eliminarVista`).

**Componentes creados:**
- `src/app/components/gali-v3/gali-v3-header/` — Header IA 2 fiel al Figma (logo + search ✦ + BETA + saldo + bell + avatar).
- `src/app/components/gali-v3/gali-v3-sidebar/` — Sidebar 56px con sección operativa + sección Gali (terracota) + footer.
- `src/app/components/gali-v3/gali-v3-block-wrapper/` — Wrapper genérico con head/title/hint/expand/menú de tamaño/remove.
- `src/app/components/gali-v3/blocks/block-pedidos.component.ts` — 4 stats + lista 5 pedidos LATAM.
- `src/app/components/gali-v3/blocks/block-cartera.component.ts` — Saldo COP + proyección sage + hint Gali.
- `src/app/components/gali-v3/blocks/block-misiones.component.ts` — Misión activa con progress bar.
- `src/app/components/gali-v3/blocks/block-integraciones.component.ts` — 4 plataformas con estado conectada/pendiente.
- `src/app/components/gali-v3/blocks/block-landings.component.ts` — 3 landings (LIVE/DRAFT) + CTA crear con Gali.
- `src/app/components/gali-v3/blocks/block-productos.component.ts` — 4 productos filtrados por curva.
- `src/app/components/gali-v3/blocks/block-novedades.component.ts` — Stats triage + lista críticas/gestionando.
- `src/app/components/gali-v3/blocks/block-memoria.component.ts` — 3 slots editables inline.
- `src/app/components/gali-v3/blocks/block-metricas.component.ts` — ROAS / ventas / conversión con sparkline SVG.
- `src/app/components/gali-v3/blocks/block-proyecto-activo.component.ts` — Hero + siguiente acción + memoria.
- `src/app/components/gali-v3/blocks/block-starter-tour.component.ts` — 3 misiones de la primera semana + chat embebido.
- `src/app/pages/gali-v3/onboarding/onboarding.component.ts` — Onboarding 3 preguntas light. Aplica starter pack tras completar.
- `src/app/pages/gali-v3/playground-maestria/playground-maestria.component.ts` — Visualización adaptativa de voz; cambiar nivel re-arma canvas.
- `src/app/pages/gali-v3/gali-v3-shell.component.ts` — Shell con header + sidebar + banner promo dismissible + outlet + overlay Gali.
- `src/app/pages/gali-v3/inicio/` — Canvas funcional con modo edición.

**Servicios creados:**
- `src/app/services/gali-v3/block-registry.ts` — 11 manifests de bloques con sizes, niveles, datasource, expandRuta.
- `src/app/services/gali-v3/starter-packs.ts` — 3 packs (primer-dia / operacion-diaria / centro-mando).
- `src/app/services/gali-v3/canvas.service.ts` — Estado del layout en localStorage con apply/add/remove/resize/reorder.

**Estilos:**
- `src/styles/_gali-v3-tokens.scss` — Paleta light cálida, todos los pares texto/fondo WCAG AAA. Mixins `gv3-card`, `gv3-gali-surface`, `gv3-display-tight`, `gv3-display-editorial`, `gv3-bg-cream-radial`.

**Reutilizado de v2 sin cambios:**
- `MaestriaService`, `MemoriaService`, `PerfilService`, `OrquestadorService`, `SenalesService`, `GaliStreamingService`.
- `GaliResponseOverlayComponent` (overlay del chat).

---

## Decisiones tomadas

1. **Tema:** Light alineado con Figma `Ub7Up7f5K0WGuDC6g2jdCu` node `7797:113243`. Crema `#FAF7F2`, naranja Dropi `#F49A3D`, terracota `#B8593A` solo para Gali.
2. **Modelo de personalización:** Canvas libre tipo Notion, no bloques fijos. Grid 4 columnas con sizes (1x1, 2x1, 2x2, 3x1, 3x2, full).
3. **Páginas faltantes:** Crear `/gali-v3/integraciones` y `/gali-v3/landings` desde cero (F4).
4. **Coexistencia:** `/gali-v2/*` se mantiene como `legacy` en la galería. Eventual cleanup tras aprobación de v3.

---

## Open questions sin resolver

Del plan en `Open questions`, pendientes de decisión:

1. **Sidebar 56px** — implementé con 7 entries operativas + 2 Gali (proyectos, vistas) + 3 footer. ¿Validar si faltan/sobran entries?
2. **Drag-and-drop del canvas** — implementé reorder API en `CanvasService` pero la UI usa solo +/-resize. ¿Drag visual o stay simple?
3. **Landing builder** — F4 va a implementar lista + crear-via-prompt (preview only). Builder real es scope futuro.
4. **Datasource live:** los bloques `pedidos/cartera/productos/metricas` usarán mock data inline en F3. Conectar al mock interceptor real es scope F6+.

---

## Cómo retomar (instrucciones para Claude)

Cuando el usuario diga `ContinuarGali3`:

1. **Leer este archivo** primero.
2. **Leer el plan completo** en `/Users/user/.claude/plans/lee-spec-de-docs-specs-plangali2-md-harmonic-cupcake.md`.
3. **Verificar estado** con:
   ```bash
   yarn build 2>&1 | tail -10
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4200/gali-v3
   ```
4. **Identificar la siguiente sub-fase pendiente** en la tabla arriba (actualmente F2).
5. **Crear tasks** en TaskCreate solo para las sub-fases que se van a ejecutar en esta sesión.
6. **Ejecutar siguiendo el plan** — sin pedir confirmación de cada sub-fase, parar solo al final de cada fase para verificar build + actualizar este archivo.

**Reglas duras:**
- NO tocar `_gali-tokens.scss` (v1 legacy) ni `_gali-v2-tokens.scss` ni componentes `gali-*` legacy.
- NO modificar páginas operativas existentes (`mis-pedidos`, `catalog`, `historial-cartera`, etc.) — solo wrappear en F5.
- SÍ reutilizar servicios `gali-v2/*` (MaestriaService, MemoriaService, etc.) — son agnósticos del tema.
- Cada sub-fase debe pasar `yarn build` antes de marcarse completada.
- Actualizar este archivo al final de cada sub-fase moviendo la fila de "⏳ Pendiente" a "✅ Completada" + agregar entries a "Lo que está vivo y funcional".

---

## Próxima acción inmediata

**Todas las sub-fases F0-F7 están ✅ Completadas.**

Próximos pasos sugeridos (post-prototipo):
1. Validar el prototipo end-to-end con un dropshipper externo (ver tests de aceptación en el plan original).
2. Migración real: renombrar `/gali-v3/*` → `/gali/*` y deprecar `/gali-v2/*` cuando esté aprobado.
3. Datasource live para los bloques (hoy mock inline) — conectar `block-pedidos`, `block-cartera`, `block-productos`, `block-metricas` al mock interceptor real.
4. Builder real de landings (hoy solo preview).
5. Memoria sincronizada con `MemoriaService` real (hoy seed mock interno del inspector v3).

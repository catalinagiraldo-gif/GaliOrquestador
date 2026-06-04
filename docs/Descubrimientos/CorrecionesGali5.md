PROBLEMAS DETECTADOS
1. Inconsistencias de datos entre vistas
* El Hub muestra ROAS 2.9x en la tarjeta de Marketing, pero Reportes muestra ROAS real 1.93x. El usuario puede confundirse sobre cuál dato es el "verdadero".
* El presupuesto aparece como $66k/día en el Hub y $80k/día en el detalle del proyecto. No hay claridad de si son valores actualizados a distintos momentos o un error.
2. El Hub tiene una jerarquía visual confusa
* Las tarjetas del "ciclo de negocio" (Producto → Marketing → Pedidos → Logística → Finanzas → Reportes) no siguen un flujo visualmente limpio. Logística aparece desfasada hacia abajo y a la derecha, rompiendo la lectura izquierda-a-derecha. Finanzas y Reportes están en una segunda fila sin continuación lógica del flujo.
* No hay una flecha que conecte Pedidos con Logística hacia abajo, lo que corta el flujo visual del ciclo.
3. Las pestañas del Hub son confusas en su propósito
* Existe una pestaña "Principal" y una "ouiui" (nombre de proyecto). No es intuitivo por qué hay dos pestañas ni qué diferencia tienen. La pestaña "Principal" no tiene un ícono o label suficientemente diferenciado del sistema de tabs.
4. El panel lateral "Hablar con Gali" compite visualmente con "Decisiones pendientes"
* Ambas secciones tienen el mismo peso visual y están una al lado de la otra, pero tienen jerarquías de urgencia distintas. Las "Decisiones pendientes" requieren acción inmediata; el chat de Gali es consultivo. Esto genera confusión sobre qué debe atender primero el usuario.
5. El botón "+1 más…" en Decisiones pendientes es ambiguo
* No es claro si "+1 más" son acciones adicionales para tomar, opciones del dropdown, u otras decisiones en cola. El label no comunica su naturaleza.
6. El tooltip "Prototipo · Ir a modo Señales / Lanzar" aparece en los botones de modo
* Esto es una nota de prototipo visible al usuario final. Rompería la experiencia en una versión real si se deja como está.
7. La alerta de Vigilante en el Hub no tiene jerarquía de urgencia clara
* El banner naranja de "Para escalar de 20 a 50 pedidos/sem, Vigilante recomienda activar Smart Routing" aparece en todos los dashboards y no tiene forma de cerrarse o snoozearse. Si ya fue atendido, sigue visible sin cambio de estado.
8. El estado de Finanzas genera alarma sin contexto suficiente
* "Sin facturar — conectar Siigo" aparece con un ícono de advertencia pero no dice cuánto tiempo llevan sin facturar ni cuál es el riesgo concreto hasta que el usuario hace clic.
9. La sección "Memoria Gali" en el detalle de proyecto está al final y es difícil de encontrar
* Información clave de decisiones pasadas (ángulo elegido, presupuesto escalado) está enterrada al fondo de la vista de proyecto, cuando debería ser prominente para dar contexto al estado actual.
10. Los agentes muestran "tasa de éxito" sin definir qué es éxito
* ADA Spy tiene 79% de éxito pero está en estado "Esperando". No hay definición de qué significa esa tasa ni comparación con un benchmark para saber si es buena o mala.
11. El botón "Vista simple ←" en el Hub no tiene contexto
* No está claro a qué "vista simple" te lleva ni qué información perdería el usuario al activarla.
12. "Ciclo de negocio" es un micro-label invisible en el Hub
* Aparece como texto muy pequeño junto al header del producto. No guía al usuario sobre cómo leer el flujo.

OPORTUNIDADES DE MEJORA — PASOS ESPECÍFICOS
Mejora 1: Unificar y priorizar el dato real de ROAS
1. Elegir un único ROAS visible en el Hub: el real (1.93x), con el ROAS Meta como contexto secundario en color gris o en un tooltip.
2. En la tarjeta de Marketing mostrar: ROAS real 1.93x con un sublabel Meta declarada: 2.9x.
3. En la tarjeta de Reportes mantener el CPA y ROAS real como la métrica principal, eliminando la duplicación confusa.
Mejora 2: Rediseñar el flujo visual del ciclo de negocio
1. Reorganizar las 6 tarjetas en una sola fila horizontal lineal: Producto → Marketing → Pedidos → Logística → Finanzas → Reportes.
2. Si la pantalla no da el ancho, usar un scroll horizontal o dividir en dos filas manteniendo flechas explícitas de continuación entre filas.
3. Agregar flechas conectoras entre todas las tarjetas, incluyendo la bajada de Pedidos a Logística.
Mejora 3: Clarificar el sistema de pestañas del Hub
1. Renombrar la pestaña "Principal" a "Mi negocio" o usar un ícono de casa para diferenciarla de dashboards de proyectos.
2. Agregar un microtexto bajo cada pestaña de proyecto que diga el nombre completo del proyecto al hacer hover.
3. Definir visualmente que el "+" abre dashboards de proyectos adicionales, no tabs genéricos.
Mejora 4: Separar urgencia entre Decisiones y Chat de Gali
1. Dar a "Decisiones pendientes" un área de mayor altura y posición más prominente (arriba o al centro), ya que requieren acción del usuario.
2. Colapsar el panel de "Hablar con Gali" por defecto o moverlo a un drawer lateral accesible desde el header, liberando espacio visual.
3. Agregar un badge de urgencia en el header global cuando haya decisiones sin atender.
Mejora 5: Reemplazar "+1 más…" con un label accionable
1. Cambiar el botón a "Ver más opciones (1)" o desplegarlo directamente en el card sin necesidad de un clic adicional si son ≤ 3 opciones.
2. Definir un límite de acciones visibles por defecto (2 acciones) y mostrar el resto en un menú contextual con un ícono de "⋯".
Mejora 6: Eliminar o aislar las notas de prototipo
1. Mover los tooltips de "Prototipo · Ir a modo X" a un modo de presentación separado (e.g., solo visible si hay un parámetro ?mode=prototype en la URL).
2. En la versión de revisión/demo, reemplazarlos por tooltips descriptivos del comportamiento real esperado.
Mejora 7: Hacer que el banner de alerta de Vigilante sea accionable y cerrable
1. Agregar un botón "X" o "Snooze 24h" al banner naranja.
2. Una vez que el usuario activa Smart Routing, cambiar el banner a estado "completado" (verde con checkmark) durante 24h, y luego desaparecerlo automáticamente.
3. Agregar un timestamp de cuándo fue generada la alerta.
Mejora 8: Dar contexto de urgencia al estado de Finanzas antes del clic
1. En la tarjeta de Finanzas del Hub mostrar: 28 facturas pendientes · $450k · 6 días sin sincronizar.
2. Incluir un label de riesgo (⚠ Riesgo fiscal) visible directamente en la tarjeta, no solo al abrir el detalle.
Mejora 9: Subir "Memoria Gali" al inicio del detalle de proyecto
1. En la vista de proyecto, mostrar "Memoria Gali" como una sección colapsable en la parte superior, antes de los agentes asignados.
2. Las "Decisiones clave" y "Aprendizajes" deben ser el primer contexto que el usuario lee antes de ver los números.
3. La "Siguiente acción recomendada" debe tener un botón flotante o sticky en la parte inferior de la pantalla para ser siempre visible.
Mejora 10: Definir y mostrar el benchmark de tasa de éxito de agentes
1. Agregar una definición en tooltip: "Tasa de éxito = acciones ejecutadas sin requerir intervención manual".
2. Mostrar el benchmark de la plataforma (ej. "Promedio Dropi: 89%") para que el usuario pueda comparar.
3. Si un agente tiene tasa de éxito < 80%, marcarla en amarillo; si < 70%, en rojo, con sugerencia de revisión de reglas.
Mejora 11: Documentar y renombrar "Vista simple"
1. Cambiar el label a "← Modo básico" o "Ocultar agentes" para describir qué cambia.
2. Agregar un tooltip que explique qué información se oculta: "Oculta los agentes y muestra solo métricas principales".
3. Persistir la preferencia del usuario (vista simple o compleja) en su perfil.
Mejora 12: Hacer visible el "Ciclo de negocio" como título de sección
1. Convertir el micro-label "↻ Ciclo de negocio" en un título visible de la sección de tarjetas.
2. Al hacer clic en él, mostrar una explicación de cómo se lee el flujo para usuarios nuevos.
3. Agregar una opción de "tutorial del ciclo" para usuarios en onboarding.



# Análisis de Usabilidad y Propuesta de Valor — Prototipo Gali v5

Exploré el prototipo completo recorriendo: Gali Hub, Proyectos, detalle de Proyecto, Agentes, Skills, Reglas, Marketplace, Conexiones, Mi Negocio (4 pestañas), Torre Logística, Reportes, Financiero, Marketing, Pedidos, Academy y el flujo de Nuevo Proyecto. A continuación el análisis dividido en dos grandes bloques.

---

## BLOQUE 1: Problemas de Usabilidad

### 1. Doble menú de navegación sin jerarquía clara

Existe un menú lateral izquierdo del tipo "Dropi clásico" (Pedidos, Logística, Reportes, Financiero, Marketing, CAS, Academy) y un segundo menú lateral izquierdo exclusivo de Gali (Gali Hub, Proyectos, Mi Negocio, Agentes, Skills, Reglas, Marketplace, Conexiones). Ambos coexisten en la misma pantalla y no hay ninguna separación visual, título o lógica que le explique al usuario cuál es el ecosistema de Gali y cuál es el Dropi tradicional. Un dropshipper que entra por primera vez no sabe si son dos sistemas distintos o uno solo, y no entiende qué menú debe usar primero.

### 2. Los botones "Señales", "Lanzar" y "Medir" del top bar no hacen nada funcional

Al hacer clic en los tres botones del top bar, solo aparece un tooltip de prototipo en la parte inferior que dice "Ir a modo Señales / Lanzar / Medir", pero no navegan a ninguna pantalla, no abren ningún panel ni ejecutan ninguna acción real. Son tres elementos de alto valor visual que no tienen destino, generando confusión y frustración porque el usuario los ve como las acciones más importantes del día pero no puede acceder a ellas.

### 3. El Gali Hub muestra tarjetas del flujo de negocio con dos columnas vacías sin explicación

En la sección central del Hub (el mapa del negocio Producto → Marketing → Pedidos → Logística → Finanzas), las tarjetas de "Producto" y "Marketing" están ahí pero hay dos columnas completamente vacías entre ellas y las de Pedidos/Logística. El usuario no entiende si esas columnas vacías representan algo que falta conectar, un dato que no cargó o un estado incompleto del prototipo.

### 4. Las pestañas "Principal" y "ouiui" del Hub no tienen diferencia visible ni propósito explicado

Existe un sistema de pestañas en el Gali Hub con una pestaña llamada "Principal" y otra llamada "ouiui" (que parece un nombre de tienda). No se explica qué significa cada pestaña, qué cambia entre una y otra, ni qué es el signo "+" al lado. El usuario no entiende si puede crear pestañas por producto, por tienda o por proyecto, ni cuál es la diferencia entre el Hub principal y el de "ouiui".

### 5. La tab "Producto" y "Estrategia" dentro del detalle del Proyecto están vacías y el workaround es confuso

Dentro del proyecto "Collar GPS para mascotas", las tabs "Producto", "Estrategia", "Campañas" y "Pedidos" no muestran ningún dato propio del proyecto. En cambio, muestran un estado vacío que dice "Esta sección conecta con Catálogo/Roax/Mis Pedidos con vista filtrada para este proyecto" con un botón "Ir al módulo →". Desde la perspectiva del dropshipper, entrar a la tab "Producto" dentro de su proyecto y encontrar solo una pantalla vacía que lo lleva a otra parte es un quiebre de flujo grave. No entiende por qué tiene que salir de su proyecto para ver los datos de su propio producto.

### 6. El flujo "Nuevo Proyecto" es un paso 3 de 6 que no tiene forma de seleccionar un ángulo

En el paso 3 del flujo "Nuevo Proyecto" (Elegir estrategia de venta), se muestran tres ángulos (dolor, aspiracional, urgencia) pero ninguno tiene un botón de selección, radio button ni interacción visual que indique cuál está elegido. Solo hay un botón genérico "Continuar con este ángulo" al final, sin indicar cuál ángulo está activo. El usuario no sabe qué está eligiendo.

### 7. Los agentes "Roax", "Vigilante", "Chatea Pro", "ADA Spy" y "Kronos" no tienen un nombre unificado con Gali

La página de Agentes presenta estos cinco personajes como si fueran entidades independientes con nombres propios. Pero en el Hub, en Marketing y en Logística aparecen mezclados con el nombre "Gali". El usuario no entiende si Gali es una IA que incluye a todos estos agentes, si son herramientas separadas, o si son personas del equipo de Dropi. La relación entre "Gali" y los agentes nunca se explica en ninguna pantalla.

### 8. "Crear mi agente — Próximamente" genera expectativa rota

En la sección de Agentes, al final de la lista aparece una tarjeta de "Crear mi agente" con el texto "Próximamente — diseña tu propio flujo". Esta tarjeta tiene el mismo peso visual que los agentes activos. Para un usuario avanzado que quiere personalización, esto genera una expectativa inmediata que se frustra al instante. No hay CTA alternativo ni explicación de cuándo estará disponible.

### 9. El "Score de Salud 78/100" en el header no tiene escala visible ni acciones directas

El indicador "78 — Salud" es visible en todo momento, pero al hacer clic solo muestra un tooltip con 4 métricas. No hay ningún botón de "mejorar mi salud", no hay un histórico, no hay una pantalla dedicada. El usuario siente que hay un diagnóstico pero no hay un doctor que lo interprete. Peor aún, las métricas del tooltip (ROAS promedio, tasa de novedades, conversión, P&L) mezclan cosas muy distintas bajo un único número, sin que el usuario entienda cuánto pesa cada factor.

### 10. El panel flotante "Hablar con Gali" dentro del Hub muestra "Lanzar · Explorar · Decidir" como subtítulo pero no es navegable

En la sección inferior derecha del Hub hay un chat con Gali que tiene el subtítulo "Lanzar · Explorar · Decidir". Estos tres términos parecen ser modos o secciones, pero no son clicables. No se sabe si es solo una descripción de lo que Gali puede hacer o si deberían ser tabs. Además, el chat propone tres opciones pregeneradas, pero estas son iguales a las que aparecen en el botón superior "Lanzar", creando redundancia sin valor adicional.

### 11. "Mi Negocio" tiene un "Perfil completado 65%" pero no dice qué hace falta completar

El indicador de progreso aparece en la esquina superior derecha, pero no hay ningún checklist, tooltip ni CTA que le diga al usuario exactamente qué falta para llegar al 100%. El dropshipper no sabe si le falta conectar Siigo, subir un CSV, agregar Shopify o algo más. El progreso sin acción es decorativo.

### 12. La sección "Contexto externo" de Mi Negocio repite conexiones ya presentes en "Conexiones"

En Mi Negocio → Contexto externo aparecen opciones para conectar CSV, Google Drive, Shopify y Meta Ads. Exactamente las mismas opciones (Meta Ads, Shopify, Google Drive) ya aparecen en la sección "Conexiones" del menú lateral de Gali. El usuario no entiende si son la misma configuración, si se sincronizan, o si tiene que conectar las mismas plataformas en dos lugares distintos.

### 13. El tooltip del "Grafo de negocio" no desaparece correctamente

Al navegar a Mi Negocio → Grafo de negocio, aparece en la parte inferior de la pantalla un tooltip/toast que dice "Prototipo · Grafo de negocio" y permanece visible incluso después de la navegación. Este tipo de aviso de prototipo rompe la inmersión del usuario y genera confusión sobre si algo falló en la carga o si es una funcionalidad real.

### 14. En el Marketplace de Skills, "forks" y "activaciones" no están explicados

Las tarjetas del Marketplace muestran métricas como "39 forks", "4.5k activaciones", "11 comentarios". El término "fork" no es nativo del vocabulario de un dropshipper colombiano; es un concepto de GitHub/programación. Un usuario no entiende qué significa hacer un fork de una skill ni en qué se diferencia de "Activar".

### 15. "Akademy" y "Academy" se usan de forma inconsistente

En el menú principal izquierdo aparece como "Academy". En el Hub aparece "Ir a Akademy". En los cursos aparece la marca "Akademy" con k. Esta inconsistencia ortográfica hace que el usuario dude si son dos secciones distintas o la misma con un error tipográfico.

### 16. El botón "← Vista simple / ↺ Reconfigurar Gali" al pie del Hub no tiene contexto

Al final del scroll del Hub aparecen dos botones: "← Vista simple" y "↺ Reconfigurar Gali". No se sabe qué es la "vista simple" ni cómo se ve. "Reconfigurar Gali" es ambiguo: ¿resetea todo el sistema?, ¿cambia el objetivo?, ¿modifica los agentes activos? Para un dropshipper que teme perder su configuración, este botón genera ansiedad sin información.

### 17. Las tarjetas de "Decisiones pendientes" en el Hub tienen botones de acción sin contexto suficiente

La tarjeta "Coordinadora Bogotá: 15% novedad hoy" tiene dos botones: "Cambiar todos → Servientrega" y "Cambiar solo los de hoy". Pero no hay ningún detalle sobre cuántos pedidos se afectarían, cuánto costaría el cambio o si hay riesgo de pérdida. El usuario debe tomar una decisión con impacto operativo y financiero real con información incompleta.

---

## BLOQUE 2: Puntos Críticos en relación a la Propuesta de Valor de Gali

### 1. Gali no se diferencia como "la primera IA operativa" en ningún punto de la interfaz

La propuesta de valor dice que Gali es la primera IA que transforma data masiva en estrategias hiperpersonalizadas. Sin embargo, en ninguna pantalla hay un mensaje que explique por qué Gali es distinta a un dashboard tradicional. El usuario ve métricas, alertas y botones, pero no entiende qué hace Gali que él no podría hacer mirando un Excel. La "inteligencia" de Gali es invisible.

### 2. La "Hiperpersonalización Predictiva" (Gali como cerebro) no tiene una pantalla propia ni una narrativa visible

Gali dice predecir tendencias y cruzar data interna con patrones globales de Dropi. Pero en todo el prototipo no hay ninguna pantalla donde se muestre explícitamente "Esto es lo que Dropi ve a nivel global, esto es lo que tú tienes, y por eso te recomiendo esto". La predicción de tendencias aparece tangencialmente en el "ADA Spy recomienda" del nuevo proyecto, pero sin que el usuario comprenda que ese poder viene de cruzar datos masivos del ecosistema Dropi. Para el dropshipper que quiere saber qué producto va a ser tendencia mañana, la promesa no está cumplida visualmente.

### 3. La "Logística Autónoma" (Gali como músculo) existe pero su impacto económico real no se acumula en ningún lugar

El Smart Routing y Vigilante hacen cosas muy valiosas (redirigir pedidos, reducir novedades). Pero el ahorro generado por estas acciones no se muestra de manera acumulada en ningún dashboard financiero. En el Hub aparece "$85.000 ahorrados" en la tarjeta del proyecto, pero no hay un total consolidado de "Gali te ahorró X en el mes". El dropshipper que quiere justificar el valor de la herramienta a sí mismo o a su equipo no tiene ese número disponible.

### 4. La "Escalabilidad Sin Fricción" (Gali como director) no tiene un flujo que demuestre que escalar es realmente sin fricción

La propuesta dice que un negocio puede multiplicar sus órdenes por 10 sin multiplicar el equipo. Pero el flujo actual de escalado requiere: ir al Hub, leer una alerta, ir a la Torre Logística, aprobar el routing, volver al Hub, ir a Agentes, revisar las skills activas, volver al proyecto, revisar el P&L. Son al menos 5 pantallas distintas para entender el estado de escalamiento. No hay un flujo de "aprobación de escala en 1 clic" que materialice esa promesa.

### 5. La "democratización de la consultoría de alto nivel" no es percibida porque Gali habla en jerga técnica

Gali le dice al dropshipper cosas como "ROAS real 1.93x vs 2.9x declarado en Meta", "gap del 32%", "novedades Cali +10pts", "capa determinista". Para un dropshipper que no tiene formación financiera formal y que explícitamente reconoce no saber cómo interpretar sus datos contables, este lenguaje es una barrera. La consultoría de alto nivel prometida debe traducirse a decisiones en lenguaje de negocio simple: "Estás perdiendo $85.000 por semana por un problema en Bogotá. ¿Quieres que lo resuelva ahora?"

### 6. El pain point más crítico del usuario (inconsistencia de stock del proveedor) no tiene ninguna solución visible en Gali

El dropshipper dice textualmente que su mayor dolor es que el proveedor se quede sin stock sin previo aviso y le mate la campaña. En todo el prototipo no hay ninguna alerta de "ADA Spy detectó que tu proveedor tiene stock bajo", ningún semáforo de inventario del proveedor en el Hub, ninguna skill de "Pausar campaña si stock cae por debajo de X". El punto de dolor número uno del usuario no está resuelto en ninguna pantalla.

### 7. La facturación electrónica y el problema con la DIAN son invisibles en Gali

El dropshipper identifica la facturación como una de sus frustraciones más grandes. En Financiero → Facturación hay datos de wallet y transacciones, pero Gali no hace ninguna recomendación proactiva sobre facturación, no le explica cómo conectar Siigo con sus costos de proveedor, y no le muestra cuánto dinero tiene sin facturar. La conexión con Siigo aparece como una advertencia genérica ("Sin facturar — conectar Siigo") pero sin un flujo guiado que resuelva el problema real.

### 8. No hay diferenciación entre lo que Gali hace automáticamente y lo que requiere decisión del usuario

En el Hub, la sección "Decisiones pendientes" mezcla cosas que Vigilante ya hizo autónomamente con cosas que el usuario debe aprobar. No hay un bloque separado de "Esto ya lo hice por ti" vs "Esto necesito tu aprobación". El dropshipper que quiere delegar no sabe qué ya está resuelto y qué aún depende de él, lo que lo obliga a revisar todo el tiempo, contradiciendo la promesa de libertad operativa.

### 9. Los agentes no tienen un umbral de autonomía configurable desde una sola pantalla

La "Capa Determinista" aparece explicada al fondo de la página de Agentes como un bloque informativo. Pero un dropshipper avanzado que quiere configurar cuánta autonomía le da a Vigilante vs a Roax necesita hacerlo desde una pantalla central y clara. Actualmente, para cambiar los límites tiene que ir a "Configurar límites →" desde un texto al pie de la página que nadie llega a leer.

### 10. La sección "Akademy" no está conectada al estado real del negocio del usuario

Gali recomienda un curso sobre P&L real porque el ROAS del usuario tiene un gap. Esa conexión es muy poderosa. Sin embargo, los otros dos cursos de la sección "Para ti" (manejo de novedades y confirmaciones en WhatsApp) aparecen sin ninguna justificación de por qué se le recomiendan a este usuario en particular. La personalización educativa se rompe a los dos segundos de entrar a Akademy.

### 11. No hay ninguna métrica que muestre el ROI de tener Gali activo

La propuesta de valor de Gali es que actúa como un Director de Operaciones 24/7. Pero en ninguna pantalla hay un resumen del tipo "Este mes Gali ejecutó 127 acciones, ahorró $420.000 en novedades, escaló 2 campañas y detectó 3 productos en tendencia antes que la competencia." Sin ese número de valor percibido, el dropshipper no puede justificar emocionalmente ni racionalmente por qué Gali es indispensable para su negocio.Aquí está el análisis detallado del prototipo Gali v5 contrastado con la visión definida:

---

## 1. Oportunidades de mejora — lo que no se ve o no se cumple

**Estado Cero / Onboarding inexistente**
El prototipo asume desde el primer frame que el usuario ya tiene operación activa: 47 pedidos/semana, ROAS 2.9x, productos en escala. No hay ninguna pantalla, flujo ni estado que muestre qué le pasa a alguien que acaba de entrar a Dropi, no tiene pedidos, no tiene productos y necesita que Gali le enseñe por dónde empezar. La visión habla de "hiperpersonalización desde el inicio" pero el prototipo solo la resuelve para usuarios maduros.

**Ausencia total de "Señales" (enfoque predictivo)**
El botón "Señales" existe en la barra superior y en el Hub, pero no hay una sección o vista que muestre la distinción planteada entre Señales (predictivo/estratégico) y Alarmas (reactivo). Lo que hay son "Decisiones pendientes" que son puramente reactivas: una novedad de Coordinadora, una devolución de WhatsApp. No hay ningún ejemplo de lo que se definió como señal: "enero vs. junio", "tendencia de mercado que se abre en tu segmento", "oportunidad de escalar antes de que llegue la competencia". La mitad del valor diferencial de Gali — el carácter predictivo — no se prototipa.

**Gali como Director de E-commerce no se comunica**
El texto que describe a Gali en distintos módulos lo sigue tratando como asistente operativo. En Mi Negocio dice "El micromundo que Gali construye sobre ti". En Agentes dice que "ejecutan acciones de forma autónoma". Nunca aparece el lenguaje de "Director de E-commerce", ni una vista que le diga al usuario: "tu mayor palanca de crecimiento esta semana es X". El rol estratégico se diluye detrás de métricas y acciones.

**La propuesta de crecimiento x10 no existe visualmente**
La visión dice que el objetivo central es que "el negocio escale exponencialmente (x10) sin multiplicar el equipo". En ningún módulo hay una visualización de ruta de crecimiento, proyección de escenarios o comparativo de dónde estás vs. dónde podrías estar. El número más ambicioso que aparece es "Meta: 100 ventas/semana" en el Hub, pero como dato estático sin un camino narrativo hacia allá.

**Data de Dropi cruzada con el usuario: no se ve**
Uno de los diferenciales más fuertes definidos es cruzar la data global de Dropi (qué productos están tendiendo en Colombia, qué segmentos socioeconómicos tienen mayor conversión, qué transportadoras están fallando a nivel nacional) con la data específica del usuario. ADA Spy insinúa esto con los scores de productos, pero no hay ningún momento donde Gali diga explícitamente: "según los datos de toda la red Dropi esta semana, tu categoría está creciendo un 18% y tienes ventana de 14 días antes de que sature".

**Personalización estratégica vs. recomendación genérica**
La visión alerta que "dar la misma estrategia a todos daña el mercado". Sin embargo, las recomendaciones actuales de ADA Spy en Productos son tres cards prácticamente idénticas en formato (score, stock, margen), sin ningún contexto de por qué este producto es bueno para este usuario en particular y no para todos. No hay diferenciación por segmento, región, momento del año ni perfil del dropshipper.

---

## 2. Puntos que no conectan o son incoherentes

**Inconsistencia entre el concepto y los nombres de los módulos de orquestación**
El menú lateral tiene un bloque llamado "ORQUESTACIÓN" con Agentes, Skills, Reglas, Marketplace y Conexiones. Eso es lenguaje técnico-interno que expone la arquitectura al usuario. Si Gali es un "Director de E-commerce" que orquesta de fondo, el usuario no debería ver la tubería. Mostrar "Agentes", "Skills" y "Reglas" como ítems de menú de primer nivel contradice la idea de que la complejidad técnica queda invisible y el usuario solo ve resultados y decisiones.

**El Hub (página principal) es un dashboard con capas, no un orquestador**
El Gali Hub muestra un pipeline de módulos (Producto → Marketing → Pedidos → Logística → Finanzas → Reportes) que visualmente replica la estructura de un dashboard tradicional con bloques. La visión dice explícitamente que no debe ser "secciones aisladas" sino un flujo unificado. Sin embargo, cada bloque del Hub es una tarjeta independiente sin narrativa que las conecte. No hay una historia: "hoy tu negocio está aquí, esto está bloqueando tu crecimiento, esto es lo que Gali está haciendo al respecto".

**El tab de "ouiui" en el Hub es confuso y no explica su propósito**
En el Hub aparece un tab "ouiui" junto a "Principal" sin ninguna introducción de qué es un proyecto, por qué existe ese tab o cómo se relaciona con el sistema de Proyectos. Un usuario nuevo no tiene idea de qué significa. El concepto de Proyectos como unidad central de trabajo (un producto = un proyecto) no se refuerza desde el Hub.

**"Hablar con Gali" y el input de intent superior hacen lo mismo**
Hay dos puntos de entrada al chat/intención de Gali que coexisten en la misma pantalla del Hub: la barra superior de texto ("¿Qué quieres hacer?") y el panel lateral derecho "Hablar con Gali" con su propio campo de texto. Esto genera confusión sobre cuál usar, duplica la interfaz y rompe la coherencia de que Gali es un solo ente.

**Los botones Señales / Lanzar / Medir en el header no tienen jerarquía clara**
Estos tres modos están en el header como botones del mismo tamaño, pero visualmente compiten con la barra de búsqueda/intent. No queda claro si son estados de Gali, modos de la plataforma o accesos directos a secciones. Además, su relación con el concepto Señales (predictivo) vs. Alarmas (reactivo) no se explica en ningún lugar.

**El módulo Financiero es el más desconectado de Gali**
La página de Historial de Wallet es la sección más "tradicional" del prototipo: tabla de transacciones, filtros por fecha, exportar. Gali aparece solo en el banner superior con una frase genérica sobre Siigo. No hay integración de inteligencia real en esta sección. La visión habla de Kronos como agente de Finanzas & P&L, pero en la sección financiera Kronos casi no aparece y el módulo se siente como una sección del Dropi viejo sin transformar.

**ADA Spy en Productos insinúa "buscar" más que "recomendar estratégicamente"**
La sección de Catálogo tiene una barra de búsqueda prominente con el texto "Buscar con ADA Spy — Describe lo que quieres vender". Esto es esencialmente la búsqueda semántica que la visión descartó por no generar impacto. Aunque el framing cambia (ADA "analiza precio, competencia y tendencias"), la interacción sigue siendo reactiva: el usuario describe lo que quiere y ADA responde. El modelo debería ser al revés: ADA proactivamente trae las oportunidades sin que el usuario pregunte.

**El "Score de salud 78" en el header no tiene explicación ni accionabilidad**
Aparece en todas las páginas un indicador "78 SALUD" pero nunca hay en el prototipo una pantalla que explique qué compone ese score, cómo mejorarlo o qué implica para la estrategia. Es un número huérfano sin narrativa.

**Reglas y Skills son conceptos que se solapan sin diferenciación clara para el usuario**
En la página de Reglas se explica la diferencia ("Regla: Si pasa X → haz Y. Skill: Receta auditable con trigger, condición, acción, historial") pero la distinción es técnica y sutil. Para un usuario no técnico, ambas hacen "automatizaciones" y la separación genera confusión más que claridad. La visión de "skills configurables" como capa de gestión de agentes no queda clara operativamente.

---

## 3. Acciones concretas para cerrar las brechas

**Diseñar el Estado Cero con onboarding inteligente**
Crear un flujo de primera sesión donde Gali, en lugar de mostrar dashboards vacíos, haga las 3 preguntas clave que la visión define (objetivo de 30 días, mayor fricción actual, canal prioritario) y construya en tiempo real el primer plan de acción. Usar la data global de Dropi para contextualizar: "en junio, los dropshippers nuevos que empiezan con productos de bienestar en Bogotá tienen un 34% más de conversión inicial".

**Construir la vista de "Señales" como panel estratégico diferenciado**
Separar visualmente y conceptualmente Señales (oportunidades predictivas, ventanas de mercado, tendencias próximas) de Alertas (problemas operativos que requieren acción inmediata). La pantalla de Señales debería tener el lenguaje de un briefing estratégico: "Esta semana hay 3 señales de crecimiento y 2 alertas operativas. Las señales de crecimiento tienen ventana de acción de 7-14 días."

**Reformular el Hub como narrativa de negocio, no como pipeline de módulos**
Reemplazar los bloques de Producto → Marketing → etc. por una pantalla que responda: ¿dónde estás?, ¿qué está pasando hoy?, ¿cuál es tu mayor palanca de crecimiento ahora mismo?. Los módulos operativos pasan a ser accesos secundarios. La historia de Gali como Director de E-commerce empieza aquí.

**Ocultar la arquitectura técnica del menú principal**
Los ítems Agentes, Skills, Reglas, Marketplace y Conexiones deben salir del menú de primer nivel que ve el usuario cotidiano. Pueden existir en un panel de configuración avanzada o "Centro de control de Gali" para usuarios que quieran personalizar, pero no deben competir visualmente con Productos, Pedidos o Marketing.

**Unificar los dos puntos de entrada al chat de Gali**
Eliminar la redundancia entre la barra de intent superior y el panel "Hablar con Gali". Un solo punto de entrada contextual y persistente (probablemente el botón flotante naranja ya existente o la barra superior) que cambia su comportamiento según la sección donde esté el usuario.

**Agregar proyección y ruta de crecimiento al Hub**
Incluir un módulo visible en el Hub que muestre: dónde está el negocio hoy, dónde estaría si se aplican las recomendaciones de Gali esta semana, y qué falta para llegar al objetivo declarado. Esto materializa el concepto x10 y convierte a Gali en estratega, no en reportero de KPIs.

**Transformar ADA Spy de buscador a prospector proactivo**
La experiencia debería empezar con ADA trayendo 3-5 oportunidades rankeadas por potencial, contextualizadas para ese usuario específico ("para tu perfil en Cali, con $66k/día de pauta, estas categorías tienen el mayor margen neto ajustado esta semana"). El buscador puede existir como opción secundaria, pero no como la interacción principal.

**Integrar Kronos activamente en la sección Financiero**
Transformar el Historial de Wallet en una vista que Kronos narre: "esta semana generaste $X, tu costo operativo real fue Y (incluyendo novedades), tu margen neto real fue Z. Aquí están las 2 fugas de dinero que Kronos detectó y lo que puedes hacer." La tabla de transacciones pasa a ser un detalle colapsable, no la pantalla principal.

**Contextualizar el Score de Salud con una capa explicativa**
Al hacer clic en el "78 SALUD" debe abrirse un panel que explique los componentes (logística, conversión, márgenes, retención de clientes) y una recomendación priorizada de Gali para subirlo. Esto conecta el número con acción y estrategia.

**Añadir diferenciación de estrategia por segmento en recomendaciones**
En las recomendaciones de productos, skills sugeridos y campañas, agregar una etiqueta o explicación de por qué esa recomendación es específica para este usuario y no para todos. Ejemplo: "ADA recomienda este producto para ti porque tu audiencia en Cali tiene alta afinidad con mascotas y tu pauta histórica tiene CTR mayor en esta categoría." Esto operacionaliza la personalización estratégica y previene que todos los usuarios vean lo mismo.


Análisis Heurístico de Gali — Dropi AI-First Orchestrator (v5)

Evaluación General
El prototipo de Gali representa una propuesta de valor ambiciosa y bien concebida: un orquestador AI-first que centraliza la operación de dropshipping en una sola superficie. La arquitectura de información es conceptualmente sólida y el lenguaje conversacional de los agentes está muy bien trabajado. Sin embargo, se identifican tensiones críticas entre la densidad informacional del sistema y los principios de diseño minimalista, así como problemas de consistencia estructural entre módulos y una carga cognitiva excesiva en vistas clave que pueden frenar la adopción del producto por usuarios en etapa de aprendizaje.

Informe Detallado por Heurística

1. Visibilidad del Estado del Sistema
Puntuación: ✅ (con matices ⚠️)
Observación: El sistema hace un trabajo excelente en comunicar el estado activo de los agentes: la barra superior siempre muestra qué agente está en operación ("Gali · orquestando tu negocio", "Vigilante · monitoreando pedidos", "Roax · 3 campañas activas"), el indicador de salud "78 — SALUD" está siempre visible, y el contador de señales pendientes ("3 señales") es persistente en el header. Los módulos dentro del Gali Hub muestran el estado en tiempo real por área (ROAS, pedidos activos, routing activo). Sin embargo, hay un punto ciego: las tarjetas de ciclo de negocio en el Hub presentan dos celdas completamente vacías en la fila superior (entre PRODUCTO y PEDIDOS), sin placeholder, mensaje de carga ni indicación alguna de qué debería estar ahí. El usuario no sabe si es un error, contenido que aún no cargó, o un espacio intencionalmente vacío.
Recomendación Accionable: Añadir un estado visual explícito a las celdas vacías del diagrama de ciclo de negocio: ya sea un skeleton loader, un texto "Sin datos aún", o una etiqueta que indique qué módulo o conexión se necesita para poblar ese espacio. Nunca dejar espacios en blanco sin contexto en un dashboard de misión crítica.

2. Coincidencia entre el Sistema y el Mundo Real
Puntuación: ✅
Observación: Este es uno de los puntos más fuertes del prototipo. El uso de lenguaje colombiano cotidiano en las Reglas ("el pedido va pa' municipio", "el cliente dejó el carrito tirado", "Parce, para despachar a Leticia necesitamos un anticipo") es brillante y genera alta identificación con el usuario objetivo. Los nombres de agentes (Vigilante, Roax, Chatea Pro, ADA Spy, Kronos) tienen personalidad y están alineados a las metáforas de sus funciones. El uso del término "huella verde/alto riesgo" en Pedidos, "novedad" para incidencias logísticas y "escalar" para crecer son conceptos ya internalizados por el ecosistema dropshipping. La sección de Reglas logra que conceptos técnicos de automatización se lean como lógica de negocio natural.
Recomendación Accionable: Mantener este registro. Un ajuste menor: el término "Micromundo" para "Mi Negocio" puede resultar críptico para usuarios nuevos que llegan por primera vez. Considerar mostrar el nombre descriptivo primero y el concepto de marca como subtítulo, o añadir un tooltip de onboarding que explique el concepto al primer acceso.

3. Control y Libertad del Usuario
Puntuación: ⚠️
Observación: Se detectan varios puntos de fricción aquí. En la pantalla de Decisiones Pendientes, los botones de acción directa ("Cambiar todos → Servientrega", "Cambiar solo los de hoy") ejecutan acciones masivas sin ningún paso de confirmación visible en el prototipo. Una acción de ese tipo —redirigir 12 pedidos activos de transportadora— es de alto impacto y difícilmente reversible. De igual manera, en Agentes, el botón "Pausar todo hasta revisar" en la tarjeta de Roax luce peligrosamente cercano a "Escalar campaña activa" y no muestra advertencia de consecuencias. En el Gali Hub, los botones "← Vista simple" y "↺ Reconfigurar Gali" aparecen al final del scroll sin jerarquía clara, y "Reconfigurar" podría implicar pérdida de personalización sin que el usuario lo sepa.
Recomendación Accionable: Implementar un patrón de confirmación de dos pasos para acciones masivas e irreversibles ("¿Confirmas mover 12 pedidos a Servientrega? Esta acción no se puede deshacer"). Para "Reconfigurar Gali", añadir un modal de advertencia que liste qué configuraciones se resetearán. Los botones destructivos o de alto impacto deben diferenciarse visualmente (bordes rojos/naranjas de advertencia) de las acciones primarias positivas.

4. Consistencia y Estándares
Puntuación: ⚠️
Observación: Existen inconsistencias estructurales notables entre módulos. El sidebar izquierdo tiene DOS sistemas de navegación superpuestos: una barra de iconos global (Productos, Pedidos, Logística, Reportes, Financiero, Marketing, CAS, Academy, Config) y un panel contextual que muestra los ítems de Gali (Hub, Proyectos, Mi Negocio, Agentes, Skills, Reglas, Marketplace, Conexiones). Cuando el usuario navega a Logística o Marketing, el panel contextual desaparece y aparece la navegación del módulo tradicional, pero el sistema de iconos permanece. Esto genera confusión sobre dónde está el usuario dentro de la arquitectura global. Adicionalmente, el término "Akademy" (con k) en la sección de Academy crea disonancia con el resto de la interfaz donde se usa "Academy" de forma estándar.
Recomendación Accionable: Definir un sistema de navegación unificado. Una solución viable sería adoptar un modelo de "hub y radios" claro: la columna de iconos como macro-navegación global siempre presente, y el panel contextual como micro-navegación del módulo activo, con transiciones visuales que refuercen la jerarquía. Unificar la ortografía entre "Academy" y "Akademy" en todo el sistema.

5. Prevención de Errores
Puntuación: ⚠️
Observación: El prototipo muestra señales positivas en este principio: ADA Spy asigna scores de riesgo (87, 74, 61) a productos para orientar decisiones de lanzamiento, Vigilante alerta con porcentajes de novedad antes de que el usuario tome decisiones de routing, y Chatea Pro escala solo los casos que necesitan criterio humano. Sin embargo, en el módulo de Skills, la acción "Pausar skill" está ubicada junto a "Editar pipeline →" sin distinción jerárquica suficiente, lo que podría provocar pausas accidentales de automatizaciones en producción. En el módulo de Conexiones, las plataformas desconectadas (Siigo con estado urgente) no muestran una advertencia proactiva sobre el impacto operacional de mantenerlas desconectadas más allá del badge de color.
Recomendación Accionable: En Skills, separar visualmente las acciones de "editar" (neutras) de las acciones de "detener" (destructivas): distintos colores, separación espacial o incluso un menú de opciones secundario (kebab menu) para las acciones de alto impacto. En Conexiones, añadir un card de impacto estimado bajo las conexiones con problemas: "Siigo desconectado → $450k sin facturar · Afecta P&L real".

6. Reconocimiento en Lugar de Recuerdo
Puntuación: ✅
Observación: El sistema hace un trabajo ejemplar en este principio. Las tarjetas de los módulos en el Hub muestran el dato más relevante sin requerir navegación: ROAS actual, pedidos activos, estado de routing, ganancia pendiente. El historial de ejecuciones en Skills muestra fecha, estado, detalle e impacto en una sola tabla. Los botones de acción sugerida en "Decisiones pendientes" presentan opciones pre-analizadas por el agente, eliminando la necesidad de que el usuario recuerde cómo operar cada módulo. La sección "Hablar con Gali" ofrece accesos directos contextuales ("Tengo un producto en mente →", "Sugerencias de ADA Spy →") que funcionan como memoria externalizada. El Mapa de Conexiones muestra el estado de cada integración de forma visual sin requerir que el usuario recuerde el estado de cada una.
Recomendación Accionable: Extender este patrón al módulo Financiero, donde la tabla de historial de wallet actualmente muestra descripciones en mayúsculas tipo sistema ("ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER: 33885") que requieren interpretación. Traducir esas descripciones al lenguaje humano usado en el resto de la plataforma.

7. Flexibilidad y Eficiencia de Uso
Puntuación: ✅ (con oportunidad de mejora)
Observación: La barra de intent de Gali ("¿Qué quieres hacer?") en la parte superior es el acelerador más poderoso del sistema: permite a usuarios expertos saltarse toda la navegación jerárquica y llegar directamente a cualquier función mediante lenguaje natural. Los accesos rápidos flotantes (huella logística, torre, panel Gali) son atajos para tareas frecuentes. Los modos "Señales / Lanzar / Medir" junto a la barra de intent sugieren flujos diferenciados por intención. Sin embargo, los botones de acceso rápido flotantes en la esquina inferior derecha (huella, torre, panel Gali) tienen íconos poco descriptivos sin etiquetas visibles, lo que los hace poco descubribles para usuarios nuevos. El FAB naranja con el "+" tampoco comunica qué tipo de acción desencadena.
Recomendación Accionable: Añadir tooltips permanentes o etiquetas de texto cortas a los botones flotantes cuando el usuario hace hover por primera vez (o en modo new user). El FAB naranja debería tener un label visible o un mini-menú que emerja al hacer clic, listando las acciones rápidas disponibles (Nuevo pedido, Nuevo proyecto, Nueva skill, etc.).

8. Diseño Estético y Minimalista
Puntuación: ⚠️
Observación: Este es el punto de mayor tensión en el prototipo. El Gali Hub acumula en un solo viewport: una barra de intent global, tabs de dashboard, un banner de objetivo, un banner de alerta de agente con CTA, el diagrama de ciclo de negocio con 6 tarjetas de módulos, la sección de "Decisiones pendientes" con cards de acción, el chat de Gali con sugerencias contextuales, y el módulo de Akademy recomendado. Son 7 bloques de información compitiendo simultáneamente por la atención del usuario. La pantalla de Marketing agrega otro nivel: un stepper de flujo de campaña completo + tarjeta de estado de Roax + CTA de escala + diagnóstico de campaña pausada con 3 factores + cards explicativos. La pantalla de Dashboard de Reportes tiene un panel de ventas gamificado + alerta de gap detectado + grid de órdenes + tendencia de ventas, todo visible sin scroll. La alta densidad es coherente con un sistema de poder, pero entra en conflicto con el principio de minimalismo para usuarios en curva de aprendizaje.
Recomendación Accionable: Implementar un sistema de "niveles de UI" explícito ya sugerido por los botones "← Vista simple" y "↺ Reconfigurar Gali" que ya existen, pero elevarlo a un patrón consistente en toda la plataforma. La vista simple debería ser el estado por defecto para usuarios nuevos, y la vista completa/experto se activa progresivamente. También considerar colapsar por defecto el banner de alerta del agente si el usuario ya lo vio, mostrando solo un indicador mínimo.

9. Ayudar a los Usuarios a Reconocer, Diagnosticar y Recuperarse de los Errores
Puntuación: ⚠️
Observación: Los estados de advertencia están bien manejados en contextos de agente (Vigilante muestra "15% novedad" con color ámbar, el dashboard alerta el gap de ganancia real vs. Meta). Sin embargo, los estados de error en integraciones son ambiguos: en el Mapa de Conexiones, Siigo aparece con un badge "URGENTE" en color naranja/rojo, pero no hay un mensaje claro que explique qué consecuencia operativa tiene esa urgencia ni cuáles son los pasos para resolverla. En el módulo Financiero, el banner de "Historial de wallet" informa "Los pedidos Sin Recaudo no generan movimiento de entrada en tu wallet hasta que sean entregados y confirmados por la transportadora", pero este mensaje de información crítica está en un banner azul de baja prominencia que puede ignorarse fácilmente. En la pantalla de Información de Cuenta, el estado "Validación Pendiente" no explica qué sucederá si no se completa ni cuánto tiempo tiene el usuario.
Recomendación Accionable: Adoptar un patrón consistente de "error card" que incluya siempre tres componentes: (1) qué pasó en lenguaje humano, (2) cuál es el impacto en operación, (3) el paso específico para resolverlo con CTA directo. Ejemplo en Conexiones: "Siigo desconectado · $450k sin facturar esta semana · [Conectar Siigo ahora →]".

10. Ayuda y Documentación
Puntuación: ✅ (contextual) / ⚠️ (sistema)
Observación: La ayuda contextual en este sistema es excepcional: cada módulo tiene un agente que explica en tiempo real qué está haciendo y por qué, la sección de Reglas incluye ejemplos en lenguaje natural con previews de mensajes reales, y Akademy ofrece cursos recomendados directamente vinculados al problema de negocio actual del usuario (ROAS real vs. declarado). La página de Agentes incluye un panel educativo que explica la diferencia entre Agente, Skill y Regla, lo cual es crítico para la conceptualización del sistema. Sin embargo, no existe un punto de acceso unificado a documentación, FAQs o soporte: cuando el usuario encuentra el mensaje "Escríbenos a soporte" en la pantalla de Configuración, es un link de texto discreto dentro de un banner de advertencia. Los botones flotantes no incluyen ninguno orientado a "ayuda".
Recomendación Accionable: Añadir un acceso consistente a ayuda en el sistema de navegación global (un ícono "?" en la barra de iconos izquierda, o en el header junto al perfil). Este acceso debería abrir un panel contextual que muestre: documentación del módulo activo, tutoriales del agente activo, y acceso a soporte humano. El sistema ya tiene toda la infraestructura conversacional para hacer esto nativo en Gali.

Recomendaciones Prioritarias (Plan de Acción)

🔴 Arreglo Crítico — Acciones masivas sin confirmación ni reversibilidad visible En las pantallas de "Decisiones Pendientes" (Gali Hub) y "Torre Logística", los botones de acción directa como "Cambiar todos → Servientrega" ejecutan operaciones masivas sobre pedidos activos sin un paso de confirmación, advertencia de impacto ni indicación de si la acción es reversible. En un negocio donde mover 12 pedidos de transportadora en tiempo real tiene consecuencias financieras directas, un click accidental es crítico. Solución: implementar un modal de confirmación de dos pasos para todas las acciones que afecten más de 1 entidad o que sean irreversibles, mostrando explícitamente el alcance de la acción (número de pedidos afectados, estimado de impacto, opción de deshacer si aplica). Esto aplica la heurística #3 y #5.

🟠 Mejora Importante — Sobrecarga cognitiva en el Gali Hub: jerarquía de información insuficiente El dashboard principal concentra 7 bloques de contenido de alta densidad compitiendo simultáneamente, sin una jerarquía visual clara que guíe al usuario sobre qué atender primero. Si bien el sistema tiene los conceptos de "Vista simple" y "Reconfigurar Gali", estos aparecen al final del scroll como botones secundarios, cuando deberían ser el punto de partida del onboarding. Solución: establecer por defecto la vista simple para usuarios con menos de 30 días en la plataforma (dato que Gali ya infiere según "Mi Negocio"), con un acceso prominente a "Activar vista experto". Adicionalmente, definir un sistema de jerarquía visual que ordene el Hub en tres zonas claramente diferenciadas: zona de alertas críticas (decisiones pendientes + señales de agentes), zona de estado del negocio (ciclo de negocio), y zona de herramientas (chat de Gali + Akademy). Esto aplica las heurísticas #8 y #7.

🟡 Ajuste Sugerido — Inconsistencia en los estados de error de integraciones y wallet Los mensajes de error y advertencia en módulos como Conexiones (Siigo urgente), Financiero (wallet sin movimiento) e Información de Cuenta (validación pendiente) no siguen un patrón consistente de diagnóstico y recuperación. Cada módulo resuelve esto de forma diferente: badges, banners azules, textos en gris. Solución: definir un sistema unificado de "error cards" con estructura fija: ícono de severidad + título del problema en lenguaje humano + impacto operacional cuantificado + CTA de resolución con enlace directo. Este patrón ya existe embrionariamente en la Torre Logística y en el Dashboard de Reportes; solo se necesita extenderlo con consistencia al resto de la plataforma. Esto aplica las heurísticas #9 y #4.

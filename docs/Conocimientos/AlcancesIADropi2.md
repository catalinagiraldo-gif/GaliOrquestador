Los dropshippers en Dropi se enfrentan a múltiples fricciones operativas que limitan su capacidad de escalar. A partir del análisis del ecosistema y de la visión del orquestador "Gali", a continuación se detallan sus necesidades, los procesos automatizables frente a los humanos, la evolución de la arquitectura y el alcance de la Inteligencia Artificial.

### 1. Problemas y Necesidades de los Dropshippers (Por Secciones)

**A. Sección de Productos y Catálogo**
*   **Problema:** Los dropshippers se frustran por la falta de inventario real (stock-outs) no avisados, la mala categorización de productos por parte de los proveedores, y un buscador que ha sido demasiado literal.
*   **Necesidad / Intervención IA:** Necesitan un buscador semántico que entienda el lenguaje natural (ej. "colágeno para vender en Bogotá a 50.000") y que identifique tendencias o problemas a resolver en el mercado, sugiriendo productos ganadores proactivamente. 

**B. Sección de Marketing y Creativos**
*   **Problema:** Crear creativos desde cero consume mucho tiempo, sufren baneos constantes en plataformas como TikTok, y a menudo existe una desconexión crítica entre el ángulo de venta del anuncio y la *landing page*. Cuando un producto no se vende, se confunden con las métricas y no saben por qué falló.
*   **Necesidad / Intervención IA:** Requieren asistencia para estructurar guiones (Hook, Problema, Solución, CTA), generar páginas de venta coherentes con el anuncio y recibir diagnósticos de IA que expliquen el fracaso de una campaña (ej. falló el "gancho" o el producto ya está saturado).

**C. Sección de Órdenes, Logística y Novedades**
*   **Problema:** Sufren pérdidas económicas por devoluciones injustificadas, "falso telemercadeo" (transportadoras que dicen haber llamado al cliente pero no lo hicieron), y demoras en la actualización de los estados de las guías en Dropi. 
*   **Necesidad / Intervención IA:** Necesitan alertas tempranas cuando una guía se estanca, automatización en la validación de direcciones y filtros automáticos de riesgo basados en el historial del cliente (la "huella digital") para cobrar anticipos.

**D. Sección de Finanzas y Facturación**
*   **Problema:** El cálculo de la utilidad real es tedioso porque requiere cruzar datos de Dropi (fletes, recados) con gastos en Meta/TikTok. La facturación electrónica obligatoria para el dropshipper es un proceso manual y confuso.
*   **Necesidad / Intervención IA:** Integración automatizada con software contable (como Siigo) que sincronice las órdenes entregadas y genere facturas sin intervención manual.

---

### 2. Matriz de Procesos: Automatización (IA) vs. Intervención Humana

| Proceso en la Cadena de Valor | Automatización actual y futura (IA / Gali) | Acción que requiere Intervención Humana |
| :--- | :--- | :--- |
| **Búsqueda e Investigación** | Análisis de tendencias de mercado (*ADA Spy*), sugerencia de nichos rentables y alertas de stock-out. | **El "ojo" clínico**. Decidir en qué nicho entrar, evaluar el potencial estético del producto y definir la audiencia a fidelizar. |
| **Creación de Embudos** | Generación de *copies*, guiones y creación de *Landing Pages* (*Page Builder*) alineadas al ángulo de venta. | **Aprobación y diseño final**. El humano debe dirigir la estrategia, darle el toque estético y definir el "Avatar" (perfil del cliente). |
| **Gestión de Riesgo y Órdenes** | Evaluación de la "huella digital" del cliente para bloquear automáticamente pedidos de alto riesgo o exigir cobros anticipados mediante llamadas de IA. | **Manejo de excepciones**. Autorizar envíos a zonas rurales complejas o negociar directamente con el cliente cuando la IA no logre cerrar el acuerdo. |
| **Logística y Novedades** | Lectura de motivos de transportadora (ej. bloquear opción de "volver a ofrecer" si el cliente falleció) y envío de WhatsApps automatizados (*Chatea Pro*). | **Investigación de anomalías**. Detectar el "falso telemercadeo" de la transportadora y realizar llamadas humanas para salvar la venta. |
| **Finanzas y Facturación** | Sincronización de pedidos entregados con Siigo, emisión de facturas y cálculo del ROAS/CPA en tiempo real (*Roax*). | **Planeación financiera**. Análisis final del flujo de caja, toma de decisiones de inversión y gestión de impuestos/LLC. |

---

### 3. Evaluación de Intervenciones IA por Secciones de la Arquitectura

**Mejoras en Secciones Actuales:**
*   **Catálogo / Productos:** El buscador semántico actual debe evolucionar para no solo ampliar resultados (ej. buscar sinónimos), sino para cruzar datos reales y entregar valor. Debe poder filtrar por "tendencias", comparar precios de proveedores lado a lado y avisar qué productos están escalando.
*   **Mis Pedidos / Órdenes:** Integrar sugerencias de *Smart Routing* (selección de la mejor transportadora para una ciudad específica) y automatizar el rellenado de direcciones exactas cuando el cliente solo indica "Oficina Principal".
*   **Configuraciones (Facturación):** Mejorar la experiencia de usuario (UX) para la integración con Siigo. Se debe permitir la facturación masiva y automática con reglas claras (ej. "solo facturar órdenes en estado Entregado"), solucionando el dolor contable de los dropshippers.

**Nueva Sección Necesaria: "Gali Hub" o "Workspace de Proyectos"**
Actualmente, el usuario salta caóticamente entre Productos, Marketing, Órdenes y herramientas externas. 
*   **Intervención:** Se debe crear una sección de **"Proyectos"**. Aquí, el dropshipper inicia una campaña (ej. "Lanzamiento Reloj Inteligente") en un solo panel.
*   **Funcionamiento:** En esta vista, el usuario conecta la búsqueda del producto, el ensamblaje de la *landing page*, asigna el presupuesto en pauta y monitorea las ventas y el CPA del proyecto, todo orquestado por Gali sin tener que navegar por múltiples menús aislados.

---

### 4. Alcance de la Operación de los Agentes en el Orquestador (Gali)

Gali no debe ser concebido simplemente como un chatbot lateral, sino como el **"Cerebro" u Orquestador** que se fusiona con la plataforma. Su alcance operativo se define por la gestión de múltiples agentes (MCPs) y habilidades:

*   **Integración de MCPs Especializados:** Gali dirige a herramientas específicas. Utiliza a **Roax** como el agente conectado a Meta Ads para lanzar y pausar campañas; a **Chatea Pro** como el agente conectado a WhatsApp para confirmaciones y recuperación de carritos; y a **Dropify/Page Builder** para la creación de tiendas.
*   **Sistema de *Skills* (Habilidades) y *Rules* (Reglas):** Para evitar que todos los dropshippers vendan de la misma manera y saturen el mercado, Gali funcionará bajo *Skills* hiperpersonalizadas. El usuario puede configurar reglas exactas, como "pausar campañas nocturnas a las 11 PM" o "siempre escalar presupuesto un 20% si el CPA es bajo".
*   **Marketplace de Agentes:** A futuro, el alcance de Gali permitirá que dropshippers experimentados y mentores creen sus propios flujos o "plantillas de agentes" y los compartan o vendan en un *Marketplace* interno de *skills*, democratizando las estrategias de éxito.
*   **Soporte a la Decisión:** El mayor alcance de Gali será interpretar la data. Si una campaña fracasa, Gali analizará si el problema fue el anuncio, la página web o el producto, brindando asesoría estratégica para escalar o apagar campañas, supliendo la falta de conocimiento analítico del usuario principiante.


El punto central para las próximas iteraciones es definir la verdadera propuesta de valor que Dropi entregará con la IA, yendo más allá de la automatización o funcionalidades simples para lograr un crecimiento de 10x o 20x.1
Definir el valor real: Determinar si la propuesta de valor está en el insight (posiblemente un chat) o en articular el insight con herramientas de ejecución (convirtiéndose en un orquestador).1
Enfoque de hiperpersonalización: La propuesta de valor debe centrarse en tomar la data y los objetivos del usuario, cruzarlos con la data de Dropi, para entregar una estrategia de crecimiento e insights hiperpersonalizados que permitan al usuario escalar sin dañar el mercado.1
Acción Inmediata: Realizar un focus group con el equipo de producto para idear y definir cuál es el valor que Dropi puede entregar a los usuarios con la IA.1
2. Arquitectura de Gali y Agentes

La iteración de la arquitectura debe enfocarse en la unificación y la integración de las herramientas.1
Definición de MCPs (Multi-Channel Processors): Formalizar los sistemas externos como MCPs:
ROAS debe ser el MCP que conecta con Meta (para traer información y crear campañas).1
ChatEA Pro debe ser el MCP que conecta con WhatsApp (para crear skills de WhatsApp).1
Crear Dropify como el MCP que conecta con las landing pages.1
Integración vs. Interfaz Propia: Asegurar que los agentes y las herramientas externas se sientan fusionadas con la plataforma y no como secciones aisladas. La idea es integrar herramientas externas (como las de Ad Spy de TikTok o Meta) para que los agentes optimicen procesos y provean una experiencia hiperpersonalizada dentro de la plataforma.1
Centralización: Se tomó la decisión estratégica de centralizar todas las herramientas de IA en Cloud para unificar la memoria del proyecto y lograr mayor coherencia.2
3. Iteraciones Específicas de Proyectos
Proyecto	Puntos Críticos y Bloqueos	Próximos Pasos / Iteraciones
Búsqueda Semántica (PRM-970/1235)	Baja adopción y coherencia de resultados. La arquitectura actual de IA no soporta múltiples países.3	Criterio de Liberación: Lograr un 90% de coherencia en los resultados (mínimo aceptado: 85%) antes del lanzamiento. Arquitectura: Continuar con el proyecto interno de migración de arquitectura de IA, estimado en ~2 meses.38
Caza Productos (PRM-1230/1232)	El funnel está roto (67% de pérdida antes de publicar), crisis de proveedores, y un bug recurrente de creación/publicación de oferta. Los usuarios temen la exposición de productos a competidores.456	Flujo: Optimizar el flujo para permitir a los usuarios compartir métricas de rendimiento de forma anónima (sin revelar el producto o imagen inicial). Estructura: Implementar un sistema de categorías en la plataforma para mejorar la segmentación de solicitudes. Medición: Implementar el evento "Acuerdo cerrado exitoso" para medir la conversión real.649
Page Pilot (Creador de Páginas) (PRM-1238)	Bloqueos simultáneos técnicos, contractuales y administrativos. La producción está postergada al 9 de junio.7	Contractual: Presentar la contrapropuesta de contrato simplificado (sin cláusula de no competencia) a Page Pilot. Financiero/Técnico: Ajustar la arquitectura para recibir múltiples cuentas de Page Pilot (una por país). Producto: Incorporar la narrativa en un modal que comunique que la página exportada es solo una estructura base.107
4. Proceso y Calidad (General)
Filosofía Cero Errores: Se debe procurar salir a producción minimizando al máximo los casos que puedan generar fricción al usuario.811
Handoff Formal: Se acordó que todo proyecto, sin importar su tamaño, debe tener un Handoff con reunión virtual con todas las personas involucradas para evitar malentendidos, entregas parciales y riesgos recurrentes sobre el alcance.45
Medición Post-lanzamiento: Cumplir con la etapa de Monitoring & Optimization (Monitoreo y Optimización), que incluye:12
Reportar resultados, documentar aprendizajes e integrar los ajustes a futuras iniciativas.12
Definir el criterio de éxito y los eventos a trackear para las métricas de comportamiento antes del lanzamiento.
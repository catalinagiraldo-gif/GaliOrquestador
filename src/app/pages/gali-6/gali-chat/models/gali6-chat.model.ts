export type ChatRole = 'gali' | 'usuario';

export type VisualResponseKind = 'metric' | 'comparativa' | 'tabla' | 'acciones';

export interface VisualMetric {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface VisualComparativaItem {
  label: string;
  valuePct: number; // 0-100, altura relativa de la barra
  highlight?: boolean;
}

export interface VisualTabla {
  columns: string[];
  rows: string[][];
}

export interface VisualAccion {
  label: string;
  actionId: string;
  isPrimary?: boolean;
  /** Flujo J extendido (18.FlujoUsuarioGali6.md §5.3) — el click abre un selector de pantalla destino antes de resolver `${actionId}::${screenId}`. */
  requiereDestino?: boolean;
}

/**
 * Catálogo cerrado de respuestas visuales del chat — deliberadamente simple
 * (4 tipos) en vez de un sistema de widgets genérico: es un prototipo mock,
 * no hay LLM real generando UI en runtime. Ver §4 del plan.
 *
 * Nota sobre gráficos: 'comparativa' se renderiza 100% en CSS (barras),
 * sin librería de charts — el ancho del panel (320-420px) y la naturaleza
 * mock del prototipo no justifican chart.js/ngx-charts/d3. Si en el futuro
 * se necesitan series temporales con muchos puntos o interactividad real
 * (tooltip por punto), ahí sí conviene evaluar una librería ligera.
 */
export interface VisualResponse {
  kind: VisualResponseKind;
  metric?: VisualMetric;
  comparativa?: VisualComparativaItem[];
  tabla?: VisualTabla;
  acciones?: VisualAccion[];
}

export interface ChatMessage {
  id: string;
  rol: ChatRole;
  texto: string;
  timestamp: string;
  visual?: VisualResponse;
}

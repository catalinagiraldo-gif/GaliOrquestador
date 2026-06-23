export type SituacionTipo = 'zero' | 'inicio' | 'escalando';

export type ObjetivoTipo = 'primera-venta' | 'pedidos' | 'ingresos';

export interface ObjetivoSugerido {
  pedidosSem: number;
  semanas: number;
  descripcion: string;
  factibilidad: 'verde' | 'amarillo';
}

export interface ProductoSugerido {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioLabel: string;
  margenEstimado: number;
  popularidadScore: number;
  etiqueta: string;
  emoji: string;
}

export interface SituacionOpcion {
  tipo: SituacionTipo;
  titulo: string;
  subtitulo: string;
  emoji: string;
}

export const SITUACION_OPCIONES: SituacionOpcion[] = [
  {
    tipo: 'zero',
    titulo: 'Estoy empezando desde cero',
    subtitulo: 'Nunca he vendido online',
    emoji: '🌱',
  },
  {
    tipo: 'inicio',
    titulo: 'Ya tengo algo',
    subtitulo: 'He hecho mis primeras ventas pero no escalo',
    emoji: '📦',
  },
  {
    tipo: 'escalando',
    titulo: 'Tengo experiencia',
    subtitulo: 'Vendo pero quiero optimizar con IA',
    emoji: '🚀',
  },
];

export const OBJETIVO_SUGERIDO_POR_SITUACION: Record<SituacionTipo, ObjetivoSugerido> = {
  zero: {
    pedidosSem: 5,
    semanas: 4,
    descripcion: 'Para alguien que empieza, 5 pedidos en 4 semanas es un objetivo alcanzable y motivador.',
    factibilidad: 'verde',
  },
  inicio: {
    pedidosSem: 15,
    semanas: 6,
    descripcion: 'Con tus primeras ventas como base, 15 pedidos semanales en 6 semanas es el siguiente escalón.',
    factibilidad: 'verde',
  },
  escalando: {
    pedidosSem: 40,
    semanas: 8,
    descripcion: 'Para alguien con experiencia, 40 pedidos semanales en 8 semanas es ambicioso pero factible.',
    factibilidad: 'amarillo',
  },
};

export interface AgenteBasico {
  nombre: string;
  emoji: string;
  desc: string;
}

export const PAQUETE_PRINCIPIANTES_ZERO: AgenteBasico[] = [
  { nombre: 'Stock Guardian', emoji: '📦', desc: 'Te avisa si el producto se acaba' },
  { nombre: 'ROAS Tracker', emoji: '📊', desc: 'Mide si estás ganando dinero' },
  { nombre: 'Logistics Pro', emoji: '🚚', desc: 'Reduce tus novedades' },
];

export const PRODUCTOS_SUGERIDOS: ProductoSugerido[] = [
  {
    id: 'collar-gps',
    nombre: 'Collar GPS para mascotas',
    categoria: 'Mascotas',
    precio: 89000,
    precioLabel: '$89k',
    margenEstimado: 38,
    popularidadScore: 92,
    etiqueta: 'Más vendido',
    emoji: '🐾',
  },
  {
    id: 'skincare-kbeauty',
    nombre: 'Kit Skincare K-Beauty',
    categoria: 'Belleza',
    precio: 65000,
    precioLabel: '$65k',
    margenEstimado: 42,
    popularidadScore: 87,
    etiqueta: 'Alto margen',
    emoji: '✨',
  },
  {
    id: 'auriculares-bt',
    nombre: 'Auriculares Bluetooth Premium',
    categoria: 'Tecnología',
    precio: 75000,
    precioLabel: '$75k',
    margenEstimado: 31,
    popularidadScore: 78,
    etiqueta: 'Tendencia',
    emoji: '🎧',
  },
];

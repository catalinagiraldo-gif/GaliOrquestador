import { Component, EventEmitter, Input, Output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface NuevaCampanaData {
  proyectoId: string;
  proyectoNombre: string;
}

interface ProductoBusqueda {
  id: string;
  nombre: string;
  precio: string;
  margen: string;
}

const PRODUCTOS_SUGERIDOS: ProductoBusqueda[] = [
  { id: 'p1', nombre: 'Collar GPS para mascotas', precio: '$89.000', margen: '34%' },
  { id: 'p2', nombre: 'Difusor Aromaterapia USB', precio: '$45.000', margen: '41%' },
  { id: 'p3', nombre: 'Kit Skincare Coreano 5 pasos', precio: '$120.000', margen: '28%' },
  { id: 'p4', nombre: 'Licuadora Portátil Recargable', precio: '$65.000', margen: '38%' },
  { id: 'p5', nombre: 'Reloj Inteligente Kids GPS', precio: '$95.000', margen: '31%' },
];

const AGENTES_POR_CANAL: Record<string, string[]> = {
  tiktok:   ['ROAS Tracker', 'Stock Guardian'],
  meta:     ['ROAS Tracker', 'ADA Spy'],
  whatsapp: ['Chatea Pro', 'Vigilante Logístico'],
  google:   ['ROAS Tracker'],
};

const CONEXION_STATUS: Record<string, boolean> = {
  tiktok:   true,
  meta:     true,
  whatsapp: false,
  google:   false,
};

@Component({
  selector: 'app-gali6-nueva-campana',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali6-nueva-campana.component.html',
  styleUrls: ['./gali6-nueva-campana.component.scss'],
})
export class Gali6NuevaCampanaComponent {
  @Input() data: NuevaCampanaData | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() creada = new EventEmitter<void>();

  private router = inject(Router);

  // Form state
  readonly nombre = signal('');
  readonly canal = signal<'tiktok' | 'meta' | 'whatsapp' | 'google' | ''>('');
  readonly producto = signal<ProductoBusqueda | null>(null);
  readonly busquedaProducto = signal('');
  readonly presupuestoDiario = signal('');
  readonly roasObjetivo = signal('1.5');
  readonly creando = signal(false);
  readonly exito = signal(false);

  readonly canalLabel = computed(() => ({
    tiktok: 'TikTok Ads', meta: 'Meta Ads',
    whatsapp: 'WhatsApp', google: 'Google Ads', '': '',
  }[this.canal()]));

  readonly agentesRecomendados = computed(() =>
    this.canal() ? AGENTES_POR_CANAL[this.canal()] ?? [] : []
  );

  readonly conexionActiva = computed(() =>
    this.canal() ? (CONEXION_STATUS[this.canal()] ?? false) : false
  );

  readonly productosFiltrados = computed(() => {
    const q = this.busquedaProducto().toLowerCase();
    return PRODUCTOS_SUGERIDOS.filter(p => p.nombre.toLowerCase().includes(q));
  });

  readonly canCreate = computed(() =>
    this.nombre().trim().length > 0 && this.canal() !== ''
  );

  seleccionarCanal(c: 'tiktok' | 'meta' | 'whatsapp' | 'google'): void {
    this.canal.set(c);
    if (!this.nombre()) {
      this.nombre.set(`${this.canalLabel()} — ${this.data?.proyectoNombre ?? 'Proyecto'}`);
    }
  }

  seleccionarProducto(p: ProductoBusqueda): void {
    this.producto.set(p);
    this.busquedaProducto.set('');
  }

  quitarProducto(): void {
    this.producto.set(null);
  }

  crear(): void {
    if (!this.canCreate()) return;
    this.creando.set(true);
    setTimeout(() => {
      this.creando.set(false);
      this.exito.set(true);
      setTimeout(() => {
        this.creada.emit();
        this.cerrar.emit();
      }, 1400);
    }, 1200);
  }

  irAConexiones(): void {
    this.router.navigate(['/gali-6/conexiones']);
    this.cerrar.emit();
  }
}

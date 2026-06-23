import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SITUACION_OPCIONES,
  PRODUCTOS_SUGERIDOS,
  OBJETIVO_SUGERIDO_POR_SITUACION,
  PAQUETE_PRINCIPIANTES_ZERO,
  type SituacionTipo,
  type ObjetivoTipo,
  type ProductoSugerido,
  type AgenteBasico,
} from '../../../../../mocks/gali-v6/onboarding-zero';

type PasoLanzamiento = 'idle' | 'proyecto' | 'agentes' | 'listo';

@Component({
  selector: 'app-gali6-zero-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali6-zero-onboarding.component.html',
  styleUrl: './gali6-zero-onboarding.component.scss',
})
export class Gali6ZeroOnboardingComponent {
  readonly router = inject(Router);

  readonly paso = signal(0);
  readonly situacion = signal<SituacionTipo | null>(null);
  readonly objetivoTipo = signal<ObjetivoTipo>('pedidos');
  readonly objetivoPedidos = signal(10);
  readonly objetivoSemanas = signal(4);
  readonly productoSeleccionado = signal<ProductoSugerido | null>(null);
  readonly busqueda = signal('');
  readonly pasoLanzamiento = signal<PasoLanzamiento>('idle');

  readonly situacionOpciones = SITUACION_OPCIONES;
  readonly productosSugeridos = PRODUCTOS_SUGERIDOS;
  readonly paquete = PAQUETE_PRINCIPIANTES_ZERO;

  readonly sugerencia = computed(() => {
    const s = this.situacion();
    return s ? OBJETIVO_SUGERIDO_POR_SITUACION[s] : null;
  });

  readonly productosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.productosSugeridos;
    return this.productosSugeridos.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
    );
  });

  readonly puedeContinuar = computed(() => {
    switch (this.paso()) {
      case 1: return this.situacion() !== null;
      case 2: return this.objetivoTipo() === 'primera-venta' || this.objetivoPedidos() > 0;
      case 3: return this.productoSeleccionado() !== null;
      default: return true;
    }
  });

  readonly resumenObjetivo = computed(() => {
    const tipo = this.objetivoTipo();
    if (tipo === 'primera-venta') return 'Hacer mi primera venta';
    return `${this.objetivoPedidos()} pedidos en ${this.objetivoSemanas()} semanas`;
  });

  onSituacion(tipo: SituacionTipo): void {
    this.situacion.set(tipo);
    const sug = OBJETIVO_SUGERIDO_POR_SITUACION[tipo];
    this.objetivoPedidos.set(sug.pedidosSem);
    this.objetivoSemanas.set(sug.semanas);
  }

  usarSugerencia(): void {
    const sug = this.sugerencia();
    if (!sug) return;
    this.objetivoTipo.set('pedidos');
    this.objetivoPedidos.set(sug.pedidosSem);
    this.objetivoSemanas.set(sug.semanas);
  }

  seleccionarProducto(p: ProductoSugerido): void {
    this.productoSeleccionado.set(p);
  }

  avanzar(): void {
    if (this.paso() < 5) this.paso.update(n => n + 1);
  }

  retroceder(): void {
    if (this.paso() > 1) this.paso.update(n => n - 1);
  }

  lanzar(): void {
    this.pasoLanzamiento.set('proyecto');
    setTimeout(() => this.pasoLanzamiento.set('agentes'), 1200);
    setTimeout(() => this.pasoLanzamiento.set('listo'), 2400);
    setTimeout(() => this.router.navigate(['/gali-6-zero/hoy']), 3800);
  }
}

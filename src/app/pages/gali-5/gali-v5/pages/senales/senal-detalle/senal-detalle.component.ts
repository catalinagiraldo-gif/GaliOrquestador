import { Component, Input, Output, EventEmitter, inject, signal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GaliSignal, GaliAlerta } from '../../../../../../../../mocks/gali-v5/senales.mock';

export type SelectedItem = { kind: 'senal'; data: GaliSignal } | { kind: 'alerta'; data: GaliAlerta };

@Component({
  selector: 'app-senal-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './senal-detalle.component.html',
  styleUrls: ['./senal-detalle.component.scss'],
})
export class SenalDetalleComponent implements OnChanges {
  private router = inject(Router);

  @Input() item!: SelectedItem;
  @Input() isAlerta = false;

  @Output() ctaPrimario = new EventEmitter<SelectedItem>();
  @Output() ctaSecundario = new EventEmitter<SelectedItem>();
  @Output() ignorar = new EventEmitter<SelectedItem>();
  @Output() guardarDespues = new EventEmitter<SelectedItem>();
  @Output() opcionElegida = new EventEmitter<{ alertaId: string; opcionId: string }>();

  // Multi-opción decision state — se resetean al cambiar de alerta
  readonly opcionSeleccionada = signal<string | null>(null);
  readonly accionConfirmada = signal(false);

  ngOnChanges(): void {
    this.opcionSeleccionada.set(null);
    this.accionConfirmada.set(false);
  }

  get senal(): GaliSignal | null {
    return this.item?.kind === 'senal' ? this.item.data : null;
  }

  get alerta(): GaliAlerta | null {
    return this.item?.kind === 'alerta' ? this.item.data : null;
  }

  get windowClass(): string {
    if (!this.senal) return '';
    if (this.senal.ventanaDias <= 6) return 'urgent';
    if (this.senal.ventanaDias <= 9) return 'soon';
    return 'ok';
  }

  get windowColor(): string {
    if (!this.senal) return '';
    if (this.senal.ventanaDias <= 6) return 'var(--red-600)';
    if (this.senal.ventanaDias <= 9) return 'var(--amber-600)';
    return 'var(--green-600)';
  }

  getOpcionSeleccionada(a: GaliAlerta): string {
    const sel = this.opcionSeleccionada();
    if (sel) return sel;
    // Default: la opción primaria
    return a.opciones?.find(o => o.isPrimary)?.id ?? a.opciones?.[0]?.id ?? '';
  }

  selectOpcion(id: string): void {
    this.opcionSeleccionada.set(id);
    this.accionConfirmada.set(false);
  }

  confirmarOpcion(a: GaliAlerta): void {
    const opcionId = this.getOpcionSeleccionada(a);
    this.opcionElegida.emit({ alertaId: a.id, opcionId });
    this.accionConfirmada.set(true);
  }

  navigateToPedido(pedidoId: string | undefined): void {
    if (!pedidoId) return;
    this.router.navigate(['/mis-pedidos/mis-pedidos'], {
      queryParams: { highlight: pedidoId },
    });
  }
}

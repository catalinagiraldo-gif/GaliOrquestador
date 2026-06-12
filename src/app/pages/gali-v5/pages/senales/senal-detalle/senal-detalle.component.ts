import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GaliSignal, GaliAlerta } from '../../../../../../../mocks/gali-v5/senales.mock';

export type SelectedItem = { kind: 'senal'; data: GaliSignal } | { kind: 'alerta'; data: GaliAlerta };

@Component({
  selector: 'app-senal-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './senal-detalle.component.html',
  styleUrls: ['./senal-detalle.component.scss'],
})
export class SenalDetalleComponent {
  private router = inject(Router);

  @Input() item!: SelectedItem;
  @Input() isAlerta = false;

  @Output() ctaPrimario = new EventEmitter<SelectedItem>();
  @Output() ctaSecundario = new EventEmitter<SelectedItem>();
  @Output() ignorar = new EventEmitter<SelectedItem>();
  @Output() guardarDespues = new EventEmitter<SelectedItem>();

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

  navigateToPedido(pedidoId: string | undefined): void {
    if (!pedidoId) return;
    this.router.navigate(['/mis-pedidos/mis-pedidos'], {
      queryParams: { highlight: pedidoId },
    });
  }
}

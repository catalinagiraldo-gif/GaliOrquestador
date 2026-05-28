import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropiTitulosComponent } from '../../components/shared';

@Component({
  selector: 'app-chatea-pro-page',
  standalone: true,
  imports: [CommonModule, DropiTitulosComponent],
  templateUrl: './chatea-pro-page.component.html',
  styleUrl: './chatea-pro-page.component.scss',
})
export class ChateaProPageComponent {
  readonly breadcrumbs = ['Marketing', 'Chatea Pro'];
  readonly stats = [
    { value: '+2,000 tiendas activas', desc: 'Únete a los que ya están escalando su operación' },
    { value: '+80% pedidos confirmados', desc: 'Tú creces el negocio, Chatea Pro confirma los pedidos por ti.' },
    { value: '+30% carritos recuperados', desc: 'Recupera ventas perdidas y aumenta tus ganancias.' },
    { value: '+10% conversión', desc: 'Vende por WhatsApp automáticamente, el canal que mejor convierte.' },
  ];
}

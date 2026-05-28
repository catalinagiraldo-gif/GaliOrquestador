import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropiSearchOficialComponent, DropiTagComponent } from '../../components/shared';
import casData from '../../../../../../mocks/gali-v5/cas-tickets.json';

@Component({
  selector: 'app-cas-bandeja-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiSearchOficialComponent, DropiTagComponent],
  templateUrl: './cas-bandeja-page.component.html',
  styleUrl: './cas-bandeja-page.component.scss',
})
export class CasBandejaPageComponent {
  searchQuery = '';
  activeFilter = signal<'todos' | 'abiertos' | 'mios'>('todos');
  selectedId = signal(casData.tickets[0]?.id ?? '');
  readonly tickets = casData.tickets;
  readonly messages = casData.messages;

  selectedTicket() {
    return this.tickets.find(t => t.id === this.selectedId()) ?? this.tickets[0];
  }

  statusVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      Abierto: 'warning',
      'En proceso': 'info',
      Resuelto: 'success',
      Cerrado: 'neutral',
      Escalado: 'error',
      Pendiente: 'warning',
    };
    return map[status] ?? 'neutral';
  }
}

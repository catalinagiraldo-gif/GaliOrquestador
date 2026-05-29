import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import ordersData from '../../../../../../mocks/gali-v5/orders.json';
import { DropiGaliBarComponent, GaliBarStat } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

interface OrderRow {
  id: string;
  product: string;
  clientName: string;
  address: string;
  phone: string;
  addressValid: boolean;
  carrier: string;
  guide: string;
  recaudo: string;
  statusTags: string[];
}

type GaliTriageStatus = 'ok' | 'managing' | 'decision' | 'auto';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiGaliBarComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  searchQuery = '';
  readonly breadcrumbs = ['Pedidos', 'Ordenes'];

  goToSignals(): void {
    this.ws.setMode('operar');
    this.router.navigate(['/gali-v5']);
  }
  readonly orders: OrderRow[] = ordersData.orders;

  readonly galiStats: GaliBarStat[] = [
    { value: 31, label: 'confirmadas auto', variant: 'ok' },
    { value: 8, label: 'Chatea Pro gestionando', variant: 'neutral' },
    { value: 3, label: 'requieren tu decisión', variant: 'warn' },
    { value: 47, label: 'pedidos hoy' },
  ];

  // Per-order Gali status (maps order ID → triage status)
  readonly galiStatus: Record<string, GaliTriageStatus> = {
    '160604': 'auto',
    '160605': 'managing',
    '160606': 'decision',
    '160607': 'ok',
    '160608': 'managing',
    '160609': 'auto',
    '160610': 'decision',
  };

  getGaliStatus(id: string): GaliTriageStatus {
    return this.galiStatus[id] ?? 'ok';
  }

  getGaliLabel(id: string): string {
    const s = this.getGaliStatus(id);
    return {
      auto: '✦ Confirmada auto',
      managing: '✦ Gali gestionando',
      decision: '✦ Tu decisión',
      ok: '',
    }[s];
  }

  getGaliChipClass(id: string): string {
    const s = this.getGaliStatus(id);
    return {
      auto: 'gali-chip--auto',
      managing: 'gali-chip--managing',
      decision: 'gali-chip--decision',
      ok: '',
    }[s];
  }
}

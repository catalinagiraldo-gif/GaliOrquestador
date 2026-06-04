import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import walletData from '../../../../../../mocks/gali-v5/wallet-transactions.json';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';

interface WalletTransaction {
  num: string;
  fecha: string;
  tipo: string;
  monto: string;
  montoPrevio: string;
  descripcion: string;
  descripcionHumana?: string;
  producto?: string;
  guia?: string;
}

interface Fuga {
  id: string;
  titulo: string;
  impacto: string;
  impacto_valor: number;
  canal: string;
  severidad: 'alta' | 'media';
  accion: string;
  accion_ruta: string;
}

@Component({
  selector: 'app-wallet-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiPaginatorComponent,
    DropiGaliBarComponent,
  ],
  templateUrl: './wallet-page.component.html',
  styleUrl: './wallet-page.component.scss',
})
export class WalletPageComponent {
  searchQuery = '';
  activeTab = signal<'transacciones' | 'depositos'>('transacciones');
  transaccionesOpen = signal(false);

  readonly breadcrumbs = ['Financiero', 'Wallet', 'Historial de wallet'];
  readonly alertMessage = walletData.alertMessage;
  readonly transactions: WalletTransaction[] = walletData.transactions;

  readonly summary = walletData.financialSummary;
  readonly fugas: Fuga[] = walletData.financialSummary.fugas as Fuga[];
  readonly siigo = walletData.financialSummary.siigo;

  filteredTransactions(): WalletTransaction[] {
    if (!this.searchQuery) return this.transactions;
    const q = this.searchQuery.toLowerCase();
    return this.transactions.filter(t =>
      t.num.includes(q) ||
      (t.descripcionHumana ?? t.descripcion).toLowerCase().includes(q),
    );
  }

  getDescripcion(t: WalletTransaction): string {
    return t.descripcionHumana ?? t.descripcion;
  }
}

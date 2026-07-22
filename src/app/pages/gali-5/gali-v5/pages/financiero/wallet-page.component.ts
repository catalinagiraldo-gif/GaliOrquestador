import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import walletData from '../../../../../../../mocks/gali-v5/wallet-transactions.json';
import { GaliGlosarioDirective } from '../../directives/gali-glosario.directive';
import { Gali6AgentPresenceBarComponent } from '../../../../gali-6/components/gali6-agent-presence-bar.component';
import { Gali6ScreenArtifactsComponent } from '../../../../gali-6/components/gali6-screen-artifacts.component';

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

interface GaliRoiItem {
  icono: string;
  label: string;
  valor: string;
}

@Component({
  selector: 'app-wallet-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TooltipModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiPaginatorComponent,
    GaliGlosarioDirective,
    Gali6AgentPresenceBarComponent,
    Gali6ScreenArtifactsComponent,
  ],
  templateUrl: './wallet-page.component.html',
  styleUrl: './wallet-page.component.scss',
})
export class WalletPageComponent implements OnInit, OnDestroy {
  private ws = inject(GaliWorkspaceService);

  ngOnInit(): void { this.ws.primaryAlertActive.set(true); }
  ngOnDestroy(): void { this.ws.primaryAlertActive.set(false); }

  searchQuery = '';
  activeTab = signal<'transacciones' | 'depositos'>('transacciones');
  transaccionesOpen = signal(false);

  readonly showSiigoDrawer = signal(false);
  readonly siigoStep = signal<1 | 2 | 3>(1);
  readonly siigoEmail = signal('');
  readonly siigoPassword = signal('');
  readonly siigoCuenta = signal('');
  readonly siigoSyncProgress = signal(0);

  private syncInterval: ReturnType<typeof setInterval> | null = null;

  readonly breadcrumbs = ['Financiero', 'Wallet', 'Historial de wallet'];
  readonly alertMessage = walletData.alertMessage;
  readonly transactions: WalletTransaction[] = walletData.transactions;

  readonly summary = walletData.financialSummary;
  readonly fugas: Fuga[] = walletData.financialSummary.fugas as Fuga[];
  readonly siigo = walletData.financialSummary.siigo;
  readonly galiRoi = (walletData as any).galiRoi;
  readonly galiRoiItems: GaliRoiItem[] = (walletData as any).galiRoi.detalle;

  openSiigoDrawer(): void {
    this.siigoStep.set(1);
    this.siigoEmail.set('');
    this.siigoPassword.set('');
    this.siigoCuenta.set('');
    this.siigoSyncProgress.set(0);
    this.showSiigoDrawer.set(true);
  }

  closeSiigoDrawer(): void {
    this.showSiigoDrawer.set(false);
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  siigoNext(): void {
    const current = this.siigoStep();
    if (current === 2) {
      this.siigoStep.set(3);
      this.startSyncProgress();
    } else if (current < 3) {
      this.siigoStep.update(s => (s + 1) as 1 | 2 | 3);
    }
  }

  private startSyncProgress(): void {
    this.siigoSyncProgress.set(0);
    this.syncInterval = setInterval(() => {
      this.siigoSyncProgress.update(p => {
        if (p >= 100) {
          clearInterval(this.syncInterval!);
          this.syncInterval = null;
          return 100;
        }
        return p + 4;
      });
    }, 120);
  }

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

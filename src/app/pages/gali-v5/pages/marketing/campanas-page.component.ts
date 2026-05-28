import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiTagComponent,
  DropiPaginatorComponent,
  DropiTagVariant,
} from '../../components/shared';
import campanasData from '../../../../../../mocks/gali-v5/marketing-campanas.json';

interface CampanaRow {
  id: string;
  nombre: string;
  estado: string;
  fecha: string;
  canal: string;
}

@Component({
  selector: 'app-campanas-page',
  standalone: true,
  imports: [
    CommonModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiTagComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './campanas-page.component.html',
  styleUrl: './campanas-page.component.scss',
})
export class CampanasPageComponent {
  activeChannel: 'sms' | 'email' = 'sms';
  readonly breadcrumbs = ['Marketing', 'SMS y Correo', 'Campañas masivas'];
  readonly campaigns: CampanaRow[] = campanasData.campaigns;

  get filteredRows(): CampanaRow[] {
    return this.campaigns.filter(row => row.canal === this.activeChannel);
  }

  estadoVariant(estado: string): DropiTagVariant {
    switch (estado) {
      case 'Error': return 'error';
      case 'Activa': return 'success';
      case 'Programada': return 'info';
      case 'Pausada': return 'warning';
      default: return 'neutral';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import flowsData from '../../../../../../mocks/gali-v5/marketing-automatizacion.json';

interface AutomatizacionRow {
  id: string;
  nombre: string;
  activo: boolean;
}

@Component({
  selector: 'app-automatizacion-page',
  standalone: true,
  imports: [
    CommonModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './automatizacion-page.component.html',
  styleUrl: './automatizacion-page.component.scss',
})
export class AutomatizacionPageComponent {
  readonly breadcrumbs = ['Marketing', 'SMS y Correo', 'Automatización'];
  readonly flows: AutomatizacionRow[] = flowsData.flows.map(flow => ({ ...flow }));

  toggleActivo(row: AutomatizacionRow): void {
    row.activo = !row.activo;
  }
}

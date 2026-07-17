import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiTagComponent,
} from '../../components/shared';
import addressesData from '../../../../../../../mocks/gali-v5/validador-addresses.json';
import { Gali6ScreenContextService } from '../../../../gali-6/services/gali6-screen-context.service';

interface AddressCard {
  id: string;
  alias: string;
  department: string;
  city: string;
  address: string;
  validated: boolean;
  lastUsed: string;
}

@Component({
  selector: 'app-validador-direcciones-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiTagComponent,
  ],
  templateUrl: './validador-direcciones-page.component.html',
  styleUrl: './validador-direcciones-page.component.scss',
})
export class ValidadorDireccionesPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly screenCtx = inject(Gali6ScreenContextService);

  searchQuery = '';
  dept = '';
  city = '';
  readonly breadcrumbs = ['Pedidos', 'Preferencias', 'Validador de direcciones'];
  readonly addresses: AddressCard[] = addressesData.addresses;

  /**
   * Screen-awareness (PlanChat.md §B4): publica el contexto activo para que el
   * chat lateral de Gali 6 lo consuma — mismo mecanismo que
   * gali6-proyectos-casa.component.ts:121. Componente compartido con /gali-v5,
   * así que la ruta publicada se toma de `router.url` en vez de asumir el
   * prefijo /gali-6 — si se monta fuera del shell de Gali 6 esto es un no-op
   * (nadie lee Gali6ScreenContextService ahí).
   */
  ngOnInit(): void {
    const pendientes = this.addresses.filter(a => !a.validated).length;
    this.screenCtx.publish({
      route: this.router.url,
      viewId: 'validador-direcciones',
      viewLabel: 'Validador de direcciones',
      summary: `${this.addresses.length} direcciones${pendientes > 0 ? `, ${pendientes} pendientes de validar` : ''}`,
    });
  }
}

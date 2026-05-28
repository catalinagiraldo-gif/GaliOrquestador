import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropiTitulosComponent, DropiButtonNewComponent } from '../../components/shared';
import { GALI_V5_DROPI_LOGO } from '../../gali-v5.constants';

interface CanalOption {
  id: string;
  label: string;
  description?: string;
  logo?: string;
  selected: boolean;
}

@Component({
  selector: 'app-roax-lanzador-page',
  standalone: true,
  imports: [CommonModule, DropiTitulosComponent, DropiButtonNewComponent],
  templateUrl: './roax-lanzador-page.component.html',
  styleUrl: './roax-lanzador-page.component.scss',
})
export class RoaxLanzadorPageComponent {
  readonly dropiLogo = GALI_V5_DROPI_LOGO;
  readonly breadcrumbs = ['Marketing', 'ROAX', 'Lanzador de campañas'];
  readonly steps = [
    'Canal de venta',
    'Entendimiento del producto',
    'Ángulos de venta',
    'Guiones',
    'Generar',
  ];
  currentStep = 0;

  canales: CanalOption[] = [
    { id: 'tiktok', label: 'TikTok Ads', logo: GALI_V5_DROPI_LOGO, selected: true },
    { id: 'meta', label: 'Meta', logo: GALI_V5_DROPI_LOGO, selected: false },
    {
      id: 'web',
      label: 'Venta en página web',
      description: 'Escoge esta opción si la venta la quieres realizar a través de una página web',
      selected: false,
    },
    {
      id: 'whatsapp',
      label: 'Venta en WhatsApp',
      description: 'Escoge esta opción si la venta la quieres realizar a través de tu canal de ventas de WhatsApp',
      selected: false,
    },
  ];

  selectCanal(canal: CanalOption): void {
    this.canales.forEach(c => (c.selected = c.id === canal.id));
  }

  continuar(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
    }
  }
}

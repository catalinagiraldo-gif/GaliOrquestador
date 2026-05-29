import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropiTitulosComponent, DropiButtonNewComponent } from '../../components/shared';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';

interface CarrierIndicator {
  carrier: string;
  myOpEffectiveness: number;
  dropiEffectiveness: number;
  avgFreight: string;
  deliveryTime: string;
  deliveryTimeDropi: string;
}

@Component({
  selector: 'app-torre-logistica-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiTitulosComponent, DropiButtonNewComponent, DropiGaliBarComponent],
  templateUrl: './torre-logistica-page.component.html',
  styleUrl: './torre-logistica-page.component.scss',
})
export class TorreLogisticaPageComponent {
  miOperacion = true;
  dropiView = false;
  readonly breadcrumbs = ['Logística', 'Torre logística'];

  readonly indicators: CarrierIndicator[] = [
    { carrier: 'Veloces', myOpEffectiveness: 60, dropiEffectiveness: 40, avgFreight: '$15.800', deliveryTime: '4,5 días', deliveryTimeDropi: '4,5 días' },
    { carrier: 'Servientrega', myOpEffectiveness: 20, dropiEffectiveness: 55, avgFreight: '$15.800', deliveryTime: '5 días', deliveryTimeDropi: '5,5 días' },
    { carrier: 'Coordinadora', myOpEffectiveness: 75, dropiEffectiveness: 62, avgFreight: '$14.200', deliveryTime: '3,5 días', deliveryTimeDropi: '4 días' },
    { carrier: 'Envía', myOpEffectiveness: 48, dropiEffectiveness: 35, avgFreight: '$16.500', deliveryTime: '5 días', deliveryTimeDropi: '5 días' },
  ];

  readonly mapPins = [
    { carrier: 'Veloces', x: 180, y: 200 },
    { carrier: 'Servientrega', x: 220, y: 160 },
    { carrier: 'Coordinadora', x: 150, y: 280 },
    { carrier: 'Envía', x: 240, y: 320 },
  ];
}

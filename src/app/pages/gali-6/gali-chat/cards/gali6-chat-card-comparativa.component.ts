import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualComparativaItem } from '../models/gali6-chat.model';

/** Mini-bar-chart 100% CSS — evolución del roas_chart de gali-5. Sin librería de charts, ver §4.3 del plan. */
@Component({
  selector: 'gali6-chat-card-comparativa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-chat-card-comparativa.component.html',
  styleUrl: './gali6-chat-card-comparativa.component.scss',
})
export class Gali6ChatCardComparativaComponent {
  @Input({ required: true }) items!: VisualComparativaItem[];
}

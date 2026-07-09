import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualMetric } from '../models/gali6-chat.model';

@Component({
  selector: 'gali6-chat-card-metric',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-chat-card-metric.component.html',
  styleUrl: './gali6-chat-card-metric.component.scss',
})
export class Gali6ChatCardMetricComponent {
  @Input({ required: true }) metric!: VisualMetric;
}

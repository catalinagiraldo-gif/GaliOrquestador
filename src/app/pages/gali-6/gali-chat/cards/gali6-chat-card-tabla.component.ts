import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualTabla } from '../models/gali6-chat.model';

@Component({
  selector: 'gali6-chat-card-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-chat-card-tabla.component.html',
  styleUrl: './gali6-chat-card-tabla.component.scss',
})
export class Gali6ChatCardTablaComponent {
  @Input({ required: true }) tabla!: VisualTabla;
}

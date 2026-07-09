import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualAccion } from '../models/gali6-chat.model';

@Component({
  selector: 'gali6-chat-card-acciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-chat-card-acciones.component.html',
  styleUrl: './gali6-chat-card-acciones.component.scss',
})
export class Gali6ChatCardAccionesComponent {
  @Input({ required: true }) acciones!: VisualAccion[];
  @Output() actionClick = new EventEmitter<string>();
}

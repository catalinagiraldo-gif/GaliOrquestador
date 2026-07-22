import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualAccion } from '../models/gali6-chat.model';
import { gali6ScreenCatalogConDestino, Gali6ScreenOption } from '../../models/gali6-screen-catalog';

@Component({
  selector: 'gali6-chat-card-acciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-chat-card-acciones.component.html',
  styleUrl: './gali6-chat-card-acciones.component.scss',
})
export class Gali6ChatCardAccionesComponent {
  @Input({ required: true }) acciones!: VisualAccion[];
  /** Pantalla actual del usuario, si se conoce — preselección del selector de destino (Flujo J extendido). */
  @Input() screenIdActual?: string;
  @Output() actionClick = new EventEmitter<string>();

  // Solo pantallas con <gali6-agent-presence-bar>/<gali6-screen-artifacts> montado — el resto
  // "pierde" el resultado en silencio (18.FlujoUsuarioGali6.md §5.9).
  readonly screenCatalog: Gali6ScreenOption[] = gali6ScreenCatalogConDestino();

  private readonly destinoElegido = signal<Record<string, string>>({});

  destinoPara(accion: VisualAccion): string {
    const elegido = this.destinoElegido()[accion.actionId];
    if (elegido) return elegido;
    const actualCubierta = this.screenIdActual && this.screenCatalog.some(o => o.id === this.screenIdActual);
    return (actualCubierta ? this.screenIdActual : this.screenCatalog[0]?.id) ?? '';
  }

  setDestino(accion: VisualAccion, screenId: string): void {
    this.destinoElegido.update(m => ({ ...m, [accion.actionId]: screenId }));
  }

  confirmarConDestino(accion: VisualAccion): void {
    const screenId = this.destinoPara(accion);
    if (!screenId) return;
    this.actionClick.emit(`${accion.actionId}::${screenId}`);
  }
}

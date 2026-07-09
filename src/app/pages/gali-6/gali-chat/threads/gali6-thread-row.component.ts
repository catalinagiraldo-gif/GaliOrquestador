import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatThread } from '../models/gali6-thread.model';

/**
 * Fila de hilo reutilizable para el rail — reemplaza el `ngTemplateOutlet`
 * del panel viejo por un componente real, testeable de forma aislada.
 * Es siempre un <button> real (o <input> en modo edición) para que Tab+Enter
 * cambie de hilo sin depender de que el rail esté expandido por hover.
 */
@Component({
  selector: 'gali6-thread-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-thread-row.component.html',
  styleUrl: './gali6-thread-row.component.scss',
})
export class Gali6ThreadRowComponent {
  @Input({ required: true }) thread!: ChatThread;
  @Input() isActive = false;
  @Input() isPinned = false;
  @Input() expanded = false;
  @Input() isEditing = false;
  @Input() canArchive = true;

  @Output() switchClick = new EventEmitter<void>();
  @Output() pinClick = new EventEmitter<void>();
  @Output() startEditClick = new EventEmitter<void>();
  @Output() renameCommit = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() archiveClick = new EventEmitter<void>();

  readonly hovered = signal(false);

  commit(value: string): void {
    const v = value.trim();
    if (v) this.renameCommit.emit(v);
    else this.cancelEdit.emit();
  }
}

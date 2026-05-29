import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropi-panel-splitter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="splitter"
      (mousedown)="onMouseDown($event)"
      title="Arrastrar para redimensionar">
      <div class="splitter__grip">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `,
  styleUrl: './dropi-panel-splitter.component.scss',
})
export class DropiPanelSplitterComponent {
  @Input() currentWidth = 200;
  @Output() widthChange = new EventEmitter<number>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();

  private startX = 0;
  private startWidth = 200;
  private dragging = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.dragging) return;
    const delta = e.clientX - this.startX;
    const newWidth = Math.max(140, Math.min(340, this.startWidth + delta));
    this.widthChange.emit(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (!this.dragging) return;
    this.dragging = false;
    document.body.style.cursor = '';
    document.body.classList.remove('is-resizing');
    this.dragEnd.emit();
  }

  onMouseDown(e: MouseEvent): void {
    this.dragging = true;
    this.startX = e.clientX;
    this.startWidth = this.currentWidth;
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('is-resizing');
    this.dragStart.emit();
    e.preventDefault();
  }
}

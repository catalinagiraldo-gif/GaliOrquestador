import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlockManifest, BlockSize } from '../../../services/gali-v3/block-registry';

@Component({
  selector: 'gali-v3-block-wrapper',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gali-v3-block-wrapper.component.html',
  styleUrls: ['./gali-v3-block-wrapper.component.scss'],
})
export class GaliV3BlockWrapperComponent {
  @Input({ required: true }) manifest!: BlockManifest;
  @Input({ required: true }) size!: BlockSize;
  @Input() editing = false;
  @Output() resize = new EventEmitter<BlockSize>();
  @Output() remove = new EventEmitter<void>();
  @Output() expand = new EventEmitter<void>();

  menuOpen = signal(false);

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }

  onResize(s: BlockSize) {
    this.resize.emit(s);
    this.closeMenu();
  }
  onRemove() {
    this.remove.emit();
    this.closeMenu();
  }
}

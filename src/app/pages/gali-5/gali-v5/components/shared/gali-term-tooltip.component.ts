import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'gali-term-tooltip',
  standalone: true,
  imports: [TooltipModule],
  template: `<span class="gali-term-info" [pTooltip]="tooltip" [tooltipPosition]="position">ⓘ</span>`,
  styles: [`
    .gali-term-info {
      font-size: 10px;
      color: #858ea6;
      cursor: help;
      flex-shrink: 0;
      transition: color 0.12s;
      &:hover { color: #f49a3d; }
    }
  `],
})
export class GaliTermTooltipComponent {
  @Input() tooltip = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
}

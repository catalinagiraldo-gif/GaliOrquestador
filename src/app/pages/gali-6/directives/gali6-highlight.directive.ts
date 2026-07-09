import { Directive, ElementRef, Input, effect, inject } from '@angular/core';
import { Gali6HighlightService } from '../services/gali6-highlight.service';

/**
 * Aplica un highlight temporal al host cuando Gali6HighlightService.active()
 * apunta a este targetId — usado para que "modificar vía chat" y "modificar
 * vía UI normal" tengan la misma señal visual. Estilos .gali6-highlight--active
 * / --info se definen en el SCSS de cada página consumidora (mismo patrón de
 * scoping que gali-glosario.directive.ts).
 */
@Directive({ selector: '[gali6Highlight]', standalone: true })
export class Gali6HighlightDirective {
  @Input('gali6Highlight') targetId = '';

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly highlight = inject(Gali6HighlightService);

  private readonly sync = effect(() => {
    const active = this.highlight.active();
    const isActive = !!active && !!this.targetId && active.targetId === this.targetId;
    const el = this.host.nativeElement;
    el.classList.toggle('gali6-highlight--active', isActive);
    el.classList.toggle('gali6-highlight--info', isActive && active?.variant === 'info');
  });
}

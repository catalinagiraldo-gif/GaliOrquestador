import { Directive, ElementRef, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { GaliWorkspaceService } from '../services/gali-workspace.service';

/**
 * Oculta el host cuando hay una alerta crítica activa (primaryAlertActive = true).
 * Uso: <div galiAlertHierarchy data-priority="secondary">...</div>
 */
@Directive({
  selector: '[galiAlertHierarchy]',
  standalone: true
})
export class AlertHierarchyDirective implements OnInit, OnDestroy {
  private el  = inject(ElementRef<HTMLElement>);
  private ws  = inject(GaliWorkspaceService);
  private cleanup?: () => void;

  ngOnInit(): void {
    const effectRef = effect(() => {
      const hasCritical = this.ws.primaryAlertActive();
      const priority    = this.el.nativeElement.getAttribute('data-priority');
      if (priority === 'secondary' && hasCritical) {
        this.el.nativeElement.style.display = 'none';
      } else {
        this.el.nativeElement.style.removeProperty('display');
      }
    });
    this.cleanup = () => effectRef.destroy();
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

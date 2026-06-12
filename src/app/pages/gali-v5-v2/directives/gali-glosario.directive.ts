import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

interface GlosarioEntry {
  simple: string;
  ejemplo?: string;
}

/** Glosario inteligente — democratiza la jerga para el dropshipper principiante. */
export const GLOSARIO: Record<string, GlosarioEntry> = {
  ROAS: {
    simple: 'Por cada $1 que gastas en anuncios, cuántos $ recuperas en ventas.',
    ejemplo: 'ROAS 2x = $2 en ventas por cada $1 de pauta. Lo mínimo para no perder depende de tu margen.',
  },
  PIL: {
    simple: 'Porcentaje de Inventario Liquidable: qué tan fácil vendes tu stock.',
  },
  'P&L': {
    simple: 'Ganancias y pérdidas: cuánto entró menos cuánto salió. Tu utilidad real, no el ROAS de Meta.',
  },
  CPA: {
    simple: 'Cuánto te costó conseguir una venta. Incluye anuncio + flete + novedad.',
  },
  novedad: {
    simple: 'Cualquier problema en la entrega: cliente no contestó, dirección mala, paquete perdido.',
  },
  huella: {
    simple: 'El registro de cada decisión que un agente tomó sobre un pedido: qué detectó, qué hizo y cuándo.',
  },
};

@Directive({
  selector: '[galiGlosario]',
  standalone: true,
})
export class GaliGlosarioDirective implements OnInit {
  @Input('galiGlosario') term = '';

  private host = inject(ElementRef<HTMLElement>);
  private r = inject(Renderer2);
  private tip?: HTMLElement;
  private marker?: HTMLElement;

  ngOnInit(): void {
    if (!GLOSARIO[this.term]) return;
    const seen = Number(localStorage.getItem(`gali-glos-${this.term}`) ?? 0);
    if (seen > 3) return; // aprendido — el ⓘ desaparece

    this.marker = this.r.createElement('sup');
    this.r.addClass(this.marker, 'gali-glos-mark');
    this.r.setStyle(this.marker, 'cursor', 'help');
    this.r.setStyle(this.marker, 'color', '#e58017');
    this.r.setStyle(this.marker, 'font-size', '0.7em');
    this.r.setStyle(this.marker, 'margin-left', '2px');
    this.r.setProperty(this.marker, 'textContent', 'ⓘ');
    this.r.appendChild(this.host.nativeElement, this.marker);
  }

  @HostListener('mouseenter')
  onEnter(): void {
    const entry = GLOSARIO[this.term];
    if (!entry) return;
    const seen = Number(localStorage.getItem(`gali-glos-${this.term}`) ?? 0);
    localStorage.setItem(`gali-glos-${this.term}`, String(seen + 1));

    this.tip = this.r.createElement('div');
    this.r.addClass(this.tip, 'gali-glos-tip');
    const html =
      `<strong>${this.term}</strong><span>${entry.simple}</span>` +
      (entry.ejemplo ? `<em>${entry.ejemplo}</em>` : '');
    this.r.setProperty(this.tip, 'innerHTML', html);
    Object.assign((this.tip as HTMLElement).style, {
      position: 'fixed',
      maxWidth: '260px',
      background: '#151921',
      color: '#fff',
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      lineHeight: '1.45',
      zIndex: '9999',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      pointerEvents: 'none',
    } as CSSStyleDeclaration);
    const tipEl = this.tip as HTMLElement;
    tipEl.querySelectorAll('em').forEach(e => {
      (e as HTMLElement).style.color = '#f2bc85';
      (e as HTMLElement).style.fontStyle = 'normal';
    });
    tipEl.querySelectorAll('span').forEach(e => ((e as HTMLElement).style.color = 'rgba(255,255,255,0.85)'));

    const rect = this.host.nativeElement.getBoundingClientRect();
    this.r.appendChild(document.body, this.tip);
    tipEl.style.left = `${Math.min(rect.left, window.innerWidth - 280)}px`;
    tipEl.style.top = `${rect.bottom + 6}px`;
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (this.tip) {
      this.r.removeChild(document.body, this.tip);
      this.tip = undefined;
    }
  }
}

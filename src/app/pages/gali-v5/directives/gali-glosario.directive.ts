import {
  Directive, ElementRef, Input, OnInit, OnDestroy,
  Renderer2, HostListener
} from '@angular/core';

export interface GlosarioEntry {
  simple: string;
  ejemplo?: string;
}

export const GLOSARIO: Record<string, GlosarioEntry> = {
  ROAS: {
    simple: 'Por cada $1 que gastas en pauta, cuánto en ventas recuperas. ROAS 2x = $2 en ventas por $1 invertido.',
    ejemplo: 'Si pagas $100.000 en Meta Ads y vendes $193.000, tu ROAS es 1.93x. El mínimo para no perder depende de tu margen (generalmente >2x).',
  },
  PIL: {
    simple: 'Porcentaje de Inventario Liquidable: qué tan fácil se venden tus productos vs cuánto tienes en stock.',
    ejemplo: 'PIL alto (>70%) significa que casi todo lo que tienes se está vendiendo. PIL bajo (<30%) indica que tienes producto empantanado.',
  },
  'P&L': {
    simple: 'Pérdidas y Ganancias: cuánto dinero real te quedó después de restar todos los costos (producto, pauta, flete, novedades).',
    ejemplo: 'Si vendiste $5M pero pagaste $3M en pauta + flete + novedades + comisiones, tu P&L real es $2M — no los $5M que muestra Meta.',
  },
  CPA: {
    simple: 'Costo por Adquisición: cuánto te costó conseguir una venta, incluyendo pauta, flete y novedades.',
    ejemplo: 'Si gastas $200.000 en pauta y consigues 10 pedidos, tu CPA de pauta es $20.000. Pero si 15% son novedades, el CPA real sube a ~$25.000.',
  },
  LTV: {
    simple: 'Valor de vida del cliente: cuánto en total te comprará un cliente durante toda su relación contigo.',
    ejemplo: 'Si un cliente te compra en promedio 2 veces al año durante 1.5 años con ticket promedio de $80.000, su LTV es $240.000.',
  },
  'Diagnóstico cruzado': {
    simple: 'Gali compara todos tus proyectos entre sí para encontrar patrones de éxito y fracaso.',
    ejemplo: 'Gali detecta que los 3 proyectos que más venden tienen en común: pauta >$50k/día + ROAS >2.5x en la primera semana + margen >35%.',
  },
  'Huella Vigilante': {
    simple: 'El registro de cada decisión que tomó Vigilante en este pedido: qué detectó, qué hizo y cuándo.',
    ejemplo: 'Vigilante detectó que la dirección estaba en zona de alta novedad (Cali Norte) → cambió a Servientrega → pedido entregado sin problema.',
  },
  Novedad: {
    simple: 'Cualquier problema en la entrega de un paquete: cliente no contestó, dirección incorrecta o paquete devuelto.',
    ejemplo: 'Una tasa de novedad del 15% significa que 15 de cada 100 pedidos tienen algún problema. El promedio sano en Colombia es <8%.',
  },
  margen: {
    simple: 'Porcentaje de ganancia real después de restar producto, pauta, flete y novedades.',
    ejemplo: 'Si vendes $1.000.000 y tus costos suman $780.000, tu margen es 22% — eso es lo que realmente te queda.',
  },
  Kronos: {
    simple: 'Tu agente financiero. Monitorea P&L, facturación y flujo de caja. Conectado a Siigo.',
    ejemplo: 'Kronos detecta que tu margen real es 22%, no el 38% que muestra Meta Ads — porque Meta no descuenta novedades ni flete real.',
  },
};

const STORAGE_PREFIX = 'gali_glosario_seen_';
const MAX_VIEWS_BEFORE_HIDE = 3;

@Directive({
  selector: '[galiGlosario]',
  standalone: true,
})
export class GaliGlosarioDirective implements OnInit, OnDestroy {
  @Input('galiGlosario') term: string | GlosarioEntry = '';

  private icon: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private expanded = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    const entry = this.resolveEntry();
    if (!entry) return;

    const termKey = typeof this.term === 'string' ? this.term : 'custom';
    const views = this.getViewCount(termKey);

    if (views >= MAX_VIEWS_BEFORE_HIDE) return;

    const host = this.el.nativeElement;
    this.renderer.setStyle(host, 'position', 'relative');
    this.renderer.setStyle(host, 'display', 'inline-flex');
    this.renderer.setStyle(host, 'align-items', 'center');
    this.renderer.setStyle(host, 'gap', '3px');

    const icon = this.renderer.createElement('span') as HTMLElement;
    icon.className = 'gali-glosario-icon';
    icon.textContent = 'ⓘ';
    icon.setAttribute('aria-label', `Definición de ${termKey}`);
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.style.cssText = `
      font-size: 10px;
      color: #858ea6;
      cursor: help;
      flex-shrink: 0;
      line-height: 1;
      transition: color 0.12s ease;
      user-select: none;
    `;

    icon.addEventListener('mouseenter', () => {
      icon.style.color = '#f49a3d';
      this.showPanel(entry, termKey);
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.color = '#858ea6';
    });
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel(entry, termKey);
    });

    this.renderer.appendChild(host, icon);
    this.icon = icon;
  }

  ngOnDestroy(): void {
    this.destroyPanel();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.destroyPanel();
  }

  private resolveEntry(): GlosarioEntry | null {
    if (typeof this.term === 'string') {
      return GLOSARIO[this.term] ?? null;
    }
    return this.term;
  }

  private showPanel(entry: GlosarioEntry, termKey: string): void {
    if (this.panel) return;
    this.incrementViewCount(termKey);
    this.buildPanel(entry, termKey);
  }

  private togglePanel(entry: GlosarioEntry, termKey: string): void {
    if (this.panel) {
      this.destroyPanel();
    } else {
      this.showPanel(entry, termKey);
    }
  }

  private buildPanel(entry: GlosarioEntry, termKey: string): void {
    const host = this.el.nativeElement;
    const panel = this.renderer.createElement('div') as HTMLElement;
    panel.className = 'gali-glosario-panel';

    const viewsLeft = Math.max(0, MAX_VIEWS_BEFORE_HIDE - this.getViewCount(termKey));
    const displayName = typeof this.term === 'string' ? this.term : 'Término';

    panel.innerHTML = `
      <div class="ggp__header">
        <span class="ggp__term">${displayName}</span>
        ${viewsLeft === 1 ? `<span class="ggp__fade-hint">Última vez que te lo muestro</span>` : ''}
      </div>
      <p class="ggp__simple">${entry.simple}</p>
      ${entry.ejemplo ? `
        <button class="ggp__ver-mas" type="button">Ver ejemplo →</button>
        <p class="ggp__ejemplo" style="display:none">${entry.ejemplo}</p>
      ` : ''}
    `;

    panel.style.cssText = `
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      z-index: 1000;
      background: #ffffff;
      border: 1px solid #e8eaf0;
      border-left: 3px solid #f49a3d;
      border-radius: 8px;
      padding: 10px 12px;
      min-width: 240px;
      max-width: 300px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      font-family: 'Inter', sans-serif;
      animation: gali-fade-up 0.15s ease-out forwards;
      pointer-events: auto;
    `;

    const verMasBtn = panel.querySelector('.ggp__ver-mas') as HTMLElement | null;
    const ejemploEl = panel.querySelector('.ggp__ejemplo') as HTMLElement | null;
    if (verMasBtn && ejemploEl) {
      verMasBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hidden = ejemploEl.style.display === 'none';
        ejemploEl.style.display = hidden ? 'block' : 'none';
        verMasBtn.textContent = hidden ? 'Ocultar ejemplo ↑' : 'Ver ejemplo →';
        this.expanded = hidden;
      });
    }

    panel.addEventListener('click', (e) => e.stopPropagation());

    this.renderer.appendChild(host, panel);
    this.panel = panel;

    if (this.getViewCount(termKey) >= MAX_VIEWS_BEFORE_HIDE && this.icon) {
      setTimeout(() => {
        if (this.icon) {
          this.icon.style.transition = 'opacity 0.3s ease';
          this.icon.style.opacity = '0';
          setTimeout(() => this.icon?.remove(), 300);
          this.icon = null;
        }
      }, 2000);
    }
  }

  private destroyPanel(): void {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
      this.expanded = false;
    }
  }

  private getViewCount(termKey: string): number {
    return parseInt(localStorage.getItem(`${STORAGE_PREFIX}${termKey}`) ?? '0', 10);
  }

  private incrementViewCount(termKey: string): void {
    const current = this.getViewCount(termKey);
    localStorage.setItem(`${STORAGE_PREFIX}${termKey}`, String(current + 1));
  }
}

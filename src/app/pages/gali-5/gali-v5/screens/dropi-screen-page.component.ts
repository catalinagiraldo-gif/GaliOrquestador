import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  DropiScreenConfig,
  DropiScreenLayout,
  DropiTableColumn,
  DropiTableRow,
  getScreenConfig,
} from './dropi-screens.registry';
import { Gali6ScreenContextService } from '../../../gali-6/services/gali6-screen-context.service';
import { Gali6ChatService } from '../../../gali-6/gali-chat/gali6-chat.service';
import { AGENTES_ESPECIALIZADOS } from '../../../../../../mocks/gali-v6/agentes-especializados';

@Component({
  selector: 'app-dropi-screen-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dropi-screen-page.component.html',
  styleUrl: './dropi-screen-page.component.scss',
})
export class DropiScreenPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly screenCtx = inject(Gali6ScreenContextService);
  private readonly chat = inject(Gali6ChatService);

  academyCourses = signal<AcademyCourse[]>([]);
  activeSecurityTab = signal(0);

  config = signal<DropiScreenConfig | null>(null);
  rows = signal<DropiTableRow[]>([]);

  readonly String = String;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const screenId = data['screenId'] as string;
      const cfg = getScreenConfig(screenId);
      this.config.set(cfg);
      this.rows.set(cfg?.getMockRows() ?? []);
      if (cfg?.id === 'academy') {
        this.loadAcademyCourses();
      } else {
        this.academyCourses.set([]);
      }
      this.publishScreenAwareness(screenId, cfg);
    });
  }

  /**
   * Screen-awareness: 3 pantallas con comportamiento específico narrado en
   * 18.FlujoUsuarioGali6.md (Flujo A, Flujo B y Flujo D) + 4 pantallas más de
   * Financiero con solo banner de contexto (misma familia "Analítica" que
   * Facturas pendientes, sin mensaje proactivo). El resto de las ~13
   * pantallas genéricas de este componente quedan sin publicar contexto, tal
   * como documenta el backlog en Gali6.md §Modelo de intervención de Gali
   * por sección (decisión de PlanChat.md §B4: evitar alcance descontrolado
   * extendiendo esto a las 25 pantallas a la vez).
   */
  private publishScreenAwareness(screenId: string, cfg: DropiScreenConfig | null): void {
    if (screenId === 'garantias-recolecciones' && cfg) {
      // Flujo A (§1.2): sección operativa — Gali interviene sin que se le pregunte.
      const stockGuardian = AGENTES_ESPECIALIZADOS.find(a => a.id === 'stock-guardian');
      this.screenCtx.publish({
        route: this.router.url,
        viewId: 'garantias-recolecciones',
        viewLabel: cfg.title,
        summary: '3 en riesgo de stock-out',
      });
      if (stockGuardian?.ejemploSenal) {
        this.chat.pushProactiveAlert(
          'stock-guardian::collar-gps',
          `${stockGuardian.ejemploSenal} — hay 14 recolecciones pendientes de ese producto.`,
          {
            kind: 'acciones',
            acciones: [
              { label: 'Pausar recolección de Collar GPS mientras repones stock', actionId: 'pausar-recoleccion::collar-gps', isPrimary: true },
              { label: 'Ahora no', actionId: 'cancelar' },
            ],
          },
        );
      }
      return;
    }

    if (screenId === 'facturas-pendientes' && cfg) {
      // Flujo B (§1.3): sección analítica — Gali no interrumpe, solo responde si se le pregunta (ver regla en gali6-chat.service.ts).
      this.screenCtx.publish({
        route: this.router.url,
        viewId: 'facturas-pendientes',
        viewLabel: cfg.title,
        summary: `${this.rows().length} facturas`,
      });
      return;
    }

    // Resto de Financiero — misma familia "Analítica" que Facturas pendientes (Gali6.md
    // §Modelo de intervención: pasiva por defecto). Solo banner de contexto, sin mensaje
    // proactivo ni regla reactiva nueva — extensión chica pedida además de los Flujos A-D.
    const FINANCIERO_ANALITICO: Record<string, (rowsCount: number) => string | undefined> = {
      'datos-bancarios': n => `${n} cuentas bancarias`,
      'retiros-de-saldo': n => `${n} retiros`,
      'notas-credito': n => `${n} notas crédito`,
      'datos-facturacion': () => undefined, // pantalla de formulario, sin filas que contar
    };
    if (screenId in FINANCIERO_ANALITICO && cfg) {
      this.screenCtx.publish({
        route: this.router.url,
        viewId: screenId,
        viewLabel: cfg.title,
        summary: FINANCIERO_ANALITICO[screenId](this.rows().length),
      });
      return;
    }

    if (screenId === 'integraciones-config' && cfg) {
      // Flujo D (§1.5): pantalla stub — Gali admite el límite en vez de fingir capacidad (ver regla "recuperación explicada" en gali6-chat.service.ts).
      this.screenCtx.publish({
        route: this.router.url,
        viewId: 'integraciones-config',
        viewLabel: cfg.title,
      });
    }
  }

  setSecurityTab(i: number): void { this.activeSecurityTab.set(i); }

  userParentLines(val: unknown): string[] {
    return String(val ?? '').split('\n').filter(Boolean);
  }

  isListLayout(layout: DropiScreenLayout): boolean {
    return ['list', 'list-orders', 'list-cas', 'list-logistics', 'list-etiquetas', 'list-descargas', 'garantias-table'].includes(layout);
  }

  isEtiquetasLayout(layout: DropiScreenLayout): boolean {
    return layout === 'list-etiquetas';
  }

  isDescargasLayout(layout: DropiScreenLayout): boolean {
    return layout === 'list-descargas';
  }

  isSpecialHead(cfg: DropiScreenConfig): boolean {
    return cfg.toolbarVariant === 'novedades'
      || cfg.toolbarVariant === 'bulk-export'
      || cfg.layout === 'list-orders'
      || cfg.layout === 'list-etiquetas'
      || cfg.layout === 'bank-table';
  }

  isEntrada(row: DropiTableRow): boolean {
    const tipo = String(row.cells['tipo'] ?? '');
    return tipo.includes('ENTRADA') || String(row.cells['monto'] ?? '').startsWith('+');
  }

  dataColumns(cols: DropiTableColumn[]): DropiTableColumn[] {
    return cols.filter(c => c.type !== 'checkbox');
  }

  hasMultiline(cols?: DropiTableColumn[]): boolean {
    return cols?.some(c => c.multiline) ?? false;
  }

  isMultiline(value: unknown): value is string[] {
    return Array.isArray(value);
  }

  asLines(value: unknown): string[] {
    return Array.isArray(value) ? value : [String(value ?? '')];
  }

  shouldBadge(key: string, cfg: DropiScreenConfig): boolean {
    return ['estado', 'tipo', 'prioridad', 'estatusOrden', 'estatusGuia', 'riesgo'].includes(key)
      || (cfg.layout === 'list-orders' && key === 'estado');
  }

  statusTagClass(value: unknown): string {
    const v = String(value ?? '').toLowerCase();
    if (/entreg|aprob|activ|conect|listo|generada|success|entrada|alta/.test(v)) return 'dropi-page__tag dropi-page__tag--success';
    if (/pend|revis|program|proces|media|warning|noved/.test(v)) return 'dropi-page__tag dropi-page__tag--warning';
    if (/cancel|rechaz|error|baja|vencid|salida|riesgo/.test(v)) return 'dropi-page__tag dropi-page__tag--error';
    if (/transit|info|escal/.test(v)) return 'dropi-page__tag dropi-page__tag--info';
    return 'dropi-page__tag dropi-page__tag--neutral';
  }

  marketingTitleKey(cfg: DropiScreenConfig): string {
    if (cfg.id === 'automatizacion') return 'flujo';
    if (cfg.id === 'creador-de-paginas') return 'pagina';
    return 'campana';
  }

  planPrice(i: number): string {
    return ['$ 0 / mes', '$ 89.000 / mes', 'Personalizado'][i] ?? '$ 0';
  }

  planFeatures(i: number): string[] {
    const all = [
      ['Hasta 100 pedidos/mes', 'Catálogo básico', 'Soporte email'],
      ['Pedidos ilimitados', 'Marketing automation', 'Prioridad CAS', 'API access'],
      ['SLA dedicado', 'Account manager', 'Integraciones custom'],
    ];
    return all[i] ?? all[0];
  }

  academyTagClass(tagColor: string): string {
    switch (tagColor) {
      case 'secondary':
        return 'academy-course__tag academy-course__tag--secondary';
      case 'info':
        return 'academy-course__tag academy-course__tag--info';
      default:
        return 'academy-course__tag academy-course__tag--primary';
    }
  }

  academyUniqueTagsCount(): number {
    return new Set(this.academyCourses().map(course => course.tagLabel)).size;
  }

  academyUniqueInstructorsCount(): number {
    return new Set(this.academyCourses().map(course => course.instructorName)).size;
  }

  scrollAcademyCourses(direction: 'left' | 'right'): void {
    const container = document.querySelector('.academy-v5__courses-scroll') as HTMLElement | null;
    if (!container) return;
    const offset = 272;
    container.scrollLeft += direction === 'right' ? offset : -offset;
  }

  formFieldPairs(id: string): { label: string; value: string; type: string; placeholder?: string }[][] {
    const fields = this.accountFormFields(id);
    const pairs: { label: string; value: string; type: string; placeholder?: string }[][] = [];
    for (let i = 0; i < fields.length; i += 2) {
      pairs.push(fields.slice(i, i + 2));
    }
    return pairs;
  }

  accountFormFields(id: string): { label: string; value: string; type: string; placeholder?: string }[] {
    if (id === 'datos-personales') {
      return [
        { label: 'Primer nombre', value: '', type: 'text', placeholder: 'Primer nombre' },
        { label: 'Segundo nombre (Opcional)', value: '', type: 'text', placeholder: 'Segundo nombre' },
        { label: 'Primer apellido', value: '', type: 'text', placeholder: 'Primer apellido' },
        { label: 'Segundo apellido (Opcional)', value: '', type: 'text', placeholder: 'Segundo apellido' },
        { label: 'Tipo de documento', value: 'CC', type: 'text' },
        { label: 'Número de documento', value: '', type: 'text', placeholder: 'Número de documento' },
        { label: 'Correo electrónico', value: 'valentina@dropitienda.co', type: 'text' },
        { label: 'Teléfono', value: '+57 300 123 4567', type: 'text' },
      ];
    }
    return this.formFields();
  }

  dropicardBalance(): string {
    return String(this.rows()[0]?.cells['valor'] ?? '$ 0');
  }

  btnClass(variant?: string): string {
    if (variant === 'outline') return 'btn-v5 btn-v5--outline';
    if (variant === 'secondary') return 'btn-v5 btn-v5--ghost';
    return 'btn-v5 btn-v5--primary';
  }

  formFields(): { label: string; value: string; type: string }[] {
    const id = this.config()?.id ?? '';
    const map: Record<string, { label: string; value: string; type: string }[]> = {
      preferencias: [
        { label: 'Transportadora preferida', value: 'ENVIA', type: 'select' },
        { label: 'Servicio express', value: 'Activado', type: 'select' },
        { label: 'Validar dirección automáticamente', value: 'Sí', type: 'select' },
      ],
      'configuracion-de-tienda': [
        { label: 'Nombre de tienda', value: 'Dropi Tienda', type: 'text' },
        { label: 'URL tienda', value: 'dropitienda.myshopify.com', type: 'text' },
        { label: 'Moneda', value: 'COP', type: 'select' },
        { label: 'País', value: 'Colombia', type: 'select' },
      ],
      'preferencias-cuenta': [
        { label: 'Idioma', value: 'Español', type: 'select' },
        { label: 'Notificaciones email', value: 'Activadas', type: 'select' },
        { label: 'Zona horaria', value: 'America/Bogota', type: 'select' },
      ],
      'datos-facturacion': [
        { label: 'Razón social', value: 'Dropi Tienda SAS', type: 'text' },
        { label: 'NIT', value: '901.234.567-8', type: 'text' },
        { label: 'Régimen tributario', value: 'Régimen común', type: 'select' },
        { label: 'Responsabilidad IVA', value: 'Responsable de IVA', type: 'select' },
        { label: 'Correo de facturación electrónica', value: 'facturacion@dropitienda.co', type: 'text' },
        { label: 'Dirección fiscal', value: 'Cra 45 # 12-30, Bogotá', type: 'text' },
      ],
    };
    return map[id] ?? [
      { label: 'Campo 1', value: 'Valor de ejemplo', type: 'text' },
      { label: 'Campo 2', value: 'Valor de ejemplo', type: 'text' },
    ];
  }

  private loadAcademyCourses(): void {
    this.http.get<AcademyCourse[]>('/api/academy').subscribe(courses => {
      this.academyCourses.set(courses ?? []);
    });
  }
}

interface AcademyCourse {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tagLabel: string;
  tagColor: string;
  modules: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
}

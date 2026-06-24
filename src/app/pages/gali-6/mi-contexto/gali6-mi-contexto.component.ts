import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import { MOCK_ALERTAS } from '../../../../../mocks/gali-v5/senales.mock';
import LEDGER from '../../../../../mocks/gali-v5/impact-ledger.json';
import { MOCK_HOY_ESTADO, ProyectoContrib } from '../../../../../mocks/gali-v6/hoy-estado';

type Tab = 'senales' | 'impacto' | 'operacion';
type EditTab = 'gali' | 'manual' | 'sub';

const VALID_TABS: Tab[] = ['senales', 'impacto', 'operacion'];

interface SubMeta {
  id: string;
  label: string;
  lograda: boolean;
}

@Component({
  selector: 'app-gali6-mi-contexto',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Gali6PageHeaderComponent],
  templateUrl: './gali6-mi-contexto.component.html',
  styleUrl: './gali6-mi-contexto.component.scss',
})
export class Gali6MiContextoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly activeTab = signal<Tab>('senales');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] as Tab;
      if (tab && VALID_TABS.includes(tab)) {
        this.activeTab.set(tab);
      }
    });
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  // ── Tab 1: Señales ────────────────────────────────────────────────────────
  readonly alertasCriticas = MOCK_ALERTAS.filter(a => a.tipo === 'critical');
  readonly alertasDiagnostico = MOCK_ALERTAS.filter(a => a.tipo === 'warning');

  readonly actividadReciente = [
    { id: 'a1', accion: 'Escaló campaña Difusor +15%', agente: 'Roax', hora: 'hace 12 min', impacto: '+8 pedidos estimados' },
    { id: 'a2', accion: 'Cambió 4 pedidos a Envia · Cali', agente: 'Vigilante', hora: 'hace 2h', impacto: '$42.000 ahorro flete' },
    { id: 'a3', accion: 'Resolvió 3 novedades WhatsApp', agente: 'Chatea Pro', hora: 'hace 4h', impacto: '3 pedidos recuperados' },
  ];

  // ── Tab 2: Impacto ────────────────────────────────────────────────────────
  readonly impactoSemana = (LEDGER as any).summary_semana;
  readonly impactoAcum = (LEDGER as any).summary_acumulado;
  readonly impactoActions = (LEDGER as any).actions as Array<{
    id: string; descripcion: string; agente: string; impacto_label: string; agente_color: string;
  }>;

  // ── Tab 3: Mi Operación ───────────────────────────────────────────────────
  readonly objetivo = signal('Llegar a 100 pedidos por semana en los próximos 3 meses');
  readonly objetivoTextoEdit = signal('');
  readonly metaPct = signal(47);
  readonly mayorFriccion = signal('ads');
  readonly canalPrincipal = signal('meta');
  readonly siigoCon = signal(false);

  readonly subMetas = signal<SubMeta[]>([
    { id: 'sm-1', label: 'Tener 2 proyectos activos', lograda: true },
    { id: 'sm-2', label: 'Alcanzar ROAS > 1.8x en al menos 1 campaña', lograda: true },
    { id: 'sm-3', label: 'Reducir tasa de novedad a < 10%', lograda: false },
    { id: 'sm-4', label: 'Primer proyecto en modo escala', lograda: false },
    { id: 'sm-5', label: 'Llegar a 100 ped/sem por 2 semanas seguidas', lograda: false },
  ]);

  readonly proyectoContribuciones: ProyectoContrib[] =
    MOCK_HOY_ESTADO.proyectoContribuciones ?? [];

  readonly pedidosMeta = MOCK_HOY_ESTADO.pedidosMeta;

  readonly friccionOpts = [
    { id: 'stock', label: 'Stock / Proveedor' },
    { id: 'ads', label: 'Pauta y creativos' },
    { id: 'pedidos', label: 'Gestión de pedidos' },
    { id: 'otro', label: 'Otro' },
  ];

  readonly canalOpts = [
    { id: 'meta', label: 'Meta Ads' },
    { id: 'tiktok', label: 'TikTok Ads' },
    { id: 'ambos', label: 'Ambos' },
  ];

  // ── Modal editar objetivo ─────────────────────────────────────────────────
  readonly editOpen = signal(false);
  readonly editTab = signal<EditTab>('gali');
  readonly galiMejorandoObjetivo = signal(false);
  readonly objetivoMejorado = signal<string | null>(null);
  readonly nuevaSubMetaTexto = signal('');
  readonly galiDefiniendoHito = signal(false);
  readonly hitoPropuesto = signal<string | null>(null);

  openEdit(): void {
    this.router.navigate(['/gali-6/mi-negocio/objetivo']);
  }

  closeEdit(): void {
    this.editOpen.set(false);
    this.objetivoMejorado.set(null);
    this.hitoPropuesto.set(null);
    this.nuevaSubMetaTexto.set('');
  }

  saveEdit(): void {
    if (this.objetivoTextoEdit().trim()) {
      this.objetivo.set(this.objetivoTextoEdit().trim());
    }
    this.editOpen.set(false);
  }

  mejorarConGali(): void {
    this.galiMejorandoObjetivo.set(true);
    this.objetivoMejorado.set(null);
    setTimeout(() => {
      this.galiMejorandoObjetivo.set(false);
      this.objetivoMejorado.set(
        'Alcanzar 100 pedidos semanales en 12 semanas, comenzando con Meta Ads y escalando a TikTok en semana 5. Meta de margen neto: mínimo 28% por pedido.'
      );
    }, 1200);
  }

  aceptarObjetivoGali(): void {
    if (this.objetivoMejorado()) {
      this.objetivo.set(this.objetivoMejorado()!);
      this.objetivoMejorado.set(null);
      this.editOpen.set(false);
    }
  }

  definirHitoConGali(): void {
    const texto = this.nuevaSubMetaTexto().trim();
    if (!texto) return;
    this.galiDefiniendoHito.set(true);
    this.hitoPropuesto.set(null);
    setTimeout(() => {
      this.galiDefiniendoHito.set(false);
      this.hitoPropuesto.set(
        `Lograr: ${texto.charAt(0).toUpperCase() + texto.slice(1)}, medible en las próximas 4 semanas con seguimiento semanal.`
      );
    }, 1000);
  }

  aceptarHito(): void {
    if (this.hitoPropuesto()) {
      this.subMetas.update(prev => [
        ...prev,
        { id: 'sm-' + Date.now(), label: this.hitoPropuesto()!, lograda: false },
      ]);
      this.hitoPropuesto.set(null);
      this.nuevaSubMetaTexto.set('');
    }
  }

  toggleSubMeta(id: string): void {
    this.subMetas.update(prev =>
      prev.map(sm => sm.id === id ? { ...sm, lograda: !sm.lograda } : sm)
    );
  }

  getContribPct(p: ProyectoContrib): number {
    return Math.min(100, Math.round((p.pedidosSem / this.pedidosMeta) * 100));
  }

  getContribGap(): number {
    const usado = this.proyectoContribuciones.reduce((s, p) => s + p.pedidosSem, 0);
    return Math.max(0, Math.round(((this.pedidosMeta - usado) / this.pedidosMeta) * 100));
  }

  getGapCount(): number {
    const usado = this.proyectoContribuciones.reduce((s, p) => s + p.pedidosSem, 0);
    return Math.max(0, this.pedidosMeta - usado);
  }
}

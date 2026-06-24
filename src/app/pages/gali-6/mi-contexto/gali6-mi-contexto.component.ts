import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import { MOCK_ALERTAS } from '../../../../../mocks/gali-v5/senales.mock';
import LEDGER from '../../../../../mocks/gali-v5/impact-ledger.json';

type Tab = 'senales' | 'impacto' | 'operacion';

const VALID_TABS: Tab[] = ['senales', 'impacto', 'operacion'];

@Component({
  selector: 'app-gali6-mi-contexto',
  standalone: true,
  imports: [CommonModule, RouterModule, Gali6PageHeaderComponent],
  templateUrl: './gali6-mi-contexto.component.html',
  styleUrl: './gali6-mi-contexto.component.scss',
})
export class Gali6MiContextoComponent implements OnInit {
  private route = inject(ActivatedRoute);

  readonly activeTab = signal<Tab>('senales');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] as Tab;
      if (tab && VALID_TABS.includes(tab)) {
        this.activeTab.set(tab);
      }
    });
  }

  // ── Tab 3: Impacto ────────────────────────────────────────────────────────
  readonly impactoSemana = (LEDGER as any).summary_semana;
  readonly impactoAcum = (LEDGER as any).summary_acumulado;
  readonly impactoActions = (LEDGER as any).actions as Array<{
    id: string; descripcion: string; agente: string; impacto_label: string; agente_color: string;
  }>;

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

  // ── Tab 3: Mi Operación ───────────────────────────────────────────────────
  readonly objetivo = signal('Llegar a 100 pedidos por semana en los próximos 3 meses');
  readonly metaPct = signal(70);
  readonly mayorFriccion = signal('ads');
  readonly canalPrincipal = signal('meta');
  readonly siigoCon = signal(false);

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

  readonly galiMejorandoObjetivo = signal(false);
  readonly objetivoMejorado = signal<string | null>(null);

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
    }
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AGENTES_ESPECIALIZADOS,
  AgenteEspecializado,
  AgenteTier,
  AgenteProcesoTipo,
  PROCESO_TIPO_LABEL,
  PROCESO_TIPO_TOOLTIP,
  TIER_LABEL,
} from '../../../../../mocks/gali-v6/agentes-especializados';

type TierFiltro = 'todos' | AgenteTier;
type TipoFiltro = 'todos' | AgenteProcesoTipo;

interface SkillMkt {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: AgenteProcesoTipo;
  tier: AgenteTier;
  precioCopMes?: number;
  tokensUso?: number;
  activa: boolean;
  icono: string;
}

interface ConexionPreview {
  id: string;
  nombre: string;
  glyph: string;
  estado: 'conectado' | 'pendiente' | 'proximamente';
}

interface ReglaGlobal {
  id: string;
  condicion: string;
  accion: string;
  activa: boolean;
}

interface AgenteComun {
  id: string;
  nombre: string;
  descripcionCorta: string;
  autor: string;
  icono: string;
  colorAvatar: string;
  tier: AgenteTier;
  precioCopMes?: number;
}

@Component({
  selector: 'app-gali6-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gali6-marketplace.component.html',
  styleUrls: ['./gali6-marketplace.component.scss'],
})
export class Gali6MarketplaceComponent {
  readonly router = inject(Router);

  readonly todosLosAgentes = AGENTES_ESPECIALIZADOS;
  readonly procesoTipoLabel = PROCESO_TIPO_LABEL;
  readonly procesoTipoTooltip = PROCESO_TIPO_TOOLTIP;
  readonly tierLabel = TIER_LABEL;

  readonly tierFiltro = signal<TierFiltro>('todos');
  readonly tipoFiltro = signal<TipoFiltro>('todos');
  readonly toastMsg = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly seccionTab = signal<'todos' | 'mis-agentes' | 'comunidad'>('todos');
  readonly detalleAgente = signal<AgenteEspecializado | null>(null);

  readonly tierTabs: { value: TierFiltro; label: string }[] = [
    { value: 'todos',  label: 'Todos' },
    { value: 'free',   label: 'Gratis' },
    { value: 'paid',   label: 'Pago' },
    { value: 'tokens', label: 'Tokens' },
  ];

  readonly tipoTabs: { value: TipoFiltro; label: string }[] = [
    { value: 'todos',         label: 'Todos los tipos' },
    { value: 'deterministico',label: 'Determinístico' },
    { value: 'ia-ligera',     label: 'IA ligera' },
    { value: 'ia-compleja',   label: 'IA compleja' },
  ];

  readonly agentesFiltrados = computed(() => {
    const tier = this.tierFiltro();
    const tipo = this.tipoFiltro();
    const q = this.searchQuery().toLowerCase().trim();
    return this.todosLosAgentes.filter(ag => {
      const matchTier = tier === 'todos' || ag.tier === tier;
      const matchTipo = tipo === 'todos' || ag.tipo === tipo;
      const matchQ = !q || ag.nombre.toLowerCase().includes(q) || ag.descripcionCorta.toLowerCase().includes(q);
      return matchTier && matchTipo && matchQ;
    });
  });

  readonly agentesActivos = computed(() =>
    this.todosLosAgentes.filter(ag => ag.estado === 'activo')
  );

  readonly reglasGlobales = signal<ReglaGlobal[]>([
    { id: 'rg1', condicion: 'Presupuesto diario total > $500.000', accion: 'Detener toda pauta y notificarme', activa: true },
    { id: 'rg2', condicion: 'ROAS de cualquier campaña < 0.8x por 2 días seguidos', accion: 'Pausar campaña y crear alerta crítica', activa: true },
    { id: 'rg3', condicion: 'Stock de cualquier producto < 20 unidades', accion: 'Pausar campaña asociada automáticamente', activa: false },
    { id: 'rg4', condicion: 'Novedad > 25% en algún producto esta semana', accion: 'Bloquear pauta y notificarme para revisar transportadora', activa: true },
  ]);

  readonly agentesComun: AgenteComun[] = [
    { id: 'com-1', nombre: 'PriceBot Lite', descripcionCorta: 'Monitorea precios de competencia en Dropi y sugiere ajustes', autor: '@juandropi', icono: 'pi pi-tag', colorAvatar: '#0ea5e9', tier: 'free' },
    { id: 'com-2', nombre: 'WhatsBot CX', descripcionCorta: 'Responde FAQs por WhatsApp Business usando plantillas', autor: '@marketingpro', icono: 'pi pi-comments', colorAvatar: '#22c55e', tier: 'tokens', precioCopMes: undefined },
    { id: 'com-3', nombre: 'TikTok Trend Scanner', descripcionCorta: 'Detecta tendencias de TikTok Colombia relevantes para tu categoría', autor: '@contenidopro', icono: 'pi pi-video', colorAvatar: '#f43f5e', tier: 'paid', precioCopMes: 25000 },
  ];

  /** Skills marketplace */
  readonly skillsEstado = signal<SkillMkt[]>([
    { id: 'sk-brujula',   nombre: 'Brújula financiera',    descripcion: 'Calcula P&L real por campaña: ingresos, costos, flete, novedades y garantías.',    tipo: 'deterministico', tier: 'free',   activa: true,  icono: 'pi pi-compass' },
    { id: 'sk-roi',       nombre: 'Análisis ROI',           descripcion: 'ROI por producto y canal con datos reales de Dropi.',                               tipo: 'deterministico', tier: 'free',   activa: true,  icono: 'pi pi-chart-bar' },
    { id: 'sk-angulos',   nombre: 'Ángulos de venta',       descripcion: 'Genera variaciones de copy y creativos usando IA basada en tus ventas.',           tipo: 'ia-ligera',      tier: 'free',   activa: false, icono: 'pi pi-pen-to-square' },
    { id: 'sk-logopt',    nombre: 'Optimización logística', descripcion: 'Sugiere transportadora según tasa de novedad histórica por ciudad.',                tipo: 'deterministico', tier: 'paid',   precioCopMes: 15000, activa: false, icono: 'pi pi-truck' },
    { id: 'sk-copyad',    nombre: 'Copy publicitario',      descripcion: 'Crea copies para Meta y TikTok Ads adaptados a tus mejores productos.',            tipo: 'ia-compleja',    tier: 'tokens', tokensUso: 3, activa: false, icono: 'pi pi-bullhorn' },
    { id: 'sk-forecast',  nombre: 'Forecast de demanda',    descripcion: 'Predice pedidos de la próxima semana usando tendencias y estacionalidad.',         tipo: 'ia-ligera',      tier: 'paid',   precioCopMes: 20000, activa: false, icono: 'pi pi-wave-pulse' },
    { id: 'sk-cxaudit',   nombre: 'Auditoría de CX',        descripcion: 'Detecta patrones de queja en WhatsApp y propone mejoras de proceso.',              tipo: 'ia-ligera',      tier: 'free',   activa: false, icono: 'pi pi-search' },
  ]);

  /** Conexiones preview */
  readonly conexionesPreview: ConexionPreview[] = [
    { id: 'meta',   nombre: 'Meta Ads',      glyph: '◈', estado: 'conectado'    },
    { id: 'shopify',nombre: 'Shopify',       glyph: '▤', estado: 'conectado'    },
    { id: 'drive',  nombre: 'Google Drive',  glyph: '▦', estado: 'conectado'    },
    { id: 'sheets', nombre: 'Google Sheets', glyph: '▤', estado: 'pendiente'    },
    { id: 'notion', nombre: 'Notion',        glyph: '▣', estado: 'proximamente' },
    { id: 'tiktok', nombre: 'TikTok Ads',    glyph: '♪', estado: 'pendiente'    },
  ];

  setTierFiltro(v: TierFiltro): void { this.tierFiltro.set(v); }
  setTipoFiltro(v: TipoFiltro): void { this.tipoFiltro.set(v); }

  getProcesoClass(tipo: AgenteProcesoTipo): string {
    const map: Record<AgenteProcesoTipo, string> = {
      deterministico: 'tipo--deterministic',
      'ia-ligera': 'tipo--ia-ligera',
      'ia-compleja': 'tipo--ia-compleja',
    };
    return map[tipo];
  }

  abrirDetalle(ag: AgenteEspecializado): void {
    this.detalleAgente.set(ag);
  }

  cerrarDetalle(): void {
    this.detalleAgente.set(null);
  }

  activarDesdeDetalle(): void {
    this.cerrarDetalle();
    this.router.navigate(['/gali-6/agentes']);
  }

  activarAgente(ag: AgenteEspecializado): void {
    this.abrirDetalle(ag);
  }

  toggleReglaGlobal(id: string): void {
    this.reglasGlobales.update(list =>
      list.map(r => r.id === id ? { ...r, activa: !r.activa } : r)
    );
  }

  toggleSkill(skillId: string): void {
    this.skillsEstado.update(list =>
      list.map(sk => sk.id === skillId ? { ...sk, activa: !sk.activa } : sk)
    );
    const sk = this.skillsEstado().find(s => s.id === skillId);
    if (sk) {
      this.showToast(sk.activa ? `✦ Skill "${sk.nombre}" activada` : `Skill "${sk.nombre}" desactivada`);
    }
  }

  irAConexiones(): void {
    this.router.navigate(['/gali-6/conexiones']);
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 2500);
  }
}

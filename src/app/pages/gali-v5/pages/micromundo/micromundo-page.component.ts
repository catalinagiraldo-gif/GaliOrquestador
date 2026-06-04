import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

type UploadSource = 'csv' | 'drive' | 'shopify' | 'meta';

interface UploadCard {
  id: UploadSource;
  emoji: string;
  label: string;
  sub: string;
  placeholder: string;
  connected: boolean;
}

interface BusinessNode {
  id: string;
  type: 'proyecto' | 'campana' | 'pedidos' | 'proveedor' | 'transportadora';
  label: string;
  sublabel: string;
  color: string;
  kpi: string;
  kpiLabel: string;
  trend?: 'up' | 'down' | 'stable';
}

interface BehaviorItem {
  type: 'skill' | 'decision' | 'alerta' | 'regla';
  text: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-micromundo-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './micromundo-page.component.html',
  styleUrl: './micromundo-page.component.scss',
})
export class MicromundoPageComponent {
  private ws = inject(GaliWorkspaceService);
  private route = inject(ActivatedRoute);

  readonly activeTab = signal<'perfil' | 'grafo' | 'comportamiento' | 'documentos'>('perfil');
  readonly showUploadModal = signal<UploadSource | null>(null);
  readonly uploadInput = signal('');
  readonly uploadSuccess = signal<UploadSource | null>(null);

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'documentos') {
        this.activeTab.set('documentos');
      }
    });
  }

  readonly uploadCards: UploadCard[] = [
    { id: 'csv', emoji: '📊', label: 'CSV de WMS', sub: 'Sube tu archivo de pedidos, SKUs o inventario', placeholder: 'Arrastra tu CSV aquí o haz clic para seleccionar', connected: false },
    { id: 'drive', emoji: '📁', label: 'Google Drive', sub: 'Conecta Drive para acceder a creativos, fichas y contratos', placeholder: 'Pega el link de tu carpeta de Drive', connected: false },
    { id: 'shopify', emoji: '🛍', label: 'Tienda Shopify', sub: 'Gali sincroniza tu catálogo e inventario automáticamente', placeholder: 'Pega la URL de tu tienda (ej: mitienda.myshopify.com)', connected: false },
    { id: 'meta', emoji: '📘', label: 'Meta Ads', sub: 'Gali lee tus campañas activas y ROAS real sin salir de Dropi', placeholder: 'ID de cuenta Meta Ads (ej: act_1234567890)', connected: true },
  ];

  readonly businessNodes: BusinessNode[] = [
    { id: 'p1', type: 'proyecto', label: 'Collar GPS Mascotas', sublabel: 'Activo · 3 semanas', color: '#f97316', kpi: '$4.2M', kpiLabel: 'ingresos', trend: 'up' },
    { id: 'p2', type: 'proyecto', label: 'Skincare K-Beauty', sublabel: 'Activo · 5 semanas', color: '#818cf8', kpi: '$2.9M', kpiLabel: 'ingresos', trend: 'stable' },
    { id: 'p3', type: 'proyecto', label: 'Bandas Fitness', sublabel: 'Pausado', color: '#9ca3af', kpi: '$0.8M', kpiLabel: 'ingresos', trend: 'down' },
    { id: 'c1', type: 'campana', label: 'Meta Ads · Video B', sublabel: 'ROAS 3.2×', color: '#1877f2', kpi: '3.2×', kpiLabel: 'ROAS' },
    { id: 'c2', type: 'campana', label: 'TikTok Shop · Video 47s', sublabel: 'ROAS 4.1×', color: '#010101', kpi: '4.1×', kpiLabel: 'ROAS' },
    { id: 'ped', type: 'pedidos', label: 'Pedidos activos', sublabel: '47 hoy · 3 críticos', color: '#fbbf24', kpi: '47', kpiLabel: 'pedidos' },
    { id: 'prov1', type: 'proveedor', label: 'ZenAroma Colombia', sublabel: 'Stock: Alto', color: '#34d399', kpi: '95%', kpiLabel: 'disponibilidad' },
    { id: 'prov2', type: 'proveedor', label: 'TechPet Latam', sublabel: 'Stock: Medio', color: '#34d399', kpi: '72%', kpiLabel: 'disponibilidad' },
    { id: 'tsp1', type: 'transportadora', label: 'Servientrega', sublabel: '3.8% novedad', color: '#22c55e', kpi: '3.8%', kpiLabel: 'novedad' },
    { id: 'tsp2', type: 'transportadora', label: 'Coordinadora', sublabel: '15% novedad ⚠', color: '#ef4444', kpi: '15%', kpiLabel: 'novedad' },
  ];

  readonly behaviorItems: BehaviorItem[] = [
    { type: 'skill', text: 'Activó "Auto-pausa si CTR cae" para Roax', time: 'hace 2h', icon: '⚡' },
    { type: 'decision', text: 'Aprobó redireccionamiento de 12 pedidos a Servientrega', time: 'hace 2h', icon: '✅' },
    { type: 'alerta', text: 'Ignoró alerta de novedad lunes — patrón detectado', time: 'hace 1 día', icon: '🔕' },
    { type: 'skill', text: 'Configuró escalamiento ROAS → presupuesto +20% al superar 4.5×', time: 'hace 2 días', icon: '⚡' },
    { type: 'regla', text: 'Creó regla: Nunca pausar campañas entre 8pm–10pm', time: 'hace 3 días', icon: '🛡' },
    { type: 'decision', text: 'Rechazó sugerencia de Kronos: no escalar Bandas Fitness', time: 'hace 4 días', icon: '❌' },
    { type: 'alerta', text: 'Respondió a CAS ticket #4821 en < 5 minutos', time: 'hace 5 días', icon: '💬' },
  ];

  get connectedSources(): number {
    return this.uploadCards.filter(c => c.connected || this.uploadSuccess() === c.id).length;
  }

  openUpload(source: UploadSource): void {
    this.uploadInput.set('');
    this.showUploadModal.set(source);
  }

  confirmUpload(): void {
    const src = this.showUploadModal();
    if (src) {
      this.uploadSuccess.set(src);
    }
    this.showUploadModal.set(null);
  }

  isConnected(id: UploadSource): boolean {
    const card = this.uploadCards.find(c => c.id === id);
    const connectedFromOnboarding = this.ws.connectedSources().some(s =>
      (id === 'meta' && s === 'meta') ||
      (id === 'drive' && s === 'drive') ||
      (id === 'csv' && s === 'csv') ||
      (id === 'shopify' && s === 'shopify')
    );
    return !!(card?.connected || this.uploadSuccess() === id || connectedFromOnboarding);
  }

  nodeTypeLabel(type: BusinessNode['type']): string {
    return { proyecto: 'Proyecto', campana: 'Campaña', pedidos: 'Pedidos', proveedor: 'Proveedor', transportadora: 'Transportadora' }[type];
  }

  trendIcon(t?: 'up' | 'down' | 'stable'): string {
    if (t === 'up') return '↑';
    if (t === 'down') return '↓';
    return '→';
  }

  behaviorTypeLabel(type: BehaviorItem['type']): string {
    return { skill: 'Skill activada', decision: 'Decisión', alerta: 'Alerta ignorada', regla: 'Regla creada' }[type];
  }
}

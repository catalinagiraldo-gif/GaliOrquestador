import { Component, inject, signal, computed } from '@angular/core';
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
  type: 'proyecto' | 'campana' | 'pedidos' | 'proveedor' | 'transportadora' | 'fuente';
  label: string;
  sublabel: string;
  color: string;
  kpi: string;
  kpiLabel: string;
  trend?: 'up' | 'down' | 'stable';
  connected?: boolean;
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
  readonly showProfileChecklist = signal(false);

  readonly profileChecklist = [
    { label: 'Conectar Meta Ads', done: true, ruta: '/gali-v5/conexiones' },
    { label: 'Subir catálogo de productos', done: true, ruta: '/gali-v5/productos/catalogo' },
    { label: 'Conectar Siigo', done: false, ruta: '/gali-v5/mi-negocio' },
    { label: 'Definir objetivo mensual de pedidos', done: false, ruta: '/gali-v5/mi-negocio' },
    { label: 'Activar primer agente', done: false, ruta: '/gali-v5/agentes' },
  ];

  readonly profileCompletenessPercent = computed(() => {
    const done = this.profileChecklist.filter(i => i.done).length;
    return Math.round((done / this.profileChecklist.length) * 100);
  });

  resetGlosario(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith('gali_glosario_seen_'))
      .forEach(k => localStorage.removeItem(k));
  }

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

  readonly selectedNodeId = signal<string | null>(null);

  readonly graphPositions: Record<string, { x: number; y: number }> = {
    gali:    { x: 50, y: 45 },
    p1:      { x: 28, y: 22 },
    p2:      { x: 52, y: 16 },
    p3:      { x: 75, y: 24 },
    c1:      { x: 15, y: 45 },
    c2:      { x: 20, y: 65 },
    ped:     { x: 68, y: 52 },
    prov1:   { x: 35, y: 72 },
    prov2:   { x: 55, y: 78 },
    tsp1:    { x: 78, y: 70 },
    tsp2:    { x: 82, y: 50 },
    meta:    { x: 8,  y: 30 },
    tiktok:  { x: 8,  y: 58 },
    drive:   { x: 40, y: 90 },
    siigo:   { x: 88, y: 35 },
  };

  readonly graphEdges: Array<[string, string]> = [
    ['gali', 'p1'], ['gali', 'p2'], ['gali', 'p3'],
    ['p1', 'c1'], ['p1', 'ped'], ['p1', 'prov2'],
    ['p2', 'c2'], ['p2', 'ped'],
    ['p3', 'ped'],
    ['ped', 'tsp1'], ['ped', 'tsp2'],
    ['p1', 'tsp2'], ['prov1', 'p2'],
    ['gali', 'meta'], ['gali', 'tiktok'], ['gali', 'drive'], ['gali', 'siigo'],
  ];

  readonly selectedNode = computed(() =>
    this.businessNodes.find(n => n.id === this.selectedNodeId()) ?? null
  );

  readonly graphEdgeRelations: Record<string, string> = {
    'gali-p1':    'orquesta',
    'gali-p2':    'orquesta',
    'gali-p3':    'orquesta',
    'p1-c1':      'lanza campaña',
    'p1-ped':     'genera pedidos',
    'p1-prov2':   'abastece de',
    'p2-c2':      'lanza campaña',
    'p2-ped':     'genera pedidos',
    'p3-ped':     'genera pedidos',
    'ped-tsp1':   'envía con',
    'ped-tsp2':   'envía con',
    'p1-tsp2':    'novedad ⚠',
    'prov1-p2':   'provee stock',
    'gali-meta':  'lee datos',
    'gali-tiktok':'lee datos',
    'gali-drive': 'sin conectar',
    'gali-siigo': 'sin conectar',
  };

  selectNode(id: string): void {
    this.selectedNodeId.set(this.selectedNodeId() === id ? null : id);
  }

  isNodeHighlighted(id: string): boolean {
    const sel = this.selectedNodeId();
    if (!sel) return false;
    if (sel === id) return true;
    return this.graphEdges.some(([a, b]) => (a === sel && b === id) || (b === sel && a === id));
  }

  isEdgeHighlighted(a: string, b: string): boolean {
    const sel = this.selectedNodeId();
    if (!sel) return false;
    return (a === sel || b === sel);
  }

  getConnectedNodes(id: string): Array<{ node: BusinessNode; relation: string }> {
    const results: Array<{ node: BusinessNode; relation: string }> = [];
    for (const [a, b] of this.graphEdges) {
      if (a === id || b === id) {
        const otherId = a === id ? b : a;
        const node = this.businessNodes.find(n => n.id === otherId);
        if (node) {
          results.push({ node, relation: this.graphEdgeRelations[`${a}-${b}`] ?? 'conectado' });
        }
      }
    }
    return results;
  }

  getEdgeRelation(a: string, b: string): string {
    return this.graphEdgeRelations[`${a}-${b}`] ?? '';
  }

  midX(a: string, b: string): number {
    const pa = this.graphPositions[a], pb = this.graphPositions[b];
    return pa && pb ? (pa.x + pb.x) / 2 : 0;
  }

  midY(a: string, b: string): number {
    const pa = this.graphPositions[a], pb = this.graphPositions[b];
    return pa && pb ? (pa.y + pb.y) / 2 : 0;
  }

  getNodeAgent(type: string): string {
    const map: Record<string, string> = {
      proyecto: 'Kronos', campana: 'ROAX',
      pedidos: 'Vigilante', proveedor: 'Vigilante', transportadora: 'Vigilante',
    };
    return map[type] ?? 'Gali';
  }

  getNodeRoute(id: string): string {
    const map: Record<string, string> = {
      gali: '/gali-v5', p1: '/gali-v5/proyectos', p2: '/gali-v5/proyectos',
      p3: '/gali-v5/proyectos', c1: '/gali-v5/marketing/roax', c2: '/gali-v5/marketing/roax',
      ped: '/gali-v5/mis-pedidos', prov1: '/gali-v5/logistica', prov2: '/gali-v5/logistica',
      tsp1: '/gali-v5/novedades', tsp2: '/gali-v5/novedades',
    };
    return map[id] ?? '/gali-v5';
  }

  getNodeRouteLabel(id: string): string {
    const map: Record<string, string> = {
      gali: 'Abrir Hub', p1: 'Ver proyecto', p2: 'Ver proyecto',
      p3: 'Ver proyecto', c1: 'Ver en ROAX', c2: 'Ver en ROAX',
      ped: 'Ver pedidos', prov1: 'Ver logística', prov2: 'Ver logística',
      tsp1: 'Ver novedades', tsp2: 'Ver novedades',
    };
    return map[id] ?? 'Abrir';
  }

  readonly businessNodes: BusinessNode[] = [
    { id: 'gali', type: 'proyecto', label: '✦ Gali', sublabel: 'Orquestador central', color: '#f49a3d', kpi: '10', kpiLabel: 'nodos' },
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
    { id: 'meta', type: 'fuente', label: 'Meta Ads', sublabel: 'Conectado · 2 cuentas', color: '#1877f2', kpi: '2 ctas', kpiLabel: 'activas', connected: true },
    { id: 'tiktok', type: 'fuente', label: 'TikTok Shop', sublabel: 'Conectado', color: '#010101', kpi: '1 perfil', kpiLabel: 'activo', connected: true },
    { id: 'drive', type: 'fuente', label: 'Google Drive', sublabel: 'Sin conectar', color: '#ea4335', kpi: '—', kpiLabel: 'creativos', connected: false },
    { id: 'siigo', type: 'fuente', label: 'Siigo', sublabel: 'Sin conectar — 28 sin facturar', color: '#9ca3af', kpi: '28', kpiLabel: 'sin facturar', connected: false },
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
    return ({ proyecto: 'Proyecto', campana: 'Campaña', pedidos: 'Pedidos', proveedor: 'Proveedor', transportadora: 'Transportadora', fuente: 'Fuente externa' } as Record<string, string>)[type] ?? type;
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

import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';

interface Mcp {
  nombre: string; glyph: string; estado: 'conectado' | 'pendiente' | 'urgente' | 'proximamente';
  dato: string; contexto: string;
  campanasActivas?: number;
  tipo: 'pauta' | 'logistica' | 'contabilidad' | 'comunicacion' | 'contexto';
}
interface NubeItem {
  id: string; nombre: string; glyph: string;
  estado: 'conectado' | 'pendiente' | 'proximamente';
}
interface ArchivoLocal {
  id: string; nombre: string; tamano: string; fecha: string;
}

@Component({
  selector: 'app-gali6-conexiones-casa',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliGlosarioDirective, Gali6PageHeaderComponent],
  templateUrl: './gali6-conexiones-casa.component.html',
  styleUrl: './gali6-conexiones-casa.component.scss',
})
export class Gali6ConexionesCasaComponent {
  readonly mcps: Mcp[] = [
    { nombre: 'Meta Ads',            glyph: '◈', estado: 'conectado',    tipo: 'pauta',         campanasActivas: 3, dato: 'Campañas, ROAS declarado, CTR y gasto de pauta.', contexto: 'calcular tu ROAS real, detectar saturación de creativos y proponer escalas.' },
    { nombre: 'TikTok Ads',          glyph: '♪', estado: 'conectado',    tipo: 'pauta',         campanasActivas: 2, dato: 'Métricas de campañas y audiencias de TikTok.', contexto: 'comparar canales y diversificar dónde inviertes tu pauta.' },
    { nombre: 'Shopify',             glyph: '▤', estado: 'conectado',    tipo: 'contexto',      dato: 'Pedidos, productos y conversión de tu tienda.', contexto: 'cruzar ventas reales con pauta y medir tu conversión por producto.' },
    { nombre: 'Google Drive',        glyph: '▦', estado: 'conectado',    tipo: 'contexto',      dato: 'Archivos, catálogos y documentos de tu operación.', contexto: 'leer tus listas de costos y darte recomendaciones con tu propia data.' },
    { nombre: 'WhatsApp Business',   glyph: '◌', estado: 'urgente',      tipo: 'comunicacion',  dato: 'Confirmaciones, posventa y recuperación de carritos.', contexto: 'confirmar pedidos automáticamente y reducir tu tasa de novedad.' },
    { nombre: 'Siigo',               glyph: '▣', estado: 'urgente',      tipo: 'contabilidad',  dato: '$450k sin facturar · 6 días sin sync · riesgo tributario.', contexto: 'registrar cada venta en contabilidad y evitar inconsistencias tributarias.' },
    { nombre: 'DHL Colombia',        glyph: '◇', estado: 'pendiente',    tipo: 'logistica',     dato: 'Guías, tiempos de entrega y tarifas de flete.', contexto: 'comparar operadoras y elegir la más rápida según ciudad de destino.' },
    { nombre: 'Coordinadora',        glyph: '◆', estado: 'pendiente',    tipo: 'logistica',     dato: 'Seguimiento de paquetes y tarifas por región.', contexto: 'optimizar flete en rutas costosas y detectar acumulación de novedades.' },
    { nombre: 'MercadoLibre',        glyph: '◉', estado: 'pendiente',    tipo: 'pauta',         dato: 'Publicaciones, ventas y métricas de ML Ads.', contexto: 'diversificar canales de venta y detectar qué productos funcionan mejor en ML.' },
    { nombre: 'Klaviyo',             glyph: '◎', estado: 'proximamente', tipo: 'comunicacion',  dato: 'Email marketing y automatizaciones de retención.', contexto: 'crear campañas de remarketing con clientes que ya compraron.' },
    { nombre: 'AppVir',              glyph: '◐', estado: 'proximamente', tipo: 'logistica',     dato: 'Gestión de envíos y coordinación logística.', contexto: 'gestionar tu logística desde un solo lugar con visibilidad total.' },
    { nombre: 'MSP Colombia',        glyph: '◑', estado: 'proximamente', tipo: 'logistica',     dato: 'Mensajería y cobertura regional ampliada.', contexto: 'llegar a zonas sin cobertura de transportadoras principales.' },
  ];

  readonly archivosNube: NubeItem[] = [
    { id: 'drive',  nombre: 'Google Drive',  glyph: '▦', estado: 'conectado'     },
    { id: 'sheets', nombre: 'Google Sheets', glyph: '▤', estado: 'pendiente'     },
    { id: 'notion', nombre: 'Notion',        glyph: '▣', estado: 'proximamente'  },
  ];

  archivosLocales = signal<ArchivoLocal[]>([
    { id: 'f1', nombre: 'lista-costos.xlsx',   tamano: '45 KB',  fecha: 'Jun 20, 2026' },
    { id: 'f2', nombre: 'catalogo-Q2.csv',     tamano: '120 KB', fecha: 'Jun 18, 2026' },
    { id: 'f3', nombre: 'precios-mayo.xlsx',   tamano: '32 KB',  fecha: 'Jun 12, 2026' },
  ]);

  isDragOver = signal(false);
  uploadToast = signal<string | null>(null);

  // ── G6: Panel detalle conexión ────────────────────────────────────────────
  readonly panelMcp = signal<Mcp | null>(null);
  readonly apiKeyInput = signal('');
  readonly syncing = signal(false);
  readonly syncDone = signal(false);
  readonly conectando = signal(false);

  abrirPanel(mcp: Mcp): void {
    this.panelMcp.set(mcp);
    this.apiKeyInput.set('');
    this.syncing.set(false);
    this.syncDone.set(false);
    this.conectando.set(false);
  }

  cerrarPanel(): void { this.panelMcp.set(null); }

  sincronizarAhora(): void {
    this.syncing.set(true);
    setTimeout(() => { this.syncing.set(false); this.syncDone.set(true); }, 1500);
  }

  conectarMcp(): void {
    if (!this.apiKeyInput().trim()) return;
    this.conectando.set(true);
    setTimeout(() => { this.conectando.set(false); this.cerrarPanel(); }, 1800);
  }

  getPasosConexion(mcp: Mcp): string[] {
    const base: Record<string, string[]> = {
      'DHL Colombia': [
        'Ingresa a portal.dhl.com y accede a tu cuenta',
        'Ve a "Integraciones" → "API Access"',
        'Genera una nueva API Key para "Business Integrations"',
        'Pega la clave aquí y haz clic en "Conectar"',
      ],
      'Coordinadora': [
        'Accede a tu cuenta en coordinadora.com',
        'Ve a "Mi cuenta" → "Integraciones" → "API"',
        'Solicita un token de integración',
        'Pega el token aquí y haz clic en "Conectar"',
      ],
      'MercadoLibre': [
        'Ve a developers.mercadolibre.com',
        'Crea una aplicación en "Mis Apps"',
        'Obtén el Client ID y Client Secret',
        'Pega las credenciales aquí y autoriza el acceso',
      ],
    };
    return base[mcp.nombre] ?? [
      `Accede al portal de ${mcp.nombre}`,
      'Ve a la sección de integraciones / API',
      'Genera una clave de acceso',
      'Pégala aquí y haz clic en "Conectar"',
    ];
  }

  getProyectosConexion(mcp: Mcp): Array<{ nombre: string; campanas: number }> {
    const data: Record<string, Array<{ nombre: string; campanas: number }>> = {
      'Meta Ads': [
        { nombre: 'Collar GPS — Escalando', campanas: 2 },
        { nombre: 'K-Beauty — Bajo rendimiento', campanas: 1 },
      ],
      'TikTok Ads': [
        { nombre: 'Collar GPS — Escalando', campanas: 1 },
      ],
      'Shopify': [
        { nombre: 'Collar GPS — Escalando', campanas: 3 },
        { nombre: 'Estrategia Q3', campanas: 1 },
      ],
    };
    return data[mcp.nombre] ?? [];
  }

  get conectadas(): number { return this.mcps.filter(m => m.estado === 'conectado').length; }
  get urgentes(): number   { return this.mcps.filter(m => m.estado === 'urgente').length; }

  readonly conocimientos = [
    { fuente: 'Meta Ads', dato: 'CPM promedio $3.20 · CTR mejor en creativos de video · Mejor horario 18-22h', icono: '◈' },
    { fuente: 'TikTok Ads', dato: 'CPC $180 · Audiencias 18-28 años más receptivas · Formato vertical 9:16 convierte 2.4x más', icono: '♪' },
    { fuente: 'Shopify', dato: 'Conversión promedio 2.8% · Ticket promedio $68.000 · 62% compradores recurrentes', icono: '▤' },
    { fuente: 'Google Drive', dato: 'Costos actualizados Jun 2026 · Catálogo con 94 productos · Margen promedio 34%', icono: '▦' },
  ];

  readonly tipoLabels: Record<string, string> = {
    pauta: 'Pauta', logistica: 'Logística', contabilidad: 'Contabilidad',
    comunicacion: 'Comunicación', contexto: 'Contexto',
  };

  @HostListener('dragover', ['$event'])
  onGlobalDragOver(e: DragEvent) { e.preventDefault(); }

  onDropZoneDragEnter() { this.isDragOver.set(true); }
  onDropZoneDragLeave() { this.isDragOver.set(false); }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.processFiles(files);
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.processFiles(files);
    input.value = '';
  }

  private processFiles(files: File[]): void {
    if (!files.length) return;
    const nuevos: ArchivoLocal[] = files.map(f => ({
      id: 'f' + Date.now() + Math.random(),
      nombre: f.name,
      tamano: this.formatSize(f.size),
      fecha: 'Jun 24, 2026',
    }));
    this.archivosLocales.update(prev => [...nuevos, ...prev]);
    const label = files.length === 1
      ? `✦ Gali procesó "${files[0].name}". Ya está disponible como contexto.`
      : `✦ Gali procesó ${files.length} archivos. Ya están disponibles como contexto.`;
    this.uploadToast.set(label);
    setTimeout(() => this.uploadToast.set(null), 4000);
  }

  eliminarArchivo(id: string): void {
    this.archivosLocales.update(prev => prev.filter(f => f.id !== id));
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getNubeCtaLabel(estado: NubeItem['estado']): string {
    return { conectado: 'Gestionar', pendiente: 'Conectar', proximamente: 'Próximamente' }[estado];
  }
}

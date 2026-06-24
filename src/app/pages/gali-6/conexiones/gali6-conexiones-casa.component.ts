import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';

interface Mcp {
  nombre: string; glyph: string; estado: 'conectado' | 'pendiente' | 'urgente';
  dato: string; contexto: string;
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
    { nombre: 'Meta Ads', glyph: '◈', estado: 'conectado', dato: 'Campañas, ROAS declarado, CTR y gasto de pauta.', contexto: 'calcular tu ROAS real, detectar saturación de creativos y proponer escalas.' },
    { nombre: 'Shopify', glyph: '▤', estado: 'conectado', dato: 'Pedidos, productos y conversión de tu tienda.', contexto: 'cruzar ventas reales con pauta y medir tu conversión por producto.' },
    { nombre: 'Google Drive', glyph: '▦', estado: 'conectado', dato: 'Archivos, catálogos y documentos de tu operación.', contexto: 'leer tus listas de costos y darte recomendaciones con tu propia data.' },
    { nombre: 'Chatea Pro', glyph: '◌', estado: 'urgente', dato: 'WhatsApp: confirmaciones y recuperación de carritos.', contexto: 'confirmar pedidos automáticamente y reducir tu tasa de novedad.' },
    { nombre: 'Siigo', glyph: '▣', estado: 'urgente', dato: '$450k sin facturar · 6 días sin sync · riesgo tributario.', contexto: 'registrar cada venta en contabilidad y evitar inconsistencias tributarias.' },
    { nombre: 'TikTok Ads', glyph: '♪', estado: 'pendiente', dato: 'Métricas de campañas y audiencias de TikTok.', contexto: 'comparar canales y diversificar dónde inviertes tu pauta.' },
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

  get conectadas(): number { return this.mcps.filter(m => m.estado === 'conectado').length; }
  get urgentes(): number   { return this.mcps.filter(m => m.estado === 'urgente').length; }

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

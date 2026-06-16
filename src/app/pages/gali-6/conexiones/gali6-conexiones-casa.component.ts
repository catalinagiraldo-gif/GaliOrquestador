import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';

interface Mcp {
  nombre: string; glyph: string; estado: 'conectado' | 'pendiente' | 'urgente';
  dato: string; contexto: string;
}

@Component({
  selector: 'app-gali6-conexiones-casa',
  standalone: true,
  imports: [CommonModule, GaliGlosarioDirective, Gali6PageHeaderComponent],
  template: `
    <div class="cnx gali-stagger-in">
      <app-g6-page-header
        [breadcrumbs]="['Conexiones']"
        title="Conexiones"
        sub="Lo que conectas es lo que Gali usa para decidir por ti. Estas 5 fuentes le dan el contexto de tu negocio." />
      <div class="cnx__bar">
        <div class="cnx__count">
          <span class="cnx__count-ok">{{ conectadas }} conectadas</span>
          <span class="cnx__count-warn">{{ urgentes }} requieren atención</span>
        </div>
        <div class="cnx__glos">
          <span class="cnx__glos-label">Métricas que Gali calcula:</span>
          <span galiGlosario="ROAS" class="cnx__glos-tag">ROAS</span>
          <span galiGlosario="CPA" class="cnx__glos-tag">CPA</span>
          <span galiGlosario="novedad" class="cnx__glos-tag">Novedad</span>
        </div>
      </div>
      <div class="cnx__grid">
        @for (m of mcps; track m.nombre) {
          <article class="mcp" [attr.data-estado]="m.estado">
            <div class="mcp__top">
              <span class="mcp__glyph" aria-hidden="true">{{ m.glyph }}</span>
              <span class="mcp__name">{{ m.nombre }}</span>
              <span class="mcp__dot" [attr.data-estado]="m.estado"></span>
            </div>
            <p class="mcp__dato">{{ m.dato }}</p>
            <p class="mcp__contexto"><span aria-hidden="true">✦</span> Le da contexto a Gali para: {{ m.contexto }}</p>
            <button class="mcp__cta" [attr.data-estado]="m.estado" data-proto-skip>
              {{ m.estado === 'conectado' ? 'Gestionar' : m.estado === 'urgente' ? 'Reconectar ahora' : 'Conectar' }}
            </button>
          </article>
        }
      </div>
      <footer class="cnx__more">
        <span class="cnx__more-label">Próximamente</span>
        <div class="cnx__more-chips">
          @for (x of proximamente; track x) {
            <span class="cnx__chip">{{ x }}</span>
          }
        </div>
      </footer>
    </div>
  `,
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
  readonly proximamente = ['TikTok Shop', 'Notion', 'Google Sheets', 'Page Pilot'];
  get conectadas(): number { return this.mcps.filter(m => m.estado === 'conectado').length; }
  get urgentes(): number { return this.mcps.filter(m => m.estado === 'urgente').length; }
}

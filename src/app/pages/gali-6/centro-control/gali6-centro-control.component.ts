import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import SKILLS from '../../../../../mocks/gali-v5/skill-rules.json';

type TabId = 'agentes' | 'skills' | 'reglas' | 'marketplace';

interface Agente {
  id: string; nombre: string; subtitulo: string; glyph: string; color: string;
  on: boolean; ultimaAccion: string; tasaExito: number; desc: string; urgente?: boolean;
}

@Component({
  selector: 'app-gali6-centro-control',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliGlosarioDirective, Gali6PageHeaderComponent],
  template: `
    <div class="cc gali-stagger-in">
      <app-g6-page-header
        [breadcrumbs]="['Centro de Gali']"
        title="Centro de Gali"
        sub="La maquinaria que opera tu negocio de fondo. Gali la orquesta — tú ajustas cuándo quieres.">
        <span g6Actions class="cc__modo-tag">Solo modo experto</span>
      </app-g6-page-header>

      <!-- Diagrama de jerarquía -->
      <section class="onto" aria-label="Cómo funciona Gali">
        <div class="onto__node onto__node--gali"><strong>Gali 6</strong><span>orquesta</span></div>
        <span class="onto__arrow" aria-hidden="true">→</span>
        <div class="onto__node"><strong>Agentes</strong><span>ejecutan</span></div>
        <span class="onto__arrow" aria-hidden="true">→</span>
        <div class="onto__node"><strong>Skills</strong><span>capacidades</span></div>
        <span class="onto__plus" aria-hidden="true">+</span>
        <div class="onto__node"><strong>Reglas</strong><span>límites</span></div>
      </section>

      <!-- Nav de tabs -->
      <nav class="cc-tabs" role="tablist">
        @for (t of tabs; track t.id) {
          <button class="cc-tab" role="tab"
                  [class.cc-tab--active]="activeTab() === t.id"
                  [attr.aria-selected]="activeTab() === t.id"
                  (click)="activeTab.set(t.id)">
            {{ t.label }}
            @if (t.count) { <span class="cc-tab__badge">{{ t.count }}</span> }
          </button>
        }
      </nav>

      <!-- ── AGENTES ── -->
      @if (activeTab() === 'agentes') {
        <div class="agents" role="tabpanel">
          <p class="cc-intro">
            Cada agente se especializa en un dominio. Gali los activa según las señales de tu negocio.
            <span class="cc-intro__tasa-hint">
              ⓘ <span class="cc-intro__tooltip">Tasa de éxito = acciones ejecutadas sin intervención manual ÷ total activadas × 100. Benchmark industria: 70%+</span>
            </span>
          </p>
          <div class="agents__grid">
            @for (a of agentes(); track a.id; let i = $index) {
              <article class="agent" [class.agent--off]="!a.on" [class.agent--urgente]="a.urgente"
                       [style.animation-delay]="(i * 60) + 'ms'">
                <div class="agent__accent" [style.background]="a.color"></div>
                <div class="agent__body">
                  <div class="agent__top">
                    <span class="agent__glyph" [style.color]="a.color" aria-hidden="true">{{ a.glyph }}</span>
                    <div class="agent__meta">
                      <strong class="agent__nombre">{{ a.nombre }}</strong>
                      <span class="agent__sub">{{ a.subtitulo }}</span>
                    </div>
                    <button class="agent__toggle" [class.agent__toggle--on]="a.on"
                            [attr.aria-label]="(a.on ? 'Desactivar' : 'Activar') + ' ' + a.nombre"
                            (click)="$event.stopPropagation(); toggleAgente(a.id)">
                      {{ a.on ? 'ON' : 'OFF' }}
                    </button>
                  </div>
                  <p class="agent__desc">{{ a.desc }}</p>
                  <p class="agent__accion" [class.agent__accion--warn]="a.urgente">
                    {{ a.ultimaAccion }}
                  </p>
                  <div class="agent__tasa-row">
                    <div class="agent__tasa-bar">
                      <div class="agent__tasa-fill" [style.width.%]="a.tasaExito"
                           [style.background]="a.on ? a.color : '#d1d5db'"></div>
                    </div>
                    <span class="agent__tasa-val">{{ a.tasaExito }}% éxito</span>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      }

      <!-- ── SKILLS ── -->
      @if (activeTab() === 'skills') {
        <div class="skills" role="tabpanel">
          <p class="cc-intro">Las skills son automatizaciones que Gali activa según condiciones que defines. Cada skill tiene un trigger, una condición y una acción.</p>
          @for (sk of skills; track sk['id']) {
            <article class="skill">
              <div class="skill__top">
                <div class="skill__dot" [attr.data-status]="sk['status']"></div>
                <strong class="skill__name">{{ sk['nombre'] }}</strong>
                <span class="skill__status" [attr.data-status]="sk['status']">
                  {{ sk['status'] === 'active' ? 'Activa' : 'Pausada' }}
                </span>
              </div>
              <p class="skill__desc">{{ sk['descripcion'] }}</p>
              <div class="skill__meta">
                <span>{{ sk['ejecuciones_total'] }} ejecuciones</span>
                <span>Última: {{ sk['ultima_ejecucion'] }}</span>
                <span>Agente: {{ sk['trigger']?.['agent'] }}</span>
              </div>
            </article>
          }
          <button class="cc-add-btn" data-proto-skip>+ Nueva skill</button>
        </div>
      }

      <!-- ── REGLAS ── -->
      @if (activeTab() === 'reglas') {
        <div class="rules" role="tabpanel">
          <p class="cc-intro">Las reglas son instrucciones en lenguaje natural que limitan cómo actúa Gali. Escríbelas como le hablarías a un asistente.</p>
          @for (r of reglas; track r.id) {
            <article class="rule">
              <span class="rule__dot" [class.rule__dot--on]="r.activa" aria-hidden="true"></span>
              <div class="rule__body">
                <p class="rule__texto">"{{ r.texto }}"</p>
                <span class="rule__agente">→ {{ r.agente }}</span>
              </div>
            </article>
          }
          <button class="cc-add-btn" data-proto-skip>+ Nueva regla</button>
        </div>
      }

      <!-- ── MARKETPLACE ── -->
      @if (activeTab() === 'marketplace') {
        <div class="mkt" role="tabpanel">
          <p class="cc-intro">Extensions de la comunidad de dropshippers y Dropi Labs. Instala lo que ya le funciona a otros.</p>
          <div class="mkt__grid">
            @for (m of marketplace; track m.nombre) {
              <article class="mkt-card">
                <span class="mkt-card__glyph" aria-hidden="true">{{ m.glyph }}</span>
                <strong class="mkt-card__name">{{ m.nombre }}</strong>
                <p class="mkt-card__desc">{{ m.desc }}</p>
                <div class="mkt-card__footer">
                  <span class="mkt-card__autor">{{ m.autor }}</span>
                  <span class="mkt-card__installs">{{ m.installs | number }} installs</span>
                </div>
                <button class="mkt-card__cta" data-proto-skip>Instalar</button>
              </article>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './gali6-centro-control.component.scss',
})
export class Gali6CentroControlComponent {
  readonly activeTab = signal<TabId>('agentes');

  readonly tabs: Array<{ id: TabId; label: string; count?: number }> = [
    { id: 'agentes', label: 'Agentes', count: 5 },
    { id: 'skills', label: 'Skills', count: 5 },
    { id: 'reglas', label: 'Reglas', count: 4 },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  readonly agentes = signal<Agente[]>([
    {
      id: 'roax', nombre: 'Roax', subtitulo: 'Ads Manager', glyph: '⚡', color: '#f59e0b',
      on: true, tasaExito: 87,
      ultimaAccion: 'Escaló Video B +$15k/día · hace 12 min',
      desc: 'Optimiza campañas de Meta Ads de forma autónoma — ajusta presupuesto, pausa creativos saturados y escala lo que convierte.',
    },
    {
      id: 'vigilante', nombre: 'Vigilante', subtitulo: 'Logistics Monitor', glyph: '◎', color: '#22c55e',
      on: true, tasaExito: 91,
      ultimaAccion: 'Detectó novedad 15% Coordinadora Bogotá · hace 3h',
      desc: 'Monitorea tu tasa de novedad en tiempo real. Propone cambio de transportadora antes de que el problema escale.',
    },
    {
      id: 'ada', nombre: 'ADA Spy', subtitulo: 'Market Intelligence', glyph: '◇', color: '#8b5cf6',
      on: true, tasaExito: 79,
      ultimaAccion: 'Tendencia Difusor +34% conversión Cali · hace 1h',
      desc: 'Analiza tendencias LATAM y el catálogo Dropi para identificar productos ganadores antes que la competencia.',
    },
    {
      id: 'chatea', nombre: 'Chatea Pro', subtitulo: 'Customer Success', glyph: '◌', color: '#06b6d4',
      on: false, tasaExito: 94, urgente: true,
      ultimaAccion: '⚠ Sin conexión WhatsApp — reconectar para reanudar',
      desc: 'Confirma pedidos por WhatsApp y recupera carritos abandonados. Requiere reconexión en Conexiones.',
    },
    {
      id: 'kronos', nombre: 'Kronos', subtitulo: 'Finance Tracker', glyph: '▦', color: '#f97316',
      on: true, tasaExito: 88,
      ultimaAccion: 'Registró $85.000 en novedades evitadas · hace 4h',
      desc: 'Cruza tus ventas en Dropi con Siigo para mantener el P&L actualizado sin intervención manual.',
    },
  ]);

  readonly skills = (SKILLS as any[]).slice(0, 5);

  readonly reglas = [
    { id: 'r1', texto: 'Nunca pausar una campaña si el ROAS real supera 2.0x, aunque el CTR caiga', activa: true, agente: 'Roax' },
    { id: 'r2', texto: 'Confirmar siempre antes de aumentar el presupuesto diario más de $50.000 en una sola acción', activa: true, agente: 'Roax' },
    { id: 'r3', texto: 'Avisar si algún proveedor tiene menos de 100 unidades antes de escalar la campaña', activa: true, agente: 'Vigilante' },
    { id: 'r4', texto: 'No ejecutar acciones en cuentas publicitarias entre las 11pm y las 6am', activa: true, agente: 'Gali' },
  ];

  readonly marketplace = [
    { glyph: '◈', nombre: 'ROAS Sentinel', desc: 'Alerta multicanal cuando el ROAS cae bajo umbral personalizado', autor: 'Dropi Labs', installs: 1240 },
    { glyph: '▤', nombre: 'Catalog Sync Pro', desc: 'Sincroniza tu catálogo Shopify con el inventario del proveedor en tiempo real', autor: 'Comunidad', installs: 876 },
    { glyph: '◌', nombre: 'WhatsApp Templates', desc: 'Plantillas de confirmación y recuperación de carrito listas para Chatea Pro', autor: 'Dropi Labs', installs: 2104 },
    { glyph: '◇', nombre: 'TikTok Trend Radar', desc: 'Extiende ADA Spy con señales de TikTok Shop y trending sounds', autor: 'Comunidad', installs: 431 },
  ];

  toggleAgente(id: string): void {
    this.agentes.update(list => list.map(a => a.id === id ? { ...a, on: !a.on } : a));
  }
}

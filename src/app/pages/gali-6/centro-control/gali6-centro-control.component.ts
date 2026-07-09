import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import { Gali6AgentesComponent } from '../agentes/gali6-agentes.component';
import { ReglasPageComponent } from '../../gali-5/gali-v5/pages/reglas/reglas-page.component';
import { SkillsPageComponent } from '../../gali-5/gali-v5/pages/skills/skills-page.component';
import { Gali6ConexionesCasaComponent } from '../conexiones/gali6-conexiones-casa.component';
import { Gali6ImpactoLedgerComponent } from '../impacto/gali6-impacto-ledger.component';
import { Gali6MarketplaceComponent } from '../marketplace/gali6-marketplace.component';

type TabId = 'agentes' | 'reglas' | 'conexiones' | 'marketplace';

/**
 * Centro de Gali — hub consolidado (Señales independiente + Centro de Gali unificado,
 * decisiones del 7 jul: keys/reglas/marketplace/conexiones/contexto en un solo lugar,
 * skills dentro de reglas, impacto reencuadrado como "Lo que Gali hizo").
 * Cada tab embebe el componente real ya construido — este archivo es solo el shell
 * de navegación por tabs, no duplica lógica ni datos.
 */
@Component({
  selector: 'app-gali6-centro-control',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Gali6PageHeaderComponent,
    Gali6AgentesComponent,
    ReglasPageComponent,
    SkillsPageComponent,
    Gali6ConexionesCasaComponent,
    Gali6ImpactoLedgerComponent,
    Gali6MarketplaceComponent,
  ],
  template: `
    <div class="cc gali-stagger-in">
      <app-g6-page-header
        [breadcrumbs]="['Centro de Gali']"
        title="Centro de Gali"
        sub="Conexiones, agentes y reglas en un solo lugar. Ajústalos cuando quieras; Gali sigue operando con lo que ya tienes.">
        <span g6Actions class="cc__modo-tag">Solo modo experto</span>
      </app-g6-page-header>

      <p class="cc__puente">
        ¿Solo quieres saber qué hacer hoy?
        <a routerLink="/gali-6">Ve a Hoy →</a>
      </p>

      <!-- Nav de tabs -->
      <nav class="cc-tabs" role="tablist" aria-label="Secciones del Centro de Gali">
        @for (t of tabs; track t.id) {
          <button class="cc-tab" role="tab"
                  [id]="'cc-tab-' + t.id"
                  [class.cc-tab--active]="activeTab() === t.id"
                  [attr.aria-selected]="activeTab() === t.id"
                  [attr.aria-controls]="'cc-panel-' + t.id"
                  (click)="activeTab.set(t.id)">
            {{ t.label }}
          </button>
        }
      </nav>

      <!-- ── AGENTES ── -->
      @if (activeTab() === 'agentes') {
        <div role="tabpanel" id="cc-panel-agentes" aria-labelledby="cc-tab-agentes">
          <app-gali6-agentes />
        </div>
      }

      <!-- ── REGLAS (+ Automatizaciones) ── -->
      @if (activeTab() === 'reglas') {
        <div role="tabpanel" id="cc-panel-reglas" aria-labelledby="cc-tab-reglas">
          <app-reglas-page />

          <section class="cc-sub" [class.cc-sub--open]="automatizacionesOpen()">
            <button class="cc-sub__toggle" (click)="automatizacionesOpen.set(!automatizacionesOpen())">
              <span class="cc-sub__chevron" aria-hidden="true">{{ automatizacionesOpen() ? '▾' : '▸' }}</span>
              Automatizaciones
            </button>
            @if (automatizacionesOpen()) {
              <div class="cc-sub__body">
                <app-skills-page />
              </div>
            }
          </section>
        </div>
      }

      <!-- ── CONEXIONES (+ Lo que Gali hizo) ── -->
      @if (activeTab() === 'conexiones') {
        <div role="tabpanel" id="cc-panel-conexiones" aria-labelledby="cc-tab-conexiones">
          <app-gali6-conexiones-casa [embedded]="true" />

          <section class="cc-sub" [class.cc-sub--open]="historialOpen()">
            <button class="cc-sub__toggle" (click)="historialOpen.set(!historialOpen())">
              <span class="cc-sub__chevron" aria-hidden="true">{{ historialOpen() ? '▾' : '▸' }}</span>
              Lo que Gali hizo
            </button>
            @if (historialOpen()) {
              <div class="cc-sub__body">
                <app-gali6-impacto-ledger [embedded]="true" />
              </div>
            }
          </section>
        </div>
      }

      <!-- ── MARKETPLACE ── -->
      @if (activeTab() === 'marketplace') {
        <div role="tabpanel" id="cc-panel-marketplace" aria-labelledby="cc-tab-marketplace">
          <app-gali6-marketplace />
        </div>
      }
    </div>
  `,
  styleUrl: './gali6-centro-control.component.scss',
})
export class Gali6CentroControlComponent {
  private readonly route = inject(ActivatedRoute);

  readonly tabs: Array<{ id: TabId; label: string }> = [
    { id: 'agentes', label: 'Agentes' },
    { id: 'reglas', label: 'Reglas' },
    { id: 'conexiones', label: 'Conexiones' },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  private readonly initialTab = (this.route.snapshot.data['tab'] as TabId) ?? 'agentes';
  private readonly initialFocus = this.route.snapshot.data['focus'] as string | undefined;

  readonly activeTab = signal<TabId>(this.initialTab);
  readonly automatizacionesOpen = signal(this.initialFocus === 'skills');
  readonly historialOpen = signal(this.initialFocus === 'historial');
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliGlosarioDirective } from '../directives/gali-glosario.directive';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import LEDGER from '../../../../../mocks/gali-v5/impact-ledger.json';

@Component({
  selector: 'app-gali6-impacto-ledger',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliGlosarioDirective, Gali6PageHeaderComponent],
  template: `
    <div class="imp gali-stagger-in">
      <app-g6-page-header
        [breadcrumbs]="['Impacto Gali']"
        title="El impacto de Gali"
        sub="Lo que Gali ha hecho por tu negocio. Tu relación con Gali compone valor cada semana." />

      <section class="card">
        <div class="card__head">
          <span class="card__period">{{ s.label_periodo }}</span>
          <span class="card__delta" [class.is-up]="s.delta_ok">↑{{ s.delta_vs_semana_anterior_pct }}% vs semana pasada</span>
        </div>
        <div class="grid">
          <div class="stat stat--hero"><span class="stat__v">{{ s.pesos_ahorrados_label }}</span><span class="stat__l">ahorrados esta semana</span></div>
          <div class="stat"><span class="stat__v">{{ s.acciones_totales }}</span><span class="stat__l">acciones · <em>{{ s.acciones_autonomas }} autónomas</em></span></div>
          <div class="stat"><span class="stat__v">{{ s.novedades_evitadas }}</span><span class="stat__l"><span galiGlosario="novedad">novedades</span> evitadas</span></div>
          <div class="stat"><span class="stat__v">{{ s.campanas_escaladas }}</span><span class="stat__l">campañas escaladas</span></div>
          <div class="stat"><span class="stat__v">{{ s.senales_detectadas }}</span><span class="stat__l">alertas detectadas</span></div>
          <div class="stat"><span class="stat__v">{{ s.horas_libradas }}h</span><span class="stat__l">que no operaste tú</span></div>
        </div>
        <div class="bars">
          <div class="bar">
            <span class="bar__l">Acciones iniciadas por Gali</span>
            <span class="bar__track"><span class="bar__fill" [style.width.%]="s.pct_acciones_gali"></span></span>
            <span class="bar__v">{{ s.pct_acciones_gali }}% <em>(meta &gt;40%)</em></span>
          </div>
          <div class="bar">
            <span class="bar__l">Decisiones con resultado visible</span>
            <span class="bar__track"><span class="bar__fill" [style.width.%]="s.pct_loops_con_resultado"></span></span>
            <span class="bar__v">{{ s.pct_loops_con_resultado }}% <em>(meta &gt;80%)</em></span>
          </div>
        </div>
      </section>

      <section class="acum" [class.acum--hito]="a.hito_alcanzado">
        <div class="acum__top">
          <span class="acum__label">{{ a.label_periodo }}</span>
          @if (a.hito_alcanzado) {
            <span class="acum__badge-hito">🏆 Hito alcanzado</span>
          }
        </div>
        <div class="acum__stats">
          <span><strong>{{ a.pesos_ahorrados_label }}</strong> ahorrados</span>
          <span><strong>{{ a.acciones_totales }}</strong> acciones</span>
          <span><strong>{{ a.novedades_evitadas }}</strong> <span galiGlosario="novedad">novedades</span> evitadas</span>
          <span><strong>{{ a.horas_libradas }}h</strong> libres</span>
        </div>
        <span class="acum__hito">{{ a.hito_proximo_label }}</span>
      </section>

      <section class="feed">
        <span class="feed__eyebrow">Actividad reciente</span>
        <ul class="feed__list">
          @for (ev of actions; track ev.id) {
            <li class="feed__item">
              <span class="feed__dot" [style.background]="ev.agente_color"></span>
              <div class="feed__body">
                <span class="feed__desc">{{ ev.descripcion }}</span>
                <span class="feed__meta">{{ ev.agente }} · {{ ev.impacto_label }}</span>
              </div>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
  styleUrl: './gali6-impacto-ledger.component.scss',
})
export class Gali6ImpactoLedgerComponent {
  readonly s = (LEDGER as any).summary_semana;
  readonly a = (LEDGER as any).summary_acumulado;
  readonly actions = (LEDGER as any).actions;
}

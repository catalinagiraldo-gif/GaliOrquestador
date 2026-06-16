import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Header estándar para todas las pantallas de Gali 6.
 * Breadcrumb: Gali 6 › [crumb1] › [crumb2 activo]
 * Título h1 + subtítulo opcional + slot de acciones.
 */
@Component({
  selector: 'app-g6-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="g6ph">
      <nav class="g6ph__crumbs" aria-label="Breadcrumb">
        <a routerLink="/gali-6" class="g6ph__crumb g6ph__crumb--home" aria-label="Inicio Gali 6">
          <span aria-hidden="true">✦</span> Gali 6
        </a>
        @for (c of breadcrumbs(); track $index; let last = $last) {
          <span class="g6ph__sep" aria-hidden="true">›</span>
          <span class="g6ph__crumb" [class.g6ph__crumb--active]="last">{{ c }}</span>
        }
      </nav>

      @if (title()) {
        <div class="g6ph__row">
          <div>
            <h1 class="g6ph__title">{{ title() }}</h1>
            @if (sub()) {
              <p class="g6ph__sub">{{ sub() }}</p>
            }
          </div>
          <div class="g6ph__actions">
            <ng-content select="[g6Actions]" />
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .g6ph {
      display: flex;
      flex-direction: column;
      gap: $size-3;
      margin-bottom: $size-5;

      &__crumbs {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }

      &__crumb {
        font-family: $font-primary;
        font-size: 12px;
        color: $gray-500;
        text-decoration: none;
        line-height: 1.5;
        display: inline-flex;
        align-items: center;
        gap: 4px;

        &--home {
          color: $primary-500;
          font-weight: $font-semibold;
          span { font-size: 10px; }
          &:hover { color: $primary-600; }
        }

        &--active {
          color: $gray-700;
          font-weight: $font-medium;
        }
      }

      &__sep {
        font-size: 10px;
        color: $gray-400;
      }

      &__row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: $size-4;
        flex-wrap: wrap;
      }

      &__title {
        margin: 0;
        font-family: $font-primary;
        font-size: $font-2xl;
        font-weight: $font-bold;
        color: $gray-700;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }

      &__sub {
        margin: $size-2 0 0;
        font-size: $font-sm;
        color: $gray-500;
        line-height: 1.55;
        max-width: 58ch;
      }

      &__actions {
        display: flex;
        align-items: center;
        gap: $size-3;
        flex-shrink: 0;
        flex-wrap: wrap;
      }
    }
  `],
})
export class Gali6PageHeaderComponent {
  breadcrumbs = input<string[]>([]);
  title = input<string>('');
  sub = input<string>('');
}

import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SectionNavItem, SectionPanel } from '../dropi-sections.config';

@Component({
  selector: 'dropi-section-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav
      class="section-nav"
      [class.section-nav--collapsed]="collapsed()"
      [attr.aria-label]="panel().title">
      <div class="section-nav__head">
        <h2 class="section-nav__title">{{ panel().title }}</h2>
        <button
          type="button"
          class="section-nav__collapse"
          data-proto-skip
          title="Colapsar menú"
          aria-label="Colapsar menú"
          (click)="collapseRequested.emit()">
          <i class="pi pi-angle-double-left"></i>
        </button>
      </div>

      <ul class="section-nav__list">
        <li *ngFor="let item of panel().items" class="section-nav__item">
          <span *ngIf="item.type === 'header'" class="section-nav__group-label">{{ item.label }}</span>
          <ng-container *ngIf="item.type !== 'header' && item.children?.length; else flatItem">
            <button
              type="button"
              class="section-nav__row section-nav__row--parent"
              data-proto-skip
              [class.section-nav__row--expanded]="isExpanded(item.id)"
              [class.section-nav__row--child-active]="isChildRouteActive(item)"
              (click)="toggleExpand(item.id)">
              <span
                *ngIf="item.icon"
                class="section-nav__icon"
                [style.--icon-url]="'url(' + item.icon + ')'"
                aria-hidden="true"></span>
              <span class="section-nav__label">{{ item.label }}</span>
              <i
                class="pi section-nav__chevron"
                [class.pi-chevron-up]="isExpanded(item.id)"
                [class.pi-chevron-down]="!isExpanded(item.id)"
                [class.section-nav__chevron--active]="isChildRouteActive(item)"></i>
            </button>
            <ul *ngIf="isExpanded(item.id)" class="section-nav__tree">
              <li *ngFor="let child of item.children">
                <a
                  [routerLink]="child.route"
                  routerLinkActive="section-nav__tree-link--active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="section-nav__tree-link">
                  <span class="section-nav__tree-line" aria-hidden="true"></span>
                  <span class="section-nav__tree-label">{{ child.label }}</span>
                </a>
              </li>
            </ul>
          </ng-container>

          <ng-template #flatItem>
            <a
              *ngIf="item.type !== 'header' && item.route"
              [routerLink]="item.route!"
              routerLinkActive="section-nav__row--active"
              [routerLinkActiveOptions]="{ exact: false }"
              class="section-nav__row">
              <span
                *ngIf="item.icon"
                class="section-nav__icon"
                [style.--icon-url]="'url(' + item.icon + ')'"
                aria-hidden="true"></span>
              <span class="section-nav__label">{{ item.label }}</span>
              <span *ngIf="item.badge === 'nuevo'" class="section-nav__badge section-nav__badge--nuevo">Nuevo</span>
              <span *ngIf="item.badge === 'beta'" class="section-nav__badge section-nav__badge--beta">Beta</span>
            </a>
          </ng-template>
        </li>
      </ul>
    </nav>
  `,
  styleUrl: './dropi-section-nav.component.scss',
})
export class DropiSectionNavComponent {
  panel = input.required<SectionPanel>();
  collapsed = input(false);
  collapseRequested = output<void>();

  private router = inject(Router);
  currentUrl = signal(this.router.url);
  expanded = signal<Record<string, boolean>>({});

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.currentUrl.set(e.urlAfterRedirects));

    effect(() => {
      const defaults: Record<string, boolean> = {};
      this.panel().items.forEach((item: SectionNavItem) => {
        if (item.defaultExpanded) defaults[item.id] = true;
      });
      this.expanded.set(defaults);
    });
  }

  isExpanded(id: string): boolean {
    return this.expanded()[id] ?? true;
  }

  toggleExpand(id: string): void {
    this.expanded.update(m => ({ ...m, [id]: !this.isExpanded(id) }));
  }

  isChildRouteActive(item: SectionNavItem): boolean {
    if (!item.children?.length) return false;
    const path = this.currentUrl().split('?')[0];
    return item.children.some(
      child => path === child.route || path.startsWith(`${child.route}/`),
    );
  }
}

import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { DropiHeaderIa2Component } from './components/dropi-header-ia2.component';
import { DropiIconRailComponent } from './components/dropi-icon-rail.component';
import { DropiMenuActionComponent } from './components/dropi-menu-action.component';
import { DropiSectionNavComponent } from './components/dropi-section-nav.component';
import {
  HOME_OVERVIEW_PANEL,
  resolveSectionPanel,
  SectionPanel,
} from './dropi-sections.config';
import { DropiPrototypeFeedbackService } from './services/dropi-prototype-feedback.service';

@Component({
  selector: 'app-gali-v5-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DropiHeaderIa2Component,
    DropiIconRailComponent,
    DropiMenuActionComponent,
    DropiSectionNavComponent,
  ],
  templateUrl: './gali-v5-shell.component.html',
  styleUrl: './gali-v5-shell.component.scss',
})
export class GaliV5ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  readonly feedback = inject(DropiPrototypeFeedbackService);

  sectionPanel = signal<SectionPanel>(HOME_OVERVIEW_PANEL);
  sectionNavCollapsed = signal(false);
  hasSectionPanel = signal(true);
  isCompactNav = signal(false);

  constructor() {
    this.syncNav(this.router.url);
    this.updateViewport();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncNav(e.urlAfterRedirects));
  }

  /** Feedback en botones sin handler — evita sensación de “salir” del prototipo */
  @HostListener('click', ['$event'])
  onPrototypeClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('a[routerLink], a[href]')) return;

    const btn = target.closest('button');
    if (!btn || btn.hasAttribute('data-proto-skip') || btn.disabled) return;

    const skipHost = btn.closest(
      'dropi-icon-rail, dropi-section-nav, dropi-header-ia2, dropi-menu-action',
    );
    if (skipHost) return;

    const label =
      btn.getAttribute('aria-label')
      || btn.getAttribute('title')
      || btn.textContent?.replace(/\s+/g, ' ').trim().slice(0, 48)
      || 'Acción';

    this.feedback.action(label);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  toggleSectionNav(): void {
    this.sectionNavCollapsed.update(v => !v);
  }

  collapseSectionNav(): void {
    this.sectionNavCollapsed.set(true);
  }

  private syncNav(url: string): void {
    const panel = resolveSectionPanel(url);
    if (panel) {
      this.sectionPanel.set(panel);
      this.hasSectionPanel.set(true);
      this.sectionNavCollapsed.set(false);
    } else {
      this.hasSectionPanel.set(false);
    }
  }

  private updateViewport(): void {
    this.isCompactNav.set(window.innerWidth < 1024);
  }
}

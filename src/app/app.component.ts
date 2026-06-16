import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <!-- Login: no shell -->
    <ng-container *ngIf="isLoginPage; else appShell">
      <router-outlet />
    </ng-container>

    <!-- App shell with sidebar + header (oculto en /gali* y /gali-v5*) -->
    <ng-template #appShell>
      <div class="app-shell" [class.app-shell--gali]="isGaliWorkspace">
        <app-sidebar *ngIf="!isStandaloneShell" [collapsed]="isGaliWorkspace && sidebarCollapsed" (collapsedChange)="sidebarActuallyCollapsed = $event" />
        <div class="app-shell__main" [class.app-shell__main--standalone]="isStandaloneShell" [class.app-shell__main--collapsed]="!isGaliWorkspace && sidebarActuallyCollapsed">
          <app-header
            *ngIf="!isStandaloneShell"
            [userName]="(auth.user$ | async)?.name ?? 'Usuario'"
            [userRole]="(auth.user$ | async)?.role ?? ''"
          />
          <main class="app-shell__content" [class.app-shell__content--gali]="isStandaloneShell">
            <router-outlet />
          </main>
        </div>
      </div>
    </ng-template>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoginPage = false;
  isGaliWorkspace = false;
  isStandaloneShell = false;
  sidebarCollapsed = true;
  sidebarActuallyCollapsed = false;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    this.applyRouteContext(this.router.url);
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map((e: any) => (e as NavigationEnd).urlAfterRedirects ?? (e as NavigationEnd).url),
      )
      .subscribe(url => this.applyRouteContext(url));
  }

  private applyRouteContext(url: string): void {
    const path = url.split('?')[0];
    this.isLoginPage = path.startsWith('/login');
    this.isStandaloneShell =
      path.startsWith('/gali-v5')
      || path.startsWith('/gali-v3')
      || path.startsWith('/gali-v4')
      || path.startsWith('/gali-6')
      || path.startsWith('/gali-5')
      || path === '/gali'
      || path.startsWith('/gali/');
    this.isGaliWorkspace =
      (path.startsWith('/gali-v3') || path.startsWith('/gali-v4'))
      && !path.startsWith('/gali-v5');
    if (this.isGaliWorkspace) this.sidebarCollapsed = true;
  }

  @HostListener('window:gali:toggle-rail')
  onToggleRail(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

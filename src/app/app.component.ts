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

    <!-- App shell with sidebar + header (header oculto en /gali) -->
    <ng-template #appShell>
      <div class="app-shell" [class.app-shell--gali]="isGaliWorkspace">
        <app-sidebar [collapsed]="isGaliWorkspace && sidebarCollapsed" />
        <div class="app-shell__main">
          <app-header
            *ngIf="!isGaliWorkspace"
            [userName]="(auth.user$ | async)?.name ?? 'Usuario'"
            [userRole]="(auth.user$ | async)?.role ?? ''"
          />
          <main class="app-shell__content" [class.app-shell__content--gali]="isGaliWorkspace">
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
  sidebarCollapsed = true;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map((e: any) => (e as NavigationEnd).url),
      )
      .subscribe(url => {
        this.isLoginPage = url.startsWith('/login');
        this.isGaliWorkspace = url.startsWith('/gali');
        if (this.isGaliWorkspace) this.sidebarCollapsed = true;
      });
  }

  @HostListener('window:gali:toggle-rail')
  onToggleRail(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

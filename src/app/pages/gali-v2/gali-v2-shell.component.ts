import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { GaliDockComponent } from '../../components/gali-v2/gali-dock/gali-dock.component';

@Component({
  selector: 'app-gali-v2-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GaliDockComponent],
  template: `
    <div class="shell">
      <gali-dock class="shell__dock"></gali-dock>
      <main class="shell__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./gali-v2-shell.component.scss'],
})
export class GaliV2ShellComponent {
  private router = inject(Router);

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      localStorage.removeItem('gali_v2_perfil');
      this.router.navigate(['/gali-v2/onboarding']);
    }
  }
}

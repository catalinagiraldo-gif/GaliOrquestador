import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gali6-zero-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="zero-shell">
      <router-outlet />
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; }
    .zero-shell { min-height: 100vh; display: flex; flex-direction: column; }
  `],
})
export class Gali6ZeroShellComponent {}

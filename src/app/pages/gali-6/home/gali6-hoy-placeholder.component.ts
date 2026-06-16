import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gali6-hoy-placeholder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="placeholder">
      <span class="placeholder__icon">✦</span>
      <h2 class="placeholder__title">Gali 6 · La Casita</h2>
      <p class="placeholder__sub">Sprint A — en construcción</p>
      <div class="placeholder__links">
        <a routerLink="/gali-6/proyectos" class="placeholder__link">◎ Proyectos</a>
        <a routerLink="/gali-6/conexiones" class="placeholder__link">⬡ Conexiones</a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 12px;
      color: #475066;
      font-family: 'Inter', sans-serif;
    }
    .placeholder__icon { font-size: 40px; color: #f49a3d; }
    .placeholder__title { font-size: 22px; font-weight: 600; margin: 0; color: #151921; }
    .placeholder__sub { font-size: 14px; margin: 0; }
    .placeholder__links { display: flex; gap: 16px; margin-top: 8px; }
    .placeholder__link {
      font-size: 14px;
      color: #f49a3d;
      text-decoration: none;
      font-weight: 500;
      padding: 6px 12px;
      border: 1px solid rgba(244,154,61,0.3);
      border-radius: 8px;
      transition: background 0.15s;
      &:hover { background: rgba(244,154,61,0.08); }
    }
  `],
})
export class Gali6HoyPlaceholderComponent {}

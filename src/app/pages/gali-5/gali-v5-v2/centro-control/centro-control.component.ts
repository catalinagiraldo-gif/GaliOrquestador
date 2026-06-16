import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ControlCard {
  glyph: string;
  titulo: string;
  desc: string;
  route: string;
  cta: string;
}

@Component({
  selector: 'app-centro-control',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cc gali-stagger-in">
      <header class="cc__head">
        <span class="cc__badge">Modo experto</span>
        <h1 class="cc__title">Centro de control</h1>
        <p class="cc__sub">
          Aquí vive la maquinaria de Gali. No necesitas entrar a diario — Gali la opera de fondo.
          Entra solo cuando quieras ajustar cómo trabaja por ti.
        </p>
      </header>

      <!-- Ontología -->
      <section class="onto">
        <div class="onto__node onto__node--gali"><strong>Gali</strong><span>orquesta</span></div>
        <span class="onto__arrow" aria-hidden="true">→</span>
        <div class="onto__node"><strong>Agentes</strong><span>ejecutan</span></div>
        <span class="onto__arrow" aria-hidden="true">→</span>
        <div class="onto__node"><strong>Skills</strong><span>capacidades que usan</span></div>
        <span class="onto__plus" aria-hidden="true">+</span>
        <div class="onto__node"><strong>Reglas</strong><span>límites que respetan</span></div>
      </section>

      <div class="cc__grid">
        @for (c of cards; track c.route) {
          <a class="ctrl" [routerLink]="c.route">
            <span class="ctrl__glyph" aria-hidden="true">{{ c.glyph }}</span>
            <strong class="ctrl__title">{{ c.titulo }}</strong>
            <p class="ctrl__desc">{{ c.desc }}</p>
            <span class="ctrl__cta">{{ c.cta }} →</span>
          </a>
        }
      </div>
    </div>
  `,
  styleUrl: './centro-control.component.scss',
})
export class CentroControlComponent {
  readonly cards: ControlCard[] = [
    { glyph: '✶', titulo: 'Agentes', desc: 'Roax, Vigilante, Chatea Pro, ADA Spy y Kronos. Cada uno se especializa en un área y reporta lo que hace.', route: '/gali-v5-v2/agentes', cta: 'Ver agentes' },
    { glyph: '⚡', titulo: 'Skills', desc: 'Capacidades reutilizables que tus agentes pueden usar. Como herramientas en una caja.', route: '/gali-v5-v2/skills', cta: 'Ver skills' },
    { glyph: '⊞', titulo: 'Reglas', desc: 'Instrucciones en lenguaje natural que limitan cuándo y cómo actúa cada agente.', route: '/gali-v5-v2/reglas', cta: 'Ver reglas' },
    { glyph: '⊕', titulo: 'Marketplace', desc: 'Skills y plantillas de la comunidad de dropshippers. Instala lo que ya le funciona a otros.', route: '/gali-v5-v2/marketplace', cta: 'Explorar' },
  ];
}

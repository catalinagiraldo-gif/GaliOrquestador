import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ProximoPaso {
  titulo: string;
  desc: string;
  cta: string;
  ruta: string;
  emoji: string;
}

@Component({
  selector: 'app-gali6-zero-hoy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali6-zero-hoy.component.html',
  styleUrl: './gali6-zero-hoy.component.scss',
})
export class Gali6ZeroHoyComponent {
  readonly router = inject(Router);

  readonly proximosPasos: ProximoPaso[] = [
    {
      titulo: 'Configura tu pauta en Facebook Ads',
      desc: 'Conecta tu cuenta publicitaria para que el Agente ROAS pueda monitorear tus resultados.',
      cta: 'Conectar cuenta',
      ruta: '/gali-6/conexiones',
      emoji: '📣',
    },
    {
      titulo: 'Revisa tu primer producto',
      desc: 'Conoce los detalles del Collar GPS — precio, margen y cómo pedirlo en Dropi.',
      cta: 'Ver producto',
      ruta: '/gali-6/productos/catalogo',
      emoji: '🐾',
    },
    {
      titulo: 'Explora señales de Gali',
      desc: 'Cuando hagas tu primera venta, Gali te avisará aquí con análisis y recomendaciones.',
      cta: 'Ver señales',
      ruta: '/gali-6/senales',
      emoji: '✦',
    },
  ];

  onPaso(ruta: string): void {
    this.router.navigate([ruta]);
  }

  onVerPrototipoCompleto(): void {
    this.router.navigate(['/gali-6']);
  }
}

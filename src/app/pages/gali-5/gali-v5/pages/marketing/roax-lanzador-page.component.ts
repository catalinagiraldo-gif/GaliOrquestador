import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropiTitulosComponent, DropiButtonNewComponent } from '../../components/shared';
import { GALI_V5_DROPI_LOGO } from '../../gali-v5.constants';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { Gali6ScreenContextService } from '../../../../gali-6/services/gali6-screen-context.service';
import { Gali6ChatService } from '../../../../gali-6/gali-chat/gali6-chat.service';

interface CanalOption {
  id: string;
  label: string;
  description?: string;
  logo?: string;
  selected: boolean;
}

@Component({
  selector: 'app-roax-lanzador-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiTitulosComponent, DropiButtonNewComponent],
  templateUrl: './roax-lanzador-page.component.html',
  styleUrl: './roax-lanzador-page.component.scss',
})
export class RoaxLanzadorPageComponent implements OnInit {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);
  private readonly screenCtx = inject(Gali6ScreenContextService);
  private readonly chat = inject(Gali6ChatService);
  readonly dropiLogo = GALI_V5_DROPI_LOGO;
  readonly launched = signal(false);
  readonly breadcrumbs = ['Marketing', 'ROAX', 'Lanzador de campañas'];
  readonly steps = [
    'Canal de venta',
    'Entendimiento del producto',
    'Ángulos de venta',
    'Guiones',
    'Presupuesto',
    'Generar',
  ];
  readonly presupuestoStepIndex = this.steps.indexOf('Presupuesto');
  currentStep = 0;

  // ── Presupuesto (paso nuevo) — cifras de ejemplo citadas en el mensaje proactivo de
  // ngOnInit: margen $25 sobre $100 de venta → Break-even ROAS 4.0x (Skills para
  // Dropshipping con IA.md líneas 49-52). Editable: el usuario puede ajustarlas antes de
  // confirmar, tal como pide 18.FlujoUsuarioGali6.md §1.4 paso 4. ──
  readonly margenAbsoluto = 25;
  readonly ventaPromedio = 100;
  readonly breakEvenRoas = this.ventaPromedio / this.margenAbsoluto;
  targetRoas = 5.0;
  presupuestoDiario = 60000;
  escalarAutomatico = false;

  canales: CanalOption[] = [
    { id: 'tiktok', label: 'TikTok Ads', logo: GALI_V5_DROPI_LOGO, selected: true },
    { id: 'meta', label: 'Meta', logo: GALI_V5_DROPI_LOGO, selected: false },
    {
      id: 'web',
      label: 'Venta en página web',
      description: 'Escoge esta opción si la venta la quieres realizar a través de una página web',
      selected: false,
    },
    {
      id: 'whatsapp',
      label: 'Venta en WhatsApp',
      description: 'Escoge esta opción si la venta la quieres realizar a través de tu canal de ventas de WhatsApp',
      selected: false,
    },
  ];

  /**
   * Screen-awareness + sugerencia proactiva de ROAS (Flujo C, 18.FlujoUsuarioGali6.md
   * §1.4). Mismo mecanismo que ya usan validador-direcciones-page y garantias-page —
   * la ruta publicada sale de `router.url` porque este componente es compartido con
   * /gali-v5, no solo /gali-6.
   *
   * Nota de alcance: esto cubre la parte "propone, nunca publica sin aprobación" citando
   * la cifra real de Break-even/Target ROAS (`docs/Conocimientos/Skills para Dropshipping
   * con IA.md` líneas 49-52). El wizard ahora tiene un paso "Presupuesto" editable (ver
   * `presupuestoStepIndex`) donde el usuario ajusta Target ROAS y presupuesto antes de
   * confirmar — sigue exigiendo el mismo clic explícito en "Continuar" antes de "Generar".
   *
   * El escalamiento automático (`escalarAutomatico`) es un toggle propio de este wizard,
   * NO una lectura del `autonomiaPct` de `roas-tracker` en `gali6-agentes.component.ts`:
   * ese slider vive en un signal local a esa página (`agentesEstado`) que ya tiene una
   * limitación conocida y documentada (no se sincroniza con `Gali6LiveMutationsService`,
   * ver nota en `gali6-live-mutations.service.ts`). Cablear este wizard a ese estado
   * frágil habría heredado el mismo bug. El Loop de Acción Cerrada del paso 7 del flujo
   * (CTR cae → Gali pausa creativo → resultado visible) sigue sin implementar: requiere
   * un modelo de campaña en vivo con métricas evolucionando que este wizard no tiene.
   */
  ngOnInit(): void {
    this.publishStepContext();
    this.chat.pushProactiveAlert(
      'roax-lanzador::breakeven-roas',
      'Tu Break-even ROAS es 4.0x (margen $25 sobre $100 de venta); te sugiero lanzar con Target ROAS 5.0x para dejar colchón de rentabilidad.',
    );
  }

  /** Republica el contexto en cada cambio de paso — si no, el banner del chat queda pegado en "Paso 1". */
  private publishStepContext(): void {
    this.screenCtx.publish({
      route: this.router.url,
      viewId: 'roax-lanzador',
      viewLabel: 'Lanzador de campañas',
      summary: `Paso ${this.currentStep + 1} de ${this.steps.length}: ${this.steps[this.currentStep]}`,
    });
  }

  selectCanal(canal: CanalOption): void {
    this.canales.forEach(c => (c.selected = c.id === canal.id));
  }

  continuar(): void {
    if (this.currentStep === this.presupuestoStepIndex) {
      this.confirmarPresupuesto();
    }
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
      this.publishStepContext();
    } else {
      this.launched.set(true);
      setTimeout(() => {
        this.ws.setMode('medir');
        this.router.navigate(['/gali-v5']);
      }, 2000);
    }
  }

  /** Reporta en el chat la configuración que el usuario confirmó — cierre visible del paso 4-5 del Flujo C. */
  private confirmarPresupuesto(): void {
    const presupuestoFmt = this.presupuestoDiario.toLocaleString('es-CO');
    const escalamiento = this.escalarAutomatico
      ? 'Escalamiento automático activado — Gali ajustará el presupuesto solo cuando el ROAS supere tu objetivo, con reporte posterior.'
      : 'Escalamiento automático desactivado — cualquier cambio de presupuesto te lo voy a preguntar primero.';
    this.chat.pushProactiveAlert(
      `roax-lanzador::presupuesto-confirmado::${Date.now()}`,
      `Presupuesto configurado: $${presupuestoFmt}/día con Target ROAS ${this.targetRoas.toFixed(1)}x. ${escalamiento}`,
    );
  }
}

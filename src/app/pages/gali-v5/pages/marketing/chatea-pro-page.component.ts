import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropiTitulosComponent } from '../../components/shared';
import { DropiGaliBarComponent, GaliBarStat } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

type EstadoConv = 'anticipo_pendiente' | 'confirmado' | 'carrito' | 'novedad';

interface Conversacion {
  id: string;
  cliente: string;
  pedido: string;
  estado: EstadoConv;
  msg: string;
  hora: string;
  monto?: string;
}

interface ChatMsg {
  from: 'gali' | 'cliente';
  text: string;
  hora: string;
}

@Component({
  selector: 'app-chatea-pro-page',
  standalone: true,
  imports: [CommonModule, DropiTitulosComponent, DropiGaliBarComponent],
  templateUrl: './chatea-pro-page.component.html',
  styleUrl: './chatea-pro-page.component.scss',
})
export class ChateaProPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  goToSignals(): void {
    this.ws.setMode('operar');
    this.router.navigate(['/gali-v5']);
  }

  readonly breadcrumbs = ['Marketing', 'Chatea Pro'];

  conversaciones = signal<Conversacion[]>([
    { id: '1', cliente: 'María Vergara', pedido: '#160604', estado: 'anticipo_pendiente', msg: 'Zona rural detectada. Chatea Pro solicitó anticipo de $25.000.', hora: '14:32', monto: '$25.000' },
    { id: '2', cliente: 'Carlos Mendoza', pedido: '#160605', estado: 'confirmado', msg: 'Pedido confirmado automáticamente. Huella verde.', hora: '12:10' },
    { id: '3', cliente: 'Andrea Gutiérrez', pedido: '#160607', estado: 'novedad', msg: 'Novedad: dirección no encontrada. Gali contactó al cliente.', hora: '11:45' },
    { id: '4', cliente: 'Diego Herrera', pedido: '#160609', estado: 'carrito', msg: 'Carrito abandonado 6h. Recordatorio enviado con descuento.', hora: '09:05', monto: '$140.000' },
    { id: '5', cliente: 'Valentina Ruiz', pedido: '#160611', estado: 'confirmado', msg: 'Confirmación automática exitosa.', hora: '08:30' },
    { id: '6', cliente: 'Juan Pablo Ruiz', pedido: '#160608', estado: 'anticipo_pendiente', msg: 'Zona rural Chocó. Anticipo pendiente de respuesta.', hora: '08:12', monto: '$35.000' },
  ]);

  selectedConvId = signal<string>('1');

  chatMsgs = signal<ChatMsg[]>([
    { from: 'gali', text: 'Hola María, tu pedido #160604 está listo para envío. Como tu zona es rural, necesitamos un anticipo de $25.000 para asegurar la entrega. ¿Lo realizas por Nequi o Bancolombia?', hora: '14:30' },
    { from: 'cliente', text: 'Sí, lo hago por Nequi. ¿A qué número?', hora: '14:31' },
    { from: 'gali', text: 'Al 300 456 7890. Una vez confirmes el pago, procedemos con el despacho inmediatamente.', hora: '14:32' },
  ]);

  newMsg = signal('');
  showNewRule = signal(false);

  reglas = signal<Record<string, boolean>>({
    anticipoZonaRural: true,
    recuperarCarrito: true,
    confirmarVerde: true,
    notificarNovedad: true,
  });

  // J6: richer rule items with per-rule agent assignment
  readonly agentOptions = [
    { id: 'chatea-pro', label: 'Chatea Pro', color: '#34d399', desc: 'Respuesta automática WhatsApp' },
    { id: 'cas-manual', label: 'CAS Manual', color: '#f59e0b', desc: 'Escala a agente humano en CAS' },
    { id: 'gali', label: 'Gali General', color: '#f49a3d', desc: 'Gali decide el mejor canal' },
  ];

  readonly ruleItems = signal([
    { key: 'anticipoZonaRural', condition: 'zona rural detectada', action: 'solicitar anticipo $25k', agentId: 'chatea-pro' },
    { key: 'recuperarCarrito', condition: 'carrito abandonado +6h', action: 'enviar secuencia recuperación', agentId: 'chatea-pro' },
    { key: 'confirmarVerde', condition: 'huella verde + wallet OK', action: 'confirmar automáticamente', agentId: 'chatea-pro' },
    { key: 'notificarNovedad', condition: 'novedad logística detectada', action: 'notificar cliente WhatsApp', agentId: 'gali' },
  ]);

  readonly showAgentPickerFor = signal<string | null>(null);

  getAgent(agentId: string) {
    return this.agentOptions.find(a => a.id === agentId) ?? this.agentOptions[0];
  }

  setRuleAgent(key: string, agentId: string): void {
    this.ruleItems.update(items =>
      items.map(r => r.key === key ? { ...r, agentId } : r)
    );
    this.showAgentPickerFor.set(null);
  }

  toggleRuleActive(key: string): void {
    this.reglas.update(r => ({ ...r, [key]: !(r as Record<string, boolean>)[key] }));
  }

  get stats() {
    const convs = this.conversaciones();
    return {
      confirmados: convs.filter(c => c.estado === 'confirmado').length,
      anticiposPendientes: convs.filter(c => c.estado === 'anticipo_pendiente').length,
      carritos: convs.filter(c => c.estado === 'carrito').length,
      tasa: '91.5%',
    };
  }

  get chateaBarStats(): GaliBarStat[] {
    const s = this.stats;
    return [
      { value: s.confirmados, label: 'confirmados hoy', variant: 'ok' },
      { value: s.anticiposPendientes, label: 'anticipos pendientes', variant: 'warn' },
      { value: s.carritos, label: 'carritos activos', variant: 'neutral' },
      { value: s.tasa, label: 'tasa confirmación', variant: 'ok' },
    ];
  }

  selectedConv(): Conversacion | undefined {
    return this.conversaciones().find(c => c.id === this.selectedConvId());
  }

  estadoLabel(estado: EstadoConv): string {
    const map: Record<EstadoConv, string> = {
      anticipo_pendiente: '⏳ Anticipo pendiente',
      confirmado: '✓ Confirmado',
      carrito: '🛒 Carrito',
      novedad: '⚠ Novedad',
    };
    return map[estado] ?? estado;
  }

  sendMsg(): void {
    const text = this.newMsg().trim();
    if (!text) return;
    this.chatMsgs.update(m => [...m, { from: 'gali', text, hora: 'ahora' }]);
    this.newMsg.set('');
  }

  toggleRegla(key: string): void {
    this.reglas.update(r => ({ ...r, [key]: !(r as Record<string, boolean>)[key] }));
  }

  goToMarketplace(): void { this.router.navigate(['/gali-v5/marketplace']); }
  goToCas(): void { this.router.navigate(['/gali-v5/cas/bandeja']); }
}

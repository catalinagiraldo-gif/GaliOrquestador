import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SuggestedProduct {
  nombre: string;
  margen: string;
  saturacion: string;
  fitScore: number;
}

interface ConversationMessage {
  from: 'gali' | 'user';
  text: string;
}

@Component({
  selector: 'crear-proyecto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proyecto-modal.component.html',
  styleUrl: './crear-proyecto-modal.component.scss',
})
export class CrearProyectoModalComponent implements OnInit {
  @Input() productoPreseleccionado?: SuggestedProduct;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();

  step = signal(1);
  totalSteps = 3;
  isTyping = signal(false);

  // Step 1 — conversational
  conversation = signal<ConversationMessage[]>([
    { from: 'gali', text: '¡Hola! Vamos a crear tu nuevo proyecto. ¿Cuál es el producto que quieres lanzar?' },
  ]);
  userInput = signal('');

  // Step 2 — objetivo
  objetivo = signal('50 ventas semanales');
  presupuesto = signal('80000');
  ciudades = signal<string[]>(['Bogotá', 'Medellín']);
  availableCities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];

  // Step 3 — configuración de agentes
  enableRoax = signal(true);
  enableChateaPro = signal(true);
  enableVigilante = signal(true);
  nombreProyecto = signal('');

  readonly suggestedProducts: SuggestedProduct[] = [
    { nombre: 'Rastreador GPS para mochilas', margen: '42%', saturacion: 'Baja', fitScore: 94 },
    { nombre: 'Comedero automático WiFi', margen: '38%', saturacion: 'Media', fitScore: 89 },
    { nombre: 'Smartwatch Fitness Band v3', margen: '44%', saturacion: 'Baja', fitScore: 85 },
  ];

  ngOnInit(): void {
    if (this.productoPreseleccionado) {
      this.conversation.update(msgs => [
        ...msgs,
        { from: 'user', text: `Quiero lanzar: ${this.productoPreseleccionado!.nombre}` },
      ]);
      this.nombreProyecto.set(`Proyecto ${this.productoPreseleccionado.nombre}`);
      this.simulateGaliResponse(`Perfecto, ya tengo el análisis de ${this.productoPreseleccionado.nombre}. Margen estimado: ${this.productoPreseleccionado.margen}. Definamos tu objetivo.`);
    }
  }

  sendMessage(): void {
    const text = this.userInput().trim();
    if (!text) return;
    this.conversation.update(msgs => [...msgs, { from: 'user', text }]);
    this.userInput.set('');
    this.nombreProyecto.set(`Proyecto ${text.slice(0, 30)}`);
    this.simulateGaliResponse(`Entendido, voy a analizar "${text}". ADA Spy evaluará margen, saturación y ventana de oportunidad. Definamos tu objetivo para este producto.`);
  }

  selectSuggested(p: SuggestedProduct): void {
    this.productoPreseleccionado = p;
    this.conversation.update(msgs => [
      ...msgs,
      { from: 'user', text: `Quiero lanzar: ${p.nombre}` },
    ]);
    this.nombreProyecto.set(`Proyecto ${p.nombre}`);
    this.simulateGaliResponse(`Excelente elección. Fit Score: ${p.fitScore}/100, margen: ${p.margen}. Definamos el objetivo. ¿Cuántas ventas semanales buscas?`);
  }

  simulateGaliResponse(text: string): void {
    this.isTyping.set(true);
    setTimeout(() => {
      this.isTyping.set(false);
      this.conversation.update(msgs => [...msgs, { from: 'gali', text }]);
    }, 900);
  }

  toggleCity(city: string): void {
    const current = this.ciudades();
    if (current.includes(city)) {
      if (current.length > 1) this.ciudades.set(current.filter(c => c !== city));
    } else {
      this.ciudades.set([...current, city]);
    }
  }

  goStep(n: number): void {
    if (n < 1 || n > this.totalSteps) return;
    this.step.set(n);
  }

  nextStep(): void {
    if (this.step() < this.totalSteps) this.step.update(s => s + 1);
  }

  crearProyecto(): void {
    const id = this.nombreProyecto().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4);
    this.created.emit(id);
    this.closed.emit();
  }

  get stepLabel(): string {
    return ['Producto', 'Objetivo', 'Agentes'][this.step() - 1];
  }
}

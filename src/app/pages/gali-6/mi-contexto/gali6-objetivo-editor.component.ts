import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getObjetivo, saveObjetivo, G6Objetivo, DEFAULT_OBJETIVO } from '../../../../../mocks/gali-v6/objetivo';

interface MensajeChat {
  rol: 'gali' | 'usuario';
  texto: string;
  timestamp: string;
}

interface ProgresoObjetivo {
  paso: number;
  campo: 'texto' | 'meta' | 'plazo' | 'listo';
}

@Component({
  selector: 'app-gali6-objetivo-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali6-objetivo-editor.component.html',
  styleUrls: ['./gali6-objetivo-editor.component.scss'],
})
export class Gali6ObjetivoEditorComponent implements OnInit {
  private router = inject(Router);

  readonly mensajes = signal<MensajeChat[]>([]);
  readonly inputUsuario = signal('');
  readonly progreso = signal<ProgresoObjetivo>({ paso: 0, campo: 'texto' });
  readonly borrador = signal<Partial<G6Objetivo>>({});
  readonly objetivo = signal<G6Objetivo | null>(null);
  readonly escribiendo = signal(false);
  readonly guardado = signal(false);

  readonly objetivoFinal = computed<G6Objetivo | null>(() => {
    const b = this.borrador();
    if (!b.texto) return null;
    return {
      ...DEFAULT_OBJETIVO,
      ...b,
      texto: b.texto ?? DEFAULT_OBJETIVO.texto,
      meta_pedidos_sem: b.meta_pedidos_sem ?? DEFAULT_OBJETIVO.meta_pedidos_sem,
      plazo_semanas: b.plazo_semanas ?? DEFAULT_OBJETIVO.plazo_semanas,
    };
  });

  private readonly CONVERSACION: Array<{ gali: string; campo: ProgresoObjetivo['campo']; placeholder: string }> = [
    {
      gali: 'Hola Catalina 👋 Cuéntame, ¿qué quieres lograr en tu negocio este mes? Puedes decirlo con tus palabras.',
      campo: 'texto',
      placeholder: 'Ej: Quiero mis primeras 50 ventas en TikTok con el Collar GPS',
    },
    {
      gali: '¡Excelente meta! ¿Cuántos pedidos por semana quieres alcanzar cuando llegues ahí?',
      campo: 'meta',
      placeholder: 'Ej: 100 pedidos por semana',
    },
    {
      gali: '¿En cuántas semanas quieres alcanzar esa meta? Sé realista — Gali puede ayudarte a llegar.',
      campo: 'plazo',
      placeholder: 'Ej: 8 semanas (2 meses)',
    },
  ];

  ngOnInit(): void {
    const obj = getObjetivo();
    this.objetivo.set(obj);
    this.borrador.set({ ...obj });

    setTimeout(() => {
      this.agregarMensajeGali(this.CONVERSACION[0].gali);
    }, 400);
  }

  get pasoActual() { return this.CONVERSACION[this.progreso().paso] ?? null; }

  get placeholderActual(): string {
    return this.pasoActual?.placeholder ?? 'Escribe tu respuesta…';
  }

  get chatTerminado(): boolean { return this.progreso().campo === 'listo'; }

  enviarMensaje(): void {
    const texto = this.inputUsuario().trim();
    if (!texto) return;

    this.mensajes.update(m => [...m, {
      rol: 'usuario',
      texto,
      timestamp: this.ahora(),
    }]);
    this.inputUsuario.set('');
    this.procesarRespuesta(texto);
  }

  onEnter(e: Event): void {
    e.preventDefault();
    this.enviarMensaje();
  }

  private procesarRespuesta(texto: string): void {
    const paso = this.progreso().paso;
    this.escribiendo.set(true);

    setTimeout(() => {
      this.escribiendo.set(false);
      const campo = this.CONVERSACION[paso]?.campo;

      if (campo === 'texto') {
        this.borrador.update(b => ({ ...b, texto }));
        if (paso + 1 < this.CONVERSACION.length) {
          this.avanzarPaso();
        }
      } else if (campo === 'meta') {
        const num = parseInt(texto.replace(/[^0-9]/g, ''), 10);
        this.borrador.update(b => ({ ...b, meta_pedidos_sem: num || DEFAULT_OBJETIVO.meta_pedidos_sem }));
        if (paso + 1 < this.CONVERSACION.length) {
          this.avanzarPaso();
        }
      } else if (campo === 'plazo') {
        const num = parseInt(texto.replace(/[^0-9]/g, ''), 10);
        this.borrador.update(b => ({ ...b, plazo_semanas: num || DEFAULT_OBJETIVO.plazo_semanas }));
        this.generarPropuesta();
      }
    }, 900);
  }

  private avanzarPaso(): void {
    const sig = this.progreso();
    const nuevo = sig.paso + 1;
    if (nuevo < this.CONVERSACION.length) {
      this.progreso.set({ paso: nuevo, campo: this.CONVERSACION[nuevo].campo });
      this.agregarMensajeGali(this.CONVERSACION[nuevo].gali);
    }
  }

  private generarPropuesta(): void {
    const b = this.borrador();
    const propuesta = `Basado en lo que me contaste, aquí está tu objetivo:\n\n"${b.texto ?? 'Escalar mi negocio'}" → ${b.meta_pedidos_sem ?? 100} pedidos/sem en ${b.plazo_semanas ?? 8} semanas.\n\nGali lo monitoreará semana a semana y te avisará cuando necesites ajustar el rumbo. ¿Lo usamos?`;
    this.agregarMensajeGali(propuesta);
    this.progreso.set({ paso: this.CONVERSACION.length, campo: 'listo' });
  }

  usarObjetivo(): void {
    const final = this.objetivoFinal();
    if (!final) return;
    saveObjetivo(final);
    this.objetivo.set(final);
    this.guardado.set(true);
    setTimeout(() => this.volver(), 1500);
  }

  ajustarObjetivo(): void {
    this.progreso.set({ paso: 0, campo: 'texto' });
    this.mensajes.set([]);
    this.escribiendo.set(false);
    setTimeout(() => this.agregarMensajeGali(this.CONVERSACION[0].gali), 300);
  }

  volver(): void {
    this.router.navigate(['/gali-6/mi-negocio']);
  }

  private agregarMensajeGali(texto: string): void {
    this.mensajes.update(m => [...m, { rol: 'gali', texto, timestamp: this.ahora() }]);
  }

  private ahora(): string {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }
}

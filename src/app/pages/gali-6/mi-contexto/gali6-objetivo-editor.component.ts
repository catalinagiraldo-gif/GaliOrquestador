import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  getObjetivoV2,
  saveObjetivoV2,
  ObjetivoGeneral,
  ObjetivoEspecifico,
  MetricaTipo,
  METRICA_LABEL,
  METRICA_UNIDAD,
  DEFAULT_OBJETIVO_V2,
} from '../../../../../mocks/gali-v6/objetivo';

type EditorModo = 'lista' | 'agregar';

interface MensajeChat {
  rol: 'gali' | 'usuario';
  texto: string;
  timestamp: string;
}

type AñadirPaso = 'tipo' | 'meta' | 'plazo' | 'listo';

@Component({
  selector: 'app-gali6-objetivo-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali6-objetivo-editor.component.html',
  styleUrls: ['./gali6-objetivo-editor.component.scss'],
})
export class Gali6ObjetivoEditorComponent implements OnInit {
  private router = inject(Router);

  readonly modo = signal<EditorModo>('lista');
  readonly objetivoGeneral = signal<ObjetivoGeneral>(DEFAULT_OBJETIVO_V2);
  readonly toastMsg = signal<string | null>(null);
  readonly objetivoEliminadoUndo = signal<{ obj: ObjetivoEspecifico; idx: number } | null>(null);

  // ── Editar objetivo existente ─────────────────────────────────────────────
  readonly editandoId = signal<string | null>(null);
  readonly editBorrador = signal<Partial<ObjetivoEspecifico>>({});

  iniciarEdicion(obj: ObjetivoEspecifico): void {
    this.editandoId.set(obj.id);
    this.editBorrador.set({ titulo: obj.titulo, metaValor: obj.metaValor, plazo_semanas: obj.plazo_semanas });
  }

  cancelarEdicion(): void { this.editandoId.set(null); this.editBorrador.set({}); }

  onEditTitulo(valor: string): void { this.editBorrador.update(b => ({ ...b, titulo: valor })); }
  onEditMeta(valor: string): void { this.editBorrador.update(b => ({ ...b, metaValor: +valor })); }
  onEditPlazo(valor: string): void { this.editBorrador.update(b => ({ ...b, plazo_semanas: +valor })); }

  guardarEdicion(obj: ObjetivoEspecifico): void {
    const b = this.editBorrador();
    const actualizado: ObjetivoEspecifico = {
      ...obj,
      titulo: b.titulo?.trim() || obj.titulo,
      metaValor: b.metaValor ?? obj.metaValor,
      plazo_semanas: b.plazo_semanas ?? obj.plazo_semanas,
    };
    this.objetivoGeneral.update(g => ({
      ...g,
      objetivos: g.objetivos.map(o => o.id === obj.id ? actualizado : o),
    }));
    saveObjetivoV2(this.objetivoGeneral());
    this.editandoId.set(null);
    this.editBorrador.set({});
    this.mostrarToast('Objetivo actualizado');
  }

  // Añadir chat state
  readonly mensajes = signal<MensajeChat[]>([]);
  readonly inputUsuario = signal('');
  readonly escribiendo = signal(false);
  readonly agregarPaso = signal<AñadirPaso>('tipo');
  readonly metricaSeleccionada = signal<MetricaTipo | null>(null);
  readonly borradorNuevo = signal<Partial<ObjetivoEspecifico>>({});
  readonly guardado = signal(false);

  readonly metricas: MetricaTipo[] = [
    'pedidos_sem', 'roas', 'ingreso_mensual', 'clientes_nuevos', 'tasa_novedad', 'personalizado',
  ];

  readonly metricaLabel = METRICA_LABEL;

  readonly objetivoFinal = computed<ObjetivoEspecifico | null>(() => {
    const b = this.borradorNuevo();
    if (!b.titulo || !b.metrica) return null;
    return {
      id: 'obj-' + Date.now(),
      titulo: b.titulo,
      metrica: b.metrica!,
      unidad: b.unidad ?? METRICA_UNIDAD[b.metrica!],
      metaValor: b.metaValor ?? 0,
      actualValor: 0,
      plazo_semanas: b.plazo_semanas ?? 8,
      fecha_inicio: new Date().toISOString().slice(0, 10),
      progreso_pct: 0,
    };
  });

  ngOnInit(): void {
    this.objetivoGeneral.set(getObjetivoV2());
  }

  // ── LISTA ────────────────────────────────────────────────

  eliminarObjetivo(idx: number): void {
    const obj = this.objetivoGeneral().objetivos[idx];
    this.objetivoGeneral.update(g => ({
      ...g,
      objetivos: g.objetivos.filter((_, i) => i !== idx),
    }));
    saveObjetivoV2(this.objetivoGeneral());
    this.objetivoEliminadoUndo.set({ obj, idx });
    this.mostrarToast('Objetivo eliminado');
    setTimeout(() => {
      if (this.objetivoEliminadoUndo()) {
        this.objetivoEliminadoUndo.set(null);
      }
    }, 5000);
  }

  undoEliminar(): void {
    const undo = this.objetivoEliminadoUndo();
    if (!undo) return;
    this.objetivoGeneral.update(g => {
      const objs = [...g.objetivos];
      objs.splice(undo.idx, 0, undo.obj);
      return { ...g, objetivos: objs };
    });
    saveObjetivoV2(this.objetivoGeneral());
    this.objetivoEliminadoUndo.set(null);
    this.mostrarToast('Objetivo restaurado');
  }

  aplicarSugerencia(obj: ObjetivoEspecifico): void {
    const nueva = { ...obj, sugerenciaGali: undefined };
    this.objetivoGeneral.update(g => ({
      ...g,
      objetivos: g.objetivos.map(o => o.id === obj.id ? nueva : o),
    }));
    saveObjetivoV2(this.objetivoGeneral());
    this.mostrarToast('Sugerencia aplicada — objetivo actualizado');
  }

  ignorarSugerencia(obj: ObjetivoEspecifico): void {
    const sin = { ...obj, sugerenciaGali: undefined };
    this.objetivoGeneral.update(g => ({
      ...g,
      objetivos: g.objetivos.map(o => o.id === obj.id ? sin : o),
    }));
    saveObjetivoV2(this.objetivoGeneral());
  }

  abrirModoAgregar(): void {
    this.modo.set('agregar');
    this.mensajes.set([]);
    this.inputUsuario.set('');
    this.agregarPaso.set('tipo');
    this.metricaSeleccionada.set(null);
    this.borradorNuevo.set({});
    this.guardado.set(false);
    setTimeout(() => {
      this.agregarMensajeGali('¿Qué tipo de objetivo quieres agregar? Elige una categoría para empezar.');
    }, 300);
  }

  // ── CHAT AÑADIR ──────────────────────────────────────────

  seleccionarMetrica(m: MetricaTipo): void {
    this.metricaSeleccionada.set(m);
    const label = METRICA_LABEL[m];
    const unidad = METRICA_UNIDAD[m];
    this.mensajes.update(msgs => [...msgs, {
      rol: 'usuario',
      texto: label,
      timestamp: this.ahora(),
    }]);
    this.borradorNuevo.update(b => ({ ...b, metrica: m, unidad }));
    this.escribiendo.set(true);
    setTimeout(() => {
      this.escribiendo.set(false);
      this.agregarPaso.set('meta');
      const pregunta = m === 'personalizado'
        ? '¿Cuál es tu objetivo? Escríbelo como quieras — te ayudo a estructurarlo.'
        : `Perfecto. ¿Cuál es tu meta de ${label.toLowerCase()}? (ej: ${this.ejemploMeta(m)})`;
      this.agregarMensajeGali(pregunta);
    }, 700);
  }

  enviarMensaje(): void {
    const texto = this.inputUsuario().trim();
    if (!texto) return;
    this.mensajes.update(msgs => [...msgs, { rol: 'usuario', texto, timestamp: this.ahora() }]);
    this.inputUsuario.set('');
    this.procesarRespuesta(texto);
  }

  onEnter(e: Event): void {
    e.preventDefault();
    this.enviarMensaje();
  }

  private procesarRespuesta(texto: string): void {
    const paso = this.agregarPaso();
    this.escribiendo.set(true);
    setTimeout(() => {
      this.escribiendo.set(false);
      if (paso === 'meta') {
        const metrica = this.metricaSeleccionada()!;
        if (metrica === 'personalizado') {
          this.borradorNuevo.update(b => ({ ...b, titulo: texto }));
        } else {
          const num = parseFloat(texto.replace(/[^0-9.,]/g, '').replace(',', '.'));
          this.borradorNuevo.update(b => ({ ...b, titulo: `${METRICA_LABEL[metrica]} de ${texto}`, metaValor: isNaN(num) ? 0 : num }));
        }
        this.agregarPaso.set('plazo');
        this.agregarMensajeGali('¿En cuántas semanas quieres alcanzarlo? Sé realista.');
      } else if (paso === 'plazo') {
        const num = parseInt(texto.replace(/[^0-9]/g, ''), 10);
        this.borradorNuevo.update(b => ({ ...b, plazo_semanas: isNaN(num) ? 8 : num }));
        this.generarPropuesta();
      }
    }, 800);
  }

  private generarPropuesta(): void {
    const b = this.borradorNuevo();
    const final = this.objetivoFinal();
    if (!final) return;
    const texto = `Aquí está tu nuevo objetivo:\n\n"${final.titulo}"\nMeta: ${final.metaValor}${final.unidad} · Plazo: ${final.plazo_semanas} semanas\n\nGali lo monitoreará y te avisará cuando necesites ajustarlo. ¿Lo agregamos?`;
    this.agregarMensajeGali(texto);
    this.agregarPaso.set('listo');
  }

  confirmarAgregar(): void {
    const final = this.objetivoFinal();
    if (!final) return;
    this.objetivoGeneral.update(g => ({ ...g, objetivos: [...(g.objetivos ?? []), final] }));
    saveObjetivoV2(this.objetivoGeneral());
    this.guardado.set(true);
    this.mostrarToast('Objetivo agregado');
    setTimeout(() => this.modo.set('lista'), 1200);
  }

  cancelarAgregar(): void {
    this.modo.set('lista');
  }

  // ── HELPERS ──────────────────────────────────────────────

  private agregarMensajeGali(texto: string): void {
    this.mensajes.update(msgs => [...msgs, { rol: 'gali', texto, timestamp: this.ahora() }]);
  }

  private ahora(): string {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  private ejemploMeta(m: MetricaTipo): string {
    const e: Record<MetricaTipo, string> = {
      pedidos_sem: '100 pedidos/semana',
      roas: '2x',
      ingreso_mensual: '$5M COP',
      clientes_nuevos: '50 clientes',
      tasa_novedad: '8%',
      personalizado: 'Mi meta personalizada',
    };
    return e[m];
  }

  private mostrarToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }

  get chatTerminado(): boolean { return this.agregarPaso() === 'listo'; }

  confianzaLabel(c: 'dato-real' | 'tendencia' | 'proyeccion'): string {
    return { 'dato-real': 'Dato real', 'tendencia': 'Tendencia', 'proyeccion': 'Proyección' }[c];
  }

  volver(): void {
    this.router.navigate(['/gali-6/mi-negocio']);
  }
}

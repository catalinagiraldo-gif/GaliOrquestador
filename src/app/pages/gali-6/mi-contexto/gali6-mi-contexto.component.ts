import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Gali6PageHeaderComponent } from '../components/gali6-page-header.component';
import {
  getObjetivoV2, ObjetivoGeneral, ObjetivoEspecifico,
  saveObjetivoV2, METRICA_LABEL,
  OBJETIVO_DETALLES, ObjetivoDetalle,
  MetricaTipo, METRICA_UNIDAD,
} from '../../../../../mocks/gali-v6/objetivo';

interface MensajeEdit {
  rol: 'gali' | 'usuario';
  texto: string;
}

@Component({
  selector: 'app-gali6-mi-contexto',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Gali6PageHeaderComponent],
  templateUrl: './gali6-mi-contexto.component.html',
  styleUrl: './gali6-mi-contexto.component.scss',
})
export class Gali6MiContextoComponent implements OnInit {
  // ── Objetivos V2 ─────────────────────────────────────────────────────────
  readonly objetivoV2 = signal<ObjetivoGeneral>(getObjetivoV2());
  readonly objetivoDetalleId = signal<string | null>(null);
  readonly metricaLabel = METRICA_LABEL;

  readonly objetivoDetalleData = computed((): ObjetivoDetalle | null => {
    const id = this.objetivoDetalleId();
    if (!id) return null;
    return OBJETIVO_DETALLES[id] ?? null;
  });

  readonly objetivoDetalleObj = computed((): ObjetivoEspecifico | null => {
    const id = this.objetivoDetalleId();
    if (!id) return null;
    return this.objetivoV2().objetivos.find(o => o.id === id) ?? null;
  });

  abrirDetalle(id: string): void {
    this.objetivoDetalleId.set(id);
    this.panelModo.set('detalle');
    this.editPropuesta.set(null);
    this.editConfirmado.set(false);
    this.sugerenciaGeneral.set(null);
  }

  verResumenGeneral(): void {
    this.objetivoDetalleId.set(null);
    this.panelModo.set('general');
    this.pendingDelete.set(null);
  }

  // ── Eliminar objetivo con confirmación de impacto ─────────────────────────
  readonly pendingDelete = signal<string | null>(null);

  readonly impactoDelete = computed(() => {
    const id = this.pendingDelete();
    if (!id) return null;
    const g = this.objetivoV2();
    const obj = g.objetivos.find(o => o.id === id);
    if (!obj) return null;
    const restantes = g.objetivos.filter(o => o.id !== id);
    const nuevoProgreso = restantes.length > 0
      ? Math.round(restantes.reduce((s, o) => s + o.progreso_pct, 0) / restantes.length)
      : 0;
    return {
      obj,
      nuevoProgreso,
      progresoDelta: nuevoProgreso - g.progreso_pct,
      tienesSugerencia: !!obj.sugerenciaGali,
    };
  });

  solicitarEliminar(id: string, e: Event): void {
    e.stopPropagation();
    this.pendingDelete.set(this.pendingDelete() === id ? null : id);
  }

  cancelarEliminar(e?: Event): void {
    e?.stopPropagation();
    this.pendingDelete.set(null);
  }

  confirmarEliminar(e?: Event): void {
    e?.stopPropagation();
    const id = this.pendingDelete();
    if (!id) return;
    const g = this.objetivoV2();
    const restantes = g.objetivos.filter(o => o.id !== id);
    const nuevoProgreso = restantes.length > 0
      ? Math.round(restantes.reduce((s, o) => s + o.progreso_pct, 0) / restantes.length)
      : 0;
    this.objetivoV2.update(prev => ({ ...prev, objetivos: restantes, progreso_pct: nuevoProgreso }));
    saveObjetivoV2(this.objetivoV2());
    this.pendingDelete.set(null);
    if (this.objetivoDetalleId() === id) {
      this.objetivoDetalleId.set(null);
      this.panelModo.set('general');
    }
    this.mostrarToast('Objetivo eliminado');
  }

  // ── Resumen general: texto dinámico de Gali ───────────────────────────────
  readonly galiResumenGeneral = computed(() => {
    const g = this.objetivoV2();
    if (!g.objetivos.length) return 'No tienes objetivos definidos todavía.';
    const enBuenRitmo = g.objetivos.filter(o => o.progreso_pct >= 60);
    const enRiesgo = g.objetivos.filter(o => o.progreso_pct < 40);
    const partes: string[] = [];
    partes.push(`${enBuenRitmo.length} de ${g.objetivos.length} objetivos van en buen ritmo.`);
    if (enRiesgo.length > 0) {
      partes.push(`"${enRiesgo[0].titulo}" requiere atención — está al ${enRiesgo[0].progreso_pct}% de su meta.`);
    } else {
      partes.push('Ninguno está en riesgo crítico esta semana.');
    }
    return partes.join(' ');
  });

  sparkH(val: number, max: number): number {
    return Math.max(4, Math.round((val / max) * 56));
  }

  confianzaLabel(c: 'dato-real' | 'tendencia' | 'proyeccion'): string {
    return { 'dato-real': 'Dato real', 'tendencia': 'Tendencia', 'proyeccion': 'Proyección' }[c];
  }

  // ── Panel edición con chat ────────────────────────────────────────────────
  readonly panelModo = signal<'detalle' | 'editar' | 'agregar' | 'general' | 'editar-general'>('detalle');
  readonly editMensajes = signal<MensajeEdit[]>([]);
  readonly editInput = signal('');
  readonly editEscribiendo = signal(false);
  readonly editPropuesta = signal<Partial<ObjetivoEspecifico> | null>(null);
  readonly editConfirmado = signal(false);
  readonly sugerenciaGeneral = signal<string | null>(null);
  readonly toastMsg = signal<string | null>(null);

  iniciarEditChat(): void {
    const obj = this.objetivoDetalleObj();
    if (!obj) return;
    this.panelModo.set('editar');
    this.editMensajes.set([]);
    this.editInput.set('');
    this.editPropuesta.set(null);
    this.editConfirmado.set(false);
    setTimeout(() => {
      this.agregarMensajeGali(`¿Qué quieres ajustar en "${obj.titulo}"? Puedes decirme la nueva meta, el plazo, o describir el cambio con tus palabras.`);
    }, 200);
  }

  cancelarEditChat(): void {
    this.panelModo.set('detalle');
    this.editPropuesta.set(null);
  }

  enviarMensajeEdit(): void {
    const texto = this.editInput().trim();
    if (!texto || this.editEscribiendo()) return;
    this.editMensajes.update(m => [...m, { rol: 'usuario', texto }]);
    this.editInput.set('');
    this.editEscribiendo.set(true);
    setTimeout(() => {
      this.editEscribiendo.set(false);
      this.procesarEditResponse(texto);
    }, 900);
  }

  onEnterEdit(e: Event): void { e.preventDefault(); this.enviarMensajeEdit(); }

  onEditInput(v: string): void { this.editInput.set(v); }

  private procesarEditResponse(texto: string): void {
    const obj = this.objetivoDetalleObj();
    if (!obj) return;

    const numMatch = texto.match(/[\d]+([.,][\d]+)?/);
    const num = numMatch ? parseFloat(numMatch[0].replace(',', '.')) : NaN;
    const esPlazo = /semana|plazo|mes|tiempo|extender|extendido/i.test(texto);
    const esMeta = /meta|objetivo|llegar|alcanzar|bajar|subir|reducir|aumentar|cambiar a/i.test(texto);

    if (!isNaN(num) && esPlazo) {
      const semanas = Math.round(num * (/mes/i.test(texto) ? 4 : 1));
      this.editPropuesta.set({ ...obj, plazo_semanas: semanas });
      const semanasRestantes = semanas - obj.plazo_semanas;
      this.agregarMensajeGali(`Propongo extender el plazo de ${obj.plazo_semanas} a ${semanas} semanas (+${semanasRestantes} sem). Con tu ritmo actual esto te da más margen para llegar a la meta. ¿Confirmar este cambio?`);
    } else if (!isNaN(num) && (esMeta || !esPlazo)) {
      this.editPropuesta.set({ ...obj, metaValor: num });
      const pct = Math.round((obj.actualValor / num) * 100);
      const diff = num - obj.metaValor;
      const signo = diff >= 0 ? '+' : '';
      this.agregarMensajeGali(`Propongo ajustar la meta de ${obj.metaValor}${obj.unidad} a ${num}${obj.unidad} (${signo}${diff}). Con tu valor actual estarías al ${pct}% de esta nueva meta. ¿Confirmar?`);
    } else if (texto.length > 8) {
      this.editPropuesta.set({ ...obj, titulo: texto });
      this.agregarMensajeGali(`Propongo renombrar el objetivo a: "${texto}". ¿Confirmar este cambio?`);
    } else {
      this.agregarMensajeGali(`No entendí bien el cambio. Puedes decirme:\n• Un número nuevo de meta: "bajar a 80"\n• Un plazo: "extender a 16 semanas"\n• Un nombre nuevo para el objetivo`);
    }
  }

  confirmarEditChat(): void {
    const propuesta = this.editPropuesta();
    const obj = this.objetivoDetalleObj();
    if (!propuesta || !obj) return;

    const actualizado: ObjetivoEspecifico = {
      id: obj.id,
      titulo: propuesta.titulo ?? obj.titulo,
      metrica: obj.metrica,
      unidad: obj.unidad,
      metaValor: propuesta.metaValor ?? obj.metaValor,
      actualValor: obj.actualValor,
      plazo_semanas: propuesta.plazo_semanas ?? obj.plazo_semanas,
      fecha_inicio: obj.fecha_inicio,
      progreso_pct: propuesta.metaValor
        ? Math.round((obj.actualValor / propuesta.metaValor) * 100)
        : obj.progreso_pct,
      sugerenciaGali: obj.sugerenciaGali,
    };

    this.objetivoV2.update(g => ({
      ...g,
      objetivos: g.objetivos.map(o => o.id === obj.id ? actualizado : o),
    }));
    saveObjetivoV2(this.objetivoV2());
    this.editConfirmado.set(true);
    this.mostrarToast('Objetivo actualizado');

    const resumenSugerido = this.generarResumenGeneral(this.objetivoV2());
    const necesitaActualizar = resumenSugerido !== this.objetivoV2().resumen;

    if (necesitaActualizar) {
      this.sugerenciaGeneral.set(resumenSugerido);
      // Surface the general-objective proposal as a Gali chat message (AI-UX: same-context preview-then-confirm)
      setTimeout(() => {
        this.agregarMensajeGali(
          `Objetivo actualizado ✓\n\nEste cambio también impacta tu objetivo general. Propongo actualizar el resumen a:\n\n"${resumenSugerido}"\n\n¿Actualizamos el objetivo general también?`
        );
      }, 400);
      // Don't auto-transition — wait for user to respond to the general-objective proposal
    } else {
      setTimeout(() => this.panelModo.set('detalle'), 1200);
    }
  }

  ajustarMas(): void {
    this.editPropuesta.set(null);
    this.agregarMensajeGali('Claro. ¿Qué más quieres cambiar?');
  }

  private generarResumenGeneral(g: ObjetivoGeneral): string {
    const ped = g.objetivos.find(o => o.metrica === 'pedidos_sem');
    const roas = g.objetivos.find(o => o.metrica === 'roas');
    const plazo = ped?.plazo_semanas ?? g.plazo_semanas;
    const pedMeta = ped?.metaValor ?? 100;
    const roasMeta = roas?.metaValor ?? 2;
    return `Escalar a ${pedMeta} pedidos/sem con ROAS ${roasMeta}x en ${plazo} semanas`;
  }

  aplicarSugerenciaGeneral(): void {
    const sug = this.sugerenciaGeneral();
    if (!sug) return;
    this.objetivoV2.update(g => ({ ...g, resumen: sug }));
    saveObjetivoV2(this.objetivoV2());
    this.sugerenciaGeneral.set(null);
    this.mostrarToast('Objetivo general actualizado');
    // Transition to detalle now that the user has responded
    setTimeout(() => this.panelModo.set('detalle'), 600);
  }

  ignorarSugerenciaGeneral(): void {
    this.sugerenciaGeneral.set(null);
    // Transition to detalle now that the user has responded
    if (this.panelModo() === 'editar') {
      setTimeout(() => this.panelModo.set('detalle'), 400);
    }
  }

  private agregarMensajeGali(texto: string): void {
    this.editMensajes.update(m => [...m, { rol: 'gali', texto }]);
  }

  private mostrarToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3200);
  }

  // ── Mayor fricción — Gali análisis ───────────────────────────────────────
  // Análisis de fricción: 3 variantes que Gali actualiza al recibir perspectivas del usuario
  private readonly friccionVariantes = [
    {
      causa: 'Proveedor logístico',
      descripcion: 'La mayor fricción operativa esta semana es logística: 8 novedades repetidas de Jaya Logistics están afectando tu tasa de novedad (14% vs meta 10%).',
      impacto: 'Tasa de novedad +4pp sobre meta · 8 pedidos en riesgo',
      confianza: 'dato-real' as const,
      accionLabel: 'Ver proveedores alternativos',
      accionRuta: '/productos/proveedores',
    },
    {
      causa: 'Proveedor + tiempos de confirmación',
      descripcion: 'Incorporando tu perspectiva: el tiempo promedio de confirmación de pedidos es 4.2h, amplificando las novedades de Jaya Logistics. Clientes cancelan antes de que confirmes.',
      impacto: 'Tiempo de confirmación: 4.2h promedio · objetivo < 2h · Jaya: 8 novedades',
      confianza: 'tendencia' as const,
      accionLabel: 'Ver mis pedidos',
      accionRuta: '/mis-pedidos/mis-pedidos',
    },
    {
      causa: 'Concentración de canal + proveedor',
      descripcion: 'Análisis actualizado: el 78% de tu volumen pasa por Meta Ads, concentrando el riesgo en un solo canal. Diversificar a TikTok Ads puede reducir fricción al equilibrar la carga por proveedor.',
      impacto: 'Concentración canal: 78% Meta Ads · diversificación recomendada',
      confianza: 'proyeccion' as const,
      accionLabel: 'Configurar canal alternativo',
      accionRuta: '/gali-6/proyectos',
    },
  ];

  readonly friccionVarianteIdx = signal(0);
  readonly friccionReanalizando = signal(false);
  readonly friccionGaliActual = computed(() => this.friccionVariantes[this.friccionVarianteIdx()]);

  readonly friccionUserInput = signal('');

  agregarFriccionUser(): void {
    const texto = this.friccionUserInput().trim();
    if (!texto) return;
    this.friccionUserInput.set('');
    this.mostrarToast('Perspectiva registrada · Gali está reconsiderando…');
    setTimeout(() => {
      this.friccionReanalizando.set(true);
      setTimeout(() => {
        this.friccionVarianteIdx.update(i => (i + 1) % this.friccionVariantes.length);
        this.friccionReanalizando.set(false);
      }, 1400);
    }, 300);
  }

  onFriccionInput(v: string): void { this.friccionUserInput.set(v); }

  onFriccionEnter(e: Event): void { e.preventDefault(); this.agregarFriccionUser(); }

  // ── Destacar objetivos ────────────────────────────────────────────────────
  readonly objetivosDestacados = signal<Set<string>>(new Set());

  toggleDestacar(id: string): void {
    this.objetivosDestacados.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  esDestacado(id: string): boolean {
    return this.objetivosDestacados().has(id);
  }

  // ── Agregar objetivo — chat inline ───────────────────────────────────────────
  readonly metricas: MetricaTipo[] = [
    'pedidos_sem', 'roas', 'ingreso_mensual', 'tasa_novedad', 'clientes_nuevos', 'personalizado',
  ];

  readonly agrMensajes = signal<MensajeEdit[]>([]);
  readonly agrInputUsuario = signal('');
  readonly agrBorrador = signal<Partial<ObjetivoEspecifico>>({});
  readonly agrPaso = signal<'descripcion' | 'propuesta' | 'listo'>('descripcion');
  readonly agrEscribiendo = signal(false);
  readonly agrGuardado = signal(false);
  readonly agrMetrica = signal<MetricaTipo | null>(null);
  readonly agrChatTerminado = signal(false);

  iniciarAgregar(): void {
    this.panelModo.set('agregar');
    this.objetivoDetalleId.set(null);
    this.agrMensajes.set([]);
    this.agrInputUsuario.set('');
    this.agrBorrador.set({});
    this.agrPaso.set('descripcion');
    this.agrEscribiendo.set(false);
    this.agrGuardado.set(false);
    this.agrMetrica.set(null);
    this.agrChatTerminado.set(false);
    setTimeout(() => this.addMsgGali('Cuéntame, ¿qué quieres lograr en tu negocio? Descríbelo con tus palabras — no necesitas un número exacto todavía.'), 200);
  }

  cancelarAgregar(): void { this.panelModo.set('detalle'); }

  agrEnviarMensaje(): void {
    const texto = this.agrInputUsuario().trim();
    if (!texto || this.agrEscribiendo()) return;
    this.agrMensajes.update(m => [...m, { rol: 'usuario', texto }]);
    this.agrInputUsuario.set('');
    this.agrEscribiendo.set(true);
    setTimeout(() => { this.agrEscribiendo.set(false); this.procesarRespAgregar(texto); }, 1000);
  }

  agrOnEnter(e: Event): void { e.preventDefault(); this.agrEnviarMensaje(); }
  agrOnInput(v: string): void { this.agrInputUsuario.set(v); }

  private procesarRespAgregar(texto: string): void {
    const paso = this.agrPaso();

    if (paso === 'descripcion') {
      // Detectar métrica desde palabras clave
      let metrica: MetricaTipo = 'pedidos_sem';
      if (/roas|retorno|rentab/i.test(texto)) metrica = 'roas';
      else if (/ingreso|venta|factur|plata|dinero/i.test(texto)) metrica = 'ingreso_mensual';
      else if (/novedad|devoluc|falla/i.test(texto)) metrica = 'tasa_novedad';
      else if (/cliente|comprador|nuevo/i.test(texto)) metrica = 'clientes_nuevos';

      // Detectar números
      const nums = (texto.match(/\d+([.,]\d+)?/g) ?? []).map(n => parseFloat(n.replace(',', '.')));
      const defaultMetas: Partial<Record<MetricaTipo, number>> = {
        pedidos_sem: 100, roas: 2, ingreso_mensual: 10000000, tasa_novedad: 8, clientes_nuevos: 50,
      };
      const meta = nums[0] ?? defaultMetas[metrica] ?? 100;

      // Detectar plazo
      const tiempoMatch = texto.match(/(\d+)\s*(semana|mes|año)/i);
      const plazo = tiempoMatch
        ? Math.round(parseFloat(tiempoMatch[1]) * (/mes/i.test(tiempoMatch[2]) ? 4 : /año/i.test(tiempoMatch[2]) ? 52 : 1))
        : 12;

      const unidad = METRICA_UNIDAD[metrica];
      const label = METRICA_LABEL[metrica];

      this.agrMetrica.set(metrica);
      this.agrBorrador.set({
        metrica, unidad, metaValor: meta, plazo_semanas: plazo,
        titulo: `${label} de ${meta}${unidad}`,
      });
      this.agrPaso.set('propuesta');
      this.addMsgGali(
        `Entendido. Según lo que describes, te sugiero:\n\n✦ ${label}\n· Meta: ${meta}${unidad}\n· Plazo: ${plazo} semanas\n\n¿Lo agregamos así, o quieres ajustar algo?`
      );

    } else if (paso === 'propuesta') {
      const esSi = /^(sí|si|s|dale|ok|listo|perfecto|claro|correcto|de acuerdo|sí, así|yes)/i.test(texto);
      if (esSi) {
        this.agrPaso.set('listo');
        this.agrChatTerminado.set(true);
        this.addMsgGali('Perfecto. Quedó listo el objetivo. ¿Lo confirmamos?');
      } else {
        // Intentar detectar ajuste específico
        const num = parseFloat((texto.match(/\d+([.,]\d+)?/)?.[0] ?? '').replace(',', '.'));
        const esPlazo = /semana|plazo|mes|tiempo/i.test(texto);
        const b = this.agrBorrador();
        if (!isNaN(num) && esPlazo) {
          const semanas = Math.round(num * (/mes/i.test(texto) ? 4 : 1));
          this.agrBorrador.update(prev => ({ ...prev, plazo_semanas: semanas }));
          this.addMsgGali(`Ajustado a ${semanas} semanas. Entonces: ${METRICA_LABEL[b.metrica!]} · ${b.metaValor}${b.unidad} en ${semanas} semanas. ¿Así está bien?`);
        } else if (!isNaN(num)) {
          this.agrBorrador.update(prev => ({ ...prev, metaValor: num }));
          this.addMsgGali(`Meta ajustada a ${num}${b.unidad}. Entonces: ${METRICA_LABEL[b.metrica!]} · ${num}${b.unidad} en ${b.plazo_semanas} semanas. ¿Así está bien?`);
        } else {
          this.addMsgGali('Cuéntame qué quieres cambiar: el tipo de objetivo, la meta, o el plazo.');
        }
      }
    }
  }

  private addMsgGali(texto: string): void {
    this.agrMensajes.update(m => [...m, { rol: 'gali', texto }]);
  }

  agrConfirmarAgregar(): void {
    const b = this.agrBorrador();
    if (!b.metrica || b.metaValor === undefined || !b.plazo_semanas) return;
    const nuevo: ObjetivoEspecifico = {
      id: `obj-${Date.now()}`,
      titulo: b.titulo ?? METRICA_LABEL[b.metrica],
      metrica: b.metrica,
      unidad: b.unidad ?? METRICA_UNIDAD[b.metrica],
      metaValor: b.metaValor,
      actualValor: 0,
      plazo_semanas: b.plazo_semanas,
      fecha_inicio: new Date().toISOString().slice(0, 10),
      progreso_pct: 0,
    };
    this.objetivoV2.update(g => ({ ...g, objetivos: [...g.objetivos, nuevo] }));
    saveObjetivoV2(this.objetivoV2());
    this.agrGuardado.set(true);
    this.mostrarToast('Objetivo agregado');
    setTimeout(() => { this.abrirDetalle(nuevo.id); }, 1400);
  }

  agrReiniciar(): void { this.iniciarAgregar(); }

  // ── Editar Objetivo General — asesoría estratégica ───────────────────────
  readonly editGenMensajes    = signal<MensajeEdit[]>([]);
  readonly editGenInput       = signal('');
  readonly editGenEscribiendo = signal(false);
  readonly editGenPaso        = signal<'contexto' | 'escucha' | 'analisis' | 'confirmacion'>('contexto');
  readonly editGenPropuesta   = signal<string | null>(null);
  readonly editGenAfectados   = signal<{ obj: ObjetivoEspecifico; nuevaMeta?: number; nuevoPlazo?: number; nuevoProgreso: number }[]>([]);
  readonly editGenNoAfectados = signal<ObjetivoEspecifico[]>([]);
  readonly editGenConfirmado  = signal(false);

  iniciarEditarGeneral(): void {
    this.panelModo.set('editar-general');
    this.editGenMensajes.set([]);
    this.editGenInput.set('');
    this.editGenPropuesta.set(null);
    this.editGenAfectados.set([]);
    this.editGenNoAfectados.set([]);
    this.editGenPaso.set('escucha');
    this.editGenConfirmado.set(false);
    setTimeout(() => this.addMsgEditGen(this.generarMensajeContexto()), 250);
  }

  cancelarEditarGeneral(): void {
    this.panelModo.set('general');
  }

  onEditGenInput(v: string): void { this.editGenInput.set(v); }

  onEditGenEnter(e: Event): void { e.preventDefault(); this.enviarMensajeEditGen(); }

  enviarMensajeEditGen(): void {
    const texto = this.editGenInput().trim();
    if (!texto || this.editGenEscribiendo()) return;
    this.editGenMensajes.update(m => [...m, { rol: 'usuario', texto }]);
    this.editGenInput.set('');
    this.editGenEscribiendo.set(true);
    setTimeout(() => {
      this.editGenEscribiendo.set(false);
      this.procesarEditGeneralResponse(texto);
    }, 1000);
  }

  private generarMensajeContexto(): string {
    const g = this.objetivoV2();
    const inicio = new Date(g.fecha_inicio);
    const diasTranscurridos = Math.floor((Date.now() - inicio.getTime()) / 86_400_000);
    const semanaActual = Math.min(g.plazo_semanas, Math.max(1, Math.ceil(diasTranscurridos / 7)));

    const enBuenRitmo = g.objetivos.filter(o => o.progreso_pct >= 60);
    const enRiesgo    = g.objetivos.filter(o => o.progreso_pct < 40);

    const lineasBuenRitmo = enBuenRitmo.map(o => `"${o.titulo}" (${o.progreso_pct}%)`).join(' · ');
    const lineasRiesgo    = enRiesgo.map(o => `"${o.titulo}" (${o.progreso_pct}%)`).join(' · ');

    return [
      `Antes de cambiar tu objetivo principal, aquí está tu contexto:`,
      ``,
      `• Semana ${semanaActual} de ${g.plazo_semanas} · Progreso general: ${g.progreso_pct}%`,
      enBuenRitmo.length ? `• En buen ritmo: ${lineasBuenRitmo}` : '',
      enRiesgo.length    ? `• Requiere atención: ${lineasRiesgo}` : '',
      ``,
      `¿Qué quieres cambiar en tu objetivo principal? Puedes describir un nuevo rumbo, ajustar la ambición o cambiar el horizonte de tiempo.`,
    ].filter(l => l !== '').join('\n');
  }

  private procesarEditGeneralResponse(texto: string): void {
    const g = this.objetivoV2();
    const numMatch = texto.match(/\d+([.,]\d+)?/);
    const num = numMatch ? parseFloat(numMatch[0].replace(',', '.')) : NaN;

    const esPedidos  = /pedido|orden|venta|semana(?!\s*\d)|semanal/i.test(texto);
    const esRoas     = /roas|retorno|rentab/i.test(texto);
    const esPlazo    = /semana|mes|tiempo|plazo|extender|horizonte|año/i.test(texto) && !esPedidos;
    const esIngreso  = /ingreso|factur|plata|dinero|million|millon|cop/i.test(texto);
    const esNovedad  = /novedad|devoluc|falla/i.test(texto);
    const esClientes = /cliente|comprador|nuevo/i.test(texto);

    const afectados: { obj: ObjetivoEspecifico; nuevaMeta?: number; nuevoPlazo?: number; nuevoProgreso: number }[] = [];
    const noAfectados: ObjetivoEspecifico[] = [];

    if (isNaN(num) && texto.length < 20) {
      this.addMsgEditGen('No entendí bien el cambio que buscas. Puedes decirme:\n• Una nueva meta: "quiero llegar a 150 pedidos"\n• Un nuevo plazo: "quiero 16 semanas"\n• Un nuevo rumbo: "quiero enfocarme en clientes recurrentes"');
      return;
    }

    for (const obj of g.objetivos) {
      let afectado = false;
      let nuevaMeta: number | undefined;
      let nuevoPlazo: number | undefined;

      if (esPlazo && !isNaN(num)) {
        const semanas = Math.round(num * (/mes/i.test(texto) ? 4 : /año/i.test(texto) ? 52 : 1));
        nuevoPlazo = semanas;
        afectado = true;
      } else if ((esPedidos && obj.metrica === 'pedidos_sem') ||
                 (esRoas    && obj.metrica === 'roas') ||
                 (esIngreso && obj.metrica === 'ingreso_mensual') ||
                 (esNovedad && obj.metrica === 'tasa_novedad') ||
                 (esClientes && obj.metrica === 'clientes_nuevos')) {
        if (!isNaN(num)) {
          nuevaMeta = num;
          afectado = true;
        }
      }

      if (afectado) {
        const nuevoProgreso = nuevaMeta
          ? Math.min(100, Math.round((obj.actualValor / nuevaMeta) * 100))
          : obj.progreso_pct;
        afectados.push({ obj, nuevaMeta, nuevoPlazo, nuevoProgreso });
      } else {
        noAfectados.push(obj);
      }
    }

    this.editGenAfectados.set(afectados);
    this.editGenNoAfectados.set(noAfectados);

    // Generar nuevo resumen del objetivo general
    const pedObj  = g.objetivos.find(o => o.metrica === 'pedidos_sem');
    const roasObj = g.objetivos.find(o => o.metrica === 'roas');
    const afPed   = afectados.find(a => a.obj.metrica === 'pedidos_sem');
    const afRoas  = afectados.find(a => a.obj.metrica === 'roas');
    const afPlazo = afectados.find(a => a.nuevoPlazo);

    const pedMeta  = afPed?.nuevaMeta  ?? pedObj?.metaValor  ?? 100;
    const roasMeta = afRoas?.nuevaMeta ?? roasObj?.metaValor ?? 2;
    const plazo    = afPlazo?.nuevoPlazo ?? pedObj?.plazo_semanas ?? g.plazo_semanas;
    const nuevoResumen = `Escalar a ${pedMeta} pedidos/sem con ROAS ${roasMeta}x en ${plazo} semanas`;
    this.editGenPropuesta.set(nuevoResumen);

    // Construir mensaje de análisis
    let msg = '';
    if (afectados.length === 0) {
      msg = `El cambio que describes es compatible con todos tus sub-objetivos actuales — no necesitan modificarse.\n\nNuevo objetivo general propuesto:\n"${nuevoResumen}"\n\n¿Confirmamos?`;
    } else {
      const lineasAfect = afectados.map(a => {
        const cambio = a.nuevaMeta
          ? `${a.obj.metaValor}${a.obj.unidad} → ${a.nuevaMeta}${a.obj.unidad}`
          : `${a.obj.plazo_semanas} sem → ${a.nuevoPlazo} sem`;
        const pctNuevo = a.nuevaMeta
          ? Math.round((a.obj.actualValor / a.nuevaMeta) * 100)
          : a.obj.progreso_pct;
        return `↗ "${a.obj.titulo}": ${cambio} (pasarías al ${pctNuevo}%)`;
      }).join('\n');

      const sinCambio = noAfectados.length
        ? `\nSin cambio: ${noAfectados.map(o => `"${o.titulo}"`).join(' · ')}`
        : '';

      msg = `Si cambias tu objetivo principal, esto impacta:\n\n${lineasAfect}${sinCambio}\n\nNuevo objetivo general propuesto:\n"${nuevoResumen}"\n\n¿Actualizamos el objetivo general y los sub-objetivos afectados?`;
    }

    this.addMsgEditGen(msg);
    this.editGenPaso.set('confirmacion');
  }

  confirmarEditGeneral(): void {
    const propuesta = this.editGenPropuesta();
    if (!propuesta) return;

    this.objetivoV2.update(g => {
      const objetivosActualizados = g.objetivos.map(obj => {
        const af = this.editGenAfectados().find(a => a.obj.id === obj.id);
        if (!af) return obj;
        const nuevaMetaValor  = af.nuevaMeta   ?? obj.metaValor;
        const nuevoPlazo      = af.nuevoPlazo  ?? obj.plazo_semanas;
        const nuevoPct        = Math.round((obj.actualValor / nuevaMetaValor) * 100);
        return { ...obj, metaValor: nuevaMetaValor, plazo_semanas: nuevoPlazo, progreso_pct: nuevoPct };
      });
      const nuevoProgreso = Math.round(
        objetivosActualizados.reduce((s, o) => s + o.progreso_pct, 0) / objetivosActualizados.length
      );
      return { ...g, resumen: propuesta, objetivos: objetivosActualizados, progreso_pct: nuevoProgreso };
    });

    saveObjetivoV2(this.objetivoV2());
    this.editGenConfirmado.set(true);
    this.mostrarToast('Objetivo principal actualizado');
    setTimeout(() => this.panelModo.set('general'), 1000);
  }

  private addMsgEditGen(texto: string): void {
    this.editGenMensajes.update(m => [...m, { rol: 'gali', texto }]);
  }

  // ── Datos financieros clave ───────────────────────────────────────────────
  readonly financiero = {
    ingresosSemana: '$4.2M COP',
    margenBruto: '28.4%',
    pedidosFact: 47,
    roasPromedio: '1.93x',
    ingresosMes: '$16.8M COP',
    margenMes: '29.1%',
    pedidosMes: 183,
    deltaIngresos: '+12%',
    deltaPositivo: true,
    canalPrincipal: 'Meta Ads',
    canalPct: '78%',
    canalAlt: 'TikTok Ads',
    canalAltPct: '22%',
  };

  ngOnInit(): void {
    this.objetivoV2.set(getObjetivoV2());
  }
}

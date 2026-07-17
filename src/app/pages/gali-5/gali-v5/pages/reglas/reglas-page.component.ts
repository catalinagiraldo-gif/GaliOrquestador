import { Component, inject, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliOntologyStripComponent } from '../../components/gali-ontology-strip/gali-ontology-strip.component';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';

export interface EscalamientoRegla {
  id: string;
  condicion: string;
  accion: string;
  tipo: 'escalar' | 'pausar' | 'rotar' | 'ahorrar' | 'expandir';
  metrica: string;
  umbral: string;
  active: boolean;
  info: string;
}

const ESCALAMIENTO_DEFAULTS: EscalamientoRegla[] = [
  { id: 'e1', condicion: 'ROAS > objetivo × 1.3 por 48h y CPA bajo objetivo', accion: 'Escalar presupuesto +20%', tipo: 'escalar', metrica: 'ROAS', umbral: '>1.3×/48h', active: true, info: 'Regla del 20% — igual que Revealbot. Si ROAS se mantiene, Roax escala cada 48h sin pedir permiso.' },
  { id: 'e2', condicion: 'CTR < 0.8% durante 24h continuas', accion: 'Pausar anuncio + activar creativo de respaldo', tipo: 'pausar', metrica: 'CTR', umbral: '<0.8%/24h', active: true, info: 'Evita gastar plata en un anuncio que no conecta. Roax activa el siguiente creativo del banco.' },
  { id: 'e3', condicion: 'Frecuencia > 3.0 durante 3 días seguidos', accion: 'Rotar creativos automáticamente', tipo: 'rotar', metrica: 'Freq.', umbral: '>3.0/3d', active: false, info: 'Cuando la misma persona ve el anuncio 3+ veces, el CTR colapsa. Rotar refresca la campaña.' },
  { id: 'e4', condicion: 'Hora actual > 22:30 o < 06:00 (dayparting)', accion: 'Pausar pauta hasta las 6am', tipo: 'ahorrar', metrica: 'Hora', umbral: '>22:30', active: false, info: 'Ahorra ~22% en horas con conversión mínima. Muy útil en skincare y hogar.' },
  { id: 'e5', condicion: 'CPA > objetivo × 1.5 por más de 6h', accion: 'Reducir presupuesto 30%', tipo: 'pausar', metrica: 'CPA', umbral: '>1.5×/6h', active: true, info: 'Para la hemorragia antes de que se vuelva crítica. Mejor cortar 30% que pausar todo.' },
  { id: 'e6', condicion: 'CPM sube >40% en 3 días (saturación)', accion: 'Expandir audiencia lookalike 1% → 2%', tipo: 'expandir', metrica: 'CPM', umbral: '>40%/3d', active: false, info: 'Cuando la audiencia se satura, ampliarla 1% baja el CPM sin perder calidad.' },
];

export interface GaliRegla {
  id: string;
  agent: 'Chatea Pro' | 'Roax' | 'Vigilante';
  agentColor: string;
  ifLabel: string;
  thenLabel: string;
  ejemplo: string;
  active: boolean;
  scope: string;
}

const STORAGE_KEY = 'gali_reglas_state';

@Component({
  selector: 'app-reglas-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliOntologyStripComponent, DropiGaliBarComponent],
  templateUrl: './reglas-page.component.html',
  styleUrl: './reglas-page.component.scss',
})
export class ReglasPageComponent {
  /** true cuando se embebe dentro de otro shell (ej. Centro de Gali) — oculta el banner y el título propios */
  readonly embedded = input(false);

  readonly reglas = signal<GaliRegla[]>(this.loadReglas());
  readonly escalamiento = signal<EscalamientoRegla[]>(ESCALAMIENTO_DEFAULTS);
  readonly showEscalamientoInfo = signal<string | null>(null);

  toggleEscalamiento(id: string): void {
    this.escalamiento.update(list =>
      list.map(r => r.id === id ? { ...r, active: !r.active } : r),
    );
  }

  get activeEscalamientoCount(): number {
    return this.escalamiento().filter(r => r.active).length;
  }

  tipoIcon(tipo: EscalamientoRegla['tipo']): string {
    return { escalar: '↑', pausar: '⏸', rotar: '↻', ahorrar: '💡', expandir: '⊕' }[tipo];
  }

  tipoClass(tipo: EscalamientoRegla['tipo']): string {
    return `esc-badge--${tipo}`;
  }

  private loadReglas(): GaliRegla[] {
    const defaults: GaliRegla[] = [
      {
        id: 'r1',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'el pedido va pa\' municipio y la transportadora marca zona rural',
        thenLabel: 'le escribe al cliente pidiendo anticipo de $25.000 antes de despachar',
        ejemplo: 'Ej: "Parce, para despachar a Leticia necesitamos un anticipo de $25.000. ¿Te sirve?"',
        active: true,
        scope: 'WhatsApp · confirmación',
      },
      {
        id: 'r2',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'el cliente dejó el carrito tirado más de 6 horas',
        thenLabel: 'manda la secuencia de 3 mensajes (suave → urgencia → oferta final)',
        ejemplo: 'Ej: "Oye, tu difusor sigue reservado. Hoy cerramos envíos a las 5 pm."',
        active: true,
        scope: 'WhatsApp · recuperación',
      },
      {
        id: 'r3',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'la huella del cliente está verde y la billetera al día',
        thenLabel: 'confirma el pedido solo y genera guía sin que tú entres',
        ejemplo: 'Para clientes recurrentes en Bogotá/Medellín con historial limpio.',
        active: true,
        scope: 'Pedidos · auto-confirmación',
      },
      {
        id: 'r4',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'hay novedad logística y el cliente pregunta por WhatsApp',
        thenLabel: 'responde con el estado real y ofrece reenvío o cambio de dirección',
        ejemplo: 'Evita que el cliente piense que lo están estafando.',
        active: false,
        scope: 'CAS · novedades',
      },
      {
        id: 'r5',
        agent: 'Roax',
        agentColor: '#f97316',
        ifLabel: 'el ROAS lleva 48h por encima del objetivo y el CPA está bajo',
        thenLabel: 'sube el presupuesto un 20% (tope diario que tú defines)',
        ejemplo: 'Regla del 20% — como Revealbot pero en español y con tus números reales.',
        active: true,
        scope: 'Meta Ads · escalamiento',
      },
      {
        id: 'r6',
        agent: 'Roax',
        agentColor: '#f97316',
        ifLabel: 'son las 11 pm y la campaña sigue prendida',
        thenLabel: 'pausa la pauta hasta las 6 am (ahorra ~22% en horas muertas)',
        ejemplo: 'Muy usada en skincare y hogar cuando la conversión cae de noche.',
        active: false,
        scope: 'Meta Ads · ahorro',
      },
      {
        id: 'r7',
        agent: 'Vigilante',
        agentColor: '#fbbf24',
        ifLabel: 'la novedad de Coordinadora en Bogotá supera el 10%',
        thenLabel: 'reasigna pedidos nuevos a Servientrega en esa ciudad',
        ejemplo: 'Solo aplica a pedidos que aún no tienen guía impresa.',
        active: true,
        scope: 'Logística · smart routing',
      },
    ];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const saved = JSON.parse(raw) as Record<string, boolean>;
      return defaults.map(r => ({ ...r, active: saved[r.id] ?? r.active }));
    } catch {
      return defaults;
    }
  }

  private persist(): void {
    const map = Object.fromEntries(this.reglas().map(r => [r.id, r.active]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }

  toggle(id: string): void {
    this.reglas.update(list =>
      list.map(r => (r.id === id ? { ...r, active: !r.active } : r)),
    );
    this.persist();
  }

  readonly showNewRule = signal(false);
  readonly newRuleText = signal('');
  readonly newRuleAgent = signal<'Chatea Pro' | 'Roax' | 'Vigilante'>('Chatea Pro');
  readonly newRuleSaved = signal(false);

  readonly parsedRulePreview = computed(() => {
    const text = this.newRuleText().trim();
    if (text.length < 10) return null;
    const arrowIdx = text.indexOf('→');
    if (arrowIdx > 0) {
      return {
        si: text.slice(0, arrowIdx).replace(/^(Si|Cuando|si|cuando)\s+/i, '').trim(),
        entonces: text.slice(arrowIdx + 1).trim(),
      };
    }
    // Heuristic: look for action verbs
    const actionVerbs = /\b(pausar|enviar|cambiar|notificar|escalar|activar|desactivar|registrar|alertar|bloquear|asignar)\b/i;
    const match = text.match(actionVerbs);
    if (match?.index) {
      return {
        si: text.slice(0, match.index).replace(/^(Si|Cuando|si|cuando)\s+/i, '').trim().replace(/[,.]$/, ''),
        entonces: text.slice(match.index).trim(),
      };
    }
    return null;
  });

  readonly agentOptions: Array<{ name: 'Chatea Pro' | 'Roax' | 'Vigilante'; color: string }> = [
    { name: 'Chatea Pro', color: '#34d399' },
    { name: 'Roax', color: '#f97316' },
    { name: 'Vigilante', color: '#fbbf24' },
  ];

  readonly allAgentsForAssign = [
    { id: 'chatea-pro', nombre: 'Chatea Pro', color: '#34d399', custom: false },
    { id: 'roax',       nombre: 'Roax',       color: '#f97316', custom: false },
    { id: 'vigilante',  nombre: 'Vigilante',  color: '#fbbf24', custom: false },
    { id: 'ada-spy',    nombre: 'ADA Spy',    color: '#818cf8', custom: false },
    { id: 'kronos',     nombre: 'Kronos',     color: '#60a5fa', custom: false },
    { id: 'custom-1',   nombre: 'Mi Agente Drops v2', color: '#a78bfa', custom: true },
  ];

  readonly assignedAgentIds = signal<string[]>(['chatea-pro']);

  toggleAssignedAgent(id: string): void {
    this.assignedAgentIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  prefillRuleExample(): void {
    const examples = {
      'Chatea Pro': 'Si el cliente lleva más de 24h sin responder → enviar seguimiento automático con el estado del pedido.',
      'Roax': 'Si el ROAS cae por debajo de 1.5x durante 12h → pausar el conjunto de anuncios y notificarme.',
      'Vigilante': 'Si la novedad de una transportadora supera el 15% esta semana → cambiar pedidos nuevos a la alternativa.',
    };
    this.newRuleText.set(examples[this.newRuleAgent()]);
  }

  addNewRule(): void {
    const text = this.newRuleText().trim();
    if (!text) return;
    const agent = this.newRuleAgent();
    const colorMap = { 'Chatea Pro': '#34d399', 'Roax': '#f97316', 'Vigilante': '#fbbf24' };
    const newRegla: GaliRegla = {
      id: `r${Date.now()}`,
      agent,
      agentColor: colorMap[agent],
      ifLabel: text.split('→')[0]?.replace(/^Si /i, '').trim() ?? text,
      thenLabel: text.split('→')[1]?.trim() ?? 'Acción pendiente de definir',
      ejemplo: text,
      active: true,
      scope: `Personalizada · ${this.assignedAgentIds().length} agente${this.assignedAgentIds().length !== 1 ? 's' : ''}`,
    };
    this.reglas.update(list => [newRegla, ...list]);
    this.persist();
    this.newRuleSaved.set(true);
    setTimeout(() => {
      this.newRuleText.set('');
      this.assignedAgentIds.set(['chatea-pro']);
      this.newRuleSaved.set(false);
      this.showNewRule.set(false);
    }, 1200);
  }
}

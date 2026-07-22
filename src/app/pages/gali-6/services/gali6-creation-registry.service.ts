import { Injectable, signal } from '@angular/core';
import { AgenteEspecializado } from '../../../../../mocks/gali-v6/agentes-especializados';
import { GaliRegla } from '../../gali-5/gali-v5/pages/reglas/reglas-page.component';
import { SkillRule } from '../../gali-5/gali-v5/components/gali-skill-builder-v2/gali-skill-builder-v2.component';
import { PropuestaAgente, PropuestaRegla, PropuestaSkill } from '../gali-chat/models/gali6-creation.model';

const STORAGE_KEY = 'gali6-creation-registry';

interface StoredRegistry {
  agentes: AgenteEspecializado[];
  reglas: GaliRegla[];
  skills: SkillRule[];
}

function loadStored(): StoredRegistry {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { agentes: [], reglas: [], skills: [] };
    const parsed = JSON.parse(raw) as Partial<StoredRegistry>;
    return { agentes: parsed.agentes ?? [], reglas: parsed.reglas ?? [], skills: parsed.skills ?? [] };
  } catch {
    return { agentes: [], reglas: [], skills: [] };
  }
}

const AGENT_COLOR_MAP: Record<'Chatea Pro' | 'Roax' | 'Vigilante', string> = {
  'Chatea Pro': '#34d399',
  Roax: '#f97316',
  Vigilante: '#fbbf24',
};

/** ReglasPageComponent (gali-v5) solo reconoce estos 3 agentes — heurística simple para no dejar la regla huérfana. */
function inferAgenteRegla(texto: string): 'Chatea Pro' | 'Roax' | 'Vigilante' {
  const t = texto.toLowerCase();
  if (/roas|pauta|presupuesto|campañ|campan|ads|meta|tiktok/.test(t)) return 'Roax';
  if (/whatsapp|cliente|mensaje|carrito|chatea/.test(t)) return 'Chatea Pro';
  return 'Vigilante';
}

/**
 * Store de todo lo creado por el usuario desde el flujo conversacional (agentes/reglas/skills),
 * persistido en localStorage a diferencia de Gali6LiveMutationsService (que muta filas de mocks
 * del sistema) — este contenido lo crea el usuario y debe sobrevivir un refresh.
 * Ver docs/SpecsNuevos/18.FlujoUsuarioGali6.md §5.8 (Flujo K).
 */
@Injectable({ providedIn: 'root' })
export class Gali6CreationRegistryService {
  readonly version = signal(0);

  private readonly stored = loadStored();
  readonly agentesCreados = signal<AgenteEspecializado[]>(this.stored.agentes);
  readonly reglasCreadas = signal<GaliRegla[]>(this.stored.reglas);
  readonly skillsCreadas = signal<SkillRule[]>(this.stored.skills);

  crearAgente(propuesta: PropuestaAgente): AgenteEspecializado {
    const esContinuo = /continu|monitor|siempre|constan/i.test(propuesta.frecuencia);
    const agente: AgenteEspecializado = {
      id: `custom-agente-${Date.now()}`,
      nombre: propuesta.nombre,
      nombreCorto: propuesta.nombre.split(' ').slice(0, 2).join(' '),
      descripcion: propuesta.proposito,
      descripcionCorta: propuesta.proposito.length > 80 ? `${propuesta.proposito.slice(0, 77)}...` : propuesta.proposito,
      monitorea: [propuesta.proposito],
      tier: 'free',
      tipo: esContinuo ? 'deterministico' : 'ia-ligera',
      skillsDefecto: [],
      reglasDefecto: [],
      enPaquetePrincipiantes: false,
      icono: 'pi pi-sparkles',
      colorAvatar: '#a78bfa',
      estado: 'activo',
      autonomiaPct: propuesta.autonomiaPct,
    };
    this.agentesCreados.update(list => [agente, ...list]);
    this.persist();
    this.version.update(v => v + 1);
    return agente;
  }

  crearRegla(propuesta: PropuestaRegla): GaliRegla {
    const agent = inferAgenteRegla(`${propuesta.condicion} ${propuesta.accion}`);
    const regla: GaliRegla = {
      id: `custom-regla-${Date.now()}`,
      agent,
      agentColor: AGENT_COLOR_MAP[agent],
      ifLabel: propuesta.condicion,
      thenLabel: propuesta.accion,
      ejemplo: `Si ${propuesta.condicion} → ${propuesta.accion}`,
      active: true,
      scope: 'Creada desde el chat',
    };
    this.agregarReglaExistente(regla);
    return regla;
  }

  /** Usado tanto por crearRegla() como por el form inline de ReglasPageComponent — evita reimplementar el push+persist. */
  agregarReglaExistente(regla: GaliRegla): void {
    this.reglasCreadas.update(list => [regla, ...list]);
    this.persist();
    this.version.update(v => v + 1);
  }

  toggleRegla(id: string): boolean {
    if (!this.reglasCreadas().some(r => r.id === id)) return false;
    this.reglasCreadas.update(list => list.map(r => r.id === id ? { ...r, active: !r.active } : r));
    this.persist();
    this.version.update(v => v + 1);
    return true;
  }

  crearSkill(propuesta: PropuestaSkill): SkillRule {
    const skill: SkillRule = {
      id: `custom-skill-${Date.now()}`,
      nombre: propuesta.nombre,
      descripcion: propuesta.descripcion,
      status: 'active',
      ultima_ejecucion: 'Recién creada',
      ejecuciones_total: 0,
      runHistory: [],
    };
    this.skillsCreadas.update(list => [skill, ...list]);
    this.persist();
    this.version.update(v => v + 1);
    return skill;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      agentes: this.agentesCreados(),
      reglas: this.reglasCreadas(),
      skills: this.skillsCreadas(),
    } satisfies StoredRegistry));
  }
}

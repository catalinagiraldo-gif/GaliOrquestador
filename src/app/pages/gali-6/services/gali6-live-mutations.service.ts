import { Injectable, signal } from '@angular/core';
import { PROYECTOS_MOCK } from '../../../../../mocks/gali-v6/proyectos.mock';
import { MOCK_CAMPANAS } from '../../../../../mocks/gali-v6/campanas.mock';
import { MOCK_ALERTAS, MOCK_SENALES } from '../../../../../mocks/gali-v5/senales.mock';
import { AGENTES_ESPECIALIZADOS } from '../../../../../mocks/gali-v6/agentes-especializados';

/**
 * Fuente de verdad única para mutaciones que tanto el chat de Gali como la UI
 * normal deben poder disparar de forma equivalente. `version` se incrementa
 * en cada mutación — los `computed`/métodos que leen estos mocks deben tratar
 * `version()` como señal de invalidación, ya que la mutación en sí es sobre
 * arrays planos en memoria de módulo, no signals. Ver §3.3 del plan.
 *
 * Misma prioridad de fuente que Gali6ProyectosCasaComponent.getCampanas():
 * MOCK_CAMPANAS primero (fuente real para proyectos ya migrados, ej.
 * collar-gps-2026), fallback a las campañas embebidas en PROYECTOS_MOCK.
 */
@Injectable({ providedIn: 'root' })
export class Gali6LiveMutationsService {
  readonly version = signal(0);

  pausarCampana(proyectoId: string, campanaId: string): boolean {
    const enMockCampanas = MOCK_CAMPANAS.find(c => c.id === campanaId && c.proyectoId === proyectoId);
    if (enMockCampanas) {
      enMockCampanas.estado = 'pausada';
      this.version.update(v => v + 1);
      return true;
    }

    const pv = PROYECTOS_MOCK.find(p => p.id === proyectoId);
    const c = pv?.campanas.find(c => c.id === campanaId);
    if (!c) return false;
    c.estado = 'pausada';
    this.version.update(v => v + 1);
    return true;
  }

  /** Busca en alertas y señales por igual — ambas comparten el mismo id-space en la UI de Señales. */
  resolverAlerta(id: string): boolean {
    const alerta = MOCK_ALERTAS.find(a => a.id === id);
    if (alerta) {
      alerta.resuelta = true;
      this.version.update(v => v + 1);
      return true;
    }
    const senal = MOCK_SENALES.find(s => s.id === id);
    if (senal) {
      senal.resuelta = true;
      this.version.update(v => v + 1);
      return true;
    }
    return false;
  }

  /**
   * Nota conocida: /gali-6/agentes mantiene su propio signal local
   * (`agentesEstado`) que no re-lee `version()`, así que un toggle disparado
   * desde el chat no se refleja ahí hasta recargar esa página. Corregirlo
   * tocaría esa página, fuera de alcance de este panel — ver plan §"Tab Agentes".
   */
  toggleAgenteEstado(agenteId: string): 'activo' | 'pausado' | null {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return null;
    agente.estado = agente.estado === 'activo' ? 'pausado' : 'activo';
    this.version.update(v => v + 1);
    return agente.estado;
  }
}

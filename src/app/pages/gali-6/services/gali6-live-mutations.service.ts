import { Injectable, signal } from '@angular/core';
import { PROYECTOS_MOCK } from '../../../../../mocks/gali-v6/proyectos.mock';
import { MOCK_CAMPANAS } from '../../../../../mocks/gali-v6/campanas.mock';
import { MOCK_ALERTAS, MOCK_SENALES } from '../../../../../mocks/gali-v5/senales.mock';
import { AGENTES_ESPECIALIZADOS, AgenteReglaDefault } from '../../../../../mocks/gali-v6/agentes-especializados';
import addressesData from '../../../../../mocks/gali-v5/validador-addresses.json';

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

  /** Productos con recolección pausada por stock-out (mock — Flujo A, 18.FlujoUsuarioGali6.md §1.2). */
  private readonly recoleccionesPausadas = new Set<string>();

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

  /** Marca una dirección del Validador como corregida/validada (mock — ver gali6-chat.service.ts, regla "corrige la dirección"). */
  corregirDireccion(addressId: string): boolean {
    const addr = addressesData.addresses.find(a => a.id === addressId);
    if (!addr) return false;
    addr.validated = true;
    this.version.update(v => v + 1);
    return true;
  }

  /** Pausa la recolección de un producto en riesgo de stock-out (mock — ver gali6-chat.service.ts, Flujo A). */
  pausarRecoleccion(productoId: string): boolean {
    this.recoleccionesPausadas.add(productoId);
    this.version.update(v => v + 1);
    return true;
  }

  recoleccionPausada(productoId: string): boolean {
    return this.recoleccionesPausadas.has(productoId);
  }

  toggleAgenteEstado(agenteId: string): 'activo' | 'pausado' | null {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return null;
    agente.estado = agente.estado === 'activo' ? 'pausado' : 'activo';
    this.version.update(v => v + 1);
    return agente.estado;
  }

  /** Fuerza un estado específico (a diferencia de toggleAgenteEstado) — usado por "pausar" explícito. */
  setEstadoAgente(agenteId: string, estado: 'activo' | 'pausado' | 'disponible'): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return false;
    agente.estado = estado;
    this.version.update(v => v + 1);
    return true;
  }

  setAutonomiaAgente(agenteId: string, pct: number): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return false;
    agente.autonomiaPct = pct;
    this.version.update(v => v + 1);
    return true;
  }

  toggleSkillAgente(agenteId: string, skillId: string): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    const skill = agente?.skillsDefecto.find(sk => sk.id === skillId);
    if (!skill) return false;
    skill.activa = skill.activa === false ? true : false;
    this.version.update(v => v + 1);
    return true;
  }

  agregarReglaAgente(agenteId: string, condicion: string, accion: string): AgenteReglaDefault | null {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return null;
    const regla: AgenteReglaDefault = {
      id: `${agenteId}-r${Date.now()}`,
      condicion,
      accion,
      tipo: 'deterministico',
      activa: true,
    };
    agente.reglasDefecto.push(regla);
    this.version.update(v => v + 1);
    return regla;
  }

  eliminarReglaAgente(agenteId: string, reglaId: string): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return false;
    const idx = agente.reglasDefecto.findIndex(r => r.id === reglaId);
    if (idx === -1) return false;
    agente.reglasDefecto.splice(idx, 1);
    this.version.update(v => v + 1);
    return true;
  }

  /** Reasigna el agente a una única sección (Flujo I, 18.FlujoUsuarioGali6.md §5.2) — reemplaza apareceEn en vez de sumarlo. */
  moverAgenteASeccion(agenteId: string, screenId: string): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return false;
    agente.apareceEn = [screenId];
    this.version.update(v => v + 1);
    return true;
  }

  agregarSeccionAAgente(agenteId: string, screenId: string): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return false;
    const actuales = agente.apareceEn ?? [];
    if (actuales.includes(screenId)) return true;
    agente.apareceEn = [...actuales, screenId];
    this.version.update(v => v + 1);
    return true;
  }

  quitarSeccionDeAgente(agenteId: string, screenId: string): boolean {
    const agente = AGENTES_ESPECIALIZADOS.find(a => a.id === agenteId);
    if (!agente) return false;
    agente.apareceEn = (agente.apareceEn ?? []).filter(s => s !== screenId);
    this.version.update(v => v + 1);
    return true;
  }
}

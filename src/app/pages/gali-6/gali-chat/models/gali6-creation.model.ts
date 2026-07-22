export type Gali6CreationTipo = 'agente' | 'regla' | 'skill';
export type Gali6CreationModo = 'crear' | 'editar';

export interface PropuestaAgente {
  nombre: string;
  proposito: string;
  /** Texto libre capturado del usuario, ej: "continuamente", "una vez al día", "cuando pase X" */
  frecuencia: string;
  autonomiaPct: number;
}

export interface PropuestaRegla {
  condicion: string;
  accion: string;
}

export interface PropuestaSkill {
  nombre: string;
  descripcion: string;
}

/** Diff mostrado antes de confirmar una edición (modo 'editar') — nunca se aplica el estado completo, solo lo que cambia. */
export interface Gali6EdicionDiff {
  agenteId: string;
  campo: 'autonomiaPct' | 'apareceEn' | 'skill' | 'regla';
  descripcion: string;
}

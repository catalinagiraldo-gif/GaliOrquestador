import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type OntologyHighlight = 'agent' | 'skill' | 'rule' | null;

@Component({
  selector: 'gali-ontology-strip',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gali-ontology-strip.component.html',
  styleUrl: './gali-ontology-strip.component.scss',
})
export class GaliOntologyStripComponent implements OnInit {
  /** Resaltar una capa (p. ej. en /agentes o /reglas) */
  @Input() highlight: OntologyHighlight = null;
  /** Iniciar colapsado para ahorrar espacio vertical */
  @Input() startCollapsed = true;

  readonly expanded = signal(false);

  ngOnInit(): void {
    this.expanded.set(!this.startCollapsed);
  }

  toggle(): void {
    this.expanded.update(v => !v);
  }
}

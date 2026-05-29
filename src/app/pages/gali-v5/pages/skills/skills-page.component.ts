import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
} from '../../components/shared';
import { GaliChipComponent } from '../../components/gali-chip/gali-chip.component';
import { MarketplacePageComponent } from '../marketplace/marketplace-page.component';
import { SkillsEditorModalComponent } from '../../components/skills-editor-modal/skills-editor-modal.component';
import userSkillsData from '../../../../../../mocks/gali-v5/user-skills.json';

type SkillsTab = 'mis-skills' | 'crear' | 'marketplace';
type SkillEstado = 'activa' | 'en_prueba' | 'pausada';
type SkillFilter = 'todos' | 'activas' | 'en_prueba' | 'pausadas';

interface UserSkill {
  id: string;
  nombre: string;
  agente: string;
  estado: SkillEstado;
  proyectos: string[];
  ultimaEjecucion: string;
  resultado: string | null;
  connectors: { tipo: string; nombre: string }[];
  ejecuciones: number;
  ahorroEstimado: string | null;
}

interface McpConnector {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  connected: boolean;
}

@Component({
  selector: 'app-skills-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    GaliChipComponent,
    MarketplacePageComponent,
    SkillsEditorModalComponent,
  ],
  templateUrl: './skills-page.component.html',
  styleUrl: './skills-page.component.scss',
})
export class SkillsPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly breadcrumbs = ['Gali', 'Skills'];
  activeTab = signal<SkillsTab>('mis-skills');
  skillFilter = signal<SkillFilter>('todos');
  showEditorModal = signal(false);

  readonly skills: UserSkill[] = userSkillsData as UserSkill[];

  readonly mcpConnectors: McpConnector[] = [
    { id: 'meta-ads', nombre: 'Meta Ads', categoria: 'publicidad', descripcion: 'Campañas, ROAS, CTR', connected: true },
    { id: 'whatsapp-biz', nombre: 'WhatsApp Business', categoria: 'comunicación', descripcion: 'Confirmaciones y secuencias', connected: true },
    { id: 'google-sheets', nombre: 'Google Sheets', categoria: 'datos', descripcion: 'Leer y escribir hojas', connected: true },
    { id: 'google-drive', nombre: 'Google Drive', categoria: 'nube', descripcion: 'PDF, XLSX, documentos', connected: true },
    { id: 'siigo', nombre: 'Siigo', categoria: 'contabilidad', descripcion: 'Facturas y P&L', connected: false },
    { id: 'tiktok-ads', nombre: 'TikTok Ads', categoria: 'publicidad', descripcion: 'Campañas TikTok', connected: false },
  ];

  crearIntencion = signal('');
  crearStep = signal(1);
  attachedFiles = signal<string[]>([]);

  readonly crearEjemplos = [
    'Auto-pausar campañas con bajo CTR',
    'Confirmar pedidos automáticamente',
    'Alertarme si mi ROAS cae',
  ];

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'crear' || tab === 'marketplace' || tab === 'mis-skills') {
        this.activeTab.set(tab);
      }
    });
  }

  get filteredSkills(): UserSkill[] {
    const f = this.skillFilter();
    if (f === 'todos') return this.skills;
    if (f === 'activas') return this.skills.filter(s => s.estado === 'activa');
    if (f === 'en_prueba') return this.skills.filter(s => s.estado === 'en_prueba');
    if (f === 'pausadas') return this.skills.filter(s => s.estado === 'pausada');
    return this.skills;
  }

  get activeSkillsCount(): number {
    return this.skills.filter(s => s.estado === 'activa').length;
  }

  get totalEjecuciones(): number {
    return this.skills.reduce((sum, s) => sum + s.ejecuciones, 0);
  }

  setTab(tab: SkillsTab): void {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

  estadoLabel(estado: SkillEstado): string {
    return { activa: 'Activa', en_prueba: 'En prueba', pausada: 'Pausada' }[estado];
  }

  agentColor(agente: string): string {
    const map: Record<string, string> = {
      Roax: '#ff6102',
      'ADA Spy': '#3b82f6',
      'Chatea Pro': '#10b981',
      Vigilante: '#f59e0b',
      'Agente Financiero': '#8b5cf6',
    };
    return map[agente] ?? '#6b7280';
  }

  useEjemplo(texto: string): void {
    this.crearIntencion.set(texto);
  }

  simularArchivo(): void {
    this.attachedFiles.update(files => [...files, `archivo-${files.length + 1}.pdf`]);
  }

  removeFile(index: number): void {
    this.attachedFiles.update(files => files.filter((_, i) => i !== index));
  }

  toggleConnector(c: McpConnector): void {
    c.connected = !c.connected;
  }

  avanzarCrear(): void {
    if (this.crearStep() < 4) {
      this.crearStep.update(s => s + 1);
    }
  }

  retrocederCrear(): void {
    if (this.crearStep() > 1) {
      this.crearStep.update(s => s - 1);
    }
  }

  activarSkill(): void {
    this.crearStep.set(1);
    this.crearIntencion.set('');
    this.attachedFiles.set([]);
    this.setTab('mis-skills');
  }

  openEditor(): void {
    this.showEditorModal.set(true);
  }

  closeEditor(): void {
    this.showEditorModal.set(false);
  }
}

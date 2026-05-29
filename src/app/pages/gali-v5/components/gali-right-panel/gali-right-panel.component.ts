import { Component, EventEmitter, Output, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GaliStateService } from '../../services/gali-state.service';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

type PanelTab = 'chat' | 'agentes' | 'senales' | 'live';

@Component({
  selector: 'gali-right-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-right-panel.component.html',
  styleUrl: './gali-right-panel.component.scss',
})
export class GaliRightPanelComponent implements AfterViewChecked {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('chatEnd') chatEnd?: ElementRef;

  readonly gali = inject(GaliStateService);
  readonly ws = inject(GaliWorkspaceService);
  private router = inject(Router);

  activeTab = signal<PanelTab>('chat');
  chatInput = signal('');

  private readonly agentColors: Record<string, string> = {
    roax: '#f97316',
    vigilante: '#fbbf24',
    chatea: '#34d399',
    ada: '#818cf8',
    vigilante_logístico: '#fbbf24',
  };

  agentColor(id: string): string {
    return this.agentColors[id.toLowerCase()] ?? '#9b9ba8';
  }

  setTab(tab: PanelTab): void {
    this.activeTab.set(tab);
  }

  close(): void {
    this.closed.emit();
  }

  toggleAutopilot(): void {
    const next = !this.ws.autopilot();
    this.gali.setAutopilot(next);
  }

  quickAsk(text: string): void {
    this.chatInput.set('');
    this.gali.sendMessage(text);
  }

  executeAction(action: string): void {
    this.gali.executeAction(action);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.close();
  }

  onInputChange(event: Event): void {
    this.chatInput.set((event.target as HTMLInputElement).value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send(): void {
    const text = this.chatInput().trim();
    if (!text) return;
    this.chatInput.set('');
    this.gali.sendMessage(text);
  }

  ngAfterViewChecked(): void {
    this.chatEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

import { Component, EventEmitter, Output, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GaliStateService } from '../../services/gali-state.service';

type PanelTab = 'chat' | 'agentes' | 'senales';

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

  gali = inject(GaliStateService);
  private router = inject(Router);

  activeTab = signal<PanelTab>('chat');
  chatInput = signal('');
  autopilot = signal(false);

  setTab(tab: PanelTab): void {
    this.activeTab.set(tab);
  }

  close(): void {
    this.closed.emit();
  }

  toggleAutopilot(): void {
    const next = !this.autopilot();
    this.autopilot.set(next);
    this.gali.setAutopilot(next);
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

  getAgentInitials(name: string): string {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
  }

  navigateToSignal(signalId: string): void {
    const routes: Record<string, string> = {
      's1': '/gali-v5/logistica/torre-logistica',
      's2': '/gali-v5/marketing/roax-informes',
      's3': '/gali-v5/cas/bandeja',
      's4': '/gali-v5/marketing/campanas',
    };
    const route = routes[signalId] ?? '/gali-v5';
    this.router.navigate([route]);
    this.close();
  }

  ngAfterViewChecked(): void {
    this.chatEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

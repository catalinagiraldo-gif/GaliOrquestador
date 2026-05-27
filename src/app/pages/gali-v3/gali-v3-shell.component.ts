import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GaliTopbarComponent } from '../../components/gali-v3/shell/gali-topbar.component';
import { GaliNavigatorComponent } from '../../components/gali-v3/shell/gali-navigator.component';
import { GaliRightPanelComponent } from '../../components/gali-v3/shell/gali-right-panel.component';
import { GaliCommandPaletteComponent } from '../../components/gali-v3/shell/command-palette.component';
import { GaliBreadcrumbComponent } from '../../components/gali-v3/shell/gali-breadcrumb.component';
import { GaliChatService } from '../../services/gali-v3/chat.service';
import { GaliProjectService } from '../../services/gali-v3/project.service';
import { GaliRightPanelService } from '../../services/gali-v3/right-panel.service';

@Component({
  selector: 'app-gali-v3-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GaliTopbarComponent,
    GaliNavigatorComponent,
    GaliRightPanelComponent,
    GaliCommandPaletteComponent,
    GaliBreadcrumbComponent,
  ],
  templateUrl: './gali-v3-shell.component.html',
  styleUrls: ['./gali-v3-shell.component.scss'],
})
export class GaliV3ShellComponent {
  private router = inject(Router);
  private chatSvc = inject(GaliChatService);
  private projectSvc = inject(GaliProjectService);
  private rpanelSvc = inject(GaliRightPanelService);

  rpanelOpen = this.rpanelSvc.open;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.onRoute(e.urlAfterRedirects);
        this.handlePanelAutoCollapse(e.urlAfterRedirects);
      });

    this.onRoute(this.router.url);
    this.handlePanelAutoCollapse(this.router.url);
  }

  private handlePanelAutoCollapse(url: string) {
    // El Constructor de Bloques tiene su propio chat interno (split 40/60)
    // → auto-colapsar el right panel para evitar competencia visual.
    if (url.includes('/bloque-builder')) {
      this.rpanelSvc.setOpen(false);
    }
  }

  private onRoute(url: string) {
    let route = 'inicio';
    if (url.includes('/proyecto')) {
      route = 'proyecto';
      const match = url.match(/\/proyecto\/([^/?]+)/);
      if (match && match[1] !== 'nuevo') {
        this.projectSvc.setActive(match[1]);
        this.chatSvc.loadProjectHistory(match[1]);
        this.chatSvc.setActiveThread(match[1]);
      }
    } else if (url.includes('/dropi/catalogo')) route = 'catalogo';
    else if (url.includes('/dropi/campanas')) route = 'campanas';
    else if (url.includes('/dropi/pedidos')) route = 'pedidos';
    else if (url.includes('/bloque-builder')) route = 'bloque-builder';
    else if (url.includes('/builder')) route = 'builder';
    else if (url.includes('/mercado')) route = 'mercado';
    else {
      this.projectSvc.setActive(null);
      this.chatSvc.setActiveThread('inicio');
    }
    this.chatSvc.setContextRoute(route);
  }
}

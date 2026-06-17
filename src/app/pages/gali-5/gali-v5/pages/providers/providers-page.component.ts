import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

interface ProviderCard {
  name: string;
  avatar: string;
  productCount: number;
  categories: string;
  premium?: boolean;
  verified?: boolean;
  favorite?: boolean;
}

@Component({
  selector: 'app-providers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DropiGaliBarComponent],
  templateUrl: './providers-page.component.html',
  styleUrl: './providers-page.component.scss',
})
export class ProvidersPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  showFavorites = signal(false);
  searchQuery = '';
  city = '';
  category = 'Todas';

  goToLanzar(): void {
    this.ws.setMode('lanzar');
    this.router.navigate(['/gali-v5/proyectos/nuevo'], { queryParams: { producto: 'collar-gps' } });
  }

  verAnalisisCompleto(): void {
    this.router.navigate(['/gali-v5/productos/catalogo'], { queryParams: { ada: 'collar-gps' } });
  }

  readonly breadcrumbs = ['Productos', 'Catálogo', 'Proveedores'];

  readonly providers: ProviderCard[] = [
    { name: 'Alejandro', avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png', productCount: 1, categories: 'Moda', premium: true },
    { name: 'Astrid Carolina', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 545, categories: 'Belleza, Moda', verified: true },
    { name: 'Harold Hg', avatar: 'assets/images/dropi-baseline/provider-faka.png', productCount: 2, categories: 'Moda', premium: true },
    { name: 'Malu Express', avatar: 'assets/images/dropi-baseline/provider-prendas.png', productCount: 22, categories: 'Belleza, Cocina, Deportes…' },
    { name: 'Skorpius Centro Comercial', avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png', productCount: 157, categories: 'Moda, Otro' },
    { name: 'Juan', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 22, categories: 'Aseo, Bebé, Belleza…', premium: true },
    { name: 'Casa Andina', avatar: 'assets/images/dropi-baseline/provider-faka.png', productCount: 95, categories: 'Herramientas' },
    { name: 'ADMA', avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png', productCount: 545, categories: 'Moda, Belleza', premium: true, verified: true },
    { name: 'Suppli', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 210, categories: 'Hogar, Cocina' },
    { name: 'PUNTO BARATO', avatar: 'assets/images/dropi-baseline/provider-prendas.png', productCount: 19, categories: 'Electrónica' },
    { name: 'Resiland', avatar: 'assets/images/dropi-baseline/provider-faka.png', productCount: 41, categories: 'Deportes' },
    { name: 'Importados y más', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 87, categories: 'Varios', verified: true },
  ];

  toggleFavorite(provider: ProviderCard): void {
    provider.favorite = !provider.favorite;
  }

  // ── Panel Gali H2 + H3 ───────────────────────────────────────────────
  readonly galiPanelOpen = signal(false);
  readonly selectedProvider = signal<ProviderCard | null>(null);
  readonly proveedorTipo = signal<'fabricante' | 'importador' | 'marca' | null>(null);

  openGaliPanel(): void { this.galiPanelOpen.set(true); }

  closeGaliPanel(): void {
    this.galiPanelOpen.set(false);
    this.selectedProvider.set(null);
    this.proveedorTipo.set(null);
  }

  selectGaliProvider(p: ProviderCard, event: Event): void {
    event.stopPropagation();
    this.galiPanelOpen.set(true);
    this.selectedProvider.set(p);
    this.proveedorTipo.set(null);
  }

  selectTipo(tipo: 'fabricante' | 'importador' | 'marca'): void {
    this.proveedorTipo.set(tipo);
  }

  galiProvAnalisis(p: ProviderCard): { calidad: string; sugerencias: string[] } {
    const sugerencias = p.productCount > 100
      ? ['Negociar por volumen (desc. 12%)', 'Explorar exclusividad de SKU']
      : p.verified
        ? ['Solicitar muestra antes de lanzar', 'Acordar plazos de entrega fijos']
        : ['Verificar calidad con pedido de prueba', 'Comparar precios con otro proveedor'];
    return {
      calidad: p.premium ? '4.7/5' : p.verified ? '4.2/5' : '3.8/5',
      sugerencias,
    };
  }

  readonly TIPO_GUIAS = {
    fabricante: {
      titulo: 'Fabricantes en Colombia',
      desc: 'Te conectamos con fabricantes verificados en Colombia. Gali puede analizar sus capacidades de producción y facilitar condiciones de exclusividad.',
      cta: 'Ver fabricantes disponibles →',
    },
    importador: {
      titulo: 'Proveedores internacionales',
      desc: 'Gali puede evaluar proveedores internacionales y calcular costos reales de importación incluyendo aranceles y logística.',
      cta: 'Explorar importadores →',
    },
    marca: {
      titulo: 'Marca propia',
      desc: 'Si tienes la fórmula o diseño, Gali puede ayudarte a encontrar manufactura a medida y facilitar el proceso de marca.',
      cta: 'Construir tu marca con Gali →',
    },
  } as const;
}

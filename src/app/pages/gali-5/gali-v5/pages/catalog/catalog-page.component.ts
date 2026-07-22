import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliStateService } from '../../services/gali-state.service';
import { GaliAdaSpyDetailComponent } from '../../components/gali-ada-spy-detail/gali-ada-spy-detail.component';
import { Gali6ScreenContextService } from '../../../../gali-6/services/gali6-screen-context.service';
import { Gali6ChatService } from '../../../../gali-6/gali-chat/gali6-chat.service';
import { Gali6ScreenArtifactsComponent } from '../../../../gali-6/components/gali6-screen-artifacts.component';
import { Gali6AgentPresenceBarComponent } from '../../../../gali-6/components/gali6-agent-presence-bar.component';

type ProductBadge = 'Variable' | 'Combo';

interface CatalogProvider {
  name: string;
  avatar: string;
  premium: boolean;
  productCount: number;
  categories: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  stock: number;
  supplierName: string;
  price: number;
  suggestedPrice: number;
  badges: ProductBadge[];
  isPrivate: boolean;
  isFavorite: boolean;
  adaScore?: number;
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GaliAdaSpyDetailComponent, Gali6ScreenArtifactsComponent, Gali6AgentPresenceBarComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);
  readonly gali = inject(GaliStateService);
  private readonly screenCtx = inject(Gali6ScreenContextService);
  private readonly chat = inject(Gali6ChatService);

  abrirGaliPanel(): void { this.gali.openCatalogPanel(); }

  goToLanzar(productId?: string): void {
    const id = productId ?? 'difusor';
    this.ws.setHubEntryContext({
      source: 'ada-spy',
      productId: id,
      productName: id === 'difusor' ? 'Difusor aromaterapia' : 'producto seleccionado',
      message: 'Gali detectó que vienes del catálogo — ¿armamos el lanzamiento paso a paso?',
      ctaLabel: 'Abrir asistente de lanzamiento',
      ctaRoute: `/gali-v5/proyectos/nuevo?producto=${id}`,
    });
    this.ws.setMode('lanzar');
    this.router.navigate(['/gali-v5/proyectos/nuevo'], { queryParams: { producto: id } });
  }

  verAnalisis(productId: string): void {
    const mapped = productId === 'reloj' ? 'rodillo-jade' : productId;
    this.selectAdaProduct(mapped);
  }

  readonly adaStripCollapsed = signal(false);
  readonly adaDetailProductId = signal<string | null>(null);

  selectAdaProduct(id: string): void {
    this.adaDetailProductId.set(id);
  }

  // ── Panel Gali contextual H1 ──────────────────────────────────────────
  readonly galiPanelOpen = signal(false);
  readonly selectedProducto = signal<CatalogProduct | null>(null);
  readonly galiLanzado = signal(false);

  openGaliPanel(): void { this.galiPanelOpen.set(true); }

  closeGaliPanel(): void {
    this.galiPanelOpen.set(false);
    this.selectedProducto.set(null);
    this.galiLanzado.set(false);
  }

  selectGaliProducto(p: CatalogProduct, event: Event): void {
    event.stopPropagation();
    this.galiPanelOpen.set(true);
    this.selectedProducto.set(p);
    this.galiLanzado.set(false);
  }

  galiInsight(p: CatalogProduct): string {
    const score = p.adaScore ?? 0;
    if (score >= 80) return `${p.name} tiene buena tracción esta semana. Los datos apuntan a una ventana activa. ¿Lo lanzamos?`;
    if (score >= 60) return `${p.name} muestra señales moderadas. Con el ángulo adecuado puede convertir bien.`;
    return `${p.name} no muestra tendencia clara ahora. Considera esperar o diferenciarte con la oferta.`;
  }

  galiMargenPct(p: CatalogProduct): number {
    return Math.round(((p.suggestedPrice - p.price) / p.suggestedPrice) * 100);
  }

  crearProyectoDesdePanel(): void {
    this.galiLanzado.set(true);
    setTimeout(() => {
      this.router.navigate(['/gali-6/proyectos'], { queryParams: { autoNuevo: 'true' } });
    }, 700);
  }

  showAiBanner = signal(true);
  searchQuery = '';
  semanticQuery = signal('');
  semanticSearching = signal(false);
  semanticResults = signal<Array<{name: string; score: number; ciudad: string; precio: string; margen: string; razon: string}> | null>(null);
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'Aleatorio';

  runSemanticSearch(): void {
    const q = this.semanticQuery().trim();
    if (!q) return;
    this.semanticSearching.set(true);
    this.semanticResults.set(null);
    setTimeout(() => {
      this.semanticSearching.set(false);
      this.semanticResults.set(this.generateSemanticResults(q));
    }, 1100);
  }

  private generateSemanticResults(q: string): Array<{name: string; score: number; ciudad: string; precio: string; margen: string; razon: string}> {
    const lower = q.toLowerCase();
    const bogotaCity = lower.includes('bogotá') || lower.includes('bogota') ? 'Bogotá' : lower.includes('medellín') || lower.includes('medellin') ? 'Medellín' : lower.includes('cali') ? 'Cali' : 'Colombia';
    if (lower.includes('colágen') || lower.includes('colagen') || lower.includes('colágeno')) {
      return [
        { name: 'Colágeno Hidrolizado Premium 500g', score: 91, ciudad: bogotaCity, precio: '$48.000', margen: '62%', razon: 'Alta demanda en mercados femeninos 25-45. Ventana: 30 días.' },
        { name: 'Colágeno + Vitamina C en cápsulas', score: 78, ciudad: bogotaCity, precio: '$52.000', margen: '58%', razon: 'Mejor percepción de calidad con vitamina C. Competencia media.' },
        { name: 'Crema Colágeno Facial Día/Noche', score: 65, ciudad: bogotaCity, precio: '$45.000', margen: '54%', razon: 'Alta saturación en Meta Ads. Requiere ángulo diferenciador.' },
      ];
    }
    if (lower.includes('mascota') || lower.includes('collar') || lower.includes('perro') || lower.includes('gato')) {
      return [
        { name: 'Collar GPS Mascotas Gen2', score: 87, ciudad: bogotaCity, precio: '$189.000', margen: '42%', razon: 'Tendencia alcista. ROAS promedio: 2.8x. Stock: 847 unidades.' },
        { name: 'Kit Cuidado Dental Mascotas', score: 74, ciudad: bogotaCity, precio: '$35.000', margen: '68%', razon: 'Margen alto, bajo conocimiento del producto. Requiere educación.' },
        { name: 'Cama Ortopédica para Perros L', score: 61, ciudad: bogotaCity, precio: '$95.000', margen: '38%', razon: 'Producto premium. Mejor en climas fríos (Bogotá, Manizales).' },
      ];
    }
    return [
      { name: 'Difusor Aromaterapia Ultrasónico', score: 87, ciudad: bogotaCity, precio: '$89.000', margen: '65%', razon: 'ADA detectó ventana de 21 días. Alta conversión en landing de bienestar.' },
      { name: 'Purificador Aire Portátil', score: 73, ciudad: bogotaCity, precio: '$125.000', margen: '45%', razon: 'Creciendo en segmento 30-55. Baja competencia local.' },
      { name: 'Rodillo de Jade Facial', score: 68, ciudad: bogotaCity, precio: '$42.000', margen: '51%', razon: 'Tendencia TikTok activa. Requiere creativos aspiracionales.' },
    ];
  }
  pageTitle = 'Catálogo de productos';

  filterToggles = {
    favoritos: false,
    privados: false,
    conOrdenes: false,
  };

  filterValues = {
    proveedor: '',
    precioMin: '',
    precioMax: '',
    stock: '',
    categoria: '',
    ciudad: '',
  };

  readonly breadcrumbs = ['Home', 'Productos', 'Catálogo', 'Productos'];

  readonly productImages = [
    'assets/images/dropi-baseline/catalog/product-1.png',
    'assets/images/dropi-baseline/catalog/product-2.png',
    'assets/images/dropi-baseline/catalog/product-3.png',
    'assets/images/dropi-baseline/catalog/product-4.png',
  ];

  readonly providers: CatalogProvider[] = [
    {
      name: 'ADMA',
      avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png',
      premium: true,
      productCount: 545,
      categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología',
    },
    {
      name: 'Suppli',
      avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png',
      premium: true,
      productCount: 412,
      categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología',
    },
    {
      name: 'Shopi Pauta',
      avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png',
      premium: false,
      productCount: 287,
      categories: 'Moda, Belleza, Tecnología, Hogar',
    },
    {
      name: 'Punto barato',
      avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png',
      premium: true,
      productCount: 198,
      categories: 'Hogar, Salud, Deporte, Moda',
    },
    {
      name: 'Resiland',
      avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png',
      premium: false,
      productCount: 156,
      categories: 'Tecnología, Hogar, Deporte',
    },
  ];

  products: CatalogProduct[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const ada = params['ada'] as string | undefined;
      if (ada) {
        this.verAnalisis(ada);
        this.adaStripCollapsed.set(false);
      }
    });
    this.route.data.subscribe(data => {
      if (data['variant'] === 'caza') {
        this.pageTitle = 'Cazaproductos';
      }
    });
    this.products = this.buildMockProducts();

    this.screenCtx.publish({
      route: this.router.url,
      viewId: 'catalogo',
      viewLabel: 'Catálogo de productos',
      summary: 'Gali tiene una recomendación para tu objetivo',
    });

    // Misma copia exacta del CTA en pantalla (.catalog-gali-cta, catalog-page.component.html:75-76)
    // — no se inventa un caso nuevo, solo se refuerza por el canal del chat.
    this.chat.pushProactiveAlert(
      'catalogo::oportunidad-difusor',
      'Gali tiene una recomendación para tu objetivo: Difusor de aromaterapia · ventana 10 días · ~18 pedidos/sem estimados.',
      {
        kind: 'acciones',
        acciones: [{ label: 'Ver recomendación →', actionId: 'ver-oportunidad-catalogo', isPrimary: true }],
      },
    );
  }

  get filteredProducts(): CatalogProduct[] {
    let list = [...this.products];

    if (this.filterToggles.favoritos) {
      list = list.filter(p => p.isFavorite);
    }
    if (this.filterToggles.privados) {
      list = list.filter(p => p.isPrivate);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q)
      );
    }

    return list;
  }

  dismissBanner(): void {
    this.showAiBanner.set(false);
  }

  formatPrice(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  applyFilters(): void {
    // Prototype: visual feedback only
  }

  private buildMockProducts(): CatalogProduct[] {
    const names = [
      'Collar GPS para mascotas',
      'Audífonos Bluetooth Pro Max',
      'Faja Colombiana Cintura Avispa',
      'Reloj Inteligente Tw8 Smartwatch',
      'Cámara WiFi 360°',
      'Kit uñas gel premium',
      'Organizador de cocina 12 pzs',
      'Lámpara LED recargable',
      'Mini proyector HD',
      'Set skincare coreano',
    ];
    const categories = ['Mascotas', 'Tecnología', 'Moda', 'Tecnología', 'Hogar', 'Belleza', 'Hogar', 'Hogar', 'Tecnología', 'Belleza'];
    const suppliers = ['ADMA', 'Suppli', 'ADMA', 'Suppli', 'Shopi Pauta', 'Punto barato', 'ADMA', 'Suppli', 'Resiland', 'ADMA'];
    const prices = [45900, 62500, 28990, 89000, 15750, 34500, 52000, 23800, 134500, 67800];
    const badgeSets: ProductBadge[][] = [
      ['Variable'],
      ['Combo'],
      ['Variable', 'Combo'],
      [],
      ['Variable'],
      ['Combo'],
      ['Variable'],
      [],
      ['Combo'],
      ['Variable', 'Combo'],
    ];

    const adaScores: Record<number, number> = { 0: 87, 3: 61, 6: 74 };

    return names.map((name, i) => ({
      id: `prod-${i + 1}`,
      name,
      image: this.productImages[i % this.productImages.length],
      category: categories[i],
      stock: i % 4 === 3 ? 0 : 12 + i * 3,
      supplierName: suppliers[i],
      price: prices[i],
      suggestedPrice: Math.round(prices[i] * 1.45),
      badges: badgeSets[i],
      isPrivate: i % 5 === 2,
      isFavorite: i % 3 === 0,
      adaScore: adaScores[i],
    }));
  }
}

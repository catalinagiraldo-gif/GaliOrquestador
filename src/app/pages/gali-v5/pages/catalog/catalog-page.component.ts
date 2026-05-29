import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';

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
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DropiGaliBarComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  showAiBanner = signal(true);
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'Aleatorio';
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
    this.route.data.subscribe(data => {
      if (data['variant'] === 'caza') {
        this.pageTitle = 'Cazaproductos';
      }
    });
    this.products = this.buildMockProducts();
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
    }));
  }
}

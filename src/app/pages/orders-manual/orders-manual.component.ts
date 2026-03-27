import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Carrier {
  id: string;
  name: string;
  initials: string;
  color: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  supplier: string;
  supplierPrice: number;
  salePrice: number;
  quantity: number;
  suggestedPrice: number;
  stock: number;
}

@Component({
  selector: 'app-orders-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-manual.component.html',
  styleUrls: ['./orders-manual.component.scss'],
})
export class OrdersManualComponent {
  // Client info
  client = {
    nombre: 'Paola',
    apellido: 'Angulo',
    countryCode: '57',
    phone: '3004456789',
    departamento: 'Valle del cauca',
    ciudad: 'Cali',
    direccion: 'Carrera 45 # 33',
    email: 'paola32@gmail.com',
    tienda: 'Variedades Pao',
    addNotes: false,
  };

  // Product
  product: Product = {
    id: 290966,
    name: 'Organizador de closet-OR84',
    image: '',
    supplier: 'Brand',
    supplierPrice: 59000,
    salePrice: 59000,
    quantity: 1,
    suggestedPrice: 59000,
    stock: 168,
  };

  // Carriers
  collectionType: 'con_recaudo' | 'sin_recaudo' = 'con_recaudo';
  selectedCarrierId = 'envia';

  carriers: Carrier[] = [
    { id: 'veloces', name: 'Veloces', initials: 'VE', color: '#1a73e8', price: 15000 },
    { id: 'envia', name: 'Envía', initials: 'EN', color: '#e53935', price: 15000 },
    { id: 'domina', name: 'Domina', initials: 'DO', color: '#6a1b9a', price: 15000 },
    { id: 'coordinadora', name: 'Coordinadora', initials: 'CO', color: '#00897b', price: 15000 },
    { id: 'interrapidisimo', name: 'Interrapidísimo', initials: 'IR', color: '#f57c00', price: 15000 },
    { id: '99minutos', name: '99 MINUTOS', initials: '99', color: '#212121', price: 15000 },
  ];

  // Departamentos mock
  departamentos = ['Valle del cauca', 'Antioquia', 'Cundinamarca', 'Santander', 'Bolívar'];
  ciudades = ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'];
  tiendas = ['Variedades Pao', 'Mi tienda online', 'Shop Express'];

  get totalRecaudar(): number {
    return this.product.salePrice * this.product.quantity;
  }

  get precioEnvio(): number {
    return 0;
  }

  get comisionPlataforma(): number {
    return 0;
  }

  get ganancia(): number {
    return this.totalRecaudar - this.product.supplierPrice - this.precioEnvio - this.comisionPlataforma;
  }

  formatCurrency(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  selectCarrier(id: string): void {
    this.selectedCarrierId = id;
  }
}

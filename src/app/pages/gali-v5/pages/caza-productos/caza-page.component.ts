import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
} from '../../components/shared';
import publicationsData from '../../../../../../mocks/gali-v5/publications.json';

interface PublicationCard {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
  dateRange: string;
  proposals?: number | null;
  expiring?: boolean;
}

@Component({
  selector: 'app-caza-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
  ],
  templateUrl: './caza-page.component.html',
  styleUrl: './caza-page.component.scss',
})
export class CazaPageComponent {
  proposalsOnly = false;
  searchQuery = '';
  readonly breadcrumbs = ['Productos', 'Caza productos'];
  readonly publications: PublicationCard[] = publicationsData.publications;
}

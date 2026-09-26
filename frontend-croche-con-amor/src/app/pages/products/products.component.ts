import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      <!-- Page Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
          Catálogo Artesanal
        </span>
        <h1 class="text-3xl sm:text-5xl font-serif font-bold text-[#2E2027]">
          Nuestras Creaciones en Crochet & Macramé
        </h1>
        <p class="text-sm sm:text-base text-[#6E5562]">
          Cada puntada es un homenaje a la paciencia y a los materiales nobles. Selecciona tu categoría o busca tu pieza ideal.
        </p>
      </div>

      <!-- Controls: Category Pills & Search & Sort -->
      <div class="space-y-4">
        <!-- Search and Sort bar -->
        <div class="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF4ED] p-3 rounded-2xl border border-[#EFE2D4]">
          
          <!-- Search input -->
          <div class="relative w-full sm:w-80">
            <span class="absolute inset-y-0 left-3 flex items-center text-[#8C6D7C] pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Buscar por nombre, hilo o material..."
              class="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E5D7C9] focus:outline-none focus:border-[#9C1B58]"
            />
            @if (searchQuery.length > 0) {
              <button
                (click)="searchQuery = ''"
                class="absolute inset-y-0 right-3 flex items-center text-xs text-[#8C6D7C] hover:text-[#2E2027]">
                ✕
              </button>
            }
          </div>

          <!-- Sort dropdown -->
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span class="text-[#7A636F]">Ordenar por:</span>
            <select
              [(ngModel)]="selectedSort"
              class="py-2 px-3 rounded-xl bg-white border border-[#E5D7C9] text-xs font-medium text-[#2E2027] focus:outline-none focus:border-[#9C1B58]">
              <option value="featured">Destacados del Taller</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            *ngFor="let cat of categoryTabs"
            (click)="selectedCategory.set(cat.id)"
            class="px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
            [ngClass]="selectedCategory() === cat.id
              ? 'text-white border-transparent shadow-sm'
              : 'bg-white text-[#5D4653] border-[#E8D9C9] hover:bg-[#FAF4ED] hover:border-[#D9C4B0]'"
            [style.background]="selectedCategory() === cat.id ? 'linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%)' : undefined">
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Results Count Bar -->
      <div class="flex justify-between items-center text-xs text-[#7A636F] border-b border-[#F0E4D5] pb-3">
        <span>Mostrando <strong>{{ filteredProducts().length }}</strong> creaciones disponibles</span>
        @if (selectedCategory() !== 'todos' || searchQuery.length > 0) {
          <button
            (click)="resetFilters()"
            class="text-[#9C1B58] font-semibold hover:underline cursor-pointer">
            Limpiar filtros
          </button>
        }
      </div>

      <!-- Products Grid -->
      @if (filteredProducts().length === 0) {
        <div class="text-center py-16 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5D7C9] space-y-4">
          <div class="text-4xl">🔍</div>
          <h3 class="font-serif text-lg font-bold text-[#2E2027]">No encontramos piezas con esos criterios</h3>
          <p class="text-xs text-[#7A636F] max-w-sm mx-auto">
            Intenta con otra palabra clave o selecciona otra categoría de nuestro taller.
          </p>
          <button
            (click)="resetFilters()"
            class="px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-sm"
            style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
            Ver todas las creaciones
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          @for (p of filteredProducts(); track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      }

    </div>
  `
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  readonly allProducts = this.productService.getProducts();

  readonly categoryTabs = [
    { id: 'todos', label: 'Todos los Tejidos' },
    { id: 'macrame', label: 'Macramé Boho' },
    { id: 'bolsos', label: 'Bolsos & Totes' },
    { id: 'amigurumis', label: 'Amigurumis Dulces' },
    { id: 'prendas', label: 'Prendas & Chalecos' },
    { id: 'hogar', label: 'Hogar & Mantas' },
  ];

  selectedCategory = signal<string>('todos');
  searchQuery = '';
  selectedSort = 'featured';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategory.set(params['categoria']);
      }
    });
  }

  resetFilters(): void {
    this.selectedCategory.set('todos');
    this.searchQuery = '';
    this.selectedSort = 'featured';
  }

  filteredProducts(): Product[] {
    let list = this.allProducts;

    // Filter by Category
    if (this.selectedCategory() !== 'todos') {
      list = list.filter(p => p.category === this.selectedCategory());
    }

    // Filter by Search Query
    if (this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (this.selectedSort === 'price-asc') return a.price - b.price;
      if (this.selectedSort === 'price-desc') return b.price - a.price;
      if (this.selectedSort === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }
}

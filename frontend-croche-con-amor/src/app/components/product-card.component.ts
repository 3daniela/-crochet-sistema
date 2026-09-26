import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [id]="'product-card-' + product.id"
      class="group bg-white rounded-3xl overflow-hidden border border-[#EFE5DA] shadow-sm hover:shadow-xl hover:shadow-[#D8366E]/10 transition-all duration-300 flex flex-col hover:-translate-y-1.5 relative">
      
      <!-- Product Image Area -->
      <div class="relative aspect-square overflow-hidden bg-[#FAF4ED] cursor-pointer" (click)="openDetails()">
        <img
          [src]="product.image"
          [alt]="product.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <!-- Category Pill -->
        <div class="absolute top-3.5 left-3.5 z-10">
          <span class="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-[#FFFDF9]/90 backdrop-blur-md text-[#9C1B58] border border-[#F3DEE5] shadow-xs">
            {{ product.categoryLabel }}
          </span>
        </div>

        <!-- Wishlist Button -->
        <div class="absolute top-3.5 right-3.5 z-10">
          <button
            (click)="toggleWishlist($event)"
            [id]="'wishlist-btn-' + product.id"
            class="p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all cursor-pointer"
            [ngClass]="isWishlisted()
              ? 'bg-rose-500 text-white scale-105 shadow-rose-300/50'
              : 'bg-white/90 text-[#7A606E] hover:text-[#D8366E] hover:bg-white hover:scale-110'">
            <svg class="w-4 h-4" viewBox="0 0 24 24" [attr.fill]="isWishlisted() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <!-- Quick View Overlay on Hover -->
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span class="px-4 py-2 rounded-full bg-white/95 text-[#2D2027] font-semibold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Vista Rápida
          </span>
        </div>
      </div>

      <!-- Card Body Content -->
      <div class="p-5 flex-1 flex flex-col justify-between bg-[#FFFDF9]">
        <div>
          <!-- Rating & Craft Time -->
          <div class="flex items-center justify-between gap-2 text-xs text-[#7A626F] mb-2">
            <div class="flex items-center gap-1 text-amber-500 font-semibold">
              <span>★</span>
              <span>{{ product.rating }}</span>
              <span class="text-[#A38D9A]">({{ product.reviewsCount }})</span>
            </div>
            <span class="text-[11px] text-[#8C6D7C] bg-[#FAF3EB] px-2 py-0.5 rounded-md">
              {{ product.timeToMake }}
            </span>
          </div>

          <!-- Product Title -->
          <h3 
            (click)="openDetails()"
            class="font-serif font-bold text-base sm:text-lg text-[#2E2027] group-hover:text-[#9C1B58] transition-colors leading-snug cursor-pointer line-clamp-1">
            {{ product.name }}
          </h3>

          <!-- Short Description -->
          <p class="text-xs text-[#6F5765] mt-1.5 line-clamp-2 leading-relaxed">
            {{ product.shortDescription }}
          </p>

          <!-- Materials Tag -->
          <div class="mt-3 flex flex-wrap gap-1">
            <span 
              *ngFor="let m of product.materials.slice(0, 2)"
              class="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF3EB] text-[#7A5F6E] border border-[#EFE0D2]">
              {{ m }}
            </span>
          </div>
        </div>

        <!-- Price & CTA Buttons -->
        <div class="mt-5 pt-3.5 border-t border-[#F2E5D8]">
          <div class="flex items-baseline justify-between mb-3">
            <div>
              <span class="text-lg sm:text-xl font-bold text-[#9C1B58]">
                {{ cartService.formatCOP(product.price) }}
              </span>
              @if (product.originalPrice) {
                <span class="text-xs text-[#9E8391] line-through ml-2">
                  {{ cartService.formatCOP(product.originalPrice) }}
                </span>
              }
            </div>
            <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Disponible
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button
              (click)="openDetails()"
              class="w-full py-2 px-3 rounded-full bg-[#FAF3EB] hover:bg-[#F0E2D4] text-[#4A3540] text-xs font-semibold transition-colors cursor-pointer text-center">
              Detalles
            </button>
            <button
              (click)="addToCart()"
              class="w-full py-2 px-3 rounded-full text-white text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
              style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
              </svg>
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  isWishlisted(): boolean {
    return this.wishlistService.isWishlisted(this.product.id);
  }

  toggleWishlist(event: MouseEvent): void {
    event.stopPropagation();
    this.wishlistService.toggle(this.product.id);
  }

  openDetails(): void {
    this.productService.openProductModal(this.product);
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
  }
}

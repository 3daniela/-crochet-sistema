import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (productService.selectedProductForModal(); as product) {
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        (click)="close()">
        
        <div 
          class="bg-[#FFFDF9] rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F0E2D4] relative"
          (click)="$event.stopPropagation()">
          
          <!-- Close Button -->
          <button
            (click)="close()"
            class="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#523A46] hover:text-[#9C1B58] shadow-md border border-[#F0DFD1] transition-all cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="p-6 sm:p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              
              <!-- Image Area -->
              <div class="relative rounded-2xl overflow-hidden aspect-square bg-[#FAF4ED] border border-[#F0E4D7] shadow-inner">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-full object-cover"
                />
                
                <div class="absolute top-3 left-3">
                  <span class="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-white/90 backdrop-blur-md text-[#9C1B58] border border-[#F5D8E2]">
                    {{ product.categoryLabel }}
                  </span>
                </div>

                <div class="absolute bottom-3 right-3">
                  <button
                    (click)="toggleWishlist(product.id)"
                    class="p-2.5 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer"
                    [ngClass]="wishlistService.isWishlisted(product.id)
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/90 text-[#7A606E] hover:text-[#D8366E]'">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" [attr.fill]="wishlistService.isWishlisted(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Product Details -->
              <div class="flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
                    <span>★</span>
                    <span>{{ product.rating }}</span>
                    <span class="text-[#8C6D7C]">({{ product.reviewsCount }} valoraciones verificadas)</span>
                  </div>

                  <h2 class="font-serif text-2xl font-bold text-[#2E2027] leading-tight">
                    {{ product.name }}
                  </h2>

                  <!-- Price -->
                  <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl font-bold text-[#9C1B58]">
                      {{ cartService.formatCOP(product.price) }}
                    </span>
                    @if (product.originalPrice) {
                      <span class="text-sm text-[#9E8391] line-through">
                        {{ cartService.formatCOP(product.originalPrice) }}
                      </span>
                    }
                  </div>

                  <p class="text-xs sm:text-sm text-[#6A5260] mt-3 leading-relaxed">
                    {{ product.fullDescription }}
                  </p>
                </div>

                <!-- Attributes Grid -->
                <div class="space-y-2 pt-2 border-t border-[#F2E5D8] text-xs text-[#5D4653]">
                  <p class="flex items-center gap-2">
                    <span class="font-bold text-[#2E2027]">📏 Medidas:</span>
                    <span>{{ product.dimensions }}</span>
                  </p>
                  <p class="flex items-center gap-2">
                    <span class="font-bold text-[#2E2027]">⏱️ Tiempo de confección:</span>
                    <span>{{ product.timeToMake }}</span>
                  </p>
                  <div>
                    <span class="font-bold text-[#2E2027] block mb-1">🧵 Materiales seleccionados:</span>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        *ngFor="let m of product.materials"
                        class="px-2.5 py-0.5 rounded-full bg-[#FAF3EB] text-[#7A5F6E] border border-[#EFE0D2] text-[11px]">
                        {{ m }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Quantity & Actions -->
                <div class="pt-3 border-t border-[#F2E5D8] space-y-3">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-[#2E2027]">Cantidad:</span>
                    <div class="flex items-center border border-[#E5D7C9] rounded-full overflow-hidden bg-white">
                      <button
                        (click)="decrementQuantity()"
                        class="px-3 py-1 hover:bg-[#FAF3EB] text-[#694E5D] font-bold cursor-pointer transition-colors">
                        -
                      </button>
                      <span class="px-3 py-1 text-xs font-bold text-[#2E2027] min-w-6 text-center">
                        {{ quantity() }}
                      </span>
                      <button
                        (click)="incrementQuantity()"
                        class="px-3 py-1 hover:bg-[#FAF3EB] text-[#694E5D] font-bold cursor-pointer transition-colors">
                        +
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <!-- Add to Cart -->
                    <button
                      (click)="addToCart(product)"
                      class="w-full py-3 px-4 rounded-full text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                      style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
                      <span>🛍️ Añadir al Carrito</span>
                    </button>

                    <!-- Direct WhatsApp Order -->
                    <a
                      [href]="getDirectWhatsAppUrl(product)"
                      target="_blank"
                      rel="noopener"
                      class="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-center">
                      <span>📱 Pedir por WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductModalComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  readonly quantity = signal(1);

  close(): void {
    this.productService.closeProductModal();
    this.quantity.set(1);
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product, this.quantity());
    this.close();
  }

  toggleWishlist(productId: string): void {
    this.wishlistService.toggle(productId);
  }

  getDirectWhatsAppUrl(product: any): string {
    const text = `¡Hola Croché con Amor! 🧶🌸\n\nMe interesa pedir directamente la siguiente pieza artesanal:\n\n*${product.name}*\n- Cantidad: ${this.quantity()}\n- Precio unitario: ${this.cartService.formatCOP(product.price)}\n- Total estimado: ${this.cartService.formatCOP(product.price * this.quantity())}\n\n¿Tienen disponibilidad y fecha estimada de entrega? ¡Gracias!`;
    return `https://wa.me/573001234567?text=${encodeURIComponent(text)}`;
  }
}

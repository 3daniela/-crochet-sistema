import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (cartService.isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        (click)="cartService.closeCart()">
      </div>

      <!-- Slide-over Drawer Panel -->
      <div 
        class="fixed inset-y-0 right-0 z-50 max-w-full w-full sm:max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col border-l border-[#F0E2D4] animate-in slide-in-from-right duration-300">
        
        <!-- Drawer Header -->
        <div class="p-5 border-b border-[#F0E4D5] flex items-center justify-between bg-white">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#FFF0F4] text-[#9C1B58]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </span>
            <div>
              <h3 class="font-serif font-bold text-lg text-[#2E2027]">Tu Carrito Artesanal</h3>
              <p class="text-xs text-[#7A636F]">
                {{ cartService.totalCount() }} {{ cartService.totalCount() === 1 ? 'artículo seleccionado' : 'artículos seleccionados' }}
              </p>
            </div>
          </div>

          <button
            (click)="cartService.closeCart()"
            class="p-2 rounded-full hover:bg-[#FAF3EB] text-[#7A636F] hover:text-[#2E2027] transition-colors cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Free Shipping Banner -->
        <div class="px-5 py-3 bg-[#FAF4ED] border-b border-[#F0E4D5] text-xs">
          @if (cartService.isFreeShipping()) {
            <div class="flex items-center gap-2 text-emerald-700 font-semibold">
              <span>🎉</span>
              <span>¡Felicidades! Tienes <strong>Envío Gratis</strong> para Colombia.</span>
            </div>
          } @else {
            <div class="space-y-1.5">
              <div class="flex justify-between text-[#6E5562]">
                <span>Agrega <strong>{{ cartService.formatCOP(cartService.remainingForFreeShipping()) }}</strong> más para envío gratis</span>
                <span>{{ progressPercentage() }}%</span>
              </div>
              <div class="w-full bg-[#E5D7C9] rounded-full h-1.5 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-300"
                  style="background: linear-gradient(90deg, #9C1B58, #F57D28);"
                  [style.width.%]="progressPercentage()">
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          @if (cartService.items().length === 0) {
            <div class="text-center py-16 space-y-4">
              <div class="w-20 h-20 mx-auto rounded-full bg-[#FAF3EB] flex items-center justify-center text-3xl">
                🧶
              </div>
              <h4 class="font-serif font-bold text-lg text-[#2E2027]">Tu carrito está vacío</h4>
              <p class="text-xs text-[#7A636F] max-w-xs mx-auto">
                Aún no has agregado ninguna creación a tu pedido. Explora nuestras piezas tejidas a mano.
              </p>
              <button
                (click)="cartService.closeCart()"
                routerLink="/productos"
                class="inline-block px-6 py-2.5 rounded-full text-white text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all"
                style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
                Ver Catálogo de Tejidos
              </button>
            </div>
          } @else {
            @for (item of cartService.items(); track item.product.id) {
              <div class="flex gap-4 p-3 rounded-2xl bg-white border border-[#EFE5DA] shadow-xs">
                <!-- Image -->
                <img
                  [src]="item.product.image"
                  [alt]="item.product.name"
                  class="w-20 h-20 object-cover rounded-xl bg-[#FAF4ED] shrink-0"
                />

                <!-- Info -->
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-2">
                      <h4 class="font-serif font-bold text-sm text-[#2E2027] line-clamp-1">
                        {{ item.product.name }}
                      </h4>
                      <button
                        (click)="cartService.removeFromCart(item.product.id)"
                        class="text-[#9E8391] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Eliminar">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                      </button>
                    </div>
                    <span class="text-xs font-bold text-[#9C1B58]">
                      {{ cartService.formatCOP(item.product.price) }}
                    </span>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center border border-[#E5D7C9] rounded-full overflow-hidden bg-[#FFFDF9]">
                      <button
                        (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                        class="px-2.5 py-0.5 hover:bg-[#FAF3EB] text-[#5A4550] font-bold text-xs cursor-pointer">
                        -
                      </button>
                      <span class="px-2.5 py-0.5 text-xs font-bold text-[#2E2027] min-w-5 text-center">
                        {{ item.quantity }}
                      </span>
                      <button
                        (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                        class="px-2.5 py-0.5 hover:bg-[#FAF3EB] text-[#5A4550] font-bold text-xs cursor-pointer">
                        +
                      </button>
                    </div>

                    <span class="text-xs font-bold text-[#2E2027]">
                      {{ cartService.formatCOP(item.product.price * item.quantity) }}
                    </span>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer / Checkout -->
        @if (cartService.items().length > 0) {
          <div class="p-5 border-t border-[#F0E4D5] bg-white space-y-4">
            <!-- Custom Notes -->
            <div>
              <label class="block text-[11px] font-semibold text-[#6E5562] uppercase tracking-wider mb-1">
                Notas especiales o colores para el pedido:
              </label>
              <textarea
                [(ngModel)]="orderNotes"
                rows="2"
                placeholder="Ej: Si es un regalo, combinación especial de colores, etc."
                class="w-full text-xs p-2.5 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58] resize-none">
              </textarea>
            </div>

            <!-- Subtotal & Summary -->
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between text-[#6E5562]">
                <span>Subtotal:</span>
                <span class="font-bold text-[#2E2027]">{{ cartService.formatCOP(cartService.subtotal()) }}</span>
              </div>
              <div class="flex justify-between text-[#6E5562]">
                <span>Envío estimado:</span>
                <span class="font-bold text-emerald-700">
                  {{ cartService.isFreeShipping() ? '¡GRATIS!' : 'Por acordar' }}
                </span>
              </div>
              <div class="flex justify-between text-base font-bold text-[#2E2027] pt-2 border-t border-[#F2E5D8]">
                <span>Total:</span>
                <span class="text-[#9C1B58]">{{ cartService.formatCOP(cartService.subtotal()) }}</span>
              </div>
            </div>

            <!-- WhatsApp Checkout CTA -->
            <a
              [href]="cartService.getWhatsAppCheckoutUrl(orderNotes)"
              target="_blank"
              rel="noopener"
              class="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-center">
              <span>📱 Completar Pedido por WhatsApp</span>
            </a>

            <p class="text-[10px] text-center text-[#8C6D7C]">
              🔒 Coordinamos el pago seguro (Nequi, Daviplata, Bancolombia) y el despacho directamente por chat.
            </p>
          </div>
        }

      </div>
    }
  `
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  orderNotes = '';

  progressPercentage(): number {
    const pct = Math.min(100, Math.round((this.cartService.subtotal() / this.cartService.freeShippingThreshold) * 100));
    return isNaN(pct) ? 0 : pct;
  }
}

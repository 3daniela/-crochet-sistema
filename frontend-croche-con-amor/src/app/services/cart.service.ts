import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'croche_cart_v1';

  readonly items = signal<CartItem[]>(this.loadCartFromStorage());
  readonly isOpen = signal<boolean>(false);

  readonly totalCount = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  readonly freeShippingThreshold = 200000;

  readonly isFreeShipping = computed(() => {
    return this.subtotal() >= this.freeShippingThreshold;
  });

  readonly remainingForFreeShipping = computed(() => {
    const diff = this.freeShippingThreshold - this.subtotal();
    return diff > 0 ? diff : 0;
  });

  private loadCartFromStorage(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {}
  }

  openCart(): void {
    this.isOpen.set(true);
  }

  closeCart(): void {
    this.isOpen.set(false);
  }

  toggleCart(): void {
    this.isOpen.update(open => !open);
  }

  addToCart(product: Product, quantity = 1): void {
    this.items.update(currentItems => {
      const existingIndex = currentItems.findIndex(i => i.product.id === product.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
      } else {
        updated = [...currentItems, { product, quantity }];
      }
      this.saveToStorage(updated);
      return updated;
    });
    this.openCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.items.update(currentItems => {
      const updated = currentItems.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      this.saveToStorage(updated);
      return updated;
    });
  }

  removeFromCart(productId: string): void {
    this.items.update(currentItems => {
      const updated = currentItems.filter(i => i.product.id !== productId);
      this.saveToStorage(updated);
      return updated;
    });
  }

  clearCart(): void {
    this.items.set([]);
    this.saveToStorage([]);
  }

  formatCOP(val: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  }

  getWhatsAppCheckoutUrl(notes?: string): string {
    const phone = '573001234567'; // WhatsApp Taller Artesanal
    const items = this.items();
    if (items.length === 0) return '';

    let text = `¡Hola Croché con Amor! 🧶🌸\n\nQuiero realizar el siguiente pedido artesanal desde la tienda web:\n\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}*\n   - Cantidad: ${item.quantity}\n   - Subtotal: ${this.formatCOP(item.product.price * item.quantity)}\n\n`;
    });

    text += `*Total estimado:* ${this.formatCOP(this.subtotal())}\n`;
    text += this.isFreeShipping() ? `🚚 *¡Aplica a Envío Gratis en Colombia!*\n` : `🚚 *Envío:* Por acordar según ciudad de destino\n`;

    if (notes && notes.trim().length > 0) {
      text += `\n📝 *Notas o personalización:* ${notes.trim()}\n`;
    }

    text += `\n¿Me confirmas disponibilidad y tiempos de despacho? ¡Muchas gracias!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
}

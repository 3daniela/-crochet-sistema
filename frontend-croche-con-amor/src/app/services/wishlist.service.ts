import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'croche_wishlist_ids';

  readonly wishlistIds = signal<string[]>(this.loadFromStorage());

  private loadFromStorage(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : ['bolso-granny-square', 'tapiz-macrame-aurora'];
    } catch {
      return ['bolso-granny-square', 'tapiz-macrame-aurora'];
    }
  }

  private saveToStorage(ids: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    } catch {}
  }

  toggle(productId: string): void {
    this.wishlistIds.update(ids => {
      const updated = ids.includes(productId)
        ? ids.filter(id => id !== productId)
        : [...ids, productId];
      this.saveToStorage(updated);
      return updated;
    });
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistIds().includes(productId);
  }

  count(): number {
    return this.wishlistIds().length;
  }
}

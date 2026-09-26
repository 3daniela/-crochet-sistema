import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CrocheLogoComponent } from './croche-logo.component';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CrocheLogoComponent],
  template: `
    <header
      id="main-header"
      class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      [ngClass]="isScrolled() 
        ? 'bg-[#FFFDF9]/95 backdrop-blur-md shadow-sm shadow-[#2D2128]/5 py-2.5 border-b border-[#F2E7DC]'
        : 'bg-[#FFFDF9]/90 backdrop-blur-sm py-3.5 border-b border-[#F5ECE3]'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          
          <!-- Logo de Marca -->
          <a routerLink="/" class="group flex items-center transition-transform hover:scale-[1.01] cursor-pointer">
            <app-croche-logo size="md"></app-croche-logo>
          </a>

          <!-- Navegación de Escritorio -->
          <nav id="desktop-navigation" class="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#FAF3EB]/80 border border-[#EFE0D2]">
            <a
              routerLink="/"
              routerLinkActive="active-nav text-white shadow-sm"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer text-[#5A4550] hover:text-[#9C1B58] hover:bg-white/60">
              Inicio
            </a>
            <a
              routerLink="/productos"
              routerLinkActive="active-nav text-white shadow-sm"
              class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer text-[#5A4550] hover:text-[#9C1B58] hover:bg-white/60">
              Productos
            </a>
            <a
              routerLink="/nosotros"
              routerLinkActive="active-nav text-white shadow-sm"
              class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer text-[#5A4550] hover:text-[#9C1B58] hover:bg-white/60">
              Nosotros
            </a>
            <a
              routerLink="/encargos"
              routerLinkActive="active-nav text-white shadow-sm"
              class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer text-[#5A4550] hover:text-[#9C1B58] hover:bg-white/60">
              Encargos
            </a>
            <a
              routerLink="/contacto"
              routerLinkActive="active-nav text-white shadow-sm"
              class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer text-[#5A4550] hover:text-[#9C1B58] hover:bg-white/60">
              Contacto
            </a>
            <a
              routerLink="/cuenta"
              routerLinkActive="active-nav text-white shadow-sm"
              class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer text-[#5A4550] hover:text-[#9C1B58] hover:bg-white/60">
              {{ authService.currentUser() ? 'Mi Cuenta' : 'Acceder' }}
            </a>
          </nav>

          <!-- Acciones Rápidas -->
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Wishlist Counter -->
            <a
              routerLink="/cuenta"
              class="relative p-2.5 rounded-full hover:bg-[#FAF3EB] text-[#694F5D] hover:text-[#9C1B58] transition-colors cursor-pointer"
              title="Favoritos">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
              @if (wishlistService.count() > 0) {
                <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9C1B58] text-white text-[10px] font-bold flex items-center justify-center">
                  {{ wishlistService.count() }}
                </span>
              }
            </a>

            <!-- Cart Trigger -->
            <button
              (click)="cartService.openCart()"
              id="header-cart-btn"
              class="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF3EB] hover:bg-[#F2E5D5] text-[#2D2128] border border-[#E8D9C9] transition-all cursor-pointer">
              <svg class="w-5 h-5 text-[#9C1B58]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              @if (cartService.totalCount() > 0) {
                <span class="w-5 h-5 rounded-full bg-[#9C1B58] text-white text-[11px] font-bold flex items-center justify-center">
                  {{ cartService.totalCount() }}
                </span>
                <span class="hidden sm:inline text-xs font-bold text-[#9C1B58]">
                  {{ cartService.formatCOP(cartService.subtotal()) }}
                </span>
              } @else {
                <span class="hidden sm:inline text-xs font-medium text-[#7A636F]">Carrito</span>
              }
            </button>

            <!-- WhatsApp Direct Link -->
            <a
              href="https://wa.me/573001234567?text=%C2%A1Hola%20Croch%C3%A9%20con%20Amor!%20%F0%9F%A7%B6%20Quisiera%20hacer%20una%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            <!-- Mobile Menu Toggle -->
            <button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="md:hidden p-2 rounded-xl text-[#2D2128] hover:bg-[#FAF3EB] cursor-pointer">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                @if (mobileMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        <!-- Menú Móvil Desplegable -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden mt-3 pt-3 pb-4 border-t border-[#F2E7DC] flex flex-col gap-2">
            <a
              routerLink="/"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-[#FFF0F4] text-[#9C1B58] font-bold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A4550]">
              Inicio
            </a>
            <a
              routerLink="/productos"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-[#FFF0F4] text-[#9C1B58] font-bold"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A4550]">
              Productos
            </a>
            <a
              routerLink="/nosotros"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-[#FFF0F4] text-[#9C1B58] font-bold"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A4550]">
              Nosotros
            </a>
            <a
              routerLink="/encargos"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-[#FFF0F4] text-[#9C1B58] font-bold"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A4550]">
              Encargos Personalizados
            </a>
            <a
              routerLink="/contacto"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-[#FFF0F4] text-[#9C1B58] font-bold"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A4550]">
              Contacto
            </a>
            <a
              routerLink="/cuenta"
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-[#FFF0F4] text-[#9C1B58] font-bold"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A4550]">
              {{ authService.currentUser() ? 'Mi Perfil (' + authService.currentUser()?.name + ')' : 'Acceso Clientes / Cuenta' }}
            </a>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .active-nav {
      background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%) !important;
    }
  `]
})
export class HeaderComponent {
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly authService = inject(AuthService);

  readonly isScrolled = signal(false);
  readonly mobileMenuOpen = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 20);
    }
  }
}

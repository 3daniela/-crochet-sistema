import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      @if (authService.currentUser(); as user) {
        <!-- User Profile Dashboard View -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DA] shadow-sm space-y-8">
          
          <!-- Header Profile -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#F0E4D5]">
            <div class="flex items-center gap-4 text-center sm:text-left">
              <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9C1B58] to-[#F57D28] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h1 class="font-serif text-2xl font-bold text-[#2E2027]">¡Hola, {{ user.name }}!</h1>
                <p class="text-xs text-[#7A636F]">{{ user.email }} • {{ user.city }}</p>
                <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#FFF0F4] text-[#9C1B58] text-[10px] font-bold">
                  {{ user.createdAt || 'Cliente Oficial' }}
                </span>
              </div>
            </div>

            <button
              (click)="authService.logout()"
              class="px-4 py-2 rounded-full border border-[#E8D9CB] hover:bg-[#FAF4ED] text-xs font-semibold text-[#8C6D7C] hover:text-[#9C1B58] transition-colors cursor-pointer">
              Cerrar Sesión
            </button>
          </div>

          <!-- Wishlist Items Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="font-serif text-lg font-bold text-[#2E2027] flex items-center gap-2">
                <span>❤️</span>
                <span>Tus Piezas Favoritas Guardadas ({{ wishlistProducts().length }})</span>
              </h2>
            </div>

            @if (wishlistProducts().length === 0) {
              <div class="p-8 text-center bg-[#FFFDF9] rounded-2xl border border-dashed border-[#E5D7C9]">
                <p class="text-xs text-[#7A636F]">Aún no has guardado ninguna pieza en tus favoritos.</p>
                <a routerLink="/productos" class="inline-block mt-3 text-xs font-bold text-[#9C1B58] hover:underline">
                  Explorar catálogo →
                </a>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (prod of wishlistProducts(); track prod.id) {
                  <div class="flex gap-3 p-3 rounded-2xl bg-[#FFFDF9] border border-[#EFE5DA] items-center">
                    <img [src]="prod.image" [alt]="prod.name" class="w-16 h-16 object-cover rounded-xl shrink-0" />
                    <div class="flex-1 min-w-0">
                      <h4 class="font-serif font-bold text-xs text-[#2E2027] truncate">{{ prod.name }}</h4>
                      <span class="text-xs font-bold text-[#9C1B58]">{{ cartService.formatCOP(prod.price) }}</span>
                      <div class="flex gap-2 mt-2">
                        <button
                          (click)="cartService.addToCart(prod, 1)"
                          class="px-2.5 py-1 rounded-full text-white text-[10px] font-bold"
                          style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
                          Añadir al Carrito
                        </button>
                        <button
                          (click)="wishlistService.toggle(prod.id)"
                          class="text-[10px] text-[#8C6D7C] hover:text-rose-600">
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Orders History Preview -->
          <div class="space-y-4 pt-4 border-t border-[#F0E4D5]">
            <h2 class="font-serif text-lg font-bold text-[#2E2027] flex items-center gap-2">
              <span>📦</span>
              <span>Historial de Pedidos</span>
            </h2>
            <div class="p-4 rounded-2xl bg-[#FAF4ED] border border-[#EFE2D4] flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-[#2E2027]">Pedido #CR-2026-09</span>
                <p class="text-[#7A636F]">1x Bolso Tote Granny Square Floral</p>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                  Entregado con Amor 🌸
                </span>
              </div>
              <span class="font-bold text-[#9C1B58]">$145.000 COP</span>
            </div>
          </div>

        </div>
      } @else {
        <!-- Login / Register Form Tabs -->
        <div class="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DA] shadow-sm space-y-6">
          
          <div class="text-center space-y-2">
            <span class="text-2xl">🧶</span>
            <h1 class="font-serif text-2xl font-bold text-[#2E2027]">Zona de Clientes</h1>
            <p class="text-xs text-[#7A636F]">
              Guarda tus piezas favoritas y haz seguimiento a tus encargos personalizados.
            </p>
          </div>

          <!-- Tab Switcher -->
          <div class="flex rounded-full bg-[#FAF3EB] p-1 border border-[#EAE0D3]">
            <button
              (click)="isLoginTab.set(true)"
              class="w-1/2 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
              [ngClass]="isLoginTab() ? 'bg-white text-[#9C1B58] shadow-xs' : 'text-[#7A636F]'">
              Iniciar Sesión
            </button>
            <button
              (click)="isLoginTab.set(false)"
              class="w-1/2 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
              [ngClass]="!isLoginTab() ? 'bg-white text-[#9C1B58] shadow-xs' : 'text-[#7A636F]'">
              Registrarme
            </button>
          </div>

          @if (isLoginTab()) {
            <!-- Login Form -->
            @if (authService.errorAuth()) {
              <p class="text-xs text-center text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 px-3">
                {{ authService.errorAuth() }}
              </p>
            }
            <form (ngSubmit)="handleLogin()" class="space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-[#543E4B] mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  [(ngModel)]="loginEmail"
                  name="loginEmail"
                  required
                  placeholder="ejemplo@correo.com"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <div>
                <label class="block font-semibold text-[#543E4B] mb-1">Contraseña</label>
                <input
                  type="password"
                  [(ngModel)]="loginPassword"
                  name="loginPassword"
                  required
                  placeholder="••••••••"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <button
                type="submit"
                [disabled]="authService.cargando()"
                class="w-full py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
                {{ authService.cargando() ? 'Ingresando...' : 'Ingresar a Mi Cuenta' }}
              </button>
            </form>
          } @else {
            <!-- Register Form -->
            @if (authService.errorAuth()) {
              <p class="text-xs text-center text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 px-3">
                {{ authService.errorAuth() }}
              </p>
            }
            <form (ngSubmit)="handleRegister()" class="space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-[#543E4B] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  [(ngModel)]="regName"
                  name="regName"
                  required
                  placeholder="Tu Nombre"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <div>
                <label class="block font-semibold text-[#543E4B] mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  [(ngModel)]="regEmail"
                  name="regEmail"
                  required
                  placeholder="ejemplo@correo.com"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <div>
                <label class="block font-semibold text-[#543E4B] mb-1">Ciudad (Colombia)</label>
                <input
                  type="text"
                  [(ngModel)]="regCity"
                  name="regCity"
                  placeholder="Ej: Medellín, Bogotá, Cali..."
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <div>
                <label class="block font-semibold text-[#543E4B] mb-1">Crear Contraseña</label>
                <input
                  type="password"
                  [(ngModel)]="regPassword"
                  name="regPassword"
                  required
                  placeholder="••••••••"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <button
                type="submit"
                [disabled]="authService.cargando()"
                class="w-full py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
                {{ authService.cargando() ? 'Creando cuenta...' : 'Crear Mi Cuenta' }}
              </button>
            </form>
          }

          <!-- Demo Access Quick Button -->
          <div class="pt-4 border-t border-[#F0E4D5] text-center">
            <button
              (click)="authService.demoLogin()"
              class="w-full py-2.5 rounded-full bg-[#FAF3EB] hover:bg-[#F2E5D5] text-[#9C1B58] font-bold text-xs border border-[#E8D9CB] transition-all cursor-pointer">
              ⚡ Acceso Demo Rápido (Cliente VIP)
            </button>
          </div>

        </div>
      }

    </div>
  `
})
export class AuthComponent {
  readonly authService = inject(AuthService);
  readonly wishlistService = inject(WishlistService);
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  readonly isLoginTab = signal(true);

  loginEmail = '';
  loginPassword = '';

  regName = '';
  regEmail = '';
  regCity = '';
  regPassword = '';

  wishlistProducts(): Product[] {
    const ids = this.wishlistService.wishlistIds();
    return this.productService.getProducts().filter(p => ids.includes(p.id));
  }

  handleLogin(): void {
    if (!this.loginEmail) return;
    this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword
    });
  }

  handleRegister(): void {
    if (!this.regName || !this.regEmail) return;
    this.authService.register({
      name: this.regName,
      email: this.regEmail,
      city: this.regCity,
      password: this.regPassword,
      acceptTerms: true
    });
  }
}

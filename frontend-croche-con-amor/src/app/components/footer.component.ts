import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CrocheLogoComponent } from './croche-logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, CrocheLogoComponent],
  template: `
    <footer class="bg-[#261B21] text-[#E5D7D0] pt-16 pb-12 border-t border-[#3D2C36]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D2C36]">
          
          <!-- Brand Info -->
          <div class="lg:col-span-2 space-y-4">
            <app-croche-logo size="md" textColor="light"></app-croche-logo>
            <p class="text-xs sm:text-sm text-[#BBA5AF] leading-relaxed max-w-sm mt-3">
              Taller de tejido a crochet y macramé bohemio con identidad artesanal colombiana. Tejemos cada pieza a mano con hilazas de algodón peinado e hipoalergénico.
            </p>
            <div class="flex items-center gap-2 pt-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold">
                🇨🇴 100% Hecho a mano en Colombia
              </span>
            </div>
          </div>

          <!-- Navegación Rápida -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-white text-sm tracking-wide">Colecciones</h4>
            <ul class="space-y-2 text-xs text-[#BBA5AF]">
              <li><a routerLink="/productos" class="hover:text-white transition-colors">Macramé Boho</a></li>
              <li><a routerLink="/productos" class="hover:text-white transition-colors">Bolsos & Totes</a></li>
              <li><a routerLink="/productos" class="hover:text-white transition-colors">Amigurumis Dulces</a></li>
              <li><a routerLink="/productos" class="hover:text-white transition-colors">Prendas de Autor</a></li>
              <li><a routerLink="/productos" class="hover:text-white transition-colors">Mantas de Hogar</a></li>
            </ul>
          </div>

          <!-- Taller & Servicios -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-white text-sm tracking-wide">El Taller</h4>
            <ul class="space-y-2 text-xs text-[#BBA5AF]">
              <li><a routerLink="/nosotros" class="hover:text-white transition-colors">Nuestra Historia</a></li>
              <li><a routerLink="/encargos" class="hover:text-white transition-colors">Encargos a Medida</a></li>
              <li><a routerLink="/contacto" class="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a routerLink="/cuenta" class="hover:text-white transition-colors">Zona de Clientes</a></li>
            </ul>
          </div>

          <!-- Contacto Directo -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-white text-sm tracking-wide">Atención Directa</h4>
            <div class="space-y-2 text-xs text-[#BBA5AF]">
              <p class="flex items-center gap-2">
                <span>📱</span>
                <span>WhatsApp: +57 300 123 4567</span>
              </p>
              <p class="flex items-center gap-2">
                <span>✉️</span>
                <span>hola&#64;crocheconamor.com</span>
              </p>
              <p class="flex items-center gap-2">
                <span>🕒</span>
                <span>Lun - Sáb: 8:00 AM - 6:00 PM</span>
              </p>
              <div class="pt-2">
                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noopener"
                  class="inline-block px-4 py-2 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#20BD5A] transition-colors">
                  Chatear por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A717D] gap-4">
          <p>© 2026 Croché con Amor. Todos los derechos reservados. Diseñado con amor e hilos de algodón.</p>
          <div class="flex gap-4">
            <span class="hover:text-white transition-colors cursor-pointer">Términos del Taller</span>
            <span class="hover:text-white transition-colors cursor-pointer">Envíos & Devoluciones</span>
            <span class="hover:text-white transition-colors cursor-pointer">Cuidado de Prendas</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}

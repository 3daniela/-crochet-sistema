import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../components/hero.component';
import { ProductCardComponent } from '../../components/product-card.component';
import { CrocheLogoComponent } from '../../components/croche-logo.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroComponent, ProductCardComponent, CrocheLogoComponent],
  template: `
    <div class="space-y-16 sm:space-y-24">
      <!-- Hero Section -->
      <app-hero></app-hero>

      <!-- Categories Showcase Preview -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
            Colecciones del Taller
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2E2027] mt-3">
            Explora por Categoría
          </h2>
          <p class="text-sm text-[#755D68] mt-2">
            Piezas concebidas para enriquecer tu estilo y llenar tu hogar de calidez artesanal.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          @for (cat of categories; track cat.id) {
            <a
              routerLink="/productos"
              [queryParams]="{ categoria: cat.id }"
              class="group relative rounded-3xl overflow-hidden bg-white border border-[#EFE5DA] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1">
              
              <div class="relative aspect-4/3 overflow-hidden bg-[#FAF4ED]">
                <img
                  [src]="cat.image"
                  [alt]="cat.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <span class="text-[10px] tracking-widest uppercase font-semibold text-amber-200">
                    {{ cat.count }}
                  </span>
                  <h3 class="font-serif text-base sm:text-lg font-bold text-white drop-shadow-sm">
                    {{ cat.title }}
                  </h3>
                </div>
              </div>

              <div class="p-3.5 bg-[#FFFDF9] flex items-center justify-between text-xs text-[#7A636F]">
                <span class="truncate">{{ cat.subtitle }}</span>
                <span class="text-[#9C1B58] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Featured Products Showcase -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F0E4D5]">
          <div>
            <div class="inline-flex items-center gap-2 text-xs font-semibold text-[#9C1B58] uppercase tracking-wider mb-1">
              <span>✨</span>
              <span>Lo Más Amado</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2E2027]">
              Creaciones Destacadas
            </h2>
          </div>

          <a
            routerLink="/productos"
            class="inline-flex items-center gap-2 text-sm font-semibold text-[#9C1B58] hover:text-[#C82B6B] transition-colors cursor-pointer group">
            <span>Ver todo el catálogo</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          @for (p of featuredProducts; track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      </section>

      <!-- About Preview Teaser -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[2.5rem] bg-[#FAF6F0] border border-[#F0E2D4] p-8 sm:p-12 overflow-hidden relative">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div class="lg:col-span-5 flex justify-center">
              <app-croche-logo size="hero" [badgeOnly]="true"></app-croche-logo>
            </div>

            <div class="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
                Conoce el Taller
              </span>
              <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2E2027] leading-tight">
                Tejido artesanal con dedicación y <span class="gold-gradient-text italic">agujas doradas</span>
              </h2>
              <p class="text-sm sm:text-base text-[#6E5562] leading-relaxed">
                Detrás de cada granny square, cada tapiz mural en macramé y cada amigurumi hay horas de concentración, cuerdas e hilos suaves de algodón peinado y el deseo genuino de crear piezas que abriguen recuerdos familiares.
              </p>
              <div class="pt-2">
                <a
                  routerLink="/nosotros"
                  class="px-6 py-3 rounded-full bg-white text-[#9C1B58] font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg border border-[#F0DEC9] hover:bg-[#FFF8F0] transition-all cursor-pointer inline-flex items-center gap-2">
                  <span>Conoce Nuestra Historia Completa</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Orders Banner -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl"
          style="background: linear-gradient(135deg, #8E154F 0%, #BA2462 25%, #DE3C67 55%, #ED6B2F 85%, #F59728 100%);">
          <div class="relative z-10 max-w-2xl space-y-4 text-center sm:text-left">
            <span class="inline-block px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-amber-100">
              Personalización Total
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              ¿Tienes en mente una idea o combinación especial?
            </h2>
            <p class="text-sm sm:text-base text-white/90 font-light leading-relaxed">
              Personalizamos colores, dimensiones y diseños. Cotiza tu proyecto con nuestro calculador interactivo y recíbelo tejido a mano con todo nuestro cariño.
            </p>
            <div class="pt-2">
              <a
                routerLink="/encargos"
                class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#9C1B58] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all">
                <span>Cotizar Pedido Personalizado</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
            Testimonios
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#2E2027] mt-3">
            Lo que dicen quienes nos eligen
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (t of testimonials; track t.name) {
            <div class="p-6 rounded-3xl bg-white border border-[#EFE5DA] shadow-xs flex flex-col justify-between">
              <div>
                <div class="text-amber-500 text-sm mb-3">★★★★★</div>
                <p class="text-xs sm:text-sm text-[#5D4653] italic leading-relaxed mb-4">
                  "{{ t.comment }}"
                </p>
              </div>
              <div class="pt-3 border-t border-[#F0E4D5]">
                <h4 class="font-bold text-xs text-[#2E2027]">{{ t.name }}</h4>
                <p class="text-[11px] text-[#8C6D7C]">{{ t.city }} • <span class="text-[#9C1B58]">{{ t.piece }}</span></p>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly categories = this.productService.getCategories();
  readonly featuredProducts = this.productService.getFeaturedProducts().slice(0, 6);

  readonly testimonials = [
    {
      name: 'Natalia Ospina',
      city: 'Bucaramanga',
      comment: 'El tapiz mural de macramé le dio un cambio total a mi sala. Los nudos son perfectos, el cordón de algodón es de altísima calidad y la madera huele delicioso.',
      piece: 'Tapiz Mural Boho Aurora'
    },
    {
      name: 'Camila Restrepo',
      city: 'Medellín',
      comment: 'El bolso tote de granny squares superó todas mis expectativas. Los colores cálidos son idénticos a las fotos y el forro interior es muy resistente.',
      piece: 'Bolso Tote Granny Square'
    },
    {
      name: 'Sofía Martínez',
      city: 'Bogotá',
      comment: 'Encargué un osito amigurumi para el nacimiento de mi sobrina. Es ultra suave, seguro para bebés y el empaque venía con una nota hermosa.',
      piece: 'Osito Dulce Abrazo'
    },
    {
      name: 'Valeria Gómez',
      city: 'Cali',
      comment: 'La manta para el sillón es una verdadera joya. Se nota la dedicación y el amor en cada puntada. ¡Volveré a encargar para Navidad!',
      piece: 'Manta Reliquia Familiar'
    }
  ];
}

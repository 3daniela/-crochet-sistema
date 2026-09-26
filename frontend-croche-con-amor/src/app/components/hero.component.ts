import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section
      id="inicio"
      class="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      style="background: linear-gradient(135deg, #8E154F 0%, #BA2462 25%, #DE3C67 55%, #ED6B2F 85%, #F59728 100%);">
      
      <!-- Background ambient craft patterns & yarn swirls -->
      <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFFDF9_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

      <!-- Decorative large golden blurred glow -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-[#FCD34D]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-[#FF6B8B]/25 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          <!-- Left Hero Content Column -->
          <div class="lg:col-span-7 text-white text-center lg:text-left space-y-6">
            
            <!-- Top Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm text-xs font-semibold tracking-wider text-amber-100 uppercase">
              <span class="flex items-center text-amber-300">✨</span>
              <span>100% Hecho a Mano con Pasión & Dedicación</span>
              <span class="text-rose-200">🧶</span>
            </div>

            <!-- Brand Title -->
            <div class="space-y-2">
              <div class="flex items-center justify-center lg:justify-start gap-3">
                <h2 class="text-amber-200/95 uppercase text-xs sm:text-sm font-semibold tracking-[0.35em]">
                  TALLER ARTESANAL DE CROCHET & MACRAMÉ
                </h2>
              </div>

              <h1 class="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12]">
                Tejido con amor, 
                <span class="italic font-normal block sm:inline text-[#FFE5B4]">
                  pensado para ti
                </span>
              </h1>
            </div>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg text-white/90 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transformamos hilos y cuerdas de la más alta calidad en piezas memorables. Amigurumis con alma,
              bolsos granny square, tapices murales en macramé y prendas cálidas tejidas puntada a puntada.
            </p>

            <!-- CTAs -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                routerLink="/productos"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#9C1B58] hover:bg-[#FFF8F0] font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer group">
                <span>Explorar Colección</span>
                <span class="transition-transform group-hover:translate-x-1">→</span>
              </a>

              <a
                routerLink="/encargos"
                class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-sm backdrop-blur-sm border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>🎨 Encargo Personalizado</span>
              </a>
            </div>

            <!-- Key Value Badges -->
            <div class="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-white/20">
              <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div class="flex items-center gap-1.5 text-amber-200 font-bold text-base sm:text-lg">
                  <span>🛡️</span>
                  <span>100%</span>
                </div>
                <span class="text-[11px] sm:text-xs text-white/75">Algodón Hipoalergénico</span>
              </div>

              <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div class="flex items-center gap-1.5 text-amber-200 font-bold text-base sm:text-lg">
                  <span>❤️</span>
                  <span>Únicos</span>
                </div>
                <span class="text-[11px] sm:text-xs text-white/75">Diseños de Autor</span>
              </div>

              <div class="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div class="flex items-center gap-1.5 text-amber-200 font-bold text-base sm:text-lg">
                  <span>⏰</span>
                  <span>A Medida</span>
                </div>
                <span class="text-[11px] sm:text-xs text-white/75">Tallas & Tonos a Elección</span>
              </div>
            </div>

          </div>

          <!-- Right Hero Visual Column -->
          <div class="lg:col-span-5 flex justify-center relative">
            <div class="relative w-full max-w-md">
              <div class="absolute -inset-2.5 rounded-[2.5rem] bg-gradient-to-tr from-[#FFDF78] via-[#FFEBB0] to-[#DF9820] opacity-75 blur-sm"></div>
              
              <div class="relative rounded-[2.25rem] overflow-hidden bg-[#FFFDF9] shadow-2xl shadow-black/25 border-4 border-white/90">
                <div class="relative aspect-4/3 sm:aspect-square overflow-hidden bg-[#F8F2EA]">
                  <img
                    src="/images/crochet_hero_artisan_1789706140321.jpg"
                    alt="Colección artesanal de tejido a crochet Croché con Amor"
                    class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  
                  <div class="absolute top-4 left-4 bg-[#FFFDF9]/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md flex items-center gap-2.5 border border-[#F3E5D4]">
                    <div
                      class="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 shadow-sm text-white font-bold"
                      style="background: linear-gradient(135deg, #9C1B58 0%, #D8366E 50%, #F57D28 100%);">
                      🧶
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-[#2E2027]">Pieza de Autor</span>
                      <span class="text-[10px] text-[#8C6D7C]">Taller Oficial</span>
                    </div>
                  </div>

                  <div class="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span class="text-amber-300">★ 5.0</span>
                    <span>(180+ reseñas felices)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HeroComponent {}

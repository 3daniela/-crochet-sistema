import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CrocheLogoComponent } from '../../components/croche-logo.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CrocheLogoComponent],
  template: `
    <div class="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      
      <!-- Hero Banner of About -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
          Nuestra Filosofía & Raíces
        </span>
        <h1 class="text-4xl sm:text-5xl font-serif font-bold text-[#2E2027]">
          Creaciones que Abrigan Historias y Conectan Generaciones
        </h1>
        <p class="text-sm sm:text-base text-[#6E5562] leading-relaxed">
          En un mundo acelerado, en <strong>Croché con Amor</strong> elegimos el camino del <em>slow-craft</em>: piezas tejidas y anudadas con paciencia infinita, manos expertas y fibras 100% naturales.
        </p>
      </div>

      <!-- Main Showcase with Official Brand Identity -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#FAF5EE] rounded-[2.5rem] p-8 sm:p-12 border border-[#EFE2D4]">
        <div class="lg:col-span-5 flex justify-center">
          <app-croche-logo size="hero" [badgeOnly]="true"></app-croche-logo>
        </div>

        <div class="lg:col-span-7 space-y-5">
          <span class="text-xs font-bold uppercase tracking-widest text-[#9C1B58]">
            El Alma de Nuestro Taller
          </span>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#2E2027]">
            Más que hilos, tejemos afectos
          </h2>
          <p class="text-sm sm:text-base text-[#6E5562] leading-relaxed">
            Nuestro taller nació de una profunda admiración por las técnicas tradicionales heredadas de abuelas y tejedoras colombianas. Decidimos darle una mirada contemporánea: uniendo el encanto atemporal del granny square con la estética relajada y bohemia del macramé.
          </p>
          <p class="text-sm text-[#6E5562] leading-relaxed">
            Cada muñeco de apego, tapiz o bolso que sale de nuestras manos es revisado meticulosamente: sin hebras sueltas, con costuras reforzadas y con un acabado impecable que perdura a través de los años.
          </p>

          <div class="pt-2 flex flex-wrap gap-4">
            <div class="flex items-center gap-2 text-xs font-bold text-[#2E2027] bg-white px-4 py-2 rounded-full border border-[#E8D9CB] shadow-xs">
              <span>🧶</span>
              <span>100% Algodón Peinado</span>
            </div>
            <div class="flex items-center gap-2 text-xs font-bold text-[#2E2027] bg-white px-4 py-2 rounded-full border border-[#E8D9CB] shadow-xs">
              <span>🌿</span>
              <span>Cero Químicos Agresivos</span>
            </div>
            <div class="flex items-center gap-2 text-xs font-bold text-[#2E2027] bg-white px-4 py-2 rounded-full border border-[#E8D9CB] shadow-xs">
              <span>🇨🇴</span>
              <span>Comercio Justo y Local</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Craft Process Steps -->
      <div class="space-y-10">
        <div class="text-center max-w-2xl mx-auto">
          <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
            El Paso a Paso
          </span>
          <h2 class="text-3xl font-serif font-bold text-[#2E2027] mt-3">
            El Proceso Detrás de Cada Creación
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (s of processSteps; track s.step) {
            <div class="p-6 rounded-3xl bg-white border border-[#EFE5DA] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl">{{ s.icon }}</span>
                  <span class="font-serif font-bold text-sm text-[#9C1B58] bg-[#FFF0F4] px-2.5 py-1 rounded-full">
                    {{ s.step }}
                  </span>
                </div>
                <h3 class="font-serif font-bold text-base text-[#2E2027] mb-2">
                  {{ s.title }}
                </h3>
                <p class="text-xs text-[#6E5562] leading-relaxed">
                  {{ s.desc }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Brand Symbolism -->
      <div class="space-y-10">
        <div class="text-center max-w-2xl mx-auto">
          <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
            Identidad Visual
          </span>
          <h2 class="text-3xl font-serif font-bold text-[#2E2027] mt-3">
            El Significado de Nuestra Marca
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (item of logoSymbols; track item.title) {
            <div class="p-6 rounded-3xl bg-white border border-[#EFE5DA] shadow-xs space-y-3">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold border" [class]="item.accent">
                Símbolo Oficial
              </span>
              <h4 class="font-serif font-bold text-base text-[#2E2027]">{{ item.title }}</h4>
              <p class="text-xs text-[#6E5562] leading-relaxed">{{ item.desc }}</p>
            </div>
          }
        </div>
      </div>

      <!-- CTA to Custom Orders -->
      <div class="rounded-[2.5rem] p-8 sm:p-12 text-center max-w-4xl mx-auto bg-gradient-to-r from-[#9C1B58] via-[#D8366E] to-[#F57D28] text-white space-y-4 shadow-xl">
        <h2 class="text-3xl font-serif font-bold">¿Quieres tejer una idea junto a nosotras?</h2>
        <p class="text-sm text-white/90 max-w-xl mx-auto">
          Nos encanta dar vida a proyectos personalizados: combinaciones de colores para tu sala, muñecos con significado o prendas a tu medida.
        </p>
        <div class="pt-2">
          <a
            routerLink="/encargos"
            class="inline-block px-8 py-3.5 rounded-full bg-white text-[#9C1B58] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all">
            Solicitar Encargo Personalizado
          </a>
        </div>
      </div>

    </div>
  `
})
export class AboutComponent {
  readonly processSteps = [
    {
      step: '01',
      title: 'Selección de Hilados Nobles',
      desc: 'Elegimos exclusivamente hilos de algodón peinado 100% hipoalergénicos, fibras suaves al tacto y tintes seguros con colores vibrantes y duraderos.',
      icon: '🧶'
    },
    {
      step: '02',
      title: 'Patronaje y Tensión',
      desc: 'Cada modelo se planifica cuidadosamente calculando la tensión del punto y la elasticidad para que la pieza mantenga su estructura perfecta.',
      icon: '📐'
    },
    {
      step: '03',
      title: 'Tejido y Anudado Lento',
      desc: 'Con nuestras agujas doradas para el crochet y el anudado paciente en macramé, cada punto alto y nudo plano se elabora 100% a mano.',
      icon: '✨'
    },
    {
      step: '04',
      title: 'Remates y Empaque Especial',
      desc: 'Ocultamos meticulosamente cada hebra, bloqueamos la pieza con vapor suave y la empacamos en cajas reciclables con tarjeta artesanal.',
      icon: '🎁'
    }
  ];

  readonly logoSymbols = [
    {
      title: 'Las Agujas Doradas Cruzadas',
      desc: 'Representan la maestría técnica, el esmero y el orgullo por el oficio tradicional del crochet.',
      accent: 'text-amber-600 bg-[#FFF8E7] border-[#F3DE9A]'
    },
    {
      title: 'El Granny Square Tradicional',
      desc: 'Evoca los recuerdos de infancia, la calidez del hogar y la herencia textil transmitida entre generaciones.',
      accent: 'text-[#9C1B58] bg-[#FFF0F4] border-[#F5C2D4]'
    },
    {
      title: 'El Corazón en Hilo Continuo',
      desc: 'Simboliza que cada proyecto está enlazado con amor genuino desde la primera hasta la última lazada.',
      accent: 'text-[#D8366E] bg-[#FFF0F5] border-[#F5C4D8]'
    },
    {
      title: 'El Degradado Rosa a Naranja',
      desc: 'Inspirado en los tonos cálidos del atardecer que acompañan las tardes de tejido en nuestro taller.',
      accent: 'text-[#F57D28] bg-[#FFF4ED] border-[#F5D5C0]'
    }
  ];
}

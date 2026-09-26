import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
          Canales de Atención
        </span>
        <h1 class="text-3xl sm:text-5xl font-serif font-bold text-[#2E2027]">
          Estamos para Ayudarte
        </h1>
        <p class="text-sm sm:text-base text-[#6E5562]">
          ¿Tienes dudas sobre los tiempos de envío, las opciones de hilaza o el cuidado de una prenda? Escríbenos directamente.
        </p>
      </div>

      <!-- Contact Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- WhatsApp Direct -->
        <div class="p-6 rounded-3xl bg-white border border-[#EFE5DA] shadow-xs space-y-4 text-center">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-[#E8F9EE] text-[#25D366] flex items-center justify-center text-2xl">
            📱
          </div>
          <div>
            <h3 class="font-serif font-bold text-base text-[#2E2027]">WhatsApp Taller</h3>
            <p class="text-xs text-[#7A636F] mt-1">Respuesta inmediata en horario laboral</p>
            <p class="text-xs font-bold text-[#9C1B58] mt-2">+57 300 123 4567</p>
          </div>
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener"
            class="inline-block w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider transition-all">
            Abrir Chat Directo
          </a>
        </div>

        <!-- Email -->
        <div class="p-6 rounded-3xl bg-white border border-[#EFE5DA] shadow-xs space-y-4 text-center">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-[#FFF0F4] text-[#9C1B58] flex items-center justify-center text-2xl">
            ✉️
          </div>
          <div>
            <h3 class="font-serif font-bold text-base text-[#2E2027]">Correo Electrónico</h3>
            <p class="text-xs text-[#7A636F] mt-1">Para solicitudes institucionales o pedidos al por mayor</p>
            <p class="text-xs font-bold text-[#9C1B58] mt-2">hola&#64;crocheconamor.com</p>
          </div>
          <a
            href="mailto:hola@crocheconamor.com"
            class="inline-block w-full py-2.5 rounded-full bg-[#FAF3EB] hover:bg-[#F2E5D5] text-[#2E2027] font-bold text-xs uppercase tracking-wider transition-all border border-[#E8D9CB]">
            Enviar Email
          </a>
        </div>

        <!-- Schedule & Location -->
        <div class="p-6 rounded-3xl bg-white border border-[#EFE5DA] shadow-xs space-y-4 text-center">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-[#FFF8E7] text-amber-600 flex items-center justify-center text-2xl">
            📍
          </div>
          <div>
            <h3 class="font-serif font-bold text-base text-[#2E2027]">Horarios y Envíos</h3>
            <p class="text-xs text-[#7A636F] mt-1">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
            <p class="text-xs font-bold text-[#9C1B58] mt-2">Envíos a toda Colombia vía Interrapidísimo y Servientrega</p>
          </div>
          <span class="inline-block w-full py-2.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs tracking-wider border border-emerald-200">
            Taller Activo
          </span>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DA] shadow-xs space-y-6">
        <h2 class="font-serif text-2xl font-bold text-[#2E2027] text-center">
          Preguntas Frecuentes
        </h2>

        <div class="space-y-4 text-xs">
          @for (faq of faqs; track faq.q) {
            <div class="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE2D4]">
              <h4 class="font-bold text-sm text-[#2E2027] mb-1.5">{{ faq.q }}</h4>
              <p class="text-[#6E5562] leading-relaxed">{{ faq.a }}</p>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class ContactComponent {
  readonly faqs = [
    {
      q: '¿Cómo se lavan las prendas y muñecos de crochet?',
      a: 'Recomendamos lavar a mano con agua fría y jabón suave para prendas delicadas. No retorcer; presionar suavemente entre una toalla para retirar el exceso de agua y secar en plano a la sombra.'
    },
    {
      q: '¿Hacen envíos a municipios pequeños de Colombia?',
      a: '¡Sí! Llegamos a cualquier rincón de Colombia a través de transportadoras aliadas (Interrapidísimo, Servientrega y Envía).'
    },
    {
      q: '¿Cuáles son los métodos de pago aceptados?',
      a: 'Aceptamos transferencias directas por Nequi, Daviplata, Bancolombia y PSE una vez confirmada la orden por WhatsApp.'
    },
    {
      q: '¿Cuánto tiempo tarda en confeccionarse un pedido?',
      a: 'Las piezas en stock se despachan en 24-48 horas hábiles. Los encargos personalizados requieren entre 3 y 14 días hábiles dependiendo de la complejidad.'
    }
  ];
}

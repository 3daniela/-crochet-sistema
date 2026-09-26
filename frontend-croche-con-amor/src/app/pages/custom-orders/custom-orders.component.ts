import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-custom-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F5C2D4] text-[#9C1B58] text-xs font-semibold uppercase tracking-wider">
          Taller a Medida
        </span>
        <h1 class="text-3xl sm:text-5xl font-serif font-bold text-[#2E2027]">
          Cotizador de Encargos Personalizados
        </h1>
        <p class="text-sm sm:text-base text-[#6E5562]">
          ¿Deseas una combinación única de colores, un muñeco conmemorativo o un tapiz adaptado a tu pared? Cuéntanos tu idea y la tejeremos para ti.
        </p>
      </div>

      <!-- Main Form Container -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Form Column -->
        <div class="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DA] shadow-sm space-y-6">
          <h2 class="font-serif text-xl font-bold text-[#2E2027]">
            Detalles de tu Solicitud
          </h2>

          <div class="space-y-4 text-xs">
            <!-- Client Name & WhatsApp -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-[#543E4B] mb-1.5">Tu Nombre Completo *</label>
                <input
                  type="text"
                  [(ngModel)]="clientName"
                  placeholder="Ej: Laura Ramírez"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>

              <div>
                <label class="block font-semibold text-[#543E4B] mb-1.5">WhatsApp de Contacto *</label>
                <input
                  type="tel"
                  [(ngModel)]="clientWhatsApp"
                  placeholder="Ej: 310 123 4567"
                  class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
                />
              </div>
            </div>

            <!-- Category of craft -->
            <div>
              <label class="block font-semibold text-[#543E4B] mb-1.5">Tipo de Creación *</label>
              <select
                [(ngModel)]="selectedCategory"
                (change)="calculateEstimate()"
                class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58] font-medium text-[#2E2027]">
                <option value="bolso">Bolso o Cartera a Crochet (Granny Square / Punto Alto)</option>
                <option value="amigurumi">Amigurumi / Muñeco de Apego Personalizado</option>
                <option value="macrame">Tapiz Mural o Colgador en Macramé Boho</option>
                <option value="prenda">Prenda Vestible (Cardigan, Chaleco o Top)</option>
                <option value="hogar">Manta o Cojín para Sala / Cama</option>
                <option value="otro">Otro diseño especial o accesorio</option>
              </select>
            </div>

            <!-- Yarn & Fiber preference -->
            <div>
              <label class="block font-semibold text-[#543E4B] mb-1.5">Preferencia de Material o Hilaza</label>
              <select
                [(ngModel)]="selectedYarn"
                (change)="calculateEstimate()"
                class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]">
                <option value="algodon">100% Algodón Peinado Mercerizado (Hipoalergénico)</option>
                <option value="cordon-macrame">Cordón de Algodón Natural 4mm (Macramé)</option>
                <option value="mezcla-abrigada">Mezcla Lana Suave y Algodón (Para Prendas)</option>
                <option value="recomendar">Deseo que el taller me asesore la mejor opción</option>
              </select>
            </div>

            <!-- Preferred colors -->
            <div>
              <label class="block font-semibold text-[#543E4B] mb-1.5">Paleta de Colores Preferida *</label>
              <input
                type="text"
                [(ngModel)]="preferredColors"
                placeholder="Ej: Rosa pastel, terracota suave y crema natural"
                class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
              />
            </div>

            <!-- Dimensions -->
            <div>
              <label class="block font-semibold text-[#543E4B] mb-1.5">Medidas o Talla Aproximada</label>
              <input
                type="text"
                [(ngModel)]="dimensions"
                placeholder="Ej: 30 cm de alto / Talla M oversize / 60 cm de ancho"
                class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58]"
              />
            </div>

            <!-- Special notes -->
            <div>
              <label class="block font-semibold text-[#543E4B] mb-1.5">Descripción Detallada de la Idea</label>
              <textarea
                [(ngModel)]="notes"
                rows="4"
                placeholder="Cuéntanos si es para un regalo, si tienes fotos de referencia, fecha límite para recibirlo, etc."
                class="w-full p-3 rounded-xl border border-[#E5D7C9] bg-[#FFFDF9] focus:outline-none focus:border-[#9C1B58] resize-none">
              </textarea>
            </div>
          </div>
        </div>

        <!-- Estimate & Summary Column -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-[#FAF4ED] rounded-3xl p-6 border border-[#EFE2D4] space-y-5">
            <span class="inline-block px-3 py-1 rounded-full bg-[#FFF0F4] text-[#9C1B58] text-[10px] font-bold uppercase tracking-wider">
              Estimación de Taller
            </span>

            <div>
              <h3 class="font-serif text-lg font-bold text-[#2E2027]">Cotización Estimada</h3>
              <p class="text-xs text-[#7A636F] mt-1">
                El valor exacto se confirma por WhatsApp según complejidad del patrón y metros de hilaza.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-white border border-[#EAE0D3]">
              <span class="text-[11px] text-[#8C6D7C] block">Rango estimado base:</span>
              <span class="text-2xl font-bold text-[#9C1B58]">
                {{ cartService.formatCOP(estimatedPrice) }}
              </span>
              <span class="text-[10px] text-[#7A636F] block mt-1">
                ⏱️ Tiempo de confección: <strong>{{ estimatedTime }}</strong>
              </span>
            </div>

            <div class="space-y-2 text-xs text-[#6E5562]">
              <p class="flex items-center gap-2">
                <span>✓</span>
                <span>Asesoría directa con la artesana</span>
              </p>
              <p class="flex items-center gap-2">
                <span>✓</span>
                <span>Envío de fotos durante el proceso</span>
              </p>
              <p class="flex items-center gap-2">
                <span>✓</span>
                <span>Empaque de regalo incluido</span>
              </p>
            </div>

            <!-- WhatsApp Action Button -->
            <button
              (click)="sendViaWhatsApp()"
              class="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-center">
              <span>📱 Enviar Cotización por WhatsApp</span>
            </button>

            <p class="text-[10px] text-center text-[#8C6D7C]">
              Te responderemos en menos de 2 horas hábiles con la confirmación de agenda.
            </p>
          </div>
        </div>

      </div>

    </div>
  `
})
export class CustomOrdersComponent {
  readonly cartService = inject(CartService);

  clientName = '';
  clientWhatsApp = '';
  selectedCategory = 'bolso';
  selectedYarn = 'algodon';
  preferredColors = '';
  dimensions = '';
  notes = '';

  estimatedPrice = 145000;
  estimatedTime = '5 a 8 días hábiles';

  calculateEstimate(): void {
    switch (this.selectedCategory) {
      case 'bolso':
        this.estimatedPrice = 145000;
        this.estimatedTime = '5 a 8 días hábiles';
        break;
      case 'amigurumi':
        this.estimatedPrice = 95000;
        this.estimatedTime = '3 a 5 días hábiles';
        break;
      case 'macrame':
        this.estimatedPrice = 165000;
        this.estimatedTime = '4 a 7 días hábiles';
        break;
      case 'prenda':
        this.estimatedPrice = 265000;
        this.estimatedTime = '8 a 14 días hábiles';
        break;
      case 'hogar':
        this.estimatedPrice = 340000;
        this.estimatedTime = '10 a 16 días hábiles';
        break;
      default:
        this.estimatedPrice = 120000;
        this.estimatedTime = '5 a 10 días hábiles';
    }
  }

  sendViaWhatsApp(): void {
    const phone = '573001234567';
    let text = `¡Hola Croché con Amor! 🧶✨\n\nQuisiera cotizar un encargo personalizado con los siguientes datos:\n\n`;
    text += `- *Cliente:* ${this.clientName || 'Cliente Taller'}\n`;
    text += `- *WhatsApp:* ${this.clientWhatsApp || 'Sin especificar'}\n`;
    text += `- *Tipo de pieza:* ${this.selectedCategory.toUpperCase()}\n`;
    text += `- *Hilaza:* ${this.selectedYarn}\n`;
    text += `- *Colores preferidos:* ${this.preferredColors || 'Por definir'}\n`;
    if (this.dimensions) text += `- *Medidas/Talla:* ${this.dimensions}\n`;
    if (this.notes) text += `- *Detalles/Notas:* ${this.notes}\n`;
    text += `\n*Presupuesto base estimado:* ${this.cartService.formatCOP(this.estimatedPrice)}\n\n¿Me indican si tienen agenda para confeccionarlo? ¡Gracias!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }
}

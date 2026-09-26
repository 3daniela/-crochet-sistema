import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-croche-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (badgeOnly) {
      <div class="relative inline-block group" [class]="className">
        <div 
          class="overflow-hidden shadow-xl shadow-[#D8366E]/20 border-2 border-white/60 transition-transform duration-300 group-hover:scale-105"
          [ngClass]="getBadgeDimensions()">
          <img
            [src]="logoSrc"
            alt="Logo Oficial Croché con Amor - Hecho a Mano"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    } @else {
      <div class="inline-flex items-center gap-3 sm:gap-3.5" [class]="className">
        @if (showBadge) {
          <div 
            class="relative overflow-hidden shrink-0 shadow-md shadow-[#D8366E]/15 border border-white/60 transition-transform duration-300 group-hover:scale-105"
            [ngClass]="getBadgeDimensions()">
            <img
              [src]="logoSrc"
              alt="Logo Oficial Croché con Amor"
              class="w-full h-full object-cover"
            />
          </div>
        }
        <div class="flex flex-col">
          <span
            class="font-serif tracking-tight font-bold leading-none"
            [ngClass]="[getTitleSize(), textColor === 'light' ? 'text-white drop-shadow-sm' : 'text-[#2D2128]']"
            style="font-family: 'Playfair Display', serif">
            croché con amor
          </span>
          <span
            class="font-sans font-semibold uppercase mt-1"
            [ngClass]="[getSubtitleSize(), textColor === 'light' ? 'text-white/80' : 'text-[#8A6A76]']"
            style="font-family: 'Plus Jakarta Sans', sans-serif">
            HECHO A MANO
          </span>
        </div>
      </div>
    }
  `
})
export class CrocheLogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'hero' = 'md';
  @Input() showBadge = true;
  @Input() textColor: 'light' | 'dark' = 'dark';
  @Input() className = '';
  @Input() badgeOnly = false;

  readonly logoSrc = '/images/croche_official_logo_1789776458674.jpg';

  getBadgeDimensions(): string {
    switch (this.size) {
      case 'sm': return 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl';
      case 'md': return 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl';
      case 'lg': return 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl';
      case 'hero': return 'w-44 h-44 sm:w-56 sm:h-56 rounded-[2.5rem]';
    }
  }

  getTitleSize(): string {
    switch (this.size) {
      case 'sm': return 'text-lg';
      case 'md': return 'text-xl sm:text-2xl';
      case 'lg': return 'text-2xl sm:text-3xl';
      case 'hero': return 'text-4xl sm:text-5xl';
    }
  }

  getSubtitleSize(): string {
    switch (this.size) {
      case 'sm': return 'text-[9px] tracking-[0.2em]';
      case 'md': return 'text-[10px] sm:text-[11px] tracking-[0.25em]';
      case 'lg': return 'text-xs tracking-[0.3em]';
      case 'hero': return 'text-sm tracking-[0.35em]';
    }
  }
}

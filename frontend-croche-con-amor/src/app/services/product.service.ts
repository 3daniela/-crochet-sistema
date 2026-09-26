import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category } from '../models';
import { environment } from '../../environments/environment';

/**
 * IMPORTANTE: esta clase conserva exactamente la misma API pública que
 * tenía la versión con datos mock (getProducts, getFeaturedProducts,
 * getProductById, getCategories), por eso NINGÚN componente
 * (home, products, auth) tuvo que modificarse.
 *
 * Antes: los signals se inicializaban con arreglos estáticos (PRODUCTS_DATA).
 * Ahora: se inicializan vacíos y se llenan al construirse el servicio con
 * una petición HTTP real al backend Spring Boot. Como los componentes leen
 * los signals dentro de su template (product()), la UI se actualiza sola
 * en cuanto llega la respuesta, sin ningún cambio adicional.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly products = signal<Product[]>([]);
  private readonly categories = signal<Category[]>([]);

  readonly selectedProductForModal = signal<Product | null>(null);
  readonly cargandoProductos = signal<boolean>(true);
  readonly errorCarga = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.cargarProductos();
    this.cargarCategorias();
  }

  private cargarProductos(): void {
    this.http.get<Product[]>(`${environment.apiUrl}/productos`).subscribe({
      next: (data) => {
        this.products.set(data);
        this.cargandoProductos.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos del backend:', err);
        this.errorCarga.set('No se pudo cargar el catálogo. Intenta más tarde.');
        this.cargandoProductos.set(false);
      }
    });
  }

  private cargarCategorias(): void {
    this.http.get<Category[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error cargando categorías del backend:', err)
    });
  }

  getProducts(): Product[] {
    return this.products();
  }

  getFeaturedProducts(): Product[] {
    return this.products().filter(p => p.featured);
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getCategories(): Category[] {
    return this.categories();
  }

  openProductModal(product: Product): void {
    this.selectedProductForModal.set(product);
  }

  closeProductModal(): void {
    this.selectedProductForModal.set(null);
  }
}

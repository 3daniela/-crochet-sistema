import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { CustomOrdersComponent } from './pages/custom-orders/custom-orders.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Croché con Amor | Inicio' },
  { path: 'productos', component: ProductsComponent, title: 'Catálogo de Tejidos | Croché con Amor' },
  { path: 'nosotros', component: AboutComponent, title: 'Nuestra Historia | Croché con Amor' },
  { path: 'encargos', component: CustomOrdersComponent, title: 'Encargos a Medida | Croché con Amor' },
  { path: 'contacto', component: ContactComponent, title: 'Contacto & Taller | Croché con Amor' },
  { path: 'cuenta', component: AuthComponent, title: 'Mi Cuenta & Favoritos | Croché con Amor' },
  { path: '**', redirectTo: '' }
];

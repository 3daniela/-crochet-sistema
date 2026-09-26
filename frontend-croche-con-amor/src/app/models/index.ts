export interface Product {
  id: string;
  name: string;
  category: 'amigurumis' | 'bolsos' | 'prendas' | 'hogar' | 'macrame';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  shortDescription: string;
  fullDescription: string;
  materials: string[];
  dimensions: string;
  timeToMake: string;
  inStock: boolean;
  featured: boolean;
  colors: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  count: string;
}

export interface CustomOrderRequest {
  clientName: string;
  whatsapp: string;
  category: string;
  yarnType: string;
  preferredColors: string;
  dimensions?: string;
  estimatedDeadline?: string;
  notes: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  password: string;
  acceptTerms: boolean;
}

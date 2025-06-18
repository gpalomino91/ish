
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs'; // Added 'of' for cache return
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';
  private productsCache: Product[] | null = null;

  private cart = new BehaviorSubject<Product[]>([]);
  cart$ = this.cart.asObservable();

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    if (this.productsCache) {
      return of(this.productsCache); // Use 'of' to return Observable from cache
    }
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => this.productsCache = products)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addToCart(product: Product) {
    const currentCart = this.cart.value;
    const existingProduct = currentCart.find(item => item.id === product.id);
    if (!existingProduct) {
      this.cart.next([...currentCart, product]);
    }
  }

  getCart(): Product[] { // This is synchronous, consider if it should be async too
    return this.cart.value;
  }

  clearCart() {
    this.cart.next([]);
  }
}

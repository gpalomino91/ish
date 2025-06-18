
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable, of } from 'rxjs'; // Added 'of' for potential dummy observable
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.html', // Corrected filename
  styleUrls: ['./store.scss']  // Corrected filename
})
export class Store implements OnInit {
  // products$: Observable<Product[]>; // No longer directly driving the main static list
                                     // If any part of template *still* uses products$ (e.g. an old *ngIf),
                                     // it should be initialized to an empty array or similar:
                                     // products$: Observable<Product[]> = of([]);
  cart$: Observable<Product[]>;

  constructor(private productService: ProductService) {
    // this.products$ = this.productService.getProducts(); // Not needed for main static list
    this.cart$ = this.productService.cart$;
  }

  ngOnInit(): void {
    // Initialization logic for products$ can be removed if it's not used.
  }

  // The addToCart method is not called by the static product items in store.html
  // (they have 'Consultar Precio' links).
  // If it were to be used by some other part, it would need a proper Product object.
  // For now, its presence is benign but largely unused by the main static content.
  addToCart(product: Product): void {
    console.warn('addToCart called. This product might be a simplified object:', product);
    this.productService.addToCart(product);
  }

  calculateTotal(cartItems: Product[] | null): number {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  clearCart(): void {
    this.productService.clearCart();
  }
}


import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.html', // Corrected filename
  styleUrls: ['./store.css']  // Corrected filename
})
export class Store implements OnInit { // Corrected class name
  products$: Observable<Product[]>;
  cart$: Observable<Product[]>;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
    this.cart$ = this.productService.cart$;
  }

  ngOnInit(): void {
    // products$ will be handled by async pipe in template
  }

  addToCart(product: Product): void {
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


import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Store } from './store'; // Adjusted import
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';

// Mock ProductService
class MockProductService {
  getProducts() {
    const mockProducts: Product[] = [
      { id: 1, name: 'Mock Bulb', description: 'A mock bulb', price: 12, imageUrl: 'mock.jpg' },
    ];
    return of(mockProducts);
  }
  cart$ = of([]); // Mock cart observable
  addToCart(product: Product) {}
  clearCart() {}
  calculateTotal(items: Product[] | null) { return items ? items.reduce((sum, i) => sum + i.price, 0) : 0; }
}

describe('StoreComponent', () => { // Changed to StoreComponent for clarity, matches class name used in TestBed
  let component: Store;
  let fixture: ComponentFixture<Store>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule, // ProductService (even mock) might be constructed with HttpClient if not careful
        Store // Import the standalone component
      ],
      providers: [{ provide: ProductService, useClass: MockProductService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products after products$ emits', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-item h3')?.textContent).toContain('Mock Bulb');
  });
});

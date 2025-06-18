
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const backendUrl = 'http://localhost:3000/api/products'; // Ensure this matches service

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products from the API via GET', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Test Smart Bulb', description: 'A test bulb', price: 10, imageUrl: 'test.jpg' },
      { id: 2, name: 'Test Smart Plug', description: 'A test plug', price: 5, imageUrl: 'test2.jpg' }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should fetch a single product by ID from the API via GET', () => {
    const mockProduct: Product = { id: 1, name: 'Test Smart Bulb', description: 'A test bulb', price: 10, imageUrl: 'test.jpg' };

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${backendUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  // Test addToCart, getCart, clearCart (these are currently frontend only)
  it('should add a product to the cart', () => {
    const productToAdd: Product = { id: 3, name: 'Test Camera', description: 'A test camera', price: 25 };
    service.addToCart(productToAdd);
    service.cart$.subscribe(cart => {
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual(productToAdd);
    });
    // To make this test more robust, unsubscribe or use firstValueFrom/take(1)
  });
});

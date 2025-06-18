
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Contact } from './contact'; // Adjusted
import { ContactService, ContactFormResponse } from '../../services/contact.service';
import { CommonModule } from '@angular/common';

class MockContactService {
  submitContactForm(data: any): any {
    if (data.email === 'fail@example.com') {
      return throwError(() => new Error('Simulated server error'));
    }
    const response: ContactFormResponse = { message: 'Test submission successful' };
    return of(response);
  }
}

describe('ContactComponent', () => { // Changed to ContactComponent for clarity
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        Contact // Standalone component
      ],
      providers: [
        { provide: ContactService, useClass: MockContactService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.contactForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    component.contactForm.controls['email'].setValue('test');
    expect(component.contactForm.controls['email'].valid).toBeFalsy();
    component.contactForm.controls['email'].setValue('test@example.com');
    expect(component.contactForm.controls['email'].valid).toBeTruthy();
  });

  it('should call contactService.submitContactForm on valid submission and show success', () => {
    const contactService = TestBed.inject(ContactService);
    spyOn(contactService, 'submitContactForm').and.callThrough();

    component.contactForm.controls['name'].setValue('Test User');
    component.contactForm.controls['email'].setValue('test@example.com');
    component.contactForm.controls['message'].setValue('A message');
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(contactService.submitContactForm).toHaveBeenCalled();
    expect(component.submissionStatus.success).toBeTrue();
    expect(component.submissionStatus.message).toBe('Test submission successful');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.success-message')?.textContent).toContain('Test submission successful');
  });

  it('should show error message on failed submission', () => {
    component.contactForm.controls['name'].setValue('Test User');
    component.contactForm.controls['email'].setValue('fail@example.com');
    component.contactForm.controls['message'].setValue('A message');
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(component.submissionStatus.success).toBeFalse();
    expect(component.submissionStatus.message).toContain('An error occurred');
     const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-message')?.textContent).toContain('An error occurred');
  });
});

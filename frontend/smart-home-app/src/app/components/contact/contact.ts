import { Component, OnInit } from '@angular/core'; // Added OnInit to imports
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService, ContactFormResponse } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit { // Implements OnInit
  contactForm: FormGroup;
  submissionStatus: { success?: boolean; message?: string } = {};

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {} // Implemented ngOnInit

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (response: ContactFormResponse) => {
          this.submissionStatus = { success: true, message: response.message };
          this.contactForm.reset();
        },
        error: (error) => {
          this.submissionStatus = { success: false, message: 'An error occurred. Please try again.' };
          console.error('Contact form submission error:', error);
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
      this.submissionStatus = { success: false, message: 'Please fill out all fields correctly.' };
    }
  }
}

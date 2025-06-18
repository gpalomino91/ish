import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Good practice to include
import { RouterLink } from '@angular/router';   // Import RouterLink for <a routerLink=...>

@Component({
  selector: 'app-services',
  standalone: true, // Ensure it's a standalone component
  imports: [CommonModule, RouterLink], // Add CommonModule and RouterLink
  templateUrl: './services.html',    // Actual filename
  styleUrl: './services.css'      // Actual filename
})
export class Services { // Class name is Services

  constructor() { }

}

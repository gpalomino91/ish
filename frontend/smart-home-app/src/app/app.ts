import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router'; // Ensure these are imported

@Component({
  selector: 'app-root', // Typically 'app-root' for the main app component
  standalone: true, // Explicitly mark as standalone
  imports: [
    CommonModule,
    RouterOutlet, // For <router-outlet>
    RouterLink    // For routerLink directive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  protected title = 'smart-home-app'; // Keep or remove if not used
}

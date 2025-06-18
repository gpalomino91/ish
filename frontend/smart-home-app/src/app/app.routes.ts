import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'services', loadComponent: () => import('./components/services/services').then(m => m.Services) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.Contact) },
  { path: 'store', loadComponent: () => import('./components/store/store').then(m => m.Store) }
];

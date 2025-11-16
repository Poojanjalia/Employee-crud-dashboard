import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './features/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
@if (auth.isLoggedIn && !isLoginRoute) {
  <app-navbar
    [userName]="(auth.currentUserValue?.firstName ?? '') + ' ' + (auth.currentUserValue?.lastName ?? '')"
    [userRole]="auth.currentUserValue?.role ?? ''">
  </app-navbar>
}
<router-outlet></router-outlet>
  `
})
export class App {
  auth = inject(AuthService);
  router = inject(Router);

  get isLoginRoute(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }
}

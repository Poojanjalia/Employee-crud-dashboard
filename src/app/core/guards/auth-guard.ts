import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  const requiredRole = route.data['role'];
  const user = auth.currentUserValue;

  if (requiredRole && user?.role !== requiredRole) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = !!localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    const router = inject(Router);
    router.navigate(['/']);
    return false;
  }
  return true;
};

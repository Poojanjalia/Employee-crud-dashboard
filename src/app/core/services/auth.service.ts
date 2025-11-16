import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

export interface User {
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
}

const DEMO_USERS: User[] = [
  { email: 'admin@company.com', password: 'Admin@123', role: 'admin', firstName:'Admin', lastName:'User' },
  { email: 'user@company.com', password: 'User@123', role: 'user', firstName:'Regular', lastName:'User' }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const session = sessionStorage.getItem('currentUser');
      if (session) {
        this.currentUserSubject.next(JSON.parse(session));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!user) return throwError(() => new Error('Invalid credentials'));
    this.currentUserSubject.next(user);

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    return of(user);
  }
  register(newUser: User): Observable<User> {
  if (DEMO_USERS.find(u => u.email === newUser.email)) {
    return throwError(() => new Error('Email already exists'));
  }
  DEMO_USERS.push({ ...newUser, role: 'user' });
  return of(newUser);
}


logout(): void {
  this.currentUserSubject.next(null);
  if (isPlatformBrowser(this.platformId)) {
    sessionStorage.removeItem('currentUser');
  }
  this.router.navigate(['/login']);
}


  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}

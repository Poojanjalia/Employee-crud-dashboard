import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterModule 
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  infoMessage: string = '';
  returnUrl: string = '/dashboard';
  isRegistering = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: err => this.errorMessage = err.message
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    const { email, password, firstName, lastName } = this.registerForm.value;
    this.auth.register({
      email,
      password,
      firstName,
      lastName,
      role: 'user'
    }).subscribe({
      next: () => {
        this.infoMessage = 'Registration successful! Please login.';
        this.isRegistering = false;
        this.registerForm.reset();
      },
      error: err => this.errorMessage = err.message
    });
  }

  switchMode() {
    this.errorMessage = '';
    this.infoMessage = '';
    this.isRegistering = !this.isRegistering;
    this.loginForm.reset();
    this.registerForm.reset();
  }
}

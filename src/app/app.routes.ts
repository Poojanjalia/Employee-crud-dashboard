import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { EmployeeDetailComponent } from './features/employees/employee-detail/employee-detail';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form';
import { DashboardComponent } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { RegisterComponent } from './features/auth/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'employees/new', component: EmployeeFormComponent, canActivate: [authGuard] },
  { path: 'employees/:id', component: EmployeeDetailComponent, canActivate: [authGuard] },
  { path: 'employees/:id/edit', component: EmployeeFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'employees' }
];

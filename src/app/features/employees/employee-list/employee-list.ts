import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmployeeService, Employee } from '../services/employee.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatCardModule, FormsModule, LoadingSpinnerComponent, RouterModule
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  searchText = '';
  displayedColumns = ['fullName', 'email', 'department', 'jobTitle', 'hireDate', 'actions'];

  constructor(private employeeService: EmployeeService) {}

  get filteredEmployees(): Employee[] {
    const text = this.searchText.toLowerCase();
    return this.employees.filter(emp =>
      emp.fullName.toLowerCase().includes(text) ||
      emp.email.toLowerCase().includes(text) ||
      emp.department.toLowerCase().includes(text)
    );
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.loading = false;
    });
  }

  onDelete(employee: Employee) {
    if (confirm(`Delete employee ${employee.fullName}?`)) {
      // Implement real delete logic here
      this.employees = this.employees.filter(e => e.id !== employee.id);
    }
  }
}

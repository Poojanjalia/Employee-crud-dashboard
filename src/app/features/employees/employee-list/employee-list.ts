import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { RouterModule } from '@angular/router';
import { EmployeeServiceAPI, Employee } from '../../../core/services/employee';

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
  dataSource: Employee[] = [];
  loading = false;
  searchText = '';
  displayedColumns = ['fullName', 'email', 'department', 'jobTitle', 'hireDate', 'actions'];

  constructor(private employeeServiceApi: EmployeeServiceAPI, private cdr: ChangeDetectorRef) {}

  get filteredEmployees(): Employee[] {
    const text = this.searchText.toLowerCase();
    return this.dataSource.filter(emp =>
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
    this.employeeServiceApi.getEmployees().subscribe({
      next: employees => {
        this.dataSource = employees;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
    this.cdr.detectChanges();
  }

  onDelete(employee: Employee) {
  if (confirm(`Delete employee ${employee.fullName}?`)) {
    this.employeeServiceApi.deleteEmployee(employee.id!).subscribe({
      next: () => this.loadEmployees(), // Reload table after delete
      error: err => console.error('Delete failed: ', err)
    });
  }
}
}

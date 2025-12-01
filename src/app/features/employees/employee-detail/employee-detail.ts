import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { Employee, EmployeeServiceAPI } from '../../../core/services/employee';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './employee-detail.html',
  styleUrls: ['./employee-detail.css']
})
export class EmployeeDetailComponent implements OnInit {
  
  employee: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private employeeService: EmployeeServiceAPI,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.employeeService.getEmployee(Number(id)).subscribe({
        next: (response: any) => {
          console.log('Detail Response:', response);

          const data = response.value || response.result || response;

          this.employee = {
            id: data.id,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            address: data.address,
            employeeId: data.employeeID,
            jobTitle: data.jobTitle,
            department: data.department,
            hireDate: data.hireDate,
            salary: data.salary,
            employmentType: data.employmentType,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
            emergencyContactRelationship: data.relationship
          };

          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading employee details:', err)
      });
    }
  }

  onDelete() {
    if (this.employee && confirm(`Are you sure you want to delete ${this.employee.fullName}?`)) {
      this.employeeService.deleteEmployee(this.employee.id!).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}
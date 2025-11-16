import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee, EmployeeService } from '../services/employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css']
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  employee?: Employee;
  id?: string;
  isNew = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    this.isNew = !this.id; 
    
    if (!this.isNew) {
      this.employeeService.getEmployees().subscribe(employees => {
        this.employee = employees.find(e => e.id === this.id);
        this.initForm();
      });
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.form = this.fb.group({
      fullName: [this.employee?.fullName || '', Validators.required],
      email: [this.employee?.email || '', [Validators.required, Validators.email]],
      phone: [this.employee?.phone || '', Validators.required],
      dateOfBirth: [this.employee?.dateOfBirth || '', Validators.required],
      address: [this.employee?.address || '', Validators.required],
      employeeId: [this.employee?.employeeId || '', Validators.required],
      jobTitle: [this.employee?.jobTitle || '', Validators.required],
      department: [this.employee?.department || '', Validators.required],
      hireDate: [this.employee?.hireDate || '', Validators.required],
      salary: [this.employee?.salary || '', Validators.required],
      employmentType: [this.employee?.employmentType || '', Validators.required],
      emergencyContactName: [this.employee?.emergencyContactName || '', Validators.required],
      emergencyContactPhone: [this.employee?.emergencyContactPhone || '', Validators.required],
      emergencyContactRelationship: [this.employee?.emergencyContactRelationship || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const updated = { ...this.employee, ...this.form.value };
      alert('Employee would be saved:\n\n' + JSON.stringify(updated, null, 2));
      this.router.navigate(['/employees', updated.id]);
    }
  }
}

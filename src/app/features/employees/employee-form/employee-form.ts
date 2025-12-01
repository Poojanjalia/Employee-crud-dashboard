import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Employee, EmployeeServiceAPI } from '../../../core/services/employee';

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
    private employeeServiceApi: EmployeeServiceAPI,
    private cdr: ChangeDetectorRef
  ) {}
  
   ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    this.isNew = !this.id; 

    this.initForm(); 

    if (!this.isNew && this.id) {
      this.employeeServiceApi.getEmployee(Number(this.id)).subscribe({
        next: (response: any) => {
          console.log('API Details Response:', response);

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

          this.updateFormValues();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching employee:', err)
      });
    }
  }

  initForm() {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      employeeId: ['', Validators.required],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      hireDate: ['', Validators.required],
      salary: ['', Validators.required],
      employmentType: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', Validators.required],
      emergencyContactRelationship: ['', Validators.required]
    });
  }

  updateFormValues() {
    if (!this.employee) return;

    this.form.patchValue({
      fullName: this.employee.fullName,
      email: this.employee.email,
      phone: this.employee.phone,
      dateOfBirth: this.formatDate(this.employee.dateOfBirth),
      address: this.employee.address,
      employeeId: this.employee.employeeId,
      jobTitle: this.employee.jobTitle,
      department: this.employee.department,
      hireDate: this.formatDate(this.employee.hireDate),
      salary: this.employee.salary,
      employmentType: this.employee.employmentType,
      emergencyContactName: this.employee.emergencyContactName,
      emergencyContactPhone: this.employee.emergencyContactPhone,
      emergencyContactRelationship: this.employee.emergencyContactRelationship
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
  }

  onSubmit() {
    if (this.form.valid) {
      const formValues = this.form.value;
      const apiPayload: any = {
        id: this.isNew ? 0 : Number(this.id),
        fullName: formValues.fullName,
        email: formValues.email,
        phone: formValues.phone,
        dateOfBirth: formValues.dateOfBirth,
        address: formValues.address,
        employeeId: formValues.employeeId,
        jobTitle: formValues.jobTitle,
        department: formValues.department,
        hireDate: formValues.hireDate,
        salary: formValues.salary,
        employmentType: formValues.employmentType,
        emergencyContactName: formValues.emergencyContactName,
        emergencyContactPhone: formValues.emergencyContactPhone,
        Relationship: formValues.emergencyContactRelationship 
      };

      console.log('Sending to API:', apiPayload);

      if (this.isNew) {
        this.employeeServiceApi.addEmployee(apiPayload).subscribe({
          next: () => this.router.navigate(['/employees']),
          error: err => {
            console.error('Add failed', err);
            alert('Error saving: ' + JSON.stringify(err.error.errors || err.message));
          }
        });
      } else {
        this.employeeServiceApi.updateEmployee(Number(this.id), apiPayload).subscribe({
          next: () => this.router.navigate(['/employees']),
          error: err => {
            console.error('Update failed', err);
            alert('Error saving: ' + JSON.stringify(err.error.errors || err.message));
          }
        });
      }
    }
  }
}
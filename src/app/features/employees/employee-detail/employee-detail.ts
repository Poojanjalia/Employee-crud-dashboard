import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Employee, EmployeeServiceAPI } from '../../../core/services/employee';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule,RouterModule],
  templateUrl: './employee-detail.html',
  styleUrls: ['./employee-detail.css']
})
export class EmployeeDetailComponent implements OnInit {
onDelete() {
throw new Error('Method not implemented.');
}
  employee!: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeServiceAPI
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeService.getEmployees().subscribe((employees) => {
      //this.employee = employees.find(e => e.id === id);
    });
  }
}

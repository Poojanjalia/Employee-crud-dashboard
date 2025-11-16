import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  employeeId: string; 
  jobTitle: string;
  department: string;
  hireDate: string;
  salary: number;
  employmentType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

@Injectable({
  providedIn: 'root'
})
  
export class EmployeeServiceAPI {
  private baseUrl = 'https://localhost:7204/api/employees'; // your API URL

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, emp);
  }

  updateEmployee(id: number, emp: Employee): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

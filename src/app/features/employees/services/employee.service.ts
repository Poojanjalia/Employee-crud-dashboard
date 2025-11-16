import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';

export interface Employee {
  id: string;
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


const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    phone: '555-1234',
    dateOfBirth: '1990-02-15',
    address: '123 Main St, Springfield',
    employeeId: 'EMP001',
    jobTitle: 'Senior Engineer',
    department: 'Engineering',
    hireDate: '2023-06-10',
    salary: 85000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '555-5678',
    emergencyContactRelationship: 'Spouse'
  },
  {
    id: '2',
    fullName: 'Anna Brown',
    email: 'anna.brown@company.com',
    phone: '555-2294',
    dateOfBirth: '1992-03-21',
    address: '58 Hillside Dr, Newton',
    employeeId: 'EMP002',
    jobTitle: 'HR Specialist',
    department: 'HR',
    hireDate: '2023-07-05',
    salary: 60000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Tom Brown',
    emergencyContactPhone: '555-1122',
    emergencyContactRelationship: 'Father'
  },
  {
    id: '3',
    fullName: 'Kyle Young',
    email: 'kyle.young@company.com',
    phone: '555-3018',
    dateOfBirth: '1981-06-22',
    address: '324 Oak St, Monroe',
    employeeId: 'EMP003',
    jobTitle: 'Operations Coordinator',
    department: 'Operations',
    hireDate: '2023-08-02',
    salary: 70000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Lauren Young',
    emergencyContactPhone: '555-1982',
    emergencyContactRelationship: 'Spouse'
  },
  {
    id: '4',
    fullName: 'Harper Miller',
    email: 'harper.miller@company.com',
    phone: '555-4092',
    dateOfBirth: '1995-04-11',
    address: '87 Sunny Rd, Portland',
    employeeId: 'EMP004',
    jobTitle: 'HR Specialist',
    department: 'HR',
    hireDate: '2023-09-18',
    salary: 57600,
    employmentType: 'Part-Time',
    emergencyContactName: 'Liam Miller',
    emergencyContactPhone: '555-3043',
    emergencyContactRelationship: 'Brother'
  },
  {
    id: '5',
    fullName: 'Olivia Johnson',
    email: 'olivia.johnson@company.com',
    phone: '555-3344',
    dateOfBirth: '1985-03-19',
    address: '12 River St, Central City',
    employeeId: 'EMP005',
    jobTitle: 'Accountant',
    department: 'Finance',
    hireDate: '2023-10-11',
    salary: 67000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Marcus Johnson',
    emergencyContactPhone: '555-8812',
    emergencyContactRelationship: 'Husband'
  },
  {
    id: '6',
    fullName: 'Charles Wilson',
    email: 'charles.wilson@company.com',
    phone: '555-6655',
    dateOfBirth: '1993-12-16',
    address: '303 Rose St, Bloomfield',
    employeeId: 'EMP006',
    jobTitle: 'Accountant',
    department: 'Finance',
    hireDate: '2023-10-17',
    salary: 67000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Sarah Wilson',
    emergencyContactPhone: '555-1747',
    emergencyContactRelationship: 'Mother'
  },
  {
    id: '7',
    fullName: 'Eric Hernandez',
    email: 'eric.hernandez@company.com',
    phone: '555-7717',
    dateOfBirth: '1999-10-01',
    address: '210 Cedar Ct, Dallas',
    employeeId: 'EMP007',
    jobTitle: 'HR Specialist',
    department: 'HR',
    hireDate: '2023-09-20',
    salary: 54000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Victor Hernandez',
    emergencyContactPhone: '555-3232',
    emergencyContactRelationship: 'Father'
  },
  {
    id: '8',
    fullName: 'Amelia Evans',
    email: 'amelia.evans@company.com',
    phone: '555-8030',
    dateOfBirth: '1986-10-03',
    address: '22 Spruce Blvd, Albany',
    employeeId: 'EMP008',
    jobTitle: 'Marketing Analyst',
    department: 'Marketing',
    hireDate: '2023-11-02',
    salary: 60000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Brian Evans',
    emergencyContactPhone: '555-1941',
    emergencyContactRelationship: 'Brother'
  },
  {
    id: '9',
    fullName: 'John Taylor',
    email: 'john.taylor@company.com',
    phone: '555-6151',
    dateOfBirth: '1988-04-08',
    address: '9001 5th Ave, Denver',
    employeeId: 'EMP009',
    jobTitle: 'HR Specialist',
    department: 'HR',
    hireDate: '2023-09-11',
    salary: 55000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Sierra Taylor',
    emergencyContactPhone: '555-9098',
    emergencyContactRelationship: 'Wife'
  },
  {
    id: '10',
    fullName: 'Sophia Lee',
    email: 'sophia.lee@company.com',
    phone: '555-9986',
    dateOfBirth: '1990-08-23',
    address: '299 Vine Rd, Atlanta',
    employeeId: 'EMP010',
    jobTitle: 'Product Designer',
    department: 'Product',
    hireDate: '2023-08-18',
    salary: 88000,
    employmentType: 'Full-Time',
    emergencyContactName: 'June Lee',
    emergencyContactPhone: '555-4558',
    emergencyContactRelationship: 'Mother'
  },
  {
    id: '11',
    fullName: 'Brandon Foster',
    email: 'brandon.foster@company.com',
    phone: '555-5241',
    dateOfBirth: '1994-06-30',
    address: '110 Maple St, Seattle',
    employeeId: 'EMP011',
    jobTitle: 'QA Engineer',
    department: 'Engineering',
    hireDate: '2023-07-27',
    salary: 72000,
    employmentType: 'Full-Time',
    emergencyContactName: 'Nina Foster',
    emergencyContactPhone: '555-8127',
    emergencyContactRelationship: 'Sister'
  },
  {
    id: '12',
    fullName: 'Megan Rose',
    email: 'megan.rose@company.com',
    phone: '555-7323',
    dateOfBirth: '1992-10-28',
    address: '80 Elmwood Dr, Tampa',
    employeeId: 'EMP012',
    jobTitle: 'Operations Coordinator',
    department: 'Operations',
    hireDate: '2023-10-08',
    salary: 73500,
    employmentType: 'Full-Time',
    emergencyContactName: 'Adrian Rose',
    emergencyContactPhone: '555-3213',
    emergencyContactRelationship: 'Brother'
  },
  {
    id: '13',
    fullName: 'Liam Scott',
    email: 'liam.scott@company.com',
    phone: '555-1238',
    dateOfBirth: '1991-09-13',
    address: '4104 Sunset Blvd, Phoenix',
    employeeId: 'EMP013',
    jobTitle: 'Support Rep',
    department: 'Support',
    hireDate: '2023-11-08',
    salary: 54000,
    employmentType: 'Part-Time',
    emergencyContactName: 'Nora Scott',
    emergencyContactPhone: '555-1441',
    emergencyContactRelationship: 'Mother'
  }
];




@Injectable({ providedIn: 'root' })
export class EmployeeService {
  getEmployees(): Observable<Employee[]> {
    return of(MOCK_EMPLOYEES);
  }
    getDepartmentCounts(): Observable<{ [department: string]: number }> {
    return this.getEmployees().pipe(
      map(employees => {
        const deptCounts: { [department: string]: number } = {};
        employees.forEach(emp => {
          deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
        });
        return deptCounts;
      })
    );
  }

  getMonthlyHireCounts(monthLabels: string[]): Observable<{ [month: string]: number }> {
    return this.getEmployees().pipe(
      map(employees => {
        const result: { [month: string]: number } = {};
        monthLabels.forEach(label => (result[label] = 0));
        employees.forEach(emp => {
          const dt = new Date(emp.hireDate);
          const monthStr = dt.toLocaleString('en-US', { month: 'short', year: '2-digit' }); 
          if (result[monthStr] !== undefined) result[monthStr]++;
        });
        return result;
      })
    );
  }
}

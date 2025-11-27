import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { Employee, EmployeeServiceAPI } from '../../core/services/employee';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, NgChartsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // Stats
  totalEmployees = 0;
  newThisMonth = 0;
  avgSalary = 0;
  departmentss = 0;
  
  // Data Holders
  departments: string[] = [];
  recentEmployees: any[] = []; // Changed to any to handle mapping safely
  
  // Charts
  barChartData: any;
  lineChartData: any;
  barChartType = 'bar' as const;
  barChartOptions = { responsive: true, plugins: { legend: { display: false } } };
  lineChartType = 'line' as const;
  lineChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    elements: { line: { borderWidth: 3 }, point: { radius: 6, backgroundColor: '#22c55e' } }
  };

  constructor(private employeeService: EmployeeServiceAPI, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        
        console.log('1. Raw API Data:', response); // Check console to see this

        // 1. Handle if API wraps data in { value: [] } or { result: [] }
        const rawData = Array.isArray(response) ? response : (response.value || response.result || []);

        // 2. SAFE MAPPING: Handle both "salary" (lowercase) and "Salary" (uppercase)
        const employees = rawData.map((e: any) => ({
          ...e,
          salary: e.salary || e.Salary || 0,
          department: e.department || e.Department || 'Unknown',
          hireDate: e.hireDate || e.HireDate || new Date(),
          fullName: e.fullName || e.FullName || 'No Name'
        }));

        console.log('2. Mapped Employees:', employees);

        // --- LOGIC START ---

        // Total
        this.totalEmployees = employees.length;

        // New This Month
        const now = new Date();
        this.newThisMonth = employees.filter((e: any) => {
          const hire = new Date(e.hireDate);
          return hire.getFullYear() === now.getFullYear() && hire.getMonth() === now.getMonth();
        }).length;

        // Avg Salary
        const totalSalary = employees.reduce((acc: number, e: any) => acc + (e.salary || 0), 0);
        this.avgSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;

        // Departments
        this.departments = Array.from(new Set(employees.map((e: any) => e.department)));
        this.departmentss = this.departments.length;

        // Recent Employees (Sort descending)
        this.recentEmployees = employees
          .slice()
          .sort((a: any, b: any) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
          .slice(0, 5);

        // --- CHARTS START ---

        // Bar Chart (Dept Counts)
        const deptCounts: Record<string, number> = {};
        employees.forEach((e: any) => {
          deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
        });

        this.barChartData = {
          labels: Object.keys(deptCounts),
          datasets: [{
            data: Object.values(deptCounts),
            label: 'Employees',
            backgroundColor: '#4fd1c5'
          }]
        };

        // Line Chart (Trend)
        const labels = this.getRecentMonths(6);
        const monthCounts: Record<string, number> = {};
        employees.forEach((e: any) => {
          const d = new Date(e.hireDate);
          const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
          if (labels.includes(label)) {
            monthCounts[label] = (monthCounts[label] || 0) + 1;
          }
        });

        this.lineChartData = {
          labels,
          datasets: [{
            data: labels.map(m => monthCounts[m] || 0),
            label: 'New Hires',
            backgroundColor: 'rgba(34,197,94,0.14)',
            borderColor: '#22c55e',
            fill: true,
            tension: 0.4
          }]
        };

        // --- CRITICAL FIX ---
        // Manually tell Angular to update the screen immediately
        this.cdr.detectChanges(); 
        console.log('3. View Updated');
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }

  getRecentMonths(numMonths: number): string[] {
    const labels = [];
    const d = new Date();
    for (let i = 0; i < numMonths; i++) {
      const date = new Date(d.getFullYear(), d.getMonth() - (numMonths - 1 - i), 1);
      labels.push(date.toLocaleString('en-US', { month: 'short', year: '2-digit' }));
    }
    return labels;
  }
}
import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, NgChartsModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
@Component({
  // ... same as before
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  newThisMonth = 0;
  avgSalary = 0;
  departmentss = 0;
  departments: string[] = [];
  recentEmployees: Employee[] = [];
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

  constructor(private employeeService: EmployeeServiceAPI) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(employees => {
      // Update stats
      this.totalEmployees = employees.length;
      const now = new Date();
      this.newThisMonth = employees.filter(e => {
        const hire = new Date(e.hireDate);
        return hire.getFullYear() === now.getFullYear() && hire.getMonth() === now.getMonth();
      }).length;
      this.avgSalary = Math.round(employees.reduce((acc, e) => acc + (e.salary || 0), 0) / (employees.length || 1));
      this.departments = Array.from(new Set(employees.map(e => e.department)));
      this.departmentss = this.departments.length;

      // Recent employees
      this.recentEmployees = employees
        .slice()
        .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
        .slice(0, 5);

      // Department counts
      const deptCounts: Record<string,number> = {};
      employees.forEach(e => {
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

      // New Hires Trend (last 6 months)
      const labels = this.getRecentMonths(6);
      const monthCounts: Record<string,number> = {};
      employees.forEach(e => {
        const d = new Date(e.hireDate);
        const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        monthCounts[label] = (monthCounts[label] || 0) + 1;
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


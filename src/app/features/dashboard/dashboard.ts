import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee } from '../employees/services/employee.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, NgChartsModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  totalEmployees = 45;
  newThisMonth = 0;
  avgSalary = 96129;
recentEmployees: any;
departmentss = 4;
departments: string[] = [];
barChartData: any;
lineChartData: any;
  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(employees => {
      this.recentEmployees = employees
        .slice()
        .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
        .slice(0, 5); 
         this.departments = Array.from(new Set(employees.map(e => e.department)));

    // For department bar chart
    this.employeeService.getDepartmentCounts().subscribe(deptCounts => {
      this.barChartData = {
        labels: Object.keys(deptCounts),
        datasets: [{
          data: Object.values(deptCounts),
          label: 'Employees',
          backgroundColor: '#4fd1c5'
        }]
      };
    });
  });

  // For new hires line chart (last 6 months)
  const labels = this.getRecentMonths(36); // e.g. ['Jun 25','Jul 25',...]
  this.employeeService.getMonthlyHireCounts(labels).subscribe(monthCounts => {
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

  barChartType = 'bar' as const;
  barChartOptions = { responsive: true, plugins: { legend: { display: false } } };

  lineChartType = 'line' as const;
  lineChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    elements: { line: { borderWidth: 3 }, point: { radius: 6, backgroundColor: '#22c55e' } }
  };

}

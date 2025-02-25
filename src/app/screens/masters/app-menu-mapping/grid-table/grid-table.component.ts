import { Component } from '@angular/core';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.scss'
})
export class GridTableComponent {
  tableData = [
    {
      appName: 'Net Sales Split System',
      menuName: 'Dashboard',
      status: 'Active',
      designation: 'Manager',
      level: 'L1',
      orderBy: 1,
      status2: 'Approved'
    },
    {
      appName: 'Inventory Management',
      menuName: 'Stock',
      status: 'Inactive',
      designation: 'Supervisor',
      level: 'L2',
      orderBy: 2,
      status2: 'Pending'
    },
    {
      appName: 'HR Portal',
      menuName: 'Employee Records',
      status: 'Active',
      designation: 'HR Admin',
      level: 'L3',
      orderBy: 3,
      status2: 'Approved'
    },
    {
      appName: 'Finance Tracker',
      menuName: 'Budget Reports',
      status: 'Active',
      designation: 'Finance Manager',
      level: 'L2',
      orderBy: 4,
      status2: 'Rejected'
    },
    {
      appName: 'CRM System',
      menuName: 'Leads',
      status: 'Inactive',
      designation: 'Sales Executive',
      level: 'L1',
      orderBy: 5,
      status2: 'Pending'
    },
    {
      appName: 'Project Management',
      menuName: 'Task Board',
      status: 'Active',
      designation: 'Project Lead',
      level: 'L2',
      orderBy: 6,
      status2: 'Approved'
    },
    {
      appName: 'E-commerce Platform',
      menuName: 'Orders',
      status: 'Active',
      designation: 'Store Manager',
      level: 'L3',
      orderBy: 7,
      status2: 'Approved'
    },
    {
      appName: 'Logistics System',
      menuName: 'Shipment Tracking',
      status: 'Inactive',
      designation: 'Logistics Coordinator',
      level: 'L1',
      orderBy: 8,
      status2: 'Pending'
    },
    {
      appName: 'Help Desk',
      menuName: 'Tickets',
      status: 'Active',
      designation: 'Support Engineer',
      level: 'L2',
      orderBy: 9,
      status2: 'Approved'
    },
    {
      appName: 'Training Management',
      menuName: 'Courses',
      status: 'Inactive',
      designation: 'Trainer',
      level: 'L1',
      orderBy: 10,
      status2: 'Rejected'
    }
  ];
  
}

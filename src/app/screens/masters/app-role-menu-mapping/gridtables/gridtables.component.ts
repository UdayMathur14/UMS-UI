import { Component } from '@angular/core';

@Component({
  selector: 'app-gridtables',
  templateUrl: './gridtables.component.html',
  styleUrl: './gridtables.component.scss',
})
export class GridtablesComponent {
  tableData = [
    {
      appName: 'Net Sales Split System',
      menuName: 'Dashboard',
      status: 'Active',
      designation: 'Manager',
      status2: 'Approved',
    },
    {
      appName: 'Inventory Management',
      menuName: 'Stock',
      status: 'Inactive',
      designation: 'Supervisor',
      status2: 'Pending',
    },
    {
      appName: 'HR Portal',
      menuName: 'Employee Records',
      status: 'Active',
      designation: 'HR Admin',
      status2: 'Approved',
    },
    {
      appName: 'Finance Tracker',
      menuName: 'Budget Reports',
      status: 'Active',
      designation: 'Finance Manager',
      status2: 'Rejected',
    },
    {
      appName: 'CRM System',
      menuName: 'Leads',
      status: 'Inactive',
      designation: 'Sales Executive',
      status2: 'Pending',
    },
    {
      appName: 'Project Management',
      menuName: 'Task Board',
      status: 'Active',
      designation: 'Project Lead',
      status2: 'Approved',
    },
    {
      appName: 'E-commerce Platform',
      menuName: 'Orders',
      status: 'Active',
      designation: 'Store Manager',
      status2: 'Approved',
    },
    {
      appName: 'Logistics System',
      menuName: 'Shipment Tracking',
      status: 'Inactive',
      designation: 'Logistics Coordinator',
      status2: 'Pending',
    },
    {
      appName: 'Help Desk',
      menuName: 'Tickets',
      status: 'Active',
      designation: 'Support Engineer',
      status2: 'Approved',
    },
    {
      appName: 'Training Management',
      menuName: 'Courses',
      status: 'Inactive',
      designation: 'Trainer',
      status2: 'Rejected',
    },
  ];
}

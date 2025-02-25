import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-menu-mapping',
  templateUrl: './app-menu-mapping.component.html',
  styleUrl: './app-menu-mapping.component.scss'
})
export class AppMenuMappingComponent {

  totalMenuUsers: number = 500; // Total number of users (example value)
  currentPage: number = 1; // Current active page
  count: number = 10; // Default items per page

  constructor( private router :Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Function to handle page change
  onPageChange(event: number): void {
    this.currentPage = event;
    this.fetchUsers();
  }

  // Function to handle items per page change
  onPageSizeChange(newPageSize: number): void {
    this.count = newPageSize;
    this.currentPage = 1; // Reset to first page
    this.fetchUsers();
  }

  // Fetch users based on pagination parameters (replace with actual API call)
  fetchUsers(): void {
    console.log(`Fetching users - Page: ${this.currentPage}, Items per page: ${this.count}`);
    // Add API call logic here if needed
  }

  onCreate(){
    this.router.navigate(['/masters/add-app-menu-mapping'])
  }

}

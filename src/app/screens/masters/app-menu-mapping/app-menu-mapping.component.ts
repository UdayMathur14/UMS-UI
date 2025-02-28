import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMenuMappingService } from '../../../core/service/app-menu-mapping.service';

@Component({
  selector: 'app-app-menu-mapping',
  templateUrl: './app-menu-mapping.component.html',
  styleUrl: './app-menu-mapping.component.scss',
})
export class AppMenuMappingComponent {
  loadSpinner: boolean = true;

  totalMenuUsers: number = 500; // Total number of users (example value)
  currentPage: number = 1; // Current active page
  count: number = 10; // Default items per page
  appliedFilters: any;
  userId: any = 1;
  appMenuMapping: any;
  filters: any;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private appMenuMappingService: AppMenuMappingService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.getAppMenuMapping();
  }

  getAppMenuMapping(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.status || '',
      menuName: filters?.menuName || '',
      appName: filters?.appName || '',
    };
    this.appMenuMappingService
      .appMenuMappingData(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.appMenuMapping = response.menus;
          this.totalPages = response.paging.total;
          this.filters = response.filters;
          this.loadSpinner = false;

          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getAppMenuMapping(0, this.count, this.appliedFilters);
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
    console.log(
      `Fetching users - Page: ${this.currentPage}, Items per page: ${this.count}`
    );
    // Add API call logic here if needed
  }

  onCreate() {
    this.router.navigate(['/masters/add-app-menu-mapping']);
  }
}

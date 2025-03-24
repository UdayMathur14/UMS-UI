import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-app-role-menu-mapping',
  templateUrl: './app-role-menu-mapping.component.html',
  styleUrl: './app-role-menu-mapping.component.scss',
})
export class AppRoleMenuMappingComponent {
  totalMenuUsers: number = 500;
  currentPage: number = 1;
  count: number = 10;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }
  onPageChange(event: number): void {
    this.currentPage = event;
    this.fetchUsers();
  }

  onPageSizeChange(newPageSize: number): void {
    this.count = newPageSize;
    this.currentPage = 1;
    this.fetchUsers();
  }

  fetchUsers(): void {
    console.log(
      `Fetching users - Page: ${this.currentPage}, Items per page: ${this.count}`
    );
  }

  onCreate() {
    this.router.navigate(['/masters/add-app-role-menu-mapping']);
  }
}

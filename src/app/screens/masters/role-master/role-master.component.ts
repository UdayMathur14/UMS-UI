import { Component, OnInit } from '@angular/core';
import { UserSignupStatusService } from '../../../core/service/user-signup-status.service';
import { RoleService } from '../../../core/service/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrl: './role-master.component.scss',
})
export class RoleMasterComponent {
  userId: string = '';
  loadSpinner: boolean = true;
  roleData: any = [];
  offset = 0;
  count: number = 10;
  totalRoles: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  currentPage: number = 1;
  showFilters: boolean = false;

  constructor(private roleService: RoleService, private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getRolesList();
  }

  getRolesList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.status || '',
      roleName: filters?.roleName || '',
    };
    this.roleService.roleData(this.userId, offset, count, data).subscribe(
      (response: any) => {
        this.roleData = response.roles;
        this.totalRoles = response.paging.total;
        this.filters = response.filters;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getRolesList(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getRolesList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getRolesList(0, this.count, this.appliedFilters);
  }

  onCreate() {
    this.router.navigate(['masters/add-role']);
  }
  
    toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}

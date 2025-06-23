import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleAppMenuMappingService } from '../../../core/service/role-app-menu-mapping.service';
@Component({
  selector: 'app-app-role-menu-mapping',
  templateUrl: './app-role-menu-mapping.component.html',
  styleUrl: './app-role-menu-mapping.component.scss',
})
export class AppRoleMenuMappingComponent {
    loadSpinner: boolean = true;
    currentPage: number = 1;
    count: number = 10;
    appliedFilters: any;
    userId: string = '';
    roleAppMenuMapping: any;
    filters: any;
    totalPages: number = 0;
    showFilters: boolean = false;
  
    constructor(
      private router: Router,
      private roleAppMenuMappingService : RoleAppMenuMappingService
    ) {}
  
    ngOnInit(): void {
      const data = localStorage.getItem('data');
      if (data) {
        const dataObj = JSON.parse(data);
        this.userId = dataObj.userId;
      }
      this.getRoleAppMenuMapping();
    }
  
    getRoleAppMenuMapping(
      offset: number = 0,
      count: number = this.count,
      filters: any = this.appliedFilters
    ) {
      this.loadSpinner = true;
      const data = {
        status: filters?.status || '',
        appName: filters?.appName || '',
        roleName: filters?.roleName || '',
        menuName: filters?.menuName || '',
      };
      this.roleAppMenuMappingService
        .roleAppMenuMappingData(offset, count, data)
        .subscribe(
          (response: any) => {
            this.roleAppMenuMapping = response.appRoleMenus;
            this.totalPages = response.paging.total;
            this.filters = response.filters;
            this.loadSpinner = false;
          },
          (error) => {
            console.log(error);
          }
        );
    }

    getData(e: any) {
      this.appliedFilters = e;
      this.currentPage = 1;
      this.getRoleAppMenuMapping(0, this.count, this.appliedFilters);
    }
  
    onPageChange(page: number) {
      this.currentPage = page;
      const offset = (this.currentPage - 1) * this.count;
      this.getRoleAppMenuMapping(offset, this.count, this.appliedFilters);
    }
  
    onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getRoleAppMenuMapping(0, this.count, this.appliedFilters);
    }
  
  
    onCreate() {
      this.router.navigate(['/masters/add-app-role-menu-mapping']);
    }

        toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleAppMenuMappingService } from '../../../core/service/role-app-menu-mapping.service';
import { AppRoleMenuMappingFilterComponent } from './filter/app-role-menu-mapping-filter.component';

@Component({
  selector: 'app-app-role-menu-mapping',
  templateUrl: './app-role-menu-mapping.component.html',
  styleUrl: './app-role-menu-mapping.component.scss',
})
export class AppRoleMenuMappingComponent implements OnInit {
  loadSpinner: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  userId: string = '';
  roleAppMenuMapping: any = [];
  filters: any = [];
  totalPages: number = 0;
  selectedFilters: any = {};

  constructor(
    private router: Router,
    private roleAppMenuMappingService: RoleAppMenuMappingService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    // Load saved filters from localStorage
    const savedFilters = localStorage.getItem('AppRoleMenuMappingFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getRoleAppMenuMapping();
  }

  getRoleAppMenuMapping(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters
  ) {
    this.loadSpinner = true;

    const data = {
      status: filters?.Status || '',
      appName: filters?.AppName || '',
      roleName: filters?.RoleName || '',
      menuName: filters?.MenuName || '',
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
          this.loadSpinner = false;
        }
      );
  }

  openFilterModal() {
    const modalRef = this.modalService.open(AppRoleMenuMappingFilterComponent, {
      backdrop: 'static',
      size: 'md'
    });

    modalRef.componentInstance.filterData = { ...this.selectedFilters };

    modalRef.result.then((result) => {
      if (result) {
        this.applyFilter(result);
      }
    }).catch(() => { });
  }

  applyFilter(filterData: any) {
    localStorage.setItem('AppRoleMenuMappingFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.currentPage = 1;
    this.getRoleAppMenuMapping();
  }

  hasFiltersApplied(): boolean {
    return Object.keys(this.selectedFilters).some(
      key => this.selectedFilters[key] !== '' && this.selectedFilters[key] !== null
    );
  }

  getFilterCount(): number {
    return Object.values(this.selectedFilters).filter(
      value => value !== '' && value !== null
    ).length;
  }

  clearFilters() {
    this.selectedFilters = {};
    this.currentPage = 1;
    this.getRoleAppMenuMapping();
    localStorage.removeItem('AppRoleMenuMappingFilters');
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getRoleAppMenuMapping(offset, this.count, this.selectedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getRoleAppMenuMapping(0, this.count, this.selectedFilters);
  }

  onCreate() {
    this.router.navigate(['/masters/add-app-role-menu-mapping']);
  }
}
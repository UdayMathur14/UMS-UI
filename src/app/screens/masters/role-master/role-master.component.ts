import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../../core/service/role.service';
import { RoleMasterFilterComponent } from './role-master-filter/role-master-filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrl: './role-master.component.scss',
})
export class RoleMasterComponent implements OnInit {
  userId: string = '';
  loadSpinner: boolean = false;
  roleData: any = [];
  offset = 0;
  count: number = 10;
  totalRoles: number = 0;
  filters: any = [];

  currentPage: number = 1;

  selectedFilters: any = {};

  constructor(
    private roleService: RoleService, 
    private router: Router, 
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    const savedFilters = localStorage.getItem('RoleMasterFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getRolesList();
  }

  // Fetch roles with pagination and filters
  getRolesList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters,
  ) {
    this.loadSpinner = true;

    const data = {
      roleName: filters?.RoleName || '',
      status: filters?.Status || '',
    };

    this.roleService
      .roleData(this.userId, offset, count, data)
      .subscribe(
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

  openFilterModal() {
    const modalRef = this.modalService.open(RoleMasterFilterComponent, {
      backdrop: 'static',
      size: 'md'
    });
    modalRef.componentInstance.filterData = { ...this.selectedFilters };
    modalRef.componentInstance.userId = this.userId;
    
    modalRef.result.then((result) => {
      if (result) {
        this.applyFilter(result);
      }
    }).catch(() => { });
  }

  applyFilter(filterData: any) {
    localStorage.setItem('RoleMasterFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.currentPage = 1;
    this.getRolesList();
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

  // Handle pagination change
  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getRolesList(offset, this.count, this.selectedFilters);
  }

  // Handle page size change
  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getRolesList(0, this.count, this.selectedFilters);
  }

  // Navigate to add role form
  onCreate() {
    this.router.navigate(['masters/add-role']);
  }

  clearFilters() {
    this.selectedFilters = {};
    this.currentPage = 1;
    this.getRolesList();
    localStorage.removeItem('RoleMasterFilters');
  }
}
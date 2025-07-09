import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RoleAppMenuMappingService } from '../../../../core/service/role-app-menu-mapping.service';

@Component({
  selector: 'app-role-menu-mapping-filter',
  templateUrl: './app-role-menu-mapping-filter.component.html',
  styleUrl: './app-role-menu-mapping-filter.component.scss'
})
export class AppRoleMenuMappingFilterComponent {
  @Input() filterData: any;
  loadSpinner: boolean = true;
  selectedFilter: string = 'AppName';

  userId: string = '';
  appName: any;
  menuName: any;
  roleName: any;
  status: any;

  filters = [
    { key: 'AppName', label: 'App Name' },
    { key: 'MenuName', label: 'Menu Name' },
    { key: 'RoleName', label: 'Role Name' },
    { key: 'Status', label: 'Status' },
  ];

  filterValues: any = {
    AppName: '',
    MenuName: '',
    RoleName: '',
    Status: '',
  };

  roleMenuFiltersData: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private roleAppMenuMappingService: RoleAppMenuMappingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    this.getRoleMenuFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getRoleMenuFilters() {
    this.loadSpinner = true;
    const data = {};
    const offset = 0;
    const count = 10;
    this.roleAppMenuMappingService
      .roleAppMenuMappingData(offset, count, data).subscribe({
        next: (response: any) => {
          this.roleMenuFiltersData = response?.filters || {};
        },
        error: (error) => {
          console.error('Error loading filters:', error);
        },
        complete: () => {
          this.loadSpinner = false;
        }
      });
  }

  getFilterOptions(key: string): string[] {
    return this.roleMenuFiltersData?.[key] || [];
  }

  selectFilter(key: string) {
    this.selectedFilter = key;
  }

  getFilterLabel(key: string): string {
    return this.filters.find(f => f.key === key)?.label || '';
  }

  applyFilter() {
    this.toastr.success('Filter applied successfully');
    this.activeModal.close(this.filterValues);
  }

  isAnyFilterSelected(): boolean {
    return Object.values(this.filterValues).some(
      value => value && value !== ''
    );
  }

  clearFilter(key: string) {
    this.filterValues[key] = '';
  }

  close() {
    this.activeModal.dismiss();
  }
}
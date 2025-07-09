import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../../../../core/service/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-master-filter',
  templateUrl: './role-master-filter.component.html',
  styleUrl: './role-master-filter.component.scss',
})
export class RoleMasterFilterComponent {
  @Input() filterData: any;
  @Input() userId: string = '';
  loadSpinner: boolean = true;
  selectedFilter: string = 'RoleName';

  filters = [
    { key: 'RoleName', label: 'Role Name' },
    { key: 'Status', label: 'Status' },
  ];

  filterValues: any = {
    RoleName: '',
    Status: '',
  };

  roleFiltersData: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private roleService: RoleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getRoleFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getRoleFilters() {
    this.loadSpinner = true;
    const data = {};
    const offset = 0;
    const count = 10;

    this.roleService
      .roleData(this.userId, offset, count, data).subscribe({
        next: (response: any) => {
          this.roleFiltersData = response?.filters || {};
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
    return this.roleFiltersData?.[key] || [];
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
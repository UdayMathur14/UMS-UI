import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSignupStatusService } from '../../../../core/service/user-signup-status.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-signup-status-filter',
  templateUrl: './user-signup-status-filter.component.html',
  styleUrl: './user-signup-status-filter.component.scss',
})
export class UserSignupStatusFilterComponent {
  @Input() filterData: any;
  @Input() userId: string = '';
  loadSpinner: boolean = true;
  selectedFilter: string = 'Name';

  filters = [
    { key: 'Name', label: 'Name' },
    { key: 'Organisation', label: 'Organisation' },
    { key: 'Status', label: 'Status' },
  ];

  filterValues: any = {
    Name: '',
    Organisation: '',
    Status: '',
  };

  userSignupFiltersData: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserSignupStatusService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserSignupFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getUserSignupFilters() {
    this.loadSpinner = true;
    const data = {
      name: '',
      organisation: '',
      status: '',
    };
    const offset = 0;
    const count = 10;
    this.userService
      .signupUserStatus(this.userId, offset, count, data).subscribe({
        next: (response: any) => {
          this.userSignupFiltersData = response?.filters || {};
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
    return this.userSignupFiltersData?.[key] || [];
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
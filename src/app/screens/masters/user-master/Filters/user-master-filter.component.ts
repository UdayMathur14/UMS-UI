import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserMasterService } from '../../../../core/service/user-master.service';

@Component({
  selector: 'app-user-master-filter',
  templateUrl: './user-master-filter.component.html',
  styleUrl: './user-master-filter.component.scss'
})
export class UserMasterFilterComponent {
  @Input() filterData: any;
  loadSpinner: boolean = false;
  selectedFilter: string = 'Name';

  userId: string = '';

  filters = [
    { key: 'Name', label: 'Name' },
    { key: 'Organisation', label: 'Organisation' },
    { key: 'Status', label: 'Status' },
    { key: 'UserCategory', label: 'User Category' },
    { key: 'UserType', label: 'User Type' },
    { key: 'EmailId', label: 'Email ID' },
  ];

  filterValues: any = {
    Name: '',
    Organisation: '',
    Status: '',
    UserCategory: '',
    UserType: '',
    EmailId: '',
  };

  userMasterFiltersData: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private userMasterService: UserMasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    this.getUserMasterFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getUserMasterFilters() {
    this.loadSpinner = true;
    const data = {};
    const offset = 0;
    const count = 10;
    this.userMasterService
      .userMasterData(this.userId, offset, count, data).subscribe({
        next: (response: any) => {
          this.userMasterFiltersData = response?.filters || {};
          this.loadSpinner = false;

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
    return this.userMasterFiltersData?.[key] || [];
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
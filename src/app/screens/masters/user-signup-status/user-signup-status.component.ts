import { Component, OnInit } from '@angular/core';
import { UserSignupStatusService } from '../../../core/service/user-signup-status.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSignupStatusFilterComponent } from './filter/user-signup-status-filter.component';

@Component({
  selector: 'app-user-signup-status',
  templateUrl: './user-signup-status.component.html',
  styleUrl: './user-signup-status.component.scss',
})
export class UserSignupStatusComponent implements OnInit {
  userId: string = '';
  loadSpinner: boolean = true;
  signupUsers: any = [];
  offset = 0;
  count: number = 10;
  totalSignupUsers: number = 0;
  filters: any = [];

  currentPage: number = 1;

  selectedFilters: any = {};

  constructor(
    private userService: UserSignupStatusService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    const savedFilters = localStorage.getItem('UserSignupStatusFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getSignUpUserList();
  }

  // Fetch user signup status with pagination and filters
  getSignUpUserList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters
  ) {
    this.loadSpinner = true;

    const data = {
      name: filters?.Name || '',
      organisation: filters?.Organisation || '',
      status: filters?.Status || '',
    };

    this.userService
      .signupUserStatus(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.signupUsers = response.signUpUserList;
          this.totalSignupUsers = response.paging.total;
          this.filters = response.filters;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  openFilterModal() {
    const modalRef = this.modalService.open(UserSignupStatusFilterComponent, {
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
    localStorage.setItem('UserSignupStatusFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.getSignUpUserList();
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
    this.getSignUpUserList(offset, this.count, this.selectedFilters);
  }

  // Handle page size change
  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getSignUpUserList(0, this.count, this.selectedFilters);
  }

  clearFilters() {
    this.selectedFilters = {};
    this.getSignUpUserList();
    localStorage.removeItem('UserSignupStatusFilters');
  }
}
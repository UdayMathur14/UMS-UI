import { Component, OnInit } from '@angular/core';
import { UserMasterService } from '../../../core/service/user-master.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserMasterFilterComponent } from './Filters/user-master-filter.component';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.scss',
})
export class UserMasterComponent implements OnInit {
  loadSpinner: boolean = true;

  count: number = 10;
  userId: string = '';
  userMaster: any;
  totalUsersMasters: number = 0;
  currentPage: number = 1;
  selectedFilters: any = {};
  filters: any = [];

  constructor(
    private userMasterService: UserMasterService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    // Load saved filters from localStorage
    const savedFilters = localStorage.getItem('UserMasterFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getUserMasterData();
  }

  getUserMasterData(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.Status || '',
      name: filters?.Name || '',
      emailId: filters?.EmailId || '',
      userType: filters?.UserType || '',
      userCategory: filters?.UserCategory || '',
      organisation: filters?.Organisation || '',
    };
    this.userMasterService
      .userMasterData(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.userMaster = response.users;
          this.totalUsersMasters = response.paging.total;
          this.filters = response.filters;
          this.loadSpinner = false;

          console.log(response);
        },
        (error) => {
          console.log(error);
          this.loadSpinner = false;
        }
      );
  }

  openFilterModal() {
    const modalRef = this.modalService.open(UserMasterFilterComponent, {
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
    localStorage.setItem('UserMasterFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.currentPage = 1;
    this.getUserMasterData(0, this.count, this.selectedFilters);
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
    localStorage.removeItem('UserMasterFilters');
    this.currentPage = 1;
    this.getUserMasterData(0, this.count, {});
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getUserMasterData(offset, this.count, this.selectedFilters);
  }

  onPageSizeChange(data: number) {
    this.count = data;
    this.currentPage = 1;
    this.getUserMasterData(0, this.count, this.selectedFilters);
  }
}
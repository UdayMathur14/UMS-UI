import { Component, OnInit } from '@angular/core';
import { UserSignupStatusService } from '../../../core/service/user-signup-status.service';

@Component({
  selector: 'app-user-signup-status',
  templateUrl: './user-signup-status.component.html',
  styleUrl: './user-signup-status.component.scss'
})
export class UserSignupStatusComponent implements OnInit {

  userId: any = 1;
  loadSpinner: boolean = true;
  signupUsers: any = [];
  offset = 0;
  count: number = 10;
  totalSignupUsers: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  currentPage: number = 1;

  constructor(private userService: UserSignupStatusService){}

  ngOnInit() {
    this.getSignUpUserList();
  }

  getSignUpUserList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    const data = {
      name: filters?.name || '',
      organisation: filters?.organisation || '',
      status: filters?.status || '',
    };
    this.userService.signupUserStatus(this.userId, offset, count, data).subscribe(
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

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getSignUpUserList(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getSignUpUserList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getSignUpUserList(0, this.count, this.appliedFilters);
  }
  
}

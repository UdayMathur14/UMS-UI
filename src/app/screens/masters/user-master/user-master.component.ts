import { Component, OnInit } from '@angular/core';
import { UserMasterService } from '../../../core/service/user-master.service';

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
  appliedFilters: any;
  fillters: any;

  constructor(private userMasterService: UserMasterService) {}
  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getUserMasterData();
  }

  getUserMasterData(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.status || '',
      name: filters?.name || '',
      emailId: filters?.emailId || '',
      userType: filters?.userType || '',
      userCategory: filters?.userCategory || '',
      organisation: filters?.organisation || '',
    };
    this.userMasterService
      .userMasterData(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.userMaster = response.users;
          this.totalUsersMasters = response.paging.total;
          this.fillters = response.filters;
          this.loadSpinner = false;

          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getUserMasterData(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getUserMasterData(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: number) {
    this.count = data;
    this.currentPage = 1;
    this.getUserMasterData(0, this.count, this.appliedFilters);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMenuMappingService } from '../../../core/service/app-menu-mapping.service';

@Component({
  selector: 'app-app-menu-mapping',
  templateUrl: './app-menu-mapping.component.html',
  styleUrl: './app-menu-mapping.component.scss',
})
export class AppMenuMappingComponent {
  loadSpinner: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  appliedFilters: any;
  userId: string = '';
  appMenuMapping: any;
  filters: any;
  totalPages: number = 0;
  showFilters: boolean = false;

  constructor(
    private router: Router,
    private appMenuMappingService: AppMenuMappingService
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getAppMenuMapping();
  }

  getAppMenuMapping(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.status || '',
      menuName: filters?.menuName || '',
      appName: filters?.appName || '',
    };
    this.appMenuMappingService
      .appMenuMappingData(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.appMenuMapping = response.menus;
          this.totalPages = response.paging.total;
          this.filters = response.filters;
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
    this.getAppMenuMapping(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAppMenuMapping(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getAppMenuMapping(0, this.count, this.appliedFilters);
  }


  onCreate() {
    this.router.navigate(['/masters/add-app-menu-mapping']);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}

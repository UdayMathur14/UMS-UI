import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppMenuMappingService } from '../../../core/service/app-menu-mapping.service';
import { FiltersComponent } from './filters/filters.component';

@Component({
  selector: 'app-app-menu-mapping',
  templateUrl: './app-menu-mapping.component.html',
  styleUrl: './app-menu-mapping.component.scss',
})
export class AppMenuMappingComponent {
  loadSpinner: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  userId: string = '';
  appMenuMapping: any;
  filters: any;
  totalPages: number = 0;
  selectedFilters: any = {};

  constructor(
    private router: Router,
    private appMenuMappingService: AppMenuMappingService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    // Load saved filters
    const savedFilters = localStorage.getItem('AppMenuMappingFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getAppMenuMapping();
  }

  getAppMenuMapping(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.Status || '',
      menuName: filters?.MenuName || '',
      appName: filters?.AppName || '',
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
          this.loadSpinner = false;
          console.log(error);
        }
      );
  }

  openFilterModal() {
    const modalRef = this.modalService.open(FiltersComponent, {
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
    localStorage.setItem('AppMenuMappingFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.currentPage = 1;
    this.getAppMenuMapping(0, this.count, this.selectedFilters);
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
    this.currentPage = 1;
    this.getAppMenuMapping(0, this.count, {});
    localStorage.removeItem('AppMenuMappingFilters');
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAppMenuMapping(offset, this.count, this.selectedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getAppMenuMapping(0, this.count, this.selectedFilters);
  }

  onCreate() {
    this.router.navigate(['/masters/add-app-menu-mapping']);
  }
}
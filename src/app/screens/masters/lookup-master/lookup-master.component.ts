import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../core/service/lookup.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupFilterComponent } from './lookup-filter/lookup-filter.component';

@Component({
  selector: 'app-lookup-master',
  templateUrl: './lookup-master.component.html',
  styleUrls: ['./lookup-master.component.scss']
})
export class LookupMasterComponent implements OnInit {
  userId: string = '';
  loadSpinner: boolean = false;
  lookups: any = [];
  offset = 0;
  count: number = 10;
  totalLookups: number = 0;
  filters: any = [];
  currentPage: number = 1;
  selectedFilters: any = {};

  constructor(
    private lookupService: LookupService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    // Load saved filters from localStorage
    const savedFilters = localStorage.getItem('LookupMasterFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getLookupsList();
  }

  getLookupsList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      type: filters?.Type || '',
      value: filters?.Value || '',
      status: filters?.Status || '',
    };
    this.lookupService
      .lookupData(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.lookups = response.lookUps;
          this.totalLookups = response.paging.total;
          this.filters = response.filters;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  openFilterModal() {
    const modalRef = this.modalService.open(LookupFilterComponent, {
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
    localStorage.setItem('LookupMasterFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.currentPage = 1;
    this.getLookupsList();
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
    this.getLookupsList();
    localStorage.removeItem('LookupMasterFilters');
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getLookupsList(offset, this.count, this.selectedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getLookupsList(0, this.count, this.selectedFilters);
  }

  onCreate() {
    this.router.navigate(['masters/add-lookup']);
  }
}
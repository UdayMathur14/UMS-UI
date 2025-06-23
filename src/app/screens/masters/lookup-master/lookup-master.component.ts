import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../core/service/lookup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lookup-master',
  templateUrl: './lookup-master.component.html',
  styleUrl: './lookup-master.component.scss',
})
export class LookupMasterComponent implements OnInit {
  userId: string = '';
  loadSpinner: boolean = true;
  lookups: any = [];
  offset = 0;
  count: number = 10;
  totalLookups: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  currentPage: number = 1;
  showFilters: boolean = false;

  constructor(private lookupService: LookupService, private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getLookupsList();
  }

  getLookupsList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    this.loadSpinner=true;
    const data = {
      type: filters?.type || '',
      value: filters?.value || '',
      status: filters?.status || '',
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

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getLookupsList(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getLookupsList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getLookupsList(0, this.count, this.appliedFilters);
  }

  onCreate(){
    this.router.navigate(['masters/add-lookup']);
  }
      toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}

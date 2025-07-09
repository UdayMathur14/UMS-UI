import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lookup-filter',
  templateUrl: './lookup-filter.component.html',
  styleUrl: './lookup-filter.component.scss',
})
export class LookupFilterComponent {
  @Input() filterData: any;
  loadSpinner: boolean = true;
  selectedFilter: string = 'Type';

  userId: string = '';
  lookupFiltersData: any = {};

  filters = [
    { key: 'Type', label: 'Type' },
    { key: 'Value', label: 'Value' },
    { key: 'Status', label: 'Status' },
  ];

  filterValues: any = {
    Type: '',
    Value: '',
    Status: '',
  };

  constructor(
    public activeModal: NgbActiveModal,
    private lookupService: LookupService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    this.getLookupFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getLookupFilters() {
    this.loadSpinner = true;
    this.lookupService.lookupData(this.userId, 0, 10, {}).subscribe({
      next: (response: any) => {
        this.lookupFiltersData = response?.filters || {};
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
    return this.lookupFiltersData?.[key] || [];
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
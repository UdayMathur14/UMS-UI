import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppMenuMappingService } from '../../../../core/service/app-menu-mapping.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  @Input() filterData: any;
  loadSpinner: boolean = true;
  selectedFilter: string = 'AppName';

  userId: string = '';

  filters = [
    { key: 'AppName', label: 'App Name' },
    { key: 'MenuName', label: 'Menu Name' },
    { key: 'Status', label: 'Status' },
  ];

  filterValues: any = {
    AppName: '',
    MenuName: '',
    Status: '',
  };

  appMenuMappingFiltersData: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private appMenuMappingService: AppMenuMappingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    this.getAppMenuMappingFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getAppMenuMappingFilters() {
    this.loadSpinner = true;
    const data = {};
    const offset = 0;
    const count = 10;

    this.appMenuMappingService
      .appMenuMappingData(this.userId, offset, count, data)
      .subscribe({
        next: (response: any) => {
          this.appMenuMappingFiltersData = response?.filters || {};
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
    return this.appMenuMappingFiltersData?.[key] || [];
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
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomainProjectMappingService } from '../../../../core/service/domain-project-mapping.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-domain-project-mapping-filters',
  templateUrl: './domain-project-mapping-filters.component.html',
  styleUrl: './domain-project-mapping-filters.component.scss',
})
export class DomainProjectMappingFiltersComponent implements OnInit {
  @Input() filterData: any;
  loadSpinner: boolean = true;
  selectedFilter: string = 'DomainName';
  userId: string = '';

  filters = [
    { key: 'DomainName', label: 'Domain Name' },
    { key: 'ProjectName', label: 'Project Name' },
    { key: 'Status', label: 'Status' },
  ];

  filterValues: any = {
    DomainName: '',
    ProjectName: '',
    Status: '',
  };

  domainProjectFiltersData: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private domainService: DomainProjectMappingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    this.getDomainProjectFilters();

    if (this.filterData) {
      this.filterValues = { ...this.filterValues, ...this.filterData };
    }
  }

  getDomainProjectFilters() {
    this.loadSpinner = true;
    const data = {
      status: '',
      projectName: '',
      domainName: '',
    };
    const offset = 0;
    const count = 10;

    this.domainService
      .projectDomainData(this.userId, offset, count, data)
      .subscribe({
        next: (response: any) => {
          this.domainProjectFiltersData = response?.filters || {};
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
    return this.domainProjectFiltersData?.[key] || [];
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
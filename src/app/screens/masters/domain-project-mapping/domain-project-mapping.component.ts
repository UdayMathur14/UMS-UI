import { Component } from '@angular/core';
import { DomainProjectMappingService } from '../../../core/service/domain-project-mapping.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomainProjectMappingFiltersComponent } from './filters/domain-project-mapping-filters.component';

@Component({
  selector: 'app-domain-project-mapping',
  templateUrl: './domain-project-mapping.component.html',
  styleUrl: './domain-project-mapping.component.scss'
})
export class DomainProjectMappingComponent {

  userId: string = '';
  loadSpinner: boolean = false;
  domainProjects: any = [];
  offset = 0;
  count: number = 10;
  totalDomainProject: number = 0;
  filters: any = [];
  currentPage: number = 1;
  selectedFilters: any = {};

  constructor(
    private domainService: DomainProjectMappingService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }

    const savedFilters = localStorage.getItem('DomainProjectMappingFilters');
    if (savedFilters) {
      this.selectedFilters = JSON.parse(savedFilters);
    }

    this.getdomainProjectList();
  }

  getdomainProjectList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.selectedFilters
  ) {
    this.loadSpinner = true;
    const data = {
      status: filters?.Status || '',
      projectName: filters?.ProjectName || '',
      domainName: filters?.DomainName || '',
    };
    this.domainService
      .projectDomainData(this.userId, offset, count, data)
      .subscribe(
        (response: any) => {
          this.domainProjects = response?.domainProjectMapping;
          this.totalDomainProject = response.paging.total;
          this.filters = response.filters;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  openFilterModal() {
    const modalRef = this.modalService.open(DomainProjectMappingFiltersComponent, {
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
    localStorage.setItem('DomainProjectMappingFilters', JSON.stringify(filterData));
    this.selectedFilters = filterData;
    this.currentPage = 1;
    this.getdomainProjectList(0, this.count, this.selectedFilters);
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

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getdomainProjectList(offset, this.count, this.selectedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getdomainProjectList(0, this.count, this.selectedFilters);
  }

  onCreate() {
    this.router.navigate(['masters/add-domain-project-mapping']);
  }

  clearFilters() {
    this.selectedFilters = {};
    this.currentPage = 1;
    this.getdomainProjectList(0, this.count, {});
    localStorage.removeItem('DomainProjectMappingFilters');
  }
}
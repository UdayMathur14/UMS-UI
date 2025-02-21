import { Component } from '@angular/core';
import { DomainProjectMappingService } from '../../../core/service/domain-project-mapping.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-domain-project-mapping',
  templateUrl: './domain-project-mapping.component.html',
  styleUrl: './domain-project-mapping.component.scss'
})
export class DomainProjectMappingComponent {

  userId: string = '';
  loadSpinner: boolean = true;
  domainProjects: any = [];
  offset = 0;
  count: number = 10;
  totalDomainProject: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  currentPage: number = 1;

  constructor(private domainService: DomainProjectMappingService, private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getdomainProjectList();
  }

  getdomainProjectList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    const data = {
      status: filters?.status || '',
      projectName: filters?.projectName || '',
      domainName: filters?.domainName || '',
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

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getdomainProjectList(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getdomainProjectList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getdomainProjectList(0, this.count, this.appliedFilters);
  }

  onCreate(){
    this.router.navigate(['masters/add-domain-project-mapping']);
  }

}

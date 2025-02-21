import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-domain-project-mapping-filters',
  templateUrl: './domain-project-mapping-filters.component.html',
  styleUrl: './domain-project-mapping-filters.component.scss',
})
export class DomainProjectMappingFiltersComponent {
  @Input() filters: any;
  domainName: any;
  projectName: any;
  status: any;
  @Output() getData: EventEmitter<object> = new EventEmitter();

  onSearch() {
    let obj = {
      domainName: this.domainName || '',
      status: this.status || '',
      projectName: this.projectName || '',
    };
    this.getData.emit(obj);
  }

  onClearFilter() {
    this.domainName = undefined;
    this.status = undefined;
    this.projectName = undefined;
    let obj = {
      domainName: undefined,
      status: undefined,
      projectName: undefined,
    };

    this.getData.emit(obj);
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-domain-project-mapping-grid-table',
  templateUrl: './domain-project-mapping-grid-table.component.html',
  styleUrl: './domain-project-mapping-grid-table.component.scss'
})
export class DomainProjectMappingGridTableComponent {

  @Input() domainProjects: any;

}

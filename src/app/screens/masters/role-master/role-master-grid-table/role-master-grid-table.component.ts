import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-role-master-grid-table',
  templateUrl: './role-master-grid-table.component.html',
  styleUrl: './role-master-grid-table.component.scss',
})
export class RoleMasterGridTableComponent {
  @Input() roleData: any;
}

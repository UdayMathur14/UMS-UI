import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-master-grid-table',
  templateUrl: './user-master-grid-table.component.html',
  styleUrl: './user-master-grid-table.component.scss',
})
export class UserMasterGridTableComponent {
  @Input() userMaster: any;
}

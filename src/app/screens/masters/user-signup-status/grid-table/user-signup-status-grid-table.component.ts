import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-signup-status-grid-table',
  templateUrl: './user-signup-status-grid-table.component.html',
  styleUrl: './user-signup-status-grid-table.component.scss'
})
export class UserSignupStatusGridTableComponent {

  @Input() signupUsers: any;

}

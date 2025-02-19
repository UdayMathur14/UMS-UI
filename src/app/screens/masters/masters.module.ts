import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { UserSignupStatusComponent } from './user-signup-status/user-signup-status.component';
import { UserSignupStatusGridTableComponent } from './user-signup-status/grid-table/user-signup-status-grid-table.component';
import { EditUserSignupStatusComponent } from './user-signup-status/edit-user-signup-status/edit-user-signup-status.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSignupStatusFilterComponent } from './user-signup-status/filter/user-signup-status-filter.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalModalComponent } from './user-signup-status/approval-modal/approval-modal.component';
@NgModule({
  declarations: [
    UserSignupStatusComponent,
    UserSignupStatusGridTableComponent,
    EditUserSignupStatusComponent,
    UserSignupStatusFilterComponent,
    ApprovalModalComponent,
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbModule
  ]
})
export class MastersModule { }

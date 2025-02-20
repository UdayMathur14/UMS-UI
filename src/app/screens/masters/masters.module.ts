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
import { LookupMasterComponent } from './lookup-master/lookup-master.component';
import { LookupFilterComponent } from './lookup-master/lookup-filter/lookup-filter.component';
import { LookupGridTableComponent } from './lookup-master/lookup-grid-table/lookup-grid-table.component';
import { AddEditLookupComponent } from './lookup-master/add-edit-lookup/add-edit-lookup.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { RoleMasterGridTableComponent } from './role-master/role-master-grid-table/role-master-grid-table.component';
import { AddEditRoleMasterComponent } from './role-master/add-edit-role-master/add-edit-role-master.component';
import { RoleMasterFilterComponent } from './role-master/role-master-filter/role-master-filter.component';
@NgModule({
  declarations: [
    UserSignupStatusComponent,
    UserSignupStatusGridTableComponent,
    EditUserSignupStatusComponent,
    UserSignupStatusFilterComponent,
    ApprovalModalComponent,
    LookupMasterComponent,
    LookupFilterComponent,
    LookupGridTableComponent,
    AddEditLookupComponent,
    RoleMasterComponent,
    RoleMasterGridTableComponent,
    AddEditRoleMasterComponent,
    RoleMasterFilterComponent,
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbModule,
  ],
})
export class MastersModule {}

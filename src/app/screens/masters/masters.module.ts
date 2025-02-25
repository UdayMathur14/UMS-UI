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
import { UserMasterComponent } from './user-master/user-master.component';
import { UserMasterGridTableComponent } from './user-master/grid-table/user-master-grid-table/user-master-grid-table.component';
import { AddEditUserComponent } from './user-master/add-edit-user/add-edit-user.component';
import { UserMasterFilterComponent } from './user-master/Filters/user-master-filter.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { RoleMasterGridTableComponent } from './role-master/role-master-grid-table/role-master-grid-table.component';
import { AddEditRoleMasterComponent } from './role-master/add-edit-role-master/add-edit-role-master.component';
import { RoleMasterFilterComponent } from './role-master/role-master-filter/role-master-filter.component';
import { DomainProjectMappingComponent } from './domain-project-mapping/domain-project-mapping.component';
import { DomainProjectMappingGridTableComponent } from './domain-project-mapping/grid-table/domain-project-mapping-grid-table.component';
import { DomainProjectMappingFiltersComponent } from './domain-project-mapping/filters/domain-project-mapping-filters.component';
import { AddEditDomainProjectMappingComponent } from './domain-project-mapping/add-edit-domain-project-mapping/add-edit-domain-project-mapping.component';
import { AppMenuMappingComponent } from './app-menu-mapping/app-menu-mapping.component';
import { AddEditAppMenuMappingComponent } from './app-menu-mapping/add-edit-app-menu-mapping/add-edit-app-menu-mapping.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoleMenuMappingComponent } from './app-role-menu-mapping/app-role-menu-mapping.component';
import { FiltersComponent } from './app-menu-mapping/filters/filters.component';
import { AppEditRoleMenuComponent } from './app-role-menu-mapping/app-edit-role-menu/app-edit-role-menu.component';
import { FilterComponent } from './app-role-menu-mapping/filter/filter.component';
import { GridtablesComponent } from './app-role-menu-mapping/gridtables/gridtables.component';
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
    UserMasterComponent,
    UserMasterGridTableComponent,
    AddEditUserComponent,
    UserMasterFilterComponent,
    RoleMasterComponent,
    RoleMasterGridTableComponent,
    AddEditRoleMasterComponent,
    RoleMasterFilterComponent,
    DomainProjectMappingComponent,
    DomainProjectMappingGridTableComponent,
    DomainProjectMappingFiltersComponent,
    AddEditDomainProjectMappingComponent,
    AppMenuMappingComponent,
    AddEditAppMenuMappingComponent,
    AppRoleMenuMappingComponent,
    FiltersComponent,
    AppEditRoleMenuComponent,
    FilterComponent,
    GridtablesComponent,
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbModule,
    NgMultiSelectDropDownModule,
  ],
})
export class MastersModule {}

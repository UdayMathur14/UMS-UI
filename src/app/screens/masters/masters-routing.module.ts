import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignupStatusComponent } from './user-signup-status/user-signup-status.component';
import { EditUserSignupStatusComponent } from './user-signup-status/edit-user-signup-status/edit-user-signup-status.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LookupMasterComponent } from './lookup-master/lookup-master.component';
import { AddEditLookupComponent } from './lookup-master/add-edit-lookup/add-edit-lookup.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { AddEditUserComponent } from './user-master/add-edit-user/add-edit-user.component';
import { RoleMasterGridTableComponent } from './role-master/role-master-grid-table/role-master-grid-table.component';
import { AddEditRoleMasterComponent } from './role-master/add-edit-role-master/add-edit-role-master.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { DomainProjectMappingComponent } from './domain-project-mapping/domain-project-mapping.component';
import { AddEditDomainProjectMappingComponent } from './domain-project-mapping/add-edit-domain-project-mapping/add-edit-domain-project-mapping.component';
import { AppMenuMappingComponent } from './app-menu-mapping/app-menu-mapping.component';
import { AddEditAppMenuMappingComponent } from './app-menu-mapping/add-edit-app-menu-mapping/add-edit-app-menu-mapping.component';
import { AppRoleMenuMappingComponent } from './app-role-menu-mapping/app-role-menu-mapping.component';
import { AppEditRoleMenuComponent } from './app-role-menu-mapping/app-edit-role-menu/app-edit-role-menu.component';

const routes: Routes = [
  {
    path: 'user-signup-status',
    component: UserSignupStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-user-signup-status/:id',
    component: EditUserSignupStatusComponent,
  },
  {
    path: 'lookup-master',
    component: LookupMasterComponent,
  },
  {
    path: 'edit-lookup/:id',
    component: AddEditLookupComponent,
  },
  {
    path: 'add-lookup',
    component: AddEditLookupComponent,
  },
  {
    path: 'user-master',
    component: UserMasterComponent,
  },
  {
    path: 'add-user-master',
    component: AddEditUserComponent,
  },
  {
    path: 'edit-user-master/:id',
    component: AddEditUserComponent,
  },
  {
    path: 'role-master',
    component: RoleMasterComponent,
  },
  {
    path: 'edit-role/:id',
    component: AddEditRoleMasterComponent,
  },
  {
    path: 'add-role',
    component: AddEditRoleMasterComponent,
  },
  {
    path: 'domain-project-mapping',
    component: DomainProjectMappingComponent,
  },
  {
    path: 'edit-domain-project-mapping/:id',
    component: AddEditDomainProjectMappingComponent,
  },
  {
    path: 'add-domain-project-mapping',
    component: AddEditDomainProjectMappingComponent,
  },
  {
    path: 'app-menu-mapping',
    component: AppMenuMappingComponent,
  },
  {
    path: 'add-app-menu-mapping',
    component: AddEditAppMenuMappingComponent,
  },
  {
    path: 'app-role-menu-mapping',
    component: AppRoleMenuMappingComponent,
  },
  {
    path: 'add-app-role-menu-mapping',
    component: AppEditRoleMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}

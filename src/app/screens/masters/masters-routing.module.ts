import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignupStatusComponent } from './user-signup-status/user-signup-status.component';
import { EditUserSignupStatusComponent } from './user-signup-status/edit-user-signup-status/edit-user-signup-status.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LookupMasterComponent } from './lookup-master/lookup-master.component';
import { AddEditLookupComponent } from './lookup-master/add-edit-lookup/add-edit-lookup.component';
import { RoleMasterGridTableComponent } from './role-master/role-master-grid-table/role-master-grid-table.component';
import { AddEditRoleMasterComponent } from './role-master/add-edit-role-master/add-edit-role-master.component';
import { RoleMasterComponent } from './role-master/role-master.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}

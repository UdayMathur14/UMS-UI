import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignupStatusComponent } from './user-signup-status/user-signup-status.component';
import { EditUserSignupStatusComponent } from './user-signup-status/edit-user-signup-status/edit-user-signup-status.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LookupMasterComponent } from './lookup-master/lookup-master.component';
import { AddEditLookupComponent } from './lookup-master/add-edit-lookup/add-edit-lookup.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { AddEditUserComponent } from './user-master/add-edit-user/add-edit-user.component';

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
  { path: 'lookup-master', component: LookupMasterComponent },
  {
    path: 'add-edit-lookup/:id',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}

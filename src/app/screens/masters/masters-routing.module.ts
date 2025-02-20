import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignupStatusComponent } from './user-signup-status/user-signup-status.component';
import { EditUserSignupStatusComponent } from './user-signup-status/edit-user-signup-status/edit-user-signup-status.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [{path: 'user-signup-status', component: UserSignupStatusComponent, canActivate: [AuthGuard]},
  {path: 'edit-user-signup-status/:id', component: EditUserSignupStatusComponent}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }

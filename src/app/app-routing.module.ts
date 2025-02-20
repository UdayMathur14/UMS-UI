import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./screens/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      { path: 'masters', loadChildren: () => import('./screens/masters/masters.module').then(m => m.MastersModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

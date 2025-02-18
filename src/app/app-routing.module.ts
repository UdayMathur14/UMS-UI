import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./screens/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
      // { path: '', loadChildren: () => import('./screens/demo.module').then(m => m.demoModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

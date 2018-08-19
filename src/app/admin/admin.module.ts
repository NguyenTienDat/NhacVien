import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../authentic/_guards/auth.guard';

import { AdminService } from './services/admin.service';
import { AdminComponent } from './admin.component';
import { SharedUiService } from '../shared/shared-ui.service';

import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule
} from '@angular/material';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: 'src/app/admin/components/dashboard/dashboard.module#DashboardModule' },
      { path: '**', redirectTo: '/page-not-found' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(adminRoutes),
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [AdminService, SharedUiService]
})

export class AdminModule { }

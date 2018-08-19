import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../authentic/_guards/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DxDataGridModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxChartModule,
  DxLoadPanelModule,
  DxPieChartModule
} from 'devextreme-angular';

const imports = [
  DxDataGridModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxChartModule,
  DxPieChartModule,
  DxLoadPanelModule,
  NgbModule
];

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    imports,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }

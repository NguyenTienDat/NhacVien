import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../authentic/_guards/auth.guard';
import { MatToolbarModule, MatButtonModule, MatSidenavModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminService } from './services/admin.service';
import { AdminComponent } from './admin.component';
import { ClassroomComponent } from './components/classroom/classroom.component';
import { ExamComponent } from './components/exam/exam.component';
import { SchedualeComponent } from './components/scheduale/scheduale.component';
import { StudentComponent } from './components/student/student.component';
import { CourseNewComponent } from './components/course-new/course-new.component';

import {
  DxDataGridModule,
  DxButtonModule,
  DxPopupModule,
  DxPopoverModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxSelectBoxModule,
  DxSchedulerModule
} from 'devextreme-angular';

const dxImports = [
  DxDataGridModule,
  DxButtonModule,
  DxPopupModule,
  DxPopoverModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxSelectBoxModule,
  DxSchedulerModule
];

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'course' },
      // { path: 'dashboard', loadChildren: 'src/app/admin/components/dashboard/dashboard.module#DashboardModule' },
      { path: 'course', component: CourseNewComponent },
      { path: 'class', component: ClassroomComponent },
      { path: 'student', component: StudentComponent },
      { path: 'scheduale', component: SchedualeComponent },
      { path: 'exam', component: ExamComponent },
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
    MatSidenavModule,
    dxImports,
    NgbModule
  ],
  declarations: [
    AdminComponent,
    CourseNewComponent,
    ClassroomComponent,
    StudentComponent,
    SchedualeComponent,
    ExamComponent
  ],
  providers: [AdminService]
})

export class AdminModule { }

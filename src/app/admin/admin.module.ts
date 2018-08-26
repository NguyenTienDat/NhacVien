import { StudentComponent } from './components/student/student.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../authentic/_guards/auth.guard';
import { MatToolbarModule, MatButtonModule, MatSidenavModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminService } from './services/admin.service';
import { AdminComponent } from './admin.component';
import { CourseComponent } from './components/course/course.component';
import { ClassroomComponent } from './components/classroom/classroom.component';
import { ExamComponent } from './components/exam/exam.component';
import { SharedUiService } from '../shared/shared-ui.service';

import {
  DxDataGridModule,
  DxButtonModule,
  DxPopupModule,
  DxPopoverModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxSelectBoxModule
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
  DxSelectBoxModule
];

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'course' },
      // { path: 'dashboard', loadChildren: 'src/app/admin/components/dashboard/dashboard.module#DashboardModule' },
      { path: 'course', component: CourseComponent },
      { path: 'class', component: ClassroomComponent },
      { path: 'student', component: StudentComponent },
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
    CourseComponent,
    ClassroomComponent,
    StudentComponent,
    ExamComponent
  ],
  providers: [AdminService, SharedUiService]
})

export class AdminModule { }

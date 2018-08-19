import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './_directives/alert.component';
import { LoginComponent } from './login/login.component';
import { SharedService } from '../shared/shared.service';
import { AlertService } from './_services/alert.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    AlertComponent,
    LoginComponent
  ],
  providers: [AlertService, SharedService]
})

export class AuthenticModule { }

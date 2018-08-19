import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const homeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    FormsModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }

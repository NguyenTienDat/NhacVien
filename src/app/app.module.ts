import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticModule } from './authentic/authentic.module';
import { JwtInterceptor } from './authentic/_helpers/jwt.interceptor';
import { LoginComponent } from './authentic/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthGuard } from './authentic/_guards/auth.guard';
import { AuthenticationService } from './authentic/_services/authentication.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'page-not-found', component: NotFoundComponent },
  { path: 'admin', loadChildren: 'src/app/admin/admin.module#AdminModule' },
  { path: 'home', loadChildren: 'src/app/home/home.module#HomeModule' },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    NoopAnimationsModule
  ],
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/admin';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        res => {
          if (res && res.data) {
            localStorage.setItem('token', res.data);
          }
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error('Invalid username or password.');
          this.model.password = '';
          this.loading = false;
        },
        () => setTimeout(() => this.loading = false, 2000)
      );
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
          // tslint:disable-next-line:max-line-length
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'token': token
        }
      });
      return next.handle(request);
    }
    // Nếu không phải api login mà không có token thì đưa về trang login
    if (!request.url.toString().includes('login')) {
      this.router.navigate(['/login']);
    }
    return next.handle(request);
  }
}

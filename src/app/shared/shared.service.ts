import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';

@Injectable()
export class SharedService {

  protected BASE_URL = 'loca';

  constructor(private http: HttpClient) { }

  public currentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  protected get(url: string, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.get(url, httpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }

  protected post(url: string, body: any, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.post(url, body, httpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }

  protected put(url: string, body: any, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.put(url, body, httpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }

  protected delete(url: string, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.delete(url, httpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }
  /**
   * Bắt lỗi BE trả về lỗi
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error && error.error.status && error.error.status === 'required auth') {
      this.doLogout();
    }
    return observableThrowError(error);
  }

  doLogout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.get(this.BASE_URL + 'login-service/logout').subscribe();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';

@Injectable()
export class SharedService {

  protected BASE_URL = 'http://localhost/indieteq-php-my-sql-pdo-database-class/api/';
  // protected BASE_URL = 'https://restful-nhacvien.000webhostapp.com/server/api/';

  constructor(private http: HttpClient) { }

  public currentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  protected get(url: string, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.get(url, httpOptions)
      .pipe(
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }

  protected post(url: string, body: any, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.post(url, body, httpOptions)
      .pipe(
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }

  protected put(url: string, body: any, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.put(url, body, httpOptions)
      .pipe(
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }

  protected delete(url: string, params?: HttpParams): Observable<any> {
    const httpOptions = { params: params };
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError((e) => this.handleError(e)) // then handle the error
      );
  }
  /**
   * Bắt lỗi BE trả về lỗi
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error && error.error.message && (error.error.message + '').toUpperCase().includes('TOKEN') || error.status === 401) {
      this.doLogout();
    }
    return observableThrowError(error);
  }

  doLogout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.get(this.BASE_URL + 'login.php').subscribe();
  }
}

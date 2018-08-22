import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

@Injectable()
export class AdminService extends SharedService {
  /**
  * ============================================================================================
  * Course
  * ============================================================================================
  */
  public getListCourse(): Observable<any> {
    return this.get(this.BASE_URL + 'course/');
  }
}

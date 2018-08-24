import { CourseModel } from './admin.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

export interface CourseModel {
  id?: number;
  name?: string;
  cost?: number;
  description?: string;
}

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

  public editCourse(id, course: CourseModel): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.post(this.BASE_URL + 'course/', course, params);
  }

  public addCourse(course: CourseModel): Observable<any> {
    return this.post(this.BASE_URL + 'course/', course);
  }

  public deleteCourse(id): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    params = params.append('type', 'delete');
    return this.get(this.BASE_URL + 'course/', params);
  }
}

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel, ClassModel } from './admin.service';
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

  /**
  * ============================================================================================
  * Class
  * ============================================================================================
  */
  public getListClass(): Observable<any> {
    return this.get(this.BASE_URL + 'class/');
  }

  public editClass(id, classModel: ClassModel): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.post(this.BASE_URL + 'class/', classModel, params);
  }

  public addClass(classModel: ClassModel): Observable<any> {
    return this.post(this.BASE_URL + 'class/', classModel);
  }

  public deleteClass(id): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    params = params.append('type', 'delete');
    return this.get(this.BASE_URL + 'class/', params);
  }

  /**
  * ============================================================================================
  * Student
  * ============================================================================================
  */
  public getListStudent(): Observable<any> {
    return this.get(this.BASE_URL + 'student/');
  }

  public editStudent(id, objectModel: StudentModel): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.post(this.BASE_URL + 'student/', objectModel, params);
  }

  public addStudent(classModel: StudentModel): Observable<any> {
    return this.post(this.BASE_URL + 'student/', classModel);
  }

  public deleteStudent(id): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    params = params.append('type', 'delete');
    return this.get(this.BASE_URL + 'student/', params);
  }
}

export interface CourseModel {
  id?: number;
  name?: string;
  cost?: number;
  description?: string;
}

export interface ClassModel {
  id?: number;
  course_id_ref?: number;
  name?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface StudentModel {
  id?: number;
  name?: string;
  birthday?: Date;
  phone?: string;
  email?: string;
  start_date?: Date;
  new_month_date?: Date;
  payment_date?: Date;
  description?: string;
}

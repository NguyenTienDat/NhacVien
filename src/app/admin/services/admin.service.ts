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
  public getListCourse(isParents?): Observable<any> {
    let params: HttpParams = new HttpParams();
    if (isParents) {
      params = params.append('type', 'parents');
    }
    return this.get(this.BASE_URL + 'course/', isParents ? params : null);
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

  /**
  * ============================================================================================
  * Student_Class
  * ============================================================================================
  */
  public getListStudentClass(class_id): Observable<any> {
    let params = new HttpParams();
    params = params.append('class_id', class_id);
    return this.get(this.BASE_URL + 'student_class/', params);
  }

  public saveStudentClass(class_id, student_ids_remove, student_ids_add): Observable<any> {
    const body = {
      class_id: class_id,
      student_ids_add: student_ids_add,
      student_ids_remove: student_ids_remove
    };
    return this.post(this.BASE_URL + 'student_class/', body);
  }

/**
  * ============================================================================================
  * Scheduale_Class
  * ============================================================================================
  */
  getAppointment(classId?) {
    let params: HttpParams = new HttpParams();
    params = params.append('id_ref', classId);
    return this.get(this.BASE_URL + 'scheduale/', classId ? params : null);
  }

  deleteAppointment(id) {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    params = params.append('type', 'delete');
    return this.get(this.BASE_URL + 'scheduale/', params);
  }

  updateAppointment(id, appointment: Appointment) {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.post(this.BASE_URL + 'scheduale/', appointment, params);
  }

  addAppointment(appointment: Appointment) {
    return this.post(this.BASE_URL + 'scheduale/', appointment);
  }
}

export interface CourseModel {
  id?: number;
  name?: string;
  cost?: number;
  description?: string;
  course_id_ref?: number;
  start_date?: Date;

  // parents
  parents_name?: string;
  parents_cost?: number;
  parents_description?: string;
  parents_start_date?: Date;
}

export interface ClassModel {
  id?: number;
  course_id_ref?: number;
  name?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  color?: string;
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

export interface Appointment {
  id?: number;
  id_ref?: number;
  allDay?: boolean | number;
  startDate?: Date;
  endDate?: Date;
  text?: string;
  description?: string;
  recurrenceRule?: string;
}

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
  getEmployees() {
    return employees;
  }
  getData() {
      return data;
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

export class Employee {
  text: string;
  id: number;
  color: string;
  avatar: string;
age: number;
discipline: string;
}

export class Data {
  text: string;
  employeeID: number;
  startDate: Date;
  endDate: Date;
}


const employees: Employee[] = [{
  text : 'John Heart',
  id: 1,
  color: '#56ca85',
  avatar: 'images/gym/coach-man.png',
  age: 27,
  discipline: 'ABS, Fitball, StepFit'
}, {
  text : 'Sandra Johnson',
  id: 2,
  color: '#ff9747',
  avatar: 'images/gym/coach-woman.png',
  age: 25,
  discipline: 'ABS, Fitball, StepFit'
},
{
  text : 'Sandra Johnson',
  id: 3,
  color: '#ff9747',
  avatar: 'images/gym/coach-woman.png',
  age: 25,
  discipline: 'ABS, Fitball, StepFit'
}];

const data: Data[] = [{
      text: 'Helen',
      employeeID: 2,
      startDate: new Date(2016, 7, 2, 9, 30),
      endDate: new Date(2016, 7, 2, 11, 30)
  }, {
      text: 'Helen',
      employeeID: 2,
     startDate: new Date(2016, 7, 11, 9, 30),
      endDate: new Date(2016, 7, 12, 11, 30)
  }, {
      text: 'Alex',
      employeeID: 1,
      startDate: new Date(2016, 7, 3, 9, 30),
      endDate: new Date(2016, 7, 3, 11, 30)
  }, {
      text: 'Alex',
      employeeID: 1,
      startDate: new Date(2016, 7, 12, 12, 0),
      endDate: new Date(2016, 7, 12, 13, 0)
  }, {
      text: 'Alex',
      employeeID: 2,
      startDate: new Date(2016, 7, 17, 9, 30),
      endDate: new Date(2016, 7, 17, 11, 30)
  }, {
      text: 'Stan',
      employeeID: 1,
      startDate: new Date(2016, 7, 8, 9, 30),
      endDate: new Date(2016, 7, 8, 11, 30)
  }, {
      text: 'Stan',
      employeeID: 1,
      startDate: new Date(2016, 7, 29, 9, 30),
      endDate: new Date(2016, 7, 29, 11, 30)
  }, {
      text: 'Stan',
      employeeID: 1,
      startDate: new Date(2016, 7, 31, 9, 30),
      endDate: new Date(2016, 7, 31, 11, 30)
  },
   {
      text: 'Rachel',
      employeeID: 2,
      startDate: new Date(2016, 7, 5, 9, 30),
      endDate: new Date(2016, 7, 5, 11, 30)
  }, {
      text: 'Rachel',
      employeeID: 2,
      startDate: new Date(2016, 7, 8, 9, 30),
      endDate: new Date(2016, 7, 8, 11, 30)
  }, {
      text: 'Rachel',
      employeeID: 1,
      startDate: new Date(2016, 7, 22, 9, 30),
      endDate: new Date(2016, 7, 22, 11, 30)
  }, {
      text: 'Kelly',
      employeeID: 2,
      startDate: new Date(2016, 7, 16, 9, 30),
      endDate: new Date(2016, 7, 16, 11, 30)
  }, {
      text: 'Kelly',
      employeeID: 2,
      startDate: new Date(2016, 7, 30, 9, 30),
      endDate: new Date(2016, 7, 30, 11, 30)
  }];

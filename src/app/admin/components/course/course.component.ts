import { Component, OnInit } from '@angular/core';
import { Subject, Observable, empty, BehaviorSubject } from 'rxjs';

import { AdminService, CourseModel } from '../../services/admin.service';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';
import { debounceTime, map, takeWhile, switchMap, share, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  private listItems: CourseModel[] = [];
  public listItemsDisplay: CourseModel[] = [];
  public isPopupCourseVisible = false;
  public selectedCourse: CourseModel;
  public isEditMode = false;

  private searchSubscriber = new Subject<any>();
  private pageAlive = true;
  private strSearch = '';
  private TIME_OUT = 1000;

  constructor(
    private adminService: AdminService,
    private sharedUiService: SharedUiService
  ) { }

  ngOnInit() {
    this.searchSubscriber.pipe(
      debounceTime(300),
      map(searchStr => {
        this.strSearch = searchStr;
        return { searchStr: searchStr };
      })).pipe(
        startWith({searchStr: ''}),
        switchMap((params: { searchStr: string }) => {
          this.filter(params.searchStr);
          return empty();
        }),
      ).subscribe();
  }

  private filter(searchStr: string, refresh = false) {
    console.log('filter', searchStr, refresh);
    if (!searchStr || searchStr.trim() === '' || refresh) {
      this.adminService.getListCourse().subscribe(res => {
        this.listItems = (res && res.message === 'success' ? res.data : []);
        this.listItemsDisplay = this.listItems.slice(0);
        if (refresh) {
          this.filter(searchStr);
        }
      }, err => {
        console.log(err);
        this.sharedUiService.showToast('Có lỗi khi lấy dữ liệu', ToastType.error);
      });
    } else {
      this.listItemsDisplay = this.listItems.filter(item => {
        return searchStr.includes(item.name) || searchStr.includes(item.description);
      });
    }
  }

  public search(strSearch) {
    this.searchSubscriber.next(strSearch.text);
  }

  public editCourse(course: CourseModel) {
    console.log(course);
    if (!course || !course.name || course.name.trim() === '') {
      this.sharedUiService.showToast('Bạn chưa nhập tên khóa học', ToastType.warning);
      return;
    }
    if (this.isEditMode) {
      if (this.selectedCourse && this.selectedCourse.id) {
        this.adminService.editCourse(this.selectedCourse.id, course).subscribe(res => {
          console.log(res);
          if (res && res.message === 'success') {
            this.refreshAndToast('Đã lưu dữ liệu thành công!');
            this.isPopupCourseVisible = false;
          }
        }, err => {
          console.log(err);
          this.sharedUiService.showToast('Có lỗi khi lưu dữ liệu', ToastType.error);
        });
      }
    } else {
      this.adminService.addCourse(course).subscribe(res => {
        console.log(res);
        if (res && res.message === 'success') {
          this.refreshAndToast('Đã thêm khóa học thành công!');
          this.isPopupCourseVisible = false;
        }
      }, err => {
        console.log(err);
        this.sharedUiService.showToast('Có lỗi khi lưu dữ liệu', ToastType.error);
      });
    }
  }

  private refreshAndToast(message?: string) {
    if (message && message.trim() !== '') {
      this.sharedUiService.showToast(message, ToastType.success);
    }
    setTimeout(() => this.filter(this.strSearch, true), this.TIME_OUT);
  }

  public showEditPopup(course: CourseModel, isEditMode: boolean) {
    this.selectedCourse = course;
    this.isEditMode = isEditMode;
    setTimeout(this.isPopupCourseVisible = true, 200);
  }

  public showConfirmDelete(course: CourseModel) {
    if (!course || !course.id || !course.name) {
      this.sharedUiService.showToast('Dữ liệu không chính xác', ToastType.error);
      return;
    }
    const confirmDelete = this.sharedUiService.showConfirm(`
      Tất cả dữ liệu liên quan đến khóa học này sẽ bị xóa.\n\r
      Hãy chắc chắn rằng bạn muốn xóa khóa học: "${course.name}"
    `, 'XÓA KHÓA HỌC');
    confirmDelete.then(confirm => {
      if (confirm) {
        this.adminService.deleteCourse(course.id).subscribe(res => {
          console.log(res);
          if (res && res.message === 'success') {
            this.refreshAndToast('Đã xóa khóa học thành công!');
            this.isPopupCourseVisible = false;
          }
        }, err => {
          console.log(err);
          this.sharedUiService.showToast('Có lỗi khi xóa dữ liệu', ToastType.error);
        });
      }
    });
  }
}

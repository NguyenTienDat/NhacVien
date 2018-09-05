import { Component, OnInit } from '@angular/core';
import { AdminService, CourseModel } from '../../services/admin.service';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-new',
  templateUrl: './course-new.component.html',
  styleUrls: ['./course-new.component.scss']
})
export class CourseNewComponent implements OnInit {

  public listItemsDisplay: CourseModel[] = [];
  public lsParentsCourse: CourseModel[] = [];

  constructor(
    private adminService: AdminService,
    private sharedUiService: SharedUiService
  ) { }

  ngOnInit() {
    this.search();
  }

  public search() {
    this.adminService.getListCourse().subscribe(res => {
      this.listItemsDisplay = (res && res.message === 'success' ? res.data : []);
    }, err => {
      console.log(err);
      this.sharedUiService.showToast('Có lỗi khi lấy dữ liệu', ToastType.error);
    });
    this.adminService.getListCourse(true).subscribe(res => {
      this.lsParentsCourse = (res && res.message === 'success' ? res.data : []);
    }, err => {
      console.log(err);
      this.sharedUiService.showToast('Có lỗi khi lấy dữ liệu', ToastType.error);
    });
  }

  public logEvent(nane, e) {
    console.log(nane, e);
  }

  public editCourse(e, isEditMode) {
    const course: CourseModel = e.data;
    let editObservable: Observable<any>;
    if (isEditMode) {
      editObservable = this.adminService.editCourse(e.key, course);
    } else {
      editObservable = this.adminService.addCourse(course);
    }
    editObservable.subscribe(res => {
      console.log(res);
      if (res && res.message === 'success') {
        this.refreshAndToast('Đã lưu dữ liệu thành công!');
      }
    }, err => {
      console.log(err);
      this.sharedUiService.showToast('Có lỗi khi lưu dữ liệu', ToastType.error);
    });
  }

  private refreshAndToast(message?: string) {
    if (message && message.trim() !== '') {
      this.sharedUiService.showToast(message, ToastType.success);
    }
    setTimeout(() => this.search(), this.sharedUiService.DELAY_TIME_RELOAD);
  }

  public deleteCourse(e) {
    console.log(e);
    this.adminService.deleteCourse(e.key).subscribe(res => {
      console.log(res);
      if (res && res.message === 'success') {
        this.refreshAndToast('Đã xóa khóa học thành công!');
      }
    }, err => {
      console.log(err);
      this.sharedUiService.showToast('Có lỗi khi xóa dữ liệu', ToastType.error);
    });
  }

  /**
   * Update updateDimensions sửa lỗi scroll
   * @param e
   */
  public onContentReady(e) {
    setTimeout(() => {
      if (e && e.component) {
        e.component.updateDimensions();
      }
    });
  }
}

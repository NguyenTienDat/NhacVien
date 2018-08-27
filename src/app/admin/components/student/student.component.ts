import { Component, OnInit } from '@angular/core';
import { AdminService, StudentModel } from '../../services/admin.service';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  public listItemsDisplay: StudentModel[] = [];
  public isPopupStudentVisible = false;

  constructor(
    private adminService: AdminService,
    private sharedUiService: SharedUiService
  ) { }

  ngOnInit() {
    this.search();
  }

  public search() {
    this.adminService.getListStudent().subscribe(res => {
      this.listItemsDisplay = (res && res.message === 'success' ? res.data : []);
    }, err => {
      console.log(err);
      this.sharedUiService.showToast('Có lỗi khi lấy dữ liệu', ToastType.error);
    });
  }

  public logEvent(nane, e) {
    console.log(nane, e);
  }

  public editStudent(e, isEditMode) {
    const student: StudentModel = e.data;
    let editObservable: Observable<any>;
    if (isEditMode) {
      editObservable = this.adminService.editStudent(e.key, student);
    } else {
      editObservable = this.adminService.addStudent(student);
    }
    editObservable.subscribe(res => {
      console.log(res);
      if (res && res.message === 'success') {
        this.refreshAndToast('Đã lưu dữ liệu thành công!');
        this.isPopupStudentVisible = false;
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

  public deleteStudent(e) {
    console.log(e);
    this.adminService.deleteStudent(e.key).subscribe(res => {
      console.log(res);
      if (res && res.message === 'success') {
        this.refreshAndToast('Đã xóa học viên thành công!');
        this.isPopupStudentVisible = false;
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

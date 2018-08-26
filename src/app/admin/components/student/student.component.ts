import { Component, OnInit } from '@angular/core';
import { AdminService, StudentModel } from '../../services/admin.service';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';

@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  public listItemsDisplay: StudentModel[] = [];
  public isPopupStudentVisible = false;
  public selectedStudent: StudentModel;
  public isEditMode = false;

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


  public editStudent(classModel: StudentModel) {
    console.log(classModel);
    if (!classModel || !classModel.name || classModel.name.trim() === '') {
      this.sharedUiService.showToast('Bạn chưa nhập tên lớp học', ToastType.warning);
      return;
    }
    if (!classModel.start_date) {
      this.sharedUiService.showToast('Bạn nhập sai định dạng ngày hoặc ngày bắt đầu sau ngày kết thúc', ToastType.warning);
      return;
    }
    if (this.isEditMode) {
      if (this.selectedStudent && this.selectedStudent.id) {
        this.adminService.editStudent(this.selectedStudent.id, classModel).subscribe(res => {
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
    } else {
      this.adminService.addStudent(classModel).subscribe(res => {
        console.log(res);
        if (res && res.message === 'success') {
          this.refreshAndToast('Đã thêm lớp học thành công!');
          this.isPopupStudentVisible = false;
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
    setTimeout(() => this.search(), this.sharedUiService.DELAY_TIME_RELOAD);
  }

  public showEditPopup(classModel: StudentModel, isEditMode: boolean) {
    this.selectedStudent = classModel;
    this.isEditMode = isEditMode;
    setTimeout(this.isPopupStudentVisible = true, 200);
  }

  public showConfirmDelete(classModel: StudentModel) {
    console.log(classModel);
    if (!classModel || !classModel.id || !classModel.name) {
      this.sharedUiService.showToast('Dữ liệu không chính xác', ToastType.error);
      return;
    }
    const confirmDelete = this.sharedUiService.showConfirm(`
      Bạn thực sự muốn xóa lớp học: "${classModel.name}" ?
    `, 'XÓA LỚP HỌC');
    confirmDelete.then(confirm => {
      if (confirm) {
        this.adminService.deleteStudent(classModel.id).subscribe(res => {
          console.log(res);
          if (res && res.message === 'success') {
            this.refreshAndToast('Đã xóa lớp học thành công!');
            this.isPopupStudentVisible = false;
          }
        }, err => {
          console.log(err);
          this.sharedUiService.showToast('Có lỗi khi xóa dữ liệu', ToastType.error);
        });
      }
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

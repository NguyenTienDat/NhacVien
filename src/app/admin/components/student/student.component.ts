import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { AdminService, StudentModel } from '../../services/admin.service';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';
import { Observable } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  public listItemsDisplay: StudentModel[] = [];
  public isPopupStudentVisible = false;
  @Input() isLoadAllStudent = true; // Gán false khi dùng với bảng điểm danh (chỉ get các học sinh của lớp)
  @Input() public isSelectMode = false;
  @Output() public selectChanged = new EventEmitter();
  @ViewChild('dataGridStudent') dataGridStudent: DxDataGridComponent;

  private keyOrigin = []; // keys gốc lấy từ DB
  private keyAdd = []; // keys chọn thêm
  private keyRemove = []; // keys bỏ chọn

  public statusCheck = [
    {
      id: 0,
      name: 'Có đi học'
    },
    {
      id: 1,
      name: 'Vắng có phép'
    },
    {
      id: 2,
      name: 'Vắng không phép'
    }
  ];
  @Output() changeTypeCheck = new EventEmitter();

  constructor(
    private adminService: AdminService,
    private sharedUiService: SharedUiService
  ) { }

  ngOnInit() {
    this.search();
  }

  public search() {
    if (this.isLoadAllStudent) {
      this.adminService.getListStudent().subscribe(res => {
        this.listItemsDisplay = (res && res.message === 'success' ? res.data : []);
      }, err => {
        console.log(err);
        this.sharedUiService.showToast('Có lỗi khi lấy dữ liệu', ToastType.error);
      });
    }
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

  public selectKeys(keys, selectKeyDone) {
    this.keyOrigin = keys;
    if (this.dataGridStudent && this.dataGridStudent.instance) {
      this.dataGridStudent.instance.selectRows(keys, false).then(
        res => {
          selectKeyDone(res);
        }
      );
    }
  }

  public selectedRowKeysChange (e) {
    console.log(e);

    this.keyAdd = [];
    this.keyRemove = [];
    e.forEach(key => {
      if (!this.keyOrigin.includes(key)) {
        this.keyRemove.push(key);
      }
    });
    this.keyOrigin.forEach(key => {
      if (!e.includes(key)) {
        this.keyAdd.push(key);
      }
    });

    // console.log(this.keyAdd, this.keyRemove);
    if (this.isLoadAllStudent) {
      this.selectChanged.emit({addKeys: this.keyAdd, removeKeys: this.keyRemove});
    } else {
      this.selectChanged.emit({addKeys: e, removeKeys: this.keyAdd});
    }
  }

  public saveTypeCheck(student, e) {
    console.log(student, e);
    this.changeTypeCheck.emit({ student: student, type: e });
  }
}

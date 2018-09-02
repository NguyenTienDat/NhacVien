import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, empty } from 'rxjs';
import { debounceTime, map, switchMap, startWith } from 'rxjs/operators';
import { AdminService, ClassModel, CourseModel } from '../../services/admin.service';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';
import { StudentComponent } from '../student/student.component';

@Component({
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, OnDestroy {

  private listItems: ClassModel[] = [];
  public listItemsDisplay: ClassModel[] = [];
  public isPopupClassVisible = false;
  public selectedClass: ClassModel;
  public isEditMode = false;
  public lsCourses: CourseModel[] = [];
  public isPopupSelectStudentVisible = false;

  private searchSubscriber = new Subject<any>();
  private pageAlive = true;
  private strSearch = '';
  private studentIdsSelected: {addKeys: number[], removeKeys: number[]} = {
    addKeys: [],
    removeKeys: []
  };

  @ViewChild('studentComponent') studentComponent: StudentComponent;

  constructor(
    private adminService: AdminService,
    public sharedUiService: SharedUiService
  ) { }

  ngOnInit() {
    this.adminService.getListCourse().subscribe(res => {
      this.lsCourses = (res && res.message === 'success' ? res.data : []);
    }, err => {
      console.log(err);
    });

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

  ngOnDestroy() {
    this.pageAlive = false;
  }

  private filter(searchStr: string, refresh = false) {
    console.log('filter', searchStr, refresh);
    if (!searchStr || searchStr.trim() === '' || refresh) {
      this.adminService.getListClass().subscribe(res => {
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

  public editClass(classModel: ClassModel) {
    console.log(classModel);
    if (!classModel || !classModel.name || classModel.name.trim() === '') {
      this.sharedUiService.showToast('Bạn chưa nhập tên lớp học', ToastType.warning);
      return;
    }
    if (!classModel.start_date || !classModel.end_date || classModel.start_date > classModel.end_date) {
      this.sharedUiService.showToast('Bạn nhập sai định dạng ngày hoặc ngày bắt đầu sau ngày kết thúc', ToastType.warning);
      return;
    }
    if (this.isEditMode) {
      if (this.selectedClass && this.selectedClass.id) {
        this.adminService.editClass(this.selectedClass.id, classModel).subscribe(res => {
          console.log(res);
          if (res && res.message === 'success') {
            this.refreshAndToast('Đã lưu dữ liệu thành công!');
            this.isPopupClassVisible = false;
          }
        }, err => {
          console.log(err);
          this.sharedUiService.showToast('Có lỗi khi lưu dữ liệu', ToastType.error);
        });
      }
    } else {
      this.adminService.addClass(classModel).subscribe(res => {
        console.log(res);
        if (res && res.message === 'success') {
          this.refreshAndToast('Đã thêm lớp học thành công!');
          this.isPopupClassVisible = false;
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
    setTimeout(() => this.filter(this.strSearch, true), this.sharedUiService.DELAY_TIME_RELOAD);
  }

  public showPopupSelectStudent(classModel: ClassModel) {
    if (!classModel ||  !classModel.id) {
      return;
    }
    this.isPopupSelectStudentVisible = true;
    setTimeout(() => {
      this.sharedUiService.showLoadingPanel(true);
    }, 500);
    this.selectedClass = classModel;
    const studentIds = [];
    setTimeout(() => {
      this.adminService.getListStudentClass(classModel.id).subscribe(res => {
        console.log(res);
        if (res && res.message === 'success') {
          res.data.forEach(item => {
            studentIds.push(item.student_id);
          });
          if (this.studentComponent) {
            this.studentComponent.selectKeys(studentIds, () => this.sharedUiService.showLoadingPanel(false));
          }
        }
      });
    }, 1000);
  }

  public showEditPopup(classModel: ClassModel, isEditMode: boolean) {
    this.selectedClass = classModel;
    this.isEditMode = isEditMode;
    setTimeout(this.isPopupClassVisible = true, 200);
  }

  public showConfirmDelete(classModel: ClassModel) {
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
        this.adminService.deleteClass(classModel.id).subscribe(res => {
          console.log(res);
          if (res && res.message === 'success') {
            this.refreshAndToast('Đã xóa lớp học thành công!');
            this.isPopupClassVisible = false;
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

  public selectStudentChange(studentIds) {
    console.log(studentIds, 'selectStudentChange');
    this.studentIdsSelected = studentIds;
  }

  public saveStudentSelected() {
    this.sharedUiService.showLoadingPanel(true);
    // tslint:disable-next-line:max-line-length
    this.adminService.saveStudentClass(this.selectedClass.id, this.studentIdsSelected.addKeys, this.studentIdsSelected.removeKeys).subscribe(res => {
      this.isPopupSelectStudentVisible = false;
      this.sharedUiService.showLoadingPanel(false);
      if (res && res.message === 'success') {
        this.sharedUiService.showToast('Đã lưu dữ liệu thành công!', ToastType.success);
      } else {
        this.sharedUiService.showToast('Lỗi trong quá trình lưu dữ liệu!', ToastType.error);
      }
    });
  }
}

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
    try {
      classModel.color = COLORS[Math.floor(Math.random() * COLORS.length - 1)];
    } catch (error) {
      classModel.color = COLORS[0];
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
const COLORS = [
  '#FFEBEE',
  '#FFFFFF',
  '#FFFF8D',
  '#FFFF00',
  '#FFFDE7',
  '#FFF9C4',
  '#FFF8E1',
  '#0091EA',
  '#FFF3E0',
  '#FFF176',
  '#FFEE58',
  '#FFECB3',
  '#FFEB3B',
  '#FFEA00',
  '#FFE57F',
  '#FFE0B2',
  '#FFE082',
  '#FFD740',
  '#FFD600',
  '#FFD54F',
  '#FFD180',
  '#FFCDD2',
  '#FFCCBC',
  '#FFCC80',
  '#0D47A1',
  '#FFC400',
  '#1565C0',
  '#FFB74D',
  '#FFB300',
  '#1976D2',
  '#FFAB40',
  '#1A237E',
  '#FFA726',
  '#1B5E20',
  '#FF9E80',
  '#FF9800',
  '#1E88E5',
  '#FF8F00',
  '#FF8A80',
  '#2196F3',
  '#FF80AB',
  '#263238',
  '#FF6F00',
  '#FF6E40',
  '#FF6D00',
  '#283593',
  '#FF5252',
  '#FF4081',
  '#FF3D00',
  '#FF1744',
  '#2E7D32',
  '#FCE4EC',
  '#303F9F',
  '#FBC02D',
  '#FB8C00',
  '#311B92',
  '#F9FBE7',
  '#33691E',
  '#F8BBD0',
  '#37474F',
  '#F57F17',
  '#388E3C',
  '#F50057',
  '#3949AB',
  '#F48FB1',
  '#F4511E',
  '#F44336',
  '#3F51B5',
  '#F1F8E9',
  '#F0F4C3',
  '#F06292',
  '#EFEBE9',
  '#43A047',
  '#EF6C00',
  '#EF5350',
  '#4527A0',
  '#EEEEEE',
  '#455A64',
  '#ECEFF1',
  '#EC407A',
  '#EA80FC',
  '#E91E63',
  '#E8F5E9',
  '#E8EAF6',
  '#E6EE9C',
  '#512DA8',
  '#E64A19',
  '#E57373',
  '#546E7A',
  '#E3F2FD',
  '#558B2F',
  '#E1BEE7',
  '#5C6BC0',
  '#E0F2F1',
  '#E0E0E0',
  '#5E35B1',
  '#DD2C00',
  '#607D8B',
  '#DCE775',
  '#D84315',
  '#D81B60',
  '#D7CCC8',
  '#D500F9',
  '#D50000',
  '#D4E157',
  '#D32F2F',
  '#673AB7',
  '#CFD8DC',
  '#689F38',
  '#CDDC39',
  '#CCFF90',
  '#C8E6C9',
  '#C6FF00',
  '#C62828',
  '#C5E1A5',
  '#78909C',
  '#C51162',
  '#C2185B',
  '#7986CB',
  '#BF360C',
  '#BDBDBD',
  '#BCAAA4',
  '#BBDEFB',
  '#7E57C2',
  '#B9F6CA',
  '#B71C1C',
  '#B3E5FC',
  '#B39DDB',
  '#B388FF',
  '#B2FF59',
  '#B2EBF2',
  '#B2DFDB',
  '#B0BEC5',
  '#AFB42B',
  '#AEEA00',
  '#AED581',
  '#AD1457',
  '#AB47BC',
  '#AA00FF',
  '#A7FFEB',
  '#9575CD',
  '#A1887F',
  '#9C27B0',
  '#9E9E9E',
  '#9E9D24',
  '#9CCC65',
  '#9C27B0',
  '#9575CD',
  '#90CAF9',
  '#90A4AE',
  '#8E24AA',
  '#AA00FF',
  '#8C9EFF',
  '#8BC34A',
  '#880E4F',
  '#84FFFF',
  '#82B1FF',
  '#827717',
  '#81D4FA',
  '#81C784',
  '#80DEEA',
  '#80D8FF',
  '#80CBC4',
  '#7E57C2',
  '#7CB342',
  '#7C4DFF',
  '#7B1FA2',
  '#7986CB',
  '#795548',
  '#78909C',
  '#76FF03',
  '#757575',
  '#6D4C41',
  '#6A1B9A',
  '#C51162',
  '#689F38',
  '#673AB7',
  '#66BB6A',
  '#651FFF',
  '#64FFDA',
  '#64DD17',
  '#64B5F6',
  '#6200EA',
  '#616161',
  '#607D8B',
  '#5E35B1',
  '#5D4037',
  '#5C6BC0',
  '#D50000',
  '#546E7A',
  '#D500F9',
  '#512DA8',
  '#4FC3F7',
  '#4E342E',
  '#4DD0E1',
  '#4DB6AC',
  '#4CAF50',
  '#4A148C',
  '#E040FB',
  '#4527A0',
  '#448AFF',
  '#43A047',
  '#42A5F5',
  '#424242',
  '#40C4FF',
  '#3F51B5',
  '#3E2723',
  '#3D5AFE',
  '#3949AB',
  '#E91E63',
  '#F44336',
  '#F50057',
  '#FF1744',
  '#FF4081',
  '#FF5252'
];

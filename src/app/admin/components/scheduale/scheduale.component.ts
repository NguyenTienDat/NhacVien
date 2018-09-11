import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, Appointment, ClassModel } from '../../services/admin.service';
import { Observable } from 'rxjs';
import { DxSchedulerComponent } from 'devextreme-angular';
// import it to change locale and load localization messages
import { locale, loadMessages } from 'devextreme/localization';
import { StudentComponent } from '../student/student.component';
import { SharedUiService, ToastType } from '../../../shared/shared-ui.service';

@Component({
  selector: 'app-scheduale',
  templateUrl: './scheduale.component.html',
  styleUrls: ['./scheduale.component.scss']
})
export class SchedualeComponent implements OnInit {
  dataSource: Appointment[] = [];
  resourcesDataSource: ClassModel[] = [];
  @ViewChild('schedualeClassEditor') schedualeClassEditor: DxSchedulerComponent;

  // POPUP
  @ViewChild('studentComponent') studentComponent: StudentComponent;
  public isPopupSelectStudentVisible = false;
  public selectedClass: Appointment;
  private studentIdsSelected: {addKeys: number[], removeKeys: number[]} = {
    addKeys: [],
    removeKeys: []
  };

  constructor(
    private adminService: AdminService,
    private sharedUiService: SharedUiService
  ) { }

  ngOnInit() {
    this.adminService.getListClass().subscribe(res => {
      this.resourcesDataSource = res.data;
    });
    this.init();
  }

  private init() {
    this.adminService.getAppointment().subscribe(res => {
      this.dataSource = res.data;
    });
  }

  onAppointmentEvent(e, type) {
    const data: Appointment = e.appointmentData;
    console.log(data, type);
    data.allDay = data.allDay ? 1 : 0;
    let obser: Observable<any> = null;
    switch (type) {
      case 'add':
        obser = this.adminService.addAppointment(data);
        break;
      case 'delete':
        obser = this.adminService.deleteAppointment(data.id);
        break;
      case 'update':
        obser = this.adminService.updateAppointment(data.id, data);
        break;
      case 'click':
        const target: Appointment = e.targetedAppointmentData;
        const startDate = this.sharedUiService.getTimeOfDate(target.startDate, data.startDate);
        const endDate = this.sharedUiService.getTimeOfDate(target.endDate, data.endDate);
        target.startDate = new Date(startDate);
        target.endDate = new Date(endDate);
        setTimeout(() => {
          this.selectedClass = target;
        }, 200);
        return;
    }
    obser.subscribe(res => {
      console.log(res);
      setTimeout(() => this.init(), 1000);
    });
  }

  onAppointmentFormCreated(data) {
    console.log(data);
    if (!data || !data.form) {
      return;
    }
    const that = this, form = data.form;
    const optionItems: any[] = form._options.items;
    if (!optionItems || !optionItems[0] || optionItems[0].dataField === 'id_ref') {
      return;
    }
    optionItems.splice(optionItems.length - 1, 1);
    optionItems.unshift({
      label: {
        text: 'Lớp học'
      },
      editorType: 'dxSelectBox',
      dataField: 'id_ref',
      editorOptions: {
        items: that.resourcesDataSource,
        displayExpr: 'name',
        valueExpr: 'id',
        key: 'id',
        onSelectionChanged: function(args) {
          console.log(args);
          if (form.getEditor('text')) {
            form.getEditor('text').option('value', args.selectedItem.name);
          }
        }.bind(this)
      }
    });
    console.log(optionItems);
    form.option('items', optionItems);
  }

  /**
   * POPUP CHECK
   */

  public showPopupSelectStudent(classModel: Appointment) {
    if (!classModel || !classModel.id) {
      return;
    }
    this.isPopupSelectStudentVisible = true;
    setTimeout(() => {
      this.sharedUiService.showLoadingPanel(true);
    }, 500);
    const studentIds = [];
    setTimeout(() => {
      this.adminService.getStudentCheck(classModel.id_ref, classModel.startDate).subscribe(res => {
        console.log(res, 'getStudentCheck');
        if (res && res.message === 'success') {
          res.data.forEach(item => {
            if (item.type === 1) {
              studentIds.push(item.id);
            }
          });
          if (this.studentComponent) {
            this.studentComponent.listItemsDisplay = res.data ? res.data : [];
            setTimeout(() => this.studentComponent.selectKeys(studentIds, () => this.sharedUiService.showLoadingPanel(false)), 1000);
          }
        }
      });
    }, 1000);
  }

  public selectStudentChange(studentIds) {
    console.log(studentIds, 'selectStudentChange');
    this.studentIdsSelected = studentIds;
  }

  public saveStudentSelected() {
    this.sharedUiService.showLoadingPanel(true);
    // tslint:disable-next-line:max-line-length
    this.adminService.saveStudentCheck(this.studentIdsSelected.removeKeys, this.studentIdsSelected.addKeys).subscribe(res => {
      this.isPopupSelectStudentVisible = false;
      this.sharedUiService.showLoadingPanel(false);
      if (res && res.message === 'success') {
        this.sharedUiService.showToast('Đã lưu dữ liệu thành công!', ToastType.success);
      } else {
        this.sharedUiService.showToast('Lỗi trong quá trình lưu dữ liệu!', ToastType.error);
      }
    });
  }

  public saveCheckDescription(e) {
    console.log(e);

    this.adminService.saveDescriptionStudentCheck(e.key, e.data.description).subscribe(res => {
      console.log(res);
      this.sharedUiService.showToast(`Thêm ghi chú cho ${e.data.name} thành công!`, ToastType.success);
    });
  }
}

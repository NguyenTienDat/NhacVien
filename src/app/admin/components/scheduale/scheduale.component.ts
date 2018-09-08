import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, Appointment, ClassModel } from '../../services/admin.service';
import { Observable } from 'rxjs';
import { DxSchedulerComponent } from 'devextreme-angular';
// import it to change locale and load localization messages
import { locale, loadMessages } from 'devextreme/localization';

@Component({
  selector: 'app-scheduale',
  templateUrl: './scheduale.component.html',
  styleUrls: ['./scheduale.component.scss']
})
export class SchedualeComponent implements OnInit {
  dataSource: Appointment[] = [];
  resourcesDataSource: ClassModel[] = [];
  @ViewChild('schedualeClassEditor') schedualeClassEditor: DxSchedulerComponent;

  constructor(private adminService: AdminService) { }

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
}

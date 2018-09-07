import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, Appointment, ClassModel } from '../../services/admin.service';
import { Observable } from 'rxjs';
import { DxSchedulerComponent } from 'devextreme-angular';

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
}

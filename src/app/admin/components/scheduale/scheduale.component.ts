import { Component, OnInit } from '@angular/core';
import { AdminService, Employee } from '../../services/admin.service';

@Component({
  selector: 'app-scheduale',
  templateUrl: './scheduale.component.html',
  styleUrls: ['./scheduale.component.scss']
})
export class SchedualeComponent implements OnInit {
  dataSource: any;
  currentDate: Date = new Date(2016, 7, 2, 11, 30);
  resourcesDataSource: Employee[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.dataSource = this.adminService.getData();
    this.resourcesDataSource = this.adminService.getEmployees();
  }

  markWeekEnd(cellData) {
    function isWeekEnd(date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    }
    const classObject = {};
    classObject['employee-' + cellData.groups.employeeID] = true;
    classObject['employee-weekend-' + cellData.groups.employeeID] = isWeekEnd(cellData.startDate);
    return classObject;
  }

  markTraining(cellData) {
    const classObject = {
      'day-cell': true
    };

    classObject[this.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
    return classObject;
  }

  getCurrentTraining(date, employeeID) {
    const result = (date + employeeID) % 3,
      currentTraining = 'training-background-' + result;

    return currentTraining;
  }
}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  public listItems = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.listItems = [];
    this.adminService.getListCourse().subscribe(res => {
      if (res && res.message === 'success') {
        this.listItems = res.data;
      }
    });
  }

}

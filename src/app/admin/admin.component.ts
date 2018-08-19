import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public user: any;

  public menus = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard/',
      icon: 'fa-tachometer',
      isOpen: false,
      child: []
    },
    {
      name: 'ML',
      path: '/admin/ml',
      icon: '',
      isOpen: false,
      child: [
        {
          name: 'Intent',
          path: '/admin/ml/intents',
          icon: ''
        },
        {
          name: 'Entity',
          path: '/admin/ml/entities',
          icon: ''
        },
        {
          name: 'Sentence',
          path: '/admin/ml/sentences',
          icon: ''
        }
      ]
    },
    {
      name: 'Chat',
      path: '/admin/chat/',
      icon: 'fa-comments',
      isOpen: false,
      child: []
    }
  ];

  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  public clickItemMenu(sidenav, menu) {
    menu.isOpen = !menu.isOpen;
    if (menu.child.length === 0) {
      sidenav.toggle();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { SharedUiService } from './shared/shared-ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isVisibleLoadingPanel = false;

  constructor(public sharedUiService: SharedUiService) {}

  ngOnInit() {
    this.sharedUiService.loadingPanel.subscribe(res => {
      this.isVisibleLoadingPanel = res;
    });
  }
}

import { Injectable } from '@angular/core';
import { confirm, alert } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import * as moment from 'moment';

@Injectable()
export class SharedUiService {

  public showConfirm(message: string, title: string) {
    return confirm(message, title);
  }

  public showAlert(message: string, title: string) {
    return alert(message, title);
  }

  /**
   * @param message
   * @param type «info», «warning», «error», «success» and «custom»
   */
  public showToast(message: string, type: ToastType) {
    return notify(message, type, 3000);
  }

  public getTimeMessagesString(time: number): string {
    if (time <= 0) {
      return '';
    }
    let minute = Math.floor(((new Date().getTime()) - time) / 1000);
    if (minute < 60) {
      return 'Vừa xong';
    }
    minute = Math.floor(minute / 60);
    if (minute < 60) {
      return minute + ' phút trước';
    }
    minute = Math.floor(minute / 60);
    if (minute < 24) {
      return minute + ' giờ trước';
    }
    const date = new Date(time);
    return moment(date).format('DD-MM-YYYY, HH:mm');
  }

  public getTimeFormat(mo: any, format: string): string {
    return mo.format(format);
  }

  /**
   * Lấy thời gian của tháng trước
   */
  public getTimeMonth(time: Date, isSubtract?) {
    if (!time) {
      return moment(new Date());
    }
    if (isSubtract) {
      return moment(time).subtract(1, 'months');
    } else {
      return moment(time).add(1, 'months');
    }
  }
}

export enum ToastType {
  info = 'info',
  warning = 'warning',
  error = 'error',
  success = 'success',
  custom = 'custom'
}

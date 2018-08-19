import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

@Injectable()
export class AdminService extends SharedService {
  /**
  * ============================================================================================
  * Intents
  * ============================================================================================
  */
  public getListIntents(): Observable<any> {
    return this.get('get-intents');
  }
}

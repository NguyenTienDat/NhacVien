import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';

@Injectable()
export class AuthenticationService extends SharedService {

    login(username: string, password: string) {
      return this.post(this.BASE_URL + 'login.php', { username: username, password: password });
    }

    logout() {
      this.doLogout();
    }
}

import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {tap, delay} from 'rxjs/operators';
import {CabinetMedicalService} from '../cabinet-medical.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  role: string;

  constructor(private cabinetMedicalService: CabinetMedicalService) {
  }

  getRedirectUrl(role) {
    switch (role) {
      case 'ROLE_INFIRMIER' :
        return '/infirmier';
      case 'ROLE_SECRETAIRE' :
        return '/secretary';
      default:
        return null;
    }
  }

  async login(username: string, password: string): Promise<any> {
    const infos: any = await this.cabinetMedicalService.login(username, password);
    this.isLoggedIn = !!infos;
    this.role = infos.role;
    this.redirectUrl = this.getRedirectUrl(infos.role);
    return infos;
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}

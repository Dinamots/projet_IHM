import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {tap, delay} from 'rxjs/operators';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {LocalStorageService} from '../services/local-storage.service';
import {Local} from 'protractor/built/driverProviders';
import {LoginInterface} from '../dataInterfaces/loginInterface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private _loginData: LoginInterface;

  constructor(private cabinetMedicalService: CabinetMedicalService) {
    this.checkLocalStorage();
  }

  checkLocalStorage() {
    const login: LoginInterface = LocalStorageService.getLogin();
    if (login) {
      this.isLoggedIn = true;
      this._loginData = login;
      this.redirectUrl = this.getRedirectUrl(this._loginData.role);
    }
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
    console.log(infos);
    this.isLoggedIn = !!infos;
    this._loginData = infos;
    this.redirectUrl = this.getRedirectUrl(infos.role);
    if (this.isLoggedIn) {
      LocalStorageService.setLogin(infos);
    }
    return infos;
  }

  logout(): void {
    this.isLoggedIn = false;
    this._loginData = null;
    this.redirectUrl = null;
  }


  get loginData(): LoginInterface {
    return this._loginData;
  }

  getRole(): string {
    if (!this._loginData) {
      return null;
    }

    return this._loginData.role;
  }
}

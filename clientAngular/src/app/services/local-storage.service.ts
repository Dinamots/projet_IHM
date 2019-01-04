import {Injectable} from '@angular/core';
import {LoginInterface} from '../dataInterfaces/loginInterface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  static getLogin(): LoginInterface {
    return JSON.parse(localStorage.getItem('login'));
  }

  static setLogin(login: LoginInterface) {
    localStorage.setItem('login', JSON.stringify(login));
  }
}

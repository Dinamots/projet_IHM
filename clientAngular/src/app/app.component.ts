import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'clientAngular';

  constructor(public authService: AuthService) {
  }

  getRouterLink() {
    if (!this.authService.isLoggedIn) {
      return '/login';
    }

    switch (this.authService.loginData.role) {
      case 'ROLE_SECRETARY':
        return '/secretary';
      case 'ROLE_INFIRMIER':
        return '/infirmier';
      default:
        return '/login';

    }
  }

  logout() {
    this.authService.logout();
  }

  isSecretary() {
    return this.authService.isLoggedIn === true && this.authService.getRole() === 'ROLE_SECRETAIRE';
  }

  isInfirmier() {
    return this.authService.isLoggedIn === true && this.authService.getRole() === 'ROLE_INFIRMIER';
  }

  isLogged() {
    return this.authService.isLoggedIn;
  }

  getLastName() {
    const loginData = this.authService.loginData;
    if (!loginData) {
      return '';
    }

    switch (loginData.role) {
      case 'ROLE_INFIRMIER':
        return loginData.lastName;
      case 'ROLE_SECRETAIRE':
        return 'admin';
      default:
        return '';
    }
  }


  getFirstName() {
    const loginData = this.authService.loginData;
    if (!loginData) {
      return '';
    }

    switch (loginData.role) {
      case 'ROLE_INFIRMIER':
        return loginData.firstName;
      default:
        return '';
    }
  }

}

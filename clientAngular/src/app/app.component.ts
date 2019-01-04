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

    switch (this.authService.role) {
      case 'ROLE_SECRETARY':
        return '/secretary';
      case 'ROLE_INFIRMIER':
        return '/infirmier';
      default:
        return '/login';

    }
  }

}

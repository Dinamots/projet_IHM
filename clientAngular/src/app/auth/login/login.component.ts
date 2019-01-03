import {Component} from '@angular/core';
import {
  Router,
  NavigationExtras
} from '@angular/router';
import {AuthService} from '../auth.service';
import {CabinetMedicalService} from '../../cabinet-medical.service';
import {MatDialog} from '@angular/material';
import {PatientInterface} from '../../dataInterfaces/patient';
import {DialogPatientComponent} from '../../patient/dialog-patient/dialog-patient.component';
import {DialogComponent} from '../../dialog/dialog.component';
import {CabinetInterface} from '../../dataInterfaces/cabinet';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string;
  cabinet: CabinetInterface;

  constructor(public authService: AuthService, public router: Router, public dialog: MatDialog, public cabinetMedicalService: CabinetMedicalService) {
    this.setMessage();
    this.cabinetMedicalService.cabinet.subscribe(cabinet => {
      this.cabinet = cabinet;
    });
  }

  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  getRedirect(url: string, infos) {
    switch (url) {
      case '/infirmier' :
        return [url, {id: infos.id}];
      case '/secretary' :
        return [url];
      default:
        return ['**'];
    }
  }

  async login(username, password) {
    this.message = 'Trying to log in ...';
    console.log(username);
    this.authService.login(username.value, password.value)
      .then(infos => {
        console.log(infos);
        this.setMessage();
        if (this.authService.isLoggedIn) {
          // Get the redirect URL from our auth service
          // If no redirect has been set, use the default

          // Set our navigation extras object
          // that passes on our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'preserve',
            preserveFragment: true
          };

          // Redirect the user
          this.router.navigate(this.getRedirect(this.authService.redirectUrl, infos), navigationExtras);
          this.message = 'login success';
        }
      })
      .catch(err => {
        this.message = 'can\'t login';
        console.log(err);
        this.openDialog();
      });
    username.value = '';
    password.value = '';


  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
      data: `Wrong username or password, can't login \n`
    });
  }

  logout() {
    this.authService.logout();
    this.setMessage();
  }
}

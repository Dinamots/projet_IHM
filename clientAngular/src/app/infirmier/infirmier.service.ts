import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {InfirmierInterface} from '../dataInterfaces/infirmier';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InfirmierService {

  constructor(private cabinetMedicalService: CabinetMedicalService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InfirmierInterface> | Observable<never> {
    const loginData = LocalStorageService.getLogin();
    const infirmier = this.cabinetMedicalService.getInfirmierById(loginData.id);
    return infirmier ? of(infirmier) : EMPTY;
  }

}

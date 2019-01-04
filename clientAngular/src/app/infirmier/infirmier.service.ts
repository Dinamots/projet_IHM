import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {InfirmierInterface} from '../dataInterfaces/infirmier';
import {CabinetMedicalService} from '../cabinet-medical.service';

@Injectable({
  providedIn: 'root'
})
export class InfirmierService {

  constructor(private cabinetMedicalService: CabinetMedicalService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InfirmierInterface> | Observable<never> {
    const id = route.paramMap.get('id');
    const infirmier = this.cabinetMedicalService.getInfirmierById(id);
    return infirmier ? of(infirmier) : EMPTY;
  }

}

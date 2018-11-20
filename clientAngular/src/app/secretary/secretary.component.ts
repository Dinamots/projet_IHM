import {Component, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {
  private _cabinet: CabinetInterface;

  constructor(private cabinetMedicalService: CabinetMedicalService) {
    this.cabinetMedicalService.cabinet.subscribe(cabinet => this._cabinet = cabinet);
  }

  ngOnInit() {
  }


  get cabinet(): CabinetInterface {
    return this._cabinet;
  }

  set cabinet(value: CabinetInterface) {
    this._cabinet = value;
  }

  public affectation() {
    let infirmier = this._cabinet.infirmiers[0];
    console.log(infirmier);
    let patient = this._cabinet.infirmiers[1].patients[0];
    console.log(patient);
    this.cabinetMedicalService.affectation(infirmier, patient);
  }
}

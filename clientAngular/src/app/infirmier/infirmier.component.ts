import {Component, Input, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() private _infirmier;

  constructor(private cabinetMedicalService: CabinetMedicalService) {
  }

  ngOnInit() {
  }


  get infirmier() {
    return this._infirmier;
  }

  set infirmier(value) {
    this._infirmier = value;
  }
}

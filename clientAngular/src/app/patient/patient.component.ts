import {Component, Input, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  @Input() private _patient;

  constructor(private cabinetMedicalService: CabinetMedicalService) {
  }

  ngOnInit() {
    console.log(this.patient);
  }


  get patient() {
    return this._patient;
  }

  set patient(value) {
    this._patient = value;
  }
}

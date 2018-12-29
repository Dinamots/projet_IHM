import {Component, Input, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {DialogAddPatientComponent} from '../dialog-add-patient/dialog-add-patient.component';
import {MatDialog} from '@angular/material';
import {PatientInterface} from '../dataInterfaces/patient';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  @Input() private _patient;

  constructor(private cabinetMedicalService: CabinetMedicalService, public dialog: MatDialog) {

  }

  ngOnInit() {
    console.log(this.patient);
  }

  openDialog(): void {
    const oldPatient: PatientInterface = this.patient;
    const dialogRef = this.dialog.open(DialogAddPatientComponent, {
      width: '250px',
      data: this.patient
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.cabinetMedicalService.updatePatient(result, oldPatient);
        // this.cabinetMedicalService.addPatient(result);
        // this.cabinetMedicalService.desaffectationModel(result);
      }

    });
  }

  remove() {
    this.cabinetMedicalService.removePatient(this.patient)
      .catch(err => {
        console.log(err);
      })
      .then(res => {
        console.log('ici');
        this.cabinetMedicalService.removePatientModel(this.patient);
      });
  }


  get patient() {
    return this._patient;
  }

  set patient(value) {
    this._patient = value;
  }
}

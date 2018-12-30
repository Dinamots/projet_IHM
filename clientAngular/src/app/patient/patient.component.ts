import {Component, Input, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {DialogPatientComponent} from '../dialog-patient/dialog-patient.component';
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
    const oldPatient: PatientInterface = JSON.parse(JSON.stringify(this.patient));
    const dialogRef = this.dialog.open(DialogPatientComponent, {
      width: '250px',
      data: this.patient
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.cabinetMedicalService.updatePatient(result, oldPatient)
          .catch(err => {
            console.log(err);
            this.patient = JSON.parse(JSON.stringify(oldPatient));
          });
      }
    });
  }

  remove() {
    this.cabinetMedicalService.removePatient(this.patient)
      .catch(err => {
        console.log(err);
      })
      .then(res => {
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

import {Component, Input, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {DialogPatientComponent} from '../dialog-patient/dialog-patient.component';
import {MatDialog} from '@angular/material';
import {PatientInterface} from '../dataInterfaces/patient';
import {DialogComponent} from '../dialog/dialog.component';

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

  /**
   * Va ouvrir la fenêtre de mise à jour/ajout d'un client lorsqu'on clique sur les boutons correspondants !
   */
  openDialog(): void {
    const oldPatient: PatientInterface = JSON.parse(JSON.stringify(this.patient));
    const dialogRef = this.dialog.open(DialogPatientComponent, {
      width: '250px',
      data: this.patient
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        this.cabinetMedicalService.updatePatient(result, oldPatient)
          .catch(err => {
            this.dialog.open(DialogComponent, {
              width: '250px',
              data: `Un patient porte déjà le numéro ${result.numeroSecuriteSociale} , update impossible`
            });
            console.log(err);
            this.patient = JSON.parse(JSON.stringify(oldPatient));
          });
      } else {
        this.patient = JSON.parse(JSON.stringify(oldPatient));
      }

    });
  }

  /**
   * Fonction qui va remove le patient sur lequel on a cliqué
   */
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

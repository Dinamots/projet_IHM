import {Component, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {HttpClient} from '@angular/common/http';
import {sexeEnum} from '../dataInterfaces/sexe';
import {Adresse} from '../dataInterfaces/adresse';
import {DialogAddPatientComponent} from '../dialog-add-patient/dialog-add-patient.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {
  private _cabinet: CabinetInterface;

  constructor(private cabinetMedicalService: CabinetMedicalService, public dialog: MatDialog) {
    this.cabinetMedicalService.cabinet.subscribe(cabinet => {
      console.log('ici');
      this._cabinet = cabinet;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPatientComponent, {
      width: '250px',
      data: {
        adresse: {}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.cabinetMedicalService.newPatient(result);
      }
      console.log('The dialog was closed');
    });
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
    const infirmier = this._cabinet.infirmiers[0];
    const patient = this._cabinet.infirmiers[1].patients[0];
    this.cabinetMedicalService.affectation(infirmier, patient);
  }

  public desaffectation() {
    const patient = this._cabinet.infirmiers[1].patients[0];
    this.cabinetMedicalService.desaffectation(patient);
  }

  public addPatient() {
    const patient = {
      prenom: 'tibox',
      nom: 'l\'asticox',
      sexe: sexeEnum.M,
      numeroSecuriteSociale: '193061305545313',
      adresse: {
        ville: 'Saint genis',
        codePostal: 34981,
        rue: 'rue de coulondre',
        numero: '408',
        etage: ''
      },
    };
    this.cabinetMedicalService.addPatient(patient);
  }
}

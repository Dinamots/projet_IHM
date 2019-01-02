import {Component, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {DialogPatientComponent} from '../dialog-patient/dialog-patient.component';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {PatientInterface} from '../dataInterfaces/patient';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {
  private _cabinet: CabinetInterface;

  constructor(private cabinetMedicalService: CabinetMedicalService, public dialog: MatDialog) {
    this.cabinetMedicalService.cabinet.subscribe(cabinet => {
      this._cabinet = cabinet;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPatientComponent, {
      width: '250px',
      data: {
        adresse: {}
      }
    });

    dialogRef.afterClosed().subscribe((result: PatientInterface) => {
      console.log(result);
      if (result !== undefined) {
        this.cabinetMedicalService.addPatient(result)
          .then(res => {
            console.log(res);
            this.cabinetMedicalService.addPatientModel(result);
          })
          .catch(err => {
            console.log(err);
            this.dialog.open(DialogComponent, {
              width: '250px',
              data: `Un patient porte déjà le numéro ${result.numeroSecuriteSociale} , ajout impossible`
            });
          });
      }
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }


  get cabinet(): CabinetInterface {
    return this._cabinet;
  }
}

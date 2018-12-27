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
      console.log(result);
      if (result !== undefined) {
        this.cabinetMedicalService.addPatient(result).then(res => {
          this.cabinetMedicalService.addPatientModel(result);
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

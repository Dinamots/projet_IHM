import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PatientInterface} from '../dataInterfaces/patient';
import {sexeEnum} from '../dataInterfaces/sexe';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-dialog-add-patient',
  templateUrl: './dialog-add-patient.component.html',
  styleUrls: ['./dialog-add-patient.component.css']
})
export class DialogAddPatientComponent implements OnInit {
  public sexe: string[] = [
    'Masculin',
    'Féminin',
    'Autre'
  ];
  public codePostalControl: FormControl = new FormControl('', [Validators.required]);
  public villeControl: FormControl = new FormControl('', [Validators.required]);
  public nomControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+[ \\-\']?[[a-zA-Z]+[ \\-\']?]*[a-zA-Z]+$')]);
  public prenomControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+[ \\-\']?[[a-zA-Z]+[ \\-\']?]*[a-zA-Z]+$')]);
  public numeroControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[12][0-9]{2}[0-1][0-9](2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}[0-9]{2}$')]);

  constructor(public dialogRef: MatDialogRef<DialogAddPatientComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PatientInterface) {
    console.log(this.sexe);
  }

  ngOnInit() {
  }

  toSexeEnum(str: string): sexeEnum {
    switch (str) {
      case 'Masculin':
        return sexeEnum.M;
      case 'Feminin' :
        return sexeEnum.F;
      default:
        return sexeEnum.A;
    }
  }

  getErrorMessage(control: FormControl) {
    return control.hasError('required') ? 'You must enter a value' :
      control.hasError('control') ? 'Not valid' :
        '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

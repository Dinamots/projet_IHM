import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PatientInterface} from '../../dataInterfaces/patient';
import {sexeEnum} from '../../dataInterfaces/sexe';
import {FormControl, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-dialog-add-patient',
  templateUrl: './dialog-patient.component.html',
  styleUrls: ['./dialog-patient.component.css']
})
export class DialogPatientComponent implements OnInit {
  public sexe: string[] = [
    'Masculin',
    'Féminin',
    'Autre'
  ];
  public create: boolean = this.data.nom === undefined;
  public selectedValue = this.toString(this.data.sexe);
  public dateControl: FormControl = new FormControl(this.data.date, [Validators.required]);
  public codePostalControl: FormControl = new FormControl(this.data.adresse.codePostal, [Validators.required]);
  public villeControl: FormControl = new FormControl(this.data.adresse.ville, [Validators.required]);
  public nomControl: FormControl = new FormControl(this.data.nom, [Validators.required]);
  public prenomControl: FormControl = new FormControl(this.data.prenom, [Validators.required]);
  public numeroControl: FormControl = new FormControl(
    this.data.numeroSecuriteSociale,
    [Validators.required,
      Validators.pattern('^[12][0-9]{2}[0-1][0-9](2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}[0-9]{2}$')]
  );
  public rueControl: FormControl = new FormControl(this.data.adresse.rue);
  public etageControl: FormControl = new FormControl(this.data.adresse.etage);
  public numeroRueControl: FormControl = new FormControl(this.data.adresse.numero);
  public sexeControl: FormControl = new FormControl(this.data.sexe, [Validators.required]);
  public minDate = new Date(1900, 0, 1);
  public maxDate = new Date();

  constructor(public dialogRef: MatDialogRef<DialogPatientComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PatientInterface, public datepipe: DatePipe) {
  }

  ngOnInit() {
  }

  test(e) {
    console.log(e);
    this.data.sexe = this.toSexeEnum(e.target.textContent);
  }

  /**
   *  Renvoie la chaine de caractère lié  au sexeEnum passé en paramètre
   * @param sexe
   */
  toString(sexe: sexeEnum): string {
    switch (sexe) {
      case sexeEnum.F:
        return this.sexe[1];
      case sexeEnum.M:
        return this.sexe[0];
      default:
        return this.sexe[2];
    }
  }

  /**
   * Renvoie le sexeEnum correspondant au sexe choisis par l'utilisateur dans la fenêtre de dialogue (c'est à dire une string)
   * @param str
   */
  toSexeEnum(str: string): sexeEnum {
    switch (str.trim()) {
      case this.sexe[0]:
        return sexeEnum.M;
      case this.sexe[1] :
        return sexeEnum.F;
      default:
        return sexeEnum.A;
    }
  }

  /**
   * Retourne le message d'erreur selon l'erreur
   * @param control
   */
  getErrorMessage(control: FormControl) {
    return control.hasError('required') ? 'You must enter a value' :
      control.hasError('control') ? 'Not valid' :
        '';
  }

  /**
   * Met la date récupéré du formulaire au format attendu dans le XML
   * @param control
   * @param dataVal
   * @param value
   */
  getDate(control: FormControl, dataVal: any, value: Date): any {
    const dateString = this.datepipe.transform(value, 'yyyy-MM-dd');
    return this.getChange(control, dataVal, dateString);

  }

  /**
   * Si la valeur est valide retourne la valeur du champ qui a été modifié
   * @param control
   * @param dataVal
   * @param value
   */
  getChange(control: FormControl, dataVal: any, value: any): any {
    if (control.valid) {
      return value;
    } else {
      return dataVal;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Vérifie que tous les champs mis dedans sont valide
   */
  isValid() {
    return this.nomControl.valid
      && this.prenomControl.valid
      && this.codePostalControl.valid
      && this.numeroControl.valid
      && this.villeControl.valid;
  }

}

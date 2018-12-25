import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PatientInterface} from '../dataInterfaces/patient';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {InfirmierInterface} from '../dataInterfaces/infirmier';
import {fadeInItems} from '@angular/material';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {

  @Input() private _patients: PatientInterface[];
  @Input() private _infirmierIndex: number;
  @Input() private _infirmiersLength: number;


  constructor(private cabinetMedicalService: CabinetMedicalService) {
  }

  ngOnInit() {
  }

  get patients() {
    return this._patients;
  }

  set patients(value) {
    this._patients = value;
  }

  get infirmierIndex(): number {
    return this._infirmierIndex;
  }

  set infirmierIndex(value: number) {
    this._infirmierIndex = value;
  }

  get infirmiersLength(): number {
    return this._infirmiersLength;
  }

  set infirmiersLength(value: number) {
    this._infirmiersLength = value;
  }

  getInfirmier(index: number): InfirmierInterface {
    return this.cabinetMedicalService.getInfirmierByIndex(index);
  }

  getPatient(index: number, infirmierIndex: number): PatientInterface {
    return this.cabinetMedicalService.getPatientOfInfirmierByIndex(index, infirmierIndex);
  }

  drop(event: CdkDragDrop<any>) {
    console.log(event);

    const previousInfirmierIndex = parseInt(event.previousContainer.id.match(/^\d+|\d+\b|\d+(?=\w)/g)[0], 10) - 1;
    const currentInfirmierIndex = parseInt(event.container.id.match(/^\d+|\d+\b|\d+(?=\w)/g)[0], 10) - 1;
    const previousInfirmier = this.getInfirmier(previousInfirmierIndex);
    const patient = this.getPatient(event.previousIndex, previousInfirmierIndex);
    const currentInfirmier = this.getInfirmier(currentInfirmierIndex);
    this.cabinetMedicalService.affectation(currentInfirmier, patient);


    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getDropListConnectedTo() {
    const connected = [];
    for (let i = 1; i <= this._infirmiersLength; i++) {
      if (this._infirmierIndex !== i - 1) {
        connected.push(`cdk-drop-list-${i}`);
      }

    }
    return connected;
  }

  getDropListId() {
    return `patient-${this._infirmierIndex}`;
  }
}

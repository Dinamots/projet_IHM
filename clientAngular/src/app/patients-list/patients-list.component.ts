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
  @Input() private _isUnaffected = false;

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
    const infirmier = this.cabinetMedicalService.getInfirmierByIndex(index);
    return infirmier === undefined ? null : infirmier;
  }

  getPatient(index: number, infirmierIndex: number): PatientInterface {
    console.log('ici');
    console.log(index);
    console.log('infirmierIndex == ' + infirmierIndex);
    console.log(infirmierIndex);
    return infirmierIndex !== -1
      ? this.cabinetMedicalService.getPatientOfInfirmierByIndex(index, infirmierIndex)
      : this.cabinetMedicalService.getUnaffectedPatientByIndex(index);
  }

  changeModelOnDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getInfirmierIndex(id): number {
    const string = id.match(/^\d+|\d+\b|\d+(?=\w)/g);
    return string !== null ? parseInt(string[0], 10) : -1;
  }

  drop(event: CdkDragDrop<any>) {
    if (event.container === event.previousContainer) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }
    
    const previousInfirmierIndex = this.getInfirmierIndex(event.previousContainer.id);
    const currentInfirmierIndex = this.getInfirmierIndex(event.container.id);
    const patient = this.getPatient(event.previousIndex, previousInfirmierIndex);
    const currentInfirmier = this.getInfirmier(currentInfirmierIndex);

    if (currentInfirmier === null) {
      this.cabinetMedicalService.desaffectation(patient);
    } else {
      this.cabinetMedicalService.affectation(currentInfirmier, patient);
      this.changeModelOnDrop(event);
    }

  }

  getDropListConnectedTo() {
    const connected = [];
    for (let i = 0; i <= this._infirmiersLength; i++) {
      if (this._infirmierIndex !== i - 1) {
        connected.push(`patientList-${i}`);
      }

    }

    connected.push(`unaffectedList`);

    return connected;
  }

  getDropListId() {
    return this._isUnaffected ? 'unaffectedList' : `patientList-${this._infirmierIndex}`;
  }
}

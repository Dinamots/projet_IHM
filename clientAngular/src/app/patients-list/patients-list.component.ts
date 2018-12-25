import {Component, Input, OnInit} from '@angular/core';
import {PatientInterface} from '../dataInterfaces/patient';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  @Input() private _patients: PatientInterface[];
  @Input() private _infirmierIndex: number;
  @Input() private _infirmiersLength: number;

  constructor() {
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

  drop(e) {
    console.log(e);
  }

  getDropListConnectedTo() {
    const connected = [];
    for (let i = 1; i <= this._infirmiersLength; i++) {
      connected.push(`cdk-drop-list-${i}`);
    }
    return connected;
  }

  getDropListId() {
    return `patient-${this._infirmierIndex}`;
  }
}

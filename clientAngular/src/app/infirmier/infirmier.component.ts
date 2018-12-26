import {Component, Input, OnInit} from '@angular/core';
import {InfirmierInterface} from '../dataInterfaces/infirmier';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() private _infirmier: InfirmierInterface;
  @Input() private _infirmierIndex: number;
  @Input() private _infirmiersLength: number;

  constructor() {

  }

  ngOnInit() {
  }

  get infirmier(): InfirmierInterface {
    return this._infirmier;
  }

  set infirmier(value: InfirmierInterface) {
    this._infirmier = value;
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
}

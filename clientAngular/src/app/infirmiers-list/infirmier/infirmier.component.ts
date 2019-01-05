import {Component, Input, OnInit} from '@angular/core';
import {InfirmierInterface} from '../../dataInterfaces/infirmier';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {mergeMap, switchMap, take} from 'rxjs/operators';
import {CabinetMedicalService} from '../../cabinet-medical.service';
import {EMPTY, Observable, of} from 'rxjs';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() private _infirmier: InfirmierInterface;
  @Input() private _infirmierIndex: number;
  @Input() private _infirmiersLength: number;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data.infirmier !== undefined) {
        this._infirmier = data.infirmier;
      }
    });
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

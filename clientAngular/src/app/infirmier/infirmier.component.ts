import {Component, Input, OnInit} from '@angular/core';
import {InfirmierInterface} from '../dataInterfaces/infirmier';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {CabinetMedicalService} from '../cabinet-medical.service';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() private _infirmier: InfirmierInterface;
  @Input() private _infirmierIndex: number;
  @Input() private _infirmiersLength: number;

  constructor(private route: ActivatedRoute, private cabinetMedicalService: CabinetMedicalService) {

  }

  ngOnInit() {
    if (this._infirmier === undefined) {
      console.log('ici');
      const id: string = this.route.snapshot.paramMap.get('id');
      console.log(id);
      this._infirmier = this.cabinetMedicalService.getInfirmierById(id);
      console.log(this._infirmier);
      this._infirmierIndex = this.cabinetMedicalService.getInfirmierIndex(this.infirmier);
    }


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

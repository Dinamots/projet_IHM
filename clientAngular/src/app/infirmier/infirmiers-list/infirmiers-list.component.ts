import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-infirmiers-list',
  templateUrl: './infirmiers-list.component.html',
  styleUrls: ['./infirmiers-list.component.css']
})
export class InfirmiersListComponent implements OnInit {
  @Input() private _infirmiers;
  constructor() { }

  ngOnInit() {
  }


  get infirmiers() {
    return this._infirmiers;
  }

  set infirmiers(value) {
    this._infirmiers = value;
  }
}

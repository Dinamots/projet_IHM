import {Component, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {

  constructor(private cabinetMedicalService: CabinetMedicalService) {
    this.getData('/data/cabinetInfirmier.xml').then(res => {
      console.log(res);
    });
  }

  ngOnInit() {
  }

  public getData(url: string): Promise<CabinetInterface> {
    return this.cabinetMedicalService.getData(url);
  }
}

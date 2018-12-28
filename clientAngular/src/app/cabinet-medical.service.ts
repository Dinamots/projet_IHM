import {Injectable} from '@angular/core';
import {InfirmierInterface} from './dataInterfaces/infirmier';
import {sexeEnum} from './dataInterfaces/sexe';
import {PatientInterface} from './dataInterfaces/patient';
import {Adresse} from './dataInterfaces/adresse';
import {CabinetInterface} from './dataInterfaces/cabinet';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CabinetMedicalService {
  private _cabinet = new BehaviorSubject<CabinetInterface>({
    infirmiers: [],
    patientsNonAffectes: [],
    adresse: null
  });

  constructor(private http: HttpClient) {
    this.getData('/data/cabinetInfirmier.xml').then(res => {
      this._cabinet.next({
        infirmiers: res.infirmiers,
        patientsNonAffectes: res.patientsNonAffectes,
        adresse: res.adresse
      });
    });
  }

  get cabinet(): Observable<CabinetInterface> {
    return this._cabinet.asObservable();
  }

  private getNodeValue(node: Element, tagName: string): string {
    return node.getElementsByTagName(tagName).length ? node.getElementsByTagName(tagName).item(0).textContent : null;
  }

  private stringToSexe(sexe: string): sexeEnum {
    switch (sexe) {
      case 'F' :
        return sexeEnum.F;
      case 'M' :
        return sexeEnum.M;
      default :
        return null;
    }
  }

  private getAdresse(adresse: Element): Adresse {
    return {
      ville: this.getNodeValue(adresse, 'ville'),
      codePostal: Number(this.getNodeValue(adresse, 'codePostal')),
      rue: this.getNodeValue(adresse, 'rue'),
      numero: this.getNodeValue(adresse, 'numéro'),
      etage: this.getNodeValue(adresse, 'étage')
    };
  }


  private getPatient(patient: Element): PatientInterface {
    return {
      prenom: this.getNodeValue(patient, 'prénom'),
      nom: this.getNodeValue(patient, 'nom'),
      date: this.getNodeValue(patient, 'naissance'),
      sexe: this.stringToSexe((this.getNodeValue(patient, 'sexe'))),
      numeroSecuriteSociale: this.getNodeValue(patient, 'numéro'),
      adresse: this.getAdresse(patient.getElementsByTagName('adresse').item(0))
    };
  }

  private getDoc(text: string): Document {
    const parser: DOMParser = new DOMParser();
    return parser.parseFromString(text, 'application/xml');
  }

  private getPatientsAlone(patients: Element, infirmiers: InfirmierInterface[]): PatientInterface[] {
    // return [];
    const patientsInterface: PatientInterface[] = [];
    const elem = Array.from(patients.getElementsByTagName('patient')).filter(patient => this.isAlone(patient, infirmiers));
    elem.forEach(patient => {
      patientsInterface.push(this.getPatient(patient));
    });
    return patientsInterface;
    // return [];
  }

  private isAlone(patient: Element, infirmiers: InfirmierInterface[]): boolean {
    return infirmiers.filter(infirmier => {
      return infirmier.patients.filter(p => p.numeroSecuriteSociale === this.getPatient(patient).numeroSecuriteSociale).length === 1;
    }).length === 0;
  }


  private getInfirmier(infirmier: Element, patients: Element): InfirmierInterface {
    const id = infirmier.getAttribute('id');
    return {
      id: id,
      prenom: this.getNodeValue(infirmier, 'prénom'),
      nom: this.getNodeValue(infirmier, 'nom'),
      photo: this.getNodeValue(infirmier, 'photo'),
      patients: this.getPatientsInfirmier(patients, id),
      adresse: this.getAdresse(infirmier.getElementsByTagName('adresse').item(0))
    };
  }

  private getInfirmiers(infirmiers: Element, patients: Element): InfirmierInterface[] {
    const infirmierList = Array.from((infirmiers.getElementsByTagName('infirmier')));
    return infirmierList.reduce((acc, x) => {
      acc.push(this.getInfirmier(x, patients));
      return acc;
    }, []);
  }


  private getPatientsInfirmier(patients: Element, intervenant: string): PatientInterface[] {
    const patientList: Array<Element> = Array.from(patients.getElementsByTagName('patient'));
    return patientList.reduce((acc, x) => {
      if (x.getElementsByTagName('visite').item(0).getAttribute('intervenant') === intervenant) {
        acc.push(this.getPatient(x));
      }
      return acc;
    }, []);

  }

  private getCabinetInterface(doc: Document): CabinetInterface {
    const infirmiers = this.getInfirmiers(doc.querySelector('infirmiers'), doc.querySelector('patients'));
    return {
      infirmiers: infirmiers,
      patientsNonAffectes: this.getPatientsAlone(doc.getElementsByTagName('patients').item(0), infirmiers),
      adresse: this.getAdresse(doc.getElementsByTagName('adresse').item(0))
    };
  }

  async getData(url: string): Promise<CabinetInterface> {
    const res = await this.http.get(url, {responseType: 'text'}).toPromise();
    const doc = this.getDoc(res.toString());
    const cabinet = this.getCabinetInterface(doc);
    return new Promise<CabinetInterface>((resolve) => {
      resolve(cabinet);
    });
  }


  private addPatientRequest(patient: PatientInterface): Promise<Object> {
    return this.http.post('/addPatient', {
      patientName: patient.nom,
      patientForname: patient.prenom,
      patientNumber: patient.numeroSecuriteSociale,
      patientSex: patient.sexe === sexeEnum.M ? 'M' : patient.sexe === sexeEnum.F ? 'F' : 'A',
      patientBirthday: patient.date,
      patientFloor: patient.adresse.etage,
      patientStreetNumber: patient.adresse.numero,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville
    }).toPromise();
  }

  affectation(infirmier: InfirmierInterface, patient: PatientInterface): Promise<Object> {
    console.log('affectation');
    return this.affectationRequest(infirmier !== null ? infirmier.id : 'none', patient);
  }

  addPatientModel(patient: PatientInterface) {
    this._cabinet.getValue().patientsNonAffectes.push(patient);
  }

  addPatient(patient: PatientInterface): Promise<Object> {
    return this.addPatientRequest(patient);
  }

  desaffectationModel(patient: PatientInterface) {
    const infirmierIndex = this.getInfirmierIndex(this.getInfirmierOfPatient(patient));
    if (infirmierIndex !== -1) {
      const patientIndex: number = this.getPatientIndexOfInfirmier(infirmierIndex, patient);
      this._cabinet.getValue().infirmiers[infirmierIndex].patients.splice(patientIndex, 1);
      this._cabinet.getValue().patientsNonAffectes.push(patient);
    }

  }

  desaffectation(patient: PatientInterface): Promise<Object> {
    console.log('desaffectation');
    return this.affectationRequest('none', patient);
  }

  private affectationRequest(infirmierId: string, patient: PatientInterface): Promise<Object> {
    return this.http.post('/affectation', {
      infirmier: infirmierId,
      patient: patient.numeroSecuriteSociale
    }).toPromise();
  }

  public getInfirmierIndex(infirmier: InfirmierInterface): number {
    return this._cabinet.getValue().infirmiers.indexOf(infirmier);
  }

  public getInfirmierByIndex(index: number): InfirmierInterface {
    return this._cabinet.getValue().infirmiers[index];
  }

  public getPatientIndexOfInfirmier(infirmierIndex: number, patient: PatientInterface): number {
    return this._cabinet.getValue().infirmiers[infirmierIndex].patients.reduce((acc, x, i) => {
      if (x === patient) {
        return i;
      }
      return acc;
    }, 0);

  }

  public getPatientOfInfirmierByIndex(index: number, infirmierIndex: number): PatientInterface {
    return this._cabinet.getValue().infirmiers[infirmierIndex].patients[index];
  }

  public getInfirmierOfPatient(patient: PatientInterface): InfirmierInterface {
    let infirmier, infIndex;
    const infTab = this._cabinet.getValue().infirmiers.filter(inf => {
      return inf.patients.filter(p => p === patient).length !== 0;
    });

    if (infTab.length !== 0) {
      infirmier = infTab[0];
      infIndex = this._cabinet.getValue().infirmiers.indexOf(infirmier);
      return this._cabinet.getValue().infirmiers[infIndex];
    } else {
      return null;
    }

  }

  public getUnaffectedPatientByIndex(index: number): PatientInterface {
    return this._cabinet.getValue().patientsNonAffectes[index];
  }

}

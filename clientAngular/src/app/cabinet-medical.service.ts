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
    console.log(elem);
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

  private addPatientModel(patient: PatientInterface) {
    this._cabinet.getValue().patientsNonAffectes.push(patient);
  }

  async addPatient(patient: PatientInterface) {
    this.addPatientModel(patient);
    this.addPatientRequest(patient);
  }

  private addPatientRequest(patient: PatientInterface) {
    this.http.post('/addPatient', {
      patientName: patient.nom,
      patientForname: patient.prenom,
      patientNumber: patient.numeroSecuriteSociale,
      patientSex: patient.sexe === sexeEnum.M ? 'M' : 'F',
      patientBirthday: 'AAAA-MM-JJ',
      patientFloor: patient.adresse.etage,
      patientStreetNumber: patient.adresse.numero,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville
    }).subscribe();
  }

  public addPatientToInfirmier(infirmier: InfirmierInterface, patient: PatientInterface) {
    this._cabinet.getValue().infirmiers[this._cabinet.getValue().infirmiers.indexOf(infirmier)].patients.push(patient);
  }

  private getIntervenant(patient: PatientInterface): InfirmierInterface {
    return this._cabinet.getValue().infirmiers.filter(inf => {
      return inf.patients.filter(p => p === patient).length === 1;
    })[0];
  }

  public deletePatientOfInfirmier(patient: PatientInterface, indexInfirmier: number) {
    const indexPatient = this._cabinet.getValue().infirmiers[indexInfirmier].patients.indexOf(patient);
    this._cabinet.getValue().infirmiers[indexInfirmier].patients.splice(indexPatient, 1);
  }

  public deletePatient(patient: PatientInterface) {
    const intervenant = this.getIntervenant(patient);
    const indexIntervenant = this._cabinet.getValue().infirmiers.indexOf(intervenant);
    const indexPatient = this._cabinet.getValue().infirmiers[indexIntervenant].patients.indexOf(patient);
    this._cabinet.getValue().infirmiers[indexIntervenant].patients.splice(indexPatient, 1);
    console.log(this._cabinet.getValue().infirmiers[indexIntervenant].patients);
  }

  private affectationModel(infirmier: InfirmierInterface, patient: PatientInterface) {
    this.deletePatient(patient);
    this.addPatientToInfirmier(infirmier, patient);
  }

  async newPatient(patient: PatientInterface) {
    this._cabinet.next({
      infirmiers: this._cabinet.getValue().infirmiers,
      patientsNonAffectes: [...this._cabinet.getValue().patientsNonAffectes, patient],
      adresse: this._cabinet.getValue().adresse
    });
    this.affectationRequest('', patient);

  }

  async affectation(infirmier: InfirmierInterface, patient: PatientInterface) {
    // this.affectationModel(infirmier, patient);
    // this.deletePatient(patient);
    this.affectationRequest(infirmier !== null ? infirmier.id : '', patient);
    console.log(this._cabinet.getValue());
  }


  async desaffectation(patient: PatientInterface) {
    this.deletePatient(patient);
    console.log(patient);
    this._cabinet.getValue().patientsNonAffectes.push(patient);
    this.affectationRequest('', patient);
  }

  private affectationRequest(infirmierId: string, patient: PatientInterface) {
    this.http.post('/affectation', {
      infirmier: infirmierId,
      patient: patient.numeroSecuriteSociale
    }).subscribe();
  }

  public getInfirmierByIndex(index: number): InfirmierInterface {
    return this._cabinet.getValue().infirmiers[index];
  }

  public getPatientOfInfirmierByIndex(index: number, infirmierIndex: number): PatientInterface {
    return this._cabinet.getValue().infirmiers[infirmierIndex].patients[index];
  }

  public getUnaffectedPatientByIndex(index: number): PatientInterface {
    return this._cabinet.getValue().patientsNonAffectes[index];
  }

}

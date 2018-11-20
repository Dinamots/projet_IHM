import {Injectable} from '@angular/core';
import {InfirmierInterface} from './dataInterfaces/infirmier';
import {sexeEnum} from './dataInterfaces/sexe';
import {PatientInterface} from './dataInterfaces/patient';
import {Adresse} from './dataInterfaces/adresse';
import {CabinetInterface} from './dataInterfaces/cabinet';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CabinetMedicalService {

  constructor(private http: HttpClient) {
  }

  private static getNodeValue(node: Element, tagName: string): string {
    return node.getElementsByTagName(tagName).length ? node.getElementsByTagName(tagName).item(0).textContent : null;
  }

  private static stringToSexe(sexe: string): sexeEnum {
    switch (sexe) {
      case 'F' :
        return sexeEnum.F;
      case 'M' :
        return sexeEnum.M;
      default :
        return null;
    }
  }

  private static getAdresse(adresse: Element): Adresse {
    return {
      ville: CabinetMedicalService.getNodeValue(adresse, 'ville'),
      codePostal: Number(CabinetMedicalService.getNodeValue(adresse, 'codePostal')),
      rue: CabinetMedicalService.getNodeValue(adresse, 'rue'),
      numero: CabinetMedicalService.getNodeValue(adresse, 'numéro'),
      etage: CabinetMedicalService.getNodeValue(adresse, 'étage')
    };
  }

  private static getAlonePatients(patients: Element, infirmiers: InfirmierInterface[]): PatientInterface[] {
    return null;
    // return Array.from(patients.getElementsByTagName('patient')).filter(x => isAlone(x,infirmiers));
  }

  private static getPatient(patient: Element): PatientInterface {
    return {
      prenom: CabinetMedicalService.getNodeValue(patient, 'prénom'),
      nom: CabinetMedicalService.getNodeValue(patient, 'nom'),
      sexe: CabinetMedicalService.stringToSexe((CabinetMedicalService.getNodeValue(patient, 'sexe'))),
      numeroSecuriteSociale: CabinetMedicalService.getNodeValue(patient, 'numéro'),
      adresse: CabinetMedicalService.getAdresse(patient.getElementsByTagName('adresse').item(0))
    };
  }

  private static getDoc(text: string): Document {
    const parser: DOMParser = new DOMParser();
    return parser.parseFromString(text, 'application/xml');
  }


  private getInfirmier(infirmier: Element, patients: Element): InfirmierInterface {
    const id = infirmier.getAttribute('id');
    return {
      id: id,
      prenom: CabinetMedicalService.getNodeValue(infirmier, 'prénom'),
      nom: CabinetMedicalService.getNodeValue(infirmier, 'nom'),
      photo: CabinetMedicalService.getNodeValue(infirmier, 'photo'),
      patients: this.getPatientsInfirmier(patients, id),
      adresse: CabinetMedicalService.getAdresse(infirmier.getElementsByTagName('adresse').item(0))
    };
  }

  private getInfirmiers(infirmiers: Element, patients: Element): InfirmierInterface[] {
    const infirmierList = Array.from((infirmiers.getElementsByTagName('infirmier')));
    return infirmierList.reduce((acc, x) => {
      acc.push(this.getInfirmier(x, patients));
      return acc;
    }, []);
  }


  private getPatientsInfirmier(patients: Element, intervant: string): PatientInterface[] {
    const patientList: Array<Element> = Array.from(patients.getElementsByTagName('patient'));
    return patientList.reduce((acc, x) => {
      if (x.getElementsByTagName('visite').item(0).getAttribute('intervenant') === intervant) {
        acc.push(CabinetMedicalService.getPatient(x));
      }
      return acc;
    }, []);

  }

  public getCabinetInterface(doc: Document): CabinetInterface {
    const infirmiers = this.getInfirmiers(doc.querySelector('infirmiers'), doc.querySelector('patients'));
    return {
      infirmiers: infirmiers,
      patientsNonAffectes: CabinetMedicalService.getAlonePatients(doc.getElementsByTagName('patients').item(0), infirmiers),
      adresse: CabinetMedicalService.getAdresse(doc.getElementsByTagName('adresse').item(0))
    };
  }

  async getData(url: string): Promise<CabinetInterface> {
    const res = await this.http.get(url, {responseType: 'text'}).toPromise();
    const doc = CabinetMedicalService.getDoc(res.toString());
    const cabinet = this.getCabinetInterface(doc);
    return new Promise<CabinetInterface>((resolve) => {
      resolve(cabinet);
    });
  }

}

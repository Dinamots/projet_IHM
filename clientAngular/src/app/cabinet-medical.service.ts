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

  /**
   * Retourne la valeur du noeud dont le nom est passé en paramètre
   * @param node : L'élément
   * @param tagName : Le nom du noeud dont on veut la valeur
   */
  private getNodeValue(node: Element, tagName: string): string {
    return node.getElementsByTagName(tagName).length ? node.getElementsByTagName(tagName).item(0).textContent : null;
  }
  /**
   * Retourne l'enum du sexe en fonction du caractère reçu en paramètre
   * @param sexe
   */
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

  /**
   * Retourne une interface Adresse à partir d'un Noeud <adresse>
   * @param adresse : Noeud adresse
   */
  private getAdresse(adresse: Element): Adresse {
    return {
      ville: this.getNodeValue(adresse, 'ville'),
      codePostal: Number(this.getNodeValue(adresse, 'codePostal')),
      rue: this.getNodeValue(adresse, 'rue'),
      numero: this.getNodeValue(adresse, 'numéro'),
      etage: this.getNodeValue(adresse, 'étage')
    };
  }

  /**
   * Retourne une interface patient remplie à l'aide du noeud patient passé en paramètre
   * @param patient
   */
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

  /**
   * Retourne le le Document à partir du chemin vers le fichier
   * @param text
   */
  private getDoc(text: string): Document {
    const parser: DOMParser = new DOMParser();
    return parser.parseFromString(text, 'application/xml');
  }

  /**
   * Retourne un tableua d'interface de patient qui correspond à nous les patients qui ne sont pas affectés à un infirmier
   * @param patients : Tableau d'interface de patient contenant tous les patients
   * @param infirmiers : Tableau d'interface d'infirmier contenant tous les infirmiers
   */
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

  /**
   * Dis si un patient est affecté ou non à un infirmier
   * @param patient : Le patient
   * @param infirmiers : Tableau d'interface d'infirmier
   */
  private isAlone(patient: Element, infirmiers: InfirmierInterface[]): boolean {
    return infirmiers.filter(infirmier => {
      return infirmier.patients.filter(p => p.numeroSecuriteSociale === this.getPatient(patient).numeroSecuriteSociale).length === 1;
    }).length === 0;
  }

  /**
   * Retourne l'inteface infirmier à l'aide du noeud infirmier et du noeud patients
   * @param infirmier
   * @param patients
   */
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

  /**
   * Retourne la liste des infirmeirs dans un tableau d'interface Infirmier
   * @param infirmiers : Noeud Infirmiers
   * @param patients : Noeud Patients
   */
  private getInfirmiers(infirmiers: Element, patients: Element): InfirmierInterface[] {
    const infirmierList = Array.from((infirmiers.getElementsByTagName('infirmier')));
    return infirmierList.reduce((acc, x) => {
      acc.push(this.getInfirmier(x, patients));
      return acc;
    }, []);
  }

  /**
   * récupère les patients de l'infirmier dont l'id est passé en paramètre
   * @param patients : Noeud <patients>
   * @param intervenant : l'id de l'intervenant
   */
  private getPatientsInfirmier(patients: Element, intervenant: string): PatientInterface[] {
    const patientList: Array<Element> = Array.from(patients.getElementsByTagName('patient'));
    return patientList.reduce((acc, x) => {
      if (x.getElementsByTagName('visite').item(0).getAttribute('intervenant') === intervenant) {
        acc.push(this.getPatient(x));
      }
      return acc;
    }, []);

  }

  /**
   * Renvoie l'interface CabinetInterface à partir du document en utilisant les fonctions ci-dessus.
   * @param doc
   */
  private getCabinetInterface(doc: Document): CabinetInterface {
    const infirmiers = this.getInfirmiers(doc.querySelector('infirmiers'), doc.querySelector('patients'));
    return {
      infirmiers: infirmiers,
      patientsNonAffectes: this.getPatientsAlone(doc.getElementsByTagName('patients').item(0), infirmiers),
      adresse: this.getAdresse(doc.getElementsByTagName('adresse').item(0))
    };
  }

  /**
   * Retourne une promesse de cabinet interface à partir d'un chemin vers le fichier xml passé en paramètre
   * @param url : chemin vers les fichiers xml
   */
  async getData(url: string): Promise<CabinetInterface> {
    const res = await this.http.get(url, {responseType: 'text'}).toPromise();
    const doc = this.getDoc(res.toString());
    const cabinet = this.getCabinetInterface(doc);
    return new Promise<CabinetInterface>((resolve) => {
      resolve(cabinet);
    });
  }

  /**
   * Met à jour le model après la suppression  d'un patient
   * @param patient : L'interface du patient à supprimer
   */
  public removePatientModel(patient: PatientInterface) {
    const infirmier: InfirmierInterface = this.getInfirmierOfPatient(patient);
    if (infirmier != null) {
      const infirmierIndex = this.getInfirmierIndex(infirmier);
      const patientIndex = this.getPatientIndexOfInfirmier(infirmierIndex, patient);
      this._cabinet.getValue().infirmiers[infirmierIndex].patients.splice(patientIndex, 1);
    } else {
      const patientIndex = this.getIndexOfUnaffectedPatient(patient);
      this._cabinet.getValue().patientsNonAffectes.splice(patientIndex, 1);
    }

  }

  /**
   * Va faire appel à patient request pour supprimer le patient
   * @param patient
   */
  public removePatient(patient: PatientInterface): Promise<Object> {
    return this.patientRequest(patient, '/removePatient');
  }

  /**
   * Va faire appel à patient request pour update le patient
   * @param patient
   * @param oldPatient
   */
  public updatePatient(patient: PatientInterface, oldPatient: PatientInterface): Promise<Object> {
    return this.patientRequest(patient, '/updatePatient', oldPatient);
  }

  /**
   * Foonction qui va faire appel au serveur pour effectuer l'action demander par l'utilisateur
   * @param patient : le patient concerné
   * @param url : l'url correspondant à l'action
   * @param object : Un pbjet (dans le cas de l'update patient un patient) qui est facultatif)
   */
  private patientRequest(patient: PatientInterface, url: string, object?: object): Promise<Object> {
    return this.http.post(url, {
      patientName: patient.nom,
      patientForname: patient.prenom,
      patientNumber: patient.numeroSecuriteSociale,
      patientSex: patient.sexe === sexeEnum.M ? 'M' : patient.sexe === sexeEnum.F ? 'F' : 'A',
      patientBirthday: patient.date,
      patientFloor: patient.adresse.etage,
      patientStreetNumber: patient.adresse.numero,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville,
      object: object
    }).toPromise();
  }

  /**
   * Fait appel à la fonction affectaion requestion pour affecter un patient à un infirmier
   * @param infirmier : L'infirmeir auquel on va affecter le patient
   * @param patient : Le patient auquel on va affecter le patient
   */
  affectation(infirmier: InfirmierInterface, patient: PatientInterface): Promise<Object> {
    console.log('affectation');
    return this.affectationRequest(infirmier !== null ? infirmier.id : 'none', patient);
  }

  /**
   * Va mettre à jour le modele après l'ajout d'un patient
   * @param patient
   */
  addPatientModel(patient: PatientInterface) {
    this._cabinet.getValue().patientsNonAffectes.push(patient);
  }

  /**
   * Fait appel à patient request pour ajouter un patient
   * @param patient : L'interface du patient à ajouter
   */
  addPatient(patient: PatientInterface): Promise<Object> {
    return this.patientRequest(patient, '/addPatient');
  }

  /**
   * Fonction qui met à jour le model après la désacffectation d'un patient
   * N'est pas utilisé pour le moment
   * @param patient
   */
  desaffectationModel(patient: PatientInterface) {
    const infirmierIndex = this.getInfirmierIndex(this.getInfirmierOfPatient(patient));
    if (infirmierIndex !== -1) {
      const patientIndex: number = this.getPatientIndexOfInfirmier(infirmierIndex, patient);
      this._cabinet.getValue().infirmiers[infirmierIndex].patients.splice(patientIndex, 1);
      this._cabinet.getValue().patientsNonAffectes.push(patient);
    }

  }

  /**
   * fait appel à affectation request pour désacffecter un patient
   * @param patient
   */
  desaffectation(patient: PatientInterface): Promise<Object> {
    console.log('desaffectation');
    return this.affectationRequest('none', patient);
  }

  /**
   * Fait appel au serveur pour gérer l'affectation ou la désacffectation d'un patient
   * @param infirmierId
   * @param patient
   */
  private affectationRequest(infirmierId: string, patient: PatientInterface): Promise<Object> {
    return this.http.post('/affectation', {
      infirmier: infirmierId,
      patient: patient.numeroSecuriteSociale
    }).toPromise();
  }

  /**
   * Retourne l'indice de l'infirmier passé en paramètre dans le tableau des infirmiers
   * @param infirmier
   */
  public getInfirmierIndex(infirmier: InfirmierInterface): number {
    return this._cabinet.getValue().infirmiers.indexOf(infirmier);
  }

  /**
   * Retourne l'interface infirmier de l'infirmier à l'indice passé en paramètre
   * @param index
   */
  public getInfirmierByIndex(index: number): InfirmierInterface {
    return this._cabinet.getValue().infirmiers[index];
  }

  /**
   * Retourne l'indice du patient par rapport à la liste des patients de l'infirmier passé en paramètre
   * @param infirmierIndex
   * @param patient
   */
  public getPatientIndexOfInfirmier(infirmierIndex: number, patient: PatientInterface): number {
    return this._cabinet.getValue().infirmiers[infirmierIndex].patients.reduce((acc, x, i) => {
      if (x === patient) {
        return i;
      }
      return acc;
    }, 0);

  }

  /**
   * Retourne l'interface patient correspond au patient parmis les patients de l'infirmier dont l'index est passé en paramètre
   * @param index : Index du patient
   * @param infirmierIndex : Index de l'infirmmier.
   */
  public getPatientOfInfirmierByIndex(index: number, infirmierIndex: number): PatientInterface {
    return this._cabinet.getValue().infirmiers[infirmierIndex].patients[index];
  }

  /**
   * retourne l'infirmier intervenant pour le patient passé en paramètre (s'il y en a un).
   * @param patient
   */
  public getInfirmierOfPatient(patient: PatientInterface): InfirmierInterface {
    let infirmier, infIndex;
    const infTab = this._cabinet.getValue().infirmiers.filter(inf => {
      return inf.patients.filter(p => p === patient).length !== 0;
    });

    console.log(infTab);

    if (infTab.length !== 0) {
      infirmier = infTab[0];
      infIndex = this._cabinet.getValue().infirmiers.indexOf(infirmier);
      return this._cabinet.getValue().infirmiers[infIndex];
    } else {
      return null;
    }

  }

  /**
   * Retourne l'interface d'un patient non affectés en fonction de son index.
   * @param index
   */
  public getUnaffectedPatientByIndex(index: number): PatientInterface {
    return this._cabinet.getValue().patientsNonAffectes[index];
  }

  /**
   *  Retourne l'index du patient non affecté passé en paramètre !!
   * @param patient
   */
  public getIndexOfUnaffectedPatient(patient: PatientInterface): number {
    return this._cabinet.getValue().patientsNonAffectes.reduce((acc, x, i) => {
      if (x === patient) {
        acc = i;
        return acc;
      }
      return acc;
    }, 0);
  }

  public login(username: string, password: string): Promise<object> {
    return this.http.post('/loginRequest', {
      username: username,
      password: password
    }).toPromise();
  }
}

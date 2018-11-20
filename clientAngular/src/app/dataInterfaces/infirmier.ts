import {PatientInterface} from './patient';
import {Adresse} from './adresse';

export interface InfirmierInterface {
  id: string;
  prenom: string;
  nom: string;
  photo: string;
  patients: PatientInterface[];
  adresse: Adresse;
}

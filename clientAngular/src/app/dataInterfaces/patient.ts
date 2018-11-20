import {sexeEnum} from './sexe';
import {Adresse} from './adresse';

export interface PatientInterface {
  prenom: string;
  nom: string;
  sexe: sexeEnum;
  numeroSecuriteSociale: string;
  adresse: Adresse;
}

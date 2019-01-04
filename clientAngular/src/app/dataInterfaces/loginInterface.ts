import {PatientInterface} from './patient';
import {Adresse} from './adresse';

export interface LoginInterface {
  role: string;
  firstName?: string;
  lastName?: string;
  id?: string;
}

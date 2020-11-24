import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Customer extends BaseModel {
  first_name: string;
  last_name: string;
  middle_initial: string;
  dob: string;
  race: string;
  ethnicity: string;
  patient_identifier: string;
  language: string;
  street_address: string;
  city: string;
  state: string;
  gender: string;
  zip: string;
  country: string;
  allow_contact: number;
  phone_number: number;
  uuid: string;
  // createdAt: string;
}

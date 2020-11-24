import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface User extends BaseModel {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  name : string;
  email : string;
  facility_name: string;
  city: string;
  state : string;
  zip : string;
  phone_number : number;
  role : number; // Admin = 0 | Doctor = 1 | Lab_Operator =2
  user_created : string;
  status: number; // Active = 0 | Deleted = 1 | Disabled = 2
  last_login: string;
  ipAddress : string;
  password : string;
}
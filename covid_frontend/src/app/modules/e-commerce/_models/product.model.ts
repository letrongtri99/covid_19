import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Product extends BaseModel {
  id: number;
  patient_uuid: string;
  metadata: string;
  user_uuid: string;
  status: number;
  result: string;
  createdAt: string;  
}

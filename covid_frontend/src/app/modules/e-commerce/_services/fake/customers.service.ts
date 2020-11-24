import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../../_metronic/shared/crud-table';
import { Customer } from '../../_models/customer.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { returnPatients } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends TableService<Customer> implements OnDestroy {
  API_URL = `${environment.host}/patients`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Customer>> {
    return this.http.post<Customer[]>(this.API_URL, tableState).pipe(
      map((response: Customer[]) => {
        const filteredResult = returnPatients(response);
        
        const result: TableResponseModel<Customer> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  findPatients() {
    let url = `${environment.host}/patients/all`

    return this.http.get<Customer[]>(url).pipe(
      map((response: Customer[]) => {
        const filteredResult = returnPatients(response);

        const result = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result.items;
      })
    );
  }

  // deleteItems(ids: number[] = []): Observable<any> {
  //   const tasks$ = [];
  //   ids.forEach(id => {
  //     tasks$.push(this.delete(id));
  //   });
  //   return forkJoin(tasks$);
  // }

  // updateStatusForItems(ids: number[], status: number): Observable<any> {
  //   return this.http.get<Customer[]>(this.API_URL).pipe(
  //     map((customers: Customer[]) => {
  //       return customers.filter(c => ids.indexOf(c.id) > -1).map(c => {
  //         c.status = status;
  //         return c;
  //       });
  //     }),
  //     exhaustMap((customers: Customer[]) => {
  //       const tasks$ = [];
  //       customers.forEach(customer => {
  //         tasks$.push(this.update(customer));
  //       });
  //       return forkJoin(tasks$);
  //     })
  //   );
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

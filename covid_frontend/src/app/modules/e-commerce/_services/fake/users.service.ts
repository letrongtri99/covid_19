import { UserModel } from './../../../auth/_models/user.model';
import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../../_metronic/shared/crud-table';
import { User } from '../../_models/user.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { returnUsers } from '../../../../_fake/fake-helpers/http-extenstions';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends TableService<UserModel> implements OnDestroy {
  API_URL = `${environment.apiUrl}/customers`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<UserModel>> {
    return this.http.get<UserModel[]>(this.API_URL).pipe(
      map((response: UserModel[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<UserModel> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  findUsers(tableState: ITableState): Observable<TableResponseModel<UserModel>> {
    const url = `${environment.host}/getUsers`;
    return this.http.post<UserModel[]>(url, tableState , {withCredentials: true}).pipe(
      map((response: UserModel[]) => {
        const filteredResult = returnUsers(response);
        const result: TableResponseModel<UserModel> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  deleteItems(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    ids.forEach(id => {
      tasks$.push(this.delete(id));
    });
    return forkJoin(tasks$);
  }

  updateStatusForItems(ids: number[], status: number): Observable<any> {
    return this.http.get<UserModel[]>(this.API_URL).pipe(
      map((users: UserModel[]) => {
        return users.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((users: UserModel[]) => {
        const tasks$ = [];
        users.forEach(user => {
          tasks$.push(this.update(user));
        });
        return forkJoin(tasks$);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
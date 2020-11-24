import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CustomersService } from '../../../_services';

@Component({
  selector: 'app-delete-users-modal',
  templateUrl: './delete-users-modal.component.html',
  styleUrls: ['./delete-users-modal.component.scss']
})
export class DeleteUsersModalComponent implements OnInit, OnDestroy {
  @Input() uuids;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private customersService: CustomersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteCustomers() {
    this.isLoading = true;
    console.log(this.uuids);
    // const sb = this.customersService.deleteItems(this.ids).pipe(
    //   delay(1000), // Remove it from your code (just for showing loading)
    //   tap(() => this.modal.close()),
    //   catchError((errorMessage) => {
    //     this.modal.dismiss(errorMessage);
    //     return of(undefined);
    //   }),
    //   finalize(() => {
    //     this.isLoading = false;
    //   })
    // ).subscribe();
    // this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

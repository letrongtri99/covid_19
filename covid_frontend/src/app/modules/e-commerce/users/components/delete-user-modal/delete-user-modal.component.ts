import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CustomersService } from '../../../_services';
import { UsersService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.scss']
})
export class DeleteUserModalComponent implements OnInit, OnDestroy {
  @Input() uuid;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService, public modal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  deleteCustomer() {
    this.isLoading = true;
    const sb = this.usersService.deleteUser(this.uuid).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap((res) => {
        console.log(res);
        if(res.status == 'success') {
            this.toastr.success(res.message);
            this.modal.close();
        } else {
            this.toastr.error(res.message);
        }
      }),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
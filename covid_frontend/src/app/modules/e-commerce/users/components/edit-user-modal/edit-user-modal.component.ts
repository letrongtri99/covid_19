import { UserModel } from './../../../../auth/_models/user.model';
import { ConfirmPasswordValidator } from './../../../../auth/registration/confirm-password.validator';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from '../../../_models/customer.model';
import { CustomersService } from '../../../_services';
import { User } from './../../../_models/user.model';
import { UsersService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { ToastrService } from 'ngx-toastr';

const EMPTY_USER: UserModel = {
  id: undefined,
  uuid: '',
  first_name: '',
  last_name: '',
  name: '',
  email: '',
  facility_name: '',
  city: '',
  state: '',
  zip: '',
  phone_number: undefined,
  role: 0,
  last_login : '',
  last_ip_address : '',
  status : undefined,
  user_created: '',
  password: '',
  pic: '',
  created_at : '',
  updated_at: '',
  setUser(user:any) {}
};

@Component({
  selector: 'edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditUserModalComponent implements OnInit, OnDestroy {
  @Input() uuid;
  isLoading$;
  user: UserModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadUser();
  }

  loadUser() {
    if (!this.uuid) {
      this.user = EMPTY_USER;
      this.loadForm();
    } else {
      const sb = this.usersService.getItemUserById(this.uuid).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USER);
        })
      ).subscribe((user: UserModel) => {
        this.user = user;
        this.loadFormEdit();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    const pattern = "(\d{5}([\-]\d{4})?)" 
    this.formGroup = this.fb.group({
      first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      facility_name: [this.user.facility_name, Validators.compose([Validators.required])],
      city: [this.user.city, Validators.compose([Validators.required])],
      state: [this.user.state, Validators.compose([Validators.required])],
      zip: [this.user.zip, Validators.compose([Validators.required, Validators.pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/)])],
      phone_number: [this.user.phone_number, Validators.compose([Validators.required, Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)])],
      role: [this.user.role, Validators.compose([Validators.required])],
      password: [this.user.password, Validators.compose([Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)])],
      cPassword: [this.user.password, Validators.compose([Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)])]
    },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  loadFormEdit() {
    const pattern = "(\d{5}([\-]\d{4})?)" 
    this.formGroup = this.fb.group({
        first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
        facility_name: [this.user.facility_name, Validators.compose([Validators.required])],
        city: [this.user.city, Validators.compose([Validators.required])],
        state: [this.user.state, Validators.compose([Validators.required])],
        zip: [this.user.zip, Validators.compose([Validators.required, Validators.pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/)])],
        phone_number: [this.user.phone_number, Validators.compose([Validators.required, Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)])],
        role: [this.user.role, Validators.compose([Validators.required])]
      }
    );
  }

  save() {
    this.prepareUser();
    if (this.user.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.updateUser(this.user).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe(res => this.user = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.createUser(this.user).pipe(
      tap((res) => {
        if(res.status == 'success') {
            this.toastr.success(res.message);
            this.modal.close();
        } else {
            this.toastr.error(res.message);
        }
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe((res: UserModel) => this.user = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formData = this.formGroup.value;
    this.user.email = formData.email;
    this.user.first_name = formData.first_name;
    this.user.last_name = formData.last_name;
    this.user.email = formData.email;
    this.user.facility_name = formData.facility_name;
    this.user.role = +formData.role;
    this.user.city = formData.city;
    this.user.state = formData.state;
    this.user.zip = formData.zip;
    this.user.phone_number = formData.phone_number;
    this.user.password = formData.password;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}

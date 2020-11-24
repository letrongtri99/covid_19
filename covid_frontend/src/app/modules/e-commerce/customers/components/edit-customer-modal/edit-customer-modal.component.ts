import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from '../../../_models/customer.model';
import { CustomersService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_CUSTOMER: Customer = {
  id: undefined,
  uuid: '',
  patient_identifier: '',
  first_name: '',
  last_name: '',
  middle_initial: '',
  dob: '',
  race: '',
  ethnicity: '',
  language: '',
  street_address: '',
  city: '',
  state: '',
  gender: '',
  zip: '',
  country: '',
  allow_contact: 1,
  phone_number: undefined,
  // createdAt: ''
};

@Component({
  selector: 'app-edit-customer-modal',
  templateUrl: './edit-customer-modal.component.html',
  styleUrls: ['./edit-customer-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditCustomerModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  customer: Customer;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      const sb = this.customersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: Customer) => {
        this.customer = customer;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    let numericRegex = /^[a-zA-Z0-9]+$/;

    this.formGroup = this.fb.group({
      patient_identifier: [this.customer.patient_identifier, Validators.compose([Validators.required, Validators.maxLength(100)])],
      first_name: [this.customer.first_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      last_name: [this.customer.last_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      middle_initial: [this.customer.middle_initial],
      dob: [this.customer.dob, Validators.compose([Validators.nullValidator])],
      gender: [this.customer.gender, Validators.compose([Validators.required])],
      race: [this.customer.race, Validators.compose([Validators.required])],
      ethnicity: [this.customer.ethnicity, Validators.compose([Validators.required])],
      language: [this.customer.language],
      street_address: [this.customer.street_address, Validators.compose([Validators.required, Validators.maxLength(100)])],
      city: [this.customer.city, Validators.compose([Validators.required, Validators.maxLength(100)])],
      state: [this.customer.state, Validators.compose([Validators.required, Validators.maxLength(100)])],
      zip: [this.customer.zip, Validators.compose([Validators.required, Validators.maxLength(9)])],
      country: [this.customer.country, Validators.compose([Validators.required, Validators.maxLength(100)])],
      allow_contact: [this.customer.allow_contact],
      phone_number: [this.customer.phone_number, Validators.pattern("^[0-9]*$")],


    });
  }

  save() {
    this.prepareCustomer();
    if (this.customer.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.customersService.update(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res => this.customer = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.customersService.create(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe((res: Customer) => this.customer = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.customer.patient_identifier = formData.patient_identifier;
    this.customer.first_name = formData.first_name;
    this.customer.last_name = formData.last_name;
    this.customer.dob = formData.dob;
    this.customer.middle_initial = formData.middle_initial;
    this.customer.dob = formData.dob;
    this.customer.race = formData.race;
    this.customer.ethnicity = formData.ethnicity;
    this.customer.language = formData.language;
    this.customer.street_address = formData.street_address;
    this.customer.city = formData.city;
    this.customer.state = formData.state;
    this.customer.gender = formData.gender;
    this.customer.zip = formData.zip;
    this.customer.country = formData.country;
    this.customer.allow_contact = formData.allow_contact;
    this.customer.phone_number = formData.phone_number;
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

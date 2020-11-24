import { CustomersService } from './../../_services';

import { Customer } from './../../_models/customer.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap, first } from 'rxjs/operators';
import { Product } from '../../_models/product.model';
import { ProductsService } from '../../_services';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_metronic/core';
import { ThrowStmt } from '@angular/compiler';

const EMPTY_PRODUCT: Product = {
  id: undefined,
  patient_uuid: '',
  metadata: '',
  user_uuid: '',
  status: undefined,
  result: '',
  createdAt: '',
};

const EMPTY_PATIENT: Customer = {
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
}
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})

export class ProductEditComponent implements OnInit, OnDestroy {
  id: number;
  uuid: string;
  product: Product;
  customer: Customer;
  previous: Product;
  formGroup: FormGroup;
  formGroupPatient: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    REMARKS_TAB: 1,
    SPECIFICATIONS_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];
  
  selectedPatient: '';
  listPatients: any;
  metadata: any;

  orderInfor = {
    diagnosis_code: [],
    specimen_type: '',
    specimen_site: '',
    test_name: '',
    payment_information: ''
  }

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productsService.isLoading$;
    this.loadProduct();
    this.loadPatients();
  }

  loadProduct() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.uuid = params.get('uuid');
        if (this.uuid) {
          return this.productsService.getOrderById(this.uuid);
        }
        return of(EMPTY_PRODUCT);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Product) => {
      this.product = res;
      this.previous = Object.assign({}, res);
      // this.loadForm();
      this.loadFormPatient()
    });
    this.subscriptions.push(sb);
  }

  loadPatients() {
    const sb = this.customersService.findPatients().pipe(
      catchError((errorMessage) => {
        return of(EMPTY_PATIENT);
      })
    ).subscribe((res) => {
      this.listPatients = res;
    });
    this.subscriptions.push(sb);
  }

  
  onChange(selectedPatient) {
    const sb = this.customersService.getItemById(selectedPatient).pipe(
      first(),
      catchError((errorMessage) => {
        return of(EMPTY_PATIENT);
      }),
    ).subscribe((customer: Customer) => {
      this.customer = customer;
      this.formGroupPatient.patchValue(this.customer)
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      //LOAD ORDER
    });

  }
  loadFormPatient() {
    if (!this.customer) {
      this.customer = EMPTY_PATIENT;
    }
    
    this.formGroupPatient = this.fb.group({
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

  reset() {
    if (!this.previous) {
      return;
    }

    this.product = Object.assign({}, this.previous);
    this.loadForm();
  }

  createPatient() {
    this.formGroupPatient.markAllAsTouched();
    if (!this.formGroupPatient.valid) {
      return;
    }

    const patientFormValues = this.formGroupPatient.value;
    
    let patientInfo = {
      id: undefined,
      patient_identifier: patientFormValues.patient_identifier,
      first_name: patientFormValues.first_name,
      last_name: patientFormValues.last_name,
      middle_initial: patientFormValues.middle_initial,
      dob: patientFormValues.dob,
      gender: patientFormValues.gender,
      race: patientFormValues.race,
      ethnicity: patientFormValues.ethnicity,
      language: patientFormValues.language,
      street_address: patientFormValues.street_address,
      city: patientFormValues.city,
      state: patientFormValues.state,
      zip: patientFormValues.zip,
      country: patientFormValues.country,
      allow_contact: patientFormValues.allow_contact,
      phone_number: patientFormValues.phone_number,
    }

    const sbCreate = this.customersService.create(patientInfo).pipe(
      catchError((errorMessage) => {
        return of(this.customer);
      }),
    ).subscribe((res: Customer) => this.customer = res);
    this.subscriptions.push(sbCreate);
  }

  save() {
    this.formGroupPatient.markAllAsTouched();
    if (!this.formGroupPatient.valid) {
      return;
    }

    const patientFormValues = this.formGroupPatient.value;
    
    let patientInfo = {
      patient_uuid: this.customer.uuid,
      patient_identifier: patientFormValues.patient_identifier,
      first_name: patientFormValues.first_name,
      last_name: patientFormValues.last_name,
      middle_initial: patientFormValues.middle_initial,
      dob: patientFormValues.dob,
      gender: patientFormValues.gender,
      race: patientFormValues.race,
      ethnicity: patientFormValues.ethnicity,
      language: patientFormValues.language,
      street_address: patientFormValues.street_address,
      city: patientFormValues.city,
      state: patientFormValues.state,
      zip: patientFormValues.zip,
      country: patientFormValues.country,
      allow_contact: patientFormValues.allow_contact,
      phone_number: patientFormValues.phone_number,
    }

    
    let metatdata = {
      patient_information: patientInfo,
      order_information: this.orderInfor,
    }
    
    // this.product = Object.assign(this.product, metatdata);
    this.metadata = metatdata
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }


  edit() {
    const sbUpdate = this.productsService.update(this.metadata).pipe(
      tap(() => this.router.navigate(['/ecommerce/products'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.product);
      })
    ).subscribe(res => this.product = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.productsService.createOrder(this.metadata).pipe(
      tap(() => this.router.navigate(['/ecommerce/products'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.product);
      })
    ).subscribe(res => this.product = res as Product);
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroupPatient.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroupPatient.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroupPatient.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroupPatient.controls[controlName];
    return control.dirty || control.touched;
  }

  checkOrderValid() {
    if(this.orderInfor.diagnosis_code.length != 0 &&
       this.orderInfor.specimen_type != '' &&
       this.orderInfor.specimen_site != '' &&
       this.orderInfor.test_name != '' &&
       this.orderInfor.payment_information != '') {
         return false
       }
    return true
  }

  checkValueDiagnosis(value) {
    let index = this.orderInfor.diagnosis_code.findIndex(e => e == value)
    if(index != -1) {
      this.orderInfor.diagnosis_code.splice(index, 1)
    } else {
      this.orderInfor.diagnosis_code.push(value)
    }
  }

  checkValueSpecimentType(value) {
    this.orderInfor.specimen_type = value
  }

  checkValueSpecimentSite(value) {
    this.orderInfor.specimen_site = value
  }

  checkValueTestName(value) {
    this.orderInfor.test_name = value
  }

  checkValuePayment(value) {
    this.orderInfor.payment_information = value
  }
}

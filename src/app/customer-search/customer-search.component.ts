import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../_services/customer.service';
import { Router } from '@angular/router';
import { StoreService } from '../_services/store.service';
import { AuthService } from '../_services/auth.service';
import { Customer } from '../_models/customer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit {

  private modalRef: NgbModalRef;
  customers: Customer[];
  customersCount: number;
  searchName = "";
  searchAddress = "";
  searchPhone = "";
  page = 1;
  pageSize = 10;
  loading = false;
  createCustomerForm: FormGroup;

  constructor(
    private customerService: CustomerService,
    private storeService: StoreService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private location: PlatformLocation
  ) {

  }

  ngOnInit(): void {
    this.getCustomers();
    this.createCustomerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      address: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')]]
    });
  }

  getCustomers() {
    this.loading = true;
    let requestParams = [];
    if (this.page) requestParams.push({ page: this.page });
    if (this.pageSize) requestParams.push({ pagesize: this.pageSize });
    if (this.searchName) requestParams.push({ customerName: this.searchName });
    if (this.searchAddress) requestParams.push({ customerAddress: this.searchAddress });
    if (this.searchPhone) requestParams.push({ customerPhone: this.searchPhone });
    this.customerService.getCustomers(requestParams).subscribe(
      (data: any) => {
        this.loading = false;
        this.customers = data.customers || data.pageContent;
        this.customersCount = data.customersCount || data.totalRecords;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  name() {
    return this.createCustomerForm.get('name');
  }

  address() {
    return this.createCustomerForm.get('address');
  }

  phoneNumber() {
    return this.createCustomerForm.get('phoneNumber');
  }

  getCustomerById(id: number) {
      this.storeService.setStore({...this.storeService.getStore(), customerId: id});
      this.router.navigate([`${this.authService.currentUserValue.role}/customer`]);
  }

  changePage() {
    this.getCustomers();
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
    this.location.onPopState(() => this.modalRef.close());
  }

  onSubmitModal() {
    this.customerService.addCustomer({
      customerName: this.name().value,
      customerAddress: this.address().value,
      customerPhone: this.phoneNumber().value
    }).subscribe(() => {
      this.modalRef.close();
      this.createCustomerForm.reset();
      this.getCustomers();
    });
  }

}

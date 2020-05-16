import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../_models/customer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import { CustomerService } from '../_services/customer.service';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent implements OnInit {

  @Input() customerId: number;
  @Input() customer: Customer;
  @Input() role: string;
  editCustomerForm: FormGroup;
  private modalRef: NgbModalRef;
  loading = false;
  editLoading = false;
  errorMessage: string;

  constructor(private fb: FormBuilder,
              private modalService: NgbModal,
              private location: PlatformLocation,
              private customerService: CustomerService) { }

  ngOnInit(): void {
    if (this.role === "customer") {
      this.setCustomerForm(this.customer.customerName, this.customer.customerAddress,
        this.customer.customerPhone);
    } else {
      this.getCustomerById(this.customerId);
    }
  }

  getCustomerById(id: number) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe(
      (customer: Customer) => {
        this.loading = false;
        this.customer = customer;
        this.setCustomerForm(customer.customerName, customer.customerAddress, customer.customerPhone);
        this.errorMessage = null;
      },
      () => {
        this.errorMessage = "Failed to load customer."
        this.loading = false;
      }
    );
  }

  get name() {
    return this.editCustomerForm.get('name');
  }

  get address() {
    return this.editCustomerForm.get('address');
  }

  get phoneNumber() {
    return this.editCustomerForm.get('phoneNumber');
  }

  setCustomerForm(name: string, address: string, phoneNumber: string) {
    this.editCustomerForm = this.fb.group({
      name: [name,
        [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      address: [address,
        [Validators.required, Validators.minLength(15), Validators.maxLength(50)]],
      phoneNumber: [phoneNumber,
        [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')]]
    });
  }

  openEditModal(content: any) {
    this.modalRef = this.modalService.open(content);
    this.location.onPopState(() => {
      this.modalRef.close();
    });
  }

  onSubmitModal() {
    this.editLoading = true;
    let customer: Customer = {
      customerId: this.customer.customerId,
      customerName: this.name.value,
      customerAddress: this.address.value,
      customerPhone: this.phoneNumber.value
    };
    this.customerService.editCustomer(customer)
      .subscribe(() => {
        this.editLoading = false;
        this.modalRef.close();
        this.customer = customer;
        this.errorMessage = null;
      },
      () => {
        this.editLoading = false;
        this.modalRef.close();
        this.errorMessage = "Failed to edit customer."
      });
  }

}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../_models/customer';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../_services/customer.service';
import { Observable, Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit, OnDestroy {

  @ViewChild('customerModal')
  customerModal: ElementRef;
  @Input() editMode: boolean; // Either in edit mode or create mode.
  @Input() customer: Customer;
  @Input() openModal: Observable<void>; // Indicates when to open modal.
  @Output() submitModal = new EventEmitter<Customer>();
  modalRef: NgbModalRef;
  customerForm: FormGroup;
  errorMessage: string;
  private modalSubscription: Subscription;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private modalService: NgbModal,
    private location: PlatformLocation
    ) { }

  ngOnInit(): void {
    this.modalSubscription = this.openModal.subscribe(() => {
      this.open(this.customerModal);
    });
    let name = this.customer? this.customer.customerName: '';
    let address = this.customer? this.customer.customerAddress: '';
    let phoneNumber = this.customer? this.customer.customerPhone: '';
    this.customerForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      address: [address, [Validators.required, Validators.minLength(15), Validators.maxLength(50)]],
      phoneNumber: [phoneNumber, [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')]]
    });
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
  }

  get name() {
    return this.customerForm.get('name');
  }

  get address() {
    return this.customerForm.get('address');
  }

  get phoneNumber() {
    return this.customerForm.get('phoneNumber');
  }

  submitCustomer() {
    this.errorMessage = null;
    this.loading = true;
    let customer: Customer = {
      customerName: this.name.value,
      customerAddress: this.address.value,
      customerPhone: this.phoneNumber.value
    };
    if (this.editMode) {
      customer.customerId = this.customer.customerId;
      this.editCustomer(customer);
    } else {
      this.addCustomer(customer);
    }
  }

  addCustomer(customer: Customer) {
    this.customerService.addCustomer(customer).subscribe(() => {
      this.loading = false;
      this.modalRef.close();
      this.customerForm.reset();
      // Need to tell parent component to make another call to customers.
      this.submitModal.emit();
    },
    (err) => {
      this.loading = false;
      this.errorMessage = "Failed to create customer."
    });
  }

  editCustomer(customer: Customer) {
    this.customerService.editCustomer(customer)
      .subscribe(() => {
        this.loading = false;
        this.modalRef.close();
        this.customer = customer;
        this.submitModal.emit(customer);
      },
      (err) => {
        this.loading = false;
        this.errorMessage = "Failed to edit customer."
      });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content);
    this.location.onPopState(() => this.modalRef.close());
  }

}

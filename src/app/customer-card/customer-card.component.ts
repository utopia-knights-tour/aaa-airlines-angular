import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../_models/customer';
import { CustomerService } from '../_services/customer.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent implements OnInit {

  modalSubject: Subject<void> = new Subject<void>();
  @Input() customerId: number;
  @Input() customer: Customer;
  @Input() role: string;
  loading = false;
  errorMessage: string;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    if (this.role !== "customer") {
      this.getCustomerById(this.customerId);
    }
  }

  getCustomerById(id: number) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe(
      (customer: Customer) => {
        this.customer = customer;
        this.loading = false;
        this.errorMessage = null;
      },
      () => {
        this.errorMessage = "Failed to load customer."
        this.loading = false;
      }
    );
  }

  openModal() {
    this.modalSubject.next();
  }

}

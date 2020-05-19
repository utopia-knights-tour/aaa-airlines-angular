import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../_services/auth.service";
import { CustomerService } from "../_services/customer.service";
import { Customer } from '../_models/customer';

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements OnInit {

  agencyId: number;
  role: string;
  customerId: number;
  customer: Customer;
  loading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.customerId = +params["customerId"];
    });
    let currentUser = this.authService.currentUserValue;
    this.agencyId = currentUser.agencyId;
    this.role = currentUser.role;
    if (this.role === "customer") {
      this.customer = currentUser.customer;
      this.customerId = currentUser.customer.customerId;
    }

  }

  bookFlight() {
    const flightRoutes = {
      counter: [`/${this.authService.currentUserValue.role}/customer`, this.customerId, 'flights'],
      agent: [`/${this.authService.currentUserValue.role}/customer`, this.customerId, 'flights'],
      customer: [`/flights`]
    }
    this.router.navigate(flightRoutes[this.authService.currentUserValue.role]);
  }

}

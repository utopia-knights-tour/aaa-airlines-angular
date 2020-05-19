import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement } from "ngx-stripe";
import { Router, ActivatedRoute } from "@angular/router";

import { PaymentService } from 'src/app/_services/payment.service';
import { AuthService } from 'src/app/_services/auth.service'
import { Flight } from '../_models/flight';
import { FlightService } from '../_services/flight.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  elements: Elements;
  card: StripeElement;
  stripeForm: FormGroup;
  paymentInfo: any;
  result: any;
  flight: Flight;
  agencyId: number;
  customerId: number;
  userCustomerId: any;
  redirects: any;
  role: string;
  flightId: any;
  loading = false;

  constructor(
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.flightId = +params["flightId"];
      this.customerId = +params["customerId"];
    });

    if (!this.customerId) {
      this.userCustomerId = this.authService.currentUserValue.customer.customerId;
    }
   ({ role: this.role, agencyId: this.agencyId } = this.authService.currentUserValue);
    this.flightService.getFlightById(this.flightId)
    .subscribe((flight) => {
      this.flight = flight;
      if (this.authService.currentUserValue.role == 'customer') {
        this.flight = {
          ...flight,
          departureDate: flight.departureDate.substring(0, flight.departureDate.indexOf('T00:')),
        }
      }
      if (this.authService.currentUserValue.role == 'agent') {
        this.flight = {
          ...flight,
          flightId: this.flightId,
          departureDate: Object.values(flight.departureDate).reverse().join('-'),
          sourceAirport: flight.sourceAirport['code'],
          destinationAirport: flight.destinationAirport['code'],
          departureTime:
                ("0" + flight.departureTime['hour']).slice(-2) +
                ":" +
                ("0" + flight.departureTime['minute']).slice(-2) +
                ":" +
                ("0" + flight.departureTime['second']).slice(-2),
              arrivalTime:
              ("0" + flight.arrivalTime['hour']).slice(-2) +
              ":" +
              ("0" + flight.arrivalTime['minute']).slice(-2) +
              ":" +
              ("0" + flight.arrivalTime['second']).slice(-2),

        }
      }
      this.paymentInfo = { ticketInfo: { flightId: this.flightId, customerId: (this.customerId || this.userCustomerId), agencyId: this.agencyId, amount: this.flight.cost * 100 }, paymentMethodId: null }
    });

    this.redirects = {
      agent: ['/agency/customer', this.customerId, 'tickets'],
      counter: ['/counter/customer', this.customerId, 'tickets'],
      customer: ['/tickets']
    }

    this.stripeService.elements()
      .subscribe(elements => {
        this.elements = elements;
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  pay() {
    this.loading = true;
    const paymentInfo = this.paymentInfo;
    this.stripeService
      .createPaymentMethod('card', this.card)
      .subscribe(result => {
        this.loading = false
        const { paymentMethod } = result;
        if (paymentMethod) {
          paymentInfo.paymentMethodId = paymentMethod.id;
          this.loading = true;
          this.paymentService.makePayment(paymentInfo)
            .subscribe(() => {
              this.loading = false;
              this.result = 'Payment successful.';
              this.redirect();
            }, err => {
              this.loading = false;
              console.log(err);
              this.result = 'Payment failed.';
            })
        }
      }, err => {
        this.loading = false;
        console.log(err);
        this.result = 'Payment failed.';
      });
  }

  redirect() {
    this.router.navigate(this.redirects[this.role])
  }
}

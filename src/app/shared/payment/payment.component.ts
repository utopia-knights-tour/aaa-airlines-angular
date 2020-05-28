import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement } from "ngx-stripe";
import { Router, ActivatedRoute } from "@angular/router";

import { PaymentService } from 'src/app/_services/payment.service';
import { AuthService } from 'src/app/_services/auth.service'
import { Flight } from '../../_models/flight';
import { FlightService } from '../../_services/flight.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  elements: Elements;
  card: StripeElement;
  stripeForm: FormGroup;
  result: string;
  flight: Flight;
  agencyId: number;
  customerId: number;
  userCustomerId: number;
  role: string;
  flightId: number;
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
        this.flight = flight
        if (this.authService.currentUserValue.role == 'agent') {
          this.flight = {
            ...flight,
            flightId: this.flightId,
            departureDate: Object.values(flight.departureDate).join('-'),
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
      });



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
    const paymentInfo = { ticketInfo: { flightId: this.flightId, customerId: (this.customerId || this.userCustomerId), agencyId: this.agencyId, amount: Math.round(this.flight.cost * 100) }, paymentMethodId: null }
    this.stripeService
      .createPaymentMethod('card', this.card)
      .subscribe(result => {
        const { paymentMethod } = result;
        if (paymentMethod) {
          paymentInfo.paymentMethodId = paymentMethod.id;
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

    const redirects = {
      agent: ['/agent/customer', this.customerId, 'tickets'],
      counter: ['/counter/customer', this.customerId, 'tickets'],
      customer: ['/customer/tickets']
    }
    this.router.navigate(redirects[this.role])
  }
}

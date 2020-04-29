import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement } from "ngx-stripe";
import { Router } from "@angular/router";

import { PaymentService } from 'src/app/_services/payment.service';
import { AuthService } from 'src/app/_services/auth.service'
import { Flight } from '../_models/flight';

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
  redirects: any;
  role: any = 'agent';

  constructor(private fb: FormBuilder,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log(history.state);
    ({ agencyId: this.agencyId } = this.authService.currentUserValue);
    // customerId get from localstorage, path, query?
    ({ customerId: this.customerId } = history.state);
    const { flight: chosenFlight } = history.state;
    this.redirects = { 
      agency: `/agency/${this.agencyId}/customer/${this.customerId}`,
      counter: `/counter/customer/${this.customerId}`,
      // do we have path for customer tickets page?
      customer: `/tickets/${this.customerId}`
    }

    if (chosenFlight) {
      this.flight = {
      flightId: chosenFlight.flightId,
      sourceAirport: chosenFlight.sourceAirport.airportCode,
      destinationAirport: chosenFlight.destinationAirport.airportCode,
      cost: chosenFlight.cost,
      arrivalDate: chosenFlight.arrivalDate,
      departureDate: chosenFlight.departureDate,
      departureTime: chosenFlight.departureTime,
      arrivalTime: chosenFlight.arrivalTime
    }
  }
  if (this.flight) {
    this.paymentInfo = { ticketInfo: { flightId: this.flight.flightId, customerId: this.customerId, agencyId: this.agencyId, amount: this.flight.cost * 100 }, paymentMethodId: null }
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
    console.log(this.card);
    const paymentInfo = this.paymentInfo;
    this.stripeService
      .createPaymentMethod('card', this.card)
      .subscribe(result => {
        console.log(result);
        const { paymentMethod } = result;
        if (paymentMethod) {
          paymentInfo.paymentMethodId = paymentMethod.id;
          this.paymentService.makePayment(paymentInfo)
            .subscribe(result => {
              console.log(result);
              this.result = 'PAYMENT SUCCEDED';
              this.router.navigate(this.redirects[this.role])
            }, err => {
              console.log(err);
              this.result = 'PAYMENT FAILED';
            })
        }
      }, err => {
        console.log(err);
        this.result = 'PAYMENT FAILED';
      });
  }
}

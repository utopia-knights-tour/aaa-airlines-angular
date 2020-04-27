import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement } from "ngx-stripe";
import { ActivatedRoute } from "@angular/router";

import { PaymentService } from 'src/app/_services/payment.service';
import { FlightService } from 'src/app/_services/flight.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  elements: Elements;
  card: StripeElement;
  stripeTest: FormGroup;
  paymentInfo: any;
  result: any;
  flight: any

  constructor(private fb: FormBuilder,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private flightService : FlightService ) { }

  ngOnInit(): void {
  
    this.flight = this.flightService.retrieveFlight();
    // this.flight = { flightId: 5, source: 'EWR', destination: 'JFK', cost: 276.94, date: '2020-05-05', time: '06:00' }
    this.paymentInfo = { ticketInfo: { flightId: 5, customerId: 16, amount: 27694 }, paymentMethodId: null }
    this.stripeTest = this.fb.group({
        name: ['', [Validators.required],]
      });
    this.stripeService.elements()
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
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
    const name = this.stripeTest.get('name').value;
    const paymentInfo = this.paymentInfo;
    this.stripeService
      .createPaymentMethod('card', this.card, { billing_details: { name } })
      .subscribe(result => {
        if (result.paymentMethod) {
          console.log(result.paymentMethod);
          paymentInfo.paymentMethodId = result.paymentMethod.id;
          this.paymentService.makePayment(paymentInfo)
            .subscribe(result => {
              console.log(result);
              this.result = 'PAYMENT SUCCEDED';
            }, err => {
              console.log(err);
              this.result = 'PAYMENT FAILED';
            })

        }
      });
  }

  clickCancel() {
    this.paymentService.cancelTicket(16, 143)
      .subscribe(result => {
        console.log(result);
        this.result = JSON.stringify(result);
      }, err => {
        console.log(err);
        this.result = JSON.stringify(err.error);
      });

  };
}

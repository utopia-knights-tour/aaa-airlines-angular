import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { TicketsComponent } from './tickets/tickets.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonComponent } from './button/button.component';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { CustomerComponent } from './customer/customer.component';
import { FlightsComponent } from './flights/flights.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimePipe } from '../_pipes/time.pipe'

// This module contains all shared declarables.
@NgModule({
  declarations: [
    PaymentComponent,
    CustomerSearchComponent,
    CustomerCardComponent,
    TicketsComponent,
    FlightCardComponent,
    FlightsComponent,
    SpinnerComponent,
    ButtonComponent,
    CustomerModalComponent,
    CustomerComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.PUBLISHABLE_STRIPE_KEY),
    NgbModule
  ],
  exports: [
    PaymentComponent,
    CustomerSearchComponent,
    CustomerCardComponent,
    TicketsComponent,
    FlightsComponent,
    FlightCardComponent,
    SpinnerComponent,
    ButtonComponent,
    CustomerModalComponent,
    CustomerComponent
  ]
})
export class SharedModule { }

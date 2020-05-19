import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import '@angular/localize/init';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AgencyComponent } from './agency/agency.component';
import { PaymentComponent } from './payment/payment.component';
import { environment } from 'src/environments/environment';
import { PaymentService } from './_services/payment.service';

import { FlightsComponent } from './flights/flights.component';
import { CustomerComponent } from './customer/customer.component';

import { AuthService } from './_services/auth.service';
import { UserService } from './_services/user.service';
import { AgencyService } from './_services/agency.service';
import { AirportService } from './_services/airport.service';
import { FlightService } from './_services/flight.service';
import { NgbDateFormatterService } from './_services/ngb-date-formatter.service';
import { CounterComponent } from './counter/counter.component';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { TicketsComponent } from './tickets/tickets.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonComponent } from './button/button.component';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    AgencyComponent,
    PaymentComponent,
    CustomerComponent,
    FlightsComponent,
    CounterComponent,
    CustomerSearchComponent,
    CustomerCardComponent,
    TicketsComponent,
    FlightCardComponent,
    SpinnerComponent,
    ButtonComponent,
    CustomerModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.PUBLISHABLE_STRIPE_KEY),
  ],
  providers: [
    AuthService,
    UserService,
    AgencyService,
    PaymentService,
    AirportService,
    FlightService,
    NgbDateFormatterService,
    NgbActiveModal,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

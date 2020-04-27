import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import '@angular/localize/init';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MenuComponent } from './menu/menu.component';
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    AgencyComponent,
    PaymentComponent,
    CustomerComponent,
    FlightsComponent
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
    NgbDateFormatterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

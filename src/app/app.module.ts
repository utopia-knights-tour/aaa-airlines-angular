import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import '@angular/localize/init';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MenuComponent } from './menu/menu.component';
import { AgencyComponent } from './agency/agency.component';
import { FlightsComponent } from './flights/flights.component';

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
    FlightsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    UserService,
    AgencyService,
    AirportService,
    FlightService,
    NgbDateFormatterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

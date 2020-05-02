import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { CounterComponent } from "./counter/counter.component";
import { AgencyComponent } from "./agency/agency.component";
import { CustomerComponent } from "./customer/customer.component";
import { PaymentComponent } from "./payment/payment.component";
import { FlightsComponent } from "./flights/flights.component";

import { AuthGuard } from "./_guards/auth.guard";
import { CounterGuard } from "./_guards/counter.guard";
import { AgencyGuard } from "./_guards/agency.guard";


const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "flights",
    canActivate: [AuthGuard],
    component: FlightsComponent,
  },
  {
    path: "flights/:flightId/payment",
    canActivate: [AuthGuard],
    component: PaymentComponent,
  },
  {
    path: "tickets",
    canActivate: [AuthGuard],
    component: CustomerComponent,
  },
  {
    path: "counter/customer/:customerId/flights/:flightId/payment",
    canActivate: [AuthGuard, CounterGuard],
    component: PaymentComponent,
  },
  {
    path: "counter/customer/:customerId/flights",
    canActivate: [AuthGuard, CounterGuard],
    component: FlightsComponent,
  },
  {
    path: "counter/customer/:customerId/tickets",
    canActivate: [AuthGuard, CounterGuard],
    component: CustomerComponent,
  },
  {
    path: "counter",
    canActivate: [AuthGuard, CounterGuard],
    component: CounterComponent,
  },
  {
    path: "agency",
    canActivate: [AuthGuard, AgencyGuard],
    component: AgencyComponent,
  },
  {
    path: "agency/customer/:customerId/tickets",
    canActivate: [AuthGuard, AgencyGuard],
    component: CustomerComponent,
  },
  {
    path: "agency/customer/:customerId/flights",
    canActivate: [AuthGuard, AgencyGuard],
    component: FlightsComponent,
  },
  {
    path: "agency/customer/:customerId/flights/:flightId/payment",
    canActivate: [AuthGuard, AgencyGuard],
    component: PaymentComponent,
  },
  { path: "**", redirectTo: "/login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

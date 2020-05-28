import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CustomerComponent } from "../shared/customer/customer.component";
import { PaymentComponent } from "../shared/payment/payment.component";
import { FlightsComponent } from "../shared/flights/flights.component";

import { CounterGuard } from "../_guards/counter.guard";
import { CustomerSearchComponent } from '../shared/customer-search/customer-search.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [CounterGuard],
    component: CustomerSearchComponent,
  },
  {
    path: "customer/:customerId/flights",
    canActivate: [CounterGuard],
    component: FlightsComponent,
  },
  {
    path: "customer/:customerId/tickets",
    canActivate: [CounterGuard],
    component: CustomerComponent,
  },
  {
    path: "customer/:customerId/flights/:flightId/payment",
    canActivate: [CounterGuard],
    component: PaymentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounterRoutingModule {}

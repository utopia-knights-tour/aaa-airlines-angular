import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CustomerComponent } from "../shared/customer/customer.component";
import { PaymentComponent } from "../shared/payment/payment.component";
import { FlightsComponent } from "../shared/flights/flights.component";

import { AuthGuard } from "../_guards/auth.guard";


const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}

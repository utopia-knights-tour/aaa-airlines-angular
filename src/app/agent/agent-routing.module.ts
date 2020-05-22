import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AgencyComponent } from "./agency/agency.component";
import { CustomerComponent } from "../shared/customer/customer.component";
import { PaymentComponent } from "../shared/payment/payment.component";
import { FlightsComponent } from "../shared/flights/flights.component";

import { AgencyGuard } from "../_guards/agency.guard";


const routes: Routes = [
  {
    path: "",
    component: AgencyComponent,
    canActivate: [AgencyGuard]
  },
  {
    path: "customer/:customerId/tickets",
    component: CustomerComponent,
    canActivate: [AgencyGuard]
  },
  {
    path: "customer/:customerId/flights",
    component: FlightsComponent,
    canActivate: [AgencyGuard]
  },
  {
    path: "customer/:customerId/flights/:flightId/payment",
    component: PaymentComponent,
    canActivate: [AgencyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentRoutingModule {}

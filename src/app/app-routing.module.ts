import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./core/login/login.component";
import { RegisterComponent } from "./core/register/register.component";
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AgencyGuard } from './_guards/agency.guard';
import { AuthGuard } from './_guards/auth.guard';
import { CounterGuard } from './_guards/counter.guard';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
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
    path: "customer",
    loadChildren: () => import("./customer/customer.module").then(m => m.CustomerModule),
    canLoad: [AuthGuard]
  },
  {
    path: "counter",
    loadChildren: () => import("./counter/counter.module").then(m => m.CounterModule),
    canLoad: [CounterGuard]
  },
  {
    path: "agent",
    loadChildren: () => import("./agent/agent.module").then(m => m.AgentModule),
    canLoad: [AgencyGuard]
  },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

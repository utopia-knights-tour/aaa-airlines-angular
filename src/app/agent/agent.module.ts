import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyComponent } from './agency/agency.component';
import { AgentRoutingModule } from './agent-routing.module';
import { AgencyService } from '../_services/agency.service';
import { SharedModule } from '../shared/shared.module';


// Module for agent specific components, routes, etc.
@NgModule({
  declarations: [AgencyComponent],
  imports: [
    CommonModule,
    SharedModule,
    AgentRoutingModule
  ],
  providers: [AgencyService],
  exports: [
    AgentRoutingModule
  ]
})
export class AgentModule { }

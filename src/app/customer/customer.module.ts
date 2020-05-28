import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';

// Module for customer specific components, routes, etc.
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ],
  exports: [
    CustomerRoutingModule
  ]
})
export class CustomerModule { }

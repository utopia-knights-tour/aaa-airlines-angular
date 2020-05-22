import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterRoutingModule } from './counter-routing.module';

// Module for counter specific components, routes, etc.
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CounterRoutingModule
  ],
  exports: [CounterRoutingModule]
})
export class CounterModule { }

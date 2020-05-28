import { Component, Input } from '@angular/core';
import { Flight } from '../../_models/flight';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css']
})
export class FlightCardComponent {

  @Input() flight: Flight;
  @Input() purchaseMode: boolean;
  @Input() role: string;
  @Input() customerId: number;

  constructor(private router: Router) { }

  selectFlight(flightId: number) {
    const routes = {
      counter: ['counter/customer', this.customerId, 'flights', flightId, 'payment'],
      agent: ['agent/customer', this.customerId, 'flights', flightId, 'payment'],
      customer: ['customer/flights', flightId, 'payment']
    }

    this.router.navigate(routes[this.role]);
  }

}

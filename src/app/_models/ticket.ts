import { Flight } from './flight';
import { Customer } from './customer';
import { Agency } from './agency';

export class Ticket {
  ticketId: number;
  flight: Flight;
  customer: Customer;
  agency: Agency;
}

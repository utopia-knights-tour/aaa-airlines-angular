import { Airport } from './airport';

export class Flight {
  flightId: number;
  sourceAirport: Airport;
  destinationAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  arrivalDate: string;
  cost: number;
  seatsAvailable: number;
}

import { TestBed } from '@angular/core/testing';

import { FlightService } from './flight.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Flight } from '../_models/flight';
import { Airport } from '../_models/airport';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

describe('FlightService', () => {

  class AuthServiceStub {

    constructor(){}

    get currentUserValue() { return of({ role: "customer" }) }

  }

  let service: FlightService;
  let authService: AuthService;
  let http: HttpClient;
  const origin: Airport = {
    airportCode: 'LAX',
    airportName: 'Los Angeles International Airport',
    airportLocation: 'Los Angeles, California'
  };
  const destination: Airport = {
    airportCode: 'BOS',
    airportName: 'Boston Logan International Airport',
    airportLocation: 'Boston, MA'
  };
  const flight: Flight = {
    flightId: 1,
    cost: 200,
    arrivalDate: '2021-05-20',
    arrivalTime: '2:00',
    departureDate: '2021-05-20',
    departureTime: '1:00',
    destinationAirport: destination,
    sourceAirport: origin,
    seatsAvailable: 20
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: AuthService, useValue: new AuthServiceStub() }
      ]
    });
    service = TestBed.inject(FlightService);
    http = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make an API call for flights', () => {
    const httpSpy = spyOn(http, "get").and.returnValue(of([flight]));
    const requestParams = [
      'originCode', 'LAX',
      'destinationCode', 'BOS',
      'departureDate', '2021-05-20'
    ];
    service.getFlights(requestParams);
    expect(httpSpy).toHaveBeenCalled();
  });

  it('should make an API call for a specific flight', () => {
    const httpSpy = spyOn(http, "get").and.returnValue(of(flight));
    service.getFlightById(flight.flightId);
    expect(httpSpy)
    .toHaveBeenCalledWith(`${environment.apiUrl}/${authService.currentUserValue.role}/flights/${flight.flightId}`);
  });
});

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) {}

  getFlightsForCounter(originCode:string, destinationCode:string, departureDate:string) {
    let query = `originCode=${originCode}&destinationCode=${destinationCode}&departureDate=${departureDate}`;
    return this.http.get(`https://meksvi4fnh.execute-api.us-east-1.amazonaws.com/dev/counter/flights?${query}`);
  }
}

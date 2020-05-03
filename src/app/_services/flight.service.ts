import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Flight } from '../_models/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFlights(requestParams: Array<string>) {
    console.log(requestParams);
    let queryString = "";
    if (requestParams && requestParams.length) {
      queryString += "?";
      let requestParam = Object.entries(requestParams[0])[0];
      queryString += `${requestParam[0]}=${requestParam[1]}`;
      for (let i = 1; i < requestParams.length; i++) {
        requestParam = Object.entries(requestParams[i])[0];
        queryString += `&${requestParam[0]}=${requestParam[1]}`;
      }
    }
    return this.http.get<Flight[]>(`${environment.apiUrl}/${this.authService.currentUserValue.role}/flights${queryString}`);
  }

  getFlightById(flightId) {
    return this.http.get<Flight>(`${environment.apiUrl}/${this.authService.currentUserValue.role}/flights/${flightId}`)
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private http: HttpClient) {}

  getAirportsForCounter() {
    return this.http.get('https://meksvi4fnh.execute-api.us-east-1.amazonaws.com/dev/counter/airports');
  }

}

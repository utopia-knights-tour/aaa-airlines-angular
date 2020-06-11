import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAirports() {
    return this.http.get(`${environment.apiUrl}/${this.authService.currentUserValue.role}/airports`);
  }
}

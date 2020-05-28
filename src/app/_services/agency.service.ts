import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AgencyService {

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getAgencies() {
    return this.http.get(`${environment.apiUrl}/agent/agencies`);
  }

  getAgencyById(id: number) {
    return this.http.get(`${environment.apiUrl}/${this.authService.currentUserValue.role}/agencies/${id}`);
  }
}

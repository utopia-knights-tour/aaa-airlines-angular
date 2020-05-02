import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class TicketService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getTicketsByCustomerId(customerId: number, requestParams: Array<string>) {
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
    return this.http.get(
      //change this
      `${environment.apiUrl}/${this.authService.currentUserValue.role}/tickets${queryString}&customerId=${customerId}`
    );
  }

  getTicketsByAgencyIdAndCustomerId(agencyId: number, customerId: number, requestParams: Array<string>) {
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
    return this.http.get(
      `https://g0jb7m2tlk.execute-api.us-east-2.amazonaws.com/dev/tickets/agency/${agencyId}/customer/${customerId}${queryString}`
    );
  }
}

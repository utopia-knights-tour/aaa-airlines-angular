import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Customer } from '../_models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getCustomerById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/${this.authService.currentUserValue.role}/customers/${id}`)
  }

  getCustomers(requestParams: Array<string>) {
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
    return this.http.get(`${environment.apiUrl}/${this.authService.currentUserValue.role}/customers${queryString}`);
  }

  addCustomer(customer: Customer) {
    return this.http.post(`${environment.apiUrl}/${this.authService.currentUserValue.role}/customers`, customer);
  }

  editCustomer(customer: Customer) {
    return this.http.put(`${environment.apiUrl}/${this.authService.currentUserValue.role}/customers/
    ${customer.customerId}`, customer);
  }

}

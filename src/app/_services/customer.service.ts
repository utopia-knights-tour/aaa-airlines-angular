import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomerById(id: number) {
    return this.http.get(`https://g0jb7m2tlk.execute-api.us-east-2.amazonaws.com/dev/customers/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  cancelTicket(customerId, ticketId) {
    return this.http.request('delete',
      `https://819t4j4ck8.execute-api.us-east-1.amazonaws.com/default/paymentLambda/${ticketId}`,
      {
        body: { customerId }
      },
    )
  }


  makePayment(paymentInformation) {
    console.log(paymentInformation);
    return this.http.post(
      `https://819t4j4ck8.execute-api.us-east-1.amazonaws.com/default/paymentLambda`,
      paymentInformation,
      {
        headers: new HttpHeaders(
          ({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        )
      })
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  cancelTicket(ticketId) {
    return this.http.request('delete',
      `${environment.apiUrl}/payment/${ticketId}`,
    )
  }


  makePayment(paymentInformation) {
    paymentInformation.ticketInfo = {
      ...paymentInformation.ticketInfo,
      amount: Math.round(paymentInformation.ticketInfo.amount)
    }
    return this.http.post(
      `${environment.apiUrl}/payment`,
      paymentInformation,
      {
        headers: new HttpHeaders(
          ({
            'Content-Type': 'application/json',
          })
        )
      })
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  cancelTicket(customerId, ticketId, agencyId) {
    return this.http.request('delete',
      `${environment.apiUrl}/payment/${ticketId}`,
      {
        body: { customerId, agencyId }
      },
    )
  }


  makePayment(paymentInformation) {
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
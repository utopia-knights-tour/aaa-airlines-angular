import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "../_services/auth.service";
import { CustomerService } from "../_services/customer.service";
import { TicketService } from "../_services/ticket.service";
import { PaymentService } from "../_services/payment.service";

import { User } from "../_models/user";
import { StoreService } from '../_services/store.service';

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements OnInit {
  agencyId: number;
  customerId: number;
  private sub: any;
  role: string;

  customer: any;
  tickets: any;
  ticketsCount: number;
  selectedTicket: number;
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  loading = false;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private ticketService: TicketService,
    private paymentService: PaymentService,
    private storeService: StoreService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    ({agencyId: this.agencyId, customerId: this.customerId} = this.storeService.getStore());
    this.role = this.authService.currentUserValue.role;
    this.getCustomerById(this.customerId);
    this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId);
  }

  getCustomerById(id: number) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe(
      (data) => {
        console.log(data);
        this.loading = false;
        this.customer = data;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getTicketsByAgencyIdAndCustomerId(agencyId: number, customerId: number) {
    this.loading = true;
    let requestParams = [];
    if (this.page) requestParams.push({ page: this.page });
    if (this.pageSize) requestParams.push({ pagesize: this.pageSize });
    if (this.role == "counter") {
      // this.ticketService
      // .getTicketsByCustomerId(customerId, requestParams).subscribe(
      //   (data) => {
      //     console.log(data);
      //     this.loading = false;
      //     this.tickets = data;
      //     this.ticketsCount = this.tickets.length;
      //     console.log(this.tickets);
      //   },
      //   (error) => {
      //     this.loading = false;
      //   }
      // );
    } else if (this.role == "agent") {
      this.ticketService
      .getTicketsByAgencyIdAndCustomerId(agencyId, customerId, requestParams)
      .subscribe(
        (data) => {
          this.loading = false;
          this.tickets = data["tickets"];
          this.ticketsCount = data["ticketsCount"];
        },
        (error) => {
          this.loading = false;
        }
      );
    }
  }

  bookFlight() {
    console.log(this.authService.currentUserValue);
    this.router.navigate(["/flights"]);
  }

  cancelReservation() {
    console.log(this.customerId + " " + this.selectedTicket);
    this.loading = true;
    this.paymentService.cancelTicket(this.customerId, this.selectedTicket, this.agencyId || null)
    .subscribe(
      (data) => {
        console.log(data);
        this.loading = false;
        this.modalRef.close();
        this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId);
      },
      (error) => {
        console.log('err');
        console.log(error);
        this.loading = false;
        this.modalRef.dismiss();
      }
    );
  }

  open(content, id) {
    console.log(id);
    this.selectedTicket = id;
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result) => {
        this.errMsg = "";
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        (this.errMsg = ""), (this.closeResult = `Dismissed`);
      }
    );
  }

  changePage(event: Event) {
    this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId);
  }

}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { CustomerService } from "../_services/customer.service";
import { TicketService } from "../_services/ticket.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements OnInit {
  agencyId: number;
  customerId: number;
  private sub: any;

  customer: any;
  tickets: [];
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
    private customerService: CustomerService,
    private ticketService: TicketService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.agencyId = +params["agencyId"];
      this.customerId = +params["customerId"];
    });
    this.getCustomerById(this.customerId);
    this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId);
  }

  getCustomerById(id: number) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe(
      (data) => {
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
    this.ticketService
      .getTicketsByAgencyIdAndCustomerId(agencyId, customerId, requestParams)
      .subscribe(
        (data) => {
          this.loading = false;
          this.tickets = data["tickets"];
          this.ticketsCount = data["ticketsCount"];
          console.log(this.tickets);
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  cancelReservation() {}

  open(content, id) {
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

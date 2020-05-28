import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../../_models/ticket';
import { TicketService } from '../../_services/ticket.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import { PaymentService } from '../../_services/payment.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  loading = false;
  cancelLoading = false;
  page = 1;
  pageSize = 10;
  tickets: Ticket[];
  ticketsCount: number;
  selectedTicket: number;
  modalRef: NgbModalRef;
  errorMessage: string;
  @Input() agencyId: number;
  @Input() role: string;
  @Input() customerId: number;

  constructor(private ticketService: TicketService,
              private modalService: NgbModal,
              private location: PlatformLocation,
              private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.getTickets(this.agencyId, this.customerId);
  }

  getTickets(agencyId: number, customerId: number) {
    this.loading = true;
    let requestParams = [];
    if (this.page) requestParams.push({ page: this.page });
    if (this.pageSize) requestParams.push({ pagesize: this.pageSize });
    if (this.role == "counter") {
      this.ticketService
        .getTicketsByCustomerId(customerId, requestParams).subscribe(
          (data: any) => {
            this.loading = false;
            this.tickets = data.pageContent;
            this.ticketsCount = data.totalRecords;
            this.errorMessage = null;
          },
          () => {
            this.loading = false;
            this.errorMessage = "Failed to load tickets.";
          });

    } else if (this.role == "agent") {
      this.ticketService
        .getTicketsByAgencyIdAndCustomerId(agencyId, customerId, requestParams)
        .subscribe(
          (data: any) => {
            this.loading = false;
            this.tickets = data.tickets;
            this.ticketsCount = data.ticketsCount;
            this.errorMessage = null;
          },
          () => {
            this.loading = false;
            this.errorMessage = "Failed to load tickets.";
          }
        );
    } else {
      this.ticketService.getTicketsByCustomerId(customerId, [])
      .subscribe(tickets => {
        this.loading = false;
        this.tickets = tickets.map(ticket => {
          return ({
            ticketId: ticket.ticketId,
            flight: {
              departureDate: ticket.departureDate.substring(0, ticket.departureDate.indexOf('T00:')),
              departureTime: ticket.departureTime,
              sourceAirport: {
                airportName: ticket.sourceAirport
              },
              destinationAirport: {
                airportName: ticket.destinationAirport
              }
            }
          });
        });
        this.ticketsCount = tickets.length;
        this.errorMessage = null;
      }),
      () => {
        this.loading = false;
        this.errorMessage = "Failed to load tickets.";
      }
    }
  }

  changePage() {
    this.getTickets(this.agencyId, this.customerId);
  }

  open(content: any, id: number) {
    this.selectedTicket = id;
    this.modalRef = this.modalService.open(content);
    this.location.onPopState(() => {
      this.modalRef.close();
    });
  }

  cancelReservation() {
    this.cancelLoading = true;
    this.paymentService.cancelTicket(this.selectedTicket)
      .subscribe(
        () => {
          this.cancelLoading = false;
          this.modalRef.close();
          this.getTickets(this.agencyId, this.customerId);
          this.errorMessage = null;
        },
        () => {
          this.cancelLoading = false;
          this.modalRef.dismiss();
          this.errorMessage = "Failed to cancel reservation."
        }
      );
  }

}

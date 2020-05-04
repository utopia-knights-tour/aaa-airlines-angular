import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "../_services/auth.service";
import { CustomerService } from "../_services/customer.service";
import { TicketService } from "../_services/ticket.service";
import { PaymentService } from "../_services/payment.service";

import { User } from "../_models/user";
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Customer } from '../_models/customer';
import { PlatformLocation } from '@angular/common';

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
  userCustomerId: any;

  customer: Customer;
  tickets: any;
  ticketsCount: number;
  selectedTicket: number;
  private modalRef: NgbModalRef;
  editCustomerForm: FormGroup;
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
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: PlatformLocation
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.customerId = +params["customerId"];
    });

    if (!this.customerId) {
      this.userCustomerId = this.authService.currentUserValue.customer.customerId;
      this.customer = this.authService.currentUserValue.customer;
      this.editCustomerForm = this.fb.group({
        name: [this.customer.customerName,
          [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        address: [this.customer.customerAddress,
          [Validators.required, Validators.minLength(15), Validators.maxLength(50)]],
        phoneNumber: [this.customer.customerPhone,
          [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')]]
      });
    }
    
    this.agencyId = this.authService.currentUserValue.agencyId;
    this.role = this.authService.currentUserValue.role;
    
    if (!this.userCustomerId) {
      this.getCustomerById(this.customerId);
    }
    this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId || this.userCustomerId);
 }

  name() {
    return this.editCustomerForm.get('name');
  }

  address() {
    return this.editCustomerForm.get('address');
  }

  phoneNumber() {
    return this.editCustomerForm.get('phoneNumber');
  }

  getCustomerById(id: number) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe(
      (data: Customer) => {
        console.log(data);
        if (this.authService.currentUserValue.role === 'agent') {
          data = {
            customerId: data['id'],
            customerName: data['name'],
            customerAddress: data['address'],
            customerPhone: data['phone']
          }
        }
        this.loading = false;
        this.customer = data;
        this.editCustomerForm = this.fb.group({
          name: [this.customer.customerName,
            [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
          address: [this.customer.customerAddress,
            [Validators.required, Validators.minLength(15), Validators.maxLength(50)]],
          phoneNumber: [this.customer.customerPhone,
            [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')]]
        });
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
      this.ticketService
        .getTicketsByCustomerId(customerId, requestParams).subscribe(
          (data) => {

            console.log(data);
            this.loading = false;
            this.tickets = data.pageContent || data;
            this.ticketsCount = this.tickets.length;
            console.log(this.tickets);
          },
          (error) => {
            this.loading = false;
          }
        );
    } else if (this.role == "agent") {
      this.ticketService
        .getTicketsByAgencyIdAndCustomerId(agencyId, customerId, requestParams)
        .subscribe(
          (data) => {
            console.log(data);
            this.loading = false;
            this.tickets = data["tickets"].map((ticket) => {
              return {
                ...ticket,
                flight: {
                  ...ticket.flight,
                  departureDate:
                    ("0" + ticket.flight.departureDate.month).slice(-2) +
                    "/" +
                    ("0" + ticket.flight.departureDate.day).slice(-2) +
                    "/" +
                    ticket.flight.departureDate.year,
                  departureTime:
                    ("0" + ticket.flight.departureTime.hour).slice(-2) +
                    ":" +
                    ("0" + ticket.flight.departureTime.minute).slice(-2) +
                    ":" +
                    ("0" + ticket.flight.departureTime.second).slice(-2),
                },
              }
            })
          },
          (error) => {
            this.loading = false;
          }
        );
    } else {
      this.ticketService.getTicketsByCustomerId(customerId, [])
      .subscribe(tickets => {
        console.log(tickets);
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
        })
        })
        this.ticketsCount = tickets.length;
      }),
       (error) => {
      console.log(error);
    }

    }
  }

  bookFlight() {
    console.log(this.authService.currentUserValue);
    const flightRoutes = {
      counter: [`/${this.authService.currentUserValue.role}/customer`, this.customerId, 'flights'],
      agent: [`/${this.authService.currentUserValue.role}/customer`, this.customerId, 'flights'],
      customer: [`/flights`]
    }
    this.router.navigate(flightRoutes[this.authService.currentUserValue.role]);
  }

  cancelReservation() {
    console.log(this.customerId + " " + this.selectedTicket);
    this.loading = true;
    this.paymentService.cancelTicket(this.customerId || this.userCustomerId, this.selectedTicket, this.agencyId || null)
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.modalRef.close();
          this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId || this.userCustomerId);
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

  openEditModal(content: any) {
      this.modalRef = this.modalService.open(content);
      this.location.onPopState(() => {
        this.modalRef.close();
      })
  }

  changePage(event: Event) {
    this.getTicketsByAgencyIdAndCustomerId(this.agencyId, this.customerId);
  }

  onSubmitModal() {
    this.customerService.editCustomer({
      customerId: this.customer.customerId,
      customerName: this.name().value,
      customerAddress: this.address().value,
      customerPhone: this.phoneNumber().value
    }).subscribe(() => {
      
      if (this.role !== 'customer') {
        this.getCustomerById(this.customerId);
        this.modalRef.close();
      } else {
        this.authService.getCustomerByUserId(this.authService.currentUserValue.userId)
        .subscribe((customer) => {
          this.customer = customer;
          this.modalRef.close();
        })
       
      }
      this.getTicketsByAgencyIdAndCustomerId(this.agencyId, (this.customerId || this.userCustomerId));
    });
  }

}

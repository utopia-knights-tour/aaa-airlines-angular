import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AirportService } from '../_services/airport.service';
import { Airport } from '../_models/airport';
import { AuthService } from '../_services/auth.service';
import { User } from '../_models/user';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FlightService } from '../_services/flight.service';
import { Flight } from '../_models/flight';
import { NgbDateFormatterService } from '../_services/ngb-date-formatter.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  private sub: any;
  customerId: number;
  userCustomerId: number;
  flightForm: FormGroup;
  airports: [Airport];
  flights: Flight[];
  errorMessage: string;
  page = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private airportService: AirportService,
    private flightService: FlightService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dateFormatter: NgbDateFormatterService) { }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe((params) => {
      this.customerId = +params["customerId"];
     
    });


    this.loading = true;
    this.airportService.getAirports().subscribe((airports: [Airport]) => {
      this.loading = false;
      this.airports = airports;
    }, (err) => {
      this.loading = false;
      this.errorMessage = err.message;
    });
    this.flightForm = this.formBuilder.group({
      originCode: [null, Validators.required],
      destinationCode: [null, Validators.required],
      departureDate: [null,
        [Validators.required, this.checkIfDateIsValid]
      ],
    }, {
      validator: this.checkIfAirportsNotEqual
    });
  }

  originCode() {
    return this.flightForm.get('originCode');
  }

  destinationCode() {
    return this.flightForm.get('destinationCode');
  }

  departureDate() {
    return this.flightForm.get('departureDate');
  }

  onFlightSubmit() {
    const originCode = this.originCode().value;
    const destinationCode = this.destinationCode().value;
    const departureDate = this.dateFormatter.format(this.flightForm.get('departureDate').value);
    // Set up query params for AJAX call.
    let requestParams = [];
    requestParams.push({ originCode });
    requestParams.push({ destinationCode });
    requestParams.push({ departureDate });
    // Call to flights service to list all the flights.
    this.flightService.getFlights(requestParams)
      .subscribe((flights) => {
        this.loading = false;
        if (this.authService.currentUserValue.role === 'agent') {
          this.flights = flights.map((flight) => {
            return {
              ...flight,
              flightId: flight['id'],
              departureTime:
                ("0" + flight.departureTime['hour']).slice(-2) +
                ":" +
                ("0" + flight.departureTime['minute']).slice(-2) +
                ":" +
                ("0" + flight.departureTime['second']).slice(-2),
              arrivalTime:
              ("0" + flight.arrivalTime['hour']).slice(-2) +
              ":" +
              ("0" + flight.arrivalTime['minute']).slice(-2) +
              ":" +
              ("0" + flight.arrivalTime['second']).slice(-2),
            }
          })
        }
        else {
          this.flights = flights;
        } 
        

        
      }, (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      });
  }

  checkIfAirportsNotEqual(c: AbstractControl) {
    let originCode = c.get('originCode').value;
    let destinationCode = c.get('destinationCode').value;
    if (!originCode || !destinationCode || originCode != destinationCode) {
      return null;
    }
    return { invalidTrip: true };
  }

  checkIfDateIsValid(c: AbstractControl) {
    if (c.value && c.value.year && c.value.month && c.value.day) {
      let departureDate = new Date(c.value.year, c.value.month - 1, c.value.day);
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0)
      if (departureDate >= currentDate) {
        return null;
      }
    }
    return { invalidDate: true };
  }

  selectFlight(flightId) {
    const routes = {
      counter: ['counter/customer', this.customerId, 'flights', flightId, 'payment'],
      agent: ['agent/customer', this.customerId, 'flights', flightId, 'payment'],
      customer: ['flights', flightId, 'payment']
    }

    this.router.navigate(routes[this.authService.currentUserValue.role]);
  }

}

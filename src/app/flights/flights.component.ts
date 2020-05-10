import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AirportService } from '../_services/airport.service';
import { Airport } from '../_models/airport';
import { AuthService } from '../_services/auth.service';
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

  customerId: number;
  userCustomerId: number;
  flightForm: FormGroup;
  airports: Airport[];
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
    private router: Router,
    private route: ActivatedRoute,
    private dateFormatter: NgbDateFormatterService) { }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.customerId = +params["customerId"];
    });

    this.airportService.getAirports().subscribe((airports: [Airport]) => {
      this.airports = airports;
    }, () => {
      this.errorMessage = "Error loading airports."
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

  get originCode() {
    return this.flightForm.get('originCode');
  }

  get destinationCode() {
    return this.flightForm.get('destinationCode');
  }

  get departureDate() {
    return this.flightForm.get('departureDate');
  }

  getFlights() {
    this.loading = true;
    const originCode = this.originCode.value;
    const destinationCode = this.destinationCode.value;
    const departureDate = this.dateFormatter.format(this.departureDate.value);
    // Set up query params for AJAX call.
    let requestParams = [];
    requestParams.push({ originCode });
    requestParams.push({ destinationCode });
    requestParams.push({ departureDate });
    // Call to flights service to list all the flights.
    this.flightService.getFlights(requestParams)
      .subscribe((flights: Flight[]) => {
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
          });
        } else {
          this.flights = flights;
        }
      }, () => {
        this.loading = false;
        this.errorMessage = "Error loading flights."
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

  selectFlight(flightId: number) {
    const routes = {
      counter: ['counter/customer', this.customerId, 'flights', flightId, 'payment'],
      agent: ['agent/customer', this.customerId, 'flights', flightId, 'payment'],
      customer: ['flights', flightId, 'payment']
    }

    this.router.navigate(routes[this.authService.currentUserValue.role]);
  }

}

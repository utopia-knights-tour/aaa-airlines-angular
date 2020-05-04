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
import { StoreService } from '../_services/store.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  // private sub: any;
  customerId: number;

  flightForm: FormGroup;
  airports: [Airport];
  flights: [Flight];
  errorMessage: string;
  // user: User = {
  //   userId:2,
  //   email: "aaa@aaa.com",
  //   password: null,
  //   role:"counter",
  //   name: null,
  //   token: null
  // }
  user;
  page = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private airportService: AirportService,
    private flightService: FlightService,
    private authService: AuthService,
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dateFormatter: NgbDateFormatterService) {}

  ngOnInit(): void {
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
      .subscribe((flights: [Flight]) => {
        this.loading = false;
        this.flights = flights;
      }, (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      });
  }

  checkIfAirportsNotEqual (c: AbstractControl) {
    let originCode = c.get('originCode').value;
    let destinationCode = c.get('destinationCode').value;
    if (!originCode || !destinationCode || originCode != destinationCode) {
      return null;
    }
    return { invalidTrip: true };
  }

  checkIfDateIsValid (c: AbstractControl) {
    if (c.value && c.value.year && c.value.month && c.value.day) {
      let departureDate = new Date(c.value.year, c.value.month-1, c.value.day);
      let currentDate = new Date();
      currentDate.setHours(0,0,0,0)
      if (departureDate >= currentDate) {
        return null;
      }
    }
    return { invalidDate: true };
  }

  selectFlight(flight) {
    this.storeService.setStore( { ...this.storeService.getStore(), flight: flight})
    this.router.navigate(['/payment']);
  }

}

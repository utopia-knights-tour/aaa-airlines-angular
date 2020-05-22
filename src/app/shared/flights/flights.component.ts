import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AirportService } from '../../_services/airport.service';
import { Airport } from '../../_models/airport';
import { AuthService } from '../../_services/auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FlightService } from '../../_services/flight.service';
import { Flight } from '../../_models/flight';
import { NgbDateFormatterService } from '../../_services/ngb-date-formatter.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  customerId: number;
  flightForm: FormGroup;
  airports: Airport[];
  flights: Flight[];
  errorMessage: string;
  currentOrigin: Airport;
  currentDestination: Airport;
  currentFlightDate: string;
  role: string;
  page = 1;
  pageSize = 10;
  airportsLoading = false;
  flightsLoading = false;

  constructor(
    private airportService: AirportService,
    private flightService: FlightService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dateFormatter: NgbDateFormatterService) { }

  ngOnInit(): void {
    this.airportsLoading = true;
    this.role = this.authService.currentUserValue.role;
    this.route.params.subscribe((params) => {
      this.customerId = +params["customerId"];
    });

    this.airportService.getAirports().subscribe((airports: [Airport]) => {
      this.airports = airports;
      this.airportsLoading = false;
    }, () => {
      this.errorMessage = "Error loading airports."
      this.airportsLoading = false;
    });

    this.flightForm = this.formBuilder.group({
      origin: [null, Validators.required],
      destination: [null, Validators.required],
      departureDate: [null,
        [Validators.required, this.checkIfDateIsValid]
      ],
    }, {
      validator: this.checkIfAirportsNotEqual
    });
  }

  get origin() {
    return this.flightForm.get('origin');
  }

  get destination() {
    return this.flightForm.get('destination');
  }

  get departureDate() {
    return this.flightForm.get('departureDate');
  }

  getFlights() {
    this.flightsLoading = true;
    this.errorMessage = null;
    const originCode = this.origin.value.airportCode;
    const destinationCode = this.destination.value.airportCode;
    const departureDate = this.dateFormatter.format(this.departureDate.value);
    // Set up query params
    let requestParams = [];
    requestParams.push({ originCode });
    requestParams.push({ destinationCode });
    requestParams.push({ departureDate });
    // Call to flights service to list all the flights.
    this.flightService.getFlights(requestParams)
      .subscribe((flights: Flight[]) => {
        this.flightsLoading = false;
        this.flights = flights;
      }, () => {
        this.flightsLoading = false;
        this.flights = null;
        this.errorMessage = "Error loading flights."
      });
    // Variables used for user reloads.
    this.currentOrigin = this.origin.value;
    this.currentDestination = this.destination.value;
    this.currentFlightDate = departureDate;
  }

  reloadFlights() {
    this.flightsLoading = true;
    this.errorMessage = null;
    const originCode = this.currentOrigin.airportCode;
    const destinationCode = this.currentDestination.airportCode;
    const departureDate = this.currentFlightDate;
    // Set up query params
    let requestParams = [];
    requestParams.push({ originCode });
    requestParams.push({ destinationCode });
    requestParams.push({ departureDate });
    // Call to flights service to reload all the flights.
    this.flightService.getFlights(requestParams)
      .subscribe((flights: Flight[]) => {
        this.flightsLoading = false;
        this.flights = flights;
      }, () => {
        this.flightsLoading = false;
        this.flights = null;
        this.errorMessage = "Error reloading flights."
      });
  }

  checkIfAirportsNotEqual(c: AbstractControl) {
    let origin = c.get("origin").value;
    let destination = c.get("destination").value;
    if (!origin || !destination || origin != destination) {
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

}

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

  getFlights(reload?: Boolean) {
    this.flightsLoading = true;
    this.errorMessage = null;
    const originCode = reload? this.currentOrigin.airportCode: this.origin.value.airportCode;
    const destinationCode = reload? this.currentDestination.airportCode: this.destination.value.airportCode;
    const departureDate = reload? this.currentFlightDate: this.dateFormatter.format(this.departureDate.value);
    // Set up query params
    const requestParams = [];
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
    if (!reload) {
      this.currentOrigin = this.origin.value;
      this.currentDestination = this.destination.value;
      this.currentFlightDate = departureDate;
    }
  }

  checkIfAirportsNotEqual(c: AbstractControl) {
    const origin = c.get("origin").value;
    const destination = c.get("destination").value;
    if (!origin || !destination || origin != destination) {
      return null;
    }
    return { invalidTrip: true };
  }

  checkIfDateIsValid(c: AbstractControl) {
    const date = c.value;
    if (date && date.year && date.month && date.day) {
      const departureDate = new Date(date.year, date.month - 1, date.day);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0)
      if (departureDate >= currentDate) {
        return null;
      }
    }
    return { invalidDate: true };
  }

}

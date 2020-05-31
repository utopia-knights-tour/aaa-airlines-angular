import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsComponent } from './flights.component';
import { AirportService } from 'src/app/_services/airport.service';
import { FlightService } from 'src/app/_services/flight.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, SelectControlValueAccessor } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/_services/auth.service';
import { of } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFormatterService } from 'src/app/_services/ngb-date-formatter.service';
import { Airport } from 'src/app/_models/airport';
import { By } from '@angular/platform-browser';
import { Flight } from 'src/app/_models/flight';
import { DebugElement } from '@angular/core';

describe('FlightsComponent', () => {

  class AuthServiceStub {

    constructor(){}

    public get currentUserValue() { return of({ role: "customer" }) }

  }

  let airportService: AirportService;
  let flightService: FlightService;
  let formBuilder: FormBuilder;
  let component: FlightsComponent;
  let dateFormatter: NgbDateFormatterService;
  let fixture: ComponentFixture<FlightsComponent>;
  let debugElem: DebugElement;
  let origin: Airport = {
    airportCode: 'LAX',
    airportName: 'Los Angeles International Airport',
    airportLocation: 'Los Angeles, California'
  };
  let destination: Airport = {
    airportCode: 'BOS',
    airportName: 'Boston Logan International Airport',
    airportLocation: 'Boston, MA'
  };
  let flight: Flight = {
    flightId: 1,
    cost: 200,
    arrivalDate: '2020-05-20',
    arrivalTime: '2:00',
    departureDate: '2020-05-20',
    departureTime: '1:00',
    destinationAirport: destination,
    sourceAirport: origin,
    seatsAvailable: 20
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsComponent ],
      providers: [
        FlightService,
        AirportService,
        NgbDateFormatterService,
        { provide: AuthService, useValue: new AuthServiceStub() }
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        NgbModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    airportService = TestBed.get(AirportService);
    flightService = TestBed.get(FlightService);
    formBuilder = TestBed.get(FormBuilder);
    dateFormatter = TestBed.get(NgbDateFormatterService);
    debugElem = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make a call for airportSerice on ngOnInit()', () => {
    const mySpy = spyOn(airportService, 'getAirports').and.returnValue(of([]));
    component.ngOnInit();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });

  it('should instantiate a form group with three controls on ngOnInit()', () => {
    spyOn(airportService, 'getAirports').and.returnValue(of([]));
    component.ngOnInit();
    expect(component.flightForm.get('origin')).toBeDefined();
    expect(component.flightForm.get('destination')).toBeDefined();
    expect(component.flightForm.get('departureDate')).toBeDefined();
  });

  it('checkIfAirportsNotEqual validator should return non-null value when origin and \
  destination airports are the same', () => {
    const control = formBuilder.group({
      origin: "LAX",
      destination: "LAX"
    });
    expect(component.checkIfAirportsNotEqual(control)).toEqual({ invalidTrip: true });
  });

  it('checkIfAirportsNotEqual validator should return null when origin and \
  destination airports are different', () => {
    const control = formBuilder.group({
      origin: "JFK",
      destination: "LAX"
    });
    expect(component.checkIfAirportsNotEqual(control)).toBeNull();
  });

  it('checkIfDateIsValid validator should have a non-null return value when date is in the past', () => {
    const control = formBuilder.control({
        year: 2020,
        month: 1,
        day: 27
      });
    expect(component.checkIfDateIsValid(control)).toEqual({ invalidDate: true });
  });

  it('checkIfDateIsValid validator should return null when date is not in the past', () => {
    const control = formBuilder.control({
        year: 2022,
        month: 1,
        day: 27
      });
      expect(component.checkIfDateIsValid(control)).toBeNull();
  });

  it('should make a call to flightService on getFlights()', () => {
    const mySpy = spyOn(flightService, 'getFlights').and.returnValue(of([]));
    component.flightForm = formBuilder.group({
      origin: 'LAX',
      destination: 'JFK',
      departureDate: {
        year: 2020,
        month: 5,
        day: 22
      }
    });
    spyOn(dateFormatter, 'format').and.returnValue('2020-05-22');
    component.getFlights();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });

  it('should make a call to flightService on reloadFlights()', () => {
    const mySpy = spyOn(flightService, 'getFlights').and.returnValue(of([]));
    component.currentOrigin = origin;
    component.currentDestination = destination;
    component.currentFlightDate = '2020-05-22';
    component.reloadFlights();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });

  it('should have header "Choose a Flight"', () => {
    let header = debugElem.query(By.css('h2'));
    expect(header.nativeElement.textContent).toEqual("Choose a Flight");
  });

  it('should render a form with three inputs', () => {
    // Airports need to be loaded so that form is present in the UI
    spyOn(airportService, 'getAirports').and.returnValue(of([]));
    component.ngOnInit();
    // Need to run a change detection cycle to render displayed airports
    fixture.detectChanges();
    let formControls = debugElem.queryAll(By.css('.form-control'));
    expect(formControls.length).toBe(3);
  });

  it('select elements should render list of airports returned from airportService', () => {
    let airports: Airport[] = [ origin, destination ];
    spyOn(airportService, 'getAirports').and.returnValue(of(airports));
    component.ngOnInit();
    fixture.detectChanges();
    let options = debugElem.query(By.css('select')).queryAll(By.css('option'));
    expect(options.length).toBe(3);
  });

  it('select option should be rendered with the correct text', () => {
    let airports: Airport[] = [ origin ];
    spyOn(airportService, 'getAirports').and.returnValue(of(airports));
    component.ngOnInit();
    fixture.detectChanges();
    let airportOption = debugElem.query(By.css('select')).queryAll(By.css('option'))[1];
    let text = airportOption.nativeElement.textContent.trim();
    expect(text).toEqual(`${origin.airportCode} - ${origin.airportName}`);
  });

  it('should render list of flights on form submission', () => {
    let airports: Airport[] = [ origin, destination ];
    spyOn(airportService, 'getAirports').and.returnValue(of(airports));
    component.ngOnInit();
    fixture.detectChanges();
    component.flightForm = formBuilder.group({
      origin: 'LAX',
      destination: 'JFK',
      departureDate: {
        year: 2025,
        month: 5,
        day: 22
      }
    });
    fixture.detectChanges();
    spyOn(flightService, 'getFlights').and.returnValue(of([flight]));
    spyOn(dateFormatter, 'format').and.returnValue('2025-05-22');
    let form = debugElem.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();
    let flightCards = debugElem.queryAll(By.css('app-flight-card'));
    expect(flightCards.length).toBeTruthy();
  });

  it('should render "No flights found." when flights list is empty', () => {
    let airports: Airport[] = [];
    spyOn(airportService, 'getAirports').and.returnValue(of(airports));
    component.ngOnInit();
    fixture.detectChanges();
    component.flightForm = formBuilder.group({
      origin: 'LAX',
      destination: 'JFK',
      departureDate: {
        year: 2025,
        month: 5,
        day: 22
      }
    });
    fixture.detectChanges();
    spyOn(flightService, 'getFlights').and.returnValue(of([]));
    spyOn(dateFormatter, 'format').and.returnValue('2025-05-22');
    let form = debugElem.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();
    let message = debugElem.query(By.css('#no-flights-msg'));
    expect(message).toBeTruthy();
  });

});

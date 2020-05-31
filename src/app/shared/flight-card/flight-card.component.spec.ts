import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCardComponent } from './flight-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, ViewChild, DebugElement } from '@angular/core';
import { Airport } from 'src/app/_models/airport';
import { Flight } from 'src/app/_models/flight';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('FlightCardComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostDebugElem: DebugElement;
  let flight: Flight;
  let flightCard: DebugElement;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCardComponent, TestHostComponent ],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    hostDebugElem = hostFixture.debugElement;
    flightCard = hostDebugElem.query(By.css('app-flight-card'));
    flight = hostComponent.flight;
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(hostComponent.flightCard).toBeTruthy();
  });

  it('should render the correct flight id', () => {
    let title = flightCard.query(By.css('.card-title')).nativeElement.textContent;
    expect(title).toEqual(`Flight #${flight.flightId}`);
  });

  it('should render the correct time details', () => {
    let text = flightCard.query(By.css('.card-text')).nativeElement.textContent.trim();
    expect(text).toEqual(`${flight.departureDate} ${flight.departureTime}-${flight.arrivalTime} UTC`);
  });

  it('should render the correct price', () => {
    let text = flightCard.query(By.css('.card-text > p')).nativeElement.textContent.trim();
    expect(text).toEqual(`$${flight.cost}`);
  });

  it('selecting flight card should redirect user', () => {
    let button = flightCard.query(By.css('.card-text > button'));
    let routerSpy = spyOn(router, 'navigate');
    button.triggerEventHandler('click', {});
    expect(routerSpy).toHaveBeenCalledWith(['customer/flights', flight.flightId, 'payment']);
  });

  @Component({
    selector: 'host-component',
    template: `<app-flight-card [flight]="flight" [role]="'customer'" [customerId]="1"></app-flight-card>`
  })
  class TestHostComponent {
    origin: Airport = {
      airportCode: 'LAX',
      airportName: 'Los Angeles International Airport',
      airportLocation: 'Los Angeles, California'
    };
    destination: Airport = {
      airportCode: 'BOS',
      airportName: 'Boston Logan International Airport',
      airportLocation: 'Boston, MA'
    };
    flight: Flight = {
      flightId: 1,
      cost: 200,
      arrivalDate: '2020-05-20',
      arrivalTime: '2:00',
      departureDate: '2020-05-20',
      departureTime: '1:00',
      destinationAirport: this.destination,
      sourceAirport: this.origin,
      seatsAvailable: 20
    };
    @ViewChild(FlightCardComponent)
    public flightCard: FlightCardComponent;
  }

});

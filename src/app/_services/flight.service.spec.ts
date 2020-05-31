import { TestBed } from '@angular/core/testing';

import { FlightService } from './flight.service';
import { HttpClientModule } from '@angular/common/http';

xdescribe('FlightService', () => {
  let service: FlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(FlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AgencyService } from './agency.service';
import { HttpClientModule } from '@angular/common/http';

xdescribe('AgencyService', () => {
  let service: AgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

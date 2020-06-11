import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customer.service';
import { HttpClientModule } from '@angular/common/http';

xdescribe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

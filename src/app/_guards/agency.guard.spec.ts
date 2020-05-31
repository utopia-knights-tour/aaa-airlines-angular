import { TestBed } from '@angular/core/testing';

import { AgencyGuard } from './agency.guard';

xdescribe('AgencyGuard', () => {
  let guard: AgencyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AgencyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

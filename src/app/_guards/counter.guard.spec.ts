import { TestBed } from '@angular/core/testing';

import { CounterGuard } from './counter.guard';

xdescribe('CounterGuard', () => {
  let guard: CounterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CounterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

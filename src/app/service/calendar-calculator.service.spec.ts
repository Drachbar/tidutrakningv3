import { TestBed } from '@angular/core/testing';

import { CalendarCalculatorService } from './calendar-calculator.service';

describe('CalendarCalculatorService', () => {
  let service: CalendarCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

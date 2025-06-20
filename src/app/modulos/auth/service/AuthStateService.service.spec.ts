/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthStateServiceService } from './AuthStateService.service';

describe('Service: AuthStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStateServiceService]
    });
  });

  it('should ...', inject([AuthStateServiceService], (service: AuthStateServiceService) => {
    expect(service).toBeTruthy();
  }));
});

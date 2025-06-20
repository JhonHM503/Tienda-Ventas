import { TestBed } from '@angular/core/testing';

import { MedioPagoService } from './medio-pago.service';

describe('MedioPagoService', () => {
  let service: MedioPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedioPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

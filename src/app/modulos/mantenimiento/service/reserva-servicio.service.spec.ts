import { TestBed } from '@angular/core/testing';

import { ReservaServicioService } from './reserva-servicio.service';

describe('ReservaServicioService', () => {
  let service: ReservaServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

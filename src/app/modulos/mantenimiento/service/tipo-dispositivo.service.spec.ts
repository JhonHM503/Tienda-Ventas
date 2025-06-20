import { TestBed } from '@angular/core/testing';

import { TipoDispositivoService } from './tipo-dispositivo.service';

describe('TipoDispositivoService', () => {
  let service: TipoDispositivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDispositivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

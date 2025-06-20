import { TestBed } from '@angular/core/testing';

import { ModeloDispositivoService } from './modelo-dispositivo.service';

describe('ModeloDispositivoService', () => {
  let service: ModeloDispositivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeloDispositivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

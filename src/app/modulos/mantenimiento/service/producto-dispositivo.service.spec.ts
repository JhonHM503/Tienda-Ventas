import { TestBed } from '@angular/core/testing';

import { ProductoDispositivoService } from './producto-dispositivo.service';

describe('ProductoDispositivoService', () => {
  let service: ProductoDispositivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoDispositivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

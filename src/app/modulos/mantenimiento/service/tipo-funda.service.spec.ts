import { TestBed } from '@angular/core/testing';

import { TipoFundaService } from './tipo-funda.service';

describe('TipoFundaService', () => {
  let service: TipoFundaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoFundaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

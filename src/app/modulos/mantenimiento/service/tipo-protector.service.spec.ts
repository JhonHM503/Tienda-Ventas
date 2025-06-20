import { TestBed } from '@angular/core/testing';

import { TipoProtectorService } from './tipo-protector.service';

describe('TipoProtectorService', () => {
  let service: TipoProtectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoProtectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

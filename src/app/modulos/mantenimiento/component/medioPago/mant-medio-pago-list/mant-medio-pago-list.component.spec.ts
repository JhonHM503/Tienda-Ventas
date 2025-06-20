import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantMedioPagoListComponent } from './mant-medio-pago-list.component';

describe('MantMedioPagoListComponent', () => {
  let component: MantMedioPagoListComponent;
  let fixture: ComponentFixture<MantMedioPagoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantMedioPagoListComponent]
    });
    fixture = TestBed.createComponent(MantMedioPagoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

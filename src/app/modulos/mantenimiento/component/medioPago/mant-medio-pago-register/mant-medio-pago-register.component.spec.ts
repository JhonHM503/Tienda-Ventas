import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantMedioPagoRegisterComponent } from './mant-medio-pago-register.component';

describe('MantMedioPagoRegisterComponent', () => {
  let component: MantMedioPagoRegisterComponent;
  let fixture: ComponentFixture<MantMedioPagoRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantMedioPagoRegisterComponent]
    });
    fixture = TestBed.createComponent(MantMedioPagoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

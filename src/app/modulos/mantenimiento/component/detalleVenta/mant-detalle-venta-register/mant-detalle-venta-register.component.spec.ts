import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantDetalleVentaRegisterComponent } from './mant-detalle-venta-register.component';

describe('MantDetalleVentaRegisterComponent', () => {
  let component: MantDetalleVentaRegisterComponent;
  let fixture: ComponentFixture<MantDetalleVentaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantDetalleVentaRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantDetalleVentaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

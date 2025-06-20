import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantDetalleVentaLsitComponent } from './mant-detalle-venta-lsit.component';

describe('MantDetalleVentaLsitComponent', () => {
  let component: MantDetalleVentaLsitComponent;
  let fixture: ComponentFixture<MantDetalleVentaLsitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantDetalleVentaLsitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantDetalleVentaLsitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

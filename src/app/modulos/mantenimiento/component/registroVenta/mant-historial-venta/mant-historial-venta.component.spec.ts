import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantHistorialVentaComponent } from './mant-historial-venta.component';

describe('MantHistorialVentaComponent', () => {
  let component: MantHistorialVentaComponent;
  let fixture: ComponentFixture<MantHistorialVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantHistorialVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantHistorialVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

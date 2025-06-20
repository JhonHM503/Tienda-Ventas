import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantRegistroVentaComponent } from './mant-registro-venta.component';

describe('MantRegistroVentaComponent', () => {
  let component: MantRegistroVentaComponent;
  let fixture: ComponentFixture<MantRegistroVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantRegistroVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantRegistroVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

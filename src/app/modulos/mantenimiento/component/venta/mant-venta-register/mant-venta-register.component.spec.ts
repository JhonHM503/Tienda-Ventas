import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantVentaRegisterComponent } from './mant-venta-register.component';

describe('MantVentaRegisterComponent', () => {
  let component: MantVentaRegisterComponent;
  let fixture: ComponentFixture<MantVentaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantVentaRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantVentaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantImagenRegisterComponent } from './mant-imagen-register.component';

describe('MantImagenRegisterComponent', () => {
  let component: MantImagenRegisterComponent;
  let fixture: ComponentFixture<MantImagenRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantImagenRegisterComponent]
    });
    fixture = TestBed.createComponent(MantImagenRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

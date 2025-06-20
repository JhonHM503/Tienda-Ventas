import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantProductoRegisterComponent } from './mant-producto-register.component';

describe('MantProductoRegisterComponent', () => {
  let component: MantProductoRegisterComponent;
  let fixture: ComponentFixture<MantProductoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantProductoRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantProductoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

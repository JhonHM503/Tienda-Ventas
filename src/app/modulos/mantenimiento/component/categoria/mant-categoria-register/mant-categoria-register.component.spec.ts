import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantCategoriaRegisterComponent } from './mant-categoria-register.component';

describe('MantCategoriaRegisterComponent', () => {
  let component: MantCategoriaRegisterComponent;
  let fixture: ComponentFixture<MantCategoriaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantCategoriaRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantCategoriaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralVentasComponent } from './general-ventas.component';

describe('GeneralVentasComponent', () => {
  let component: GeneralVentasComponent;
  let fixture: ComponentFixture<GeneralVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

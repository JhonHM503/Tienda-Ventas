import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantImagenListComponent } from './mant-imagen-list.component';

describe('MantImagenListComponent', () => {
  let component: MantImagenListComponent;
  let fixture: ComponentFixture<MantImagenListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantImagenListComponent]
    });
    fixture = TestBed.createComponent(MantImagenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

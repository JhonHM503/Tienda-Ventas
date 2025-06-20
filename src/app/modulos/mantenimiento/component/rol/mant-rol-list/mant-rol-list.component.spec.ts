import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantRolListComponent } from './mant-rol-list.component';

describe('MantRolListComponent', () => {
  let component: MantRolListComponent;
  let fixture: ComponentFixture<MantRolListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantRolListComponent]
    });
    fixture = TestBed.createComponent(MantRolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

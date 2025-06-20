import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantPersonaListComponent } from './mant-persona-list.component';

describe('MantPersonaListComponent', () => {
  let component: MantPersonaListComponent;
  let fixture: ComponentFixture<MantPersonaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantPersonaListComponent]
    });
    fixture = TestBed.createComponent(MantPersonaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantProductoListComponent } from './mant-producto-list.component';

describe('MantProductoListComponent', () => {
  let component: MantProductoListComponent;
  let fixture: ComponentFixture<MantProductoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantProductoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantProductoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantCategoriaListComponent } from './mant-categoria-list.component';

describe('MantCategoriaListComponent', () => {
  let component: MantCategoriaListComponent;
  let fixture: ComponentFixture<MantCategoriaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantCategoriaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantCategoriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

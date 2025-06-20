import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFooterComponent } from './template-footer.component';

describe('TemplateFooterComponent', () => {
  let component: TemplateFooterComponent;
  let fixture: ComponentFixture<TemplateFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateFooterComponent]
    });
    fixture = TestBed.createComponent(TemplateFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

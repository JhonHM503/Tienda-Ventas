import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeTemplateComponent } from './template.component';

describe('TemplateComponent', () => {
  let component: WelcomeTemplateComponent;
  let fixture: ComponentFixture<WelcomeTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeTemplateComponent]
    });
    fixture = TestBed.createComponent(WelcomeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

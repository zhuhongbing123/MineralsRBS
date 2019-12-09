import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyReportComponent } from './policy-report.component';

describe('PolicyReportComponent', () => {
  let component: PolicyReportComponent;
  let fixture: ComponentFixture<PolicyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

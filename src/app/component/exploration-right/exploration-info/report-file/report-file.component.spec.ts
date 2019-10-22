import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFileComponent } from './report-file.component';

describe('ReportFileComponent', () => {
  let component: ReportFileComponent;
  let fixture: ComponentFixture<ReportFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

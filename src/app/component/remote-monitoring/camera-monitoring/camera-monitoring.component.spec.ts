import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraMonitoringComponent } from './camera-monitoring.component';

describe('CameraMonitoringComponent', () => {
  let component: CameraMonitoringComponent;
  let fixture: ComponentFixture<CameraMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

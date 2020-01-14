import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentMonitoringComponent } from './environment-monitoring.component';

describe('EnvironmentMonitoringComponent', () => {
  let component: EnvironmentMonitoringComponent;
  let fixture: ComponentFixture<EnvironmentMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

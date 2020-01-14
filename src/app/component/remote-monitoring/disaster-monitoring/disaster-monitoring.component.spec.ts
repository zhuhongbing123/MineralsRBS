import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasterMonitoringComponent } from './disaster-monitoring.component';

describe('DisasterMonitoringComponent', () => {
  let component: DisasterMonitoringComponent;
  let fixture: ComponentFixture<DisasterMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisasterMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisasterMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

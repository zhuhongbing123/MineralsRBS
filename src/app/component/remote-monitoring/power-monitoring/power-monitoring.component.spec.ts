import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerMonitoringComponent } from './power-monitoring.component';

describe('PowerMonitoringComponent', () => {
  let component: PowerMonitoringComponent;
  let fixture: ComponentFixture<PowerMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

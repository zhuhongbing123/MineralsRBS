import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningStatisticsComponent } from './mining-statistics.component';

describe('MiningStatisticsComponent', () => {
  let component: MiningStatisticsComponent;
  let fixture: ComponentFixture<MiningStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiningStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

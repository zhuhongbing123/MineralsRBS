import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationInfoComponent } from './exploration-info.component';

describe('ExplorationInfoComponent', () => {
  let component: ExplorationInfoComponent;
  let fixture: ComponentFixture<ExplorationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

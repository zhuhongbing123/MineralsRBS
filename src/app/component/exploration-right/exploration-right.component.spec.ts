import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationRightComponent } from './exploration-right.component';

describe('ExplorationRightComponent', () => {
  let component: ExplorationRightComponent;
  let fixture: ComponentFixture<ExplorationRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorationRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorationRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

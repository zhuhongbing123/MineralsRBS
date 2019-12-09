import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationDetailsComponent } from './exploration-details.component';

describe('ExplorationDetailsComponent', () => {
  let component: ExplorationDetailsComponent;
  let fixture: ComponentFixture<ExplorationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDmapComponent } from './three-dmap.component';

describe('ThreeDmapComponent', () => {
  let component: ThreeDmapComponent;
  let fixture: ComponentFixture<ThreeDmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeDmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeDmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

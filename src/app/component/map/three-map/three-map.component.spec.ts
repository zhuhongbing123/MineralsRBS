import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeMapComponent } from './three-map.component';

describe('ThreeMapComponent', () => {
  let component: ThreeMapComponent;
  let fixture: ComponentFixture<ThreeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

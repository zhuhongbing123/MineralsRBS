import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Map2DComponent } from './map2-d.component';

describe('Map2DComponent', () => {
  let component: Map2DComponent;
  let fixture: ComponentFixture<Map2DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Map2DComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Map2DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

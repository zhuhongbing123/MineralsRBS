import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningInfoComponent } from './mining-info.component';

describe('MiningInfoComponent', () => {
  let component: MiningInfoComponent;
  let fixture: ComponentFixture<MiningInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiningInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

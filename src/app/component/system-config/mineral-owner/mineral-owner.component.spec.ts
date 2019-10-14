import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MineralOwnerComponent } from './mineral-owner.component';

describe('MineralOwnerComponent', () => {
  let component: MineralOwnerComponent;
  let fixture: ComponentFixture<MineralOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MineralOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MineralOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

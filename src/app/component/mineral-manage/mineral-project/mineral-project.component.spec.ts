import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MineralProjectComponent } from './mineral-project.component';

describe('MineralProjectComponent', () => {
  let component: MineralProjectComponent;
  let fixture: ComponentFixture<MineralProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MineralProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MineralProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

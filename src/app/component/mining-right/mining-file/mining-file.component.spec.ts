import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningFileComponent } from './mining-file.component';

describe('MiningFileComponent', () => {
  let component: MiningFileComponent;
  let fixture: ComponentFixture<MiningFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiningFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

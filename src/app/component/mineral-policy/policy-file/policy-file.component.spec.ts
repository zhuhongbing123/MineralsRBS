import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFileComponent } from './policy-file.component';

describe('PolicyFileComponent', () => {
  let component: PolicyFileComponent;
  let fixture: ComponentFixture<PolicyFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

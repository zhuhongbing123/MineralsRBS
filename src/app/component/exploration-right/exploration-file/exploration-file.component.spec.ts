import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationFileComponent } from './exploration-file.component';

describe('ExplorationFileComponent', () => {
  let component: ExplorationFileComponent;
  let fixture: ComponentFixture<ExplorationFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorationFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

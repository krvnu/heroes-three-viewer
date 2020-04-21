import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitGridComponent } from './unit-grid.component';

describe('UnitGridComponent', () => {
  let component: UnitGridComponent;
  let fixture: ComponentFixture<UnitGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

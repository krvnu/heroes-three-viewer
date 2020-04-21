import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDialog } from './unit-dialog.component';

describe('UnitDialogComponent', () => {
  let component: UnitDialog;
  let fixture: ComponentFixture<UnitDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

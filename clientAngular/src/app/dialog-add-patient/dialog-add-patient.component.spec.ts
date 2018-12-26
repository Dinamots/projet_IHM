import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPatientComponent } from './dialog-add-patient.component';

describe('DialogAddPatientComponent', () => {
  let component: DialogAddPatientComponent;
  let fixture: ComponentFixture<DialogAddPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

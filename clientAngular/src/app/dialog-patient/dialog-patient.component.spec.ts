import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPatientComponent } from './dialog-patient.component';

describe('DialogPatientComponent', () => {
  let component: DialogPatientComponent;
  let fixture: ComponentFixture<DialogPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfirmiersListComponent } from './infirmiers-list.component';

describe('InfirmiersListComponent', () => {
  let component: InfirmiersListComponent;
  let fixture: ComponentFixture<InfirmiersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfirmiersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfirmiersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

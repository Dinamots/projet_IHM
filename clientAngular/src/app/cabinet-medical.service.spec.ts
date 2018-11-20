import { TestBed } from '@angular/core/testing';

import { CabinetMedicalService } from './cabinet-medical.service';

describe('CabinetMedicalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CabinetMedicalService = TestBed.get(CabinetMedicalService);
    expect(service).toBeTruthy();
  });
});

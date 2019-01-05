import { TestBed } from '@angular/core/testing';

import { InfirmierService } from './infirmier.service';

describe('InfirmierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfirmierService = TestBed.get(InfirmierService);
    expect(service).toBeTruthy();
  });
});

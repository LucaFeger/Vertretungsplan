import { TestBed } from '@angular/core/testing';

import { InfoalertService } from './infoalert.service';

describe('InfoalertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoalertService = TestBed.get(InfoalertService);
    expect(service).toBeTruthy();
  });
});

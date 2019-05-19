import { TestBed } from '@angular/core/testing';

import { EntrySetupService } from './entry-setup.service';

describe('EntrySetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntrySetupService = TestBed.get(EntrySetupService);
    expect(service).toBeTruthy();
  });
});

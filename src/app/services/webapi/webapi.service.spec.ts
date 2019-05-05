import { TestBed } from '@angular/core/testing';

import { WebApiService } from './webapi.service';

describe('WebapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebApiService = TestBed.get(WebApiService);
    expect(service).toBeTruthy();
  });
});

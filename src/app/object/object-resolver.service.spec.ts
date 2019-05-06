import { TestBed } from '@angular/core/testing';

import { ObjectResolverService } from './object-resolver.service';

describe('ObjectResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectResolverService = TestBed.get(ObjectResolverService);
    expect(service).toBeTruthy();
  });
});

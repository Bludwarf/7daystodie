import { TestBed } from '@angular/core/testing';

import { RecipeResolverService } from './recipe-resolver.service';

describe('RecipeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipeResolverService = TestBed.get(RecipeResolverService);
    expect(service).toBeTruthy();
  });
});

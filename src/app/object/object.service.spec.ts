import { TestBed } from '@angular/core/testing';

import { ObjectService } from './object.service';
import {LinkedElementNotSedError} from '../item/passive-effect';

describe('ObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectService = TestBed.get(ObjectService);
    expect(service).toBeTruthy();
  });

  it('should get gunPistol like wiki', () => {
    const objects: ObjectService = TestBed.get(ObjectService);
    const object = objects.get('gunPistol');
    expect(object).toBeDefined();
    expect(object.item).toBeDefined();
    expect(object.recipe).toBeDefined();
  });
});

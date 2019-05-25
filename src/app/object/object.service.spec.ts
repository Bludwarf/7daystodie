import {TestBed} from '@angular/core/testing';

import {ObjectService} from './object.service';

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

  it('should get customIcons', () => {
    const objects: ObjectService = TestBed.get(ObjectService);
    expect(objects.get('gunPistol').customIcon).toBeFalsy();
    expect(objects.get('modShotgunSawedOffBarrel').customIcon).toBeFalsy();
    expect(objects.get('ammo44MagnumBulletSteel').customIcon).toEqual('ammo44MagnumBullet');
    expect(objects.get('modGunButtkick3000').customIcon).toEqual('gothBootsBlack');
  });
});

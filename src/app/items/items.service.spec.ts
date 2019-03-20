import { TestBed } from '@angular/core/testing';
import {ItemsService} from './items.service';

const ITEMS_COUNT = 579; // TODO 676 !!!

describe('ItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({ }));

  it('should be created', () => {
    const service: ItemsService = TestBed.get(ItemsService);
    expect(service).toBeTruthy();
  });

  it('should get gunPistol', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('gunPistol');
    expect(item).toBeDefined();
    expect(item.DamageFalloffRange).toEqual(18);
  });

  it('should get all', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const all = items.getAll();
    expect(all).toBeDefined();
    expect(all.length).toBe(ITEMS_COUNT);
  });

  it('should not take too long to find gunPistol and get DamageFalloffRange', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const startTime = new Date();

    const loops = 1e3;
    for (let i = 0; i < loops; ++i) {
      const item = items.get('gunPistol');
      expect(item).toBeDefined();
      expect(item.name).toEqual('gunPistol');
      expect(item.DamageFalloffRange).toEqual(18);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`Get gunPistol.DamageFalloffRange ${loops} times took ${duration} ms`);
    expect(duration).toBeLessThanOrEqual(30 /* ms */);
  });

  it('should not take too long to get all items', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const startTime = new Date();

    const loops = 1e3;
    for (let i = 0; i < loops; ++i) {
      const allItems = items.getAll();
      expect(allItems).toBeDefined();
      expect(allItems.length).toEqual(ITEMS_COUNT);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`Get all items ${loops} times took ${duration} ms`);
    expect(duration).toBeLessThanOrEqual(30 /* ms */);
  });

  it('should get Pistol with 9 mm entity damage', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('gunPistol');
    const ammo = items.get('ammo9mmBullet');
    expect(item.getEntityDamage(ammo)).toBe(32); /* 32 + 0 */
  });

  it('should get SMG-5 with 9 mm entity damage', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('gunSMG5');
    const ammo = items.get('ammo9mmBullet');
    expect(item.getEntityDamage(ammo)).toBe(26); /* 32 - 6 */
  });
});

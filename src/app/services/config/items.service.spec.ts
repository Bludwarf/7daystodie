import { TestBed } from '@angular/core/testing';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

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

  it('should not take too long to find gunPistol and get DamageFalloffRange', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const startTime = new Date();

    const loops = 1e3;
    for (let i = 0; i < loops; ++i) {
      const item = items.get('gunPistol');
      expect(item).toBeDefined();
      expect(item.DamageFalloffRange).toEqual(18);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(`Get gunPistol.DamageFalloffRange ${loops} times took ${duration} ms`);
    expect(duration).toBeLessThanOrEqual(30 /* ms */);
  });
});

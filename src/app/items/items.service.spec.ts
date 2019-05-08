import {TestBed} from '@angular/core/testing';
import {ItemsService} from './items.service';
import {RecipesService} from '../recipes/recipes.service';
import {LinkedElementNotSedError} from '../item/passive-effect';

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
    expect(item.Groups).toEqual(['Ammo/Weapons']);
    expect(() => item.EntityDamage).toThrow(new LinkedElementNotSedError('Cannot get value with "perc_add" operation'));
    expect(() => item.BlockDamage).toThrow(new LinkedElementNotSedError('Cannot get value with "perc_add" operation'));
    expect(item.DamageFalloffRange).toEqual(18);
    expect(item.MaxRange).toEqual(50);
    expect(item.RoundsPerMinute).toEqual(180);
    expect(item.recoil).toEqual(8);
    expect(item.handling).toEqual(0.95);
    expect(item.reloadTime).toEqual(2);

    // Assertions sur un exemple de munitions
    const magazineItem = items.get(item.MagazineItemNames[0]);
    expect(magazineItem).toBeDefined();
    expect(magazineItem.name).toEqual('ammo9mmBullet');
    expect(item.getEntityDamage(magazineItem)).toEqual(32);
    expect(item.getBlockDamage(magazineItem)).toEqual(7);
  });

  it('should get correct reload times based from wiki (comments from items.xml)', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    expect(items.get('meleeToolAuger').reloadTime).toEqual(4.1);
    expect(items.get('gunPistol').reloadTime).toEqual(2);              // 15 * 1   -> 2s
    expect(items.get('gun44Magnum').reloadTime).toEqual(4);
    expect(items.get('gunSMG5').reloadTime).toEqual(4.1);
    expect(items.get('gunBlunderbuss').reloadTime).toEqual(3.9);
    expect(items.get('gunPumpShotgun').reloadTime).toEqual(2.6);
    expect(items.get('gunHuntingRifle').reloadTime).toEqual(2.66);
    expect(items.get('gunMR10').reloadTime).toEqual(2.5);
    expect(items.get('gunAK47').reloadTime).toEqual(3.8);           // 30 * 0.5 -> 3.8s
    expect(items.get('gunRocketLauncher').reloadTime).toEqual(2.7); //  1 * 0.7 -> 2.7s
    expect(items.get('gunWoodenBow').reloadTime).toEqual(0.9);      //  1 * 0.9 -> ?
    expect(items.get('gunCompoundBow').reloadTime).toEqual(2);      //  1 * 0.9 -> ?
    expect(items.get('gunCrossbow').reloadTime).toEqual(3.4);       //  1 * 0.5 -> 3.4s
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
    expect(duration).toBeLessThanOrEqual(60 /* ms */);
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
    expect(duration).toBeLessThanOrEqual(70 /* ms */);
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

  it('should get required items for some items', () => {
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('drinkJarBeer');
    expect(item).toBeDefined();
    const requiredItem = items.get('beerSchematic');
    expect(requiredItem).toBeDefined();
    expect(items.getRequiredItem(item)).toBe(requiredItem);
  });
});

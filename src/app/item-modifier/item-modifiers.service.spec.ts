import { TestBed } from '@angular/core/testing';

import { ItemModifiersService } from './item-modifiers.service';
import {ItemsService} from '../items/items.service';

describe('ItemModifiersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemModifiersService = TestBed.get(ItemModifiersService);
    expect(service).toBeTruthy();
  });

  it('should get modGunSoundSuppressorSilencer', () => {
    const service: ItemModifiersService = TestBed.get(ItemModifiersService);
    const mod = service.get('modGunSoundSuppressorSilencer');
    expect(mod).toBeTruthy();
    expect(mod.installableTags).toEqual(['gun']);

    // Test avec un item compatible
    const items: ItemsService = TestBed.get(ItemsService);
    const pistol = items.get('gunPistol');
    expect(mod.isInstallableOn(pistol)).toBeTruthy();

    // Test avec un item non compatible (tags absents)
    const club = items.get('meleeClubWood');
    expect(mod.isInstallableOn(club)).toBeFalsy();

    // Test avec un item non compatible (explicitement interdit)
    const magnum = items.get('gun44Magnum');
    expect(mod.isInstallableOn(magnum)).toBeFalsy();
  });

  it('should get all pistol mods', () => {
    const service: ItemModifiersService = TestBed.get(ItemModifiersService);
    const items: ItemsService = TestBed.get(ItemsService);
    const pistol = items.get('gunPistol');
    const mods = service.getAllModsInstallableOn(pistol);
    expect(mods).toContain(service.get('modGunSoundSuppressorSilencer'));
  });
});

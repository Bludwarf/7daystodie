import { TestBed } from '@angular/core/testing';

import { ItemModifiersService } from './item-modifiers.service';

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
  });
});

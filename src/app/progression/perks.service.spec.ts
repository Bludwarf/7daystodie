import { TestBed } from '@angular/core/testing';

import { PerksService } from './perks.service';

describe('PerksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerksService = TestBed.get(PerksService);
    expect(service).toBeTruthy();
  });

  it('should get perkMasterChef RecipeTagUnlocked level 3', () => {
    const service: PerksService = TestBed.get(PerksService);
    const perk = service.get('perkMasterChef');
    expect(perk.levels.length).toBe(5);

    const perkLevel = perk.levels[2];
    expect(perkLevel.level).toBe(3);
    expect(perkLevel.recipeTagUnlocked).toContain('foodShamChowder');
  });

  it('should get Sham Chowder required skill', () => {
    const service: PerksService = TestBed.get(PerksService);
    const perkLevel = service.getRequiredPerkLevelForRecipe('foodShamChowder');
    expect(perkLevel.name).toEqual('perkMasterChef');
    expect(perkLevel.level).toEqual(3);
  });
});

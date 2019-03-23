import {TestBed} from '@angular/core/testing';
import {RecipesService} from './recipes.service';

describe('RecipesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipesService = TestBed.get(RecipesService);
    expect(service).toBeTruthy();
  });

  it('should get items from motorcycle recipe', () => {
    const service: RecipesService = TestBed.get(RecipesService);
    const recipe = service.get('vehicleMotorcyclePlaceable');

    const ingredients = recipe.ingredients;
    expect(ingredients.length).toBe(5);

    expect(ingredients[0].name).toBe('vehicleWheels');
    expect(ingredients[0].count).toBe(2);

    expect(ingredients[4].name).toBe('carBattery');
    expect(ingredients[4].count).toBe(1);
  });

  it('should get items with duplicate name', () => {
    const service: RecipesService = TestBed.get(RecipesService);
    const recipe1 = service.get('resourceGunPowder');
    expect(recipe1.name).toBe('resourceGunPowder');
    expect(recipe1.craftArea).toBe('chemistryStation');
    const recipe2 = recipe1.siblings[0];
    expect(recipe2).toBeDefined();
    expect(recipe2.name).toBe('resourceGunPowder');
    expect(recipe2.craftArea).toBe(undefined);
  });
});

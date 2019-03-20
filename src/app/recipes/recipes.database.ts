import {DynamicDatabase} from '../common/dynamic-flat-tree';
import {Injectable} from '@angular/core';
import {Item, ItemsService} from '../services/config/items.service';
import {Recipe, RecipesService} from './recipes.service';
import {LocalizationService} from '../services/config/localization.service';

@Injectable()
export class RecipesDatabase extends DynamicDatabase<RecipeItem> {

  constructor(private recipes: RecipesService, private items: ItemsService, private localization: LocalizationService) {
    super();
  }

  async getChildren(item: RecipeItem): Promise<RecipeItem[] | undefined> {
    const recipe = this.recipes.get(item.item.name);
    if (!recipe || !recipe.ingredients) {
      return undefined;
    }
    return recipe.ingredients.map(ingredient => {
      const ingredientRecipe = this.recipes.get(ingredient.name);
      const ingredientItem = this.items.get(ingredient.name);
      return new RecipeItem(ingredientRecipe, ingredient.count * item.count, ingredientItem);
    });
  }

  getRootLevelItems(): RecipeItem[] {
    const items = this.items
      .getAll(item => !!this.recipes.get(item.name))
      .map(item => {
        const recipe = this.recipes.get(item.name);
        return new RecipeItem(recipe, 1, item)
      });
    items.sort((itemA, itemB) => itemA.item.compareTo(itemB.item, this.localization.translate));
    return items;
  }

  async hasChildren(item: RecipeItem): Promise<boolean> {
    return !!this.recipes.get(item.item.name);
  }
}

export class RecipeItem {
  constructor(public recipe: Recipe, public count: number, public item: Item) { }
}
import {DynamicDatabase} from '../common/dynamic-flat-tree';
import {Injectable} from '@angular/core';
import {Item, ItemsService} from '../services/config/items.service';
import {RecipesService} from '../services/config/recipes.service';
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
      const ingredientItem = this.items.get(ingredient.name);
      return new RecipeItem(ingredientItem, ingredient.count * item.count);
    });
  }

  getRootLevelItems(): RecipeItem[] {
    const items = this.items
      .getAll(item => !!this.recipes.get(item.name))
      .map(item => new RecipeItem(item, 1));
    items.sort((itemA, itemB) => itemA.item.compareTo(itemB.item, this.localization.translate));
    return items;
  }

  async hasChildren(item: RecipeItem): Promise<boolean> {
    return !!this.recipes.get(item.item.name);
  }
}

export class RecipeItem {
  constructor(public item: Item, public count: number) { }
}

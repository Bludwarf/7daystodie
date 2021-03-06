import {DynamicDatabase} from '../common/dynamic-flat-tree';
import {Injectable} from '@angular/core';
import {Item, ItemsService} from '../items/items.service';
import {Recipe, RecipesService} from './recipes.service';
import {LocalizationService} from '../localization/localization.service';

@Injectable()
export class RecipesDatabase extends DynamicDatabase<RecipeItem> {

  constructor(private recipes: RecipesService, private items: ItemsService, private localization: LocalizationService) {
    super();
  }

  async getChildren(item: RecipeItem): Promise<RecipeItem[] | undefined> {
    const recipe = item.recipe;
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
    let recipeItems = this.recipes
      .getAll(/*recipe => !!this.recipes.get(item.name)*/)
      .map(recipe => {
        const item = this.items.get(recipe.name);
        return new RecipeItem(recipe, 1, item);
      });

    let siblingRecipeItems = [];
    recipeItems.forEach(recipeItem => {
      siblingRecipeItems = siblingRecipeItems
        .concat(recipeItem.recipe.siblings
          .map(sibling => new RecipeItem(sibling, 1, recipeItem.item)));
    });
    recipeItems = recipeItems.concat(siblingRecipeItems);

    recipeItems.sort((itemA, itemB) => itemA.compareTo(itemB, this.localization.translate));
    return recipeItems;
  }

  async hasChildren(item: RecipeItem): Promise<boolean> {
    return !!this.recipes.get(item.item.name);
  }
}

export class RecipeItem {
  constructor(public recipe: Recipe, public count: number, public item: Item) { }

  compareTo(other: RecipeItem, translateFunction: (key: string) => string): number {
    const a = this.recipe || this.item;
    const b = other.recipe || other.item;
    return a.compareTo(b, translateFunction);
  }

  get name(): string {
    // console.log(this, (this.recipe || this.item).name);
    return (this.recipe || this.item).name;
  }
}

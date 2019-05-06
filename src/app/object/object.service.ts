import {Injectable} from '@angular/core';
import {Item, ItemsService} from '../items/items.service';
import {Recipe, RecipesService} from '../recipes/recipes.service';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(private items: ItemsService, private recipes: RecipesService) { }

  get(name: string): SevenDaysObject {
    return new Builder(name)
      .item(this.items)
      .recipe(this.recipes)
      .build();
  }
}

export class SevenDaysObject {
  public item: Item;
  recipe: Recipe;

}

class Builder {

  private builtObject: SevenDaysObject;

  constructor(private name: string) {
  }

  get object(): SevenDaysObject {
    if (!this.builtObject) {
      this.builtObject = new SevenDaysObject();
    }
    return this.builtObject;
  }

  item(items: ItemsService): this {
    const item = items.get(this.name);
    if (item) {
      this.object.item = item;
    }
    return this;
  }

  recipe(recipes: RecipesService): this {
    const recipe = recipes.get(this.name);
    if (recipe) {
      this.object.recipe = recipe;
    }
    return this;
  }

  /**
   * @return the object only if defined somewhere
   */
  build(): SevenDaysObject {
    return this.builtObject;
  }
}

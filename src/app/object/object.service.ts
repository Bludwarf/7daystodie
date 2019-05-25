import {Injectable} from '@angular/core';
import {Item, ItemsService} from '../items/items.service';
import {Recipe, RecipesService} from '../recipes/recipes.service';
import {ItemModifiersService} from '../item-modifier/item-modifiers.service';
import {ItemModifier} from '../item-modifier/item-modifier';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(private items: ItemsService, private recipes: RecipesService, private itemModifiers: ItemModifiersService) { }

  get(name: string): SevenDaysObject {
    const builder = new Builder(name);
    return builder
      .item(this.items)
      .recipe(this.recipes)
      .itemModifier(this.itemModifiers)
      .build();
  }
}

export class SevenDaysObject {
  public item: Item;
  public recipe: Recipe;
  public itemModifier: ItemModifier;

  constructor(public name: string) {
  }
}

class Builder {

  private builtObject: SevenDaysObject;

  constructor(private name: string) {
  }

  get object(): SevenDaysObject {
    if (!this.builtObject) {
      this.builtObject = new SevenDaysObject(this.name);
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

  itemModifier(service: ItemModifiersService): this {
    const element = service.get(this.name);
    if (element) {
      this.object.itemModifier = element;
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

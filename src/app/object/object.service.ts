import {Injectable} from '@angular/core';
import {Item, ItemsService} from '../items/items.service';
import {Recipe, RecipesService} from '../recipes/recipes.service';
import {ItemModifiersService} from '../item-modifier/item-modifiers.service';
import {ItemModifier} from '../item-modifier/item-modifier';
import {XmlService} from '../common/xml.service';
import {BlocksService} from '../block/blocks.service';
import {Block} from '../block/block';
import {ObjectsCache, XmlObject} from '../common/xml-object';
import {XmlTopObject} from '../common/xml-top-object';
import {NamedAndDescribed} from '../common/interfaces';

function uniqueConcats<T>(... arrays: (T[])[]): T[] {
  const uniqueArray: T[] = [];
  arrays.forEach(array => array.forEach(item => {
    if (!uniqueArray.includes(item)) {
      uniqueArray.push(item);
    }
  }));
  return uniqueArray;
}

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  cache = new ObjectsCache<SevenDaysObject>();

  constructor(private blocks: BlocksService,
              private items: ItemsService,
              private itemModifiers: ItemModifiersService,
              private recipes: RecipesService) { }

  get(name: string): SevenDaysObject {
    return this.cache.getOrPut(name, () => {
      const builder = new Builder(name);
      return builder
        .block(this.blocks)
        .item(this.items)
        .itemModifier(this.itemModifiers)
        .recipe(this.recipes)
        .build();
    });
  }

  getAll(): SevenDaysObject[] {
    return this.cache.getOrPutAll(object => object.name, () => {
      // All object names
      const names = uniqueConcats<string>(
        getAllNames<Block>(this.blocks, 'block'),
        getAllNames<Item>(this.items, 'item'),
        getAllNames<ItemModifier>(this.itemModifiers, 'item-modifier'),
        getAllNames<Recipe>(this.recipes, 'recipe')
      );

      return names.map(name => this.get(name));
    });
  }
}

function getAllNames<T extends XmlTopObject>(service: XmlService<T>, objectType: string): string[] {
  const names: string[] = [];
  service.getAll()
    .map(item => item.name)
    .forEach(name => {
      if (!names.includes(name)) {
        names.push(name);
      } else {
        console.warn(`Duplicate key for ${objectType} "${name}"`);
      }
    });
  return names;
}

export class SevenDaysObject implements NamedAndDescribed {
  public block: Block;
  public item: Item;
  public itemModifier: ItemModifier;
  public recipe: Recipe;
  private properties = {};

  constructor(public name: string) {
  }

  get(key: string, skipCache = false): string {
    if (skipCache) {
      const children = [this.block, this.item, this.itemModifier, this.recipe];
      for (const child of children) {
        if (child) {
          if (child[key]) {
            return child[key];
          }
        }
      }
      return undefined;
    }
    if (!(key in this.properties)) {
      this.properties[key] = this.get(key, true);
    }
    return this.properties[key];
  }

  get descriptionKey(): string {
    return this.get('descriptionKey');
  }

  get customIcon(): string {
    return this.get('customIcon');
  }

  get customIconTint(): string {
    return this.get('customIconTint');
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

  block(blocks: BlocksService): this {
    const block = blocks.get(this.name);
    if (block) {
      this.object.block = block;
    }
    return this;
  }

  item(items: ItemsService): this {
    const item = items.get(this.name);
    if (item) {
      this.object.item = item;
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

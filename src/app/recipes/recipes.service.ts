import { Injectable } from '@angular/core';
import xmlFile from 'src/assets/Data/Config/recipes.xml.json';
import {XmlObject, XmlService} from '../services/config/xml.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends XmlService<Recipe> {

  constructor() {
    super(xmlFile.recipes.recipe);
  }

  newElement(xmlElement: any): Recipe {
    return new Recipe(xmlElement);
  }
}

/** learnable tag */
export const TAG_LEARNABLE = 'learnable';

export class Recipe extends XmlObject {

  constructor(xmlElement) {
    super(xmlElement);
  }


  get ingredients(): Ingredient[] {
    const ingredients = this.xmlElement.ingredient;
    if (!ingredients) {
      // TODO wildcard_forge_category
      return undefined;
    }
    return ingredients.map(xmlIngredient => new Ingredient(xmlIngredient));
  }

  /**
   * @see TAG_LEARNABLE
   */
  get tags(): string[] {
    return this.$.tags ? this.$.tags.split(/ *, */) : undefined;
  }

  get isLearnable(): boolean {
    const tags = this.tags;
    return tags ? this.tags.includes(TAG_LEARNABLE) : false;
  }

  get craftArea(): string {
    return this.$.craft_area;
  }

  get craftTool(): string {
    return this.$.craft_tool;
  }

}

export class Ingredient extends XmlObject {

  constructor(xmlElement) {
    super(xmlElement);
  }

  get count(): number {
    return +this.$.count;
  }
}
